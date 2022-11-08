import {request} from '@umijs/max';

//获取当前用户
export async function queryCurrentUser(options) {
  return request('/api/system/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

//登录
export async function login({username, password}) {
  return request('/api/oauth2/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic cG9ydGFsOjEyMzQ1Ng==',
    },
    params: {
      grantType: 'password',
      username: username,
      password: password,
      grant_type: 'password',
    },
  });
}

// 获取当前登录人所在大区和/分办
export function regionBranch() {
  return request(`/api/oims/common/user/region/branch`, {
    method: 'GET',
  });
}

// 假冒侵权 窜货 价格异常获取status的接口
export function getStatusList() {
  return request(`/api/oims/consumer/statusType`, {
    method: 'GET',
  });
}

// 假冒 窜货 价格异常 移交接口
export function saveTransfer(data) {
  return request(`/api/oims/fleeing/submission/backend/saveTransfer`, {
    method: 'POST',
    data,
  });
}

//获取事业部下所有人员
export async function getSuperUsers(params) {
  return request(`/api/oims/forensics/user/assign/supervision/user`, {
    method: 'GET',
    params,
  });
}

// 获取所有大区-事业部
export function getAllArea() {
  return request(`/api/oims/common/allArea`, {
    method: 'GET',
  });
}

// 获取满意度
export function getCommentList() {
  return request(`/api/oims/processEvaluation/attitudeEnum`, {
    method: 'GET',
  });
}

// 保存评价
export function saveEvaluation(data) {
  return request(`/api/oims/processEvaluation/saveEvaluation`, {
    method: 'POST',
    data,
  });
}
