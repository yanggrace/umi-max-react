import { request } from 'umi';


// 获取所有大区-事业部
export function allArea() {
    return request(`/api/oims/common/allArea`, {
        method: 'GET'
    });
}
// 获取大区-事业部下的所有分公司
export function allCompany(areaId) {
    return request(`/api/oims/common/company/${areaId}`, {
        method: 'GET'
    });
}
// 根据分公司分页查询协议经销商
export function findContractDealerPage(data) {
    return request(`/api/oims/common/findContractDealerPage`, {
        method: 'POST',
        data: {
            current: 1,
            size: 5000,
            ...data
        }
    });
}
// 经销商提报管理中心
export function dealerReportManage(data) {
    return request(`/api/oims/dealerReportStock/dealerReportManage`, {
        method: 'POST',
        data
    });
}
// 查询经销商提报详情
export function getDealerStockReportDetail(data) {
    return request(`/api/oims/dealerReportStock/getDealerStockReportDetail`, {
        method: 'POST',
        data
    });
}
// 获取对比详情
export function getContrastDetail(data) {
    return request(`/api/oims/dealerReportStock/getContrastDetail`, {
        method: 'POST',
        data
    });
}






