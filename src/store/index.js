import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isAuthenticated: !!localStorage.getItem('authToken'),
      username: '',
    };
  },
  mutations: {
    setAuthentication(state, token) {
      state.isAuthenticated = !!token;
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        state.username = decoded.username || 'Usuario';
      } else {
        state.username = '';
      }
    },
  },
  actions: {
    login({ commit }, token) {
      localStorage.setItem('authToken', token); // Almacena el token en el localStorage
      commit('setAuthentication', token); // Actualiza el estado en Vuex
    },
    logout({ commit }) {
      localStorage.removeItem('authToken');
      commit('setAuthentication', null);
    },
  },
});

export default store;
