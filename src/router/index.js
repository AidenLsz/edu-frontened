import Vue from "vue";
import Router from "vue-router";
import VisitorRouter from '@/router/modules/visitor.js'
import UserRouter from '@/router/modules/user.js'
import EEMSRouter from '@/router/modules/eems.js'
import store from '@/store'
import {Message } from 'element-ui'
import BasicLayout from '@/layout/Basic'
import EEMSLayout from '@/layout/EEMS'

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
      path: "/eems",
      name: "EEMS",
      component: EEMSLayout,
      children:UserRouter.concat(EEMSRouter)

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
let switchToEEMS=(path)=>path&&(path.endsWith('/eems')||path.includes('/eems/'))
router.beforeEach((to, from, next) => {
  // 进行eems权限控制（switchToEEMS)
  //   没有登录 ｜｜ 已经登录但没有访问权限
  //     一定要登录-提示没有权限登录后非neea则提示当前账号没有权限 modal不消失
  // 进行luna权限控制
  //   没有登录-Modal框
  console.log(to.path);
  if(!validateEEMSPermission(to.path)){
    console.log(1);
    next()
    store.dispatch('app/openLoginDialog')
    Message({
      message: '您没有使用考试系统的权限！',
      type: 'error',
      duration: 5 * 1000
    })
    // modal框
  }else if(!switchToEEMS(to.path)&&!validateLoginPermission(to.path)){
    console.log(2);

    Message({
      message: '您需要登录后才能进行相关操作！',
      type: 'error',
      duration: 5 * 1000
    })
    store.dispatch('app/openLoginDialog')
    next('/');
  }else{
    console.log(3);
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
function validateEEMSPermission(path){
  //切换为考试版
  if(switchToEEMS(path)) {
    store.dispatch('app/setSysState',{rootPath:'/eems/',isLuna:false})
    if (!store.state.user.name||store.state.user.name!='NEEA') {
      return false
    }
  }else{
    //切换为普通版
    store.dispatch('app/setSysState',{rootPath:'/',isLuna:true})
  }
  return true
}
export default router;
