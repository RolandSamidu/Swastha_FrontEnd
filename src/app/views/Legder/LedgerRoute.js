import React from 'react'
import { authRoles } from '../../auth/authRoles'

const LedgerRoute = [

    {
        path: '/Ledger',
        component: React.lazy(() => import('./Ledger')),
        auth: authRoles.ledger,
    },
    {
        path: '/LedgerV1',
        component: React.lazy(() => import('./LedgerV1')),
        auth: authRoles.ledger,
    },
]

export default LedgerRoute
