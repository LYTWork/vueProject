import request from "@/utils/request"

// 部门

export const querydept = params => { return request({ url: 'api/basic/depart/getDepart', method: 'get', params: params }) }

export const insertdept = params => { return request({ url: 'api/basic/depart/addDepart', method: 'post', data: params }) }

export const updatedept = params => { return request({ url: 'api/basic/depart/updateDepart', method: 'put', data: params }) }

export const deldept = params => { return request({ url: 'api/basic/depart/deleteDepart', method: 'delete', params: params }) }

