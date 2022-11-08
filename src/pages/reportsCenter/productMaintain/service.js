import { request } from 'umi';

// 分页查询产品
export function dealerStockProduct(data) {
    return request(`/api/oims/dealerStockProduct/page`, {
        method: 'POST',
        data
    });
}
// 保存产品
export function saveProduct(data) {
    return request(`/api/oims/dealerStockProduct`, {
        method: 'POST',
        data
    });
}

// 保存产品
export function deleteProduct(data) {
    return request(`/api/oims/dealerStockProduct`, {
        method: 'DELETE',
        data
    });
}