import React from 'react'
import { authRoles } from '../../../../auth/authRoles'

const ARVRoutes = [

    {
        path: '/arv',
        component: React.lazy(() => import('./ARV')),
        auth: authRoles.prescription,
    },

]

export default ARVRoutes