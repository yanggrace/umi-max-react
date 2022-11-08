import { request } from 'umi';

// 查询经销商分办
export function findByDealer(dealerCode) {
    return request(`/api/oims/common/findCompanyByDealer/${dealerCode}`, {
        method: 'GET'
    });
}

// 下载模板
export function downloadExcelTemplate() {
    return request(`/api/oims/dealerReportStock/downloadExcelTemplate`, {
        method: 'POST',
        responseType: 'blob',
    });
}
// 库存提报列表
export function getDealerStockReportPage(data) {
    return request(`/api/oims/dealerReportStock/getDealerStockReportPage`, {
        method: 'POST',
        data
    });
}
// 保存提报
export function saveReport(data) {
    return request(`/api/oims/dealerReportStock`, {
        method: 'POST',
        data
    });
}
// 分页查询产品
export function dealerStockProduct(data) {
    return request(`/api/oims/dealerStockProduct/page`, {
        method: 'POST',
        data
    });
}