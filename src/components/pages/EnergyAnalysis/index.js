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
import { getEnergy001API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EnergyAnalysis = ({ history }) => {
    const [step, setStep] = useState({});

    // const [lastTime, setLastTime] = useState('20234/02/15 14:41:29');
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

    // get API Energy001API
    const GETEnergyStatus001API = async stepNumber => {
        openLoading();
        const res = await getEnergy001API(stepNumber);
        if (res.code === 200) {
            closeLoading();
            return res.data;
        } else {
            console.log('getEnergy001API error:', res);
        }
    };

    const asyncAllAPI = async () => {
        try {
            const stepTitles = ['用戶管理', '日常用電追蹤', '家庭能源報告', '管理用電', '客戶服務'];
            const step_all = await Promise.all(
                [1, 2, 3, 4, 5].map(async index => {
                    const content = await GETEnergyStatus001API(index);
                    return {
                        title: `Step${index}. ${stepTitles[index - 1]}`,
                        content,
                        key: index
                    };
                })
            );
            setStep(step_all);
        } catch (error) {
            console.error('API 调用出错：', error);
        }
    };

    useEffect(() => {
        asyncAllAPI();
    }, []);

    return (
        <div className={cx('energyAnalysis')}>
            <div className={cx('d_header')}>
                <h1 className={cx('title')}>能源局健康度檢視結果</h1>
            </div>
            <div className={cx('chart', 'margin_top')}>
                <div className={cx('chart_bg')}>
                    {step.length > 0 &&
                        step.map(item => {
                            return (
                                <div className={cx('group')} key={item.key}>
                                    <h2>{item.title}</h2>
                                    <div className={cx('inner')}>
                                        {item.content.map(el => {
                                            return (
                                                <div className={cx('card')}>
                                                    <h3>{el.pathName}</h3>
                                                    <div className={cx('result')}>
                                                        <p>{el.status}</p>
                                                        <div className={cx('status', el.status)} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default withRouter(EnergyAnalysis);
