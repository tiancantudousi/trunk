<template>
      <div class="detailmain">
           <div class="detail-header recycleheader">
                <el-date-picker
                    v-model="timechose"
                    type="date"
                    placeholder="选择日期" class="timechose">
               </el-date-picker>
                <!-- <el-select  v-model="city"   placeholder="请选择市" class="hospital" v-if="level === 1">
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
                <el-option v-for="item in hospitals" :key="item.hospitalCode" :label="item.hospitalName" :value="item.hospitalCode">
                </el-option>
              </el-select> -->
               <cityAreaHospitalcom @hospitalChange="onHospitalChange" @areaCodeChange="onAreaCodeChange"></cityAreaHospitalcom> 
                
           </div>
                  
            <div class="detail-content"  ref="getheight">
              <el-table
                  :data="tableData" :height="height"
                  border
                  >
                  <el-table-column
                    prop="num"
                    label="序号"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="place"
                    label="产生点"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="yearCount"
                    label="年次">
                  </el-table-column>
                    <el-table-column
                    prop="lastMonthCount"
                    label="上月次">
                  </el-table-column>
                    <el-table-column
                    prop="lastMonthPrecent"
                    label="上月完成情况">
                  </el-table-column>
                    <el-table-column
                    prop="currentMonthCount"
                    label="本月次">
                  </el-table-column>
                    <el-table-column
                    prop="currentWeekCount"
                    label="本周次">
                  </el-table-column>
                  <el-table-column
                    prop="currentMonthPrecent"
                    label="已完成情况">
                  </el-table-column>
                </el-table>
            </div>
            <!-- <div class="detail-footer">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="totalsize" @current-change="handleCurrentChange"
                >
              </el-pagination>
            </div> -->
      </div>
</template>

