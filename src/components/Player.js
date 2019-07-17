import React, { useState, useEffect, useRef } from 'react'

export default function Player(props) {
    const [pos, setPos] = useState({x: 10, y: 10 })
    
    const player = new Image()
    player.src = '/bomberman-frontend/public/FinnSprite.png'
    
    return (
        <React.Fragment>
        </React.Fragment>
    )
}