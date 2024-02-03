import React from 'react'
import { authRoles } from '../../auth/authRoles'

const CPRoutesMDS = [

    {
        path: '/MDS_chiefPharmacist/AllOders',
        component: React.lazy(() => import('./MDS_CPAllOrders')),
        auth: authRoles.patients_view,
    },
    {
        path: '/MDS_chiefPharmacist/individualOrder/:id/:status',
        component: React.lazy(() => import('./tabs/MDS_CPIndividualOrder')),
        auth: authRoles.patients_view,
    },



]

export default CPRoutesMDS