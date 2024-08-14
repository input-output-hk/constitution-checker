//Mui imports
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

//Store imports
import { useShallow } from 'zustand/react/shallow';
import useStore from "../../store/store";
import {
  mapCurrentJsonStateToExportParams
} from "../../store/mapper";

//local components
import NavTabs from "../../components/NavTabs";
import CommonButton from "../../components/CommonButton";
import SearchBar from "../../components/SearchBar";
import ParameterView from "./ParameterView";
import GuardrailView from "./GuardrailView";

const TableBox = styled("div", {
  name: "MuiTableBox",
  slot: 'Root',
})``;

const TableBoxContainer = styled("div", {
  name: "MuiTableBoxContainer",
  slot: 'Root',
})``;

export default function BasicTable() {
  const { currentTab, currentJsonState, validationResults } = useStore(useShallow(state => ({
    currentTab: state.currentTab,
    currentJsonState: state.currentJsonState,
    validationResults: state.validationResults
  })));

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    useStore.setState({currentTab: newValue});
  };

  const handleParamExport = () => {
    if (currentJsonState) {
      const data = JSON.stringify(mapCurrentJsonStateToExportParams(currentJsonState), null, 2); 
      downloadJSON(data);
    }
  };

  const handleGuardrailExport = () => {
    if (validationResults) {
      const data = JSON.stringify(validationResults, null, 2); 
      downloadJSON(data);
    }
  };

  function downloadJSON(data: any){
    const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "exported_data.json"; 
      document.body.appendChild(a);
      a.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(a);
  }

  return (
    <TableBoxContainer>
    <TableContainer component={Paper}>
    <AppBar position="static">
    <Toolbar>
        <NavTabs value={currentTab} onChange={handleTabChange} />
    </Toolbar>
    </AppBar>
    <Toolbar className="tableToolbar" variant='dense'>
      {currentTab === 'Proposal Parameters' && <CommonButton text='Export Updated Proposal JSON' variant="outlined" startIcon={<SaveAltIcon />} onClick={handleParamExport} />}
      {currentTab === 'Guardrails' && <CommonButton text='Export Guardrail Results' variant="outlined" startIcon={<SaveAltIcon />} onClick={handleGuardrailExport} />}
        
        <SearchBar/>
      </Toolbar>
      <TableBox>
        {currentTab === 'Proposal Parameters' && <ParameterView />}
        {currentTab === 'Guardrails' && <GuardrailView />}
      </TableBox>
    </TableContainer>
    </TableBoxContainer>
  );
}
