import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

// antd
// import { Rate } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Button = ({ onClick = () => {}, text = 'OK' }) => {
    return (
        <div className={cx('button')} onClick={() => onClick()}>
            {text}
        </div>
    );
};

export default Button;
