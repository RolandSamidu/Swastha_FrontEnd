import React from 'react'
import { authRoles } from '../../auth/authRoles'

const warehouseRoutes = [
    //pharmacy routes
    {
        path: '/warehouse/pharmacy/manage',
        component: React.lazy(() => import('./ManagePharmacy')),
        auth: authRoles.clinic,
    },
    {
        path: '/warehouse/pharmacy/create',
        component: React.lazy(() => import('./CreatePharmacy')),
        auth: authRoles.clinic,
    },
    {
        path: '/warehouse/phamacy/assign-pharmacist',
        component: React.lazy(() => import('./subcomponents/AssignPharmacist')),
        auth: authRoles.clinic,
    },
    //drugstore routes
    {
        path: '/warehouse/drug-store/create',
        component: React.lazy(() => import('./CreateDrugStore')),
        auth: authRoles.create_pharmacy,
    },
    //drugstore sub-divisions
    {
        path: '/warehouse/drug-store/manage-drug-store',
        component: React.lazy(() => import('./ManageDrugStore')),
        auth: authRoles.create_pharmacy,
    },
    {
        path: '/warehouse/drug-store/assign-drugs',
        component: React.lazy(() => import('./subcomponents/AssignDrugs')),
        auth: authRoles.create_pharmacy,
    },
    //clinic
    {
        path: '/hospital-data-setup/clinic',
        component: React.lazy(() => import('./Clinic')),
        auth: authRoles.clinic,
    },
    {
        path: '/hospital-data-setup/create-new-clinic/:id',
        component: React.lazy(() => import('./CreateNewClinic')),
        auth: authRoles.clinic
    },
    //ward
    {
        path: '/hospital-data-setup/ward', 
        component: React.lazy(() => import('./Ward')),
        auth: authRoles.ward,
    },
    {
        path: '/hospital-data-setup/OPD', 
        component: React.lazy(() => import('./OPD')),
        auth: authRoles.ward,
    },
    //unit
    {
        path: '/hospital-data-setup/unit',
        component: React.lazy(() => import('./Unit')),
        auth: authRoles.ward,
    },
    {
        path: '/hospital-data-setup/create-new-ward/:id',
        component: React.lazy(() => import('./CreateNewWard')),
        auth: authRoles.ward,
    },
    {
        path: '/hospital-data-setup/create-new-OPD/:id',
        component: React.lazy(() => import('./CreateNewOPD')),
        auth: authRoles.ward,
    },
    {
        path: '/hospital-data-setup/create-new-unit/:id',
        component: React.lazy(() => import('./CreateNewUnit')),
        auth: authRoles.ward,
    },
    //front desk
    {
        path: '/hospital-data-setup/front-desk',
        component: React.lazy(() => import('./FrontDesk')),
        auth: authRoles.hospital_admin,
    },
    {
        path: '/hospital-data-setup/create-new-front-desk/:id',
        component: React.lazy(() => import('./CreateNewFrontDesk')),
        auth: authRoles.hospital_admin,
    },
    //Pharmacy
    {
        path: '/hospital-data-setup/pharmacy',
        component: React.lazy(() => import('./Pharmacy')),
        auth: authRoles.hospital_admin,
    },
    {
        path: '/hospital-data-setup/assing_pharmacist/:id',
        component: React.lazy(() => import('./AssingPharmacist')),
        auth: authRoles.hospital_admin
    },
    //Pharmacy
    {
        path: '/hospital-data-setup/drug_store',
        component: React.lazy(() => import('./DrugStore')),
        auth: authRoles.hospital_admin,
    },
    {
        path: '/rmsd-data-setup/rmsd_drug_store',
        component: React.lazy(() => import('./RMSDDrugStore')),
        auth: authRoles.rmsd_admin,
    },
    {
        path: '/rmsd/users/add',
        component: React.lazy(() => import('./RMSDUser')),
        auth: authRoles.rmsd_admin,
    },
    {
        path: '/hospital-data-setup/assing_drug_store/:id',
        component: React.lazy(() => import('./AssingDrugStore')),
        auth: authRoles.hospital_admin
    },
    {
        path: '/rmsd-data-setup/assing_drug_store/:id',
        component: React.lazy(() => import('./AssingDrugStoreRMSD')),
        auth: authRoles.rmsd_admin
    },

    {
        path: '/warehouse/editwarehousetab/:id',
        component: React.lazy(() => import('./EditWarehouseTabHandling')),
        auth: authRoles.warehouse_handling,
    },
    {
        path: '/warehouse/drug-store/editwarehousetab/:id',
        component: React.lazy(() => import('./DSEditWarehouseTabHandling')),
        auth: authRoles.warehouse_handling,
    },
    {
        path: '/warehouse/drug-store/warehouse-item/:id',
        component: React.lazy(() => import('../MSD-warehouse/DSWarehouseItem')),
        auth: authRoles.warehouse_handling,
    },
    // {
    //     path: '/warehouse/view-item-mst/:id',
    //     component: React.lazy(() => import('./ItemWarehouseView')),
    //     auth: authRoles.warehouse_handling,
    // },

    {
        path: '/hospital-data-setup/prescription_reject',
        component: React.lazy(() => import('./PrescriptionRejectionSetup')),
        auth: authRoles.hospital_admin,
    },
    
]

export default warehouseRoutes
