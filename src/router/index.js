import Vue from 'vue'
import Router from 'vue-router'
import gallery from '@/page/gallery'
import technologyCenter from '@/page/dataStatisticsCenter/technologyCenter'
import teamError from '@/page/dataStatisticsCenter/teamError'
import workload from '@/page/dataStatisticsCenter/workload'
Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'gallery',
    component: gallery
  }]
})
