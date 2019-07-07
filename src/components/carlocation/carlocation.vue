<template>
  <div class="page">
    <div class="pg-header">
       <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        @change="changeDate()"
        >
        </el-date-picker>
      <el-select 
        v-model="city" 
        placeholder="请选择市" 
        class="hospital mg-l-20"
        style="width: 150px"
        v-if="level === 1"
        >
        <el-option
          v-for="item in cityList"
          :key="item.id" :label="item.city" :value="item.code"
          >
        </el-option>
      </el-select>
      <el-select v-model="country" placeholder="请选择区/县"
        class="hospital mg-l-20"
        style="width: 150px"
        v-if="level === 2 || level === 1">
        <el-option
          v-for="item in countryList"
          :key="item.id" :label="item.city" :value="item.code">
        </el-option>
      </el-select>
      <el-select
        v-model="selectOrgCode"
        @change="changeOrgCode()"
        placeholder="请选择医院" 
        style="width: 150px"
        class="mg-l-20">
        <el-option
          v-for="item in orgList"
          :key="item.hospitalCode"
          :label="item.hospitalName"
          :value="item.hospitalCode">
        </el-option>
      </el-select>
      <el-select
        v-model="selectCarId"
        @change="changeCarId()"
        placeholder="请选择车辆" 
        style="width: 150px" 
        class="mg-l-20">
        <el-option
          v-for="item in carList"
          :key="item.id"
          :label="item.carLicence"
          :value="item.id">
        </el-option>
      </el-select>
      <div class="right">
        <div style="float: right;display: flex;align-items: center;">
          <span class="normal-text">暂存点</span>
          <span class="mg-l-10 number-blue">{{tempList.length}} </span>
          <span class="normal-text mg-l-20">产生点</span>
          <span class="mg-l-10 number-red">{{generateCount}}</span>
          <el-button-group class="mg-l-20">
            <el-button @click="reset()">静态</el-button>
            <el-button @click="toPlay()">动态</el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="pg-body">
      <div class="my-map-box">
         <baidu-map 
          class="bm-view" 
          ak="FQGVPonCkREIYbwOwmBjI2E0TBQQn8kQ" 
         :center="mapCeter" 
         :zoom="15"
          @ready="setDriving">
           <!-- 产生点 -->
          <bm-marker
            v-for="(item,index) in generateList" :key="item.id"
            :position="{lng: item.lng , lat: item.lat}" 
            animation="BMAP_ANIMATION_DROP"
             @click="generateClick(item,index)"
            :icon="{
              url: '../../../static/generate-point.png',
              size: {
                width: 30,
                height: 40
              },
              zIndex:1000
            }">
             <bm-info-window :show="item.show" @close="infoWindowClose(item)"  @open="infoWindowOpen(item)"> 
                <div style="margin:5px 0;">{{item.deptName}}</div>
                 <div class="generateDiv">
                   <span style="background-color:#1790FF;" class="generateSpan"></span>
                   <span> 感染性:{{item.infectWeight?item.infectWeight:0}}</span>
                  
                 </div>  
                  <div class="generateDiv">
                   <span style="background-color:#2FC25B;" class="generateSpan"></span>
                   <span>损伤性:{{item.injureWeight?item.injureWeight:0}}</span>
                 </div> 
                   <div class="generateDiv">
                   <span style="background-color:#00C261;" class="generateSpan"></span>
                   <span>病理性:{{item.pathWeight?item.pathWeight:0}}</span>
                 </div>
                   <div class="generateDiv">
                   <span style="background-color:#A950FF;" class="generateSpan"></span>
                   <span>药物性:{{item.medicineWeight?item.medicineWeight:0}}</span>
                 </div>
                   <div class="generateDiv">
                   <span style="background-color:#FFD326;" class="generateSpan"></span>
                   <span>化学性:{{item.chemistryWeight?item.chemistryWeight:0}}</span>
                 </div>
                    <div class="generateDiv">
                   <span style="background-color:#FF434B;" class="generateSpan"></span>
                   <span>其它:{{item.others?item.others:0}}</span>
                 </div>
             </bm-info-window>
          </bm-marker>

          <!-- 暂存点 -->
          <bm-marker v-if="tempList.length"
            v-for="item in tempList" :key="item.id"
            :position="{lng: item.lng , lat: item.lat}" 
            animation="BMAP_ANIMATION_DROP"
            @click="detailTemp(item)"
            :icon="{
              url: '../../../static/temp-point.png',
              size: {
                width: 60,
                height: 80
              },
              zIndex:5000
            }">
             <bm-info-window :show="item.show" @close="infoWindowClose(item)"  @open="infoWindowOpen(item)">
                <div style="margin-top:5px;">{{item.hospitalName}}</div>
                <!-- <div>纬度：{{item.lat}}</div> -->
                 
             </bm-info-window>
             <!-- @close="infoWindowClose" @open="infoWindowOpen" --> 
            <!-- <bm-info-window :show="item.show" @close="infoWindowClose(item)">我爱北京天安门</bm-info-window> -->
          </bm-marker>
          <bm-driving
            :start="carStartPoint" 
            :end="carEndPoint" 
            :panel="false" 
            :autoViewport="true"
            policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
            :waypoints="carWayPoint"
            @searchcomplete="handleSearchComplete"
            >
          </bm-driving>
          <!-- <bm-driving v-for="item in pathArray" :key="item.id"
            :start="item.startPoint" 
            :end="item.endPoint" 
            :panel="false" 
            :autoViewport="false"
            @searchcomplete="mySearchcomplete($event, item.id)"
            policy="BMAP_DRIVING_POLICY_LEAST_DISTANCE"
            v-if="item.show"
            >
          </bm-driving> -->
          <bm-polyline v-for="item in myPathArray" :key="item.id"
            :path="item"
            stroke-color="#027FFD" 
            :stroke-opacity="0.8" 
            :stroke-weight="6" 
            :editing="false" >
          </bm-polyline>
          <!-- <startpoint 
            :position="{lng: 120.15, lat: 30.28}"
            text="点击我"
            :active="active"
            @mouseover.native="active = true"
            @mouseleave.native="active = false">
          </startpoint> -->
          <bml-lushu
            :path="path"
            :icon="icon"
            :play="play"
            :rotation="true"
            :speed="500"
            @stop="reset"
            v-if="isShowLuShu">
          </bml-lushu>
        </baidu-map>
      </div>
    </div>
  </div>
