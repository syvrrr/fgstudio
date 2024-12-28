let grid_size = 4;
const dot_spacing = 60;
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let gameBoard = [];
let gameMode = 'pvp';
let computerThinking = false;

function changeGridSize() {
    grid_size = parseInt(document.getElementById('grid-size').value);

    resetGame();
}

function changeGameMode() {
    gameMode = document.getElementById('game-mode').value;
    
    resetGame();
}

function initializeGame() {
    const board = document.getElementById('game-board');

    board.style.width = `${grid_size * dot_spacing}px`;
    board.style.height = `${grid_size * dot_spacing}px`;

    for (let row = 0; row < grid_size; row++) {
        for (let col = 0; col < grid_size; col++) {
            const dot = document.createElement('div');
            
            dot.className = 'dot';
            dot.style.left = `${col * dot_spacing}px`;
            dot.style.top = `${row * dot_spacing}px`;
         
            board.appendChild(dot);
        }
    }

    for (let row = 0; row < grid_size; row++) {
        for (let col = 0; col < grid_size - 1; col++) {
            const line = document.createElement('div');
            
            line.className = 'line horizontal';
            line.style.left = `${col * dot_spacing + dot_spacing / 2}px`;
            line.style.top = `${row * dot_spacing}px`;
            line.dataset.row = row;
            line.dataset.col = col;
            line.dataset.type = 'horizontal';

            line.addEventListener('click', handleLineClick);
            board.appendChild(line);
        }
    }

    for (let row = 0; row < grid_size - 1; row++) {
        for (let col = 0; col < grid_size; col++) {
            const line = document.createElement('div');
            
            line.className = 'line vertical';
            line.style.left = `${col * dot_spacing}px`;
            line.style.top = `${row * dot_spacing + dot_spacing / 2}px`;
            line.dataset.row = row;
            line.dataset.col = col;
            line.dataset.type = 'vertical';
            line.addEventListener('click', handleLineClick);
            
            board.appendChild(line);
        }
    }

    gameBoard = Array(grid_size - 1).fill().map(() => 
        Array(grid_size - 1).fill().map(() => ({
            top: false,
            right: false,
            bottom: false,
            left: false,
            owner: null
        }))
    );

    updateTurnIndicator();
}

function handleLineClick(event) {
    if (computerThinking || event.target.classList.contains('active')) return;

    const line = event.target;
    makeMove(line);

    if (gameMode === 'pvc' && currentPlayer === 2) {
        computerThinking = true;
        setTimeout(makeComputerMove, 1000);
    }
}

function makeMove(line) {
    const row = parseInt(line.dataset.row);
    const col = parseInt(line.dataset.col);
    const isHorizontal = line.dataset.type === 'horizontal';

    line.classList.add('active');

    let boxCompleted = false;

    if (isHorizontal) {
        if (row > 0) {
            const box = gameBoard[row - 1][col];
            box.bottom = true;
            if (checkBoxCompletion(row - 1, col)) {
                completeBox(row - 1, col);
                boxCompleted = true;
            }
        }

        if (row < grid_size - 1) {
            const box = gameBoard[row][col];
            box.top = true;
            if (checkBoxCompletion(row, col)) {
                completeBox(row, col);
                boxCompleted = true;
            }
        }
    }
    else {
        if (col > 0) {
            const box = gameBoard[row][col - 1];
            box.right = true;
            if (checkBoxCompletion(row, col - 1)) {
                completeBox(row, col - 1);
                boxCompleted = true;
            }
        }

        if (col < grid_size - 1) {
            const box = gameBoard[row][col];
            box.left = true;
            if (checkBoxCompletion(row, col)) {
                completeBox(row, col);
                boxCompleted = true;
            }
        }
    }

    if (!boxCompleted) {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        
        updateTurnIndicator();
    }

    updateScores();
    checkGameEnd();
}

function makeComputerMove() {
    const availableMoves = [];

    document.querySelectorAll('.line:not(.active)').forEach(line => {
        availableMoves.push(line);
    });

    if (availableMoves.length > 0) {
        const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        makeMove(randomMove);
    }
    
    computerThinking = false;
}

function checkBoxCompletion(row, col) {
    const box = gameBoard[row][col];
    return box.top && box.right && box.bottom && box.left;
}

function completeBox(row, col) {
    const box = gameBoard[row][col];
    
    if (box.owner === null) {
        box.owner = currentPlayer;
        
        const boxElement = document.createElement('div');
        boxElement.className = 'box';
        boxElement.style.left = `${col * dot_spacing + dot_spacing / 2}px`;
        boxElement.style.top = `${row * dot_spacing + dot_spacing / 2}px`;
        boxElement.style.backgroundColor = currentPlayer === 1 ? 'var(--player1-color)' : 'var(--player2-color)';
        document.getElementById('game-board').appendChild(boxElement);

        if (currentPlayer === 1) {
            player1Score++;
        }
        else {
            player2Score++;
        }
    }
}

function updateTurnIndicator() {
    const player1Card = document.getElementById('player1-card');
    const player2Card = document.getElementById('player2-card');
    
    player1Card.classList.toggle('active', currentPlayer === 1);
    player2Card.classList.toggle('active', currentPlayer === 2);
}

function updateScores() {
    document.querySelector('.player1-score').textContent = player1Score;
    document.querySelector('.player2-score').textContent = player2Score;
}

function checkGameEnd() {
    const totalBoxes = (grid_size - 1) * (grid_size - 1);
    if (player1Score + player2Score === totalBoxes) {
        setTimeout(() => {
            const winner = player1Score > player2Score ? 'Player 1' : 
                         player1Score < player2Score ? 'Player 2' : 'It\'s a tie';
            alert(`Game Over! ${winner} wins!`);
        }, 100);
    }
}

function resetGame() {
    document.getElementById('game-board').innerHTML = '';
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    computerThinking = false;
    
    updateScores();
    updateTurnIndicator();
    initializeGame();
}

initializeGame();