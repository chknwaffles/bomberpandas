import React, { useEffect, useRef } from 'react'
import '../stylesheets/Game.css'

export default function GameMenu(props) {
    const { changeStatus } = props
    const canvasRef = useRef(null)
    const buttonSize = [430, 150]

    //componentdidmount
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const playButton = () => {
            context.strokeRect(75, 60, buttonSize[0], buttonSize[1])
            context.font = '50px Helvetica'
            context.fillText('play now', 200, 150)
        }
        const loginButton = () => {
            context.strokeRect(75, 240, buttonSize[0], buttonSize[1])
            context.font = '50px Helvetica'
            context.fillText('login', 200, 330)
        }
        const signUpButton = () => {
            context.strokeRect(75, 420, buttonSize[0], buttonSize[1])
            context.font = '50px Helvetica'
            context.fillText('signup', 200, 500)
        }

        playButton()
        loginButton()
        signUpButton()
    }, [])

    const handleClick = (e) => {
        const targetButton = canvasRef.current.getBoundingClientRect(),
                x = e.clientX - targetButton.left,
                y = e.clientY - targetButton.top

    }

    return (
        <canvas id="canvas" className='game-menu' ref={canvasRef} width={500} height={650} onClick={(e) => handleClick(e)}/>
    )
}