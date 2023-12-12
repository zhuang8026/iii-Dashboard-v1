import React, { lazy } from 'react';
// import { getBooleanFromENV } from 'components/utils';

import Home from 'components/pages/Home';
import History from 'components/pages/History';

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
        path: '/history',
        title: 'History',
        component: History,
        exact: true,
        authRequired: false,
        layouts: [''],
    },
];

export default routes;
