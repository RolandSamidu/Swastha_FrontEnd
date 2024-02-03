import React from 'react'
import { authRoles } from '../../auth/authRoles'

const accountantRoutes = [
    // Document Check Routes
    {
        path: '/documents/document-type',
        component: React.lazy(() => import('./DocumentType')),
        auth: authRoles.document_setup,
    },
    {
        path: '/documents/transaction-type',
        component: React.lazy(() => import('./TransactionType')),
        auth: authRoles.document_setup_transaction_type,
    },
    {
        path: '/documents/document-setup',
        component: React.lazy(() => import('./DocumentSetup')),
        auth: authRoles.document_setup_document_setup,
    },

    // Supply Chain Routes Check
    {
        path: '/documents/supplier',
        component: React.lazy(() => import('./Supplier')),
        auth: authRoles.document_setup,
    },
    {
        path: '/documents/manufacture',
        component: React.lazy(() => import('./Manufacture')),
        auth: authRoles.document_setup,
    },
    {
        path: '/documents/local-agent',
        component: React.lazy(() => import('./LocalAgent')),
        auth: authRoles.document_setup,
    },
    {
        path: '/budget/total-budget',
        component: React.lazy(() => import('./TotalBudget')),
        auth: authRoles.budget_list_view,
    },
    {
        path: '/view/all-view',
        component: React.lazy(() => import('./AllView')),
        auth: authRoles.budget_list_view,
    },
]

export default accountantRoutes