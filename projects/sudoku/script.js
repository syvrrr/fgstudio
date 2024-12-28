let board = Array(9).fill().map(() => Array(9).fill(0));
let solution = Array(9).fill().map(() => Array(9).fill(0));
let selectedCell = null;
let difficulty = 'easy';

const difficultyLevels = { easy: 40, medium: 50, hard: 60 };

function initGame() {
    createBoard();
    renderBoard();
    addEventListeners();
    newGame();
}

function createBoard() {
    const grid = document.querySelector('.grid');
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;

        grid.appendChild(cell);
    }
}

function addEventListeners() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', () => selectCell(cell));
    });

    document.querySelectorAll('.difficulty button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.difficulty button.active').classList.remove('active');
            button.classList.add('active');
            difficulty = button.dataset.difficulty;

            newGame();
        });
    });

    document.addEventListener('keydown', handleKeyPress);
}

function handleKeyPress(e) {
    if (selectedCell && /^[0-9]$/.test(e.key)) {
        inputNumber(parseInt(e.key));
    }
}

function selectCell(cell) {
    if (cell.classList.contains('prefilled')) return;

    document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
    selectedCell = cell;
}

function inputNumber(num) {
    if (!selectedCell || selectedCell.classList.contains('prefilled')) return;

    const index = parseInt(selectedCell.dataset.index);
    const row = Math.floor(index / 9);
    const col = index % 9;

    if (num === 0) {
        board[row][col] = 0;
        selectedCell.textContent = '';
        selectedCell.classList.remove('error');
        return;
    }

    board[row][col] = num;
    selectedCell.textContent = num;

    if (!isValid(row, col, num)) {
        selectedCell.classList.add('error');
    }
    else {
        selectedCell.classList.remove('error');
    }

    if (isBoardFull() && isValidSolution()) {
        showStatus('Congratulations! You solved the puzzle!', true);
    }
}

function newGame() {
    generateSudoku();
    
    solution = JSON.parse(JSON.stringify(board));
    const emptyCells = difficultyLevels[difficulty];

    let removed = 0;
    while (removed < emptyCells) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removed++;
        }
    }

    renderBoard();
    showStatus('Game started! Good luck!');
}

function renderBoard() {
    const cells = document.querySelectorAll('.cell');
    
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        const value = board[row][col];

        cell.textContent = value || '';
        cell.classList.remove('prefilled', 'selected', 'error');
        if (value !== 0) {
            cell.classList.add('prefilled');
        }
    });

    selectedCell = null;
}

function generateSudoku() {
    board = Array(9).fill().map(() => Array(9).fill(0));
    fillBoard(board);
}

function fillBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                for (let num of numbers) {
                    if (isValid(row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function isValid(row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (x !== col && board[row][x] === num) return false;
    }
    for (let x = 0; x < 9; x++) {
        if (x !== row && board[x][col] === num) return false;
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if ((boxRow + i !== row || boxCol + j !== col) && board[boxRow + i][boxCol + j] === num) {
                return false;
            }
        }
    }
    return true;
}

function isBoardFull() {
    return board.every(row => row.every(cell => cell !== 0));
}

function isValidSolution() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = board[row][col];
            board[row][col] = 0;
            if (!isValid(row, col, num)) {
                board[row][col] = num;
                return false;
            }
            board[row][col] = num;
        }
    }
    return true;
}

function checkSolution() {
    if (!isBoardFull()) {
        showStatus('The board is not complete yet!');
        return;
    }

    if (isValidSolution()) {
        showStatus('Congratulations! The solution is correct!', true);
    }
    else {
        showStatus('Sorry, the solution is not correct. Keep trying!');
    }
}

function showStatus(message, success = false) {
    const status = document.querySelector('.status');
    status.textContent = message;
    status.style.color = success ? '#22c55e' : '#ef4444';
}

window.addEventListener('load', initGame);