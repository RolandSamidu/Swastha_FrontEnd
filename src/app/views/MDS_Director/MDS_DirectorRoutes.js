import React from 'react'
import { authRoles } from '../../auth/authRoles'

const DirectorRoutesMDS = [

    {
        path: '/MDS_Director/AllOders',
        component: React.lazy(() => import('./MDS_DirectorAllOrders')),
        auth: authRoles.mds_director,
    },
    {
        path: '/MDS_Director/individualOrder/:id/:status',
        component: React.lazy(() => import('./tabs/MDS_DirectorIndividualOrder')),
        auth: authRoles.mds_director,
    },



]

export default DirectorRoutesMDS