// quizTheme.js
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
  } from "./recap.js";

  import { questions } from "./Questions.js";
//import { generateStatistics } from "./statsTheme.js";
  
  console.log("Quiz Theme JS loaded...");
  
  let currentQuestionIndex = 0;
  export let score = 0;
  let bestScore = loadFromLocalStorage("bestScoreTheme", 0);
  let timerId = null;
  let questionsfilled = [];
  let answersgiven = [];
  let currentTheme = "";
  let themeQuestions = [];
  
  // DOM Elements
  const themeScreen = getElement("#theme-screen");
  const questionScreen = getElement("#question-screen");
  const resultScreen = getElement("#result-screen");
  const themeButtons = getElement("#theme-buttons");
  
  const bestScoreEnd = getElement("#best-score-end");
  
  const questionText = getElement("#question-text");
  const answersDiv = getElement("#answers");
  const nextBtn = getElement("#next-btn");
  const restartBtn = getElement("#restart-btn");
  
  const scoreText = getElement("#score-text");
  const timeLeftSpan = getElement("#time-left");
  
  const currentQuestionIndexSpan = getElement("#current-question-index");
  const totalQuestionsSpan = getElement("#total-questions");
  const recapsection = getElement("#recap-questions");
  
  // Init
  nextBtn.addEventListener("click", nextQuestion);
  restartBtn.addEventListener("click", restartQuiz);
  
  // Extraire tous les thèmes uniques
  function getUniqueThemes() {
    const themes = new Set();
    questions.forEach(question => {
      if (question.theme) {
        themes.add(question.theme);
      }
    });
    return Array.from(themes).sort();
  }
  
  // Créer les boutons de thème
  function createThemeButtons() {
    const themes = getUniqueThemes();
    
    // Vider le conteneur de boutons
    themeButtons.innerHTML = "";
    
    // Créer un bouton pour chaque thème
    themes.forEach(theme => {
      const button = document.createElement("button");
      button.classList.add("theme-btn");
      button.textContent = theme;
      
      // Ajouter un écouteur d'événement pour démarrer le quiz avec ce thème
      button.addEventListener("click", () => {
        startQuizWithTheme(theme);
      });
      
      themeButtons.appendChild(button);
    });
    
    // Ajouter un bouton de retour
    const backButton = document.createElement("button");
    backButton.classList.add("back-btn");
    backButton.textContent = "Retour";
    backButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
    
    themeButtons.appendChild(backButton);
  }
  
  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  
  function startQuizWithTheme(theme) {
    console.log(`🎯 Démarrage du quiz en mode thème : ${theme}`);
  
    hideElement(themeScreen);
    showElement(questionScreen);
  
    currentQuestionIndex = 0;
    score = 0;
    questionsfilled = [];
    answersgiven = [];
    currentTheme = theme;
  
    // Filtrer les questions par thème et en prendre 10 aléatoires
    const filteredQuestions = questions.filter(q => q.theme === theme);
    themeQuestions = shuffleArray([...filteredQuestions]).slice(0, 10);
  
    setText(totalQuestionsSpan, themeQuestions.length);
    showQuestion();
  }
  
  function showQuestion() {
    clearInterval(timerId);
  
    const q = themeQuestions[currentQuestionIndex]; 
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
  
    const q = themeQuestions[currentQuestionIndex];
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
    if (currentQuestionIndex < themeQuestions.length) {
      showQuestion();
    } else {
      endQuiz();
    }
  }
  
  function endQuiz() {
    hideElement(questionScreen);
    showElement(resultScreen);
  
    updateScoreDisplay(scoreText, score, themeQuestions.length);
  
    // Stocker le meilleur score par thème
    const themeScoreKey = `bestScore_${currentTheme}`;
    let themeBestScore = loadFromLocalStorage(themeScoreKey, 0);
    
    if (score > themeBestScore) {
      themeBestScore = score;
      saveToLocalStorage(themeScoreKey, themeBestScore);
    }
    
    setText(bestScoreEnd, `${themeBestScore} (${currentTheme})`);
    
    let recap = getAnswerQuestion(questionsfilled);
    startrecap(recap, recapsection, answersgiven);
    generateStatistics();
  }
  
  function restartQuiz() {
    hideElement(resultScreen);
    showElement(themeScreen);
  
    answersgiven = [];
    questionsfilled = [];
  
    recapsection.innerHTML = "";
    recapsection.style.display = "none";
    
    // Recréer les boutons de thème
    createThemeButtons();
  }
  
  function startrecap(recap, recapsection, answersgiven) {
    recapsection.innerHTML = "";
    recapsection.style.display = "flex";
    recapsection.style.flexDirection = "column";
  
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
        <span class="answer-question">Votre réponse: ${userAnswerText}</span>
        <span class="correct-answer">(Correct: ${correctAnswerText})</span>
      `;
  
      recapsection.appendChild(span);
    });
  }
  
  // Exécuter l'initialisation quand le DOM est chargé
  document.addEventListener("DOMContentLoaded", () => {
    createThemeButtons();
  });