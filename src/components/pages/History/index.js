import React, { Fragment, Suspense, useState, useEffect, useContext } from 'react';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const History = () => {
    return (
        <div className={cx('history')}>
            <h1>VERSION 2.0</h1>
            <h2>Sorry, Page Not Found - History</h2>
        </div>
    );
};

export default History;
