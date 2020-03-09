import request from '@/utils/request'

export const login = params => { return request({ url: '/api/admin/log/login', method: 'post', data: params }) }

export const logout = params => { return request({ url: '/api/admin/log/logout', method: 'post', params: params }) }
