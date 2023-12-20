import React, { useState, useEffect, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EventDetail = () => {
    return (
        <div className={cx('eventDetail')}>
            <h1>VERSION 2.0</h1>
            <h2>Sorry, Page Not Found - Event Detail</h2>
        </div>
    );
};

export default withRouter(EventDetail);
