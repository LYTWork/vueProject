import request from '@/utils/request'

// 获取所有角色(有参数all则不分页)
export const queryRoles = params => { return request({ url: '/query_roles', method: 'post', data: params }) }
// 新增角色
export const addRole = params => { return request({ url: '/add_role', method: 'post', data: params }) }
// 更新角色
export const modifyRole = params => { return request({ url: '/modify_role', method: 'put', data: params }) }
// 根据id删除角色
export const delRole = params => { return request({ url: '/del_role', method: 'delete', data: params }) }

// 恢复删除
export const queryRoleAlldel = params => { return request({ url: 'api/admin/role/queryRoleAlldel', method: 'get', params: params }) }

export const updateRoledel = params => { return request({ url: 'api/admin/role/updateRolebyId', method: 'put', params: params }) }

// 角色资源权限
export const getRolepermslist = params => { return request({ url: 'api/admin/role/queryRolrPer', method: 'get', params: params }) }

export const updateRolesPerms = params => { return request({ url: 'api/admin/role/updateRoleRs', method: 'post', data: params }) }

// 角色菜单权限
export const getMenuByRid = params => { return request({ url: 'api/admin/role/updateRoleMenuInfo', method: 'get', params: params }) }

export const updateMenuperms = params => { return request({ url: 'api/admin/role/updateRoleMenu', method: 'post', data: params }) }
