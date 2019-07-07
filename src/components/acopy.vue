<template>
      <div class="">
   
      </div>
</template>

<script>
var echarts = require('echarts');
import {post} from 'api/homeHttp';
import {formatDate} from 'common/js/date';
import {clone} from 'common/js/clone.js';

// import {mapMutations} from 'vuex';

export default {
  components:{},
  data () {
    return {
       timestart:new Date(new Date().getTime()-7*24*60*60*1000),
       timesend:new Date(),

       options: [{
        value: '001',
        label: '浙江省第一医院'
      }, {
        value: '002',
        label: '浙江省第二医院'
      }, {
        value: '003',
        label: '浙江省第三医院'
      }, {
        value: '004',
        label: '浙江省第四医院'
      }, {
        value: '005',
        label: '浙江省第5医院'
      }],
    }
   
  },
  created() {
 
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
  .workcount
     height:100%
     display:flex;
     flex-direction :column;
     .work-header
        display:flex;
        height:0.7rem;
        flex:none;
        align-items :center;
       .timechose,.hospital
          width:2rem;
          margin:0 0.2rem;
     .work-main
        flex:1; 
        .chart
          height:50%;
          padding:0.2rem;
          padding-top:0; 
          .weightchart,.typechart
            width:100%;
            background-color:white;
            height:100%; 
          
                
      
            

</style>
