const router=[
  {
    path: '',
    component:()=>import("@/views/Home_EEMS"),
  },
  {
    path: "exercise",
    name: "eems/Exercise",
    component:()=> import("@/views/resourceQuery/Exercise/index"),
  },
  {
    path: "multiSourceSearch",
    name: "eems/MultiSourceSearch",
    component:()=> import("@/views/resourceQuery/Exercise/MultiSourceSearch"),
  },
  // {
  //   path: "multiexercise",
  //   name: "Exercise",
  //   component:()=> import("@/views/resourceQuery/MultiExercise/index.vue"),
  // },
  {
    path: "searchPaper",
    name: "eems/SearchPaper",
    component:()=> import("@/views/resourceQuery/SearchPaper"),
  },
  {
    path: "paperDetailShow",
    name: "eems/PaperDetailShow",
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
    name: "eems/inputMarked",
    component:()=> import("@/views/resourceInput/InputMarked"),
  },
  // {
  //   path: "members",
  //   name: "Members",
  //   component:()=> import("@/views/Members_Introduce")
  // },
	// {
	// 	path: "/ImageTranscription",
	// 	name: "ImageTranscription",
	// 	component:()=> ImageTranscription
	// },
  {
    path: "paperAnalyse",
    name: "eems/PaperAnalyse",
    component:()=> import("@/views/resourceAnalyse/PaperAnalyse")
  },
  {
    path: "paperAnalyseInput",
    name: "eems/PaperAnalyseInput",
    component:()=> import("@/views/resourceAnalyse/PaperAnalyseInput"),
  },
  {
    path: "questionAnalyse",
    name: "eems/QuestionAnalyse",
    component:()=> import("@/views/resourceAnalyse/QuestionAnalyse")
  },
  {
    path: "questionAnalyseInput",
    name: "eems/QuestionAnalyseInput",
    component:()=> import("@/views/resourceAnalyse/QuestionAnalyseInput")
  },
  {
    path: "inputPaper",
    name: "eems/inputPaper",
    component:()=> import("@/views/resourceInput/InputPaper"),
  },
  ]


export default router
