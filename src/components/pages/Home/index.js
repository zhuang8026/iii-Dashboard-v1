import React, { Fragment, Suspense, useState, useEffect, useContext } from 'react';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Home = () => {
    return <div className={cx('home')}>Home</div>;
};

export default Home;
