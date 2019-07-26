import React, { useState, useEffect } from 'react'
import GameMenu from '../components/GameMenu'
import WaitingRoom from '../components/WaitingRoom'
import StatusBar from '../components/StatusBar'
import EndGame from '../components/EndGame'
import Game from './Game'
import Chat from './Chat'

export default function GameContainer(props) {
    const { user, changePage } = props
    const [status, setStatus] = useState('')
    const [socket, setSocket] = useState()
    const [game, setGame] = useState({ status: 'open' })

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:4000/play')
        setSocket(ws)
        ws.onopen = () => console.log('connected to game')
    }, [])

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
            //send to backend so backend can tell the other user we can start! 
            socket.send(JSON.stringify(data))      
            setGame(data)
        })
    }

    useEffect(() => {
        if (game.status === 'closed') {
            setStatus('ready')
            setSocket(new WebSocket('ws://localhost:4000/game'))
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