import React, { useState, useEffect, useRef } from 'react';
import '../stylesheets/Game.css';
import icon from '../images/kys.png';
import bomb from '../images/bomb.png';

const ws = new WebSocket('ws://localhost:3000');
const SPRITE_SIZE = 50;

export default function Game() {
    // const [players, setPlayers] = useState({ posX: 10, posY: 10, placedBomb: false })
    const canvasRef = useRef(null)
    const [player, setPlayer] = useState({ type: 'player', x: 0, y: 0, placedBomb: false, onBomb: false });
    const [grid, setGrid] = useState(() => {
        let initialGrid = [...Array(15)].map(e => Array(13).fill(''));

        //fill the spaces with walls
        // randomize grid later
        initialGrid = initialGrid.map((e, i) => {
            return e.map((e2, j) => {
                // if not first row and column and last row/column
                if ((i !== 0 && j !== 0) && i % 2 !== 0 && j % 2 !== 0) {
                    return { type: 'wall'};
                } else if (i === 0 && j === 0) {
                    // do some iteration to get all player positions and place them in the initial grid
                    return { type: 'player', x: 0, y: 0, placedBomb: false, onBomb: false };
                } else {
                    return { type: 'open' };
                } 
            })
        })
        return initialGrid;
    })

    //componentdidmount
    useEffect(() => {
        ws.onopen = () => {
            console.log('Connected');
        }

        let updatedGrid = grid.map(e => e.slice());
        
        //listen to backend for player movement/bomb explosion
        ws.onmessage = (e) => {
            console.log("testing data", JSON.parse(e.data));
            let data = JSON.parse(e.data);

            if (data[0] === 'BOMB TARGETS') {
                // explode in a radius around the target grid element
                data.forEach((e, i) => {
                    if (i !== 0 && e.x >= 0 && e.y >= 0) {
                        switch(updatedGrid[e.x][e.y].type) {
                            case 'open': updatedGrid[e.x][e.y].type = 'fire'; removeFire(e.x, e.y); break;
                            case 'breakable wall': updatedGrid[e.x][e.y].type = 'fire'; removeFire(e.x, e.y); break;
                            case 'bomb': updatedGrid[e.x][e.y].type = 'fire'; removeFire(e.x, e.y); break;
                            default: break;
                        }
                        console.log(updatedGrid[e.x][e.y]);
                    }
                })
                //re render
                setGrid(updatedGrid);
            }
        }

        //set timer for removing the fire after explosion
        const removeFire = (x, y) => setTimeout(() => {
            updatedGrid[x][y].type = 'open';
            console.log('remove fire');
            setGrid(updatedGrid);
            setPlayer({ ...player, placedBomb: false });
            clearTimeout(removeFire);
        }, 1000)

        // when refactoring put ws.onmessage here so its not called everytime
        return () => ws.onclose();
    }, [])

    //need to write custom hook for drawing the grid
    //update on grid state
    useEffect(() => {
        console.log('rendering grid');
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        let updatedGrid = grid.map(e => e.slice());
        //render board
        updatedGrid.forEach((e, i) => {
            e.forEach((e2, j) => {
                switch(e2.type) {
                    case 'wall': {
                        context.fillStyle = 'black';
                        context.fillRect(i * SPRITE_SIZE, j * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
                        break
                    }
                    case 'breakable wall': {
                        context.fillRect(i * SPRITE_SIZE, j * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE)
                        break
                    }
                    case 'fire': {
                        context.fillStyle = 'red'
                        context.fillRect(i * SPRITE_SIZE, j * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE)
                        break
                    }
                    case 'player': renderImage(context, icon, i, j); break;
                    case 'bomb': {
                        if (player.onBomb) {
                            renderImage(context, bomb, i, j); // bomb
                            renderImage(context, icon, i, j); // player
                            setPlayer({...player, type: 'player', onBomb: false});
                            console.log(player);
                        } else {
                            renderImage(context, bomb, i, j);
                        }
                        break;
                    }
                    case 'open': {
                        context.fillStyle = 'lightskyblue';
                        context.fillRect(i * SPRITE_SIZE, j * SPRITE_SIZE, SPRITE_SIZE, SPRITE_SIZE);
                        break;
                    }
                    default: {
                        break
                    }
                }
            })
        })
    }, [grid])

    const movePlayer = (e) => {
        //set state of player based on key
        //check valid move
        let nextMove = {...player}
        switch(e.key) {
            case 'w': { // up
                nextMove = {...nextMove, x: player.x, y: player.y - SPRITE_SIZE}
                if (!validMove(nextMove)) return

                break;
            }
            case 's': { // down
                nextMove = {...nextMove, y: player.y + SPRITE_SIZE}
                if (!validMove(nextMove)) return

                break;
            }
            case 'a': { // left
                nextMove = {...nextMove, x: player.x - SPRITE_SIZE}
                if (!validMove(nextMove)) return

                break;
            }
            case 'd': { // right
                nextMove = {...nextMove, x: player.x + SPRITE_SIZE}
                if (!validMove(nextMove)) return

                break;
            }
            case ' ': { //spacebar
                //plant bomb
                //change grid state to plant bomb
                e.preventDefault()
                if (!player.placedBomb) {
                    nextMove = {...nextMove, type: 'bomb', placedBomb: true, onBomb: true }
                    plantBomb()
                }
                break;
            }
            default: return;
        }
        console.log('PRESSED', e.key)

        let updatedGrid = grid.map(e => e.slice())
        updatedGrid[nextMove.x / 50][nextMove.y / 50] = nextMove
        let target = updatedGrid[player.x / 50][player.y / 50]
        console.log('target', target)
        if (!nextMove.onBomb && !target.onBomb)
            updatedGrid[player.x / 50][player.y / 50].type = 'open'

        setGrid(updatedGrid)
        setPlayer({...nextMove})
        console.log(nextMove)
        console.log(player)
        //send to backend for multiplayer
    }

    const renderImage = (context, source, row, col) => {
        const image = new Image()
        image.src = source
        image.onload = () => {
            context.drawImage(image, 0, 0, 50, 50, row * 50, col * 50, SPRITE_SIZE, SPRITE_SIZE)
        }
    }

    const plantBomb = () => {
        let bomb = { type: 'bomb', x: player.x, y: player.y }
        let updatedGrid = grid.map(e => e.slice())
        updatedGrid[player.x / 50][player.y / 50] = bomb
        setGrid(updatedGrid)

        //send to server
        ws.send(JSON.stringify(bomb))
    }

    const validMove = (nextMove) => {
        // loop through grid and check for open spot and find pos and nextmove
        // if x or y is negative, we can just return false
        if (nextMove.x < 0 || nextMove.y < 0) return false
        if (nextMove.x > 750 || nextMove.y > 650) return false
        
        let row = nextMove.x / 50
        let col = nextMove.y / 50

        // if wall then false 
        // check for bombs too
        if (grid[row][col].type === 'wall' || grid[row][col].type === 'breakable wall' || grid[row][col].type === 'bomb' || grid[row][col].type === 'player') return false

        return true
    }

    return (
        <div className='game-container'>
            <canvas ref={canvasRef} className='game' width={750} height={650} tabIndex={0} onKeyDown={(e) => movePlayer(e)} />
        </div>
    )
}