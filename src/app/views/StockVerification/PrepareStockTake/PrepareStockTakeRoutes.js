import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const PrepareStockTakeRoutes = [
    // Document Check Routes
    {
        path: '/prepareStockTake',
        component: React.lazy(() => import('./PrepareStockTake')),
        auth: authRoles.dashboard,
    },

    {
        path: '/prepareStockTakeDisplay',
        component: React.lazy(() => import('./PrepareStockTakeDisplay')),
        auth: authRoles.dashboard,
    },

    {
        path: '/packingDetails',
        component: React.lazy(() => import('./PackingDetails')),
        auth: authRoles.dashboard,
    },

    {
        path: '/prepareDetailedView',
        component: React.lazy(() => import('./PrepareDetailedView')),
        auth: authRoles.dashboard,
    },

    {
        path: '/viewManageStock/:id',
        component: React.lazy(() => import('./ViewManageStock')),
        auth: authRoles.verifications,
    },

    {
        path: '/viewManageStockDisplay',
        component: React.lazy(() => import('./ViewManageStockDisplay')),
        auth: authRoles.dashboard,
    },
    {
        path: '/viewManageStockDetailed',
        component: React.lazy(() => import('./ViewManageStockDetailed')),
        auth: authRoles.dashboard,
    },
    {
        path: '/prepareAddItem',
        component: React.lazy(() => import('./PrepareAddItem')),
        auth: authRoles.dashboard,
    },
    {
        path: '/viewManageAddItem',
        component: React.lazy(() => import('./ViewManageAddItem')),
        auth: authRoles.dashboard,
    },



]

export default PrepareStockTakeRoutes;