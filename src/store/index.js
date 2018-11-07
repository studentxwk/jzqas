import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    host: '123.57.14.211:6666',
    path: '/supplier-admin-web'
  },
  getters: {
    host: state => state.host,
    path: state => state.path
  },
  mutations: {
    saveEach (state) {
    }
  }
})

export default store
