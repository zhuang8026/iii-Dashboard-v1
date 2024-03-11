import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

// antd
// import { Input, InputNumber, Select, Tag, Alert, Popconfirm, Form, Table, Typography, Button, Space } from 'antd';
// import { LeftCircleOutlined } from '@ant-design/icons';

import moment from 'moment';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';
import UiButton from 'components/DesignSystem/Button';
import Message from 'components/DesignSystem/Message';
import Loading from 'components/DesignSystem/Loading';

// API
import { getUserData001API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const LatestUserInfo = ({ history }) => {
    // const [data, setData] = useState();
    const [lastTime, setLastTime] = useState('20234/02/15 14:41:29');
    // const [editingKey, setEditingKey] = useState('');

    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);

    // open loading
    const openLoading = () => {
        openAnimate({
            component: <Loading />
        });
    };

    // close loading
    const closeLoading = () => closeAnimate();

    const openMessage = (code, msg) => {
        openDialog({
            component: <Message code={code} msg={msg} closeMessage={closeMessage} />
        });
    };

    const closeMessage = () => closeDialog();

    // 合併 + 轉 .csv files
    const convertToCSV = mockData => {
        const header = Object.keys(mockData[0]).join(',');
        const rows = mockData.map(obj =>
            Object.values(obj)
                .map(val => (val === null ? '' : val))
                .join(',')
        );
        const csv = [header, ...rows].join('\n');
        // Add UTF-8 BOM to ensure proper encoding
        const csvContent = '\uFEFF' + csv;
        return csvContent;
    };

    // 點擊"下載"用戶資料
    const clickDownloadCSVFile = async () => {
        const mockData = await GETDETAIL001API();
        const csvContent = convertToCSV(mockData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const currentDate = moment().format('YYYYMMDD_HHmmss');
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentDate}_用戶資料.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    // get API 001
    const GETDETAIL001API = async () => {
        openLoading();
        const res = await getUserData001API();
        if (res.code === 200) {
            closeLoading();
            return res.data;
        } else {
            console.log('GETDETAIL001API error:', res);
            return [];
        }
    };

    // const asyncAllAPI = async () => {
    //     // version 1
    //     await GETDETAIL001API();
    // };
    // useEffect(() => {}, []);

    return (
        <div className={cx('eventDetail')}>
            <div className={cx('d_header')}>
                {/* <div className={cx('d_icon')} onClick={() => history.goBack()}>
                    <LeftCircleOutlined style={{ fontSize: '20px', color: '#129797' }} />
                </div> */}
                <h1 className={cx('title')}>
                    每日用戶資訊
                    {/* <span> | 最後一次更新 {lastTime}</span> */}
                </h1>
            </div>
            <div className={cx('chart', 'margin_top')}>
                {/* <div className={cx('chart_60', 'chart_bg')}>用戶名單、登入紀錄、斷斷線顯示</div>
                <div className={cx('chart_40', 'chart_bg')}></div> */}
                <div className={cx('chart_100', 'chart_bg')}>
                    <div className={cx('download')}>
                        <h2>
                            用戶名單 <span> | 最後一次更新 {lastTime}</span>
                        </h2>
                        <div className={cx('inner')}>
                            <UiButton text="Download" onClick={() => clickDownloadCSVFile()} />
                        </div>
                    </div>
                    {/* <div className={cx('download')}>
                        <h2>
                            登入紀錄 <span> | 最後一次更新 {lastTime}</span>
                        </h2>
                        <div className={cx('inner')}>
                            <UiButton text="Download" />
                        </div>
                    </div>
                    <div className={cx('download')}>
                        <h2>
                            斷斷線顯示 <span> | 最後一次更新 {lastTime}</span>
                        </h2>
                        <div className={cx('inner')}>
                            <UiButton text="Download" />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default withRouter(LatestUserInfo);
