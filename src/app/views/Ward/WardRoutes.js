import React from 'react'
import { authRoles } from '../../auth/authRoles'

const WardRoutes = [

    {
        path: '/patients/ward/info/:id',
        component: React.lazy(() => import('./PatientsInfo')),
        auth: authRoles.ward_Admit,
    },
    {
        path: '/patients/ward/search',
        component: React.lazy(() => import('./PatientsSearch')),
        auth: authRoles.ward_Admit,
    },

    {
        path: '/hospital/users/add',
        component: React.lazy(() => import('./HospitalUser')),
        auth: authRoles.hospital_admin,
    },
    {
        path: '/hospital/institutionUser',
        component: React.lazy(() => import('./InstitutionUser')),
        auth: authRoles.institution_user,
    },
]

export default WardRoutes
