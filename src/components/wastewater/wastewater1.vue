<template>
      <div class="detailmain">

           		<div class="contentHeader">
                <el-date-picker
                      v-model="startDt"
                      type="date"
                      placeholder="选择日期" class="timechose">
                </el-date-picker>
                <span style="padding:0 10px;">至</span>
                <el-date-picker
                      v-model="endDt"
                      type="date"
                      placeholder="选择日期" class="timechose">
                </el-date-picker>
                
                <el-select v-model="reportType"  clearable placeholder="报告选择" style="width:130px;padding:0 10px;">
                    <el-option key="0" label="全部" value=""></el-option>
                    <el-option key="1" label="污水报告" value="1"></el-option>
                    <el-option key="2" label="污泥报告" value="2"></el-option>
                </el-select>
                 <cityAreaHospitalcom @hospitalChange="onHospitalChange" @areaCodeChange="onAreaCodeChange"></cityAreaHospitalcom>
                 <span>总数:{{totalNumber}}</span> 
		         	</div>
                  
            <div class="detail-content"  ref="getheight">
              <!-- <el-table
                  :data="tableData"
                  border
                  >
                  <el-table-column
                    prop="reportdate"
                    label="上报时间"
                    >
                  </el-table-column>
                  <el-table-column
                    prop="reportorg"
                    label="所属医疗机构"
                   >
                  </el-table-column>
                  <el-table-column
                    prop="reportname"
                    label="报告名称">
                  </el-table-column>
                    <el-table-column
                    prop="give"
                    label="操作">
                    <a></a>
                  </el-table-column>
                  
            </el-table> -->
            			<el-table class='table-box' :data="listData" :height="height" border stripe size="mini" @cell-click="readDetail">
                    <el-table-column prop="reportDate" show-overflow-tooltip label="时间"></el-table-column>
                    
                            <el-table-column prop="reportName" show-overflow-tooltip label="报告名称"></el-table-column>
                            
                            <el-table-column prop="status" show-overflow-tooltip label="所属医院"> </el-table-column>

                            <el-table-column prop="give" show-overflow-tooltip label="操作"> </el-table-column>
                    
                  </el-table>
            </div>
            <div class="detail-footer">
              <el-pagination
                background
                layout="prev, pager, next"
                :current-page="nowPage"
                :total="totalsize" @current-change="handleCurrentChange">  
              </el-pagination>
         
              <!-- <el-pagination
                v-if="hospital"
                background
                layout="prev, pager, next"
                :total="totalsize" @current-change="handleCurrentChange">
              </el-pagination>
              <el-pagination
                v-else
                background
                layout="prev, pager, next"
                :total="0" @current-change="handleCurrentChange">
              </el-pagination> -->
            </div>
      </div>
</template>

<script>

import {post} from 'api/homeHttp';
import {formatDate} from 'common/js/date';
// import {clone} from 'common/js/clone.js';
import { getChinaNationByCode } from '../../api/home.js';
import cityAreaHospitalcom  from '../city-area-hospital/cityAreaHospital';

import { mapActions, mapGetters,mapMutations } from "vuex";
var _ = require('lodash');

export default {
  components:{cityAreaHospitalcom},
  data () {
    return {
       startDt:new Date(new Date().getTime()-7*24*60*60*1000),
       endDt:new Date(),
       hospital:'',
       totalsize:10,
       nowPage:1,
       pageSize:20,
       tableheight:null,
       height:200,
       options: [],
       city: '',
       cityList: [],
       country: '',
       countryList: [],
       areaCode: '',
       level: '',
       listData: [],
      reportType:'',//报告类型 1污水  2污泥
      // userName:localStorage.getItem("wasteUserName"),
      orgId:'',
      totalNumber:0
    }
  },

  computed:{
    
  },
  watch:{
    // timechose(val,oldval){
    //   if(val){
    //      this.getdetail();
    //   }  
    // },
    startDt(val,oldval){
      this.nowPage=1;
      this.getwasteslude(this.reportType);
    },
    endDt(val,oldval){
      this.nowPage=1;
      this.getwasteslude(this.reportType);
    },
    reportType(val,oldval){
        this.nowPage=1;
      this.getwasteslude(val);
    }
    
  },
  methods:{
    onAreaCodeChange(e){
      this.orgId='';
      console.log(e,'areacode');
      this.areaCode=e;
       this.nowPage=1;
      this.getwasteslude(this.reportType,e);
    },
   onHospitalChange(e){
       this.orgId=e;
         this.nowPage=1;
       this.getwasteslude(this.reportType);
   },
   handleCurrentChange(e){
     this.nowPage=e;
     this.getwasteslude(this.reportType);
   },
      getwasteslude(reportType,areaCode=null){
        let url="/medicalwaste/v2/getReport";
        console.log(this.startDt,this.endDt);
        let data={
          startDt: formatDate(this.startDt, "yyyy-MM-dd")+' 00:00:00',
          endDt:formatDate(this.endDt, "yyyy-MM-dd")+' 23:59:59',
          id:'',
          reportType:reportType,
          pageNum:this.nowPage,
          pageSize:this.pageSize,
          orgId:this.orgId
        }
        if(areaCode){
          delete data.orgId;
          Object.assign(data,{},{areaCode:areaCode});
        }
        post(url, data).then(res => {
          console.log(res,'污水污泥报告查询');
          if(res.status=="1"){
              this.totalNumber=res.result.total?res.result.total:0;
             this.totalsize=res.result.pages*10;
             this.listData=_.map(res.result.list,item=>{
               let tempreportDate=item.reportDate.substring(0,11)
               return {
                    "reportDate":item.reportDate.substring(0,11),
                   "reportName":item.reportName,
                   "status":item.reportOrg,
                   "give":'查看',
                   "id":item.id,
                   "reportType":item.reportType,
                   "cleanDate":item.cleanDate
               }
             });
          }else{
            this.listData=[];
             this.totalsize=0;
          }
          
        });
      },
      readDetail(e){
        if(e.give!="查看"){
          return;
        }
        console.log(e,'e');
        e.reportType=='1'? this.$router.push({ name:"wasteWaterReportRead",params: {reportType: e.reportType,id:e.id,reportName:e.reportName,reportDate:e.reportDate}}):this.$router.push({ name:"sludgeReportRead",params: {cleanDate:e.cleanDate.substring(0,11),reportType: e.reportType,id:e.id,reportName:e.reportName,reportDate:e.reportDate,}});      
      },
  },
  mounted() {
       this.getwasteslude('');
        setTimeout(()=>{
          let getheight=this.$refs.getheight.offsetHeight;
          // let height=this.$refs.getheight.getElementsByTagName('th')[0].offsetHeight;
          this.height=getheight-50;
       
        },20);
  }
}
</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
  .contentHeader
     display:flex;
     align-items:center;
     flex:none;
     padding:5px 10px;
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
          padding:0.1rem 0;
          .el-pagination.is-background .el-pager li:not(.disabled).active
             background-color:#00C261; 
             color:white;   
</style>
