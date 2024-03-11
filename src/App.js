import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { Input, InputNumber, Select, Tag, Popconfirm, Form, Table, Typography, notification, Button } from 'antd';
import {AreaChartOutlined, HistoryOutlined, TeamOutlined, ThunderboltOutlined, BankOutlined, BellOutlined} from '@ant-design/icons';

// DesignSystem
import NoMatch from 'components/DesignSystem/NoMatch';
import Menu from 'components/DesignSystem/LeftMenu';
import Footer from 'components/DesignSystem/Footer';
import Loading from 'components/DesignSystem/Loading';
import NILMPopup from 'components/DesignSystem/NILMPopup';
import { FullWindowAnimateStorage, withFullWindowProvider, FullPopWindow } from 'components/DesignSystem/FullWindow';
import { PopWindowAnimateStorage, withPopWindowProvider, PopWindow } from 'components/DesignSystem/PopWindow';

// config
import privateRoutes from 'config/privateRoutes';
import outsideRoutes from 'config/routes';

// utils
import { getCookie, setCookie, eraseCookie } from 'utils/cookie';

// Context
// import AdminContainer, { AdminContext } from 'contexts/admin';
import GlobalContainer, { GlobalContext } from 'contexts/global';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

function App({ match, location, history }) {
    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);

    const { REACT_APP_VERSION_1, REACT_APP_VERSION_2, REACT_APP_VERSION_3, GETNILM001API } = useContext(GlobalContext);
    // const { admin } = useContext(AdminContext);
    const [layouts, setLayouts] = useState([]);
    const [menuList, setMenuList] = useState([]);

    const isAuth = getCookie('iii_token'); // cookie testing
    // const CookiesRole = getCookie('iii_role');

    // 不需要 auth 的路由
    const OutsideRoutes = () => {
        return outsideRoutes.map((route, key) => (
            <Route
                key={`route_${key}`}
                path={`${route.path}`}
                exact={route.exact}
                sensitive
                render={() => {
                    document.title = `III | ${route.title}`;
                    return <route.component localeMatch={match} routeData={route} />;
                }}
            />
        ));
    };

    // 需要 auth 的路由
    const PrivateRoutes = () => {
        // Redirect if not authenticated
        if (!isAuth) {
            return <Redirect to="/login" />;
        }

        return privateRoutes.map((route, key) => (
            <Route
                key={`route_${key}`}
                path={`${route.path}`}
                exact={route.exact}
                sensitive
                render={() => {
                    document.title = `III Dashboard | ${route.title}`;
                    return <route.component localeMatch={match} routeData={route} />;
                }}
            />
        ));
    };

    // 重定向 路由
    const RedirectRouter = () => {
        // version 2
        if (REACT_APP_VERSION_2) {
            // 已登出 -> 重定向 "/login"
            if (isAuth == null) {
                return <Redirect to="/login" />;
            } else {
                // 已登入 -> 重定向 "/main"
                return <Redirect from="*" to="/main" />;
            }
        }
    };

    // menu (layout & url)
    const getLayoutsCallBack = () => {
        // if (REACT_APP_VERSION_3) {
        if (isAuth) {
            privateRoutes.map((route, key) => {
                let layoutPath = [];
                layoutPath.push(route.path.split('/')[1]);
                if (layoutPath[0].toUpperCase() === history.location.pathname.split('/')[1].toUpperCase()) {
                    setLayouts(prev => {
                        return [...prev, ...route.layouts];
                    });
                    console.log('get menu');
                } else {
                    console.log('no fund');
                }
            });
        } else {
            // no auth (token error)
            setLayouts([]);
        }
        // } else {
        //     privateRoutes.map((route, key) => {
        //         let layoutPath = [];
        //         layoutPath.push(route.path.split('/')[1]);

        //         if (layoutPath[0].toUpperCase() === location.pathname.split('/')[1].toUpperCase()) {
        //             setLayouts(route.layouts);
        //         } else {
        //             console.log('no fund');
        //         }
        //     });
        // }
    };

    const openNotification = async () => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button
                type="primary"
                size="middle"
                style={{ backgroundColor: '#129797' }}
                onClick={async () => {
                    notification.close(key);
                    await openNILMReportPopup();
                }}
            >
                查詢
            </Button>
        );
        notification.info({
            message: `NILM 報告通知`,
            description: '每日NILM報告已更新，請點擊本彈窗查詢，謝謝。🙂',
            placement: 'topRight',
            duration: 20,
            btn,
            key,
            icon: <BellOutlined style={{ color: '#129797' }} />
            // onClick: async () => {
            //     await openNILMReportPopup();
            // }
        });
    };

    // open nilm report popup
    const openNILMReportPopup = async () => {
        let data = await GETNILM001API(); // from global context API
        // 開啟提視窗（nilm result）
        openDialog({
            component: <NILMPopup data={data} closeMessage={closeMessage} />
        });
    };

    // 關閉提視窗（400、500、ERROR win）
    const closeMessage = (data = '') => {
        if (data === 'CLOSE_NILM_REPORT') {
            setCookie('CLOSE_NILM_REPORT', true); // 設定cookie
        }
        closeDialog();
    };

    // open loading
    const openLoading = () => {
        openAnimate({
            component: <Loading text="logout..." />
        });
    };

    // close loading
    const closeLoading = () => closeAnimate();

    const logoutAPI = () => {
        openLoading();
        setTimeout(() => {
            eraseCookie('iii_token');
            eraseCookie('iii_role');
            eraseCookie('iii_user');
            history.replace('/login');
            closeLoading();
        }, 1000);
    };

    useEffect(() => {
        let v1 = {
            title: '戰情室',
            children: [
                {
                    name: '每日異常資訊',
                    path: '/main',
                    icon: <AreaChartOutlined style={{ fontSize: '20px' }} />
                }
            ]
        };
        let v2 = {
            title: '戰情室',
            children: [
                {
                    name: '每日異常資訊',
                    path: '/main',
                    icon: <AreaChartOutlined style={{ fontSize: '20px' }} />
                },
                // version 2
                {
                    name: '歷史異常資訊',
                    path: '/history',
                    icon: <HistoryOutlined style={{ fontSize: '20px' }} />
                }
            ]
        };
        let v2_1 = {
            title: '用戶資訊',
            children: [
                {
                    name: '每日用戶資訊',
                    path: '/latestUserInfo',
                    icon: <TeamOutlined style={{ fontSize: '20px' }} />
                }
            ]
        };

        let v3 = {
            title: '網站品質檢測',
            children: [
                {
                    name: '能源局健康度',
                    path: '/energyAnalysis',
                    icon: <ThunderboltOutlined style={{ fontSize: '20px' }} />
                },
                {
                    name: '新北市健康度',
                    path: '/lowcarbonAnalysis',
                    icon: <BankOutlined style={{ fontSize: '20px' }} />
                }
            ]
        };

        setMenuList((prev, next) => {
            console.log('REACT_APP_VERSION_1:', REACT_APP_VERSION_1);
            console.log('REACT_APP_VERSION_2:', REACT_APP_VERSION_2);
            console.log('REACT_APP_VERSION_3:', REACT_APP_VERSION_3);
            if (REACT_APP_VERSION_1) {
                if (REACT_APP_VERSION_2) {
                    prev = [
                        v2, // 戰情室
                        v2_1, // 網站品質檢測
                        v3 // 網站品質檢測
                    ];
                    // 用戶資訊 暫未規劃，先隱藏
                    // if (REACT_APP_VERSION_3) {
                    //     prev = [v2, v3];
                    // } else {
                    //     prev = [v2];
                    // }
                } else {
                    prev = [v1];
                }
            }
            return prev;
        });
    }, []);

    // check auth render menu dom
    useEffect(() => {
        getLayoutsCallBack();
        // verison 2
        const CLOSE_NILM_REPORT = getCookie('CLOSE_NILM_REPORT');
        const III_TOKEN = getCookie('iii_token');
        if (!CLOSE_NILM_REPORT && III_TOKEN) {
            openNotification();
        }
    }, [isAuth]);

    return (
        <div className={cx('App')}>
            {/* Menu */}
            {layouts.indexOf('NavLeft') >= 0 && (
                <Suspense fallback={<></>}>
                    <Menu menuList={menuList} logoutAPI={logoutAPI} />
                </Suspense>
            )}

            {/* body */}
            <div className={cx('main', layouts.indexOf('NavLeft') == -1 && 'full_main')}>
                {/* 路由頁面 */}
                <Suspense fallback={<></>}>
                    <Switch location={location}>
                        {OutsideRoutes()} {/* 不需要 auth 的路由 */}
                        {PrivateRoutes()} {/* 需要 auth 的路由 */}
                        {RedirectRouter()} {/* 重定向 */}
                        <Route component={NoMatch} />
                    </Switch>
                </Suspense>
                {/* Footer */}
                <Suspense fallback={<></>}>
                    <Footer />
                </Suspense>
            </div>

            {/**
             * 可隨意添加 comment
             */}
            <FullPopWindow />
            <PopWindow />
        </div>
    );
}
export default withRouter(withFullWindowProvider(withPopWindowProvider(App)));
