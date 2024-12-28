class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.gameOverElement = document.getElementById('gameOver');
        this.startScreen = document.getElementById('startScreen');

        this.highScore = localStorage.getItem('highScore') || 0;
        this.highScoreElement.textContent = `High Score: ${this.highScore}`;

        this.game_speed = 8;
        this.jump_force = -13;
        this.gravity = 0.6;

        this.dino = {
            x: 50,
            y: this.canvas.height - 80,
            width: 60,
            height: 60,
            jumping: false,
            jumpForce: 0,
            color: '#4CAF50',
        };

        this.particles = [];
        this.obstacles = [];
        this.clouds = [];

        this.stars = this.generateStars();

        this.score = 0;
        this.gameOver = false;
        this.gameStarted = false;

        this.init();
    }

    generateStars() {
        const stars = [];
        
        for (let i = 0; i < 50; i++) {
            stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * (this.canvas.height - 100),
                size: Math.random() * 2 + 1,

                opacity: Math.random(),
            });
        }
        return stars;
    }

    init() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (!this.gameStarted) {
                    this.startGame();
                }
                else if (this.gameOver) {
                    this.restart();
                }
                else if (!this.dino.jumping) {
                    this.jump();
                }
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.startScreen.style.display = 'none';

        this.gameLoop();
    }

    jump() {
        this.dino.jumping = true;
        this.dino.jumpForce = this.jump_force;

        this.createJumpParticles();
    }

    createJumpParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.dino.x + this.dino.width / 2,
                y: this.dino.y + this.dino.height,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 2 + 1,
                size: Math.random() * 4 + 2,
                life: 1,
            });
        }
    }

    restart() {
        this.dino.y = this.canvas.height - 80;
        this.dino.jumping = false;
        this.dino.jumpForce = 0;
        this.obstacles = [];
        this.particles = [];
        this.clouds = [];
        this.score = 0;
        this.gameOver = false;
        this.gameOverElement.style.display = 'none';

        this.gameLoop();
    }

    update() {
        if (this.gameOver) return;

        if (this.dino.jumping) {
            this.dino.y += this.dino.jumpForce;
            this.dino.jumpForce += this.gravity;

            if (this.dino.y >= this.canvas.height - 80) {
                this.dino.y = this.canvas.height - 80;
                this.dino.jumping = false;
            }
        }

        if (Math.random() < 0.02) {
            const height = Math.random() * 40 + 30;
            this.obstacles.push({
                x: this.canvas.width,
                y: this.canvas.height - height,
                width: 30,
                height: height,
                color: '#FF5252',
            });
        }

        if (Math.random() < 0.01) {
            this.clouds.push({
                x: this.canvas.width,
                y: Math.random() * (this.canvas.height - 200),
                width: Math.random() * 60 + 40,
                speed: Math.random() * 2 + 1,
            });
        }

        this.particles.forEach((particle, index) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            if (particle.life <= 0) this.particles.splice(index, 1);
        });

        this.clouds.forEach((cloud, index) => {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) this.clouds.splice(index, 1);
        });

        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.game_speed;

            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score++;
                this.scoreElement.textContent = `Score: ${this.score}`;

                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    localStorage.setItem('highScore', this.highScore);
                    this.highScoreElement.textContent = `High Score: ${this.highScore}`;
                }
            }

            if (this.checkCollision(this.dino, obstacle)) {
                this.gameOver = true;
                this.gameOverElement.style.display = 'block';
            }
        });
    }

    checkCollision(dino, obstacle) {
        return (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        );
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.stars.forEach((star) => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.clouds.forEach((cloud) => {
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.width / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.beginPath();
        
        this.ctx.moveTo(0, this.canvas.height - 20);
        this.ctx.lineTo(this.canvas.width, this.canvas.height - 20);
        this.ctx.strokeStyle = '#ffffff33';
        this.ctx.lineWidth = 2;

        this.ctx.stroke();

        this.particles.forEach((particle) => {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.life})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.fillStyle = this.dino.color;
        this.drawDino();

        this.obstacles.forEach((obstacle) => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    drawDino() {
        this.ctx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);

        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.dino.x + 45, this.dino.y + 15, 5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(this.dino.x + 46, this.dino.y + 15, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    gameLoop() {
        if (!this.gameOver) {
            this.update();
            this.draw();
            
            requestAnimationFrame(() => this.gameLoop());
        }
    }
}

new Game();