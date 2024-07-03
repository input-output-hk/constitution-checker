import React, { useEffect } from 'react';
import useStore from './store/store';
import CircularProgress from '@mui/material/CircularProgress';
import SideDrawerLeft from './components/SideDrawer';
import TableContainer from './components/TableContainer';
import MoreDetailsDrawer from './components/MoreDetailsDrawer';


function App() {
  const { initialJsonState, validationResults, fetchJsonInitialState, postParametersProposal, error } = useStore(state => ({
    initialJsonState: state.initialJsonState,
    validationResults: state.validationResults,
    fetchJsonInitialState: state.fetchJsonInitialState,
    postParametersProposal: state.postParametersProposal,
    error: state.error,
  }));

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
    return <div className='loadingContainer'><CircularProgress /></div>; 
}

  return (
    <main>
    {error && (
      <div className='loadingContainer'>
        {error}
      </div>
    )}
    {!error && (
      <>
        <SideDrawerLeft />
        <TableContainer />
        <MoreDetailsDrawer />
      </>
    )}
  </main>
  );
}

export default App;
