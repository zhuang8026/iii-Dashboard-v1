import { apiRequest } from 'api/apiRequest.js';
// 模拟开发环境
const isMockEnvironment = process.env.REACT_APP_ENV === 'development';

const ad_dashboard = 'ad_dashboard';

// main001 獲取即時資料
export const getProblemStatus001API = async () => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment ? `/mock/problem_status.json` : `/${ad_dashboard}/problem_status`;
    const res = await apiRequest('GET', url, true);
    return res;
};

export const getProblemStatus002API = async () => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment ? `/mock/user_connection_stats.json` : `/${ad_dashboard}/user_connection_stats`;
    const res = await apiRequest('GET', url, true);
    return res;
};

export const postProblemStatus003API = async playload => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment ? `/mock/problem_status.json` : `/${ad_dashboard}/problem_status`;
    const res = await apiRequest('POST', url, true, playload);
    return res;
};

// ------------------ event detail API ------------------
// event001 獲取即時細節資料
export const getProblemStatusDetail001API = async () => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment ? `/mock/problem_status_detail.json` : `/${ad_dashboard}/problem_status`;
    const res = await apiRequest('GET', url, true);
    return res;
};

// ------------------ history API ------------------
// history001 獲取歷史資料
export const getHistory001API = async (days, startTime, endTime) => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment
        ? days === 1
            ? `/mock/problem_status_1day.json`
            : days === 7
            ? `/mock/problem_status_7days.json`
            : days === 30
            ? `/mock/problem_status_30days.json`
            : `/mock/problem_status.json`
        : `/${ad_dashboard}/problem_status?startTime=${startTime}&endTime=${endTime}`;
    const res = await apiRequest('GET', url, true);
    return res;
};

// history002 獲取歷史圖表資料
export const getHistory002API = async (days, startTime, endTime) => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment
        ? `/mock/problem_status.json`
        : `/${ad_dashboard}/problem_status?startTime=${startTime}&endTime=${endTime}`;
    const res = await apiRequest('GET', url, true);
    return res;
};

// history003 獲取歷史圖表資料
export const getHistory003API = async (days, startTime, endTime) => {
    // 如果是开发环境，直接返回模拟数据
    const url = isMockEnvironment
        ? `/mock/problem_status.json`
        : `/${ad_dashboard}/problem_status?startTime=${startTime}&endTime=${endTime}`;
    const res = await apiRequest('GET', url, true);
    return res;
};
