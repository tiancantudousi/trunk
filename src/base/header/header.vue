<template>
      <div class="header">
        <div class=header-left>
          <img src="./../../assets/normal-logo.png" class="img" alt="">
          <span ref="name">全省医疗废物智慧监管系统</span>
          <span style="padding-left:30px;">{{city}}</span>
            <!-- <el-select v-model="detailtype" placeholder="请选择" class="hospital leftSelect">
                          <el-option
                            v-for="item in options"
                            :key="item.code"
                            :label="item.city"
                            :value="item.code">
                          </el-option>
          </el-select> -->
        </div>
        <div class=header-right>
           <img src="./../../assets/i-quit.svg" class="img1" alt="" @click="loginOut()">
            <span class="split"></span>
           <img src="./../../assets/i-person-normal.png" class="img2" alt="">
            <span class="name">{{name}}</span>
        </div>
      </div>
</template>

<script>
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
import { clone } from "common/js/clone.js";
import { mapActions, mapGetters,mapMutations } from "vuex";
import Bus from 'common/js/bus';




export default {
  components:{},
  data () {
    return {
      detailtype:'',
      options:[],
      city:'杭州市',
      name:'123',
      bus:Bus
    }
  },
  created() {
    this.getprovince();
    // console.log(this.logindata,'this.logindata');
    this.name=this.logindata.loginName;
    this.getplace();
    // this.name='234';
    // let that=this;
    // this.bus.$on('loginname',(res)=>{
    //   console.log(this.name,res,'this.name');
    //   this.name=res;
    //   // setTimeout(()=>{that.name=res},1000)
    // })
  
  },
  computed:{
      ...mapGetters(['areacode','logindata']),
      //  loginname:function(){
      //    return this.name;
      //  }
  },
  watch:{
    detailtype(val,oldval){
         let item=_.find(this.options,{code:val});
         this.setProvince(item);
         console.log(item,'当前选定城市');
    }
       
  },
  methods:{
     getprovince(){
       // console.log(this.areacode,'this.areacode');
        let data = {
           areaCode:this.areacode
      };
      let url = "/medicalwaste/v1/getChinaNationByCode";
      post(url, data).then(res => {
        // console.log(res, "区域数据");
        this.options=res.result;
      });
    },
    getplace(){
      let data = {
           areaCode:this.areacode
      };
      let url = "/medicalwaste/v1/getChinaNationInfoByCode";
      post(url, data).then(res => {
        // console.log(res, "palce数据");
        this.city=res.result;
      });
    },
    loginOut() {
      window.location.href = 'http://zjswsjds.317hu.com/hospital-admin/admin-cms/login.html?tdsourcetag=s_pctim_aiomsg'
    },
    ...mapMutations({
      setProvince: 'set_province',
    })
    
  
           
     
  },
  mounted() {

  }
}
//  background-color :#00C261; 第一次背景色

</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
   .header
     background-color :#1E58C2;
     height:100%;
     display:flex;
    .header-left
   
      height:100%;
      flex:none;
      display:flex;
      align-items :center;
      padding:0 0.1rem;
      
      color:white;
      font-weight:bold;
      &>span
        font-size:0.2rem;
      .img
        width:0.2rem;
        height:0.2rem; 
        margin-right:0.2rem;
      .leftSelect
        .el-input__inner
           background-color:#1E58C2; 
           border:none;
           font-family: PingFangSC-Semibold;
           font-size: 16px;
           color:white;
           padding-right:0;
        .el-input__suffix
           right:-8px;    
    .header-right
      flex:1;
      display:flex;
      flex-direction:row-reverse;
      align-items:center;
      padding-right:0.2rem;
      .split
        height:100%;
        border-right:1px solid gray;
        margin:0 0.2rem;
      .img1,.img2
        height:0.35rem;
        width:0.35rem;
        color:black;
      .name
        margin-right:0.2rem;  
        color:white;
       
     
    
            

</style>
