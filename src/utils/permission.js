import router from '@/router'
import store from '@/store'
import { getToken } from '@/utils/auth'
// import { getUserInfo, getUserImage } from '@/api/userCenter'

const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  /* eslint-disable no-lonely-if */
  if (getToken()) {
    if (to.path === '/login' || to.path === '/') {
      next({ name: 'home' }) // 已登录状态下的登录重定向
    } else {
      // if (!store.state.user.realName) {
        // getUserInfo().then(res => {
        //   store.dispatch('setUserInfo', res.data)
        // })
      // }
      // if (!store.state.user.userPhoto) {
        // getUserImage().then(res => {
        //   store.dispatch('setPhoto', res.data)
        // })
      // }

      const accessRoutes = store.dispatch('permission/generateRoutes', ['admin'])

      router.addRoutes(accessRoutes)

      next({ ...to, replace: true })
    }
  } else { // 无token
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ name: 'login' })
    }
  }
})
