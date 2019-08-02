import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'antd';
import '../stylesheets/GameContainer.css'

export default function GameMenu(props) {
    const { user, changeStatus, changePage, joinGame, playGame } = props
    const [paths, setPaths] = useState([])
    const [visible, setVisible] = useState(false)
    const canvasRef = useRef(null)
    
    //componentdidmount
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const buttonSize = [400, 60]

        //create paths to check for clicks
        const localPath = new Path2D()
        const onlinePath = new Path2D()
        const instructionsPath = new Path2D()
        const loginPath = new Path2D()
        const signUpPath = new Path2D()
        
        //render each button in order: play, login, signup
        context.lineWidth = 4
        
        localPath.rect(130, 100, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'red'
        context.strokeRect(130, 100, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText('PLAY LOCAL', 220, 150)

        onlinePath.rect(130, 190, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'green'
        context.strokeRect(130, 190, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText('PLAY ONLINE', 200, 240)

        instructionsPath.rect(130, 280, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'yellow'
        context.strokeRect(130, 280, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText('INSTRUCTIONS', 170, 330)

        loginPath.rect(130, 360, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'brown'
        context.strokeRect(130, 360, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText((user === '') ? 'LOGIN' : 'PROFILE', 260, 410)

        signUpPath.rect(130, 440, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'darkgray'
        context.strokeRect(130, 440, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText((user === '') ? 'SIGNUP' : 'LOGOUT', 250, 490)

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
                        return alert('Feature coming soon!')
                        //joinGame()
                        break;
                    }
                    case 2: {
                        // show modal?
                        setVisible(true)
                        break;
                    }
                    case 3: changePage((user === '') ? 'login' : 'profile'); break;
                    case 4: changePage((user === '') ? 'signup' : 'logout'); break;
                    default: break;
                }
            }
        })
    }

    const handleModal = () => {
        setVisible(false)
    }
    return (
        <div className='menu-container'>
            <canvas id="canvas" className='game-menu' ref={canvasRef} width={650} height={650} onClick={(e) => handleClick(e)} />
            <Modal
                title="Instructions"
                visible={visible}
                onOk={handleModal}
                onCancel={handleModal}>
                
                <p><strong>Player 1:</strong></p>
                <p>WASD - Movement</p>
                <p>Spacebar - Plant bomb</p>
                <p><strong>Player 2: </strong></p>
                <p>ArrowKeys - Movement</p>
                <p>Shift - Plant bomb</p>
            </Modal>
        </div>
    )
}