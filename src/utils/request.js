import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '', // url基础地址
  timeout: 10000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    NProgress.start() // start progress bar
    const token = store.state.user.token
    if (token) {
      // 让每个请求携带token
      config.headers['Admin-Token'] = `${token}`
    }
    return config
  },
  error => {
    // 处理请求错误
    console.log(error)
    NProgress.done() // finish progress bar
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 根据自定义错误码判断请求是否成功
    NProgress.done() // finish progress bar
    if (res.code === 0) {
      // 成功返回数据
      return res
    } else if (res.code === 90100) {
      // 处理业务错误
      // Message({
      //   message:'未授权，请重新登录',
      //   type: 'error',
      //   duration: 2 * 1000
      // })
      return Promise.reject(res.msg)
    }else{
      Message({
        message: res.msg ,
        type: 'error',
        duration: 2 * 1000
      })
      return Promise.reject(res.msg)
    }
  },
  error => {
   
    NProgress.done() // finish progress bar
    return Promise.reject(error)
  }
)

// 导出实例
export default service