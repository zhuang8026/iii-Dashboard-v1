import React, { lazy } from 'react';

import Home from 'components/pages/Home';
import EventDetail from 'components/pages/EventDetail';
import History from 'components/pages/History';

const privateRoutes = [
    {
        path: '/main',
        title: 'Data Analysis',
        component: Home,
        exact: true,
        authRequired: false,
        layouts: ['NavLeft']
    },
    {
        path: '/main/event-detail/:id?',
        title: 'Analysis Detail',
        component: EventDetail,
        exact: true,
        authRequired: false,
        layouts: ['NavLeft']
    },

    // version 2
    {
        path: '/history',
        title: 'History',
        component: History,
        exact: true,
        authRequired: false,
        layouts: ['NavLeft']
    }
];

export default privateRoutes;
