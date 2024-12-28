const words = [
  { word: 'PYTHON', hint: 'A versatile programming language' },
  { word: 'COMPILER', hint: 'Translates code into machine language' },
  { word: 'DEBUGGING', hint: 'Fixing errors in code' },
  { word: 'ENCRYPTION', hint: 'Securing information by encoding' },
  { word: 'CLOUD', hint: 'Remote servers accessed via the internet' },
  { word: 'GITHUB', hint: 'Platform for version control and collaboration' },
  { word: 'BOOLEAN', hint: 'Logical data type with true or false' },
  { word: 'ARRAY', hint: 'Data structure storing elements in a sequence' },
  { word: 'LOOP', hint: 'Repetition structure in programming' },
  { word: 'RECURSION', hint: 'Function calling itself' },
  { word: 'MODULE', hint: 'Reusable piece of code' },
  { word: 'OBJECT', hint: 'Instance of a class in OOP' },
  { word: 'CLASS', hint: 'Blueprint for creating objects' },
  { word: 'METHOD', hint: 'Function associated with an object' },
  { word: 'PACKAGE', hint: 'Collection of related modules' },
  { word: 'FRAME', hint: 'Rectangular region on a webpage' },
  { word: 'CACHE', hint: 'Temporary storage for fast access' },
  { word: 'BIT', hint: 'Smallest unit of data in a computer' },
  { word: 'BYTE', hint: 'Group of 8 bits' },
  { word: 'OPERATING', hint: 'System that manages hardware and software' },
  { word: 'PROCESSOR', hint: 'Brain of the computer' },
  { word: 'TERMINAL', hint: 'Command-line interface' },
  { word: 'BROWSER', hint: 'Software for accessing the internet' },
  { word: 'INDEX', hint: 'Position of an item in an array' },
  { word: 'TOKEN', hint: 'Unit of code in a programming language' },
  { word: 'QUEUE', hint: 'Data structure following FIFO' },
  { word: 'STACK', hint: 'Data structure following LIFO' },
  { word: 'ALERT', hint: 'Popup message in a browser' },
  { word: 'ASYNC', hint: 'Non-blocking programming paradigm' },
  { word: 'PROMISE', hint: 'Represents a value that will be available in the future' },
  { word: 'EVENT', hint: 'User interaction or system trigger' },
  { word: 'CLOSURE', hint: 'Function bundled with its lexical scope' },
  { word: 'CONSTRUCTOR', hint: 'Special method for object initialization' },
  { word: 'POLYMORPHISM', hint: 'Ability of objects to take many forms' },
  { word: 'INHERITANCE', hint: 'Mechanism to derive new classes' },
  { word: 'ABSTRACTION', hint: 'Hiding complex implementation details' },
  { word: 'ENCAPSULATION', hint: 'Restricting access to internal details' },
  { word: 'API', hint: 'Set of tools for building software' },
  { word: 'ENDPOINT', hint: 'URL for accessing a specific API resource' },
  { word: 'JSON', hint: 'Data format for APIs' },
  { word: 'XML', hint: 'Markup language for structured data' },
  { word: 'AUTHENTICATION', hint: 'Verifying user identity' },
  { word: 'SESSION', hint: 'Temporary interaction between user and system' },
  { word: 'COOKIE', hint: 'Small data stored in a browser' },
  { word: 'WEBHOOK', hint: 'Event-driven communication mechanism' },
  { word: 'SANDBOX', hint: 'Isolated environment for testing' },
  { word: 'THREAD', hint: 'Smallest sequence of programmed instructions' },
  { word: 'CONCURRENCY', hint: 'Multiple tasks in progress simultaneously' },
  { word: 'PARALLELISM', hint: 'Simultaneous execution of tasks' },
  { word: 'DATASET', hint: 'Collection of data' },
  { word: 'MODEL', hint: 'Representation of a concept in machine learning' },
  { word: 'TRAINING', hint: 'Process of teaching a model' },
  { word: 'OVERFITTING', hint: 'Model too tailored to training data' },
  { word: 'NEURAL', hint: 'Network inspired by the human brain' },
  { word: 'CLASSIFICATION', hint: 'Categorizing data into classes' },
  { word: 'REGRESSION', hint: 'Predicting continuous values' },
  { word: 'SUPERVISED', hint: 'Learning with labeled data' },
  { word: 'UNSUPERVISED', hint: 'Learning without labeled data' },
  { word: 'CLUSTERING', hint: 'Grouping similar items together' },
  { word: 'OPTIMIZATION', hint: 'Improving performance' },
  { word: 'SEARCH', hint: 'Finding information in data' },
  { word: 'HASH', hint: 'Unique fixed-length value' },
  { word: 'SORTING', hint: 'Arranging data in order' },
  { word: 'MERGE', hint: 'Combining data sets' },
  { word: 'SHELL', hint: 'Interface to access operating system services' },
  { word: 'BASH', hint: 'Command-line shell for Unix' },
  { word: 'SCRIPT', hint: 'Automated sequence of commands' },
  { word: 'VERSION', hint: 'Control for managing code changes' },
  { word: 'REPOSITORY', hint: 'Storage for code and files' },
  { word: 'BRANCH', hint: 'Parallel version of a repository' },
  { word: 'MERGE', hint: 'Combining branches in version control' },
  { word: 'PULL', hint: 'Fetching updates from a repository' },
  { word: 'PUSH', hint: 'Sending changes to a repository' },
  { word: 'FORLOOP', hint: 'Loop with a defined iteration range' },
  { word: 'WHILELOOP', hint: 'Loop with a condition' },
  { word: 'NULL', hint: 'Represents no value' },
  { word: 'UNDEFINED', hint: 'Variable declared but not assigned' },
  { word: 'CALLBACK', hint: 'Function passed as an argument' },
  { word: 'HOISTING', hint: 'Moving declarations to the top' },
  { word: 'PROTO', hint: 'Property of every object' },
  { word: 'DOM', hint: 'Document Object Model for web pages' },
  { word: 'SELECTOR', hint: 'CSS rule for targeting elements' },
  { word: 'GRID', hint: 'CSS layout system' },
  { word: 'FLEXBOX', hint: 'CSS layout for flexible designs' },
  { word: 'MEDIAQUERY', hint: 'CSS rules for different devices' },
  { word: 'SVG', hint: 'Scalable Vector Graphics' },
  { word: 'CANVAS', hint: 'HTML element for drawing' },
  { word: 'WEBPACK', hint: 'Module bundler for JavaScript' },
  { word: 'BABEL', hint: 'Transpiler for JavaScript' },
  { word: 'NODEJS', hint: 'JavaScript runtime for backend' },
  { word: 'EXPRESS', hint: 'Framework for Node.js' },
  { word: 'REACT', hint: 'JavaScript library for UI development' },
  { word: 'ANGULAR', hint: 'Framework for building web apps' },
  { word: 'VUE', hint: 'JavaScript framework for building UI' },
  { word: 'MONGODB', hint: 'NoSQL database' },
  { word: 'POSTGRESQL', hint: 'Relational database' },
  { word: 'SQLITE', hint: 'Lightweight database' },
  { word: 'REDIS', hint: 'In-memory data store' }
];

