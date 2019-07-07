<template>
  <div class="detailmain">
    <div class="detail-header">
      <el-date-picker v-model="timechose" type="date" placeholder="选择日期" class="timechose"></el-date-picker>
      <el-select 
        v-model="city" 
        placeholder="请选择市" 
        class="hospital"
         v-if="level === 1"
        >
        <el-option v-if="cityList.length"
          v-for="item in cityList"
          :key="item.id" :label="item.city" :value="item.code"
          >
        </el-option>
      </el-select>
      <el-select v-model="country" placeholder="请选择区/县" class="hospital" 
        v-if="level === 2 || level === 1">
        <el-option
          v-for="item in countryList"
          :key="item.id" :label="item.city" :value="item.code">
        </el-option>
      </el-select>
      <el-select v-model="hospital" placeholder="请选择医院" class="hospital">
        <el-option
          v-for="item in options"
          :key="item.hospitalCode"
          :label="item.hospitalName"
          :value="item.hospitalCode"
        ></el-option>
      </el-select>
      <!-- <el-select v-model="hospital" placeholder="请选择监控点" class="point">
        <el-option></el-option>
      </el-select> -->
    </div>

    <div class="video-content">
      <div class="col3" v-for="(item,index) in videoList[nowindex]" v-if="videoList.length">
                <div class="index-panel-dot" style="flex: 1">
                    <div class="hd">监控
                        <div class="cm-right">
                        
                            

                        </div>
                    </div>
                    <div class="bd">
                        <div class="bd-box">
                        <div class="ghost-center" style="height: 100%;">
                            <div class="ghost-center-inner">
                                <!-- <img src="../../assets/video-rec.png" class="video-rec"> -->
                                <video :id="item.vedioId" class="video-js"
                                    poster="../../assets/jiankong.png" 
                                    autoplay="autoplay" 
                                    controls preload="auto"
                                     > 
                                    <!-- <source src="http://193.112.101.157:8080/hls/test.m3u8" type="application/x-mpegURL" /> -->
                                    <source v-if="equipId"
                                        :src="`http://122.224.131.50:6713/mag/hls/${equipId}/1/live.m3u8`"
                                        type="application/x-mpegURL"/>
                                </video>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>

            </div>

             <div class="detail-footer" style="padding-bottom:0;">
                  <el-pagination
                    v-if="hospital"
                    background
                    layout="prev, pager, next"
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
</template>

<script>
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
// import {clone} from 'common/js/clone.js';
import Bus from '../../common/js/bus.js'

