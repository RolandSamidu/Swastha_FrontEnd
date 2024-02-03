import React from 'react'
import { authRoles } from '../../auth/authRoles'

const MSDRoutes = [
    {
        path: '/msd/sample-criteria-setup',
        component: React.lazy(() => import('./SampleCriteriaSetup')),
        auth: authRoles.sample_criteria_setup,
    },
    {
        path: '/msd/check-store-space/:id',
        component: React.lazy(() => import('./CheckStoreSpace')),
        auth: authRoles.sample_criteria_setup,
    },
    {
        path: '/msd/check-store-space-two/:id',
        component: React.lazy(() => import('./CheckStoreSpaceStepTwo')),
        auth: authRoles.sample_criteria_setup,
    },{
        path: '/msd/sco/accept-sample-info/:id',
        component: React.lazy(() => import('./AcceptSample')),
        auth: authRoles.msd_view,
    },
    {
        path: '/msd/dataSetup/users',
        component: React.lazy(() => import('./MSDUser')),
        auth: authRoles.msd_dataSetup,
    },
    {
        path: '/msd/addItems',
        component: React.lazy(() => import('./MSDAddItems')),
        auth: authRoles.msd_itemAdd,
    },



]

export default MSDRoutes
