import React from 'react'
import { authRoles } from '../../auth/authRoles'

const DrugBalancingRoutes = [
    {
        path: '/drugbalancing/druglist/countable', 
        component: React.lazy(() => import('./DrugListUpdate')),
        auth: authRoles.drugBalancingWithiutDK,
    },
    {
        path: '/drugbalancing/druglist/report',
        component: React.lazy(() => import('./DrugListReport')),
        auth: authRoles.drugBalancing,
    },
    {
        path: '/drugbalancing/druglist/bulkreport',
        component: React.lazy(() => import('./BulkReport')),
        auth: authRoles.drugBalancing,
    },
    {
        path: '/drugbalancing/history/:id',
        component: React.lazy(() => import('./DrugReportHistory')),
        auth: authRoles.drugBalancing,
    },
    {
        path: '/drugbalancing/detailedview',
        component: React.lazy(() => import('./DetailedView')),
        auth: authRoles.item_master_view,
    },
    // {
    //     path: '/mro/patients/search',
    //     component: React.lazy(() => import('./MROPatientsSearch')),
    //     auth: authRoles.mro,
    // },
]

export default DrugBalancingRoutes
