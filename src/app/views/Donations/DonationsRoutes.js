import React from 'react'
import { authRoles } from '../../auth/authRoles'

const DonationsRoutes = [
    {
        path: '/donation/view-donations',
        component: React.lazy(() => import('./ViewDonations')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/donation-registration',
        component: React.lazy(() => import('./DonationRegistration')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/edit-donar:id',
        component: React.lazy(() => import('./EditDonar')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/view-donation-items/:id/:donar_id',
        component: React.lazy(() => import('./ViewDonationItems')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/view-donation-registration-note/:id/:donar_id',
        component: React.lazy(() => import('./ViewSingleDonationItem')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/donation-registration-note/:id',
        component: React.lazy(() => import('./DonationNote')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/donation-registration-note-NEW',
        component: React.lazy(() => import('./AddDetails')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/donation-donar-list',
        component: React.lazy(() => import('./ViewDonarList')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/donation-msd-sr-request',
        component: React.lazy(() => import('./ViewSRrequest')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/sr-view-donation-items/:id/:donar_id',
        component: React.lazy(() => import('./ViewSRDonationItems')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/view-sr-donation-registration-note/:id/:donar_id',
        component: React.lazy(() => import('./ViewSingleSRDonationItem')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/donation-msd-sco',
        component: React.lazy(() => import('./MSD_SCO_View')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/sco-view-donation-items',
        // path: '/donation/sco-view-donation-items/:id/:donar_id',
        component: React.lazy(() => import('./ViewSCODonationItems')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/view-sco-donation-registration-note/:id/:donation_id',
        component: React.lazy(() => import('./ViewSingleSRDonationItem')),
        auth: authRoles.donation,
    },
    // {
    //     path: '/donation/view-msa-donation-edit/:id/:donation_id',
    //     component: React.lazy(() => import('./ViewSingleSRDonationItem')),
    //     auth: authRoles.donation,
    // },
    {
        path: '/donation/hsco-view-donation-items',
        // '/donation/donation-msd-hsco',
        component: React.lazy(() => import('./ViewHSCODonationItems')),
        // component: React.lazy(() => import('./MSD_HSCO_View')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/ciu-view-donation-items',
        component: React.lazy(() => import('./ViewCIUDonations')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/ciu-view-donation-item/:id/:donar_id',
        component: React.lazy(() => import('./ViewCUIDonationItem')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/hsco-view-donation-items/:id/:donar_id',
        component: React.lazy(() => import('./ViewHSCODonationItems')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/view-hsco-donation-registration-note/:id/:donation_id',
        component: React.lazy(() => import('./ViewSingleHCOSRDonationItem')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/view-donation-grn',
        component: React.lazy(() => import('./ViewGRNDonations')),
        auth: authRoles.donation,
       
    },
    {
        path: '/donation/view-single-donation-grn/:id',
        component: React.lazy(() => import('./ViewGRN')),
        auth: authRoles.donation,
        
    },
    {
        path: '/donation/grn-ad-donation',
        component: React.lazy(() => import('./ViewADGRN')),
        auth: authRoles.donation,
        
    },

    //hospital donation
    {
        path: '/donation/view-hospital-donations',
        component: React.lazy(() => import('./HosViewDonations')),
        auth: authRoles.donation_hos,
    },
    {
        path: '/donation/hospital-donation-registration',
        component: React.lazy(() => import('./DonationRegistration')),
        auth: authRoles.donation,
    },
    {
        path: '/donation/view-hospital-donation-grn',
        component: React.lazy(() => import('./ViewGRNDonations')),
        auth: authRoles.donation_hos,
    },
    {
        path: '/donation/donation-donar-list',
        component: React.lazy(() => import('./HosViewDonarList')),
        auth: authRoles.donation_hos,
    },
    // {
    //     path: '/donation/donation-msd-sr-request',
    //     component: React.lazy(() => import('./ViewSRrequest')),
    //     auth: authRoles.donation_hos,
    // },

]

export default DonationsRoutes