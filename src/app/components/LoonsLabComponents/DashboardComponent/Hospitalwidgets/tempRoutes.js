import React from 'react'
import { authRoles } from '../../../../auth/authRoles'

const tempRoutes = [
    {
        path: '/temp/widget',
        component: React.lazy(() => import('./UnservicerbleDrugs')),
        auth: authRoles.dashboard,
    }
]

export default tempRoutes
