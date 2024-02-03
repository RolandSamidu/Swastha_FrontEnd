import React from 'react'
import { authRoles } from '../../auth/authRoles'

const voucherRoutes = [
    {
        path: '/voucher/spc-report',
        component: React.lazy(() => import('./SPC_Report')),
        auth: authRoles.spc_report,
    },
    {
        path: '/voucher/sales_order',
        component: React.lazy(() => import('./Sales_Order')),
        auth: authRoles.voucher,
    },
    {
        path: '/voucher/vote-data-setup',
        component: React.lazy(() => import('./VoteDataSetup')),
        auth: authRoles.voucher,
    },
    {
        path: '/voucher/view',
        component: React.lazy(() => import('./VoucherView')),
        auth: authRoles.printvoucher,
    },
    {
        path: '/cheque/view',
        component: React.lazy(() => import('./ChequeView')),
        auth: authRoles.printvoucher,
    },
    {
        path: '/voucher/view-cheque',
        component: React.lazy(() => import('./CheckPrint')),
        auth: authRoles.printvoucher,
    },

    {
        path: '/sales_report',
        component: React.lazy(() => import('./SalesReport')),
        auth: authRoles.voucher,
    },
    {
        path: '/created_sales_report',
        component: React.lazy(() => import('./CreatedSalesReports')),
        auth: authRoles.voucher,
    },
]

export default voucherRoutes
