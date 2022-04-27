import Vue from "vue";
import Router from "vue-router";
import VisitorRouter from '@/router/modules/visitor.js'
import UserRouter from '@/router/modules/user.js'
import EEMSRouter from '@/router/modules/eems.js'
import ITASRouter from '@/router/modules/itas.js'
import PublicPlatformRouter from '@/router/modules/PublicPlatformRouter.js'
import PublicPlatformRouter_B from '@/router/modules/PublicPlatformRouter_B.js'
import AIlabUserRouter from '@/router/modules/AIlabUserRouter.js'
import store from '@/store'
import {Message } from 'element-ui'
import BasicLayout from '@/layout/Basic'
import EEMSLayout from '@/layout/EEMS'
import ITASLayout from '@/layout/ITAS'
import PublicPlatformLayout from '@/layout/PublicPlatformLayout'
import PublicPlatformLayout_B from '@/layout/PublicPlatformLayout_B'
import AIlabUserLayout from '@/layout/AIlabUser'

// import  AppMain from '@/layout/components/AppMain'

// 历史遗留问题类页面，留着防止报错无法回滚
// import Login from "@/components/Login";
// import InputMarkedPreview from "@/components/InputMarkedPreview";
// import Register from "@/components/Register";
// import FileUpload from "@/components/Upload";

// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'

// 解决NavigationDuplicated的问题
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router);
// Vue.use(mavonEditor);
const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/itas",
      component: ITASLayout,
      children:UserRouter.concat(ITASRouter)
    },
    {
      path: "/eems",
      component: EEMSLayout,
      children:UserRouter.concat(EEMSRouter)
    },
    {
      path: "/publicPlatform/user",
      name: "AIlabUser",
      component: AIlabUserLayout,
      children:UserRouter.concat(AIlabUserRouter)
    },
    {
      path: "/publicPlatform",
      name: "publicPlatform_B",
      component: PublicPlatformLayout_B,
      children:UserRouter.concat(PublicPlatformRouter_B)
    },
    {
      path: "/publicPlatform",
      name: "publicPlatform",
      component: PublicPlatformLayout,
      children:UserRouter.concat(PublicPlatformRouter)
    },
    {
      path: "/",
      component: BasicLayout,
      children:UserRouter.concat(VisitorRouter)
    }
  ]
});

// 路由控制

router.beforeEach((to, from, next) => {
  if (to.meta.title){
    document.title = to.meta.title
  } else {
    document.title = "LUNA"
  }
  if (switchtoAIlab(to.path)){
    if (to.path.includes('/user/') && !store.state.AIlab_user.AIname)
    {
      Message({
        message: '您需要登录后才能进行相关操作！',
        type: 'error',
        duration: 5 * 1000
      });
      next('/PublicPlatform/AILablogin');// 重定向到登陆界面
    } else
    next();// 验证导航
  } else
  if(!validatePermission(to.path)){
    next()
    openLoginDialog()
  }else if((!switchToEEMS(to.path)||!switchToITAS(to.path))&&!validateLoginPermission(to.path)){
    if(from.path === '/'){
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
function switchtoAIlab(path){
  return path&&(path.endsWith('/PublicPlatform')||path.includes('/PublicPlatform/'))
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
    "/paperCombination"
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
  }else if(switchToITAS(path)) {
    store.dispatch('app/setSysState',{rootPath:'/itas/',isLuna:false,systemType:2})
    if (!store.state.user.token) {
      return false
    }
  // }else if(switchtoAIlab(path)) {
  //   store.dispatch('app/setSysState',{rootPath:'/PublicPlatform/',isLuna:false,systemType:3})
  //   if (!store.state.user.token) {
  //     return false
  //   }
  }else{
    //切换为普通版
    store.dispatch('app/setSysState',{rootPath:'/',isLuna:true,systemType:0})
    store.dispatch('app/closeLoginDialog')
  }
  return true
}
export default router;
