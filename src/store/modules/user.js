import { login, logout, getPermission, getUserInfo, getNavList } from '@/api/user'
import { getProjectInfo } from '@/api/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'


const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  userInfo: null,
  project: null,
  projectInfo: null,
  roles: {}
}

const mutations = {
  SET_PROJECT: (state, projectInfo) => {
    state.project = projectInfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PROJECTINFO: (state, projectInfo) => {
    state.projectInfo = projectInfo
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username, password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.adminToken)
        setToken(data.adminToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_PROJECT', '')
        commit('SET_USERINFO', null)
        commit('SET_AVATAR', '')
        commit('SET_ROLES', {})
        commit('SET_PROJECTINFO', null)
        removeToken()
        router.replace('/login')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },
  //获取项目信息
  getProjectInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getNavList().then(async response => {
        const { data } = response
        if (data && Array.isArray(data) && data.length > 0 && data[0]) {
          commit('SET_PROJECT', data[0])
          let projectInfo = await getProjectInfo(data[0]?.projectId).then(res => res.data)
          commit('SET_PROJECTINFO', projectInfo)
          resolve(data[0])
        }
      }).catch(error => {
        // 将API调用本身的错误也传递出去
        reject(error)
      })
    })
  },
  //获取权限
  getPermission({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPermission().then(response => {
        const { data } = response
        console.log(data)
        if (data?.construction && Object.keys(data.construction).length > 0) {
          commit('SET_ROLES', data?.construction)
          resolve(data)
        } else {
          // 即使没有权限数据，也要resolve Promise
          commit('SET_ROLES', {})
          resolve(data || {})
        }
      }).catch(error => {
        // 将API调用本身的错误也传递出去
        reject(error)
      })
    })
  },

}

export default {
  // namespaced: true,
  state,
  mutations,
  actions
}