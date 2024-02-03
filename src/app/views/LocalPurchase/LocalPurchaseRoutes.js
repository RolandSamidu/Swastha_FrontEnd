import React from 'react'
import { authRoles } from '../../auth/authRoles'

const LocalPurchaseRoutes = [
    // {
    //     path: '/localpurchase/supply_sco_request/:id',
    //     component: React.lazy(() => import('./SupplySCO/IndividualPurchaseDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/supply_hsco_request/:id',
    //     component: React.lazy(() => import('./SupplyHSCO/IndividualPurchaseDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/msd_ad_request/:id',
    //     component: React.lazy(() => import('./MSD AD/IndividualPurchaseDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/msd_director_request/:id',
    //     component: React.lazy(() => import('./MSD Director/IndividualPurchaseDetails')),
    //     auth: authRoles.dashboard,
    // },

    // Removed to improve UX
    // {
    //     path: '/localpurchase/request',
    //     component: React.lazy(() => import('./AllLocalPurchaseRequest')),
    //     auth: authRoles.lp_allRequests,
    // },
    // {
    //     path: '/localpurchase/approval_list',
    //     component: React.lazy(() => import('./ApprovalItemDetails')),
    //     auth: authRoles.lp_approvalList,
    // },
    // {
    //     path: '/localpurchase/approved_lp_request',
    //     component: React.lazy(() => import('./ApprovedLPRequest')),
    //     auth: authRoles.lp_approvalList,
    // },

    {
        path: '/localpurchase/request/:id',
        component: React.lazy(() => import('./IndividualPurchaseDetails')),
        auth: authRoles.lp_allRequests,
    },
    {
        path: '/localpurchase/view/:id',
        component: React.lazy(() => import('./IndividualDetailsView')),
        auth: authRoles.lp_allRequests,
    },
    {
        path: '/localpurchase/request',
        component: React.lazy(() => import('./LPRequest/LPRequest')),
        auth: authRoles.lp_RequestList,
    },

    {
        path: '/localpurchase/new-request',
        component: React.lazy(() => import('./NewLocalPurchaseRequest')),
        auth: authRoles.lp_create,
    },
    // {
    //     path: '/localpurchase/create-purchase-order',
    //     component: React.lazy(() => import('./IndividualLPPurchaseOrder')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/purchase-order',
    //     component: React.lazy(() => import('./LPPurchaseOrder')),
    //     auth: authRoles.dashboard,
    // },
            
    // Added LP Approval
    {
        path: '/localpurchase/approval_list/:id',
        component: React.lazy(() => import('./ApprovalIndividualDetails')),
        auth: authRoles.lp_approvalList,
    },
    {
        path: '/localpurchase/order_detail_approval',
        component: React.lazy(() => import('./ApprovedItemDetails')),
        auth: authRoles.lp_purchase_approval,
    },

    {
        path: '/localpurchase/approval_list_drug/:id',
        component: React.lazy(() => import('./ApprovalDrugAvailability')),
        auth: authRoles.lp_approvalList,
    },
    {
        path: '/localpurchase/view_consignment/:id',
        component: React.lazy(() => import('./ViewConsignment')),
        auth: authRoles.lp_approvalList,
    },
    {
        path: '/localpurchase/view_consignment',
        component: React.lazy(() => import('./AllConsignement')),
        auth: authRoles.lp_approvalList,
    },
    {
        path: '/localpurchase/grn',
        component: React.lazy(() => import('./AllGRN')),
        auth: authRoles.lp_approvalList
    },
    {
        path: '/localpurchase/grn-items/:id',
        component: React.lazy(() => import('./GRNItems')),
        auth: authRoles.lp_approvalList
    },
    {
        path: '/localpurchase/unallocated_items',
        component: React.lazy(() => import('./UnallocatedItems')),
        auth: authRoles.lp_UnallocatedList
    },
    {
        path: '/localpurchase/add_prices/:id',
        component: React.lazy(() => import('./AddPrices')),
        auth: authRoles.lp_approvalList
    },
    {
        path: '/localpurchase/order_details',
        component: React.lazy(() => import('./PurchaseOrderDetail')),
        auth: authRoles.lp_purchase_list,
    },
    
    
    // LP Approval Routes
    // {
    //     path: '/localpurchase/store_pharmacist/:id',
    //     component: React.lazy(() => import('./StorePharmacist/IndividualItemDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/store_pharmacist',
    //     component: React.lazy(() => import('./StorePharmacist/AllItemDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/chief_pharmacist/:id',
    //     component: React.lazy(() => import('./ChiefPharmacist/IndividualItemDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/chief_pharmacist',
    //     component: React.lazy(() => import('./ChiefPharmacist/AllItemDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/hospital_director/:id',
    //     component: React.lazy(() => import('./HospitalDirector/IndividualItemDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/hospital_director',
    //     component: React.lazy(() => import('./HospitalDirector/AllItemDetails')),
    //     auth: authRoles.dashboard,
    // },

    // {
    //     path: '/localpurchase/supply_sco',
    //     component: React.lazy(() => import('./SupplySCO/AllItemDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/supply_hsco',
    //     component: React.lazy(() => import('./SupplyHSCO/AllItemDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/msd_ad',
    //     component: React.lazy(() => import('./MSD AD/AllItemDetails')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/msd_director',
    //     component: React.lazy(() => import('./MSD Director/AllItemDetails')),
    //     auth: authRoles.dashboard,
    // },

    // {
    //     path: '/localpurchase/msd_ad_drug/:id',
    //     component: React.lazy(() => import('./MSD AD/DrugAvailability')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/msd_director_drug/:id',
    //     component: React.lazy(() => import('./MSD Director/DrugAvailability')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/supply_sco_drug/:id',
    //     component: React.lazy(() => import('./SupplySCO/DrugAvailability')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/supply_hsco_drug/:id',
    //     component: React.lazy(() => import('./SupplyHSCO/DrugAvailability')),
    //     auth: authRoles.dashboard,
    // },
    {
        path: '/localpurchase/supplier/:id',
        component: React.lazy(() => import('./IndividualSupplierDetails')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/supplier',
        component: React.lazy(() => import('./AllSupplierDetails')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/drug',
        component: React.lazy(() => import('./DrugAvailabilty')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/method_selection/:id',
        component: React.lazy(() => import('./ShoppingMethod')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/method_selection',
        component: React.lazy(() => import('./MethodSelection')),
        auth: authRoles.dashboard,
    },
    
    // Procurement
    {
        path: '/localpurchase/create_procurement',
        component: React.lazy(() => import('./Procurement/CreateProcurement')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/procurement/:id',
        component: React.lazy(() => import('./Procurement/IndividualProcurement')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/procurement',
        component: React.lazy(() => import('./Procurement/Procurement')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/procurement_ack',
        component: React.lazy(() => import('./Procurement/ProcurementAck')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/agenda',
        component: React.lazy(() => import('./Procurement/AllAgendas')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/pc_pro_approval',
        component: React.lazy(() => import('./Procurement/ProApproval')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/pro_unit_approval',
        component: React.lazy(() => import('./Procurement/ProUnitApproval')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/committee_setup',
        component: React.lazy(() => import('./Committee/CommitteeSetup')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/committee/:id',
        component: React.lazy(() => import('./Committee/IndividualCommittee')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/committee',
        component: React.lazy(() => import('./Committee/AllCommittee')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/authority_level_setup',
        component: React.lazy(() => import('./Committee/AuthorityLevelSetup')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/procurement_method_setup',
        component: React.lazy(() => import('./Committee/ProcurementMethodSetup')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/bid_bond_setup',
        component: React.lazy(() => import('./Committee/BidBondSetup')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/tec_report_setup',
        component: React.lazy(() => import('./Committee/TECReportSetup')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/bid_observation_setup',
        component: React.lazy(() => import('./Committee/BidObservationSetup')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/annual_estimation_setup',
        component: React.lazy(() => import('./Committee/AnnualEstimationDataSetup')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/supplier_registration',
        component: React.lazy(() => import('./Supplier/SupplierRegistration')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/supplier_surgical/:id',
        component: React.lazy(() => import('./Supplier/surgical/IndividualSupplier')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/supplier_pharmaceutical/:id',
        component: React.lazy(() => import('./Supplier/pharmaceutical/IndividualSupplier')),
        auth: authRoles.dashboard,
    },
    {
        path: '/localpurchase/supplier_list',
        component: React.lazy(() => import('./Supplier/SupplierList')),
        auth: authRoles.dashboard,
    },
    // Removed For UX 
    // {
    //     path: '/localpurchase/supplier_surgical',
    //     component: React.lazy(() => import('./Supplier/surgical/SupplierList')),
    //     auth: authRoles.dashboard,
    // },
    // {
    //     path: '/localpurchase/supplier_pharmaceutical',
    //     component: React.lazy(() => import('./Supplier/pharmaceutical/SupplierList')),
    //     auth: authRoles.dashboard,
    // },

    // {
    //     path: '/drugbalancing/druglist/report',
    //     component: React.lazy(() => import('./DrugListReport')),
    //     auth: authRoles.drugBalancing,
    // },
    // {
    //     path: '/drugbalancing/druglist/bulkreport',
    //     component: React.lazy(() => import('./BulkReport')),
    //     auth: authRoles.drugBalancing,
    // },
    // {
    //     path: '/drugbalancing/history/:id',
    //     component: React.lazy(() => import('./DrugReportHistory')),
    //     auth: authRoles.drugBalancing,
    // },
    // {
    //     path: '/drugbalancing/detailedview',
    //     component: React.lazy(() => import('./DetailedView')),
    //     auth: authRoles.item_master_view,
    // },
    // {
    //     path: '/mro/patients/search',
    //     component: React.lazy(() => import('./MROPatientsSearch')),
    //     auth: authRoles.mro,
    // },
]

export default LocalPurchaseRoutes
