const config = {
  headers: {
    autoSave: true,
  },
};

export const state = () => ({
  forms: [],
  id: null,
  title: null,
  public: null,
  description: null,
});

export const mutations = {
  setForm(state, response) {
    state.id = response.form._id ? response.form._id : null;
    state.title = response.form.title ? response.form.title : null;
    state.description = response.form.description
      ? response.form.description
      : null;
    state.public = response.form.public ? response.form.public : null;
  },
};

export const actions = {
  async store() {
    const response = await this.$axios.$post("/form");
    if (!response) {
      return false;
    }

    // commit("setForm", response);
    return response;
  },
  async show({ commit }, id) {
    const response = await this.$axios.$get(`/form/${id}`);

    if (!response) {
      return false;
    }
    commit("setForm", response);
    return response;
  },
  async update({}, payload) {
    const response = await this.$axios.$put(
      `/form/${payload.formId}`,
      payload,
      config
    );
    if (!response) {
      return false;
    }

    return response;
  },
  async showToUser({ commit }, id) {
    const response = await this.$axios.$get(`/form/${id}/users`);

    if (!response) {
      return false;
    }
    commit("setForm", response);
    return response;
  },
};
