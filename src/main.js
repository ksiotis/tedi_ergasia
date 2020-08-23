import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import bcryptjs from 'bcryptjs'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-star-rating'

axios.defaults.baseURL = "http://localhost:3000";

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$bcrypt = bcryptjs
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')