// import VisitorLayout from '@/layout/visitor'

// Views主目录
// import Admin from "@/views/Admin";
// import Estimate from "@/views/publicPlatform/Estimate.vue";
// import Segmentation from "@/views/publicPlatform/Segmentation.vue";
import Home from "@/views/Home";
// import Members from "@/views/Members_Introduce";
// import Similarity from "@/views/publicPlatform/Similarity.vue";
// import ImageTranscription from "@/views/publicPlatform/ImageTranscription.vue"
// import PublicPlatform from "@/views/PublicPlatform"

// 资源查询类页面
// import KU from "@/views/resourceQuery/KU/index.vue";
// import Exercise from "@/views/resourceQuery/Exercise/index.vue";
// import SearchPaper from "@/views/resourceQuery/SearchPaper"
// import PaperDetailShow from "@/views/resourceQuery/components/PaperDetailShow"
// import Resources from "@/views/resourceQuery/Resources";

// 资源录入类页面
// import InputMarked from "@/views/resourceInput/InputMarked";
// import InputPaper from "@/views/resourceInput/InputPaper";

// 测试类页面，用于测试新功能的导入
// import TestPage from "@/views/testPage/TestPage";
// import vditorTest from '@/views/testPage/vditorTest'
// import TestPageList from "@/views/testPage/TestPageList";
// import Remaking_Input_Single from '@/views/testPage/Remaking_Input_Component/Remaking_Input_Single'
// import Remaking_Input_Paper from '@/views/testPage/Remaking_Input_Component/Remaking_Input_Paper'

// 资源分析类页面
// import PaperAnalyse from "@/views/resourceAnalyse/PaperAnalyse";
// import PaperAnalyseInput from "@/views/resourceAnalyse/PaperAnalyseInput";
// import QuestionAnalyse from "@/views/resourceAnalyse/QuestionAnalyse";
// import QuestionAnalyseInput from "@/views/resourceAnalyse/QuestionAnalyseInput";

// 标注管理类页面
// import QuestionUpdate from "@/views/labelManage/QuestionUpdate";

// 组卷
// import PaperCombine from "@/views/paperCombine/PaperCombine.vue"
// import AnswerCard from '@/views/paperCombine/AnswerCard'

// 用户政策与隐私协议
// import UserAgreement from "@/layout/components/UserAgreement";
// import PrivacyPolicy from "@/layout/components/PrivacyPolicy";

// import NewSearchQues from '@/views/testPage/New_SearchQues'

