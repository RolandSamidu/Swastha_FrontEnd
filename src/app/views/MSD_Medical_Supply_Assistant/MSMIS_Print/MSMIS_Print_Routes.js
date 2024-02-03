import React from 'react'
import { authRoles } from 'app/auth/authRoles'

const MSMIS_Print = [

    {
        path: '/msmis_print',
        component: React.lazy(() => import('./RMSD_Print')),
        auth: authRoles.supply_assistant,
    },
]

export default MSMIS_Print