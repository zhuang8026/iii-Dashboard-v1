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
// import { getProblemStatusDetail001API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EnergyAnalysis = ({ history }) => {
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

    // get API 001
    // const GETDETAIL001API = async () => {
    //     openLoading();
    //     const res = await getProblemStatusDetail001API();
    //     if (res.code === 200) {
    //         let tableItem = res.data.map((val, i) => {
    //             let updateTime = val.statusUpdateTime ? moment(val.statusUpdateTime).format('YYYY/MM/DD HH:mm') : '';
    //             return {
    //                 key: i.toString(),
    //                 uuid: val.uuid,
    //                 serialNumber: val.serialNumber,
    //                 name: val.name,
    //                 userId: val.userId,
    //                 detectedDate: moment(val.detectedDate).format('YYYY/MM/DD HH:mm'),
    //                 problem: val.problem,
    //                 status: val.status,
    //                 statusUpdateTime: updateTime,
    //                 note: val.note
    //             };
    //         });
    //         setData([...tableItem]);

    //         setTimeout(() => {
    //             closeLoading();
    //         }, 1000);
    //     } else {
    //         console.log('GETDETAIL001API error:', res);
    //     }
    // };

    // const asyncAllAPI = async () => {
    //     // version 1
    //     await GETDETAIL001API();
    // };
    // useEffect(() => {}, []);

    return (
        <div className={cx('energyAnalysis')}>
            <div className={cx('d_header')}>
                <h1 className={cx('title')}>能源局健康度檢視結果</h1>
            </div>
            <div className={cx('chart', 'margin_top')}>
                <div className={cx('chart_bg')}>
                    <div className={cx('download')}>
                        <h2>Stage 1. 用戶管理</h2>
                        <div className={cx('inner')}>
                            <div className={cx('card')}>
                                <h3>用戶登入</h3>
                                <div className={cx('result')}>
                                    <p>Normal</p>
                                    <div className={cx('status', 'normal')} />
                                </div>
                            </div>
                            <div className={cx('card')}>
                                <h3>忘記密碼</h3>
                                <div className={cx('result')}>
                                    <p>Normal</p>
                                    <div className={cx('status', 'normal')} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={cx('download')}>
                        <h2>Stage 2. 每週節電建議</h2>
                        <div className={cx('inner')}>
                            <div className={cx('card')}>
                                <h3>每週節電建議</h3>
                                <div className={cx('result')}>
                                    <p>Failed</p>
                                    <div className={cx('status', 'failed')} />
                                </div>
                            </div>
                            <div className={cx('card')}>
                                <h3>家庭用電流向</h3>
                                <div className={cx('result')}>
                                    <p>N/A</p>
                                    <div className={cx('status', 'na')} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(EnergyAnalysis);
