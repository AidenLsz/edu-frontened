const AIlabUserRouter = [{
    path: 'userInfo',
    component: () => import("@/views/publicPlatform/user/userInfo"),
  },
  {
    path: 'ChangePass',
    component: () => import("@/views/publicPlatform/user/ChangePass"),
  },
  {
    path: 'MyPro',
    component: () => import("@/views/publicPlatform/user/MyPro"),
  },
  {
    path: 'CreateProject',
    component: () => import("@/views/publicPlatform/user/CreateProject"),
  },
  {
    path: 'ProDetail',
    component: () => import("@/views/publicPlatform/user/ProDetail"),
  },
  {
    path: 'Statistics',
    component: () => import("@/views/publicPlatform/user/Statistics"),
  }
]


export default AIlabUserRouter