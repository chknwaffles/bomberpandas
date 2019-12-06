import React, { useEffect, useRef } from 'react'
import bomb from '../images/bombicon.png'
import fire from '../images/firepowerupicon.png'

function playerStatusProps(prevPlayer, nextPlayer) {
    return prevPlayer.powerups === nextPlayer.powerups
}

const StatusBar = React.memo((props) => {
    const { players } = props
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        context.font = '40px Helvetica'
        context.fillStyle = 'white'
        context.fillText('P1', 0, 40)
        
        context.fillText('P2', 300, 40)
        
        const renderImage = (row, source) => {
            const image = new Image()
            image.src = source
            image.onload = () => {
                context.drawImage(image, row, 40)
            }
        }

        players.forEach(p => {
            let x = 0
            renderImage(80 + x, bomb)
            renderImage(210 + x, fire)
            context.fillText(p.powerups.bombs, 50 + x, 40)
            context.fillText(p.powerups.fire, 180 + x, 40)
            x += 300
        })

    }, [players])

    return (
        <canvas ref={canvasRef} className='game' width={650} height={50} />
    )
}, playerStatusProps)

export default StatusBar