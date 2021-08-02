import Vue from "vue";
import Router from "vue-router";
import VisitorRouter from '@/router/modules/visitor.js'
import UserRouter from '@/router/modules/user.js'
import NEEARouter from '@/router/modules/neea.js'
import store from '@/store'
import {Message } from 'element-ui'
import BasicLayout from '@/layout/Basic'
import NEEALayout from '@/layout/NEEA'

// import  AppMain from '@/layout/components/AppMain'

// 历史遗留问题类页面，留着防止报错无法回滚
// import Login from "@/components/Login";
// import InputMarkedPreview from "@/components/InputMarkedPreview";
// import Register from "@/components/Register";
// import FileUpload from "@/components/Upload";

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 解决NavigationDuplicated的问题
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);
Vue.use(mavonEditor);
const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/neea",
      name: "NEEA",
      component: NEEALayout,
      children:UserRouter.concat(NEEARouter)

    },
    {
      path: "/",
      name: "Home",
      component: BasicLayout,
      children:UserRouter.concat(VisitorRouter)
    }
  ]
});

// 路由控制
router.beforeEach((to, from, next) => {
  if(!validateLoginPermission(to.path)){
    Message({
      message: '您需要登录后才能进行相关操作！',
      type: 'error',
      duration: 5 * 1000
    })
    router.go(-1);
    // next(false)
  }else if(!validateExamVersionPermission(to.path)){
    Message({
      message: '您没有权限查看考试版系统',
      type: 'error',
      duration: 5 * 1000
    })
    router.go(-1)
    // next(false)
  }else{
    next()
  }
});
function validateLoginPermission(path){
  const route = [
    "/user/",
    "/manage/",
    "/inputMarked",
    "/inputPaper"
  ];
  let isUserRoute = ()=>route.some((r)=>path.includes(r))
  return !isUserRoute() || store.state.user.token
}
function validateExamVersionPermission(path){
  let isNEEA = ()=>store.state.user.name=='NEEA'
  let switchToNEEA=()=>path.endsWith('/neea')||path.includes('/neea/')
  let switchFromNEEA=()=>store.state.user.rootPath=='/neea/'
  //切换为考试版
  if(switchToNEEA()&&!isNEEA())
    return false
  if(!switchFromNEEA()&&switchToNEEA()) {
    store.dispatch('user/setRootPath','/neea/')
  }
  //切换为普通版
  if(switchFromNEEA()&&!switchToNEEA()){
    store.dispatch('user/setRootPath','/')
  }
  return true
}
export default router;
