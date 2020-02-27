import React, { useEffect, useRef } from 'react'
import './StatusBar.css'
import bomb from '../images/bombicon.png'
import fire from '../images/firepowerupicon.png'

function playerStatusProps(prevProps, nextProps) {
    if (prevProps.player.id === 1) {
        console.log(prevProps.player.powerups)
        console.log(nextProps.player.powerups)
    }

    return prevProps.player.powerups === nextProps.player.powerups
}

function StatusBar(props) {
    const { player } = props
    console.log(player)
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
        
        context.fillText(`P${player.id}`, 0, 40)
        renderImage(50, bomb)
        renderImage(150, fire)
        context.fillText(player.powerups.bombs, 110, 40)
        context.fillText(player.powerups.fire, 210, 40)

    }, [player])

    return (
        <canvas ref={canvasRef} className='status-bar' width={325} height={50} />
    )
}

const MemoizedStatusBar = React.memo(StatusBar, playerStatusProps)

export default MemoizedStatusBar