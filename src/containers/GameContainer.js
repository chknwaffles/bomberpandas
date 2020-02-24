import React, { useState, useEffect, useContext } from 'react'
import { SocketContext } from '../utils/socket-context'
import GameMenu from '../components/GameMenu'
import WaitingRoom from '../components/WaitingRoom'
import EndGame from '../components/EndGame'
import Game from './Game'

export default function GameContainer(props) {
    const { user, changePage, sendMessage } = props
    const [status, setStatus] = useState('')
    const [game, setGame] = useState({ status: 'open' })
    const socket = useContext(SocketContext)
    
    const changeStatus = (newStatus) => setStatus(newStatus)
    const playGame = () => setStatus('local')

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
        })
    }

    const startGame = () => {
        setStatus('ready')
        socket.emit('game-ready', game)
    }

    useEffect(() => {
        socket.on('connect', s => {
            if (status === 'local') {
                // will need to change this to some localgameid variable
            } else {
                // we need to check the gameid for the online rooms
            }
        })
    }, [status])

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
            case 'local': return <Game sendMessage={sendMessage} user={user} changeStatus={changeStatus} online={false} />
            case 'endgame1': return <EndGame condition={'P1  has  won  the  game!'} changeStatus={changeStatus} />
            case 'endgame2': return <EndGame condition={'P2  has  won  the  game!'} changeStatus={changeStatus} />
            default: return <GameMenu 
                                user={user}
                                changeStatus={changeStatus} 
                                changePage={changePage}
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