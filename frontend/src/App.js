import React, { useState } from 'react';
import Board from './component/Board';
import ErrorBoundary from './ErrorBoundary';

const App = () => {
  const [userBoard, setUserBoard] = useState([]);
  console.log('App component rendering');

  return (
    <ErrorBoundary>
  
    <div className="App" style={{backgroundColor: '#333', color: 'white', minHeight: '100vh', padding: '20px'}}>
     
      <Board userBoard={userBoard} setUserBoard={setUserBoard} />
    </div>
    </ErrorBoundary>
  );
};

export default App;