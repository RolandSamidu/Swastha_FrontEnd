import React from 'react'
import { authRoles } from '../../auth/authRoles'

const GRNRoute = [

    {
        path: '/consignments/grn-items',
        component: React.lazy(() => import('./GRN_Details')),
        auth: authRoles.newlyArraived,
    },
]

export default GRNRoute
