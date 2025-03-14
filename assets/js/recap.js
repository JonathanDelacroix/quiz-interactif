export const getAnswerQuestion = (questions) => {
    let answers = {};
    
    questions.forEach(question => {
        const answer = question.answers[question.correct]; 
        answers[question.text] = answer;
    });

    return answers;
};
