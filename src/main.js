import Vue from 'vue'
import App from './App.vue'
// import User from './User.vue'
import store from './store'
import router from './router/index'
import './plugins/element.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import '@/common/styles/index.scss' // global css
import 'bootstrap/dist/js/bootstrap.min.js'

import VueResource from "vue-resource";
Vue.use(VueResource);

import echarts from "echarts";
Vue.prototype.$echarts = echarts;

import VueCropper from 'vue-cropper' 
Vue.use(VueCropper)

Vue.config.productionTip = false

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
  // Vue.prototype.backendIP = "https://kg-edu-backend-44-production.env.bdaa.pro/v1";
  Vue.prototype.backendIP = "https://kg-edu-backend-44-review-user-u9mmdq.env.bdaa.pro/v1";

}

new Vue({
  router,
  store,
  render:h=> h(App),
  // h => {
  //   if(sessionStorage.getItem('accessToken')){
  //     return h(User);
  //   }
  //   return h(App);
  // },
}).$mount('#app')