const visitorRouter=[
  {
    path: '/',
    component: Home, // 首页不需要模块化
  },
  {
    path:'/paperdivide',
    name: "visitor/Paperdivide",
    component: () => import("@/views/labelManage/Paperdivide")
  },
  {
    path: "/ku",
    name: "visitor/Knowledge Unit",
    component: () => import("@/views/resourceQuery/KU/index.vue"),
  },
  {
    path: "/paperCombine",
    name: "visitor/PaperCombine",
    component: () => import("@/views/paperCombine/PaperCombine.vue"),
  },
  {
    path: "/answerCard",
    name: "visitor/AnswerCard",
    component: () => import("@/views/paperCombine/AnswerCard"),
  },
  {
    path: "/exercise",
    name: "visitor/Exercise",
    component: () => import("@/views/resourceQuery/Exercise/index.vue"),
  },
  {
    path: "/searchPaper",
    name: "visitor/SearchPaper",
    component: () => import("@/views/resourceQuery/SearchPaper"),
  },
  {
    path: "/paperDetailShow",
    name: "visitor/PaperDetailShow",
    component: () => import("@/views/resourceQuery/components/PaperDetailShow"),
  },
  {
    path: "/resources",
    name: "visitor/Resources",
    component: () => import("@/views/resourceQuery/Resources"),
  },
  // {
  //   path: "/ImageTranscription",
  //   name: "ImageTranscription",
  //   component: () => import("@/views/publicPlatform/ImageTranscription.vue"),
  // },
  // {
  //   path: "/estimate",
  //   name: "Estimate",
  //   component: () => import("@/views/publicPlatform/Estimate.vue"),
  // },
  // {
  //   path: "/segmentation",
  //   name: "Segmentation",
  //   component: () => import("@/views/publicPlatform/Segmentation.vue"),
  // },
  // {
  //   path: "/similarity",
  //   name: "Similarity",
  //   component: () => import("@/views/publicPlatform/Similarity.vue"),
  // },
  {
    path: "/MultiPaperAnalyse",
    name: "visitor/MultiPaperAnalyse",
    component: () => import("@/views/resourceAnalyse/MultiPaperAnalyse.vue"),
  },
  {
    path: "/inputMarked",
    name: "visitor/inputMarked",
    component: () => import("@/views/resourceInput/InputMarked"),
  },
  {
    path: "/testPage",
    name: "visitor/TestPage",
    component: () => import("@/views/testPage/TestPage"),
  },
  {
    path: "/testPageList",
    name: "visitor/TestPageList",
    component: () => import("@/views/testPage/TestPageList"),
  },
  {
    path: "/vditorTest",
    name: "visitor/vditorTest",
    component: () => import("@/views/testPage/vditorTest"),
  },
  // {
  //   path: "/remakeInputSingle",
  //   name: "RemakeInputSingle",
  //   component: Remaking_Input_Single
  // },
  // {
  //   path: "/remakeInputPaper",
  //   name: "RemakeInputPaper",
  //   component: Remaking_Input_Paper
  // },
  {
    path: "/members",
    name: "visitor/Members",
    component: () => import("@/views/Members_Introduce"),
  },
  {
    path: "/publicPlatform",
    name: "visitor/PublicPlatform",
    component: () => import("@/views/Home_PublicPlatform"),
  },
  {
    path: "/paperAnalyse",
    name: "visitor/PaperAnalyse",
    component: () => import("@/views/resourceAnalyse/PaperAnalyse"),
  },
  {
    path: "/paperAnalyseInput",
    name: "visitor/PaperAnalyseInput",
    component: () => import("@/views/resourceAnalyse/PaperAnalyseInput"),
  },
  {
    path: "/questionAnalyse",
    name: "visitor/QuestionAnalyse",
    component: () => import("@/views/resourceAnalyse/QuestionAnalyse"),
  },
  {
    path: "/questionAnalyseInput",
    name: "visitor/QuestionAnalyseInput",
    component: () => import("@/views/resourceAnalyse/QuestionAnalyseInput"),
  },
  {
    path: "/inputPaper",
    name: "visitor/inputPaper",
    component: () => import("@/views/resourceInput/InputPaper"),
  },
  {
    path: "/questionUpdate",
    name: "visitor/questionUpdate",
    component: () => import("@/views/labelManage/QuestionUpdate"),
  },
  {
    path: "/Agreement",
    name: "visitor/UserAgreement",
    component: () => import("@/layout/components/UserAgreement"),
  },
  {
    path: "/privacyPolicy",
    name: "visitor/PrivacyPolicy",
    component: () => import("@/layout/components/PrivacyPolicy"),
  },
  // {
  //   path: "/newSearchQues",
  //   name: "NewSearchQues",
  //   component: () => import("@/views/testPage/New_SearchQues"),
  // },
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
    component: () => import("@/views/Admin"),
    children: [
      {
        path: "/eduData",
        name: "visitor/admin/eduData",
        component: () => import("@/views/admin/EduData.vue"),
      },
      {
        path: "/concept",
        name: "visitor/admin/concept",
        component: () => import("@/views/admin/concept.vue"),
      },
      {
        path: "/knowledgePoint",
        name: "visitor/admin/knowledgePoint",
        component: () => import("@/views/admin/knowledgePoint.vue"),
      },
      {
        path: "/KPNew",
        name: "visitor/admin/KPNew",
        component: () => import("@/views/admin/KPNew.vue"),
      },
      {
        path: "/relation",
        name: "visitor/admin/relation",
        component: () => import("@/views/admin/relation.vue"),
      },
      {
        path: "/neeaNode",
        name: "visitor/admin/neeaNode",
        component: () => import("@/views/admin/neeaNode.vue"),
      },
      {
        path: "/importNode",
        name: "visitor/admin/importNode",
        component: () => import("@/views/admin/importNode.vue"),
      },
      {
        path: "/importEdge",
        name: "visitor/admin/importEdge",
        component: () => import("@/views/admin/importEdge.vue"),
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
        path: "/bulkImport",
        name: "visitor/admin/bulkImport",
        component: () => import("@/views/admin/bulkImport.vue"),
      },
      {
        path: "/checkExercise",
        name: "visitor/admin/checkExercise",
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
]


export default  visitorRouter
