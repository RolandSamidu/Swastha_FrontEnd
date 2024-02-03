import { getEnv } from './envConfig'
//Backend API Url
/* export const ENDPOINT = 'http://ec2-3-132-15-192.us-east-2.compute.amazonaws.com:32582/'
export const KEYCLOAK = 'http://ec2-3-132-15-192.us-east-2.compute.amazonaws.com:31551/auth/' */
//export const ENDPOINT = process.env.REACT_APP_ENDPOINT
//export const KEYCLOAK = process.env.REACT_APP_KEYCLOAK



let env = getEnv()

export const ENDPOINT = env.ENDPOINT
export const ENDPOINT_CLOUD = env.ENDPOINT_CLOUD
export const KEYCLOAK = env.KEYCLOAK
export const KEYCLOAK_CLOUD = env.KEYCLOAK_CLOUD
//*********************************************************************************************** */


//Microservices

export const PATIENT_MICROSERVICE_CLOUD = ENDPOINT_CLOUD + 'swasthapatient/api/'
export const PATIENT_MICROSERVICE = ENDPOINT + 'swasthapatient/api/'
export const INVENTORY_MICROSERVICE = ENDPOINT + 'swasthainventory/api/'
export const ADMIN_MICROSERVICE = ENDPOINT + 'swasthaadministration/api/'
export const HOSPITAL_MICROSERVICE = ENDPOINT + 'swasthahospital/api/'
export const WAREHOUSE_MICROSERVICE = ENDPOINT + 'swasthawarehouse/api/'
export const COMPLAINTS_MICROSERVICE = ENDPOINT + 'swasthacomplaint/api/'
export const DATA_TRANSFER_MICROSERVICE = ENDPOINT + 'swasthadatatransfer/api/'
export const FINANCE_MICROSERVICE = ENDPOINT + 'swasthafinance/api/'
export const SPC_PROCUREMENT = ENDPOINT + 'swasthaprocurement/api/'


// Report Generation
export const REPORT_LOGIN = ENDPOINT + 'report/oauth/token'
export const GET_REPORTS = ENDPOINT + 'report/rest/reports/report'
export const GENERATE_REPORTS = ENDPOINT + 'report/rest/reports/run/'

//export const PROCUREMENT_MICROSERVICE = ENDPOINT + 'swasthaprocurement/api/'

export const FILE_UPLOAD_MICROSERVICE = ENDPOINT + 'swasthaupload/api/'

export const HOSPITAL_MICROSERVICE_CLOUD = ENDPOINT_CLOUD + 'swasthahospital/api/'
export const ADMIN_MICROSERVICE_CLOUD = ENDPOINT_CLOUD + 'swasthaadministration/api/'
//Keycloack API Routes
export const USER_LOGIN = KEYCLOAK + 'realms/SwasthaRealm/protocol/openid-connect/token'
export const USER_GET_KEYCLOAK = KEYCLOAK + 'admin/realms/SwasthaRealm/users'
export const USER_LOGIN_CLOUD = KEYCLOAK_CLOUD + 'realms/SwasthaRealm/protocol/openid-connect/token'

export const FILE_VIEW = COMPLAINTS_MICROSERVICE + 'uploads/'


export const EMPLOYEES = ADMIN_MICROSERVICE + 'employees'
export const ASIGNED_EMPLOYEES = ADMIN_MICROSERVICE + 'pharmacy_drugstore_users/'
export const COVERUP_EMPLOYEES = ADMIN_MICROSERVICE + 'cover_up_histories/'


export const GET_CLINIC_DAYS = ADMIN_MICROSERVICE + 'clinic_days/'

//Patient Api Routes
export const CREATE_SINGLE_PATIENT = PATIENT_MICROSERVICE + 'patients/'
export const FETCH_PATIENTS = PATIENT_MICROSERVICE + 'patients/'
export const FETCH_PATIENTS_FROM_CLOUD = PATIENT_MICROSERVICE_CLOUD + 'patients/'

export const GET_PATIENTS_INFO = PATIENT_MICROSERVICE + 'patient_examination/data'
export const GET_PATIENTS_INFO_FROM_CLOUD = PATIENT_MICROSERVICE_CLOUD + 'patient_examination/data'
export const FETCH_REASONS = PATIENT_MICROSERVICE + 'ward_admission_reasons'
export const FETCH_PATIENT_BYID = PATIENT_MICROSERVICE + 'patientClinics/'
export const GET_SUCESSLIST = DATA_TRANSFER_MICROSERVICE + 'patient_clinics/'
export const GET_VALIDATION_EMMR = DATA_TRANSFER_MICROSERVICE + 'eimmr_validation_rules/validate'
//diagnosis setup
export const GET_DIAGNOSIS_TYPES = PATIENT_MICROSERVICE + 'diagnosis_setups/'


export const PATIENTS_EXAMINATION = PATIENT_MICROSERVICE + 'patient_examination/'

//District Api Routes
export const DISTRICT_API = PATIENT_MICROSERVICE + 'districts/'

//MOH Api Routes
export const MOH_API = PATIENT_MICROSERVICE + 'mohs/'

