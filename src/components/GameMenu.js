import React, { useState, useEffect, useRef } from 'react'
import Modal from 'react-modal'
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

        context.lineWidth = 4
        context.font = '50px ArcadeClassic'

        //create paths to check for clicks
        const localPath = new Path2D()
        const onlinePath = new Path2D()
        const instructionsPath = new Path2D()
        const loginPath = new Path2D()
        const signUpPath = new Path2D()
        
        //render each button in order: play, login, signup
        localPath.rect(130, 100, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'red'
        context.strokeRect(130, 100, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText('PLAY LOCAL', 220, 150)

        onlinePath.rect(130, 190, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'darkblue'
        context.strokeRect(130, 190, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText('PLAY ONLINE', 200, 240)

        instructionsPath.rect(130, 280, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'yellow'
        context.strokeRect(130, 280, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText('INSTRUCTIONS', 170, 330)

        loginPath.rect(130, 360, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'lime'
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
    }, [user])

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
                        joinGame()
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

    const closeModal = () => {
        setVisible(false)
    }

    const modalStyle = {
        overlay: {
            fontFamily: 'ArcadeClassic',
            fontSize: '20px'
        },
        content: {
            top: '150px',
            right: '700px',
            left: '700px',
            bottom: '350px',
            backgroundColor: 'gray',
            border: 'white solid 2px',
            borderRadius: '4px',
            boxShadow: '0px 0px 0px 2px black inset'
        }
    }

    return (
        <div className='menu-container'>
            <canvas 
                id='canvas' 
                className='game-menu' 
                ref={canvasRef} width={650} 
                height={650} 
                onClick={(e) => handleClick(e)} 
            />
            <Modal
                style={modalStyle}
                isOpen={visible}
                onRequestClose={closeModal}
                contentLabel="Instructions"
            >
                <div>
                    <h3>Player 1: </h3>
                    Up:<kbd>W</kbd>
                    <br/>
                    Down:<kbd>S</kbd>
                    <br/>
                    Left:<kbd>A</kbd>
                    <br/>
                    Right:<kbd>D</kbd>
                    <br/>
                    Plant Bomb:<kbd>Space</kbd>
                </div>
                <div>
                    <h3>Player 2:</h3>
                    Up: <kbd>↑</kbd>
                    <br/>
                    Down:<kbd>↓</kbd>
                    <br/>
                    Left:<kbd>→</kbd>
                    <br/>
                    Right:<kbd>←</kbd>
                    <br/>
                    Plant Bomb: <kbd>R Shift</kbd>
                </div>
            </Modal>
        </div>
    )