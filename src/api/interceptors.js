import axios from 'axios';

// 模拟开发环境
const isMockEnvironment = process.env.REACT_APP_ENV === 'mock';

// 添加請求攔截器
axios.interceptors.request.use(req => {
    console.log('interceptors:', req);

    req.defaults.baseURL;

    // 如果是開發環境，將請求路由修改為本地模擬路由
    // if (isMockEnvironment) {
    //     req.url = `mock/demo.json`;
    // }
    return req;
});

// axios.interceptors.response.use(response => {
//     const res = response.data;
//     if (res.code !== 200) {
//         if (
//             res.code === 411 ||
//             res.code === 412 ||
//             res.code === 413 ||
//             res.code === 414 ||
//             res.code === 415 ||
//             res.code === 416 ||
//             res.code === 417 ||
//             res.code === 418 ||
//             res.code === 419 ||
//             res.code === 420 ||
//             res.code === 421 ||
//             res.code === 4000 ||
//             res.code === 4001 ||
//             res.code === 4002
//         ) {
//             window.$nuxt.$store.commit('user/CLEAR_USER_DATA');
//             if (window.$nuxt.$route.name !== 'login') {
//                 window.$nuxt.$router.push('/login');
//             }
//         }
//         if (res.code === 4011) {
//             window.$nuxt.$message({
//                 message: '登入逾時，請重新登入 (Login timed out, please login again.)',
//                 type: 'error'
//             });
//             window.$nuxt.$store.commit('user/CLEAR_USER_DATA');
//             if (window.$nuxt.$route.name !== 'login') {
//                 window.$nuxt.$router.push('/login');
//             }
//         }
//         if (res.code === 1402) {
//             window.$nuxt.$message({
//                 message: '驗證錯誤 (Error, verification failed.)',
//                 type: 'error'
//             });
//         }
//         if (
//             res.code === 4003 ||
//             res.code === 4004 ||
//             res.code === 4005 ||
//             res.code === 4006 ||
//             res.code === 4007 ||
//             res.code === 4008 ||
//             res.code === 4009 ||
//             res.code === 4010
//         ) {
//             window.$nuxt.$message({
//                 message: '權限錯誤 (Unauthorized.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 4012) {
//             window.$nuxt.$message({
//                 message: '資料權限錯誤 (Error, Data unauthorized.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5001) {
//             window.$nuxt.$message({
//                 message: '參數錯誤 (Error, Parameter not correct.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5002) {
//             window.$nuxt.$message({
//                 message: '轉換格式錯誤 (Error, parsing failed.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5003) {
//             window.$nuxt.$message({
//                 message: '金額計算錯誤 (Error, amount calculate error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5004) {
//             window.$nuxt.$message({
//                 message: '必要參數未填具 (Error, required parameter is not present.)',
//                 type: 'error'
//             });
//         }
//         // if (res.code === 5101
//         //   || res.code === 5102
//         //   || res.code === 5103
//         //   || res.code === 5104
//         //   || res.code === 5105
//         //   || res.code === 5106
//         // ) {
//         //   window.$nuxt.$message({
//         //     message: '儲存錯誤 (Error, saving data failed.)',
//         //     type: 'error',
//         //   });
//         // }
//         if (res.code === 5201) {
//             window.$nuxt.$message({
//                 message: '超過檔案數量限制 (Error, file number exceeds limit.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5202) {
//             window.$nuxt.$message({
//                 message: '檔案格式錯誤 (Error, file format not supported.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5203) {
//             window.$nuxt.$message({
//                 message: '超過檔案大小限制 (Error, file size limit exceeded.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5204) {
//             window.$nuxt.$message({
//                 message: '檔案複製錯誤 (Error, file can not be copied.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5205) {
//             window.$nuxt.$message({
//                 message: '檔案刪除錯誤 (Error, file can not be deleted.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5301) {
//             window.$nuxt.$message({
//                 message: '取得驗證碼錯誤 (Error, verify key length disqualified.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5302) {
//             window.$nuxt.$message({
//                 message: '驗證碼不存在 (Error, verify code does not exist.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5303) {
//             window.$nuxt.$message({
//                 message: '驗證碼比對錯誤 (Error, verify code does not match.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5304) {
//             window.$nuxt.$message({
//                 message: '姓名不可超過10個字元 (Error, length exceeds limit.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5305) {
//             window.$nuxt.$message({
//                 message: '手機格式錯誤 (Error, phone format error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5306) {
//             window.$nuxt.$message({
//                 message: '信箱格式錯誤 (Error, mail format error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5307) {
//             window.$nuxt.$message({
//                 message: '密碼檢測錯誤(Error, password error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5401) {
//             window.$nuxt.$message({
//                 message: '已付款,(Error, already paid.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5402) {
//             window.$nuxt.$message({
//                 message: '尚未付款,(Error, not paid.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5403) {
//             window.$nuxt.$message({
//                 message: '已閱讀,(Error, already read.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5501) {
//             window.$nuxt.$message({
//                 message: '帳號已存在(Error, account is existed.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5502) {
//             window.$nuxt.$message({
//                 message: '無此帳號請聯繫客服人員。',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5503) {
//             window.$nuxt.$message({
//                 message: '帳戶密碼錯誤(Error, password error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5504) {
//             window.$nuxt.$message({
//                 message: '帳戶已鎖住(Error, account is frozen.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5505) {
//             window.$nuxt.$message({
//                 message: '新密碼與舊密碼相同(Error, new passwords and old password are identical.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5506) {
//             window.$nuxt.$message({
//                 message: '短時間內頻繁操作(Error, Frequent operation in such short notice.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5507) {
//             window.$nuxt.$message({
//                 message: '重設密碼請求失效(Error, Expired reset password request error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5508) {
//             window.$nuxt.$message({
//                 message: '信件發送錯誤(Error, email send failed.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5509) {
//             window.$nuxt.$message({
//                 message: '帳號未啟用(Error, account is not activated.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5510) {
//             window.$nuxt.$message({
//                 message: '帳戶或密碼錯誤(Error, account or password error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5511) {
//             window.$nuxt.$message({
//                 message: '密碼變更錯誤(Error, password changed error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5512) {
//             window.$nuxt.$message({
//                 message: '密碼長度錯誤(Error, password length error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5513) {
//             window.$nuxt.$message({
//                 message: '確認新密碼與新密碼不符錯誤(Error, password re-entered error.)',
//                 type: 'error'
//             });
//         }
//         if (res.code === 5514) {
//             window.$nuxt.$message({
//                 message: '電話未與帳號綁定(Error, phone number is not allowed.)',
//                 type: 'error'
//             });
//         }
//     }

//     window.$nuxt.$emit('loading', false);
//     return response;
// });
