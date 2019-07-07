<template>
<!--已弃用-->
  <div class="main">
    <div class="am-pt-16">
      <!-- <input type="text" class="input-text input-date" value="2018-10-01 ~ 2018-10-31"> -->
      <el-date-picker
        v-model="timestart"
        type="date"
        placeholder="选择日期"
        class="timechose input-date"
      ></el-date-picker>
      <el-date-picker
        v-model="timesend"
        type="date"
        placeholder="选择日期"
        class="timechose input-date"
        style="padding-left:-0.5rem;"
      ></el-date-picker>
      <div class="am-btn-rdo ml-7" v-activeClick="{'tag':'a','addclass':'active'}">
        <a @click="monthsearch">本月</a>
        <a @click="yearsearch">全年</a>
      </div>
    </div>
    <!--7个小块块-->
    <div style="position: absolute; width: 50%; top:.64rem; height: .87rem;">
      <ul class="count-list clearfix">
        <li>
          <div class="li-box">
            <div>总重量</div>
            <div class="number">{{total.totalWeight}}</div>
          </div>
        </li>
        <li>
          <div class="li-box">
            <div>感染性</div>
            <div class="number">{{total.infectWeight}}</div>
          </div>
        </li>
        <li>
          <div class="li-box">
            <div>损伤性</div>
            <div class="number">{{total.injureWeight}}</div>
          </div>
        </li>
        <li>
          <div class="li-box">
            <div>病理性</div>
            <div class="number">{{total.pathWeight}}</div>
          </div>
        </li>
        <li>
          <div class="li-box">
            <div>药物性</div>
            <div class="number">{{total.medicineWeight}}</div>
          </div>
        </li>
        <li>
          <div class="li-box">
            <div>化学性</div>
            <div class="number">{{total.chemistryWeight}}</div>
          </div>
        </li>
        <li>
          <div class="li-box">
            <div>其他</div>
            <div class="number">{{total.others}}</div>
          </div>
        </li>
      </ul>
    </div>
    <!--end 7个小块块-->
    <!--医废总量排行-->
    <div style="position: absolute; width: 50%; bottom:34%; top:1.51rem; padding-top:16px;">
      <div class="index-cm-lay" style="width: 40%; height: 100%;color:white;">
        <div class="index-h2">医废总量排行</div>
        <ul class="percent-list" v-if="percentList.length">
          <li v-for="(item,index) in percentList" :key="index">
            <label class="city-name">{{item.name}}</label>
            <div class="percent-bg">
              <div class="percent" :style="item.style"></div>
            </div>
            <span style="position:absolute;top:0;right:-22px;z-index:100;">{{item.totalWeight}}</span>
          </li>
        </ul>
      </div>
      <!--地图-->
      <div style="position: absolute; top:16px; left: 40%; width: 60%; bottom:0;">
        <div class="index-cm-lay">
          <!-- <div id="main" style="width: 80%; height:70%;"></div> -->
          <div class="citymap" id="echart-map" style="width: 100%; height:100%;"></div>
        </div>
      </div>
      <!--end 地图-->
    </div>
    <!--end 医废总量排行-->
    <!--污水污泥统计-->
    <div style="position: absolute; width: 50%; top:66%; bottom:0; padding-top:16px;color:white; ">
      <div class="index-cm-lay">
        <div class="index-h2">污水污泥统计</div>
        <linechartcom :pretype="pretypeoption" :title="'污水污泥统计'" style="width: 95%; height: 80%"></linechartcom>
        <!-- <div id="echartLine2" style="width: 84%; height: 72%"></div> -->
      </div>
    </div>
    <!--end 污水污泥统计-->
    <!--废物类型占比-->
    <div
      style=" position: absolute; top:.64rem;  bottom:50%; left:50%; width:25%; padding-left: 16px;"
    >
      <div class="index-cm-lay">
        <div class="index-h2">废物类型占比</div>
        <div
          id="echartPie1"
          v-if="showcircle.show"
          style="height: 90% ; width: 100%;"
          ref="circlechart"
        ></div>
      </div>
    </div>
    <!--end 废物类型占比-->
    <!--监控-->
    <div
      style=" position: absolute; top:.64rem; bottom:50%; left:75%; width:25%; padding-left: 16px;"
    >
      <div class="index-cm-lay">
        <div class="index-h2">监控</div>
        <div class="am-ctr-sel">
          <a
            class="caption"
            href="javascript:void(0)"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >浙一医院</a>
          <div class="am-dropdown">
            <ul>
              <li class="active">浙一医院</li>
              <li>浙一医院</li>
              <li>浙一医院</li>
            </ul>
          </div>
        </div>
        <div class="am-ctr-sel ml-7">
          <a
            class="caption"
            href="javascript:void(0)"
            data-toggle="dropdown"
            role="button"
            aria-haspopup="true"
            aria-expanded="false"
          >监控点一</a>
          <div class="am-dropdown">
            <ul>
              <li class="active">监控点一</li>
              <li>监控点一</li>
              <li>监控点一</li>
            </ul>
          </div>
        </div>
        <div
          style="position: absolute; left: 16px; right:0; top:1.04rem; bottom:.24rem; padding: 0 .24rem;"
        >
          <img src="./../../assets/video.png" style="width: 100%; height: 100%;">
        </div>
      </div>
    </div>
    <!--end 监控-->
    <!--数据预警-->
    <div
      style=" position: absolute; top:50%; bottom:0; left:50%; width:50%; padding-left: 16px; padding-top: 16px;"
    >
      <div class="index-cm-lay">
        <div class="index-h2">数据预警</div>
        <div class="am-pb-15">
          <!--报警-->
          <div class="alarm bg-danger">
            <div class="number">{{serieswarning}}</div>
            <div>严重预警</div>
          </div>
          <div class="alarm bg-wran">
            <div class="number">{{nightwarning}}</div>
            <div>轻微预警</div>
          </div>
          <!--end 报警-->
        </div>
        <div class="tbody">
          <table class="index-tb am-mt-24">
            <thead>
              <tr>
                <th>日期</th>
                <th>医疗机构</th>
                <th>异常情况</th>
                <th>处理情况</th>
              </tr>
            </thead>
            <tbody v-if="tableList.length">
              <tr :slot-scope="{active:item.id=='1'}" v-for="item in tableList" :key="item.id">
                <td>{{item.occurTime}}</td>
                <td>{{item.orgName}}</td>
                <td>{{item.warnContent}}</td>
                <td>{{item.handleResult}}</td>
              </tr>
              <!-- <tr>
                          <td>2018-09-10</td><td>xx医院</td><td>超过48小时未出库</td><td></td>
                      </tr>
                      <tr>
                          <td>2018-09-10</td><td>xx医院</td><td>超过3天未提交污水污泥报告</td><td></td>
                      </tr>
                      <tr>
                          <td>2018-09-10</td><td>xx医院</td><td>超过3天未提交污水污泥报告</td><td></td>
                      </tr>
                      <tr>
                          <td>2018-09-10</td><td>xx医院</td><td>超过3天未提交污水污泥报告</td><td></td>
              </tr>-->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// var echarts = require('echarts');
