import React, { useState, useEffect, useContext } from 'react';
import { Link, Route, Switch, Redirect, withRouter } from 'react-router-dom';

// Context
import GlobalContainer, { GlobalContext } from 'contexts/global';

// config
import { III_VERSION } from 'config';

// icon
import user from 'assets/images/user.svg';
import notification from 'assets/images/notification.svg';
import settings from 'assets/images/settings.svg';

// DesignSystem
import NILMPopup from 'components/DesignSystem/NILMPopup';
import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';
// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Menu = ({ match, location, history, menuList, logoutAPI }) => {
    const [list, setList] = useState([]);
    const [isClick, setIsClick] = useState('/main');

    const { REACT_APP_VERSION_2, REACT_APP_VERSION_3, GETNILM001API } = useContext(GlobalContext);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);

    const clickMenu = (key, path) => {
        let parts = path.split('/');
        setIsClick(`/${parts[1]}`);

        history.push({
            ...location,
            pathname: `${path}`
        });
    };

    const logout = () => {
        logoutAPI();
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
    const closeMessage = () => closeDialog();

    useEffect(() => {
        setList(menuList);
    }, []);

    useEffect(() => {
        let parts = location.pathname.split('/');
        setIsClick(`/${parts[1]}`);
        console.log(`router: ${parts[1]}`);
    }, [location]);

    return (
        <div className={cx('menu')}>
            <div className={cx('top')}>
                <div className={cx('menu_Logo')}>
                    <img src={require(`assets/images/iii.png`)} alt="logo" />
                    <p className={cx('logo_name')}>財團法人資訊工業策進會</p>
                    <p className={cx('line')} />
                    <p>故障檢測與資料品質管理系統</p>
                    {/* Prognostic and Data Quality Management */}
                    <span>v.{III_VERSION}</span>
                </div>
                <ul>
                    {list.length > 0 &&
                        list.map((data, index) => {
                            return (
                                <div key={index}>
                                    <li className={cx('menu_title')}>{data.title}</li>
                                    {data.children.map((item, index) => {
                                        return (
                                            <li
                                                className={cx('link', item.path === isClick && 'menu_active')}
                                                onClick={() => clickMenu(index, item.path)}
                                                key={index}
                                                index={index}
                                            >
                                                <Link to={item.path}>
                                                    {item.icon}
                                                    <span className={cx('menu_icon')}></span>
                                                    <span>{item.name}</span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </div>
                            );
                        })}
                </ul>
            </div>
            <div className={cx('bottom')}>
                {REACT_APP_VERSION_2 && (
                    <div className={cx('setting', 'user')} onClick={() => openNILMReportPopup()}>
                        <img alt="" src={notification} />
                        Notification
                    </div>
                )}
                {REACT_APP_VERSION_3 && (
                    <div className={cx('setting', 'user')} onClick={() => logout()}>
                        <img alt="" src={user} />
                        Account Logout
                    </div>
                )}
                {REACT_APP_VERSION_3 && (
                    <div className={cx('setting', 'user')}>
                        <img alt="" src={settings} />
                        Settings
                    </div>
                )}
            </div>
        </div>
    );
};

export default withRouter(Menu);
