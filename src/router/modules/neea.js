const router=[
  {
    path: '',
    component:()=>import("@/views/Home_NEEA"),
  },
  {
    path: "exercise",
    name: "Exercise",
    component:()=> import("@/views/resourceQuery/Exercise"),
  },
  {
    path: "searchPaper",
    name: "SearchPaper",
    component:()=> import("@/views/resourceQuery/SearchPaper"),
  },
  {
    path: "paperDetailShow",
    name: "PaperDetailShow",
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
    name: "inputMarked",
    component:()=> import("@/views/resourceInput/InputMarked"),
  },
  {
    path: "members",
    name: "Members",
    component:()=> import("@/views/Members_Introduce")
  },
	// {
	// 	path: "/ImageTranscription",
	// 	name: "ImageTranscription",
	// 	component:()=> ImageTranscription
	// },
  {
    path: "paperAnalyse",
    name: "PaperAnalyse",
    component:()=> import("@/views/resourceAnalyse/PaperAnalyse")
  },
  {
    path: "paperAnalyseInput",
    name: "PaperAnalyseInput",
    component:()=> import("@/views/resourceAnalyse/PaperAnalyse"),
  },
  {
    path: "questionAnalyse",
    name: "QuestionAnalyse",
    component:()=> import("@/views/resourceAnalyse/QuestionAnalyse")
  },
  {
    path: "questionAnalyseInput",
    name: "QuestionAnalyseInput",
    component:()=> import("@/views/resourceAnalyse/QuestionAnalyseInput")
  },
  {
    path: "inputPaper",
    name: "inputPaper",
    component:()=> import("@/views/resourceInput/InputPaper"),
  },
]


export default router
