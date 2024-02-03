import React from 'react'
import { authRoles } from '../../auth/authRoles'

const EMMRoutes = [
  
    {
        path: '/mro/patients/emmrsearch',
        component: React.lazy(() => import('../EMMR/EMMRSearch')),
        auth: authRoles.mro,
    },
]

export default EMMRoutes


