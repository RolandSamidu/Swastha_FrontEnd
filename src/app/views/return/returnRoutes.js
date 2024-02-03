import { authRoles } from "app/auth/authRoles";
import React from "react";
const returnRoutes = [
    {
        path: '/return/return-mode',
        component: React.lazy(() => import('./returnMode')),
        auth: authRoles.return_view_create
    },
   
    {
        path: '/create/return/:id',
        component: React.lazy(() => import('./createReturnRequest')),
        auth: authRoles.return_view_create
    },

    {
        path: '/return/return-requests',
        component: React.lazy(() => import('./returnRequests')),
        auth: authRoles.requests_by_me,

    },
    {
        path: '/return/admin/return-requests',
        component: React.lazy(() => import('./returnRequestsAdmin')),
        auth: authRoles.return_approval,

    },
    {
        path: '/return/requests/:id',
        component: React.lazy(() => import('./singleReturnRequest')),
        auth: authRoles.return_approval,

    },
    {
        path: '/return/grant/approval/:id',
        component: React.lazy(() => import('./grantApprovals')),
        auth: authRoles.return_approval,

    },
    {
        path: '/return/drugstore/grant/approval/:id',
        component: React.lazy(() => import('./grantApprovalDrugStore')),
         auth: authRoles.return_approval,

    },
    {
        path: '/return/drugstore/return-requests',
        component: React.lazy(() => import('./returnRequestsDrugstore')),
        auth: authRoles.requested_to_me,

    },

]


export default returnRoutes;