const router=[
{
    path: '',
    component:()=>import("@/views/Home_ITAS"),
},
  {
    path: "luna-search",
    name: "itas/luna-search",
    component:()=> import("@/views/resourceQuery/Index"),
  },
{
    path: "exercise",
    name: "itas/Exercise",
    component:()=> import("@/views/resourceQuery/Exercise/index"),
  },
  // {
  //   path: "multiexercise",
  //   name: "Exercise",
  //   component:()=> import("@/views/resourceQuery/MultiExercise/index.vue"),
  // },
  {
    path: "searchPaper",
    name: "itas/SearchPaper",
    component:()=> import("@/views/resourceQuery/SearchPaper"),
  },
  {
    path: "paperDetailShow",
    name: "itas/PaperDetailShow",
    component:()=> import("@/views/resourceQuery/components/PaperDetailShow"),
  },
  //开放平台
  // {
  //   path: "/estimate",
  //   name: "Estimate",
  //   component:()=> Estimate,
  // },
  // {
  //   path: "/similarity",
  //   name: "Similarity",
  //   component:()=> Similarity,
  // },
  {
    path: "inputMarked",
    name: "itas/inputMarked",
    component:()=> import("@/views/resourceInput/InputMarked"),
  },
  {
    path: "members",
    name: "itas/Members",
    component:()=> import("@/views/Members_Introduce")
  },
// {
//     path: "/ImageTranscription",
//     name: "ImageTranscription",
//     component:()=> ImageTranscription
// },
  {
    path: "paperAnalyse",
    name: "itas/PaperAnalyse",
    component:()=> import("@/views/resourceAnalyse/PaperAnalyse")
  },
  {
    path: "paperAnalyseInput",
    name: "itas/PaperAnalyseInput",
    component:()=> import("@/views/resourceAnalyse/PaperAnalyseInput"),
  },
  {
    path: "questionAnalyse",
    name: "itas/QuestionAnalyse",
    component:()=> import("@/views/resourceAnalyse/QuestionAnalyse")
  },
  {
    path: "questionAnalyseInput",
    name: "itas/QuestionAnalyseInput",
    component:()=> import("@/views/resourceAnalyse/QuestionAnalyseInput")
  },
  {
    path: "MultiPaperAnalyse",
    name: "itas/MultiPaperAnalyse",
    component: () => import("@/views/resourceAnalyse/MultiPaperAnalyse.vue"),
  },
  {
    path: "inputPaper",
    name: "itas/inputPaper",
    component:()=> import("@/views/resourceInput/InputPaper"),
  },
  {
    path: "paperCombine",
    name: "itas/paperCombine",
    component:()=> import("@/views/paperCombine/PaperCombine")
  },
  {
    path: "ku",
    name: "itas/ku",
    component:()=> import("@/views/resourceQuery/KU/index")
  }
]


export default router
