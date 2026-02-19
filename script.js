const quizData = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correct: 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Monet"],
    correct: 2
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correct: 3
  }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let timer = 30;
let timerInterval = null;
let playerName = '';

window.onload = function() {
  loadLeaderboard();
};

function startQuiz() {
  playerName = document.getElementById('playerName').value.trim();
  
  if (!playerName) {
    alert('Please enter your name!');
    return;
  }
  
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  
  document.getElementById('quiz-start').classList.remove('active');
  document.getElementById('quiz-screen').classList.add('active');
  
  loadQuestion();
}

function loadQuestion() {
  // Clear any existing timer first
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  const question = quizData[currentQuestion];
  
  document.getElementById('current-question').textContent = currentQuestion + 1;
  document.getElementById('total-questions').textContent = quizData.length;
  document.getElementById('score').textContent = score;
  document.getElementById('question').textContent = question.question;
  
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option';
    optionDiv.textContent = option;
    optionDiv.onclick = () => selectAnswer(index);
    optionsContainer.appendChild(optionDiv);
  });
  
  document.getElementById('next-btn').style.display = 'none';
  selectedAnswer = null;
  
  // Start timer after everything is set up
  setTimeout(() => startTimer(), 100);
}

function startTimer() {
  timer = 30;
  document.getElementById('timer').textContent = timer;
  
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  timerInterval = setInterval(() => {
    timer--;
    document.getElementById('timer').textContent = timer;
    
    if (timer <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      if (selectedAnswer === null) {
        autoSelectWrong();
      }
    }
  }, 1000);
}

function autoSelectWrong() {
  const question = quizData[currentQuestion];
  const options = document.querySelectorAll('.option');
  
  options.forEach(opt => opt.classList.add('disabled'));
  options[question.correct].classList.add('correct');
  
  document.getElementById('next-btn').style.display = 'block';
  selectedAnswer = -1;
}

function selectAnswer(index) {
  if (selectedAnswer !== null) return;
  
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  selectedAnswer = index;
  const question = quizData[currentQuestion];
  const options = document.querySelectorAll('.option');
  
  options.forEach(opt => opt.classList.add('disabled'));
  
  if (index === question.correct) {
    options[index].classList.add('correct');
    score += 10;
    document.getElementById('score').textContent = score;
  } else {
    options[index].classList.add('wrong');
    options[question.correct].classList.add('correct');
  }
  
  document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
  currentQuestion++;
  
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    clearInterval(timerInterval);
    showResults();
  }
}

function showResults() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  document.getElementById('quiz-screen').classList.remove('active');
  document.getElementById('result-screen').classList.add('active');
  
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-total').textContent = quizData.length * 10;
  
  const percentage = (score / (quizData.length * 10)) * 100;
  let message = '';
  
  if (percentage === 100) {
    message = 'Perfect! You got all answers correct! 🎉';
  } else if (percentage >= 80) {
    message = 'Excellent! Great job! 👏';
  } else if (percentage >= 60) {
    message = 'Good work! Keep practicing! 👍';
  } else {
    message = 'Keep trying! You can do better! 💪';
  }
  
  document.getElementById('result-message').textContent = message;
  
  saveToLeaderboard();
}

function saveToLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
  
  leaderboard.push({
    name: playerName,
    score: score,
    date: new Date().toLocaleDateString()
  });
  
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);
  
  localStorage.setItem('quizLeaderboard', JSON.stringify(leaderboard));
  loadLeaderboard();
}

function loadLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('quizLeaderboard')) || [];
  const list = document.getElementById('leaderboard-list');
  
  if (leaderboard.length === 0) {
    list.innerHTML = '<li style="text-align:center;color:#999;">No scores yet</li>';
    return;
  }
  
  list.innerHTML = leaderboard.map((entry, index) => `
    <li>
      <span>${index + 1}. ${entry.name}</span>
      <span>${entry.score} pts</span>
    </li>
  `).join('');
}

function restartQuiz() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  currentQuestion = 0;
  score = 0;
  selectedAnswer = null;
  timer = 30;
  
  document.getElementById('result-screen').classList.remove('active');
  document.getElementById('quiz-start').classList.add('active');
  document.getElementById('playerName').value = '';
  loadLeaderboard();
}
