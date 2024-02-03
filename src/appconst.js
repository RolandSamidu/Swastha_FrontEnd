//import env from "react-dotenv";
//For Application constant and other default values
import { getEnv } from './envConfig'

//export const keycloak_client_secret = process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET
//export const keycloak_client_id = process.env.REACT_APP_KEYCLOAK_CLIENT_ID
//export const PRINT_URL = process.env.REACT_APP_PRINT_URL

let env = getEnv()

export const keycloak_client_secret = env.KEYCLOAK_CLIENT_SECRET
export const keycloak_client_id = env.KEYCLOAK_CLIENT_ID
export const cloud_keycloak_client_secret = env.CLOUD_KEYCLOAK_CLIENT_SECRET
export const cloud_keycloak_client_id = env.CLOUD_KEYCLOAK_CLIENT_ID
export const PRINT_URL = env.PRINT_URL


export const refresh_befor = 86400 //for 24 hours

export const version = "0.1.0"

export const caseSaleCharges = 10

export const citizenship = [{ label: 'Sri Lankan' }, { label: 'Foreign' }]

export const ethic_group = [
  { label: 'Sinhala' },
  { label: 'Burger' },
  { label: 'Sri Lankan Moor' },
  { label: 'Sri Lankan Tamil' },
  { label: 'Malay' },
  { label: 'Other' },
]

export const religion = [
  { label: 'Buddhist' },
  { label: 'Hindu' },
  { label: 'Christian' },
  { label: 'Islam' },
  { label: 'Other' },
  { label: 'Unknown' },
]

export const countable = [
  { label: 'Countable' },
  { label: 'Non-Countable' }
]

export const ward = [{ label: 'Ward 1' }, { label: 'Ward 2' }]

export const marital_status = [{ label: 'Single' }, { label: 'Married' }]

export const consultant = [{ label: 'Consultant1' }, { label: 'Consultant2' }]

export const admission_mode = [
  { label: 'Direct' },
  { label: 'Transferred from Hospital' },
  { label: 'Referred from Clinic' },
  { label: 'Referred from Ward' },
]

export const admission_OPD_mode = [
  { label: 'Direct' },

]

export const discharge_mode = [
  { label: 'Alive', value: 'Alive' },
  { label: 'Death', value: 'Death' },
  { label: 'LAMA', value: 'LAMA' },
  {
    label: 'Transfer to Other Hospital',
    value: 'Transfer to other hospital',
  },
  { label: 'Shared Care', value: 'Shared Care' },
]

export const admission_type = [
  { label: 'Ward' },
  { label: 'ETU' },
  { label: 'PCU' },
  { label: 'BTL' },
  { label: 'Clinic' },
]

export const batch_no = [

  { label: 'TO890025SR', value: 'TO890025SR' },
  { label: '101022AMC3', value: '101022AMC3' },
  { label: '22AP01', value: '22AP01' },

]

export const log_no = [

  { label: 'LKY0001008-062-2023' },
  { label: 'LKY0001008-061-2023' },
  { label: 'LKY0001008-060-2023' },


]
export const admission_type_clinic = [
  { label: 'Clinic' },
    /* { label: 'Special Clinic' } */,
]

export const admission_type_OPD = [
  { label: 'OPD' },
]
export const item_usage_types = [
  { label: 'Name Patient on Request' },
  { label: 'Name Patient on Stock' },
  { label: 'Name Patient Local Purchase' },
  { label: 'Stock Item' },
  { label: 'Institution LP' },
]

export const order_category = [
  { label: 'Surgical - Annual' },
  { label: 'Surgical - Special' },
  { label: 'Pharmaceutical - Regular' },
  { label: 'Pharmaceutical - Name Patient' },
  { label: 'Laboratory' },
]
export const procurement_method = [
  { label: 'ICB' },
  { label: 'NCB' },
  { label: 'RQ' },
]
export const no_of_days = [{ label: '1' }, { label: '2' }, { label: '3' }]
export const no_of_steps = [{ label: '1' }, { label: '2' }, { label: '3' }]
export const bid_value_presentage_from = [
  { label: 'Estimated Value' },
  { label: 'Bid Value' },
]
export const unit = [
  { label: 'Monitoring Unit' },
  { label: 'Imports Unit' },
  { label: 'Banking Unit' },
]
export const all_approval_request_status = [
  { label: 'New' },
  { label: 'Pending' },
  { label: 'Completed' },
]

export const sr_no = [{ label: 'select sr no' }]

export const lp_date_range = [
  { label: 'Requested Date' },
  { label: 'Required Date' },
]

export const date_range = [
  { label: 'Requested Date' },
  { label: 'Required Date' },
  { label: 'Allocated Date' },
  { label: 'Issued Date' },
  { label: 'Received Date' },
]

export const wareHouse_type = [
  { label: 'Line Ministry Hospitals' },
  { label: 'RMSD' },
  { label: 'Other' },
]
export const delivery_mode = [{ label: 'Pick Up' }, { label: 'Deliver' }]
export const status = [{ label: '' }]

export const order_status = [{ label: 'Active' }, { label: 'Started' }, { label: 'Price Verified' }, { label: 'AD Allocation Approved' }]
export const time_period = [{ label: 'Delevery Time' }, { label: 'Arrival Time' }, { label: 'Departure Time' }]

// export const lp_status = [
//     {label:'LP request submitted'},
//     {label: 'Store Pharmacist Updated Director Authorized'},
//     {label: 'SCO Approved'},
//     {label: 'Return for the correction by SCO'},
//     {label: 'HSCO Approved'},
//     {label: 'Return for the correction by HSCO'},
//     {label: 'AD Approved'},
//     {label: 'Return for the correction by AD'},
//     {label: 'On the purchasing process Purchased '},
//     {label: 'Good Received'},
//     {label: 'Delivered'},
// ]

export const lp_status = [
  { label: "Hospital Director Approved" },
  { label: "Hospital CP Checked" },
  { label: "MSD SCO Forwarded" },
  { label: "MSD HSCO Forwarded" },
  { label: "MSD AD Approved" },
  { label: "MSD Director Approved" },
]

export const consignment_status = [
  { label: "Pending" },
  { label: "Draft" },
  { label: "New" },
  { label: "APPROVED" },
  { label: "REJECTED" },
  { label: "COMPLETED" },
  { label: "Debit Note Created" },
  { label: "Debit note reinstated" },
  { label: "DELIVERED" },
]

export const storeTypes = [
  { label: 'Countable', value: 'Countable' },
  { label: 'Non-Countable', value: 'Non-Countable' },
  { label: 'N/A', value: 'N/A' },
]
export const phamacistsTypes = [
  { label: 'Designated Pharmacist', value: 'Designated Pharmacist' },
  { label: 'Admin Pharmacist', value: 'Admin Pharmacist' },
  { label: 'Counter Pharmacist', value: 'Counter Pharmacist' },
  { label: 'Dispenser', value: 'Dispenser' },
]

export const transactionTypes = [
  { label: 'Debit', value: 'Debit' },
  { label: 'Credit', value: 'Credit' },
]

export const consumables = [
  { label: 'Consumable', value: 'consumable' },
  { label: 'Non-Consumable', value: 'non-consumable' },
  // { label: 'consumable3', value: 'consumable3' },
]

export const item_status = [
  { label: 'Active', value: 'Active' },
  { label: 'Tail off', value: 'Tail off' },
  { label: 'Inactive', value: 'Inactive' },
]

// order list catogory type
export const order_list_catogory = [
  { label: 'Normal Order', value: 'Normal Order' },
  { label: 'Additional Order', value: 'Additional Order' },
  { label: 'Indian Credit Line', value: 'Indian Credit Line' },
  { label: 'Emergency Order', value: 'Emergency Order' },
  { label: 'Special Order', value: 'Special Order' },
]


export const order_list_status = [
  { label: 'Pending Approval', value: 'Pending Approval' },
  { label: 'New', value: 'New' },
  { label: 'EDITED-APPROVAL PENDING', value: 'EDITED-APPROVAL PENDING' },
  { label: 'APPROVED', value: 'APPROVED' },
  { label: 'REJECTED', value: 'REJECTED' },
]

export const consignment_list_status = [
  // { label: 'Pending Approval', value: 'Pending Approval' },
  // { label: 'New', value: 'New' },
  { label: 'SPC APPROVED', value: 'SPC APPROVED' },
  { label: 'APPROVED', value: 'APPROVED' },
  { label: 'AMENDED', value: 'AMENDED' },
]


export const pending_approval_type = [
  { label: 'Special Order', value: 'Special Order' },
  { label: 'Normal Order', value: 'Normal Order' },
  { label: 'Emergency Order', value: 'Emergency Order' },
  { label: 'Additional Order', value: 'Additional Order' },
  { label: 'Name Patient Order', value: 'Name Patient Order' },
]


export const source_of_creation = [
  { label: 'FR', value: 'FR' },
  { label: 'Local purchase', value: 'Local purchase' },
  { label: 'Donation', value: 'Donation' },
  { label: 'Name Patient', value: 'Name Patient' },
  { label: 'Other', value: 'Other' },
]

export const all_transfer_mode = [
  { label: 'To Ward', value: 'To Ward' },
  { label: 'Shared Care', value: 'Shared Care' },
]

export const transport_mode = [
  { label: 'By Foot' },
  { label: 'Wheel chair' },
  { label: 'Trolley' },
]
export const general_type_abdomen = [
  { label: 'Sample Type 1' },
  { label: 'Sample Type 2' }

]
export const general_region_abdomen = [
  { label: 'Region Sample 1' },
  { label: 'Region Sample 2' }

]

export const district = []
export const moh = []

export const phm = []
export const gn = []

export const storeDataSample = [
  {
    id: '1',
    name: 'Countable',
    designatedPharmacist: 'Assigned',
    location: 'Kandy',
    drugCategory: 'N/A',
  },
  {
    id: '2',
    name: 'Countable-1',
    designatedPharmacist: 'Not-Assigned',
    location: 'Kandy',
    drugCategory: 'N/A',
  },
  {
    id: '3',
    name: 'Countable-2',
    designatedPharmacist: 'Assigned',
    location: 'Kandy',
    drugCategory: 'N/A',
  },
  {
    id: '4',
    name: 'Countable-3',
    designatedPharmacist: 'Not-Assigned',
    location: 'Kandy',
    drugCategory: 'N/A',
  },
  {
    id: '5',
    name: 'Countable-4',
    designatedPharmacist: 'Not-Assigned',
    location: 'Kandy',
    drugCategory: 'N/A',
  },
  {
    id: '6',
    name: 'Countable=6',
    designatedPharmacist: 'Not-Assigned',
    location: 'Kandy',
    drugCategory: 'N/A',
  },
]
export const date_type = [
  { value: 'Requested Date' },
  { value: 'Required Date' },
  { value: 'Allocated Date' },
  { value: 'Issued Date' },
  { value: 'Received Date' },
]
export const msd_datasetup_hospital_user_type = [
  { type: 'Hospital Admin', lable: 'Hospital Admin' },
  { type: 'Sales Hospital Admin', lable: 'Sales Hospital Admin' },

]
export const user_type = [{ type: 'Driver' }, { type: 'Helper' }]
export const hospital_user_type = [
  { type: 'Consultant', lable: 'Consultant' },
  /*  { type: "Doctor",lable:"Doctor" }, */
  { type: 'Nurse', lable: 'Nursing Officer' },
  { type: 'MRO', lable: 'MRO' },
  { type: 'Admin Pharmacist', lable: 'Admin Pharmacist' },
  { type: 'Chief Pharmacist', lable: 'Chief Pharmacist' },
  { type: 'Accounts Clerk Hospital', lable: 'Accounts Clerk Hospital' },
  { type: 'Counter Pharmacist', lable: 'Counter Pharmacist' },
  { type: 'Dispenser', lable: 'Dispenser' },
  //{ type: 'Pharmacist', lable: 'Pharmacist' },
  { type: 'Front Desk', lable: 'Front Desk' },
  { type: 'Front Desk Admin', lable: 'Front Desk Admin' },
  { type: 'Medical Officer', lable: 'Medical Officer' },
  { type: 'Driver', lable: 'Driver' },
  { type: 'Helper', lable: 'Helper' },
  {
    type: 'Health Service Assistant',
    lable: 'Health Service Assistant',
  } /* , { type: "Attendant",lable:"Attendant" } */,
  { type: 'Drug Store Keeper', lable: 'Drug Store Pharmacist' },
  { type: 'Store Keeper', lable: 'Store Keeper' },
  { type: 'Chief MLT', lable: 'Chief MLT' },
  { type: 'Chief Radiographer', lable: 'Chief Radiographer' },
  // { type: 'Drug Store Officer', lable: 'Drug Store Officer' },
  { type: 'Clinic Admin', lable: 'Clinic Admin' },
  //   { type: 'Hospital Pharmacist Surgical Consumable Pharmacist', lable: 'Hospital Pharmacist Surgical Consumable Pharmacist' }, 
  //  { type: 'Surgical Inventory Pharmacist', lable: 'Surgical Inventory Pharmacist' },
  //  { type: 'Indoor Pharmacist', lable: 'Indoor Pharmacist' },
  //  { type: 'Incharge Pharmacist - OPD', lable: 'ConsultIncharge Pharmacist - OPD' },
  //  { type: 'Incharge Pharmacist - Clinic', lable: 'Incharge Pharmacist - Clinic' },  
  { type: 'Medical Laboratory Technologist', lable: 'Medical Laboratory Technologist' },
  { type: 'Radiographer', lable: 'Radiographer' },
  { type: 'ECG Technician', lable: 'ECG Technician' },
  { type: 'EEG Technician', lable: 'EEG Technician' },
  { type: 'Development Officer', lable: 'Development Officer' },
  { type: 'Physiotherapist', lable: 'Physiotherapist' },
  { type: 'Speech Therapist', lable: 'Speech Therapist' },
  { type: 'Occupational Therapist Development Officer', lable: 'Occupational Therapist Development Officer' },
  { type: 'Public Health Management Assistant', lable: 'Public Health Management Assistant' },
  { type: 'Local Purchase Pharmacist', lable: 'Local Purchase Pharmacist' },
]

