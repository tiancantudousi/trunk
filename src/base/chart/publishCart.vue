<template>
       <div class="chartpublish">
                   <div class="index-h2">
                              <span>{{title}}</span>
                              <div class="am-btn-rdo" v-activeClick="{'tag':'button','addclass':'el-button--primary'}">
                                  <el-button-group>
                                    <el-button  size="small" @click="emitType('calling')">按行业</el-button>
                                    <el-button type="primary" size="small" @click="emitType('area')">按地域</el-button>
                                  </el-button-group>
                              </div>
                   </div>
                   <div class="echartPublish" style="width: 100%; height: 100%" ref="echartPublish"></div>
         </div>
</template>
<script>
var echarts = require('echarts');
import Bus from 'common/js/bus';
export default {
  props:[ 'chartoption','title']
   
  ,
  data () {
    return {
       optionWork:null,
       dataType:'area'
    }
  },
  computed:{
      
  },
  watch:{
    chartoption(val,oldval){
       let ChartPublish = echarts.init(this.$refs.echartPublish); 
        ChartPublish.setOption(val                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        );
    }
  },
  created () {
     
  },
  methods:{
    emitType(type){
      if(type!=this.dataType){
        this.dataType=type; 
        let item={title:this.title,type:type}
        // Bus.$emit('changeType',item);
      }
     
    }
  },
  mounted(){
       console.log(this.chartoption);
       let ChartPublish = echarts.init(this.$refs.echartPublish); 
        ChartPublish.setOption(this.chartoption);
  }
}
</script>
<style lang="stylus" scoped>
 .chartpublish{
         width:100%
         height:100%;
         display:flex;
         flex-direction :column;
         box-sizing :border-box;
         padding:0 1rem;
         .index-h2{
           height:2rem;
           display:flex;
           justify-content :space-between;
           align-items :center;
           &>span{
             font-size:1.2rem;
             color:white;
             margin-right:1rem;
           }
           &>div{
             margin-right:1rem;
           }
           
         }
         .echartPublish{
           flex:1;
         }
  }
</style>


