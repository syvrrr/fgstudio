const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainer = document.getElementById('question-container')
const questionElement = document.getElementById('question-text')
const answerButtonsElement = document.getElementById('answer-buttons')
const scoreElement = document.getElementById('score')
const scoreContainer = document.getElementById('score-container')
const progressBar = document.getElementById('progress')

let shuffledQuestions, currentQuestionIndex, score

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++

    setNextQuestion()
})

function startGame() {
    startButton.classList.add('hidden')
    shuffledQuestions = questions.sort(() => Math.random() - 0.5)
    currentQuestionIndex = 0
    score = 0
    questionContainer.classList.remove('hidden')
    scoreContainer.classList.remove('hidden')

    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
    updateProgressBar()
}

function showQuestion(question) {
    questionElement.innerText = question.question
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        button.style.animationDelay = `${index * 0.1}s`

        if (answer.correct) {
            button.dataset.correct = answer.correct
        }

        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hidden')

    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    setStatusClass(document.body, correct)
    
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
        button.disabled = true
    })

    if (correct) {
        score++
        scoreElement.innerText = score
        scoreElement.style.animation = 'pulse 0.5s'
        setTimeout(() => {
            scoreElement.style.animation = ''
        }, 500)
    }
    
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hidden')
    }
    else {
        startButton.innerText = 'Restart'
        startButton.classList.remove('hidden')
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    
    if (correct) {
        element.classList.add('correct')
    }
    else{
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct')
    element.classList.remove('wrong')
}

function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100
    progressBar.style.width = `${progress}%`
}

const questions = [
    {
        question: 'What is the square root of 64?',
        answers: [
            { text: '8', correct: true },
            { text: '6', correct: false },
            { text: '10', correct: false },
            { text: '7', correct: false }
        ]
    },
    {
        question: 'Who wrote the play "Romeo and Juliet"?',
        answers: [
            { text: 'Oscar Wilde', correct: false },
            { text: 'Jane Austen', correct: false },
            { text: 'William Shakespeare', correct: true },
            { text: 'Mark Twain', correct: false }
        ]
    },
    {
        question: 'What is the smallest unit of matter?',
        answers: [
            { text: 'Atom', correct: true },
            { text: 'Molecule', correct: false },
            { text: 'Electron', correct: false },
            { text: 'Proton', correct: false }
        ]
    },
    {
        question: 'Which country is known as the Land of the Rising Sun?',
        answers: [
            { text: 'South Korea', correct: false },
            { text: 'Japan', correct: true },
            { text: 'China', correct: false },
            { text: 'Thailand', correct: false }
        ]
    },
    {
        question: 'What is the hardest natural substance on Earth?',
        answers: [
            { text: 'Gold', correct: false },
            { text: 'Iron', correct: false },
            { text: 'Platinum', correct: false },
            { text: 'Diamond', correct: true },
        ]
    },
    {
        question: 'Which gas do plants absorb from the atmosphere?',
        answers: [
            { text: 'Oxygen', correct: false },
            { text: 'Carbon Dioxide', correct: true },
            { text: 'Nitrogen', correct: false },
            { text: 'Hydrogen', correct: false }
        ]
    },
    {
        question: 'What is the longest river in the world?',
        answers: [
            { text: 'Nile', correct: true },
            { text: 'Amazon', correct: false },
            { text: 'Yangtze', correct: false },
            { text: 'Mississippi', correct: false }
        ]
    },
    {
        question: 'Which planet is the hottest in the solar system?',
        answers: [
            { text: 'Mars', correct: false },
            { text: 'Jupiter', correct: false },
            { text: 'Venus', correct: true },
            { text: 'Mercury', correct: false },
        ]
    },
    {
        question: 'Who developed the theory of relativity?',
        answers: [
            { text: 'Isaac Newton', correct: false },
            { text: 'Galileo Galilei', correct: false },
            { text: 'Albert Einstein', correct: true },
            { text: 'Nikola Tesla', correct: false }
        ]
    },
    {
        question: 'What is the capital of Australia?',
        answers: [
            { text: 'Canberra', correct: true },
            { text: 'Sydney', correct: false },
            { text: 'Melbourne', correct: false },
            { text: 'Brisbane', correct: false }
        ]
    }
];