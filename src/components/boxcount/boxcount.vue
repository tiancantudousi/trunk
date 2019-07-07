<template>
  <div class="detailmain">
    <div class="detail-header">
      <el-date-picker v-model="timechose" type="date" placeholder="选择日期" class="timechose"></el-date-picker>
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
      <el-select v-model="hospital" placeholder="请选择医院" class="hospital">
        <el-option
          v-for="item in options"
          :key="item.hospitalCode"
          :label="item.hospitalName"
          :value="item.hospitalCode"
        ></el-option>
      </el-select>
    </div>

    <div class="detail-content" ref="getheight">
      <el-table :data="tableData"  border>
        <el-table-column prop="num" label="序号" width="180"></el-table-column>
        <el-table-column prop="dept" label="科室" width="180"></el-table-column>
        <el-table-column prop="infectWeight" label="感染性"></el-table-column>
        <el-table-column prop="injureWeight" label="损伤性"></el-table-column>
        <el-table-column prop="pathWeight" label="病理性"></el-table-column>
        <el-table-column prop="medicineWeight" label="药物性"></el-table-column>
        <el-table-column prop="chemistryWeight" label="化学性"></el-table-column>
        <el-table-column prop="others" label="其他"></el-table-column>
        <el-table-column prop="totalWeight" label="总计"></el-table-column>
      </el-table>
    </div>
    <div class="detail-footer">
      <el-pagination v-if="hospital"
        background
        layout="prev, pager, next"
        :total="totalsize"
        :current-page="nowindex"
        @current-change="handleCurrentChange"
      ></el-pagination>
       <el-pagination
        v-else
        background
        layout="prev, pager, next"
        :total="0"
      
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
// import {clone} from 'common/js/clone.js';
import { mapActions, mapGetters,mapMutations } from "vuex";
import { getChinaNationByCode } from '../../api/home.js';
var _ = require('lodash');
export default {
  components: {},
  data() {
    return {
      timechose: new Date(),
      hospital: "",
      totalsize: 10,
      nowindex: 1,
      pageSize: "10",
      tableheight: null,
      height: 600,
      options: [],
      tableData: [],
      city: '',
      cityList: [],
      country: '',
      countryList: [],
      areaCode: '',
      level: ''
    };
  },
  created() {
    // this.gethospital();
    // this.getdetail();
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
    // height:function(){
    //   return this.tableheight;
    // }
  },
  watch: {
    timechose(val, oldval) {
      if (val) {
        this.nowindex=1;
        this.getdetail();
      }
    },
    hospital(val, oldval) {
      if (val) {
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
    nowindex(val, oldval) {
      this.getdetail();
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
    gethospital(isFirst = false) {
      let data = {
        areaCode: this.areaCode
      };
      let url = "/medicalwaste/v1/getHospitalByCode";
      post(url, data).then(res => {
        this.options = res.result;
        // if (this.options[0]) {
        //   this.hospital = this.options[0].hospitalCode;
        // } else {
        //   this.hospital = null;
        //   this.tableData = [];
        // }
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
      let url = "/medicalwaste/v1/getMedicalWasteCountByBox";
      let data = {
        recycleDate: formatDate(this.timechose, "yyyy-MM-dd"),
        orgId: this.hospital,
        pageNum: this.nowindex,
        pageSize: this.pageSize,
        areaCode: this.areacode
      };
      post(url, data).then(res => {
        this.totalsize = Number(res.result.pages) * 10;
        this.tableData.length = 0;
        let temparr = [];
        _.forEach(res.result.list, (item,index) => {
          temparr.push({
            num: (this.nowindex - 1) * this.pageSize + index + 1,
            dept: item.name,
            infectWeight: item.infectWeight,
            injureWeight: item.injureWeight,
            pathWeight: item.pathWeight,
            medicineWeight: item.medicineWeight,
            chemistryWeight: item.chemistryWeight,
            others: item.others,
            totalWeight: item.totalWeight
          });
        });
        if (this.hospital) {
           this.tableData = [].concat(temparr);
        } else {
          this.tableData = []
        }
        // debugger
      });
    },500,{ 'trailing': false }),
    handleCurrentChange(val) {
      this.nowindex = val;
    },
    ...mapMutations({
        setHospital: 'setHospital'
    }) 
  },
  mounted() {
    setTimeout(() => {
      let getheight = this.$refs.getheight;
      let height = this.$refs.getheight.getElementsByTagName("th")[0]
        .offsetHeight;
      this.tableheight = height;
    }, 20);
    //设置table的高度
    let tableheight = this.$refs.getheight.clientHeight;

    this.height = tableheight;
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/varibale';

.detailmain {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .detail-header {
    display: flex;
    flex: none;
    height: 0.7rem;
    align-items: center;

    .timechose, .hospital {
      width: 2.2rem;
      margin: 0 0.2rem;
    }
  }

  .detail-content {
    flex: 1;
  }

  .detail-footer {
    padding-bottom: 0.5rem;

    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #00C261;
      color: white;
    }
  }
}
</style>