//PHM Api Routes
export const PHM_API = PATIENT_MICROSERVICE + 'phms/'

//GN Api Routes
export const GN_API = PATIENT_MICROSERVICE + 'gns/'

//Clinic Api Routes
export const CLINIC_API = PATIENT_MICROSERVICE + 'clinics/'
export const ASSIGNED_CLINIC_API = PATIENT_MICROSERVICE + 'patientClinics/'
export const ASSIGNED_CLINIC_API_CLOUD = PATIENT_MICROSERVICE_CLOUD + 'patientClinics/'
//Data Setup API Routes
export const CATEGORY_API = INVENTORY_MICROSERVICE + 'categories/'
export const CLASS_API = INVENTORY_MICROSERVICE + 'classes/'
export const GROUP_TYPE_API = INVENTORY_MICROSERVICE + 'group_types/'
export const GROUP_API = INVENTORY_MICROSERVICE + 'groups/'
export const SERIALS_API = INVENTORY_MICROSERVICE + 'serials/'

//Item master Data setup Routes
export const BATCH_TRACE_API = WAREHOUSE_MICROSERVICE + 'batch_traces/'
export const CONDITION_API = WAREHOUSE_MICROSERVICE + 'conditions/'
export const CYCLIC_CODES_API = WAREHOUSE_MICROSERVICE + 'cyclic_codes/'
export const INSTITUTION_API = WAREHOUSE_MICROSERVICE + 'institutions/'
export const ITEM_TYPE_API = WAREHOUSE_MICROSERVICE + 'item_types/'
export const ITEM_TYPE_USAGE_API = WAREHOUSE_MICROSERVICE + 'item_usage_types/'
export const MOVEMENT_TYPE_API = WAREHOUSE_MICROSERVICE + 'movement_types/'
export const SHELF_LIFE_API = WAREHOUSE_MICROSERVICE + 'shelf_lifes/'
export const STOCKS_API = WAREHOUSE_MICROSERVICE + 'stocks/'
export const STORAGES_API = WAREHOUSE_MICROSERVICE + 'storages/'
export const UOMS_API = INVENTORY_MICROSERVICE + 'uoms/'
export const VENS_API = WAREHOUSE_MICROSERVICE + 'vens/'
export const ABC_CLASS_API = WAREHOUSE_MICROSERVICE + 'abc_classes/'

//Stock Verification
export const STOCK_VERIFICATION = WAREHOUSE_MICROSERVICE + 'stock_verifications/'
export const ITEM_FREEZ_POST = WAREHOUSE_MICROSERVICE + 'item_freez_stock_verifications/'
export const SELECT_EMPLOYEES = WAREHOUSE_MICROSERVICE + 'verification_officers/'
export const EDIT_STOCK_VERIFICATION = WAREHOUSE_MICROSERVICE + 'verification_officers/status'
export const ASSIGN_VERIFICATION_OFFICER = WAREHOUSE_MICROSERVICE + 'verification_officers?employee_id='
export const PRINT_VERIFICATION_OFFICER = WAREHOUSE_MICROSERVICE + 'verification_officers?stock_verification_id='
export const STOCK_VERIFICATION_FREEZS = WAREHOUSE_MICROSERVICE + 'stock_verification_freezs'
export const STOCK_VERIFICATION_ITEMS = WAREHOUSE_MICROSERVICE + 'stock_verification_items'
export const ALL_BIN_STOCKS = WAREHOUSE_MICROSERVICE + 'item_snap_batch_bins'
export const STOCK_VERIFICATION_ITEMS_BATCHES = WAREHOUSE_MICROSERVICE + 'stock_verification_item_batchs'
export const VERIFICATION_ITEM_BATCHES = WAREHOUSE_MICROSERVICE + 'stock_verification_item_batches'
export const VERIFICATION_ITEM = WAREHOUSE_MICROSERVICE + 'verification_items'
export const VERIFICATION_APPROVALS = WAREHOUSE_MICROSERVICE + 'stock_verification_approvals'
export const ASSIGN_VERIFICATION = WAREHOUSE_MICROSERVICE + 'verification_officers'





// get temp packsize
export const TEMP_PACK_SIZE_DET = WAREHOUSE_MICROSERVICE + 'temp_pack_details/'

// get uom by id
export const UOM_API_BY_ID = INVENTORY_MICROSERVICE + 'item_uoms/'

// get monthly requirement
export const MONTHLY_REQUIRMENT = WAREHOUSE_MICROSERVICE + 'yearly_requirements/'

// 
export const ORDER_POSITION = WAREHOUSE_MICROSERVICE + 'order_list_items/'

//item master -->  inventory micro
export const DEFAULT_FREQUENCY_API = INVENTORY_MICROSERVICE + 'default_frequencies/'
export const DEFAULT_ROUTE_API = INVENTORY_MICROSERVICE + 'default_routes/'
export const DISPLAY_UNIT_API = INVENTORY_MICROSERVICE + 'display_units/'
export const MEASURING_UNIT_API = INVENTORY_MICROSERVICE + 'measuring_units/'
export const MEASURING_UNIT_CODE_API = INVENTORY_MICROSERVICE + 'measuring_unit_codes/'
export const DOSAGE_FORM_API = INVENTORY_MICROSERVICE + 'dosage_forms/'


