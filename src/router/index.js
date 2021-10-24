import Vue from "vue";
import Router from "vue-router";
import VisitorRouter from '@/router/modules/visitor.js'
import UserRouter from '@/router/modules/user.js'
import EEMSRouter from '@/router/modules/eems.js'
import ITASRouter from '@/router/modules/itas.js'
import store from '@/store'
import {Message } from 'element-ui'
import BasicLayout from '@/layout/Basic'
import EEMSLayout from '@/layout/EEMS'
import ITASLayout from '@/layout/ITAS'

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
      path: "/itas",
      name: "ITAS",
      component: ITASLayout,
      children:UserRouter.concat(ITASRouter)
    },
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

router.beforeEach((to, from, next) => {
  if(!validatePermission(to.path)){
    next()
    openLoginDialog()
  }else if((!switchToEEMS(to.path)||!switchToITAS(to.path))&&!validateLoginPermission(to.path)){
    if(from.path=='/'){
      //输入url跳转时
      next('/')
    }else{
      // 点击跳转时
      next(false);
    }
    openLoginDialog()
  }else{
    next()
  }
});
function switchToEEMS(path){
  return path&&(path.endsWith('/eems')||path.includes('/eems/'))
}
function switchToITAS(path){
  return path&&(path.endsWith('/itas')||path.includes('/itas/'))
}
function openLoginDialog(){
  store.dispatch('app/openLoginDialog').then(()=>{
    Message({
      message: '您需要登录后才能进行相关操作！',
      type: 'error',
      duration: 5 * 1000
    })
  })
}
function validateLoginPermission(path){
  const route = [
    "/user/",
    "/manage/",
    "/inputMarked",
    "/inputPaper",
    "/paperCombine",
    "/ku"
  ];
  let isUserRoute = ()=>route.some((r)=>path.includes(r))
  return !isUserRoute() || store.state.user.token
}
function validatePermission(path){
  //切换为考试版
  if(switchToEEMS(path)) {
    store.dispatch('app/setSysState',{rootPath:'/eems/',isLuna:false,systemType:1})
    if (!store.state.user.token) {
      return false
    }
  }else if(switchToITAS(path)) {true
    store.dispatch('app/setSysState',{rootPath:'/itas/',isLuna:false,systemType:2})
    if (!store.state.user.token) {
      return false
    }
  }else if(switchToITAS(path)) {
    store.dispatch('app/setSysState',{rootPath:'/itas/',isLuna:false})
    if (!store.state.user.token) {
      return false
    }
  }else{
    //切换为普通版
    store.dispatch('app/setSysState',{rootPath:'/',isLuna:true,systemType:0})
    store.dispatch('app/closeLoginDialog')
  }
  return true
}
export default router;
