import React from 'react'
import { authRoles } from '../../auth/authRoles'

const NoticesRoutes = [
  
    {
        path: '/registerExternalCustomers',
        component: React.lazy(() => import('./RegisterExternalCustomers')),
        auth: authRoles.msd_dataSetup,
    },
  
]

export default NoticesRoutes