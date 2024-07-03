import * as React from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CommonButton from './CommonButton';
import CircleIcon from '@mui/icons-material/Circle';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import useStore from '../store/store';

interface PHATableRowProps {
  name: string;
  status: string;
  value?: number | string | undefined;
  message?: string | null;
  parameter?: string | null;
}

// Maps custom status values to Material-UI color values
const statusToColor = (status: string): "disabled" | "inherit" | "primary" | "secondary" | "error" | "info" | "success" | "warning" | undefined => {
  switch (status) {
      case "active": return "success"; // passing check
      case "inactive": return "error"; // failing check
      case "pending": return "warning"; // not checked
      default: return "disabled";
  }
}

export default function PHATableRow({name, status="disabled", value, message, parameter}: PHATableRowProps) {
  const { currentTab, toggleMoreDetailsDrawer,changeSelectedRowName } = useStore(state => ({
    currentTab: state.currentTab,
    toggleMoreDetailsDrawer: state.toggleMoreDetailsDrawer,
    changeSelectedRowName: state.changeSelectedRowName
  }));
  const iconColor = statusToColor(status);

  const handleOpenDrawer = () => {
    toggleMoreDetailsDrawer(true);
    changeSelectedRowName(name);
  };

  return (
    <TableRow
    sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
  >
    <TableCell component="th" scope="row">
    <CircleIcon color={iconColor} sx={{width: '12px', height: '12px', verticalAlign: 'middle', marginRight: '8px'}} />
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
