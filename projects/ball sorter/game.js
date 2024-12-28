class BallSorterGame {
    constructor() {
        this.scoreEl = document.getElementById('score');
        this.levelEl = document.getElementById('level');
        this.ballSource = document.getElementById('ball-source');
        this.gameOver = document.getElementById('game-over');
        this.timer = document.getElementById('timer');
        this.buckets = document.querySelectorAll('.bucket');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.difficultyBtns = document.querySelectorAll('.difficulty-btn');

        this.difficulties = {
            easy: {
                ballCount: 5,
                timeLimit: 45, pointsCorrect: 10,
                pointsWrong: -5,
            },

            medium: {
                ballCount: 8,
                timeLimit: 30,
                pointsCorrect: 15,
                pointsWrong: -10,
            },
            
            hard: {
                ballCount: 12,
                timeLimit: 20,
                pointsCorrect: 20,
                pointsWrong: -15,
            }
        };
        
        this.currentDiffi = 'easy';

        this.score = 0;
        this.level = 1;
        this.colors = ['red', 'blue', 'green'];
        this.timeLeft = 0;
        this.timerInterval = null;

        this.bindEvents();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());

        this.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficultyBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentDiffi = e.target.dataset.difficulty;
            });
        });

        this.buckets.forEach(bucket => {
            bucket.addEventListener('dragover', this.handleDragOver);
            bucket.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    startGame() {
        this.score = 0;
        this.level = 1;
        this.scoreEl.textContent = `Score: ${this.score}`;
        this.levelEl.textContent = `Level: ${this.level}`;
        this.gameOver.style.display = 'none';
        this.startBtn.style.display = 'none';
        this.resetBtn.style.display = 'inline-block';

        const difficulty = this.difficulties[this.currentDiffi];
        this.timeLeft = difficulty.timeLimit;

        this.generateBalls(difficulty.ballCount);
        this.startTimer();
    }

    generateBalls(count) {
        this.ballSource.innerHTML = '';

        for (let i = 0; i < count; i++) {
            const ball = this.createBall();
            this.ballSource.appendChild(ball);
        }
    }

    createBall() {
        const ball = document.createElement('div');
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        ball.classList.add('ball');
        ball.style.backgroundColor = color;
        ball.dataset.color = color;
        ball.draggable = true;

        ball.addEventListener('dragstart', this.handleDragStart.bind(this));
        ball.addEventListener('dragend', this.handleDragEnd.bind(this));

        return ball;
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', '');
        this.buckets.forEach(bucket => bucket.classList.add('highlight'));
    }

    handleDragEnd() {
        this.buckets.forEach(bucket => bucket.classList.remove('highlight'));
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        const ball = document.querySelector('.ball[draggable="true"]');
        const targetBucket = e.currentTarget;
        const difficulty = this.difficulties[this.currentDiffi];

        if (ball.dataset.color === targetBucket.dataset.color) {
            targetBucket.appendChild(ball);
            this.updateScore(true, difficulty.pointsCorrect);
        }
        else {
            this.updateScore(false, difficulty.pointsWrong);
        }

        this.checkGameProgress();
    }

    updateScore(correct, points) {
        this.score += points;
        this.scoreEl.textContent = `Score: ${this.score}`;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timer.textContent = `Time: ${this.timeLeft}s`;

            if (this.timeLeft <= 0 || this.ballSource.children.length === 0) {
                this.endGame();
            }
        }, 1000);
    }

    checkGameProgress() {
        if (this.ballSource.children.length === 0) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.levelEl.textContent = `Level: ${this.level}`;

        const difficulty = this.difficulties[this.currentDiffi];
        this.timeLeft = difficulty.timeLimit;
        this.generateBalls(difficulty.ballCount + this.level);
    }

    endGame() {
        clearInterval(this.timerInterval);
        this.gameOver.style.display = 'block';
        this.gameOver.textContent = `Game Over! Final Score: ${this.score}`;

        this.buckets.forEach(bucket => {
            bucket.style.pointerEvents = 'none';
        });

        this.resetBtn.style.display = 'inline-block';
        this.startBtn.style.display = 'none';
    }

    resetGame() {
        clearInterval(this.timerInterval);

        this.scoreEl.textContent = 'Score: 0';
        this.levelEl.textContent = 'Level: 1';
        this.timer.textContent = 'Time: 30s';
        this.gameOver.style.display = 'none';
        this.ballSource.innerHTML = '';

        this.buckets.forEach(bucket => {
            bucket.style.pointerEvents = 'auto';
            bucket.innerHTML = '';
        });

        this.startBtn.style.display = 'inline-block';
        this.resetBtn.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BallSorterGame();
});