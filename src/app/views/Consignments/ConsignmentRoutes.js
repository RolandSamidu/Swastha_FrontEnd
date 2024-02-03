import React from "react";
import { authRoles } from "../../auth/authRoles";

const ConsignmentRoutes = [
    {
        path: '/consignments/view-consignment-list',
        component: React.lazy(() => import('./SPC/ViewConsignmentList')),
        auth: authRoles.SPC_consignments_List
    },
    {
        path: '/consignments/view-consignment/:id',
        component: React.lazy(() => import('./SPC/ViewConsignment')),
        auth: authRoles.SPC_consignments
    },
    //********************************** */
    {
        path: '/consignments/msdAd/view-consignment-list',
        component: React.lazy(() => import('./MSD-AD/ViewMSD_ADOrdersList')),
        auth: authRoles.msd_AD_consignments
    },
    {
        path: '/consignments/msdAd/view-consignment/:id',
        component: React.lazy(() => import('./MSD-AD/ViewConsignmentAD')),
        auth: authRoles.msd_AD_consignments
    },
    {
        path: '/consignments/msdAd/sample-summary',
        component: React.lazy(() => import('./MSD-AD/SampleSummaryAD')),
        auth: authRoles.msd_AD_consignments
    },
    {
        path: '/consignments/msdAd/approveSample/:id',
        component: React.lazy(() => import('./MSD-AD/ApproveSample')),
        auth: authRoles.msd_AD_consignments
    }, 
    {
        path: '/consignments/msdAd/adgrn',
        component: React.lazy(() => import('./MSD-AD/AD_GRN')),
        auth: authRoles.adgrn_view
    },
    {
        path: '/consignments/msdAd/grn-items/:id',
        component: React.lazy(() => import('./MSD-AD/ADGRN_Items')),
        auth: authRoles.adgrn_view
    },


    //********************************** */
    {
        path: '/consignments/msdCIU/view-consignment-list',
        component: React.lazy(() => import('./MSD-CIU/ViewMSD_CIUOrdersList')),
        auth: authRoles.msd_CIU_consignments
    },
    {
        path: '/consignments/msdCIU/view-consignment/:id',
        component: React.lazy(() => import('./MSD-CIU/ViewConsignmentCIU')),
        auth: authRoles.msd_CIU_consignments
    },
    {
        path: '/consignments/msdCIU/sample-summary',
        component: React.lazy(() => import('./MSD-CIU/SampleSummaryCIU')),
        auth: authRoles.msd_CIU_consignments
    },

    {
        path: '/consignments/msdCIU/notify_errors',
        component: React.lazy(() => import('./MSD-CIU/NotifyErrors')),
        auth: authRoles.msd_CIU_consignments
    },
    {
        path: '/consignments/msdCIU/approveSample/:id',
        component: React.lazy(() => import('./MSD-CIU/ApproveSampleCIU')),
        auth: authRoles.msd_CIU_consignments
    }, 
    //********************************** */
    {
        path: '/consignments/msdDirector/view-consignment-list',
        component: React.lazy(() => import('./MSD-Director/ViewMSD_DirectorOrdersList')),
        auth: authRoles.msd_Director_consignments
    },
    {
        path: '/consignments/msdDirector/view-consignment/:id',
        component: React.lazy(() => import('./MSD-Director/ViewConsignmentDirector')),
        auth: authRoles.msd_Director_consignments
    },
    {
        path: '/consignments/msdDirector/sample-summary',
        component: React.lazy(() => import('./MSD-Director/SampleSummaryDirector')),
        auth: authRoles.msd_Director_consignments
    },
    {
        path: '/consignments/msdDirector/approveSample/:id',
        component: React.lazy(() => import('./MSD-Director/ApproveSampleDirector')),
        auth: authRoles.msd_Director_consignments
    },
    //********************************** */
    {
        path: '/consignments/msdMSA/view-consignment-list',
        component: React.lazy(() => import('./MSD-MSA/ViewMSD_MSAOrdersList')),
        auth: authRoles.msd_MSA_consignments
    },
    {
        path: '/consignments/msdMSA/view-confirmed-consignment-list',
        component: React.lazy(() => import('./MSD-MSA/ViewConfirmedMSD_MSAOrdersList')),
        auth: authRoles.msd_MSA_consignments
    },
    {
        path: '/consignments/msdMSA/view-consignment/:id',
        component: React.lazy(() => import('./MSD-MSA/ViewConsignmentMSA')),
        auth: authRoles.msd_MSA_consignments
    },
    {
        path: '/consignments/msdMSA/bin-allocate/:id',
        component: React.lazy(() => import('./MSD-MSA/BinAllocate')),
        auth: authRoles.msd_MSA_consignments
    },

    {
        path: '/consignments/grn-items/:id',
        component: React.lazy(() => import('./MSD-MSA/GRN_Items')),
        auth: authRoles.msd_MSA_consignments
    },
    {
        path: '/consignments/grn',
        component: React.lazy(() => import('./MSD-MSA/All_GRN')),
        auth: authRoles.msd_MSA_consignments
    },
    {
        path: '/consignments/unallocated_grn_items',
        component: React.lazy(() => import('./MSD-MSA/Unallocated_GRN_Items')),
        auth: authRoles.msd_MSA_consignments
    },
    //********************************* */

    {
        path: '/consignments/msdSCO/view-consignment-list',
        component: React.lazy(() => import('./MSD-SCO/ViewMSD_SCOOrdersList')),
        auth: authRoles.msd_SCO_consignments
    },
    {
        path: '/consignments/msdSCO/view-consignment/:id',
        component: React.lazy(() => import('./MSD-SCO/ViewConsignmentSCO')),
        auth: authRoles.msd_SCO_consignments
    },
    {
        path: '/consignments/view-confirmed-orders',
        component: React.lazy(() => import('./ViewConfirmedOrders')),
        auth: authRoles.msd_AD_consignments
    },
    {
        path: '/consignments/confirm-samples/:id',
        component: React.lazy(() => import('./MSD-SCO/ConfirmSamples')),
        auth: authRoles.msd_SCO_consignments
    },
    {
        path: '/consignments/sample-summary',
        component: React.lazy(() => import('./MSD-SCO/SampleSummary')),
        auth: authRoles.msd_SCO_consignments
    },
    {
        path: '/consignments/takeSample/:id',
        component: React.lazy(() => import('./TakeSample')),
        auth: authRoles.consignments_takeSamples
    },

    {
        path: '/consignments/supplies-division-accountant-order-list',
        component: React.lazy(() => import('./SDA/SuppliesDivisionAccountant')),
        auth: authRoles.msd_SDA_consignments
    },
    {
        path: '/consignments/stock-costing/:id',
        component: React.lazy(() => import('./StockCosting')),
        auth: authRoles.msd_SDA_consignments
    },

    {
        path: '/msd-security/orderList',
        component: React.lazy(() => import('./MSD-Security/ViewMSD_SecurityOrdersList')),
        auth: authRoles.msd_Security_consignments
    },
    {
        path: '/msd-security/hospitalOrdering',
        component: React.lazy(() => import('./MSD-Security/VehicleCheckInOut')),
        auth: authRoles.msd_Security_consignments
    },
    {
        path: '/orderList/import',
        component: React.lazy(() => import('./ImportOrderList')),
        auth: authRoles.consignments_orderListImport
    },
    {
        path: '/consignments/msdCIU/verify_package/:id',
        component: React.lazy(() => import('./MSD-CIU/VerifyPackage')),
        auth: authRoles.create_pharmacy,
    },
    {
        path: '/consignments/sda/view-batches/',
        component: React.lazy(() => import('./SDA/ViewBatches')),
        auth: authRoles.msd_SDA_consignments,
    },
    // order List
    {
        path: '/sco/oder-list/',
        component: React.lazy(() => import('./MSD-SCO/OrderList')),
        auth: authRoles.order_list_details,
    },

    // Order List Routes
    {
        path: '/order/order-list/:id',
        component: React.lazy(() => import('./IndividualOrderList')),
        auth: authRoles.order_list_view
    },
    {
        path: '/purchase/purchase-details/:id',
        component: React.lazy(() => import('./IndividualPurchaseList')),
        auth: authRoles.SPC_consignments
    },
    {
        path: '/order/order-list',
        component: React.lazy(() => import('./AllOrderList')),
        auth: authRoles.pending_approval
    },
    {
        path: '/consignment-items',
        component: React.lazy(() => import('./Consignment-Items/consignment_Item_list')),
        auth: authRoles.consignments_items
    },
    {
        path: '/view-all-consignment/:id',
        component: React.lazy(() => import('./All/ViewConsignment')),
        auth: authRoles.msd_SCO_consignments
    },
]

export default ConsignmentRoutes
