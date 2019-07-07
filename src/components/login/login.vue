<template>
      <div class="login" v-loading="loading">
   
      </div>
</template>

<script>
var echarts = require('echarts');
import {post} from 'api/homeHttp';
import {formatDate} from 'common/js/date';
import {clone} from 'common/js/clone.js';
import Bus from 'common/js/bus';
import {mapMutations} from 'vuex';
import storage from 'common/js/storage.js'

export default {
  components:{},
  data () {
    return {
      loading:true,
      bus:Bus,
      token:'THRID_USER_ID_PREFIX_' +this.$route.query.token,
      }
      
   
  },
  created() {
       console.log('login compontent');
       sessionStorage.setItem("token",this.token)
       this.login();
  },
  computed:{
     
  },
  watch:{

  },
  methods:{
      login(){
      let url="/medicalwaste/v1/user/doLogin";
      let data={};
      post(url,data).then((res)=>{
        // this.bus.$emit('loginname',res.result.loginName);
        console.log(res,'res');
        storage.setSession('logindata',res.result);
        storage.setSession('areacode',res.result.addrCode.substr(0,6));
        storage.setSession('username',res.result.loginname);
        this.setLogindata(res.result);
        this.setProvince(res.result.addrCode.substr(0,6));
        if(res.status=='1'){
           this.$router.push({path:'/home/main1'});
        }
        else{
          window.history.go(-1);
        }
         
      })
      },
     ...mapMutations({
        setProvince: 'set_areacode',
        setLogindata:'set_logindata'
    }) 
     
  },
  mounted() {
 
  }
}
</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
  .login
     height:100%
    
            

</style>
