import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/index.js"
import {
  isEmpty
} from "../utils/stringUtil.js"

import user from './user.js'
import admin from './admin.js'
import system from './system.js'

Vue.use(Router)

// 所有角色都可以访问的页面
export const constantRoutes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/Login'),
    hidden: true,
    meta: { title: '登录' }
  },
  // {
  //   path: '/loginon',
  //   component: () => import('../views/login/loginon'),
  //   hidden: true
  // },
  {
    path: '/home',
    redirect: '/user/welcom',
    component: () => import('../components/Home'),
    children: [
    {
      path: '/403',
      component: () => import('../components/common/errorPage/403'),
      meta: {
        title: '403'
        // roles: ['admin']
      }
    },{
      path: '/404',
      component: () => import('../components/common/errorPage/404'),
      meta: {
        title: '404'
        // roles: ['admin']
      }
    }].concat(user,admin,system) // 在这里引入注册模块的路由
  },
  {
    path: '/403',
    component: () => import('../components/common/errorPage/403'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('../components/common/errorPage/404'),
    hidden: true
  }
]
// 需动态判断权限的路由
export const asyncRoutes = [
  {
    path: '/home',
    component: () => import('../components/Home'),
    children: [].concat(user,admin,system) // 在这里引入注册模块的路由
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  // mode:"history",
  routes: constantRoutes || store.getters.permission_routes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// 未登陆的用户会被自动导航到login
// 登录界面登录成功之后，会把用户信息保存在会话
// 存在时间为会话生命周期，页面关闭即失效
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login' || to.path === '/loginon') {
//     next()
//     return
//   }
//   var token = store.getters.token;
//   if (JSON.parse(sessionStorage.getItem('store')) !== null && JSON.parse(sessionStorage.getItem('store')) !== undefined && JSON.parse(sessionStorage.getItem('store')) !== '') {
//     token = store.getters.token || JSON.parse(sessionStorage.getItem('store')).user.token;
//   }
//   if (isEmpty(token)) {
//     router.push('/login')
//     return
//   }
//   next();
// })
export default router
