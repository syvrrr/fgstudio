const gameArea = document.getElementById('gameArea')
const startButton = document.getElementById('startButton')
const lastTimeDisplay = document.getElementById('lastTime')
const bestTimeDisplay = document.getElementById('bestTime')

let gameState = 'idle'
let startTime
let timeoutId
let bestTime = Infinity

function startGame() {
    gameState = 'waiting'
    gameArea.className = 'game-area waiting'
    gameArea.textContent = 'Wait for green...'
    startButton.disabled = true

    gameArea.focus()

    const delay = Math.random() * 5000 + 1000
    
    timeoutId = setTimeout(() => {
        if (gameState === 'waiting') {
            gameState = 'ready'
            gameArea.className = 'game-area ready'
            gameArea.textContent = 'CLICK NOW!'
            startTime = Date.now()
        }
    }, delay)
}

function resetGame() {
    gameState = 'idle'
    gameArea.className = 'game-area'
    gameArea.textContent = 'Click or press SPACE when green appears'
    startButton.disabled = false
    
    clearTimeout(timeoutId)
}

function handleInput() {
    if (gameState === 'idle') return

    if (gameState === 'waiting') {
        clearTimeout(timeoutId)
        gameState = 'failed'
        gameArea.className = 'game-area clicked-early'
        gameArea.textContent = 'Too early! Try again'
        startButton.disabled = false
    } 
    else if (gameState === 'ready') {
        const reactionTime = Date.now() - startTime
        lastTimeDisplay.textContent = `${reactionTime}ms`
        
        if (reactionTime < bestTime) {
            bestTime = reactionTime
            bestTimeDisplay.textContent = `${reactionTime}ms`
        }

        gameState = 'idle'
        gameArea.className = 'game-area'
        gameArea.textContent = 'Great! Click or press SPACE to try again'
        startButton.disabled = false
    } 
    else if (gameState === 'failed') {
        resetGame()
    }
}

gameArea.addEventListener('click', handleInput)

gameArea.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        e.preventDefault()
        handleInput()
    }
})

startButton.addEventListener('click', startGame)

startButton.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        startGame()
    }
})