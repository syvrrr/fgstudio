export function scrambleWord(word) {
  const array = word.split('');
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

export function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function formatTime(seconds) {
  return `${seconds}s`;
}