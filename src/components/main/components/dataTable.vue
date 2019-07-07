<template>
    <div class="index-panel-dot" style="height: 344px;">
        <div class="hd">数据预警
            <div class="right-legend">
                严重预警<span class="index-txt-danger num mg-l-10">{{severityCount}}</span>
                <span class="mg-l-20">轻微预警</span>
                <span class="index-txt-warn num mg-l-10">{{slightCount}}</span>
            </div>
        </div>
        <div class="bd">
            <!--根据实际情况再调整-->
            <table class="index-tb" style="margin-bottom: -20px;">
                <colgroup>
                    <col style="width: 132px;">
                </colgroup>
                <thead>
                    <tr>
                        <th>时间</th>
                        <th>医疗机构</th>
                        <th>异常情况</th>
                        <th>处理情况</th>
                    </tr>
                </thead>
                <!-- <tbody> -->
                <transition-group name="list" tag="tbody">
                    <tr v-if="item"  v-for="(item,index) in list" :key="index">
                        <td>{{item.occurTime.substring(5)}}</td>
                        <td>{{item.orgName}}</td>
                        <td class="index-txt-danger" v-if="item.warnLevel === 2">{{item.warnContent}}</td>
                        <td class="index-txt-warn" v-else>{{item.warnContent}}</td>
                        <td>{{item.handleResult ? item.handleResult : '-'}}</td>
                    </tr>
                </transition-group>
                <!-- </tbody> -->
            </table>
        </div>
    </div>
</template>

<script>
import {getAbnormalWarningByCode} from '../../../api/home.js'
import { mapActions, mapGetters, mapMutations } from "vuex";
import Bus from '../../../common/js/bus.js'
import { formatDate, getMonthDays } from '../../../common/js/date.js'

