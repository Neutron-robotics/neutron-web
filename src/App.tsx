import { makeStyles } from '@mui/styles';
import { LoggerProvider } from './contexts/LoggerProvider';
import { ConnectionProvider } from './contexts/ConnectionProvider';
import ViewManager from './views/ViewManager';
import { ViewProvider } from './contexts/ViewProvider';
import { MultiConnectionProvider } from './contexts/MultiConnectionProvider';

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
          <MultiConnectionProvider>
            <ViewManager />
          </MultiConnectionProvider>
        </ViewProvider>
      </LoggerProvider>
    </div>
  );
}

export default App;
