import React, { useEffect } from 'react';
import ChessboardComponent from './ChessBoard';
import WebSocketInstance from './WebSocketService';

function App() {
  useEffect(() => {
    WebSocketInstance.connect();
  }, []);

  return (
    <div className="App">
      <h1>Chess Game</h1>
      <ChessboardComponent ws={WebSocketInstance} />
    </div>
  );
}

export default App;