export default {
    computed:{
      ...mapGetters(['areacode','logindata', 'cityCode', 'cityName',
        'countryName', 'countryCode', 'hospitalName', 'hospitalId']),
    },
    data () {
        return {
            list: [],
            areaCode: null,
            severityCount: 0, // 严重 条数
            slightCount: 0, // 轻微 条数
            arrayList: [],
            index: 0, // 循环 的 序列
            isAreaCode: false,
            orgCode: null, // 机构 code
            startDate: null,
            endDate: null,
            DAY_TIME:  3600 * 24 * 1000,
        }
    },
    methods: {
        // initList () {
        //     this.list = [];
        //     setTimeout(() => {
        //         for(let i = 0; i < 6; i ++) {
        //             this.list.push({
        //                 id: parseInt(Math.random() * 100),
        //             })
        //         }
        //         setTimeout(() => {
        //             this.initList()
        //         }, 6000)
        //     }, 1100)
        // },
        removeList () {
            if (this.list.length > 0) {
                this.list.splice(this.list.length - 1, 1)
                setTimeout(() => {
                    this.removeList()
                }, 400)
            } else {
                this.index ++;
                setTimeout(() => {
                    // 循环 3 次 之后 重新 去 调 接口
                    if (this.index / this.arrayList.length === 3 || this.isAreaCode) {
                        this.isAreaCode = false
                        this.getAbnormalWarningByCode()
                    } else {
                        this.addList()
                    }
                }, 1000)
            }
        },
        addList () {
            if (this.list.length < 6) {
                this.list.push(this.arrayList[this.index % this.arrayList.length][this.list.length])
                setTimeout(() => {
                    this.addList()
                }, 400)
            } else {
                setTimeout(() => {
                    this.removeList()
                }, 10000) 
            }
        },
        getAbnormalWarningByCode() {
            const data = {
                areaCode: this.areaCode,
                orgId: this.orgCode,
                startDt: this.startDate,
                endDt: this.endDate,
            }
            getAbnormalWarningByCode(data).then(res => {
                if (res['status'] === '1') {
                    if (res['count']) {
                        ({
                            severityCount: this.severityCount,
                            slightCount: this.slightCount
                        } = res['count'])
                    } else {
                        this.severityCount = 0
                        this.slightCount = 0
                    }
                    this.index = 0;
                    let index = 0;
                    this.arrayList = []
                    if (res['result'] && res['result'].length > 0) {
                        index = res['result'].length % 6 === 0 ? res['result'].length / 6 : res['result'].length / 6 + 1
                        for (let i = 0; i < index; i ++) {
                            const array = []
                            for (let j = 0; j < 6; j ++) {
                                array.push(res['result'][6 * i + j])
                            }
                            this.arrayList.push(array)
                        }
                        console.log(this.arrayList)
                        this.addList()
                    } else {
                        setTimeout (() => {
                            this.getAbnormalWarningByCode()
                        }, 60 * 1000 * 3) 
                    }
                } else {}
            })
        },
        busOnHandleDate () {
            this.isAreaCode = true
            if (this.arrayList.length === 0) {
                setTimeout(() => {
                    // 做 2 次 验证
                    if (this.arrayList.length === 0) {
                        this.getAbnormalWarningByCode()
                    }
                }, 100)
            }
        },
        // 初始化 时间
        initDate() {
            let date = new Date()
            let curTime = new Date().getTime()
            let startDate = curTime - (2 * this.DAY_TIME);
            startDate = new Date(startDate)
            this.startDate = formatDate(startDate, 'yyyy-MM-dd')+' 00:00:00'
            console.log('this.startDate', formatDate(startDate, 'yyyy-MM-dd'))
            this.endDate = formatDate(date, 'yyyy-MM-dd')+' 23:59:59'
        },
    },
    mounted () {
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
        if (this.areaCode) {
            this.getAbnormalWarningByCode()
        }
        Bus.$on('changeAreaCode', (areaCode) => {
            this.areaCode = areaCode
            this.orgCode = ''
             this.busOnHandleDate()
        })
        Bus.$on('changeOrgCode', (orgCode) => {
            this.orgCode = orgCode
            this.busOnHandleDate()
        })
        // Bus.$on('changeDate', (item) => {
        //     if (item.type === 0) { // 表示点击了 本年
        //         let date = new Date()
        //         this.startDate = formatDate(date, 'yyyy') + '-01-01'
        //         this.endDate = formatDate(date, 'yyyy') + '-12-31'
        //         this.busOnHandleDate()
        //     } else if (item.type === 1) { // 表示点击 了 本月
        //         let now = new Date()
        //         let days = getMonthDays()
        //         this.startDate = formatDate(now, 'yyyy-MM') + '-01'
        //         this.endDate = formatDate(now, 'yyyy-MM') + `-${days}`
        //         this.busOnHandleDate()
        //     } else if (item.type === 2) { // 表示点击 了 本月
        //         this.startDate = formatDate(item.startDate, 'yyyy-MM-dd')
        //         this.endDate = formatDate(item.endDate, 'yyyy-MM-dd')
        //         this.busOnHandleDate()
        //     }
        // })
    }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/varibale';
.index-panel-dot {
    background: rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    color: #F7F2E8;
    padding: 12px 16px;
    margin-bottom: 24px;
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
        .right-legend {
            position: absolute;
            right: 0;
            top: -8px;
            font-size: 14px;
            .num {
                font-size: 24px;
            }
        }
    }
    .bd {
        margin-top: 12px;
        padding-bottom: 12px;
        .index-tb {
            width: 100%;
            table-layout: fixed;
            border-collapse: collapse;
            border-spacing: 0;
            thead th {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(247, 242, 232, 0.6);
            }
            th, td {
                padding-left: 24px;
                line-height: 40px;
                word-break: break-all;
                word-wrap: break-word;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
.index-txt-danger {
    color: #CD0000;
}
.index-txt-warn {
    color: #F5A623;
}
th, td {
    text-align: left;
    font-weight: normal;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter
/* .list-leave-active for below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(30px);
}

 .list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
 }
</style>


