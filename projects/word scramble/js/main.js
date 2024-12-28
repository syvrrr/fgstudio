import { WordScrambleGame } from './game.js';
import { GameUI } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const ui = new GameUI();
  new WordScrambleGame(ui);
});