import {request} from 'umi';

//获取产品价格基准得列表
export async function getBaseProductList(data) {
  return request('/api/oims/product/basePrice/page', {
    method: 'POST',
    data,
  });
}

// 获取品类
export async function getCategoryList(data) {
  return request('/api/oims/common/product/level', {
    method: 'GET',
  });
}

// 获取下一级的联动
export async function getNextList(data) {
  return request(`/api/oims/common/product/level/${data}`, {
    method: 'GET',
  });
}

// 查询省份
export async function getProvince(data) {
  return request(`/api/oims/common/region/province`, {
    method: 'GET',
  });
}

// 查询市
export async function getCity(data) {
  return request(`/api/oims/common/region/city?provinceCode=${data}`, {
    method: 'GET',
  });
}

// 查看详情
export async function getDetails(data) {
  return request(`/api/oims/product/basePrice/${data}`, {
    method: 'GET',
  });
}

// 删除记录
export async function deleteRecord(data) {
  return request(`/api/oims/product/basePrice`, {
    method: 'DELETE',
    data,
  });
}

// 新增记录
export async function addRecord(data) {
  return request(`/api/oims/product/basePrice`, {
    method: 'POST',
    data,
  });
}

// 编辑记录
export async function editRecord(data) {
  return request(`/api/oims/product/basePrice`, {
    method: 'PUT',
    data,
  });
}

// 获取产品编码系列
export async function getProductCodeList(data) {
  return request(`/api/oims/common/product/page`, {
    method: 'POST',
    data,
  });
}
