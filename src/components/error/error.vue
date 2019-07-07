<template>
  <div class="error">
    <div class="error-header">
      <div>
        <el-date-picker v-model="timestart" type="date" placeholder="选择日期" class="timechose">
        </el-date-picker>
        <span>至</span>
        <el-date-picker v-model="timesend" type="date" placeholder="选择日期" class="timechose">
        </el-date-picker>
      </div>
      <!-- <span>区域</span>
      <el-select v-model="province" placeholder="请选择区域" class="hospital">
        <el-option v-for="item in provinces" :key="item.code" :label="item.city" :value="item.code">
        </el-option>
      </el-select> -->
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
      <el-select v-model="country" placeholder="请选择区/县" class="hospital" 
        v-if="level === 2 || level === 1">
        <el-option
          v-for="item in countryList"
          :key="item.id" :label="item.city" :value="item.code">
        </el-option>
      </el-select>
      <el-select v-model="detailtype" placeholder="请选择医院" class="hospital">
        <el-option v-for="item in options" :key="item.hospitalCode" :label="item.hospitalName" :value="item.hospitalCode">
        </el-option>
      </el-select>
    </div>
    <div class="error-main">
          <div class="error-first">
              <div v-if="circlechartshow.show" ref="circlechart"></div>
          </div>
          <div class="error-second">
              <div class="relatived">
                  <span v-if="detailtype">总条数: {{totalsize}}</span>
                  <span v-else>总条数: 0</span>
                 <el-select v-model="abnormaltype" placeholder="请选择" class="hospital">
                            <el-option v-for="item in abnormaltypes" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                  </el-select>
              </div>
              <el-table :data="tableData" class="tablew" border height="300">                               
                        <el-table-column
                          prop="belong"
                          label="所属科室"
                          width="180"> 
                        </el-table-column> 
                        <el-table-column
                          prop="time"
                          label="时间"
                          width="180">
                        </el-table-column>
                        <el-table-column
                          prop="errortype"
                          label="异常类型">
                        </el-table-column>
                        <el-table-column
                          prop="weight"
                          label="重量(kg)">
                        </el-table-column>
                        <el-table-column
                          prop="message"
                          label="处理信息">
                        </el-table-column>
                        
              </el-table>
              <div class="pagination" style="padding:0.1rem 0;">
                <el-pagination
                  v-if="detailtype"
                  background
                  layout="prev, pager, next"
                  :page-size="20"
                  :current-page="pageNum"
                  :total="totalsize" @current-change="handleCurrentChange">
                </el-pagination>
                 <el-pagination
                  v-else
                  background
                  layout="prev, pager, next"
                  :page-size="10"
                  :total="0" @current-change="handleCurrentChange">
                </el-pagination>
              </div>

          </div>
 
        
      
    </div>
  </div>
</template>

