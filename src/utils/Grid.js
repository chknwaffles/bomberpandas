export const gridSize = 13

export const printGrid = (gridMap) => {
    let result = ''
    gridMap.forEach(row => {
        row.forEach(colE => {
            result += colE.type + '|'
        })
        console.log(result)
        result = ''
    })
    console.log('')
}

export const setPlayersPosition = (players, online) => {
    if (online) {
        //
        return
    } else {
        return players.map((player, i) => {
            if (i === 0)
                return { ...player, x: 0, y: 0 }
            if (i === 1)
                return { ...player, x: gridSize - 1, y: gridSize - 1 }
        })
    }
}
export const fillGrid = (grid, players) => {
    return grid.map((rowArr, row) => {
        return rowArr.map((colItem, col) => {
            if ((row !== 0 && col !== 0) && row % 2 !== 0 && col % 2 !== 0) {
                return { type: 'W', x: row, y: col }
            } if (playerInPosition(players, row, col)) {
                return { type: 'P', x: row, y: col }
            } else {
                return randomizeWalls(row, col)
            } 
        })
    })
}

export const generatePowerUp = (row, col) => {
    let randNum = Math.random() * 100
    if (randNum < 85) 
        return { type: 'O', x: row, y: col }
    else if (randNum < 90)
        return { type: 'FP', x: row, y: col }
    else
        return { type: 'BP', x: row, y: col }
}

const randomizeWalls = (row, col) => {
    if ((row === 0 && col === 0) || (row === 1 && col === 0) || (row === 0 && col === 1) ||
        (row === gridSize - 2 && col === gridSize - 1) || (row === gridSize - 1 && col === gridSize - 2)) 
        return { type: 'O', x: row, y: col }
    if (row % 2 === 0 && col % 2 === 0)
        return generateItem(row, col)
    if (row % 2 === 0 && col % 2 !== 0)
        return generateItem(row, col)
    if (row % 2 !== 0 && col % 2 === 0)
        return generateItem(row, col)

    return { type: 'O', x: row, y: col }
}

const generateItem = (row, col) => {
    let randNum = Math.random() * 100
    if (randNum < 75) 
        return { type: 'BW', x: row, y: col }
    else if (randNum < 97)
        return { type: 'O', x: row, y: col }
    else if (randNum < 98)
        return { type: 'FP', x: row, y: col }
    else
        return { type: 'BP', x: row, y: col }
}

const playerInPosition = (players, row, col) => {
    let target = players.find(player => player.x === row && player.y === col)
    return (target === undefined) ? false : true
}