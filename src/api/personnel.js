import request from '@/utils/request'

export function getProjectInfo() {
  return request({
    url: '/qdoner/build/projectInfo/getProjectInfoById/120',
    method: 'post'
  })
}
//班组信息
export function getTeamInfo() {
  return request({
    url: '/qdoner/build/labourInfocollection/selectTeamList',
    method: 'post'
  })
}

//近七天考勤人数
export function getAttendanceInfo() {
  return request({
    url: '/qdoner/build/bLabourAttendanceRecord/selectAttendanceNumber',
    method: 'get'
  })
}
//黑名单人员预警
export function getBlackList(pageType=0) {
  return request({
    url: '/qdoner/build/blacklist/list',
    method: 'get',
    params:{
      pageType:pageType
    }
  })
}

//进出场记录
export function getInOutRecord() {
  return request({
    url: '/qdoner/build/bLabourAttendanceRecord/selectEntryAndExit',
    method: 'post'
  })
}

//参建单位
export function getJoinUnit() {
  return request({
    url: '/qdoner/build/bLabourAttendanceRecord/subcontractor',
    method: 'get'
  })
}

//人员分析
export function getPersonnelAnalysis() {
  return request({
    url: '/qdoner/build/labourInfocollection/selectRealTimeNumber',
    method: 'post'
  })
}