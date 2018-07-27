import Vue from 'vue'
import Router from 'vue-router'
import Overview from '@/components/Overview'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '概览',
      component: Overview
    },
    {
      path: '/test',
      name: '测试',
      component: Test
    }
  ]
})
