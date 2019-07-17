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

const spriteWidth = 50,
        spriteHeight = 50

export default function Game() {
    // const [players, setPlayers] = useState({ posX: 10, posY: 10, placedBomb: false })
    const [player, setPlayer] = useState({x: 0, y: 0, placedBomb: false})
    const [grid, setGrid] = useState(initialGrid)
    const [placedBombs, setPlacedBombs] = useState([])
    const canvasRef = useRef(null)

    //need to write custom hook for drawing the grid
    useEffect(() => {
        //render new image
        console.log('rendering')
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        //render board
        grid.forEach((e, i) => {
            e.forEach((e2, j) => {
                //render walls
                if (e2 === 'W') {
                    context.fillStyle = 'black'
                    
                } else if (e2 === 'B') {
                    const image = new Image()
                    image.src = `${process.env.PUBLIC_URL}/bomb.png`
                    image.onload = () => {
                        context.drawImage(image, 0, 0, 50, 50, i * 50, j * 50, spriteHeight, spriteWidth)
                    }
                } else {
                    context.fillStyle = 'white'
                }
                context.fillRect(i * spriteHeight, j * spriteHeight, spriteWidth, spriteHeight)
            })
        })

        // render player
        const image = new Image()
        image.src = icon
        image.onload = () => {
            context.fillStyle = 'white'
            context.drawImage(image, 0, 0, 50, 50, player.x, player.y, spriteHeight, spriteWidth)
        }

    }, [player])

    useEffect(() => {
        const explode = setTimeout(() => {
            // explode bomb here
            console.log('BOMB EXPLODED')
        }, 3000)

        return () => clearTimeout(explode)
    }, [placedBombs])

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
                nextMove = {...player, placedBomb: true }
                let bomb = { x: player.x, y: player.y }
                let updatedGrid = grid
                updatedGrid[player.x / 50][player.y / 50] = 'B'
                setGrid(updatedGrid)
            }
            default: break;
        }
        setPlayer(nextMove)
        //send to backend 
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
        <canvas ref={canvasRef} className='game' width={750} height={650} tabIndex={0} onKeyDown={(e) => movePlayer(e)} >
        </canvas>
    )
}