import { post } from "api/homeHttp";
import { formatDate } from "common/js/date";
import { clone } from "common/js/clone.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import linechartcom from "components/detail-count/linechart";

export default {
  components: { linechartcom },
  data() {
    return {
      //  timestart:new Date(new Date().getTime()-30*24*60*60*1000),
      timestart: new Date(),
      timesend: new Date(),
      city: "",
      poststart: "",
      postend: "",
      percentList: [],
      pretypeoption: "",
      serieswarning: "",
      nightwarning: "",
      showcircle: { show: false },
      tableList: [],
      options: [
        {
          value: "001",
          label: "浙江省第一医院"
        },
        {
          value: "002",
          label: "浙江省第二医院"
        },
        {
          value: "003",
          label: "浙江省第三医院"
        },
        {
          value: "004",
          label: "浙江省第四医院"
        },
        {
          value: "005",
          label: "浙江省第5医院"
        }
      ],
      total: {
        chemistryWeight: "",
        infectWeight: "",
        injureWeight: "",
        medicineWeight: "",
        others: "",
        pathWeight: "",
        totalWeight: ""
      },
      wastesizeoption: {
        //  title : {
        //     text: '总重量',
        //     // subtext: '纯属虚构',
        //     color:'red',
        //     x:'center',
        //     y:'center'
        //  },
        tooltip: {
          //鼠标移入显示项
          trigger: "item"
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: "1%",
          top: "1%",
          data: ["感染性", "损伤性", "病理性", "药物性", "化学性", "其它"],
          itemWidth: 5,
          itemHeight: 5,
          // itemBorderRadius: 0,
          // icon:'square',
          textStyle: {
            color: "#fff",
            fontSize: "14"
          }
          // selectedMode: false,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        color: [],
        series: [
          {
            name: "",
            type: "pie",
            radius: ["50%", "80%"],
            center: ["40%", "50%"],
            avoidLabelOverlap: false,
            data: [],
            label: {
              normal: {
                show: false,
                position: "center",
                textStyle: {
                  backgroundColor: "rgba(0,28,60,.94)",
                  borderRadius: 2,
                  padding: [5, 5]
                }
              },
              emphasis: {
                show: true,
                formatter: "{d}%",
                textStyle: {
                  fontSize: "16",
                  fontWeight: "bold"
                }
              }
            },
            clockwise: false
          }
        ]
      },
      linesoption: {
        // title: {
        //   text: "折线图堆叠"
        // },
        textStyle: { color: "white" }, //控制颜色
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: []
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: "value"
        },
        series: []
      }
    };
  },
  created() {
    this.poststart = formatDate(this.timestart, "yyyy-MM-dd") + " 00:00:00";
    this.postend = formatDate(this.timesend, "yyyy-MM-dd") + " 23:59:59";
    this.timeget();
    this.gettable();
    this.getplace();
  },
  computed: {
    ...mapGetters(["province", "areacode"])
  },
  watch: {
    province(val, oldval) {
      console.log(val, "城市改变");
    },
    timestart(val, oldval) {
      this.poststart = formatDate(this.timestart, "yyyy-MM-dd") + " 00:00:00";
      this.timeget();
    },
    timesend(val, oldval) {
      this.postend = formatDate(this.timesend, "yyyy-MM-dd") + " 23:59:59";
      this.timeget();
    },
    city(val, oldval) {
      let tempcity = this.city.replace(/省|市/, "");
      setTimeout(() => {
        this.initMap(tempcity);
      }, 20);
    }
  },
  methods: {
    getplace() {
      let data = {
        areaCode: this.areacode
      };
      let url = "/medicalwaste/v1/getChinaNationInfoByCode";
      post(url, data).then(res => {
        console.log(res, "palce数据");
        this.city = res.result;
      });
    },
    timeget() {
      let data = {
        startDt: formatDate(this.timestart, "yyyy-MM-dd") + " 00:00:00",
        endDt: formatDate(this.timesend, "yyyy-MM-dd") + " 23:59:59",
        areaCode: this.areacode
      };
      this.gettotal(data);
      this.merge();
    },
    monthsearch() {
      let month = formatDate(new Date(), "MM");
      let year = formatDate(new Date(), "yyyy");
      let firstday = new Date(year, month, 1); //取当年当月中的第一天
      let lastday = new Date(
        firstday.getTime() - 1000 * 60 * 60 * 24
      ).getDate();
      let data = {
        startDt: `${year}-${month}-01 00:00:00`,
        endDt: `${year}-${month}-${lastday} 23:59:59`,
        areaCode: this.areacode
      };
      this.poststart = `${year}-${month}-01 00:00:00`;
      this.postend = `${year}-${month}-${lastday} 23:59:59`;
      this.gettotal(data);
      this.merge();
    },
    yearsearch() {
      let year = formatDate(new Date(), "yyyy");
      let firstday = new Date(year, 12, 1); //取当年当月中的第一天
      let lastday = new Date(
        firstday.getTime() - 1000 * 60 * 60 * 24
      ).getDate();
      let data = {
        startDt: `${year}-01-01 00:00:00`,
        endDt: `${year}-12-${lastday} 23:59:59`,
        areaCode: this.areacode
      };
      this.poststart = `${year}-01-01 00:00:00`;
      this.postend = `${year}-12-${lastday} 23:59:59`;
      this.gettotal(data);
      this.merge();
    },
    gettotal(data) {
      let url = "/medicalwaste/v1/getMedicalWasteCount";
      post(url, data).then(res => {
        console.log(res, "gettotal数据");
        if (!res.total) {
          return;
        }
        // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others 1E2730 totalWeight
        this.total.infectWeight = res.total.infectWeight;
        this.total.injureWeight = res.total.injureWeight;
        this.total.pathWeight = res.total.pathWeight;
        this.total.medicineWeight = res.total.medicineWeight;
        this.total.chemistryWeight = res.total.chemistryWeight;
        this.total.others = res.total.others;
        this.total.totalWeight = res.total.totalWeight;
        this.buildtotal(
          this.total,
          this.wastesizeoption,
          this.showcircle,
          "circlechart"
        ); //画圆
        let temparr = res.result.slice();
        let max = Math.max(
          ..._.map(temparr, item => {
            return item.totalWeight;
          })
        );

        console.log(max, temparr, "max");
        _.forEach(temparr, item => {
          if (item.totalWeight / max) {
            item.style = { width: `${(item.totalWeight / max) * 100}%` };
          } else {
            item.style = { width: `0` };
          }
        });
        this.percentList = [].concat(temparr);
      });
    },
    getdata(val) {
      let data = {
        startDt: this.poststart,
        endDt: this.postend,
        reportType: val
      };
      let url = "/medicalwaste/v1/getReportCount";
      return post(url, data).then(res => {
        console.log(res, "污水污泥");
        return new Promise((resoleve, reject) => {
          resoleve(res);
        });
      });
    },
    merge() {
      let one = false;
      let two = false;
      let datas = [];
      datas.length = 2;
      this.getdata("1").then(res => {
        one = true;
        datas[0] = res.result;
        if (two) {
          this.buildday(datas, this.linesoption, "pretypeoption");
        }
        console.log(res, "data1");
      });
      this.getdata("2").then(res => {
        two = true;
        datas[1] = res.result;
        if (one) {
          this.buildday(datas, this.linesoption, "pretypeoption");
        }
        console.log(res, "data2");
      });
    },
    buildday(datas, option, giveoption) {
      //hospital柱形图高度和横坐标,option绘图类型option,showchart是否显示chart,chart=ref
      console.log("zhangfeng");
      let optioncopy = clone(option);
      _.forEach(datas[0], item => {
        optioncopy.xAxis.data.push(item.reportDate); //横轴
      });

      // 感染性 infectWeight 009EF9 损伤性 injureWeight FF710F  病理性 pathWeight 00C261 药物性 medicineWeight A950FF 化学性 chemistryWeight FFD326 其它  others 1E2730 totalWeight
      let templegent = [
        { name: "污水", value: "infectWeight", color: "#009EF9" },
        { name: "污泥", value: "injureWeight", color: "#FF710F" }
      ];
      _.forEach(templegent, (item, index) => {
        optioncopy.series.push({
          name: item.name,
          type: "line",
          // stack: "总量",合并项
          color: item.color,
          data: []
        });
        _.forEach(datas[index], val => {
          optioncopy.series[index].data.push(val.count);
        });
      });
      console.log(optioncopy, "zhang");
      this[giveoption] = optioncopy;
    },
    buildtotal(hospital, option, showchart, chart) {
      //hospital柱形图高度和横坐标,option绘图类型option,showchart是否显示chart,chart=ref
      let optioncopy = clone(option);
      // console.log(wastecountoptioncopy,hospital,'optiontotalcopy');

      optioncopy.series[0].data.push({
        value: hospital.infectWeight,
        name: "感染性"
      });
      optioncopy.series[0].data.push({
        value: hospital.injureWeight,
        name: "损伤性"
      });
      optioncopy.series[0].data.push({
        value: hospital.pathWeight,
        name: "病理性"
      });
      optioncopy.series[0].data.push({
        value: hospital.medicineWeight,
        name: "药物性"
      });
      optioncopy.series[0].data.push({
        value: hospital.chemistryWeight,
        name: "化学性"
      });
      optioncopy.series[0].data.push({ value: hospital.others, name: "其它" });
      // let color=['#009EF9','#FF710F','#00C261','#A950FF','#FFD326','#1E2730'];
      // wastecountoptioncopy.color=color;
      let color = [
        "#009EF9",
        "#FF710F",
        "#00C261",
        "#A950FF",
        "#FFD326",
        "#FF434B"
      ]; //圆形设置颜色
      optioncopy.color = color;
      showchart.show = true;
      console.log(optioncopy, option, "optioncopy");

      setTimeout(() => {
        var chartrender = echarts.init(this.$refs[chart]);
        chartrender.setOption(optioncopy);
        window.addEventListener("resize", function() {
          chartrender.resize();
        });
      }, 20);
    },
    gettable() {
      let url = "/medicalwaste/v1/getAbnormalWarningByCode";
      let data = { areaCode: this.areacode };
      post(url, data).then(res => {
        this.tableList = res.result;
        this.serieswarning = res.count.severityCount;
        this.nightwarning = res.count.slightCount;
        console.log(res, "表格数据");
      });
    },
    initMap(val) {
      var achart = echarts.init(document.getElementById("echart-map"));
      var option = {
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true
        },
        legend: [
          {
            selectedMode: "multiple",
            top: "top",
            orient: "horizontal",
            data: [""],
            left: "center",
            show: true
          }
        ],
        backgroundColor: "rgba(0,0,0,0)",
        series: [
          {
            mapType: val, // 主要是这个 maptype
            data: [],
            name: "",
            symbol: "circle",
            type: "map",
            //roam: true,
            label: {
              normal: {
                show: false,
                textStyle: {
                  color: "#fff",
                  fontSize: 12
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: "#fff",
                  fontSize: 18
                }
              }
            },
            itemStyle: {
              normal: {
                areaColor: "#136CD0",
                //color:'#fff'
                borderColor: "rgba(0,0,0,.3)"
              },
              emphasis: {
                areaColor: "#33CEFD"
              }
            }
          }
        ]
      };
      console.log(option, "地图信息");
      achart.setOption(option);
    }
  },
  mounted() {}
};
</script>

<style lang="stylus">
@import '~common/stylus/varibale';
@import '~common/stylus/mainright';

.main {
  background-color: #0b1119;
  padding-left: 0.1rem;
  position: relative;
  height: 100%;
  color: white;

  .el-input__inner {
    background-color: #0b1119;
    height: 0.3rem;
    line-height: 0.3rem;
    width: 2rem;
  }

  .el-input__icon {
    line-height: 0.3rem;
  }

  .el-date-editor {
    width: 2rem;
  }

  * {
    box-sizing: border-box;
  }
}

.percent-list {
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.1rem 0;
}

.tbody {
  height: 2.6rem;
  overflow-y: scroll;
}
</style>
