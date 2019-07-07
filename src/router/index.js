import Vue from 'vue'
import Router from 'vue-router'
import recoverDetailCom from 'components/recover-detail/recover-detail'
import workcountCom from 'components/work-count/work-count'
import totalchartsCom from 'components/total-charts/total-charts'
import detailcountCom from 'components/detail-count/detail-count'
import offiesCom from 'components/offies/offies'
import dumpcartCom from 'components/dumpcart/dumpcart'
import specialdetailCom from 'components/specialdetail/specialdetail'
import errorCom from 'components/error/error'
// import wastewaterCom from 'components/wastewater/wastewater'
import wastewaterCom from 'components/wastewater/wastewater1'
import joinCom from 'components/join/join'
// import mainCom from 'components/main/main'
import loginCom from 'components/login/login'
import boxcountCom from 'components/boxcount/boxcount'
import carlocationCom from 'components/carlocation/carlocation'
import recycleCom from 'components/recycle/recycle'
import videoCom from 'components/video/video'
import main2Com from 'components/main/main2'
import monitorCom from 'components/monitor/monitor';
import wasteWaterReportReadCom from 'components/wastewater/wasteWaterReportRead';
import sludgeReportReadCom from 'components/wastewater/sludgeReportRead';
Vue.use(Router)
const Home = (resolve) => {
  import('components/home/home').then((module) => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    { path: '/', redirect: '/home' },
    {
      path: '/home/main',
      component: loginCom
    },
    {
      path: '/home',
      component: Home,
      children: [{
        path: '',
        redirect: 'main1'
      },
      {
        path: 'main1',
        component: main2Com
      },
      {
        path: 'recover-detail',
        component: recoverDetailCom
      },
      {
        path: 'work-count',
        component: workcountCom
      },
      {
        path: 'total-charts/:id',
        component: totalchartsCom
      },
      {
        path: 'detail-count',
        component: detailcountCom
      },
      {
        path: 'offies',

        component: offiesCom
      }, {
        path: 'dumpcart',
        component: dumpcartCom
      },
      {
        path: 'specialdetail',
        component: specialdetailCom
      },
      {
        path: 'error',
        component: errorCom
      },
      {
        path: 'wastewater1',
        component: wastewaterCom
        // meta: {
        //   keepAlive: true // 需要被缓存
        // }
      },
      {
        path: 'join',
        component: joinCom
      },
      {
        path: 'boxcount',
        component: boxcountCom
      },
      {
        path: 'carlocation',
        component: carlocationCom
      },
      {
        path: 'recycle',
        component: recycleCom
      },
      {
        path: 'video',
        component: videoCom
      },
      {
        path: 'monitor',
        component: monitorCom
      },
      {
        
        path: 'wasteWaterReportRead',
        name: 'wasteWaterReportRead',
        component: wasteWaterReportReadCom,
      },
      {
        
        path: 'sludgeReportRead',
        name: 'sludgeReportRead',
        component: sludgeReportReadCom,
      }
      ]
    }
  ]
})