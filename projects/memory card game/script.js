document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.querySelector('.game-board')
    const movesDisplay = document.getElementById('moves')
    const timerDisplay = document.getElementById('timer')
    const resetButton = document.getElementById('reset-button')
    const symbols = ['🍎', '🍌', '🍒', '🍓', '🍊', '🍋', '🍍', '🥝']

    let cards = []
    let flippedCards = []
    let moves = 0
    let matchedPairs = 0
    let gameTimer
    let seconds = 0

    const createCard = symbol => {
        const card = document.createElement('div')
        card.classList.add('card')
        
        card.innerHTML = `
            <div class="front"></div>
            <div class="back">${symbol}</div>
        `
        card.addEventListener('click', flipCard)
        return card
    }

    const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[array[i], array[j]] = [array[j], array[i]]
        }

        return array
    }

    const startTimer = () => {
        gameTimer = setInterval(() => {
            seconds++
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
        }, 1000)
    }

    const checkMatch = () => {
        const [card1, card2] = flippedCards
        const symbol1 = card1.querySelector('.back').textContent
        const symbol2 = card2.querySelector('.back').textContent

        if (symbol1 === symbol2) {
            card1.removeEventListener('click', flipCard)
            card2.removeEventListener('click', flipCard)
            card1.classList.add('matched')
            card2.classList.add('matched')
            matchedPairs++

            if (matchedPairs === symbols.length) {
                endGame()
            }
        }
        else {
            card1.classList.remove('flipped')
            card2.classList.remove('flipped')
        }

        flippedCards = []
    }

    function flipCard() {
        if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
            this.classList.add('flipped')
            flippedCards.push(this)

            if (flippedCards.length === 2) {
                moves++
                movesDisplay.textContent = moves
                setTimeout(checkMatch, 1000)
            }
        }
    }

    const endGame = () => {
        clearInterval(gameTimer)
        
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })

        setTimeout(() => {
            alert(`Congratulations! You won in ${moves} moves and ${seconds} seconds!`)
        }, 1000)
    }

    const initializeGame = () => {
        gameBoard.innerHTML = ''
        cards = []
        flippedCards = []
        moves = 0
        matchedPairs = 0
        seconds = 0
        movesDisplay.textContent = moves
        timerDisplay.textContent = '00:00'
        
        clearInterval(gameTimer)

        const symbolPairs = [...symbols, ...symbols]
        shuffleArray(symbolPairs)

        symbolPairs.forEach(symbol => {
            const card = createCard(symbol)
            cards.push(card)
            gameBoard.appendChild(card)
        })

        startTimer()
    }

    resetButton.addEventListener('click', initializeGame)
    initializeGame()
})