export const getAnswerQuestion = (questions) => {
    let answers = {};
    
    // Iterate over the questions object keys
    Object.values(questions).forEach(question => {
        const answer = question.answers[question.correct]; 
        answers[question.text] = answer;
    });

    return answers;
};
