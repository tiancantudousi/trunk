<template>
      <div class="detailmain">
           <div class="detail-header">
                <el-date-picker
                    v-model="timechose"
                    type="date"
                    placeholder="选择日期" class="timechose">
               </el-date-picker>
                <el-select 
                    v-model="city" 
                    placeholder="请选择市" 
                    class="hospital"
                    @change="changeCity()"  v-if="level === 1">
                    <el-option
                      v-for="item in cityList"
                      :key="item.id" :label="item.city" :value="item.code"
                     >
                    </el-option>
                </el-select>
                 <el-select v-model="country" placeholder="请选择区/县" 
                    class="hospital" v-if="level === 2 || level === 1">
                    <el-option
                      v-for="item in countryList"
                      :key="item.id" :label="item.city" :value="item.code">
                    </el-option>
                </el-select>
                <el-select v-model="hospital" placeholder="请选择医院" class="hospital">
                    <el-option
                      v-for="item in options"
                      :key="item.hospitalCode" :label="item.hospitalName" :value="item.hospitalCode">
                    </el-option>
                </el-select>
           </div>
                  
            <div class="detail-content"  ref="getheight">
              <el-table
                  :data="tableData"
                  border
                  >
                  <el-table-column
                    prop="offies"
                    label="所属科室"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="收集时间"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="collect"
                    label="收集人员">
                  </el-table-column>
                    <el-table-column
                    prop="give"
                    label="移交人员">
                  </el-table-column>
                    <el-table-column
                    prop="poision"
                    label="废弃物类别">
                  </el-table-column>
                    <el-table-column
                    prop="weight"
                    label="重量(KG)">
                  </el-table-column>
                    <el-table-column
                    prop="intime"
                    width="180"
                    label="入库时间">
                  </el-table-column>
                    <el-table-column
                    prop="inpersion"
                    label="入库人员">
                  </el-table-column>
                    <el-table-column
                    prop="outtime"
                    width="180"
                    label="出库时间">
                  </el-table-column>
            </el-table>
            </div>
            <div class="detail-footer">
              <el-pagination
                v-if="hospital"
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
</template>

<script>

import {post} from 'api/homeHttp';
import {formatDate} from 'common/js/date';
// import {clone} from 'common/js/clone.js';
import { getChinaNationByCode } from '../../api/home.js'
var _ = require('lodash')

import { mapActions, mapGetters,mapMutations } from "vuex";

export default {
  components:{},
  data () {
    return {
       timechose:new Date(),
       hospital:'',
       totalsize:10,
       nowindex:1,
       pageSize:'10',
       tableheight:null,
       height:600,
       options: [],
       tableData: [],
       city: '',
       cityList: [],
       country: '',
       countryList: [],
       areaCode: '',
       level: ''
    }
  },
  created() {
    this.areaCode = this.areacode;
    if (this.areaCode) {//这个判断绝对进，没进会导致首次进入页面数据异常
        this.level = this.logindata.level
        if (this.level === 1) { // 表示省
          this.getChinaNationByCode()
        } else if(this.level === 2) { // 表示市
          this.getChinaNationByCode(false)
        }
      this.gethospital(true);//已包含this.getdetail();函数触发
    }
  },
  computed:{
    ...mapGetters([
      'areacode' ,'logindata', 'hospitalId'
    ]),
    // height:function(){
    //   return this.tableheight;
    // }
  
  },
  watch:{
    timechose(val,oldval){
      if(val){
         this.nowindex=1;
         this.getdetail();
       
      }  
    },
    hospital(val,oldval){
      if(val){
        this.options.forEach(item => {
          if(item.hospitalCode === val) {
            this.setHospital({
              id: item.hospitalCode,
              name: item.hospitalName
            })
          }
        })
        this.nowindex=1;
        this.getdetail();
      }  
    },
    nowindex(val,oldval){
      console.log(val,'nowindex');
      this.getdetail();
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
  methods:{
    // 点击 城市
    changeCity() {
     
    },
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
          if (isFirst) {
            if (this.hospitalId) {
                this.hospital = this.hospitalId
            } else {
                this.hospital=this.options[0].hospitalCode
                this.setHospital({
                  name: this.options[0].hospitalName,
                  id: this.options[0].hospitalCode
                })
            }
          } else {
             if(this.options[0]){
                this.hospital=this.options[0].hospitalCode
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
              this.hospital=null;
              this.tableData = []
            }
          }
      });
    },
     getdetail:_.throttle(function(){
      let url='/medicalwaste/v1/getMedicalWasteRecord';
      this.tableData=[];
      // this.totalsize=10;
      let data={startDt:formatDate(this.timechose,'yyyy-MM-dd')+' 00:00:00',endDt:formatDate(this.timechose,'yyyy-MM-dd')+' 23:59:59',orgId:this.hospital,pageNum: this.nowindex,pageSize: this.pageSize};
        post(url,data).then((res) => {
              console.log(res);
              this.totalsize=Number(res.result.pages)*10;
              this.tableData.length=0;
              let temparr=[];
              _.forEach(res.result.list,(item)=>{
                 const waste = this.getWasteTypeText(item.wasteType)
                 temparr.push({
                  offies:item.deptName,
                  date:item.recycleTime,
                  collect:item.recycleUserName,
                  give:item.nurseName,
                  poision: waste,
                  weight:item.weight,
                  intime:item.instoreTime,
                  inpersion:item.instoreUserName,
                  outtime:item.outstoreTime})
              })
              if (this.hospital) {
                this.tableData=[].concat(temparr);
              }
              // debugger;
              console.log(this.tableData,'tabledata');
        })
     },50, { 'trailing': false }),
     getWasteTypeText (wasteType) {
       let text = ''
       switch (wasteType) {
         case 1:  text = '感染性'
           break
         case 2:  text = '损伤性'
           break
         case 3:  text = '病理性'
           break
         case 4:  text = '药物性'
           break
         case 5:  text = '化学性'
           break
         case 6:  text = '其他'
           break
         default: 
           text = '未知'
       }
       return text
     },
     handleCurrentChange(val){
       console.log(val,'112233');
       this.nowindex=val;
     },
    ...mapMutations({
        setHospital: 'setHospital'
    }) 
  },
  mounted() {
    setTimeout(()=>{
      let getheight=this.$refs.getheight;
      let height=this.$refs.getheight.getElementsByTagName('th')[0].offsetHeight;
      this.tableheight=getheight.offsetHeight-height;;
     console.log('getheight',getheight,height);
    },20);
  
   

  }
}
</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
  .detailmain
     height:100%;
     position:relative;
     display:flex;
     flex-direction :column;
     .detail-header
       display:flex;
       flex:none;
       height:0.7rem;
       align-items:center;
       .timechose,.hospital
          width:2.2rem;
          margin:0 0.2rem;
     .detail-content 
         flex:1;
     .detail-footer
          padding-bottom:0.5rem;
          .el-pagination.is-background .el-pager li:not(.disabled).active
             background-color:#00C261; 
             color:white;   
</style>
