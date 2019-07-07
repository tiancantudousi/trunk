<template>
 
           <div class="detail-header">
                <el-select 
                    v-model="city" 
                    placeholder="请选择市" 
                    class="hospital"
                    v-if="level === 1">
                    <el-option
                      v-for="item in cityList"
                      :key="item.id" :label="item.city" :value="item.code"
                     >
                    </el-option>
                </el-select>
                 <el-select v-model="country" placeholder="请选择区/县" 
                    class="hospital" v-if="level === 2 || level === 1">
                    <el-option
                      v-for="item in countryList"
                      :key="item.id" :label="item.city" :value="item.code">
                    </el-option>
                </el-select>
                <el-select v-model="hospital" placeholder="请选择医院" class="hospital">
                    <el-option
                      v-for="item in options"
                      :key="item.hospitalCode" :label="item.hospitalName" :value="item.hospitalCode">
                    </el-option>
                </el-select>
           </div>
</template>

<script>
import {post} from 'api/homeHttp';
import { mapActions, mapGetters,mapMutations } from "vuex";
import { getChinaNationByCode } from '../../api/home.js'

export default {

  data () {
    return {
       hospital:'',
       options: [],
       city: '',
       cityList: [],
       country: '',
       countryList: [],
       areaCode: '',
       level: ''
    }
  },
  created() {
    this.areaCode = this.areacode
    if (this.areaCode) {
        this.level = this.logindata.level
        if (this.level === 1) { // 表示省
          this.getChinaNationByCode()
        } else if(this.level === 2) { // 表示市
          this.getChinaNationByCode(false)
        }
      this.gethospital(true);
    }
  },
  computed:{
    ...mapGetters([
      'areacode' ,'logindata', 'hospitalId'
    ])
  
  },
  watch:{
    // hospitalId(val,oldval){
    //   console.log(val,'测试');
    //   if(!val){
    //     return;
    //   }
    //   this.hospital=val;
    //   // this.options.forEach(item => {
    //   //   if(item.hospitalCode === val) {
    //   //     this.setHospital({
    //   //       id: item.hospitalCode,
    //   //       name: item.hospitalName
    //   //     })
    //   //   }
    //   // });
    // },
 
    hospital(val,oldval){
      console.log(val,'选择医院');
      if(val){
        this.options.forEach(item => {
          if(item.hospitalCode === val) {
            this.setHospital({
              id: item.hospitalCode,
              name: item.hospitalName
            })
          }
        });
        this.$emit('hospitalChange',val);
      }  
    },

    city(val, oldval) {
      if(val){
        this.hospital='';
        console.log(val)
        if (val === this.areaCode) return
        this.areaCode = val;
        this.$emit('areaCodeChange',val);
        this.gethospital();
        if (val === '330000') {
          this.country = ''
          this.countryList = [{
            city: '全部'
          }]
        } else {
          this.getChinaNationByCode(false)
        } 
      }  
    },
    country (val, oldval) {
      if(val) {
         this.hospital='';
         console.log(val)
        if (val === this.areaCode || val === '全部') return
        this.areaCode = val;
        this.$emit('areaCodeChange',val);
        this.gethospital();
      }
    }
  },
  methods:{

    getChinaNationByCode (isCity = true) {
      const data = {
          areaCode: this.areaCode
      }
      getChinaNationByCode(data).then(res => {
        if (res['status'] === '1') {
            if (res['result']) {
                if (isCity) {
                    if (this.areacode === '330000') {
                        this.city = ''
                        res['result'].unshift({
                            city: '全部',
                            code: '330000'
                        })
                        this.country = ''
                        this.countryList =  [{  
                            city: '全部'
                        }]
                    } else {
                      this.city = res['result'][0].city
                    }
                    this.cityList = res['result']
                } else {
                    this.country = ''
                    res['result'].unshift({
                        code: this.areaCode,
                        city: '全部',
                    })
                    this.countryList = res['result']
                }
            }              
        } else {
        }
      })
    },
    gethospital(isFirst = false){
      let data = {
       areaCode: this.areaCode
      };
      let url = "/medicalwaste/v1/getHospitalByCode";
      post(url, data).then(res => {
        console.log(res, "医院数据");
          this.options=res.result;
          if (isFirst) {
            if (this.hospitalId) {
                this.hospital = this.hospitalId
            } else {

              //默认选定第一项
              if(this.normal){
                this.hospital=this.options[0].hospitalCode
                this.setHospital({
                  name: this.options[0].hospitalName,
                  id: this.options[0].hospitalCode
                })
              }
            }
          } else {
             if(this.options[0]){
                 //默认选定第一项
                // this.hospital=this.options[0].hospitalCode
                // this.setHospital({
                //   name: this.options[0].hospitalName,
                //   id: this.options[0].hospitalCode
                // })
              }
            else{
              this.setHospital({
                name: '',
                id: null
              })
              this.hospital=null;
              this.tableData = []
            }
          }
      });
    },
    ...mapMutations({
        setHospital: 'setHospital'
    }) 
  },
  mounted() {
   
  }
}
</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
     .detail-header
       display:flex;
       flex:none;
       height:0.7rem;
       align-items:center;
       .timechose,.hospital
          width:2.2rem;
          margin:0 0.2rem;
   
</style>
