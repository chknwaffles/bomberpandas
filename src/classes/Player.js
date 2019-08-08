class Player extends GameObject {
    constructor(id) {
        super('P', 0, 0)
        this.id = id
        this.onBomb = false
        this.powerups = {
            bombCount: 1,
            explosionSize: 1
        }
        this.prevPosition = { 
            x: 0, 
            y: 0,
            onBomb: false 
        }
    }

    setPosition(x, y) {
        this.prevPosition = { x: this.x, y: this.y }
        this.x = x
        this.y = y
    }

    getPosition() {
        return {
            x: this.x,
            y: this.y
        }
    }

    setOnBomb(value) {
        this.onBomb = value
    }

    isOnBomb() {
        return this.onBomb
    }

    setPowerups(bombCount, explosionSize) {
        this.bombCount = bombCount
        this.explosionSize = explosionSize
    }

    getPowerups() {
        return this.powerups
    }

    static setPlayersPosition = (players, online) => {
        if (online) {
            //
            return
        } else {
            return players.map((player, i) => {
                if (i === 0)
                    return { ...player, x: 0, y: 0 }
                    
                return { ...player, x: gridSize - 1, y: gridSize - 1 }
            })
        }
    }
}