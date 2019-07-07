<template>
     <div class="index-panel-dot">
        <div class="hd">
            <span v-if="type === 1">近七日医废量（kg）</span>
            <span v-else-if="type === 2">近七月医废量（kg）</span>
            <span v-else-if="type === 3">近七年医废量（kg）</span>
            <span class="white-second-text mg-l-20" style="font-size: 12px">时间：</span>
            <span class="mg-l-10" 
                @click="clickDay()" 
                style="cursor: pointer"
                :class="{'active': type === 1}">
                日
            </span>
            <span class="mg-l-10" style="cursor: pointer" 
                @click="clickMonth()"
                :class="{'active': type === 2}">月</span>
            <span class="mg-l-10" style="cursor: pointer" 
                @click="clickYear()" 
                :class="{'active': type === 3}">年</span>
        </div>
        <div class="bd">
            <div class="bd-box">
                <div id="amcharts-bar-1" style="height: 100%" ref="chartdiv"></div>
            </div>
        </div>
    </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dark);
import { getMedicalWasteCountByDay, getMedicalWasteCountRecent } from '../../../api/home.js'
import { mapActions, mapGetters, mapMutations } from "vuex";
import { formatDate } from '../../../common/js/date.js'
import Bus from '../../../common/js/bus.js'
var chart=null;

export default {
    computed:{
      ...mapGetters(['areacode','logindata', 'cityCode', 'cityName',
        'countryName', 'countryCode', 'hospitalName', 'hospitalId']),
    },
    data () {
        return {
            data: [],
            areaCode: null,
            startDate: null, // 开始 时间
            endDate: null, // 结束 时间
            orgCode: null, // 机构 id
            type: 1, // 表示 本周
        }
    },
    methods: {
        // 设置 bar
        am4themes_myTheme(target) {
            if (target instanceof am4core.ColorSet) {
                target.list = [
                    am4core.color("#00BBF2"),
                    am4core.color("#006BF2"),
                    am4core.color("#7700F2"),
                    am4core.color("#F20074"),
                    am4core.color("#F5B91C"),
                    am4core.color("#BEF200"),
                    am4core.color("#00F295")
                ];
            }
        },
        initChart() {
            am4core.useTheme(this.am4themes_myTheme);
            console.log(this.$refs.chartdiv)
            chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart3D);
            // Add data
            chart.data = this.data
            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "date";
            categoryAxis.renderer.labels.template.rotation = 0;
            categoryAxis.renderer.labels.template.hideOversized = false;
            categoryAxis.renderer.minGridDistance = 20;
            categoryAxis.renderer.labels.template.horizontalCenter = "center";
            categoryAxis.renderer.labels.template.verticalCenter = "middle";
            categoryAxis.tooltip.label.rotation = 270;
            categoryAxis.tooltip.label.horizontalCenter = "right";
            categoryAxis.tooltip.label.verticalCenter = "middle";
            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            var series = chart.series.push(new am4charts.ColumnSeries3D());
            series.dataFields.valueY = "value";
            series.dataFields.categoryX = "date";
            series.name = "Visits";
            series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
            series.columns.template.fillOpacity = .8;
            series.columns.template.width = am4core.percent(50);
            var columnTemplate = series.columns.template;
            columnTemplate.strokeWidth = 2;
            columnTemplate.strokeOpacity = 1;
            columnTemplate.stroke = am4core.color("#FFFFFF");
            columnTemplate.adapter.add("fill", (fill, target) => {
                return chart.colors.getIndex(target.dataItem.index);
            })
            columnTemplate.adapter.add("stroke", (stroke, target) => {
                return chart.colors.getIndex(target.dataItem.index);
            })
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineX.strokeOpacity = 0;
            chart.cursor.lineY.strokeOpacity = 0;
        },
        // 初始化 时间
        initDate() {
        },
        getMedicalWasteCountRecent () {
            const data = {
                startDt: this.startDate,
                endDt: this.endDate,
                areaCode: this.areaCode,
                orgId: this.orgCode,
                type: this.type
            }
            this.data = []
            getMedicalWasteCountRecent(data).then(res => {
                if (res['status'] === '1') {
                    if (res['result']) {
                        const result = res['result']
                        result.forEach(item => {
                            let date = ''
                            if (this.type === 1) {
                                date = item.recycleDate.substring(5, 10)
                            } else {
                                date = item.recycleDate
                            }
                            this.data.push({
                                "date": date,
                                "value": item.totalWeight
                            })
                        })
                    }
                    this.initChart()
                } else {
                  
                }
            })
        },
        clickDay() {
            this.type = 1
            this.getMedicalWasteCountRecent()
        },
        clickMonth () {
            this.type = 2
            this.getMedicalWasteCountRecent()
        },
        clickYear () {
            this.type = 3
            this.getMedicalWasteCountRecent()
        }
    },
     mounted () {
        this.initDate()
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
            this.getMedicalWasteCountRecent()
        }
        setTimeout(() => {
            this.initChart()
        }, 100)
        Bus.$on('changeAreaCode', (areaCode) => {
            this.areaCode = areaCode
            this.orgCode = ''
            this.getMedicalWasteCountRecent()
        })
        Bus.$on('changeOrgCode', (orgCode) => {
            this.orgCode = orgCode
            this.getMedicalWasteCountRecent()
        })
        // Bus.$on('changeDate', (item) => {
        //     if (item.type === 0) { // 表示点击了 本年
        //         this.type = 3
        //         this.getMedicalWasteCountRecent()
        //     } else if (item.type === 1) { // 表示点击 了 本月
        //         this.type = 2
        //         this.getMedicalWasteCountRecent()
        //     } else if (item.type === 2) { // 表示点击 了 自定义
        //         this.startDate = formatDate(item.startDate, 'yyyy-MM-dd')
        //         this.endDate = formatDate(item.endDate, 'yyyy-MM-dd')
        //         this.type = 4
        //         this.getMedicalWasteCountRecent()
        //     }
        // })
    },
    destroyed(){
      chart=null;
    }
}
</script>

<style lang="stylus" scoped>
 .index-panel-dot {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    color: #fff;
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
        span.active {
            color: #99D9EA !important;
        }
    }
    .bd {
        flex: auto;
        position: relative;
        .bd-box {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
}
</style>


