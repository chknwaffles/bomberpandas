let initialGrid = [...Array(15)].map(e => Array(13).fill(''))

//fill the spaces with walls
// randomize grid later
initialGrid = initialGrid.map((e, i) => {
    return e.map((e2, j) => {
        // if not first row and column and last row/column
        if ((i !== 0 && j !== 0) && i % 2 !== 0 && j % 2 !== 0) {
            return 'W'
        } else {
            return ''
        }
    })
})