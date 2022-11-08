/*
 * @Author: wangrui
 * @Date: 2022-08-29 09:00:16
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-09-08 12:07:30
 */
import { request } from 'umi';
// 查询省市区
export function getArea() {
    return request(`/api/oims/common/region/findAllRegionWithTreeRelation`, {
        method: 'GET'
    });
}
// 分页查询基准价维护的产品
export function getProductList(data) {
    return request(`/api/oims/product/basePrice/product/page`, {
        method: 'POST',
        data,
    });
}
// 渠道类型
export function channelTypeList() {
    return request(`/api/oims/fleeingReceivingFormController/channelType`, {
        method: 'GET',
    });
}
// 收货单新增
export function saveFleeingReceivingForm(data) {
    return request(`/api/oims/fleeingReceivingFormController/saveForm`, {
        method: 'POST',
        data,
    });
}
// 收货单编辑
export function updateFleeingReceivingForm(data) {
    return request(`/api/oims/fleeingReceivingFormController/updateForm`, {
        method: 'POST',
        data,
    });
}
// 根据分公司分页查询业务员
export function findSalesmanByOrgCode(data) {
    return request(`/api/oims/common/findSalesmanByOrgCode`, {
        method: 'POST',
        data,
    });
}
// 根据经销商查询业务员
export function dealerBranchUerInfo(code) {
    return request(`/api/oims/common/dealerBranchUerInfo?dealerCode=${code}`, {
        method: 'GET',
    });
}
// 获取详情
export function getDetail(id) {
    return request(`/api/oims//fleeingReceivingFormController/queryById?id=${id}`, {
        method: 'GET',

    });
}
