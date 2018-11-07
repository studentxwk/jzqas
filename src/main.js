// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'  // 使IE9+支持vuex
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
// import axios from 'axios';
import "./assets/iconfont/iconfont.css";
import store from './store'
import ajax from './utils/ajax'
import './assets/css/iveiwReplace.css';    // 使用 CSS
// 引入echarts
//import echarts from 'echarts'

Vue.prototype.ajax = ajax;
//Vue.prototype.$echarts = echarts
// Vue.prototype.$http = axios
Vue.use(iView);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App}
})
