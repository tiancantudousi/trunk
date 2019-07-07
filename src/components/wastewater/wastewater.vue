<template>
  <div class="wastewater">
    <div style="padding:0.1rem 0.1rem;">
        <el-date-picker
                          v-model="timestart"
                          type="date"
                          placeholder="选择日期" class="timechose">
                    </el-date-picker>
                    <span>至</span>
                    <el-date-picker
                          v-model="timesend"
                          type="date"
                          placeholder="选择日期" class="timechose">
        </el-date-picker>
         <!-- <el-select v-model="province" placeholder="请选择区域" class="hospital">
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
    
      <linechartcom :pretype="pretypeoption" :title="'污水污泥统计'"></linechartcom>
  </div>
</template>

<script>
var echarts = require("echarts");
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
import { clone } from "common/js/clone.js";
import linechartcom from 'components/detail-count/linechart'
// import { post } from "api/homeHttp";
// import { formatDate } from "common/js/date";
import { mapActions, mapGetters,mapMutations } from "vuex";
import { getChinaNationByCode } from '../../api/home.js'
// import {mapMutations} from 'vuex';
export default {
  components: {linechartcom},
  data() {
    return {
      timestart:new Date(new Date().getTime()-7*24*60*60*1000),
       timesend:new Date(),
      pageNum: "1",
      pageSize: "20",
      _detailList: "",
      province:'',
      provinces:[],
      detailtype:'',
      options:[],
      chartttotal: false,
      pretypeoption:'',
      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
     
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
      city: '',
      cityList: [],
      country: '',
      countryList: [],
      areaCode: '',
      level: ''
    };
  },
  created() {
      // this.getprovince();
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
  },
  computed: {
    ...mapGetters([
        'areacode' ,'logindata', 'hospitalId', 'hospitalId'
    ]),
  },
  watch: {
   timestart(val,oldval){
       this.merge();
   },
   timesend(val,oldval){
        this.merge();
   },
   province(val,oldval){
       this.gethospital();
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
      this.merge();
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
    getprovince(){
        let data = {
           areaCode:this.areacode
      };
      let url = "/medicalwaste/v1/getChinaNationByCode";
      post(url, data).then(res => {
        console.log(res, "区域数据");
        this.provinces=res.result;
        if(res.result){
          this.province=this.provinces[0].code;
        }
       
       
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
                this.detailtype = this.options[0].hospitalCode
                this.setHospital({
                  name: this.options[0].hospitalName,
                  id: this.options[0].hospitalCode
                })
            }
          } else {
             if(this.options[0]){
                this.detailtype = this.options[0].hospitalCode
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
    getdata(val){
       let data = {
        startDt:formatDate(this.timestart,'yyyy-MM-dd')+' 00:00:00',
        endDt:formatDate(this.timesend,'yyyy-MM-dd')+' 23:59:59',
        orgId:this.detailtype,
        areaCode:this.areacode,
        reportType:val
      };
      let url='/medicalwaste/v1/getReportCount';
     return post(url,data).then(res=>{
        console.log(res,'污水污泥');
         return new Promise((resoleve,reject)=>{
           resoleve(res);
         })
        })
    },
     merge(){
       let one=false;
       let two=false;
       let datas=[];
       datas.length=2;
        this.getdata('1').then(res=>{
          one=true;
          datas[0]=res.result;
           if(two){
            
           this.buildday(datas,this.linesoption,'pretypeoption');
         }
          console.log(res,'data1')
        });
       this.getdata('2').then(res=>{
         two=true;
          datas[1]=res.result;
         if(one){
           this.buildday(datas,this.linesoption,'pretypeoption');
         }
          console.log(res,'data2')
        });
     },
      buildday(datas, option,giveoption) {
      //hospital柱形图高度和横坐标,option绘图类型option,showchart是否显示chart,chart=ref
      if (!this.detailtype) {
        datas = []
      }
      let optioncopy = clone(option);
      //去重，排序从小到大
      let xdate=[];
        _.forEach(datas,(item)=>{
          let itemxdata=item.map(element=>{
            return element.reportDate;
          })
          xdate=xdate.concat(itemxdata)
      })
       optioncopy.xAxis.data=_.uniq(xdate);
       optioncopy.xAxis.data.sort((a,b)=>{
         return new Date(a.replace(/-/g,'/')).getTime()-new Date(b.replace(/-/g,'/')).getTime();
       })
       console.log(optioncopy.xAxis.data,'横轴所有坐标');
    
      
       // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
      let templegent=[{name:"污水",value:'infectWeight',color:'#009EF9'},{name:"污泥",value:'injureWeight',color:'#FF710F'}  ];
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
          _.forEach(datas[index],val=>{
            let x=_.findIndex(optioncopy.xAxis.data, function(o) { return o == val.reportDate });
            optioncopy.series[index].data[x]=val.count;
              // optioncopy.series[index].data.push(val.count);
          })
      })
    

      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight

      console.log(optioncopy,'optioncopy');

      this[giveoption] = optioncopy;
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

.wastewater {
    height:90%;
}
</style>
