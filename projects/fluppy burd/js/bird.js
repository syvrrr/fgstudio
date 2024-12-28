export class Bird {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width * 0.2;
        this.y = canvas.height / 2;
        this.width = 40;
        this.height = 30;
        
        this.velocity = 0;
        this.gravity = 0.6;
        this.jumpForce = -10;
        this.rotation = 0;
        
        this.image = new Image();
        this.image.src = 'data:image/svg+xml,' + encodeURIComponent(`
            <svg width="40" height="30" viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
                <path d="M35 15C35 21.0751 30.0751 26 24 26C17.9249 26 13 21.0751 13 15C13 8.92487 17.9249 4 24 4C30.0751 4 35 8.92487 35 15Z" fill="#38bdf8"/>
                <path d="M13 15C13 18.866 9.866 22 6 22C2.13401 22 -1 18.866 -1 15C-1 11.134 2.13401 8 6 8C9.866 8 13 11.134 13 15Z" fill="#7dd3fc"/>
                <path d="M27 13C27 14.6569 25.6569 16 24 16C22.3431 16 21 14.6569 21 13C21 11.3431 22.3431 10 24 10C25.6569 10 27 11.3431 27 13Z" fill="#0f172a"/>
                <path d="M38 12L35 15L38 18" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `);
    }

    jump() {
        this.velocity = this.jumpForce;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        
        this.rotation = Math.min(Math.max(-30, this.velocity * 3), 90);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        
        ctx.restore();
    }

    checkCollision(pipe) {
        const birdBox = {
            x: this.x + 5,
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 10
        };

        return (
            birdBox.x < pipe.x + pipe.width &&
            birdBox.x + birdBox.width > pipe.x &&
            (birdBox.y < pipe.topHeight ||
            birdBox.y + birdBox.height > pipe.topHeight + pipe.gap)
        );
    }
}