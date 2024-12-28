const canvas = document.getElementById('pixelCanvas');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const colorOptions = document.querySelectorAll('.color-option');
const customColorPicker = document.getElementById('customColorPicker');
const pixelSizeSlider = document.getElementById('pixelSize');

let pixelSize = 20;
let currentColor = '#000000';
let isDrawing = false;
let isDarkMode = true;

function drawGrid() {
    ctx.strokeStyle = isDarkMode ? '#333' : '#ccc';
    
    for (let i = 0; i <= canvas.width; i += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

function fillPixel(x, y) {
    const pixelX = Math.floor(x / pixelSize) * pixelSize;
    const pixelY = Math.floor(y / pixelSize) * pixelSize;
    
    ctx.fillStyle = currentColor;
    ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    const container = document.querySelector('.container');
    
    document.body.style.backgroundColor = isDarkMode ? '#121212' : '#f2e9e4';
    container.style.backgroundColor = isDarkMode ? '#1e1e1e' : '#ffffff';
    container.style.color = isDarkMode ? '#ffffff' : '#22223b';
    
    drawGrid();
}

canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    fillPixel(e.offsetX, e.offsetY);
});

canvas.addEventListener('mousemove', e => {
    if (isDrawing) fillPixel(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseleave', () => isDrawing = false);

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
});

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = canvas.toDataURL();

    link.click();
});

toggleModeBtn.addEventListener('click', toggleDarkMode);

colorOptions.forEach(option => {
    option.addEventListener('click', e => {
        currentColor = e.target.getAttribute('data-color');
        colorOptions.forEach(opt => opt.classList.remove('active'));
        e.target.classList.add('active');
        customColorPicker.classList.remove('active');
    });
});

customColorPicker.addEventListener('input', e => {
    currentColor = e.target.value;
    colorOptions.forEach(opt => opt.classList.remove('active'));
    customColorPicker.classList.add('active');
});

pixelSizeSlider.addEventListener('input', e => {
    pixelSize = parseInt(e.target.value);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
});

drawGrid();