import { mapActions, mapGetters, mapMutations } from "vuex";
import {getChinaNationByCode , getHospitalByCode, getVideoId } from '../../api/home.js'
export default {
  components: {},
  data() {
    return {
      timechose: new Date(),
      hospital: "",
      totalsize: 10,
      nowindex: 0,
      pageSize: "15",
      tableheight: null,
      height: 600,
      options: [],
      tableData: [],
      city: "",
      cityList: [],
      country: "",
      countryList: [],
      areaCode: "",
      level: "",
      monitorOrgName:'',
      orgList:[],
      videoList: [],
      equipId:'',
      vedioId:'',
      totalsize:1
    };
  },
  created() {
    this.areaCode = this.areacode;
    if (this.areaCode) {
      this.gethospital(true);
      this.level = this.logindata.level;
      if (this.level === 1) {
        // 表示省
        this.getChinaNationByCode();
      } else if (this.level === 2) {
        // 表示市
        this.getChinaNationByCode(false);
      }
    }
  },
  computed: {
    ...mapGetters(["areacode", "logindata", "hospitalId", "hospitalId"])
    // height:function(){
    //   return this.tableheight;
    // }
  },
  watch: {
    timechose(val, oldval) {
      if (val) {
        // this.getdetail();
      }
    },
    hospital(val, oldval) {
      if (val) {
        this.options.forEach(item => {
          if (item.hospitalCode === val) {
            this.setHospital({
              id: item.hospitalCode,
              name: item.hospitalName
            });
             Bus.$emit('changeOrgCode', item.hospitalCode)
          }
        });
        // this.getdetail();
      }
      //   this.setHospital({
      //           name: item.hospitalName,
      //           id: item.hospitalCode
      //  })
      
    },
    nowindex(val, oldval) {
      console.log(val, "nowindex");
      // this.getdetail();
    },
    city(val, oldval) {
      if (val) {
        console.log(val);
        if (val === this.areaCode || val === "全部") return;
        this.areaCode = val;
        this.getVideoId();//获取视频信息
        this.gethospital();
        if (val === "330000") {
          this.country = "";
          this.countryList = [
            {
              city: "全部"
            }
          ];
        } else {
          this.getChinaNationByCode(false);
        }
      }
    },
    country(val, oldval) {
      if (val) {
        console.log(val);
        if (val === this.areaCode || val === "全部") return;
        this.areaCode = val;
        this.gethospital();
        this.getVideoId();
      }
    }
  },
  methods: {
  
      getVideoId () {
            const data = {
                areaCode: this.areaCode
                // orgId:this.hospital
            }
            getVideoId(data).then(res => {
                if (res['status'] === '1') {
                    if (res['result'] && res['result'].length > 0) {
                        this.totalsize=(Math.floor(res.result.length/4)+1)*10;
                        this.equipId = res['result'][0].equId
                        console.log(res);
                        this.videoList=this.buildarr(res.result,4);
                        // console.log(this.videoList);
                        // console.log(`http://122.224.131.50:6713/mag/hls/${this.equipId}/1/live.m3u8`)
                        setTimeout(()=>{
                         
                           this.playpagevideo(this.videoList,this.nowindex);
                        },200)
                       
                    }
                } else {}
            })
      },
      playpagevideo(list,index){
          _.forEach(list[index],(item)=>{
            console.log(item,'1234566');
              let  player = videojs(item.vedioId);
              player.play();
          })
          
      },
      buildarr(arr,length){
           let afterbuild=[];
           let lengtharr=[];
            _.forEach(arr,(item)=>{
               if(afterbuild.length==length){
                
                 lengtharr.push(afterbuild);
                  afterbuild=[];
               }
               item.vedioId= 'example-video-' + new Date().getTime();
               afterbuild.push(item);
            })
             lengtharr.push(afterbuild);
           return lengtharr;
      },
      getChinaNationByCode(isCity = true) {
      const data = {
        areaCode: this.areaCode
      };
      getChinaNationByCode(data).then(res => {
        if (res["status"] === "1") {
          if (res["result"]) {
            if (isCity) {
              if (this.areacode === "330000") {
                this.city = "";
                res["result"].unshift({
                  city: "全部",
                  code: "330000"
                });
                this.country = "";
                this.countryList = [
                  {
                    city: "全部"
                  }
                ];
              } else {
                this.city = res["result"][0].city;
              }
              this.cityList = res["result"];
            } else {
              this.country = "";
              res["result"].unshift({
                code: this.areaCode,
                city: "全部"
              });
              this.countryList = res["result"];
            }
          }
        } else {
        }
      });
    },
    gethospital(isFirst = false) {
      let data = {
        areaCode: this.areaCode
      };
      let url = "/medicalwaste/v1/getHospitalByCode";
      post(url, data).then(res => {
        console.log(res, "医院数据");
        this.options = res.result;
        // if (this.options[0]) {
        //   this.hospital = this.options[0].hospitalCode;
        // } else {
        //   this.hospital = null;
        // }
        if (isFirst) {
          if (this.hospitalId) {
            this.hospital = this.hospitalId;
          } else {
            this.hospital = this.options[0].hospitalCode;
            this.setHospital({
              name: this.options[0].hospitalName,
              id: this.options[0].hospitalCode
            });
          }
        } else {
          if (this.options[0]) {
            this.hospital = this.options[0].hospitalCode;
            this.setHospital({
              name: this.options[0].hospitalName,
              id: this.options[0].hospitalCode
            });
          } else {
            this.setHospital({
              name: "",
              id: null
            });
            this.hospital = null;
            this.tableData = [];
          }
        }
      });
    },
    handleCurrentChange(val) {
   
      this.nowindex = val-1;
         console.log(this.nowindex,'this.nowindex');
    },
    ...mapMutations({
      setHospital: "setHospital"
    })
  },
  mounted() {
    // setTimeout(() => {
    //   let getheight = this.$refs.getheight;
    //   let height = this.$refs.getheight.getElementsByTagName("th")[0]
    //     .offsetHeight;
    //   this.tableheight = height;
    //   console.log("getheight", getheight, height);
    // }, 20);
    // //设置table的高度
    // let tableheight = this.$refs.getheight.clientHeight;

    // this.height = tableheight;
    // console.log(this.tableheight, this.height, "tableheight");
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/varibale';
.video-js{
  width:100%;
  height:100%;
}

      

.video-content {
  height:85vh;
  display:flex;
  flex-wrap:wrap;
  position:relative;
  .detail-footer{
      position:absolute;
      bottom:-2%;
      left:0;
      
      .el-pagination.is-background .el-pager li:not(.disabled).active{
          background-color:#00C261; 
          color:white; 
      }     
  }

  .col3 {
    height:50%;
    width: 48%;
    margin:0 1%;
    display: flex;
    flex-direction: column;

    .index-panel-dot {
      background: rgba(0, 0, 0, 0.4);
      border-radius: 10px;
      color: #F7F2E8;
      padding: 12px 16px;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;

      .hd {
        position: relative;
        padding-left: 20px;

        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 8px;
          height: 8px;
          margin-top: -4px;
          border-radius: 100%;
          background: #F7F2E8;
          border: 1px solid #FBEFD1;
          box-shadow: 0 0 10px 0 rgba(251, 239, 209, 0.4);
        }

        .cm-right {
          float: right !important;
          color: #ffffff;
        }

        .el-dropdown {
          color: #FFFFFF;
        }
      }

      .bd {
        margin-top: 12px;
        padding-bottom: 12px;
        flex:1;
        position: relative;

        .bd-box {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .ghost-center {
          white-space: nowrap;
          font-size: 0;

          .ghost-center-inner {
            height: 100%;
          }

          .video-rec {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}

.detailmain {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;

  .detail-header {
    display: flex;
    flex: none;
    height: 0.7rem;
    align-items: center;

    .timechose, .hospital {
      width: 2.2rem;
      margin: 0 0.2rem;
    }
  }

  .detail-content {
    flex: 1;
  }

  .detail-footer {
    padding-bottom: 0.5rem;

    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #00C261;
      color: white;
    }
  }
}
</style>
