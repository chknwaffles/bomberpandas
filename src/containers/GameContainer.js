import React, { useState } from 'react'
import GameMenu from '../components/GameMenu'
import StatusBar from '../components/StatusBar'
import Game from './Game'

export default function GameContainer() {
    const [page, setPage] = useState('')
    const [status, setStatus] = useState(false)

    const changeStatus = () => setStatus(true)
    const changePage = (newPage) => setPage(newPage)

    const renderPage = () => {
        switch(page) {
            case '': return <GameMenu changePage={changePage} />
            case 'play': return <Game />
            default: break;
        }
    }
    return (
        <React.Fragment>
            {renderPage()}
            {/* {status ? <Game /> : <GameMenu changeStatus={changeStatus} changePage={changePage} />} */}
            <StatusBar />
        </React.Fragment>
    )
}