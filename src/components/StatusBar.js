import React, { useEffect, useRef } from 'react'
import bomb from '../images/bombicon.png'
import fire from '../images/firepowerupicon.png'

function playerStatusProps(prevPlayer, nextPlayer) {
    for(let i = 0; i < prevPlayer.length; i++) {
        if (prevPlayer[i].powerups === nextPlayer[i].powerups)
            return true
    }
}

const StatusBar = React.memo((props) => {
    const { players } = props
    const canvasRef = useRef(null)

    useEffect(() => {
        const renderImage = (row, source) => {
            const image = new Image()
            image.src = source
            image.onload = () => {
                context.drawImage(image, row, 0)
            }
        }

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, canvas.width, canvas.height)

        context.font = '40px ArcadeClassic'
        context.fillStyle = 'white'
        
        let playerX = 0
        players.forEach(p => {
            context.fillText(`P${p.id}`, playerX, 40)
            renderImage(50 + playerX, bomb)
            renderImage(150 + playerX, fire)
            context.fillText(p.powerups.bombs, 110 + playerX, 40)
            context.fillText(p.powerups.fire, 210 + playerX, 40)
            playerX += 410
        })

    }, [players])

    return (
        <canvas ref={canvasRef} className='game' width={650} height={50} />
    )
}, playerStatusProps)

export default StatusBar