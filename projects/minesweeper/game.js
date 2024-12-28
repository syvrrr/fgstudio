const GRID_SIZE = 10;
const MINE_COUNT = 10;

let grid = [];
let revealed = [];
let flagged = [];

let gameOver = false;
let timeElapsed = 0;
let timerInterval;
let firstClick = true;

function createBackgroundElements() {
    const bgAnimation = document.getElementById('bgAnimation');
    const numberOfElements = 20;

    for (let i = 0; i < numberOfElements; i++) {
        const square = document.createElement('div');
        square.className = 'floating-square';
        const size = Math.random() * 80 + 20;

        square.style.width = `${size}px`;
        square.style.height = `${size}px`;
        
        square.style.left = `${Math.random() * 100}vw`;
        square.style.top = `${Math.random() * 100}vh`;

        const moveX = (Math.random() - 0.5) * 100;
        const moveY = (Math.random() - 0.5) * 100;

        square.style.setProperty('--move-x', `${moveX}vw`);
        square.style.setProperty('--move-y', `${moveY}vh`);
        
        square.style.animationDuration = `${15 + Math.random() * 15}s`;
        square.style.animationDelay = `${Math.random() * -30}s`;

        bgAnimation.appendChild(square);
    }
}

function initGame() {
    grid = [];
    revealed = [];
    flagged = [];

    gameOver = false;
    timeElapsed = 0;
    firstClick = true;
    
    clearInterval(timerInterval);
    
    document.getElementById('timer').textContent = '0';
    document.getElementById('mine-count').textContent = MINE_COUNT;

    for (let i = 0; i < GRID_SIZE; i++) {
        grid[i] = [];
        revealed[i] = [];
        flagged[i] = [];
    
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = 0;
    
            revealed[i][j] = false;
            flagged[i][j] = false;
        }
    }

    const gridElement = document.getElementById('grid');
    
    gridElement.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
    
            cell.className = 'cell';
            
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            cell.addEventListener('click', handleClick);
            cell.addEventListener('contextmenu', handleRightClick);
            
            gridElement.appendChild(cell);
        }
    }
}

function placeMines(firstRow, firstCol) {
    let minesPlaced = 0;

    while (minesPlaced < MINE_COUNT) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        
        if (grid[row][col] !== -1 && 
            (Math.abs(row - firstRow) > 1 || 
            Math.abs(col - firstCol) > 1)) {
            grid[row][col] = -1;
            minesPlaced++;
        }
    }

    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] !== -1) {
                grid[i][j] = countAdjacentMines(i, j);
            }
        }
    }
}

function countAdjacentMines(row, col) {
    let count = 0;

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;

            if (newRow >= 0 && newRow < GRID_SIZE && 
                newCol >= 0 && newCol < GRID_SIZE && 
                grid[newRow][newCol] === -1) {
                count++;
            }
        }
    }
    return count;
}

function handleClick(event) {
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (gameOver || flagged[row][col]) return;

    if (firstClick) {
        firstClick = false;

        placeMines(row, col);
        startTimer();
    }

    revealCell(row, col);
}

function handleRightClick(event) {
    event.preventDefault();

    if (gameOver || firstClick) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);

    if (!revealed[row][col]) {
        flagged[row][col] = !flagged[row][col];
        const cell = event.target;

        cell.classList.toggle('flagged');
        
        const mineCount = document.getElementById('mine-count');
        const currentCount = parseInt(mineCount.textContent);

        mineCount.textContent = flagged[row][col] ? 
            currentCount - 1 : currentCount + 1;
    }
}

function revealCell(row, col) {
    if (row < 0 || row >= GRID_SIZE || 
        col < 0 || col >= GRID_SIZE || 
        revealed[row][col] || flagged[row][col]) {
        return;
    }

    revealed[row][col] = true;

    const cell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`
    );

    cell.classList.add('revealed');

    if (grid[row][col] === -1) {
        gameOver = true;
        cell.classList.add('mine');
        cell.textContent = '💣';

        revealAllMines();
        clearInterval(timerInterval);

        return;
    }

    if (grid[row][col] > 0) {
        cell.textContent = grid[row][col];
        cell.classList.add(`number-${grid[row][col]}`);
    }
    else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                revealCell(row + i, col + j);
            }
        }
    }

    checkWin();
}

function revealAllMines() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === -1) {
                const cell = document.querySelector(
                    `[data-row="${i}"][data-col="${j}"]`
                );
                cell.classList.add('revealed', 'mine');
                cell.textContent = '💣';
            }
        }
    }
}

function checkWin() {
    let unrevealedSafeCells = 0;
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (!revealed[i][j] && grid[i][j] !== -1) {
                unrevealedSafeCells++;
            }
        }
    }
    
    if (unrevealedSafeCells === 0) {
        gameOver = true;
        clearInterval(timerInterval);
        alert('Congratulations! You won! 🎉');
    }
}

function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = timeElapsed;
    }, 1000);
}

window.onload = () => {
    createBackgroundElements();
    initGame();
};