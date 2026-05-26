import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
const NoPermission = () => import(/* webpackChunkName: "no-permission" */ '../views/NoPermission.vue')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    hidden: true // 不在菜单中显示
  },
  {
    path: '/no-permission',
    name: 'no-permission',
    component: NoPermission,
    hidden: true // 不在菜单中显示
  },
  {
    path: '/',
    redirect: '/video'
  },
  {
    path: '/video',
    // name: '视频监控',
    component: () => import(/* webpackChunkName: "video" */ '../views/VideoMonitoring/'),
    meta: { permission: 'isVideo' },
    children: [
      {
        path: '',
        name: '视频监控',
        component: () => import(/* webpackChunkName: "video" */ '../views/VideoMonitoring/default.vue'),
        meta: { permission: 'isVideo' }
      },
      {
        path: 'ar',
        name: 'AR监控',
        component: () => import(/* webpackChunkName: "ar" */ '../views/ARMonitoring/index.vue'),
        meta: { permission: 'isVideo' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/video'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/monitor/' : '',
  routes
})

export default router
