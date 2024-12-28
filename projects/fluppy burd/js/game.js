import { Bird } from './bird.js';
import { Pipe } from './pipe.js';
import { ParticleSystem } from './particles.js';

export class Game {
    constructor() {
        this.setupCanvas();
        this.setupGameElements();
        this.setupGameState();
    }

    setupCanvas() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 360;
        this.canvas.height = 640;
    }

    setupGameElements() {
        this.bird = new Bird(this.canvas);
        this.pipes = [];
        this.particles = new ParticleSystem();
    }

    setupGameState() {
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.isPaused = false;
        this.isGameOver = false;
        this.pipeSpawnInterval = 1500;
        this.lastPipeSpawn = 0;
        
        this.updateHighScore();
    }

    start() {
        this.reset();
        this.animate();
        document.getElementById('pauseButton').classList.remove('hidden');
    }

    reset() {
        this.bird = new Bird(this.canvas);
        this.pipes = [];
        this.score = 0;
        this.isPaused = false;
        this.isGameOver = false;

        this.updateScore();
    }

    restart() {
        this.reset();
        this.animate();
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) this.animate();
    }

    updateScore() {
        document.getElementById('currentScore').textContent = this.score;
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            
            localStorage.setItem('highScore', this.highScore);
        }

        document.getElementById('highScore').textContent = this.highScore;
        document.getElementById('finalHighScore').textContent = this.highScore;
    }

    gameOver() {
        this.isGameOver = true;
        document.getElementById('gameOverScreen').classList.remove('hidden');
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('pauseButton').classList.add('hidden');
        
        this.updateHighScore();
    }

    animate(timestamp = 0) {
        if (this.isPaused || this.isGameOver) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (timestamp - this.lastPipeSpawn > this.pipeSpawnInterval) {
            this.pipes.push(new Pipe(this.canvas));
            this.lastPipeSpawn = timestamp;
        }

        this.particles.update();
        this.particles.draw(this.ctx);

        this.pipes.forEach((pipe) => {
            pipe.update();
            pipe.draw(this.ctx);

            if (this.bird.checkCollision(pipe)) {
                this.gameOver();
            }

            if (!pipe.scored && pipe.x + pipe.width < this.bird.x) {
                pipe.scored = true;
                this.score++;
                this.updateScore();
                this.particles.emit(this.bird.x, this.bird.y);
            }
        });

        this.pipes = this.pipes.filter(pipe => pipe.x + pipe.width > 0);

        this.bird.update();
        this.bird.draw(this.ctx);

        if (this.bird.y <= 0 || this.bird.y + this.bird.height >= this.canvas.height) {
            this.gameOver();
        }

        requestAnimationFrame((timestamp) => this.animate(timestamp));
    }
}