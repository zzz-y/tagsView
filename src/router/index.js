import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: 'Home-test', affix: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: 'About-test' }
  },
  {
    path: '/icon',
    name: 'icon',
    component: () => import('@/views/icon'),
    meta: { title: 'Icons-test', roles: ['admin', 'editor'] }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test'),
    meta: { title: 'test' }
  },
  {
    path: '/test1',
    name: 'test1',
    component: () => import('@/views/test'),
    meta: { title: 'test1' }
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import('@/views/test'),
    meta: { title: 'test2' }
  },
  {
    path: '/test3',
    name: 'test3',
    component: () => import('@/views/test'),
    meta: { title: 'test3' }
  },
  {
    path: '/test4',
    name: 'test4',
    component: () => import('@/views/test'),
    meta: { title: 'test4' }
  },
  {
    path: '/test5',
    name: 'test5',
    component: () => import('@/views/test'),
    meta: { title: 'test5' }
  },
  {
    path: '/test6',
    name: 'test6',
    component: () => import('@/views/test'),
    meta: { title: 'test6' }
  },
  {
    path: '/test7',
    name: 'test7',
    component: () => import('@/views/test'),
    meta: { title: 'test7' }
  },
  {
    path: '/test8',
    name: 'test8',
    component: () => import('@/views/test'),
    meta: { title: 'test8' }
  },
  {
    path: '/test9',
    name: 'test9',
    component: () => import('@/views/test'),
    meta: { title: 'test9' }
  },
  {
    path: '/test10',
    name: 'test10',
    component: () => import('@/views/test'),
    meta: { title: 'test10' }
  },
  {
    path: '/test11',
    name: 'test11',
    component: () => import('@/views/test'),
    meta: { title: 'test11' }
  },
  {
    path: '/test12',
    name: 'test12',
    component: () => import('@/views/test'),
    meta: { title: 'test12' }
  },
  {
    path: '/test13',
    name: 'test13',
    component: () => import('@/views/test'),
    meta: { title: 'test13' }
  },
  {
    path: '/test14',
    name: 'test14',
    component: () => import('@/views/test'),
    meta: { title: 'test14' }
  },
  {
    path: '/test15',
    name: 'test15',
    component: () => import('@/views/test'),
    meta: { title: 'test15' }
  },
  {
    path: '/test16',
    name: 'test16',
    component: () => import('@/views/test'),
    meta: { title: 'test16' }
  },
  {
    path: '/test17',
    name: 'test17',
    component: () => import('@/views/test'),
    meta: { title: 'test17' }
  },
  {
    path: '/test18',
    name: 'test18',
    component: () => import('@/views/test'),
    meta: { title: 'test18' }
  },
  {
    path: '/test19',
    name: 'test19',
    component: () => import('@/views/test'),
    meta: { title: 'test19' }
  },
  {
    path: '/test20',
    name: 'test20',
    component: () => import('@/views/test'),
    meta: { title: 'test20' }
  },
]

export const asyncRoutes = [
  {
    path: '/icon',
    name: 'icon',
    component: () => import('@/views/icon'),
    meta: { title: 'Icons', roles: ['admin', 'editor'] }
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test'),
    meta: { title: 'test' }
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
