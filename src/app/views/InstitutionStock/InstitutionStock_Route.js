import React from 'react'
import { authRoles } from '../../auth/authRoles'

const InstitutionStockRoutes = [

    {
        path: '/institution_stock',
        component: React.lazy(() => import('./MyStock')),
        auth: authRoles.institutionStock
    },


]

export default InstitutionStockRoutes