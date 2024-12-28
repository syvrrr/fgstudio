const gameContainer = document.getElementById('game-container');
const playerPaddle = document.getElementById('player-paddle');
const computerPaddle = document.getElementById('computer-paddle');
const puck = document.getElementById('puck');
const score = document.getElementById('score');
const timer = document.getElementById('timer');
const menu = document.getElementById('menu');
const gameOver = document.getElementById('game-over');
const finalResult = document.getElementById('final-result');

let gameActive = false;
let timeRemaining = 60;
let playerScore = 0;
let computerScore = 0;
let timerInterval;

const gameState = {
    playerX: 150,
    playerY: 200,
    computerX: 450,
    computerY: 200,
    puckX: 300,
    puckY: 200,
    puckSpeedX: 0,
    puckSpeedY: 0
};

function startGame() {
    resetGame();

    gameActive = true;
    menu.style.display = 'none';
    gameOver.style.display = 'none';
    
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        timer.textContent = timeRemaining + 's';
        
        if (timeRemaining <= 0) {
            endGame();
        }
    }, 1000);

    requestAnimationFrame(gameLoop);
}

function resetGame() {
    gameState.playerX = 150;
    gameState.playerY = 200;
    gameState.computerX = 450;
    gameState.computerY = 200;
    resetPuck();
    
    playerScore = 0;
    computerScore = 0;
    timeRemaining = 60;
    updateScore();
}

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    
    const result = playerScore > computerScore ? 'You Win!' :
                  playerScore < computerScore ? 'Computer Wins!' :
                  'It\'s a Tie!';
    
    finalResult.textContent = `Final Score: ${playerScore} - ${computerScore}\n${result}`;
    gameOver.style.display = 'flex';
}

function updateScore() {
    score.textContent = `${playerScore} - ${computerScore}`;
}

function resetPuck() {
    gameState.puckX = 300;
    gameState.puckY = 200;
    gameState.puckSpeedX = 0;
    gameState.puckSpeedY = 0;
}

function handleCollision(paddle, puck) {
    const dx = puck.x - paddle.x;
    const dy = puck.y - paddle.y;
    const angle = Math.atan2(dy, dx);
    const speed = 10;
    
    gameState.puckSpeedX = Math.cos(angle) * speed;
    gameState.puckSpeedY = Math.sin(angle) * speed;
}

function updateComputer() {
    const predictedY = gameState.puckY + gameState.puckSpeedY * 3;
    const targetY = gameState.puckX > 300 ? predictedY : 200;
    
    if (Math.abs(targetY - gameState.computerY) > 5) {
        gameState.computerY += (targetY > gameState.computerY) ? 5 : -5;
    }

    if (gameState.puckX > 300) {
        gameState.computerX = Math.min(gameState.computerX + 3, 550);
    }
    else {
        gameState.computerX = Math.max(gameState.computerX - 3, 350);
    }

    gameState.computerY = Math.max(20, Math.min(380, gameState.computerY));
}

function checkGoal() {
    if (gameState.puckX < 30 && gameState.puckY > 150 && gameState.puckY < 250) {
        computerScore++;
        updateScore();
        resetPuck();
        return true;
    }
    else if (gameState.puckX > 570 && gameState.puckY > 150 && gameState.puckY < 250) {
        playerScore++;
        updateScore();
        resetPuck();
        return true;
    }
    return false;
}

function checkCollisions() {
    const paddleRadius = 15;
    const puckRadius = 10;

    const playerDx = gameState.puckX - gameState.playerX;
    const playerDy = gameState.puckY - gameState.playerY;
    const playerDistance = Math.sqrt(playerDx * playerDx + playerDy * playerDy);

    if (playerDistance < paddleRadius + puckRadius) {
        handleCollision(
            {x: gameState.playerX, y: gameState.playerY},
            {x: gameState.puckX, y: gameState.puckY}
        );
    }

    const computerDx = gameState.puckX - gameState.computerX;
    const computerDy = gameState.puckY - gameState.computerY;
    const computerDistance = Math.sqrt(computerDx * computerDx + computerDy * computerDy);

    if (computerDistance < paddleRadius + puckRadius) {
        handleCollision(
            {x: gameState.computerX, y: gameState.computerY},
            {x: gameState.puckX, y: gameState.puckY}
        );
    }

    if (gameState.puckX < 15) {
        if (gameState.puckY < 150 || gameState.puckY > 250) {
            gameState.puckX = 15;
            gameState.puckSpeedX = -gameState.puckSpeedX * 0.8;
        }
    }
    else if (gameState.puckX > 585) {
        if (gameState.puckY < 150 || gameState.puckY > 250) {
            gameState.puckX = 585;
            gameState.puckSpeedX = -gameState.puckSpeedX * 0.8;
        }
    }

    if (gameState.puckY < 15 || gameState.puckY > 385) {
        gameState.puckSpeedY = -gameState.puckSpeedY * 0.8;
        gameState.puckY = gameState.puckY < 15 ? 15 : 385;
    }

    checkGoal();
}

function gameLoop() {
    if (!gameActive) return;

    gameState.puckX += gameState.puckSpeedX;
    gameState.puckY += gameState.puckSpeedY;

    gameState.puckSpeedX *= 0.99;
    gameState.puckSpeedY *= 0.99;

    updateComputer();
    checkCollisions();

    playerPaddle.style.left = `${gameState.playerX}px`;
    playerPaddle.style.top = `${gameState.playerY}px`;
    computerPaddle.style.left = `${gameState.computerX}px`;
    computerPaddle.style.top = `${gameState.computerY}px`;
    puck.style.left = `${gameState.puckX}px`;
    puck.style.top = `${gameState.puckY}px`;

    requestAnimationFrame(gameLoop);
}

gameContainer.addEventListener('mousemove', (e) => {
    if (!gameActive) return;
    
    const rect = gameContainer.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    gameState.playerX = Math.max(20, Math.min(280, mouseX));
    gameState.playerY = Math.max(20, Math.min(380, mouseY));
});