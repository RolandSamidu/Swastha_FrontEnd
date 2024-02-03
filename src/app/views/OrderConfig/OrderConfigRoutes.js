import React from 'react'
import { authRoles } from '../../auth/authRoles'

const OrderConfigRoutes = [
    {
        path: '/orderConfig/order-Config',
        component: React.lazy(() => import('./OrderConfig')),
        auth: authRoles.return_approval,
    },
    
]

export default OrderConfigRoutes