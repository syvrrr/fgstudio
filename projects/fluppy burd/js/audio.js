export class AudioManager {
    constructor() {
        this.background = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        this.jump = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
        this.background.loop = true;
    }

    playBackground() {
        this.background.play().catch(() => {});
    }

    pauseBackground() {
        this.background.pause();
    }

    toggleBackground() {
        if (this.background.paused) {
            this.playBackground();
        }
        else {
            this.pauseBackground();
        }
    }

    playJump() {
        this.jump.currentTime = 0;
        this.jump.play().catch(() => {});
    }
}