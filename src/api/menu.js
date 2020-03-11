
import request from '@/utils/request'

// 菜单
export const getMenuParent = params => { return request({ url: '/api/admin/menu/queryMenuParent', method: 'get', params: params }) }

export const insertOne = params => { return request({ url: '/api/admin/menu/addMenu', method: 'post', data: params }) }


export const updateOne = params => { return request({ url: '/api/admin/menu/updateMenu', method: 'put', data: params }) }

export const delOne = params => { return request({ url: '/api/admin/menu/deleteMenu', method: 'delete', params: params }) }

// 查询当前用户对应的侧边栏菜单
export const getSideBarMenu = params => { return request({ url: '/api/admin/user/queryUMenu', method: 'get', params: params }) }
export const queryMenuLeft = params => { return request({ url: '/api/admin/menu/queryMenuLeft', method: 'get', params: params }) }
