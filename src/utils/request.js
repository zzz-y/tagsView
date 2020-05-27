import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

const tokenHeader = 'token' // token自定义头部名称

// request interceptor
service.interceptors.request.use((config) => {
  const token = store.state.user.token
  if (token) {
    /* eslint-disable no-param-reassign */
    config.headers[tokenHeader] = getToken()
  }
  return config
}, (error) => {
  // do something with request error
  console.log('error', error) // for debug
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
  if (!getToken() && router.currentRoute.name !== 'login') {
    store.dispatch('UserLogout').then(() => {
      router.push({ name: 'Login' })
    })
    store.dispatch('workArea/clearWorkArea')
  }
  if (response.status === 200 && response.data.code === 200) {
    return response.data
  } else {
    if (response.data.code === 611 || (response.data.code === 690 &&
      router.currentRoute.name !== 'login')) {
      store.dispatch('UserLogout').then(() => {
        router.push({ name: 'Login' })
      })
      store.dispatch('workArea/clearWorkArea')
    }
    return Promise.reject(response.data)
  }
}, (error) => {
  console.log('err' + error) // for debug
  console.log(error.response.data)
  // store.dispatch('UserLogout').then(() => {
  //   router.push({ name: 'Login' })
  // })
  return Promise.reject(error)
})

export default service
