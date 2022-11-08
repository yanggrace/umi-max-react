import { request } from '@umijs/max';

//获取所有人员信息
export async function getUsers(params) {
    return request('/api/oims/forensics/user/assign/supervision/page', {
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

// //获取所有事业部
// export async function getRegion() {
//     return request(`/api/oims/common/allArea`, {
//         method: 'GET',
//     });
// }

//获取事业部下所有人员
export async function getAssignUsers(params) {
    return request(`/api/oims/forensics/user/assign/supervision/center/user`, {
        method: 'GET',
        params
    });
}

//保存人员数据
export async function saveAssignUsers(params) {
    return request(`/api/oims/forensics/user/assign/supervision`, {
        method: 'POST',
        data: params
    });
}

//删除人员数据
export async function deleteAssignUsers(params) {
    return request(`/api/oims/forensics/user/assign/supervision`, {
        method: 'DELETE',
        data: params
    });
}

//修改人员数据
export async function editAssignUsers(params) {
    return request(`/api/oims/forensics/user/assign/supervision`, {
        method: 'PUT',
        data: params
    });
}


//下载模板
export async function getExcelTemplate() {
    return request(`/api/oims/forensics/user/assign/supervision/excel/template`, {
        method: 'GET',
        responseType: 'blob',
    });
}