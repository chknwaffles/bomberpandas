import React, { useState, useEffect } from 'react'
import GameMenu from '../components/GameMenu'
import WaitingRoom from '../components/WaitingRoom'
import EndGame from '../components/EndGame'
import Game from './Game'

export default function GameContainer(props) {
    const { user, changePage, sendMessage, socket } = props
    const [status, setStatus] = useState('')
    const [game, setGame] = useState({ status: 'open' })

    const changeStatus = (newStatus) => setStatus(newStatus)
    
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
            console.log('game data', data)
            sendMessage(JSON.stringify(data))
        })
    }

    const startGame = () => {
        setStatus('ready')
        socket.send(JSON.stringify(game))
    }

    useEffect(() => {
        if (socket !== null) {
            socket.onmessage = (e) => {
                const data = JSON.parse(e.data)
                console.log(data)
                //setStatus('ready')
            }
        }
    }, [socket])

    const playGame = () => {
        setStatus('local')
    }

    const renderByStatus = () => {
        switch(status) {
            case 'online': return <Game
                                    user={user}
                                    sendMessage={sendMessage}  
                                    changeStatus={changeStatus} 
                                    online={true} 
                                    />
            case 'waiting': return <WaitingRoom 
                                        user={user}
                                        game={game}
                                        changeStatus={changeStatus} 
                                        startGame={startGame}
                                    />
            case 'defeat': return <EndGame condition={'You lost the game!'} changeStatus={changeStatus} />
            case 'victory': return <EndGame condition={'You won the game!'} changeStatus={changeStatus} />
            case 'local': return <Game socket={socket} sendMessage={sendMessage}  user={user} changeStatus={changeStatus} online={false} />
            case 'endgame1': return <EndGame condition={'P1  has  won  the  game!'} changeStatus={changeStatus} />
            case 'endgame2': return <EndGame condition={'P2  has  won  the  game!'} changeStatus={changeStatus} />
            default: return <GameMenu 
                                user={user}
                                changeStatus={changeStatus} 
                                changePage={changePage}
                                joinGame={joinGame} 
                                playGame={playGame} 
                            />
        }
    }

    return (
        <React.Fragment> 
            {renderByStatus()} 
        </React.Fragment>
    )
}