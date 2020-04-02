// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";

import App from "./App";
import router from "./router";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueResource from "vue-resource";
// 引入jQuery
// import $ from "jquery";
// 引入bootstrap
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";

import "animate.css";

// Vue.config.productionTip = false;

// if (process.env.BACKEND_URL === "DEFAULT_BACKEND_URL") {
//   Vue.prototype.backendIP =
//     "https://kg-edu-backend-44-production.env.bdaa.pro/v1";
// } else {
//   Vue.prototype.backendIP = process.env.BACKEND_URL;
// }

// 测试
Vue.prototype.backendIP = "http://127.0.0.1:8001";

Vue.use(ElementUI);
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  components: { App },
  template: "<App/>"
});

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});
