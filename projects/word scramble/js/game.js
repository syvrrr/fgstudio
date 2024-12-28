import { GAME_CONFIG } from './config.js';
import { wordList } from './words.js';
import { scrambleWord, getRandomItem } from './utils.js';

export class WordScrambleGame {
  constructor(ui) {
    this.ui = ui;
    this.currentWord = '';
    this.scrambledWord = '';
    this.score = 0;
    this.timeLeft = GAME_CONFIG.INITIAL_TIME;
    this.timer = null;
    this.isPlaying = false;
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    this.ui.startBtn.addEventListener('click', () => this.startGame());
    this.ui.nextBtn.addEventListener('click', () => this.nextWord());

    this.ui.input.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' && this.isPlaying) {
        this.checkAnswer();
      }
    });
  }

  startGame() {
    this.isPlaying = true;
    this.score = 0;
    this.timeLeft = GAME_CONFIG.INITIAL_TIME;
    this.ui.updateScore(this.score);
    this.ui.updateGameState('playing');
    
    this.nextWord();
    this.startTimer();
  }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.ui.updateTimer(this.timeLeft);

      if (this.timeLeft === 0) {
        this.endGame();
      }
    }, 1000);
  }

  nextWord() {
    const wordData = getRandomItem(wordList);
    this.currentWord = wordData.word;
    
    do {
      this.scrambledWord = scrambleWord(this.currentWord);
    }
    while (this.scrambledWord === this.currentWord);
    
    this.ui.updateWord(this.scrambledWord);
    this.ui.updateHint(wordData.hint);
    this.ui.clearInput();
  }

  checkAnswer() {
    const userAnswer = this.ui.getInput().toUpperCase();
    
    if (userAnswer === this.currentWord) {
      this.score += GAME_CONFIG.POINTS_PER_WORD;
      this.ui.updateScore(this.score);
      this.ui.showFeedback('Correct! +10 points', 'success');
      this.nextWord();
    }
    else {
      this.ui.showFeedback('Try again!', 'error');
    }
  }

  endGame() {
    this.isPlaying = false;
    clearInterval(this.timer);
    this.ui.updateGameState('ended', this.score);
  }
}