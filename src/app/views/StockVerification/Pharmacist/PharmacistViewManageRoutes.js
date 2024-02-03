import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const PharmacistViewManageRoutes = [
    // Document Check Routes
    {
        path: '/pharmacistViewManage',
        component: React.lazy(() => import('./PharmacistViewManage')),
        auth: authRoles.dashboard,
    },

    {
        path: '/pharmacistViewManageDisplay',
        component: React.lazy(() => import('./PharmacistViewManageDisplay')),
        auth: authRoles.dashboard,
    },
    {
        path: '/pharmacistDetailView',
        component: React.lazy(() => import('./PharmacistDetailView')),
        auth: authRoles.dashboard,
    },
    // {
    //     path: '/st_print_1',
    //     component: React.lazy(() => import('./Print/Stock_Tacking_form')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/st_print_2',
    //     component: React.lazy(() => import('./Print/tally_reporrt')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/st_print_3',
    //     component: React.lazy(() => import('./Print/institution_report')),
    //     auth: authRoles.dashboard,
    // },


]

export default PharmacistViewManageRoutes;