import React, { useState, useEffect, useContext } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

// antd
import { notification } from 'antd';

// Context
import AdminContainer, { AdminContext } from 'contexts/admin';

// utils
import { setCookie } from 'utils/cookie';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import Loading from 'components/DesignSystem/Loading';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Login = ({ history }) => {
    const { admin } = useContext(AdminContext);
    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const [seeType, setSeeType] = useState('password');
    const [info, setInfo] = useState({
        user: '',
        pwd: '',
        role: '',
        token: ''
    });

    const setAdminInfo = (type, value) => {
        setInfo({ ...info, [type]: value });
    };

    const loginin = () => {
        openLoading();

        let checkUser = admin.filter(ele => ele.user === `${info.user}` && ele.pwd === `${info.pwd}`);
        if (checkUser.length > 0) {
            setCookie('iii_token', checkUser[0].token); // 設定cookie
            setCookie('iii_role', checkUser[0].role); // 設定role
            setCookie('iii_user', checkUser[0].user); // 設定role

            notification['success']({
                message: 'Success',
                description: 'Login successfully.'
            });

            history.replace('/main');
        } else {
            notification['error']({
                message: 'Error',
                description: 'Username or Password is wrong.'
            });
        }
        closeLoading();
    };

    // open loading
    const openLoading = () => {
        openAnimate({
            component: <Loading text="Login..." />
        });
    };

    // close loading
    const closeLoading = () => closeAnimate();

    const seePassword = () => {
        if (seeType === 'password') {
            setSeeType('text');
        } else {
            setSeeType('password');
        }
    };

    // const handleKeyPress = event => {
    //     if (event.key === 'Enter') {
    //         console.log('Enter key pressed');
    //         // 在这里执行你想要的操作

    //         loginin();
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener('keydown', handleKeyPress);

    //     return () => {
    //         document.removeEventListener('keydown', handleKeyPress);
    //     };
    // }, []);
    return (
        <div className={cx('login')}>
            <div className={cx('left')}>
                <div className={cx('introduce')}>
                    <div className={cx('title')}>Welcome to III PDM</div>
                    <div className={cx('inner')}>
                        Prognostic and Data Quality Management visualization tools centrally display and monitor key
                        business indicators (KPIs) and data. It usually uses visual elements such as charts, graphs,
                        tables, etc. to help users quickly understand and analyze relevant content information.
                    </div>

                    <img src={require('assets/images/loginin.png')} alt="iii" />
                </div>
            </div>
            <div className={cx('right')}>
                <div className={cx('login-page')}>
                    <div className={cx('title')}>Login</div>
                    <div className={cx('form')}>
                        <div className={cx('login-form')}>
                            <p className={cx('login-title')}>Account</p>
                            <input
                                type="text"
                                placeholder="username"
                                onChange={e => setAdminInfo('user', e.target.value)}
                            />

                            <p className={cx('login-title')}> Password</p>
                            <input
                                type={seeType}
                                placeholder="password"
                                onChange={e => setAdminInfo('pwd', e.target.value)}
                            />
                            <p className={cx('seePassword')} onClick={e => seePassword()}>
                                see password
                            </p>

                            <button onClick={() => loginin()}>Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withRouter(Login);
