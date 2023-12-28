const answerDuplicate = async (answers) => {
  let seen = new Set();
  return answers.some((answer) => {
    if (seen.has(answer.questionId)) {
      //   duplicated;
      return true;
    }
    seen.add(answer.questionId);
    return false;
  });
};
export default answerDuplicate;
