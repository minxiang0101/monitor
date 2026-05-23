import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/qdoner/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/qdoner/adminUser/queryLoginUser',
    method: 'post'
  })
}

// 用户登出
export function logout() {
  return request({
    url: '/qdoner/logout',
    method: 'post'
  })
}

//获取导航类表
export function getNavList() {
  return request({
    url: '/qdoner/build/projectUser/userProList',
    method: 'post'
  })
}

// 获取用户权限
export function getPermission() {
  return request({
    url: '/qdoner/adminRoleMenuDp/getByUser',
    method: 'get'
  })
}