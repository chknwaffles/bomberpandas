import React, { useState, useEffect, useRef } from 'react'
import '../stylesheets/GameContainer.css'

export default function GameMenu(props) {
    const { user, changeStatus, changePage, joinGame } = props
    const [paths, setPaths] = useState([])
    const canvasRef = useRef(null)
    
    //componentdidmount
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const buttonSize = [580, 150]

        //create paths to check for clicks
        const playPath = new Path2D()
        const loginPath = new Path2D()
        const signUpPath = new Path2D()
        
        //render each button in order: play, login, signup
        context.lineWidth = 4
        
        playPath.rect(75, 60, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'red'
        context.strokeRect(75, 60, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('play now', 120, 150)

        loginPath.rect(75, 240, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'green'
        context.strokeRect(75, 240, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText((user === '') ? 'login' : 'profile', 120, 330)

        signUpPath.rect(75, 420, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'yellow'
        context.strokeRect(75, 420, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText((user === '') ? 'signup' : 'logout', 120, 500)

        // set paths array
        setPaths([playPath, loginPath, signUpPath])
    }, [])

    const handleClick = (e) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const targetButton = canvas.getBoundingClientRect()
        const x = e.clientX - targetButton.left
        const y = e.clientY - targetButton.top

        paths.forEach((path, i) => {
            if (context.isPointInPath(path, x, y)) {
                switch(i) {
                    case 0: {
                        if (user === '') return alert('You must be signed in to play!')
                        joinGame(); break;
                    }
                    case 1: changePage((user === '') ? 'login' : 'profile'); break;
                    case 2: changePage((user === '') ? 'signup' : 'logout'); break;
                    default: break;
                }
            }
        })
    }

    return (
        <div className='menu-container'>
            <canvas id="canvas" className='game-menu' ref={canvasRef} width={650} height={650} onClick={(e) => handleClick(e)} />
        </div>
    )
}