import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

import UiButton from 'components/DesignSystem/Button';

// antd
// import { Rate } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Message = ({ code = 'none', msg = 'none', closeMessage }) => {
    return (
        <div className={cx('message_bg')}>
            <div className={cx('message')}>
                <div className={cx('title')}>System prompts</div>
                <div className={cx('inner')}>
                    <div className={cx('msg')}>ERROR CODE: {code}</div>
                    <div className={cx('msg')}>{msg}</div>
                </div>
                <div className={cx('btn')}>
                    <UiButton onClick={closeMessage}/>
                </div>
            </div>
        </div>
    );
};

export default Message;
