import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router/index'
import './plugins/element.js'
import '@/common/styles/index.scss' // global css

import VueResource from "vue-resource";
Vue.use(VueResource);

import VueCropper from 'vue-cropper'
Vue.use(VueCropper);

import VueLazyload from "vue-lazyload";
Vue.use(VueLazyload);


// import axios from 'axios'

// axios.defaults.withCredentials=true;//让ajax携带cookie

// Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

if (process.env.NODE_ENV === "production") {

  if (process.env.VUE_APP_URL === "DEFAULT_BACKEND_URL") {
      //production 生产环境
      Vue.prototype.backendIP = "https://kg-edu-backend-44-production.env.bdaa.pro/v1";

  } else {
      //test 测试环境
      Vue.prototype.backendIP = process.env.VUE_APP_URL;
      // Vue.prototype.backendIP = "https://kg-edu-backend-44-review-user-u9mmdq.env.bdaa.pro/v1";

  }
} else {
  //dev 开发环境
  Vue.prototype.backendIP = "https://kg-edu-backend-44-production.env.bdaa.pro/v1";
  // Vue.prototype.backendIP = "http://localhost:5000";
  // Vue.prototype.backendIP = "https://kg-edu-backend-44-review-latex-mw1s2b.env.bdaa.pro/v1"
}

new Vue({
  router,
  store,
  render:h=> h(App),
}).$mount('#app');
