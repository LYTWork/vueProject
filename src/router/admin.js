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
}
]
export default admin
