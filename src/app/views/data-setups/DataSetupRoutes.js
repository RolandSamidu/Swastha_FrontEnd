import React from 'react'
import { authRoles } from '../../auth/authRoles'

const DataSetupRoutes = [
    {
        path: '/data-setup/category',
        component: React.lazy(() => import('./Category')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/data-setup/class',
        component: React.lazy(() => import('./ClassDataSetup')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/data-setup/group-type',
        component: React.lazy(() => import('./GroupType')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/data-setup/group',
        component: React.lazy(() => import('./GroupSetup')),
        auth: authRoles.item_master_view,
    },
    {
        path: '/data-setup/clinic-diagnosis-setup',
        component: React.lazy(() => import('./ClinicDiagonosisSetup')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/data-setup/clinic-complaint-setup',
        component: React.lazy(() => import('./ClinicComplaintSetup')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/data-setup/clinic-complications-setup',
        component: React.lazy(() => import('./ClinicComplicationsSetup')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/data-setup/clinic-allergies-setup',
        component: React.lazy(() => import('./ClinicAllergiesSetup')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/data-setup/clinic-setup',
        component: React.lazy(() => import('./ClinicSetup')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/data-setup/dashboard-config',
        component: React.lazy(() => import('./DashBoardView')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/data-setup/clinic-config/default_clinic_period/:id',
        component: React.lazy(() => import('./ClinicConfig')),
        auth: authRoles.clinic_config,
    },
    {
        path: '/data-setup/clinic-config',
        component: React.lazy(() => import('./AllClinicConfigration')),
        auth: authRoles.clinic_config,
    },
]

export default DataSetupRoutes
