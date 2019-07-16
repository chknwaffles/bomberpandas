import React, { useState, useRef } from 'react'
import '../stylesheets/Game.css'
import Player from '../components/Player'

const initialGrid =
    [
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '', 'WALL', '',
        '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''
    ]

export default function Game() {
    const [players, setPlayers] = useState({ posX: 10, posY: 10, placedBomb: false })
    const [grid, setGrid] = useState(initialGrid)
    const canvasRef = useRef(null)

    return (
        <canvas id="game" ref={canvasRef} >
            <Player />
            {/* USE FORWARD REF HOOK? OR FUCK IT ALL AND USE SOME REACT-CANVAS SHIT CAUSE WHY IS IT SO HARD TO DO THIS */}
        </canvas>
    )
}