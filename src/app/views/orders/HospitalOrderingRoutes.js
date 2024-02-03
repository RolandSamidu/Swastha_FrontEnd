import React from 'react'
import { authRoles } from '../../auth/authRoles'

const HospitalOrderingRoutes = [
    {
        path: '/hospital-ordering/all-orders',
        component: React.lazy(() => import('./AllOrders')),
        auth: [...authRoles.min_stock,...authRoles.transfering,...authRoles.return_details],
    },
    {
        path: '/hospital-ordering/exchange_orders',
        component: React.lazy(() => import('./AllOrders')),
        auth: [...authRoles.min_stock,...authRoles.transfering,...authRoles.return_details],
    },
    
    {
        path: '/return_orders/all-orders',
        component: React.lazy(() => import('./AllOrders')),
        auth: authRoles.return_details,
    },

    
    {
        // path: '/hospital-ordering/all-items/:id',
        path: '/hospital-ordering/all-items/:id',
        component: React.lazy(() => import('./IndividualOrder')),
        auth: authRoles.min_stock,
    },

    //Sells Order Route
    {
        path: '/sellsorder/all-orders',
        component: React.lazy(() => import('./AllOrders')),
        auth: authRoles.sales_orders_list,
    },


]

export default HospitalOrderingRoutes
