import React from 'react'
import { authRoles } from '../../auth/authRoles'

const RefferencesRoute = [

    {
        path: '/Refferences',
        component: React.lazy(() => import('./Refferences')),
        auth: authRoles.refferences,
    },
]

export default RefferencesRoute