export const hospital_user_type_for_saleAdmin = [
  { type: 'Consultant', lable: 'Consultant' },
  /*  { type: "Doctor",lable:"Doctor" }, */
  { type: 'Nurse', lable: 'Nursing Officer' },
  { type: 'MRO', lable: 'MRO' },
  { type: 'Admin Pharmacist', lable: 'Admin Pharmacist' },
  { type: 'Chief Pharmacist', lable: 'Chief Pharmacist' },
  { type: 'Counter Pharmacist', lable: 'Counter Pharmacist' },
  { type: 'Dispenser', lable: 'Dispenser' },
  //{ type: 'Pharmacist', lable: 'Pharmacist' },
  { type: 'Front Desk', lable: 'Front Desk' },
  { type: 'Front Desk Admin', lable: 'Front Desk Admin' },
  { type: 'Medical Officer', lable: 'Medical Officer' },
  { type: 'Driver', lable: 'Driver' },
  { type: 'Helper', lable: 'Helper' },
  {
    type: 'Health Service Assistant',
    lable: 'Health Service Assistant',
  },
  { type: 'Drugstore Pharmacist(S)', lable: 'Drugstore Pharmacist(S)' },
  { type: 'Chief MLT', lable: 'Chief MLT' },
  { type: 'Chief Radiographer', lable: 'Chief Radiographer' },
  { type: 'Clinic Admin', lable: 'Clinic Admin' },

  { type: 'Medical Laboratory Technologist', lable: 'Medical Laboratory Technologist' },
  { type: 'Radiographer', lable: 'Radiographer' },
  { type: 'ECG Technician', lable: 'ECG Technician' },
  { type: 'EEG Technician', lable: 'EEG Technician' },
  { type: 'Development Officer', lable: 'Development Officer' },
  { type: 'Physiotherapist', lable: 'Physiotherapist' },
  { type: 'Speech Therapist', lable: 'Speech Therapist' },
  { type: 'Occupational Therapist Development Officer', lable: 'Occupational Therapist Development Officer' },
  { type: 'Public Health Management Assistant', lable: 'Public Health Management Assistant' },
]

export const all_hospital_user_type_for_institution = [
  { type: 'Consultant', lable: 'Consultant' },
  /*  { type: "Doctor",lable:"Doctor" }, */
  { type: 'Nurse', lable: 'Nursing Officer' },
  { type: 'MRO', lable: 'MRO' },
  { type: 'Admin Pharmacist', lable: 'Admin Pharmacist' },
  { type: 'Chief Pharmacist', lable: 'Chief Pharmacist' },
  { type: 'Counter Pharmacist', lable: 'Counter Pharmacist' },
  { type: 'Dispenser', lable: 'Dispenser' },
  //{ type: 'Pharmacist', lable: 'Pharmacist' },
  { type: 'Front Desk', lable: 'Front Desk' },
  { type: 'Front Desk Admin', lable: 'Front Desk Admin' },
  { type: 'Medical Officer', lable: 'Medical Officer' },
  { type: 'Driver', lable: 'Driver' },
  { type: 'Helper', lable: 'Helper' },
  {
    type: 'Health Service Assistant',
    lable: 'Health Service Assistant',
  },
  { type: 'Drugstore Pharmacist(S)', lable: 'Drugstore Pharmacist(S)' },
  { type: 'Chief MLT', lable: 'Chief MLT' },
  { type: 'Chief Radiographer', lable: 'Chief Radiographer' },
  { type: 'Clinic Admin', lable: 'Clinic Admin' },

  { type: 'Medical Laboratory Technologist', lable: 'Medical Laboratory Technologist' },
  { type: 'Radiographer', lable: 'Radiographer' },
  { type: 'ECG Technician', lable: 'ECG Technician' },
  { type: 'EEG Technician', lable: 'EEG Technician' },
  { type: 'Development Officer', lable: 'Development Officer' },
  { type: 'Physiotherapist', lable: 'Physiotherapist' },
  { type: 'Speech Therapist', lable: 'Speech Therapist' },
  { type: 'Occupational Therapist Development Officer', lable: 'Occupational Therapist Development Officer' },
  { type: 'Public Health Management Assistant', lable: 'Public Health Management Assistant' },
  { type: 'Hospital Director', lable: 'Hospital Director' },
]

export const instutution_user = [
  { type: 'Chief Pharmacist', lable: 'Chief Pharmacist' },
  { type: 'Hospital Director', lable: 'Hospital Director' },
]

export const hospital_user_type_for_BloodBankAdmin = [
  { type: 'Blood Bank MLT', lable: 'Blood Bank MLT' },
  { type: 'Blood Bank Chief MLT', lable: 'Blood Bank Chief MLT' },
  { type: 'Blood Bank Consultant', lable: 'Blood Bank Consultant' },
  { type: 'Blood Bank MLT (NOIC)', lable: 'Blood Bank MLT (NOIC)' },
]

export const msd_user_type = [

  // { type: 'Consultant', lable: 'Consultant' },
  // { type: 'Nurse', lable: 'Nursing Officer' },
  // { type: 'MRO', lable: 'MRO' },
  // { type: 'Admin Pharmacist', lable: 'Admin Pharmacist' },
  // { type: 'Chief Pharmacist', lable: 'Chief Pharmacist' },
  // { type: 'Counter Pharmacist', lable: 'Counter Pharmacist' },
  // { type: 'Front Desk', lable: 'Front Desk' },
  // { type: 'Front Desk Admin', lable: 'Front Desk Admin' },
  // { type: 'Medical Officer', lable: 'Medical Officer' },
  { type: 'Driver', lable: 'Driver' },
  { type: 'Helper', lable: 'Helper' },
  // { type: 'Distribution Officer', lable: 'Distribution Officer' },
  { type: 'HSCO', lable: 'HSCO' },
  { type: 'Item Master Admin', lable: 'Item Master Admin' },
  { type: 'MSD AD', lable: 'MSD AD' },
  { type: 'MSD CIU', lable: 'MSD CIU' },
  { type: 'MSD Director', lable: 'MSD Director' },
  { type: 'MSD Distribution Officer', lable: 'MSD Distribution Officer' },
  { type: 'MSD MSA', lable: 'MSD MSA' },//
  { type: 'MSD MSA Dispatch', lable: 'MSD MSA Dispatch' },//
  { type: 'MSD SCO Distribution ', lable: 'MSD SCO Distribution' },//main role MSD SCO
  { type: 'MSD SCO Supply', lable: 'MSD SCO Supply' },
  { type: 'MSD SCO QA', lable: 'MSD SCO QA' },
  { type: 'MSD SDA', lable: 'MSD SDA' },
  { type: 'MSD Security', lable: 'MSD Security' },
  { type: 'SPC MA', lable: 'SPC MA' },
  { type: 'Store Keeper', lable: 'Store Keeper' },
  //
  // { type: 'Health Service Assistant', lable: 'Health Service Assistant' },
  // { type: 'Drug Store Keeper', lable: 'Drug Store Pharmacist' },
  // { type: 'Clinic Admin', lable: 'Clinic Admin' },
]

export const rmsd_user_type = [
  //{ type: 'RMSD pharmacist', lable: 'RMSD pharmacist' }, { type: 'SKS', lable: 'SKS' }, { type: 'Management Assistant', lable: 'Management Assistant' }, { type: 'DO - Development Officer', lable: 'DO - Development Officer' }, { type: 'ICT Assistant', lable: 'ICT Assistant' },
  { type: 'RMSD OIC', lable: 'RMSD OIC' }, { type: 'RMSD MSA', lable: 'RMSD MSA' }, { type: 'RMSD Pharmacist', lable: 'RMSD Pharmacist' },

]
export const loginUserTypes = ['Drug Store Keeper']
export const order_status_types = [
  { value: 'Pending' },
  { value: 'Ordered' },
  { value: 'Approved' },
  { value: 'Rejected' },
  { value: 'Allocated' },
  { value: 'Issued' },
  { value: 'Received' },
]
export const remark_numbers = [{ remark_no: '1' }, { remark_no: '2' }, { remark_no: '3' }, { remark_no: '4' }, { remark_no: '5' }, { remark_no: '6' }]
export const ward_status_types = [
  { name: 'Pending' },
  { name: 'Admitted' },
  { name: 'Transfer' },
  { name: 'Discharged' },
]
export const remark_types = [
  { name: 'Order Delivery Remark' },
  { name: 'Order Unfulfilment Remark' },
  { name: 'Item Return Remark' },
]
export const districtList = [
  { value: 'Ampara', label: 'Ampara', province: 'Eastern' },
  { value: 'Anuradhapura', label: 'Anuradhapura', province: 'North Central' },
  { value: 'Badulla', label: 'Badulla', province: 'Uva' },
  { value: 'Batticaloa', label: 'Batticaloa', province: 'Eastern' },
  { value: 'Colombo', label: 'Colombo', province: 'Western' },
  { value: 'Galle', label: 'Galle', province: 'Southern' },
  { value: 'Gampaha', label: 'Gampaha', province: 'Western' },
  { value: 'Hambantota', label: 'Hambantota', province: 'Southern' },
  { value: 'Jaffna', label: 'Jaffna', province: 'Northern' },
  { value: 'Kalutara', label: 'Kalutara', province: 'Western' },
  { value: 'Kandy', label: 'Kandy', province: 'Central' },
  { value: 'Kegalle', label: 'Kegalle', province: 'Sabaragamuwa' },
  { value: 'Kilinochchi', label: 'Kilinochchi', province: 'Northern' },
  { value: 'Kurunegala', label: 'Kurunegala', province: 'North Western' },
  { value: 'Mannar', label: 'Mannar', province: 'Northern' },
  { value: 'Matale', label: 'Matale', province: 'Central' },
  { value: 'Matara', label: 'Matara', province: 'Southern' },
  { value: 'Monaragala', label: 'Monaragala', province: 'Uva' },
  { value: 'Mullaitivu', label: 'Mullaitivu', province: 'Northern' },
  { value: 'Nuwara Eliya', label: 'Nuwara Eliya', province: 'Central' },
  { value: 'Polonnaruwa', label: 'Polonnaruwa', province: 'North Central' },
  { value: 'Puttalam', label: 'Puttalam', province: 'North Western' },
  { value: 'Rathnapura', label: 'Rathnapura', province: 'Sabaragamuwa' },
  { value: 'Trincomalee', label: 'Trincomalee', province: 'Eastern' },
  { value: 'Vavuniya', label: 'Vavuniya', province: 'Northern' },
]

