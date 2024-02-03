import React from 'react'
import { authRoles } from '../../auth/authRoles'

const PatientsRoutes = [

    {
        path: '/patients/info/:id',
        component: React.lazy(() => import('./PatientsInfo')),
        auth: authRoles.frontDesk,
    },
    {
        path: '/patients/search',
       // component: React.lazy(() => import('./PatientsSearch')),
       component: React.lazy(() => import('./TempSearch')),
        auth: authRoles.frontDesk,
    },
    {
        path: '/patients/advanced_search',
       component: React.lazy(() => import('./PatientsSearch')),
        auth: authRoles.frontDesk,
    },
]

export default PatientsRoutes
