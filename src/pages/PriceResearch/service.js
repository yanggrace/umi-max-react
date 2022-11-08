import {request} from 'umi';

//获取价格异常列表
export async function getPriceList(data) {
  return request('/api/oims/consumer/price/clue', {
    method: 'POST',
    data,
  });
}

// 导出文件
export const exportExcel = (params = {}) => {
  return request('/api/oims/consumer/price/export', {
    method: 'POST',
    responseType: 'blob',
    data: params,
  });
};

//获取价格异常详情
export async function getClueDetails(data) {
  return request(`/api/oims/consumer/price/${data}`, {
    method: 'GET',
  });
}

// 判断是否能创建
export const isCreateCheckReport = (data) => {
  return request('/api/oims/check/report/isCreateCheckReport', {
    method: 'POST',
    data,
  });
};
