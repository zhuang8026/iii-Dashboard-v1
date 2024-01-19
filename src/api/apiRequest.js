import axios from 'axios';
// import { getCookie } from '@/assets/js/util/cookie';
// import 'api/interceptors.js';

// const apiConfig = {
//     SERVER_JAVA: process.env.API_BASE, // https://www.energy-active.org.tw/api
//     SERVER_PYTHON: process.env.API_BASE_NEW // https://poc.energy-active.org.tw
// };

/**
 * desc: 設定 call API 前期作業 (setting token)
 * method: GET, POST, PATCH, PULL
 * url: '/main/login'
 * params: payload data
 * contentType: application/json
 * auth: has token ?
 * isPythonVersion: java server or python server
 * */
export const apiRequest = async (method, url, auth, params = null) => {
    const headers = {
        // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        // 'Content-Type': 'application/json',
    };

    if (auth) {
        // const { token } = window.$nuxt.$store.state.user;
        // const USER_TOKEN = getCookie('iii_token'); // cookie testing
        const USER_TOKEN = 'WILLIAM_testing_12345678900987654321234567890987654321';
        headers.Authorization = `Bearer ${USER_TOKEN}`;
    }

    let env = process.env;
    let domain = 'http://none:none';

    switch (env.REACT_APP_ENV) {
        case 'development':
            domain = env.REACT_APP_API_DOMAIN_MOCK; // mock data
            break;
        case 'uat':
            domain = env.REACT_APP_API_UAT;
            break;
        case 'prod':
            domain = env.REACT_APP_API_DOMAIN;
            break;
        default:
            break;
    }

    try {
        const response = await axios({
            headers,
            method,
            url: domain + url,
            data: params
        });
        const { status, data } = response;
        if (status === 200) {
            return data;
        } else {
            console.log(`API ERROR: ${data.message}`);
        }
    } catch (error) {
        return error;
    }
};
