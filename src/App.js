import React from 'react';
import './stylesheets/App.css';
import GameContainer from './containers/GameContainer'
import Chat from './containers/Chat'

function App() {
  return (
    <div className="App">
      <GameContainer />
      <Chat />
    </div>
  );
}

export default App;
