import React, { useEffect, useRef } from 'react'
import bomb from '../images/bombicon.png'
import fire from '../images/firepowerupicon.png'

export default function StatusBar(props) {
    const { players } = props
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        context.font = '50px Helvetica'
        
        const renderImages = () => {
            const image = new Image()
            image.src = source
            image.onload = () => {
                context.drawImage(image, 0 * 50, 0 * 50)
            }
        }

        renderImages(row, col, source)
    }, [players])

    return (
        <canvas ref={canvasRef} className='game' width={650} height={50} />
    )
}