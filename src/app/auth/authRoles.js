export const authRoles = {
    dashboard: ['MSD DDG', 'DDHS', 'MSD AD', "HSCO", "SCO", 'DDG', 'Secretary', 'Distribution Officer', 'Super Admin', 'Front Desk', 'Hospital Admin', 'Hospital Director', 'Sales Hospital Admin', 'Blood Bank Admin', 'RMSD ADMIN', 'Chief Pharmacist', 'Blood Bank Consultant', 'Admin Pharmacist', 'RMSD Distribution Officer', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'RMSD MSA', 'Front Desk', 'Front Desk Admin', 'MSD AD', 'MSD CIU', 'MSD Director', 'MSD MSA', 'MSD SCO', 'MSD Security', 'MSD SDA', 'SPC MA', 'SPC Accountant', 'SPC Supervisor', 'Procurement Officer', 'SPC MI', 'SPC PO', 'SPC DGM', 'SPC Procurement Officer', 'SPC Manager', 'Development Officer', 'Consultant', 'Medical Officer', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Report Check', 'RDHS', 'PDHS'],

    // Chief Accountant  Accountant payment, Accountant Clark

    document_setup: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Development Officer'],
    document_setup_transaction_type: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Development Officer', 'SPC Accountant'],
    document_setup_document_setup: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Development Officer', 'SPC Accountant'],

    ordering_approval: ['Super Admin', 'ADMIN', 'MSD AD', 'MSD SDA', "HSCO", "Chief Accountant", "Distribution Officer", "MSD Distribution Officer"],
    ordering_view: ['Super Admin', 'ADMIN', 'MSD SCO', 'MSD SCO Supply'],
    patients_view: ['Super Admin', 'ADMIN'],
    patients_registration: ['Super Admin', 'ADMIN'],
    patients_admission: ['Super Admin', 'ADMIN'],
    item_master_view: ['Super Admin', 'ADMIN', 'Item Master Admin'],
    item_master_view_All_Item: ['Super Admin', 'ADMIN', 'Item Master Admin', 'Chief Pharmacist', 'Blood Bank Consultant', 'Devisional Pharmacist', 'RDHS', 'MSD SDA'],
    data_setup: ['Super Admin', 'ADMIN'],
    create_pharmacy: ['Super Admin', 'ADMIN'],
    vehicles_view: ['Super Admin', 'ADMIN'],
    vehicles_view_new: ['Super Admin', 'ADMIN', 'Hospital Admin', 'Sales Hospital Admin', 'Blood Bank Admin', 'RMSD ADMIN', "MSD ADMIN", "Transport MA"],
    consignments_view: ['Super Admin', 'ADMIN'],
    // order_list_view: ['Chief Accountant', 'MSD AD', 'Account Supply', 'Director'],
    budget_list_view: ['Chief Accountant'],
    order_list_view: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'MSD AD', 'MSD SDA', 'Account Supply', 'Director', 'MSD Director', 'HSCO', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA'],

    pending_approval: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'MSD AD', 'MSD SDA', 'Account Supply', 'Director', 'MSD Director', 'HSCO', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD DDG', 'DGHS', 'Secretary'],

    donation: ['Super Admin', 'ADMIN', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'HSCO', 'MSD MSA', 'MSD AD', 'Item Master Admin', 'Hospital Director', 'Chief Pharmacist', 'Blood Bank Consultant', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'MSD CIU'],
    donation_sco: ['Super Admin', 'ADMIN', 'MSD SCO', 'MSD SCO Supply'],
    donation_msa: ['Super Admin', 'ADMIN', 'MSD MSA'],
    donation_ad: ['Super Admin', 'ADMIN', 'MSD AD', 'Hospital Director'],
    donation_HSCO: ['Super Admin', 'ADMIN', 'HSCO'],
    donation_ciu: ['Super Admin', 'ADMIN', 'MSD CIU'],
    donation_itemMist: ['Super Admin', 'ADMIN', 'Item Master Admin'],
    hospital_items_manual: ['Super Admin', 'ADMIN', 'Chief Pharmacist', 'Blood Bank Consultant'],

    warehouse_handling: ['Super Admin', 'ADMIN', 'MSD AD', 'RMSD ADMIN', "MSD ADMIN"],
    msd_AD_consignments: ['Super Admin', 'ADMIN', 'MSD AD'],
    msd_CIU_consignments: ['Super Admin', 'ADMIN', 'MSD CIU'],
    msd_Director_consignments: ['Super Admin', 'ADMIN', 'MSD Director'],
    msd_MSA_consignments: ['Super Admin', 'ADMIN', 'MSD MSA'],
    msd_MSA_consignments_single_view: ['Super Admin', 'ADMIN', 'MSD MSA', 'HSCO'],

    msd_SCO_consignments: ['Super Admin', 'ADMIN', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'HSCO'],
    msd_Security_consignments: ['Super Admin', 'ADMIN', 'MSD Security'],
    msd_SDA_consignments: ['Super Admin', 'ADMIN', 'MSD SDA'],
    SPC_consignments: ['Super Admin', 'ADMIN', 'SPC MA', 'Development Officer', 'HSCO', 'SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM', 'Procurement Officer', 'SPC Procurement Officer', 'MSD Clerk'],
    SPC_deit_note_creation: ['SPC MA'],
    SPC_consignments_List: ['Super Admin', 'ADMIN', 'SPC MA', 'Development Officer', 'Local Manufacturer', 'HSCO', 'SPC Accountant', 'SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM', 'Procurement Officer', 'SPC Procurement Officer', 'MSD Clerk', 'MSD CIU', 'SPC Manager'],
    consignments_orderListImport: ['Super Admin', 'ADMIN', 'SPC MA', 'Development Officer'],
    consignments_takeSamples: ['Super Admin', 'ADMIN', 'SPC MA', 'Development Officer', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA'],

    msd_datasetup_it: ['Super Admin', 'ADMIN', 'IT ADMIN'],  //new

    adtWard: ['Super Admin', 'ADMIN', "Nurse"],
    ward_Admit: ['Super Admin', 'ADMIN', "Nurse"],
    frontDesk: ['Super Admin', 'ADMIN', 'Front Desk', 'Front Desk Admin'],
    mro: ['Super Admin', 'ADMIN', 'MRO'],

    // institution stock
    institutionStock: ['MSD Director', 'MSD DDG', 'DGHS', 'Secretary', 'Minister', 'MSD AUDITOR', 'HSCO', 'PDHS', 'Devisional Pharmacist', 'RDHS'],

    Debitnote_Approval: ['SPC Supervisor', 'SPC Manager', 'SPC MA'],   //SPC Supervisor

    msd_view: ['Super Admin', 'ADMIN'],
    sample_criteria_setup: ['Super Admin', 'ADMIN'],
    item_master_view: ['Super Admin', 'ADMIN', 'Item Master Admin'],
    voucher: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Development Officer', 'MSD SDA'],
    printvoucher: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Development Officer', 'MSD SDA'],


    spc_report: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'SPC Accountant'],
    clinic: ['Super Admin', 'ADMIN', 'Hospital Admin', 'Sales Hospital Admin', 'Blood Bank Admin'],
    ward: ['Super Admin', 'ADMIN', 'Hospital Admin', 'Sales Hospital Admin', 'Blood Bank Admin'],
    hospital_admin: ['Super Admin', 'ADMIN', 'Hospital Admin', 'Sales Hospital Admin', 'Blood Bank Admin'],
    return_view: ['Super Admin', 'ADMIN', 'Chief Pharmacist', 'Blood Bank Consultant', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist'],
    return_view_create: ['Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Super Admin', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'NMQAL Pharmacist'],
    item_stock: ['Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Super Admin', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'MSD MSA'],
    item_stock2: ['Drug Store Keeper', 'Store Keeper', 'Chief MLT', 'MLT', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Super Admin', 'ADMIN', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD Distribution Officer', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'MSD MSA', 'Devisional Pharmacist', 'PDHS', 'NMQAL Pharmacist', 'Nurse'],

    check_item_stock: ['Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Super Admin', 'ADMIN', 'Admin Pharmacist', 'Chief Pharmacist', 'Distribution Officer', 'HSCO', 'Hospital Director',
        'Blood Bank Consultant', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'MSD MSA', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer', 'MSD DDG', 'DDHS', 'DDG', 'Secretary', 'Front Desk', 'Hospital Admin', 'Sales Hospital Admin', 'Blood Bank Admin', 'RMSD ADMIN', 'Blood Bank Consultant', 'RMSD Distribution Officer', 'Front Desk Admin', 'MSD AD', 'MSD CIU',
        'MSD Director', 'MSD MSA', 'MSD SCO QA', 'MSD SCO Supply', 'MSD SCO', 'MSD Security', 'MSD SDA', 'Development Officer', 'Consultant', 'Medical Officer', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Devisional Pharmacist', 'MSD Distribution Officer', 'DGHS', 'Secretary', 'Minister', 'MSD AUDITOR', 'SPC MA', 'SPC Accountant', 'SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM', 'SPC Procurement Officer', 'Procurement Officer', 'SPC Manager', 'NMQAL Pharmacist', 'Verification Officer', 'Verification Officer Head', 'PDHS', 'Nurse'
    ],

    institution_user: ['RDHS'],

    requests_by_me: ['Super Admin', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'Pharmacist', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'NMQAL Pharmacist'],
    return_approval: ['Super Admin', 'ADMIN', 'Chief Pharmacist', 'Blood Bank Consultant'],
    requested_to_me: ['Super Admin', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'MSD AD', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'NMQAL Pharmacist'],
    hospital_order: ['Super Admin', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'Chief Pharmacist', 'Blood Bank Consultant', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer'],
    hospital_order_create_itemWise: ['Super Admin', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist',/* 'Drug Store Keeper','Blood Bank MLT (NOIC)','Drugstore Pharmacist(S)','Blood Bank MLT','Medical Laboratory Technologist','Radiographer','Chief MLT','Chief Radiographer' */],
    hospital_order_remarks: ['Super Admin', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'Chief Pharmacist', 'Blood Bank Consultant'],
    min_stock: ['Super Admin', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer', 'NMQAL Pharmacist', 'Nurse'],
    chief_pharmacist: ['Super Admin', 'ADMIN', 'Chief Pharmacist', 'Blood Bank Consultant'],
    distribution_requested_orders: ['Super Admin', 'ADMIN', 'Blood Bank MLT',/* , 'Drug Store Keeper','Blood Bank MLT (NOIC)','Drugstore Pharmacist(S)','Blood Bank MLT','Medical Laboratory Technologist','Radiographer','Chief MLT','Chief Radiographer' ,*/ 'Drug Store Officer', 'Distribution Officer', 'MSD Distribution Officer'],
    distribution_allocation_led: ['Super Admin', 'ADMIN', 'Distribution Officer', 'MSD Distribution Officer'],
    distribution_requested_sales_order: ['Super Admin', 'ADMIN',/* , 'Drug Store Keeper','Blood Bank MLT (NOIC)','Drugstore Pharmacist(S)','Blood Bank MLT','Medical Laboratory Technologist','Radiographer','Chief MLT','Chief Radiographer' ,*/ 'Drug Store Officer', 'Distribution Officer', 'MSD Distribution Officer'],

    requested_orders: ['Super Admin', 'ADMIN', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'Blood Bank MLT'/* , 'Drug Store Keeper','Blood Bank MLT (NOIC)','Drugstore Pharmacist(S)','Blood Bank MLT','Medical Laboratory Technologist','Radiographer','Chief MLT','Chief Radiographer' */, 'Drug Store Officer', 'Distribution Officer', 'MSD Distribution Officer'],//removed RMSD 
    requested_orders_ad_view: ['Super Admin', 'ADMIN', 'MSD AD', 'MSD Director', 'MSD MSA Dispatch'],
    requested_supplementary_orders_ad_view: ['Super Admin', 'ADMIN', 'MSD AD', 'MSD Director'],

    dispatch: ['Super Admin', 'ADMIN', 'MSD AD', 'MSD Director', 'MSD MSA Dispatch'],
    distribution_cash_sales: ['MSD Distribution Officer'],

    consignments_items: ['Super Admin', 'ADMIN', 'MSD AD', 'MSD CIU', 'MSD Director', 'MSD MSA', 'HSCO', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD SDA', 'Minister', 'MSD AUDITOR', 'Secretary', 'MSD DDG'],

    mds: ['Super Admin', 'ADMIN', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer'],
    mds_create_order: ['Super Admin', 'ADMIN', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT', 'Blood Bank MLT (NOIC)', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', "Nurse"],
    salesOrder_create_order: ['Super Admin', 'ADMIN', 'Sales User', 'Sales Officer', 'Drugstore Pharmacist(S)'],
    estimation_setup: ['Super Admin', 'ADMIN', 'IT ADMIN'],//need to add  msd role
    hospital_estimation_view: ['Super Admin', 'ADMIN', 'Chief Pharmacist', 'Chief MLT'],
    hospital_estimation_requests_view: ['Super Admin', 'ADMIN', 'Pharmacist', 'Chief Pharmacist', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer'],
    hospital_estimation_view_director: ['Super Admin', 'ADMIN', 'Hospital Director', 'MSD SCO', 'HSCO', 'MSD AD', 'IT ADMIN', 'MSD Director', 'Devisional Pharmacist', 'RDHS'],
    hospital_estimation_view_dp: ['Super Admin', 'ADMIN', 'Devisional Pharmacist', 'RDHS'],
    msd_estimation_view_sco: ['Super Admin', 'ADMIN', 'MSD SCO'],

    estimations: ['Super Admin', 'ADMIN', 'Drug Store Keeper'],
    rmsd_estimations: ['Super Admin', 'ADMIN', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer'],

    mds_director: ['Super Admin', 'ADMIN', 'Hospital Director'],
    distribution_officer: ['Super Admin', 'ADMIN', 'Distribution Officer', 'MSD Distribution Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist'],

    drugstore_RMSD_MSA: ['RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist'],
    supply_assistant: ['Super Admin', 'ADMIN', 'MSD MSA', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'NMQAL Pharmacist', 'Nurse'],
    order_place_on_me: ['Super Admin', 'ADMIN', 'MSD MSA', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist'],
    caseSale: ['Super Admin', 'ADMIN', 'MSD MSA', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'Blood Bank MLT (NOIC)'],

    rmsd_create_orders: ['Super Admin', 'ADMIN', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer'],
    create_remarks: ['Super Admin', 'ADMIN', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'Drug Store Officer', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Medical Laboratory Technologist', 'Radiographer', 'Nurse'],

    rmsd_create_orders_with_route: ['Super Admin', 'ADMIN', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer'],
    hospital_create_distribution: ['Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer'],

    msd: ['Super Admin', 'ADMIN', 'Distribution Officer', 'MSD Distribution Officer', 'MSD MSA', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer'],
    pharmacy: ['Super Admin', 'ADMIN', 'Pharmacist', 'Admin Pharmacist', 'Counter Pharmacist'],
    issued_prescription_view: ['Super Admin', 'ADMIN', 'Pharmacist', 'Admin Pharmacist', 'Counter Pharmacist'],
    all_issued_prescription_view: ['Super Admin', 'ADMIN', 'Admin Pharmacist', 'Chief Pharmacist', 'Blood Bank Consultant'],

    transfering: ['Super Admin', 'ADMIN', 'RMSD OIC', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'MSD MSA', 'RMSD Pharmacist', 'Distribution Officer', 'RMSD Distribution Officer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD Distribution Officer', 'Chief MLT', 'Chief Radiographer', 'Pharmacist', 'Admin Pharmacist', 'Counter Pharmacist', 'Nurse'],
    cashSale: ['Super Admin', 'ADMIN', 'Distribution Officer', 'MSD Distribution Officer'],

    issued_prescription_view_doctor: ['Super Admin', 'ADMIN', 'Consultant', 'Medical Officer'],
    drugstore_create_Order: ['Super Admin', 'ADMIN', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer'],
    issued_prescription_view_all: ['Super Admin', 'ADMIN', 'Consultant', 'Medical Officer', 'Pharmacist', 'Admin Pharmacist', 'Counter Pharmacist'],

    prescription: ['Super Admin', 'ADMIN', 'Consultant', 'Medical Officer', 'Clinic Admin'],
    npdrug: ['Super Admin', 'ADMIN', 'Consultant'],
    npdrug_summary: ['Super Admin', 'ADMIN', 'Consultant', 'Drug Store Keeper'],
    // Local Purchase
    lp: ['Super Admin', 'ADMIN'],

    //ledger
    ledger: ['Super Admin', 'ADMIN', 'MSD MSA', 'RMSD MSA', 'RMSD Pharmacist', 'RMSD OIC', 'Drug Store Keeper', 'Medical Laboratory Technologist', 'Chief MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Nurse'],

    // stockInquiry
    stockInquiry: ['MSD Director', 'MSD DDG', 'MSD AD', 'MSD SCO', 'MSD SCO QA', 'MSD SCO SUPPLY', 'MSD Distribution officer', 'DGHS', 'Secretary', 'Minister', 'MSD AUDITOR', 'HSCO'],

    //Dashboard Component
    dashboardComponent: ['MSD AD', 'MSD Director', 'MSD DDG', 'DGHS', 'Secretary', 'Minister', 'MSD AUDITOR', 'HSCO', 'SPC MA', 'SPC Accountant', 'SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM', 'SPC Procurement Officer', 'Procurement Officer', 'SPC Manager'],

    //GRN Details
    grnDetails: ['HSCO', 'MSD AD', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD Distribution Officer', 'MSD Director', 'Drug Store Keeper'],

    grnDetails: ['HSCO', 'MSD AD', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD Distribution Officer', 'MSD Director', 'Drug Store Keeper'],
    newlyArraived: ['HSCO', 'MSD AD', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD Distribution Officer', 'MSD Director', 'Drug Store Keeper', 'DGHS', 'Secretary', 'Minister', 'MSD AUDITOR', 'Devisional Pharmacist', 'RDHS', 'SPC MA', 'SPC Accountant', 'SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM', 'SPC Procurement Officer', 'Procurement Officer', 'SPC Manager'],
    // for chea famersist
    allOders: ['Super Admin', 'ADMIN', 'Devisional Pharmacist'],

    lp_allRequests: ['Super Admin', 'ADMIN', 'Chief Pharmacist', 'Blood Bank Consultant', 'MSD SCO', 'MSD SCO Supply', 'MSD AD', 'MSD Director', 'HSCO', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Hospital Director', 'Consultant', 'Chief MLT', 'Chief Radiographer', 'RMSD OIC'],
    lp_create: ['Super Admin', 'ADMIN', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Consultant', 'Devisional Pharmacist'],
    lp_approvalList: ['Super Admin', 'ADMIN', 'Blood Bank Consultant', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Devisional Pharmacist', 'Consultant', 'RMSD OIC'], //'MSD SCO', 'MSD SCO Supply', 'MSD AD', 'MSD Director', 'HSCO', 'Hospital Director', 'Consultant', 'Chief Pharmacist'
    lp_RequestList: ['Super Admin', 'ADMIN', 'Blood Bank Consultant', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Devisional Pharmacist', 'MSD SCO', 'MSD SCO Supply', 'MSD AD', 'MSD Director', 'HSCO', 'Hospital Director', 'Consultant', 'Chief Pharmacist', 'Chief MLT', 'Chief Radiographer', 'Devisional Pharmacist', 'RDHS', 'RMSD OIC', 'Accounts Clerk RMSD', 'Accounts Clerk Hospital'], //'MSD SCO', 'MSD SCO Supply', 'MSD AD', 'MSD Director', 'HSCO', 'Hospital Director', 'Consultant', 'Chief Pharmacist'
    lp_UnallocatedList: ['Super Admin', 'ADMIN', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Drug Store Keeper', 'Consultant', 'Blood Bank MLT (NOIC)', 'RMSD OIC'], // 'Chief Pharmacist', 'MSD SCO', 'MSD AD', 'MSD Director', 'HSCO', 'Hospital Director', 'MSD SCO Supply',
    lp_purchase_list: ['Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Blood Bank Consultant', 'Devisional Pharmacist', 'Consultant', 'RMSD OIC', 'RDHS', 'Accounts Clerk RMSD', 'Accounts Clerk Hospital'], //'Hospital Director', 'Chief Pharmacist'
    lp_purchase_approval: ['Hospital Director', 'Chief Pharmacist', 'Blood Bank Consultant', 'Chief MLT', 'Chief Radiographer', 'Medical Laboratory Technologist', 'RMSD OIC'],
    // 'MSD SCO'
    new_lp: ['Super Admin', 'ADMIN'],
    //lp: ['Super Admin', 'ADMIN', 'Chief Pharmacist','Blood Bank Consultant', 'MSD SCO Supply', 'MSD AD', 'MSD Director', 'HSCO', 'Drug Store Keeper','Blood Bank MLT (NOIC)','Drugstore Pharmacist(S)','Blood Bank MLT','Medical Laboratory Technologist','Radiographer', 'Hospital Director'],
    create_lp: ['Super Admin', 'ADMIN', 'Chief Pharmacist', 'Blood Bank Consultant', 'Chief MLT', 'Chief Radiographer'],

    // FIXME: add MSD DDG, DDHS, Secretary added to npdrugApproval,npdrugPlaceOrder and dashboard
    npdrugApproval: ['MSD DDG', 'DDHS', 'DDG', 'Secretary', 'Hospital Admin', 'Sales Hospital Admin', 'Blood Bank Admin', 'Chief Pharmacist', 'Blood Bank Consultant', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD AD', 'MSD Director', 'Hospital Director', 'Director', 'Drug Store Keeper'],
    npdrugPlaceOrder: ['Super Admin', 'ADMIN', 'MSD SCO'],
    npdrugPlacedOrder: ['DDG', 'Secretary', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD AD', 'MSD Director',],

    npdrugFR: ['MSD SCO', 'MSD SCO Supply', 'MSD SCO QA'],
    drugBalancing: ['Super Admin', 'ADMIN', 'Pharmacist', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'Nurse'],
    drugBalancingWithiutDK: ['Super Admin', 'ADMIN', 'Pharmacist', 'Admin Pharmacist', 'Counter Pharmacist', 'Dispenser', 'Chief MLT', 'Chief Radiographer'],   // without Drug Store Keeper
    // SPC
    Procurement: ['Super Admin', 'ADMIN', 'SPC DGM', 'SPC MI', 'SPC Chairman'],
    spc_PO: ['Super Admin', 'ADMIN', 'PO SPECIAL'],
    spc_SC: ['Super Admin', 'ADMIN', 'SC LAB'],
    // END SPC


    refferences: ['Super Admin', 'ADMIN', 'Consultant', 'Medical Officer', 'Hospital Admin', 'Sales Hospital Admin', 'Blood Bank Admin'],
    rmsd_admin: ['Super Admin', 'ADMIN', 'RMSD ADMIN'],

    // Manual Stock Update
    manual_stock_update: ['Drug Store Keeper', 'Store Keeper', 'Nurse'],

    grnDataUpload: ['Super Admin', 'ADMIN', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'Admin Pharmacist', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer'/* , 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist' */, 'MSD MSA'],
    clinic_config: ['Super Admin', 'ADMIN', 'Clinic Admin'],
    warehouse_view: ['Super Admin', 'Sales User', 'ADMIN', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'Admin Pharmacist', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Chief MLT', 'Chief Radiographer', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'MSD MSA'],

    create_orders_with_warehouse: ['Super Admin', 'ADMIN', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'RMSD Distribution Officer', 'Nurse'],
    create_sales_orders_with_warehouse: ['Super Admin', 'ADMIN', 'Sales User', 'Sales Officer', 'Drugstore Pharmacist(S)',],
    sales_orders_list: ['Super Admin', 'ADMIN', 'Sales User', 'Sales Officer', 'Drugstore Pharmacist(S)'],


    msd_dataSetup: ['Super Admin', 'ADMIN', 'MSD ADMIN'],
    msd_itemAdd: ['Super Admin', 'ADMIN', 'MSD ADMIN', 'HSCO'],//'MSD Distribution Officer','Distribution Officer', 'MSD SCO Distribution' removed
    msd_spc_ordering: ['Super Admin', 'ADMIN', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA'],
    donation_hos: ['Super Admin', 'ADMIN', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Chief MLT', 'Chief Radiographer', 'Chief Pharmacist', 'Blood Bank Consultant'],

    pricing: ['Super Admin', 'ADMIN', 'MSD SDA'],
    //QA Process
    all_QA: ['Super Admin', 'ADMIN', 'MSD SCO', 'Chief Pharmacist', 'Blood Bank Consultant', 'Hospital Director', 'NMQAL Pharmacist', 'NMQAL Director', 'NMRA Pharmacist', 'NMRA CEO', 'MSD Director', 'MSD SCO QA'],  //'MSD SCO QA'
    all_QA_exceptHos: ['Super Admin', 'ADMIN', 'MSD SCO', 'NMQAL Pharmacist', 'NMQAL Director', 'NMRA Pharmacist', 'NMRA CEO', 'MSD Director'],
    NMQAL_QA_all_det: ['Super Admin', 'ADMIN'],
    NMQAL_QA_all: ['Super Admin', 'ADMIN', 'NMQAL Pharmacist', 'MSD SCO QA', 'MSD Director'],
    NMQAL_QA_auth: ['Super Admin', 'ADMIN', 'NMQAL Director', 'NMQAL Pharmacist', 'MSD SCO QA', 'MSD Director'],
    NMRA_QA_all: ['Super Admin', 'ADMIN', 'NMRA Pharmacist', 'NMRA CEO',],
    NMRA_QA_auth: ['Super Admin', 'ADMIN', 'NMRA CEO'],

    MSD_QA: ['Super Admin', 'ADMIN', 'MSD Director', 'MSD SCO QA'],
    Hopital_QA_rep: ['Super Admin', 'ADMIN', 'Chief Pharmacist', 'Blood Bank Consultant', 'Consultant', 'Medical Officer', 'MSD SCO QA', 'Drug Store Keeper', "Nurse", 'NMQAL Pharmacist', "Chief MLT", 'Chief Radiographer', 'RMSD OIC', 'Medical Laboratory Technologist', 'Radiographer', 'RMSD MSA', 'RMSD Pharmacist'],
    Hopital_QA_approve: ['Super Admin', 'ADMIN', 'Hospital Director', 'Chief Pharmacist', 'Blood Bank Consultant', 'MSD Director', 'Devisional Pharmacist', 'Drug Store Keeper', "Chief MLT", 'Chief Radiographer', 'RMSD OIC', 'Medical Laboratory Technologist', 'Radiographer', 'RMSD MSA', 'RMSD Pharmacist'],

    create_perchase_order: ['Super Admin', 'ADMIN', 'Development Officer'],

    purchase_order_list: ['Super Admin', 'ADMIN', 'Development Officer', 'MSD SCO', 'MSD AD'],

    spc_purchase_order: ['Super Admin', 'ADMIN', 'SPC MA', 'SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM', 'Procurement Officer', 'SPC Procurement Officer'],
    purchase_order_list_view: ['Super Admin', 'ADMIN', 'Development Officer', 'MSD SCO', 'MSD AD', 'Local Manufacturer', 'MSD CIU'],
    adgrn_view: ['Super Admin', 'ADMIN', 'MSD AD', 'HSCO'],

    // for order list
    order_list_details: ['Super Admin', 'ADMIN', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'MSD AD', 'MSD SDA', 'Account Supply', 'Director', 'HSCO', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD Director', 'MSD DDG'/* , 'DDHS' */],
    Transport_view: ['Super Admin', 'ADMIN', 'Transport MA'],

    npdrug_withNewPatient: ['Super Admin', 'ADMIN', 'Drug Store Keeper'],
    return_details: ['Super Admin', 'ADMIN', 'MSD MSA'],
    report_generation: ['Super Admin', 'DGHS', 'MSD SDA', 'Report Check', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'Development Officer',
        'HSCO', "MSD Distribution Officer", 'MSD DDG', 'DDHS', 'MSD AD', "SCO", 'DDG', 'Secretary', 'MSD Security',
        'Minister', 'MSD AUDITOR', 'MSD Director', 'Devisional Pharmacist', 'RDHS', 'PDHS', 'SPC Manager', 'SPC MA', 'IT ADMIN',
        'Verification Officer', 'Verification Officer Head', 'RMSD OIC', 'RMSD Pharmacist', 'Chief Pharmacist', 'Drug Store Keeper', "Chief MLT", 'Chief Radiographer', 'Medical Laboratory Technologist', 'Radiographer', 'Hospital Director'],
    //  report_generation: ['Super Admin', 'DGHS', 'Report Check', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'HSCO', "MSD Distribution Officer", 'MSD DDG', 'DDHS', 'MSD AD', "SCO", 'DDG', 'Secretary', 'MSD Security', 'Minister', 'MSD AUDITOR', 'MSD Director', 'Devisional Pharmacist', 'RDHS', 'PDHS', 'SPC Manager', 'SPC MA', 'Verification Officer', 'Verification Officer Head', 'RMSD OIC', 'RMSD Pharmacist'],
    Stock_verifications_approval: ['Verification Officer', 'Verification Officer Head', 'Accounts Clerk RMSD', 'Accounts Clerk Hospital', 'Drug Store Keeper'],

    verifications: ['Verification Officer', 'Verification Officer Head'],
    assign_verifications: ['Verification Officer Head'],
    check_item_stock_verification: ['Verification Officer', 'Verification Officer Head', 'Drug Store Keeper', 'Store Keeper', 'Blood Bank MLT (NOIC)', 'Drugstore Pharmacist(S)', 'Blood Bank MLT', 'Medical Laboratory Technologist', 'Radiographer', 'Sales User', 'Super Admin', 'ADMIN', 'Admin Pharmacist', 'Chief Pharmacist', 'Distribution Officer', 'HSCO', 'Hospital Director',
        'Blood Bank Consultant', 'Counter Pharmacist', 'Dispenser', 'Pharmacist', 'RMSD OIC', 'RMSD MSA', 'RMSD Pharmacist', 'MSD MSA', 'Chief MLT', 'Chief Radiographer', 'Drug Store Officer', 'MSD DDG', 'DDHS', 'DDG', 'Secretary', 'Front Desk', 'Hospital Admin', 'Sales Hospital Admin', 'Blood Bank Admin', 'RMSD ADMIN', 'Blood Bank Consultant', 'RMSD Distribution Officer', 'Front Desk Admin', 'MSD AD', 'MSD CIU',
        'MSD Director', 'MSD MSA', 'MSD SCO QA', 'MSD SCO Supply', 'MSD SCO', 'MSD Security', 'MSD SDA', 'Development Officer', 'Consultant', 'Medical Officer', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Devisional Pharmacist', 'MSD Distribution Officer', 'DGHS', 'Secretary', 'Minister', 'MSD AUDITOR', 'SPC MA', 'SPC Accountant', 'SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM', 'SPC Procurement Officer', 'Procurement Officer', 'SPC Manager', 'NMQAL Pharmacist', 'Verification Officer', 'Verification Officer Head'
    ],

    // Report View Authroles
    ChiefReports: ['Drug Store Keeper', 'Chief Pharmacist', 'Chief MLT', 'Chief Radiographer', 'Medical Laboratory Technologist', 'Radiographer', 'Hospital Director'],
    spc_status_update: ['Super Admin', 'ADMIN', 'SPC MA', 'SPC Supervisor', 'SPC Manager'],

    raisedIssuesView:['Super Admin', 'ADMIN','Raised Issues Viewer']



}
// 'RMSD OIC','RMSD MSA','RMSD Pharmacist', 'RMSD Distribution Officer' msd msa

// Check out app/views/dashboard/DashboardRoutes.js
// Only SA & Admin has dashboard access

// const dashboardRoutes = [
//   {
//     path: "/dashboard/analytics",
//     component: Analytics,
//     auth: authRoles.admin <===============
//   }
// ];

// Check navigaitons.js

// {
//   name: "Dashboard",
//   path: "/dashboard/analytics",
//   icon: "dashboard",
//   auth: authRoles.admin <=================
// }



