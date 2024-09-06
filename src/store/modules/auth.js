import auth from "../../api/auth";
import { useLocalStorage } from "../../hooks/localStorage";

const authStorage = useLocalStorage("auth");

// initial state
const state = () => ({
  isLoggedIn: false,
  username: null,
});

// getters
const getters = {
  isAuthenticated: (state) => state.isLoggedIn,
  username: (state) => state.username,
};

// actions
const actions = {
  async login({ commit }) {
    const data = await auth.login();
    const token = data.token;

    // Store token in local storage
    authStorage.setLocalData(token);

    commit("setAuthInfo", {
      isLoggedIn: true,
      username: data.username,
    });
  },

  async getMe({ commit }) {
    const token = authStorage.getLocalData();

    if (!token) {
      return;
    }

    const data = await auth.getMe(token);
    commit("setAuthInfo", {
      isLoggedIn: true,
      username: data.username,
    });
  },

  logout({ commit }) {
    authStorage.setLocalData(null);
    commit("setAuthInfo", {
      isLoggedIn: false,
      username: null,
    });
  },
};

// mutations
const mutations = {
  setAuthInfo(state, authInfo) {
    state.isLoggedIn = authInfo.isLoggedIn;
    state.username = authInfo.username;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
