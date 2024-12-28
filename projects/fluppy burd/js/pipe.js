export class Pipe {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = 80;
        this.gap = 180;
        this.x = canvas.width;
        this.speed = 3;
        this.scored = false;
        this.topHeight = Math.random() * (canvas.height - this.gap - 100) + 50;
    }

    update() {
        this.x -= this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(this.x, 0, this.width, this.topHeight);
        
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(this.x - 5, this.topHeight - 20, this.width + 10, 20);

        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(this.x, this.topHeight + this.gap, this.width, 
            this.canvas.height - (this.topHeight + this.gap));
        
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(this.x - 5, this.topHeight + this.gap, this.width + 10, 20);
    }
}