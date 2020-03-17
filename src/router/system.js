const system = [
  {
    path: '/system/user',
    component: () => import('../components/system/user/index'),
    meta: {
      title: '用户管理'
      // roles: ['admin']
    }
  }, {
    path: '/system/role',
    component: () => import('../components/system/role/index'),
    meta: {
      title: '角色管理'
      // roles: ['admin']
    }
  }, {
    path: '/system/menu',
    component: () => import('../components/system/menu/index'),
    meta: {
      title: '菜单管理'
      // roles: ['admin']
    }
  }
]
export default system
