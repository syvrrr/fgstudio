function createBackgroundAnimation() {
    const container = document.querySelector('.background-animation');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 20 + 10;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        particle.style.animation = `float ${duration}s ${delay}s infinite linear`;
        container.appendChild(particle);
    }
}

class Game {
    constructor() {
        this.enemies = [];
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;

        this.container = document.getElementById('game-container');
        this.input = document.getElementById('typing-input');
        this.scoreElement = document.getElementById('score-value');
        this.levelElement = document.getElementById('level-value');
        this.gameOverScreen = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');

        this.words = ['code', 'debug', 'array', 'function', 'loop', 'string', 'object', 'class', 'method', 'variable', 'const', 'let', 'async', 'await', 'promise', 'callback', 'event', 'dom', 'node', 'element', 'attribute', 'parameter', 'argument', 'return', 'import', 'export', 'module', 'package', 'script', 'style', 'html', 'css', 'javascript', 'fullstack', 'frontend', 'backend', 'database', 'server', 'client', ];

        this.setupEventListeners();
        this.gameLoop();
        this.input.focus();

        createBackgroundAnimation();
    }

    setupEventListeners() {
        this.input.addEventListener('input', () => this.checkInput());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        window.addEventListener('click', () => this.input.focus());
    }

    createEnemy() {
        if (this.isGameOver) return;
        const enemy = document.createElement('div');
        enemy.className = 'enemy';
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        enemy.textContent = word;
        enemy.style.left = Math.random() * (window.innerWidth - 150) + 'px';
        enemy.style.top = '0px';
        this.container.appendChild(enemy);
        const enemyObj = { element: enemy, word: word, speed: 0.3 + (this.level * 0.1), position: 0 };
        this.enemies.push(enemyObj);
    }

    updateScore(points) {
        this.score += points;
        this.scoreElement.textContent = this.score;
        this.scoreElement.parentElement.classList.add('score-animation');
        setTimeout(() => this.scoreElement.parentElement.classList.remove('score-animation'), 300);
    }

    checkInput() {
        const typed = this.input.value.toLowerCase();
        let targetFound = false;

        this.enemies.forEach(enemy => {
            if (enemy.word === typed) {
                targetFound = true;

                this.shootEnemy(enemy);
                this.updateScore(10);
                this.checkLevelUp();
                
                this.input.value = '';
            }
            else if (enemy.word.startsWith(typed)) {
                enemy.element.classList.add('targeted');
            }
            else {
                enemy.element.classList.remove('targeted');
            }
        });
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.score / 50) + 1;

        if (newLevel > this.level) {
            this.level = newLevel;
            this.levelElement.textContent = this.level;
            this.levelElement.parentElement.classList.add('score-animation');
            setTimeout(() => this.levelElement.parentElement.classList.remove('score-animation'), 300);
        }
    }

    shootEnemy(enemy) {
        const laser = document.createElement('div');
        laser.className = 'laser';

        const inputRect = this.input.getBoundingClientRect();
        const enemyRect = enemy.element.getBoundingClientRect();
        
        laser.style.left = inputRect.left + inputRect.width / 2 + 'px';
        laser.style.top = inputRect.top + 'px';
        
        const dx = enemyRect.left + enemyRect.width / 2 - (inputRect.left + inputRect.width / 2);
        const dy = enemyRect.top + enemyRect.height / 2 - inputRect.top;
        const angle = Math.atan2(dy, dx);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        laser.style.width = distance + 'px';
        laser.style.transform = `rotate(${angle}rad)`;
        
        this.container.appendChild(laser);
        setTimeout(() => laser.remove(), 300);
        this.enemies = this.enemies.filter(e => e !== enemy);
        
        enemy.element.remove();
    }

    gameLoop() {
        if (Math.random() < 0.01 + (this.level * 0.002)) this.createEnemy();

        this.enemies.forEach(enemy => {
            enemy.position += enemy.speed;
            enemy.element.style.top = enemy.position + 'px';
            if (enemy.position > window.innerHeight - 100) this.gameOver();
        });

        if (!this.isGameOver) requestAnimationFrame(() => this.gameLoop());
    }

    gameOver() {
        this.isGameOver = true;
        this.gameOverScreen.style.display = 'block';
        this.finalScoreElement.textContent = this.score;
        this.input.disabled = true;
    }

    restart() {
        this.enemies.forEach(enemy => enemy.element.remove());
        this.enemies = [];
        this.score = 0;
        this.level = 1;
        this.isGameOver = false;
        this.scoreElement.textContent = '0';
        this.levelElement.textContent = '1';
        this.gameOverScreen.style.display = 'none';
        this.input.disabled = false;
        this.input.value = '';

        this.input.focus();
        this.gameLoop();
    }
}

window.addEventListener('load', () => new Game());