<script>
var echarts = require("echarts");
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
import { clone } from "common/js/clone.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
var _ = require('lodash');
// import {mapMutations} from 'vuex';
import { getChinaNationByCode } from '../../api/home.js'
export default {
  components: {},
  data() {
    return {
      timestart: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      timesend: new Date(),
      detailtype: "",
      chartweight: false,
      charttype: false,
      optionsecond: "",
      optionthreed: "",
      showtime: false,
      pageNum: "1",
      pageSize: "20",
      _detailList: "",
      chartttotal: false,
      totalsize:10,
      province:'',
      circlechartshow:{show:false},
      abnormaltype:'',
      abnormaltypes:[{
        value: "",
          label: "全部"
      },
      {
        value: "0",
          label: "遗失"
      },
       {
        value: "1",
          label: "破损"
      },
      {
        value: "2",
          label: "泄露"
      }],
      provinces:[],
      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
      options: [
       {
          value: "001",
          label: "浙江省第一医院"
        },
        {
          value: "002",
          label: "浙江省第二医院"
        },
        {
          value: "003",
          label: "浙江省第三医院"
        },
        {
          value: "004",
          label: "浙江省第四医院"
        },
        {
          value: "005",
          label: "浙江省第5医院"
        }
      ],
      tableData: [
      
      ],
      optiontotal:{
            legend: {//控制头的位置
                orient: 'vertical',
                right: '5%',
                top:'5%',
                data: [],
                itemWidth: 10,
                itemHeight: 10,
                itemBorderRadius: 0,
                icon:'square',
                textStyle:{
                    color:'#fff',
                    fontSize:'14'
                },
                //selectedMode: false,
            },
         
            color: [],
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius: ['50%', '80%'],//控制半径
                    center: ['50%', '50%'],//控制位置
                    // avoidLabelOverlap: false,
                    data:[
                       
                    ],
                    // label: {
                    //     normal: {
                    //         show: false,
                    //         position: 'center',
                    //         textStyle:{
                    //             backgroundColor: 'rgba(0,28,60,.94)',
                    //             borderRadius: 2,
                    //             padding:[5 ,5]
                    //         }
                    //     },
                    //     emphasis: {
                    //         show:true,
                    //         formatter: "{d}%",
                    //         textStyle: {
                    //             fontSize: '16',
                    //             fontWeight: 'bold',
                    //         }
                    //     }
                    // }, 
                    itemStyle: {//控制相关提示?
                          emphasis: {
                              shadowBlur: 10,
                              shadowOffsetX: 0,
                              shadowColor: 'rgba(0, 0, 0, 0.5)'
                          }
                     },    
                    clockwise:false,
                }
            ]
        },
      city: '',
      cityList: [],
      country: '',
      countryList: [],
      areaCode: '',
      level: ''
    };
  },
  created() {
    this.areaCode = this.areacode
    if (this.areaCode) {
      this.gethospital(true)
      this.level = this.logindata.level
      if (this.level === 1) { // 表示省
        this.getChinaNationByCode()
      } else if(this.level === 2) { // 表示市
        this.getChinaNationByCode(false)
      }
    }
    // this.detailtype=this.options[0].value;
    // this.getprovince();
    // this.publicget();
  },
  computed: {
   ...mapGetters([
        'areacode' ,'logindata', 'hospitalId', 'hospitalId'
    ]),
  },
  watch: {
    pageNum(val,oldval){
        this.publicget();
    },
    timestart(val, oldval) {
      this.pageNum=1;
      this.publicget();
    },
    timesend(val, oldval) {
       this.pageNum=1;
      this.publicget();
    },
    province(val,oldval){
       this.gethospital();
    },
    abnormaltype(val, oldval){
       this.pageNum=1;
       this.publicget();
    },
    detailtype(val, oldval) {
      this.options.forEach(item => {
        if(item.hospitalCode === val) {
          this.setHospital({
            id: item.hospitalCode,
            name: item.hospitalName
          })
        }
      })
       this.pageNum=1;
      this.publicget();
    },
    city(val, oldval) {
      if(val){
         console.log(val)
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
  methods: {
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
    toggletime() {
      this.showtime = !this.showtime;
    },
    handleCurrentChange(val){
       this.pageNum=val;
     },
   
  
    publicget:_.throttle(function(){
      this.tableData = []
      if (!this.detailtype) {
        this.circlechartshow.show = false
        return
      }
      let data = {
        startDt: formatDate(this.timestart, "yyyy-MM-dd") + " 00:00:00",
        endDt: formatDate(this.timesend, "yyyy-MM-dd") + " 23:59:59",
        orgId: this.detailtype,
        pageNum: this.pageNum,
        abnormalType: this.abnormaltype,
        pageSize: this.pageSize
      };
      let url = "/medicalwaste/v1/getAbnormalReocrd";
      post(url, data).then(res => {
        console.log(res, "异常统计");
        this.totalsize=Number(res.result.total)
          let list=res.result.list;
          let temp=[];
          _.forEach(list,(item)=>{
            temp.push({belong:item.deptName, time:item.time, errortype:this.getType(item.abnormalType), weight:item.weight, message:item.remark});
          });
          this.tableData=[].concat(temp);
      });
      this.getcircle();

    },500, { 'trailing': false }),
    getType(val){
      switch(val){
        case '0':return '遗失';break;
        case '1':return '破损';break;
        case '2':return '泄露';break;
      }
    },
    getprovince(){
        let data = {
           areaCode:this.areacode
      };
      let url = "/medicalwaste/v1/getChinaNationByCode";
      post(url, data).then(res => {
        console.log(res, "区域数据");
        this.provinces=res.result;
        this.province=this.provinces[0].code;
       
      });
    },
    gethospital(isFirst = false){
      let data = {
        areaCode: this.areaCode
      };
      let url = "/medicalwaste/v1/getHospitalByCode";
      post(url, data).then(res => {
        console.log(res, "医院数据");
         this.options=res.result;
        //  if(this.options[0]){
        //    this.detailtype=this.options[0].hospitalCode
        //  }
        //  else{
        //    this.detailtype=null;
        //  }
           if (isFirst) {
            if (this.hospitalId) {
                this.detailtype = this.hospitalId
            } else {
                this.detailtype=this.options[0].hospitalCode
                this.setHospital({
                  name: this.options[0].hospitalName,
                  id: this.options[0].hospitalCode
                })
            }
          } else {
             if(this.options[0]){
                this.detailtype=this.options[0].hospitalCode
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
              this.detailtype = null;
              this.tableData = []
            }
          }
      });
    },
    getcircle(){
      let data = {
        startDt: formatDate(this.timestart, "yyyy-MM-dd") + " 00:00:00",
        endDt: formatDate(this.timesend, "yyyy-MM-dd") + " 23:59:59",
        orgId: this.detailtype,
        // pageNum: this.pageNum,
        // pageSize: this.pageSize
      };
      let url = "/medicalwaste/v1/getAbnormalReocrdCount";
      post(url, data).then(res => {
        console.log(res, "异常统计圆形数据");
        let list=res.result;
        // ||(list.typeone&&!list.typetwo&&!list.typezero)||(!list.typeone&&list.typetwo&&!list.typezero)||(!list.typeone&&!list.typetwo&&list.typezero)
        if(!list){
         this.$message({ message: "圆形图表数据为空", type: "warning", center: true });
         this.circlechartshow.show=false;
         return;
        }
  
        this.buildtotal(list,this.optiontotal,this.circlechartshow,'circlechart');
          // let list=res.result.list;
          // let temp=[];
          // _.forEach(list,(item)=>{
          //   temp.push({belong:item.deptName, time:item.time, errortype:item.abnormalType, weight:item.weight, message:item.remark});
          // });
          // this.tableData=this.tableData.concat(temp);
      });
    },
     buildtotal(hospital, option, showchart, chart) {
      //hospital柱形图高度和横坐标,option绘图类型option,showchart是否显示chart,chart=ref
      let optioncopy = clone(option);
      // console.log(wastecountoptioncopy,hospital,'optiontotalcopy');

      if(hospital.typezero){
          console.log(hospital.typezero,'hospital.typezero');
          optioncopy.series[0].data.push({
            value: hospital.typezero,
            name: "遗失"
          });
      }
      if(hospital.typeone){
         console.log(hospital.typeone,'hospital.typeone');
        optioncopy.series[0].data.push({
                value: hospital.typeone,
                name: "破损"
              });
      }
     
     if(hospital.typetwo){
       console.log(hospital.typetwo,'hospital.typetwo');
      optioncopy.series[0].data.push({
        value: hospital.typetwo,
        name: "泄露"
      });
     }
      
     
      // let color=['#009EF9','#FF710F','#00C261','#A950FF','#FFD326','#FF434B'];
      // wastecountoptioncopy.color=color;
      let color = [
        "#009EF9",
        "#FF710F",
        "#00C261",
        "#A950FF",
        "#FFD326",
        "#FF434B"
      ]; //圆形设置颜色
      optioncopy.color = color;
      // if((hospital.typeone&&!hospital.typetwo&&!hospital.typezero)||(!hospital.typeone&&hospital.typetwo&&!hospital.typezero)||(!hospital.typeone&&!hospital.typetwo&&hospital.typezero)){
      //        showchart.show = false;
      // }
      // else{
          showchart.show = true;
      // }
     
      console.log(optioncopy, option, "optioncopy");
      optioncopy.tooltip = {
         trigger: 'item',
          formatter: function (params) {
            console.log(params)
            return `${params.name} ${params.value}kg ${params.percent}%`
          }
      }
      setTimeout(() => {
        var chartrender = echarts.init(this.$refs[chart]);
        chartrender.setOption(optioncopy);
        window.addEventListener("resize", function() {
          chartrender.resize();
        });
      }, 20);
    },
    renderHeader1(h, { column, $index }) {
      return (
        <div class="warpdiv" style="display:flex;flex-direction :column;align-items :center;">
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">清晨</div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">00:00-06:59</div>
        </div>
      );
    },
      renderHeader2(h, { column, $index }) {
      return (
        <div class="warpdiv" style="display:flex;flex-direction :column;align-items :center;">
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">上午</div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">07:00-11:29</div>
        </div>
      );
    },
      renderHeader3(h, { column, $index }) {
      return (
        <div class="warpdiv" style="display:flex;flex-direction :column;align-items :center;">
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">中午</div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">11:30-12:59</div>
        </div>
      );
    },
      renderHeader4(h, { column, $index }) {
      return (
        <div class="warpdiv" style="display:flex;flex-direction :column;align-items :center;">
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">下午</div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">13:00-17:29</div>
        </div>
      );
    },
      renderHeader5(h, { column, $index }) {
      return ( 
        <div class="warpdiv" style="display:flex;flex-direction :column;align-items :center;">
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">夜间</div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">17:30-24:00</div>
        </div>
      );
    },
    ...mapMutations({
      setHospital: 'setHospital'
    }) 
  },
  mounted() {}
};
</script>

<style lang="stylus">
@import '~common/stylus/varibale';

.error {
  height: 100%;
  display: flex;
  flex-direction: column;

  .error-header {
    display: flex;
    height: 0.7rem;
    flex: none;
    padding: 0 0.2rem;
    align-items: center;
  }

  .timechose, .hospital {
    width: 2rem;
    margin: 0 0.2rem;
  }

  .error-main {
    flex: 1;
    flex-direction: column;
    display: flex;
    margin:0 0.2rem;
    .error-first{
      height:6rem;
      display:flex;
      &>div{
        flex:1;
      }
    }
    .error-second{
      flex:1;
      .relatived{
        position:relative;
        height:0.6rem;
        .hospital{
          position:absolute;
          top:0;
          right:0.2rem;
        }
      }
    }
    
      
  }
}
.selfwidth{
  width:15%;
}
.warpdiv{
 
}
.el-table th div
   white-space: normal;
</style>
