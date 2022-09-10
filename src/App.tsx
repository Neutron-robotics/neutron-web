import { makeStyles } from '@mui/styles';
import React from 'react';
import Playground from './components/Playground';
import { LoggerProvider } from './contexts/LoggerProvider';
import OperationView from './views/OperationView';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    minHeight: '100vh',
    position: 'fixed',
  }
}))

function App() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
        <LoggerProvider>
          <OperationView />
        </LoggerProvider>
    </div>
  );
}

export default App;
