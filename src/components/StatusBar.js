import React, { useEffect, useRef } from 'react'

export default function StatusBar() {
    const canvasRef = useRef(null)

    useEffect(() => {

    }, [])

    return (
        <canvas ref={canvasRef} className='game' width={650} height={50} />
    )
}