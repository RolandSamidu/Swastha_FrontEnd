import { authRoles } from "app/auth/authRoles"
import React from "react"
const orderRoutesMDS = [
    {
        // path: '/hospital-ordering/all-items/:id',
        path: '/MDS/custodianprofile/all-items/:id',
        component: React.lazy(() => import('./MSD Custodian/MDS_IndividualOrderCustodian')),
        auth: authRoles.patients_view,
    },
    {
        path:'/MDS/custodianprofile/:id',
        component: React.lazy(()=> import('./MSD Custodian/MDS_CustodianPersonProfile')),
        auth:authRoles.patients_view
    },
    {
        path: '/MDS/create_order',
        component: React.lazy(() => import('./MDS_CreateOrders')),
        //auth: authRoles.mds,
        auth: authRoles.mds_create_order,
    },
    {
        path: '/MDS/create_order_withwarehouse',
        component: React.lazy(() => import('./CreateOrdersWithWarehouse/CreateOrdersWithWarehouse')),
        auth: authRoles.create_orders_with_warehouse,
    },
    {
        path: '/MDS/create_order_exchange',
        component: React.lazy(() => import('./CreateOrdersWithWarehouse/CreateOrdersWithWarehouse')),
        auth: authRoles.create_orders_with_warehouse,
    },
    {
        path: '/MDS/newpickupperson',
        component: React.lazy(() => import('./MDS_CustodianSetup')),
        auth: authRoles.mds,
        // auth: authRoles.patients_view,
    },
    {
        path: '/MDS/remarks',
        component: React.lazy(() => import('./MDS_RemarksSetup')),
        auth: authRoles.patients_view,
    },
    {
        path: '/MDS/individualorder/:id',
        component: React.lazy(() => import('./MDS_IndividualOrder')),
        auth: authRoles.patients_view,
    },
    // {
    //     path: '/MDS/minstock',
    //     component: React.lazy(() => import('./')),
    //     auth: authRoles.patients_view,
    // },  


    //Sells Order routes

    {
        path: '/sellsorder/create_order_withwarehouse',
        component: React.lazy(() => import('./CreateOrdersWithWarehouse/CreateOrdersWithWarehouse')),
        auth: authRoles.create_sales_orders_with_warehouse,
    },

]


export default orderRoutesMDS