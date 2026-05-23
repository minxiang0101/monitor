import request from '@/utils/request'

export function getProjectInfo(id) {
  return request({
    url: '/qdoner/build/projectInfo/getProjectInfoById/' + id,
    method: 'post'
  })
}
//质量问题情况
export function getQualityProblem() {
  return request({
    url: '/qdoner/build/buildQualHiddenTrouble/selectQualQuestionsQuantity',
    method: 'post',
  })
}

//安全隐患情况
export function getSafetyHidden(data) {
  return request({
    url: '/qdoner/build/monitorPointAlert/selectTypeProportionByParent',
    method: 'post',
    data: data
  })
}

//工程進度
export function getProjectProgress() {
  return request({
    url: '/qdoner/build/progressPlanManageDetails/selectPlanLastTimeSHOUYE ',
    method: 'post'
  })
}
//特种设备管理
export function getSpecialEquipment() {
  return request({
    url: '/qdoner/build/equipmentType/selectAllType',
    method: 'get'
  })
}

//项目公告
export function getProjectBulletin() {
  return request({
    url: '/qdoner/build/projectAnno/list',
    method: 'get'
  })
}
// 安保管理
export function getSecurityManagement() {
  return request({
    url: '/qdoner/build/projectManager/list',
    method: 'get',
  })
}

//环境监测
export function getEnvironmentMonitoring() {
  return request({
    url: '/qdoner/build/eqMonitorDataAt/selectEnvDataAt',
    method: 'post',
  })
}
//下载图片
export function downloadImage(url) {
  return request({
    url: '/qdoner' + url,
    method: 'get',
    responseType: 'blob'
  })
}
//环境指标检查
export function getEnvironmentIndex(type = '1') {
  return request({
    url: '/qdoner/build/equipmentMonitorDataMonth/selectRecentData',
    method: 'post',
    data: {
      type: type
    }
  })
}
//绿色施工-监测数据走势图
export function getGreenConstruction(type = '1') {
  return request({
    url: '/qdoner//build/equipmentMonitorData/realTimeDataZs',
    method: 'post',
    data: {
      type: type
    }
  })
}

//资料目录列表
export function getMaterialList() {
  return request({
    url: '/qdoner/build/projectFileCatalog/selectTree',
    method: 'get',
  })
}
//资料列表
export function getMaterialData(catalogId, fileName, fileCode, preparedUnit, beginTime, endTime, page = '1', limit = '10',) {
  return request({
    url: '/qdoner/build/projectFile/list',
    method: 'get',
    params: {
      catalogId,
      fileName,
      fileCode,
      preparedUnit,
      beginTime,
      endTime,
      page,
      limit,
    }
  })
}


// 机械设备-实时数据
export function getEquipmentData() {
  return request({
    url: '/qdoner/build/equipmentAssets/selectTowerCraneOverview',
    method: 'get',
  })
}

//机械设备-运行状态
export function getEquipmentState(id) {
  return request({
    url: '/qdoner/build/equipmentAssets/selectTowerCraneById/' + id,
    method: 'get',
  })
}

//机械设备-设备信息
export function getEquipmentInfo(id) {
  return request({
    url: '/qdoner/build/equipmentTowerEffect/selectJRGX/' + id,
    method: 'get',
  })
}

//机械设备-吊重统计
export function getEquipmentWeight(id) {
  return request({
    url: '/qdoner/build/equipmentTowerEffect/selectDZTJ/' + id,
    method: 'get',
  })
}
//机械设备-获取使用人信息
export function getEquipmentUser(id) {
  return request({
    url: '/qdoner/build/equipmentTowerEffect/selectSJXX/' + id,
    method: 'get',
  })
}
//工作循环记录
export function getWorkRecord(id, pageNum = 1, limit = 10, startTime, endTime) {
  return request({
    url: '/qdoner/build/equipmentTowerEffect/selectPage',
    method: 'post',
    data: {
      page: pageNum,
      limit: limit,
      assetId: id,
      startTime: startTime,
      endTime: endTime
    }
  })
}

//监测历史记录
export function getMonitorHistory(id, pageNum = 1, limit = 10, startTime, endTime) {
  return request({
    url: '/qdoner/build/equipmentTowerDataAt/selectPage',
    method: 'post',
    data: {
      page: pageNum,
      limit: limit,
      assetId: id,
      startTime: startTime,
      endTime: endTime
    }
  })
}
//报警历史记录
export function getAlarm(id, pageNum = 1, limit = 10, startTime, endTime) {
  return request({
    url: '/qdoner/build/monitorPointAlert/selectPage',
    method: 'post',
    data: {
      page: pageNum,
      limit: limit,
      assetId: id,
      startTime: startTime,
      endTime: endTime
    }
  })
}
//机械设备 设备实时运行列表
export function getSelectAllOverview() {
  return request({
    url: '/qdoner/build/equipmentAssets/selectAllOverview',
    method: 'get',
  })
}

//机械设备 报警数据
export function getSelectAllAlert() {
  return request({
    url: '/qdoner/build/equipmentAssets/selectAllAlertNew',
    method: 'get',
  })
}
//获取视频列表
export function getVideoList() {
  return request({
    url: '/qdoner/build/projectMonitor/list',
    method: 'get',
  })
}
// 获取视频树
export function getVideoTree() {
  return request({
    url: '/qdoner/build/projectMonitor/videoTree',
    method: 'get',
  })
}
// 获取视频流
export function getVideoStream(id) {
  return request({
    url: '/qdoner/build/projectMonitor/' + id,
    method: 'get',
  })
}
// 获取视频流
export function getVideoStreamById(id) {
  return request({
    url: '/qdoner/build/projectMonitor/video/' + id,
    method: 'get',
  })
}
// 云台控制
export function controlProjectMonitor(id, data) {
  return request({
    url: '/qdoner/build/projectMonitor/controlling/' + id,
    method: 'post',
    data
  })
}
//绿色施工-最新警报
export function getNewestAlert() {
  return request({
    url: '/qdoner/build/monitorPointAlert/selectFullAlarmPage',
    method: 'post',
    data: {
      page: 1,
      limit: 10,
    }
  })
}
// 预警类型字典
export function getMonitorType() {
  return request({
    url: '/qdoner/adminDict/data/type/b_equipment_monitor_type',
    method: 'get',
  })
}
//巡检类型字典

export function getCheckType() {
  return request({
    url: '/qdoner/adminDict/data/type/b_chekc_type',
    method: 'get',
  })
}

//培训情况
export function getTraining() {
  return request({
    url: '/qdoner/build/training/list',
    method: 'get',
  })
}

//云台控制
export function PtzControl(id, type) {
  return request({
    url: '/build/ysy/ptzControl',
    method: 'post',
    data: {
      channelId: id,
      deviceId: id,
      speed: 1,
      type: type
    }
  })
}

//获取AR监控URL
export function getArUrl() {
  return request({
    url: '/qdoner/build/ar/arUrl',
    method: 'get'
  })
}
