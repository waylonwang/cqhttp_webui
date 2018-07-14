import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Overview from '@/components/Overview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '概览',
      component: Overview
    }
  ]
})
