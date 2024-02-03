import React from 'react'
import { authRoles } from '../../auth/authRoles'

const spcRoutes = [
    //pharmacy routes
    {
        path: '/spc/consignment/create',
        component: React.lazy(() => import('./NewConsignment')),
        auth: authRoles.SPC_consignments,
    },
    {
        path: '/spc/consignment/addDetails/:id',
        component: React.lazy(() => import('./AddDetails')),
        auth: authRoles.SPC_consignments,
    },
    {
        path: '/spc/procurements/allOrders',
        component: React.lazy(() => import('./AllOrderList')),
        auth: authRoles.Procurement,
    },
    {
        path: '/spc/procurements/PO/allOrders',
        component: React.lazy(() => import('./PO/Main')),
        auth: authRoles.spc_PO,
    },
    {
        path: '/spc/procurements/commitee',
        component: React.lazy(() => import('./Commitee/Main')),
        auth: authRoles.Procurement,
    },
    {
        path: '/spc/procurements/manager',
        component: React.lazy(() => import('./Manager/Main')),
        auth: authRoles.spc_PO,
    },
    {
        path: '/spc/procurements/clerk/allOrders',
        component: React.lazy(() => import('./Clerk/Main')),
        auth: authRoles.spc_SC,
    },
    {
        path: '/spc/procurement/allprocurements',
        component: React.lazy(() => import('./AllProcurements')),
        auth: authRoles.Procurement,
    },
    {
        path: '/spc/procurement/allprocurementsunit',
        component: React.lazy(() => import('./AllProcurementUnitNew')),
        auth: authRoles.dashboard,
    },
    {
        path: '/spc/procurement/allagendas',
        component: React.lazy(() => import('./AllAgendas')),
        auth: authRoles.dashboard,
    },
    {
        path: '/spc/procurement/signedsingleorderlist',
        component: React.lazy(() => import('./SignedOrderList')),
        auth: authRoles.dashboard,
    },
    {
        path: '/spc/procurement/procurementack',
        component: React.lazy(() => import('./ProcurementAck')),
        auth: authRoles.dashboard,
    },
    {
        path: '/spc/procurement/createprocurement',
        component: React.lazy(() => import('./CreateProcurement')),
        auth: authRoles.dashboard,
    },
    {
        path: '/spc/procurement/procurementapproval',
        component: React.lazy(() => import('./ProcurementApproval')),
        auth: authRoles.dashboard,
    },
    {
        path: '/spc/autority-level-set-up',
        component: React.lazy(() => import('./AuthorityLevelSetUp')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/spc/time-shedule-format-set-up',
        component: React.lazy(() => import('./TimeSheduleFormatSetup')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/spc/procurement-method-set-up',
        component: React.lazy(() => import('./ProcurementMethodSetup')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/spc/payment-terms-set-up',
        component: React.lazy(() => import('./PaymentTermsSetUp')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/spc/bid-bond-set-up',
        component: React.lazy(() => import('./BidBondSetUp')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/spc/document-set-up',
        component: React.lazy(() => import('./DocumentSetUp')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/spc/all-approval-requests',
        component: React.lazy(() => import('./AllApprovalRequests')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/spc/pc-pro-approval',
        component: React.lazy(() => import('./PcProApproval')),
        auth: authRoles.patients_registration,
    },
    {
        path: '/spc/purchase-order/create',
        component: React.lazy(() => import('./PurchaseOrder/MA/create/Main')),
        auth: authRoles.spc_purchase_order,
    },
    {
        path: '/spc/purchase-order/all',
        component: React.lazy(() => import('./PurchaseOrder/MA/all/Main')),
        auth: authRoles.spc_purchase_order,
    },
    {
        path: '/spc/supervisor/purchase-order',
        component: React.lazy(() => import('./PurchaseOrder/Supervisor/Main')),
        auth: authRoles.SPC_consignments,
    },

    // Consignment Route
    // {
    //     path: '/spc/wdn_order_list/:id',
    //     component: React.lazy(() => import('./Consignment/foreign/IndividualDetails')),
    //     auth: authRoles.SPC_consignments,
    // },
    // {
    //     path: '/spc/port_wdn_consignment_list/:id',
    //     component: React.lazy(() => import('./Consignment/MA/foreign/PortIndividualDetails')),
    //     auth: authRoles.SPC_consignments,
    // },
    // {
    //     path: '/spc/port_ldn_consignment_list/:id',
    //     component: React.lazy(() => import('./Consignment/MA/local/PortIndividualDetails')),
    //     auth: authRoles.SPC_consignments,
    // },

    // {
    //     path: '/spc/ldn_consignment_list/:id',
    //     component: React.lazy(() => import('./Consignment/local/IndividualDetails')),
    //     auth: authRoles.SPC_consignments,
    // },

    {
        path: '/spc/order_list',
        component: React.lazy(() => import('./Consignment/PurchaseOrder')),
        auth: authRoles.SPC_consignments,
    },
    {
        path: '/spc/all_order_list',
        component: React.lazy(() => import('./Consignment/AllOrderList')),
        auth: authRoles.SPC_consignments_List,
    },
    {
        path: '/spc/all_debit_list',
        component: React.lazy(() => import('./DebitNote/DebitNoteList')),
        auth: authRoles.SPC_consignments_List,
    },
    {
        path: '/spc/debit_note_list',
        component: React.lazy(() => import('./DebitNote/AllOrderList')),
        auth: authRoles.SPC_deit_note_creation,
    },
    // {
    //     path: '/spc/lcdn_order_list',
    //     component: React.lazy(() => import('./Consignment/LCDNList')),
    //     auth: authRoles.SPC_consignments,
    // },

    {
        path: '/purchase_order/create',
        component: React.lazy(() => import('./Scheduling')),
        auth: authRoles.SPC_consignments,
    },
    {
        path: '/purchase_order/order_list',
        component: React.lazy(() => import('./PurchaseOrderList')),
        auth: authRoles.purchase_order_list,
    },
    {
        path: '/purchase_order/order_details',
        component: React.lazy(() => import('./PurchaseOrderDetails')),
        auth: authRoles.purchase_order_list_view,
    },
    {
        path: '/spc/debit_note_approval',
        component: React.lazy(() => import('./DebitNoteApproval/DebitNoteApproval')),
        auth: authRoles.Debitnote_Approval,
    },
    {
        path: '/spc/debit_note_approval_single_view/:id/:uid/:consId',
        component: React.lazy(() => import('./DebitNoteApproval/DebitNoteApprovalTab/ApprovalIndividualDetails')),
        auth: authRoles.Debitnote_Approval,
    },
    {
        path: '/spc/purchase-order/edit',
        component: React.lazy(() => import('./PurchaseOrder/MA/Edit/EditPurchaseOrder')),
        auth: authRoles.spc_purchase_order,
    },
    {
        path: '/spc/status_update',
        component: React.lazy(() => import('./StatusUpdate/StatusUpdateAllView')),
        auth: authRoles.spc_status_update,
    },
    {
        path: '/spc/status_update/single_view',
        component: React.lazy(() => import('./StatusUpdate/ViewItem')),
        auth: authRoles.spc_status_update,
    },
]

export default spcRoutes
