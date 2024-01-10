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

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Menu = ({ match, location, history, menuList, logoutAPI }) => {
    const [list, setList] = useState([]);
    const [isClick, setIsClick] = useState(0);

    const { REACT_APP_VERSION_2 } = useContext(GlobalContext);

    const clickMenu = (key, path) => {
        setIsClick(key);
        history.push({
            ...location,
            pathname: `${path}`
        });
    };

    const logout = () => {
        logoutAPI();
    };

    useEffect(() => {
        setList(menuList);
    }, []);

    return (
        <div className={cx('menu')}>
            <div className={cx('top')}>
                <div className={cx('menu_Logo')}>
                    <img src={require(`assets/images/iii.png`)} alt="logo" />
                    <p className={cx('logo_name')}>財團法人資訊工業策進會</p>
                    <p className={cx('line')} />
                    <p>設備故障與資料品質管理系統</p>
                    <span>v.{III_VERSION}</span>
                </div>
                <ul>
                    <li className={cx('menu_title')}>戰情室</li>
                    {list.map((item, index) => {
                        return (
                            <li
                                className={cx('link', index === isClick && 'menu_active')}
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
                </ul>
            </div>
            {REACT_APP_VERSION_2 && (
                <div className={cx('bottom')}>
                    <div className={cx('setting', 'user')} onClick={() => logout()}>
                        <img alt="" src={user} />
                        Account Logout
                    </div>
                    <div className={cx('setting', 'user')}>
                        <img alt="" src={notification} />
                        Notification
                    </div>
                    <div className={cx('setting', 'user')}>
                        <img alt="" src={settings} />
                        Settings
                    </div>
                </div>
            )}
        </div>
    );
};

export default withRouter(Menu);
