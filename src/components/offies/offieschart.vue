<template>
      <div class="offieschart">
          <div class="top">
                <div class="topleft">
                  <div style="font-size:0.2rem;">{{percent.name}}</div>
                  <div>
                     <span>总重量</span>
                     <span style="color:red;">{{percent.totalWeight}}</span>
                  </div>
                </div>
                 <div class="topright">
                   <img :src="showimg" alt="" class="imgthis">
                 </div>
          </div>
          <div class="chart">
                 <ul class="percent-list">
                        <li v-for="(item,index) in percent.percentList" :key="index">
                            <label class="city-name" >{{item.name}}</label>
                            <span class="value">{{item.value}}</span>
                            <div class="percent-bg" ><div class="percent" :style="item.style"></div></div>
                        </li>                   
                 </ul>
          </div>
      </div>
</template>

<script>
var echarts = require('echarts');


// import {mapMutations} from 'vuex';

export default {
  components:{},
  props:['percent','img'],
  data () {
    return {
        showimg:'',
        showimg1:require('./../../assets/11-1.png'),
        showimg2:require('./../../assets/11-2.png')
    }
  },
  created() {
    if(this.img=='1'){
       this.showimg=this.showimg1;
        //  this.showimg='./../../assets/11-1.png';
    }else{
        this.showimg=this.showimg2;
    }
     
  },
  computed:{
     
  },
  watch:{

  },
  methods:{        
     
  },
  mounted() {

  }
}
</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
    .offieschart
       height:100%;
       padding:0.2rem;
       display:flex;
       flex-direction :column;
       .top
         height:0.6rem;
         display:flex;
         flex:none;
         justify-content :space-between;
         .topleft
           display:flex;
           flex-direction :column;
           justify-content :space-between;
         .imgthis
           height:100%;  
       .chart
          flex:1;
         .percent-list
           height:100%;
           display:flex;
           flex-direction :column;
           justify-content :space-between; 
           li
            display:flex;  
            align-items :center;
            .value
                padding:0 0.2rem;
            .percent-bg
                border-radius:2rem;
                height:0.05rem;
                background: rgba(0, 0, 0, 0.1);
                flex:1;
                .percent 
                  height: 100%;
                  background: #A56DFF;
                  border-radius:2rem;
           li:last-child
             .city-name
               margin-right:0.15rem;        
                   
                 
                   
      
           
          
                
      
            

</style>
