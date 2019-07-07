<template>
      <div class="workcount">
            <div class="work-header">
                <el-date-picker
                    v-model="timestart"
                    type="date"
                    placeholder="选择日期" class="timechose">
               </el-date-picker>
               <el-date-picker
                    v-model="timesend"
                    type="date"
                    placeholder="选择日期" class="timechose">
               </el-date-picker>
               <el-select 
                    v-model="city" 
                    placeholder="请选择市" 
                    class="hospital"
                    v-if="level === 1"
                   >
                    <el-option
                    v-for="item in cityList"
                    :key="item.id" :label="item.city" :value="item.code"
                    >
                    </el-option>
                </el-select>
                    <el-select v-model="country" 
                        placeholder="请选择区/县" class="hospital" 
                        v-if="level === 2 || level === 1">
                    <el-option
                        v-for="item in countryList"
                        :key="item.id" :label="item.city" :value="item.code">
                    </el-option>
                </el-select>
                <el-select v-model="workhospital" placeholder="请选择医院" class="hospital">
                    <el-option
                      v-for="item in options"
                      :key="item.hospitalCode" :label="item.hospitalName" :value="item.hospitalCode">
                    </el-option>
                </el-select>
           </div>
           <div class="work-main">
              <div class="chart" v-if="chartweight">
                    <div class="weightchart" ref="weightchart"></div>
              </div>
              <div class="chart" v-if="charttype">
                    <div class="weightchart" ref="typechart"></div>
              </div>
           </div>
      </div>
</template>

<script>
var echarts = require('echarts');
import {post} from 'api/homeHttp';
import {formatDate} from 'common/js/date';
import {clone} from 'common/js/clone.js';

