import { makeStyles } from '@mui/styles';
import { LoggerProvider } from './contexts/LoggerProvider';
import ViewManager from './views/ViewManager';
import { ViewProvider } from './contexts/ViewProvider';
import { MultiConnectionProvider } from './contexts/MultiConnectionProvider';
import { TabProvider } from './contexts/TabContext';
import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material';
import neutronMuiThemeDefault from './contexts/MuiTheme';
import { AlertProvider } from './contexts/AlertContext';
import { Resizable, ResizeCallbackData } from 'react-resizable';

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

const Toto = () => {
  const [size, setSize] = useState({ width: 200, height: 200 })

  const handleOnResize = (e: any, cb: ResizeCallbackData) => {
    setSize({ width: cb.size.width, height: cb.size.height })
  }

  return (
    <Resizable height={size.height} width={size.width} onResize={handleOnResize} resizeHandles={['se']}>
      <div style={{ border: "1px solid black", width: size.width + 'px', height: size.height + 'px' }}>
        <h1>coucou</h1>
        <span className="text">{"Raw use of <Resizable> element. 200x200, all Resize Handles."}</span>
      </div>
    </Resizable>
  )
}

export default App;
