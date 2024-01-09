import React, { useState, useEffect, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

import UiLineChart from 'components/DesignSystem/LineChart';
import UiDoughnutChart from 'components/DesignSystem/DoughnutChart';
import UiVisualMapChart from 'components/DesignSystem/VisualMapChart';
// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EventDetail = () => {
    return (
        <div className={cx('eventDetail')}>
            <h1 className={cx('title')}>
                即時數據分析細節 <span> | 後一次更新 2023/12/20 14:41:29</span>
            </h1>
            <div className={cx('chart')}>
                <UiLineChart />
            </div>
            <div className={cx('chart')}>
                <div className={cx('dchart')}>
                    <UiDoughnutChart />
                </div>
                <div className={cx('dchart')}>
                    <UiDoughnutChart />
                </div>
                <div className={cx('dchart')}>
                    <UiVisualMapChart />
                </div>
            </div>
        </div>
    );
};

export default withRouter(EventDetail);
