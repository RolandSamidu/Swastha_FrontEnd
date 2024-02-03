import React from 'react'
import { authRoles } from '../../auth/authRoles'

const PreStockCheckRoutes = [
    // Document Check Routes
    {
        path: '/mystocknew',
        component: React.lazy(() => import('./PreStockCheck')),
        auth: authRoles.check_item_stock_verification,
    },


]

export default PreStockCheckRoutes;