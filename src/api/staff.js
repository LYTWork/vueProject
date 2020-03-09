import request from '@/utils/request'

export const getliststaff = params => { return request({ url: 'api/basic/employee/getEmployeeInfo', method: 'get', params: params }) }

export const insertstaff = params => { return request({ url: 'api/basic/employee/addEmployeeInfo', method: 'post', data: params }) }

export const updatestaff = params => { return request({ url: 'api/basic/employee/updateEmployeeInfo', method: 'put', data: params }) }

export const delstaff = params => { return request({ url: 'api/basic/employee/updateEmpStatus', method: 'put', params: params }) }

export const geteducationlist = params => { return request({ url: 'api/basic/employee/getEduInfo', method: 'get', params: params }) }

export const getmarriedlist = params => { return request({ url: 'api/basic/employee/getMarriedInfo', method: 'get', params: params }) }

export const getpolitylist = params => { return request({ url: 'api/basic/employee/getPolityInfo', method: 'get', params: params }) }
