import React, { useEffect, useRef } from 'react';
import '../stylesheets/GameContainer.css';
import logo from '../images/gamelogo.png'

export default function Logo() {
    const canvasRef = useRef(null)
    
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const image = new Image()
        image.src = logo
        image.onload = () => {
            context.drawImage(image, 0, 0)
        }
    }, [])

    return (
        <div className='logo-container'>
            <canvas id="canvas" className='game-logo' ref={canvasRef} height={76} width={600} />
        </div>
    )
}