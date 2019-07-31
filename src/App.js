import React, { useState } from 'react';
import './stylesheets/App.css';
import GameContainer from './containers/GameContainer'
import FormContainer from './containers/FormContainer'
import Logo from './components/Logo'

function App() {
    const [user, setUser] = useState('')
    const [page, setPage] = useState('')
    const [socket, setSocket] = useState()

    const changePage = (newPage) => setPage(newPage)
    
    const renderPage = () => {
        switch(page) {
            case '': return <GameContainer user={user} changePage={changePage} socket={socket} setSocket={setSocket} />
            case 'login': return <FormContainer login={true} changePage={changePage} handleForm={handleForm} />
            case 'signup': return <FormContainer login={false} changePage={changePage} handleForm={handleForm} />
            case 'profile': break;
            case 'about': break;
            case 'logout': logOut(); break;
            default: break;
        }
    }

    const handleForm = (fields, login) => {
        let url = (login) ? 'http://localhost:4000/login' : 'http://localhost:4000/register'
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fields),
            credentials: 'same-origin'
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            setUser(data.username)
            setPage('')
            setSocket(new WebSocket('ws://localhost:4000/play'))
        })
        .catch(err => {
            console.error(err)
        })
    }

    const logOut = () => {
        fetch('http://localhost:4000/logout')
        .then(r => r.json())
        .then(data => {
            setUser('')
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
