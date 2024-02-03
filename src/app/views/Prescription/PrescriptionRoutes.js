import React from 'react'
import { authRoles } from '../../auth/authRoles'

const prescriptionRoutes = [
    {
        path: '/prescription/search/patients',
        component: React.lazy(() => import('./PatientsSearch')),
        auth: authRoles.prescription,
    },
    {
        path: '/prescription/search/OPDpatients',
        component: React.lazy(() => import('./OPDPatientsSearch')),
        auth: authRoles.prescription,
    },
    {
        path: '/prescription/favourites',
        component: React.lazy(() => import('./Favourites')),
        auth: authRoles.prescription,
    },
    {
        path: '/prescription/npdrug/:id',
        component: React.lazy(() => import('./NPDrugView')),
        auth: authRoles.npdrug,
    },
    {
        path: '/prescription/npdrug',
        component: React.lazy(() => import('./NPDrug')),
        auth: authRoles.npdrug,
    },
    {
        path: '/prescription/npdrug-with_patient',
        component: React.lazy(() => import('./NPDrugWithNewPatient')),
        auth: authRoles.npdrug_withNewPatient,
    },


     // Name Patient Drugs Check
    // {
    //     path: '/prescription/drug',
    //     component: React.lazy(() => import('./NPDrugView')),
    //     auth: authRoles.dashboard,
    // },


    {
        path: '/prescription/npdrug-ordering',
        component: React.lazy(() => import('./NPDrugOrdering')),
        auth: authRoles.npdrugPlaceOrder,
    },
    {
        path: '/prescription/npdrug-exchange',
        component: React.lazy(() => import('./NPDrugExchangeRequest')),
        auth: authRoles.npdrug,
    },
    {
        path: '/prescription/npdrug-placed-orders',
        component: React.lazy(() => import('./NPDrugOrders')),
        auth: authRoles.npdrugPlacedOrder,
    },
    {
        path: '/prescription/npdrug-order-view/:id',
        component: React.lazy(() => import('./NPDrugOrderView')),
        auth: authRoles.npdrug,
    },
    {
        path: '/prescription/npdrug-summary',
        component: React.lazy(() => import('./NPDrugSummary')),
        auth: authRoles.npdrug_summary,
    },
    {
        path: '/prescription/npdrug-approval',
        component: React.lazy(() => import('./NPDrugApproval')),
        auth: authRoles.npdrugApproval,
    },
    {
        path: '/prescription/npdrug-pending',
        component: React.lazy(() => import('./NPDrugPending')),
        auth: authRoles.npdrug,
    },
    {
        path: '/prescription/npdrug-fr-status',
        component: React.lazy(() => import('./NPDrugFRStatus')),
        auth: authRoles.npdrug,
    },
    {
        path: '/prescription/npdrug-timeline',
        component: React.lazy(() => import('./NPDrugTimeline')),
        auth: authRoles.npdrug,
    },
    {
        path: '/prescription/referred',
        component: React.lazy(() => import('./Referred')),
        auth: authRoles.dashboard,
    },
    {
        path: '/pharmacy/prescription',
        component: React.lazy(() => import('./Patient')),
        auth: authRoles.pharmacy,
    },
    {
        path: '/pharmacy/patient_prescription',
        component: React.lazy(() => import('./PatientPrescription')),
        auth: authRoles.pharmacy,
    },
    {
        path: '/pharmacy/patients',
        component: React.lazy(() => import('./PatientWidgets')),
        auth: authRoles.pharmacy,
    },
    {
        path: '/pharmacy/exchanges',
        component: React.lazy(() => import('./Exchanges')),
        auth: authRoles.pharmacy,
    },
    {
        path: '/pharmacy/overview',
        component: React.lazy(() => import('./Pharmacy')),
        auth: authRoles.pharmacy,
    },
    {
        path: '/pharmacy/referred',
        component: React.lazy(() => import('./Referred')),
        auth: authRoles.pharmacy,
    },
    {
        path: '/pharmacy/search/patients',
        component: React.lazy(() => import('./PatientsSearchPharmacy')),
        auth: authRoles.pharmacy,
    },
    {
        path: '/pharmacy/search/activePresciption',
        component: React.lazy(() => import('./ActivePrescriptionSearchPharmacy')),
        auth: authRoles.pharmacy,
    },
    {
        path: '/pharmacy/patient_prescription_history',
        component: React.lazy(() => import('./PatientPrescriptionHistory')),
        auth: authRoles.issued_prescription_view_all,
    },
    {
        path: '/pharmacy/patient_prescription_history_all',
        component: React.lazy(() => import('./PatientPrescriptionHistoryAll')),
        auth: authRoles.all_issued_prescription_view,
    },

]

export default prescriptionRoutes