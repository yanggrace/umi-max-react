/*
 * @Author: wangrui
 * @Date: 2022-08-22 10:45:53
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-08-25 14:40:32
 */
import { request } from 'umi';

//获取窜货列表
export async function getFleeingPage(data) {
    return request('/api/oims/special/fleeing/config/page', {
        method: 'POST',
        data,
    });
}

//批量删除窜货列表
export async function deleteFleeingPage(data) {
    return request('/api/oims/special/fleeing/config', {
        method: 'DELETE',
        data,
    });
}


// 查询省份
export async function getProvince(data) {
    return request(`/api/oims/common/region/province`, {
        method: 'GET',
    });
}

// 窜货详情
export async function getFleeingDetail(id) {
    return request(`/api/oims//special/fleeing/config/${id}`, {
        method: 'GET',
    });
}
// 查询市
export async function getCity({ provinceCode }) {
    if (!provinceCode) return
    return request(`/api/oims/common/region/city?provinceCode=${provinceCode}`, {
        method: 'GET',
    });
}
// 窜货规则保存
export async function saveFleeingConfig(data) {
    return request('/api/oims/special/fleeing/config', {
        method: 'POST',
        data
    })
}
// 窜货规则编辑
export async function editFleeingConfig(data) {
    return request('/api/oims/special/fleeing/config', {
        method: 'PUT',
        data
    })
}