// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import '@/utils/prototype.js' // 导入全局方法
import i18n from './i18n'

// 设置反向代理(把前端的请求通过前端服务器转发给后端（称为反向代理）)，前端请求默认发送到 http://localhost:8443/api
// var axios = require('axios')
// axios.defaults.baseURL = 'http://106.13.16.90:8080/api/login'

// Vue.prototype.$axios = axios // 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.config.productionTip = false // 阻止vue 在启动时生成生产提示

Vue.use(ElementUI)

// 使用钩子函数判断是否拦截
// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) { // 首先判断访问的路径是否需要登录
//     if (store.state.user.username) { // 判断 store 里有没有存储 user 的信息
//       next() // 放行
//     } else { // 否则跳转到登录页面，并存储访问的页面路径（以便在登录后跳转到访问页）
//       next({
//         path: 'login',
//         query: {redirect: to.fullPath}
//       })
//     }
//   } else {
//     next()
//   }
// })
// 使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//   document.title = `${to.meta.title} | 企业管理系统`;
//   const role = localStorage.getItem('ms_username');
//   if (!role && to.path !== '/login') {
//       next('/login');
//   } else if (to.meta.permission) {
//       // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//       role === 'admin' ? next() : next('/403');
//   } else {
//       // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//       if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//           Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//               confirmButtonText: '确定'
//           });
//       } else {
//           next();
//       }
//   }
// });
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  created() {
    if (sessionStorage.getItem('store')) { // 页面加载前读取sessionStorage里的状态信息
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }

    window.addEventListener('beforeunload', () => { // 在页面刷新前将vuex里的信息保存到sessionStorage里
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  },
  template: '<App/>',
  render: h => h(App)
})
