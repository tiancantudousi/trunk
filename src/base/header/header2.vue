<template>
    <div class="index-header">
        <span class="white-second-text" style="font-size: 12px" v-if="level === 1">市：</span>
        <el-dropdown @command="clickAreaItem"  v-if="level === 1">
            <span class="el-dropdown-link">
                {{cityName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in areaList" :key="item.id" 
                    :command="item">
                    {{item.city}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span class="white-second-text mg-l-20" v-if="level === 2 || level === 1"
            style="font-size: 12px">区：</span>
        <el-dropdown @command="clickCountryItem" v-if="level === 2 || level === 1">
            <span class="el-dropdown-link">
                {{countryName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in countryList" :key="item.id" 
                    :command="item">
                    {{item.city}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span class="white-second-text mg-l-20" style="font-size: 12px">机构：</span>
        <el-dropdown @command="clickOrgItem">
            <span class="el-dropdown-link">
                {{hospitalName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in orgList" :key="item.hospitalCode" 
                    :command="item">
                    {{item.hospitalName}}
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <span class="white-second-text mg-l-20" style="font-size: 12px">时间：</span>
        <span class="white-normal-text" style="cursor: pointer" 
            @click="clickYear()" 
            :class="{'active': dateType == 0}">本年</span>
        <span class="white-normal-text mg-l-10" style="cursor: pointer" 
            @click="clickMonth()" 
            :class="{'active': dateType == 1}">本月</span>
        <span class="white-normal-text mg-l-10 custom" 
            :class="{'active': dateType == 2}">
            {{customDateText}}
            <el-date-picker
                class="select-time"
                type="daterange"
                v-model="customDate"
                @change="customDateChange()">
            </el-date-picker>
        </span>
        <div class="index-header-content">全省医疗废物智慧监管系统</div>
        <div class="right">
            <span class="" style="cursor: pointer">{{name}}</span>
            <span class="mg-l-10" style="cursor: pointer" @click="loginOut()">退出</span>
        </div>
    </div>
</template>

<script>
// 从 vuex 获取 数据
import { mapActions, mapGetters,mapMutations } from "vuex";
import { getChinaNationByCode, getHospitalByCode } from '../../api/home.js'
import Bus from '../../common/js/bus.js'
import {formatDate} from '../../common/js/date.js'
export default {
    data () {
        return {
            areaList: [], // 市的 list
            countryList: [], // 区的 list
            selectAreaName: '全部',
            selectCountryName: '全部',
            selectAreaCode: '',
            orgList: [],
            selectOrgName: '全部',
            selectOrgCode: '',
            isStart: true, // 是否 是 刚开始 启动
            customDate: '',
            dateType: 0,
            customDateText: '自定义',
            level: null,
            username:''
        }
    },
     created() {
   
    this.name=this.logindata.loginName;
    
    },
    computed:{
      ...mapGetters(['areacode','logindata', 'cityCode', 'cityName',
        'countryName', 'countryCode', 'hospitalName', 'hospitalId']),
    },
    methods: {
        // 根据区域代码查询区域列表
        getChinaNationByCode (isCity = true) {
            const data = {
                areaCode: isCity ? this.areacode : this.cityCode
            }
            getChinaNationByCode(data).then(res => {
                if (res['status'] === '1') {
                    if (res['result']) {
                        if (isCity) {
                            if (this.areacode === '330000') {
                                console.log('cityName', this.cityName)
                                this.selectAreaName = '全部'
                                if (!this.cityCode || this.cityCode === '330000') {
                                    this.setCityName('全部')
                                    this.setCountryName('全部')
                                    this.countryList =  [{  
                                        city: '全部'
                                    }]
                                } else {
                                    this.getChinaNationByCode(false)
                                }
                                res['result'].unshift({
                                    city: '全部',
                                    code: '330000'
                                })
                            } else {
                                this.selectAreaName = res['result'][0].city
                                this.setCityName(res['result'][0].city)
                            }
                            this.areaList = res['result']
                        } else {
                            this.selectCountryName = '全部'
                            if (!this.countryCode) {
                                this.setCountryName('全部')
                                this.setCountryCode(this.cityCode)
                            }
                            res['result'].unshift({
                                code: this.cityCode,
                                city: '全部',
                            })
                            this.countryList = res['result']
                        }
                    }              
                } else {
                }
            })
        },
        clickAreaItem (item) {
            // if (item.code === this.selectAreaCode) return  //注释掉了这个可能导致bug
            // 需要 提醒 其他 组件 选择的 areacode 发生了变化
            this.selectAreaName = item.city
            // debugger;
            this.setCityName(item.city)
            this.selectAreaCode = item.code
            this.setCityCode(item.code)
            this.setCountryCode('')
            this.setHospital({
                name: '全部',
                id: ''
            })
            this.getHospitalByCode()
            // debugger;
            console.log(this.selectAreaCode)
            if (this.selectAreaCode === '330000') {
                this.selectCountryName = '全部'
                this.setCountryName(this.selectCountryName);
                this.countryList =  [{  
                    city: '全部'
                }]
            } else {
                this.getChinaNationByCode(false)
            }
        },
        clickCountryItem (item) {
            // if (item.code === this.selectAreaCodee) return
            this.selectCountryName = item.city
            this.setCountryName(item.city)
            this.selectAreaCode = item.code
            this.setCountryCode(item.code)
            this.setHospital({
                name: '全部',
                id: ''
            });
             Bus.$emit('changeOrgCode', '');
            this.getHospitalByCode()
        },
        
        // 根据区域代码查询机构列表
        getHospitalByCode () {
            console.log('########', this.selectAreaCode)
            const data = {
                areaCode: this.selectAreaCode
            }
            getHospitalByCode(data).then(res => {
                if (res['status'] === '1') { 
                    if (res['result']) {
                        res['result'].unshift({
                            addr: null,
                            areaId: "",
                            cityId: "",
                            contacts: null,
                            countryId: "",
                            createTime: "",
                            creator: "",
                            deleteFlag: 1,
                            hospitalCode: "",
                            hospitalIntro: null,
                            hospitalName: "全部",
                            phone: null,
                            provinceId: "",
                            updateTime: null,
                            updator: null,
                        })
                        if (!this.hospitalId) {
                            this.setHospital({
                                name: '全部',
                                id: ''
                            })
                        }
                        // this.selectOrgName = '全部'
                        // this.selectOrgCode = ''
                        if (!this.isStart) {
                            Bus.$emit('changeAreaCode', this.selectAreaCode)
                        } {
                            this.isStart = false
                        }
                        this.orgList = res['result'];
                        console.log(this.orgList,'this.orgList');
                    }
                } else {}
            })
        },
        clickOrgItem(item) {
            if (item.hospitalCode === this.selectOrgCode&&item.hospitalName!= "全部") return
            // this.selectOrgName = item.hospitalName
            // this.selectOrgCode = item.hospitalCode
            this.setHospital({
                name: item.hospitalName,
                id: item.hospitalCode
            })
            Bus.$emit('changeOrgCode', item.hospitalCode)
        },
        // 点击 了 本年
        clickYear() {
            this.dateType = 0
            this.customDateText = '自定义'
            Bus.$emit('changeDate', {
                type: 0
            })
        },
        // 点击 了 本月
        clickMonth () {
            this.dateType = 1
            this.customDateText = '自定义'
            Bus.$emit('changeDate', {
                type: 1
            })
        },
        customDateChange () {
            // console.log('自定义 时间 的 改变')
            this.customDateText = formatDate(this.customDate[0], 'yyyy-MM-dd') + ' ~ ' 
                + formatDate(this.customDate[1], 'yyyy-MM-dd')
            this.dateType = 2
            Bus.$emit('changeDate', {
                type: 2,
                startDate: this.customDate[0],
                endDate: this.customDate[1]
            })
        },
        loginOut() {
            window.location.href = 'http://zjswsjds.317hu.com/hospital-admin/admin-cms/login.html?tdsourcetag=s_pctim_aiomsg'
        },
        ...mapMutations({
            setCityCode: 'setCityCode',
            setCityName: 'setCityName',
            setCountryName: 'setCountryName',
            setCountryCode: 'setCountryCode',
            setHospital: 'setHospital'
        }) 
    },
    mounted () {
        if (this.areacode) {
            // 如果 登录 进来 的 不是 省 用户. 就 不能 显示 全省
            // if (!this.cityCode && !this.countryCode) {
            //     this.selectAreaCode = this.areacode
            // } else if (this.countryCode) {
            //     this.selectAreaCode = this.countryCode
            // } else {
            //     this.selectAreaCode = this.cityCode
            // }
            // console.log(this.selectCityCode)
            // console.log('this.cityName = ', this.cityName)
            // this.setCityCode(null)
            // this.setCityName('全部')
            // this.setCountryCode(null)
            // this.setCountryName('全部')
            this.selectAreaCode = this.areacode
            
            this.getHospitalByCode()
            this.level = this.logindata.level
            if (this.level === 1) { // 表示省
                this.getChinaNationByCode()
            } else if(this.level === 2) { // 表示市
                this.getChinaNationByCode(false)
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
@import "~common/stylus/varibale"
.index-header {
    position: relative;
    z-index: 100;
    height: 65px;
    background: url('../../assets/header-bg.png') no-repeat top;
    color: #fff;
    line-height: 24px;
    padding: 19px 24px 0 80px;
    .el-dropdown-link {
        color: #ffffff;
        font-size: 14px;
    }
    .select-time {
        
    }
    .custom {
        position: relative;
        cursor: pointer;
        .select-time {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
    }
    .index-header-content {
        position: absolute;
        width: 474px;
        top: 0;
        left: 50%;
        margin: 10px 0 0 24px;
        font-size: 28px;
        line-height: 41px;
        text-align: center;
        transform: translateX(-50%);
    }
    .right {
        float: right;
        span {
            color: rgba(247, 242, 232, 0.8);
            &:hover {
                color: #ffffff !important;
            }
        }
    }
    span.active {
        color: #99D9EA !important;
    }
}
.el-dropdown-menu {
    max-height: 600px;
    overflow: auto;
}
</style>


