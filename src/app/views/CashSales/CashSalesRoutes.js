import { authRoles } from "app/auth/authRoles"
import React from "react"
const CashSalesRoutes = [
    {
        path:'/cashSales',
        component: React.lazy(()=> import('./Warehouses')),
        auth:authRoles.cashSale
    },
    {
        path:'/cashSale/detailsView/:id',
        component: React.lazy(()=> import('./DetailsView')),
        auth:authRoles.cashSale
    },

]


export default CashSalesRoutes