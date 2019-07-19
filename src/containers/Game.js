import React, { useState, useEffect, useRef } from 'react'
import '../stylesheets/Game.css'
import icon from '../images/kys.png'

//initialize grid with empty strings
let initialGrid = [...Array(15)].map(e => Array(13).fill(''))

//fill the spaces with walls
// randomize grid later
initialGrid = initialGrid.map((e, i) => {
    return e.map((e2, j) => {
        // if not first row and column and last row/column
        if ((i !== 0 && j !== 0) && i % 2 !== 0 && j % 2 !== 0) {
            return 'W'
        } else {
            return ''
        }
    })
})

const ws = new WebSocket('ws://localhost:3000')
const spriteWidth = 50,
        spriteHeight = 50

export default function Game() {
    // const [players, setPlayers] = useState({ posX: 10, posY: 10, placedBomb: false })
    const [player, setPlayer] = useState({x: 0, y: 0, placedBomb: false})
    const [grid, setGrid] = useState(initialGrid)
    const canvasRef = useRef(null)

    //componentdidmount
    useEffect(() => {
        ws.onopen = () => {
            console.log('Connected')
        }

        // when refactoring put ws.onmessage here so its not called everytime
        return () => ws.onclose()
    }, [])

    //need to write custom hook for drawing the grid
    //update on player state
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        let updatedGrid = grid
        
        //listen to backend for player movement/bomb explosion
        ws.onmessage = (e) => {
            console.log("testing data", JSON.parse(e.data))
            let data = JSON.parse(e.data)

            if (data[0] === 'BOMB TARGETS') {
                // explode in a radius around the target grid element
                data.forEach((e, i) => {
                    if (i !== 0 && e.x >= 0 && e.y >= 0) {
                        switch(updatedGrid[e.x][e.y]) {
                            case '': updatedGrid[e.x][e.y] = 'F'; removeFire(e.x, e.y); break
                            case 'BW': updatedGrid[e.x][e.y] = 'F'; removeFire(e.x, e.y); break
                            case 'B': updatedGrid[e.x][e.y] = 'F'; removeFire(e.x, e.y); break
                            default: break
                        }
                        console.log(updatedGrid[e.x][e.y])
                    }
                })

                //re render
                setPlayer({ ...player, placedBomb: false })
                setGrid(updatedGrid)
            }
        }

        //set timer for removing the fire after explosion
        const removeFire = (x, y) => setTimeout(() => {
            updatedGrid[x][y] = ''
            console.log('remove fire')
            setGrid(updatedGrid)
            setPlayer({ ...player, placedBomb: false })
            clearTimeout(removeFire)
        }, 1000)

        //render board
        grid.forEach((e, i) => {
            e.forEach((e2, j) => {
                //render walls
                switch(e2) {
                    case 'W': {
                        context.fillStyle = 'black'
                        break
                    }
                    case 'B': {
                        let source = `${process.env.PUBLIC_URL}/bomb.png`
                        renderImage(context, source, i, j)
                        break
                    }
                    case 'BW': {
                        break
                    }
                    case 'F': {
                        context.fillStyle = 'red'
                        break
                    }
                    default: {
                        context.fillStyle = 'white'
                        break
                    }
                }
                context.fillRect(i * spriteHeight, j * spriteHeight, spriteWidth, spriteHeight)
            })
        })

        // render player
        renderImage(context, icon, player.x, player.y)

    }, [player])

    const movePlayer = (e) => {
        console.log('PRESSED', e.key)
        
        //set state of player based on key
        //check valid move
        let nextMove = player
        switch(e.key) {
            case 'w': { // up
                nextMove = {x: player.x, y: player.y - spriteHeight}
                if (!validMove(nextMove)) return

                break;
            }
            case 's': { // down
                nextMove = {...player, y: player.y + spriteHeight}
                if (!validMove(nextMove)) return

                break;
            }
            case 'a': { // left
                nextMove = {...player, x: player.x - spriteWidth}
                if (!validMove(nextMove)) return

                break;
            }
            case 'd': { // right
                nextMove = {...player, x: player.x + spriteHeight}
                if (!validMove(nextMove)) return

                break;
            }
            case ' ': { //spacebar
                //plant bomb
                //change grid state to plant bomb
                e.preventDefault()
                if (player.placedBomb === false) {
                    nextMove = {...player, placedBomb: true }
                    plantBomb()
                }
                break;
            }
            default: break;
        }
        setPlayer(nextMove)
        //send to backend 
    }

    const renderImage = (context, source, row, col) => {
        const image = new Image()
        image.src = source
        image.onload = () => {
            context.drawImage(image, 0, 0, 50, 50, row * 50, col * 50, spriteHeight, spriteWidth)
        }
    }

    const plantBomb = () => {
        let bomb = { type: 'bomb', x: player.x, y: player.y }
        let updatedGrid = grid
        updatedGrid[player.x / 50][player.y / 50] = 'B'
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
        if (grid[row][col] === 'W' || grid[row][col] === 'B' || grid[row][col] === 'P' || grid[row][col] === 'BW') return false

        return true
    }

    return (
        <canvas ref={canvasRef} className='game' width={750} height={650} tabIndex={0} onKeyDown={(e) => movePlayer(e)} />
    )
}