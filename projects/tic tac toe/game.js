class TicTacToe {
    constructor(mode = 'human') {
        this.board = []
        this.currentPlayer = 'x'
        this.gameOver = false
        this.mode = mode

        this.initElements()
        this.showStartScreen()
    }

    initElements() {
        this.boardElement = document.getElementById('board')
        this.statusElement = document.getElementById('status')
        this.startScreen = document.getElementById('start-screen')
        this.gameScreen = document.getElementById('game-screen')
        this.resetBtn = document.getElementById('reset-btn')
        this.backBtn = document.getElementById('back-btn')
        this.confettiContainer = document.getElementById('confetti-container')

        this.resetBtn.addEventListener('click', () => this.resetGame())
        this.backBtn.addEventListener('click', () => this.showStartScreen())
    }

    showStartScreen() {
        this.startScreen.style.display = 'flex'
        this.gameScreen.style.display = 'none'
        
        document.getElementById('human-btn').onclick = () => this.startGame('human')
        document.getElementById('ai-btn').onclick = () => this.startGame('ai')
    }

    startGame(mode) {
        this.mode = mode
        this.currentPlayer = 'x'
        this.gameOver = false
        this.startScreen.style.display = 'none'
        this.gameScreen.style.display = 'flex'

        this.initBoard()
        this.initEventListeners()
        this.updateStatus()
    }

    initBoard() {
        this.boardElement.innerHTML = ''
        this.board = Array(9).fill(null)

        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div')
            cell.classList.add('cell')
            cell.dataset.index = i
            this.boardElement.appendChild(cell)
        }
    }

    initEventListeners() {
        const cells = document.querySelectorAll('.cell')

        cells.forEach(cell => {
            cell.removeEventListener('click', this.cellClickHandler)
            cell.addEventListener('click', this.cellClickHandler.bind(this))
        })
    }

    cellClickHandler(event) {
        let cell = event.target

        while (!cell.classList.contains('cell')) {
            cell = cell.parentElement
        }
        const index = cell.dataset.index

        if (!this.board[index] && !this.gameOver) {
            this.makeMove(cell)
        }
    }

    makeMove(cell) {
        const index = cell.dataset.index
        this.board[index] = this.currentPlayer
        cell.textContent = this.currentPlayer
        cell.classList.add(this.currentPlayer)

        if (this.checkWinner()) {
            this.endGame(false)
        }
        else if (this.isBoardFull()) {
            this.endGame(true)
        }
        else {
            this.switchPlayer()
        }
    }

    isBoardFull() {
        return this.board.every(cell => cell !== null)
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x'
        this.updateStatus()

        if (this.mode === 'ai' && this.currentPlayer === 'o') {
            setTimeout(() => this.aiMove(), 500)
        }
    }

    updateStatus() {
        this.statusElement.textContent = `${this.currentPlayer.toUpperCase()}'s turn`
    }

    aiMove() {
        const emptyCells = this.board
            .map((cell, index) => cell === null ? index : null)
            .filter(index => index !== null)
        
        if (emptyCells.length > 0) {
            const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
            const aiCell = document.querySelector(`.cell[data-index="${randomIndex}"]`)
            this.makeMove(aiCell)
        }
    }

    checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ]

        return winPatterns.some(([a, b, c]) => 
            this.board[a] && 
            this.board[a] === this.board[b] && 
            this.board[a] === this.board[c]
        )
    }

    endGame(isDraw) {
        this.gameOver = true
        this.statusElement.textContent = isDraw 
            ? "It's a Draw!" 
            : `${this.currentPlayer.toUpperCase()} Wins!`

        if (!isDraw) this.createConfetti()
    }

    createConfetti() {
        const colors = ['#64ffda', '#ff4d4d', '#4d4dff']

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div')
            Object.assign(confetti.style, {
                position: 'absolute',
                width: '10px',
                height: '10px',
                backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                left: `${Math.random() * 100}%`,
                top: '-10px',
                borderRadius: '50%',
                
                opacity: Math.random().toString()
            })

            this.confettiContainer.appendChild(confetti)
            this.animateConfetti(confetti)
        }
    }

    animateConfetti(confetti) {
        const duration = Math.random() * 3000 + 2000
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 100 + 50

        confetti.animate([
            { 
                transform: 'translate(0, 0) rotate(0deg)',
                opacity: 1 
            },

            { 
                transform: `translate(${Math.cos(angle) * distance}px, ${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0 
            }
        ],
        
        {
            duration,
            easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
        })

        setTimeout(() => confetti.remove(), duration)
    }

    resetGame() {
        this.currentPlayer = 'x'
        this.gameOver = false

        this.initBoard()
        this.initEventListeners()
        this.updateStatus()
        
        this.confettiContainer.innerHTML = ''
    }
}

new TicTacToe()