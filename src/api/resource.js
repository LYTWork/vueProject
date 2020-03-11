import request from '@/utils/request'

// 资源管理
export const getresourceList = params => { return request({ url: 'api/admin/resource/queryRs', method: 'get', params: params }) }

export const insertOne = params => { return request({ url: 'api/admin/resource/addResource', method: 'post', data: params }) }

export const queryResourceById = params => { return request({ url: '/api/admin/resource/updateRsId', method: 'post', params: params }) }
export const updateOne = params => { return request({ url: 'api/admin/resource/updateRs', method: 'post', data: params }) }

export const updateTimp = params => { return request({ url: 'api/admin/resource/updateTimp', method: 'get', params: params }) }
