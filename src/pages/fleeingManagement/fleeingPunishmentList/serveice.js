/*
 * @Author: wangrui
 * @Date: 2022-08-22 10:45:53
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-09-08 12:08:02
 */
import { request } from 'umi';

//获取产品价格基准得列表
export async function getBaseProductList(data) {
    return request('/api/oims/product/basePrice/page', {
        method: 'POST',
        data,
    });
}
// 获取收货单详情
export function getNoticeBillDetail(id) {
    return request(`/api/oims/fleeingReceivingFormController/queryById?id=${id}`, {
        method: 'GET',

    });
}

//根据是否严重串货更新产品明细的信息(只刷新不保存)
export function updateBySeriousEnum(data) {
    return request(`/api/oims/fleeingManagementController/updateBySeriousEnum`, {
        method: 'POST',
        data
    });
}
//保存窜货管理单
export function saveFleeingManagementForm(data) {
    return request(`/api/oims/fleeingManagementController/saveFleeingManagementForm`, {
        method: 'POST',
        data
    });
}
//跟新窜货管理单
export function updateFleeingManagementForm(data) {
    return request(`/api/oims/fleeingManagementController/update`, {
        method: 'POST',
        data
    });
}
//窜货管理列表
export function fleeingManagementList(data) {
    return request(`/api/oims/fleeingManagementController/list`, {
        method: 'POST',
        data
    });
}
// 是否严重窜货枚举
export function seriousEnum() {
    return request(`/api/oims/fleeingManagementController/seriousEnum`, {
        method: 'GET',
    });
}
// 更具窜货管理单查询详情
export function fleeingQueryById(id) {
    return request(`/api/oims/fleeingManagementController/queryById?id=${id}`, {
        method: 'GET',
    });
}
// 导出
export function exportExcels(data) {
    return request(`/api/oims/fleeingManagementController/exportExcel`, {
        method: 'POST',
        responseType: 'blob',
        data
    });
}