//Clinic Data setup Routes
export const CLINIC_DIAGNOSIS_API = ADMIN_MICROSERVICE + 'clinic_diagnosis/'
export const CLINIC_COMPLICATION_API =
    ADMIN_MICROSERVICE + 'clinic_complications/'
export const CLINIC_COMPLAINTS_API = ADMIN_MICROSERVICE + 'clinic_complaints/'

//Patient Clinic Api Routes
export const CREATE_SINGLE_CLINIC_PATIENT =
    PATIENT_MICROSERVICE + 'patientClinics/'

export const GET_HIGHER_LEVELS = ADMIN_MICROSERVICE + 'pharmacy_drugs_store_relations'
export const WIDGET_TYPES = HOSPITAL_MICROSERVICE + 'examination_widget_types'
export const GET_WIDGET_TYPES = HOSPITAL_MICROSERVICE + 'examination_widgets'
export const GET_CLINICS = ADMIN_MICROSERVICE + 'pharmacy_drugs_store/owner/'
export const GET_DASHBOARD = HOSPITAL_MICROSERVICE + 'examination_dashboards'
export const GET_DASHBOARD_ASSINING = HOSPITAL_MICROSERVICE + 'examination_dashboard_assignings'
export const CREATE_DASHBOARD = HOSPITAL_MICROSERVICE + 'examination_dashboards'
export const EDIT_ASSIGNINGS_DASHBOARD = HOSPITAL_MICROSERVICE + 'examination_dashboard_assignings'

export const GET_PRESCRIPTIONS = HOSPITAL_MICROSERVICE + 'prescriptions'
export const GET_PRESCRIPTIONS_FROM_CLOUD = HOSPITAL_MICROSERVICE_CLOUD + 'prescriptions'
export const ADD_PRESCRIPTION = HOSPITAL_MICROSERVICE + 'prescriptions/with_drugs'
export const GET_FREQUENCIES = INVENTORY_MICROSERVICE + 'default_frequencies'
export const GET_ROUTES = INVENTORY_MICROSERVICE + 'default_routes'
export const GET_ISSUANCE_DATA = HOSPITAL_MICROSERVICE + 'order_item_allocations'

export const LOCAL_PURCHASE = HOSPITAL_MICROSERVICE + 'lp_requests'
export const LOCAL_PURCHASE_APPROVALS = HOSPITAL_MICROSERVICE + 'lp_request_approvals'

export const FAVOURITES = HOSPITAL_MICROSERVICE + 'favourite_prescriptions'
export const FAVOURITE_DRUGS = HOSPITAL_MICROSERVICE + 'favourite_prescription_drugs'

export const NP_DRUGS = HOSPITAL_MICROSERVICE + 'np_requests'
export const NP_DRUGS_APPROVAL = HOSPITAL_MICROSERVICE + 'np_requests/status'
export const NP_DRUGS_BULK_APPROVAL = HOSPITAL_MICROSERVICE + 'np_requests/bulkstatus'
export const NP_PLACE_ORDER = WAREHOUSE_MICROSERVICE + 'msd_order_requirements/np_order'
export const NP_ORDERS = WAREHOUSE_MICROSERVICE + 'msd_purchase_orders'

export const NP_ORDER_APPROVALS = WAREHOUSE_MICROSERVICE + 'msd_purchaseorder_approvals'

export const ORDER_SCHEDULES = WAREHOUSE_MICROSERVICE + 'order_list_schedules'
export const PURCHASE_ORDER_SCHEDULES = WAREHOUSE_MICROSERVICE + 'order_lists'
export const ORDER_LIST_HISTORIES = WAREHOUSE_MICROSERVICE + 'order_list_histories'
export const ORDER_LIST_APPROVALS = WAREHOUSE_MICROSERVICE + 'order_list_approvals'

//department API (TODO - Check this API as a path variable 000 is used)
export const DEPARTMENT_API = ADMIN_MICROSERVICE + 'departments/owner/000'
export const GET_DEPARTMENT_API = ADMIN_MICROSERVICE + 'departments/owner/'

export const GET_CONSUMPTIONS_DET = WAREHOUSE_MICROSERVICE + "daily_national_consumptions"

// Save Quotation
export const QUOTATION_REQURST = HOSPITAL_MICROSERVICE + 'lp_request_quotations'
export const LP_REQURST_PRICING = HOSPITAL_MICROSERVICE + 'lp_request_pricings'

//Department Types API Route
export const DEPARTMENT_TYPE_API =
    ADMIN_MICROSERVICE + 'department_types/owner/000'

