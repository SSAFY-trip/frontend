// store/auth.js
export default {
  state: {
    accessToken: null,
    refreshToken: null,
  },
  mutations: {
    setTokens(state, { accessToken, refreshToken }) {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      localStorage.setItem("accessToken", accessToken);
      document.cookie = `refreshToken=${refreshToken}; Path=/; HttpOnly`;
    },
  },
  actions: {},
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },
};
