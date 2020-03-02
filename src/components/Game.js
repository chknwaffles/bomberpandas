import React, { useState, useEffect, useRef, useContext } from 'react'
import ReactDOM from 'react-dom'
import { gridSize, fillGrid, setPlayersPosition, generatePowerUp } from '../utils/Grid'
import { SocketContext } from '../utils/socket-context'
import usePrevious from '../utils/usePrevious'
import StatusBar from './StatusBar'
import './Game.css'
import panda from '../images/panda.png'
import bomb from '../images/bombicon.png'
import skull from '../images/skull.png'
import breakablewall from '../images/breakablewall.png'
import wall from '../images/wall.png'
import fire from '../images/fire.png'
import bombPower from '../images/bombpowerup.png'
import firePower from '../images/firepowerup.png'

const SPRITE_SIZE = 50
let keys = []

export default function Game(props) {
    const { gameId, user, changeStatus, online } = props
    const canvasRef = useRef(null)
    const socket = useContext(SocketContext)
    const [players, setPlayers] = useState(() => {
        let players = (online) ? 
            [ {}, {}, {}, {} ] : 
            [
                { type: 'P', id: 1, x: 0, y: 0, onBomb: false, powerups: { bombs: 1, fire: 1 } },
                { type: 'P', id: 2, x: 0, y: 0, onBomb: false, powerups: { bombs: 1, fire: 1 } }
            ]

        return setPlayersPosition(players, online)
    })
    const [grid, setGrid] = useState(() => {
        let initialGrid = [...Array(gridSize)].map(e => Array(gridSize).fill(''))

        initialGrid = fillGrid(initialGrid, players)
        return initialGrid
    })

    const previousGrid = usePrevious(grid)

    //useffect on socket
    useEffect(() => {
        var removeFire;
        socket.on('bombmsg', bomb => {
            let type = bomb.shift()
            let playerIndex = bomb.shift()
            if (type === 'BOMB TARGETS') {
                setGrid(grid => grid.map(row => row.map(colE => {
                    let res = bomb.find(e => e.x === colE.x && e.y === colE.y)
                    if (res !== undefined ) {
                        if (colE.type === 'O' ||  colE.type === 'F' || colE.type === 'B') {
                            return { ...colE, type: 'F' }
                        } else if (colE.type === 'BW') {
                            return { ...colE, type: 'BF' }
                        }
                        return colE
                    } else {
                        return colE
                    }
                })))
                
                removeFire = () => setTimeout(() => {
                    ReactDOM.unstable_batchedUpdates(() => {
                        setGrid(grid => grid.map(row => row.map(colE => {
                            let res = bomb.find(e => e.x === colE.x && e.y === colE.y)
    
                            if (res !== undefined) {
                                if (colE.type === 'P') {
                                    // check death
                                    return { ...colE, type: 'D' }
                                } else if (colE.type === 'BF') {
                                        let obj = generatePowerUp(colE.x, colE.y)
                                        return obj
                                } else if (colE.type === 'F') 
                                    return { ...colE, type: 'O' }
                            }
                            return colE
                        })))
                        
                        setPlayers(players => {
                            for(let i = 0; i < players.length; i++) {
                                if (players[i].id === +playerIndex) {
                                    players[i] = { ...players[i], powerups: { ...players[i].powerups, bombs: players[i].powerups.bombs + 1 }} 
                                }
                            }
                            return players
                        })
                    })

                    clearTimeout(removeFire)
                }, 300)

                removeFire()
            }
        })

        return () => {
            socket.off('bombmsg')
            clearTimeout(removeFire)
        }
    }, [socket])

    useEffect(() => {
        let flag = false
        const renderImage = (context, source, row, col, player=false) => {
            let targetPlayer = players.find(player => player.x === row && player.y === col)
            const image = new Image()
            image.onload = () => {
                context.drawImage(image, row * 50, col * 50)
                if (player) {
                    context.font = '16px ArcadeClassic'
                    context.fillStyle = 'red'
                    context.fillText(`P${targetPlayer.id}`, row * 50, col * 50 + 40)
                }
            }
            image.src = source
        }

        canvasRef.current.focus()
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        let updatedGrid = grid.map(e => e.slice())

        updatedGrid.forEach((row, i) => {
            row.forEach((colE, j) => {
                    //don't re-render if previous was the same as current
                if (previousGrid[i][j].type === updatedGrid[i][j].type && flag)
                    return
                    
                switch(colE.type) {
                    case 'W': renderImage(context, wall, colE.x, colE.y); break;
                    case 'BW': renderImage(context, breakablewall, colE.x, colE.y); break;
                    case 'F': renderImage(context, fire, colE.x, colE.y); break;
                    case 'BF': renderImage(context, fire, colE.x, colE.y); break;
                    case 'B': {
                        renderImage(context, bomb, colE.x, colE.y); break;
                    }
                    case 'D': {
                        renderImage(context, skull, colE.x, colE.y)
                        if (!online) {
                            let targetPlayer = players.find(player => player.x === colE.x && player.y === colE.y)
                            setTimeout(() => changeStatus(prevStatus => (prevStatus = (targetPlayer.id === 1) ? 'endgame2' : 'endgame1')), 4000)
                            break
                        }
                        //disable key functions for the player that died

                        setTimeout(() => changeStatus(prevStatus => prevStatus = 'defeat'), 6000)
                        break
                    }
                    case 'P': {
                        renderImage(context, panda, colE.x, colE.y, true); break; }
                    case 'BP': {
                        renderImage(context, bombPower, colE.x, colE.y)
                        break
                    }
                    case 'FP': {
                        context.clearRect(colE.x, colE.y, 0, 0)
                        renderImage(context, firePower, colE.x, colE.y)
                        break
                    }
                    default: { // type: 'O'
                        context.fillStyle = 'gray'
                        context.fillRect(colE.x * SPRITE_SIZE, colE.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE)
                        break
                    }
                }
            })
        })

        if (!flag) 
            flag = true

    }, [grid, previousGrid, players, online, changeStatus])

    const movePlayer = () => {
        let player = players[0]
        
        let prevMove, nextMove, valid = {}

        prevMove = { ...player }
        nextMove = { ...player, onBomb: false }

        let updatedGrid = grid.map(e => e.slice())
        previousGrid.current = updatedGrid 

        if (keys['w']) {
            nextMove = { ...nextMove, y: nextMove.y - 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['w'] = false
                return
            }

            nextMove = itemCheck(valid.type, nextMove)
        }
        if (keys['s']) {
            nextMove = { ...nextMove, y: nextMove.y + 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['s'] = false
                return
            }

            nextMove = itemCheck(valid.type, nextMove)
        }
        if (keys['a']) {
            nextMove = { ...nextMove, x: nextMove.x - 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['a'] = false
                return
            }
            
            nextMove = itemCheck(valid.type, nextMove)
        }
        if (keys['d']) {
            nextMove = { ...nextMove, x: nextMove.x + 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['d'] = false
                return
            } 
            
            nextMove = itemCheck(valid.type, nextMove)
        }
        if (keys[' ']) {
            if (nextMove.powerups.bombs > 0) {
                nextMove = { ...nextMove, type: 'P', onBomb: true, powerups: { ...nextMove.powerups, bombs: nextMove.powerups.bombs - 1 } }

                let bomb = { type: 'B', id: 1, x: nextMove.x, y: nextMove.y, powerups: { ...nextMove.powerups } }
                socket.emit('sendlocal', bomb)
            }
        }

        // if player was on the bomb before then let's persist that bomb else it's an open space
        // if next move was planting bomb, we gotta render that bomb
        updatedGrid[prevMove.x][prevMove.y].type = (prevMove.onBomb) ? 'B' : 'O'
        updatedGrid[nextMove.x][nextMove.y] = (nextMove.onBomb) ? { ...nextMove, type: 'B' } : nextMove

        if (online) {
            setPlayers([nextMove])
            //send to backend for online
            socket.send(JSON.stringify(updatedGrid))
        } else {
            setPlayers(players => [nextMove, players[1]])
        }
        setGrid(updatedGrid)
    }

    const movePlayer2 = () => {
        let player = players[1]
        let prevMove, nextMove, valid = {}
        prevMove = { ...player }
        nextMove = { ...player, onBomb: false }

        let updatedGrid = grid.map(e => e.slice())
        if (previousGrid != null) {
            previousGrid.current = updatedGrid
        }

        if (keys['ArrowUp']) {
            nextMove = { ...nextMove, y: nextMove.y - 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['ArrowUp'] = false
                return
            } 

            nextMove = itemCheck(valid.type, nextMove)
        } 
        if (keys['ArrowDown']) {
            nextMove = { ...nextMove, y: nextMove.y + 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['ArrowDown'] = false
                return
            } 

            nextMove = itemCheck(valid.type, nextMove)
        }
        if (keys['ArrowLeft']) {
            nextMove = { ...nextMove, x: nextMove.x - 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['ArrowLeft'] = false
                return
            }

            nextMove = itemCheck(valid.type, nextMove)
        }
        if (keys['ArrowRight']) {
            nextMove = { ...nextMove, x: nextMove.x + 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['ArrowRight'] = false
                return
            }

            nextMove = itemCheck(valid.type, nextMove)
        }
        if (keys['Shift']) {
            if (nextMove.powerups.bombs > 0) {
                nextMove = { ...nextMove, type: 'P', onBomb: true, powerups: { ...nextMove.powerups, bombs: nextMove.powerups.bombs-- }}

                let bomb = { id: 2, type: 'B', x: nextMove.x, y: nextMove.y, powerups: { ...nextMove.powerups }}
                socket.emit('sendlocal', bomb)
            }
        }

        updatedGrid[prevMove.x][prevMove.y].type = (prevMove.onBomb) ? 'B' : 'O'
        updatedGrid[nextMove.x][nextMove.y] = (nextMove.onBomb) ? {...nextMove, type: 'B'} : nextMove

        setPlayers(players => [players[0], nextMove])
        setGrid(updatedGrid)
    }

    const validMove = (nextMove) => {
        const row = nextMove.x
        const col = nextMove.y

        // if x or y is negative, we can just return false
        // if wall then false, check for bombs too
        if (row < 0 || col < 0 || row > grid.length - 1|| col > grid[0].length - 1) return { status: false }
        if (grid[row][col].type === 'W' || grid[row][col].type === 'BW' || grid[row][col].type === 'B' || grid[row][col].type === 'P') return { status: false }
        if (grid[row][col].type === 'BP') return { status: true, type: 'bombs' }
        if (grid[row][col].type === 'FP') return { status: true, type: 'fire' }

        return { status: true }
    }

    const itemCheck = (type, nextMove) => {
        if (type === 'bombs') {
            return { ...nextMove, powerups: { ...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
        } else if (type === 'fire') {
            return { ...nextMove, powerups: { ...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
        }
        return nextMove
    }

    const handleDownKey = (e) => {
        e.preventDefault()
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Shift') {
            keys[e.key] = true
            movePlayer2()
        }
        if (e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd' || e.key === ' ') {
            keys[e.key] = true
            movePlayer()
        }
    }

    const handleUpKey = (e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Shift' 
            || e.key === 'w' || e.key === 's' || e.key === 'a' || e.key === 'd' || e.key === ' ') {
                e.preventDefault()
                keys[e.key] = false
        }
    }

    return (
        <React.Fragment>
            <div className='game-container'>
                <canvas ref={canvasRef} className='game' width={650} height={650} tabIndex={0} onKeyDown={(e) => handleDownKey(e)} onKeyUp={(e) => handleUpKey(e)} />
            </div>
            <div className='statusbar-container'>
                <StatusBar player={players[0]} />
                <StatusBar player={players[1]} />
            </div>
            {/* <Chat socket={socket} user={user} /> */}
        </React.Fragment>
    )
}