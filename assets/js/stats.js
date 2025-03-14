import { questions, score, timesPerQuestion } from './quiz.js';







export const generateStatistics = () => {
  const totalQuestions = questions.length;
  const correctAnswers = score;
  const wrongAnswers = totalQuestions - correctAnswers;
  const successRate = ((correctAnswers / totalQuestions) * 100).toFixed(2);

  // Calcul du temps moyen par question
  const totalTime = timesPerQuestion.reduce((acc, curr) => acc + curr, 0);
  const averageTime = timesPerQuestion.length ? (totalTime / timesPerQuestion.length).toFixed(2) : 0;

  // Sélection de la div contenant les statistiques
  const statsContainer = document.getElementById("statsContainer");
  statsContainer.innerHTML = `
    <h2>📊 Statistiques du Quiz</h2>
    <p>✅ Bonnes réponses : <strong>${correctAnswers}</strong> / ${totalQuestions}</p>
    <p>❌ Mauvaises réponses : <strong>${wrongAnswers}</strong> / ${totalQuestions}</p>
    <p>🎯 Taux de réussite : <strong>${successRate}%</strong></p>
    <p>⏱ Temps moyen par question : <strong>${averageTime} sec</strong></p>
  `;
}

  