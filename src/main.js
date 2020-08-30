import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-star-rating'

import "leaflet-geosearch/assets/css/leaflet.css"
import { OpenStreetMapProvider } from 'leaflet-geosearch';


axios.defaults.baseURL = "http://109.242.12.141:3000"; //change is IP changes

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.$OSMP = OpenStreetMapProvider;
Vue.prototype.$jwt = jsonwebtoken;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
