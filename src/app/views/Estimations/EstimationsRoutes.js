import React from 'react'
import { authRoles } from '../../auth/authRoles'

const EstimationRoutes = [
    {
        path: '/estimation/estimation_setup',
        component: React.lazy(() => import('./MSD/EstimationSetup')),
        auth: authRoles.estimation_setup,
    },
    {
        path: '/estimation/hospital_estimations_list',
        component: React.lazy(() => import('./HospitalSide/CPAssign')),
        auth: authRoles.hospital_estimation_view,
    },
    {
        path: '/estimation/dp_estimations_list',
        component: React.lazy(() => import('./DP/AllEstimation')),
        auth: authRoles.hospital_estimation_view_dp,
    },
    {
        path: '/estimation/msd_estimations_list',
        component: React.lazy(() => import('./MSD/SCO/AllEstimation')),
        auth: authRoles.msd_estimation_view_sco,
    },
    {
        path: '/all_estimation/:id',
        component: React.lazy(() => import('./DP/Estimations')),
        auth: authRoles.hospital_estimation_view_dp,
    },
    {
        path: '/all_estimation_msd/:id',
        component: React.lazy(() => import('./MSD/SCO/Estimations')),
        auth: authRoles.msd_estimation_view_sco,
    },
    {
        path: '/estimation/dp_estimation_items/:id',
        component: React.lazy(() => import('./DP/AllEstimatedItemsMSDView')),
        auth: authRoles.hospital_estimation_view_dp,
    },
    {
        path: '/estimation/msd_estimation_items/:id',
        component: React.lazy(() => import('./MSD/SCO/AllEstimatedItemsMSDView')),
        auth: authRoles.msd_estimation_view_sco,
    },
   
    {
        path: '/estimation/hospital_estimations_requests',
        component: React.lazy(() => import('./HospitalSide/PharmacistEstimations')),
        auth: authRoles.hospital_estimation_requests_view,
    },
    
    {
        path: '/estimation/estimation_items/:id/:warehouse',
        component: React.lazy(() => import('./HospitalSide/AddEstimationsByPharmacist')),
        auth: authRoles.hospital_estimation_requests_view,
    },
    {
        path: '/estimation/cp_estimation_items/:id/:warehouse',
        component: React.lazy(() => import('./HospitalSide/CPAllEstimatedItems')),
        auth: authRoles.hospital_estimation_requests_view,
    },
    {
        path: '/estimation/director/hospital_estimations_list',
        component: React.lazy(() => import('./HospitalSide/HigherLavelsWarehouseWise')),
        auth: authRoles.hospital_estimation_view_director,
    },

    {
        path: '/estimation/director_estimation_items/:id/:warehouse',
        component: React.lazy(() => import('./HospitalSide/HigherLavelsAllEstimatedItems')),
        auth: authRoles.hospital_estimation_view_director,
    },
    {
        path: '/estimation/totalEstimationItemWise/:id',
        component: React.lazy(() => import('./MSD/ViewAllEstimationsItemWise')),
        auth: authRoles.estimation_setup,
    },
    {
        path: '/estimation/totalEstimationWarehouseWise/:id',
        component: React.lazy(() => import('./MSD/ViewAllEstimationsWarehouseWise')),
        auth: authRoles.estimation_setup,
    },
    {
        path: '/estimation/msd_estimation_items/:id/:warehouse',
        component: React.lazy(() => import('./MSD/AllEstimatedItemsMSDView')),
        auth: authRoles.estimation_setup,
    },

    {
        path: '/estimation/item_report',
        component: React.lazy(() => import('./Reports/SingalView')),
        auth: authRoles.hospital_estimation_view,
    },

    {
        path: '/estimation/oldEstimations',
        component: React.lazy(() => import('./Reports/OldData')),
        auth: authRoles.hospital_estimation_view,
    },
    











    {
        path: '/estimation/estimation_create/:id',
        component: React.lazy(() => import('./MSD/CreateEstimation')),
        auth: authRoles.estimation_setup,
    },

    {
        path: '/estimation/loadWarehouse',
        component: React.lazy(() => import('./MSD/EstimationWarehousesAssign')),
        auth: authRoles.estimation_setup,
    },
    {
        path: '/estimation/all-estimation-requests',
        component: React.lazy(() => import('./AllEstimationRequests')),
        auth: authRoles.mds,
    },
    {
        path: '/estimation/rmsd-all-estimation-requests',
        component: React.lazy(() => import('./RMSDAllEstimationRequests')),
        auth: authRoles.rmsd_estimations,
    },
    {
        path: '/estimation/all-drug-store-estimation-requests',
        component: React.lazy(() => import('./DrugStoreAllEstimationRequest')),
        auth: authRoles.mds,
    },
    {
        path: '/estimation/all-consumer-estimation-requests',
        component: React.lazy(() => import('./ConsumerLevelAllEstimation')),
        auth: authRoles.mds,
    },
    // {
    //     path: '/estimation/estimation-details',
    //     component: React.lazy(() => import('./EstimationDetails')),
    //     auth: authRoles.mds,
    // },

    {
        path: '/estimation/drug-store-estimation-detailsTab',
        component: React.lazy(() => import('./DrugstoreEstimationTab')),
        auth: authRoles.mds,
    },
    {
        path: '/estimation/estimation-requestpending',
        component: React.lazy(() => import('./RequestPending')),
        auth: authRoles.mds,
    },
    // {
    //     path: '/estimation/estimation-stepper',
    //     component: React.lazy(() => import('./EstiationDetailTabs/EstimationStepper')),
    //     auth: authRoles.mds,
    // },
    {
        path: '/estimation/individiualrequest',
        component: React.lazy(() => import('./EstiationDetailTabs/EstIndiviualRequest')),
        auth: authRoles.mds,
    },
    {
        path: '/estimation/consumer-estimate',
        component: React.lazy(() => import('./ConsumerLvlTab')),
        auth: authRoles.mds,
    },
    {
        path: '/estimation/all-estimation-items',
        component: React.lazy(() => import('./ConsumerLevel/AllEstimationReq')),
        auth: authRoles.mds,
    },

    {
        path: '/estimation/consumerlvl-estimation-allitems',
        component: React.lazy(() => import('./ConsumerLevel/ConsumerLvlAllItem')),
        auth: authRoles.mds,
    },
    {
        path: '/estimation/set-item-estimation/:id',
        // /:id/:warehouse_id
        component: React.lazy(() => import('./SetItemEstimations')),
        auth: authRoles.mds,
    },
    {
        path: '/estimation/rmsd-set-item-estimation/:id',
        // /:id/:warehouse_id
        component: React.lazy(() => import('./RMSDEstimationabHandling')),
        auth: authRoles.rmsd_create_orders,
        // RMSDSetItemEstimations
    },
    {
        path: '/estimation/rmsd-item-/:id/:item_id',
        // /:id/:warehouse_id
        component: React.lazy(() => import('./RMSDSetItem')),
        auth: authRoles.rmsd_create_orders,
    },

    // Check Estimation Item
    {
        path: '/estimation/institute_estimations/:item_id',
        component: React.lazy(() => import('./InstititeEstimation')),
        auth: authRoles.rmsd_create_orders,
    },
    // {
    //     path: '/distribution/order/:id/:items/:order/:empname/:status/:type',
    //     component: React.lazy(() => import('./individualOrder')),
    //     auth: authRoles.requested_orders,
    // },


]

export default EstimationRoutes
