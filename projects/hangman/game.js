const words = [
    { word: 'DATABASE', hint: 'An organized collection of data' },
    { word: 'PYTHON', hint: 'A high-level programming language' },
    { word: 'ALGORITHM', hint: 'Step-by-step process to solve a problem' },
    { word: 'ENCRYPTION', hint: 'Securing information by encoding it' },
    { word: 'HYPERLINK', hint: 'A clickable link on a webpage' },
    { word: 'GITHUB', hint: 'A platform for hosting and sharing code' },
    { word: 'INTERNET', hint: 'A global network connecting millions of devices' },
    { word: 'FIREWALL', hint: 'A security system for network protection' },
    { word: 'REACT', hint: 'A JavaScript library for building user interfaces' },
    { word: 'COMPILER', hint: 'A program that translates code into machine language' },
    { word: 'BLOCKCHAIN', hint: 'A digital ledger technology' },
    { word: 'PASSWORD', hint: 'A key used to access secure systems' },
    { word: 'SERVER', hint: 'A computer that provides data to other computers' },
    { word: 'KEYBOARD', hint: 'An input device used for typing' },
    { word: 'MONITOR', hint: 'A device for displaying visual output' },
    { word: 'FUNCTION', hint: 'A reusable block of code' },
    { word: 'VARIABLE', hint: 'A container for storing data' },
    { word: 'OPERATING', hint: 'A system software that manages hardware' },
    { word: 'ANDROID', hint: 'A mobile operating system by Google' },
    { word: 'APPLE', hint: 'A company known for its iPhones and Macs' },
    { word: 'BITCOIN', hint: 'A popular cryptocurrency' },
    { word: 'CLOUD', hint: 'Remote servers accessed over the internet' },
    { word: 'PHISHING', hint: 'A type of online scam to steal personal information' },
    { word: 'DEBUGGING', hint: 'The process of finding and fixing code errors' },
    { word: 'VIRTUAL', hint: 'Existing in a simulated environment' },
    { word: 'NETWORK', hint: 'Interconnected computers and devices' },
    { word: 'SMARTPHONE', hint: 'A mobile phone with advanced features' },
    { word: 'TROJAN', hint: 'A type of malicious software' },
    { word: 'QUANTUM', hint: 'A type of computing using quantum-mechanical phenomena' },
    { word: 'WEBSITE', hint: 'A collection of webpages under one domain' },
    { word: 'CASCADING', hint: 'Refers to CSS in web development' },
    { word: 'CYBERSECURITY', hint: 'Protecting systems and networks from cyber threats' },
    { word: 'WIDGET', hint: 'A small application for a specific task' },
    { word: 'HTML', hint: 'A markup language for creating webpages' },
    { word: 'CACHE', hint: 'A storage layer for quick data retrieval' },
    { word: 'JAVA', hint: 'A popular programming language used for many applications' },
    { word: 'PROTOCOL', hint: 'A set of rules for data communication' },
    { word: 'ROUTER', hint: 'A device that directs network traffic' },
    { word: 'SOFTWARE', hint: 'Programs used by a computer' },
    { word: 'HARDWARE', hint: 'Physical components of a computer' },
    { word: 'TABLET', hint: 'A portable touchscreen device' },
    { word: 'UBUNTU', hint: 'A popular Linux-based operating system' },
    { word: 'PIXEL', hint: 'The smallest unit of a digital image' },
    { word: 'WIFI', hint: 'Wireless internet connection' },
    { word: 'HYPERTEXT', hint: 'A text linked to other information' },
    { word: 'DNS', hint: 'Translates domain names to IP addresses' },
    { word: 'SPREADSHEET', hint: 'A software for organizing data in tables' },
    { word: 'ZOOM', hint: 'A platform for video communication' },
    { word: 'ELECTRON', hint: 'An atomic particle or a framework for building apps' },
    { word: 'API', hint: 'Interface for communication between software systems' }
];

let currentWord = '';
let currentHint = '';
let guessedLetters = [];
let remainingGuesses = 6;

