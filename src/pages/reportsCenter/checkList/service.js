import { request } from 'umi';
// 提报列表
export function reportPage(data) {
    return request(`/api/oims/check/report/page`, {
        method: 'POST',
        data
    });
}
// 查找经销商
export function queryAllPurchasers(data) {
    return request(`/api/oims/check/report/queryAllPurchasers`, {
        method: 'POST',
        data
    });
}
// 审批枚举
export function statusEnum() {
    return request(`/api/oims/check/report/statusEnum`, {
        method: 'GET'
    });
}