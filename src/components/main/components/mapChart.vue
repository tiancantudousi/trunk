<template>
    <div class="index-ring">
        <div class="map-box">
            <div :id="mapId" style="height: 100%;position: relative;" v-if="!areaChange">地图</div>
        </div>
    </div>   
</template>

<script>
const echarts = require('echarts');
// const ecConfig = require('echarts/config').EVENT;
import { option, areaData, getOption } from './mapChartOption.js'
import { getMedicalWasteCount } from '../../../api/home.js'
import { mapActions, mapGetters,mapMutations } from "vuex";
import { formatDate, getMonthDays } from '../../../common/js/date.js'
require('echarts-gl')
import Bus from '../../../common/js/bus.js'
export default {
 
    data () {
        return {
            areaCode: null,
            orgCode: '',
            medicalWasteResult: [],
            startDate: null,
            endDate: null,
            mapId: '',
            areaChange: false,
        }
    },
   
    computed:{
      ...mapGetters(['areacode','logindata', 'cityCode', 'cityName',
        'countryName', 'countryCode', 'hospitalName', 'hospitalId']),
    },
    methods: {
        getMedicalWasteCount () {
            const data = {
                startDt: this.startDate,
                endDt: this.endDate,
                areaCode: this.areaCode,
                orgId: this.orgCode
            }
            getMedicalWasteCount(data).then(res => {
                if (res['status'] === '1') {
                    let {result, total} = res
                    if (result) {
                        this.medicalWasteResult = result
                        areaData.list = result
                        this.initMap()
                    }
                    let totalWeight
                    if (total && total['totalWeight']) {
                        totalWeight = total['totalWeight']
                    } else {
                        totalWeight = 0
                    }
                    this.$emit('totalweight', totalWeight)
                } else {}
            })
        },
        initMap () {
            // JSON文件(地图数据)路径
            var uploadedDataURL = this.getCityUrl()
            setTimeout(() => {
                try {
                    var myChart = echarts.init(document.getElementById(this.mapId), null, {
                        devicePixelRatio: 2
                    });
                              
                    myChart.on('click',  function eConsole(param) {
                    //这个params可以获取你要的饼图中的当前点击的项的参数
                        console.log(param)
                    });
                    // 显示加载动画效果,可以在加载数据前手动调用该接口显示加载动画，在数据加载完成后调用 hideLoading 隐藏加载动画。
                    myChart.showLoading();
                    // 引入JSON文件
                    $.getJSON(uploadedDataURL, (geoJson) => {
                        const option = getOption()
                        // 注册地图名字(tongren)和数据(geoJson)
                        let mapName = this.areaCode === '330200' ? 'tongren' : 'tongren1'
                        echarts.registerMap(this.mapId, geoJson);
                        option.series[0].map = this.mapId
                        // 隐藏动画加载效果。
                        myChart.hideLoading();
                        // 图表配置项		
                        myChart.setOption(option, window.onresize = myChart.resize);
                    });
                } catch (e) {
                    this.areaChange = false
                    this.initMap()
                }
            }, 0)
        },
        getCityUrl () {
            let url = ''
            let code = this.areaCode
            if (this.areaCode && this.areaCode.length === 6) {
                const isCountry = this.areaCode.substring(4, 6) !== '00'
                if (isCountry) {
                    code = this.areaCode.substring(0, 4) + '00'
                }
            }
            switch (code) {
                case '330000':
                    url = 'zhejiang'
                    break;
                case '330100':
                    url = 'hangzhou'
                    break;
                case '330200':
                    url = 'ningbo'
                    break;
                case '330300':
                    url = 'wenzhou'
                    break;
                case '330400':
                    url = 'jiaxing'
                    break;
                case '330500':
                    url = 'huzhou'
                    break;
                case '330600':
                    url = 'shaoxin'
                    break;
                case '330700':
                    url = 'jinhua'
                    break;
                case '330800':
                    url = 'quzhou'
                    break;
                case '330900':
                    url = 'zhoushan'
                    break;
                case '331000':
                    url = 'taizhou'
                    break;
                case '331100':
                    url = 'lishui'
                    break;
                default :
                    url = 'zhejiang'
                    break;
            }
            this.mapId = url
            return `../../../static/json/province/${url}.json`
        },
        // 初始化 时间
        initDate() {
            let date = new Date()
            this.startDate = formatDate(date, 'yyyy') + '-01-01'
            let month=formatDate(new Date(),'MM');
            let year=formatDate(new Date(),'yyyy');
            let firstday = new Date(year,month,1);        //取当年当月中的第一天  
            let lastday = (new Date(firstday.getTime()-1000*60*60*24)).getDate();
            this.endDate = `${year}-12-${lastday}`;
        },
    },
    mounted () {
      // console.log(this.parentStartDate,'this.time');
      //   this.startDate=this.parentStartDate;
        // this.endDate=this.time.endDate;
        this.initDate();
     
        if (!this.cityCode && !this.countryCode) {
            this.areaCode = this.areacode
        } else if (this.countryCode) {
            this.areaCode = this.countryCode
        } else {
            this.areaCode = this.cityCode
        }
        if (this.hospitalId) {
            this.orgCode = this.hospitalId
        }
        if (this.areaCode) {
            this.getMedicalWasteCount()
        } else {
            this.initMap()
        }
        Bus.$on('changeAreaCode', (areaCode) => {
            this.areaChange = true
            this.areaCode = areaCode
            this.orgCode = ''
            this.getMedicalWasteCount()
        })
        Bus.$on('changeOrgCode', (orgCode) => {
            this.orgCode = orgCode
            this.getMedicalWasteCount()
        })
        Bus.$on('changeDate', (item) => {
            if (item.type === 0) { // 表示点击了 本年
                let date = new Date()
                this.startDate = formatDate(date, 'yyyy') + '-01-01'
                this.endDate = formatDate(date, 'yyyy') + '-12-31'
                this.getMedicalWasteCount()
            } else if (item.type === 1) { // 表示点击 了 本月
                let now = new Date()
                let days = getMonthDays()
                this.startDate = formatDate(now, 'yyyy-MM') + '-01'
                this.endDate = formatDate(now, 'yyyy-MM') + `-${days}`
                this.getMedicalWasteCount()
            } else if (item.type === 2) { // 表示点击 了 兹定于 事件
                this.startDate = formatDate(item.startDate, 'yyyy-MM-dd')
                this.endDate = formatDate(item.endDate, 'yyyy-MM-dd')
                this.getMedicalWasteCount()
            }
        })
    }
}
</script>

<style lang="stylus" scoped>
.index-ring {
    position: relative;
}
.map-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>


