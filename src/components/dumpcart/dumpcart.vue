<template>
  <div class="dumpcart">
    <div class="dumpcart-header">
      <el-date-picker v-model="timepost" type="date" placeholder="选择日期" class="timechose"> 
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
        <el-select v-model="country" placeholder="请选择区/县" 
          class="hospital" v-if="level === 2 || level === 1">
          <el-option
            v-for="item in countryList"
            :key="item.id" :label="item.city" :value="item.code">
          </el-option>
      </el-select>
     <el-select v-model="detailtype" placeholder="请选择医院" class="hospital">
        <el-option v-for="item in options" :key="item.hospitalCode" :label="item.hospitalName" :value="item.hospitalCode">
        </el-option>
      </el-select>
       <el-select v-model="person" placeholder="请选择人员" class="person">
        <el-option v-for="item in persons" :key="item.recycleUserId" :label="item.recycleUserName" :value="item.recycleUserId">
        </el-option>
      </el-select>
    </div>
    <div class="dumpcart-main">
          <el-table :data="tableData" border height="300">
              <el-table-column class="selfwidth" :render-header="renderHeader1">
                  <template slot-scope="scope">
                      <div class="siglecell" v-if="scope.row.arr1">
                         <div class="celltime">
                           <p>{{scope.row.arr1.startTime.substring(11)}}</p>
                           <p>{{scope.row.arr1.endTime.substring(11)}}</p>
                         </div>
                         <div class="cellname">{{scope.row.arr1.deptName}}</div>
                      </div>
                  </template>
              </el-table-column>
             <el-table-column label="name" class="selfwidth" :render-header="renderHeader2">
                  <template slot-scope="scope">
                      <div class="siglecell" v-if="scope.row.arr2">
                         <div class="celltime">
                          <p>{{scope.row.arr2.startTime.substring(11)}}</p>
                           <p>{{scope.row.arr2.endTime.substring(11)}}</p>
                         </div>
                         <div class="cellname">{{scope.row.arr2.deptName}}</div>
                      </div>
                  </template>
              </el-table-column>
               <el-table-column class="selfwidth" label="date" :render-header="renderHeader3">
                  <template slot-scope="scope">
                      <div class="siglecell" v-if="scope.row.arr3">
                         <div class="celltime">
                           <p>{{scope.row.arr3.startTime.substring(11)}}</p>
                           <p>{{scope.row.arr3.endTime.substring(11)}}</p>
                         </div>
                         <div class="cellname">{{scope.row.arr3.deptName}}</div>
                      </div>
                  </template>
              </el-table-column>
              <el-table-column class="selfwidth" :render-header="renderHeader4">
                   <template slot-scope="scope">
                      <div class="siglecell" v-if="scope.row.arr4">
                         <div class="celltime">
                           <p>{{scope.row.arr4.startTime.substring(11)}}</p>
                           <p>{{scope.row.arr4.endTime.substring(11)}}</p>
                         </div>
                         <div class="cellname">{{scope.row.arr4.deptName}}</div>
                      </div>
                  </template>
              </el-table-column>
              <el-table-column class="selfwidth" :render-header="renderHeader5">
                   <template slot-scope="scope">
                      <div class="siglecell" v-if="scope.row.arr5">
                         <div class="celltime">
                          <p>{{scope.row.arr5.startTime.substring(11)}}</p>
                           <p>{{scope.row.arr5.endTime.substring(11)}}</p>
                         </div>
                         <div class="cellname">{{scope.row.arr5.deptName}}</div>
                      </div>
                  </template>
              </el-table-column>
          </el-table>
    </div>
  </div>
</template>

