import request from "@/utils/request"

// 部门

export const getdeptlist = params => { return request({ url: 'api/basic/depart/getDepartInfo', method: 'get', params: params }) }

export const insertdept = params => { return request({ url: 'api/basic/depart/addDepart', method: 'post', data: params }) }

export const updatedept = params => { return request({ url: 'api/basic/depart/updateDepart', method: 'put', data: params }) }

export const deldept = params => { return request({ url: 'api/basic/depart/deleteDepart', method: 'delete', params: params }) }

export const getdepartList = params => { return request({ url: 'api/basic/depart/getDepartList', method: 'get', params: params }) }
export const returndeptlist = function() {
  getdepartList().then(res => {
    this.deptlist = res.data;
  });
}
