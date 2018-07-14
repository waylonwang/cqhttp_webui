// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'mdui/dist/css/mdui.css'
import SettingPanel from '@/components/SettingPanel'
import VueCookie from 'vue-cookie'
Vue.component('setting-panel', SettingPanel)

Vue.use(VueCookie)

/* eslint-disable no-new */
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
})
