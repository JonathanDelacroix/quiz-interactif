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
import { changeLanguage, savedLanguage } from "./language.js";

export { questions, score};

console.log("Quiz JS loaded...");

let currentQuestionIndex = 0;
let score = 0;
let bestScore = loadFromLocalStorage("bestScore", 0);
let timerId = null;
let questionsfilled = [];
let answersgiven = [];

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
changeLanguage(savedLanguage);
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
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showQuestion() {
  clearInterval(timerId);

  if (!window.shuffledQuestions) {
    const level1 = shuffleArray(questions.filter(q => q.level === 1));
    const level2 = shuffleArray(questions.filter(q => q.level === 2));
    const level3 = shuffleArray(questions.filter(q => q.level === 3));
    window.shuffledQuestions = [...level1, ...level2, ...level3];
  }

  const q = window.shuffledQuestions[currentQuestionIndex]; 
  const answers = q.answers;

  const answersWithIndex = answers.map((answer, index) => ({ index, answer }));
  const shuffledAnswersWithIndex = shuffleArray([...answersWithIndex]);

  setText(questionText, q.text);
  setText(currentQuestionIndexSpan, currentQuestionIndex + 1);

  answersDiv.innerHTML = "";

  shuffledAnswersWithIndex.forEach(({ index, answer }) => {
    const btn = createAnswerButton(answer, () => selectAnswer(index, q, btn));
    btn.dataset.index = index;
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

function selectAnswer(index, q, btn) {
  clearInterval(timerId);
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

  updateScoreDisplay(scoreText, score, questions.length, savedLanguage);

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
      span.style.color = "#2e7d32";
    } else {
      span.style.color = "#d32f2f";
    }

    span.innerHTML = `
      <span class="title-question">${question.text}</span>
      <span class="answer-question">Votre réponse : ${userAnswerText}</span>
      <span class="correct-answer">Solution : ${correctAnswerText}</span>
    `;

    recapsection.appendChild(span);
  });
}
