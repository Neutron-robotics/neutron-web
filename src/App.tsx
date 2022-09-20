import { makeStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import { LoggerProvider } from './contexts/LoggerProvider';
import OperationView from './views/OperationView';
import axios from 'axios';
import ConnectionView from './views/ConnectionView';

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

  const ipAddress = '192.168.1.176'
  const port = 8000
  useEffect(() => {
    const refreshProcesses = async () => {
      const res = await axios.get(`http://${ipAddress}:${port}/processes`)
      const d = res.data.dd 
    }
    refreshProcesses()
  }, [ipAddress])

  return (
    <div className={classes.root}>
        <LoggerProvider>
          <ConnectionView />
        </LoggerProvider>
    </div>
  );
}

export default App;
