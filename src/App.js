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
            case 'login': return <FormContainer login={true} changePage={changePage} handleForm={handleLogin} />
            case 'signup': return <FormContainer login={false} changePage={changePage} handleForm={handleSignUp} />
            case 'profile': break;
            case 'about': break;
            default: break;
        }
    }

    const handleLogin = (fields) => {
        fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify(fields),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.json())
        .then(data => {
            setUser(data.username)
            setPage('')
        })
        .catch(err => {
            console.error(err)
        })
    }

    const handleSignUp = (fields) => {
        fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify(fields),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(r => r.json())
        .then(data => {
            console.log('sign up successful')
            setUser(data.username)
            setPage('')
        })
    }

    return (
        <div className="App">
            <Logo />
            {renderPage()}
        </div>
    );
}

export default App;
