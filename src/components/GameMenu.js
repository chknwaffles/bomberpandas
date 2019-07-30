import React, { useState, useEffect, useRef } from 'react'
import '../stylesheets/GameContainer.css'

export default function GameMenu(props) {
    const { user, changeStatus, changePage, joinGame, playGame } = props
    const [paths, setPaths] = useState([])
    const canvasRef = useRef(null)
    
    //componentdidmount
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const buttonSize = [580, 90]

        //create paths to check for clicks
        const localPath = new Path2D()
        const onlinePath = new Path2D()
        const instructionsPath = new Path2D()
        const loginPath = new Path2D()
        const signUpPath = new Path2D()
        
        //render each button in order: play, login, signup
        context.lineWidth = 4
        
        localPath.rect(150, 40, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'red'
        context.strokeRect(150, 40, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('play local', 180, 100)

        onlinePath.rect(150, 150, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'green'
        context.strokeRect(150, 150, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('play online', 180, 210)

        instructionsPath.rect(150, 260, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'yellow'
        context.strokeRect(150, 260, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText('how to play', 180, 320)

        loginPath.rect(150, 370, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'brown'
        context.strokeRect(150, 370, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText((user === '') ? 'login' : 'profile', 180, 430)

        signUpPath.rect(150, 480, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'darkgray'
        context.strokeRect(150, 480, buttonSize[0], buttonSize[1])
        context.font = '50px Helvetica'
        context.fillText((user === '') ? 'signup' : 'logout', 180, 540)

        // set paths array
        setPaths([localPath, onlinePath, instructionsPath, loginPath, signUpPath])
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
                    case 0: playGame(); break;
                    case 1: {
                        if (user === '') return alert('You must be signed in to play!')
                        joinGame(); break;
                    }
                    case 3: {
                        // show modal?
                        changePage('howtoplay')
                    }
                    case 4: changePage((user === '') ? 'login' : 'profile'); break;
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