let currentWord = '';
let scrambledWord = '';
let score = 0;
let timeLeft = 60;
let timer = null;
let isPlaying = false;

const scrambledWordEl = document.getElementById('scrambled-word');
const userInputEl = document.getElementById('user-input');
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const messageEl = document.getElementById('message');
const hintEl = document.getElementById('hint-text');

function scrambleWord(word) {
  const array = word.split('');
  
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  currentWord = words[randomIndex].word;
  hintEl.textContent = `Hint: ${words[randomIndex].hint}`;
  
  do {
    scrambledWord = scrambleWord(currentWord);
  }
  while (scrambledWord === currentWord);
  
  scrambledWordEl.textContent = scrambledWord;
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;

  setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'message';
  }, 2000);
}

function updateTimer() {
  timeEl.textContent = timeLeft;

  if (timeLeft === 0) {
    endGame();
  }
}

function startGame() {
  isPlaying = true;
  score = 0;
  timeLeft = 60;
  scoreEl.textContent = score;
  startBtn.textContent = 'Playing...';
  startBtn.disabled = true;
  userInputEl.disabled = false;
  nextBtn.disabled = false;
  
  getRandomWord();
  userInputEl.value = '';
  userInputEl.focus();
  
  timer = setInterval(() => {
    timeLeft--;
    
    updateTimer();
  }, 1000);
}

function endGame() {
  isPlaying = false;
  clearInterval(timer);
  scrambledWordEl.textContent = 'GAME OVER!';
  userInputEl.disabled = true;
  nextBtn.disabled = true;
  startBtn.textContent = 'Play Again';
  startBtn.disabled = false;
  showMessage(`Final Score: ${score}`, 'success');
  hintEl.textContent = '';
}

function checkAnswer() {
  const userAnswer = userInputEl.value.toUpperCase();
  
  if (userAnswer === currentWord) {
    score += 10;
    scoreEl.textContent = score;
    showMessage('Correct! +10 points', 'success');
    getRandomWord();
    userInputEl.value = '';
  }
  else {
    showMessage('Try again!', 'error');
  }
}

startBtn.addEventListener('click', startGame);

nextBtn.addEventListener('click', () => {
  getRandomWord();
  userInputEl.value = '';
  userInputEl.focus();
});

userInputEl.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' && isPlaying) {
    checkAnswer();
  }
});

userInputEl.disabled = true;
nextBtn.disabled = true;