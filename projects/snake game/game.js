class CosmoSnake {
    constructor() {
        this.initializeCanvas()
        this.initializeGameElements()
        this.initializeGameState()
        this.attachEventListeners()
        this.gameLoop()
    }

    initializeCanvas() {
        this.canvas = document.getElementById('game-board')
        this.ctx = this.canvas.getContext('2d')
        this.ctx.imageSmoothingEnabled = false
        
        const container = document.getElementById('game-container')
        this.cellSize = 20

        this.gridWidth = Math.floor(container.clientWidth / this.cellSize)
        this.gridHeight = Math.floor(container.clientHeight / this.cellSize)
        
        this.canvas.width = this.gridWidth * this.cellSize
        this.canvas.height = this.gridHeight * this.cellSize
    }

    initializeGameElements() {
        this.scoreDisplay = document.getElementById('score-display')
        this.gameOverDisplay = document.getElementById('game-over')
        this.restartButton = document.getElementById('restart-button')
    }

    initializeGameState() {
        this.snake = [{ x: 5, y: 5 }]
        this.direction = { x: 1, y: 0 }

        this.food = this.generateFood()
        
        this.score = 0
        this.gameOver = false
    }

    attachEventListeners() {
        document.addEventListener('keydown', this.handleKeypress.bind(this))
        this.restartButton.addEventListener('click', this.restartGame.bind(this))
    }

    handleKeypress(event) {
        const moves = {
            ArrowUp: {x: 0, y: -1, opposite: 1},
            ArrowDown: {x: 0, y: 1, opposite: -1},
            ArrowLeft: {x: -1, y: 0, opposite: 1},
            ArrowRight: {x: 1, y: 0, opposite: -1}
        }

        const move = moves[event.key]
        if (move && this.direction[move.x ? 'x' : 'y'] !== move.opposite) {
            this.direction = { x: move.x, y: move.y }
        }
    }

    generateFood() {
        let foodPosition

        do {
            foodPosition = {
                x: Math.floor(Math.random() * this.gridWidth),
                y: Math.floor(Math.random() * this.gridHeight)
            }
        }
        
        while (this.snake.some(segment => 
            segment.x === foodPosition.x && segment.y === foodPosition.y))
        return foodPosition
    }

    gameLoop() {
        if (this.gameOver) {
            this.displayGameOver()
            return
        }

        setTimeout(() => {
            this.update()
            this.render()
            
            requestAnimationFrame(this.gameLoop.bind(this))
        }, 150)
    }

    update() {
        const head = {
            x: (this.snake[0].x + this.direction.x + this.gridWidth) % this.gridWidth,
            y: (this.snake[0].y + this.direction.y + this.gridHeight) % this.gridHeight
        }

        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true
            return
        }

        this.snake.unshift(head)

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score++
            this.scoreDisplay.textContent = this.score
            this.food = this.generateFood()
        }
        else {
            this.snake.pop()
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.snake.forEach(segment => {
            this.ctx.fillStyle = '#4ecdc4'
            this.ctx.fillRect(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
            )
        })

        this.ctx.fillStyle = '#ff00ff'
        
        this.ctx.fillRect(
            this.food.x * this.cellSize + 2,
            this.food.y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        )
    }

    displayGameOver() {
        this.gameOverDisplay.style.display = 'block'
        this.restartButton.style.display = 'block'

        setTimeout(() => {
            this.gameOverDisplay.style.opacity = '1'
            this.restartButton.style.opacity = '1'
        }, 50)
    }

    restartGame() {
        this.initializeGameState()
        
        this.gameOverDisplay.style.display = 'none'
        this.gameOverDisplay.style.opacity = '0'
        this.restartButton.style.display = 'none'
        this.restartButton.style.opacity = '0'
        this.scoreDisplay.textContent = this.score

        this.gameLoop()
    }
}

document.addEventListener('DOMContentLoaded', () => new CosmoSnake())