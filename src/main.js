// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'mdui/dist/css/mdui.css'
import mdui from 'mdui'

import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

import VeeValidate from 'vee-validate'
Vue.use(VeeValidate)

Vue.config.productionTip = false
/* eslint-disable no-new */

import SettingPanel from '@/components/SettingPanel'
Vue.component('setting-panel', SettingPanel)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
})