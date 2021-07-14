import Vue from "vue";
import Router from "vue-router";
import VisitorRouter from '@/router/modules/visitor.js'
import UserRouter from '@/router/modules/user.js'
import store from '@/store'
import {Message } from 'element-ui'
import Layout from '@/layout/Basic'

// import  AppMain from '@/layout/components/AppMain'

// 历史遗留问题类页面，留着防止报错无法回滚
// import Login from "@/components/Login";
// import InputMarkedPreview from "@/components/InputMarkedPreview";
// import Register from "@/components/Register";
// import FileUpload from "@/components/Upload";

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

Vue.use(Router);
Vue.use(mavonEditor);
const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Layout,
      children:UserRouter.concat(VisitorRouter)
    }
  ]
});

// 路由控制
router.beforeEach((to, from, next) => {
  // const route = [
  //   "Admin",
  //   "concept",
  //   "knowledgePoint",
  //   "relation",
  //   "importNode",
  //   "importEdge",
  //   "bulkImport",
  //   "importExercise",
  //   "checkExercise",
  // ];
  const route = [
    "/user/",
    "/manage/",
    "/inputMarked",
    "/inputPaper"
  ];
  let isUserRoute = ()=>route.some((r)=>to.path.includes(r))
<<<<<<< HEAD
  if (isUserRoute() && !store.state.user.token) {
      Message({
        message: '您需要登录后才能进行相关操作！',
=======
console.log('isUserRoute',isUserRoute());
  if (isUserRoute() && !store.state.user.token) {
      Message({
        message: '您尚未登录或登录信息已过期，请登录！',
>>>>>>> bec16b5... authority check
        type: 'error',
        duration: 5 * 1000
      })
      next({ path: "/" });
  }
  next();
});

export default router;
