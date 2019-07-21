import React, { useState, useEffect, useRef } from 'react';
import '../stylesheets/Game.css';
import icon from '../images/kys.png';
import bomb from '../images/bomb.png';
import skull from '../images/skull.png';

const ws = new WebSocket('ws://localhost:3000');
const SPRITE_SIZE = 50;

export default function Game() {
    // const [players, setPlayers] = useState({ posX: 10, posY: 10, placedBomb: false })
    const canvasRef = useRef(null);
    const [player, setPlayer] = useState({ type: 'P', x: 0, y: 0, placedBomb: false, onBomb: false });
    const [grid, setGrid] = useState(() => {
        let initialGrid = [...Array(13)].map(e => Array(13).fill(''));

        //fill the spaces with walls and randomize grid later
        initialGrid = initialGrid.map((row, i) => {
            return row.map((colE, j) => {
                // if not first row and column and last row/column
                if ((i !== 0 && j !== 0) && i % 2 !== 0 && j % 2 !== 0) {
                    return { type: 'W', x: i, y: j};
                } else if (i === 0 && j === 0) {
                    // do some iteration to get all player positions and place them in the initial grid
                    return { type: 'P', x: i, y: j, placedBomb: false, onBomb: false };
                } else {
                    return { type: 'O', x: i, y: j};
                } 
            })
        })
        return initialGrid;
    })

    //componentdidmount
    useEffect(() => {
        ws.onopen = () => console.log('Connected');

        //listen to backend for player movement/bomb explosion
        ws.onmessage = (e) => {
            console.log("testing data", JSON.parse(e.data));
            let data = JSON.parse(e.data);

            if (data.shift() === 'BOMB TARGETS') {
                // explode in a radius around the target grid element
                setGrid(grid => grid.map(row => row.map(colE => {
                    let res = data.find(e => e.x === colE.x && e.y === colE.y)
                    if (res !== undefined && (colE.type === 'O' || colE.type === 'BW' || colE.type === 'F' || colE.type === 'B')) {
                        return {...colE, type: 'F'}
                    } else {
                        return colE
                    }
                })))

                removeFireTimer(data);
            }
        }

        //set timer for removing the fire after explosion
        const removeFireTimer = (data) => setTimeout(() => {
            setGrid(grid => grid.map(row => row.map(colE => {
                let res = data.find(e => e.x === colE.x && e.y === colE.y)
                if (res !== undefined) {
                    if (colE.type !== 'W')
                        return {...colE, type: 'O'}
                    else if (colE.type === 'P')
                        return {...colE, type: 'D'}
                }
                
                return colE
            })))
            setPlayer(p => {
                p.placedBomb = false
                return p
            });
            clearTimeout(removeFireTimer);
        }, 1000)

        //componentdidunmount
        return () => ws.onclose();
    }, [])

    //need to write custom hook for drawing the grid
    //componentdidupdate on grid state
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let updatedGrid = grid.map(e => e.slice());
        console.log(updatedGrid)
        printGrid(updatedGrid);
        //render canvas board
        updatedGrid.forEach(row => {
            row.forEach(colE => {
                switch(colE.type) {
                    case 'W': {
                        context.fillStyle = 'black';
                        context.fillRect(colE.x * SPRITE_SIZE, colE.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
                        break;
                    }
                    case 'BW': {
                        context.fillRect(colE.x * SPRITE_SIZE, colE.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
                        break;
                    }
                    case 'F': {
                        context.fillStyle = 'red';
                        context.fillRect(colE.x * SPRITE_SIZE, colE.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
                        break;
                    }
                    case 'B': {
                        if (colE.onBomb) {
                            setPlayer(p => {
                                p.type = 'P';
                                p.onBomb = false;
                                return p
                            });
                        }
                        
                        renderImage(context, bomb, colE.x, colE.y);
                        break;
                    }
                    case 'O': {
                        context.fillStyle = 'lightskyblue';
                        context.fillRect(colE.x * SPRITE_SIZE, colE.y * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
                        break;
                    }
                    case 'D': renderImage(context, skull, colE.x, colE.y); break;
                    case 'P': renderImage(context, icon, colE.x, colE.y); break;
                    default: break;
                }
            })
        })
    }, [grid])

    const movePlayer = (e) => {
        //set state of player based on key
        //check valid move
        let nextMove = {...player, onBomb: false},
            prevMove = {...player, onBomb: false};

        switch(e.key) {
            case 'ArrowUp': e.preventDefault()
            case 'w': { // up
                nextMove = {...nextMove, x: player.x, y: player.y - 1}
                if (!validMove(nextMove)) return

                break;
            }
            case 'ArrowDown': e.preventDefault()
            case 's': { // down
                nextMove = {...nextMove, y: player.y + 1}
                if (!validMove(nextMove)) return

                break;
            }
            case 'ArrowLeft': e.preventDefault()
            case 'a': { // left
                nextMove = {...nextMove, x: player.x - 1}
                if (!validMove(nextMove)) return

                break;
            }
            case 'ArrowRight': e.preventDefault()
            case 'd': { // right
                nextMove = {...nextMove, x: player.x + 1}
                if (!validMove(nextMove)) return

                break;
            }
            case ' ': { //spacebar
                //plant bomb
                //change grid state to plant bomb
                e.preventDefault()
                if (!player.placedBomb) {
                    nextMove = { ...nextMove, type: 'P', placedBomb: true, onBomb: true };
                    //send to backend
                    let bomb = { type: 'B', x: player.x, y: player.y }
                    ws.send(JSON.stringify(bomb))
                }
                break;
            }
            default: return;
        }

        let updatedGrid = grid.map(e => e.slice());
        updatedGrid[prevMove.x][prevMove.y].type = (prevMove.onBomb) ? 'B' : 'O'
        updatedGrid[nextMove.x][nextMove.y] = (nextMove.onBomb) ? {...nextMove, type: 'B'} : nextMove

        setPlayer(nextMove);
        setGrid(updatedGrid);
        //send to backend for multiplayer
    }

    // just for debugging
    useEffect(() => {
        console.log('player status changed', player)
    }, [player])

    const renderImage = (context, source, row, col) => {
        const image = new Image()
        image.src = source
        image.onload = () => {
            context.drawImage(image, row * 50, col * 50)
        }
    }

    const validMove = (nextMove) => {
        let row = nextMove.x
        let col = nextMove.y
        console.log('rows', row, 'col', col)
        // if x or y is negative, we can just return false
        if (row < 0 || col < 0 || row > grid.length - 1|| col > grid[0].length - 1) return false
        // if wall then false, check for bombs too
        if (grid[row][col].type === 'W' || grid[row][col].type === 'BR' || grid[row][col].type === 'B' || grid[row][col].type === 'P') return false

        return true
    }

    const printGrid = (gridMap) => {
        let result = ''
        gridMap.forEach(row => {
            row.forEach(colE => {
                result += colE.type + '|'
            })
            console.log(result)
            result = ''
        })
        console.log('')
    }

    return (
        <div className='game-container'>
            <canvas ref={canvasRef} className='game' width={650} height={650} tabIndex={0} onKeyDown={(e) => movePlayer(e)} />
        </div>
    )
}