//Wherehouse API Routes
export const CREATE_WAREHOUSE_API = WAREHOUSE_MICROSERVICE + 'warehouses/owner/000'
export const GET_WAREHOUSE = WAREHOUSE_MICROSERVICE + 'warehouses/owner'
export const CREATE_CHECKING_CRITERIAS = WAREHOUSE_MICROSERVICE + 'checking_criterias'
export const WAREHOUSE_ITEM_ALLOCATION = WAREHOUSE_MICROSERVICE + 'warehouse_item_allocations'
export const VENS = WAREHOUSE_MICROSERVICE + 'vens'
export const STOCKS = WAREHOUSE_MICROSERVICE + 'stocks'
export const CONDITIONS = WAREHOUSE_MICROSERVICE + 'conditions'
export const STORAGES = WAREHOUSE_MICROSERVICE + 'storages'
export const BATCH_TRACES = WAREHOUSE_MICROSERVICE + 'batch_traces'
export const ABC_CLASSES = WAREHOUSE_MICROSERVICE + 'abc_classes'
export const CYCLIC_CODES = WAREHOUSE_MICROSERVICE + 'cyclic_codes'
export const MOVEMENT_TYPES = WAREHOUSE_MICROSERVICE + 'movement_types'
export const ITEM_TYPES = WAREHOUSE_MICROSERVICE + 'item_types'
export const ITEM_USAGE_TYPES = WAREHOUSE_MICROSERVICE + 'item_usage_types'
export const INSTITUTIONS = WAREHOUSE_MICROSERVICE + 'institutions'
export const BIN_TYPES = WAREHOUSE_MICROSERVICE + 'warehouse_bins'  //warehouseBins
export const BIN_ALLOCATION_DATA = WAREHOUSE_MICROSERVICE + 'warehouse_bin_type_allocations'
export const ALLOCATION_LEDGER = WAREHOUSE_MICROSERVICE + 'order_item_activities'
export const GEN_ORDER = WAREHOUSE_MICROSERVICE + 'order_requirements'
export const MSD_GEN_ORDER = WAREHOUSE_MICROSERVICE + 'msd_order_requirements'
export const RMSD_DISTRIBUTIONS = WAREHOUSE_MICROSERVICE + 'rmsd_distributions'
export const ADD_TO_CART = WAREHOUSE_MICROSERVICE + 'order_requirement_items/'
export const ADD_TO_CART_RMSD = WAREHOUSE_MICROSERVICE + 'rmsd_distribution_items/'
export const PLACE_ORDER = WAREHOUSE_MICROSERVICE + 'order_requirements/order_exchange'
export const OTHER_WAREHOUSES = WAREHOUSE_MICROSERVICE + 'order_requirements/otherwarehoses'
export const ALL_ORDERS = WAREHOUSE_MICROSERVICE + 'order_exchanges'
export const ORDER_REQUIREMENT = WAREHOUSE_MICROSERVICE + 'msd_order_requirements'
export const INDIVIDUAL_ORDER_ITEMS = WAREHOUSE_MICROSERVICE + 'order_items'
export const REMARKS = WAREHOUSE_MICROSERVICE + 'order_remarks'
export const UPLOAD_ORDERS = WAREHOUSE_MICROSERVICE + 'consignments/orders'
export const ORDER_EXCHANGES = WAREHOUSE_MICROSERVICE + 'order_exchanges'
export const ORDER_EXCHANGE_ACTIVITIES = WAREHOUSE_MICROSERVICE + 'order_exchange_activities'
export const ITEM_EXCHANGE_ACTIVITIES = WAREHOUSE_MICROSERVICE + 'order_item_activities'
export const EXCHANGE_CHANGE = WAREHOUSE_MICROSERVICE + '/order_items/status/'
export const GET_WAREHOUSE_USERS = WAREHOUSE_MICROSERVICE + 'warehouse_users'
export const ITEM_BATCH_DETAILS = WAREHOUSE_MICROSERVICE + 'item_snap_batch_bins'
export const DEFAULT_ITEMS = WAREHOUSE_MICROSERVICE + 'warehouse_default_items'
export const ADD_REMARKS = WAREHOUSE_MICROSERVICE + 'order_remarks'
export const PICKUP_ORDERS = WAREHOUSE_MICROSERVICE + 'order_deliveries'
export const ORDER_ITEMS = WAREHOUSE_MICROSERVICE + "order_item_activities"
export const ORDER_ITEM_ALLOCATIONS = WAREHOUSE_MICROSERVICE + "order_item_allocations"
export const RETURN_REQUEST_ITEM = WAREHOUSE_MICROSERVICE + "return_request_items"
export const ORDER_SUMMURY = WAREHOUSE_MICROSERVICE + 'order_summaries'
export const CREATE_ROUTE = WAREHOUSE_MICROSERVICE + 'distribution_routes'
export const ROUTE_STOPS = WAREHOUSE_MICROSERVICE + 'distribution_route_stops'
export const ORDER_ITEM_ALLOCATION = WAREHOUSE_MICROSERVICE + 'order_item_allocations'
export const DEFAULT_USER_ITEMS = WAREHOUSE_MICROSERVICE + 'item_users'
export const DEFAULT_USER_ITEMS_BULK = WAREHOUSE_MICROSERVICE + 'item_users/bulk'
//Order Approval Config
export const ORDER_APPROVAL_CONFIG = WAREHOUSE_MICROSERVICE + 'approve_configs'

export const ITEM_BATCH_CONSUMPTIONS = WAREHOUSE_MICROSERVICE + 'item_snap_batch_bins/consumptions'
export const ORDER_DETAILS_GROUPED = WAREHOUSE_MICROSERVICE + 'order_exchanges/group_by'

