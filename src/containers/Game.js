import React, { useState, useEffect, useRef } from 'react'
import { gridSize, printGrid, fillGrid, setPlayersPosition } from '../utils/Grid'
import StatusBar from '../components/StatusBar'
import '../stylesheets/GameContainer.css'
import icon from '../images/kys.png'
import bomb from '../images/bomb.png'
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
    const [player, setPlayer] = useState(() => {
        return { type: 'P', x: 0, y: 0, bombs: 1, onBomb: false, username: user }
    })
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
                setGrid(grid => grid.map(row => row.map(colE => {
                    let res = data.find(e => e.x === colE.x && e.y === colE.y)
                    if (res !== undefined && (colE.type === 'O' || colE.type === 'BW' || colE.type === 'F' || colE.type === 'B')) {
                        return {...colE, type: 'F'}
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
                        return { ...colE, type: 'O' }
                    }
                }
                return colE
            })))
            //set players bombs
            setPlayers(players => players.map(player => {
                if (player.id === +id) {
                    player.bombs++
                    console.log('player bombs', player.bombs)
                }
                console.log('playerid', player.id)
                console.log('target id', id)
                console.log('player in bomb', player)
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
                    case 'B': renderImage(context, bomb, colE.x, colE.y); break;
                    case 'O': {
                        context.fillStyle = 'lightskyblue'
                        context.fillRect(colE.x * SPRITE_SIZE, colE.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE)
                        break
                    }
                    case 'D': {
                        if (!online) {
                            let targetPlayer = players.find(player => player.x === colE.x && player.y === colE.y)
                            console.log('dead player', targetPlayer)
                            changeStatus('endgame', targetPlayer)
                            break
                        }
                        renderImage(context, skull, colE.x, colE.y)
                        changeStatus('defeat')
                        break
                    }
                    case 'P': renderImage(context, icon, colE.x, colE.y, true); break;
                    case 'BP': renderImage(context, bombPower, colE.x, colE.y); break;
                    case 'FP': renderImage(context, firePower, colE.x, colE.y); break;
                    default: break;
                }
            })
        })
    }, [grid])

    const movePlayer = (key) => {
        //set state of player based on key
        //check valid move
        console.log('in moveplayer!')
        let player1 = players[0]
        let player2 = players[1]
        let prevP1Move, prevP2Move, nextP1Move, nextP2Move, valid = {}

        prevP1Move = { ...player1 }
        nextP1Move = { ...player1, onBomb: false }

        if (!online) {
            prevP2Move = { ...player2 }
            nextP2Move = { ...player2, onBomb: false }
        }

        let updatedGrid = grid.map(e => e.slice())

        // check if next move includes a powerup then add it to player
        if (keys['w']) {
            nextP1Move = { ...nextP1Move, y: nextP1Move.y - 1 }
            valid = validMove(nextP1Move)
            if (!valid.status) return

            if (valid.type === 'bombs') {
                nextP1Move = { ...nextP1Move, powerups: {...nextP1Move.powerups, bombs: nextP1Move.bombs + 1 }}
                console.log('picking up bomb adder')
            }
            else if (valid.type === 'fire') {
                nextP1Move = { ...nextP1Move, powerups: {...nextP1Move.powerups, fire: nextP1Move.fire + 1 }}
                console.log('picking up explosion power')
                console.log(nextP1Move)
            }
        }
        if (keys['s']) {
            nextP1Move = { ...nextP1Move, y: nextP1Move.y + 1 }
            valid = validMove(nextP1Move)
            if (!valid.status) return

            if (valid.type === 'bombs') {
                nextP1Move = { ...nextP1Move, powerups: {...nextP1Move.powerups, bombs: nextP1Move.bombs + 1 }}
                console.log('picking up bomb adder')
            }
            else if (valid.type === 'fire') {
                console.log('??', nextP1Move.fire)
                nextP1Move = { ...nextP1Move, powerups: {...nextP1Move.powerups, fire: nextP1Move.fire + 1 }}
                console.log('picking up explosion power')
                console.log(nextP1Move)
            }
        }
        if (keys['a']) {
            nextP1Move = { ...nextP1Move, x: nextP1Move.x - 1 }
            valid = validMove(nextP1Move)
            if (!valid.status) return
            
            if (valid.type === 'bombs') {
                nextP1Move = { ...nextP1Move, powerups: {...nextP1Move.powerups, bombs: nextP1Move.bombs + 1 }}
                console.log('picking up bomb adder')
            }
            else if (valid.type === 'fire') {
                nextP1Move = { ...nextP1Move, powerups: {...nextP1Move.powerups, fire: nextP1Move.fire + 1 }}
                console.log('picking up explosion power')
                console.log(nextP1Move)
            }
        }
        if (keys['d']) {
            nextP1Move = { ...nextP1Move, x: nextP1Move.x + 1 }
            valid = validMove(nextP1Move)
            if (!valid.status) return
            
            if (valid.type === 'bombs') {
                nextP1Move = { ...nextP1Move, powerups: {...nextP1Move.powerups, bombs: +nextP1Move.bombs + 1 }}
                console.log('picking up bomb adder')
            }
            else if (valid.type === 'fire') {
                nextP1Move = { ...nextP1Move, powerups: {...nextP1Move.powerups, fire: nextP1Move.fire + 1 }}

                console.log('picking up explosion power')
                console.log(nextP1Move)
            }
        } 
        if (keys[' ']) {
            if (nextP1Move.bombs !== 0) {
                nextP1Move = { ...nextP1Move, type: 'P', bombs: nextP1Move.bombs - 1, onBomb: true }
                //send to backend
                let bomb = { type: 'B', x: nextP1Move.x, y: nextP1Move.y, powerups: { ...nextP1Move.powerups }, id: 1 }
                socket.send(JSON.stringify(bomb))
            }
        }

        if (keys['ArrowUp']) {
            console.log('arrowup!')
            nextP2Move = { ...nextP2Move, y: nextP2Move.y - 1 }
            valid = validMove(nextP2Move)
            if (!valid.status) return

            if (valid.type === 'bombs') {
                nextP2Move = { ...nextP2Move, powerups: {...nextP2Move.powerups, bombs: nextP2Move.bombs + 1 }}
                console.log('picking up bomb adder')
            }
            else if (valid.type === 'fire') {
                nextP1Move = { ...nextP2Move, powerups: {...nextP2Move.powerups, fire: nextP2Move.fire + 1 }}
                console.log('picking up explosion power')
                console.log(nextP2Move)
            }

        }
        if (keys['ArrowDown']) {
            nextP2Move = { ...nextP2Move, y: nextP2Move.y + 1 }
            valid = validMove(nextP2Move)
            if (!valid.status) return

            if (valid.type === 'bombs') {
                nextP2Move = { ...nextP2Move, powerups: {...nextP2Move.powerups, bombs: nextP2Move.bombs + 1 }}
                console.log('picking up bomb adder')
            }
            else if (valid.type === 'fire') {
                nextP1Move = { ...nextP2Move, powerups: {...nextP2Move.powerups, fire: nextP2Move.fire + 1 }}
                console.log('picking up explosion power')
                console.log(nextP2Move)
            }

        }
        if (keys['ArrowLeft']) {
            nextP2Move = { ...nextP2Move, x: nextP2Move.x - 1 }
            valid = validMove(nextP2Move)
            if (!valid.status) return

            if (valid.type === 'bombs') {
                nextP2Move = { ...nextP2Move, powerups: {...nextP2Move.powerups, bombs: nextP2Move.bombs + 1 }}
                console.log('picking up bomb adder')
            }
            else if (valid.type === 'fire') {
                nextP1Move = { ...nextP2Move, powerups: {...nextP2Move.powerups, fire: nextP2Move.fire + 1 }}
                console.log('picking up explosion power')
                console.log(nextP2Move)
            }

        }
        if (keys['ArrowRight']) {
            nextP2Move = { ...nextP2Move, x: nextP2Move.x + 1 }
            valid = validMove(nextP2Move)
            if (!valid.status) return

            if (valid.type === 'bombs') {
                nextP2Move = { ...nextP2Move, powerups: {...nextP2Move.powerups, bombs: nextP2Move.bombs + 1 }}
                console.log('picking up bomb adder')
            }
            else if (valid.type === 'fire') {
                nextP1Move = { ...nextP2Move, powerups: {...nextP2Move.powerups, fire: nextP2Move.fire + 1 }}
                console.log('picking up explosion power')
                console.log(nextP2Move)
            }
        }
        if (keys['Shift']) {
            if (nextP2Move.bombs !== 0) {
                nextP2Move = { ...nextP2Move, type: 'P', bombs: nextP2Move.bombs - 1, onBomb: true }
                //send to backend
                let bomb = { type: 'B', x: nextP2Move.x, y: nextP2Move.y, powerups: { ...nextP2Move.powerups }, id: 2 }
                socket.send(JSON.stringify(bomb))
            }
            
        }

        // if player was on the bomb before then let's persist that bomb else it's an open space
        // if next move was planting bomb, we gotta render that bomb
        if (keys[key]) {
            updatedGrid[prevP1Move.x][prevP1Move.y].type = (prevP1Move.onBomb) ? 'B' : 'O'
            updatedGrid[nextP1Move.x][nextP1Move.y] = (nextP1Move.onBomb) ? { ...nextP1Move, type: 'B' } : nextP1Move
            if (online) {
                setPlayers([nextP1Move])
                //send to backend for online
                socket.send(JSON.stringify(updatedGrid))
            } else {
                updatedGrid[prevP2Move.x][prevP2Move.y].type = (prevP2Move.onBomb) ? 'B' : 'O'
                updatedGrid[nextP2Move.x][nextP2Move.y] = (nextP2Move.onBomb) ? {...nextP2Move, type: 'B'} : nextP2Move
    
                setPlayers([nextP1Move, nextP2Move])
            }
            setGrid(updatedGrid)
        }
    }

    const renderImage = (context, source, row, col, player=false) => {
        //find player id from row, col
        let targetPlayer = players.find(player => player.x === row && player.y === col)
        const image = new Image()
        image.onload = () => {
            context.drawImage(image, row * 50, col * 50)
            if (player) {
                context.font = '20px Calibri'
                context.fillStyle = 'black'
                context.fillText(`P${targetPlayer.id}`, row * 50 + 20, col * 50 + 20)
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

    const handleKeyDown = (e) => {
        e.preventDefault()
        keys[e.key] = true
        movePlayer(e.key)
        console.log(e.key, keys[e.key])
    }

    const handleKeyUp = (e) => {
        e.preventDefault()
        keys[e.key] = false
    }

    return (
        <React.Fragment>
            <div className='game-container'>
                <canvas ref={canvasRef} className='game' width={650} height={650} tabIndex={0} onKeyDown={(e) => handleKeyDown(e)} onKeyUp={(e) => handleKeyUp(e)} />
            </div>
            <StatusBar players={players} />
            {/* <Chat socket={socket} user={user} /> */}
        </React.Fragment>
    )
}