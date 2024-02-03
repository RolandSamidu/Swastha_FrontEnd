import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const PreStockCheckRoutes = [
    // Document Check Routes
    {
        path: '/prestockcheck',
        component: React.lazy(() => import('./PreStockCheck')),
        auth: authRoles.verifications,
    },
    {
        path: '/prestockcheckdisplay',
        component: React.lazy(() => import('./PreStockCheckDisplay')),
        auth: authRoles.verifications,
    },
    {
        path: '/prestockcheckdisplay',
        component: React.lazy(() => import('./PreStockCheckDisplay')),
        auth: authRoles.verifications,
    },
    {
        path: '/stockVerification/:id',
        component: React.lazy(() => import('./StockVerification')),
        auth: authRoles.verifications,
    },
    {
        path: '/stockTake',
        component: React.lazy(() => import('./StockTake')),
        auth: authRoles.verifications,
    },
    {
        path: '/stockAddItem',
        component: React.lazy(() => import('./StockAddItem')),
        auth: authRoles.verifications,
    },
    {
        path: '/stockDetailedView',
        component: React.lazy(() => import('./StockDetailedView')),
        auth: authRoles.verifications,
    },
    {
        path: '/preStockPackingDetails',
        component: React.lazy(() => import('./PreStockPackingDetails')),
        auth: authRoles.verifications,
    },
    {
        path: '/allAssignVerification',
        component: React.lazy(() => import('./AllAssignVerification')),
        auth: authRoles.verifications,
    },
    {
        path: '/myStock',
        component: React.lazy(() => import('./MyStock')),
        auth: authRoles.verifications,
    },


]

export default PreStockCheckRoutes;