import { mapActions, mapGetters,mapMutations } from "vuex";
import { getChinaNationByCode } from '../../api/home.js'
export default {
  components:{},
  data () {
    return {
       timechose:new Date(),
       timestart:new Date(new Date().getTime()-7*24*60*60*1000),
       timesend:new Date(),
       workhospital:'',
       chartweight:false,
       charttype:false,
       options: [],
      weightoption:{
          color: ['#F43D45'],
          legend: {data:['总重量']
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  data : [],
                  axisTick: {
                      alignWithLabel: true
                  }
              }
          ],
          yAxis : [
              {
                  type : 'value',
                  splitLine :{
                    lineStyle:{
                        type:'dashed'
                    }
                  }
              }
          ],
          series : [
              {
                  name:'总重量',
                  type:'bar',
                  barWidth: '20px',//柱形图宽度
                  data:[],
                  itemStyle:{  //控制柱形图样式 头部椭圆
                      barBorderRadius:[10,10,0,0]
                  },
                  label: {//配置数值显示在柱形图上的位置和样式
                      normal: {
                      show: true,
                      position: 'top',
                      color:'black'
                  }
            },
              }
          ]
      },

      typeoption:{
            tooltip : {
                trigger: 'axis',
                // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                //     type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
                // }
            },
            legend: {//头部
                data:['感染性', '损伤性', '病理性', '药物性', '化学性','其它']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    'axisLabel':{'interval':0},
                    data : [],//x轴下标显示
                    splitLine: {show: false}
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
            series : [
                {
                    name:'感染性',
                    barWidth: '20px',
                    type:'bar',
                    color:'#009EF9',
                    data:[],
                    itemStyle:{  //控制柱形图样式 头部椭圆
                      barBorderRadius:[10,10,0,0]
                    },
                },
                {
                    name:'损伤性',
                    barWidth: '20px',
                    type:'bar',
                    color:'#FF710F',
                    data:[],
                    itemStyle:{  //控制柱形图样式 头部椭圆
                      barBorderRadius:[10,10,0,0]
                    },
                },
                {
                    name:'病理性',
                    barWidth: '20px',
                    type:'bar',
                    color:'#00C261',
                    data:[],
                    itemStyle:{  //控制柱形图样式 头部椭圆
                      barBorderRadius:[10,10,0,0]
                    },
                },
                {
                    name:'药物性',
                    barWidth: '20px',
                    type:'bar',
                    color:'#A950FF',
                    data:[],
                    itemStyle:{  //控制柱形图样式 头部椭圆
                      barBorderRadius:[10,10,0,0]
                    },
                },
                {
                    name:'化学性',
                    barWidth: '20px',
                    type:'bar',
                    color:'#FFD326',
                    data:[],
                    itemStyle:{  //控制柱形图样式 头部椭圆
                      barBorderRadius:[10,10,0,0]
                    },
                },
                   {
                    name:'其它',
                    barWidth: '20px',
                    type:'bar',
                    color:'#FF434B',//控制柱形图颜色
                    data:[],
                    itemStyle:{  //控制柱形图样式 头部椭圆
                      barBorderRadius:[10,10,0,0]
                    },
                    //FF434B
                },
              
            ],
        },
        city: '',
        cityList: [],
        country: '',
        countryList: [],
        areaCode: '',
        level: ''
    }
  },
  created() {
    this.areaCode = this.areacode
    if (this.areaCode) {
        this.getcount();
        this.level = this.logindata.level
        if (this.level === 1) { // 表示省
          this.getChinaNationByCode()
        } else if(this.level === 2) { // 表示市
          this.getChinaNationByCode(false)
        }
        this.gethospital(true);
    }
  },
  computed:{
    ...mapGetters([
        'areacode' ,'logindata', 'hospitalId', 'hospitalId'
    ]),
  },
  watch:{
     timestart(val,oldval){
         this.getcount();
     },
     timesend(val,oldval){
         this.getcount();
     },
     workhospital(val,oldval){
        this.options.forEach(item => {
          if(item.hospitalCode === val) {
            this.setHospital({
              id: item.hospitalCode,
              name: item.hospitalName
            })
          }
        })
         this.getcount();
     },
     city(val, oldval) {
      if(val){
        if (val === this.areaCode) return
        this.areaCode = val
        this.gethospital()
        if (val === '330000') {
          this.country = ''
          this.countryList = [{
            city: '全部'
          }]
        } else {
          this.getChinaNationByCode(false)
        } 
      }  
    },
    country (val, oldval) {
      if(val) {
         console.log(val)
        if (val === this.areaCode || val === '全部') return
        this.areaCode = val
        this.gethospital()
      }
    }
  },
  methods:{
    getChinaNationByCode (isCity = true) {
      const data = {
          areaCode: this.areaCode
      }
      getChinaNationByCode(data).then(res => {
        if (res['status'] === '1') {
            if (res['result']) {
                if (isCity) {
                    if (this.areacode === '330000') {
                        this.city = ''
                        res['result'].unshift({
                            city: '全部',
                            code: '330000'
                        })
                        this.country = ''
                        this.countryList =  [{  
                            city: '全部'
                        }]
                    } else {
                      this.city = res['result'][0].city
                    }
                    this.cityList = res['result']
                } else {
                    this.country = ''
                    res['result'].unshift({
                        code: this.areaCode,
                        city: '全部',
                    })
                    this.countryList = res['result']
                }
            }              
        } else {
        }
      })
    },
    gethospital(isFirst = false){
      let data = {
       areaCode: this.areaCode    
      };
      let url = "/medicalwaste/v1/getHospitalByCode";
      post(url, data).then(res => {
        console.log(res, "医院数据");
          this.options=res.result;
        //   this.workhospital = null
        //   this.workhospital = ''
        //  if(this.options[0]){
        //    this.workhospital=this.options[0].hospitalCode
        //  }
        //  else{
        //    this.workhospital=null;
        //  }
          if (isFirst) {
            if (this.hospitalId) {
                this.workhospital = this.hospitalId
            } else {
                this.workhospital=this.options[0].hospitalCode
                this.setHospital({
                  name: this.options[0].hospitalName,
                  id: this.options[0].hospitalCode
                })
            }
          } else {
             if(this.options[0]){
                this.workhospital=this.options[0].hospitalCode
                this.setHospital({
                  name: this.options[0].hospitalName,
                  id: this.options[0].hospitalCode
                })
              }
            else{
              this.setHospital({
                name: '',
                id: null
              })
              this.workhospital=null;
              // this.tableData = []
            }
          }
      });
    },
    getcount(){
      let url='/medicalwaste/v1/getMedicalWasteCountByStaff';
      let data={'startDt':formatDate(this.timestart,'yyyy-MM-dd')+' 00:00:00'+'','endDt':formatDate(this.timesend,'yyyy-MM-dd')+' 23:59:59'+'','orgId':this.workhospital+''};
        if(this.timestart>this.timesend){
            this.$message({ message: "结束时间请大于开始时间", type: "warning", center: true });
        }else{
            post(url,data).then((res) => {
            this.buildweight(res.result);
            this.buildtype(res.result);
            console.log(res);
              
        })
        }
        
      
    },
    buildweight(list){
      let weightoptioncopy=clone(this.weightoption);
          _.forEach(list,(item)=>{
             weightoptioncopy.xAxis[0].data.push(item.name);
             weightoptioncopy.series[0].data.push(item.totalWeight); 
            
        })
        this.chartweight=true;
        setTimeout(()=>{
              var weightchart = echarts.init(this.$refs.weightchart);
              weightchart.setOption(weightoptioncopy);
              this.lisentresize(weightchart);
        },20)
     
    },
    buildtype(list){
        let typeoptioncopy=clone(this.typeoption);
                _.forEach(list,(item)=>{
                  typeoptioncopy.xAxis[0].data.push(item.name);
                  typeoptioncopy.series[0].data.push(item.infectWeight); 
                  typeoptioncopy.series[1].data.push(item.injureWeight); 
                  typeoptioncopy.series[2].data.push(item.pathWeight); 
                  typeoptioncopy.series[3].data.push(item.medicineWeight); 
                  typeoptioncopy.series[4].data.push(item.chemistryWeight);
                  typeoptioncopy.series[5].data.push(item.others);
                  
              })
            this.charttype=true;
            setTimeout(()=>{
                  var typechart = echarts.init(this.$refs.typechart);
                  typechart.setOption(typeoptioncopy);
                  this.lisentresize(typechart);
            },20)
    },
    lisentresize(fun){
        window.addEventListener("resize",function(){             
         fun.resize();
      });  
    },
    ...mapMutations({
        setHospital: 'setHospital'
    })  
  },
  mounted() {
  //  var weightchart = echarts.init(this.$refs.weightchart);
  //      weightchart.setOption(this.weightoption);
  //  var typechart = echarts.init(this.$refs.typechart);
  //      typechart.setOption(this.typeoption);
      //  window.addEventListener("resize",function(){              
      //    typechart.resize();
      //    weightchart.resize();
      // });   

  }
}
</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
  .workcount
     height:100%
     display:flex;
     flex-direction :column;
     .work-header
        display:flex;
        height:0.7rem;
        flex:none;
        align-items :center;
       .timechose,.hospital
          width:2rem;
          margin:0 0.2rem;
     .work-main
        flex:1; 
        .chart
          height:50%;
          padding:0.2rem;
          padding-top:0; 
          .weightchart,.typechart
            width:100%;
            background-color:white;
            height:100%; 
          
                
      
            

</style>
