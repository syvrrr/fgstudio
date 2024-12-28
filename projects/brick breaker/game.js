const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');

let ball, paddle, bricks = [], powerUps = [];
let score = 0, lives = 3, gameLoop;

class Ball {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height - 50;
        this.radius = 10;
        this.dx = 3;
        this.dy = -3;
        this.color = 'cyan';
    }

    draw() {
        ctx.beginPath();

        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        ctx.fill();
        ctx.closePath();
    }

    move() {
        this.x += this.dx;
        this.y += this.dy;
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx *= -1;
        if (this.y - this.radius < 0) this.dy *= -1;
    }
}

class Paddle {
    constructor() {
        this.width = 150;
        this.height = 20;
        this.x = (canvas.width - this.width) / 2;
        this.color = 'magenta';
        this.speed = 10;
        this.targetX = this.x;
    }

    draw() {
        this.x += (this.targetX - this.x) * 0.2;
        
        ctx.beginPath();
        
        ctx.rect(this.x, canvas.height - this.height, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        ctx.fill();
        ctx.closePath();
    }

    moveLeft() {
        this.targetX = Math.max(0, this.targetX - this.speed);
    }
    
    moveRight() {
        this.targetX = Math.min(canvas.width - this.width, this.targetX + this.speed);
    }
}

class Brick {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 30;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        this.hitPoints = 2;
    }
    
    draw() {
        ctx.beginPath();

        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        
        ctx.fill();
        ctx.closePath();
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.speed = 3;

        this.color = this.getColor();
    }
    
    getColor() {
        return this.type === 'extraLife' ? 'green' : this.type === 'enlargePaddle' ? 'blue' : 'red';
    }
    
    draw() {
        ctx.beginPath();

        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;

        ctx.fill();
        ctx.closePath();
    }
    
    move() {
        this.y += this.speed;
    }
}

function createBricks() {
    const rows = 5, cols = 8, padding = 10;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const brickX = c * (80 + padding) + 50;
            const brickY = r * (30 + padding) + 50;
            bricks.push(new Brick(brickX, brickY));
        }
    }
}

function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';

    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Lives: ${lives}`, canvas.width - 120, 30);
}

function checkCollisions() {
    if (
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width &&
        ball.y + ball.radius > canvas.height - paddle.height
    ) {
        ball.dy *= -1;
        ball.dx = (ball.x - (paddle.x + paddle.width / 2)) * 0.35;
    }
    
    bricks.forEach((brick, index) => {
        if (
            ball.x > brick.x &&
            ball.x < brick.x + brick.width &&
            ball.y > brick.y &&
            ball.y < brick.y + brick.height
        ) {
            ball.dy *= -1;
            brick.hitPoints--;
            score += 10;
            if (brick.hitPoints <= 0) {
                if (Math.random() < 0.3) {
                    const types = ['extraLife', 'enlargePaddle', 'speedBoost'];
                    powerUps.push(new PowerUp(brick.x + brick.width / 2, brick.y, types[Math.floor(Math.random() * types.length)]));
                }

                bricks.splice(index, 1);
            }
        }
    });

    powerUps.forEach((powerUp, index) => {
        if (
            powerUp.x < paddle.x + paddle.width &&
            powerUp.x + powerUp.width > paddle.x &&
            powerUp.y < canvas.height &&
            powerUp.y + powerUp.height > canvas.height - paddle.height
        ) {
            if (powerUp.type === 'extraLife') lives++;
            if (powerUp.type === 'enlargePaddle') paddle.width *= 1.5;
            if (powerUp.type === 'speedBoost') {
                ball.dx *= 1.5;
                ball.dy *= 1.5;
            }

            powerUps.splice(index, 1);
        }
    });
}

function gameOver() {
    clearInterval(gameLoop);

    canvas.style.display = 'none';
    gameOverScreen.style.display = 'flex';
    finalScore.textContent = `Score: ${score}`;
}

function restartGame() {
    gameOverScreen.style.display = 'none';
    canvas.style.display = 'block';

    startGame();
}

function startGame() {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    ball = new Ball();
    paddle = new Paddle();
    bricks = [];
    powerUps = [];
    score = 0;
    lives = 3;

    createBricks();

    const keys = {};
    document.addEventListener('keydown', (e) => keys[e.key] = true);
    document.addEventListener('keyup', (e) => keys[e.key] = false);

    gameLoop = setInterval(() => {
        if (keys['ArrowLeft']) paddle.moveLeft();
        if (keys['ArrowRight']) paddle.moveRight();

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (ball.y + ball.radius > canvas.height) {
            lives--;
            ball = new Ball();
            if (lives <= 0) gameOver();
        }
        
        if (bricks.length === 0) {
            alert('Congratulations! You won!');

            gameOver();
        }

        ball.move();
        ball.draw();
        paddle.draw();

        bricks.forEach(brick => brick.draw());
        
        powerUps.forEach((powerUp, index) => {
            powerUp.move();
            powerUp.draw();
            
            if (powerUp.y > canvas.height) powerUps.splice(index, 1);
        });

        checkCollisions();
        drawScore();
    }, 1000 / 60);
}