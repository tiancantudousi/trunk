<template>
      <div class="detailcount">
            <div class="detail-header">
               <div>
                  <el-select v-model="timetype" class="timetype">
                                      <el-option
                                        v-for="item in yearormonth"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                   </el-select>
                  <!-- <el-button-group v-activeClick="{'tag':'button','addclass':'active'}" style="margin-left:-0.1rem;margin-top:-0.01rem;"> -->
                  <el-date-picker v-model="valuetime" :type="timetype" class="timepicker">
                   </el-date-picker>
                   <!-- <el-button type="default" @click="toggletime">自定义时间</el-button> -->
                  <!-- </el-button-group> -->
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
                          <el-option
                            v-for="item in options"
                           :key="item.hospitalCode" :label="item.hospitalName" :value="item.hospitalCode">
                          </el-option>
                     </el-select>
               </div>
                
               
           </div>
           <div class="detail-main">
                <div class="detail-first">
                     <div class="waste-count">
                          <div class="wastediv">各类型废弃物统计</div>
                          <div class="wastecountchart" v-if="chartwastecount.show" ref="wastecountchart"></div>
                     </div>
                     <div class="waste-size">
                          <div class="wastediv">各类型废弃物比例</div>
                          <div class="wastesizechart" v-if="chartwastesize.show" ref="wastesizechart"></div>
                     </div>
                </div> 
                <div class="detail-second">
                     <linechartcom :pretype="pretypeoption" :show="linetypeshow.show" :title="'各类型废弃物总览'" :showul="'true'"></linechartcom> 
                </div>
                <div class="detail-threed">
                     <linechartcom :pretype="preoffiesoption" :show="lineoffieshow.show" :title="'各科室医废统计'" :showul="'true'"></linechartcom>
                </div>
           </div>
      </div>
</template>

<script>
var echarts = require("echarts");
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
import { clone } from "common/js/clone.js";
import { mapActions, mapGetters,mapMutations } from "vuex";
import linechartcom from "./linechart.vue";

