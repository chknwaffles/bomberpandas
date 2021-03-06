import React, { useState, useEffect, useContext } from 'react'
import { SocketContext } from '../utils/socket-context'
import GameMenu from './GameMenu'
import WaitingRoom from './WaitingRoom'
import EndGame from './EndGame'
import Game from './Game'

export default function GameContainer(props) {
    const { user, changePage, backendUrl, logOut } = props
    const [status, setStatus] = useState('')
    const [game, setGame] = useState({ status: 'open' })
    const socket = useContext(SocketContext)
    
    const changeStatus = (newStatus) => setStatus(newStatus)
    const playGame = () => { 
        setStatus('local')
        socket.emit('local-game')
    }

    //for online functionality TODO
    const joinGame = () => {
        fetch(`${backendUrl}/joingame`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user })
        })
        .then(r => r.json())
        .then(data => {
            debugger
            setStatus('waiting')
            setGame(data)
        })
    }

    const startGame = () => {
        setStatus('ready')
    }

    useEffect(() => {
        socket.on('readystate', gameData => {
            
        })
    }, [game])

    const renderByStatus = () => {
        switch(status) {
            case 'online': return <Game
                                    user={user} 
                                    changeStatus={changeStatus} 
                                    online={true} 
                                    />
            case 'waiting': return <WaitingRoom 
                                    user={user}
                                    game={game}
                                    changeStatus={changeStatus} 
                                    startGame={startGame}
                                    />
            case 'defeat': return <EndGame 
                                    condition={'You lost the game!'}
                                    changeStatus={changeStatus} 
                                    />
            case 'victory': return <EndGame 
                                    condition={'You won the game!'} 
                                    changeStatus={changeStatus} 
                                    />
            case 'local': return <Game 
                                    user={user} 
                                    changeStatus={changeStatus}
                                    online={false} 
                                />
            case 'endgame1': return <EndGame 
                                        condition={'P1  has  won  the  game!'} 
                                        changeStatus={changeStatus} 
                                    />
            case 'endgame2': return <EndGame 
                                        condition={'P2  has  won  the  game!'} 
                                        changeStatus={changeStatus} 
                                    />
            default: return <GameMenu 
                                user={user}
                                changeStatus={changeStatus} 
                                changePage={changePage}
                                playGame={playGame}
                                joinGame={joinGame}
                                logOut={logOut}
                            />
        }
    }

    return (
        <React.Fragment> 
            {renderByStatus()} 
        </React.Fragment>
    )
}
             