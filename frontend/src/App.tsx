import React, { useEffect } from 'react';
import useStore from './store/store';
import SideDrawerLeft from './components/SideDrawer';
import ParameterViewer from './components/ParameterViewer';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const { initialJsonState, fetchJsonInitialState, loading, error } = useStore(state => ({
    initialJsonState: state.initialJsonState,
    fetchJsonInitialState: state.fetchJsonInitialState,
    loading: state.loading,
    error: state.error,
  }));

  useEffect(() => {
    fetchJsonInitialState();
}, []);

if (loading && !initialJsonState) {
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
        <ParameterViewer />
      </>
    )}
  </main>
  );
}

export default App;
