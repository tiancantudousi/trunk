<template>
      <div class="linechart">
           <div class="divfont" v-if="showul">
                 <div>{{title}}</div>
                 <ul>
                   <li>
                      <span class="circle" :class="{'totalWeight':totalWeight}"></span>
                      <span style="color:#F3333B">总重量</span>
                   </li>
                      <li>
                      <span class="circle" :class="{'infectWeight':infectWeight}"></span>
                      <span style="color:#009EF9">感染性</span>
                   </li>
                      <li>
                      <span class="circle" :class="{'injureWeight':injureWeight}"></span>
                      <span style="color:#FF710F">损伤性</span>
                   </li>
                      <li>
                      <span class="circle" :class="{'pathWeight':pathWeight}"></span>
                      <span style="color:#00C261">病理性</span>
                   </li>
                      <li>
                      <span class="circle" :class="{'medicineWeight':medicineWeight}"></span>
                      <span style="color:#A950FF">药物性</span>
                   </li>
                      <li>
                      <span class="circle" :class="{'chemistryWeight':chemistryWeight}"></span>
                      <span style="color:#FFD326">化学性</span>
                   </li>
                      <li>
                      <span class="circle" :class="{'others':others}"></span>
                      <span style="color:#FF434B">其它</span>
                   </li>
                 </ul>
           </div>  
           <div class="chart">
             <div ref="linecharts" v-if="showchart" class="linecharts"></div>
           </div>     

      </div>
</template>

<script>
var echarts = require("echarts");
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
import { clone } from "common/js/clone.js";

// import {mapMutations} from 'vuex';

export default {
  components: {},
  props:['pretype','show','title','showul'],
  data() {
    return {
      totalWeight: true,
      infectWeight: true,
      injureWeight: true,
      pathWeight: true,
      medicineWeight: true,
      chemistryWeight: true,
      others: true,
      showchart:false
    };
  },
  created() {},
  computed: {},
  watch: {
    pretype(val,oldval){
      console.log(val,'lineval');
      this.showchart=true;
      setTimeout(()=>{
         var linecharts = echarts.init(this.$refs.linecharts);
            linecharts.setOption(val);
            window.addEventListener("resize", function() {
              linecharts.resize();
            });
      },20)
        
    }
  },
  methods: {
 
  },
  mounted() {
 
  
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/varibale';

.linechart {
  height: 100%;
  display: flex;
  flex-direction: column;

  .divfont {
    padding: 0.1rem;
    display: flex;
    justify-content: space-between;
    padding-right: 0.4rem;
    padding-left: 0.4rem;

    ul {
      display: flex;

      li {
        display: flex;
        align-items: center;
        margin: 0 0.2rem;

        .circle {
          width: 0.2rem;
          height: 0.2rem;
          border-radius: 50%;
        }
      }
    }
  }

  .chart {
     flex: 1;
    .linecharts{
       height:100%;
    }
     
  }

  .infectWeight {
    background-color: #009EF9;
  }

  .injureWeight {
    background-color: #FF710F;
  }

  .pathWeight {
    background-color: #00C261;
  }

  .medicineWeight {
    background-color: #A950FF;
  }

  .chemistryWeight {
    background-color: #FFD326;
  }

  .others {
    background-color: #FF434B;
  }
}
</style>
