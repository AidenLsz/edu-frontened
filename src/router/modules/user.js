import SidebarLayout from '@/layout/SideBar'
import ContainerLayout from '@/layout/Container'

const UserRouter=[
  {
    path: '/manage',
    component: SidebarLayout,
    showSideBar:true,
    children: [
      {
        path:'dashboard',
        component: () => import('@/views/DashBoard'),
        name: 'Dashboard',
        meta: { title: '我的数据', icon: 'el-icon-s-home' }
      },
      {
        path: 'input',
        component: ContainerLayout,
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
        path: '/query',
        component: ContainerLayout,
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
            component: () => import('@/views/resourceQuery/SearchPaper'),
          },
          {
            path: 'system',
            meta: { title: '知识体系', icon: '' },
            component: () => import('@/views/manage/question/index'),
          },
        ]
      },
      {
        path: 'analysis',
        component: ContainerLayout,
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
        path: 'manage',
        meta: { title: '资源管理', icon: 'el-icon-s-management' },
        component: ContainerLayout,
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
        path: 'user',
        component: ContainerLayout,
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
  },

]
export default UserRouter
