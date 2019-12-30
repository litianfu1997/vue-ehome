import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../views/login'
import TenHome from '../views/TenHome'
import ComHome from '../views/ComHome'

Vue.use(VueRouter)


const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },{
    path:"/TenHome",
    name:'TenHome',
    component:TenHome
  },{
    path:'/ComHome',
    name:'ComHome',
    component:ComHome
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
