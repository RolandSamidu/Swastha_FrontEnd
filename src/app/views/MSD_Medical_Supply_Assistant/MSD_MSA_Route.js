import React from 'react'
import { authRoles } from '../../auth/authRoles'

const MSDMSA = [

    {
        path: '/msa_all_order/all-orders/order/:id/:items/:order/:empname/:empcontact/:status/:type',
        component: React.lazy(() => import('./individualOrder')),
        auth: authRoles.supply_assistant,
    },
    {
        path: '/msa_all_order/all-orders/orderReturn/:id/:items/:order/:empname/:empcontact/:status/:type',
        component: React.lazy(() => import('./tabs/OrderReturnModule')),
        auth: authRoles.supply_assistant,
    },
    {
        path: '/msa_all_order/all-orders',
        component: React.lazy(() => import('./MSD_MSA')),
        auth: [...authRoles.supply_assistant, ...authRoles.transfering],
    },
    {
        path: '/msa_all_order/exchange-orders',
        component: React.lazy(() => import('./MSD_MSA')),
        auth: [...authRoles.supply_assistant, ...authRoles.transfering],
    },
    {
        path: '/msa_all_order/all-orders-cash_sales',
        component: React.lazy(() => import('./MSD_MSA')),
        auth: authRoles.caseSale,
    },
    {
        path: '/item_stock',
        component: React.lazy(() => import('./MyStock')),
        auth: authRoles.item_stock2
    },
    {
        path: '/check_item_stocks',
        component: React.lazy(() => import('./CheckOtherStocks')),
        auth: authRoles.check_item_stock
    },
    {
        path: '/drugbalancing/checkStock/detailedview/:id',
        component: React.lazy(() => import('./DetailedView')),
        auth: authRoles.check_item_stock
    },
    {
        path: '/my/printTable',
        component: React.lazy(() => import('./tabs/printTable/index')),
        auth: authRoles.item_stock2
    },
    {
        path: '/distribution/distribution-details',
        component: React.lazy(() => import('./Distriution_Details/MSD_MSA')),
        auth: authRoles.supply_assistant,
    },


    // temp route for grn print
    // {
    //     path: '/grnPrint',
    //     component: React.lazy(() => import('./GrnPrint/index')),
    //     auth: authRoles.supply_assistant,
    // },

]

export default MSDMSA