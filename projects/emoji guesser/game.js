const emojiData = {
    easy: [
        { emoji: "🐶", options: ["Dog", "Wolf", "Fox", "Cat"] },
        { emoji: "🍕", options: ["Pizza", "Pie", "Bread", "Cake"] },
        { emoji: "🚗", options: ["Car", "Bus", "Truck", "Train"] },
        { emoji: "🎮", options: ["Game Controller", "Remote", "Phone", "TV"] },
        { emoji: "🌺", options: ["Flower", "Tree", "Plant", "Leaf"] },
        { emoji: "🍔", options: ["Burger", "Sandwich", "Pizza", "Fries"] },
        { emoji: "🌈", options: ["Rainbow", "Sky", "Cloud", "Bridge"] },
        { emoji: "🐸", options: ["Frog", "Toad", "Lizard", "Snake"] },
        { emoji: "🦋", options: ["Butterfly", "Bee", "Dragonfly", "Moth"] },
        { emoji: "🍩", options: ["Donut", "Bagel", "Croissant", "Cupcake"] },
        { emoji: "🎂", options: ["Cake", "Pie", "Ice Cream", "Bread"] },
        { emoji: "🛵", options: ["Scooter", "Bike", "Car", "Truck"] },
        { emoji: "🐱", options: ["Cat", "Lion", "Tiger", "Panther"] },
        { emoji: "🐢", options: ["Turtle", "Frog", "Snake", "Lizard"] }
    ],

    medium: [
        { emoji: "🌋", options: ["Volcano", "Mountain", "Hill", "Cave"] },
        { emoji: "🎨", options: ["Paint Palette", "Canvas", "Brush", "Pencil"] },
        { emoji: "🎭", options: ["Theater Masks", "Face", "Costume", "Party"] },
        { emoji: "🎯", options: ["Dartboard", "Target", "Circle", "Wheel"] },
        { emoji: "🐘", options: ["Elephant", "Hippo", "Rhino", "Horse"] },
        { emoji: "🍒", options: ["Cherry", "Apple", "Grape", "Strawberry"] },
        { emoji: "🛶", options: ["Canoe", "Boat", "Ship", "Raft"] },
        { emoji: "🍿", options: ["Popcorn", "Chips", "Candy", "Nuts"] },
        { emoji: "🌌", options: ["Galaxy", "Stars", "Universe", "Aurora"] },
        { emoji: "🎷", options: ["Saxophone", "Trumpet", "Flute", "Violin"] },
        { emoji: "🦍", options: ["Gorilla", "Monkey", "Chimpanzee", "Bear"] },
        { emoji: "🥝", options: ["Kiwi", "Melon", "Grape", "Apple"] },
        { emoji: "🐍", options: ["Snake", "Lizard", "Worm", "Dragon"] }
    ],

    hard: [
        { emoji: "🎎", options: ["Japanese Dolls", "Toys", "Figures", "Statues"] },
        { emoji: "🛡️", options: ["Shield", "Armor", "Sword", "Helmet"] },
        { emoji: "🌌", options: ["Galaxy", "Stars", "Aurora", "Milky Way"] },
        { emoji: "🐉", options: ["Dragon", "Lizard", "Dinosaur", "Snake"] },
        { emoji: "🥥", options: ["Coconut", "Palm", "Melon", "Nut"] },
        { emoji: "🦓", options: ["Zebra", "Horse", "Donkey", "Giraffe"] }
    ]
};

let currentEmoji = null;
let score = 0;
let timeLeft = 60;
let timer = null;
let currentDiffi = 'easy';
let streak = 0;

let highScores = JSON.parse(localStorage.getItem('emojiHighScores')) || {
    easy: [],
    medium: [],
    hard: []
};

const emojiDisplay = document.getElementById("emoji");
const optionsContainer = document.getElementById("options");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const feedbackDisplay = document.getElementById("feedback");
const streakDisplay = document.getElementById("streak");
const highScoreDisplay = document.getElementById("highScore");
const highScoresContainer = document.getElementById("highScoresContainer");
const highScoresList = document.getElementById("highScoresList");

