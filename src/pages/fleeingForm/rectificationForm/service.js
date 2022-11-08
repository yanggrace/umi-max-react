/*
 * @Author: wangrui
 * @Date: 2022-08-25 16:45:41
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-08-25 17:18:35
 */
import { request } from '@umijs/max';

//获取所有区
export async function getProvinceTRee() {
    return request(`/api/oims/common/region/findAllRegionWithTreeRelation`, {
        method: 'GET',
    });
}

//获取详情
export async function getRectifyForm(id) {
    return request(`/api/oims/fleeing/rectify/form/${id}`, {
        method: 'GET',
    });
}


//保存
export async function saveRectifyForm(params) {
    return request(`/api/oims/fleeing/rectify/form`, {
        method: 'POST',
        data: params
    });
}

//暂存
export async function saveRectifyFormTemporary(params) {
    return request(`/api/oims/fleeing/rectify/form/temporary`, {
        method: 'POST',
        data: params
    });
}
