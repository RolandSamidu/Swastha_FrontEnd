import { authRoles } from "app/auth/authRoles";
import React from "react";
const orderingRoutes = [
    {
        path: '/ordering/createOrder',
        component: React.lazy(() => import('./createOrder')),
        auth: authRoles.ordering_view
    },
    {
        path: '/ordering/placeOrder',
        component: React.lazy(() => import('./createOrderII')),
        auth: authRoles.ordering_view
    },
    {
        path: '/ordering/forecast/:id/:itemId',
        component: React.lazy(() => import('./forecasting')),
        auth: authRoles.ordering_view
    },
    {
        path: '/ordering/ScheduledOrders',
        component: React.lazy(() => import('./scheduledOrders')),
        auth: authRoles.ordering_view

    },
    {
        path: '/ordering/approval',
        component: React.lazy(() => import('./Approval')),
        auth: authRoles.ordering_approval

    },
    {
        path: '/ordering/upcoming',
        component: React.lazy(() => import('./allUpcomingOrders')),
        auth: authRoles.ordering_view

    },
    {
        path: '/ordering/orderControlForm',
        component: React.lazy(() => import('./printOrderControlForm/index')),
        auth: authRoles.ordering_view

    },
    {
        path: '/ordering/orderControlFormTwo',
        component: React.lazy(() => import('./printOrderControlForm/indexTwo')),
        auth: authRoles.ordering_view

    },

    // tempary route for print

    // order list
    // {
    //     path: '/ordering/orderlistprint',
    //     component: React.lazy(() => import('./Print/OrderList')),
    //     auth: authRoles.ordering_view

    // },

]


export default orderingRoutes;