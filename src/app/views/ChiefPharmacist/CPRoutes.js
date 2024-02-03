import React from 'react'
import { authRoles } from '../../auth/authRoles'

const CPRoutes = [
    {
        path: '/chiefPharmacist/AllOders',
        // component: React.lazy(() => import('./CPAllOrders')),
        component: React.lazy(() => import('./tabs/tabs/CPAllOderss')),
        auth: authRoles.chief_pharmacist,
    },
    {
        path: '/chiefPharmacist/individualOrder/:id/:status',
        component: React.lazy(() => import('./tabs/CPIndividualOrder')),
        auth: authRoles.chief_pharmacist,
    },
    {
        path: '/chiefPharmacist/PendingOrders',
        // component: React.lazy(() => import('./CPAllOrders')),
        component: React.lazy(() => import('./tabs/tabs/CPPendingOrders')),
        auth: authRoles.chief_pharmacist,
    },
    {
        path: '/admin/PendingOrders',
        // component: React.lazy(() => import('./CPAllOrders')),
        component: React.lazy(() => import('./tabs/tabs/CPAllOders')),
        auth: authRoles.allOders,
    },
]

export default CPRoutes
