<template>
  <div class="dumpcart">
    <div class="dumpcart-header">
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
      <span>医院:</span>
      <el-select v-model="detailtype" placeholder="请选择医院" class="hospital">
        <el-option v-for="item in options" :key="item.hospitalCode" :label="item.hospitalName" :value="item.hospitalCode">
        </el-option>
      </el-select>
        <span>统计间隔:</span>
         <el-select v-model="timetype" class="timetype">
                    <el-option
                      v-for="item in yearormonth"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
        </el-select>
         <span>日期范围:</span>
        <el-date-picker v-model="valuetime" :type="timetype" class="timepicker" v-show="!showtime"> </el-date-picker>
        <el-date-picker
              v-model="timestart"
              type="date"
              placeholder="选择日期" class="timechose" v-show="showtime">
        </el-date-picker>
        <span v-show="showtime">至</span>
        <el-date-picker
              v-model="timesend"
              type="date"
              placeholder="选择日期" class="timechose" v-show="showtime">
        </el-date-picker>
    </div>
    <div class="dumpcart-main">
          <el-table :data="tableData" border class="maintable" height="720">
             <el-table-column
                prop="index"
                label="序号"
                width="180">
              </el-table-column>       
              <el-table-column
                prop="belong"
                label="科室"
                width="180">
              </el-table-column>
              <el-table-column
                prop="collectime" 
                label="感染性"
                width="180">
              </el-table-column>
              <el-table-column
                prop="collectpersion"
                label="损伤性">
              </el-table-column>
              <el-table-column
                prop="givepersion"
                label="病理性">
              </el-table-column>
              <el-table-column
                prop="address"
                label="药物性">
              </el-table-column>
              <el-table-column
                prop="chemich"
                label="化学性">
              </el-table-column>
              <el-table-column
                prop="others"
                label="其它">
              </el-table-column>
              <el-table-column
                prop="total"
                label="总计">
              </el-table-column>
             
          </el-table>
          <div class="pagination">
              <el-pagination
                v-if="detailtype"
                background
                layout="prev, pager, next"
                :current-page="nowindex"
                :total="totalsize" @current-change="handleCurrentChange">
              </el-pagination>
               <el-pagination
               v-else
                background
                layout="prev, pager, next"
                :total="0" @current-change="handleCurrentChange">
              </el-pagination>
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
import { getChinaNationByCode } from '../../api/home.js';
var _ = require('lodash')
// import {mapMutations} from 'vuex';
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
      // nowindex: "1",
      nowindex:1,
      pageSize: "20",
      totalsize:10    ,
      _detailList: "",
      chartttotal: false,
      timetype: "date",
      valuetime: new Date(),
      yearormonth: [
        { value: "date", label: "日" },
        { value: "month", label: "月" },
        { value: "year", label: "年" },
        { value: "self", label: "自定义" }
      ],
      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
      options: [],
      tableData: [
      ],
      city: '',
      cityList: [],
      country: '',
      countryList: [],
      areaCode: '',
      level: '',
      data: {}, // MD 瞎写， 那我也瞎写
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
    // this.publicget();
  },
  computed: {
   ...mapGetters([
        'areacode' ,'logindata', 'hospitalId', 'hospitalId'
    ]),
  },
  watch: {
    detailtype(val, oldval) {
        this.options.forEach(item => {
          if(item.hospitalCode === val) {
            this.setHospital({
              id: item.hospitalCode,
              name: item.hospitalName
            })
          }
        });
        this.nowindex=1;
       this.timechange();
    },
    timetype(val, oldval) {
      if (val == "self") {
        this.showtime = true;
      } else {
        this.showtime = false;
      }
      this.nowindex=1;
      this.timechange();
    },
    valuetime(val, oldval) {
      this.nowindex=1;
      this.timechange();
    },
    timestart(val, oldval) {
      this.nowindex=1;
       this.timechange();
    },
    timesend(val, oldval) {
      this.nowindex=1;
      this.timechange();
    },
     nowindex(val,oldval){
       this.nowindex=val;
      this.timechange();
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
    gethospital(isFirst = false){
      let data = {
        areaCode:this.areaCode
      };
      let url = "/medicalwaste/v1/getHospitalByCode";
      post(url, data).then(res => {
         this.options=res.result;
        //  this.detailtype = null
        //  this.hospital = ''
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
    handleCurrentChange(val){
      this.nowindex=val;
      this.publicget(this.data);
     },
    toggletime() {
      this.showtime = !this.showtime;
    },
    defalutget(){
     this.data = {
        startDt: formatDate(this.timestart, "yyyy-MM-dd")+' 00:00:00',
        endDt: formatDate(this.timesend, "yyyy-MM-dd")+' 23:59:59',
      };
      this.publicget(this.data);
    },

    timechange:_.throttle(function(){
       switch (this.timetype) {
        case "date":
          this.datesearch();
          break;
        case "month":
          this.monthsearch();
          break;
        case "year":
          this.yearsearch();
          break;
        default:  this.defalutget();
      }
    },500,{ 'trailing': false }),
    datesearch() {
      this.data = {
        startDt: formatDate(this.valuetime, "yyyy-MM-dd")+' 00:00:00',
        endDt: formatDate(this.valuetime, "yyyy-MM-dd")+' 23:59:59',
      };
      this.publicget(this.data);
    },
    monthsearch() {
      let month = formatDate(this.valuetime, "MM");
      let year = formatDate(this.valuetime, "yyyy");
      let firstday = new Date(year, month, 1); //取当年当月中的第一天
      let lastday = new Date(
        firstday.getTime() - 1000 * 60 * 60 * 24
      ).getDate();
      this.data = {
        startDt: `${year}-${month}-01 00:00:00`,
        endDt: `${year}-${month}-${lastday} 23:59:59`,
      
      };
      this.publicget(this.data);
    },
    yearsearch() {
      let year = formatDate(this.valuetime, "yyyy");
      let firstday = new Date(year, 12, 1); //取当年当月中的第一天
      let lastday = new Date(
        firstday.getTime() - 1000 * 60 * 60 * 24
      ).getDate();
      this.data = {
        startDt: `${year}-01-01 00:00:00`,
        endDt: `${year}-12-${lastday} 23:59:59`,
      };
      this.publicget(this.data);
    },
    publicget(data) {
      let assigndate={
        orgId: this.detailtype,
        pageNum: this.nowindex,
        // pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      Object.assign(data,{},assigndate);
      let url = "/medicalwaste/v1/getMedicalWasteCountByDept";
      post(url, data).then(res => {
        this.tableData = []
        if (!this.detailtype) {
          return
        }
        if (res['status'] === '1') {
          this.totalsize=Number(res.result.pages)*10;
            let list=res.result.list;
            if(!list){
              this.tableData=[];
              return;
            }
            let temp=[];
              // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B  totalWeight F3333B
            _.forEach(list,(item,index)=>{
              temp.push({index:(this.nowindex - 1) * this.pageSize + index-0+1, belong:item.name,collectime:item.infectWeight, collectpersion:item.injureWeight, givepersion:item.pathWeight, address:item.medicineWeight, chemich:item.chemistryWeight,others:item.others, total:item.totalWeight});
            });
            this.tableData=[].concat(temp);
        } else {

        }  
      });
    },
    renderHeader1(h, { column, $index }) {
      return (
        <div
          class="warpdiv"
          style="display:flex;flex-direction :column;align-items :center;"
        >
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            清晨
          </div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            00:00-06:59
          </div>
        </div>
      );
    },
    renderHeader2(h, { column, $index }) {
      return (
        <div
          class="warpdiv"
          style="display:flex;flex-direction :column;align-items :center;"
        >
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            上午
          </div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            07:00-11:29
          </div>
        </div>
      );
    },
    renderHeader3(h, { column, $index }) {
      return (
        <div
          class="warpdiv"
          style="display:flex;flex-direction :column;align-items :center;"
        >
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            中午
          </div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            11:30-12:59
          </div>
        </div>
      );
    },
    renderHeader4(h, { column, $index }) {
      return (
        <div
          class="warpdiv"
          style="display:flex;flex-direction :column;align-items :center;"
        >
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            下午
          </div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            13:00-17:29
          </div>
        </div>
      );
    },
    renderHeader5(h, { column, $index }) {
      return (
        <div
          class="warpdiv"
          style="display:flex;flex-direction :column;align-items :center;"
        >
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            夜间
          </div>
          <div style="line-height:0.2rem;text-align:center;padding:0.1rem 0;">
            17:30-24:00
          </div>
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

.dumpcart {
  height: 100%;
  display: flex;
  flex-direction: column;

  .dumpcart-header {
    display: flex;
    height: 0.7rem;
    flex: none;
    padding: 0 0.2rem;
    align-items: center;

    &>span {
      margin: 0 0.1rem;
    }
  }

  .timechose, .hospital {
    width: 2rem;
    margin: 0 0.2rem;
  }

  .dumpcart-main {
    flex: 1;
    flex-direction: column;
    display: flex;
    margin: 0 0.2rem;

    .maintable {
      flex: 1;
    }

    .pagination {
      height: 0.6rem;
    }

    .siglecell {
      display: flex;
      height: 100%;

      .celltime {
        width: 30%;
        height: 100%;
        border-right: 1px dashed #E5E5E5;
        text-align: center;
      }

      .cellname {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}

.selfwidth {
  width: 15%;
}

.warpdiv {
}

.el-table th div {
  white-space: normal;
}
</style>
