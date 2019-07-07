<template>
    <div class="index2">
        <div class="ring-list" style="transform: rotateX(60deg);transform-origin: center center;">
			<i class="ring1"></i>
			<i class="ring2"></i>
			<i class="ring3"></i>
			<i class="ring4"></i>
			<i class="ring5"></i>
			<i class="ring6"></i>
		</div>
        <div class="content">
            <div class="col1">
                <bar-chart style="flex: 1"></bar-chart>
                <pie-chart style="flex: 1"></pie-chart>
            </div>
            <div class="col2">
                <div class="num-carousel-cont">
                    <span class="txt" style="text-align: right">总重量</span>
                    <div class="num-carousel">
                        <span 
                            v-for="(item, index) in totalWeightList" 
                            :key="index" 
                            v-if="index != totalWeightList.length - 1">
                            {{item}}
                        </span>
                        <span>.</span>
                        <span>{{totalWeightList[totalWeightList.length - 1]}}</span>
                    </div>
                    <span class="txt" v-if="!isBigUnit">kg</span>
                    <span class="txt" v-else>t</span>
                </div>
                <mapChart style="flex: auto" @totalweight="getTotalWeight($event)"></mapChart>
                <dataTable></dataTable>
            </div>
            <div class="col3">
                <div class="index-panel-dot" style="flex: 1">
                    <div class="hd">监控
                        <div class="cm-right">
                            <el-dropdown>
                                <span class="el-dropdown-link">
                                    {{monitorOrgName}}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item 
                                        v-for="item in orgList" 
                                        :key="item.hospitalCode"
                                        size="medium" 
                                        :command="item">
                                        {{item.hospitalName}}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    <div class="bd">
                        <div class="bd-box">
                        <div class="ghost-center" style="height: 100%;">
                            <div class="ghost-center-inner">
                                <!-- <img src="../../assets/video-rec.png" class="video-rec"> -->
                                <video :id="vedioId" class="video-js"
                                    poster="../../assets/jiankong.png" 
                                    autoplay="autoplay" 
                                    controls preload="auto"
                                    width="100%" height="100%" > 
                                    <!-- <source src="http://193.112.101.157:8080/hls/test.m3u8" type="application/x-mpegURL" /> -->
                                    <source v-if="equipId"
                                        :src="`http://122.224.131.50:6713/mag/hls/${equipId}/1/live.m3u8`"
                                        type="application/x-mpegURL"/>
                                </video>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
                <div class="index-panel-dot">
                    <div class="hd">小箱进大箱</div>
                    <div class="bd">
                        <div class="flow-truck">
                            <div class="txt txt-1">
                                <h5>产生点</h5>
                                <span class="num">{{generateCount}}</span>个
                            </div>
                            <div class="txt txt-2">
                                <h5>无害处置</h5>
                                <span class="num">{{weight}}</span>吨
                            </div>
                            <div class="txt txt-3">
                                <h5>暂存点</h5>
                                <span class="num">{{tempCount}}</span>个
                            </div>
                            <div class="truck-num">
                                <i>{{carCount}}辆</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

import Bus from '../../common/js/bus.js'
import dataTable from './components/dataTable'
import barChart from './components/barChart'
import pieChart from './components/pieChart'
import mapChart from './components/mapChart'
import { Easing, Tween, autoPlay } from 'es6-tween'
import { getHarmlessWasteCount, getHospitalByCode, getVideoId } from '../../api/home.js'
import { formatDate, getMonthDays } from '../../common/js/date.js'
import { LegendSettings } from '@amcharts/amcharts4/charts';

