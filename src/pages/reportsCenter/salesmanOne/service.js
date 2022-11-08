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

// 业务员提报管理中心详情
export function getSalesmanReportDetail(data) {
    return request(`/api/oims/salesmanReportStock/getSalesmanReportDetail`, {
        method: 'POST',
        data
    });
}
// 经销商库存提报
export function dealerStockReport(data) {
    return request(`/api/oims/salesmanReportStock/dealerStockReport`, {
        method: 'POST',
        data
    });
}

// 业务员提报管理中心
export function salesmanReportManage(data, apiType) {
    let api = apiType == '3' ? 'salesmanReportManageForBranch' : 'salesmanReportManage'
    return request(`/api/oims/salesmanReportStock/${api}`, {
        method: 'POST',
        data
    });
}

// 导出
export function excelExport(data, apiType) {
    let api = apiType == '3' ? 'excelExportForBranch' : 'excelExport'
    return request(`/api/oims/salesmanReportStock/${api}`, {
        method: 'POST',
        responseType: 'blob',
        data
    });
}
