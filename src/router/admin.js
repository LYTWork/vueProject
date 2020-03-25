const admin = [{
  path: '/admin/holiday',
  component: () => import('../components/admin/holiday/index'),
  meta: {
    title: '假种管理'
    // roles: ['admin']
  }
},
{
  path: '/admin/staff',
  component: () => import('../components/admin/staff/index'),
  meta: {
    title: '员工信息'
    // roles: ['admin']
  }
},
{
  path: '/admin/dept',
  component: () => import('../components/admin/dept/index'),
  meta: {
    title: '部门管理'
    // roles: ['admin']
  }
},
{
  path: '/admin/position',
  component: () => import('../components/admin/position/index'),
  meta: {
    title: '职位管理'
    // roles: ['admin']
  }
},
{
  path: '/admin/class',
  component: () => import('../components/admin/class/index'),
  meta: {
    title: '班别管理'
    // roles: ['admin']
  }
}
]
export default admin
