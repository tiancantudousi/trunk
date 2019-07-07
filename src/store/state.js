
import storage from 'common/js/storage.js'
const state = {
  offiesList: [],
  singlelist: '',
  province: '',
  offiesize: '',
  areacode: storage.getSession('areacode') ? storage.getSession('areacode') : '',
  logindata: storage.getSession('logindata') ? storage.getSession('logindata') : '',
  cityCode: '', // 城市code
  cityName: '全部',
  countryCode: '',
  countryName: '全部',
  hospitalName: '全部',
  hospitalId: ''
}

export default state
