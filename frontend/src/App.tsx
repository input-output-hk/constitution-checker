//React Imports
import { useEffect, useState  } from "react";

//Mui imports
import { styled } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";

//Store imports
import { useShallow } from 'zustand/react/shallow';
import useStore from "./store/store";

//local components
import SideDrawerLeft from "./compositions/SideDrawer";
import TableContainer from "./compositions/Table/TableContainer";
import MoreDetailsDrawer from "./compositions/MoreDetailsDrawer";

const Main = styled("main", {
  name: "MuiMain",
  slot: 'Root',
})``;

const Body = styled("div", {
  name: "MuiBody",
  slot: 'Root',
})``;

const ConditionalContainer = styled("div", {
  name: "MuiConditionalContainer",
  slot: 'Root',
})``;

function App() {
  const { initialJsonState, validationResults, fetchJsonInitialState, postParametersProposal, error } = useStore(useShallow(state => ({
    initialJsonState: state.initialJsonState,
    validationResults: state.validationResults,
    fetchJsonInitialState: state.fetchJsonInitialState,
    postParametersProposal: state.postParametersProposal,
    error: state.error,
  })));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      await fetchJsonInitialState();
    };
    initializeApp();
  }, []);

  useEffect(() => {
    if (initialJsonState) {
      postParametersProposal(initialJsonState);
      setLoading(false);
    }
  }, [initialJsonState]);

if (loading) {
  return <Body><ConditionalContainer><CircularProgress /></ConditionalContainer></Body>; 
}

if (error) {
  return <Body><ConditionalContainer><Typography variant="h4">{error}</Typography></ConditionalContainer></Body>
}

if (!validationResults) {
    return <Body><ConditionalContainer><CircularProgress /></ConditionalContainer></Body>; 
}

  return (
    <Body>
      <Main>
        <SideDrawerLeft />
        <TableContainer />
        <MoreDetailsDrawer />
      </Main>
    </Body>
  );
}

export default App;
