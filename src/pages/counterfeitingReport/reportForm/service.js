import { request } from 'umi';
// 查询假冒侵权详情
export function counterfeitingDetails(id) {
    return request(`/api/oims/counterfeiting/counterfeitingDetails?id=${id}`, {
        method: 'GET'
    });
}
// 请求假冒侵权类型
export function counterfeit() {
    return request(`/api/oims/consumer/counterfeit`, {
        method: 'GET'
    });
}

// 请求信息来源
export function getInformationSources() {
    return request(`/api/oims/commissioner/getInformationSources`, {
        method: 'POST'
    });
}
// 查询省市区
export function getArea() {
    return request(`/api/oims/common/region/findAllRegionWithTreeRelation`, {
        method: 'GET'
    });
}
// 查询产品价格
export function getProductPrice(data) {
    return request(`/api/oims/product/basePrice/product/findProductPriceByProvinceCodeAndCityCodeAndProductCodeIn`, {
        method: 'POST',
        data
    });
}
// 保存/编辑
export function saveOrpdateFun(data,api) {
    return request(`/api/oims/counterfeitRegistrationFormController/${api}`, {
        method: 'POST',
        data
    });
}

// 查看详情
export function getDetailById(id) {
    return request(`/api/oims/counterfeitRegistrationFormController/queryById?id=${id}`, {
        method: 'GET'
    });
}