</template>
<script>
// import {post} from 'api/homeHttp';
// import {formatDate} from 'common/js/date';
// // import {clone} from 'common/js/clone.js';
// import {mapGetters} from 'vuex';
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import {BmMarker, BmLabel, BmlLushu, BmDriving, BmPolyline,BmInfoWindow} from 'vue-baidu-map'
import startpoint from './components/startpoint'
import {formatDate} from '../../common/js/date.js'
import { mapActions, mapGetters,mapMutations } from "vuex";
import { getHospitalByCode, getCarList, getCarLocation, getDeptByCode,getCountByDeptCode,getChinaNationByCode} from '../../api/home.js';
import Vue from 'vue';
import {guid} from '../../common/js/base.js'
export default {
  components:{
    BaiduMap,
    BmMarker, 
    BmLabel,
    BmDriving,
    BmPolyline,
    BmlLushu,
    BmInfoWindow
  },
   computed: {
    ...mapGetters(["areacode", "logindata","hospitalName","hospitalId"])
  },
  data () {
    return {
      mapCeter:{lng:120.166067,lat:30.246343},
      path: [],
      showDirving: true,
      active: false,
      date: '',
      options: [],
      areaCode: null, // 地区 code
      orgList: [],
      selectOrgCode: '',
      carList: [],
      selectCarId: '',
      carWayPoint: [], // 车辆的 途径的 最多不能超过十个
      carStartPoint: {
        lng: null,
        lat: null
      },
      carEndPoint: {
        lng: null,
        lat: null
      },
      pathArray: [], // 记录 一段 路 开始点 和 结束点
      myPathArray: [], // 记录真正的 路线
      generateList: [], //  产生点 数据
      tempList: [], // 暂存点 数据
      generateCount: 0,
      tempCount: 0,
      icon: {
        url: '../../../static/i-index-truck1.png',
        size: {width: 52, height: 47},
        opts: {anchor: {width: 27, height:13}}
      },
      play: true,
      isShowLuShu: false,
      city: '',
      cityList: [],
      country: '',
      countryList: [],
      areaCode: '',
      level: '',
    }
  },
  watch: {
    city(val, oldval) {
      if(val){
        this.clearstate();
        if (val === this.areaCode || val === '全部') return
        this.areaCode = val 
        this.getHospitalByCode()
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
         console.log(val)
        this.clearstate();
        if (val === this.areaCode || val === '全部') return
        this.areaCode = val
        this.getHospitalByCode()
      }
    }
  },
  methods: {
    clearstate(){
         this.selectOrgCode='';
         this.selectCarId='';
         this.carList=[];
         this.generateList=[];
         this.generateCount = 0;
         this.tempList=[];
         this.mapCeter={lng:120.166067,lat:30.246343};
    },
    generateClick(item,index){
        // console.log(item,'item');
        let data={
          recycleDate:formatDate(this.date, 'yyyy-MM-dd'),
          orgId:item.orgId,
          deptName:item.deptName
        }
        getCountByDeptCode(data).then(res=>{
          Object.assign(item,{show:true},res.result);
          Vue.set(this.generateList,index,item);
            console.log(res,item,'产生点返回数据');
        })

    },
    infoWindowClose (item) {
      item.show = false
    },
    infoWindowOpen (item) {
      item.show = true
    },
    detailTemp(item){
       item.show=true;
    },
    gettempStoreByCode(){//根据医院获取暂存点
       let data={
         areaCode: this.areaCode,
         orgId:this.selectOrgCode
       };
       getHospitalByCode(data).then(res=>{
         let tempLocations=res.result.filter(item=>{
           return item.location;
         });
         if(tempLocations.length==0){
            this.mapCeter={lng:120.166067,lat:30.246343};
            return;
         }
         console.log(tempLocations,'tempLocations');
        //  debugger;
         this.tempList=tempLocations.map(item=>{
              let lnglatarr=item.location.split(',')
              return { lng:lnglatarr[0], lat:lnglatarr[1], show:true, id:guid(),hospitalName:item.hospitalName}
         });
         this.mapCeter={lng:this.tempList[0].lng,lat:this.tempList[0].lat};
         console.log(this.tempList,res,'暂存点数据');
       })
    },
    infoWindowClose (item) {
      item.show = false
    },
    handleSearchComplete (res) {
      this.path = []
      if (res.getPlan(0).dk.length > 0) {
        for (let i = 0; i < res.getPlan(0).dk.length; i ++) {
          this.path = [...this.path, ...res.getPlan(0).getRoute(i).getPath()]
        }
      }
     //  this.path = res.getPlan(0).getRoute(0).getPath()
      console.log(res,this.path,'轨迹');
      console.log(res.getPlan(0).dk.length)
      setTimeout(() => {
        // this.showDirving = false
      }, 300)
    },
    setDriving() {
      console.log('set Dirbing')
    },
    initDate () {
      this.date =  new Date()
    },
    // 根据区域代码查询机构列表
    getHospitalByCode (isFirst = false) {
      this.orgList = []
      const data = {
        areaCode: this.areaCode
      }
      getHospitalByCode(data).then(res => {
        console.log(res,'医院数据');
        if (res['status'] === '1') {
          if (res['result'] && res['result'].length > 0) {
            this.orgList = res['result'];
      
            if (isFirst) {
              if (this.hospitalId) {
                  this.selectOrgCode = this.hospitalId;
              } else {
                  this.selectOrgCode=this.orgList[0].hospitalCode
                  this.setHospital({
                    name: this.orgList[0].hospitalName,
                    id: this.orgList[0].hospitalCode
                  })
              }
            } else {
              if(this.orgList[0]){
                  this.selectOrgCode=this.orgList[0].hospitalCode
                  this.setHospital({
                    name: this.orgList[0].hospitalName,
                    id: this.orgList[0].hospitalCode
                  })
                }
              else{
                this.setHospital({
                  name: '',
                  id: null
                })
                this.selectOrgCode=null;
                this.carList = []
                this.selectCarId = null
                this.generateList = []
                this.tempList = []
           
                this.generateCount = 0
              }
            }
            this.getCarList();//这三个方法要一起调用
            this.gettempStoreByCode();//这三个方法要一起调用
            this.getDeptByCode();//这三个方法要一起调用
          } else {
          }
        }
      })
    },
    changeOrgCode () {
      this.orgList.forEach(item => {
        if(item.hospitalCode === this.selectOrgCode) {
          this.setHospital({
            id: item.hospitalCode,
            name: item.hospitalName
          })
        }
      })
      this.startpoint = null
      this.endPoint = null
      this.isShowLuShu = false
      this.play = false
      this.carWayPoint = [];
       this.selectCarId = '';
      this.getCarList()
      this.getDeptByCode()
     
      // this.getHospitalByCode();
      this.gettempStoreByCode();
    },
    getCarList () {
      this.carList = []
      this.selectCarId = null
      const data = {
        orgId: this.selectOrgCode
      }
      getCarList(data).then(res => {
        if (res['status'] === '1') {
          if (res['result'] && res['result'].length > 0) {
            this.carList = res['result']
          }
        } else {}
      })
    },
    changeCarId() {
      this.getCarLocation()
    },
    getCarLocation () {
      if (!this.selectCarId || !this.date) return
      console.log(formatDate(this.date, 'yyyy-MM-dd'))
      const data = {
        startDt: formatDate(this.date, 'yyyy-MM-dd') + ' 00:00:00',
        endDt: formatDate(this.date, 'yyyy-MM-dd') + ' 23:59:59',
        carId: this.selectCarId
      }
      getCarLocation(data).then(res => {
        if (res['status'] === '1') {
          if (res['result'] && res['result'].length > 0) {
            this.carStartPoint = {lng: res['result'][0].longitude, lat: res['result'][0].latitude}
            this.carEndPoint = {
              lng: res['result'][res['result'].length - 1].longitude,
              lat: res['result'][res['result'].length - 1].latitude
            }
            this.carWayPoint = []
            if (res['result'].length > 3) { // 当坐标点 大于 3 时， 记录 途径点
              for (let i = 1; i < res['result'].length - 1; i++) {
                this.carWayPoint.push({
                  lng: res['result'][i].longitude,
                  lat: res['result'][i].latitude
                })
              }
            }
            if (res['result'].length > 2) {
              this.initPathArray(res['result'])
            }
          } else {
            this.isShowLuShu = false
            this.carStartPoint = {lng: null, lat: null}
            this.carEndPoint = {lng: null, lat: null}
          }
        } else {}
      })
    },
    // 当 车 的 点 大于 2是 存在 路径时
    initPathArray (array) {
      this.pathArray = []
      this.myPathArray = []
      for(let i = 0; i < array.length - 1; i ++) {
        this.myPathArray.push([]) 
        this.pathArray.push({
          id: i, // 主键
          show: true, // 是 不用显示的 但是为了查询 有不得不显示
          startPoint: {
            lng: array[i].longitude,
            lat: array[i].latitude
          },
          endPoint: {
            lng: array[i + 1].longitude,
            lat: array[i + 1].latitude
          }
        })
      }
      console.log(this.pathArray)
    },
    mySearchcomplete (res, i) {
      const path = res.getPlan(0).getRoute(0).getPath()
      this.myPathArray[i] = path
      setTimeout(() => {
        this.pathArray[i].show = false
      }, 300)
    },
    // 根据 区域 代码 查询 科室 列表
    getDeptByCode () {
      this.generateList = []
      this.tempList = []
      this.generateCount = 0
    
      const data = {
        areaCode: this.areaCode,
        orgId: this.selectOrgCode
      }
      getDeptByCode(data).then(res => {
        if (res['status'] === '1') {
          if (res['result'] && res['result'].length > 0) {
            res['result'].forEach(item => {
              if (item.deptLocation) {
                item.lng = item.deptLocation.split(',')[0]
                item.lat = item.deptLocation.split(',')[1]
              }
              if (item.deptType === '产生点') {
                this.generateCount ++;
                item.show=false;
                this.generateList.push(item)
              }
            })
          }
        } else {}
      })
    },
    changeDate() {
       this.getCarList();//这三个方法要一起调用
            this.gettempStoreByCode();//这三个方法要一起调用
            this.getDeptByCode();//这三个方法要一起调用
      this.getCarLocation();
    },
    reset () {
      this.play = false
    },
    toPlay() {
      if (this.path.length > 0) {
        this.play = true
        this.isShowLuShu = true
      }
    },
    getChinaNationByCode (isCity = false) {
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
    ...mapMutations({
      setHospital: 'setHospital'
    }) 
  },
  mounted () {
    this.areaCode = this.areacode;
    this.initDate()
    if (this.areaCode) {
      this.level = this.logindata.level
      if (this.level === 1) { // 表示省
        this.getChinaNationByCode(true)
      } else if(this.level === 2) { // 表示市
        this.getChinaNationByCode(false);
      }
      this.getHospitalByCode(true);

      
    }
  }
}
</script>

<style lang="stylus">
 @import "~common/stylus/varibale"
 .generateDiv{
   display:flex;
   align-items:center;  
 }
 .generateSpan{
   width:5px;
   height:5px;
   border-radius:50%;
   margin-right:5px;
 }
.page {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0 20px 20px;
  .pg-header {
    height: 60px;
    display: flex;
    align-items: center;
    .right {
      flex: auto;
      span {
        display: inline-block;
      }
      .number-blue {
        color: #00BBF2;
        font-size: 24px;
      }
      .number-red {
        color: #FF006D;
        font-size: 24px;
      }
    }
  }
  .pg-body {
    flex: auto;
    background: #B5E61D;
    position: relative;
    .my-map-box {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .bm-view {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
