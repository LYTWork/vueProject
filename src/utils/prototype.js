import store from '../store'
import request from '@/utils/request.js'
import sha1 from "@/utils/sha1.js"
import Vue from 'vue'

Vue.prototype.$http = request;// 在全局注册api请求
Vue.prototype.$sha1 = sha1;// 全局注册sha1加密方法

// 判断对象是否为空
Vue.prototype.$isEmpty = function(obj) {
  if (obj === undefined || obj === null || obj === '') {
    return true
  }
  return false
}

// 路由跳转
Vue.prototype.$routeTo = function(path, params) {
  if (undefined === params || params == null) {
    this.$router.push({ path: path })
  } else this.$router.push({ path: path, query: params })
}

// 全局注册权限控制方法
Vue.prototype.$checkPermission = function(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles;
    const permissionRoles = value;
    // 传入角色与当前登录用户角色一致返回true
    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role)
    })

    if (!hasPermission) {
      return false
    } else return true
  } else {
    return false
  }
}
