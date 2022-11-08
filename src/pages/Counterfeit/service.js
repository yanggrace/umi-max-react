import {request} from 'umi';

// 假冒侵权的列表
export async function getCounterfeitList(data) {
  return request(`/api/oims/counterfeiting/counterfeitingReport`, {
    method: 'POST',
    data,
  });
}

// 假冒侵权的详情页面
export async function getCounterfeitDetails(data) {
  return request(`/api/oims/counterfeiting/counterfeitingDetails?id=${data}`, {
    method: 'GET',
  });
}

// 导出文件
export const exportExcel = (params = {}) => {
  return request('/api/oims/counterfeiting/exportExcel', {
    method: 'POST',
    responseType: 'blob',
    data: params,
  });
};

// 判断是否能登记
export const isCreateCheckReport = (data) => {
  return request('/api/oims/counterfeitRegistrationFormController/isOrNo', {
    method: 'POST',
    data,
  });
};