export const provinceList = [
  // { label: 'All', value: 'all' },
  { value: 'Southern', label: 'Southern' },
  { value: 'Western', label: 'Western' },
  { value: 'Central', label: 'Central' },
  { value: 'Uva', label: 'Uva' },
  { value: 'Sabaragamuwa', label: 'Sabaragamuwa' },
  { value: 'North Western', label: 'North Western' },
  { value: 'North Central', label: 'North Central' },
  { value: 'Northern', label: 'Northern' },
  { value: 'Eastern', label: 'Eastern' },
]

export const categorySPC = [
  { label: 'All' },
  { label: 'Surgical - Annual' },
  { label: 'Surgical - Special' },
  { label: 'Pharmaceutical - Regular' },
  { label: 'Pharmaceutical - Name Patient ' },
  { label: 'Laboratory' },
]

export const statusSPC = [
  { label: 'All' },
  { label: 'New' },
  { label: 'Ongoing' },
  { label: 'Completed' },
]

export const newProcurementSPC = [
  { label: 'All' },
  { label: 'New' },
  { label: 'Added to Agenda' },
]

export const methodSPC = [
  { label: 'All' },
  { label: 'RQ' },
  { label: 'World wide' },
]

export const statusAllAgendas = [
  { label: 'All' },
  { label: 'Pending' },
  { label: 'Completed' },
]

export const authoritySPC = [
  { label: 'All' },
  { label: 'DPC' },
  { label: 'Ministry' },
  { label: 'Cabinet' },
]

export const prioritySPC = [
  { label: 'All' },
  { label: 'High' },
  { label: 'Normal' },
  { label: 'Low' },
]

export const commiteeSPC = [
  { label: 'All' },
  { label: 'DPC -Minor' },
  { label: 'MPC' },
  { label: 'SPC' },
]

export const statusSPCprocurement = [
  { label: 'All' },
  { label: 'New' },
  { label: 'Tender to be Called' },
  { label: 'Awaiting Bids' },
  { label: 'Tender Closed' },
  { label: 'No Offers' },
  { label: 'To be Retendered' },
  { label: 'Awaiting TEC Decision' },
  { label: 'Awaiting PC Decision' },
  { label: 'Awaiting Award Acceptance' },
  { label: 'Awaiting WOR from NMRA' },
  { label: 'Awaiting MSD Concurrence' },
]

export const returnStatusOptions = [
  {
    value: 'Pending',
    label: 'PENDING',
  },
  {
    value: 'ORDERED',
    label: 'ORDERED',
  },
  {
    value: 'APPROVED',
    label: 'APPROVED',
  },
  {
    value: 'ADMIN_ACCEPT',
    label: 'ACCEPTED',
  },
  {
    value: 'ADMIN_REJECT',
    label: 'REJECTED',
  },
]

export const animal = [
  {
    value: 'strayDog',
    label: 'Stray Dog',
  },
  {
    value: 'strayCat',
    label: 'Stray Cat',
  },
  {
    value: 'monkey',
    label: 'Monkey',
  },
  {
    value: 'mongoose',
    label: 'Mongoose',
  },
  {
    value: 'cattle',
    label: 'Cattle',
  },
  {
    value: 'fox',
    label: 'Fox',
  },
  {
    value: 'domesticDog',
    label: 'Domestic Dog',
  },
  {
    value: 'domesticCat',
    label: 'Domestic Cat',
  },
  {
    value: 'bat',
    label: 'Bat',
  },
  {
    value: 'poleCat',
    label: 'Pole Cat',
  },
  {
    value: 'rat',
    label: 'Rat',
  },
  {
    value: 'other',
    label: 'Other',
  },
]

export const animalVaccinated = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
  {
    value: 'notApplicable',
    label: 'Not Applicable',
  },
]

export const typeOfWound = [
  {
    value: 'superficial',
    label: 'Superficial',
  },
  {
    value: 'multiple',
    label: 'Multiple',
  },
  {
    value: 'deep',
    label: 'Deep',
  },
]

export const categoryOfTheBite = [
  {
    value: 'minor',
    label: 'Minor',
  },
  {
    value: 'major',
    label: 'Major',
  },
  {
    value: 'boarderline',
    label: 'Boarderline',
  },
]

export const siteOfTheBite = [
  {
    value: 'faceHead',
    label: 'Face/Head',
  },
  {
    value: 'palmFoot',
    label: 'Palm/Foot',
  },
  {
    value: 'upperTrunk',
    label: 'Upper Trunk',
  },
  {
    value: 'lowerTrunk',
    label: 'Lower Trunk',
  },
  {
    value: 'leg',
    label: 'Leg',
  },
  {
    value: 'hand',
    label: 'Hand',
  },
]

export const managementCategory = [
  {
    value: 'ObserveFo14Days',
    label: 'Observe for 14 days',
  },
  {
    value: 'IDSchedule',
    label: 'ID Schedule',
  },
  {
    value: 'IMSchedule',
    label: 'IM Schedule',
  },
]

export const IDScheduleCategory = [
  {
    value: 'ARV2SiteTwoDoses(ID)',
    label: 'ARV 2 Site Two Doses (ID)',
  },
  {
    value: 'ARV2Site(ID)',
    label: 'ARV 2 Site (ID)',
  },
  {
    value: 'ARV(ERIG)+ARV2Site(ID)',
    label: 'ARV(ERIG) + ARV 2 Site (ID)',
  },
  {
    value: 'ARV(HRIG)+ARV2Site(ID)',
    label: 'ARV(HRIG) + ARV 2 Site (ID)',
  },
  {
    value: 'ARVModified4SiteSingleDose(ID)',
    label: 'ARV Modified 4 Site Single Dose (ID)',
  },
  {
    value: 'ARVModified4SiteDose(ID)',
    label: 'ARV Modified 4 Site Dose (ID)',
  },
]

export const category03 = [
  {
    value: 'HRIG20',
    label: 'HRIG (20 IU/kg)',
  },
  {
    value: 'ERIG40',
    label: 'ERIG (40 IU/kg)',
  },
]

export const IMScheduleCategory = [
  {
    label: 'IM Single Dose',
    value: 'iMSingleDose'
  },
  {
    label: 'Category 2 without RIG',
    value: 'category2WithoutRIG'
  },
  {
    label: 'Category 3 with RIG (HRIC (20 IU/kg) or ERIG (40 IU/kg))',
    value: 'Category3'
  },
]

export const ProcedureData = [
  {
    value: 'Procedure 01',
    label: 'Procedure 01',
  },
  {
    value: 'Procedure 02',
    label: 'Procedure 02',
  },
]
export const estimation_type = [
  {
    value: 'Annual',
    label: 'Annual',
  },
  {
    value: 'Special',
    label: 'Special',
  },
]

export const institute_category = [
  {
    value: null,
    label: 'All',
  },
  {
    value: 'Line Ministry',
    label: 'Line Ministry',
  },
  {
    value: 'Provincial',
    label: 'Provincial',
  },
  {
    value: 'Internal Customer',
    label: 'Internal Customer',
  },
  {
    value: 'Narcotics',
    label: 'Narcotics',
  },
]
export const item_priority_values = [
  {
    value: null,
    label: 'All',
  },
  {
    value: 'Yes',
    label: 'Yes',
  },
  {
    value: 'No',
    label: 'No',
  }
]


export const warehouse_types = [
  { label: 'MSD', value: 'MSD' },
  { label: 'RMSD', value: 'RMSD' },
  { label: 'Other', value: 'OTHER' }
  /*   { label: 'Hospital', value: 'Hospital' }, */


]
export const warehouse_types_for_Exchange = [
  { label: 'RMSD', value: 'RMSD' },
  { label: 'Hospital', value: 'Hospital' },
  { label: 'Other', value: 'OTHER' }

]

export const voucher_status_list = [
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' }

]

export const Institution_type = [
  { label: 'MSD', value: 'MSD' },
  { label: 'RMSD', value: 'RMSD' },
  { label: 'Hospital', value: 'Hospital' }

]

export const warehouse_types_for_BloodBank = [
  { label: 'MSD', value: 'MSD' },
  { label: 'RMSD', value: 'RMSD' },
  { label: 'Blood Bank', value: 'BLOOD BANK' },
  { label: 'Other Institiute', value: 'Hospital' }


]

