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

import { questions } from "./Questions.js";
import { generateStatistics } from "./stats.js";

export { questions, score};


console.log("Quiz JS loaded...");


let currentQuestionStartTime = 0;
export let timesPerQuestion = [];
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

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  clearInterval(timerId);

  currentQuestionStartTime = Date.now();
  if (!window.shuffledQuestions) {
    window.shuffledQuestions = shuffleArray([...questions]);
  }

  const q = window.shuffledQuestions[currentQuestionIndex]; 
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

       // Lorsque le temps est écoulé, enregistrer le temps écoulé
       const timeTaken = (Date.now() - currentQuestionStartTime) / 1000;
       timesPerQuestion.push(timeTaken);
      lockAnswers(answersDiv);
      nextBtn.classList.remove("hidden");
    }
  );
}


function selectAnswer(index, btn) {
  clearInterval(timerId);


 // Calcul du temps passé sur la question
 const timeTaken = (Date.now() - currentQuestionStartTime) / 1000;
 timesPerQuestion.push(timeTaken);

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
  generateStatistics();
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
    const userAnswerIndex = answersgiven[idx];
    const correctAnswerIndex = question.correct; 

    const userAnswerText = question.answers[userAnswerIndex];
    const correctAnswerText = question.answers[correctAnswerIndex];

    const span = document.createElement("span");
    span.classList.add("recap-question");

    
    if (userAnswerIndex === correctAnswerIndex) {
      span.style.backgroundColor = "#2e7d32"; 
      span.style.color = "#ffffff"; 
    } else {
      span.style.backgroundColor = "#d32f2f"; 
      span.style.color = "#ffffff"; 
    }

    span.innerHTML = `
      <span class="title-question">${question.text}</span>
      <span class="answer-question">Your answer: ${userAnswerText}</span>
      <span class="correct-answer">(Correct: ${correctAnswerText})</span>
    `;

    recapsection.appendChild(span);
  });
}
