import React, { useState, useEffect, useRef } from 'react'

export default function Profile(props) {
    const { user, changePage } = props
    const canvasRef = useRef(null)
    const [path, setPath] = useState()

    useEffect(() => {
        //draw the canvas
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const menuPath = new Path2D()
        const buttonSize = [580, 150]
        
        context.font = '40px ArcadeClassic'
        context.fillText(`${user}'s  Profile`, 80, 80)
        context.fillText(`Online  Wins:  ${user.wins || 0}`, 80, 130)
        context.fillText(`Local  Wins:  ${user.localWins || 0}`, 80, 180)

        context.lineWidth = 4
        menuPath.rect(75, 480, buttonSize[0], buttonSize[1])
        context.strokeStyle = 'darkred'
        context.strokeRect(75, 480, buttonSize[0], buttonSize[1])
        context.font = '50px ArcadeClassic'
        context.fillText('back to menu', 120, 580)

        setPath(menuPath)
    }, [user])

    const handleClick = (e) => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const targetButton = canvas.getBoundingClientRect()
        const x = e.clientX - targetButton.left
        const y = e.clientY - targetButton.top

        if (context.isPointInPath(path, x, y))
            changePage('')
    }
    
    return (
        <div className='profile-container'>
            <canvas 
                id='canvas' 
                className='game-menu' 
                ref={canvasRef}
                width={650} 
                height={650} 
                onClick={(e) => handleClick(e)} 
            />
        </div>
    )
}