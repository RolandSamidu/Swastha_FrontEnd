import React from 'react'
import { authRoles } from '../../../../auth/authRoles'

const CardiovascularRoutes = [

    {
        path: '/pulse',
        component: React.lazy(() => import('./Pulse')),
        auth: authRoles.prescription,
    },
    {
        path: '/chestDeformities',
        component: React.lazy(() => import('./ChestDeformities')),
        auth: authRoles.prescription,
    },

]

export default CardiovascularRoutes