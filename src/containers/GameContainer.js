import React, { useState } from 'react'
import GameMenu from '../components/GameMenu'
import StatusBar from '../components/StatusBar'
import Game from './Game'

export default function GameContainer() {
    const [status, setStatus] = useState(false)

    const changeStatus = () => setStatus(true)

    return (
        <React.Fragment>
            <Game />
            {/* {status ? <Game /> : <GameMenu changeStatus={changeStatus} />} */}
            <StatusBar />
        </React.Fragment>
    )
}