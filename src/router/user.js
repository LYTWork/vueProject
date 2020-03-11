const user = [
  {
    path: '/user/welcom',
    component: () => import('../components/user/welcom/index'),
    meta: {
      title: '系统首页'
      // roles: ['admin']
    }
  },{
    path: '/user/resetpass',
    component: () => import('../components/user/resetpass/index'),
    meta: {
      title: '修改密码'
      // roles: ['admin']
    }
  },{
    path: '/user/message',
    component: () => import('../components/user/message/index'),
    meta: {
      title: '消息中心'
      // roles: ['admin']
    }
  },
  ]
  export default user
  