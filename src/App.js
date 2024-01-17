import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { AreaChartOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';

// DesignSystem
import NoMatch from 'components/DesignSystem/NoMatch';
import Menu from 'components/DesignSystem/LeftMenu';
import Footer from 'components/DesignSystem/Footer';
import Loading from 'components/DesignSystem/Loading';
import { FullWindowAnimateStorage, withFullWindowProvider, FullPopWindow } from 'components/DesignSystem/FullWindow';
import { withPopWindowProvider, PopWindow } from 'components/DesignSystem/PopWindow';

// config
import privateRoutes from 'config/privateRoutes';
import outsideRoutes from 'config/routes';

// utils
import { getCookie, eraseCookie } from 'utils/cookie';

// Context
import GlobalContainer, { GlobalContext } from 'contexts/global';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

function App({ match, location, history }) {
    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { REACT_APP_VERSION_1, REACT_APP_VERSION_2, REACT_APP_VERSION_3 } = useContext(GlobalContext);
    const [layouts, setLayouts] = useState([]);
    const [menuList, setMenuList] = useState([]);

    const isAuth = getCookie('iii_token'); // cookie testing

    // all route
    const PrivateRoutes = () => {
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

    const Routes = () => {
        // version 2
        if (REACT_APP_VERSION_2) {
            if (!isAuth) {
                return <Redirect to="/login" />;
            }
        }

        return PrivateRoutes();
    };

    // layout & url
    const getLayoutsCallBack = () => {
        if (REACT_APP_VERSION_3) {
            if (isAuth) {
                privateRoutes.map((route, key) => {
                    let layoutPath = [];
                    layoutPath.push(route.path.split('/')[1]);

                    if (layoutPath[0].toUpperCase() === location.pathname.split('/')[1].toUpperCase()) {
                        setLayouts(route.layouts);
                    } else {
                        // console.log('no fund');
                    }
                });
            } else {
                // no auth (token error)
                setLayouts([]);
            }
        } else {
            privateRoutes.map((route, key) => {
                let layoutPath = [];
                layoutPath.push(route.path.split('/')[1]);

                if (layoutPath[0].toUpperCase() === location.pathname.split('/')[1].toUpperCase()) {
                    setLayouts(route.layouts);
                } else {
                    console.log('no fund');
                }
            });
        }
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
        let v3 = {
            title: '用戶資訊',
            children: [
                {
                    name: 'demo1',
                    path: '/demo1',
                    icon: <SettingOutlined style={{ fontSize: '20px' }} />
                },
                {
                    name: 'demo2',
                    path: '/demo2',
                    icon: <SettingOutlined style={{ fontSize: '20px' }} />
                }
            ]
        };

        setMenuList((prev, next) => {
            console.log('REACT_APP_VERSION_1:', REACT_APP_VERSION_1);
            console.log('REACT_APP_VERSION_2:', REACT_APP_VERSION_2);
            console.log('REACT_APP_VERSION_3:', REACT_APP_VERSION_3);
            if (REACT_APP_VERSION_1) {
                if (REACT_APP_VERSION_2) {
                    if (REACT_APP_VERSION_3) {
                        prev = [v2, v3];
                    } else {
                        prev = [v2];
                    }
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
                        {/* <Route exact path="/">
                            <Redirect to="/login" />
                        </Route> */}
                        {OutsideRoutes()}
                        {Routes()}
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
