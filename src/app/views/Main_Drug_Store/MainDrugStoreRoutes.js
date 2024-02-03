import React from 'react'
import { authRoles } from '../../auth/authRoles'

const MainDrugStoreRoutes = [
    {
        path: '/main-drug-store/all-orders',
        component: React.lazy(() => import('./AllOrders')),
        auth: authRoles.drugstore_create_Order,
    },
    {
        path: '/main-drug-store/all-Return_Orders',
        component: React.lazy(() => import('./Return_Orders')),
        auth: authRoles.drugstore_create_Order,
    },
    {
        // path: '/main-drug-store/all-items/:id',
        path: '/main-drug-store/all-items/:id',
        component: React.lazy(() => import('./IndividualOrder')),
        auth: authRoles.drugstore_create_Order,
    }
]

export default MainDrugStoreRoutes
