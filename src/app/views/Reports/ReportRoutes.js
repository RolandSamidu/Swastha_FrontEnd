import React from 'react'
import { authRoles } from '../../auth/authRoles'

const reportRoutes = [

    {
        path: '/reports',
        component: React.lazy(() => import('./index')),
        auth: authRoles.report_generation,
    },

]

export default reportRoutes