export const GET_ALL_WAREHOUSE = WAREHOUSE_MICROSERVICE + 'warehouses/owner'
export const WAREHOUSE_BINS = WAREHOUSE_MICROSERVICE + 'warehouse_bins'  //warehouseBins
export const WAREHOUSE_BINS_TYPES = WAREHOUSE_MICROSERVICE + 'bin_types'  //warehouseBins
export const ADD_BULK_ITEMS = WAREHOUSE_MICROSERVICE + 'warehouse_default_items/bulk'
export const DRUG_BALANCING = WAREHOUSE_MICROSERVICE + 'drug_balancings'
export const ADDITIONAL_DATA = INVENTORY_MICROSERVICE + 'item_snap_batch_warehouse_histories'

export const SINGLE_ITEM_WAREHOUSE = WAREHOUSE_MICROSERVICE + 'item_snap_batch_bins'
export const ALL_ITEM_WAREHOUSES = INVENTORY_MICROSERVICE + 'item_snap_batch_warehouses'

//hospital item
export const DOSAGE_FORMS = INVENTORY_MICROSERVICE + 'dosage_forms'
export const MEASURING_UNITS_COODES = INVENTORY_MICROSERVICE + 'measuring_unit_codes'
export const MEASURING_UNITS = INVENTORY_MICROSERVICE + 'measuring_units'
export const DISPLAYING_UNITS = INVENTORY_MICROSERVICE + 'display_units'
export const ITEM_BATCHES = INVENTORY_MICROSERVICE + 'item_snap_batches'
export const DEFAULT_ROUTES = INVENTORY_MICROSERVICE + 'default_routes'
export const DEFAULT_FREQUENCY = INVENTORY_MICROSERVICE + 'default_frequencies'


// export const DEFAULT_DURATTION = INVENTORY_MICROSERVICE + 'measuring_units'  S

//Main Drug Store Routes
export const ORDER_DELIVERY_VEHICLE = WAREHOUSE_MICROSERVICE + 'order_delivery_vehicle'

//MSD-Vehicle Requests routes
export const MSD_VEHICLE_REQUESTS_API = WAREHOUSE_MICROSERVICE + 'order_delivery_vehicle/'
export const MSD_VEHICLE_TYPES = WAREHOUSE_MICROSERVICE + 'vehicle_types/'
export const MSD_VEHICLE_INOUT = WAREHOUSE_MICROSERVICE + 'order_delivery_vehicle/inandout/'


//pharamcy data store Routes
export const GET_DATA_STORE_PHARMACY =
    ADMIN_MICROSERVICE + 'pharmacy_drugs_store/owner/'

export const GET_DATA_STORE_PHARMACY_CLOUD =
    ADMIN_MICROSERVICE_CLOUD + 'pharmacy_drugs_store/owner/'

export const GET_NOTICE = ADMIN_MICROSERVICE + 'dashboard_notices'

//Items data Routes
export const GET_ALL_ITEMS_INVENTORY = INVENTORY_MICROSERVICE + 'items'
export const GET_ITEMS_BY_ID = INVENTORY_MICROSERVICE + 'items/item'



//Vehicle api Routes
export const CREATE_VEHICLE_USER = WAREHOUSE_MICROSERVICE + 'vehicle_users/'

//Consignment api Routes
export const CONSIGNMENT_API = WAREHOUSE_MICROSERVICE + 'consignments/'
export const CONSIGNMENT_SAMPLES_API = WAREHOUSE_MICROSERVICE + 'consignment_samples/'
export const CONSIGNMENT_REDO_REASONS = WAREHOUSE_MICROSERVICE + 'redo_reasons/'
export const CONSIGNMENT_CONTAINERS = WAREHOUSE_MICROSERVICE + 'consignment_containers/'

//Consignment API Routes
export const CONSIGNMENT = WAREHOUSE_MICROSERVICE + 'consignments'
export const CONSIGNMENT_ITEMS = WAREHOUSE_MICROSERVICE + 'consignment_items'
export const CONSIGNMENT_ORDER_LIST = WAREHOUSE_MICROSERVICE + 'consignments/order_details'
export const CONSIGNMENT_ADITIONAL_DETAILS = WAREHOUSE_MICROSERVICE + 'msd_schedule_items/'
export const UOMS = INVENTORY_MICROSERVICE + 'uoms/'


//Vehicle api Routes

export const VEHICLES_API = WAREHOUSE_MICROSERVICE + 'vehicles/owner/'
export const PATCH_VEHICLE_STATUS = WAREHOUSE_MICROSERVICE + 'vehicles/owner/'
export const GET_CONSIGNMENT = WAREHOUSE_MICROSERVICE + 'consignments/'

//MSD api Routes
export const GET_CRITERIA =
    WAREHOUSE_MICROSERVICE + 'checking_criterias'

//Vehicle api Routes
export const VEHICLE_TYPE_API = WAREHOUSE_MICROSERVICE + 'vehicle_types/'
export const VEHICLE_API = WAREHOUSE_MICROSERVICE + 'vehicles/owner/001'


