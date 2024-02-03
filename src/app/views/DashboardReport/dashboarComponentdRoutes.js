import React from 'react'
import { authRoles } from '../../auth/authRoles'

const dashboarComponentdRoutes = [

    {
        path: '/dashboardComponent/report',
        component: React.lazy(() => import('./Report')),
        auth: authRoles.dashboardComponent,
    },

    {
        path: '/dashboardComponent/PharmaceuticalUpdate',
        component: React.lazy(() => import('./PharmaceuticalUpdate')),
        auth: authRoles.dashboardComponent,
    },
]

export default dashboarComponentdRoutes