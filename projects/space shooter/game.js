const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreValue = document.getElementById('score-value');
const livesValue = document.getElementById('lives-value');
const finalScore = document.getElementById('final-score');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameLoop;
let player;

let enemies = [];
let projectiles = [];
let particles = [];
let stars = [];

let score = 0;
let lives = 3;
let mouseX = 0;
let mouseY = 0;

class GameObject {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Player extends GameObject {
    update() {
        this.draw();
    }
}

class Projectile extends GameObject {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.draw();
    }
}

class Enemy extends GameObject {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        this.draw();
    }
}

class Particle extends GameObject {
    constructor(x, y, radius, color, velocity) {
        super(x, y, radius, color);
        this.velocity = velocity;
        this.alpha = 1;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01;

        this.draw();
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    player = new Player(canvas.width / 2, canvas.height - 50, 15, '#00ffff');
    enemies = [];
    projectiles = [];
    particles = [];
    stars = [];
    score = 0;
    lives = 3;
    scoreValue.textContent = score;
    livesValue.textContent = lives;

    for (let i = 0; i < 100; i++) {
        stars.push(new GameObject(
            Math.random() * canvas.width,
            Math.random() * canvas.height,

            Math.random() * 2,

            '#fff'
        ));
    }
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * 20 + 10;
        let x, y;

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = 0 - radius;
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(player.y - y, player.x - x);
        
        const velocity = {
            x: Math.cos(angle) * 0.7,
            y: Math.sin(angle) * 0.7
        };

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

function createExplosion(x, y, color) {
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;

        const velocity = {
            x: Math.cos(angle) * Math.random() * 3,
            y: Math.sin(angle) * Math.random() * 3
        };
        
        particles.push(new Particle(x, y, Math.random() * 3, color, velocity));
    }
}

function shoot(direction) {
    let velocity;

    if (direction === 'cursor') {
        const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

        velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        };
    }
    else {
        const directions = {
            up: { x: 0, y: -5 },
            down: { x: 0, y: 5 },
            left: { x: -5, y: 0 },
            right: { x: 5, y: 0 }
        };
        
        velocity = directions[direction];
    }

    projectiles.push(new Projectile(player.x, player.y, 5, '#fff', velocity));
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => star.draw());
    player.update();

    particles = particles.filter(particle => {
        if (particle.alpha <= 0) return false;
        
        particle.update();
        return true;
    });

    projectiles = projectiles.filter(projectile => {
        projectile.update();

        return !(projectile.x + projectile.radius < 0 ||
                projectile.x - projectile.radius > canvas.width ||
                projectile.y + projectile.radius < 0 ||
                projectile.y - projectile.radius > canvas.height);
    });

    enemies = enemies.filter(enemy => {
        enemy.update();

        const distToPlayer = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (distToPlayer - enemy.radius - player.radius < 1) {
            createExplosion(player.x, player.y, '#00ffff');
            lives--;
            livesValue.textContent = lives;
            
            if (lives <= 0) {
                cancelAnimationFrame(gameLoop);
                gameOverScreen.style.display = 'block';
                finalScore.textContent = score;
                return false;
            }
        
            return false;
        }

        let destroyed = false;
        projectiles = projectiles.filter(projectile => {
            if (destroyed) return true;
            
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                createExplosion(enemy.x, enemy.y, enemy.color);
                score += 100;
                scoreValue.textContent = score;
                destroyed = true;
                return false;
            }
        
            return true;
        });

        return !destroyed;
    });

    gameLoop = requestAnimationFrame(animate);
}

window.addEventListener('mousemove', event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
});

window.addEventListener('click', () => shoot('cursor'));

window.addEventListener('keydown', event => {
    const keyActions = {
        ArrowUp: () => shoot('up'),
        ArrowDown: () => shoot('down'),
        ArrowLeft: () => shoot('left'),
        ArrowRight: () => shoot('right'),
        
        ' ': () => shoot('cursor')
    };
    
    keyActions[event.key]?.();
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    init();
});

startButton.addEventListener('click', () => {
    startScreen.style.display = 'none';

    init();
    animate();
    spawnEnemies();
});

restartButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';

    init();
    animate();
    spawnEnemies();
});

init();