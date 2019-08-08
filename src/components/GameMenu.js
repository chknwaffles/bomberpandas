import React, { useState, useEffect, useRef } from 'react'
import { Modal } from 'antd'

const styles = {
    container: {
        position: 'relative'
    },
    menu: {
        border: 'maroon solid 2px',
        borderRadius: '4px',
        boxShadow: '0px 0px 0px 2px black inset',
        background: 'gray'
    },
    modal: {
        backgroundColor: 'gray',
        border: 'maroon solid 2px',
        borderRadius: '4px',
        boxShadow: '0px 0px 0px 2px black inset'
    },
    modelContainer: {
        fontFamily: 'ArcadeClassic'
    },
    modalBody: {
        fontFamily: 'ArcadeClassic',
        fontSize: '20px'
    }
}

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
                        return alert('Feature coming soon!')
                        // if (user === '') return alert('You must be signed in to play!')
                        //joinGame()
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
        <div style={styles.container}>
            <canvas id="canvas" style={styles.menu} ref={canvasRef} width={650} height={650} onClick={(e) => handleClick(e)} />
            <Modal
                visible={visible}
                onOk={handleModal}
                onCancel={handleModal} 
                footer={null}
                bodyStyle={styles.modal}
                width={650}
                 >
                    <div style={styles.modalContainer}> 
                        <h1 style={{...styles.modalBody, fontSize: '50px'}}>How To Play</h1>
                        <p style={styles.modalBody}><strong>Player 1:</strong></p>
                        <p style={styles.modalBody}>WASD - Movement</p>
                        <p style={styles.modalBody}>Spacebar - Plant bomb</p>
                        <p style={styles.modalBody}><strong>Player 2: </strong></p>
                        <p style={styles.modalBody}>ArrowKeys - Movement</p>
                        <p style={styles.modalBody}>Shift - Plant bomb</p>

                    </div>
            </Modal>
        </div>
    )
}