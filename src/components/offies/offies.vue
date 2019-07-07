<template>
      <div class="offiescount">
            <div class="offies-header">
               <div>
                  <el-button-group v-activeClick="{'tag':'button','addclass':'active'}">
                            <el-button type="default" @click="monthsearch">本月</el-button>
                            <el-button type="default" @click="yearsearch">今年</el-button>
                            <el-button type="default" @click="toggletime">自定义时间</el-button>
                  </el-button-group>
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
                
                <el-select v-model="offiestype" placeholder="请选择" class="hospital">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
           </div>
           <div class="offies-main">
                <div class="offies-first" v-if="firsthospital.name">
                    <div class="which">
                        <div> <img src="./../../assets/justuse.png" alt=""></div>
                        <div class="fonts">{{firsthospital.name}}</div>
                        <div class="fontstyle">{{firsthospital.totalWeight}}</div>
                        <div>
                           <img src="./../../assets/1-1.png" alt="">
                          <span></span>
                        </div>
                    </div>
                    <ul>
                      <li>
                         <span class="limargin">{{firsthospital.infectWeight}}</span>
                         <div class="limargin"> 
                           <img src="./../../assets/1-2.png" alt="">
                           <span>感染性</span> 
                         </div>
                      </li>
                       <li>
                         <span class="limargin">{{firsthospital.injureWeight}}</span>
                         <div class="limargin"> 
                           <img src="./../../assets/1-3.png" alt="">
                           <span>损伤性</span> 
                         </div>
                      </li>
                       <li>
                         <span class="limargin">{{firsthospital.pathWeight}}</span>
                         <div class="limargin"> 
                           <img src="./../../assets/1-4.png" alt="">
                           <span>病理性</span> 
                         </div>
                      </li>
                       <li>
                         <span class="limargin">{{firsthospital.medicineWeight}}</span>
                         <div class="limargin"> 
                           <img src="./../../assets/1-5.png" alt="">
                           <span>药物性</span> 
                         </div>
                      </li>
                       <li>
                         <span class="limargin">{{firsthospital.chemistryWeight}}</span>
                         <div class="limargin"> 
                           <img src="./../../assets/1-6.png" alt="">
                           <span>化学性</span> 
                         </div>
                      </li>
                       <li>
                         <span class="limargin">{{firsthospital.others}}</span>
                         <div class="limargin"> 
                           <img src="./../../assets/1-3.png" alt="">
                           <span>其它</span> 
                         </div>
                      </li>
                    </ul>
                    <div class="totalchart">
                          <div ref="totalchart" v-if="chartttotal"></div>
                    </div>
                </div> 
                <div class="offies-second">
                     <div class="centerleft">
                        <offieschartCom :percent="optionsecond" :img="'1'" v-if="optionsecond"></offieschartCom>
                     </div>
                      <div class="centerright">
                         <offieschartCom :percent="optionthreed" :img="'2'" v-if="optionthreed"></offieschartCom>
                      </div>
                </div>
                <div class="offies-threed">
                   <div>
                      <el-table
                            :data="tableData"
                            height="200">
                            <el-table-column
                              prop="label"
                              label="序号"
                              width="180">
                            </el-table-column>
                            <el-table-column
                              prop="hospital"
                              label="医院名称"
                              width="180">
                            </el-table-column>
                            <el-table-column
                              prop="weight"
                              label="总重量">
                            </el-table-column>
                            <el-table-column
                              prop="polute"
                              label="感染性">
                            </el-table-column>
                            <el-table-column
                              prop="broke"
                              label="损伤性">
                            </el-table-column>
                            <el-table-column
                              prop="silck"
                              label="病理性">
                            </el-table-column>
                            <el-table-column
                              prop="drag"
                              label="药物性">
                            </el-table-column>
                            <el-table-column
                              prop="chemistry"
                              label="化学性">
                            </el-table-column>
                             <el-table-column
                              prop="others"
                              label="其它">
                            </el-table-column>
                      </el-table>
                   </div>
                   <div>
                       <el-pagination
                          v-if = "offiestype"
                          background
                          layout="prev, pager, next"
                          :current-page="pageNum"
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
      </div>
