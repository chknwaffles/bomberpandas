import React, { useState, useEffect, useRef } from 'react'
import { gridSize, fillGrid, setPlayersPosition, generatePowerUp } from '../utils/Grid'
import StatusBar from '../components/StatusBar'
import '../stylesheets/GameContainer.css'
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
    const { socket, user, changeStatus, online } = props
    const canvasRef = useRef(null)
    const [players, setPlayers] = useState(() => {
        let players = (online) ? 
            [ {}, {}, {}, {} ] : 
            [
                { type: 'P', id: 1, x: 0, y: 0, bombs: 1, onBomb: false, powerups: { bombs: 1, fire: 1 } },
                { type: 'P', id: 2, x: 0, y: 0, bombs: 1, onBomb: false, powerups: { bombs: 1, fire: 1 } }
            ]

        return setPlayersPosition(players, online)
    })
    const [grid, setGrid] = useState(() => {
        let initialGrid = [...Array(gridSize)].map(e => Array(gridSize).fill(''))

        initialGrid = fillGrid(initialGrid, players)
        return initialGrid
    })

    //componentdidmount
    useEffect(() => {
        const ws = socket
        //listen to backend for player movement/bomb explosion
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            let type = data.shift()
            let id = data.shift()
            if (type === 'BOMB TARGETS') {
                // explode in a radius around the target grid element
                // need to stop fire from happening pass the walls
                // check based on row and or col make a flag if we hit a wall then we know not to extend past the wall
                //check from center point
                setGrid(grid => grid.map(row => row.map(colE => {
                    let res = data.find(e => e.x === colE.x && e.y === colE.y)
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

                removeFireTimer(data, id);
            }
        }

        //set timer for removing the fire after explosion
        const removeFireTimer = (data, id) => setTimeout(() => {
            setGrid(grid => grid.map(row => row.map(colE => {
                let res = data.find(e => e.x === colE.x && e.y === colE.y)
                if (res !== undefined) {
                    if (colE.type === 'P') {
                        // check death
                        return { ...colE, type: 'D' }
                    } else if (colE.type !== 'W') {
                        if (colE.type === 'BF') {
                            let obj = generatePowerUp(colE.x, colE.y)
                            return obj
                        }
                        return { ...colE, type: 'O' }
                    }
                }
                return colE
            })))
            //set players bombs
            setPlayers(players => players.map(player => {
                if (player.id === +id) {
                    player.bombs++
                }
                return player
            }))
            clearTimeout(removeFireTimer)
        }, 300)

        //cleanup on componentdidunmount

    }, [])

    //componentdidupdate on grid state
    useEffect(() => {
        canvasRef.current.focus()
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        let updatedGrid = grid.map(e => e.slice())
        //render canvas board
        updatedGrid.forEach(row => {
            row.forEach(colE => {
                switch(colE.type) {
                    case 'W': renderImage(context, wall, colE.x, colE.y); break;
                    case 'BW': renderImage(context, breakablewall, colE.x, colE.y); break;
                    case 'F': renderImage(context, fire, colE.x, colE.y); break;
                    case 'BF': renderImage(context, fire, colE.x, colE.y); break;
                    case 'B': {
                        // context.clearRect(colE.x, colE.y, 0, 0)
                        renderImage(context, bomb, colE.x, colE.y); break;
                    }
                    case 'O': {
                        context.fillStyle = 'gray'
                        context.fillRect(colE.x * SPRITE_SIZE, colE.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE)
                        break
                    }
                    case 'D': {
                        if (!online) {
                            let targetPlayer = players.find(player => player.x === colE.x && player.y === colE.y)
                            changeStatus((targetPlayer.id === 1) ? 'endgame2' : 'endgame1')
                            break
                        }
                        renderImage(context, skull, colE.x, colE.y)
                        changeStatus('defeat')
                        break
                    }
                    case 'P': {
                        // context.clearRect(colE.x, colE.y, 0, 0)
                        renderImage(context, panda, colE.x, colE.y, true); break; }
                    case 'BP': {
                        // context.clearRect(colE.x, colE.y, SPRITE_SIZE, SPRITE_SIZE)
                        renderImage(context, bombPower, colE.x, colE.y)
                        break
                    }
                    case 'FP': {
                        context.clearRect(colE.x, colE.y, 0, 0)
                        renderImage(context, firePower, colE.x, colE.y)
                        break
                    }
                    default: {
                        context.fillStyle = 'gray'
                        context.fillRect(colE.x * SPRITE_SIZE, colE.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE)
                        break
                    }
                }
            })
        })
    }, [grid])

    const movePlayer = () => {
        //set state of player based on key
        //check valid move
        let player = players[0]
        
        let prevMove, nextMove, valid = {}

        prevMove = { ...player }
        nextMove = { ...player, onBomb: false }

        let updatedGrid = grid.map(e => e.slice())

        // check if next move includes a powerup then add it to player
        if (keys['w']) {
            nextMove = { ...nextMove, y: nextMove.y - 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['w'] = false
                return
            }

            if (valid.type === 'bombs') {
                nextMove = { ...nextMove, powerups: { ...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
            } else if (valid.type === 'fire') {
                nextMove = { ...nextMove, powerups: { ...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
            }
        }
        if (keys['s']) {
            nextMove = { ...nextMove, y: nextMove.y + 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['s'] = false
                return
            }

            if (valid.type === 'bombs') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
            } else if (valid.type === 'fire') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
            }
        }
        if (keys['a']) {
            nextMove = { ...nextMove, x: nextMove.x - 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['a'] = false
                return
            }
            
            if (valid.type === 'bombs') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
            } else if (valid.type === 'fire') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
            }
        }
        if (keys['d']) {
            nextMove = { ...nextMove, x: nextMove.x + 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['d'] = false
                return
            } 
            
            if (valid.type === 'bombs') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
            } else if (valid.type === 'fire') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
            }
        }
        if (keys[' ']) {
            if (nextMove.bombs !== 0) {
                nextMove = { ...nextMove, type: 'P', onBomb: true, powerups: { ...nextMove.powerups, bombs: nextMove.bombs - 1 } }
                //send to backend
                let bomb = { type: 'B', x: nextMove.x, y: nextMove.y, powerups: { ...nextMove.powerups }, id: 1 }
                socket.send(JSON.stringify(bomb))
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
            setPlayers([nextMove, players[1]])
        }
        setGrid(updatedGrid)
        console.log('x:', nextMove.x, 'y:', nextMove.y)
    }

    const movePlayer2 = () => {
        let player = players[1]
        console.log(player)
        let prevMove, nextMove, valid = {}
        prevMove = { ...player }
        nextMove = { ...player, onBomb: false }

        let updatedGrid = grid.map(e => e.slice())

        if (keys['ArrowUp']) {
            console.log('in arrowup')
            nextMove = { ...nextMove, y: nextMove.y - 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['ArrowUp'] = false
                return
            } 

            if (valid.type === 'bombs') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
            } else if (valid.type === 'fire') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
            }
        } 
        if (keys['ArrowDown']) {
            nextMove = { ...nextMove, y: nextMove.y + 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['ArrowDown'] = false
                return
            } 

            if (valid.type === 'bombs') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
            } else if (valid.type === 'fire') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
            }

        }
        if (keys['ArrowLeft']) {
            nextMove = { ...nextMove, x: nextMove.x - 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['ArrowLeft'] = false
                return
            }

            if (valid.type === 'bombs') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
            } else if (valid.type === 'fire') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
            }

        }
        if (keys['ArrowRight']) {
            nextMove = { ...nextMove, x: nextMove.x + 1 }
            valid = validMove(nextMove)
            if (!valid.status) {
                keys['ArrowRight'] = false
                return
            }

            if (valid.type === 'bombs') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, bombs: nextMove.powerups.bombs + 1 }}
            }
            else if (valid.type === 'fire') {
                nextMove = { ...nextMove, powerups: {...nextMove.powerups, fire: nextMove.powerups.fire + 1 }}
            }
        }
        if (keys['Shift']) {
            if (nextMove.bombs !== 0) {
                nextMove = { ...nextMove, type: 'P', powerups: { ...nextMove.powerups, bombs: nextMove.powerups.bombs - 1 }, onBomb: true }
                //send to backend
                let bomb = { type: 'B', x: nextMove.x, y: nextMove.y, powerups: { ...nextMove.powerups }, id: 2 }
                socket.send(JSON.stringify(bomb))
            }
        }

        updatedGrid[prevMove.x][prevMove.y].type = (prevMove.onBomb) ? 'B' : 'O'
        updatedGrid[nextMove.x][nextMove.y] = (nextMove.onBomb) ? {...nextMove, type: 'B'} : nextMove
        setPlayers([players[0], nextMove])
        setGrid(updatedGrid)
    }

    const renderImage = (context, source, row, col, player=false) => {
        //find player id from row, col
        let targetPlayer = players.find(player => player.x === row && player.y === col)
        const image = new Image()
        image.onload = () => {
            context.drawImage(image, row * 50, col * 50)
            if (player) {
                context.font = '15px Calibri'
                context.fillStyle = 'blue'
                context.fillText(`P${targetPlayer.id}`, row * 50, col * 50 + 30)
            }
        }
        image.src = source
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
            <StatusBar players={players} />
            {/* <Chat socket={socket} user={user} /> */}
        </React.Fragment>
    )
}