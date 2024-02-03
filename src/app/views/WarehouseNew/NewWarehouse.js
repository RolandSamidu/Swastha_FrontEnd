import React from 'react'
import { authRoles } from '../../auth/authRoles'

const NewWarehouse = [
      {
            path: '/distribution/totalwarehouse',
            component: React.lazy(() => import('./TotalWarehouseList')),
            auth: authRoles.warehouse_view,
        },
    {
        path: '/distribution/createwarehouse',
        component: React.lazy(() => import('./CreateWarehouses/CreateWarehouse')),
        auth: authRoles.requested_orders,
    },
    {
        path: '/distribution/createitem-list',
        component: React.lazy(() => import('./CreateWarehouses/CreateWarehouseList')),
        auth: authRoles.requested_orders,
    },
    {
        path: '/distribution/editwarehousetab/:id',
        component: React.lazy(() => import('./EditWarehouseTabHandling')),
        auth: authRoles.requested_orders,
    },
    {
      path: '/distribution/editwarehouse/:id',
      component: React.lazy(() => import('./CreateWarehouses/CreateWarehouse')),
      auth: authRoles.requested_orders,
    },       
    {
    path: '/distribution/createbin',
    component: React.lazy(() => import('./CreateWarehouses/WarehouseBins')),
    auth: authRoles.requested_orders,
    }, 
    {
    path: '/distribution/createpeople',
    component: React.lazy(() => import('./CreateWarehouses/CreateWarehousePeople')),
    auth: authRoles.requested_orders,
    },    
    {
        path: '/warehouse/drug-store/warehouse-item/:id',
        component: React.lazy(() => import('../MSD-warehouse/DSWarehouseItem')),
        auth: authRoles.requested_orders,
    },
    {
        path: '/warehouse/view-item-mst/:id',
        component: React.lazy(() => import('./ItemWarehouseView')),
        auth: authRoles.requested_orders,
    },
    {
        path: '/warehouse/view-all-items',
        component: React.lazy(() => import('./WarehouseAllItem')),
        auth: authRoles.requested_orders,
    },

// //     {
// //         path: '/msa_all_order/all-orders',
// //         component: React.lazy(() => import('./MSD_MSA')),
// //         auth: authRoles.patients_view,
// //     },
  


]

export default NewWarehouse