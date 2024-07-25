import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import NavTabs from "./NavTabs";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import { Box } from "@mui/material";
import CommonButton from "./CommonButton";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import SearchBar from "./SearchBar";
import ParameterView from "./ParameterView";
import GuardrailView from "./GuardrailView";
import useStore from "../store";

import {
  mapCurrentJsonStateToExportParams
} from "../utils/mapper";

export default function BasicTable() {
  const { currentTab, currentJsonState, validationResults, changeSelectedTab } = useStore(state => ({
    currentTab: state.currentTab,
    currentJsonState: state.currentJsonState,
    validationResults: state.validationResults,
    changeSelectedTab: state.changeSelectedTab,
  }));

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    changeSelectedTab(newValue);
  };

  const handleParamExport = () => {
    if (currentJsonState) {
      const data = JSON.stringify(mapCurrentJsonStateToExportParams(currentJsonState), null, 2); 
      downloadJSON(data);
    }
  };

  const handleGuardrailExport = () => {
    if (currentJsonState) {
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
    <Box className="tableContainerBox">
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
      <Box className='tableBox'>
        {currentTab === 'Proposal Parameters' && <ParameterView />}
        {currentTab === 'Guardrails' && <GuardrailView />}
      </Box>
    </TableContainer>
    </Box>
  );
}
