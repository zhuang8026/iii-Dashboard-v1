import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

import UiButton from 'components/DesignSystem/Button';

// antd
// import { Rate } from 'antd';
import {
    BellOutlined,
    CloudUploadOutlined,
    SearchOutlined,
    WarningOutlined,
    CalculatorOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const NILMPopup = ({ data, closeMessage }) => {
    return (
        <div className={cx('nilm_bg')}>
            <div className={cx('nilm')}>
                <div className={cx('title')}>
                    <div className={cx('icon')}>
                        <BellOutlined />
                    </div>
                    NILM Report
                </div>
                <div className={cx('inner')}>
                    <div className={cx('fun', 'safe')}>
                        <CloudUploadOutlined />
                        <p>雲端數據</p>
                        <p className={cx('time')}>2023/12/12 00:00</p>
                        <p className={cx('result')}>
                            <CheckCircleOutlined /> PASS
                        </p>
                    </div>
                    <div className={cx('fun', 'danger')}>
                        <SearchOutlined />
                        <p>電器運轉辨識</p>
                        <p className={cx('time')}>2023/12/12 00:00</p>
                        <p className={cx('result')}>
                            <CloseCircleOutlined /> WARNING
                        </p>
                    </div>
                    <div className={cx('fun', 'safe')}>
                        <WarningOutlined />
                        <p>異常偵測</p>
                        <p className={cx('time')}>2023/12/12 00:00</p>
                        <p className={cx('result')}>
                            <CheckCircleOutlined /> PASS
                        </p>
                    </div>
                    <div className={cx('fun', 'safe')}>
                        <CalculatorOutlined />
                        <p>服務運算</p>
                        <p className={cx('time')}>2023/12/12 00:00</p>
                        <p className={cx('result')}>
                            <CheckCircleOutlined /> PASS
                        </p>
                    </div>
                </div>
                <div className={cx('btn')}>
                    <UiButton onClick={closeMessage} />
                </div>
            </div>
        </div>
    );
};

export default NILMPopup;
