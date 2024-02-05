import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

// antd
import { Input, InputNumber, Select, Tag, Alert, Popconfirm, Form, Table, Typography, Button, Space } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';

import moment from 'moment';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';
import EditableCell from 'components/DesignSystem/EditableCell';
import TableSearch from 'components/DesignSystem/TableSearch';
import UiLineChart from 'components/DesignSystem/LineChart';
import UiDoughnutChart from 'components/DesignSystem/DoughnutChart';
import Message from 'components/DesignSystem/Message';
import Loading from 'components/DesignSystem/Loading';

// API
import { getProblemStatusDetail001API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const LatestUserInfo = ({ history }) => {
    const [data, setData] = useState();
    const [lastTime, setLastTime] = useState('2023/12/20 14:41:29');
    const [editingKey, setEditingKey] = useState('');

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

    // get API 001
    const GETDETAIL001API = async () => {
        openLoading();
        const res = await getProblemStatusDetail001API();
        if (res.code === 200) {
            let tableItem = res.data.map((val, i) => {
                let updateTime = val.statusUpdateTime ? moment(val.statusUpdateTime).format('YYYY/MM/DD HH:mm') : '';
                return {
                    key: i.toString(),
                    uuid: val.uuid,
                    serialNumber: val.serialNumber,
                    name: val.name,
                    userId: val.userId,
                    detectedDate: moment(val.detectedDate).format('YYYY/MM/DD HH:mm'),
                    problem: val.problem,
                    status: val.status,
                    statusUpdateTime: updateTime,
                    note: val.note
                };
            });
            setData([...tableItem]);

            setTimeout(() => {
                closeLoading();
            }, 1000);
        } else {
            console.log('GETDETAIL001API error:', res);
        }
    };

    const asyncAllAPI = async () => {
        // version 1
        await GETDETAIL001API();
    };
    useEffect(() => {}, []);

    return (
        <div className={cx('eventDetail')}>
            <div className={cx('d_header')}>
                <div className={cx('d_icon')} onClick={() => history.goBack()}>
                    <LeftCircleOutlined style={{ fontSize: '20px', color: '#129797' }} />
                </div>
                <h1 className={cx('title')}>
                    今日用戶資訊 
                    {/* <span> | 最後一次更新 {lastTime}</span> */}
                </h1>
            </div>
            <div className={cx('chart', 'margin_top')}>
                <div className={cx('chart_60', 'chart_bg')}>
                    <UiLineChart title="分析圖一" />
                </div>
                <div className={cx('chart_40', 'chart_bg')}>
                    <UiDoughnutChart title="圓餅圖二" />
                </div>
            </div>
        </div>
    );
};

export default withRouter(LatestUserInfo);
