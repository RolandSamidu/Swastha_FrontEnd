import React from 'react'
import { authRoles } from '../../auth/authRoles'

const ItemRoutes = [
    {
        path: '/item-mst/create-item-mst',
        component: React.lazy(() => import('./CreateItem')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/create-item-hospital',
        component: React.lazy(() => import('./CreateItemForHospital')),
        auth: authRoles.hospital_items_manual,
    },
    {
        path: '/item-mst/all-item-hospital',
        component: React.lazy(() => import('./AllItemInHospital')),
        auth: authRoles.hospital_items_manual,
    },
    {
        //change the navigation in all item id icon since it goes to hospital item
        path: '/item-mst/edit-item-mst/:id',
        component: React.lazy(() => import('./EditItem')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/view-item-mst/:id',
        component: React.lazy(() => import('./ViewItem')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/edit-hospitalite-mst/:id',
        component: React.lazy(() => import('./HospitalItem')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/view-history-mst/:id',
        component: React.lazy(() => import('./HistoryItem')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/edit-all-items/:id',
        component: React.lazy(() => import('./AllitemTabHandling')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/group-series-setup',
        component: React.lazy(() => import('./GroupSeriesSetup')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/group-item-setup',
        component: React.lazy(() => import('./GroupItemSetup')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/group-serial-family-setup',
        component: React.lazy(() => import('./SerialFamilySetup')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/all-item',
        component: React.lazy(() => import('./AllItem')),
        auth: authRoles.item_master_view_All_Item,
    },
    {
        path: '/item-mst/batch-trace',
        component: React.lazy(() => import('./BatchTrace')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/condition',
        component: React.lazy(() => import('./Condition')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/cyclic-code',
        component: React.lazy(() => import('./CyclicCodes')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/institution',
        component: React.lazy(() => import('./Institution')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/item-type',
        component: React.lazy(() => import('./ItemType')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/item-usage-type',
        component: React.lazy(() => import('./ItemUsageType')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/movement-type',
        component: React.lazy(() => import('./MovementType')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/shelf-life',
        component: React.lazy(() => import('./ShelfLife')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/stock',
        component: React.lazy(() => import('./Stock')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/storage',
        component: React.lazy(() => import('./Storage')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/uom',
        component: React.lazy(() => import('./UOM')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/ven',
        component: React.lazy(() => import('./VEN')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/abc-class',
        component: React.lazy(() => import('./ABCClass')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/default-frequency',
        component: React.lazy(() => import('./DefaultFrequency')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/default-routes',
        component: React.lazy(() => import('./DefaultRoutes')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/display-units',
        component: React.lazy(() => import('./DisplayUnits')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/measuring-units',
        component: React.lazy(() => import('./MeasuringUnit')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/measuring-units_codes',
        component: React.lazy(() => import('./MeasuringUnitCode')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/item-mst/dosage-form',
        component: React.lazy(() => import('./DosageForm')),
        auth: authRoles.item_master_view,
    },

]

export default ItemRoutes
