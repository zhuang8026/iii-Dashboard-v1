import React, { lazy } from 'react';

import Home from 'components/pages/Home';
import EventDetail from 'components/pages/EventDetail';
import History from 'components/pages/History';
import LatestUserInfo from 'components/pages/LatestUserInfo';
import EnergyAnalysis from 'components/pages/EnergyAnalysis';

const privateRoutes = [
    {
        path: '/main',
        title: 'Data Analysis',
        component: Home,
        exact: true,
        authRequired: true,
        layouts: ['NavLeft']
    },
    {
        path: '/main/event-detail/:id?',
        title: 'Analysis Detail',
        component: EventDetail,
        exact: true,
        authRequired: true,
        layouts: ['NavLeft']
    },

    // version 2 - data analysis
    {
        path: '/history',
        title: 'History',
        component: History,
        exact: true,
        authRequired: true,
        layouts: ['NavLeft']
    },
    {
        path: '/history/event-detail/:id?',
        title: 'Analysis history Detail',
        component: EventDetail,
        exact: true,
        authRequired: true,
        layouts: ['NavLeft']
    },

    // version 2 - user analysis
    {
        path: '/latestUserInfo',
        title: 'Latest User Info',
        component: LatestUserInfo,
        exact: true,
        authRequired: true,
        layouts: ['NavLeft']
    },

     // version 3 - energy analysis
    {
        path: '/energyAnalysis',
        title: 'energy analysis',
        component: EnergyAnalysis,
        exact: true,
        authRequired: true,
        layouts: ['NavLeft']
    },

];

export default privateRoutes;
