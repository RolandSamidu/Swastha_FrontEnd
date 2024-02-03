import { authRoles } from "app/auth/authRoles"
import React from "react"
const orderRoutes = [
    //order routes
    // {
    //     path:'/order/list',
    //     component: React.lazy(()=> import('./orderlist')),
    //     auth:authRoles.patients_view
    // },
    // {
    //     path:'/order/list',
    //     component: React.lazy(()=> import('./AddDeliveryDetails')),
    //     auth:authRoles.patients_view
    // },
    // {
    //     path:'/order/list',
    //     component: React.lazy(()=> import('./PickUpPersonSetup')),
    //     auth:authRoles.patients_view
    // },
    //     {
    //     path:'/order/list',
    //     component: React.lazy(()=> import('./RemarksSetUp')),
    //     auth:authRoles.patients_view
    // }
    {
        // path: '/hospital-ordering/all-items/:id',
        path: '/order/ppprofile/all-items/:id',
        component: React.lazy(() => import('./Pick Up person/IndividualOrderPP')),
        auth: authRoles.patients_view,
    },
    {
        path:'/order/ppprofile',
        component: React.lazy(()=> import('./Pick Up person/PickUpPersonProfile')),
        auth:authRoles.hospital_order
    },
    {
        path:'/order/ppprofile/:id',
        component: React.lazy(()=> import('./Pick Up person/PickUpPersonProfile')),
        auth:authRoles.hospital_order
    },
    {
        path: '/order/create',
        component: React.lazy(() => import('./CreateOrders')),
        auth: authRoles.hospital_order,
    },
    {
        path: '/order/newpickupperson',
        component: React.lazy(() => import('./PickUpPersonSetup')),
        auth: authRoles.hospital_order,
    },
    {
        path: '/order/remarks',
        component: React.lazy(() => import('./RemarksSetUp')),
        auth: authRoles.hospital_order,
    },
    {
        path: '/order/minstock',
        component: React.lazy(() => import('./SetMinStock')),
        auth: authRoles.min_stock,
    },
   

//sells order
    {
        path: '/sellsorder/create_order',
        component: React.lazy(() => import('./CreateOrders')),
        auth: authRoles.salesOrder_create_order,
    },

]


export default orderRoutes