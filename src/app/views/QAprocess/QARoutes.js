import React from 'react'
import { authRoles } from '../../auth/authRoles'

const QARoutes = [
    {
        path: '/qualityAssurance/report_suspected_issue',
        component: React.lazy(() => import('./ReportProblem')),
        auth: authRoles.Hopital_QA_rep,
    },
    {
        path: '/qualityAssurance/report_suspected_issue-V2',
        component: React.lazy(() => import('./ReportProblem-V2')),
        auth: authRoles.Hopital_QA_rep,
    },
    {
        path: '/qualityAssurance/allQA-Hospital',
        component: React.lazy(() => import('./Hospital/AllQA_hospital')),
        auth: authRoles.Hopital_QA_approve,
    },
    {
        path: '/qualityAssurance/adr',
        component: React.lazy(() => import('./NMQAL/ADRNew')),
        auth: authRoles.all_QA,
    },
    // {
    //     path: '/qualityAssurance/msd/pharmacist',
    //     component: React.lazy(() => import('./MSDPharmacist/AllQA')),
    //     auth: authRoles.MSD_QA,
    // },
    {
        path: '/qa-data-setup/defect-setup',
        component: React.lazy(() => import('./Managment/DefectSetup')),
        auth: authRoles.all_QA,
    },
    {
        path: '/qa-data-setup/test-setup',
        component: React.lazy(() => import('./Managment/TestsSetup')),
        auth: authRoles.all_QA,
    },
    {
        path: '/qa-data-setup/specification-setup',
        component: React.lazy(() => import('./Managment/SpecificationSetup')),
        auth: authRoles.all_QA,
    },
    {
        path: '/qa-data-setup/result-setup',
        component: React.lazy(() => import('./Managment/ResultSetup')),
        auth: authRoles.all_QA,
    },
    {
        path: '/qa-batch-hold',
        component: React.lazy(() => import('./NMQAL/BatchHold')),
        auth: authRoles.MSD_QA,
    },
    {
        path: '/qualityAssurance/allQA-NMQL-Det',
        component: React.lazy(() => import('./NMQAL/AllQA_NMQL')),
        auth: authRoles.NMQAL_QA_all_det,
    },
    {
        path: '/qualityAssurance/allQA-NMQL',
        component: React.lazy(() => import('./NMQAL/AllQA_NMQL')),
        auth: authRoles.NMQAL_QA_all,
    },
    {
        path: '/qualityAssurance/NMQL_Authorization',
        component: React.lazy(() => import('./NMQAL/NMQLAutharization')),
        auth: authRoles.NMQAL_QA_auth,
    },
    {
        path: '/SampleApprove/allQA-NMQL',
        component: React.lazy(() => import('./NMQAL/SampleApprove')),
        auth: authRoles.NMQAL_QA_auth,
    },
    {
        path: '/QACurrentRequests/allQA-NMQL',
        component: React.lazy(() => import('./NMQAL/QACurrentRequests')),
        auth: authRoles.NMQAL_QA_all,  // NMQAL_QA_auth
    },
    {
        path: '/qualityAssurance/Single_NMQL_Authorization/:id',
        component: React.lazy(() => import('./NMQAL/SignleNMQLAutharization')),
        auth: authRoles.all_QA,
    },
    {
        path: '/qualityAssurance/allQA-NMRA',
        component: React.lazy(() => import('./NMRA/AllQA_NMRANEW')),
        auth: authRoles.NMRA_QA_all,
    },
    {
        path: '/qualityAssurance/allQA-MSD',
        component: React.lazy(() => import('./MSDPharmacist/AllQA_MSD')),
        auth: authRoles.MSD_QA,
    },
    {
        path: '/qualityAssurance/circular_report/:id',
        component: React.lazy(() => import('./MSDPharmacist/curcular_report')),
        auth: authRoles.MSD_QA,
    },
    {
        path: '/qualityAssurance/single-nmra-request',
        component: React.lazy(() => import('./NMRA/SingleRequest')),
        auth: authRoles.NMRA_QA_auth,
    },

    // temp route for print
    {
        path: '/print1',
        component: React.lazy(() => import('./Prints/NMRAreport')),
        auth: authRoles.all_QA,
    },

    {
        path: '/NMRA-report',
        component: React.lazy(() => import('./Prints/MSDreport')),
        auth: authRoles.all_QA,
    },

    {
        path: '/print3',
        component: React.lazy(() => import('./Prints/MSDPrintLab')),
        auth: authRoles.all_QA,
    },


]

export default QARoutes