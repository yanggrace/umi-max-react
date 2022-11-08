import { request } from '@umijs/max';

//获取所有记录
export async function getPlans(params) {
    return request('/api/oims/routine/inspect/page', {
        method: 'POST',
        data: params
    });
}

//获取所有省
export async function getProvince() {
    return request('/api/oims/common/region/province', {
        method: 'GET',
    });
}

//获取所有市
export async function getCity(params) {
    return request('/api/oims/common/region/city', {
        method: 'GET',
        params
    });
}

//获取所有区
export async function getArea(params) {
    return request('/api/oims/common/region/area', {
        method: 'GET',
        params
    });
}

//获取所有事业部
export async function getRegion() {
    return request(`/api/oims/common/allArea`, {
        method: 'GET',
    });
}

//获取事业部下所有分公司
export async function getBranch(areaId) {
    return request(`/api/oims/common/company/${areaId}`, {
        method: 'GET',
    });
}

//获取事业部下所有人员
export async function getAssignUsers(params) {
    return request(`/api/oims/forensics/user/assign/supervision/user`, {
        method: 'GET',
        params
    });
}

//保存人员数据
export async function saveAssignUsers(params) {
    return request(`/api/oims/forensics/user/assign`, {
        method: 'POST',
        data: params
    });
}

//删除人员数据
export async function deleteAssignUsers(params) {
    return request(`/api/oims/forensics/user/assign`, {
        method: 'DELETE',
        data: params
    });
}

//修改人员数据
export async function editAssignUsers(params) {
    return request(`/api/oims/forensics/user/assign`, {
        method: 'PUT',
        data: params
    });
}

//查看详情
export async function getproductPage(params) {
    return request(`/api/oims/routine/inspect/product/page`, {
        method: 'POST',
        data: params
    });
}


//导出
export async function getExcelExport(params) {
    return request(`/api/oims/routine/inspect/export/excel`, {
        method: 'POST',
        data: params,
        responseType: 'blob',
    });
}