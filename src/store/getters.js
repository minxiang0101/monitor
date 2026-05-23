const getters = {
  token: state => state.user.token,
  userInfo: state => state.user.userInfo,
  project: state => state.user.project,
  projectInfo: state => state.user.projectInfo,
  roles: state => state.user.roles
}
export default getters