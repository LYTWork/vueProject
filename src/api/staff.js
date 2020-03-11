import request from '@/utils/request'

export const querystaff = params => { return request({ url: 'api/basic/employee/getEmployeeInfo', method: 'get', params: params }) }

export const insertstaff = params => { return request({ url: 'api/basic/employee/addEmployeeInfo', method: 'post', data: params }) }

export const updatestaff = params => { return request({ url: 'api/basic/employee/updateEmployeeInfo', method: 'put', data: params }) }

export const delstaff = params => { return request({ url: 'api/basic/employee/updateEmpStatus', method: 'put', params: params }) }
