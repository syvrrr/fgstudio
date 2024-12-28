const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const nextPieceCanvas = document.getElementById('next-piece');
const nextPieceCtx = nextPieceCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');

const block_size = 30;
const block_width = 10;
const block_height = 20;
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#97C39A', '#B18FCF', '#F38181'];

canvas.width = block_size * block_width;
canvas.height = block_size * block_height;
nextPieceCanvas.width = block_size * 4;
nextPieceCanvas.height = block_size * 4;

const shapes = [
    [[1, 1, 1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
];

let board = Array(block_height).fill().map(() => Array(block_width).fill(0));
let score = 0;

let currentPiece = null;
let nextPiece = null;
let gameLoop = null;

let gameState = 'stopped';
let gameSpeed = 500;

function drawBlock(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * block_size, y * block_size, block_size, block_size);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.strokeRect(x * block_size, y * block_size, block_size, block_size);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    ctx.beginPath();

    ctx.moveTo(x * block_size, y * block_size);
    ctx.lineTo((x + 1) * block_size, y * block_size);
    ctx.lineTo(x * block_size, (y + 1) * block_size);

    ctx.fill();
}

function drawBoard() {
    for (let y = 0; y < block_height; y++) {
        for (let x = 0; x < block_width; x++) {
            if (board[y][x]) {
                drawBlock(ctx, x, y, colors[board[y][x] - 1]);
            }
            else {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
                ctx.fillRect(x * block_size, y * block_size, block_size, block_size);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.strokeRect(x * block_size, y * block_size, block_size, block_size);
            }
        }
    }
}

function drawPiece(piece, ctx, offsetX, offsetY) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                drawBlock(ctx, x + offsetX, y + offsetY, colors[piece.color]);
            }
        });
    });
}

function drawNextPiece() {
    nextPieceCtx.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);
    drawPiece(nextPiece, nextPieceCtx, 1, 1);
}

function createPiece() {
    const shapeIndex = Math.floor(Math.random() * shapes.length);
    
    return {
        shape: shapes[shapeIndex],
        color: shapeIndex,
        x: Math.floor(block_width / 2) - Math.ceil(shapes[shapeIndex][0].length / 2),
        y: 0
    };
}

function collides(piece, pieceX, pieceY) {
    return piece.shape.some((row, y) => 
        row.some((value, x) => 
            value && (
                pieceX + x < 0 ||
                pieceX + x >= block_width ||
                pieceY + y >= block_height ||
                board[pieceY + y][pieceX + x]
            )
        )
    );
}

function mergePiece() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color + 1;
            }
        });
    });
}

function rotatePiece() {
    const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
    );

    if (!collides({ ...currentPiece, shape: rotated }, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
    }
}

function clearLines() {
    let linesCleared = 0;

    for (let y = block_height - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(block_width).fill(0));
            linesCleared++;
            y++;
        }
    }

    if (linesCleared > 0) {
        score += linesCleared * 100 * linesCleared;
        scoreElement.textContent = score;
    }
}

function gameOver() {
    cancelAnimationFrame(gameLoop);
    gameState = 'over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 30px Roboto';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Roboto';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
}

function updateGame() {
    if (gameState !== 'playing') return;

    if (collides(currentPiece, currentPiece.x, currentPiece.y + 1)) {
        mergePiece();
        clearLines();

        currentPiece = nextPiece;
        nextPiece = createPiece();
        
        drawNextPiece();
        
        if (collides(currentPiece, currentPiece.x, currentPiece.y)) {
            gameOver();
            return;
        }
    }
    else {
        currentPiece.y++;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBoard();
    
    drawPiece(currentPiece, ctx, currentPiece.x, currentPiece.y);

    gameLoop = setTimeout(updateGame, gameSpeed);
}

function startGame() {
    if (gameState === 'stopped') {
        resetGame();
        gameState = 'playing';
        updateGame();
    }
    else if (gameState === 'paused') {
        gameState = 'playing';
        updateGame();
    }
}

function pauseGame() {
    if (gameState === 'playing') {
        clearTimeout(gameLoop);
        gameState = 'paused';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Roboto';
        ctx.textAlign = 'center';
        ctx.fillText('Paused', canvas.width / 2, canvas.height / 2);
    }
}

function resetGame() {
    clearTimeout(gameLoop);
    board = Array(block_height).fill().map(() => Array(block_width).fill(0));
    score = 0;
    scoreElement.textContent = score;
    
    currentPiece = createPiece();
    nextPiece = createPiece();
    
    drawNextPiece();

    gameState = 'stopped';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBoard();
}

document.addEventListener('keydown', event => {
    if (gameState !== 'playing') return;

    switch (event.key) {
        case 'ArrowLeft':
            if (!collides(currentPiece, currentPiece.x - 1, currentPiece.y)) {
                currentPiece.x--;
            }
            break;
        case 'ArrowRight':
            if (!collides(currentPiece, currentPiece.x + 1, currentPiece.y)) {
                currentPiece.x++;
            }
            break;
        case 'ArrowDown':
            if (!collides(currentPiece, currentPiece.x, currentPiece.y + 1)) {
                currentPiece.y++;
            }
            break;
        case 'ArrowUp':
            rotatePiece();
            break;
        case ' ':
            while (!collides(currentPiece, currentPiece.x, currentPiece.y + 1)) {
                currentPiece.y++;
            }
    
            mergePiece();
            clearLines();
    
            currentPiece = nextPiece;
            nextPiece = createPiece();
    
            drawNextPiece();
    
            if (collides(currentPiece, currentPiece.x, currentPiece.y)) {
                gameOver();
            }
            break;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBoard();
    
    drawPiece(currentPiece, ctx, currentPiece.x, currentPiece.y);
});

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
resetBtn.addEventListener('click', resetGame);

resetGame();
drawBoard();