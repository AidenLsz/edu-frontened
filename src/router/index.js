import Vue from "vue";
import Router from "vue-router";

// Views主目录
import Admin from "@/views/Admin";
import Estimate from "@/views/Estimate";
import Home from "@/views/Home";
import Members from "@/views/Members_Introduce";
import Similarity from "@/views/Similarity";

// 资源查询类页面
import KU from "@/views/resourceQuery/KU.vue";
import Exercise from "@/views/resourceQuery/Exercise";

// 资源录入类页面
import InputMarked from "@/views/resourceInput/InputMarked";
import InputPaper from "@/views/resourceInput/InputPaper";

// 测试类页面，用于测试新功能的导入
import TestPage from "@/views/testPage/TestPage";
import TestPageList from "@/views/testPage/TestPageList";

// 资源分析类页面
import PaperAnalyse from "@/views/resourceAnalyse/PaperAnalyse";
import PaperAnalyseInput from "@/views/resourceAnalyse/PaperAnalyseInput";
import QuestionAnalyse from "@/views/resourceAnalyse/QuestionAnalyse";
import QuestionAnalyseInput from "@/views/resourceAnalyse/QuestionAnalyseInput";

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
      component: Home,
    },
    {
      path: "/ku",
      name: "Knowledge Unit",
      component: KU,
    },
    {
      path: "/exercise",
      name: "Exercise",
      component: Exercise,
    },
    {
      path: "/estimate",
      name: "Estimate",
      component: Estimate,
    },
    {
      path: "/similarity",
      name: "Similarity",
      component: Similarity,
    },
    {
      path: "/inputMarked",
      name: "inputMarked",
      component: InputMarked,
    },
    {
      path: "/testPage",
      name: "TestPage",
      component: TestPage
    },
    {
      path: "/testPageList",
      name: "TestPageList",
      component: TestPageList
    },
    {
      path: "/members",
      name: "Members",
      component: Members
    },
    {
      path: "/paperAnalyse",
      name: "PaperAnalyse",
      component: PaperAnalyse
    },
    {
      path: "/paperAnalyseInput",
      name: "PaperAnalyseInput",
      component: PaperAnalyseInput,
    },
    {
      path: "/questionAnalyse",
      name: "QuestionAnalyse",
      component: QuestionAnalyse
    },
    {
      path: "/questionAnalyseInput",
      name: "QuestionAnalyseInput",
      component: QuestionAnalyseInput
    },
    {
      path: "/inputPaper",
      name: "inputPaper",
      component: InputPaper,
    },
    // {
    //   path: "/inputMarkedPreview",
    //   name: "inputMarkedPreview",
    //   component: InputMarkedPreview,
    // },
    // {
    //   path: "/login",
    //   name: "Login",
    //   component: Login,
    // },
    // {
    //   path: "/register",
    //   name: "Register",
    //   component: Register,
    // },
    // {
    //   path: "/fileUpload",
    //   name: "FileUpload",
    //   component: FileUpload,
    // },
    {
      path: "/admin",
      name: "Admin",
      component: Admin,
      children: [
        {
          path: "/eduData",
          name: "eduData",
          component: () => import("@/views/admin/EduData.vue"),
        },
        {
          path: "/concept",
          name: "concept",
          component: () => import("@/views/admin/concept.vue"),
        },
        {
          path: "/knowledgePoint",
          name: "knowledgePoint",
          component: () => import("@/views/admin/knowledgePoint.vue"),
        },
        {
          path: "/KPNew",
          name: "KPNew",
          component: () => import("@/views/admin/KPNew.vue"),
        },
        {
          path: "/relation",
          name: "relation",
          component: () => import("@/views/admin/relation.vue"),
        },
        {
          path: "/neeaNode",
          name: "neeaNode",
          component: () => import("@/views/admin/neeaNode.vue"),
        },
        {
          path: "/importNode",
          name: "importNode",
          component: () => import("@/views/admin/importNode.vue"),
        },
        {
          path: "/importEdge",
          name: "importEdge",
          component: () => import("@/views/admin/importEdge.vue"),
        },
        {
          path: "/bulkImport",
          name: "bulkImport",
          component: () => import("@/views/admin/bulkImport.vue"),
        },
        {
          path: "/checkExercise",
          name: "checkExercise",
          component: () => import("@/views/admin/checkExercise.vue"),
        },
      ],
    },
    {
      name: "404",
      path: "/404",
      component: () => import("@/views/404.vue"),
    },
    {
      path: "*",
      redirect: "/404",
    },
  ],
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