// import {mapMutations} from 'vuex';
import { getChinaNationByCode } from '../../api/home.js'
export default {
  components: { linechartcom },
  data() {
    return {
      // timestart: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      // timesend: new Date(),
      valuetime: new Date(),
      detailtype: "",
      chartweight: false,
      charttype: false,
      optionsecond: "",
      optionthreed: "",
      showtime: false,
      pageNum: "1",
      pageSize: "20",
      _detailList: "",
      chartwastecount: { show: false },
      chartwastesize: { show: false },
      pretypeoption: "",
      preoffiesoption: "",
      timetype: "month",
      linetypeshow: { show: false },
      lineoffieshow: { show: false },
      yearormonth: [
        { value: "month", label: "月" },
        { value: "year", label: "年" }
      ],

      options: [
      ],
      wastesizeoption: {
        //  title : {
        //     text: '总重量',
        //     // subtext: '纯属虚构',
        //     color:'red',
        //     x:'center',
        //     y:'center'
        //  },
        tooltip: {
          //鼠标移入显示项
          trigger: "item"
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: "5%",
          top: "5%",
          data: ["感染性", "损伤性", "病理性", "药物性", "化学性", "其它"]
          // itemWidth: 10,
          // itemHeight: 10,
          // itemBorderRadius: 0,
          // icon:'square',
          // textStyle:{
          //     color:'#fff',
          //     fontSize:'14'
          // },
          // selectedMode: false,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        color: [],
        series: [
          {
            name: "",
            type: "pie",
            radius: ["50%", "80%"],
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            data: [],
            label: {
              normal: {
                show: false,
                position: "center",
                textStyle: {
                  backgroundColor: "rgba(0,28,60,.94)",
                  borderRadius: 2,
                  padding: [5, 5]
                }
              },
              emphasis: {
                show: true,
                formatter: "{d}%",
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            clockwise: false
          }
        ]
      },
      wastecountoption: {
        // color: ["#F43D45"],
        grid: {
          left: "5%",
          right: "4%",
          bottom: "3%",
          top: "12%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: ["感染性", "损伤性", "病理性", "药物性", "化学性", "其它"],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          }
        ],
        // 感染性 infectWeight #009EF9 损伤性 injureWeight #FF710F  病理性 pathWeight #00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
        series: [
          {
            name: "总重量",
            type: "bar",
            barWidth: "20%", //柱形图宽度
            data: [],
            itemStyle: {
              //控制柱形图样式 头部椭圆

              normal: {
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function(params) {
                  var colorList = [
                    "#009EF9",
                    "#FF710F",
                    "#00C261",
                    "#A950FF",
                    "#FFD326",
                    "#FF434B"
                  ];
                  return colorList[params.dataIndex];
                },
                barBorderRadius: [10, 10, 0, 0]
              }
            },
            label: {
              //配置数值显示在柱形图上的位置和样式
              normal: {
                show: true,
                position: "top",
                color: "black"
              }
            }
          }
        ]
      },
      linesoption: {
        // title: {
        //   text: "折线图堆叠"
        // },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: []
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: [
        
        ]
      },
      tableData: [
   
      ],
      city: '',
      cityList: [],
      country: '',
      countryList: [],
      areaCode: '',
      level: '',
      officeOrgId: null,
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
    // this.publicget(); ...mapGetters(['areacode'])
  },
  computed: {
    ...mapGetters([
      'areacode' ,'logindata', 'hospitalId', 'offiesList'
    ]),
  },
  watch: {
    timetype(val, oldval) {
      this.posttime(val, this.valuetime);
    },
    valuetime(val, oldval) {
      this.posttime(this.timetype, val);
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
      this.posttime(this.timetype, this.valuetime);
    },
    offiesList(val, oldval) {
      console.log("各类型废弃物统计", val);
      if (!val[0]) {
        this.$message({ message: "数据为空", type: "warning", center: true });
        // return;
        val[0] = []
      }
      if (!this.officeOrgId) {
        val[0] = []
      }
      this.buildtotal(
        val[0],
        this.wastecountoption,
        this.chartwastecount,
        "wastecountchart"
      );
      this.buildtotal(
        val[0],
        this.wastesizeoption,
        this.chartwastesize,
        "wastesizechart"
      );
    },
    city(val, oldval) {
      if(val){
        console.log(val)
         // console.log(val)
        if (val === this.areaCode) return
        this.areaCode = val

        this.gethospital()
        if (val === '330000') {
          this.country = ''
          this.countryList = [
            {city: '全部'}
          ]
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
    //  detailList(val,oldval){

    //    this._detailList=clone(val);
    //   //  //按总量排行
    //    this._detailList=this._detailList.sort((a,b)=>{
    //      return b.totalWeight-a.totalWeight;
    //    });
    //    ///
    //    let firsthospital=this._detailList[0];
    //    this.buildtotal(firsthospital);
    //    if(this._detailList.length<='2'){
    //       alert('数据缺失');
    //    }else{
    //      let tempsecond=this._detailList[1];
    //     let tempthreed=this._detailList[2];
    //     this.optionsecond=this.buildpercent(tempsecond);
    //     this.optionthreed=this.buildpercent(tempthreed);
    //    }
    //    //列表
    //    let temptable=[]
    //    _.forEach(this._detailList,(item,index)=>{
    //       // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
    //      let obj= {label:index, hospital:item.name, weight:item.totalWeight, polute:item.infectWeight, broke:item.injureWeight, silck:item.pathWeight, drag:item.medicineWeight, chemistry:item.chemistryWeight,others:item.others}
    //       temptable.push(obj);
    //    });
    //    this.tableData=temptable;

    //     console.log(this._detailList,'detailList');
    //  }
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
    // toggletime() {
    //   this.showtime = !this.showtime;
    // },
    // publicget(){
    //   let data={startDt:formatDate(this.timestart,'yyyy-MM-dd')+' 00:00:00',endDt:formatDate(this.timesend,'yyyy-MM-dd')+' 23:59:59',orgId:'',pageNum:this.pageNum,pageSize:this.pageSize};
    //   this.fetchOffies(data);
    // },
    posttime(type, timeval) {
      // console.log(type, timeval, "timeval");
      if (type == "month") {
        let month = formatDate(timeval, "MM");
        let year = formatDate(timeval, "yyyy");
        let firstday = new Date(year, month, 1); //取当年当月中的第一天
        let lastday = new Date(
          firstday.getTime() - 1000 * 60 * 60 * 24
        ).getDate();
        let data = {
          startDt: `${year}-${month}-01 00:00:00`,
          endDt: `${year}-${month}-${lastday} 23:59:59`,
          orgId: this.detailtype
          // pageNum: this.pageNum,
          // pageSize: this.pageSize
        };
        this.officeOrgId = this.detailtype
        this.fetchOffies(data);
        this.pretotal({
          startDt: `${year}-${month}-01 00:00:00`,
          endDt: `${year}-${month}-${lastday} 23:59:59`,
          orgId: this.detailtype
        });
        const {pageNum,pageSize,...preDaydata}=data
        this.preDay(preDaydata);
      } else {
        let month = "01";
        let year = formatDate(timeval, "yyyy");
        let firstday = new Date(year, "12", 1); //取当年当月中的第一天
        let lastday = new Date(
          firstday.getTime() - 1000 * 60 * 60 * 24
        ).getDate();
        // console.log(lastday,'lastday');
        let data = {
          startDt: `${year}-${month}-01 00:00:00`,
          endDt: `${year}-12-${lastday} 23:59:59`,
          orgId: this.detailtype
          // pageNum: this.pageNum,
          // pageSize: this.pageSize
        };
         this.officeOrgId = this.detailtype
        this.fetchOffies(data);
        this.pretotal({
          startDt: `${year}-${month}-01 00:00:00`,
          endDt: `${year}-12-${lastday} 23:59:59`,
          orgId: this.detailtype
        });
        const {pageNum,pageSize,...preDaydata}=data;
        this.preDay(preDaydata);
      }
    },
    pretotal(data) { 
      let url = "/medicalwaste/v1/getMedicalWasteCountByDept";
      post(url, data).then(res => {
        // console.log(res, "各科室医废统计数据");
        if (!res.result.length) {
          this.$message({
            message: "各科室医废统计数据为空",
            type: "warning",
            center: true
          });
        }
        if (!data.orgId) {
          res.result = []
        }
        //this.buildline(res.result,this.linesoption,this.linetypeshow,'preoffiesoption');
          console.log(res, "各科室医废统计数据");
        this.buildday(
          res.result,
          this.linesoption,
          this.lineoffieshow,
          "preoffiesoption"
        );
      //   this.buildtotal(
      //   res.result[0],
      //   this.wastecountoption,
      //   this.chartwastecount,
      //   "wastecountchart"
      //    );
      // this.buildtotal(
      //   res.result[0],
      //   this.wastesizeoption,
      //   this.chartwastesize,
      //   "wastesizechart"
      // );
      });
    },
    preDay(data) {
      let url = "/medicalwaste/v1/getMedicalWasteCountByDay";
      post(url, data).then(res => {
        // console.log(res, "各类型废弃物总览");
        if (!res.result.length) {
          this.$message({
            message: "各类型废弃物总览数据为空",
            type: "warning",
            center: true
          });
          res.result = []
        } else {
          // 
        }
        if (!data.orgId) {
          res.result = []
        }
        //this.buildline(res.result,this.linesoption,this.linetypeshow,'preoffiesoption');
        this.buildday(
          res.result,
          this.linesoption,
          this.linetypeshow,
          "pretypeoption"
        );
      });
    },

    buildtotal(hospital, option, showchart, chart) {
      //hospital柱形图高度和横坐标,option绘图类型option,showchart是否显示chart,chart=ref
      let optioncopy = clone(option);
      // console.log(wastecountoptioncopy,hospital,'optiontotalcopy');
      console.log(hospital)
      optioncopy.series[0].data.push({
        value: hospital.infectWeight,
        name: "感染性"
      });
      optioncopy.series[0].data.push({
        value: hospital.injureWeight,
        name: "损伤性"
      });
      optioncopy.series[0].data.push({
        value: hospital.pathWeight,
        name: "病理性"
      });
      optioncopy.series[0].data.push({
        value: hospital.medicineWeight,
        name: "药物性"
      });
      optioncopy.series[0].data.push({
        value: hospital.chemistryWeight,
        name: "化学性"
      });
      optioncopy.series[0].data.push({ value: hospital.others, name: "其它" });
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
      showchart.show = true;
      console.log(optioncopy, option, "optioncopy");

      setTimeout(() => {
        var chartrender = echarts.init(this.$refs[chart]);
        // console.log("执行");
        chartrender.setOption(optioncopy);
        window.addEventListener("resize", function() {
          chartrender.resize();
        });
      }, 20);
    },
    buildline(datas, option, protion, giveoption) {
      //hospital柱形图高度和横坐标,option绘图类型option,showchart是否显示chart,chart=ref
      let optioncopy = clone(option);
      
      optioncopy.series.push({
        name: "感染性",
        type: "line",
        color: "#009EF9",
        data: []
      }); //color 颜色控制
      optioncopy.series.push({
        name: "损伤性",
        type: "line",
        color: "#FF710F",
        data: []
      });
      optioncopy.series.push({
        name: "病理性",
        type: "line",
        color: "#00C261",
        data: []
      });
      optioncopy.series.push({
        name: "药物性",
        type: "line",
        color: "#A950FF",
        data: []
      });
      optioncopy.series.push({
        name: "化学性",
        type: "line",
        color: "#FFD326",
        data: []
      });
      optioncopy.series.push({
        name: "其它",
        type: "line",
        color: "#FF434B",
        data: []
      });
      // optioncopy.legend.data=['感染性','损伤性','病理性','药物性','化学性','其它'];
      _.forEach(datas, (item, index) => {
        optioncopy.xAxis.data.push(item.name);

       
        optioncopy.series[0].data.push(item.infectWeight);
        optioncopy.series[1].data.push(item.injureWeight);
        optioncopy.series[2].data.push(item.pathWeight);
        optioncopy.series[3].data.push(item.medicineWeight);
        optioncopy.series[4].data.push(item.chemistryWeight);
        optioncopy.series[5].data.push(item.others);
      });
      // console.log(protion, "protion");
      protion.show = true;
      this[giveoption] = optioncopy;
    },
    buildday(datas, option, protion, giveoption) {
      //hospital柱形图高度和横坐标,option绘图类型option,showchart是否显示chart,chart=ref
      let optioncopy = clone(option);
      _.forEach(datas,(item)=>{
        if(item.recycleDate){
           optioncopy.xAxis.data.push(item.recycleDate); //横轴
        }
        else{
           optioncopy.xAxis.data.push(item.name);
        }
          
      })
      
       // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
      let templegent=[{name:"感染性",value:'infectWeight',color:'#009EF9'},{name:"损伤性",value:'injureWeight',color:'#FF710F'} , {name:"病理性",value:'pathWeight',color:'#00C261'}, {name:"药物性",value:'medicineWeight',color:'#A950FF'}, {name:"化学性",value:'chemistryWeight',color:'#FFD326'} ,{name:"其它",value:'others',color:'#FF434B'} ];
      _.forEach(templegent,(item,index)=>{
        
         optioncopy.series.push(
           {
              name: item.name,
              type: "line",
              // stack: "总量",合并项
              color: item.color,
              data: []
           }
         )
          _.forEach(datas,val=>{
              optioncopy.series[index].data.push(val[item.value]);
          })
      })
    

      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight

      // console.log(protion, optioncopy,giveoption);
      protion.show = true;
      this[giveoption] = optioncopy;
    },
    gethospital(isFirst = false){
      let data = {
       areaCode:this.areaCode
      };
      let url = "/medicalwaste/v1/getHospitalByCode";
      post(url, data).then(res => {
        // console.log(res, "医院数据");
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
              this.detailtype=null;
              this.tableData = []
            }
          }
      });
    },
    ...mapMutations({
        setHospital: 'setHospital'
    }),
    ...mapActions(["fetchOffies"])
  },
  mounted() {
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/varibale';

.detailcount {
  height: 100%;
  display: flex;
  flex-direction: column;

  .detail-header {
    display: flex;
    height: 0.7rem;
    flex: none;
    justify-content: space-between;
    padding: 0 0.2rem;
    align-items: center;

    .timetype {
      width: 1rem;
      padding: 0;
      margin: 0;
    }

    .timepicker {
      width: 2rem;
    }
  }

  .hospital {
    width: 2rem;
    margin: 0 0.2rem;
  }

  .detail-main {
    flex: 1;
    flex-direction: column;
    display: flex;
    margin: 0 0.2rem;

    .detail-first {
      display: flex;
      flex: 1;

      .waste-count {
        background-color: white;
        width: 49%;
        margin-right: 1%;
        display: flex;
        flex-direction: column;

        .wastediv {
          padding: 0.1rem;
          border-bottom: 1px solid #F3F3F3;
        }

        div:last-child {
          flex: 1;
        }
      }

      .waste-size {
        background-color: white;
        width: 49%;
        margin-left: 1%;
        display: flex;
        flex-direction: column;

        .wastediv {
          padding: 0.1rem;
          border-bottom: 1px solid #F3F3F3;
        }

        div:last-child {
          flex: 1;
        }
      }
    }

    .detail-second {
      background-color: white;
      flex: none;
      height: 35%;
      margin: 0.2rem 0;
    }

    .detail-threed {
      background-color: white;
      flex: none;
      height: 35%;
    }
  }
}
</style>