<script>
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
// import {clone} from 'common/js/clone.js';
import { getRecycleCount, getChinaNationByCode } from "../../api/home.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import Bus from "../../common/js/bus.js";
import cityAreaHospitalcom  from '../city-area-hospital/cityAreaHospital';
export default {
  components: {cityAreaHospitalcom},
  data() {
    return {
      city: "",
      country: "",
      countryList: [],
      hospitals: [],
      timechose: new Date(),
      hospital: "",
      totalsize: 0,
      nowindex: "1",
      pageSize: "15",
      tableheight: null,
      height: 300,
      cityList: [],
      tableData: [],
      areaCode: null, // 区域 code
      pageSize: 10,
      pageNum: 1,
      level: ""
    };
  },
  created() {
    // this.level = this.logindata.level;
    this.areaCode = this.areacode;
    // this.gethospital();
    // this.getRecycleCount();
  },
  computed: {
    ...mapGetters(["areacode", "logindata"])
  },
  watch: {
    timechose(val, oldval) {
      if (val) {
        let postdata=this.orgId?['orgId',this.orgId]:['areaCode',this.areaCode]
        this.getRecycleCount(...postdata);
      }
    },
    city(val, oldval) {
      if (val) {
        console.log(val);
        if (val === this.areaCode || val === "全部") return;
        this.areaCode = val;
        this.gethospital();
        if (val === "330000") {
          this.country = "";
          this.countryList = [
            {
              city: "全部"
            }
          ];
        } else {
          this.getChinaNationByCode(false);
        }
      }
    },
    country(val, oldval) {
      if (val) {
        console.log(val);
        if (val === this.areaCode || val === "全部") return;
        this.areaCode = val;
        this.gethospital();
      }
    },
    hospital(val, oldval) {
   
        // this.areaCode = val;
        if (val) {
          this.hospitals.forEach(item => {
            if (item.hospitalCode === val) {
              this.setHospital({
                id: item.hospitalCode,
                name: item.hospitalName
              });
              console.log('切换医院');
                this.getRecycleCount();
              Bus.$emit("changeOrgCode", item.hospitalCode);
            }
          });
        }else{
          this.tableData=[];
        }
      
      
    },
    nowindex(val, oldval) {
      console.log(val, "nowindex");
      console.log(val, "nowindex");
      // this.getdetail();
    }
  },
  methods: {
    onHospitalChange(e){
      console.log('112233');
       this.orgId=e;
       this.getRecycleCount('orgId',e);
   },
   onAreaCodeChange(e){
      console.log('334455');
      this.orgId='';
      this.areaCode=e;
      this.getRecycleCount('areaCode',e);
    },
    // getChinaNationByCode(isCity = true) {
    //   const data = {
    //     areaCode: this.areaCode
    //   };
    //   getChinaNationByCode(data).then(res => {
    //     if (res["status"] === "1") {
    //       if (res["result"]) {
    //         if (isCity) {
    //           if (this.areacode === "330000") {
    //             this.city = "";
    //             res["result"].unshift({
    //               city: "全部",
    //               code: "330000"
    //             });
    //             this.country = "";
    //             this.countryList = [
    //               {
    //                 city: "全部"
    //               }
    //             ];
    //           } else {
    //             this.city = res["result"][0].city;
    //           }
    //           this.cityList = res["result"];
    //         } else {
    //           this.country = "";
    //           res["result"].unshift({
    //             code: this.areaCode,
    //             city: "全部"
    //           });
    //           this.countryList = res["result"];
    //         }
    //       }
    //     } else {
    //     }
    //   });
    // },
    //
    // gethospital() {
    //   let data = {
    //     areaCode: this.areacode
    //   };
    //   let url = "/medicalwaste/v1/getChinaNationByCode";
    //   post(url, data).then(res => {
    //     console.log(res, "医院数据");
    //     this.cityList = res.result;
    //     if (this.cityList[0]) {
    //       this.detailtype = this.cityList[0].hospitalCode;
    //     } else {
    //       this.detailtype = null;
    //     }
    //   });
    // },
    // gethospital(isFirst = false) {
    //   let data = {
    //     areaCode: this.areaCode
    //   };
    //   let url = "/medicalwaste/v1/getHospitalByCode";
    //   post(url, data).then(res => {
    //     console.log(res, "医院数据");
    //     this.hospitals = res.result;
    //     // if (this.hospitals[0]) {
    //     //   this.hospital = this.hospitals[0].hospitalCode;
    //     // } else {
    //     //   this.hospital = null;
    //     // }
    //     if (isFirst) {
    //       if (this.hospitalId) {
    //         this.hospital = this.hospitalId;
    //       } else {
    //         this.hospital = this.hospitals[0].hospitalCode;
    //         this.setHospital({
    //           name: this.hospitals[0].hospitalName,
    //           id: this.hospitals[0].hospitalCode
    //         });
    //       }
    //     } else {
    //       if (this.hospitals[0]) {
    //         this.hospital = this.hospitals[0].hospitalCode;
    //         this.setHospital({
    //           name: this.hospitals[0].hospitalName,
    //           id: this.hospitals[0].hospitalCode
    //         });
    //       } else {
    //         this.setHospital({
    //           name: "",
    //           id: null
    //         });
    //         this.hospital = null;
    //       }
    //     }
    //   });
    // },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getRecycleCount();
    },
    // 获得 回收 统计 情况
    getRecycleCount(type,e) {
      
      const data = {
        startDt: formatDate(this.timechose, "yyyy-MM-dd") + " 00:00:00",
        endDt: formatDate(this.timechose, "yyyy-MM-dd") + " 23:59:59",
      };
      type=="orgId"?Object.assign(data,{},{orgId:e}):Object.assign(data,{},{areaCode:e});
      getRecycleCount(data).then(res => {
        console.log(res);
        this.tableData = [];
        if (res["status"] === "1") {
          this.totalsize = 0;
          if (res["result"]) {
            this.totalsize = res["result"].total;
            // this.tableData = res['result'].list
            res["result"].list.forEach((item, index) => {
              item.currentMonthPrecent =
                Math.round(item.currentMonthPrecent * 100) / 100 * 100 + "%";
              item.lastMonthPrecent =
                Math.round(item.lastMonthPrecent * 100) / 100 * 100 + "%";
              item.num = (this.pageNum - 1) * this.pageSize + index + 1;
              this.tableData.push(item);
            });
          }
        } else {
        }
      });
    },
    ...mapMutations({
      // setHospital: "setHospital"
    })
  },
  mounted() {
    //  this.areaCode = this.areacode
    // if (this.areaCode) {
    //   this.gethospital(true);
    //   this.level = this.logindata.level;
    //   if (this.level === 1) {
    //     // 表示省
    //     this.getChinaNationByCode();
    //   } else if (this.level === 2) {
    //     // 表示市
    //     this.getChinaNationByCode(false);
    //   }
    // }
    // this.getRecycleCount('orgId','');//默认查询当前时间内的所有数据
    setTimeout(() => {
      let getheight = this.$refs.getheight;
      let height = this.$refs.getheight.getElementsByTagName("th")[0].offsetHeight;
      this.height = getheight.offsetHeight-height;
      console.log('table 高度',getheight.offsetHeight,height,this.height);
    }, 20);
    //设置table的高度
    // let tableheight = this.$refs.getheight.clientHeight;
    // this.height = tableheight;
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

  .recycleheader {
    display: flex;
    flex: none;
    height: 0.7rem;
    align-items:center;
    padding:5px 10px;

    .timechose, .hospital {
      width: 2.2rem;
      margin: 0 0.2rem;
    }
  }

  .detail-content {
    margin-top: 2px;
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
