import request from '@/utils/request'

// 角色
export const queryRoles = params => { return request({ url: 'api/admin/role/queryRoleAll', method: 'get', params: params }) }

export const getFlagRName = params => { return request({ url: 'api/admin/role/getFlagRName', method: 'get', params: params }) }
export const insertOne = params => { return request({ url: 'api/admin/role/addRole', method: 'post', data: params }) }

export const updateOne = params => { return request({ url: 'api/admin/role/updateRole', method: 'put', data: params }) }

export const delOne = params => { return request({ url: 'api/admin/role/deleteRole', method: 'delete', params: params }) }

// 恢复删除
export const queryRoleAlldel = params => { return request({ url: 'api/admin/role/queryRoleAlldel', method: 'get', params: params }) }

export const updateRoledel = params => { return request({ url: 'api/admin/role/updateRolebyId', method: 'put', params: params }) }

// 角色隶属用户
export const getAllusers = params => { return request({ url: '/api/admin/user/queryUserAll', method: 'get', params: params }) }

// 通过角色id获取用户id数据
export const queryUsersRid = params => { return request({ url: 'api/admin/role/queryUsersRid', method: 'get', params: params }) }

export const updateRoleUsers = params => { return request({ url: 'api/admin/role/addRoleUser', method: 'get', params: params }) }

// 角色资源权限
export const getRolepermslist = params => { return request({ url: 'api/admin/role/queryRolrPer', method: 'get', params: params }) }

export const updateRolesPerms = params => { return request({ url: 'api/admin/role/updateRoleRs', method: 'post', data: params }) }

// 角色菜单权限
export const getMenuByRid = params => { return request({ url: 'api/admin/role/updateRoleMenuInfo', method: 'get', params: params }) }

export const updateMenuperms = params => { return request({ url: 'api/admin/role/updateRoleMenu', method: 'post', data: params }) }
