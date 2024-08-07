import React, { useEffect } from 'react';
import ChessboardComponent from './ChessBoard';
import OpeningSelector from './OpeningSelector';

function App() {
  return (
    <div className="App">
      <h1>Chess Game</h1>
      <OpeningSelector/>
      <ChessboardComponent/>
    </div>
  );
}

export default App;

