import React from 'react'
import { authRoles } from '../../../../auth/authRoles'

const ProceduresRouts = [

    {
        path: '/procedures',
        component: React.lazy(() => import('./Procedures')),
        auth: authRoles.prescription,
    },
    {
        path: '/viewProcedures',
        component: React.lazy(() => import('./ViewProcedures')),
        auth: authRoles.prescription,
    },

]

export default ProceduresRouts