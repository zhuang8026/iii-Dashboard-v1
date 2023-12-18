import React, { useState, useEffect, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EventDetail = () => {
    return <div className={cx('eventDetail')}>EventDetail</div>;
};

export default EventDetail;