//emoloyee route
export const EMPLOYEE = ADMIN_MICROSERVICE + 'employees/'

//consignment route
export const CONSIGNMENTS = WAREHOUSE_MICROSERVICE + 'consignments/'

//consignment sample route
export const CONSIGNMENTS_SAMPLE = WAREHOUSE_MICROSERVICE + 'consignment_samples/'
export const GET_ALL_DEBIT_NOTE_TYPES = ADMIN_MICROSERVICE + 'debit_note_types'
export const GET_ALL_DEBIT_NOTE_SUB_TYPES = ADMIN_MICROSERVICE + 'debit_note_sub_types'
export const GET_ALL_DEBIT_NOTE_APPROVAL = SPC_PROCUREMENT + 'debit_note_approvals'
export const GET_ALL_DEBIT_NOTE_CHARGES = SPC_PROCUREMENT + 'debit_note_charges'

// criteria checking 
export const CRITERIA_CHECKING = WAREHOUSE_MICROSERVICE + 'checking_criterias'

// sample validating 
export const SAMPLE_VALIDATING = WAREHOUSE_MICROSERVICE + 'consignment_sample_validatings'


//Issue Routes
export const CREATE_ISSUE = COMPLAINTS_MICROSERVICE + 'complaints'
export const CREATE_ISSUE_COMMENT = COMPLAINTS_MICROSERVICE + 'complaint_comments'
export const GET_HELP_VIDEO_LINK = COMPLAINTS_MICROSERVICE + 'help_videos'

export const GET_ALL_FRONT_DESK = ADMIN_MICROSERVICE + 'pharmacy_drugstore_users'


//Return screen routes
export const GET_ALL_MOVING_AND_NON_MOVING_ITEMS = WAREHOUSE_MICROSERVICE + 'moving_non_moving_items';
export const GET_ALL_RETURN_REQUESTS = WAREHOUSE_MICROSERVICE + 'return_requests';
export const GET_SINGLE_RETURN_REQUESTS = WAREHOUSE_MICROSERVICE + 'return_request_items';
export const GET_BATCHES_INFO_RETURN_REQUEST = WAREHOUSE_MICROSERVICE + 'moving_non_moving_item_batches';
export const GET_RETURN_REMARKS = WAREHOUSE_MICROSERVICE + "order_remarks";
export const GET_PICKUP_PERSON_DETAILS = ADMIN_MICROSERVICE + "employees";
export const RETURN_BULK_CHECKOUT = WAREHOUSE_MICROSERVICE + "return_requests/bulkstatus";
export const GET_WAREHOUSE_ITEMS = INVENTORY_MICROSERVICE + 'item_snap_batch_warehouses/sum'

// Pharmacy Routes
export const ITEM_SNAP_BATCH_WAREHOUSE_SUM = INVENTORY_MICROSERVICE + 'item_snap_batch_warehouses/sum'
export const ISSUE_PRESCRIPTION = HOSPITAL_MICROSERVICE + 'prescriptions/issue_all'
export const ISSUE_PRESCRIPTION_ITEM = HOSPITAL_MICROSERVICE + 'prescription_drug_issued_items'
export const ITEM_SNAP_BATCH_WAREHOUSE = INVENTORY_MICROSERVICE + 'item_snap_batch_warehouses'
export const REFER_PRESCRIPTION = HOSPITAL_MICROSERVICE + 'prescriptions/'
export const ISSUED_DRUGS = HOSPITAL_MICROSERVICE + 'prescription_issued_drug/'
export const PRESCRIPTION_DRUG_ASSIGN = HOSPITAL_MICROSERVICE + 'prescription_drug_assign/'


//Hospital configeration
export const BHT_START_POINT_CONFIG = ADMIN_MICROSERVICE + 'hospital_configurations'
export const MANUFACTURERS = ADMIN_MICROSERVICE + 'manufacturers'
export const SUPPLIERS = ADMIN_MICROSERVICE + 'suppliers'
export const LOCAL_AGENTS = ADMIN_MICROSERVICE + 'local_agents'

//GRN
export const CREATE_GRN = WAREHOUSE_MICROSERVICE + "msd_grns";
export const GRN_ITEMS = WAREHOUSE_MICROSERVICE + "grn_items";
export const GRN_ITEMS_ADDTO_BIN = WAREHOUSE_MICROSERVICE + "grn_items/add_to_bin";

//Donations 
export const CREATE_DONOR = WAREHOUSE_MICROSERVICE + "donors"
export const CREATE_DONATION = WAREHOUSE_MICROSERVICE + "donations"
export const CREATE_DONATION_ITEM = WAREHOUSE_MICROSERVICE + "dontation_items"
export const EDIT_DONATION_ITEM_BATCHES = WAREHOUSE_MICROSERVICE + "dontation_item_batchs"
export const DONATION_SR_REQUESTS = WAREHOUSE_MICROSERVICE + "donation_sr_requests"
export const DONATION_GRN = WAREHOUSE_MICROSERVICE + "donation_grns"
export const DONATION_ITEM_PACKSIZES = WAREHOUSE_MICROSERVICE + "dontation_item_batch_packages"

