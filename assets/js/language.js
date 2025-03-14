import { setText } from "./dom.js";
const translations = {
  fr: {
    title: "Quiz Dynamique",
    intro: "Testez vos connaissances en quelques questions chronométrées !",
    start: "Commencer le quiz",
    question: "Question",
    next: "Question suivante",
    timeLeft: "Temps restant",
    finalResult: "Résultat final",
    bestScore: "Meilleur score",
    restart: "Recommencer",
    givenAnswer: "Réponse donnée",
    correctAnswer: "Réponse correcte"
  },
  en: {
    title: "Dynamic Quiz",
    intro: "Test your knowledge with a few timed questions!",
    start: "Start the quiz",
    question: "Question",
    next: "Next Question",
    timeLeft: "Time left",
    finalResult: "Final Result",
    bestScore: "Best Score",
    restart: "Restart",
    givenAnswer: "Given Answer",
    correctAnswer: "Correct Answer"
  },
  ar: {
    title: "اختبار ديناميكي",
    intro: "اختبر معلوماتك ببضع أسئلة محددة بالوقت!",
    start: "ابدأ الاختبار",
    question: "سؤال",
    next: "السؤال التالي",
    timeLeft: "الوقت المتبقي",
    finalResult: "النتيجة النهائية",
    bestScore: "أفضل نتيجة",
    restart: "إعادة الاختبار",
    givenAnswer: "الإجابة المقدمة",
    correctAnswer: "الإجابة الصحيحة"
  },
  de: {
    title: "Dynamisches Quiz",
    intro: "Teste dein Wissen mit ein paar zeitgesteuerten Fragen!",
    start: "Quiz starten",
    question: "Frage",
    next: "Nächste Frage",
    timeLeft: "Verbleibende Zeit",
    finalResult: "Endergebnis",
    bestScore: "Beste Punktzahl",
    restart: "Neustarten",
    givenAnswer: "Gegebene Antwort",
    correctAnswer: "Korrekte Antwort"
  },
  es: {
    title: "Cuestionario Dinámico",
    intro: "¡Pon a prueba tus conocimientos con algunas preguntas cronometradas!",
    start: "Comenzar el cuestionario",
    question: "Pregunta",
    next: "Siguiente pregunta",
    timeLeft: "Tiempo restante",
    finalResult: "Resultado final",
    bestScore: "Mejor puntuación",
    restart: "Reiniciar",
    givenAnswer: "Respuesta dada",
    correctAnswer: "Respuesta correcta"
  }
};

const languageSelect = document.getElementById("language-select");

function changeLanguage(lang) {
  const texts = translations[lang] || translations["fr"];
  document.title = texts.title;
  setText(document.querySelector("h1"), texts.title);
  setText(document.querySelector(".notice"), texts.intro);
  setText(document.getElementById("start-btn"), texts.start);
  setText(document.getElementById("next-btn"), texts.next);
  const timerDiv = document.getElementById("timer-div");
  const timeLeftSpan = document.getElementById("time-left");

  timerDiv.childNodes[0].textContent = texts.timeLeft + ": ";

  if (!timeLeftSpan) {
    const newSpan = document.createElement("span");
    newSpan.id = "time-left";
    newSpan.textContent = "0s";
    timerDiv.appendChild(newSpan);
  }
  setText(document.getElementById("result-screen").querySelector("h2"), texts.finalResult);
  setText(document.getElementById("restart-btn"), texts.restart);
  const progressDiv = document.getElementById("progress");
  const currentQuestionIndexSpan = document.getElementById("current-question-index");
  const totalQuestionsSpan = document.getElementById("total-questions");

  progressDiv.childNodes[0].textContent = texts.question + " ";

  if (!currentQuestionIndexSpan) {
    const newCurrentIndexSpan = document.createElement("span");
    newCurrentIndexSpan.id = "current-question-index";
    progressDiv.appendChild(newCurrentIndexSpan);
  }

  if (!totalQuestionsSpan) {
    const newTotalQuestionsSpan = document.createElement("span");
    newTotalQuestionsSpan.id = "total-questions";
    progressDiv.appendChild(newTotalQuestionsSpan);
  }

  const bestScoreText = document.querySelector("#best-score-end").parentNode;
  setText(bestScoreText.childNodes[0], texts.bestScore + " : ");

  setText(document.getElementById("best-score-label"), texts.bestScore + " : ")
}

languageSelect.addEventListener("change", (e) => {
  const selectedLanguage = e.target.value;
  localStorage.setItem("quizLanguage", selectedLanguage);
  changeLanguage(selectedLanguage);
});

const savedLanguage = localStorage.getItem("quizLanguage") || "fr";
languageSelect.value = savedLanguage;
export {changeLanguage, savedLanguage};