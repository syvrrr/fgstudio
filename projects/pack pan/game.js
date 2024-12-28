const gameBoard = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

const grid_size = 20;
let score = 0;
let lives = 3;
let gameInterval;

let player = { x: 1, y: 1 };

let ghosts = [
    {x: 18, y: 18, color: '#ff0000'},
    {x: 1, y: 18, color: '#00ffff'},
    {x: 18, y: 1, color: '#ff69b4'}
];

const maze = [
    "####################",
    "#........##........#",
    "#.##.###.##.###.##.#",
    "#.#...............#",
    "#.#.##.#.##.#.##.#.#",
    "#....#...##...#....#",
    "###.###.####.###.###",
    "##.................#",
    "#.##.###.##.###.##.#",
    "#....#...##...#....#",
    "#.#.##.#.##.#.##.#.#",
    "#.................##",
    "###.###.####.###.###",
    "#....#...##...#....#",
    "#.##.###.##.###.##.#",
    "#.#...............#",
    "#.#.##.#.##.#.##.#.#",
    "#........##........#",
    "####################"
];

function createMaze() {
    gameBoard.innerHTML = '';
    
    for (let y = 0; y < grid_size; y++) {
        for (let x = 0; x < grid_size; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;

            if (maze[y][x] === '#') {
                cell.classList.add('wall');
            }
            else if (maze[y][x] === '.') {
                const food = document.createElement('div');
                food.classList.add('food');
                cell.appendChild(food);
            }

            gameBoard.appendChild(cell);
        }
    }
}

function drawPlayer() {
    const playerElement = document.querySelector('.player');
    if (playerElement) playerElement.remove();

    const newPlayerElement = document.createElement('div');
    newPlayerElement.classList.add('player');
    const playerCell = gameBoard.querySelector(`[data-x="${player.x}"][data-y="${player.y}"]`);
    playerCell.appendChild(newPlayerElement);
    playerCell.classList.add('player-cell');
}

function drawGhosts() {
    const ghostElements = document.querySelectorAll('.ghost');
    ghostElements.forEach(el => el.remove());

    ghosts.forEach((ghost, index) => {
        const ghostElement = document.createElement('div');
        ghostElement.classList.add('ghost');
        ghostElement.style.backgroundColor = ghost.color;

        const ghostCell = gameBoard.querySelector(`[data-x="${ghost.x}"][data-y="${ghost.y}"]`);
        ghostCell.appendChild(ghostElement);
        ghostCell.classList.add('ghost-cell');
    });
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    
    if (maze[newY][newX] !== '#') {
        const oldCell = gameBoard.querySelector(`[data-x="${player.x}"][data-y="${player.y}"]`);
        oldCell.classList.remove('player-cell');
        player.x = newX;
        player.y = newY;

        if (maze[newY][newX] === '.') {
            maze[newY] = maze[newY].substring(0, newX) + ' ' + maze[newY].substring(newX + 1);
            score += 10;
            
            scoreElement.textContent = score;
            const foodElement = gameBoard.querySelector(`[data-x="${newX}"][data-y="${newY}"] .food`);
            if (foodElement) foodElement.remove();
        }

        drawPlayer();
    }
}

function moveGhosts() {
    ghosts.forEach(ghost => {
        const oldGhostCell = gameBoard.querySelector(`[data-x="${ghost.x}"][data-y="${ghost.y}"]`);
        oldGhostCell.classList.remove('ghost-cell');

        const dx = player.x - ghost.x;
        const dy = player.y - ghost.y;
        
        let moveX = 0;
        let moveY = 0;

        if (Math.abs(dx) > Math.abs(dy)) {
            moveX = dx > 0 ? 1 : -1;
        }
        else {
            moveY = dy > 0 ? 1 : -1;
        }

        if (maze[ghost.y + moveY][ghost.x + moveX] !== '#') {
            ghost.x += moveX;
            ghost.y += moveY;
        }
        else {
            const directions = [
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 },
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 }
            ];
            const validMoves = directions.filter(dir => 
                maze[ghost.y + dir.dy][ghost.x + dir.dx] !== '#'
            );

            if (validMoves.length > 0) {
                const move = validMoves[Math.floor(Math.random() * validMoves.length)];
                ghost.x += move.dx;
                ghost.y += move.dy;
            }
        }
    });

    drawGhosts();
}

function checkCollision() {
    return ghosts.some(ghost => ghost.x === player.x && ghost.y === player.y);
}

function updateGame() {
    moveGhosts();
    
    if (checkCollision()) {
        lives--;
        livesElement.textContent = lives;
        if (lives === 0) {
            endGame('Game Over! Your score: ' + score);
        }
        else {
            player = { x: 1, y: 1 };
            drawPlayer();
        }
    }
    
    if (maze.every(row => !row.includes('.'))) {
        endGame('You Win! Your score: ' + score);
    }
}

function endGame(message) {
    clearInterval(gameInterval);
    alert(message);

    startButton.style.display = 'none';
    restartButton.style.display = 'inline-block';
}

function startGame() {
    score = 0;
    lives = 3;
    player = { x: 1, y: 1 };

    ghosts = [
        { x: 18, y: 18, color: '#ff0000' },
        { x: 1, y: 18, color: '#00ffff' },
        { x: 18, y: 1, color: '#ff69b4' }
    ];

    maze.forEach((row, y) => {
        maze[y] = row.replace(/ /g, '.');
    });

    scoreElement.textContent = score;
    livesElement.textContent = lives;
    startButton.style.display = 'none';
    restartButton.style.display = 'none';
    
    createMaze();
    drawPlayer();
    drawGhosts();
    
    gameInterval = setInterval(updateGame, 200);
}

document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
    }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

createMaze();