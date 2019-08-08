class Player extends GameObject {
    constructor(type, x, y, id, onBomb, powerups) {
        super(type, x, y)
        this.id = id
        this.onBomb = false
        this.powerups = {
            bombs: 1,
            fire: 1
        }
    }

    movePlayer(x, y) {
        this.x = x
        this.y = y
    }
}