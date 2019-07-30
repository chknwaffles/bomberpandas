import React, { useState, useEffect } from 'react'
import GameMenu from '../components/GameMenu'
import WaitingRoom from '../components/WaitingRoom'
import StatusBar from '../components/StatusBar'
import EndGame from '../components/EndGame'
import Game from './Game'
import Chat from './Chat'

export default function GameContainer(props) {
    const { user, changePage, socket, setSocket } = props
    const [status, setStatus] = useState('')
    const [game, setGame] = useState({ status: 'open' })

    const changeStatus = (newStatus) => setStatus(newStatus)

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
        if (game.status === 'closed') {
            socket.send(JSON.stringify(game))
            setStatus('ready')
            setSocket(new WebSocket('ws://localhost:4000/game'))
        } else if (game.status === 'waiting') {
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data)
                console.log(data)
            }
        }
    }, [game])

    const statusCondition = () => {
        switch(status) {
            case 'ready': {
                return (
                    <React.Fragment>
                        <StatusBar />
                        <Game socket={socket} user={user} changeStatus={changeStatus} />
                        {/* <Chat socket={socket} user={user} /> */}
                    </React.Fragment>
                )
            }
            case 'waiting': {
                return (
                    <React.Fragment>
                        <WaitingRoom user={user} changeStatus={changeStatus} game={game} />
                        {/* <Chat socket={socket} user={user} /> */}
                    </React.Fragment>
                )
            }
            case 'defeat': {
                return (
                    <EndGame condition={'defeat'} changeStatus={changeStatus} />
                )
            }
            case 'victory': {
                return (
                    <EndGame condition={'victory'} changeStatus={changeStatus} />
                )
            }
            default: return <GameMenu user={user} changeStatus={changeStatus} changePage={changePage} joinGame={joinGame} />
        }
    }

    return (
        <React.Fragment> 
            {statusCondition()} 
        </React.Fragment>
    )
}