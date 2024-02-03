import { authRoles } from "app/auth/authRoles"
import React from "react"
const orderRoutesRMSD = [
    {
        path:'/RMSD/general/CreateDistribution',
        component: React.lazy(()=> import('./General/CreateDistribution')),
        auth:authRoles.rmsd_create_orders_with_route
    },
    {
        path:'/hospital/CreateDistribution',
        component: React.lazy(()=> import('./General/HospitalCreateDistribution')),
        auth:authRoles.hospital_create_distribution
    },
    {
        path:'/RMSD/general/detailsView/:id',
        component: React.lazy(()=> import('./General/DetailsView')),
        auth:[...authRoles.rmsd_create_orders_with_route,...authRoles.hospital_create_distribution]
    },
    {
        path:'/RMSD/general/ItemDetailsView/:id',
        component: React.lazy(()=> import('./General/ItemDetailsView')),
        auth:[...authRoles.rmsd_create_orders_with_route,...authRoles.hospital_create_distribution]
    },
    {
        path:'/RMSD/general/all_routes',
        component: React.lazy(()=> import('./General/All_Route')),
        auth:[...authRoles.rmsd_create_orders_with_route,...authRoles.hospital_create_distribution]
    },
    {
        path:'/RMSD/general/add_route',
        component: React.lazy(()=> import('./General/Add_new_route')),
        // auth:authRoles.rmsd_create_orders_with_route
        auth:[...authRoles.rmsd_create_orders_with_route,...authRoles.hospital_create_distribution]
    },
    {
        // path: '/hospital-ordering/all-items/:id',
        path: '/RMSD_to_MSD/custodianprofile/all-items/:id',
        component: React.lazy(() => import('./Order_From_RMSD_to_MSD/MDS_Create_Orders/MSD_Custodian/MDS_IndividualOrderCustodian')),
        auth: authRoles.rmsd_create_orders,
    },
    {
        path:'/RMSD_to_MSD/custodianprofile/:id',
        component: React.lazy(()=> import('./Order_From_RMSD_to_MSD/MDS_Create_Orders/MSD_Custodian/MDS_CustodianPersonProfile')),
        auth:authRoles.rmsd_create_orders
    },
    {
        path: '/RMSD_to_MSD/create_order',
        component: React.lazy(() => import('./Order_From_RMSD_to_MSD/MDS_Create_Orders/MDS_CreateOrders')),
        auth: authRoles.rmsd_create_orders,
    },
    {
        path: '/RMSD_to_MSD/newpickupperson',
        component: React.lazy(() => import('./Order_From_RMSD_to_MSD/MDS_Create_Orders/MDS_CustodianSetup')),
        auth: authRoles.rmsd_create_orders,
    },
    {
        path: '/RMSD_to_MSD/remarks',
        component: React.lazy(() => import('./Order_From_RMSD_to_MSD/MDS_Create_Orders/MDS_RemarksSetup')),
        auth: authRoles.create_remarks,
    },
    {
        path: '/RMSD_to_MSD/indiorder',
        component: React.lazy(() => import('./Order_From_RMSD_to_MSD/MDS_Create_Orders/MDS_IndividualOrder')),
        auth: authRoles.rmsd_create_orders,
    },
    {
        path: '/RMSD/create_order/:id',
        component: React.lazy(() => import('./Scheduled_order_distribution/RMSD_Create_Orders/RMSD_CreateOrders')),
        auth: authRoles.rmsd_create_orders,
    },
    {
        path: '/RMSD/order/:id/:items/:order/:empname/:status/:type',
        component: React.lazy(() => import('./Scheduled_order_distribution/Distribution/individualOrder')),
        auth: authRoles.rmsd_create_orders,
    },
    {
        path: '/RMSD/all-orders',
        component: React.lazy(() => import('./Scheduled_order_distribution/Distribution/DistributionAllOrders')),
        auth: authRoles.rmsd_create_orders,
    }, 

]


export default orderRoutesRMSD