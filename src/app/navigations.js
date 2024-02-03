import { authRoles } from './auth/authRoles'

export const navigations = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: 'account_circle',
        auth: [...authRoles.dashboard, ...authRoles.check_item_stock],
    },
    {
        name: 'Order Control Form',
        icon: 'shopping_cart',
        children: [
            {
                name: 'Approval',
                path: '/ordering/approval',
                auth: authRoles.ordering_approval,
            },

            {
                name: 'Create',
                path: '/ordering/createOrder',
                auth: authRoles.ordering_view,
            },
            {
                name: 'Place Order',
                path: '/ordering/placeOrder',
                auth: authRoles.ordering_view,
            },
            // {
            //     name: 'foreacast Order',
            //     path: '/ordering/forecast/:id',
            //     auth: authRoles.ordering_view,
            // },
            // {
            //     name: 'scheduling Orders',
            //     path: '/ordering/ScheduledOrders',
            //     auth: authRoles.ordering_view,
            // },

            {
                name: 'Scheduling Orders',
                path: '/ordering/ScheduledOrders',
                auth: authRoles.ordering_view,
            },
            {
                name: 'Upcoming Orders',
                path: '/ordering/upcoming',
                auth: authRoles.ordering_view,
            },
        ],
    },
    {
        name: 'Prescription',
        icon: 'medical_services',

        children: [
            {
                name: 'Clinic Prescription',
                //path: '/prescription/clinic',
                path: '/prescription/search/patients',
                auth: authRoles.prescription,
            },
            {
                name: 'OPD Prescription',
                path: '/prescription/search/OPDpatients',
                auth: authRoles.prescription,
            },
            {
                name: 'Favourites',
                path: '/prescription/favourites',
                auth: authRoles.prescription,
            },
            {
                name: 'Referred Prescriptions',
                path: '/prescription/referred',
                auth: authRoles.prescription,
            },

        ],
    },

    {
        name: 'Name Patient',
        icon: 'medical_services',

        children: [
            /* 
                        {
                            name: 'Order',
                            path: '/prescription/npdrug',//need to be come from np drug widget
                            auth: authRoles.npdrug,
                        }, */
            {
                name: 'Order',
                path: '/prescription/npdrug-with_patient',
                auth: authRoles.npdrug_withNewPatient,
            },
            {
                name: 'Summary',
                path: '/prescription/npdrug-summary',
                auth: authRoles.npdrug_summary,
            },
            {
                name: 'Exchange',
                path: '/prescription/npdrug-exchange',
                auth: authRoles.npdrug,
            },
            {
                name: 'Approval',
                path: '/prescription/npdrug-approval',
                auth: authRoles.npdrugApproval,
            },
            {
                name: 'Place Order',
                path: '/prescription/npdrug-ordering',
                auth: authRoles.npdrugPlaceOrder,
            },
            // {
            //     name: 'Placed Order',
            //     path: '/prescription/npdrug-placed-orders',
            //     auth: authRoles.npdrugPlacedOrder,
            // },
            {
                name: 'FR Status',
                path: '/prescription/npdrug-fr-status',
                auth: authRoles.npdrugFR,
            },
            // {
            //     name: 'Drug',
            //     path: '/prescription/drug',
            //     auth: authRoles.npdrug,
            // },
        ],
    },
    {
        name: 'Stock Inquiry',
        path: '/stockInquiry',
        icon: 'book',
        auth: authRoles.stockInquiry,
    },
    {
        name: 'Guidelines',
        path: '/Refferences',
        icon: 'book',
        auth: authRoles.refferences,
    },
    {
        name: 'Newly Arrived Items',
        path: '/consignments/grn-items',
        icon: 'book',
        auth: authRoles.newlyArraived,
    },
    {
        name: 'Ledger',
        path: '/Ledger',
        icon: 'book',
        auth: authRoles.ledger,
    },
    {
        name: 'Institution Stock',
        path: '/institution_stock',
        icon: 'book',
        auth: authRoles.institutionStock,
    },

    {
        name: 'Reports',
        icon: 'book',

        children: [
            /* {
                name: 'Report',
                path: '/dashboardComponent/report',
                auth: authRoles.dashboardComponent,
            }, */

            {
                name: 'Stock Position Report',
                path: '/dashboardComponent/PharmaceuticalUpdate',
                auth: authRoles.dashboardComponent,
            },
        ]
    },

    {
        name: 'Pharmacy',
        icon: 'local_pharmacy',

        children: [
            {
                name: 'Quick Patient Search',
                path: '/pharmacy/patient_prescription',
                auth: authRoles.pharmacy,
            },
            {
                name: 'Advance Patient Search',
                path: '/pharmacy/search/patients',
                auth: authRoles.pharmacy,
            },
            {
                name: 'Active Prescription',
                path: '/pharmacy/search/activePresciption',
                auth: authRoles.pharmacy,
            },
            {
                name: 'My Issued Prescription',
                path: '/pharmacy/patient_prescription_history',
                auth: authRoles.issued_prescription_view,
            },
            {
                name: 'All Issued Prescription',
                icon: 'vaccines',
                path: '/pharmacy/patient_prescription_history_all',
                auth: authRoles.all_issued_prescription_view,
            },
            {
                name: 'Patient Details',
                path: '/pharmacy/patients',
                auth: authRoles.pharmacy,
            },
            {
                name: 'Exchanges',
                path: '/pharmacy/exchanges',
                auth: authRoles.pharmacy,
            },
            // {
            //     name: 'Overview',
            //     path: '/pharmacy/overview',
            //     auth: authRoles.pharmacy,
            // },
            {
                name: 'Referred Prescriptions',
                path: '/pharmacy/referred',
                auth: authRoles.pharmacy,
            },
        ],
    },
    {
        name: 'My Issued Prescription',
        icon: 'menu_book',
        path: '/pharmacy/patient_prescription_history',
        auth: authRoles.issued_prescription_view_doctor,
    },
    {
        name: 'Patients',
        icon: 'personal_injury',
        /*  auth: [
             ...authRoles.frontDesk,
             ...authRoles.ward_Admit
         ], */
        children: [
            {
                name: 'Patient',
                path: '/patients/search',
                auth: authRoles.frontDesk,
            },
            {
                name: 'Ward Patient',
                path: '/patients/ward/search',
                auth: authRoles.ward_Admit,
            },
        ],
    },
    {
        name: 'Unallocated Items',
        path: '/consignments/unallocated_grn_items',
        icon: 'topic',
        auth: authRoles.msd_MSA_consignments,
    },
    {
        name: 'Consignments',
        icon: 'receipt_long',
        /*   auth: [
        ...authRoles.SPC_consignments,
        ...authRoles.msd_AD_consignments,
        ...authRoles.msd_CIU_consignments,
        ...authRoles.msd_Director_consignments,
        ...authRoles.msd_MSA_consignments,
        ...authRoles.msd_SCO_consignments,
        ...authRoles.msd_Security_consignments,
        ...authRoles.msd_SDA_consignments

    ], */
        children: [
            /*  {
                 name: 'Import Order List',
                 path: '/orderList/import',
                 auth: authRoles.consignments_orderListImport,
             }, */
            {
                name: 'Item Wise',
                path: '/consignment-items',
                auth: authRoles.consignments_items,
            },
            {
                name: 'View Consignment List(SPC)',
                path: '/consignments/view-consignment-list',
                auth: authRoles.SPC_consignments_List,
            },
            /*  { //commented by roshan
                 name: 'New Consignment(SPC)',
                 path: '/spc/consignment/create',
                 auth: authRoles.SPC_consignments,
             }, */
            {
                name: 'Pending Consigment List',
                path: '/consignments/msdAd/view-consignment-list',
                auth: authRoles.msd_AD_consignments,
            },
            {
                name: 'View Consigment List(msdCIU)',
                path: '/consignments/msdCIU/view-consignment-list',
                auth: authRoles.msd_CIU_consignments,
            },
            {
                name: 'View Consigment List(msdDirector)',
                path: '/consignments/msdDirector/view-consignment-list',
                auth: authRoles.msd_Director_consignments,
            },
            {
                name: 'Pending Consigment List',
                path: '/consignments/msdMSA/view-consignment-list',
                auth: authRoles.msd_MSA_consignments,
            },
            {
                name: 'Confirmed Consignment List',
                path: '/consignments/msdMSA/view-confirmed-consignment-list',
                auth: authRoles.msd_MSA_consignments,
            },
            {
                name: 'View Consigment List(msdSCO)',
                path: '/consignments/msdSCO/view-consignment-list',
                auth: authRoles.msd_SCO_consignments,
            },
            {
                name: 'View Confirmed Orders',
                path: '/consignments/view-confirmed-orders',
                auth: authRoles.msd_AD_consignments,
            },
            {
                name: 'GRN',
                path: '/consignments/grn',
                auth: authRoles.msd_MSA_consignments,
            },
            {
                name: 'GRN',
                path: '/consignments/msdAd/adgrn',
                auth: authRoles.adgrn_view,
            },

            {
                name: 'Sample Summary',
                path: '/consignments/sample-summary',
                auth: authRoles.msd_SCO_consignments,
            },
            {
                name: 'Sample Summary',
                path: '/consignments/msdAd/sample-summary',
                auth: authRoles.msd_AD_consignments,
            },
            {
                name: 'Sample Summary',
                path: '/consignments/msdDirector/sample-summary',
                auth: authRoles.msd_Director_consignments,
            },
            {
                name: 'Sample Summary',
                path: '/consignments/msdCIU/sample-summary',
                auth: authRoles.msd_CIU_consignments,
            },

            {
                name: 'Details',
                path: '/consignments/supplies-division-accountant-order-list',
                auth: authRoles.msd_SDA_consignments,
            },
            {
                name: 'View Batches - Shipment Costing',
                path: '/consignments/sda/view-batches/',
                auth: authRoles.msd_SDA_consignments,
            },

        ],
    },

    {
        name: 'Order List View',
        icon: 'table_view',
        children: [

            {
                name: 'Pending Approval',
                path: '/order/order-list',
                auth: authRoles.pending_approval,
            },
            {
                name: 'Details',
                path: '/sco/oder-list/',
                auth: authRoles.order_list_details,
            }
        ]
        // path: '/sco/oder-list/',
        // icon: 'table_view',
        // auth: authRoles.order_list_details,
    },
    {
        name: 'Consignments Ordering',
        path: '/msd-security/orderList',
        icon: 'table_view',
        auth: authRoles.msd_Security_consignments,
    },
    {
        name: 'Hospital Ordering',
        path: '/msd-security/hospitalOrdering',
        icon: 'local_hospital',
        auth: authRoles.msd_Security_consignments,
    },
    {
        name: 'Stock level Setup',
        icon: 'inventory_2',
        path: '/order/minstock',
        auth: authRoles.min_stock,
    },
    {
        name: 'My Stock',
        icon: 'unarchive',
        path: '/item_stock',
        auth: authRoles.item_stock2,
    },
    // {
    //     name: 'My Stock New',
    //     icon: 'unarchive',
    //     path: '/mystocknew',
    //     auth: authRoles.check_item_stock_verification,
    // },


    {
        name: 'Check Stock',
        icon: 'mark_chat_read',
        path: '/check_item_stocks',
        auth: authRoles.check_item_stock,
    },
    {
        name: 'Remarks',
        path: '/order/remarks',
        icon: 'note_alt',
        auth: authRoles.hospital_order_remarks,
    },
    {
        name: 'Orders',
        icon: 'home_repair_service',
        //auth: authRoles.hospital_order,
        children: [
            {
                name: 'Create Item Wise',
                path: '/order/create',
                auth: authRoles.hospital_order_create_itemWise,
            },
            /*  {
               name: 'All Orders',
               path: '/main-drug-store/all-orders',
               auth: authRoles.mds,
           }, */
            {
                name: 'Create Item Wise',
                path: '/MDS/create_order',
                auth: authRoles.mds_create_order,
            },
            /*  {
                 name: 'Create Orders',
                 path: '/RMSD_to_MSD/create_order',
                 auth: authRoles.rmsd_create_orders,
             }, */

            {
                name: 'Create Warehouse Wise',
                path: '/MDS/create_order_withwarehouse',
                auth: authRoles.create_orders_with_warehouse,
            },
            {
                name: 'Return Details',//'Order Placed By Me'
                path: '/return_orders/all-orders?type=Return',
                auth: authRoles.return_details,
            },
            {
                name: 'Order Details',//'Order Placed By Me'
                path: '/hospital-ordering/all-orders?type=Order',
                auth: authRoles.min_stock,
            },

            {
                name: 'Request Details',//Order Placed On Me
                path: '/msa_all_order/all-orders?type=Order',
                auth: authRoles.supply_assistant,
            },
            {
                name: 'Direct Distribution',//Order Placed On Me
                path: '/distribution/distribution-details?type=Order',
                auth: authRoles.supply_assistant,
            },

            {
                name: 'Cash Sales',//Order Placed On Me
                path: '/msa_all_order/all-orders-cash_sales?type=CASH SALES',
                auth: authRoles.caseSale,
            },
            /*  {
                 name: 'Return Orders',
                 path: '/main-drug-store/all-Return_Orders',
                 iconText: 'R1',
                 auth: authRoles.mds,
             }, */
            // {     name: 'Chief Pharmacist',     path: '/MDS_chiefPharmacist/AllOders',
            // iconText: 'T1',     auth: authRoles.patients_registration },
            {
                name: 'Order Details',
                path: '/MDS_Director/AllOders',
                auth: authRoles.mds_director,
            },
            // {     name: 'Remarks',     path: '/MDS/remarks',     iconText: 'T1',
            // auth: authRoles.patients_registration }, {     name: 'Set Min Stock',
            // path: '/MDS/minstock',     iconText: 'T1',     auth:
            // authRoles.patients_registration }, {     name: 'Profile',     path:
            // '/MDS/ppprofile',     iconText: 'T1',     auth:
            // authRoles.patients_registration },

            {
                name: 'Remarks Setup',
                path: '/RMSD_to_MSD/remarks',
                auth: authRoles.create_remarks,
            },
        ],
    },
    {
        name: 'Exchange',
        icon: 'cloud_sync',
        //auth: authRoles.hospital_order,
        children: [
            {
                name: 'Create',
                path: '/MDS/create_order_exchange?type=Exchange direct warehouse',
                auth: authRoles.create_orders_with_warehouse,
            },
            , {
                name: 'Exchange In',//Exchange Order Placed On Me
                path: '/msa_all_order/exchange-orders?type=EXCHANGE',
                auth: authRoles.supply_assistant,
            }, {
                name: 'Exchange Out',//'Order Placed By Me'
                path: '/hospital-ordering/exchange_orders?type=EXCHANGE',
                auth: authRoles.min_stock,
            }]
    },

    {
        name: 'Sales Orders',
        icon: 'home_repair_service',
        //auth: authRoles.hospital_order,
        children: [

            {
                name: 'Create Item Wise',
                path: '/sellsorder/create_order?type=SellsOrder',
                auth: authRoles.salesOrder_create_order,
            },
            {
                name: 'Create Warehouse Wise',
                path: '/sellsorder/create_order_withwarehouse?type=SellsOrder',
                auth: authRoles.create_sales_orders_with_warehouse,
            },
            {
                name: 'Order Details',//'Order Placed By Me'
                path: '/sellsorder/all-orders?type=Sales Order',
                auth: authRoles.sales_orders_list,
            },

        ]

    },


    {
        name: 'MSD',
        icon: 'apartment',
        auth: authRoles.msd_view,
        children: [
            {
                name: 'Sample Criteria Setup',
                path: '/msd/sample-criteria-setup',
                auth: authRoles.sample_criteria_setup,
            },
            {
                name: 'SCO',
                path: '/msd/sco/accept-sample-info/ae0f32dd-eb7d-40ef-bcfb-6ac2f6b8ef01',
                auth: authRoles.msd_view,
            },
            {
                name: 'Take Sample',
                path: '/vehicles/takeSample',
                auth: authRoles.vehicles_view,
            },
            {
                name: 'Approve Sample',
                path: '/vehicles/approveSample/25c21eb0-7d85-4fa0-a31d-eb23e20aca2f',
                auth: authRoles.vehicles_view,
            },
            {
                name: 'Approve Sample Director',
                path: '/vehicles/approveSampleDirector/25c21eb0-7d85-4fa0-a31d-eb23e20aca2f',
                auth: authRoles.vehicles_view,
            },
        ],
    },
    /* {
        name: 'Warehoure',
        icon: 'luggage',
        children: [
            // pharmacy route
            {
                name: 'Total Warehouse',
                path: '/distribution/totalwarehouse',
                auth: authRoles.warehouse_view,
            },
            {
                name: 'Pharmacy',
                auth: authRoles.patients_registration,
                children: [
                    {
                        name: 'Manage Pharmacy',
                        path: '/warehouse/pharmacy/manage',
                        auth: authRoles.patients_registration,
                    },
                    {
                        name: 'Add New Pharmacy',
                        path: '/warehouse/pharmacy/create',
                        auth: authRoles.patients_registration,
                    },
                ],
            },

            // clinic route
            {
                name: 'Clinic',
                iconText: 'T1',
                children: [
                    {
                        name: 'Manage Clinic',
                        path: '/warehouse/clinic',
                        auth: authRoles.clinic,
                    },
                    {
                        name: 'Manage Ward',
                        path: '/warehouse/ward',
                        auth: authRoles.ward,
                    },
                    {
                        name: 'Manage Front Desk',
                        path: '/warehouse/front-desk',
                        auth: authRoles.frontDesk,
                    },
                ],
            },
        ],
    }, */
    {
        name: 'Item Master',
        icon: 'view_compact',
        // auth: authRoles.item_master_view,
        children: [
            {
                name: 'Create New Item',
                path: '/item-mst/create-item-mst',
                auth: authRoles.item_master_view,
            },
            {
                name: 'All Item',
                path: '/item-mst/all-item',
                auth: authRoles.item_master_view_All_Item,
            },
            {
                name: 'Managment',
                auth: authRoles.item_master_view,
                children: [
                    {
                        name: 'Category',
                        path: '/data-setup/category',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Class',
                        path: '/data-setup/class',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Category Type',
                        path: '/data-setup/group-type',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Group',
                        path: '/data-setup/group',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Subgroup/Serial Setup', //Serial/Family
                        path: '/item-mst/group-serial-family-setup',
                        auth: authRoles.item_master_view,
                    },

                    // {src/app/navigations.js
                    //     name: 'Batch Trace',
                    //     path: '/item-mst/batch-trace',
                    //     iconText: 'N6',
                    //     auth: authRoles.item_master_view,
                    // },
                    // {
                    //     name: 'Condition',
                    //     path: '/item-mst/condition',
                    //     iconText: 'N7',
                    //     auth: authRoles.item_master_view,
                    // },
                    // {
                    //     name: 'Cyclic Code',
                    //     path: '/item-mst/cyclic-code',
                    //     iconText: 'N8',
                    //     auth: authRoles.item_master_view,
                    // },
                    {
                        name: 'Institutional levels',
                        path: '/item-mst/institution',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Item Type',
                        path: '/item-mst/item-type',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Item Usage Type',
                        path: '/item-mst/item-usage-type',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Movement Type',
                        path: '/item-mst/movement-type',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Shelf Life',
                        path: '/item-mst/shelf-life',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Stock',
                        path: '/item-mst/stock',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Storage',
                        path: '/item-mst/storage',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'UOM',
                        path: '/item-mst/uom',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'VEN',
                        path: '/item-mst/ven',
                        auth: authRoles.item_master_view,
                    },
                    // {
                    //     name: 'ABC Class',
                    //     path: '/item-mst/abc-class',
                    //     iconText: 'N18',
                    //     auth: authRoles.item_master_view,
                    // },
                    {
                        name: 'Default Frequency',
                        path: '/item-mst/default-frequency',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Default Routes',
                        path: '/item-mst/default-routes',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Display Units',
                        path: '/item-mst/display-units',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Measuring Units',
                        path: '/item-mst/measuring-units',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Measuring Units Code',
                        path: '/item-mst/measuring-units_codes',
                        auth: authRoles.item_master_view,
                    },
                    {
                        name: 'Dosage Form',
                        path: '/item-mst/dosage-form',
                        auth: authRoles.item_master_view,
                    },
                ],
            },
        ],
    },
    {
        name: 'Data Setups',
        icon: 'account_tree',
        children: [
            {
                name: 'Add Users',
                path: '/msd/dataSetup/users',
                auth: authRoles.msd_dataSetup,
            },
            {
                name: 'Clinic-Setup',
                path: '/data-setup/clinic-setup',
                auth: authRoles.data_setup,
            },
            {
                name: 'Clinic-Diagnosis',
                path: '/data-setup/clinic-diagnosis-setup',
                auth: authRoles.data_setup,
            },
            {
                name: 'Clinic-Complaints',
                path: '/data-setup/clinic-complaint-setup',
                auth: authRoles.data_setup,
            },
            {
                name: 'Clinic-Allergies Setup',
                path: '/data-setup/clinic-allergies-setup',
                auth: authRoles.data_setup,
            },
            {
                name: 'Clinic-Complications',
                path: '/data-setup/clinic-complications-setup',
                auth: authRoles.data_setup,
            },
        ],
    },
    {
        name: 'Vehicles',
        icon: 'local_shipping',
        children: [

            {
                name: 'Vehicle Type',
                path: '/vehicles/vehicleType',
                auth: authRoles.vehicles_view_new,
            },
            {
                name: 'Add Vehicles',
                path: '/vehicles/addVehicle',
                auth: authRoles.vehicles_view_new,
            },
            {
                name: 'Vehicle User',
                path: '/vehicles/vehicleUser',
                auth: authRoles.vehicles_view_new,
            },
            {
                name: 'Assign Default User',
                path: '/vehicles/user',
                auth: authRoles.vehicles_view_new,
            },
        ],
    },

    // drugstore route
    {
        name: 'Drugstore',
        icon: 'shopping_cart',
        auth: authRoles.patients_registration,
        children: [
            {
                name: 'Manage Drugstore',
                path: '/warehouse/drug-store/manage-drug-store',
                auth: authRoles.patients_registration,
            },
            {
                name: 'Add Drugstore',
                path: '/warehouse/drug-store/create',
                auth: authRoles.patients_registration,
            },
            {
                name: 'Assign Drugs',
                path: '/warehouse/drug-store/assign-drugs',
                auth: authRoles.patients_registration,
            },
        ],
    },
    /* {
        name: 'Item Master',
        icon: 'table_view',
        auth: authRoles.item_master_view,
        children: [{
            name: 'Create New Item',
            path: '/item-mst/create-item-mst',
            iconText: 'N1',
            auth: authRoles.item_master_view,
        },
        {
            name: 'Group Series Setup',
            path: '/item-mst/group-series-setup',
            iconText: 'N2',
            auth: authRoles.item_master_view,
        },
        {
            name: 'Group Item Setup',
            path: '/item-mst/group-item-setup',
            iconText: 'N3',
            auth: authRoles.item_master_view,
        },


        ],
    }, */

    {
        name: 'Chief Pharmacist',
        icon: 'admin_panel_settings',
        auth: authRoles.chief_pharmacist,
        children: [
            {
                name: 'All Orders',
                path: '/chiefPharmacist/AllOders',
                auth: authRoles.chief_pharmacist,
            },
            {
                name: 'Pending Orders',
                path: '/chiefPharmacist/PendingOrders',
                auth: authRoles.chief_pharmacist,
            },
        ],
    },
    {
        name: 'Distrubution Center',
        icon: 'business_center',
        // auth: authRoles.requested_orders,
        children: [
            {
                name: 'Allocation Ledger',
                path: '/distribution/allocation-ledger',
                auth: authRoles.distribution_allocation_led,
            },
            {
                name: 'Requested Orders',
                path: '/distribution/all-orders',
                auth: authRoles.distribution_requested_orders,
            },
            {
                name: 'Sales Order',
                path: '/distribution/sales-order',
                auth: authRoles.distribution_requested_sales_order,
            },
            {
                name: 'Requested Orders',
                path: '/distribution/msdad/all-orders',
                auth: authRoles.requested_orders_ad_view,
            },
            {
                name: 'Supplementary Orders',
                path: '/distribution/msdad/supplementary-orders',
                auth: authRoles.requested_supplementary_orders_ad_view,
            },
            {
                name: 'Dispatch Orders',
                path: '/distribution/msdad/dispatch-orders',
                auth: authRoles.dispatch,
            },
            {
                name: 'Direct Distribution',
                path: '/distribution/direct-distribution',
                auth: authRoles.distribution_cash_sales,
            },
            {
                name: 'Create Distribution',
                path: '/distribution/create-distribution',
                auth: authRoles.distribution_cash_sales,
            },
        ],
    },
    {
        name: 'RMSD Data Setups',
        icon: 'view_in_ar',
        auth: authRoles.rmsd_admin,
        children: [
            {
                name: 'Add Users',
                path: '/rmsd/users/add',
                auth: authRoles.rmsd_admin,
            },
            {
                name: 'Manage Drug Store',
                path: '/rmsd-data-setup/rmsd_drug_store',
                auth: authRoles.rmsd_admin,
            },
        ],
    },

    {
        name: 'Warehouse Item Add',
        icon: 'table_view',
        path: '/msd/addItems',
        auth: authRoles.msd_itemAdd,
    },

    {
        name: 'Order Details',
        icon: 'table_view',
        path: '/admin/PendingOrders',
        auth: authRoles.allOders,
    },

    {
        name: 'Hospital Data Setups',
        icon: 'account_tree',
        children: [
            {
                name: 'Add Hospital Users',
                path: '/hospital/users/add',
                auth: authRoles.hospital_admin,
            },
            {
                name: 'Add Institution Users',
                path: '/hospital/institutionUser',
                auth: authRoles.institution_user,
            },
            {
                name: 'Manage Clinic',
                path: '/hospital-data-setup/clinic',
                auth: authRoles.clinic,
            },
            {
                name: 'Manage Ward',
                path: '/hospital-data-setup/ward',
                auth: authRoles.ward,
            },
            {
                name: 'Manage OPD',
                path: '/hospital-data-setup/OPD',
                auth: authRoles.ward,
            },
            {
                name: 'Manage Unit',
                path: '/hospital-data-setup/unit',
                auth: authRoles.ward,
            },
            {
                name: 'Manage Front Desk',
                path: '/hospital-data-setup/front-desk',
                auth: authRoles.hospital_admin,
            },
            {
                name: 'Manage Pharmacy',
                path: '/hospital-data-setup/pharmacy',
                auth: authRoles.hospital_admin,
            },
            {
                name: 'Manage Drug Store',
                path: '/hospital-data-setup/drug_store',
                auth: authRoles.hospital_admin,
            },
            {
                name: 'Prescription Rejection',
                path: '/hospital-data-setup/prescription_reject',
                auth: authRoles.hospital_admin,
            },
            //new
            {
                name: 'Add Hospital Users',
                path: '/msd_datasetup_hospital_user',
                auth: authRoles.msd_datasetup_it,
            },
        ],
    },
    {
        name: 'Clinic Configuration',
        icon: 'settings',
        path: '/data-setup/clinic-config',
        auth: authRoles.clinic_config,
    },

    // {
    //     name: 'Main Drug Stores',
    //     icon: 'table_view',
    //     // auth: authRoles.mds,
    //     children: [
    //         {
    //             name: 'All Orders',
    //             path: '/main-drug-store/all-orders',
    //             iconText: 'T1',
    //             auth: authRoles.drugstore_create_Order,
    //         },
    //         {
    //             name: 'Create Orders',
    //             path: '/MDS/create_order',
    //             iconText: 'T1',
    //             auth: authRoles.drugstore_create_Order,
    //         },
    //     ],
    // },


    {
        name: 'Distribution',
        icon: 'directions',
        //auth: authRoles.rmsd_create_orders,
        children: [
            {
                name: 'Distribution Route',
                path: '/RMSD/general/all_routes',
                auth: [...authRoles.rmsd_create_orders_with_route, ...authRoles.hospital_create_distribution],
            },
            {
                name: 'Create Distribution',
                path: '/RMSD/general/CreateDistribution',
                auth: authRoles.rmsd_create_orders_with_route,
            },
            {
                name: 'Create Distribution',
                path: '/hospital/CreateDistribution',
                auth: authRoles.hospital_create_distribution,
            },

            {
                name: 'Issues In',//'Order Placed By Me'
                path: '/hospital-ordering/all-orders?type=RMSD Order',
                auth: authRoles.min_stock,
            },
            {
                name: 'Issues Out',//Order Placed On Me
                path: '/msa_all_order/all-orders?type=RMSD Order',
                auth: authRoles.supply_assistant,
            },
            /*  {
                 name: 'Scheduled order distribution',
                 iconText: 'T1',
                 auth: authRoles.rmsd_create_orders,
                 children: [

                     {
                         name: 'All Orders',
                         path: '/RMSD/all-orders',
                         iconText: 'T1',
                         auth: authRoles.rmsd_create_orders,
                     },
                 ],
             }, */
        ],
    },
    {
        name: 'Forecasted Estimate',
        icon: 'model_training',
        // auth: authRoles.distribution_officer,
        children: [
            {
                name: 'Forecasted Estimate',
                path: '/estimation/dp_estimations_list',
                auth: authRoles.hospital_estimation_view_dp,
            },
            {
                name: 'Forecasted Estimate',
                path: '/estimation/msd_estimations_list',
                auth: authRoles.msd_estimation_view_sco,
            },
            {
                name: 'Forecasted Estimate Setup',
                path: '/estimation/estimation_setup',
                auth: authRoles.estimation_setup,
            },
            {
                name: 'Hospital Forecasted Estimate',
                path: '/estimation/hospital_estimations_list',
                auth: authRoles.hospital_estimation_view,
            },
            {
                name: 'Hospital Forecasted Estimate',
                path: '/estimation/director/hospital_estimations_list',
                auth: authRoles.hospital_estimation_view_director,
            },

            {
                name: 'Forecasted Estimate Requests',
                path: '/estimation/hospital_estimations_requests',
                auth: authRoles.hospital_estimation_requests_view,
            },


            //===============================================================================


            /*  {
                name: 'All Estimation Requests',
                path: '/estimation/all-estimation-requests',
                auth: authRoles.estimations,
            },
            {
                name: 'All Estimation Requests',
                path: '/estimation/rmsd-all-estimation-requests',
                auth: authRoles.rmsd_estimations,
            },
            {
                name: 'Drug store all Estimation Requests',
                path: '/estimation/all-drug-store-estimation-requests',
                auth: authRoles.estimations,
            },

            {
                name: 'Drug Store Est-Details',
                path: '/estimation/drug-store-estimation-detailsTab',
                auth: authRoles.estimations,
            },
            {
                name: 'Consumer Est-Details',
                path: '/estimation/all-consumer-estimation-requests',
                auth: authRoles.estimations,
            },
            {
                name: 'Consumer-lvl All Item',
                path: '/estimation/consumerlvl-estimation-allitems',
                auth: authRoles.estimations,
            },
            {
                name: 'Consumer-lvl estimate',
                path: '/estimation/consumer-estimate',
                auth: authRoles.estimations,
            },
          
            {
                name: 'Request Pending',
                path: '/estimation/estimation-requestpending',
                auth: authRoles.estimations,
            },  */
        ],
    },
    // {
    //     name: 'MSD-GatePass',
    //     icon: 'table_view',
    //     auth: authRoles.item_master_view,
    //     children: [
    //         {
    //             name: 'All Vehicle Requests',
    //             path: '/msa_gatepass/all_vehicle_requests',
    //             iconText: 'MSD-1',
    //             auth: authRoles.item_master_view,
    //         },
    //     ],
    // },

    {
        name: 'Returns',
        icon: 'assignment_return',
        //auth: authRoles.return_view,
        children: [
            {
                name: 'Create New Return ',
                path: '/return/return-mode',
                auth: authRoles.return_view_create,
            },
            {
                name: 'Request by Me',
                path: '/return/return-requests',
                auth: authRoles.requests_by_me,
            },
            {
                name: 'Approval',
                path: '/return/admin/return-requests',
                auth: authRoles.return_approval,
            },
            {
                name: 'Request to Me',
                path: '/return/drugstore/return-requests',
                auth: authRoles.requested_to_me,
            },
            {
                name: 'Return Request Details',//Order Placed On Me
                path: '/msa_all_order/all-orders?type=Return',
                auth: authRoles.requests_by_me,
            },
        ],
    },
    {
        name: 'Patient',
        icon: 'groups_2',
        auth: authRoles.mro,
        children: [
            {
                name: 'Dischaged List',
                path: '/mro/patients/search',
                auth: authRoles.mro,
            },
            {
                name: 'Midnight Reports',
                path: '/mro/patients/midnightreports',
                auth: authRoles.mro,
            },
            {
                name: 'EMMR login ',
                path: '/mro/patients/emmrlogin',
                auth: authRoles.mro,
            },
            {
                name: 'EMMR',
                path: '/mro/patients/emmrsearch',
                auth: authRoles.mro,
            },
        ],
    },
    {
        name: 'Donations',
        icon: 'party_mode',
        // auth: authRoles.donation,
        children: [
            {
                name: 'Details',
                path: '/donation/view-donations',
                auth: authRoles.donation_sco,
            },
            {
                name: 'Registration',
                path: '/donation/donation-registration',
                auth: authRoles.donation_sco,
            },
            {
                name: 'Donor List',
                path: '/donation/donation-donar-list',
                auth: authRoles.donation_sco,
            },

            {
                name: 'SR Request',
                path: '/donation/donation-msd-sr-request',
                auth: authRoles.donation_itemMist,
            },
            {
                name: 'Details',
                path: '/donation/hsco-view-donation-items',
                // path: '/donation/donation-msd-hsco',
                auth: authRoles.donation_HSCO,
            },
            {
                name: 'Details',
                path: '/donation/ciu-view-donation-items',
                // path: '/donation/donation-msd-hsco',
                auth: authRoles.donation_ciu,
            },
            {
                name: 'Details',
                path: '/donation/sco-view-donation-items',
                // path: '/donation/donation-msd-sco',
                auth: authRoles.donation_ad,
            },
            {
                name: 'GRN',
                path: '/donation/view-donation-grn',
                auth: authRoles.donation_msa,
            },
            // {
            //     name: 'View AD Donation GRN',
            //     path: '/donation/grn-ad-donation',
            //     iconText: 'DGRN',
            //     auth: authRoles.donation_ad,
            // },
        ],
    },
    {
        name: 'Transfer Items',
        icon: 'low_priority',

        children: [
            {
                name: 'Create Transfer',
                path: '/transfer',
                auth: authRoles.transfering,
            },
            {
                name: 'Transfer In',//'Order Placed By Me'
                path: '/hospital-ordering/all-orders?type=TRANSFER',
                auth: authRoles.transfering,
            },
            {
                name: 'Transfer Out',//Order Placed On Me
                path: '/msa_all_order/all-orders?type=TRANSFER',
                auth: authRoles.transfering,
            },
        ]
    },
    {
        name: 'Cash Sale',
        icon: 'low_priority',
        auth: authRoles.cashSale,
        children: [
            {
                name: 'Create',
                path: '/cashSales',
                auth: authRoles.cashSale,
            },
            {
                name: 'Cash Sale',
                path: '/distribution/cash_sales',
                auth: authRoles.cashSale,
            },
        ]
    },

    {
        name: 'Warehouse Management',
        icon: 'luggage',
        children: [
            {
                name: 'Total Warehouse',
                path: '/distribution/totalwarehouse',
                auth: authRoles.warehouse_view,
            },
            {
                name: 'Total Warehouse',
                path: '/msd_warehouse/totalwarehouse',
                auth: authRoles.warehouse_handling,
            },
            // {
            //     name: 'Create Warehouse',
            //     path: '/msd_warehouse/createwarehouse',
            //     iconText: 'CW',
            //     auth: authRoles.warehouse_handling,
            // },
            // {
            //     name: 'Create Add Item',
            //     path: '/msd_warehouse/createitem-list',
            //     iconText: 'CWL',
            //     auth: authRoles.warehouse_handling,
            // },
            // {
            //     name: 'Create Warehouse Bin',
            //     path: '/msd_warehouse/createbin',
            //     iconText: 'CB',
            //     auth: authRoles.warehouse_handling,
            // },
            /*  {
                 name: 'Create New People',
                 path: '/msd_warehouse/createpeople',
                 iconText: 'CB',
                 auth: authRoles.warehouse_handling,
             }, */
        ],
    },
    // Document Check -> Accountant
    {
        name: 'Documents',
        icon: 'description',
        children: [
            {
                name: 'Document Type',
                path: '/documents/document-type',
                auth: authRoles.document_setup,
            },
            {
                name: 'Transaction Type',
                path: '/documents/transaction-type',
                auth: authRoles.document_setup_transaction_type,
            },
            {
                name: 'Document Setup',
                path: '/documents/document-setup',
                auth: authRoles.document_setup_document_setup,
            },

        ],
    },

    {
        name: 'Supply Chain',
        icon: 'redeem',
        auth: authRoles.document_setup,
        children: [
            {
                name: 'Supplier',
                path: '/documents/supplier',
                auth: authRoles.document_setup,
            },
            {
                name: 'Manufacture',
                path: '/documents/manufacture',
                auth: authRoles.document_setup,
            },
            {
                name: 'Local Agent',
                path: '/documents/local-agent',
                auth: authRoles.document_setup,
            },

        ],
    },


    {
        name: 'Hospital Items',
        icon: 'healing',
        // auth: authRoles.hospital_items_manual,
        children: [
            {
                name: 'All Items',
                path: '/item-mst/all-item-hospital',
                auth: authRoles.hospital_items_manual,
            },
            {
                name: 'Add New Items',
                path: '/item-mst/create-item-hospital',
                auth: authRoles.hospital_items_manual,
            },
        ],
    },
    {
        name: 'SPC-Procurement',
        icon: 'table_view',
        auth: authRoles.patients_registration,
        children: [
            {
                name: 'Authority Level Set up',
                path: '/spc/autority-level-set-up',
                auth: authRoles.patients_registration,
            },
            {
                name: 'Time Shedule Format Set up',
                path: '/spc/time-shedule-format-set-up',
                auth: authRoles.patients_registration,
            },
            {
                name: 'Procurement Method Set up',
                path: '/spc/procurement-method-set-up',
                auth: authRoles.patients_registration,
            },
            {
                name: 'Payment Terms Set Up',
                path: '/spc/payment-terms-set-up',
                auth: authRoles.patients_registration,
            },
            {
                name: 'Bid Bond Set Up',
                path: '/spc/bid-bond-set-up',
                auth: authRoles.patients_registration,
            },
            {
                name: 'Document Set up',
                path: '/spc/document-set-up',
                auth: authRoles.patients_registration,
            },
            {
                name: 'All Approval Requests',
                path: '/spc/all-approval-requests',
                auth: authRoles.patients_registration,
            },
            {
                name: 'PC Pro Approval',
                path: '/spc/pc-pro-approval',
                auth: authRoles.patients_registration,
            },
        ],
    },
    {
        name: 'Drug Balancing',
        icon: 'room_preferences',

        children: [
            {                // this is hede form drug store keeper
                name: 'Drug Balancing',
                path: '/drugbalancing/druglist/countable',
                auth: authRoles.drugBalancingWithiutDK,
            },
            {
                name: 'Countable Report',
                path: '/drugbalancing/druglist/report',
                auth: authRoles.drugBalancing,
            },

            {
                name: 'Bulk Report',
                path: '/drugbalancing/druglist/bulkreport',
                auth: authRoles.drugBalancing,
            },
        ],
    },
    // {
    {
        name: 'Local Purchase',
        icon: 'rv_hookup',
        children: [
            {
                name: 'New LP Requests',
                path: '/localpurchase/new-request',
                auth: authRoles.lp_create,
            },
            // Removed to improve UX 
            // {
            //     name: 'All LP Requests',
            //     path: '/localpurchase/request',
            //     auth: authRoles.lp_allRequests,
            // },
            // {
            //     name: 'All LP Approval',
            //     path: '/localpurchase/approval_list',
            //     auth: authRoles.lp_approvalList,
            // },
            // {
            //     name: 'Approved LP Request',
            //     path: '/localpurchase/approved_lp_request',
            //     auth: authRoles.lp_approvalList,
            // },
            {
                name: 'LP Request',
                path: '/localpurchase/request',
                auth: authRoles.lp_RequestList,
            },
            // {
            //     name: 'Approved List',
            //     path: '/localpurchase/approved_list',
            //     auth: authRoles.lp,
            // },
            {
                name: 'Purchase Order',
                path: '/localpurchase/order_details',
                auth: authRoles.lp_purchase_list,
            },
            {
                name: 'PO Approval',
                path: '/localpurchase/order_detail_approval',
                auth: authRoles.lp_purchase_approval,
            },
            {
                name: 'All Recieving List',
                path: '/localpurchase/view_consignment',
                auth: authRoles.lp_approvalList,
            },
            {
                name: 'All GRN',
                path: '/localpurchase/grn',
                auth: authRoles.lp_approvalList,
            },
            {
                name: 'Unallocated Items',
                path: '/localpurchase/unallocated_items',
                auth: authRoles.lp_UnallocatedList,
            },


            {
                name: 'All Suppliers',
                path: '/localpurchase/supplier',
                auth: authRoles.new_lp,
            },
            {
                name: 'Drug Availability',
                path: '/localpurchase/drug',
                auth: authRoles.new_lp,
            },
            {
                name: 'Method Selection',
                path: '/localpurchase/method_selection',
                auth: authRoles.new_lp,
            },


            // {
            //     name: 'Countable Report',
            //     path: '/drugbalancing/druglist/report',
            //     iconText: 'DR',
            //     auth: authRoles.drugBalancing,
            // },

            // {
            //     name: 'Bulk Report',
            //     path: '/drugbalancing/druglist/bulkreport',
            //     iconText: 'BR',
            //     auth: authRoles.dashboard,
            // },
        ],
    },
    // LP Approval Routes
    //  {
    //     name: 'LP-Approval',
    //     icon: 'rv_hookup',
    //     children:[
    //         {
    //             name: 'Approval List',
    //             path: '/localpurchase/approval_list',
    //             auth: authRoles.lp,
    //         },
    //         // {
    //         //     name: 'Store Pharmacist',
    //         //     path: '/localpurchase/store_pharmacist',
    //         //     auth: authRoles.lp,
    //         // },
    //         // {
    //         //     name: 'Chief Pharmacist',
    //         //     path: '/localpurchase/chief_pharmacist',
    //         //     auth: authRoles.lp,
    //         // },
    //         // {
    //         //     name: 'Hospital Director',
    //         //     path: '/localpurchase/hospital_director',
    //         //     auth: authRoles.lp,
    //         // },
    //         // {
    //         //     name: 'Supply SCO',
    //         //     path: '/localpurchase/supply_sco',
    //         //     auth: authRoles.lp,
    //         // },
    //         // {
    //         //     name: 'Supply HSCO',
    //         //     path: '/localpurchase/supply_hsco',
    //         //     auth: authRoles.lp,
    //         // },
    //         // {
    //         //     name: 'MSD AD',
    //         //     path: '/localpurchase/msd_ad',
    //         //     auth: authRoles.lp,
    //         // },
    //         // {
    //         //     name: 'MSD Director',
    //         //     path: '/localpurchase/msd_director',
    //         //     auth: authRoles.lp,
    //         // },
    //     ]
    // },
    {
        name: 'LP-Procurement',
        icon: 'rv_hookup',
        children: [
            {
                name: 'Create Procurement',
                path: '/localpurchase/create_procurement',
                auth: authRoles.new_lp,
            },
            {
                name: 'Procurement',
                path: '/localpurchase/procurement',
                auth: authRoles.new_lp,
            },
            {
                name: 'Acknowledgement',
                path: '/localpurchase/procurement_ack',
                auth: authRoles.new_lp,
            },
            {
                name: 'All Agenda',
                path: '/localpurchase/agenda',
                auth: authRoles.new_lp,
            },
            {
                name: 'Pro Unit Approval',
                path: '/localpurchase/pro_unit_approval',
                auth: authRoles.new_lp,
            },
            {
                name: 'PC Pro Approval',
                path: '/localpurchase/pc_pro_approval',
                auth: authRoles.new_lp,
            },
            // {
            //     name: 'Individual Procurement',
            //     path: '/localpurchase/individual_procurement',
            //     auth: authRoles.lp,
            // },
        ]
    },
    {
        name: 'LP-Committee',
        icon: 'rv_hookup',
        children: [
            {
                name: 'All Committee',
                path: '/localpurchase/committee',
                auth: authRoles.new_lp,
            },
            {
                name: 'Committee Setup',
                path: '/localpurchase/committee_setup',
                auth: authRoles.new_lp,
            },
        ]
    },
    {
        name: 'LP-Data Setup',
        icon: 'rv_hookup',
        children: [
            {
                name: 'Bid Observation Setup',
                path: '/localpurchase/bid_observation_setup',
                auth: authRoles.new_lp,
            },
            {
                name: 'TEC Report Setup',
                path: '/localpurchase/tec_report_setup',
                auth: authRoles.new_lp,
            },
            {
                name: 'Procurement Method Setup',
                path: '/localpurchase/procurement_method_setup',
                auth: authRoles.new_lp,
            },
            {
                name: 'Authority Level Setup',
                path: '/localpurchase/authority_level_setup',
                auth: authRoles.new_lp,
            },
            {
                name: 'Bid Bond Setup',
                path: '/localpurchase/bid_bond_setup',
                auth: authRoles.new_lp,
            },
            {
                name: 'Annual Estimation Setup',
                path: '/localpurchase/annual_estimation_setup',
                auth: authRoles.new_lp,
            },
        ],
    },
    {
        name: 'LP-Supplier',
        icon: 'rv_hookup',
        children: [
            {
                name: 'Supplier Registration',
                path: '/localpurchase/supplier_registration',
                auth: authRoles.new_lp,
            },
            {
                name: 'Supplier List',
                path: '/localpurchase/supplier_list',
                auth: authRoles.new_lp,
            },

            // {
            //     name: 'Surgical List',
            //     path: '/localpurchase/supplier_surgical',
            //     auth: authRoles.new_lp,
            // },
            // {
            //     name: 'Pharmaceutical List',
            //     path: '/localpurchase/supplier_pharmaceutical',
            //     auth: authRoles.new_lp,
            // },
        ]
    },
    /*  {
         name: 'QA Process',
         icon: 'table_view',
         auth: authRoles.drugBalancing,
         children: [
             {
                 name: 'Report Problems',
                 path: '/qa/reportproblem',
                 iconText: 'RP',
                 auth: authRoles.drugBalancing,
             },
 
 
         ],
     }, */
    {
        name: 'Commitee',
        path: '/spc/procurements/commitee',
        icon: 'groups_2',
        auth: authRoles.Procurement,
    },
    {
        name: 'Procurement (PO)',
        icon: 'table_view',
        auth: authRoles.spc_PO,
        children: [
            {
                name: 'All Orders List',
                path: '/spc/procurements/PO/allOrders',
                iconText: 'AOL',
                auth: authRoles.spc_PO,
            },
        ]
    },
    {
        name: 'Procurement (Clerk)',
        icon: 'table_view',
        auth: authRoles.spc_SC,
        children: [
            {
                name: 'All Orders List',
                path: '/spc/procurements/clerk/allOrders',
                iconText: 'AOL',
                auth: authRoles.spc_SC,
            },
        ]
    },
    {
        name: 'Procurement',
        icon: 'sensor_window',
        auth: authRoles.Procurement,
        children: [
            {
                name: 'Order List',
                path: '/spc/procurements/allOrders',
                iconText: 'OL',
                auth: authRoles.Procurement,
            },
            {
                name: 'Order List M',
                path: '/spc/procurements/manager',
                iconText: 'OL',
                auth: authRoles.Procurement,
            },
            {
                name: 'All Procurements',
                path: '/spc/procurement/allprocurements',
                auth: authRoles.Procurement,
            },
            {
                name: 'All Procurement Unit (New)',
                path: '/spc/procurement/allprocurementsunit',
                auth: authRoles.Procurement,
            },
            {
                name: 'All Agendas',
                path: '/spc/procurement/allagendas',
                auth: authRoles.Procurement,
            },
            {
                name: 'Signed Single Order List',
                path: '/spc/procurement/signedsingleorderlist',
                auth: authRoles.Procurement,
            },
            {
                name: 'Single Order List',
                path: '/spc/procurement/singleorderlist',
                auth: authRoles.Procurement,
            },
            {
                name: 'Procurement Acknowledgement',
                path: '/spc/procurement/procurementack',
                auth: authRoles.Procurement,
            },
            {
                name: 'Create Procurement',
                path: '/spc/procurement/createprocurement',
                auth: authRoles.Procurement,
            },
            {
                name: 'Procurement Approval',
                path: '/spc/procurement/procurementapproval',
                auth: authRoles.Procurement,
            },
        ],
    },
    {
        name: 'Debit Report',
        icon: 'table_view',
        children: [
            {
                name: 'SPC Report',
                path: '/voucher/spc-report/?type=spc',
                iconText: 'SR',
                auth: authRoles.spc_report,
            },
            {
                name: 'MSD Report',
                path: '/voucher/spc-report/?type=msd',
                iconText: 'SR',
                auth: authRoles.voucher,
            },
        ]
    },
    {
        name: 'Sales',
        icon: 'real_estate_agent',
        children: [
            {
                name: 'Sales Report',
                path: '/sales_report',
                iconText: 'SO',
                auth: authRoles.voucher,
            },
            {
                name: 'Created Sales Report',
                path: '/created_sales_report',
                iconText: 'SO',
                auth: authRoles.voucher,
            },
        ]
    },
    {
        name: 'Voucher',
        icon: 'table_view',
        children: [
            {
                name: 'Create',
                path: '/voucher/view',
                iconText: 'V',
                auth: authRoles.voucher,
            },
            /*     {
                    name: 'Sales Order',
                    path: '/voucher/sales_order',
                    iconText: 'SO',
                    auth: authRoles.voucher,
                }, */
            {
                name: 'Create Cheque',
                path: '/voucher/view-cheque',
                iconText: 'CP',
                auth: authRoles.voucher,
            },

            {
                name: 'Print Cheque',
                path: '/cheque/view',
                iconText: 'C',
                auth: authRoles.printvoucher,
            },


        ],
    },
    {
        name: 'Data Setup',
        icon: 'wifi_protected_setup',
        children: [
            {
                name: 'Vote Data Setup',
                path: '/voucher/vote-data-setup',
                iconText: 'VDS',
                auth: authRoles.voucher,
            },
            {
                name: 'Total Budget',
                path: '/budget/total-budget',
                icon: 'table_view',
                auth: authRoles.budget_list_view,
            },

        ]
    },

    {
        name: 'All View',
        path: '/view/all-view',
        icon: 'table_view',
        auth: authRoles.budget_list_view,
    },
    {
        name: 'Fund',
        icon: 'table_view',
        auth: authRoles.voucher,
        children: [
            {
                name: 'Fund Availability Data Setup',
                path: '/fund/fund-availability-data-setup',
                iconText: 'F1',
                auth: authRoles.voucher,
            },
            {
                name: 'Fund Availability',
                path: '/fund/fund-availability',
                iconText: 'F2',
                auth: authRoles.voucher,
            },
        ],
    },
    {
        name: 'Order Approval Configuration',
        icon: 'settings_suggest',
        children: [
            {
                name: 'Order Config',
                path: '/orderConfig/order-Config',
                auth: authRoles.return_approval,
            },
        ],
    },


    {
        name: 'Hospital Donations',
        icon: 'volunteer_activism',
        children: [
            {
                name: 'View Donations',
                path: '/donation/view-hospital-donations',
                auth: authRoles.hospital_items_manual,
            },
            {
                name: 'Donation Registration',
                path: '/donation/hospital-donation-registration',
                auth: authRoles.hospital_items_manual,
            },
            {
                name: 'View Donor List',
                path: '/donation/donation-donar-list',
                auth: authRoles.hospital_items_manual,
            },
            {
                name: 'View CP Donations',
                path: '/donation/sco-view-donation-items',
                // path: '/donation/donation-msd-sco',
                auth: authRoles.hospital_items_manual,
            },

            // {
            //     name: 'View MSD SR Request',
            //     path: '/donation/donation-msd-sr-request',
            //     iconText: 'DSR',
            //     auth: authRoles.donation_hos,
            // },
            // {
            //     name: 'View MSD SCO',
            //     path: '/donation/sco-view-donation-items',
            //     // path: '/donation/donation-msd-sco',
            //     iconText: 'DSCO',
            //     auth: authRoles.donation_hos,
            // },
            // {
            //     name: 'View MSD HSCO',
            //     path: '/donation/hsco-view-donation-items',
            //     // path: '/donation/donation-msd-hsco',
            //     iconText: 'DHSCO',
            //     auth: authRoles.donation_hos,
            // },
            {
                name: 'View Donation GRN',
                path: '/donation/view-hospital-donation-grn',
                auth: authRoles.donation_hos,
            },
        ],
    },
    {
        name: 'Manual Stock Update',
        path: '/stock/stock-update',
        icon: 'compare',
        auth: authRoles.manual_stock_update,
    },
    {
        name: 'Hospital Estimation',
        path: '/estimation/hospital_estimations',
        icon: 'design_services',
        auth: authRoles.manual_stock_update,
    },
    {
        name: 'Add Stock Manually',
        path: '/grn/dataupload',
        icon: 'add_to_queue',
        auth: authRoles.grnDataUpload,
    },
    {
        name: 'Pricing',
        icon: 'request_quote',
        auth: authRoles.pricing,
        children: [
            {
                name: 'Add Pricing',
                path: '/pricing/add_Item_pricing',
                auth: authRoles.pricing,
            },
        ],
    },
    {
        name: 'Quality Assurance',
        icon: 'table_view',
        children: [
            // {
            //     name: 'Report',
            //     path: '/qualityAssurance/report_suspected_issue',
            //     iconText: 'QA1',
            //     auth: authRoles.Hopital_QA_rep,
            // },
            {
                name: 'Report',
                path: '/qualityAssurance/report_suspected_issue-V2',
                iconText: 'QA1-V2',
                auth: authRoles.Hopital_QA_rep,
            },
            {
                name: 'All Quality Assurance',
                path: '/qualityAssurance/allQA-Hospital',
                iconText: 'QA',
                auth: authRoles.Hopital_QA_approve,
            },
            {
                name: 'Batch Hold Request',
                path: '/qa-batch-hold',
                iconText: 'QA1',
                auth: authRoles.MSD_QA,
            },
            {
                name: 'NMQAL ALL QA',
                path: '/qualityAssurance/allQA-NMQL',
                iconText: 'NMQL',
                auth: authRoles.NMQAL_QA_all_det,
            },
            {
                name: 'Sample Approve',
                path: '/SampleApprove/allQA-NMQL',
                iconText: 'SA',
                auth: authRoles.NMQAL_QA_auth,  // NMQAL_QA_all
            },
            {
                name: 'QA Requests',
                path: '/QACurrentRequests/allQA-NMQL',
                iconText: 'QACR',
                auth: authRoles.NMQAL_QA_all,
            },
            {
                name: 'NMQAL Authorization',
                path: '/qualityAssurance/NMQL_Authorization',
                iconText: 'NMRA',
                auth: authRoles.NMQAL_QA_auth,
            },
            {
                name: 'NMRA ALL QA',
                path: '/qualityAssurance/allQA-NMRA',
                iconText: 'NMRA',
                auth: authRoles.NMRA_QA_all,
            },
            {
                name: 'NMRA Authorization',
                path: '/qualityAssurance/single-nmra-request',
                iconText: 'NMRA',
                auth: authRoles.NMRA_QA_auth,
            },
            {
                name: 'MSD ALL QA',
                path: '/qualityAssurance/allQA-MSD',
                iconText: 'NMRA',
                auth: authRoles.MSD_QA,
            },
            {
                name: 'Managment',
                iconText: 'M',
                auth: authRoles.all_QA_exceptHos,
                children: [
                    {
                        name: 'Defect Setup',
                        path: '/qa-data-setup/defect-setup',
                        iconText: 'D1',
                        auth: authRoles.all_QA,
                    },
                    {
                        name: 'Test Setup',
                        path: '/qa-data-setup/test-setup',
                        iconText: 'D2',
                        auth: authRoles.all_QA,
                    },
                    {
                        name: 'Specification Setup',
                        path: '/qa-data-setup/specification-setup',
                        iconText: 'D3',
                        auth: authRoles.all_QA,
                    },
                    {
                        name: 'Result Setup',
                        path: '/qa-data-setup/result-setup',
                        iconText: 'D4',
                        auth: authRoles.all_QA,
                    },

                ],
            },

            {
                name: 'Create ADR',
                path: '/qualityAssurance/adr',
                iconText: 'QA',
                auth: authRoles.MSD_QA,
            },
            // {
            //     name: 'Report',
            //     path: '/qualityAssurance/msd/pharmacist',
            //     iconText: 'QA',
            //     auth: authRoles.all_QA,
            // }

        ],
    },
    /*  {
         name: 'Purchase Order',
         icon: 'delivery_dining',
         path: '/spc/purchase-order',
         auth: authRoles.purchase_order_list,
     }, */


    {
        name: 'Purchase Order',
        icon: 'local_mall',
        children: [
            {
                name: 'Create PO',
                path: '/spc/purchase-order/create',
                auth: authRoles.spc_purchase_order,
                icon: 'add_circle',
            },
            {
                name: 'All PO',
                path: '/spc/purchase-order/all',
                auth: authRoles.spc_purchase_order,
                icon: 'list',
            },
            {
                name: 'Edit PO',
                path: '/spc/purchase-order/edit',
                auth: authRoles.spc_purchase_order,
                icon: 'edit',
            },
        ]
    },
    /*  {
         name: 'Purchase Order (S)',
         icon: 'local_mall',
         path: '/spc/supervisor/purchase-order',
         auth: authRoles.purchase_order_list,
     }, */
    {

        name: 'SPC Consignment',
        icon: 'delivery_dining',
        children: [
            {
                name: 'Create Consignment',
                path: '/spc/order_list',
                auth: authRoles.SPC_consignments,
                icon: 'add_circle',
            },
            {
                name: 'Consignment List',
                path: '/spc/all_order_list',
                auth: authRoles.SPC_consignments_List,
                icon: 'list'
            },
            {
                name: 'Create Debit Note',
                path: '/spc/debit_note_list',
                auth: authRoles.SPC_deit_note_creation,
                icon: 'add_circle',
            },
            {
                name: 'Debit Note List',
                path: '/spc/all_debit_list',
                auth: authRoles.SPC_consignments_List,
                icon: 'list'
            },
            {
                name: 'Debit Note Approval',
                path: '/spc/debit_note_approval',
                auth: authRoles.Debitnote_Approval,
                icon: 'list'
            },
            // {
            //     name: 'LCDN List',
            //     path: '/spc/lcdn_order_list',
            //     auth: authRoles.SPC_consignments,
            // },
        ],
    },
    {

        name: 'Status Update',
        icon: 'system_update_alt',
        path: '/spc/status_update',
        auth: authRoles.spc_status_update,


    },
    {
        name: 'Purchase Order',
        icon: 'delivery_dining',
        children: [
            {
                name: 'Order List',
                path: '/purchase_order/order_list',
                auth: authRoles.purchase_order_list,
            },
            {
                name: 'Purchase Order Details',
                path: '/purchase_order/order_details',
                auth: authRoles.purchase_order_list_view,
            },
            {
                name: 'Create',
                path: '/purchase_order/create',
                auth: authRoles.create_perchase_order,
            },
        ],
    },
    {
        name: 'Reports',
        path: '/reports',
        icon: 'assignment',
        auth: authRoles.report_generation,
    },
    {
        name: 'Register External Customers',
        path: '/registerExternalCustomers',
        icon: 'table_view',
        auth: authRoles.msd_dataSetup,
    },

    {
        name: 'Verification',
        icon: 'table_view',
        // auth: authRoles.verifications,
        children: [
            {
                name: 'My Allocated list',
                path: '/AllAssignVerification',
                iconText: 'AOL',
                auth: authRoles.verifications,
            },
            {
                name: 'Stock Verification Approval',
                path: '/stock_verification_approval',
                iconText: 'AOL',
                auth: authRoles.Stock_verifications_approval,
            },

            {
                name: 'Assign Employees',
                path: '/assignEmployees',
                iconText: 'AOL',
                auth: authRoles.assign_verifications,
            },
        ]
    },
    {
        name: 'Raised Issues',
        path: '/reported_issue',
        icon: 'table_view',
        auth: authRoles.raisedIssuesView,
    },
]

//for  icon refference
//https://fonts.google.com/icons?selected=Material+Icons:delivery_dining:&icon.style=Filled&icon.set=Material+Icons