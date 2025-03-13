// quiz.js
import {
  getElement,
  showElement,
  hideElement,
  setText,
  createAnswerButton,
  updateScoreDisplay,
  lockAnswers,
  markCorrectAnswer,
} from "./dom.js";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  startTimer,
} from "./utils.js";
import {
  getAnswerQuestion
} from "./recap.js"

console.log("Quiz JS loaded...");

const questions = [
  {
    text: "Quelle est la capitale de la France ?",
    answers: ["Marseille", "Paris", "Lyon", "Bordeaux"],
    correct: 1,
    timeLimit: 10,
  },
  {
    text: "Combien font 2 + 3 ?",
    answers: ["3", "4", "5", "1"],
    correct: 2,
    timeLimit: 5,
  },
];

let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let timerId = null;
let questionsfilled = [];
let answersgiven = [];

// DOM Elements
const introScreen = getElement("#intro-screen");
const questionScreen = getElement("#question-screen");
const resultScreen = getElement("#result-screen");

const bestScoreValue = getElement("#best-score-value");
const bestScoreEnd = getElement("#best-score-end");

const questionText = getElement("#question-text");
const answersDiv = getElement("#answers");
const nextBtn = getElement("#next-btn");
const startBtn = getElement("#start-btn");
const restartBtn = getElement("#restart-btn");

const scoreText = getElement("#score-text");
const timeLeftSpan = getElement("#time-left");

const currentQuestionIndexSpan = getElement("#current-question-index");
const totalQuestionsSpan = getElement("#total-questions");
const recapsection = getElement("#recap-questions")

// Init
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", restartQuiz);

setText(bestScoreValue, bestScore);

function startQuiz() {
  hideElement(introScreen);
  showElement(questionScreen);

  currentQuestionIndex = 0;
  score = 0;
  questionsfilled = []

  setText(totalQuestionsSpan, questions.length);

  showQuestion();
}

function showQuestion() {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  setText(questionText, q.text);
  setText(currentQuestionIndexSpan, currentQuestionIndex + 1);

  answersDiv.innerHTML = "";
  q.answers.forEach((answer, index) => {
    const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
    answersDiv.appendChild(btn);
  });

  nextBtn.classList.add("hidden");

  timeLeftSpan.textContent = q.timeLimit;
  timerId = startTimer(
    q.timeLimit,
    (timeLeft) => setText(timeLeftSpan, timeLeft),
    () => {
      lockAnswers(answersDiv);
      nextBtn.classList.remove("hidden");
    }
  );
}

function selectAnswer(index, btn) {
  clearInterval(timerId);

  const q = questions[currentQuestionIndex];
  if (index === q.correct) {
    score++;
    btn.classList.add("correct");
  } else {
    btn.classList.add("wrong");
  }
  answersgiven.push(index);
  questionsfilled.push({ ...q });
  markCorrectAnswer(answersDiv, q.correct);
  lockAnswers(answersDiv);
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  hideElement(questionScreen);
  showElement(resultScreen);

  updateScoreDisplay(scoreText, score, questions.length);

  if (score > bestScore) {
    bestScore = score;
    saveToLocalStorage("bestScore", bestScore);
  }
  setText(bestScoreEnd, bestScore);
  let recap = getAnswerQuestion(questionsfilled);
  startrecap(recap, recapsection, answersgiven);
}

function restartQuiz() {
  hideElement(resultScreen);
  showElement(introScreen);

  answersgiven = [];
  questionsfilled = [];

  recapsection.innerHTML = "";
  recapsection.style.display = "none";

  setText(bestScoreValue, bestScore);
}


function startrecap(recap, recapsection, answersgiven) {
  recapsection.innerHTML = "";
  recapsection.style.display = "flex";

  questionsfilled.forEach((question, idx) => {
    const userAnswerIndex = answersgiven[idx]; // Index of the answer the user chose
    const correctAnswerIndex = question.correct; // Index of the correct answer

    const userAnswerText = question.answers[userAnswerIndex];
    const correctAnswerText = question.answers[correctAnswerIndex];

    const span = document.createElement("span");
    span.classList.add("recap-question");

    // Apply correct/incorrect styling based on index comparison
    if (userAnswerIndex === correctAnswerIndex) {
      span.style.backgroundColor = "#2e7d32"; // Green for correct
      span.style.color = "#ffffff"; // White text for better readability
    } else {
      span.style.backgroundColor = "#d32f2f"; // Red for incorrect
      span.style.color = "#ffffff"; // White text for better readability
    }

    span.innerHTML = `
      <span class="title-question">${question.text}</span>
      <span class="answer-question">Your answer: ${userAnswerText}</span>
      <span class="correct-answer">(Correct: ${correctAnswerText})</span>
    `;

    recapsection.appendChild(span);
  });
}
