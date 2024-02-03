import React from 'react'
import { authRoles } from '../../auth/authRoles'

const RMSDRoutes = [
    {
        path: '/RMSD/AllOrders',
        component: React.lazy(() => import('./AllOrders')),
        auth: authRoles.mds,
    },
    {
        // path: '/RMSD/all-items/:id',
        path: '/RMSD/AllItems/:id',
        component: React.lazy(() => import('./IndividualOrder')),
        auth: authRoles.mds,
    }
]

export default RMSDRoutes
