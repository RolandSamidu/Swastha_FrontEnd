import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const HeadPreStockCheckRoutes = [
    // Document Check Routes
    {
        path: '/headPreStockCheck',
        component: React.lazy(() => import('./HeadPreStockCheck')),
        auth: authRoles.dashboard,
    },

    {
        path: '/headPreStockDisplay',
        component: React.lazy(() => import('./HeadPreStockDisplay')),
        auth: authRoles.dashboard,
    },
    {
        path: '/headViewManage',
        component: React.lazy(() => import('./HeadViewManage')),
        auth: authRoles.dashboard,
    },
    {
        path: '/headPreStockManageDisplay',
        component: React.lazy(() => import('./HeadPreStockManageDisplay')),
        auth: authRoles.dashboard,
    },
    {
        path: '/headPreStockDetailView',
        component: React.lazy(() => import('./HeadPreStockDetailView')),
        auth: authRoles.dashboard,
    },
    {
        path: '/headStockTake',
        component: React.lazy(() => import('./HeadStockTake')),
        auth: authRoles.dashboard,
    },





]

export default HeadPreStockCheckRoutes;