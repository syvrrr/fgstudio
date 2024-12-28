let lastGenerationType = 'random';

function generateRandomHex() {
    return '#' + Math.random().toString(16).slice(2, 8).padStart(6, '0');
}

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } 
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function HSLToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    
    return `#${f(0)}${f(8)}${f(4)}`;
}

function generatePalette() {
    lastGenerationType = 'random';
    updatePalette(Array(5).fill().map(generateRandomHex));
}

function generateMonochromatic() {
    lastGenerationType = 'monochromatic';
    const [h, s] = hexToHSL(generateRandomHex());
    updatePalette([20, 40, 60, 80, 90].map(l => HSLToHex(h, s, l)));
}

function generateAnalogous() {
    lastGenerationType = 'analogous';
    const [h, s, l] = hexToHSL(generateRandomHex());

    updatePalette([-30, -15, 0, 15, 30].map(offset => 
        HSLToHex((h + offset + 360) % 360, s, l)));
}

function generateComplementary() {
    lastGenerationType = 'complementary';
    const [h, s, l] = hexToHSL(generateRandomHex());

    updatePalette([
        HSLToHex(h, s, l),
        HSLToHex(h, s * 0.8, l),
        HSLToHex(h, s * 0.6, l),
        HSLToHex((h + 180) % 360, s * 0.8, l),
        HSLToHex((h + 180) % 360, s, l)
    ]);
}

function updatePalette(colors) {
    const palette = document.getElementById('palette');
    palette.innerHTML = '';
    
    colors.forEach((color, index) => {
        const card = document.createElement('div');
        card.className = 'color-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        const display = document.createElement('div');
        display.className = 'color-display';
        display.style.backgroundColor = color;
        
        const info = document.createElement('div');
        info.className = 'color-info';
        
        const values = document.createElement('div');
        values.className = 'color-values';
        
        const hex = document.createElement('div');
        hex.className = 'color-value';
        hex.textContent = color.toUpperCase();
        hex.onclick = () => copyToClipboard(color);
        
        const rgb = hexToRGB(color);
        const rgbValue = document.createElement('div');
        rgbValue.className = 'color-value';
        rgbValue.textContent = rgb;
        rgbValue.onclick = () => copyToClipboard(rgb);
        
        values.appendChild(hex);
        values.appendChild(rgbValue);
        info.appendChild(values);
        card.appendChild(display);
        card.appendChild(info);
        palette.appendChild(card);

        display.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1000);
        });
    });

    const blobs = document.querySelectorAll('.blob');
    blobs.forEach((blob, index) => {
        blob.style.background = colors[index % colors.length];
        blob.style.opacity = '0.5';
    });
}

function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgb(${r}, ${g}, ${b})`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => showToast());
}

function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    
    setTimeout(() => toast.classList.remove('show'), 2000);
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        switch(lastGenerationType) {
            case 'monochromatic':
                generateMonochromatic();
                break;
            case 'analogous':
                generateAnalogous();
                break;
            case 'complementary':
                generateComplementary();
                break;
            default:
                generatePalette();
        }
    }
});

generatePalette();