import React from 'react'
import { authRoles } from '../../auth/authRoles'

const AptituteRoutes = [

    {
        path: '/aptitutetest/all',
        component: React.lazy(() => import('./AllTest')),
        auth: authRoles.aptituteTestView,
    },
    {
        path: '/dashboard',
        component: React.lazy(() => import('./Dash')),
        //auth: authRoles.dashboard,
    },
    {
        path: '/dashboardtemp',
        component: React.lazy(() => import('./Create')),
        auth: authRoles.aptituteTestCreate,
    },
    {
        path: '/grn/dataupload',
        component: React.lazy(() => import('./GRNDataUploadNew')),
        auth: authRoles.grnDataUpload,
    },
    {
        path: '/stock/stock-update',
        component: React.lazy(() => import('./ManualStockUpdate')),
        auth: authRoles.manual_stock_update,
    },
    {
        path: '/estimation/hospital_estimations',
        component: React.lazy(() => import('./HospitalEstimation')),
        auth: authRoles.manual_stock_update,
    },
    {
        path: '/grn/datauploadold',
        component: React.lazy(() => import('./GRNDataUpload')),
        auth: authRoles.grnDataUpload,
    },
    {
        path: '/testFileUpload',
        component: React.lazy(() => import('./TestFileUpload')),
        auth: authRoles.grnDataUpload,
    },
    {
        path: '/createNotice',
        component: React.lazy(() => import('./CreateNotice')),
        auth: authRoles.dashboard,
    },
]

export default AptituteRoutes
