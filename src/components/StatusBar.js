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
        
        // const renderImages = () => {
        //     const image = new Image()
        //     image.src = source
        //     image.onload = () => {
        //         context.drawImage(image, 0 * 50, 0 * 50)
        //     }
        // }

        // renderImages(row, col, source)
    }, [players])

    return (
        <canvas ref={canvasRef} className='game' width={650} height={50} />
    )
}, playerStatusProps)

export default StatusBar