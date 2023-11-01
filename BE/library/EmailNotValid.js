const emailNotValid = async (form, answers) => {
  //   const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  //   /[a.z0-9]+@[a-z]+\.[a-z]{2,3}/
  //   return !regex.test(email);

  const found = form.questions.filter((question) => {
    if (question.type == "Email") {
      const answer = answers.find((answer) => answer.questionId == question.id);

      //   Untuk Skip Pengecekan Email Jika tidak ada jawaban dan jika question require bernilai false
      if (question.required === false) {
        if (answer === undefined || answer.value === undefined || answer.value === null || answer.value === "") {
          return false;
        }
      }

      if (answer) {
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(answer.value) === false) {
          return true;
        }
      }
    }
  });
  return found;
};

export default emailNotValid;
