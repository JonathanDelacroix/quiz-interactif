
export const generateStatistics = (score, totalQuestionsAnswered) => {
    const wrongAnswers = totalQuestionsAnswered - score;
    const successRate = totalQuestionsAnswered > 0 ? ((score / totalQuestionsAnswered) * 100).toFixed(2) : 0;
   
    const questionsPerMinute = ((totalQuestionsAnswered / 20) * 60).toFixed(2);
  
    const statsContainer = document.getElementById("statsContainer");
    statsContainer.innerHTML = `
      <h2>📊 Statistiques du mode contre la montre</h2>
      <p>✅ Bonnes réponses : <strong>${score}</strong></p>
      <p>❌ Mauvaises réponses : <strong>${wrongAnswers}</strong></p>
      <p>🎯 Taux de réussite : <strong>${successRate}%</strong></p>
      <p>⏱ Questions répondues : <strong>${totalQuestionsAnswered}</strong></p>
      <p>🚀 Vitesse : <strong>${questionsPerMinute} questions/min</strong></p>
    `;
  };
  