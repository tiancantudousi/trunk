<template>
	<div class="container" style="height: 1px">
		<div class="content">
            <div class="content-title" style="height:30px;">
                <!--污水处置上报 -->
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><a onClick='javascript :history.back(-1)'>返回</a></el-breadcrumb-item>
                    <el-breadcrumb-item>污水处置查看</el-breadcrumb-item>
                </el-breadcrumb>
            </div> 
			<!--顶部-->      
            <el-row>
                <label>报告名称</label>
                <span style="font-weight:bold;">{{reportName}}</span>
                <!-- <el-input v-model="reportName" placeholder="请输入" size="small" clearable style="width:200px;"></el-input> -->
                <label style="margin-left:15px;">上报日期</label>
                <span style="font-weight:bold;">{{reportDate}}</span>
                <!-- <el-date-picker v-model="reportDate" type="date" size="small" value-format="yyyy-MM-dd" placeholder="选择日期" :editable=false style='width:200px;'></el-date-picker> -->
            </el-row>
			<!--表格-->
            <table class="table table-bordered table-hover" style="margin-top:20px;">
                <thead>
                    <th>序号</th>
                    <th>控制项目</th>
                    <th>监测次数</th>
                    <th>合格次数</th>
                </thead>
                <tbody>
                    <tr v-for="item in tableData">
                        <td width='65'>{{item.serialNum}}</td>
                        <td>{{item.item}}</td>
                        <td>{{item.monitorNum}}</td>
                        <td>{{item.qualifiedNum}}</td>
                    </tr>
                </tbody>
            </table>

       
		</div>
		
	</div>
</template>

<script>
import { post } from "api/homeHttp";
	export default {
		data() {
          return {
                    tableData:[],
                    id:this.$route.params.id,
                    reportType:this.$route.params.reportType,
                    reportName:'',//报告名称
                    reportDate:'',//报告日期
                    freq:'',//频次 1一天一次 2一周两天
                    result1:'',
                    result2:'',
                    result3:'',
                    result4:'',
                    result5:'',
                    totalResult:2,//报告结果   1合格   2不合格
                    reportStatus:'',//报告状态   1未上报   2已上报
                    userName:localStorage.getItem("wasteUserName"),
                    orgId:localStorage.getItem("orgId")
          }
        },
		methods: {
            //获取报告信息
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
                 console.log(res,'污水报告数据');
             })
           }
		},
		created() {
        console.log(this.$route.params);
        this.reportDate=this.$route.params.reportDate;
        this.reportName=this.$route.params.reportName;
        // reportName:e.reportName,reportDate:e.reportDate
        this.getTableData(this.$route.params);
		}
	}
</script>

<style lang='stylus' scoped>
	.content {
        height: calc(100vh - 56px);
        overflow-y: scroll;
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