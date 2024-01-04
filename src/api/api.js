import { apiRequest } from 'api/apiRequest.js';
// 模拟开发环境
const isMockEnvironment = process.env.REACT_APP_ENV === 'development';

const ad_dashboard = 'ad_dashboard';
// test001 獲取分頁資料
// export const test001API = () => {
//     // 如果不是开发环境，返回实际的 API 调用
//     return {
//         method: 'GET',
//         baseURL: DOMAIN,
//         url: 'products/allpens',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//         }
//     };
// };

// test001 獲取即時資料
export const getProblemStatus001API = async () => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment ? `/mock/problem_status.json` : `/${ad_dashboard}/problem_status`;
    const res = await apiRequest('GET', url, true);
    return res;
};

export const getProblemStatus002API = async () => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment ? `/mock/problem_status.json` : `/${ad_dashboard}/problem_status`;
    const res = await apiRequest('GET', url, true);
    return res;
};

export const postProblemStatus003API = async playload => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment ? `/mock/problem_status.json` : `/${ad_dashboard}/problem_status`;
    const res = await apiRequest('POST', url, true, playload);
    return res;
};