const word = document.getElementById('word');
const hint = document.getElementById('hint');
const hangman = document.getElementById('hangman');
const message = document.getElementById('message');
const keyboard = document.getElementById('keyboard');
const newGameBtn = document.getElementById('newGameBtn');
const confettiCanvas = document.getElementById('confetti');
const ctx = confettiCanvas.getContext('2d');

function initializeGame() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex].word;
    currentHint = words[randomIndex].hint;
    guessedLetters = [];
    remainingGuesses = 6;

    updateDisplay();
    createKeyboard();
    stopConfetti();
}

function updateDisplay() {
    word.textContent = currentWord
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : '_')
        .join(' ');

    hint.textContent = `Hint: ${currentHint}`;
    hangman.textContent = `Guesses left: ${remainingGuesses}`;
    
    if (remainingGuesses === 0) {
        message.textContent = `Game Over! The word was ${currentWord}`;
    }
    else if (!word.textContent.includes('_')) {
        message.textContent = 'Congratulations! You won!';

        startConfetti();
    }
    else {
        message.textContent = '';
    }
}

function createKeyboard() {
    keyboard.innerHTML = '';

    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i);
        const key = document.createElement('button');
        key.textContent = letter;
        key.classList.add('key', 'glassmorphism');
        key.addEventListener('click', () => guessLetter(letter));
        keyboard.appendChild(key);
    }
}

function guessLetter(letter) {
    if (!guessedLetters.includes(letter)) {
        guessedLetters.push(letter);
        if (!currentWord.includes(letter)) {
            remainingGuesses--;
        }
        updateDisplay();
        document.querySelector(`.key:nth-child(${letter.charCodeAt(0) - 64})`)
            .setAttribute('disabled', true);
    }
}

newGameBtn.addEventListener('click', initializeGame);

const confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;

const colors = [
    {front: 'red', back: 'darkred'},
    {front: 'green', back: 'darkgreen'},
    {front: 'blue', back: 'darkblue'},
    {front: 'yellow', back: 'darkyellow'},
    {front: 'orange', back: 'darkorange'},
    {front: 'pink', back: 'darkpink'},
    {front: 'purple', back: 'darkpurple'},
    {front: 'turquoise', back: 'darkturquoise'}
];

function initConfetti() {
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            color: colors[Math.floor(Math.random() * colors.length)],
            
            dimensions: {
                x: Math.random() * 10,
                y: Math.random() * 10,
            },
            position: {
                x: Math.random() * confettiCanvas.width,
                y: confettiCanvas.height - 1,
            },
            rotation: Math.random() * 360,
            scale: {
                x: 1,
                y: 1,
            },
            velocity: {
                x: Math.random() * 6 - 3,
                y: Math.random() * -10 - 10,
            },
        });
    }
}

function updateConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    confetti.forEach((confetto, index) => {
        const width = confetto.dimensions.x * confetto.scale.x;
        const height = confetto.dimensions.y * confetto.scale.y;

        confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
        confetto.velocity.y += gravity;
        confetto.velocity.x *= drag;
        confetto.velocity.y *= drag;
        confetto.velocity.y = Math.min(confetto.velocity.y, terminalVelocity);

        confetto.position.x += confetto.velocity.x;
        confetto.position.y += confetto.velocity.y;

        if (confetto.position.y >= confettiCanvas.height) confetti.splice(index, 1);

        ctx.translate(confetto.position.x, confetto.position.y);
        ctx.rotate(confetto.rotation * Math.PI / 180);

        ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        ctx.fillRect(-width / 2, -height / 2, width, height);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
    });
}

let confettiAnimation;

function startConfetti() {
    initConfetti();
    confettiAnimation = requestAnimationFrame(render);
}

function stopConfetti() {
    cancelAnimationFrame(confettiAnimation);
    confetti.length = 0;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

function render() {
    updateConfetti();
    confettiAnimation = requestAnimationFrame(render);
}

initializeGame();

window.addEventListener('resize', () => {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
});