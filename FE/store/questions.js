const config = {
  headers: {
    autoSave: true,
  },
};

export const state = () => ({
  questions: [],
});

export const mutations = {
  reset(state) {
    state.questions = [];
  },
  set(state, questions) {
    state.questions = questions;
  },
  add(state, question) {
    state.questions.push(question);
  },
  remove(state, questionId) {
    state.questions = state.questions.filter(
      (question) => question.id !== questionId
    );
  },
  update(state, payload) {
    const index = state.questions.findIndex(
      (question) => question.id === payload.questionId
    );
    if (payload.form.hasOwnProperty("question")) {
      state.questions[index].question = payload.form.question;
    } else if (payload.form.hasOwnProperty("type")) {
      state.questions[index].type = payload.form.type;
    } else if (payload.form.hasOwnProperty("options")) {
      state.questions[index].options = payload.form.options;
    } else if (payload.form.hasOwnProperty("required")) {
      state.questions[index].required = payload.form.required;
    }
  },

  addOptions(state, payload) {
    const index = state.questions.findIndex(
      (question) => question.id === payload.questionId
    );
    state.questions[index].options.push(payload.option);
  },
  updateOptions(state, payload) {
    const index = state.questions.findIndex(
      (question) => question.id === payload.questionId
    );
    const optionIndex = state.questions[index].options.findIndex(
      (option) => option.id === payload.optionId
    );

    state.questions[index].options[optionIndex].value = payload.form.option;
  },
  removeOptions(state, payload) {
    state.questions = state.questions.map((question) => ({
      ...question,
      options: question.options.filter(
        (option) => option.id !== payload.optionId
      ),
    }));
  },
};

export const actions = {
  async store({ commit }, id) {
    const response = await this.$axios.$post(
      `/form/${id}/questions`,
      {},
      config
    );

    if (!response) {
      return false;
    }
    commit("add", response.question);

    return response;
  },
  async update({ commit, state }, payload) {
    const response = await this.$axios.$put(
      `/form/${payload.formId}/questions/${payload.questionId}`,
      payload.form,
      config
    );
    commit("update", payload);
    return response;
  },
  async remove({ commit }, payload) {
    const response = await this.$axios.$delete(
      `/form/${payload.formId}/questions/${payload.questionId}`,
      config
    );
    commit("remove", payload.questionId);

    return response;
  },
  async addOptions({ commit }, payload) {
    let response = await this.$axios.$post(
      `/form/${payload.formId}/questions/${payload.questionId}/options`,
      payload.form,
      config
    );
    if (!response) {
      return false;
    }
    let newPayload = { ...payload, ...response };
    let tes = { ...payload };
    console.log(tes);

    commit("addOptions", newPayload);

    return response;
  },
  async updateOptions({ commit }, payload) {
    // const response = await this.$axios.$put(
    //   `/form/${payload.formId}/questions/${payload.questionId}`,
    //   payload.form,
    //   config
    // );

    const response = await this.$axios.$put(
      `/form/${payload.formId}/questions/${payload.questionId}/options/${payload.optionId}`,
      payload.form,
      config
    );

    console.log(response);

    return response;
  },

  async removeOptions({ commit }, payload) {
    const response = await this.$axios.$delete(
      `/form/${payload.formId}/questions/${payload.questionId}/options/${payload.optionId}`,
      config
    );
    if (!response) {
      return false;
    }
    commit("removeOptions", payload);

    return response;
  },
};
