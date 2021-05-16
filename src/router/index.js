import Vue from "vue";
import Router from "vue-router";
import VisitorRouter from '@/router/modules/visitor.js'
import UserRouter from '@/router/modules/user.js'

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
  routes: UserRouter.concat(VisitorRouter)
});

// 路由控制
router.beforeEach((to, from, next) => {
  const route = [
    "Admin",
    "concept",
    "knowledgePoint",
    "relation",
    "importNode",
    "importEdge",
    "bulkImport",
    "importExercise",
    "checkExercise",
  ];
  if (route.indexOf(to.name) >= 0) {
    if (!sessionStorage.user) {
      next({ path: "/login" });
    }
  }
  next();
});

export default router;
