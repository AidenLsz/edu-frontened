const PublicPlatformRouter = [{
    path: '',
    component: () => import("@/views/Home_PublicPlatform"),
  },
  {
    path: "estimate",
    name: "Estimate",
    component: () => import("@/views/publicPlatform/Estimate.vue"),
  },
  {
    path: "segmentation",
    name: "Segmentation",
    component: () => import("@/views/publicPlatform/Segmentation.vue"),
  },
  {
    path: "similarity",
    name: "Similarity",
    component: () => import("@/views/publicPlatform/Similarity.vue"),
  },
  {
    path: "ImageTranscription",
    name: "ImageTranscription",
    component: () => import("@/views/publicPlatform/ImageTranscription.vue"),
  },
  {
    path: "AILabLogin",
    name: "AILabLogin",
    component: () => import("@/views/publicPlatform/AILabLogin.vue"),
  },
  {
    path: "AILabRegister",
    name: "AILabRegister",
    component: () => import("@/views/publicPlatform/AILabRegister.vue"),
  },
]


export default PublicPlatformRouter