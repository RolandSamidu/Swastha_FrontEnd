import React from 'react'
import { authRoles } from '../../auth/authRoles'

const dashboardRoutes = [

    {
        path: '/dashboard2',
        component: React.lazy(() => import('./DashboardNew')),
        auth: authRoles.dashboard,
    },
    {
        path: '/dashboard3',
        component: React.lazy(() => import('./DashboardNew')),
        //auth: authRoles.dashboard,
    },
    {
        path: '/dashboardtem',
        component: React.lazy(() => import('./ReportDashboard')),
        //auth: authRoles.dashboard,
    },
    {
        path: '/smart_dashboard',
        component: React.lazy(() => import('./SmartDashboard')),
        auth: authRoles.prescription,
    },
    {
        path: '/patient_summary',
        component: React.lazy(() => import('./PatientSummary')),
        auth: authRoles.prescription,
    },
    {
        path: '/patient_summary_new',
        component: React.lazy(() => import('./Summary/PatientSummaryNew')),
        auth: authRoles.prescription,
    },
    {
        path: '/dashboardTemp',
        component: React.lazy(() => import('./DashboardTemp')),
        auth: authRoles.dashboard,
    },
    {
        path: '/ehrData/:patientId',
        component: React.lazy(() => import('./Summary/EHRData')),
        auth: authRoles.dashboard,
    },
    {
        path: '/stockPosistionChart',
        component: React.lazy(() => import('./DashboardComponents/StockPositionChart')),
        auth: authRoles.dashboard,
    },



]

export default dashboardRoutes
