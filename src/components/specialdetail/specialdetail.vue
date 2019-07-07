<template>
  <div class="dumpcart">
    <div class="dumpcart-header">
  
        <el-date-picker v-model="timestart" type="date" placeholder="选择日期" class="timechose">
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
    <div class="dumpcart-main">
          <el-table :data="tableData"  border class="maintable" height="720">
                      
              <el-table-column
                prop="belong" 
                label="所属科室"
                >
              </el-table-column>
              <el-table-column
                prop="collectime"  
                label="收集时间"
                width="180">
              </el-table-column>
              <el-table-column
                prop="collectpersion"
                label="收集人员">
              </el-table-column>
              <el-table-column
                prop="givepersion"
                label="移交人员">
              </el-table-column>
              <el-table-column
                prop="weight"
                label="重量(kg)">
              </el-table-column>
              <el-table-column
                prop="intime"
                label="入库时间"
                width="180">
              </el-table-column>
              <el-table-column
                prop="inperson"
                label="入库人员">
              </el-table-column>
              <el-table-column
                prop="outtime"
                label="出库时间"
                width="180">
              </el-table-column>
              <el-table-column
                prop="outperson"
                label="出库人员">
              </el-table-column>
              <el-table-column
                prop="gongsi"
                label="回收公司">
              </el-table-column>
          </el-table>
           <div class="pagination">
              <el-pagination v-if="detailtype"
                background
                layout="prev, pager, next"
                :current-page="pageNum"
                :total="totalsize" @current-change="handleCurrentChange">
              </el-pagination>
              <el-pagination v-else
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
var _ = require('lodash');
// import {mapMutations} from 'vuex';
export default {
  components: {},
  data() {
    return {
      // timestart: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
      timestart: new Date(),
      timesend: new Date(),
      detailtype: "",
      chartweight: false,
      charttype: false,
      optionsecond: "",
      optionthreed: "",
      showtime: false,
      pageNum: "1",
      pageSize: "25",
      totalsize:10,
      _detailList: "",
      province:'',
      provinces:[],
      chartttotal: false,
      person:'',
      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
      options: [
      
      ],
 
      tableData: [
      ],
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
    // this.publicget();
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
        'areacode' ,'logindata', 'hospitalId'
        // 'singlelist'
    ])
  },
  watch: {
    pageNum(val,oldval){
      console.log(val,'nowindex');
      this.publicget();
     },
     timestart(val,oldval){
       this.pageNum=1;
        this.publicget();
    },
     detailtype(val,oldval){
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
      province(val,oldval){
       this.gethospital();
    },
    person(val,oldval){
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
     handleCurrentChange(val){
       this.nowindex=val;
       this.pageNum=val;
     },
   
    // monthsearch() {
    //   let month = formatDate(new Date(), "MM");
    //   let year = formatDate(new Date(), "yyyy");
    //   let firstday = new Date(year, month, 1); //取当年当月中的第一天
    //   let lastday = new Date(
    //     firstday.getTime() - 1000 * 60 * 60 * 24
    //   ).getDate();
    //   let data = {
    //     startDt: `${year}-${month}-01 00:00:00`,
    //     endDt: `${year}-${month}-${lastday} 23:59:59`,
    //     orgId: "",
    //     pageNum: this.pageNum,
    //     pageSize: this.pageSize
    //   };
    //   this.fetchdetail(data);
    // },
      getprovince(){
        let data = {
           areaCode:this.areacode
      };
      let url = "/medicalwaste/v1/getChinaNationByCode";
      post(url, data).then(res => {
        console.log(res, "区域数据");
        this.provinces=res.result;
       
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
              this.detailtype=null;
              this.tableData = []
            }
          }
      });
    },
  
    publicget:_.throttle(function(){
      if (!this.detailtype) {
        this.tableData = []
        return
      }
      let data = {
        recycleDate:formatDate(this.timestart,'yyyy-MM-dd'),
        orgId: this.detailtype,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        wasteType:'6'
      };
      let url='/medicalwaste/v1/getMedicalWasteRecord';
      post(url,data).then(res=>{
        console.log(res,'医废回收记录列表查询');
        this.totalsize=Number(res.result.pages)*10;
        //  this.tableData.length=0;
          let temparr=[];
                   
          _.forEach(res.result.list,(item)=>{
              temparr.push({belong:item.deptName,collectime:item.recycleTime,collectpersion:item.recycleUserName,givepersion:item.nurseName,weight:item.weight,intime:item.instoreTime,inperson:item.instoreUserName,outtime:item.outstoreTime,outperson:item.outstoreUserName,gongsi:item.companyUserName})
          })
          this.tableData=[].concat(temparr);
        })
    },500, { 'trailing': false }),
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
  }

  .timechose, .hospital {
    width: 2rem;
    margin: 0 0.2rem;
  }

  .dumpcart-main {
    flex: 1;
    flex-direction: column;
    display: flex;
    margin:0 0.2rem;
    .maintable{
      flex:1;
    }
    .pagination{
      height:0.6rem;
    }
    .siglecell{
       display:flex;
       height:100%;
       .celltime{
          width:30%;
          height:100%;
          border-right:1px dashed #E5E5E5;
          text-align:center;
       } 
       .cellname{
          flex:1;
          display:flex;
          align-items :center;
          justify-content :center;
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
