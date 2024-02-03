import React from 'react'
import { authRoles } from '../../auth/authRoles'

const IssueRoutes = [

    {
        path: '/createIssue',
        component: React.lazy(() => import('./CreateIssue')),
        //auth: authRoles.dashboard,
    },
    {
        path: '/reported_issue',
        component: React.lazy(() => import('./AllIssues')),
        auth: authRoles.raisedIssuesView,
    },
  
]

export default IssueRoutes
