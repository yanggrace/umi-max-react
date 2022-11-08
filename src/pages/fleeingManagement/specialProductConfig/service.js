/*
 * @Author: wangrui
 * @Date: 2022-08-18 14:27:26
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-08-26 17:39:11
 */
import { request } from 'umi';

//获取产品价格基准得列表
export async function specialConfigList(data) {
    return request('/api/oims/special/product/config/page', {
        method: 'POST',
        data,
    });
}

// 获取品类
export async function getCategoryList(data) {
    return request('/api/oims/common/product/level', {
        method: 'GET',
    });
}

// 获取下一级的联动
export async function getNextList(data) {
    return request(`/api/oims/common/product/level/${data}`, {
        method: 'GET',
    });
}
// 获取下一级的联动
export async function getProductList(params) {
    return request(`/api/oims/common/product/page`, {
        method: 'POST',
        data: params
    });
}
// 特殊产品配置保存
export async function saveSpecialConfig(params) {
    return request(`/api/oims/special/product/config`, {
        method: 'POST',
        data: params
    });
}
// 特殊产品配置详情
export async function getSpecialConfig(id) {
    return request(`/api/oims/special/product/config/${id}`, {
        method: 'GET',
    });
}
// 编辑特殊产品配置
export async function editSpecialConfig(params) {
    return request(`/api/oims/special/product/config`, {
        method: 'PUT',
        data: params
    })
}
// 批量删除特殊产品配置
export async function deleteSpecialConfig(params) {
    return request(`/api/oims/special/product/config`, {
        method: 'DELETE',
        data: params
    })
}
// 下载模板
export function downloadExcelTemplate() {
    return request(`/api/oims/special/product/config/excel/template`, {
        method: 'GET',
        responseType: 'blob',
    });
}