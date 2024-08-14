//Mui imports
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CircleIcon from "@mui/icons-material/Circle";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

//Store imports
import { useShallow } from 'zustand/react/shallow';
import useStore from "../../store/store";

//local components
import CommonButton from "../../components/CommonButton";

interface PHATableRowProps {
  name: string;
  status: string;
  value?: number | string | undefined;
  parameter?: string | null;
}

// Maps custom status values to Material-UI color values
const statusToColor = (status: string): "disabled" | "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined => {
  switch (status) {
      case "active": return "success"; // passing check
      case "inactive": return "error"; // failing check
      case "notMandatory": return "secondary"; // not checked
      default: return "disabled";
  }
}

export default function PHATableRow({name, status="disabled", value, parameter}: PHATableRowProps) {
  const { currentTab } = useStore(useShallow(state => ({
    currentTab: state.currentTab
  })));
  const iconColor = statusToColor(status);

  const handleOpenDrawer = () => {
    useStore.setState({drawerOpen: true});
    if (parameter) {
      useStore.setState({selectedRowName: [name, parameter]});
    } else {
      useStore.setState({selectedRowName: [name]});
    }
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
      <CircleIcon color={iconColor} className="circleIcon" />
        {name}
      </TableCell>
      {currentTab === 'Proposal Parameters' && <TableCell align="right">{value}</TableCell>}
      {currentTab === 'Guardrails' && <TableCell align="right">{parameter}</TableCell>}
      <TableCell align="right">
        <CommonButton variant='text' text='View More Details' startIcon={<RemoveRedEyeOutlinedIcon/>} onClick={handleOpenDrawer}/>
      </TableCell>
    </TableRow>
  );
}
