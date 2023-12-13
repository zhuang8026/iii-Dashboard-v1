import React, { useState, useEffect, useContext } from 'react';
import { Link, Route, Switch, Redirect, withRouter } from 'react-router-dom';

import { AreaChartOutlined, HistoryOutlined } from '@ant-design/icons';

// config
import { III_VERSION } from 'config';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const CreateIcon = name => {
    let icon;
    switch (name) {
        case 'AreaChartOutlined':
            icon = <AreaChartOutlined />;
            break;
        case 'HistoryOutlined':
            icon = <HistoryOutlined />;
            break;
        default:
    }
    return icon;
};

const Menu = ({ match, location, history }) => {
    const [list, setList] = useState([]);
    const [isClick, setIsClick] = useState(0);

    const clickMenu = (key, path) => {
        setIsClick(key);
        history.push({
            ...location,
            pathname: `${path}`
        });
    };

    useEffect(() => {
        let menuList = [
            {
                name: '即時數據分析',
                path: '/',
                icon: 'AreaChartOutlined'
            },
            {
                name: '歷史資料',
                path: '/history',
                icon: 'HistoryOutlined'
            }
        ];
        setList(menuList);
    }, []);

    return (
        <div className={cx('menu')}>
            <div className={cx('menu_Logo')}>
                <img src={require(`images/iii.png`)} alt="logo" />
                <p>III Software Platform</p>
                <span>v.{III_VERSION}</span>
            </div>
            <ul>
                <li className={cx('menu_title')}>Dashboard</li>
                {list.map((item, index) => {
                    return (
                        <li
                            className={cx('link', index === isClick && 'menu_active')}
                            onClick={() => clickMenu(index, item.path)}
                            key={index}
                            index={index}
                        >
                            <Link to={item.path}>
                                {CreateIcon(item.icon)}
                                <span className={cx('menu_icon')}></span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default withRouter(Menu);
