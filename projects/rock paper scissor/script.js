const choices = ['rock', 'paper', 'scissors'];
const emojis = { rock: '✊', paper: '✋', scissors: '✌️' };
const winConditions = { rock: 'scissors', paper: 'rock', scissors: 'paper' };

let playerScore = 0;
let computerScore = 0;

function createBubbles() {
    const background = document.getElementById('background');
    
    for (let i = 0; i < 50; i++) {
        const bubble = document.createElement('div');
        const size = Math.random() * 100 + 20;
        
        bubble.classList.add('bubble');
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}vw`;
        bubble.style.animationDuration = `${Math.random() * 20 + 10}s`;
        bubble.style.animationDelay = `${Math.random() * -20}s`;
        
        const [r, g, b] = [
            Math.random() * 100 + 100,
            Math.random() * 100 + 100,
            Math.random() * 100 + 100
        ].map(Math.floor);
        
        bubble.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.1)`;

        background.appendChild(bubble);
    }
}

function computerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(player, computer) {
    if (player === computer) return 'Tie!';
    return winConditions[player] === computer ? 'You Win! 🎉' : 'Computer Wins! 🤖';
}

function playGame(playerSelection) {
    const computerSelection = computerChoice();
    const result = determineWinner(playerSelection, computerSelection);
    
    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = `
        ${emojis[playerSelection]} vs ${emojis[computerSelection]}
        <br>${result}
    `;
    
    if (result.includes('You Win')) {
        document.getElementById('player-score').textContent = ++playerScore;
    }
    else if (result.includes('Computer Wins')) {
        document.getElementById('computer-score').textContent = ++computerScore;
    }
    
    resultContainer.classList.add('result-container');
}

createBubbles();