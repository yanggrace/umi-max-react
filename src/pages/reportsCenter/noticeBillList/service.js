/*
 * @Author: wangrui
 * @Date: 2022-08-29 09:00:16
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-08-31 09:41:39
 */
import { request } from 'umi';
// 库存提报列表
export function fleeingReceivingFormControllerList(data) {
    return request(`/api/oims/fleeingReceivingFormController/list`, {
        method: 'POST',
        data
    });
}
// 渠道类型
export function channelTypeList() {
    return request(`/api/oims/fleeingReceivingFormController/channelType`, {
        method: 'GET',
    });
}
// 是否严重窜货
export function seriousEnum() {
    return request(`/api/oims/fleeingReceivingFormController/seriousEnum`, {
        method: 'GET',
    });
}
// 导出
export function exportExcels(data) {
    return request(`/api/oims/fleeingReceivingFormController/exportExcel`, {
        method: 'POST',
        responseType: 'blob',
        data
    });
}

// 查询整改数据
export function getFleeingReceiving(fleeingReceivingId) {
    return request(`/api/oims/fleeing/rectify/form/fleeingReceiving/${fleeingReceivingId}`, {
        method: 'GET',
    });
}


