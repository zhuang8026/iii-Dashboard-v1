import React from 'react';
import ReactDOM from 'react-dom';

// HashRouter: 頁面路徑最前面會有個「#」，換url時不會發送request。
// BrowserRouter: 頁面路徑不會有井字，但換url時會發送request。
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';

// contexts
import GlobalContainer from 'contexts/global';
import AdminContainer from 'contexts/admin';

import { ConfigProvider } from 'antd';

// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment';
import 'moment/locale/zh-tw';
import locale from 'antd/es/locale/zh_TW';

import 'assets/scss/_all.scss';
import 'assets/scss/style.datepicker.scss'; // framework: "react-datepicker": "^4.24.0"
import 'antd/dist/antd.css'; // or "antd": "^4.7.2"

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <ConfigProvider locale={locale}>
                <GlobalContainer>
                    <AdminContainer>
                        <App />
                    </AdminContainer>
                </GlobalContainer>
            </ConfigProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
