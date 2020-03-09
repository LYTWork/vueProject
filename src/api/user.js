import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/authorize',
    method: 'post',
    data
  })
}

export function getInfo(id) {
  return request({
    url: '/users/' + id + '/infos',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