function updateHighScoreDisplay() {
    const currentHighScores = highScores[currentDiffi];
    const highestScore = currentHighScores.length > 0 ? currentHighScores[0].score : 0;
    highScoreDisplay.textContent = highestScore;
}

function updateHighScores(newScore) {
    const currentHighScores = highScores[currentDiffi];
    const isNewHighScore = currentHighScores.length < 5 || newScore > currentHighScores[currentHighScores.length - 1].score;
    
    if (isNewHighScore) {
        const date = new Date().toLocaleDateString();
        currentHighScores.push({ score: newScore, date: date });
        currentHighScores.sort((a, b) => b.score - a.score);

        if (currentHighScores.length > 5) {
            currentHighScores.pop();
        }
        
        highScores[currentDiffi] = currentHighScores;
        localStorage.setItem('emojiHighScores', JSON.stringify(highScores));
        
        const newHighScoreMsg = document.createElement('div');
        newHighScoreMsg.className = 'new-high-score';
        newHighScoreMsg.textContent = 'New High Score!!';

        feedbackDisplay.appendChild(newHighScoreMsg);
    }
    
    displayHighScores();
}

function displayHighScores() {
    highScoresList.innerHTML = '';
    const currentHighScores = highScores[currentDiffi];
    
    currentHighScores.forEach((scoreData, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>#${index + 1}</span>
            <span>${scoreData.score}</span>
            <span>${scoreData.date}</span>
        `;

        highScoresList.appendChild(li);
    });
    
    highScoresContainer.classList.add('show');
}

document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        
        e.target.classList.add('active');
        currentDiffi = e.target.dataset.difficulty;

        updateHighScoreDisplay();
        restartGame();
    });
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

function displayNewEmoji() {
    const difficultyData = emojiData[currentDiffi];
    currentEmoji = difficultyData[Math.floor(Math.random() * difficultyData.length)];
    emojiDisplay.textContent = currentEmoji.emoji;
    
    optionsContainer.innerHTML = "";
    const shuffledOptions = shuffleArray([...currentEmoji.options]);
    
    shuffledOptions.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.addEventListener("click", () => checkAnswer(option));
        optionsContainer.appendChild(button);
    });
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });
}

function checkAnswer(selectedOption) {
    const difficultyMultiplier = {
        easy: 1,
        medium: 2,
        hard: 3
    };

    if (selectedOption === currentEmoji.options[0]) {
        const basePoints = 10;
        const streakBonus = Math.min(streak * 2, 20);
        const difficultyBonus = basePoints * difficultyMultiplier[currentDiffi];
        const totalPoints = difficultyBonus + streakBonus;

        score += totalPoints;
        streak++;
        scoreDisplay.textContent = score;
        feedbackDisplay.textContent = `Correct! +${totalPoints} points`;
        streakDisplay.textContent = streak > 1 ? `Streak: ${streak}! (${streakBonus} bonus points)` : '';
        feedbackDisplay.className = "feedback correct";

        triggerConfetti();
    }
    else {
        streak = 0;
        feedbackDisplay.textContent = "Wrong! Try again";
        feedbackDisplay.className = "feedback incorrect";
        streakDisplay.textContent = '';
    }
    
    setTimeout(() => {
        feedbackDisplay.textContent = "";

        displayNewEmoji();
    }, 1000);
}

function updateTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        clearInterval(timer);
        optionsContainer.innerHTML = `
            <button style="grid-column: span 2" onclick="restartGame()">
                Play Again
            </button>
        `;

        emojiDisplay.textContent = "🎯";
        feedbackDisplay.textContent = `Game Over! Final Score: ${score}`;
        feedbackDisplay.className = "feedback";
        
        updateHighScores(score);
        updateHighScoreDisplay();
    }
}

function restartGame() {
    score = 0;
    streak = 0;
    timeLeft = 60;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;
    feedbackDisplay.textContent = "";
    streakDisplay.textContent = "";
    highScoresContainer.classList.remove('show');

    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    
    displayNewEmoji();
    updateHighScoreDisplay();
}

updateHighScoreDisplay();
restartGame();