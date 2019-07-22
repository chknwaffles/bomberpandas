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

export const randomizeWalls = (row, col) => {
    if (row !== 0 && col !== 0) {
        if (row % 2 === 0 && col % 2 === 0)
            return { type: 'BW', x: row, y: col }
    }
    return { type: 'O', x: row, y: col }
}
