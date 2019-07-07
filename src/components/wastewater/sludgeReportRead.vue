<template>
	<div class="container">
		<div class="content">
            <div class="content-title">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><a onClick='javascript :history.back(-1)'>返回</a></el-breadcrumb-item>
                    <el-breadcrumb-item>污泥处置上报</el-breadcrumb-item>
                </el-breadcrumb>
            </div> 
	
            
            <div style="padding-top:10px;">
                <label>报告名称</label>
                <span style="font-weight:bold;">{{reportName}}</span>
                <!-- <el-input v-model="reportName" placeholder="请输入" size="small" clearable style="width:200px;"></el-input> -->

                <label style="margin-left:15px;">上报日期</label>
                  <span style="font-weight:bold;">{{reportDate}}</span>
                   <label style="margin-left:15px;">清淘日期</label>
                  <span style="font-weight:bold;">{{cleanDate}}</span>
                <!-- <el-date-picker v-model="reportDate" type="date" size="small" value-format="yyyy-MM-dd" placeholder="选择日期" :editable=false style='width:200px;'></el-date-picker> -->
            </div>
			<!--表格-->
            <table class="table table-bordered table-hover" style="margin-top:20px;">
               <thead>
                    <th>序号</th>
                    <th>控制项目</th>
                    <th>监测结果</th>
                    <th>是否合格</th>
                </thead>
                <tbody>
                    <tr v-for="item in tableData">
                   
                      <td width='65'>{{item.serialNum}}</td>
                        <td>{{item.item}}</td>
                        <td>{{item.monitorResult}}</td>
                        <td>
                          <span>{{item.qualifiedResult==1?'合格':'不合格'}}</span>
                           <!-- <el-radio-group disabled="true" v-model="item.qualifiedResult" @change="checkResult()">
                                <el-radio :label="1">合格</el-radio>
                                <el-radio :label="2">不合格</el-radio>
                          </el-radio-group> -->
                        </td>
                    </tr>
                    <!-- <tr>
                        <td width='65'>1</td>
                        <td>粪大肠菌群数（MPN/g）</td>
                        <td></td>
                        <td> <el-radio-group v-model="result1" @change="checkResult()">
                                <el-radio :label="1">合格</el-radio>
                                <el-radio :label="2">不合格</el-radio>
                            </el-radio-group></td>
                    </tr>
                    <tr>
                        <td width='65'>2</td>
                        <td>肠道致病菌</td>
                        <td></td>
                        <td> <el-radio-group v-model="result2" @change="checkResult()">
                                <el-radio :label="1">合格</el-radio>
                                <el-radio :label="2">不合格</el-radio>
                            </el-radio-group></td>
                    </tr>
                    <tr>
                        <td width='65'>3</td>
                        <td>肠道病毒</td>
                        <td></td>
                        <td> <el-radio-group v-model="result3" @change="checkResult()">
                                <el-radio :label="1">合格</el-radio>
                                <el-radio :label="2">不合格</el-radio>
                            </el-radio-group></td>
                    </tr>
                    <tr>
                        <td width='65'>4</td>
                        <td>结核杆菌</td>
                        <td></td>
                        <td> <el-radio-group v-model="result4" @change="checkResult()">
                                <el-radio :label="1">合格</el-radio>
                                <el-radio :label="2">不合格</el-radio>
                            </el-radio-group></td>
                    </tr>
                    <tr>
                        <td width='65'>5</td>
                        <td>蛔虫卵死亡率（%）</td>
                        <td></td>
                        <td> <el-radio-group v-model="result5" @change="checkResult()">
                                <el-radio :label="1">合格</el-radio>
                                <el-radio :label="2">不合格</el-radio>
                            </el-radio-group></td>
                    </tr> -->
                </tbody>
            </table>

            <!-- <el-row style="margin-top:30px;">
               
                <el-col :span='12'>
                    <div style="text-align:right;">
                        <el-button type="primary" @click="report()">上报</el-button>
                    </div>
                </el-col>
            </el-row> -->
		</div>
		
	</div>
</template>

<script>
import { post } from "api/homeHttp";
	export default {
		data() {
			return {
                id:this.$route.query.id,
                reportType:2,
                reportName:'',//报告名称
                reportDate:'',//报告日期
                cleanDate:'',
                freq:'',//频次 1一天一次 2一周两天
                totalResult:2,//报告结果   1合格   2不合格
                reportStatus:'',//报告状态   1未上报   2已上报
                userName:localStorage.getItem("wasteUserName"),
                orgId:localStorage.getItem("orgId"),
                result1:'',
                 result2:'',
                  result3:'',
                   result4:'',
                    result5:'',
                tableData:[{

                }]
			}
		},
		methods: {
            //监测是否合格
            checkResult(){
                if(this.result1==1&&this.result2==1&&this.result3==1&&this.result4==1&&this.result5==1){
                    this.totalResult = 1
                }else{
                    this.totalResult = 2
                }
            },
            getTableData(data){
             let url="/medicalwaste/v2/getReportDetail";
             let parmas={
                 reportType:data.reportType,
                 id:data.id
             }
             post(url,parmas).then(res=>{
               if(res.status=="1"){
                 this.tableData=res.result;
               }
                 console.log(res,'污泥报告数据');
             })
           }
		},
		created() {
        this.reportDate=this.$route.params.reportDate;
        this.reportName=this.$route.params.reportName;
        this.cleanDate=this.$route.params.cleanDate;
        this.getTableData(this.$route.params);
       console.log(this.$route.params,'ceshi');
		}
	}
</script>

<style lang='stylus' scoped>
	.content {

    padding: 15px;
		.search-box {
			float: right;
		}
		.table-box {
			margin-top: 20px;
		}
		.page {
			text-align: center;
			margin-top: 15px;
		}
	}
	
	.alert-box {
		padding: 20px;
    }
    
    
    .table-bordered {
        border: 1px solid #dee2e6;
    }
    .table {
        width: 100%;
        background-color: transparent;
    }
    table {
        border-collapse: collapse;
    }
    .table-bordered thead th, .table-bordered thead td {
        border-bottom-width: 2px;
    }
    .table thead th {
        vertical-align: bottom;
        border-bottom: 2px solid #dee2e6;
    }
    .table-bordered th, .table-bordered td {
        border: 1px solid #dee2e6;
    }
    .table th, .table td {
        padding: 12px;
    }
    th {
        text-align: inherit;
    }
    .table-hover tbody tr:hover {
        background-color: rgba(0, 0, 0, 0.075);
    }
    .table-bordered th, .table-bordered td {
        border: 1px solid #dee2e6;
    }
    .table th, .table td {
        padding: 12px;
        vertical-align: top;
    }
</style>