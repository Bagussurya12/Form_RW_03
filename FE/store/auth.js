export const state = () => ({
  accessToken: null,
  refreshToken: null,
  fullname: null,
  role: null,
});

export const getters = {
  authenticated(state) {
    if (state.accessToken) {
      return true;
    }
    return false;
  },
};

export const mutations = {
  setFullname(state, fullname) {
    state.fullname = fullname;
  },
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken;
  },
  setRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken;
  },
  setRole(state, role) {
    state.role = role;
  },
  logout(state) {
    state.accessToken = null;
    state.refreshToken = null;
    state.fullname = null;
    state.role = null;
  },
};

export const actions = {
  async login({ commit }, payload) {
    const auth = await this.$axios.$post("/login", payload);
    if (!auth) {
      return false;
    }

    // Perbaiki pemanggilan mutasi dengan nama yang benar
    commit("setFullname", auth.fullname);
    commit("setAccessToken", auth.accessToken);
    commit("setRefreshToken", auth.refreshToken);
    commit("setRole", auth.role);

    return auth;
  },
};
