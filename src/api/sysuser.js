import request from '@/utils/request'

// 获取所有用户(有参数all则不分页)
export const queryUsers = params => { return request({ url: 'api/admin/user/queryUserAll', method: 'get', params: params }) }
// 新增用户
export const insertOne = params => { return request({ url: '/api/admin/user/addUser', method: 'post', data: params }) }
// 更新用户
export const updateOne = params => { return request({ url: '/api/admin/user/updateUser', method: 'put', data: params }) }

// 根据id删除用户
export const delOne = Uid => { return request({ url: '/api/admin/user/deleteUser?id=' + Uid, method: 'delete', params: Uid }) }

// 查询用户对应的角色组
export const queryRolesUid = Uid => { return request({ url: 'api/admin/user/queryRolesUid?id=' + Uid, method: 'get', params: Uid }) }
// 根据userId 修改角色列表
export const updateUserRole = params => { return request({ url: '/api/admin/user/addUserRole', method: 'post', params: params }) }

// 判断用户名是否存在  存在为true，不存在为false
export const getUnameFlag = params => { return request({ url: '/api/admin/user/getUnameFlag', method: 'get', params: params }) }

// 判断用户旧密码是否正确  正确为true，不正确为false
export const getFlagUserPwd = params => { return request({ url: '/api/admin/user/getFlagUserPwd', method: 'post', params: params }) }

// 修改用户密码
export const resetPass = (userId, passwd) => { return request({ url: '/api/admin/user/updateUserPwd?id=' + userId + '&password=' + passwd, method: 'post' }) }
