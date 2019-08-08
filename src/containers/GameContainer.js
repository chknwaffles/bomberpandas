import React, { useState, useEffect } from 'react'
import GameMenu from '../components/GameMenu'
import WaitingRoom from '../components/WaitingRoom'
import EndGame from '../components/EndGame'
import Game from './Game'

export default function GameContainer(props) {
    const { user, changePage, socket, setSocket } = props
    const [status, setStatus] = useState('')
    const [game, setGame] = useState({ status: 'open' })

    const changeStatus = (newStatus) => setStatus(newStatus)
    const changeSocket = (newSocket) => setSocket(newSocket)
    //for online functionality TODO
    const joinGame = () => {
        fetch('http://localhost:4000/joingame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user })
        })
        .then(r => r.json())
        .then(data => {
            console.log(data)
            setStatus('waiting')
            setGame(data)
            socket.send(JSON.stringify(data))
        })
    }

    useEffect(() => {
        
    }, [game])

    const playGame = () => {
        setSocket(new WebSocket('ws://localhost:4000/game'))
        setStatus('local')
    }

    const renderByStatus = () => {
        switch(status) {
            case 'online': return <Game socket={socket} user={user} changeStatus={changeStatus} online={true} />
            case 'waiting': return <WaitingRoom user={user} changeStatus={changeStatus} setSocket={setSocket} game={game} socket={socket} />
            case 'defeat': return <EndGame condition={'You lost the game!'} changeStatus={changeStatus} />
            case 'victory': return <EndGame condition={'You won the game!'} changeStatus={changeStatus} />
            case 'local': return <Game socket={socket} user={user} changeStatus={changeStatus} online={false} />
            case 'endgame1': return <EndGame condition={'P1  has  won  the  game!'} changeStatus={changeStatus} />
            case 'endgame2': return <EndGame condition={'P2  has  won  the  game!'} changeStatus={changeStatus} />
            default: return <GameMenu user={user} changeStatus={changeStatus} changePage={changePage} joinGame={joinGame} playGame={playGame} />
        }
    }

    return (
        <React.Fragment> 
            {renderByStatus()} 
        </React.Fragment>
    )
}