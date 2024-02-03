import React from 'react'
import { authRoles } from '../../auth/authRoles'

const StockInquiryRoutes = [

    {
        path: '/stockInquiry',
        component: React.lazy(() => import('./StockInquiryDashboard')),
        auth: authRoles.stockInquiry,
    },
    
]

export default StockInquiryRoutes
