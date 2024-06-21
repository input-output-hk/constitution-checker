import React, { useEffect } from 'react';
import useStore from './store/store';
import SideDrawerLeft from './components/SideDrawer';
import ParameterViewer from './components/ParameterViewer';
import CircularProgress from '@mui/material/CircularProgress';

function App() {
  const { initialJsonState, fetchJsonInitialState, loading } = useStore(state => ({
    initialJsonState: state.initialJsonState,
    fetchJsonInitialState: state.fetchJsonInitialState,
    loading: state.loading
  }));

  useEffect(() => {
    fetchJsonInitialState();
}, [fetchJsonInitialState]);

if (loading && !initialJsonState) {
    return <div className='loadingContainer'><CircularProgress /></div>; 
}

  return (
    <main>
      <SideDrawerLeft />
      <ParameterViewer />
    </main>
  );
}

export default App;
