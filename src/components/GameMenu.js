import React, { useState, useEffect, useRef } from 'react'
import '../stylesheets/Game.css'

export default function GameMenu(props) {
    const { changeStatus, changePage } = props
    const [paths, setPaths] = useState([])
    const canvasRef = useRef(null)
    
    
    //componentdidmount
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const buttonSize = [430, 150]

        //create paths to check for clicks
        const playPath = new Path2D()
        const loginPath = new Path2D()
        const signUpPath = new Path2D()
        
        //render each button in order: play, login, signup
        playPath.rect(75, 60, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'red'
        context.strokeRect(75, 60, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('play now', 200, 150)

        loginPath.rect(75, 240, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'green'
        context.strokeRect(75, 240, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('login', 200, 330)

        signUpPath.rect(75, 420, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'yellow'
        context.strokeRect(75, 420, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('signup', 200, 500)

        // set paths array
        setPaths([playPath, loginPath, signUpPath])
    }, [])

    const handleClick = (e) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const targetButton = canvas.getBoundingClientRect(),
                x = e.clientX - targetButton.left,
                y = e.clientY - targetButton.top

        paths.forEach((path, i) => {
            if (context.isPointInPath(path, x, y)) {
                console.log('Path' + (i + 1) + ' clicked')
                switch(i) {
                    case 0: changePage('play'); break;
                    default: break;
                }
            }
        })
    }

    return (
        <canvas id="canvas" className='game-menu' ref={canvasRef} width={500} height={650} onClick={(e) => handleClick(e)}/>
    )
}