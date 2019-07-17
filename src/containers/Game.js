import React, { useState, useEffect, useRef } from 'react'
import '../stylesheets/Game.css'
// import '../../../public/FinnSprite.png'

//initialize grid with empty strings
let initialGrid = [...Array(15)].map(e => Array(13).fill(''))

//fill the spaces with walls
// randomize grid later
initialGrid = initialGrid.map((e, i) => {
    return e.map((e2, j) => {
        if (i !== 0 && j !== 0 && i % 2 !== 0 && j % 2 !== 0) {
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
    const canvasRef = useRef(null)
    
    //need to write custom hook for drawing the grid
    useEffect(() => {
        //render new image
        console.log('rendering')
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        //render board
        initialGrid.forEach((e, i) => {
            e.forEach((e2, j) => {
                context.fillStyle = 'white'
                context.fillRect(i * spriteHeight, j * spriteHeight, spriteWidth, spriteHeight)
            })
        })
        
        // render player
        const image = new Image()
        console.log('public_url', process.env)
        // image.src = "../images/FinnSprite.png"
    
        image.src = '//spritedatabase.net/files/snes/531/Sprite/SBM4-Bomberman-.gif'
        // image.src = 'http://i615.photobucket.com/albums/tt239/emotesplz/rlyplz.png'
        console.log(canvas)
        console.log(context)
        context.fillStyle = 'white'
        context.drawImage(image, spriteWidth, spriteHeight, spriteWidth, spriteHeight, player.x, player.y, spriteHeight, spriteWidth)
        console.log(image)
        console.log(player.x, player.y)

    }, [player])

    

    const movePlayer = (e) => {
        console.log('PRESSED', e.key)
        //set state of player based on key
        switch(e.key) {
            case 'w': { // up
                setPlayer({...player, y: player.y - spriteHeight})
                break;
            }
            case 's': { // down
                setPlayer({...player, y: player.y + spriteHeight})
                break;
            }
            case 'a': { // left
                setPlayer({...player, x: player.x - spriteWidth})
                break;
            }
            case 'd': { // right
                setPlayer({...player, x: player.x + spriteWidth})
                break;
            }
            default: break;
        }

        //send to backend 
    }

    return (
        <canvas ref={canvasRef} className='game' width={800} height={600} tabIndex={0} onKeyDown={(e) => movePlayer(e)} >
        </canvas>
    )
}