export const warehouse_types2 = [
  { label: 'MSD', value: 'MSD' },
  { label: 'RMSD', value: 'RMSD' },
  { label: 'Hospital Store', value: 'drug_store' },
  { label: 'Pharmacy', value: 'Pharmacy' },
  // { label: 'Other Store', value: 'Other Store' },
]
export const order_type = [
  { label: 'Order', value: 'Order' },
  { label: 'Return', value: 'Return' },
  { label: 'Distribution', value: 'Distribution' },
]
export const approval_users = [
  { label: 'Chief Pharmacist', value: 'Chief Pharmacist' },
  { label: 'Admin Pharmacist', value: 'Admin Pharmacist' },
  { label: 'Director', value: 'Director' },
]
export const sample_result = [
  { value: 'Satisfied', label: 'Satisfied' },
  { value: 'Unsatisfied', label: 'Unsatisfied' },
  { value: 'Not Analysed', label: 'Not Analysed' },
]
//Country list
export const Country_list = [
  { "name": "Afghanistan", "code": "AF" },
  { "name": "land Islands", "code": "AX" },
  { "name": "Albania", "code": "AL" },
  { "name": "Algeria", "code": "DZ" },
  { "name": "American Samoa", "code": "AS" },
  { "name": "AndorrA", "code": "AD" },
  { "name": "Angola", "code": "AO" },
  { "name": "Anguilla", "code": "AI" },
  { "name": "Antarctica", "code": "AQ" },
  { "name": "Antigua and Barbuda", "code": "AG" },
  { "name": "Argentina", "code": "AR" },
  { "name": "Armenia", "code": "AM" },
  { "name": "Aruba", "code": "AW" },
  { "name": "Australia", "code": "AU" },
  { "name": "Austria", "code": "AT" },
  { "name": "Azerbaijan", "code": "AZ" },
  { "name": "Bahamas", "code": "BS" },
  { "name": "Bahrain", "code": "BH" },
  { "name": "Bangladesh", "code": "BD" },
  { "name": "Barbados", "code": "BB" },
  { "name": "Belarus", "code": "BY" },
  { "name": "Belgium", "code": "BE" },
  { "name": "Belize", "code": "BZ" },
  { "name": "Benin", "code": "BJ" },
  { "name": "Bermuda", "code": "BM" },
  { "name": "Bhutan", "code": "BT" },
  { "name": "Bolivia", "code": "BO" },
  { "name": "Bosnia and Herzegovina", "code": "BA" },
  { "name": "Botswana", "code": "BW" },
  { "name": "Bouvet Island", "code": "BV" },
  { "name": "Brazil", "code": "BR" },
  { "name": "British Indian Ocean Territory", "code": "IO" },
  { "name": "Brunei Darussalam", "code": "BN" },
  { "name": "Bulgaria", "code": "BG" },
  { "name": "Burkina Faso", "code": "BF" },
  { "name": "Burundi", "code": "BI" },
  { "name": "Cambodia", "code": "KH" },
  { "name": "Cameroon", "code": "CM" },
  { "name": "Canada", "code": "CA" },
  { "name": "Cape Verde", "code": "CV" },
  { "name": "Cayman Islands", "code": "KY" },
  { "name": "Central African Republic", "code": "CF" },
  { "name": "Chad", "code": "TD" },
  { "name": "Chile", "code": "CL" },
  { "name": "China", "code": "CN" },
  { "name": "Christmas Island", "code": "CX" },
  { "name": "Cocos (Keeling) Islands", "code": "CC" },
  { "name": "Colombia", "code": "CO" },
  { "name": "Comoros", "code": "KM" },
  { "name": "Congo", "code": "CG" },
  { "name": "Congo, The Democratic Republic of the", "code": "CD" },
  { "name": "Cook Islands", "code": "CK" },
  { "name": "Costa Rica", "code": "CR" },
  { "name": "Cote D Ivoire", "code": "CI" },
  { "name": "Croatia", "code": "HR" },
  { "name": "Cuba", "code": "CU" },
  { "name": "Cyprus", "code": "CY" },
  { "name": "Czech Republic", "code": "CZ" },
  { "name": "Denmark", "code": "DK" },
  { "name": "Djibouti", "code": "DJ" },
  { "name": "Dominica", "code": "DM" },
  { "name": "Dominican Republic", "code": "DO" },
  { "name": "Ecuador", "code": "EC" },
  { "name": "Egypt", "code": "EG" },
  { "name": "El Salvador", "code": "SV" },
  { "name": "Equatorial Guinea", "code": "GQ" },
  { "name": "Eritrea", "code": "ER" },
  { "name": "Estonia", "code": "EE" },
  { "name": "Ethiopia", "code": "ET" },
  { "name": "Falkland Islands (Malvinas)", "code": "FK" },
  { "name": "Faroe Islands", "code": "FO" },
  { "name": "Fiji", "code": "FJ" },
  { "name": "Finland", "code": "FI" },
  { "name": "France", "code": "FR" },
  { "name": "French Guiana", "code": "GF" },
  { "name": "French Polynesia", "code": "PF" },
  { "name": "French Southern Territories", "code": "TF" },
  { "name": "Gabon", "code": "GA" },
  { "name": "Gambia", "code": "GM" },
  { "name": "Georgia", "code": "GE" },
  { "name": "Germany", "code": "DE" },
  { "name": "Ghana", "code": "GH" },
  { "name": "Gibraltar", "code": "GI" },
  { "name": "Greece", "code": "GR" },
  { "name": "Greenland", "code": "GL" },
  { "name": "Grenada", "code": "GD" },
  { "name": "Guadeloupe", "code": "GP" },
  { "name": "Guam", "code": "GU" },
  { "name": "Guatemala", "code": "GT" },
  { "name": "Guernsey", "code": "GG" },
  { "name": "Guinea", "code": "GN" },
  { "name": "Guinea-Bissau", "code": "GW" },
  { "name": "Guyana", "code": "GY" },
  { "name": "Haiti", "code": "HT" },
  { "name": "Heard Island and Mcdonald Islands", "code": "HM" },
  { "name": "Holy See (Vatican City State)", "code": "VA" },
  { "name": "Honduras", "code": "HN" },
  { "name": "Hong Kong", "code": "HK" },
  { "name": "Hungary", "code": "HU" },
  { "name": "Iceland", "code": "IS" },
  { "name": "India", "code": "IN" },
  { "name": "Indonesia", "code": "ID" },
  { "name": "Iran, Islamic Republic Of", "code": "IR" },
  { "name": "Iraq", "code": "IQ" },
  { "name": "Ireland", "code": "IE" },
  { "name": "Isle of Man", "code": "IM" },
  { "name": "Israel", "code": "IL" },
  { "name": "Italy", "code": "IT" },
  { "name": "Jamaica", "code": "JM" },
  { "name": "Japan", "code": "JP" },
  { "name": "Jersey", "code": "JE" },
  { "name": "Jordan", "code": "JO" },
  { "name": "Kazakhstan", "code": "KZ" },
  { "name": "Kenya", "code": "KE" },
  { "name": "Kiribati", "code": "KI" },
  { "name": "Korea, Democratic Peoples Republic of", "code": "KP" },
  { "name": "Korea, Republic of", "code": "KR" },
  { "name": "Kuwait", "code": "KW" },
  { "name": "Kyrgyzstan", "code": "KG" },
  { "name": "Lao PeopleS Democratic Republic", "code": "LA" },
  { "name": "Latvia", "code": "LV" },
  { "name": "Lebanon", "code": "LB" },
  { "name": "Lesotho", "code": "LS" },
  { "name": "Liberia", "code": "LR" },
  { "name": "Libyan Arab Jamahiriya", "code": "LY" },
  { "name": "Liechtenstein", "code": "LI" },
  { "name": "Lithuania", "code": "LT" },
  { "name": "Luxembourg", "code": "LU" },
  { "name": "Macao", "code": "MO" },
  { "name": "Macedonia, The Former Yugoslav Republic of", "code": "MK" },
  { "name": "Madagascar", "code": "MG" },
  { "name": "Malawi", "code": "MW" },
  { "name": "Malaysia", "code": "MY" },
  { "name": "Maldives", "code": "MV" },
  { "name": "Mali", "code": "ML" },
  { "name": "Malta", "code": "MT" },
  { "name": "Marshall Islands", "code": "MH" },
  { "name": "Martinique", "code": "MQ" },
  { "name": "Mauritania", "code": "MR" },
  { "name": "Mauritius", "code": "MU" },
  { "name": "Mayotte", "code": "YT" },
  { "name": "Mexico", "code": "MX" },
  { "name": "Micronesia, Federated States of", "code": "FM" },
  { "name": "Moldova, Republic of", "code": "MD" },
  { "name": "Monaco", "code": "MC" },
  { "name": "Mongolia", "code": "MN" },
  { "name": "Montenegro", "code": "ME" },
  { "name": "Montserrat", "code": "MS" },
  { "name": "Morocco", "code": "MA" },
  { "name": "Mozambique", "code": "MZ" },
  { "name": "Myanmar", "code": "MM" },
  { "name": "Namibia", "code": "NA" },
  { "name": "Nauru", "code": "NR" },
  { "name": "Nepal", "code": "NP" },
  { "name": "Netherlands", "code": "NL" },
  { "name": "Netherlands Antilles", "code": "AN" },
  { "name": "New Caledonia", "code": "NC" },
  { "name": "New Zealand", "code": "NZ" },
  { "name": "Nicaragua", "code": "NI" },
  { "name": "Niger", "code": "NE" },
  { "name": "Nigeria", "code": "NG" },
  { "name": "Niue", "code": "NU" },
  { "name": "Norfolk Island", "code": "NF" },
  { "name": "Northern Mariana Islands", "code": "MP" },
  { "name": "Norway", "code": "NO" },
  { "name": "Oman", "code": "OM" },
  { "name": "Pakistan", "code": "PK" },
  { "name": "Palau", "code": "PW" },
  { "name": "Palestinian Territory, Occupied", "code": "PS" },
  { "name": "Panama", "code": "PA" },
  { "name": "Papua New Guinea", "code": "PG" },
  { "name": "Paraguay", "code": "PY" },
  { "name": "Peru", "code": "PE" },
  { "name": "Philippines", "code": "PH" },
  { "name": "Pitcairn", "code": "PN" },
  { "name": "Poland", "code": "PL" },
  { "name": "Portugal", "code": "PT" },
  { "name": "Puerto Rico", "code": "PR" },
  { "name": "Qatar", "code": "QA" },
  { "name": "Reunion", "code": "RE" },
  { "name": "Romania", "code": "RO" },
  { "name": "Russian Federation", "code": "RU" },
  { "name": "RWANDA", "code": "RW" },
  { "name": "Saint Helena", "code": "SH" },
  { "name": "Saint Kitts and Nevis", "code": "KN" },
  { "name": "Saint Lucia", "code": "LC" },
  { "name": "Saint Pierre and Miquelon", "code": "PM" },
  { "name": "Saint Vincent and the Grenadines", "code": "VC" },
  { "name": "Samoa", "code": "WS" },
  { "name": "San Marino", "code": "SM" },
  { "name": "Sao Tome and Principe", "code": "ST" },
  { "name": "Saudi Arabia", "code": "SA" },
  { "name": "Senegal", "code": "SN" },
  { "name": "Serbia", "code": "RS" },
  { "name": "Seychelles", "code": "SC" },
  { "name": "Sierra Leone", "code": "SL" },
  { "name": "Singapore", "code": "SG" },
  { "name": "Slovakia", "code": "SK" },
  { "name": "Slovenia", "code": "SI" },
  { "name": "Solomon Islands", "code": "SB" },
  { "name": "Somalia", "code": "SO" },
  { "name": "South Africa", "code": "ZA" },
  { "name": "South Georgia and the South Sandwich Islands", "code": "GS" },
  { "name": "Spain", "code": "ES" },
  { "name": "Sri Lanka", "code": "LK" },
  { "name": "Sudan", "code": "SD" },
  { "name": "Suriname", "code": "SR" },
  { "name": "Svalbard and Jan Mayen", "code": "SJ" },
  { "name": "Swaziland", "code": "SZ" },
  { "name": "Sweden", "code": "SE" },
  { "name": "Switzerland", "code": "CH" },
  { "name": "Syrian Arab Republic", "code": "SY" },
  { "name": "Taiwan, Province of China", "code": "TW" },
  { "name": "Tajikistan", "code": "TJ" },
  { "name": "Tanzania, United Republic of", "code": "TZ" },
  { "name": "Thailand", "code": "TH" },
  { "name": "Timor-Leste", "code": "TL" },
  { "name": "Togo", "code": "TG" },
  { "name": "Tokelau", "code": "TK" },
  { "name": "Tonga", "code": "TO" },
  { "name": "Trinidad and Tobago", "code": "TT" },
  { "name": "Tunisia", "code": "TN" },
  { "name": "Turkey", "code": "TR" },
  { "name": "Turkmenistan", "code": "TM" },
  { "name": "Turks and Caicos Islands", "code": "TC" },
  { "name": "Tuvalu", "code": "TV" },
  { "name": "Uganda", "code": "UG" },
  { "name": "Ukraine", "code": "UA" },
  { "name": "United Arab Emirates", "code": "AE" },
  { "name": "United Kingdom", "code": "GB" },
  { "name": "United States", "code": "US" },
  { "name": "United States Minor Outlying Islands", "code": "UM" },
  { "name": "Uruguay", "code": "UY" },
  { "name": "Uzbekistan", "code": "UZ" },
  { "name": "Vanuatu", "code": "VU" },
  { "name": "Venezuela", "code": "VE" },
  { "name": "Viet Nam", "code": "VN" },
  { "name": "Virgin Islands, British", "code": "VG" },
  { "name": "Virgin Islands, U.S.", "code": "VI" },
  { "name": "Wallis and Futuna", "code": "WF" },
  { "name": "Western Sahara", "code": "EH" },
  { "name": "Yemen", "code": "YE" },
  { "name": "Zambia", "code": "ZM" },
  { "name": "Zimbabwe", "code": "ZW" }
]

export const unBrackableDosageForms = ['ER TABLET', 'ER CAPSULE', 'SR TABLET', 'CAPSULE', 'DRY POWDER CAPSULE']


export const NPDrugApprovalStatus = {
  Pending: "Pending",
  Director: "Director Approve",
  CP: "CP Approve",
  SCO: "SCO Approve",
  AD_MSD: "AD_MSD Approve",
  D_MSD: "D_MSD Approve",
  DDG_MSD: "DDG_MSD Approve",
  DDHS: "DDHS Approve",
  Secretary: "Secretary Approve",
}

