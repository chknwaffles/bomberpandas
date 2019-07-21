import React, { useState } from 'react'
import GameMenu from '../components/GameMenu'
import StatusBar from '../components/StatusBar'
import Game from './Game'

export default function GameContainer(props) {
    const { changePage } = props
    const [status, setStatus] = useState('')

    const changeStatus = () => setStatus('')

    return (
        <React.Fragment>
            <StatusBar />
            {(status === 'ready') ? <Game /> : <GameMenu changeStatus={changeStatus} changePage={changePage} />}
        </React.Fragment>
    )
}