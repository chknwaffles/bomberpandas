import React, { useState, useEffect, useRef } from 'react'
import '../stylesheets/GameContainer.css';

export default function EndGame(props) {
    const { condition, changeStatus } = props
    const canvasRef = useRef(null)
    const [path, setPath] = useState()

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const menuPath = new Path2D()
        const buttonSize = [400, 60]

        context.font = '60px ArcadeClassic'
        context.fillText(condition, 45, 200)

        context.lineWidth = 4
        menuPath.rect(130, 440, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'black'
        context.strokeRect(130, 440, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText('back to menu', 185, 490)

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