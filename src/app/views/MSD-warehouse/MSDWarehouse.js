import React from 'react'
import { authRoles } from '../../auth/authRoles'

const MSDWarehouse = [
      {
            path: '/msd_warehouse/totalwarehouse',
            component: React.lazy(() => import('./TotalWarehouseList')),
            auth: authRoles.warehouse_handling,
        },
    {
        path: '/msd_warehouse/createwarehouse',
        component: React.lazy(() => import('./CreateWarehouse/CreateWarehouse')),
        auth: authRoles.warehouse_handling,
    },
    {
        path: '/msd_warehouse/createitem-list',
        component: React.lazy(() => import('./CreateWarehouse/CreateWarehouseList')),
        auth: authRoles.warehouse_handling,
    },
    {
        path: '/msd_warehouse/editwarehousetab/:id',
        component: React.lazy(() => import('./EditWarehouseTabHandling')),
        auth: authRoles.warehouse_handling,
    },
    {
      path: '/msd_warehouse/editwarehouse/:id',
      component: React.lazy(() => import('./CreateWarehouse/CreateWarehouse')),
      auth: authRoles.warehouse_handling,
    },       
    {
    path: '/msd_warehouse/createbin',
    component: React.lazy(() => import('./CreateWarehouse/WarehouseBins')),
    auth: authRoles.warehouse_handling,
    }, 
    {
    path: '/msd_warehouse/createpeople',
    component: React.lazy(() => import('./CreateWarehouse/CreateWarehousePeople')),
    auth: authRoles.warehouse_handling,
    },    
    {
        path: '/warehouse/drug-store/warehouse-item/:id',
        component: React.lazy(() => import('../MSD-warehouse/DSWarehouseItem')),
        auth: authRoles.warehouse_handling,
    },
    {
        path: '/warehouse/view-item-mst/:id',
        component: React.lazy(() => import('./ItemWarehouseView')),
        auth: authRoles.warehouse_handling,
    },
    {
        path: '/warehouse/view-all-items',
        component: React.lazy(() => import('./WarehouseAllItem')),
        auth: authRoles.warehouse_handling,
    },

// //     {
// //         path: '/msa_all_order/all-orders',
// //         component: React.lazy(() => import('./MSD_MSA')),
// //         auth: authRoles.patients_view,
// //     },
  


]

export default MSDWarehouse