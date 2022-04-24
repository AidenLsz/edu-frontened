const PublicPlatformRouter = [
  {
    path: '',
    component: () => import("@/views/Home_PublicPlatform"),
  },
  {
    path: "estimate",
    name: "pb/Estimate",
    component: () => import("@/views/publicPlatform/Estimate.vue"),
  },
  {
    path: "QuesEstimate",
    name: "pb/QuesEstimate",
    component: () => import("@/views/publicPlatform/QuesEstimate.vue"),
  },
  {
    path: "segmentation",
    name: "pb/Segmentation",
    component: () => import("@/views/publicPlatform/Segmentation.vue"),
  },
  {
    path: "ques-paired-quality",
    name: "pb/ques-paired-quality",
    component: () => import("@/views/publicPlatform/QuesPairedQuality/QuesPairedQuality.vue"),
  },
  {
    path: "similarity",
    name: "pb/Similarity",
    component: () => import("@/views/publicPlatform/Similarity.vue"),
  },
  {
    path: "ImageTranscription",
    name: "pb/ImageTranscription",
    component: () => import("@/views/publicPlatform/ImageTranscription.vue"),
  },
  {
    path: "AILabLogin",
    name: "pb/AILabLogin",
    component: () => import("@/views/publicPlatform/AILabLogin.vue"),
  },
  {
    path: "AILabRegister",
    name: "pb/AILabRegister",
    component: () => import("@/views/publicPlatform/AILabRegister.vue"),
  },
]


export default PublicPlatformRouter
