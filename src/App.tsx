import { makeStyles } from '@mui/styles';
import { LoggerProvider } from './contexts/LoggerProvider';
import { ConnectionProvider } from './contexts/ConnectionProvider';
import ViewManager from './views/ViewManager';
import { ViewProvider } from './contexts/ViewProvider';

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
        <ViewProvider>
          <ConnectionProvider>
            <ViewManager />
          </ConnectionProvider>
        </ViewProvider>
      </LoggerProvider>
    </div>
  );
}

export default App;
