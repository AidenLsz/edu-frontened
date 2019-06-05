import Vue from 'vue'
import Router from 'vue-router'
import KU from '@/components/KU'
import Exercise from '@/components/Exercise'
import Home from '@/components/Home'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/ku',
      name: 'Knowledge Unit',
      component: KU
    },
    {
      path: '/exercise',
      name: 'Exercise',
      component: Exercise
    },
    {
      name: '404',
      path: '/404',
      component: () => import('@/components/404.vue')
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})


