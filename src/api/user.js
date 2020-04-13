import request from '@/utils/request'

// 获取所有用户(有参数all则不分页)
export const queryUsers = params => { return request({ url: '/query_users', method: 'post', data: params }) }
// 新增用户
export const addUser = params => { return request({ url: '/add_user', method: 'post', data: params }) }
// 更新用户
export const modifyUser = params => { return request({ url: '/modify_user', method: 'put', data: params }) }
// 根据id删除用户
export const delUser = params => { return request({ url: '/del_user', method: 'delete', data: params }) }

// 查询用户对应的角色组
export const getUserRoles = params => { return request({ url: '/query_user_roles', method: 'post', data: params }) }

// 根据userId 修改角色列表
export const grantUserRoles = params => { return request({ url: '/grant_user_roles', method: 'put', data: params }) }

// // 判断用户名是否存在  存在为true，不存在为false
export const getUnameFlag = params => { return request({ url: '/api/admin/user/getUnameFlag', method: 'get', params: params }) }

// 判断用户旧密码是否正确  正确为true，不正确为false
export const getFlagUserPwd = params => { return request({ url: '/api/admin/user/getFlagUserPwd', method: 'post', params: params }) }

// 修改用户密码
export const resetPass = (userId, passwd) => { return request({ url: '/api/admin/user/updateUserPwd?id=' + userId + '&password=' + passwd, method: 'post' }) }
