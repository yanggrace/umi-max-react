import {request} from 'umi';

//获取窜货线索的列表
export async function getSmugglingList(data) {
  return request(`/api/oims/fleeing/submission/backend/queryPage`, {
    method: 'POST',
    data,
  });
}

//获取窜货详情
export async function getSmugglingDetails(data) {
  return request(`/api/oims/fleeing/submission/backend/${data}`, {
    method: 'GET',
  });
}

// 导出文件
export const exportExcel = (params = {}) => {
  return request('/api/oims/fleeing/submission/backend/excel/export', {
    method: 'POST',
    responseType: 'blob',
    data: params,
  });
};

// 判断是否能创建
export const isCreateCheckReport = (data) => {
  return request('/api/oims/check/report/isCreateCheckReport', {
    method: 'POST',
    data,
  });
};

// 获取产品信息
export const getForensicProducts = (data) => {
  return request('/api/oims/check/report/getForensicProducts', {
    method: 'POST',
    data,
  });
};

// 产品验证信息
export const checkProductCode = (data) => {
  return request('/api/oims/check/report/checkProductCode', {
    method: 'POST',
    data,
  });
};
