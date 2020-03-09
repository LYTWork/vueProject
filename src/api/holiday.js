
import request from '@/utils/request'

// 假种查询所有
export const getholidaylist = params => { return request({ url: '/api/timer/holiday/queryholiday', method: 'get', params: params }) }
// 假种新增
export const getholidayadd = params => { return request({ url: '/api/timer/holiday/addholidayinfo', method: 'get', data: params }) }
// 假种新增保存
export const insertOne = params => { return request({ url: '/api/timer/holiday/addholiday', method: 'post', data: params }) }
// 假种编辑
export const getholidaybyid = params => { return request({ url: '/api/timer/holiday/updateholidayinfo?id=' + params, method: 'get', params: params }) }
// 假种编辑保存
export const updateOne = params => { return request({ url: '/api/timer/holiday/updateholiday', method: 'put', data: params }) }
// 假种删除
export const delOne = Id => { return request({ url: '/api/timer/holiday/deleteholiday?id=' + Id, method: 'delete', params: Id }) }
// 导出假种excel
export const getExcel = params => { return request({ url: '/api/timer/holiday/queryholidayExcel', method: 'get', params: params }) }
