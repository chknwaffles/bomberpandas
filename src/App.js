import React from 'react';
import './stylesheets/App.css';
import GameContainer from './containers/GameContainer'
import Chat from './containers/Chat'
import Logo from './components/Logo'

function App() {
    return (
        <div className="App">
            <Logo />
            <GameContainer />
            <Chat />
        </div>
    );
}

export default App;
