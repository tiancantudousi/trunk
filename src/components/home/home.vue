<!--此首页已弃用-->
<template>
  <div ref="home" class="home">
    <div ref="header" class="homeheader">
      <header2Compnent v-if="isCollapse"></header2Compnent>
      <headerCompnent v-if="!isCollapse"></headerCompnent>
    </div>
    <div class="content">
      <div class="leftbar">
        <el-menu
          default-active="2"
          class="leftmenu"
          @open="handleOpen"
          @close="handleClose"
          background-color="#0C2745"
          text-color="#fff"
          active-text-color="#00C261"
          :collapse="isCollapse"
          :unique-opened="true"
        >
          <el-menu-item index="1" @click="gomain">
            <img src="./../../assets/i-home.svg" class="img1" alt>
            <span>首页</span>
          </el-menu-item>
          <el-submenu index="2">
            <template slot="title" class="sub-title">
              <img src="./../../assets/i-statistics.svg" class="img1" alt>
              <span>医废统计</span>
            </template>
            <el-menu-item-group >
              <el-menu-item index="1-1" @click="godetail">回收明细查看</el-menu-item>
              <el-menu-item index="1-2" @click="gojoin">科室交接统计</el-menu-item>
              <el-menu-item index="1-3" @click="goworkcount">工作量统计</el-menu-item>
              <el-menu-item index="1-4" @click="godumpcart">垃圾车定位</el-menu-item>
              <el-menu-item index="1-5" @click="gototalcharts">总量排行榜</el-menu-item>
              <el-menu-item index="1-6" @click="godetailcount">明细统计图</el-menu-item>
              <el-menu-item index="1-7" @click="gospecialdetail">特殊项明细</el-menu-item>
              <el-menu-item index="1-8" @click="goerror">遗损统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="3" @click="gowastewater">
            <img src="./../../assets/i-home.svg" class="img1" alt>
            <span>污水污泥监测</span>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title">
              <img src="./../../assets/i-statistics.svg" class="img1" alt>
              <span>小箱进大箱</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="goboxcount">小箱交接统计</el-menu-item>
              <el-menu-item index="2-2" @click="gocarlocation">车辆定位轨迹</el-menu-item>
              <el-menu-item index="2-3" @click="gorecycle">回收情况统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-menu-item index="5" @click="govideo">
            <img src="./../../assets/i-camera.svg" class="img1" alt>
            <span>视频监控</span>
          </el-menu-item>
          <!-- <el-menu-item index="6">
            <img src="./../../assets/i-remote.svg" class="img1" alt>
            <span>感控关键点</span>
          </el-menu-item> -->
          <el-submenu index="6">
            <template slot="title">
              <img src="./../../assets/i-remote.svg" class="img1" alt>
              <span>感控关键点</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="3-1" @click="goMonitor">在线监控</el-menu-item>
              <el-menu-item index="3-2" @click="goControl">在线监测</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </div>
      <div class="layout">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import headerCompnent from "base/header/header";
import header2Compnent from "base/header/header2";
import { mapGetters } from "vuex";
import { clone } from "common/js/clone";
import router from "router";

// import {mapMutations} from 'vuex';
import { getData } from "api/homeHttp";
var echarts = require("echarts");
import Bus from '../../common/js/bus.js'
export default {
  components: { headerCompnent, header2Compnent },
  data() {
    return {
      isCollapse: false, // 侧边栏 是否 伸缩 ; 与头部 也有 联系 
    };
  },
  created() {},
  computed: {
    ...mapGetters([])
  },
  watch: {},
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    godetail() {
      this.$router.push({ path: "/home/recover-detail" });
    },
    goworkcount() {
      this.$router.push({ path: "/home/work-count" });
    },
    gototalcharts() {
      this.$router.push({ path: "/home/offies" });
    },
    godetailcount() {
      this.$router.push({ path: "/home/detail-count" });
    },
    godumpcart() {
      this.$router.push({ path: "/home/dumpcart" });
    },
    gospecialdetail() {
      this.$router.push({ path: "/home/specialdetail" });
    },
    goerror() {
      this.$router.push({ path: "/home/error" });
    },
    gowastewater() {
      this.$router.push({ path: "/home/wastewater1" });
    },
    gojoin() {
      this.$router.push({ path: "/home/join" });
    },
    goboxcount() {
      this.$router.push({ path: "/home/boxcount" });
    },
    gocarlocation() {
      this.$router.push({ path: "/home/carlocation" });
    },
    gorecycle() {
      this.$router.push({ path: "/home/recycle" });
    },
    gomain() {
      this.$router.push({ path: "/home/main1" });
    },
    govideo() {
      this.$router.push({ path: "/home/video" });
    },
    goMonitor () {
      this.$router.push({ path: "/home/monitor" });
    },
    goControl () {
      var url = 'http://60.191.49.200:9002/SSO/5059BA3E902F751B1E6E35649309DFBC1BEB73CC6B950A93427F74DF264D6F3A'
      window.open(url)
    }
  },
  created() {
    Bus.$on('siderCollapse', (e) => {
      this.isCollapse = e
    })
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/varibale';

.home {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;

  .homeheader {
    /*height: $header-height;*/
    height: 56px;
    flex: none;
  }

  .content {
    flex: 1;
    display: flex;

    .leftbar {
      height: 100%;
      flex: none;

      .leftmenu {
        height: 100%;
      }
    }

    .layout {
      flex: 1;
      position: relative;
    }
  }
}

.el-menu {
  border-right: none;
  
}
</style>
