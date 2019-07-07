<template>
      <div class="totalcharts">
            <div class="total-header">
                <div>
                  <!-- <el-button-group v-activeClick="{'tag':'button','addclass':'active'}">
                            <el-button type="default">本月</el-button>
                            <el-button type="default">今年</el-button>
                            <el-button type="default">自定义时间</el-button>
                  </el-button-group> -->
                </div>
                <!-- <el-date-picker
                    v-model="timestart"
                    type="date"
                    placeholder="选择日期" class="timechose">
               </el-date-picker>
               <el-date-picker
                    v-model="timesend"
                    type="date"
                    placeholder="选择日期" class="timechose">
               </el-date-picker> -->
                <el-select v-model="totalType" placeholder="请选择" class="totalType">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
           </div>
           <div class="total-main">
              <div class="chart" v-if="charttotal">
                    <div class="totalchart" ref="totalchart"></div>
              </div>
           </div>
      </div>
</template>

<script>
var echarts = require('echarts');
import {mapActions,mapGetters} from 'vuex';
import {clone} from 'common/js/clone.js';


// import {mapMutations} from 'vuex';

export default {
  components:{},
  data () {
    return {
       timechose:new Date(),
       timestart:'',
       timesend:'',
       totalType:'',
       charttotal:false,
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
        label: '其它'
      }],
      totaloption:{
          color: ['#F43D45'],
          tooltip: {
            trigger: "axis"
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          xAxis : [
              {
                  type : 'category',
                  data : [],
                  axisTick: {
                      alignWithLabel: true
                  }
              }
          ],
          yAxis : [
              {
                  type : 'value',
                  splitLine :{
                    lineStyle:{
                        type:'dashed'
                    }
                  }
              }
          ],
          series : [
              {
                  name:'总重量',
                  type:'bar',
                  barWidth: '20px',//柱形图宽度
                  data:[],
                  itemStyle:{  //控制柱形图样式 头部椭圆
                      barBorderRadius:[10,10,0,0]
                  },
                  label: {//配置数值显示在柱形图上的位置和样式
                      normal: {
                      show: true,
                      position: 'top',
                      color:'black'
                  }
            },
              }
          ]
      },
     
        

    }
  },
  created() {
    let id=this.$route.params.id;
    this.totalType=id;
    this.buildsigle(id);
    console.log(id,'id'); 
  },
  computed:{
     ...mapGetters([
        'offiesList'
    ])
  },
  watch:{
    totalType(val,oldval){
      if(val=="totalWeight"){
         this.$router.push({path:'/home/offies'});
      }
      else{
         this.buildsigle(val);
      }
     
    }
  },
  methods:{
    buildsigle(id){
       let copyoffiesList=this.offiesList.slice();
       if(!copyoffiesList){
         this.$message({message: '数据为空',type: 'warning', center: true});
         return;
       }
       copyoffiesList=copyoffiesList.sort((a,b)=>{
         return b[id]-a[id];
       });
      //  let temptype=_.map(copyoffiesList,(item)=>{
      //        return item[id];
      //  });
          let totaloptioncopy=clone(this.totaloption);
          _.forEach(copyoffiesList,(item)=>{
             totaloptioncopy.xAxis[0].data.push(item.name);
             totaloptioncopy.series[0].data.push(item[id]); 
        })
        if(totaloptioncopy.series[0].data.length>10){
          totaloptioncopy.series[0].data=totaloptioncopy.series[0].data.slice(0,10);
        }
        totaloptioncopy.series[0].color=this.getcolor(this.totalType);
        console.log(totaloptioncopy,'totaloptioncopy');
        this.charttotal=true;
        setTimeout(()=>{
              var totalchart = echarts.init(this.$refs.totalchart);
              totalchart.setOption(totaloptioncopy);
               window.addEventListener("resize",function(){             
                     totalchart.resize();
              }); 
        },20)
  
    },
      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others FF434B totalWeight
    getcolor(val){
        switch(val){
          case 'infectWeight':return '#009EF9';
          case 'injureWeight':return '#FF710F';
          case 'pathWeight':return '#00C261';
          case 'medicineWeight':return '#A950FF';
          case 'chemistryWeight':return '#FFD326';
          case 'others':return '#FF434B';
        }
    }
    
  
           
     
  },
  mounted() {
  //  var totalchart = echarts.init(this.$refs.totalchart);
  //  totalchart.setOption(this.totaloption,window.onresize = totalchart.resize);
  //  var typechart = echarts.init(this.$refs.typechart);
  //  typechart.setOption(this.typeoption);
  //   window.onresize = typechart.resize;
     

  }
}
</script>

<style lang="stylus" scoped>
 @import "~common/stylus/varibale"
  .totalcharts
     height:100%
     display:flex;
     flex-direction :column;
     padding:0.2rem;
     .total-header
        display:flex;
        height:0.7rem;
        flex:none;
        justify-content :space-between;
        align-items :center;
        .active 
          background-color:#00C261
          color:white;
       .totalType
          width:1.5rem;
          margin:0 0.2rem;
     .total-main
        flex:1; 
        .chart
          padding-top:0.2rem;
          height:100%;
          .totalchart
            height:100%;
            background-color:white;

     
          
                
      
            

</style>
