import { makeStyles } from '@mui/styles';
import { LoggerProvider } from './contexts/LoggerProvider';
import ViewManager from './views/ViewManager';
import { ViewProvider } from './contexts/ViewProvider';
import { MultiConnectionProvider } from './contexts/MultiConnectionProvider';
import { TabProvider } from './contexts/TabContext';
import React from 'react';
import { ThemeProvider } from '@mui/material';
import neutronMuiThemeDefault from './contexts/MuiTheme';
import { AlertProvider } from './contexts/AlertContext';

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
        <TabProvider>
          <ViewProvider>
            <AlertProvider>
              <MultiConnectionProvider>
                <ThemeProvider theme={neutronMuiThemeDefault}>
                  <ViewManager />
                </ThemeProvider>
              </MultiConnectionProvider>
            </AlertProvider>
          </ViewProvider>
        </TabProvider>
      </LoggerProvider>
    </div>
  );
}

export default App;
