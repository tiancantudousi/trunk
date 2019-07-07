import * as types from './mutation-types'

const matutaions = {
  [types.set_offies](state, offiesList) {
    state.offiesList = offiesList
  },
  [types.set_singlelist](state, singlelist) {
    state.singlelist = singlelist
  },
  [types.set_province](state, province) {
    state.province = province
  },
  [types.set_offiesize](state, offiesize) {
    state.offiesize = offiesize
  },
  [types.set_areacode](state, areacode) {
    state.areacode = areacode
  },
  [types.set_logindata](state, logindata) {
    state.logindata = logindata
  },
  [types.setCityCode] (state, cityCode) {
    state.cityCode = cityCode
  },
  [types.setCityName] (state, cityName) {
    state.cityName = cityName
  },
  [types.setCountryName] (state, countryName) {
    state.countryName = countryName
  },
  [types.setCountryCode] (state, countryCode) {
    state.countryCode = countryCode
  },
  [types.setHospital] (state, hospital) {
    state.hospitalName = hospital.name
    state.hospitalId = hospital.id
  }
}

export default matutaions
