import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import './plugins/element.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import VueResource from "vue-resource";
Vue.use(VueResource);

Vue.config.productionTip = false

if (process.env.NODE_ENV === "production") {
  if (process.env.BACKEND_URL === "DEFAULT_BACKEND_URL") {
      //production 生产环境
      Vue.prototype.backendIP = "https://kg-edu-backend-44-production.env.bdaa.pro/v1";

  } else {
      //test 测试环境
      Vue.prototype.backendIP = "https://kg-edu-backend-44-production.env.bdaa.pro/v1";
  }
} else {
  //dev 开发环境
  Vue.prototype.backendIP = "https://kg-edu-backend-44-production.env.bdaa.pro/v1";
}

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
