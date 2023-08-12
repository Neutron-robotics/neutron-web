import { makeStyles } from '@mui/styles';
import { LoggerProvider } from './contexts/LoggerProvider';
import ViewManager from './views/ViewManager';
import { ViewProvider } from './contexts/ViewProvider';
import { MultiConnectionProvider } from './contexts/MultiConnectionProvider';
import { TabProvider } from './contexts/TabContext';
import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material';
import neutronMuiThemeDefault from './contexts/MuiTheme';
import { AlertProvider } from './contexts/AlertContext';
import inputActions from 'hotkeys-inputs-js';
import neutronDefault from './utils/mapping';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginView from './views/LoginView';
import { ProtectedRoute } from './components/controls/ProtectedRoute';

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
        <AuthProvider>
          <TabProvider>
            <ViewProvider>
              <AlertProvider>
                <MultiConnectionProvider>
                  <ThemeProvider theme={neutronMuiThemeDefault}>
                    <Routes>
                      <Route path="/" element={
                        <ProtectedRoute>
                          <ViewManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/login" element={<LoginView />} />
                      {/* <ViewManager /> */}
                    </Routes>
                  </ThemeProvider>
                </MultiConnectionProvider>
              </AlertProvider>
            </ViewProvider>
          </TabProvider>
        </AuthProvider>
      </LoggerProvider>
    </div>
  );
}

export default App;
