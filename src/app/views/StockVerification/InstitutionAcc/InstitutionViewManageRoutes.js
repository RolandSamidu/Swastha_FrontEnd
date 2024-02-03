import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const InstitutionViewManageRoutes = [
    // Document Check Routes
    {
        path: '/institutionViewManage',
        component: React.lazy(() => import('./InstitutionViewManage')),
        auth: authRoles.dashboard,
    },








]

export default InstitutionViewManageRoutes;