<script>
var echarts = require("echarts");
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
import { clone } from "common/js/clone.js";
import { getChinaNationByCode } from '../../api/home.js'
// import {mapMutations} from 'vuex';
import { mapActions, mapGetters,mapMutations } from "vuex";
var _ = require('lodash');
export default {
  components: {},
  data() {
    return {
      timepost:new Date(),
      hospital:'',
      person:'',
      chartweight: false,
      charttype: false,
      optionsecond: "",
      optionthreed: "",
      showtime: false,
      pageNum: "1",
      pageSize: "20",
      _detailList: "",
      chartttotal: false,
      person:'',
      detailtype:'',
      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
      persons:[ {
          value: "001",
          label: "小红"
        },
         {
          value: "002",
          label: "小明"
        },],
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
    // this.detailtype=this.options[0].value;
    this.areaCode = this.areacode
    if (this.areaCode) {
      this.level = this.logindata.level
      if (this.level === 1) { // 表示省
        this.getChinaNationByCode()
      } else if(this.level === 2) { // 表示市
        this.getChinaNationByCode(false)
      }
      this.gethospital(true)
    }
  },
  computed: {
   ...mapGetters([
        'areacode' ,'logindata', 'hospitalId', 'hospitalId'
    ]),
  },
  watch: {
    timepost(val, oldval) {
      this.getdumpcart();
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
      this.getperson();
    },
    person(val, oldval) {
      this.getdumpcart();
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
    getdumpcart:_.throttle(function(){
      let url="/medicalwaste/v1/getCarLocationRecord";
      let data = {
        // startDt: formatDate(this.timepost, "yyyy-MM-dd")+' 00:00:00',
        // endDt:formatDate(this.timepost, "yyyy-MM-dd")+' 23:59:59',
        recycleDate:formatDate(this.timepost, "yyyy-MM-dd"),
        orgId: this.detailtype,
        areaCode:this.areaCode,
        staffId:this.person
      };
      this.tableData=[];
      post(url,data).then(res=>{
          if (!this.detailtype) {
            res.result = []
          }
          let list=res.result;
          let temp=[];
          let arr1=_.filter(list,(item)=>{
            return item.type=='1';
          });
          let arr2=_.filter(list,(item)=>{
            return item.type=='2';
          });
           let arr3=_.filter(list,(item)=>{
            return item.type=='3';
          });
           let arr4=_.filter(list,(item)=>{
            return item.type=='4';
          });
           let arr5=_.filter(list,(item)=>{
            return item.type=='5';
          });
          let arrlenth=[arr1.length,arr2.length,arr3.length,arr4.length,arr5.length]
          let maxlength=Math.max(...arrlenth);
          console.log(arr1,arr2,arr3,arr4,arr5,'arr1',maxlength,arrlenth);
          for(let i=0;i<maxlength;i++){
            temp.push({});
          }
            // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B  totalWeight F3333B
          _.forEach(arr1,(item,index)=>{
            temp[index].arr1=item;
          });
          _.forEach(arr2,(item,index)=>{
          temp[index].arr2=item;
          });
          _.forEach(arr3,(item,index)=>{
          temp[index].arr3=item;
          });
          _.forEach(arr4,(item,index)=>{
          temp[index].arr4=item;
          });
          _.forEach(arr5,(item,index)=>{
          temp[index].arr5=item;
          });
          this.tableData=[].concat(temp);
      })
     
    },500,{'trailing':false}),
    gethospital(isFirst = false){
      let data = {
       areaCode:this.areaCode
      };
      let url = "/medicalwaste/v1/getHospitalByCode";
      post(url, data).then(res => {
        console.log(res, "医院数据");
        this.options=res.result;
        if (isFirst) {
            if (this.hospitalId) {
                this.detailtype = this.hospitalId
                this.getperson()
            } else {
                this.detailtype=this.options[0].hospitalCode
                this.getperson()
                this.setHospital({
                  name: this.options[0].hospitalName,
                  id: this.options[0].hospitalCode
                })
            }
          } else {
             if(this.options[0]){
                this.detailtype=this.options[0].hospitalCode
                this.getperson()
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
              this.persons = []
              this.person = ''
            }
          }
          
      });
    },
    getperson:_.throttle(function(){
        let url="/medicalwaste/v1/getRecycleStaffByCode";
          let data = {
            orgId: this.detailtype,
          };
          if(!this.detailtype){
            this.person = '';
            this.persons=[];
            return;
          }
          post(url,data).then((res)=>{
              console.log(res,'人员数据');
              if(res.status=="1"){
                  this.persons=res.result;
                  if (this.persons[0]) {
                    this.person=this.persons[0].recycleUserId;
                  } else {
                    this.person = '';
                  }
              }
            
             
          });
    },500,{'trailing':false}),
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
