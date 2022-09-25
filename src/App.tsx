import { makeStyles } from '@mui/styles';
import { LoggerProvider } from './contexts/LoggerProvider';
import OperationView from './views/OperationView';
import ConnectionView from './views/ConnectionView';
import { ConnectionProvider } from './contexts/ConnectionProvider';

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
        <ConnectionProvider>
          <ConnectionView />
        </ConnectionProvider>
      </LoggerProvider>
    </div>
  );
}

export default App;
