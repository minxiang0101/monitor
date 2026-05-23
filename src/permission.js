import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/no-permission'] // no redirect whitelist

// 检查路由权限
function hasRoutePermission(route, roles) {
  if (!route.meta || !route.meta.permission) {
    return true // 没有权限要求的路由默认允许访问
  }
  
  if (!roles || typeof roles !== 'object') {
    return false // 没有权限数据时拒绝访问
  }
  
  return roles[route.meta.permission] === 1
}

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 已登录时直接进入视频监控
      next({ path: '/video' })
      NProgress.done()
    } else {
      const hasProject = !!store.getters.project
      if (hasProject) {
        // 检查路由权限
        const roles = store.getters.roles
        if (hasRoutePermission(to, roles)) {
          next()
        } else {
          next('/no-permission')
          NProgress.done()
        }
      } else {
        try {
          await store.dispatch('getInfo')
          await store.dispatch('getProjectInfo')
          await store.dispatch('getPermission')
          
          // 获取权限后再次检查路由权限
          const roles = store.getters.roles
          // 检查路由权限
          if (hasRoutePermission(to, roles)) {
            next()
          } else {
            next('/no-permission')
            NProgress.done()
          }
        } catch (error) {
          await store.dispatch('resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})