export const NPDrugApprovalStatus2 = [
  { label: "Pending" },
  { label: "Director Approve" },
  { label: "CP Approve" },
  { label: "SCO Approve" },
  { label: "AD_MSD Approve" },
  { label: "D_MSD Approve" },
  { label: "DDG_MSD Approve" },
  { label: "DDHS Approve" },
  { label: "Secretary Approve" },
]
export const vehicle_mid_no = [
  // { value: 'Southern', label: 'Southern' },
  { label: 'Blank', value: " " },
  { label: '-', value: "-" },
  { label: 'ශ්‍රී', value: "ශ්‍රී" }
]

export const sco_decision = [
  { label: 'Sample OK', value: "Sample OK" },
  { label: 'Sample Not Tally', value: "Sample Not Tally" },
]

export const status_grn = [
  { label: 'Completed', value: "COMPLETED" },
  { label: 'Partially Completed', value: "PARTIALLY COMPLETED" },
  { label: 'Rejected', value: "REJECTED" },
  { label: 'Approval Completed', value: "APPROVED COMPLETED" },
  { label: 'Cancelled', value: "CANCELLED" },
  { label: 'Approval Partially Completed', value: "APPROVED PARTIALLY COMPLETED" },
  { label: 'Pending', value: "Pending" },
]

export const type_grn = [
  { label: 'Donation GRN', value: "Donation GRN" },
  { label: 'Consignment GRN', value: "Consignment GRN" },
]

export const name_patient_type = [
  { label: 'Name patient Non-cancer', value: "B" },
  { label: 'Name patient Cancer', value: "O" },
]
export const commitee_qa = [
  { label: 'SAFRESE' },
  { label: 'MDEC' },
  { label: 'NEC' },
  { label: 'Recall Managment Commitee' },
  { label: 'CEO - NMRA' },

]
export const nmra_final_decision = [
  { label: 'To Withhold the above Batch as a preliminary precaution' },
  { label: 'To Withhold the above Batches as a preliminary precaution' },
  { label: 'To Withhold the above Product as a preliminary precaution' },
  { label: 'To Withdraw the above Batch' },
  { label: 'To Withdraw the above Batches' },
  { label: 'To Withdraw the above Product' },
  { label: 'Discontinue to use the containers which show the defect' },
  { label: 'Revoke batch' },
  { label: 'Revoke batches' },
  { label: 'Revoke product' },
  { label: 'Sample Satisfied' },
  { label: 'Temporary Withhold' },
]

export const qa_status = [
  { label: 'Approved by Chief Pharmacist' },
  { label: 'Action Taken' },
  { label: 'To Withhold the above Batches as a preliminary' },
  { label: 'precaution' },
  { label: 'Pending' },
  { label: 'Submitted' },
  { label: 'To Withhold the above Batch as a preliminary precaution' },
  { label: 'To Withhold the above Batches as a preliminary precaution' },
  { label: 'To Withhold the above Product as a preliminary precaution' },
  { label: 'To Withdraw the above Batch' },
  { label: 'To Withdraw the above Batches' },
  { label: 'To Withdraw the above Product' },
  { label: 'Discontinue to use the containers which show the defect' },
  { label: 'Revoke batch' },
  { label: 'Revoke batches' },
  { label: 'Revoke product' },
  { label: 'Sample Satisfied' },
  { label: 'Temporary Withhold' },
]

export const qa_nmqal_status = [
  { label: 'Circular Generated' },
  { label: 'NMRA Final Decision Approval' },
  { label: 'Pending Approval' },
  { label: 'NMRA Approved' },
  { label: 'Recommendation Approved' },

]

export const qa_nmqal_pharma_status = [
  { label: 'Submitted' },
  { label: 'Recieved' },
  { label: 'Sample Rejected' },
  { label: 'Not Analysed' },
  { label: 'Satisfied' },
  { label: 'Unsatisfied' },

]

export const reason_for_sending = [// {label: 'To  Withhold the above Batch as a  preliminary precaution'},
  { label: 'Local Agent' },
  { label: 'Manufacturer' },
  { label: 'NMQL' },
  { label: 'SPC' },
  { label: 'MSD' },
  { label: 'F&DI' },
  { label: 'GMP' },
  { label: 'Complaint' },
  { label: 'Survilance' },
  { label: '(Pvt/Govt)' },
]
export const institute_type = [
  { label: 'MSD' },
  { label: 'My Institute' },
  { label: 'Other Institute' },
]

export const all_currencies = [
  { "cc": "AED", "symbol": "\u062f.\u0625;", "name": "UAE dirham" },
  { "cc": "AFN", "symbol": "Afs", "name": "Afghan afghani" },
  { "cc": "ALL", "symbol": "L", "name": "Albanian lek" },
  { "cc": "AMD", "symbol": "AMD", "name": "Armenian dram" },
  { "cc": "ANG", "symbol": "NA\u0192", "name": "Netherlands Antillean gulden" },
  { "cc": "AOA", "symbol": "Kz", "name": "Angolan kwanza" },
  { "cc": "ARS", "symbol": "$", "name": "Argentine peso" },
  { "cc": "AUD", "symbol": "$", "name": "Australian Dollar" },
  { "cc": "AWG", "symbol": "\u0192", "name": "Aruban florin" },
  { "cc": "AZN", "symbol": "AZN", "name": "Azerbaijani manat" },
  { "cc": "BAM", "symbol": "KM", "name": "Bosnia and Herzegovina konvertibilna marka" },
  { "cc": "BBD", "symbol": "Bds$", "name": "Barbadian Dollar" },
  { "cc": "BDT", "symbol": "\u09f3", "name": "Bangladeshi taka" },
  { "cc": "BGN", "symbol": "BGN", "name": "Bulgarian lev" },
  { "cc": "BHD", "symbol": ".\u062f.\u0628", "name": "Bahraini dinar" },
  { "cc": "BIF", "symbol": "FBu", "name": "Burundi franc" },
  { "cc": "BMD", "symbol": "BD$", "name": "Bermudian Dollar" },
  { "cc": "BND", "symbol": "B$", "name": "Brunei Dollar" },
  { "cc": "BOB", "symbol": "Bs.", "name": "Bolivian boliviano" },
  { "cc": "BRL", "symbol": "R$", "name": "Brazilian real" },
  { "cc": "BSD", "symbol": "B$", "name": "Bahamian Dollar" },
  { "cc": "BTN", "symbol": "Nu.", "name": "Bhutanese ngultrum" },
  { "cc": "BWP", "symbol": "P", "name": "Botswana pula" },
  { "cc": "BYR", "symbol": "Br", "name": "Belarusian ruble" },
  { "cc": "BZD", "symbol": "BZ$", "name": "Belize Dollar" },
  { "cc": "CAD", "symbol": "$", "name": "Canadian Dollar" },
  { "cc": "CDF", "symbol": "F", "name": "Congolese franc" },
  { "cc": "CHF", "symbol": "Fr.", "name": "Swiss franc" },
  { "cc": "CLP", "symbol": "$", "name": "Chilean peso" },
  { "cc": "CNY", "symbol": "\u00a5", "name": "Chinese/Yuan renminbi" },
  { "cc": "COP", "symbol": "Col$", "name": "Colombian peso" },
  { "cc": "CRC", "symbol": "\u20a1", "name": "Costa Rican colon" },
  { "cc": "CUC", "symbol": "$", "name": "Cuban peso" },
  { "cc": "CVE", "symbol": "Esc", "name": "Cape Verdean escudo" },
  { "cc": "CZK", "symbol": "K\u010d", "name": "Czech koruna" },
  { "cc": "DJF", "symbol": "Fdj", "name": "Djiboutian franc" },
  { "cc": "DKK", "symbol": "Kr", "name": "Danish krone" },
  { "cc": "DOP", "symbol": "RD$", "name": "Dominican peso" },
  { "cc": "DZD", "symbol": "\u062f.\u062c", "name": "Algerian dinar" },
  { "cc": "EEK", "symbol": "KR", "name": "Estonian kroon" },
  { "cc": "EGP", "symbol": "\u00a3", "name": "Egyptian Pound" },
  { "cc": "ERN", "symbol": "Nfa", "name": "Eritrean nakfa" },
  { "cc": "ETB", "symbol": "Br", "name": "Ethiopian birr" },
  { "cc": "EUR", "symbol": "\u20ac", "name": "European Euro" },
  { "cc": "FJD", "symbol": "FJ$", "name": "Fijian Dollar" },
  { "cc": "FKP", "symbol": "\u00a3", "name": "Falkland Islands Pound" },
  { "cc": "GBP", "symbol": "\u00a3", "name": "British Pound" },
  { "cc": "GEL", "symbol": "GEL", "name": "Georgian lari" },
  { "cc": "GHS", "symbol": "GH\u20b5", "name": "Ghanaian cedi" },
  { "cc": "GIP", "symbol": "\u00a3", "name": "Gibraltar Pound" },
  { "cc": "GMD", "symbol": "D", "name": "Gambian dalasi" },
  { "cc": "GNF", "symbol": "FG", "name": "Guinean franc" },
  { "cc": "GQE", "symbol": "CFA", "name": "Central African CFA franc" },
  { "cc": "GTQ", "symbol": "Q", "name": "Guatemalan quetzal" },
  { "cc": "GYD", "symbol": "GY$", "name": "Guyanese Dollar" },
  { "cc": "HKD", "symbol": "HK$", "name": "Hong Kong Dollar" },
  { "cc": "HNL", "symbol": "L", "name": "Honduran lempira" },
  { "cc": "HRK", "symbol": "kn", "name": "Croatian kuna" },
  { "cc": "HTG", "symbol": "G", "name": "Haitian gourde" },
  { "cc": "HUF", "symbol": "Ft", "name": "Hungarian forint" },
  { "cc": "IDR", "symbol": "Rp", "name": "Indonesian rupiah" },
  { "cc": "ILS", "symbol": "\u20aa", "name": "Israeli new sheqel" },
  { "cc": "INR", "symbol": "\u20B9", "name": "Indian rupee" },
  { "cc": "IQD", "symbol": "\u062f.\u0639", "name": "Iraqi dinar" },
  { "cc": "IRR", "symbol": "IRR", "name": "Iranian rial" },
  { "cc": "ISK", "symbol": "kr", "name": "Icelandic kr\u00f3na" },
  { "cc": "JMD", "symbol": "J$", "name": "Jamaican Dollar" },
  { "cc": "JOD", "symbol": "JOD", "name": "Jordanian dinar" },
  { "cc": "JPY", "symbol": "\u00a5", "name": "Japanese yen" },
  { "cc": "KES", "symbol": "KSh", "name": "Kenyan shilling" },
  { "cc": "KGS", "symbol": "\u0441\u043e\u043c", "name": "Kyrgyzstani som" },
  { "cc": "KHR", "symbol": "\u17db", "name": "Cambodian riel" },
  { "cc": "KMF", "symbol": "KMF", "name": "Comorian franc" },
  { "cc": "KPW", "symbol": "W", "name": "North Korean won" },
  { "cc": "KRW", "symbol": "W", "name": "South Korean won" },
  { "cc": "KWD", "symbol": "KWD", "name": "Kuwaiti dinar" },
  { "cc": "KYD", "symbol": "KY$", "name": "Cayman Islands Dollar" },
  { "cc": "KZT", "symbol": "T", "name": "Kazakhstani tenge" },
  { "cc": "LAK", "symbol": "KN", "name": "Lao kip" },
  { "cc": "LBP", "symbol": "\u00a3", "name": "Lebanese lira" },
  { "cc": "LKR", "symbol": "Rs", "name": "Sri Lankan rupee" },
  { "cc": "LRD", "symbol": "L$", "name": "Liberian Dollar" },
  { "cc": "LSL", "symbol": "M", "name": "Lesotho loti" },
  { "cc": "LTL", "symbol": "Lt", "name": "Lithuanian litas" },
  { "cc": "LVL", "symbol": "Ls", "name": "Latvian lats" },
  { "cc": "LYD", "symbol": "LD", "name": "Libyan dinar" },
  { "cc": "MAD", "symbol": "MAD", "name": "Moroccan dirham" },
  { "cc": "MDL", "symbol": "MDL", "name": "Moldovan leu" },
  { "cc": "MGA", "symbol": "FMG", "name": "Malagasy ariary" },
  { "cc": "MKD", "symbol": "MKD", "name": "Macedonian denar" },
  { "cc": "MMK", "symbol": "K", "name": "Myanma kyat" },
  { "cc": "MNT", "symbol": "\u20ae", "name": "Mongolian tugrik" },
  { "cc": "MOP", "symbol": "P", "name": "Macanese pataca" },
  { "cc": "MRO", "symbol": "UM", "name": "Mauritanian ouguiya" },
  { "cc": "MUR", "symbol": "Rs", "name": "Mauritian rupee" },
  { "cc": "MVR", "symbol": "Rf", "name": "Maldivian rufiyaa" },
  { "cc": "MWK", "symbol": "MK", "name": "Malawian kwacha" },
  { "cc": "MXN", "symbol": "$", "name": "Mexican peso" },
  { "cc": "MYR", "symbol": "RM", "name": "Malaysian ringgit" },
  { "cc": "MZM", "symbol": "MTn", "name": "Mozambican metical" },
  { "cc": "NAD", "symbol": "N$", "name": "Namibian Dollar" },
  { "cc": "NGN", "symbol": "\u20a6", "name": "Nigerian naira" },
  { "cc": "NIO", "symbol": "C$", "name": "Nicaraguan c\u00f3rdoba" },
  { "cc": "NOK", "symbol": "kr", "name": "Norwegian krone" },
  { "cc": "NPR", "symbol": "NRs", "name": "Nepalese rupee" },
  { "cc": "NZD", "symbol": "NZ$", "name": "New Zealand Dollar" },
  { "cc": "OMR", "symbol": "OMR", "name": "Omani rial" },
  { "cc": "PAB", "symbol": "B./", "name": "Panamanian balboa" },
  { "cc": "PEN", "symbol": "S/.", "name": "Peruvian nuevo sol" },
  { "cc": "PGK", "symbol": "K", "name": "Papua New Guinean kina" },
  { "cc": "PHP", "symbol": "\u20b1", "name": "Philippine peso" },
  { "cc": "PKR", "symbol": "Rs.", "name": "Pakistani rupee" },
  { "cc": "PLN", "symbol": "z\u0142", "name": "Polish zloty" },
  { "cc": "PYG", "symbol": "\u20b2", "name": "Paraguayan guarani" },
  { "cc": "QAR", "symbol": "QR", "name": "Qatari riyal" },
  { "cc": "RON", "symbol": "L", "name": "Romanian leu" },
  { "cc": "RSD", "symbol": "din.", "name": "Serbian dinar" },
  { "cc": "RUB", "symbol": "R", "name": "Russian ruble" },
  { "cc": "SAR", "symbol": "SR", "name": "Saudi riyal" },
  { "cc": "SBD", "symbol": "SI$", "name": "Solomon Islands Dollar" },
  { "cc": "SCR", "symbol": "SR", "name": "Seychellois rupee" },
  { "cc": "SDG", "symbol": "SDG", "name": "Sudanese Pound" },
  { "cc": "SEK", "symbol": "kr", "name": "Swedish krona" },
  { "cc": "SGD", "symbol": "S$", "name": "Singapore Dollar" },
  { "cc": "SHP", "symbol": "\u00a3", "name": "Saint Helena Pound" },
  { "cc": "SLL", "symbol": "Le", "name": "Sierra Leonean leone" },
  { "cc": "SOS", "symbol": "Sh.", "name": "Somali shilling" },
  { "cc": "SRD", "symbol": "$", "name": "Surinamese Dollar" },
  { "cc": "SYP", "symbol": "LS", "name": "Syrian Pound" },
  { "cc": "SZL", "symbol": "E", "name": "Swazi lilangeni" },
  { "cc": "THB", "symbol": "\u0e3f", "name": "Thai baht" },
  { "cc": "TJS", "symbol": "TJS", "name": "Tajikistani somoni" },
  { "cc": "TMT", "symbol": "m", "name": "Turkmen manat" },
  { "cc": "TND", "symbol": "DT", "name": "Tunisian dinar" },
  { "cc": "TRY", "symbol": "TRY", "name": "Turkish new lira" },
  { "cc": "TTD", "symbol": "TT$", "name": "Trinidad and Tobago Dollar" },
  { "cc": "TWD", "symbol": "NT$", "name": "New Taiwan Dollar" },
  { "cc": "TZS", "symbol": "TZS", "name": "Tanzanian shilling" },
  { "cc": "UAH", "symbol": "UAH", "name": "Ukrainian hryvnia" },
  { "cc": "UGX", "symbol": "USh", "name": "Ugandan shilling" },
  { "cc": "USD", "symbol": "US$", "name": "United States Dollar" },
  { "cc": "UYU", "symbol": "$U", "name": "Uruguayan peso" },
  { "cc": "UZS", "symbol": "UZS", "name": "Uzbekistani som" },
  { "cc": "VEB", "symbol": "Bs", "name": "Venezuelan bolivar" },
  { "cc": "VND", "symbol": "\u20ab", "name": "Vietnamese dong" },
  { "cc": "VUV", "symbol": "VT", "name": "Vanuatu vatu" },
  { "cc": "WST", "symbol": "WS$", "name": "Samoan tala" },
  { "cc": "XAF", "symbol": "CFA", "name": "Central African CFA franc" },
  { "cc": "XCD", "symbol": "EC$", "name": "East Caribbean Dollar" },
  { "cc": "XDR", "symbol": "SDR", "name": "Special Drawing Rights" },
  { "cc": "XOF", "symbol": "CFA", "name": "West African CFA franc" },
  { "cc": "XPF", "symbol": "F", "name": "CFP franc" },
  { "cc": "YER", "symbol": "YER", "name": "Yemeni rial" },
  { "cc": "ZAR", "symbol": "R", "name": "South African rand" },
  { "cc": "ZMK", "symbol": "ZK", "name": "Zambian kwacha" },
  { "cc": "ZWR", "symbol": "Z$", "name": "Zimbabwean Dollar" }
]


