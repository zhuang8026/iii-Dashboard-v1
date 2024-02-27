//react
import React, { lazy, useState, createContext, useEffect, useRef, useCallback, useContext } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

// import { getCookie } from 'utils/cookie';

export const AdminContext = createContext();

const AdminContainer = props => {
    const { history, location, match } = props;
    const [admin, setAdmin] = useState([
        {
            user: 'Asd@iii.org.tw',
            pwd: 'a1234567A@',
            token: '123456_abcdefghijk',
            role: 'normal'
        },
        {
            user: 'admin',
            pwd: '0987654321',
            token: '0987654321_abcdefghijk',
            role: 'admin'
        }
    ]);
    // const [isLoggedIn, setIsLoggedIn] = useState(false); // 載入專用

    // const isAuth = getCookie('iii_token'); // cookie testing

    useEffect(() => {}, []);

    return (
        <AdminContext.Provider
            value={{
                admin
            }}
        >
            {props.children}
        </AdminContext.Provider>
    );
};

export default withRouter(AdminContainer);
