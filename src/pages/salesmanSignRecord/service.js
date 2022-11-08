/*
 * @Author: wangrui
 * @Date: 2022-09-13 10:08:55
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-09-15 12:13:21
 */
import { request } from 'umi';

// 获取所有的大区事业部
export function getAllArea() {
    return request(`/api/yh-hrpr/common/findAllArea`, {
        method: 'GET'
    });
}
// 获取所有的事业部下面的分公司
export function getCompanyByArea(id) {
    return request(`/api/yh-hrpr/common/findAllCompanyByArea?areaId=${id}`, {
        method: 'GET'
    });
}

// 考勤报表
export function reportPage(data) {
    return request(`/api/yh-hrpr/attendanceRecord/attendanceReportList`, {
        method: 'POST',
        data
    });
}
// 考勤明细
export function detailPage(data) {
    return request(`/api/yh-hrpr/attendanceRecord/attendanceRecordList`, {
        method: 'POST',
        data
    });
}
// 统计
export function attendanceStatistics(data) {
    return request(`/api/yh-hrpr/attendanceRecord/attendanceStatistics`, {
        method: 'POST',
        data
    });
}
// 导出
export function exportExcels(data) {
    return request(`/api/yh-hrpr/attendanceRecord/export`, {
        method: 'POST',
        responseType: 'blob',
        data
    });
}