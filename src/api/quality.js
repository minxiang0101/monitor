import request from '@/utils/request'

//问题整改
export function getSelectRectifyDateWarning() {
  return request({
    url: '/qdoner/build/buildQualHiddenTrouble/selectRectifyDateWarning',
    method: 'post',
  })
}
//问题数量
export function getSelectRectifyDate() {
  return request({
    url: '/qdoner/build/buildQualHiddenTrouble/selectPieData',
    method: 'post',
  })
}
//质量检查数据统计分析
export function getTsjfx() {
  return request({
    url: '/qdoner/build/buildQualHiddenTrouble/selectBarData',
    method: 'post',
    data: {
      type: '1'
    }
  })
}

//质量验收
export function getQualityAcceptance() {
  return request({
    url: '/qdoner/build/qualAcceptRecord/list',
    method: 'post',
    data: {
      page: 1,
      limit: 10,
    }
  })
}
//质量验收列表详情
export function getQualityAcceptanceInfo(id) {
  return request({
    url: '/qdoner/build/qualAcceptBatch/getById/' + id,
    method: 'get',
  })
}

//质量巡检
export function getQualityInspection() {
  return request({
    url: '/qdoner/buildQualCheck/list',
    method: 'post',
    data: {
      page: 1,
      limit: 20,
      startCheckDate: "",
      endCheckDate: ""
    }
  })
}
//质量巡检详情
export function getQualityInspectionInfo(id) {
  return request({
    url: '/qdoner/buildQualCheck/getById/' + id,
    method: 'post',
  })
}
//隐患等级字典
export function getHazardLevel() {
  return request({
    url: '/qdoner/adminDict/data/type/b_hazard_level',
    method: 'get',
  })
}
//紧急程度字典
export function getEmergencyDegree() {
  return request({
    url: '/qdoner/adminDict/data/type/b_qual_priority',
    method: 'get',
  })
}

