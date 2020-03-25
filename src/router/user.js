const user = [
  {
    path: '/user/welcom',
    component: () => import('../components/user/welcom/index'),
    meta: {
      title: '系统首页'
      // roles: ['admin']
    }
  }, {
    path: '/user/resetpass',
    component: () => import('../components/user/resetpass/index'),
    meta: {
      title: '修改密码'
      // roles: ['admin']
    }
  }, {
    path: '/user/message',
    component: () => import('../components/user/message/index'),
    meta: {
      title: '消息中心'
      // roles: ['admin']
    }
  }, {
    path: '/user/signagin',
    component: () => import('../components/user/signagin/index'),
    meta: {
      title: '补签卡功能'
      // roles: ['admin']
    }
  }, {
    path: '/user/sign',
    component: () => import('../components/user/sign/index'),
    meta: {
      title: '签到记录'
      // roles: ['admin']
    }
  }, {
    path: '/user/ntahl',
    component: () => import('../components/user/ntahl/index'),
    meta: {
      title: '请假申请'
      // roles: ['admin']
    }
  }, {
    path: '/user/worksche',
    component: () => import('../components/user/worksche/index'),
    meta: {
      title: '排班'
      // roles: ['admin']
    }
  }, {
    path: '/user/pay',
    component: () => import('../components/user/pay/index'),
    meta: {
      title: '工资信息'
      // roles: ['admin']
    }
  }
]
export default user