//   create for transfer type (create transfre)
export const transfer_types = [
  { label: 'Clinic', value: 'Clinic' },
  { label: 'Unit', value: 'Unit' },
  { label: 'Ward', value: 'Ward' },
  { label: 'Pharmacy', value: 'pharmacy' },
  { label: 'Drug Store', value: 'drug_store' },
  // { label: 'Other Store', value: 'Other Store' },
]

export const po_type = [{ label: 'F' }, { label: 'L' }]
export const po_status = [{ label: 'Pending Approval' }, { label: 'SUPERVISOR APPROVED' }, { label: 'SPC APPROVED' }, { label: 'CANCELED' }, { label: 'SUPERVISOR REJECTED' }, { label: 'REJECTED' }, { label: 'AMENDED' }]


export const inco_terms = [
  { label: 'FOB' },
  { label: 'C&F' },
  { label: 'CIF' },
  { label: 'L' },
]

export const payment_term = [
  { label: 'AD', name: 'Advance Payment' },
  { label: 'C', name: 'Combined LC 120 days' },
  { label: 'C100', name: 'DH Delft' },
  { label: 'C120', name: 'DH Manipay' },
  { label: 'C18', name: 'Combined LC 180 days' },
  { label: 'C180', name: 'DH Karainagar' },
  { label: 'C30', name: 'Confirm/Combine LC 30 days' },
  { label: 'C45', name: 'Confirm/Combine LC 45 days' },
  { label: 'C60', name: 'Confirm/Combine LC 60 days' },
  { label: 'C90', name: 'Confirm/Combine LC 90 days' },
  { label: 'CAD', name: 'Cash AgainstDocument' },
  { label: 'CC30', name: 'Combined LC 30 days' },
  { label: 'CC45', name: 'Combined LC 45days' },
  { label: 'CC60', name: 'Combined LC 60 days' },
  { label: 'CC90', name: 'Combined LC 90 days' },
  { label: 'CCLC', name: 'Confirm/Combine LC at sight' },
  { label: 'CLC', name: 'Combined L/C' },
  { label: 'CLCS', name: 'Combined LC at sight' },
  { label: 'CO12', name: 'Confirmed LC 120 days' },
  { label: 'CO30', name: 'Confirmed LC 30 days' },
  { label: 'CO60', name: 'Confirmed LC 60 days' },
  { label: 'CO90', name: 'Confirmed LC 90 days' },
  { label: 'COLC', name: 'Confirmed LC at sight' },
  { label: 'CR30', name: 'Credit 30 Days' },
  { label: 'CR45', name: 'Credit 45 Days' },
  { label: 'CR60', name: 'Credit 60 Days' },
  { label: 'CR90', name: 'Credit 90 Days' },
  { label: 'DP', name: 'DP' },
  { label: 'HD', name: '100% on 90 days' },
  { label: 'L120', name: 'L/C 120 Days Credit' },
  { label: 'LC', name: 'Combined LC 100% sight' },
  { label: 'LC18', name: 'L/C 180Days Credit' },
  { label: 'LC30', name: 'L/C 30 Days Credit' },
  { label: 'LC45', name: 'L/C 45 Days Credit' },
  { label: 'LC60', name: 'L/C 60 Days Credit' },
  { label: 'LC90', name: 'L/C 90Days Credit' },
  { label: 'LCS', name: '100% LC at Sight' },
  { label: 'LCST', name: 'L/C at Sight' },
  { label: 'LLC', name: 'Local LC' },
  { label: 'TT', name: 'Telegraphic Transfer' },
]

export const quoted_unit_price = [
  { label: 'FOB' },
  { label: 'C&F' },
  { label: 'CIF' },
  { label: 'L' },
]

