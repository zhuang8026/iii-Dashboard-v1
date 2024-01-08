import React, { lazy } from 'react';

import Login from 'components/pages/Admin/Login';

const routes = [
    {
        path: '/login',
        title: 'Login',
        component: Login,
        exact: true,
        authRequired: false,
        layouts: ['']
    }
];

export default routes;
