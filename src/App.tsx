import React from 'react';
import './App.css';
import Playground from './components/Playground';
import { LoggerProvider } from './contexts/LoggerProvider';
import Sandbox from './Sandbox';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <LoggerProvider>
          <Playground />
        </LoggerProvider>
      </header>
    </div>
  );
}

export default App;
