import React, { useState, useEffect, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Footer = () => {
    return <div className={cx('footer')}>版權所有 ©2023財團法人資訊工業策進會，未經允許，請勿轉載</div>;
};

export default Footer;
