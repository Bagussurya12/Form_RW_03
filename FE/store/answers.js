const config = {
  headers: {
    Autosave: true,
  },
};

export const state = () => ({
  answers: [],
});

export const mutations = {
  update(state, payload) {
    const index = state.answers.findIndex(
      (answer) => answer.questionId === payload.questionId
    );
    if (index === -1) {
      state.answers.push(payload);
    } else {
      state.answers[index].value = payload.value;
    }
  },
};
export const actions = {
  async store({ state }, formId) {
    return await this.$axios.$post(
      `/answers/${formId}`,
      { answers: state.answers },
      config
    );
  },
};