//estimation
export const CREATE_ESTIMATION = WAREHOUSE_MICROSERVICE + "estimations"
export const CREATE_ESTIMATION_SETUP = WAREHOUSE_MICROSERVICE + "estimation_setups"
export const GET_ALL_ESTIMATION_ITEMS = WAREHOUSE_MICROSERVICE + "hospital_estimation_items"
export const HOSPITAL_ESTIMATION_VERIFICATION = WAREHOUSE_MICROSERVICE + "hospital_estimation_verifications"
export const HOSPITAL_ESTIMATION_VERIFICATION_EMPLOYEES = WAREHOUSE_MICROSERVICE + "hospital_estimation_verification_employees"
export const CREATE_HOSPITAL_ITEMS = WAREHOUSE_MICROSERVICE + "hospital_estimations"
export const CREATE_SUB_HOSPITAL_ESTIMATIONS = WAREHOUSE_MICROSERVICE + "sub_estimations"
export const CREATE_SUB_HOSPITAL_ESTIMATIONS_ITEMS = WAREHOUSE_MICROSERVICE + "sub_estimation_items"
export const GENERATE_HOSPITAL_ESTIMATIONS = WAREHOUSE_MICROSERVICE + "hospital_estimation_items/generate"
export const GET_WAREHOUSES_ = WAREHOUSE_MICROSERVICE + "distribution_routes"
export const GET_ESTIMATION_RELATION = WAREHOUSE_MICROSERVICE + "estimated_warehouse_relations"
export const ESTIMATION_APPROVALS = WAREHOUSE_MICROSERVICE + "hospital_estimation_approvals"
export const WAERHOUSE_HISTORIES = WAREHOUSE_MICROSERVICE + "item_warehouse_histories"
export const TEMP_ESTIMATIONS = WAREHOUSE_MICROSERVICE + "temp_estimations"
export const TEMP_CONSUMPTIONS = WAREHOUSE_MICROSERVICE + "temp_consumptions"
export const HOSPITAL_ESTIMATION_ITEM_HISTORIES = WAREHOUSE_MICROSERVICE + "hospital_estimation_item_histories"
export const SUB_ESTIMATION_ITEM_HISTORIES = WAREHOUSE_MICROSERVICE + "sub_estimation_item_histories"

//Ordering Routes
export const GET_SINGLE_ORDER = WAREHOUSE_MICROSERVICE + "msd_order_requirement_items"
export const ITEMS_PATH = WAREHOUSE_MICROSERVICE + "msd_order_requirement_items"
export const ITEMS_PATH_NEW = INVENTORY_MICROSERVICE + "items"
export const GET_ALL_AGENTS = WAREHOUSE_MICROSERVICE + "agents"
export const GET_INSTALLMENTS = WAREHOUSE_MICROSERVICE + "msd_orderrequirement_installments"
export const GET_STOCK = WAREHOUSE_MICROSERVICE + "item_snap_batch_bins"
export const GET_UPCOMING_ORDERS = WAREHOUSE_MICROSERVICE + "consignments/order_details"
export const GET_ESTIMATION_ORDERS = WAREHOUSE_MICROSERVICE + "hospital_estimation_items"
export const GET_CONSUMPTIONS = WAREHOUSE_MICROSERVICE + "daily_national_consumptions"
export const GET_BATCH_DETAILS = WAREHOUSE_MICROSERVICE + "moving_non_moving_item_batches"
export const GET_DUE_ON_ORDER = WAREHOUSE_MICROSERVICE + "msd_schedule_items"
export const GET_ALL_ITEMS = WAREHOUSE_MICROSERVICE + "msd_purchase_order_items"
export const GET_HISTORY = WAREHOUSE_MICROSERVICE + "msd_order_requirement_histories"

//File management Routes
export const UPLOAD_FILES = FILE_UPLOAD_MICROSERVICE + "uploads"
export const GET_UPLOADED_FILES = FILE_UPLOAD_MICROSERVICE + "file_upload_items"
export const COMMON_UPLOAD_FILE_VIEW = FILE_UPLOAD_MICROSERVICE + "uploaded_files"

//EHR Data Routes
export const EHR_DATA = HOSPITAL_MICROSERVICE_CLOUD + 'ehrs'

// Finance Services
export const FINANCE_VOTES = FINANCE_MICROSERVICE + 'votes'
export const FINANCE_VOUCHERS = FINANCE_MICROSERVICE + 'vouchers'
export const FINANCE_CHEQUES = FINANCE_MICROSERVICE + 'cheques'
export const EHR_DATA_LOCAL = HOSPITAL_MICROSERVICE + 'ehrs'

//Pricing
export const GET_ALL_CHANGED_PRICING = WAREHOUSE_MICROSERVICE + 'item_price_changes'

//Documents Routes
export const FINANCE_DOCUMENTS = FINANCE_MICROSERVICE + 'documents'
export const FINANCE_DOCUMENT_TYPES = FINANCE_MICROSERVICE + 'document_types'
export const FINANCE_TRANSACTION_TYPES = FINANCE_MICROSERVICE + 'transaction_types'
export const FINANCE_DOCUMENT_SETUPS = FINANCE_MICROSERVICE + 'document_setups'

