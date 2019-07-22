import React, { useState } from 'react';
import './stylesheets/App.css';
import GameContainer from './containers/GameContainer'
import FormContainer from './containers/FormContainer'
import Logo from './components/Logo'

function App() {
    const [user, setUser] = useState('')
    const [page, setPage] = useState('')

    const changePage = (newPage) => setPage(newPage)
    
    const renderPage = () => {
        switch(page) {
            case '': return <GameContainer user={user} changePage={changePage} />
            case 'login': return <FormContainer login={true} changePage={changePage} handleLogin={handleLogin} />
            case 'signup': return <FormContainer login={false} changePage={changePage} handleLogin={handleLogin} />
            case 'profile': break;
            case 'about': break;
            default: break;
        }
    }

    const handleLogin = () => {
        
    }

    return (
        <div className="App">
            <Logo />
            {renderPage()}
        </div>
    );
}

export default App;
