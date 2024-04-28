import { makeStyles } from '@mui/styles';
import { LoggerProvider } from './contexts/LoggerProvider';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import neutronMuiThemeDefault from './contexts/MuiTheme';
import { AlertProvider } from './contexts/AlertContext';
import inputActions from 'hotkeys-inputs-js';
import neutronDefault from './utils/mapping';
import { AuthProvider } from './contexts/AuthContext';
import RouteManager from './views/RouteManager';
import { ConnectionProvider } from './contexts/ConnectionContext';

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

  useEffect(() => {
    inputActions.defineInputActions(neutronDefault)
    return () => {
      inputActions.cleanInputActions()
    }
  }, [])

  return (
    <div className={classes.root}>
      <LoggerProvider>
        <AlertProvider>
          <AuthProvider>
            <ThemeProvider theme={neutronMuiThemeDefault}>
              <RouteManager />
            </ThemeProvider>
          </AuthProvider>
        </AlertProvider>
      </LoggerProvider>
    </div>
  );
}

export default App;
