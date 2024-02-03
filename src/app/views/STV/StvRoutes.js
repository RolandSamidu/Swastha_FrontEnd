import React from 'react'
import { authRoles } from '../../auth/authRoles'

const stvRoutes = [
    {
        path: '/individualSTV',
        component: React.lazy(() => import('./IndividualSTV')),
        auth: authRoles.prescription,
    },
    {
        path: '/allGatePasses',
        component: React.lazy(() => import('./AllGatePasses')),
        auth: authRoles.prescription,
    },
    {
        path: '/gatePassPickUp',
        component: React.lazy(() => import('./GatePassPickUp')),
        auth: authRoles.prescription,
    },
    {
        path: '/gatePassDeliver',
        component: React.lazy(() => import('./GatePassDeliver')),
        auth: authRoles.prescription,
    },


]

export default stvRoutes