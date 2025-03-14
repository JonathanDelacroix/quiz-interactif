// quizMontre.js

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
  import { questions } from "./Questions.js";
  import { generateStatistics } from "./statsMontre.js";
  
  console.log("Quiz Montre JS loaded...");
  
  // Variables globales
  let score = 0;
  let currentQuestionIndex = 0;
  let shuffledQuestions = [];
  let globalTimerId = null;
  const timeLimit = 20; // 20 secondes pour ce mode
  
  // Sélection des éléments du DOM
  const introScreen = getElement("#intro-screen");
  const questionScreen = getElement("#question-screen");
  const resultScreen = getElement("#result-screen");
  
  const startBtn = getElement("#start-btn");
  const restartBtn = getElement("#restart-btn");
  
  const questionText = getElement("#question-text");
  const answersDiv = getElement("#answers");
  const scoreText = getElement("#score-text"); // affichage du score pendant le quiz
  const timeLeftSpan = getElement("#time-left");
  // Élément pour afficher le score final dans le résultat
  const finalScoreText = getElement("#score-text-result");
  
  startBtn.addEventListener("click", startQuiz);
  restartBtn.addEventListener("click", restartQuiz);
  
  function startQuiz() {
    hideElement(introScreen);
    showElement(questionScreen);
    
    score = 0;
    currentQuestionIndex = 0;
    shuffledQuestions = shuffleArray([...questions]);
  
    setText(timeLeftSpan, timeLimit);
    
    // Démarrer le timer global de 20 secondes
    globalTimerId = startTimer(timeLimit, (timeLeft) => {
      setText(timeLeftSpan, timeLeft);
    }, () => {
      endQuiz();
    });
  
    showQuestion();
  }
  
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  function showQuestion() {
    // Si on a épuisé la liste, on la reshuffle
    if (currentQuestionIndex >= shuffledQuestions.length) {
      shuffledQuestions = shuffleArray([...questions]);
      currentQuestionIndex = 0;
    }
    
    const q = shuffledQuestions[currentQuestionIndex];
    setText(questionText, q.text);
    answersDiv.innerHTML = "";
    q.answers.forEach((answer, index) => {
      const btn = createAnswerButton(answer, () => selectAnswer(index, btn));
      answersDiv.appendChild(btn);
    });
  }
  
  function selectAnswer(index, btn) {
    const q = shuffledQuestions[currentQuestionIndex];
    if (index === q.correct) {
      score++;
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
    markCorrectAnswer(answersDiv, q.correct);
    lockAnswers(answersDiv);
    
    // Mettre à jour le score affiché pendant le quiz
    updateScoreDisplay(scoreText, score, currentQuestionIndex + 1);
    
    // Passer à la question suivante après 1 seconde
    setTimeout(() => {
      currentQuestionIndex++;
      showQuestion();
    }, 1000);
  }
  
  function endQuiz() {
    hideElement(questionScreen);
    showElement(resultScreen);
    
    // Arrêter le timer global s'il est encore actif
    clearInterval(globalTimerId);
    
    // Afficher le score final
    updateScoreDisplay(finalScoreText, score, currentQuestionIndex);
    
    // Générer et afficher les statistiques
    generateStatistics(score, currentQuestionIndex);
  }
  
  function restartQuiz() {
    hideElement(resultScreen);
    showElement(introScreen);
  }
  