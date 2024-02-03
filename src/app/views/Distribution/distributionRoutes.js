import React from 'react'
import { authRoles } from '../../auth/authRoles'

const distributionRoutes = [

    {
        path: '/distribution/order/:id/:items/:order/:empname/:status/:type',
        component: React.lazy(() => import('./individualOrder')),
        auth: authRoles.requested_orders,
    },
    {
        path: '/distribution/all-orders',
        component: React.lazy(() => import('./DistributionAllOrders')),
        auth: authRoles.requested_orders,
    },
    {
        path: '/distribution/allocation-ledger',
        component: React.lazy(() => import('./AllocationLedger')),
        auth: authRoles.distribution_requested_orders,
    },
    {
        path: '/distribution/sales-order',
        component: React.lazy(() => import('./sales_order/SalesOrder')),
        auth: authRoles.requested_orders,
    },
    {
        path: '/distribution/cash_sales',
        component: React.lazy(() => import('./cashSales/CashSales')),
        auth: authRoles.cashSale,
    },
    {
        path: '/distribution/order-configuration',
        component: React.lazy(() => import('./OrderConfiguration')),
        auth: authRoles.distribution_officer,
    },
    // {
    //     path: '/distribution/order',
    //     component: React.lazy(() => import('./main_page_tabs/dropped_Items')),
    //     auth: authRoles.patients_view,
    // },

    {
        path: '/distribution/msdad/all-orders',
        component: React.lazy(() => import('./DistributionAllOrdersMSDAD')),
        auth: authRoles.dispatch,
    },
    {
        path: '/distribution/msdad/supplementary-orders',
        component: React.lazy(() => import('./SupplementaryOrdersMSDAD')),
        auth: authRoles.dispatch,
    },
    {
        path: '/distribution/msdad/supplementary-order/:id',
        component: React.lazy(() => import('./msdADTabsForSupplimentary/ADIndividualOrder')),
        auth: authRoles.dispatch,
    },
    {
        path: '/distribution/msdad/dispatch-orders',
        component: React.lazy(() => import('./dispatch/DispatchOrders')),
        auth: authRoles.dispatch,
    },


    // temp route for cash sale
    {
        path: '/cashSalerep',
        component: React.lazy(() => import('./tabs/CashSales/index')),
        auth: authRoles.cashSale,
    },

    // destribution cash sales
    {
        path: '/distribution/direct-distribution',
        component: React.lazy(() => import('./distribution_Cash_Sale/DistributionAllOrders')),
        auth: authRoles.distribution_cash_sales,
    },
    {
        path: '/distribution/create-distribution',
        component: React.lazy(() => import('./distribution_Cash_Sale/Warehouses')),
        auth: authRoles.distribution_cash_sales,
    },

    {
        path:'/distribution/detailsView/:id',
        component: React.lazy(()=> import('./distribution_Cash_Sale/DetailsView')),
        auth:authRoles.distribution_cash_sales
    },
]

export default distributionRoutes