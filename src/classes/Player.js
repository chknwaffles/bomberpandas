import GameObject from '../classes/GameObject'

export default class Player extends GameObject {
    constructor(id) {
        super('P', 0, 0)
        this.id = id
        this.onBomb = false
        this.powerups = {
            bombCount: 1,
            bombSize: 1
        }
        this.prevPosition = { 
            x: 0, 
            y: 0,
            onBomb: false 
        }
    }

    setX(x) {
        this.prevPosition.x = this.x
        this.x = x
    }

    setY(y) {
        this.prevPosition.y = this.y
        this.y = y
    }

    getX() {
        return this.x
    }

    getY() {
        return this.y
    }

    setPos(x, y) {
        this.prevPosition = { x: this.x, y: this.y }
        this.x = x
        this.y = y
    }

    getPos() {
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

    getBombCount() {
        return this.powerups.bombCount
    }

    setBombCount(num) {
        this.powerups.bombCount = num
    }

    getBombSize() {
        return this.powerups.bombSize
    }

    setBombSize(num) {
        this.powerups.bombSize = num
    }

    setPowerups(bombCount, bombSize) {
        this.bombCount = bombCount
        this.bombSize = bombSize
    }

    getPowerups() {
        return this.powerups
    }

    getPrevPos() {
        return this.prevPosition
    }

    static setPlayersPosition = (players, online) => {
        if (online) {
            //
            return
        } else {
            return players.map((player, i) => {
                if (i === 0)
                    return { ...player, x: 0, y: 0 }
                    
                return { ...player, x: 12, y: 12 }
            })
        }
    }
}