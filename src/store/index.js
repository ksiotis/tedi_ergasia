import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '',
    user: '',
    rolenames: {
      tenant: ['Ενοικιαστής', 'ion-briefcase'],
      unaproved: ['Ενοικιαστής', 'ion-briefcase'],
      aproved: ['Οικοδεσπότης', 'ion-home-sharp'],
      admin: ['Διαχειριστής', 'ion-build'],
    },
  },
  mutations: {
    updateToken (state, payload) {
      state.token = payload;
      localStorage.Token = payload;
    },
    updateUser (state, payload) {
      state.user = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})