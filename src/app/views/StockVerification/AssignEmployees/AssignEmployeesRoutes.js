import React from 'react'
import { authRoles } from '../../../auth/authRoles'

const AssignEmployeesRoutes = [
    // Document Check Routes
    {
        path: '/assignEmployees',
        component: React.lazy(() => import('./AssignEmployees')),
        auth: authRoles.assign_verifications,
    },
    {
        path: '/addEmployees',
        component: React.lazy(() => import('./AddEmployees')),
        auth: authRoles.verifications,
    },
    {
        path: '/PrintAssignEmployee/:id',
        component: React.lazy(() => import('./PrintAssignEmployee')),
        auth: authRoles.verifications,
    },






]

export default AssignEmployeesRoutes;