export const uom_list = [
  {
    "code": "AMP",
    "description": "Amp"
  },
  {
    "code": "APLI",
    "description": "Aplctr"
  },
  {
    "code": "APP",
    "description": "Appraratus"
  },
  {
    "code": "BAG",
    "description": "Bag"
  },
  {
    "code": "BEAD",
    "description": "Beads"
  },
  {
    "code": "BLIS",
    "description": "Blister"
  },
  {
    "code": "BOT",
    "description": "Bot"
  },
  {
    "code": "BOX",
    "description": "Box"
  },
  {
    "code": "BRAC",
    "description": "Brckts"
  },
  {
    "code": "CAN",
    "description": "Can"
  },
  {
    "code": "CAP",
    "description": "Cap"
  },
  {
    "code": "CARD",
    "description": "Card"
  },
  {
    "code": "CART",
    "description": "Cartrg"
  },
  {
    "code": "CM",
    "description": "cm"
  },
  {
    "code": "COIL",
    "description": "Coil"
  },
  {
    "code": "CTN",
    "description": "Cartoon"
  },
  {
    "code": "CYL",
    "description": "Cyl"
  },
  {
    "code": "DEV",
    "description": "Device"
  },
  {
    "code": "DISC",
    "description": "Disc"
  },
  {
    "code": "DOSE",
    "description": "Dose"
  },
  {
    "code": "DROP",
    "description": "drop"
  },
  {
    "code": "EACH",
    "description": "Each"
  },
  {
    "code": "EXT",
    "description": "Extractions"
  },
  {
    "code": "FILM",
    "description": "Film"
  },
  {
    "code": "G",
    "description": "g"
  },
  {
    "code": "GAL",
    "description": "Gallon"
  },
  {
    "code": "IMPL",
    "description": "Implnt"
  },
  {
    "code": "INHA",
    "description": "Inhal"
  },
  {
    "code": "ISO",
    "description": "Isolatious (10Ml/WB each)"
  },
  {
    "code": "IU",
    "description": "IU"
  },
  {
    "code": "JAR",
    "description": "Jar"
  },
  {
    "code": "KG",
    "description": "kg"
  },
  {
    "code": "KIT",
    "description": "Kit"
  },
  {
    "code": "L",
    "description": "L"
  },
  {
    "code": "LEN",
    "description": "length"
  },
  {
    "code": "LOZ",
    "description": "Lozen"
  },
  {
    "code": "M",
    "description": "m"
  },
  {
    "code": "MCG",
    "description": "microg"
  },
  {
    "code": "MG",
    "description": "mg"
  },
  {
    "code": "ML",
    "description": "ml"
  },
  {
    "code": "NDL",
    "description": "Ndl"
  },
  {
    "code": "NMOL",
    "description": "n.mol"
  },
  {
    "code": "NOS",
    "description": "Nos."
  },
  {
    "code": "PACK",
    "description": "Pack"
  },
  {
    "code": "PAD",
    "description": "Pad"
  },
  {
    "code": "PAIR",
    "description": "Pair"
  },
  {
    "code": "PCK1",
    "description": "Pack1"
  },
  {
    "code": "PCK2",
    "description": "Pack2"
  },
  {
    "code": "PCK3",
    "description": "Pack3"
  },
  {
    "code": "PCK4",
    "description": "Pack4"
  },
  {
    "code": "PESS",
    "description": "Pessa"
  },
  {
    "code": "PFSY",
    "description": "PF.Syr"
  },
  {
    "code": "PIES",
    "description": "Piece"
  },
  {
    "code": "PKT",
    "description": "Packet"
  },
  {
    "code": "PLAT",
    "description": "Plate"
  },
  {
    "code": "PLT",
    "description": "Plt"
  },
  {
    "code": "PMOL",
    "description": "p.mol"
  },
  {
    "code": "PTCH",
    "description": "Patch"
  },
  {
    "code": "REAC",
    "description": "Reaction"
  },
  {
    "code": "REEL",
    "description": "Reel"
  },
  {
    "code": "RESP",
    "description": "Resp"
  },
  {
    "code": "ROLL",
    "description": "Roll"
  },
  {
    "code": "SACH",
    "description": "Sachet"
  },
  {
    "code": "SET",
    "description": "Set"
  },
  {
    "code": "SHET",
    "description": "Sheet"
  },
  {
    "code": "SPRY",
    "description": "Spray"
  },
  {
    "code": "STIK",
    "description": "Stick"
  },
  {
    "code": "STRP",
    "description": "Strip"
  },
  {
    "code": "SUPP",
    "description": "Supp"
  },
  {
    "code": "TAB",
    "description": "Tab"
  },
  {
    "code": "TEST",
    "description": "Test"
  },
  {
    "code": "TIN",
    "description": "Tin"
  },
  {
    "code": "TSET",
    "description": "sd"
  },
  {
    "code": "TUBE",
    "description": "Tube"
  },
  {
    "code": "UG",
    "description": "ug"
  },
  {
    "code": "UL",
    "description": "ul"
  },
  {
    "code": "UMOL",
    "description": "u.mol"
  },
  {
    "code": "UNIT",
    "description": "Unit"
  },
  {
    "code": "VIAL",
    "description": "Vial"
  }
]

//donation SR status
export const donationSR_status = [
  { label: 'Pending', value: 'SR Requested' },
  { label: 'Approved', value: 'SR Submitted' },

]


//Short Expiary
export const short_Expiary = [
  { label: 'Less Than 2 Week', value: 'LESS THAN 2 WEEK' },
  { label: 'Less Than 1 Month', value: 'LESS THAN 1 MONTH' },
  { label: 'Less Than 2 Month', value: 'LESS THAN 2 MONTH' },
  { label: 'Less Than 3 Month', value: 'LESS THAN 3 MONTH' },
  { label: 'Less Than 6 Month', value: 'LESS THAN 6 MONTH' },
  { label: 'Less Than 1 Year', value: 'LESS THAN 1 YEAR' },

]


export const allDistrict = [
  { value: 'AMPARA', label: 'AMPARA', province: 'EASTERN' },
  { value: 'ANURADHAPURA', label: 'ANURADHAPURA', province: 'NORTH CENTRAL' },
  { value: 'BADULLA', label: 'BADULLA', province: 'UVA' },
  { value: 'BATTICALOA', label: 'BATTICALOA', province: 'EASTERN' },
  { value: 'COLOMBO', label: 'COLOMBO', province: 'WESTERN' },
  { value: 'GALLE', label: 'GALLE', province: 'SOUTHERN' },
  { value: 'GAMPAHA', label: 'GAMPAHA', province: 'WESTERN' },
  { value: 'HAMBANTOTA', label: 'HAMBANTOTA', province: 'SOUTHERN' },
  { value: 'JAFFNA', label: 'JAFFNA', province: 'NORTHERN' },
  { value: 'KALUTARA', label: 'KALUTARA', province: 'WESTERN' },
  { value: 'KANDY', label: 'KANDY', province: 'CENTRAL' },
  { value: 'KEGALLE', label: 'KEGALLE', province: 'SABARAGAMUWA' },
  { value: 'KILINOCHCHI', label: 'KILINOCHCHI', province: 'NORTHERN' },
  { value: 'KURUNEGALA', label: 'KURUNEGALA', province: 'NORTH WESTERN' },
  { value: 'MANNAR', label: 'MANNAR', province: 'NORTHERN' },
  { value: 'MATALE', label: 'MATALE', province: 'CENTRAL' },
  { value: 'MATARA', label: 'MATARA', province: 'SOUTHERN' },
  { value: 'MONARAGALA', label: 'MONARAGALA', province: 'UVA' },
  { value: 'MULLAITIVU', label: 'MULLAITIVU', province: 'NORTHERN' },
  { value: 'NUWARA ELIYA', label: 'NUWARA ELIYA', province: 'CENTRAL' },
  { value: 'POLONNARUWA', label: 'POLONNARUWA', province: 'NORTH CENTRAL' },
  { value: 'PUTTALAM', label: 'PUTTALAM', province: 'NORTH WESTERN' },
  { value: 'RATNAPURA', label: 'RATNAPURA', province: 'SABARAGAMUWA' },
  { value: 'TRINCOMALEE', label: 'TRINCOMALEE', province: 'EASTERN' },
  { value: 'VAVUNIYA', label: 'VAVUNIYA', province: 'NORTHERN' },
]

export const allProvince = [
  { value: 'SOUTHERN', label: 'SOUTHERN' },
  { value: 'WESTERN', label: 'WESTERN' },
  { value: 'CENTRAL', label: 'CENTRAL' },
  { value: 'UVA', label: 'UVA' },
  { value: 'SABARAGAMUWA', label: 'SABARAGAMUWA' },
  { value: 'NORTH WESTERN', label: 'NORTH WESTERN' },
  { value: 'NORTH CENTRAL', label: 'NORTH CENTRAL' },
  { value: 'NORTHERN', label: 'NORTHERN' },
  { value: 'EASTERN', label: 'EASTERN' },
]

