/*
 * @Author: wangrui
 * @Date: 2022-08-18 14:27:26
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-08-18 14:27:36
 */
import { request } from 'umi';

//获取假冒侵权报告单列表
export async function getListData(data) {
    return request('/api/oims/counterfeitRegistrationFormController/list', {
        method: 'POST',
        data,
    });
}
// 审批枚举
export function statusEnum() {
    return request(`/api/oims/check/report/statusEnum`, {
        method: 'GET'
    });
}