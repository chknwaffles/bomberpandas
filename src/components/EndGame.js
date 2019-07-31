import React, { useState, useEffect, useRef } from 'react'
import '../stylesheets/GameContainer.css';

export default function EndGame(props) {
    const { condition, changeStatus, player } = props
    const canvasRef = useRef(null)
    const [path, setPath] = useState()

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const menuPath = new Path2D()
        const buttonSize = [580, 150]

        context.font = '60px Helvetica'
        if (condition === 'local') {
            let loser = player.id
            context.fillText((loser === 1) ? 'P2 has won the game!' : 'P1 has won the game!', 150, 200)
        } else {
            context.fillText(condition, 150, 200)
        }

        context.lineWidth = 4
        menuPath.rect(75, 480, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'gray'
        context.strokeRect(75, 480, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('back to menu', 120, 580)

        setPath(menuPath)
    }, [])

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
        <canvas id="canvas" className='endgame-screen' ref={canvasRef} width={650} height={650} onClick={(e) => handleClick(e)} />
    )
}