const gameContainer = document.getElementById('gameContainer');
const playerPaddle = document.getElementById('playerPaddle');
const computerPaddle = document.getElementById('computerPaddle');
const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');

const containerWidth = 900;
const containerHeight = 500;
const paddleWidth = 20;
const paddleHeight = 120;
const ballSize = 25;

let balls = [];
let playerScore = 0;
let computerScore = 0;
let extraPaddles = [];

const keyState = { ArrowUp: false, ArrowDown: false };

class Ball {
    constructor(x, y, speedX, speedY) {
        this.element = document.createElement('div');
        this.element.classList.add('ball');
        
        gameContainer.appendChild(this.element);

        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.width = ballSize;
        this.height = ballSize;

        this.updatePosition();
    }

    move() {
        this.x += this.speedX;
        this.y += this.speedY;

        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    checkCollision() {
        if (this.y <= 0 || this.y >= containerHeight - this.height) {
            this.speedY = -this.speedY;
            this.y = Math.max(0, Math.min(this.y, containerHeight - this.height));
        }

        const allPaddles = [playerPaddle, computerPaddle, ...extraPaddles];
        allPaddles.forEach(paddle => {
            const paddleRect = {
                left: paddle.offsetLeft,
                right: paddle.offsetLeft + paddle.offsetWidth,
                top: paddle.offsetTop,
                bottom: paddle.offsetTop + paddle.offsetHeight
            };

            const ballRect = {
                left: this.x,
                right: this.x + this.width,
                top: this.y,
                bottom: this.y + this.height
            };

            if (ballRect.left < paddleRect.right && 
                ballRect.right > paddleRect.left && 
                ballRect.top < paddleRect.bottom && 
                ballRect.bottom > paddleRect.top) {
                if (Math.abs(this.speedX) > 0) {
                    this.x = this.speedX > 0 ? paddleRect.left - this.width : paddleRect.right;
                    this.speedX = -this.speedX * 1.05;
                }
            }
        });

        if (this.x <= 0) {
            computerScore++;
            computerScoreEl.textContent = computerScore;
            this.reset();
        }

        if (this.x >= containerWidth - this.width) {
            playerScore++;
            playerScoreEl.textContent = playerScore;
            this.reset();
        }
    }

    reset() {
        this.x = containerWidth / 2 - this.width / 2;
        this.y = containerHeight / 2 - this.height / 2;
        this.speedX = Math.random() > 0.5 ? 4 : -4;
        this.speedY = Math.random() > 0.5 ? 4 : -4;

        this.updatePosition();
    }
}

function makePaddleMovable(paddle) {
    let isDragging = false;
    let startY = 0;

    paddle.addEventListener('mousedown', e => {
        isDragging = true;
        startY = e.clientY - paddle.getBoundingClientRect().top;
        paddle.style.cursor = 'grabbing';
    });

    gameContainer.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const containerRect = gameContainer.getBoundingClientRect();

        const newY = Math.max(0, Math.min(
            e.clientY - containerRect.top - startY,
            containerHeight - paddle.offsetHeight
        ));

        paddle.style.top = `${newY}px`;
    });

    gameContainer.addEventListener('mouseup', () => {
        isDragging = false;
        paddle.style.cursor = 'move';
    });
}

function generatePowerUp() {
    const powerUpTypes = [
        {type: 'multiple-balls', text: '2x⚽'},
        {type: 'extra-paddle', text: '🛡️'}
    ];

    const powerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    const element = document.createElement('div');
    element.classList.add('powerup', `powerup-${powerUp.type}`);
    element.textContent = powerUp.text;

    element.style.left = `${Math.random() * (containerWidth - 30)}px`;
    element.style.top = `${Math.random() * (containerHeight - 30)}px`;
    
    element.addEventListener('click', () => {
        if (powerUp.type === 'multiple-balls') {
            for (let i = 0; i < 2; i++) {
                balls.push(new Ball(
                    containerWidth / 2 - ballSize / 2,
                    containerHeight / 2 - ballSize / 2,
                    Math.random() > 0.5 ? 4 : -4,
                    Math.random() > 0.5 ? 4 : -4
                ));
            }
        }
        else if (powerUp.type === 'extra-paddle') {
            const extraPaddle = document.createElement('div');
            extraPaddle.classList.add('paddle');
            extraPaddle.style.width = '15px';
            extraPaddle.style.height = '80px';
            extraPaddle.style.left = `${Math.random() * (containerWidth - 50)}px`;
            
            gameContainer.appendChild(extraPaddle);
            makePaddleMovable(extraPaddle);
            extraPaddles.push(extraPaddle);
        }

        gameContainer.removeChild(element);
    });

    gameContainer.appendChild(element);
}

function moveComputerPaddle() {
    const activeBall = balls.reduce((closest, ball) => 
        Math.abs(ball.x - containerWidth) < Math.abs(closest.x - containerWidth) ? ball : closest
    , balls[0]);

    const computerPaddleCenter = computerPaddle.offsetTop + paddleHeight / 2;
    const moveAmount = computerPaddleCenter < activeBall.y ? 2 : -2;
    const newPosition = computerPaddle.offsetTop + moveAmount;
    
    computerPaddle.style.top = `${Math.max(0, Math.min(containerHeight - paddleHeight, newPosition))}px`;
}

function movePaddleWithKeyboard() {
    const paddleSpeed = 5;
    if (keyState.ArrowUp) {
        playerPaddle.style.top = `${Math.max(0, playerPaddle.offsetTop - paddleSpeed)}px`;
    }

    if (keyState.ArrowDown) {
        playerPaddle.style.top = `${Math.min(containerHeight - paddleHeight, playerPaddle.offsetTop + paddleSpeed)}px`;
    }
}

gameContainer.addEventListener('keydown', e => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        keyState[e.code] = true;
        e.preventDefault();
    }
});

gameContainer.addEventListener('keyup', e => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        keyState[e.code] = false;
        e.preventDefault();
    }
});

makePaddleMovable(playerPaddle);
makePaddleMovable(computerPaddle);

balls.push(new Ball(
    containerWidth / 2 - ballSize / 2,
    containerHeight / 2 - ballSize / 2,
    4, 4
));

playerPaddle.style.left = '30px';
computerPaddle.style.right = '30px';

function gameLoop() {
    balls.forEach(ball => {
        ball.move();
        ball.checkCollision();
    });

    moveComputerPaddle();
    movePaddleWithKeyboard();
    requestAnimationFrame(gameLoop);
}

setInterval(generatePowerUp, 10000);
gameContainer.setAttribute('tabindex', '0');

gameContainer.focus();
gameLoop();