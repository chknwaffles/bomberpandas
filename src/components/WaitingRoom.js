import React, { useState, useEffect, useRef } from 'react'
import './WaitingRoom.css'

export default function WaitingRoom(props) {
    const { user, game, startGame, changeStatus } = props
    const canvasRef = useRef(null)
    const [path, setPath] = useState()

    useEffect(() => {
        //draw the canvas
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const menuPath = new Path2D()
        const buttonSize = [580, 150]
        
        context.font = '30px Helvetica'
        context.fillText('waiting for players to connect...', 120, 150)
        context.fillText(`(1 / 2) players have connected`, 120, 200)

        context.lineWidth = 4
        menuPath.rect(75, 480, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'gray'
        context.strokeRect(75, 480, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('back to menu', 120, 580)

        setPath(menuPath)

        //listen for messages to start
        if (game.status === 'closed') {
            //let's ready up! and start this bad boy
            startGame()
        }
    }, [game])

    const handleClick = (e) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const targetButton = canvas.getBoundingClientRect()
        const x = e.clientX - targetButton.left
        const y = e.clientY - targetButton.top

        if (context.isPointInPath(path, x, y)) {
            changeStatus('')
        }
    }

    return (
        <div className='room-container'>
            <canvas ref={canvasRef} className='waiting-room' width={650} height={650} onClick={(e) => handleClick(e)} />
        </div>
    )
}