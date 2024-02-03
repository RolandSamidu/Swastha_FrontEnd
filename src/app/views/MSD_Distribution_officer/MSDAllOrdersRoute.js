import React from 'react'
import { authRoles } from '../../auth/authRoles'

const MSDNewRoutes = [

    {
        path: '/msd_all_order/all-orders/order/:id/:items/:order/:empname/:empcontact/:status/:type',
        component: React.lazy(() => import('./individualOrder')),
        auth: authRoles.distribution_officer,
    },
    {
        path: '/msd_all_order/all-orders',
        component: React.lazy(() => import('./MSDAllOrders')),
        auth: authRoles.distribution_officer,
    },
    {
        path: '/msd_all_order/warehouse-details/:id',
        component: React.lazy(() => import('./WarehouseDetails')),
        auth: authRoles.distribution_officer,
    },
    // {
    //     path: '/distribution/order',
    //     component: React.lazy(() => import('./main_page_tabs/dropped_Items')),
    //     auth: authRoles.patients_view,
    // },


]

export default MSDNewRoutes