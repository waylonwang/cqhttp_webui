// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'mdui/dist/css/mdui.css'
import 'vuetify/dist/vuetify.min.css'
import 'vue2-animate/dist/vue2-animate.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import SettingPanel from '@/components/SettingPanel'
import VueCookie from 'vue-cookie'
import Vuetify from 'vuetify'
import cqcode from './cqcode'
import VueJsonPretty from 'vue-json-pretty'

Vue.component('vue-json-pretty', VueJsonPretty)

Vue.use(require('vue-moment'))
Vue.use(VueCookie)
Vue.component('setting-panel', SettingPanel)
Vue.use(Vuetify)
Vue.use(cqcode)

/* eslint-disable no-new */
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App />'
})
