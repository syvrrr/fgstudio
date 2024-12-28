const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const launcherBubble = document.getElementById('launcherBubble');

let score = 0;
const bubbleRadius = 20;
const gridRows = 8;
const gridCols = 10;
const colors = ['#FF3366', '#33FF99', '#3366FF', '#FFFF66'];
let bubbleGrid = [];
let shootingBubble = null;
let launcherAngle = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function initGrid() {
    const gridWidth = gridCols * bubbleRadius * 2;
    const offsetX = (canvas.width - gridWidth) / 2;

    bubbleGrid = Array(gridRows).fill(null).map(() => Array(gridCols).fill(null));

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (row < 4) {
                bubbleGrid[row][col] = {
                    x: offsetX + col * bubbleRadius * 2 + bubbleRadius,
                    y: row * bubbleRadius * 2 + bubbleRadius,
                    color: colors[Math.floor(Math.random() * colors.length)]
                };
            }
        }
    }
}

function drawBubble(x, y, color) {
    ctx.beginPath();

    ctx.arc(x, y, bubbleRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    
    ctx.arc(x, y, bubbleRadius, 0, Math.PI * 2);
    ctx.strokeStyle = color;
    ctx.filter = 'blur(4px)';
    ctx.lineWidth = 4;
    
    ctx.stroke();
    
    ctx.filter = 'none';
    
    ctx.closePath();
}

function drawGrid() {
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (bubbleGrid[row][col]) {
                drawBubble(bubbleGrid[row][col].x, bubbleGrid[row][col].y, bubbleGrid[row][col].color);
            }
        }
    }
}

function drawShootingBubble() {
    if (shootingBubble) {
        drawBubble(shootingBubble.x, shootingBubble.y, shootingBubble.color);
    }
}

function updateShootingBubble() {
    if (shootingBubble) {
        shootingBubble.x += shootingBubble.dx;
        shootingBubble.y += shootingBubble.dy;

        if (shootingBubble.x < bubbleRadius || shootingBubble.x > canvas.width - bubbleRadius) {
            shootingBubble.dx *= -1;
        }

        for (let row = 0; row < gridRows; row++) {
            for (let col = 0; col < gridCols; col++) {
                if (bubbleGrid[row][col]) {
                    const dx = bubbleGrid[row][col].x - shootingBubble.x;
                    const dy = bubbleGrid[row][col].y - shootingBubble.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < bubbleRadius * 2) {
                        snapBubbleToGrid();
                        return;
                    }
                }
            }
        }

        if (shootingBubble.y < bubbleRadius) {
            snapBubbleToGrid();
        }
    }
}

function snapBubbleToGrid() {
    const col = Math.round(shootingBubble.x / (bubbleRadius * 2));
    const row = Math.round(shootingBubble.y / (bubbleRadius * 2));

    if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
        bubbleGrid[row][col] = {
            x: col * bubbleRadius * 2 + bubbleRadius,
            y: row * bubbleRadius * 2 + bubbleRadius,
            color: shootingBubble.color
        };

        checkMatches(row, col);
        dropFloatingBubbles();
    }

    shootingBubble = null;
    updateLauncherBubble();
}

function checkMatches(row, col, visited = new Set(), matches = []) {
    const key = `${row},${col}`;
    if (visited.has(key)) return matches;
    visited.add(key);

    const currentBubble = bubbleGrid[row][col];
    if (!currentBubble) return matches;

    matches.push({ row, col });

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, 1]];
    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < gridRows && newCol >= 0 && newCol < gridCols) {
            const neighbor = bubbleGrid[newRow][newCol];
            if (neighbor && neighbor.color === currentBubble.color) {
                checkMatches(newRow, newCol, visited, matches);
            }
        }
    }

    if (matches.length >= 3) {
        for (const { row, col } of matches) {
            bubbleGrid[row][col] = null;
            score += 10;
        }
        updateScore();
    }

    return matches;
}

function dropFloatingBubbles() {
    const connectedBubbles = new Set();

    for (let col = 0; col < gridCols; col++) {
        if (bubbleGrid[0][col]) {
            findConnectedBubbles(0, col, connectedBubbles);
        }
    }

    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (bubbleGrid[row][col] && !connectedBubbles.has(`${row},${col}`)) {
                bubbleGrid[row][col] = null;
                score += 15;
            }
        }
    }

    updateScore();
}

function findConnectedBubbles(row, col, connectedBubbles) {
    const key = `${row},${col}`;
    if (connectedBubbles.has(key)) return;
    connectedBubbles.add(key);

    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, 1]];
    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < gridRows && newCol >= 0 && newCol < gridCols && bubbleGrid[newRow][newCol]) {
            findConnectedBubbles(newRow, newCol, connectedBubbles);
        }
    }
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateLauncherBubble() {
    const nextColor = colors[Math.floor(Math.random() * colors.length)];
    launcherBubble.style.backgroundColor = nextColor;
}

function shootBubble(event) {
    if (shootingBubble) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const launcherX = canvas.width / 2;
    const launcherY = canvas.height - bubbleRadius;

    const angle = Math.atan2(mouseY - launcherY, mouseX - launcherX);
    const speed = 20;

    shootingBubble = {
        x: launcherX,
        y: launcherY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: launcherBubble.style.backgroundColor
    };
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    updateShootingBubble();
    drawShootingBubble();

    requestAnimationFrame(gameLoop);
}

window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('click', shootBubble);

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    shootBubble(e.touches[0]);
});

resizeCanvas();
initGrid();
updateLauncherBubble();
gameLoop();