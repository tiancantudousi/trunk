<template>
    <div class="index-panel-dot">
        <div class="hd">
           医废占比
        </div>
        <div class="bd">
            <div class="bd-box" ref="piedev" id="test">
                <!-- <div style="height: 100%;"></div> -->
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
import { getMedicalWasteCount } from '../../../api/home.js'
import { formatDate, getMonthDays } from '../../../common/js/date.js'
import { mapActions, mapGetters,mapMutations } from "vuex";
import Bus from '../../../common/js/bus.js';
var _ = require('lodash');
var chart=null;
export default {
    data () {
        return {
            areaCode: null,
            startDate: null, // 开始 时间
            endDate: null, // 结束 时间
            data: [], // 医废量
            orgCode: null, // 机构 id
            dataType: null, // 默认 为 近 一周
        
        }
    },
    computed:{
       ...mapGetters(['areacode','logindata', 'cityCode', 'cityName',
        'countryName', 'countryCode', 'hospitalName', 'hospitalId']),
    },
    watch:{
        areacode(val,oldval){
            this.showchart=false;
        },
        countryCode(val,oldval){
              this.showchart=false;
        },
        hospitalId(val,oldval){
               this.showchart=false;
        },
    },
    methods: {
        getMedicalWasteCount:_.throttle(function(){
            console.log(this.startDate)
            this.initData()
            const data = {
                startDt: this.startDate,
                endDt: this.endDate,
                areaCode: this.areaCode,
                orgId: this.orgCode
            }
            getMedicalWasteCount(data).then(res => {
                if (res['status'] === '1') {
                    if (res.total) {
                        ({
                            infectWeight: this.data[0].value,
                            medicineWeight: this.data[1].value,
                            injureWeight: this.data[2].value,
                            chemistryWeight: this.data[3].value,
                            pathWeight: this.data[4].value,
                            others: this.data[5].value
                        } = res.total) 
                    }
                    this.initChart();   
                    this.data.forEach(item => {
                        item.type += ' ' + (item.value ? item.value : 0) + 'kg'
                    })
                } else {}
            })
        },500,{'trailing':false}),
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
        // 初始化 数据
        initData() {
            this.data = [
                {
                    type: "感染性",
                    value: 0
                },
                {
                    type: "药物性",
                    value: 0
                },
                {
                    type: "损伤性",
                    value: 0
                },
                {
                    type: "化学性",
                    value: 0
                },
                {
                    type: "病理性",
                    value: 0
                },
                {
                    type: "其他",
                    value: 0
                }
            ]
        },
        initChart() {
               
               let pieDom=document.getElementById('test');
              //  if(!pieDom){
              //    alert('dom 未找到');
              //    return;
              //  }
                pieDom.innerHTML='';
                var para=document.createElement("div");
                para.style.height="100%";
                pieDom.appendChild(para);
                setTimeout(()=>{
                  chart= am4core.create(para, am4charts.PieChart3D);
                  chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
                  //chart.categoryAxis.renderer.grid.template.location = '12';
                  chart.legend = new am4charts.Legend();
                  chart.data = this.data;
                  var series = chart.series.push(new am4charts.PieSeries3D());
                  series.dataFields.value = "value";
                  series.ticks.template.disabled = true;
                  series.labels.template.disabled = true;
                  series.dataFields.category = "type";
                },50)
              
        }
    },
    mounted () {
        this.initDate()
        this.initData()
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
        }
          console.log(this.$refs.piedev);
      //  this.$nextTick(()=>{this.initChart()})
        
        Bus.$on('changeAreaCode', (areaCode) => {
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
                this.dataType = '0'
            } else if (item.type === 1) { // 表示点击 了 本月
                let now = new Date()
                let days = getMonthDays()
                this.startDate = formatDate(now, 'yyyy-MM') + '-01'
                this.endDate = formatDate(now, 'yyyy-MM') + `-${days}`
                this.getMedicalWasteCount()
                this.dataType = '1'
            } else if (item.type === 2) { // 表示点击 了 本月
                this.startDate = formatDate(item.startDate, 'yyyy-MM-dd')
                this.endDate = formatDate(item.endDate, 'yyyy-MM-dd')
                this.getMedicalWasteCount()
                this.dataType = '2'
            }
        })
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

