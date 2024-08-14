import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import useStore from "./store/store";
import { useShallow } from 'zustand/react/shallow';
import CircularProgress from "@mui/material/CircularProgress";
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

const Loading = styled("div", {
  name: "MuiLoading",
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

  useEffect(() => {
    const initializeApp = async () => {
      await fetchJsonInitialState();
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (initialJsonState) {
      postParametersProposal(initialJsonState);
    }
  }, [initialJsonState]);

if (!validationResults) {
    return <Body><Loading><CircularProgress /></Loading></Body>; 
}

  return (
    <Body>
      <Main>
      {error && (
        <Loading>
          {error}
        </Loading>
      )}
      {!error && (
        <>
          <SideDrawerLeft />
          <TableContainer />
          <MoreDetailsDrawer />
        </>
      )}
    </Main>
  </Body>
  );
}

export default App;
