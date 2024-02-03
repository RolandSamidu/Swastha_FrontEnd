import React from 'react'
import { authRoles } from '../../auth/authRoles'

const HospitalUserRoutes = [
  
    {
        path: '/msd_datasetup_hospital_user',
        component: React.lazy(() => import('./HospitalUser')),
        auth: authRoles.msd_datasetup_it,
    },
  
]

export default HospitalUserRoutes