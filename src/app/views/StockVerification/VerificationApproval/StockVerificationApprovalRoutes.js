import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const StockVerificationApprovalRoutes = [
    // Document Check Routes
    {
        path: '/stock_verification_approval',
        component: React.lazy(() => import('./StockVerification')),
        auth: authRoles.Stock_verifications_approval,
    },
    {
        path: '/stock_Verification/approval_item_list/:id',
        component: React.lazy(() => import('./Tabs/ApprovalItemsView')),
        auth: authRoles.Stock_verifications_approval,
    },
    {
        path: '/stock_Verification/approval_item_batch_list/:id',
        component: React.lazy(() => import('./Tabs/ApprovalBatchView')),
        auth: authRoles.Stock_verifications_approval,
    },
]

export default StockVerificationApprovalRoutes;