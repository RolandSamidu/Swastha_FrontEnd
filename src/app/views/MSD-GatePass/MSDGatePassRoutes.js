import React from 'react'
import { authRoles } from '../../auth/authRoles'

const MSDGatePassRoutes = [

    {
        path: '/msa_gatepass/all_vehicle_requests',
        component: React.lazy(() => import('./AllVehicleRequests')),
        auth: authRoles.patients_view,
    },
//     {
//         path: '/msa_all_order/all-orders',
//         component: React.lazy(() => import('./MSD_MSA')),
//         auth: authRoles.patients_view,
//     },
  


]

export default MSDGatePassRoutes