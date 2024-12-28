import { Game } from './game.js';
import { AudioManager } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    const audio = new AudioManager();

    document.getElementById('startButton').addEventListener('click', () => {
        document.getElementById('menuScreen').classList.add('hidden');
        game.start();
        audio.playBackground();
    });

    document.getElementById('restartButton').addEventListener('click', () => {
        document.getElementById('gameOverScreen').classList.add('hidden');
        game.restart();
        audio.playBackground();
    });

    document.getElementById('pauseButton').addEventListener('click', () => {
        game.togglePause();
        audio.toggleBackground();
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !game.isPaused && !game.isGameOver) {
            game.bird.jump();
            audio.playJump();
        }
    });

    document.addEventListener('touchstart', (e) => {
        if (!game.isPaused && !game.isGameOver) {
            e.preventDefault();
            game.bird.jump();
            audio.playJump();
        }
    });
});