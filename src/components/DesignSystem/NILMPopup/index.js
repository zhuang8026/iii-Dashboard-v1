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
                    {data.map((item, index) => {
                        return (
                            <div className={cx('fun', item.status === 'PASS' ? 'safe' : 'danger')} key={index}>
                                {item.icon}
                                <p>{item.type}</p>
                                <p className={cx('time')}>{item.updateTime}</p>
                                <p className={cx('result')}>
                                    {item.status === 'PASS' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                    {item.status}
                                </p>
                            </div>
                        );
                    })}

                    {/* <div className={cx('fun', 'danger')}>
                        <SearchOutlined />
                        <p>電器運轉辨識</p>
                        <p className={cx('time')}>2023/12/12 00:00</p>
                        <p className={cx('result')}>
                            <CloseCircleOutlined /> WARNING
                        </p>
                    </div> */}
                </div>
                <div className={cx('btn')}>
                    <UiButton onClick={closeMessage} />
                </div>
            </div>
        </div>
    );
};

export default NILMPopup;
