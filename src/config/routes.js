import React, { lazy } from 'react';
// import { getBooleanFromENV } from 'components/utils';

import Home from 'components/pages/Home';
import Admin from 'components/pages/Admin';

const routes = [
    {
        path: '/',
        title: 'Home',
        component: Home,
        exact: true,
        authRequired: false,
        layouts: ['NavLeft'],
    },
    {
        path: '/admin',
        title: 'Admin',
        component: Admin,
        exact: true,
        authRequired: false,
        layouts: [''],
    },
];

export default routes;
