import React from 'react'
import { authRoles } from '../../auth/authRoles'

const fundRoutes = [
    {
        path: '/fund/fund-availability-data-setup',
        component: React.lazy(() => import('./AvailabilityDataSetup')),
        auth: authRoles.voucher,
    },
    {
        path: '/fund/fund-availability',
        component: React.lazy(() => import('./Availability')),
        auth: authRoles.voucher,
    },
]

export default fundRoutes
