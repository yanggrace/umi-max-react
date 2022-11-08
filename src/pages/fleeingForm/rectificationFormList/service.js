/*
 * @Author: wangrui
 * @Date: 2022-08-25 16:45:41
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-08-26 10:07:48
 */
import { request } from '@umijs/max';

//获取产品价格基准得列表
export async function getRectifyPage(data) {
    return request('/api/oims/fleeing/rectify/form/page', {
        method: 'POST',
        data,
    });
}