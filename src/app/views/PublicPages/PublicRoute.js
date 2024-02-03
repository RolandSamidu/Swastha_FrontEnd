import React from 'react'
import { authRoles } from '../../auth/authRoles'

const PublicRoute = [

    {
        path: '/drugs_availability',
        component: React.lazy(() => import('./CheckOtherStocks')),
        //auth: authRoles.dashboard,
    },
  
]

export default PublicRoute