</template>

<script>
var echarts = require('echarts');
import {post} from 'api/homeHttp';
import {formatDate} from 'common/js/date';
import {clone} from 'common/js/clone.js';
import offieschartCom from './offieschart';
import {mapActions,mapGetters} from 'vuex';
var _ = require('lodash')

// import {mapMutations} from 'vuex';

export default {
  components:{offieschartCom},
  data () {
    return {
       timestart:new Date(new Date().getTime()-7*24*60*60*1000),
       timesend:new Date(),
       offiestype:'',
       chartweight:false,
       charttype:false,
       optionsecond:'',
       optionthreed:'',
       showtime:false,
       pageNum:1,
       totalsize:10,
       nowindex:1,
       pageSize:'10',
       _offiesList:'',
       chartttotal:false,
        // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
       options: [{
        value: 'totalWeight',
        label: '总重量'
      }, {
        value: 'infectWeight',
        label: '感染性'
      }, {
        value: 'injureWeight',
        label: '损伤性'
      }, {
        value: 'pathWeight',
        label: '病理性'
      }, {
        value: 'medicineWeight',
        label: '药物性'
      },
      {
        value: 'chemistryWeight',
        label: '化学性'
      },
      {
        value: 'others',
        label: '其它 '
      }],
       optiontotal:{
            // legend: {
            //     orient: 'vertical',
            //     right: '5%',
            //     top:'5%',
            //     data: ['公共场所','饮用水','学校','医疗','放射','职业','其他'],
            //     itemWidth: 10,
            //     itemHeight: 10,
            //     itemBorderRadius: 0,
            //     icon:'square',
            //     textStyle:{
            //         color:'#fff',
            //         fontSize:'14'
            //     },
            //     //selectedMode: false,
            // },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            color: [],
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius: ['50%', '80%'],
                    center: ['50%', '50%'],
                    // avoidLabelOverlap: false,
                    data:[
                       
                    ],
                    // label: {
                    //     normal: {
                    //         show: false,
                    //         position: 'center',
                    //         textStyle:{
                    //             backgroundColor: 'rgba(0,28,60,.94)',
                    //             borderRadius: 2,
                    //             padding:[5 ,5]
                    //         }
                    //     },
                    //     emphasis: {
                    //         show:true,
                    //         formatter: "{d}%",
                    //         textStyle: {
                    //             fontSize: '16',
                    //             fontWeight: 'bold',
                    //         }
                    //     }
                    // },     
                    // clockwise:false,
                }
            ]
        },
        tableData:[
        ],
        firsthospital: {}
    }
  },
  created() {
    this.offiestype=this.options[0].value;//下拉选择框默认选择第一个
    this.publicget();
 
  },
  computed:{
    ...mapGetters([
        'offiesList',
        'singlelist',
        'offiesize',
        'areacode'
    ])
  },
  watch:{
     nowindex(val,oldval){
      console.log(val,'nowindex');
      this.pageNum=val;
      this.publicget();
      
     },
      offiesize(val,oldval){
        this.totalsize=Number(val)*10;
      },
     timestart(val,oldval){
        this.nowindex = 1
        this.publicget();
     },
     timesend(val,oldval){
        this.nowindex = 1
     
        this.publicget();
     },
     offiestype(val,oldval){
       if(val==oldval){
         return;
       }
       if(val!='totalWeight'){
           this.$router.push({path:`/home/total-charts/${val}`})
       }
       
        //  this.publicget();
     },
     offiesList(val,oldval){
        let _offiesList=clone(val);
        if (this.nowindex === 1) {
          console.log('###1')
            this._offiesList=clone(val);
             let firsthospital=this._offiesList[0];
            this.firsthospital = this._offiesList[0] ? this._offiesList[0] : {}
             console.log('###2')
             console.log(firsthospital)
            if(!firsthospital){
              this.$message({message: '数据为空',type: 'warning', center: true});
              //清空页面数据
            } else {
              this._offiesList=this._offiesList.sort((a,b)=>{
                return b.totalWeight-a.totalWeight;
              });
            }
             console.log('###3')
            this.buildtotal(firsthospital);
             console.log('###4')
            console.log(!this.firsthospital.name || this._offiesList.length === 1)
            if(!this.firsthospital.name || this._offiesList.length === 1){
            
              this.optionsecond = null
              this.optionthreed = null
              // alert('数据缺失');
          }else{
            let tempsecond=this._offiesList[1];
            this.optionsecond=this.buildpercent(tempsecond);
            if(this._offiesList[2]){
                let tempthreed=this._offiesList[2];
                this.optionthreed=this.buildpercent(tempthreed);
            } else {
               this.optionthreed = null
            }
            
          }
        }
       
       //列表
       let temptable=[];
       _.forEach(_offiesList,(item,index)=>{
          // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
          let obj= {label:(this.pageNum - 1) * this.pageSize + index+1, hospital:item.name, weight:item.totalWeight, polute:item.infectWeight, broke:item.injureWeight, silck:item.pathWeight, drag:item.medicineWeight, chemistry:item.chemistryWeight,others:item.others}
          temptable.push(obj);
       });
       this.tableData=temptable;
     }
     
  },
  methods:{
     handleCurrentChange(val){
       this.nowindex=val;
     },
     toggletime(){
       this.showtime=!this.showtime;
     }, 
    monthsearch(){
       let month=formatDate(new Date(),'MM');
       let year=formatDate(new Date(),'yyyy');
       let firstday = new Date(year,month,1);        //取当年当月中的第一天  
       let lastday = (new Date(firstday.getTime()-1000*60*60*24)).getDate();
       this.nowindex = 1
       let data={startDt:`${year}-${month}-01 00:00:00`,endDt:`${year}-${month}-${lastday} 23:59:59`,areaCode:this.areacode,orgId:'',pageNum:this.pageNum,pageSize:this.pageSize};
        this.timestart=this.storepostTime(`${year}-${month}-01 00:00:00`); //触发两次http请求
        this.timesend=this.storepostTime(`${year}-${month}-${lastday} 23:59:59`);//触发两次http请求
      //  setTimeout(() => {
      //    this.fetchOffies(data); 
      //  }, 500);
    },
    yearsearch(){
       let year=formatDate(new Date(),'yyyy');
       let firstday = new Date(year,12,1);        //取当年当月中的第一天  
       let lastday = (new Date(firstday.getTime()-1000*60*60*24)).getDate();
       this.nowindex = 1;
       let data={startDt:`${year}-01-01 00:00:00`,endDt:`${year}-12-${lastday} 23:59:59`,orgId:'',areaCode:this.areacode,pageNum:this.pageNum,pageSize:this.pageSize};
      this.timestart=this.storepostTime(`${year}-01-01 00:00:00`);//触发两次http请求
      this.timesend=this.storepostTime(`${year}-12-${lastday} 23:59:59`);//触发两次http请求
      //  this.fetchOffies(data);
      //  setTimeout(() => {
      //    this.fetchOffies(data); 
      //  }, 500);
    },
    storepostTime(time){
     //starttime ='2012-12-25 20:17:24';
      let  tempTime = time.replace(new RegExp("-","gm"),"/");
      return new Date(tempTime); //得到毫秒数
//       let endtime=end.replace(new RegExp("-","gm"),"/");
//       this.timesend = new Date(end); //得到毫秒数
    },
    publicget:_.throttle(function(){
      let data={startDt:formatDate(this.timestart,'yyyy-MM-dd')+' 00:00:00',endDt:formatDate(this.timesend,'yyyy-MM-dd')+' 23:59:59',areaCode:this.areacode,orgId:'',pageNum:this.pageNum,pageSize:this.pageSize,type:'offies'};
      this.fetchOffies(data);
    },500, { 'trailing': false }),
    buildtotal(hospital){
        let optiontotalcopy=clone(this.optiontotal);
        if (hospital) {
          // weightoptioncopy.xAxis[0].data.push(item.name);
          optiontotalcopy.series[0].data.push({value:hospital.infectWeight,name:'感染性'});
          optiontotalcopy.series[0].data.push({value:hospital.injureWeight,name:'损伤性'});
          optiontotalcopy.series[0].data.push({value:hospital.pathWeight,name:'病理性'});
          optiontotalcopy.series[0].data.push({value:hospital.medicineWeight,name:'药物性'});
          optiontotalcopy.series[0].data.push({value:hospital.chemistryWeight,name:'化学性'});
          optiontotalcopy.series[0].data.push({value:hospital.others,name:'其它'});
          let color=['#009EF9','#FF710F','#00C261','#A950FF','#FFD326','#FF434B'];
          optiontotalcopy.color=color;
          this.chartttotal=true;
          console.log(optiontotalcopy,this.optiontotal,'optiontotalcopy');
          setTimeout(()=>{
                var totalchart = echarts.init(this.$refs.totalchart);
                totalchart.setOption(optiontotalcopy);
                window.addEventListener("resize",function(){             
                      totalchart.resize();
                }); 
          },20)
        }
    },
    buildpercent(tempsecond){


       console.log(tempsecond,'tempsecond');
       let list=[
          {name:'感染性',value:tempsecond.infectWeight,style:{width:`${tempsecond.infectWeight/tempsecond.totalWeight*100}%`}},
          {name:'损伤性',value:tempsecond.injureWeight,style:{width:`${tempsecond.injureWeight/tempsecond.totalWeight*100}%`}},
          {name:'病理性',value:tempsecond.pathWeight,style:{width:`${tempsecond.pathWeight/tempsecond.totalWeight*100}%`}},
          {name:'药物性',value:tempsecond.medicineWeight,style:{width:`${tempsecond.medicineWeight/tempsecond.totalWeight*100}%`}},
          {name:'化学性',value:tempsecond.chemistryWeight,style:{width:`${tempsecond.chemistryWeight/tempsecond.totalWeight*100}%`}},
          {name:'其它  ',value:tempsecond.others,style:{width:`${tempsecond.others/tempsecond.totalWeight*100}%`}},
       ]
       tempsecond.percentList=list;
        // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
      return tempsecond;
    },

     ...mapActions(['fetchOffies'])        
  },
  mounted() {
    //  var totalchart = echarts.init(this.$refs.totalchart);
    //    totalchart.setOption(this.optiontotal);

  }
}
</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
  .offiescount
     height:100%
     display:flex;
     flex-direction :column;
     .offies-header
        display:flex;
        height:0.7rem;
        flex:none;
        justify-content :space-between;
        padding:0 0.2rem;
        align-items :center;
       .timechose,.hospital
          width:2rem;
          margin:0 0.2rem;
     .offies-main
        flex:1;
        flex-direction:column;
        display:flex;
        .offies-first
          display:flex;
          flex:none;
          height:20%
          margin:0 0.2rem;
          background-color:white;
          .which
            width:25%;
            padding-left:0.6rem;
            border-right:1px dashed gray;
            .fonts,.fontstyle
              font-size:0.2rem;
              margin:0.1rem 0;
            .fontstyle
              color:red;
          ul
            width:50%;
            display:flex;
            flex-wrap:wrap;
            li
              display:flex;
              flex-direction :column;
              align-items :center;
              justify-content :center;
              width:33.3%;
              height:50%;
              .limargin
                margin:0.08rem;
              .limargin:first-child
                font-size:0.2rem;
              .limargin:last-child  
                display:flex;
                align-items :center;  

          .totalchart
            width:25%;
            height:100%; 
            div
              width:100%;
              height:100%; 
        .offies-second
          flex:1;
          display:flex;
          padding:0.2rem;
          .centerleft,.centerright
             width:50%;
             height:100%;
             background-color :white;
          .centerleft
             margin-right:0.2rem; 
          .centerright
             margin-left:0.2rem;    
        .offies-threed 
          flex:none;
          height:37.5%
          
                
      
            

</style>
