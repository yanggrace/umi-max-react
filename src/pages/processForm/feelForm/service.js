import { request } from 'umi';
// 查询产品数据
export function productPage(productName = '') {
    return request(`/api/oims/product/basePrice/product/page`, {
        method: 'POST',
        data: {
            current: 1,
            size: 100,
            productName
        }
    });
}
// 根据分办查找经销商
export function findContractDealerPage(orgCode = '') {
    return request(`/api/oims/common/findContractDealerPage`, {
        method: 'POST',
        data: {
            current: 1,
            size: 5000,
            orgCode
        }
    });
}
// 初始化数据
export function beginningData(data) {
    return request(`/api/oims/check/report/beginningData`, {
        method: 'POST',
        data
    });
}

// 请求产品单位
export function productUnit() {
    return request(`/api/oims/check/report/productUnit`, {
        method: 'GET'
    });
}

// 保存接口
export function saveCheckReportMain(data) {
    return request(`/api/oims/check/report/saveCheckReportMain`, {
        method: 'POST',
        data
    });
}
// 保存接口
export function getDealerByBoxCodeOrBotCode(data) {
    return request(`/api/oims/check/report/getDealerByBoxCodeOrBotCode`, {
        method: 'POST',
        data
    });
}
// 查看详情

export function reportInfo(data) {
    return request(`/api/oims/check/report/info`, {
        method: 'POST',
        data
    });
}