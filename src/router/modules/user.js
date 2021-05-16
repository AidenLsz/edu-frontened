import UserLayout from '@/layout/user'

const UserRouter=[
  {
    path: '/dashboard',
    component: UserLayout,
    children: [
      {
        path:'',
        component: () => import('@/views/DashBoard'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'el-icon-s-home' }
      }
    ]
  },
  {
    path: '/input',
    component: UserLayout,
    meta: { title: '资源录入', icon: 'el-icon-edit-outline' },
    children: [
      {
        path: 'study',
        meta: { title: '学习资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'question',
        meta: { title: '试题资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'paper',
        meta: { title: '试卷资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'system',
        meta: { title: '知识体系', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
    ]
  },
  {
    path: '/search',
    component: UserLayout,
    meta: { title: '资源检索', icon: 'el-icon-search' },
    children: [
      {
        path: 'study',
        meta: { title: '学习资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'question',
        meta: { title: '试题资源', icon: '' },
        component: () => import('@/views/resourceQuery/Exercise'),
      },
      {
        path: 'paper',
        meta: { title: '试卷资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'system',
        meta: { title: '知识体系', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
    ]
  },
  {
    path: '/analysis',
    component: UserLayout,
    meta: { title: '智能分析', icon: 'el-icon-pie-chart' },
    children: [
      {
        path: 'question',
        meta: { title: '试题资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'paper',
        meta: { title: '试卷资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
    ]
  },
  {
    path: '/manage',
    component: UserLayout,
    meta: { title: '资源管理', icon: 'el-icon-s-management' },
    children: [
      {
        path: 'study',
        meta: { title: '学习资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'question',
        meta: { title: '试题资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'paper',
        meta: { title: '试卷资源', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
      {
        path: 'system',
        meta: { title: '知识体系', icon: '' },
        component: () => import('@/views/manage/question/index'),
      },
    ]
  },
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path:'',
        component: () => import('@/views/manage/question/index'),
        name: '',
        meta: { title: '用户管理', icon: 'el-icon-user-solid' }
      }
    ]
  },
]
export default UserRouter