export const FINANCE_BUDGET_SETUPS = FINANCE_MICROSERVICE + 'budget_setups'
export const PAYEES = FINANCE_MICROSERVICE + 'payees'
export const RECEPT_PAYMENTS = FINANCE_MICROSERVICE + 'recept_payments'


//QualityAssurance Routes
export const GET_QUALITY_ASSURANCE_SETUP = WAREHOUSE_MICROSERVICE + 'quality_assuarance_setups'
export const GET_ALL_QUALITY_INCIDENTS = WAREHOUSE_MICROSERVICE + 'quality_incidents'
export const NMQL_RECOMMENDATIONS = WAREHOUSE_MICROSERVICE + 'nmqal_recommendations'
export const NMQL_RECOMMENDATIONS_msd = WAREHOUSE_MICROSERVICE + 'nmqal_recommendations_msd'
export const QA_SAMPLES = WAREHOUSE_MICROSERVICE + 'qa_samples/'
export const QA_DOCUMENTS = WAREHOUSE_MICROSERVICE + 'documents'
export const QA_NMQAL_LOG = WAREHOUSE_MICROSERVICE + 'nmqal_logs'
export const QA_CIRCULARS = WAREHOUSE_MICROSERVICE + 'qa_circulars'

// return order routes
export const RETURNING_ORDERS = WAREHOUSE_MICROSERVICE + 'returning_orders'

// SPC Routes
export const PRE_PROCUREMENT_ORDERS = SPC_PROCUREMENT + 'order_lists'
export const PRE_PROCUREMENT_SINGLE_ORDERS_LIST = SPC_PROCUREMENT + 'order_list_items'
export const PRE_PROCUREMENT_CURRENT_ITEM_LIST = SPC_PROCUREMENT + 'order_list_schedules'
export const PRE_PROCUREMENT_PREVIOUS_ITEM_LIST = SPC_PROCUREMENT + 'order_list_items'
export const PRE_PROCUREMENT_HISTORY_CHART = SPC_PROCUREMENT + 'order_list_items/group_by'
export const PRE_PROCUREMENTS_APPROVAL = SPC_PROCUREMENT + 'spc_orderlist_approvals'
export const PRE_PROCUREMENTS_APPROVAL_CONFIGS = SPC_PROCUREMENT + 'spc_approval_configs'

export const SPC_PURCHASE_ORDER = SPC_PROCUREMENT + 'spc_pos'
export const SPC_PURCHASE_ORDER_RESUBMISSION = SPC_PROCUREMENT + '/spc_pos/resubmissions'
export const SPC_BANK_DETAILS = SPC_PROCUREMENT + 'bank_details'
export const SPC_ORDER_APPROVAL = SPC_PROCUREMENT + 'spc_purchaseorder_approvals'

export const SPC_CONSIGNMENT_ORDER = SPC_PROCUREMENT + 'spc_consignments'
export const SPC_CONSIGNMENT_APPROVAL = SPC_PROCUREMENT + 'spc_consignment_approvals'
export const SPC_DEBIT_NOTE = SPC_PROCUREMENT + 'debit_notes'
export const SPC_DEBIT_NOTE_CHARGES = SPC_PROCUREMENT + 'debit_note_charges'
export const SPC_DEBIT_NOTE_STATUS = SPC_PROCUREMENT + 'debit_notes/status'
export const SPC_UPDATE_DEBIT_NOTE_CHARGES = SPC_PROCUREMENT + 'debit_note_charges'
export const SPC_PO_ITEM = SPC_PROCUREMENT + 'spc_po_items'

export const SPC_PO_ITEM_DELIVERY_SCHEDULES = SPC_PROCUREMENT + 'spc_po_delivery_schedules'
export const SPC_PO_ITEM_PACKING_DETAILS = SPC_PROCUREMENT + 'spc_po_packing_details'

export const SPC_CONSIGNMENT_CONTAINER = SPC_PROCUREMENT + 'spc_consignment_containers'
export const SPC_CONSIGNMENT_VESSEL = SPC_PROCUREMENT + 'spc_consignment_vessel_datas'
export const SPC_CONSIGNMENT_CHARGES = SPC_PROCUREMENT + 'spc_consignment_charges'
export const SPC_CONSIGNMENT_RESUBMISSION = SPC_PROCUREMENT + 'spc_consignments/resubmissions'

export const SPC_SHIPMENT_CONDITIONS = SPC_PROCUREMENT + 'default_conditions'
export const SPC_CONSIGNMENT_CONDITIONS = SPC_PROCUREMENT + 'purchase_order_conditions'
export const SPC_CONSIGNMENT_ITEMS = SPC_PROCUREMENT + 'spc_consignment_items'

// debit Note newly Added

export const SPC_PO_UPDATE_ORDER_LIST_ITEM = SPC_PROCUREMENT + 'spc_order_list_items/status/'
export const SPC_PO_ORDER_LIST_HISTORY = SPC_PROCUREMENT + 'order_list_item_histories'
// debit Note newly Added
export const SPC_DEBIT_NOTE_RESUBMIT = SPC_PROCUREMENT + 'debit_notes/resubmissions'

