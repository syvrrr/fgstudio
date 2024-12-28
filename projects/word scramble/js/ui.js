import { GAME_CONFIG } from './config.js';
import { formatTime } from './utils.js';

export class GameUI {
  constructor() {
    this.elements = {
      wordDisplay: document.getElementById('scrambled-word'),
      input: document.getElementById('user-input'),
      startBtn: document.getElementById('start-btn'),
      nextBtn: document.getElementById('next-btn'),
      score: document.getElementById('score'),
      timer: document.getElementById('time'),
      message: document.getElementById('message'),
      hint: document.getElementById('hint-text')
    };
  }

  get startBtn() { return this.elements.startBtn; }
  get nextBtn() { return this.elements.nextBtn; }
  get input() { return this.elements.input; }

  updateWord(word) {
    this.elements.wordDisplay.textContent = word;
  }

  updateScore(score) {
    this.elements.score.textContent = score;
  }

  updateTimer(time) {
    this.elements.timer.textContent = formatTime(time);
  }

  updateHint(hint) {
    this.elements.hint.textContent = `Hint: ${hint}`;
  }

  getInput() {
    return this.elements.input.value;
  }

  clearInput() {
    this.elements.input.value = '';
    this.elements.input.focus();
  }

  showFeedback(text, type) {
    this.elements.message.textContent = text;
    this.elements.message.className = `message ${type}`;
    
    setTimeout(() => {
      this.elements.message.textContent = '';
      this.elements.message.className = 'message';
    }, GAME_CONFIG.FEEDBACK_DURATION);
  }

  updateGameState(state, finalScore = 0) {
    switch (state) {
      case 'playing':
        this.elements.startBtn.textContent = 'Playing...';
        this.elements.startBtn.disabled = true;
        this.elements.input.disabled = false;
        this.elements.nextBtn.disabled = false;
        break;
      case 'ended':
        this.elements.wordDisplay.textContent = 'GAME OVER!';
        this.elements.input.disabled = true;
        this.elements.nextBtn.disabled = true;
        this.elements.startBtn.textContent = 'Play Again';
        this.elements.startBtn.disabled = false;
        this.elements.hint.textContent = '';
        this.showFeedback(`Final Score: ${finalScore}`, 'success');
        break;
    }
  }
}