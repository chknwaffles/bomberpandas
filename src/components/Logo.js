import React, { useEffect, useRef } from 'react';
import logo from '../images/gamelogo.png'

const styles = {
    container: {
        position: 'relative',
        background: 'rgb(10, 10, 10)'
    },
    logo: {
        background: 'rgb(10, 10, 10)'
    }
}

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
        <div style={styles.container} >
            <canvas id="canvas" style={styles.logo} ref={canvasRef} height={76} width={600} />
        </div>
    )
}