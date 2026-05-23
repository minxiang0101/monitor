import request from '@/utils/request'



//AI识别报警
export function getAiAlert() {
  return request({
    url: '/qdoner/build/aiBareSoilData/selectPageNj',
    method: 'post',
    data:{
      page:0,
      limit:10
    }
  })
}
//隐患监测(近7天)
export function getAiAlarmCount() {
  return request({
    url: '/qdoner/build/aiVideoAlert/aiAlarmCount',
    method: 'get',
  })
}

//隐患排查管理(近7天)
export function getDanger7() {
  return request({
    url: '/qdoner/build/safetyInspectionDetail/selectCurveData',
    method: 'post'
  })
}
//安全巡检饼状图
export function getSafetyPie() {
  return request({
    url: '/qdoner/build/safetyInspectionDetail/selectPieData',
    method: 'post'
  })
}
//安全紧急管理
export function getSafetyUrgent() {
  return request({
    url: '/qdoner/build/bSafetySafetyEmergency/list',
    method: 'post',
    data:{
      page:0,
      limit:10
    }
  })
}
//获取文件地址
export function getFileUrl(fileId) {
  return request({
    url: '/qdoner/adminFile/queryFileList/'+fileId,
    method: 'post',
  })
}

//随手拍管理
export function getSafetyPhoto(page=1,limit=10,beginDate='',endDate='') {
  return request({
    url: '/qdoner/build/safetyInspectionInfo/list',
    method: 'post',
    data:{
      page: page,
      limit: limit,
      beginDate:beginDate,
      endDate: endDate,
    }
  })
}