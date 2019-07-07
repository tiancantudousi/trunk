import { post } from './homeHttp'

// 根据区域代码查询区域列表
export function getChinaNationByCode (data) {
  return post('/medicalwaste/v1/getChinaNationByCode', data)
};

// 根据区域代码查询医院（机构）列表
export function getHospitalByCode (data) {
  return post('/medicalwaste/v1/getHospitalByCode', data)
}

// 医废 统计
export function getMedicalWasteCount (data) {
  return post('/medicalwaste/v1/getMedicalWasteCount', data)
}

// 医废 统计 通过 日期
export function getMedicalWasteCountByDay (data) {
  return post('/medicalwaste/v1/getMedicalWasteCountByDay', data)
}

// 异常 预警 接口
export function getAbnormalWarningByCode (data) {
  return post('/medicalwaste/v1/getAbnormalWarningByCode', data)
}

// 回收 统计 数据
export function getHarmlessWasteCount (data) {
  return post('/medicalwaste/v1/getHarmlessWasteCount', data)
}

// 小箱 进 大箱 - 回收 情况 统计
export function getRecycleCount (data) {
  return post('/medicalwaste/v1/getRecycleCount', data)
}

// 医废 统计 近期 统计
export function getMedicalWasteCountRecent (data) {
  return post('/medicalwaste/v1/getMedicalWasteCountRecent', data)
}

// 视频 监控 查询 设备号
export function getVideoId (data) {
  return post('/medicalwaste/v1/getVideoId', data)
}

// 回收 车辆 列表查询
export function getCarList (data) {
  return post('/medicalwaste/v1/getCarList', data)
}

// 回收 车辆 定位查询
export function getCarLocation (data) {
  return post('/medicalwaste/v1/getCarLocation', data)
}

// 根据 区域代码 查询 科室 列表
export function getDeptByCode (data) {
  return post('/medicalwaste/v1/getDeptByCode', data)
}
export function getCountByDeptCode (data) {
  return post('/medicalwaste/v1/getMedicalWasteCountByDeptCode', data)
}