export const countryOfOrigin = [
  { "code": "AD", "description": "Andorra" },
  { "code": "AE", "description": "United Arab Emirates" },
  { "code": "AF", "description": "Afghanistan" },
  { "code": "AI", "description": "Anguilla" },
  { "code": "AL", "description": "Albania" },
  { "code": "AM", "description": "Armenia" },
  { "code": "AN", "description": "Antilles, Netherlands" },
  { "code": "AO", "description": "Angola" },
  { "code": "AQ", "description": "Antarctica" },
  { "code": "AR", "description": "Argentina" },
  { "code": "AS", "description": "American Samoa" },
  { "code": "AT", "description": "Austria" },
  { "code": "AU", "description": "Australia" },
  { "code": "AW", "description": "Aruba" },
  { "code": "AZ", "description": "Azerbaijan" },
  { "code": "BA", "description": "Bosnia and Herzegovina" },
  { "code": "BB", "description": "Barbados" },
  { "code": "BD", "description": "Bangladesh" },
  { "code": "BE", "description": "Belgium" },
  { "code": "BF", "description": "Burkina Faso" },
  { "code": "BG", "description": "Bulgaria" },
  { "code": "BH", "description": "Bahrain" },
  { "code": "BI", "description": "Burundi" },
  { "code": "BJ", "description": "Benin" },
  { "code": "BL", "description": "Saint Barthelemy (FR)" },
  { "code": "BM", "description": "Bermuda" },
  { "code": "BN", "description": "Brunei Darussalam" },
  { "code": "BO", "description": "Bolivia" },
  { "code": "BR", "description": "Brazil" },
  { "code": "BS", "description": "Bahamas, The" },
  { "code": "BT", "description": "Bhutan" },
  { "code": "BV", "description": "Bouvet Island" },
  { "code": "BW", "description": "Botswana" },
  { "code": "BY", "description": "Belarus" },
  { "code": "BZ", "description": "Belize" },
  { "code": "CA", "description": "Canada" },
  { "code": "CC", "description": "Cocos (Keeling) Islands" },
  { "code": "CD", "description": "Congo, Dem. Rep. of the" },
  { "code": "CF", "description": "Central African Republic" },
  { "code": "CG", "description": "Congo" },
  { "code": "CH", "description": "Switzerland" },
  { "code": "CI", "description": "Cote D'Ivoire" },
  { "code": "CK", "description": "Cook Islands" },
  { "code": "CL", "description": "Chile" },
  { "code": "CM", "description": "Cameroon" },
  { "code": "CN", "description": "China" },
  { "code": "CO", "description": "Colombia" },
  { "code": "CR", "description": "Costa Rica" },
  { "code": "CS", "description": "Montenegro" },
  { "code": "CU", "description": "Cuba" },
  { "code": "CV", "description": "Cape Verde" },
  { "code": "CX", "description": "Christmas Island" },
  { "code": "CY", "description": "Cyprus" },
  { "code": "CZ", "description": "Czech Republic" },
  { "code": "DE", "description": "Germany" },
  { "code": "DJ", "description": "Djibouti" },
  { "code": "DK", "description": "Denmark" },
  { "code": "DM", "description": "Dominica" },
  { "code": "DO", "description": "Dominican Republic" },
  { "code": "DZ", "description": "Algeria" },
  { "code": "EC", "description": "Ecuador" },
  { "code": "EE", "description": "Estonia" },
  { "code": "EG", "description": "Egypt" },
  { "code": "EH", "description": "Sahara, Western" },
  { "code": "ER", "description": "Eritrea" },
  { "code": "ES", "description": "Spain" },
  { "code": "ET", "description": "Ethiopia" },
  { "code": "EU", "description": "European Union" },
  { "code": "FI", "description": "Finland" },
  { "code": "FJ", "description": "Fiji" },
  { "code": "FK", "description": "Falkland Islands (Malvinas)" },
  { "code": "FM", "description": "Micronesia, Fed. States of" },
  { "code": "FO", "description": "Faroe Islands" },
  { "code": "FR", "description": "France" },
  { "code": "GA", "description": "Gabon" },
  { "code": "GD", "description": "Grenada" },
  { "code": "GE", "description": "Georgia" },
  { "code": "GF", "description": "French Guiana" },
  { "code": "GG", "description": "Guernsey and Alderney" },
  { "code": "GH", "description": "Ghana" },
  { "code": "GI", "description": "Gibraltar" },
  { "code": "GL", "description": "Greenland" },
  { "code": "GM", "description": "Gambia, the" },
  { "code": "GN", "description": "Guinea" },
  { "code": "GP", "description": "Guadeloupe" },
  { "code": "GQ", "description": "Equatorial Guinea" },
  { "code": "GR", "description": "Greece" },
  { "code": "GS", "description": "S.George & S.Sandwich" },
  { "code": "GT", "description": "Guatemala" },
  { "code": "GU", "description": "Guam" },
  { "code": "GW", "description": "Guinea-Bissau" },
  { "code": "GY", "description": "Guyana" },
  { "code": "HK", "description": "Hong Kong, (China)" },
  { "code": "HM", "description": "Heard & McDonald Is.(AU)" },
  { "code": "HN", "description": "Honduras" },
  { "code": "HR", "description": "Croatia" },
  { "code": "HT", "description": "Haiti" },
  { "code": "HU", "description": "Hungary" },
  { "code": "ID", "description": "Indonesia" },
  { "code": "IE", "description": "Ireland" },
  { "code": "IL", "description": "Israel" },
  { "code": "IM", "description": "Man, Isle of" },
  { "code": "IN", "description": "India" },
  { "code": "IO", "description": "British Indian Ocean T." },
  { "code": "IQ", "description": "Iraq" },
  { "code": "IR", "description": "Iran, Islamic Republic of" },
  { "code": "IS", "description": "Iceland" },
  { "code": "IT", "description": "Italy" },
  { "code": "JE", "description": "Jersey" },
  { "code": "JM", "description": "Jamaica" },
  { "code": "JO", "description": "Jordan" },
  { "code": "JP", "description": "Japan" },
  { "code": "KE", "description": "Kenya" },
  { "code": "KG", "description": "Kyrgyzstan" },
  { "code": "KH", "description": "Cambodia" },
  { "code": "KI", "description": "Kiribati" },
  { "code": "KM", "description": "Comoros" },
  { "code": "KN", "description": "Saint Kitts and Nevis" },
  { "code": "KP", "description": "Korea Dem. People's Rep." },
  { "code": "KR", "description": "Korea, (South) Republic of" },
  { "code": "KV", "description": "Kosovo" },
  { "code": "KW", "description": "Kuwait" },
  { "code": "KY", "description": "Cayman Islands" },
  { "code": "KZ", "description": "Kazakhstan" },
  { "code": "LA", "description": "Lao People's Democ. Rep." },
  { "code": "LB", "description": "Lebanon" },
  { "code": "LC", "description": "Saint Lucia" },
  { "code": "LI", "description": "Liechtenstein" },
  { "code": "LR", "description": "Liberia" },
  { "code": "LS", "description": "Lesotho" },
  { "code": "LT", "description": "Lithuania" },
  { "code": "LU", "description": "Luxembourg" },
  { "code": "LV", "description": "Latvia" },
  { "code": "LY", "description": "Libyan Arab Jamahiriya" },
  { "code": "MA", "description": "Morocco" },
  { "code": "MC", "description": "Monaco" },
  { "code": "MD", "description": "Moldova, Republic of" },
  { "code": "MF", "description": "Saint Martin (FR)" },
  { "code": "MG", "description": "Madagascar" },
  { "code": "MH", "description": "Marshall Islands" },
  { "code": "MK", "description": "Macedonia, TFYR" },
  { "code": "MM", "description": "Myanmar (ex-Burma)" },
  { "code": "MN", "description": "Mongolia" },
  { "code": "MO", "description": "Macao, (China)" },
  { "code": "MP", "description": "Northern Mariana Islands" },
  { "code": "MQ", "description": "Martinique (FR)" },
  { "code": "MR", "description": "Mauritania" },
  { "code": "MS", "description": "Montserrat" },
  { "code": "MT", "description": "Malta" },
  { "code": "MU", "description": "Mauritius" },
  { "code": "MV", "description": "Maldives" },
  { "code": "MW", "description": "Malawi" },
  { "code": "MX", "description": "Mexico" },
  { "code": "MY", "description": "Malaysia" },
  { "code": "MZ", "description": "Mozambique" },
  { "code": "NA", "description": "Namibia" },
  { "code": "NC", "description": "New Caledonia" },
  { "code": "NE", "description": "Niger" },
  { "code": "NF", "description": "Norfolk Island" },
  { "code": "NG", "description": "Nigeria" },
  { "code": "NI", "description": "Nicaragua" },
  { "code": "NL", "description": "Netherlands" },
  { "code": "NO", "description": "Norway" },
  { "code": "NP", "description": "Nepal" },
  { "code": "NR", "description": "Nauru" },
  { "code": "NU", "description": "Niue" },
  { "code": "NZ", "description": "New Zealand" },
  { "code": "OM", "description": "Oman" },
  { "code": "PA", "description": "Panama" },
  { "code": "PE", "description": "Peru" },
  { "code": "PF", "description": "French Polynesia" },
  { "code": "PG", "description": "Papua New Guinea" },
  { "code": "PH", "description": "Philippines" },
  { "code": "PK", "description": "Pakistan" },
  { "code": "PL", "description": "Poland" },
  { "code": "PM", "description": "S Pierre & Miquelon(FR)" },
  { "code": "PN", "description": "Pitcairn Island" },
  { "code": "PR", "description": "Puerto Rico" },
  { "code": "PS", "description": "Palestinian Territory" },
  { "code": "PT", "description": "Portugal" },
  { "code": "PW", "description": "Palau" },
  { "code": "PY", "description": "Paraguay" },
  { "code": "QA", "description": "Qatar" },
  { "code": "RE", "description": "Reunion (FR)" },
  { "code": "RO", "description": "Romania" },
  { "code": "RS", "description": "Serbia" },
  { "code": "RU", "description": "Russia (Russian Fed.)" },
  { "code": "RW", "description": "Rwanda" },
  { "code": "SA", "description": "Arabia, Saudi" },
  { "code": "SB", "description": "Solomon Islands" },
  { "code": "SC", "description": "Seychelles" },
  { "code": "SD", "description": "Sudan" },
  { "code": "SE", "description": "Sweden" },
  { "code": "SG", "description": "Singapore" },
  { "code": "SH", "description": "Saint Helena (UK)" },
  { "code": "SI", "description": "Slovenia" },
  { "code": "SJ", "description": "Svalbard & Jan Mayen Is." },
  { "code": "SK", "description": "Slovakia" },
  { "code": "SL", "description": "Sri Lanka" },
  { "code": "SM", "description": "San Marino" },
  { "code": "SN", "description": "Senegal" },
  { "code": "SR", "description": "Suriname" },
  { "code": "SS", "description": "South Sudan" },
  { "code": "ST", "description": "Sao Tome and Principe" },
  { "code": "SV", "description": "El Salvador" },
  { "code": "SY", "description": "Syrian Arab Republic" },
  { "code": "SZ", "description": "Swaziland" },
  { "code": "TC", "description": "Turks and Caicos Is." },
  { "code": "TD", "description": "Chad" },
  { "code": "TF", "description": "French Southern Terr." },
  { "code": "TG", "description": "Togo" },
  { "code": "TH", "description": "Thailand" },
  { "code": "TJ", "description": "Tajikistan" },
  { "code": "TK", "description": "Tokelau" },
  { "code": "TL", "description": "Timor-Leste (East Timor)" },
  { "code": "TM", "description": "Turkmenistan" },
  { "code": "TN", "description": "Tunisia" },
  { "code": "TO", "description": "Tonga" },
  { "code": "TP", "description": "East Timor (Timor-Leste)" },
  { "code": "TR", "description": "Turkey" },
  { "code": "TT", "description": "Trinidad & Tobago" },
  { "code": "TV", "description": "Tuvalu" },
  { "code": "TW", "description": "Taiwan" },
  { "code": "TZ", "description": "Tanzania, United Rep. of" },
  { "code": "UA", "description": "Ukraine" },
  { "code": "UG", "description": "Uganda" },
  { "code": "UK", "description": "United Kingdom" },
  { "code": "UM", "description": "US Minor Outlying Isl." },
  { "code": "US", "description": "United States" },
  { "code": "UY", "description": "Uruguay" },
  { "code": "UZ", "description": "Uzbekistan" },
  { "code": "VA", "description": "Holy See (Vatican)" },
  { "code": "VC", "description": "S Vincent & Grenadines" },
  { "code": "VE", "description": "Venezuela" },
  { "code": "VG", "description": "British Virgin Islands" },
  { "code": "VI", "description": "Virgin Islands, U.S." },
  { "code": "VN", "description": "Viet Nam" },
  { "code": "VU", "description": "Vanuatu" },
  { "code": "WF", "description": "Wallis and Futuna" },
  { "code": "WS", "description": "Samoa" },
  { "code": "YE", "description": "Yemen" },
  { "code": "YT", "description": "Mayotte (FR)" },
  { "code": "ZA", "description": "South Africa" },
  { "code": "ZM", "description": "Zambia" },
  { "code": "ZW", "description": "Zimbabwe" }
]

//Report GRN status
export const GRN_Status = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Deactive', value: 'Deactive' },

]

export const OrderCategory = [
  { label: 'SPC', value: 'SPC' },
  { label: 'ADB', value: 'ADB' },
  { label: 'DON', value: 'DON' },
  { label: 'SPM', value: 'SPM' },
  { label: 'ADB', value: 'ADB' },
  { label: 'WB1', value: 'WB1' },
  { label: 'WB2', value: 'WB2' },
  { label: 'WB3', value: 'WB3' },
  { label: 'WHO', value: 'WHO' },
  { label: 'APD', value: 'APD' },
  { label: 'LP', value: 'LP' },
  { label: 'AIIB', value: 'AIIB' }


]

export const item_type = [
  { label: 'All', value: null },
  { label: 'Consumables', value: 'Y' },
  { label: 'Non Consumables', value: 'N' },

]

export const cheif_reports_ids = [
  {
    "id": "ccd12891-bac1-f640-8b0b-c9f2dcaca667",
    "name": "Non Moving Items",

  },
  {
    "id": "d9199c37-1e76-0bdd-fa2a-d100980786b9",
    "name": "Report for Item Distributions",

  },
  {
    "id": "947ee922-bdee-ec4f-4802-7a33924643c7",
    "name": "Check Stock",

  },
  {
    "id": "8595418a-744c-444c-9859-33af80324f37",
    "name": "Short expiry institute wise",

  },
  {
    "id": "e37144a0-9024-520c-2da5-9601e5035eb5",
    "name": "LP Report",

  },

  {
    "id": "e07331b6-2c42-be60-bdc8-ac45840ca006",
    "name": "estimation",

  },
  {
    "id": "1f5cca64-9748-faa4-bfd7-f205dd940e58",
    "name": "Slow Moving Items for Institute",

  },

]

export const estimations_remarks = [
  'Requested for the first time',
  'New traetment unit opened',
  'Epidemic',
  'Low no. of Prescribing',
  'High no. of Prescribing',
  'Substitute for same item diff.strength',
  'Epidemic',
  'New consultant appointed',
  'Other'
]

export const General_Status = [
  { label: 'Pending', value: 'Pending' },
  { label: 'APPROVED', value: 'APPROVED' },
  { label: 'REJECTED', value: 'REJECTED' },
  { label: 'REJECT', value: 'REJECT' },
  { label: 'CANCELLED', value: 'CANCELLED' },

]

export const Consignment_Status = [
  { label: 'New', value: 'New' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Pending', value: 'Pending' },
  { label: 'APPROVED', value: 'APPROVED' },
  { label: 'REJECTED', value: 'REJECTED' },
  { label: 'REJECT', value: 'REJECT' },
  { label: 'CANCELLED', value: 'CANCELLED' },
  { label: 'RESUBMITTED', value: 'RESUBMITTED' },

]

export const Volumn_Units = [
  'm3', 'cm3', 'mm3'
]

export const common_status_of_items = [
  'Tender calling and Bid document approval requested',
  'Procurement time schedule issued',
  'Tender Invited',
  'Tender closed',
  'Offers scheduled',
  'Submitted to TEC',
  'Evaluation completed and forwarded to Procurement unit',
  'Tec completed and sent file to imports',
  'Submit PC submission to procurement unit',
  'Tender awarded',
  'Received file to Imports',
  'Sent award intimation to supplier',
  'Obtained order confirmation from supplier',
  'Draft Indent and submitted for checking and approval',
  'PO/Indent issued and sent contract documents',
  'Obtained performance bond',
  'Obtained signed contract & submitted LC application to LC committee',
  'LC committee approval received & sent to Bank unit',
  'LC Advice received',
  'Shipping document received',
  'Bank guarantee obtained',
  'Imports control approval obtained',
  'Obtained custom approval',
  'Goods cleared',
  'Obtained original and submit to WHARF',
  'Cancelled shipping guarantee'

]