export default {
    components: {
        dataTable,
        barChart,
        pieChart,
        mapChart
    },
    data () {
        return {
            totalWeight: 0,
            totalWeightList: [],
            areaCode: null,
            startDate: null, // 开始 时间
            endDate: null, // 结束 时
            carCount: 0, // 车的 数量
            generateCount: 0, // 产生点
            tempCount: 0, // 暂存点
            weight: 0, // 无害处理
            orgCode: null, // 机构 名
            orgList: [],
            monitorOrgName: null,
            monitorOrgCode: null,
            equipId: '',
            isBigUnit: false,
            vedioId: '',
        }
    },
     computed: {
        animatedNumber: function() {
            return this.num.toFixed(0);
        },
        totalWeightListSTring: function () {
            return totalWeightList.reverse()
        },
        areacode: function () {
            return this.$store.getters.areacode
        },
        cityCode: function () {
            return this.$store.getters.cityCode
        },
        cityName: function () {
            return this.$store.getters.cityName
        },
        countryName: function () {
            return this.$store.getters.countryName
        },
        countryCode: function () {
            return this.$store.getters.countryCode
        },
        hospitalName: function () {
            return this.$store.getters.hospitalName
        },
        hospitalId: function () {
            return this.$store.getters.hospitalId
        },
        
    },

    methods: {
        getTotalWeight(value) {
            if (value > 999999) {
                 value = value / 1000;
                this.isBigUnit = true
            } else {
                this.isBigUnit = false
            }
            value = value + ''
            this.totalWeight = value + ''
            this.initTotalWeightList()
            if (value) {
                // 获取 目前 的总吨数的 副本
                const preTotalWeightList = []
                this.totalWeightList.forEach(item => {
                    preTotalWeightList.push(item)
                })
                let pre = value.split('.')[0];
                let after = value.split('.')[1];
                // 将 小数 点 以上的数据 存入 数组
                if (pre.length < 6) {
                    pre = pre.padStart(6, '0')
                }
                const preList = pre.split('');
                const totalWeightList = []
                preList.forEach(item => {
                    totalWeightList.push(parseInt(item))
                })
                // 将 小数 存入 数组, 只 保留 一位, 没有 取 0 
                after ? totalWeightList.push(parseInt(after[0])) : totalWeightList.push(0)
                var _this = this;
                // 这个 效果 目前 并不 满意
                new Tween({totalWeightList: preTotalWeightList}).to({totalWeightList: totalWeightList}, 500)
                .on('update', ({totalWeightList}) => {
                    _this.totalWeightList = []
                    totalWeightList.forEach((item, index) => {
                      _this.totalWeightList.push(item.toFixed(0))
                    })
                }).start()
                // this.totalWeightList.push(0)
            }
        },
        initTotalWeightList () {
            this.totalWeightList = [0, 0, 0, 0, 0, 0, 0] // 最后一位 是小数点后一位
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
        getHarmlessWasteCount () {
            const data = {
                startDt: this.startDate,
                endDt: this.endDate,
                areaCode: this.areaCode,
                orgId: this.orgCode
            }
            getHarmlessWasteCount(data).then(res => {
                if (res['status'] === '1') {
                    this.carCount = 0
                    this.generateCount = 0
                    this.tempCount = 0
                    this.weight = 0
                    if (res['result']) {
                        ({
                            carCount: this.carCount,
                            generateCount: this.generateCount,
                            tempCount: this.tempCount,
                            weight: this.weight
                        } = res['result'])
                    }
                } else {}
            })
        },
        // 根据区域代码查询机构列表
        getHospitalByCode () {
            this.orgList = []
            const data = {
                areaCode: this.areaCode
            }
            getHospitalByCode(data).then(res => {
                if (res['status'] === '1') { 
                    if (res['result']) {
                        this.orgList = res['result']
                        if (this.orgList && this.orgList.length > 0) {
                            this.monitorOrgName = this.orgList[0].hospitalName
                            this.monitorOrgCode = this.orgList[0].hospitalCode
                        } else {
                            this.monitorOrgName = '无'
                            this.monitorOrgCode = ''
                        }
                    }
                } else {}
            })
        },
        getVideoId () {
            const data = {
                areaCode: this.areaCode
            }
            getVideoId(data).then(res => {
                if (res['status'] === '1') {
                    if (res['result'] && res['result'].length > 0) {
                        this.equipId = res['result'][0].equId
                        console.log(this.equipId)
                        console.log(`http://122.224.131.50:6713/mag/hls/${this.equipId}/1/live.m3u8`)
                        var player = videojs(this.vedioId);
		                player.play();
                    }
                } else {}
            })
        }
    },
    mounted () {
        // 侧边栏 缩起来
        Bus.$emit('siderCollapse', true)
        autoPlay(true);
        this.initTotalWeightList()
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
        this.initDate()
        this.vedioId = 'example-video-' + new Date().getTime()
        console.log(this.vedioId)
        if (this.areaCode) {
            this.getHarmlessWasteCount()
            this.getHospitalByCode()
            this.getVideoId()
        }
        Bus.$on('changeAreaCode', (areaCode) => {
            this.areaCode = areaCode
            this.orgCode = ''
            this.getHarmlessWasteCount()
            this.getHospitalByCode()
        })
        Bus.$on('changeOrgCode', (orgCode) => {
            this.orgCode = orgCode
            this.getHarmlessWasteCount()
        })
        Bus.$on('changeDate', (item) => {
            if (item.type === 0) { // 表示点击了 本年
                let date = new Date()
                this.startDate = formatDate(date, 'yyyy') + '-01-01'
                this.endDate = formatDate(date, 'yyyy') + '-12-31'
                this.getHarmlessWasteCount()
            } else if (item.type === 1) { // 表示点击 了 本月
                let now = new Date()
                let days = getMonthDays()
                this.startDate = formatDate(now, 'yyyy-MM') + '-01'
                this.endDate = formatDate(now, 'yyyy-MM') + `-${days}`
                this.getHarmlessWasteCount()
            } else if (item.type === 2) { // 表示点击 了 本月
                this.startDate = formatDate(item.startDate, 'yyyy-MM-dd')
                this.endDate = formatDate(item.endDate, 'yyyy-MM-dd')
                this.getHarmlessWasteCount()
            }
        })
    },
    destroyed () {
        // 侧边栏 伸展起来 
        Bus.$emit('siderCollapse', false)
    }
}
</script>
<style lang="stylus" scoped>
.index2-body {

}
.index2 {
    background: url('../../assets/index2-new-bg.png') no-repeat 50%;
    position: absolute;
    top: -25px;
    bottom: 0;
    left: 0;
    right: 0;
    .content {
        display: flex;
        padding-top: 50px;
        height: 100%;
        .col1 {
            width: 31%;
            // background: #880015;
            padding-left: 25px;
            display: flex;
            flex-direction: column;
            flex: 1;
            flex-basis: auto;
        }
        .col2 {
            width: 38%;
            min-width: 560px;
            // background: #B97A57;
            padding: 0 25px;
            display: flex;
            flex-direction: column;
            .num-carousel-cont {
                vertical-align: bottom;
                color: rgba(247, 242, 232, 0.8);
                font-size: 18px;
                text-align: center;
                padding-top: 10px;
                white-space: nowrap;
                overflow: hidden;
                margin-bottom: 20px;
                font-size: 0px;
                span + span {
                    margin-left: 5px;
                }
                .txt {
                    width: 110px;
                    display: inline-block;
                    vertical-align: top;
                    padding-top: 50px;
                    line-height: 30px;
                    margin: 0 5px;
                    text-align: left;
                    font-size: 20px;
                    
                }
                .num-carousel {
                    display: inline-block;
                    vertical-align: top;
                    span {
                        display: inline-block;
                        vertical-align: top;
                        width: 40px;
                        height: 80px;
                        font-size: 60px;
                        background: #f7f2e8;
                        border-radius: 4px;
                        line-height: 80px;
                        color: #111427;
                        font-weight: 500;
                    }
                }
            }
        }
        .col3 {
            width: 31%;
            // background: #ED1C24;
            display: flex;
            flex-direction: column;
            .index-panel-dot {
                background: rgba(0, 0, 0, 0.4);
                border-radius: 10px;
                color: #F7F2E8;
                padding: 12px 16px;
                margin-bottom: 24px;
                display: flex;
                flex-direction: column;
                .hd {
                    position: relative;
                    padding-left: 20px;
                    &:before {
                        content: "";
                        position: absolute;
                        left: 0;
                        top: 50%;
                        width: 8px;
                        height: 8px;
                        margin-top: -4px;
                        border-radius: 100%;
                        background: #F7F2E8;
                        border: 1px solid #FBEFD1;
                        box-shadow: 0 0 10px 0 rgba(251, 239, 209, 0.4);
                    }
                    .cm-right {
                        float: right!important;
                        color: #ffffff;
                    }
                    .el-dropdown {
                        color: #FFFFFF;
                    }
                }
                .bd {
                    margin-top: 12px;
                    padding-bottom: 12px;
                    flex: 1;
                    position: relative;
                    .bd-box {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                    }
                    .ghost-center {
                        white-space: nowrap;
                        font-size: 0;
                        .ghost-center-inner {
                            height: 100%;
                        }
                        .video-rec {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
}
.flow-truck {
    position: relative;
    height: 354px;
    background: url('../../assets/flow-truck.png') no-repeat center center;
    color: rgba(247, 242, 232, 0.8);
    .txt {
        position: absolute;
        left: 50%;
        top: 50%;
        display: inline-block;
        vertical-align: top;
        text-align: center;
    }
    .txt-1 {
        transform: translateX(-50%);
        margin-top: -64px;
    }
    .txt-2 {
        transform: translateX(-50%);
        margin-left: -143px;
        margin-top: 93px;
    }
    .txt-3 {
        transform: translateX(-50%);
        margin-left: 143px;
        margin-top: 93px;
    }
    h5 {
        margin: 0;
        font-size: 14px;
    }
    .num {
        font-size: 32px;
        color: #F7F2E8;
        margin-right: 3px;
    }
    .truck-num {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 116px;
        height: 105px;
        background: url('../../assets/i-index-truck.png') no-repeat center center;
        margin-left: -72px;
        margin-top: 57px;
        animation: mymove 60s infinite linear;
        // transform: translate(-70px, -190px)
        i {
            position: absolute;
            top: 37px;
            left: 67px;
            transform: translateX(-50%);
            font-style: normal;
        }
    }
}
.el-dropdown-menu {
    max-height: 600px;
    overflow: auto;
}
.ring-list {
    position: absolute;
    width: 800px;
    height: 600px;
    left: 50%;
    margin-left: -400px;
    i {
        position: absolute;
        top: 0;
        left: 0;
        width: 800px;
        height: 800px;
    }
    .ring1 {
        opacity: .3
        background: url('../../assets/ring1.png') no-repeat center center;
        animation:rotate1 20s linear infinite;
        -webkit-animation:rotate1 20s linear infinite;
    }
    .ring2 {
        opacity: .3
        background: url('../../assets/ring2.png') no-repeat center center;
        animation:rotate1 20s linear infinite;
        -webkit-animation:rotate2 20s linear infinite;
    }
    .ring3 {
        opacity: .3
        background: url('../../assets/ring3.png') no-repeat center center;
        animation:rotate1 20s linear infinite;
        -webkit-animation:rotate1 20s linear infinite;
    }
    .ring4 {
        opacity: .3
        background: url('../../assets/ring4.png') no-repeat center center;
        animation:rotate1 20s linear infinite;
        -webkit-animation:rotate2 20s linear infinite;
    }
    .ring5 {
        opacity: .3
        background: url('../../assets/ring5.png') no-repeat center center;
        animation:rotate1 20s linear infinite;
        -webkit-animation:rotate1 20s linear infinite;
    }
    .ring6 {
        opacity: .3
        background: url('../../assets/ring6.png') no-repeat center center;
        animation:rotate1 20s linear infinite;
        -webkit-animation:rotate2 20s linear infinite;
    }
}
@keyframes mymove
{
    0% {transform: translate(0px)}
    8.3% {transform: translate(-60px, -20px)}
    16.6% {transform: translate(-130px, -50px)}
    25.9% {transform: translate(-120px, -115px)}
    32.2% {transform: translate(-110px, -150px)}
    39.5% {transform: translate(-70px, -190px)}
    49.8% {transform: translate(10px, -200px)}
    58.1% {transform: translate(90px, -190px)}
    66.4% {transform: translate(130px, -150px)}
    73.7% {transform: translate(140px, -115px)}
    83% {transform: translate(150px, -50px)}
    91.3% {transform: translate(70px, -20px)}
}
@keyframes spin {
    0% {
    transform: rotate(0)
    }
    100% {
    transform: rotate(360deg)
    }
}

@keyframes rotate1
{
    0%{
        transform:rotate(0deg);
        -webkit-transform:rotate(0deg);  
        -moz-transform:rotate(0deg); 
    }
    100%{
        transform:rotate(360deg);
        -webkit-transform:rotate(360deg);  
        -moz-transform:rotate(360deg); 
    }      
}

@-webkit-keyframes rotate1 
{
    0%{
        transform:rotate(0deg);
        -webkit-transform:rotate(0deg);  
        -moz-transform:rotate(0deg); 
    }
    100%{
        transform:rotate(360deg);
        -webkit-transform:rotate(360deg);  
        -moz-transform:rotate(360deg); 
    }  
}

@keyframes rotate2
{
    0%{
        transform:rotate(0deg);
        -webkit-transform:rotate(0deg);  
        -moz-transform:rotate(0deg); 
    }
    100%{
        transform:rotate(-360deg);
        -webkit-transform:rotate(-360deg);  
        -moz-transform:rotate(-360deg); 
    } 
}

@-webkit-keyframes rotate2
{
    0%{
        transform:rotate(0deg);
        -webkit-transform:rotate(0deg);  
        -moz-transform:rotate(0deg); 
    }
    100%{
        transform:rotate(-360deg);
        -webkit-transform:rotate(-360deg);  
        -moz-transform:rotate(-360deg); 
    } 
}
.video-js {
    height: 100%;
    width: 100%;
}

 .vjs-big-play-button {
        top: 50%;
        left: 50%;
        margin-left: -1.5em;
        margin-top: -0.75em;
    }
</style>


