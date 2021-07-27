// import VisitorLayout from '@/layout/visitor'

// Views主目录
import Admin from "@/views/Admin";
import Estimate from "@/views/Estimate";
import Home from "@/views/Home";
import Members from "@/views/Members_Introduce";
import Similarity from "@/views/Similarity";
import ImageTranscription from "@/views/ImageTranscription"

// 资源查询类页面
import KU from "@/views/resourceQuery/KU.vue";
import Exercise from "@/views/resourceQuery/Exercise";
import SearchPaper from "@/views/resourceQuery/SearchPaper"
import PaperDetailShow from "@/views/resourceQuery/components/PaperDetailShow"
import Resources from "@/views/resourceQuery/Resources";

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

// 组卷
import PaperCombine from "@/views/paperCombine/PaperCombine.vue"

// 用户政策与隐私协议
import UserAgreement from "@/layout/components/UserAgreement";
import PrivacyPolicy from "@/layout/components/PrivacyPolicy";

const visitorRouter=[
  {
    path: '/',
    component: Home,
  },
  {
    path: "/ku",
    name: "Knowledge Unit",
    component: KU,
  },
  {
    path: "/paperCombine",
    name: "PaperCombine",
    component: PaperCombine
  },
  {
    path: "/exercise",
    name: "Exercise",
    component: Exercise,
  },
  {
    path: "/searchPaper",
    name: "SearchPaper",
    component: SearchPaper,
  },
  {
    path: "/paperDetailShow",
    name: "PaperDetailShow",
    component: PaperDetailShow,
  },
  {
    path: "/resources",
    name: "Resources",
    component: Resources,
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
		path: "/ImageTranscription",
		name: "ImageTranscription",
		component: ImageTranscription
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
  {
    path: "/Agreement",
    name: "UserAgreement",
    component: UserAgreement
  },
  {
    path: "/privacyPolicy",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
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
]


export default  visitorRouter
