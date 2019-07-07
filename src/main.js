// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'common/stylus/index.styl'
import 'font-awesome/css/font-awesome.min.css'
import store from './store'
import 'common/js/commom.js'
Vue.use(ElementUI)
var _ = require('lodash')
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
Vue.directive('activeClick', {
  // 当被绑定的元素插入到 DOM 中时……
  // 用法 v-activeClick="{'tag':'li','addclass':'active'}" 其中 tag必须是dom 标签
  bind: function (el, binding, vnode) {
    let activeItem
    let node = el.getElementsByTagName(`${binding.value.tag}`)
    let addclass = binding.value['addclass']
    // console.log(node,binding.value,'node');
    _.forEach(node, (item) => {
      item.addEventListener('click', () => {
        activeItem = el.getElementsByClassName(addclass)[0]
        if (activeItem) {
          activeItem.classList.remove(addclass)
        }
        item.classList.add(addclass)
      })
    })
  }
})
