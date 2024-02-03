import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles' 
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    InputAdornment,
    IconButton,
    Icon,
    Typography,
    colors,
    CircularProgress,
    Tab,
    Tabs,
    Box
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { convertTocommaSeparated, dateParse, includesArrayElements, roundDecimal } from 'utils'
import localStorageService from 'app/services/localStorageService'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import PharmacyService from 'app/services/PharmacyService'
import InventoryService from 'app/services/InventoryService'
import AvailableDrug from './AvailableDrug'
import EstimationService from 'app/services/EstimationService'
import PrescriptionService from 'app/services/PrescriptionService'
import ConsignmentService from 'app/services/ConsignmentService'
import EmployeeServices from 'app/services/EmployeeServices'

import LpPrint from './LPRequest/LpPrint'
import ClinicService from 'app/services/ClinicService'

import DrugProfileDashboard from './drug_profile'
// import HigherLavelSmartDashboard from '../dashboard/UserDashboards/HigherLavelSmartDashboard'
// import { timeStamp } from 'console'

const styleSheet = (theme) => ({})

const renderSubsequentDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <SubTitle title={label} />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
                <Typography variant='body1' style={{ marginTop: '3px', textJustify: "justify" }}>{value}</Typography>
            </Grid>
        </Grid>

    )
}

function TabPanel(props) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ paddingBottom: 3, paddingTop: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

const renderDetailCard = (label, value, style = {}) => {
    return (
        <Grid container spacing={2} style={style}>
            <Grid
                className=" w-full"
                item
                lg={8}
                md={8}
                sm={12}
                xs={12}
            >
                {renderSubsequentDetailCard(label, value)}
            </Grid>
        </Grid>
    )
}

const renderRadioCard = (label, values, selected) => {
    return (
        <Grid className=" w-full"
            item
            lg={6}
            md={6}
            sm={12}
            xs={12}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", alignItems: "center" }}>
                    <SubTitle title={label} />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="yesno"
                            aria-disabled
                            value={selected}
                            // onChange={(e) => {
                            //     let formData = this.state.formData
                            //     formData.selected = e.target.value
                            //     this.setState({ formData })
                            // }}
                            style={{ display: "block", marginTop: "3px" }}
                        >
                            <FormControlLabel
                                disabled
                                value={values[0]}
                                control={<Radio />}
                                label={values[0].charAt(0).toUpperCase() + values[0].slice(1).toLowerCase()}
                            />
                            <FormControlLabel
                                disabled
                                value={values[1]}
                                control={<Radio />}
                                label={values[1].charAt(0).toUpperCase() + values[1].slice(1).toLowerCase()}
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
        </Grid>
    )
}

class ApprovalIndividualDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            selected: 'yes',
            estimation: 'yes',

            id: null,
            role: null,
            data: [],
            grn_data:[],
            lp_config_data: {},
            owner_id: null,
            lp_request_id: null,
            hospital_approval_config_id: null,
            hospital: {},
            bht: null,
            estimationData: [],
            value: 0,
            Uom_Data:[],
            Uom_list:[],

            supplier: {},
            user: {},
            purchaseOrderData: {},
            ploaded: false,

            userRoles: [],
            mainTab: 0,
            Loaded: false,

            progress:false,


            hospitalDirectorQty: null,
            msdAdQty:null,
            msdDirector:null,
            isDirector : false,
            isMsdAd : false,

            balance_loading: false,
            balance_formData: {
                limit: 10,
                page: 0,
            },
            balance_totalData: 0,
            balance_data: [],
            balance_column: [
                {
                    name: 'sr_no',
                    label: 'Sr No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {this.state.balance_data[tableMeta.rowIndex]?.Order_item?.item ? this.state.balance_data[tableMeta.rowIndex]?.Order_item?.item?.sr_no : "Not Available"}
                                </span>
                            )
                        }
                    }
                },
                {
                    name: 'name',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {this.state.balance_data[tableMeta.rowIndex]?.Order_item?.item ? this.state.balance_data[tableMeta.rowIndex]?.Order_item?.item?.long_description : "Not Available"}
                                </span>
                            )
                        }
                    }
                },
                {
                    name: 'order_number',
                    label: 'Order Number',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {this.state.balance_data[tableMeta.rowIndex]?.Order_item?.purchase_order?.order_no}
                                </span>
                            )
                        }
                    }
                },
                {
                    name: 'schedule_date',
                    label: 'Due on Order Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {this.state.balance_data[tableMeta.rowIndex]?.schedule_date ? dateParse(this.state.balance_data[tableMeta.rowIndex]?.schedule_date) : "Not Available"}
                                </span>
                            )
                        }
                    }
                },
                {
                    name: 'quantity',
                    label: 'Balance Due on Order Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.balance_data[tableMeta.rowIndex]?.quantity ? parseInt(this.state.balance_data[tableMeta.rowIndex]?.quantity, 10) : "Not Available"}</span>
                            )
                        }
                    }
                },
            ],

            lp_loading: false,
            lp_totalItems: 0,
            lp_formData: {
                limit: 10,
                page: 0,
            },
            lp_data: [],
            lp_data_columns: [
                {
                    name: 'request_id', // field name in the row object
                    label: 'Request ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'request_by',
                    label: 'Requested By',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.lp_data[tableMeta.rowIndex]?.Employee?.name ? this.state.lp_data[tableMeta.rowIndex]?.Employee.name : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'institute',
                    label: 'Institute',
                    options: {
                        
                        customBodyRender: (value, tableMeta, updateValue) => {


                            // console.log('incomming data', data)

                            let HospitalData = this.state.hospitalData.find((e)=>e?.owner_id === this.state.lp_data[tableMeta.rowIndex]?.Pharmacy_drugs_store?.owner_id)
                            
                            return (
                                <p>{HospitalData?.name + '( ' + HospitalData?.Department?.name + ' )'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'required_date',
                    label: 'Requested Date',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.lp_data[tableMeta.rowIndex]?.required_date ? dateParse(this.state.lp_data[tableMeta.rowIndex]?.required_date) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'request_quantity',
                    label: 'Requested Quantity',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.lp_data[tableMeta.rowIndex]?.required_quantity ? parseInt(this.state.lp_data[tableMeta.rowIndex]?.required_quantity, 10) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'approved_quantity',
                    label: 'Approved Quantity',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.lp_data[tableMeta.rowIndex]?.approved_qty ? parseInt(this.state.lp_data[tableMeta.rowIndex]?.approved_qty, 10) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'grn_quantity',
                    label: 'GRN Quantity',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            console.log('cheking grnData - grn', this.state.grn_data)
                            console.log('cheking grnData - lp', this.state.lp_data)
                            let grnData = this.state.grn_data.find((e)=>e?.id === this.state.lp_data[tableMeta.rowIndex]?.id)
                            console.log('cheking grnData', grnData)
                            return (
                                <p>{grnData?.grn_quantity ? convertTocommaSeparated(grnData?.grn_quantity, 2) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'cost',
                    label: 'Amount (LKR)',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.lp_data[tableMeta.rowIndex]?.cost ? roundDecimal(this.state.lp_data[tableMeta.rowIndex]?.cost, 2) : 'Not Available'}</p>
                            )
                        }
                    },
                },
            ],

            history_loading: false,
            history_totalItems: 0,
            history_data: [
                {
                    name: "Ishara",
                    role: "MSD",
                    quantity: "2000",
                    date: new Date()
                }
            ],
            history_column: [
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {this.state.history_data[tableMeta.rowIndex]?.Employee ? this.state.history_data[tableMeta.rowIndex]?.Employee.name : "Not Available"}
                                </span>
                            )
                        }
                    }
                },
                {
                    name: 'role',
                    label: 'Role',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {this.state.history_data[tableMeta.rowIndex]?.Employee ? this.state.history_data[tableMeta.rowIndex]?.Employee.designation : "Not Available"}
                                </span>
                            )
                        }
                    }
                },
                {
                    name: 'remark',
                    label: 'Remark',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {this.state.history_data[tableMeta.rowIndex]?.remark ? this.state.history_data[tableMeta.rowIndex]?.remark : "Not Available"}
                                </span>
                            )
                        }
                    }
                },
                // {
                //     name: 'quantity',
                //     label: 'Quantity',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <span>
                //                     {this.state.history_data[tableMeta.rowIndex]?.approved_quantity ? parseInt(this.state.history_data[tableMeta.rowIndex]?.approved_quantity, 10) : "-"}
                //                 </span>
                //             )
                //         }
                //     }
                // },
                {
                    name: 'date',
                    label: 'Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.history_data[tableMeta.rowIndex]?.updatedAt ? dateParse(this.state.history_data[tableMeta.rowIndex]?.updatedAt) : "Not Available"}</span>
                            )
                        }
                    }
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            loading: false,
            isPending: false,

            type: [
                { id: 1, label: "Regular" },
                { id: 2, label: "Intermediate" },
                { id: 3, label: "Advanced" },
            ],

            formData: {
                item_name: null,
                quantity: null,
                type: null,
                remark: null,
                approved_quantity: null,
                approved_qty:null
            },

            login_userRoles:null,

            hospitalData:[],

            filterData: {
                item_name: null,
                quantity: null,
                type: null,
                description: 'No estimation data is available for Item Name ${itemName}, which corresponds to Serial Number ${srNo}.',
                remark: null,
            },
        }
    }

    loadConfigData = async () => {
        let lp_config_res = await LocalPurchaseServices.getLPRequestApprovalByID(this.state.id)
        console.log("LP config data before", lp_config_res)
        if (lp_config_res.status === 200) {
            console.log('LP Config Data: ', lp_config_res.data.view);
            this.setState({ lp_config_data: lp_config_res.data.view })
        }
    }

    // async getWardById(id, owner_id) {
    //     let params = {
    //         issuance_type: ['Ward', 'Unit'],
    //     }
    //     let res = await PharmacyService.getPharmacyById(id, owner_id, params)
    //     if (res.status === 200) {
    //         console.log('Ward :', res.data.view)
    //         // this.setState({
    //         //     wardList: res.data.view.data,
    //         // })
    //     }
    // }

    async getHospital(owner_id) {
        let params = { issuance_type: ['Hospital', 'RMSD Main']  }
        let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, params)
        if (durgStore_res.status == 200) {
            console.log('hospital', durgStore_res.data.view.data)
            this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
        }
    }

    async getHospitalEstimation(owner_id) {
        //let owner_id = await localStorageService.getItem('owner_id')
        let itemId = this.state.data?.ItemSnap?.id
        if (itemId) {
            let params = {
                owner_id: owner_id,
                item_id: [itemId],
                estimation_status: 'Active',
                available_estimation: 'Active',
                status: 'Active',
                hospital_estimation_status: 'Active',
                'order[0]': ['createdAt', 'DESC'],
    
            }
      
            let res = await EstimationService.getAllEstimationITEMS(params)
            if (res.status == 200) {
                console.log("loaded data estimation", res.data)
                this.setState({
                    estimationData: res.data?.view?.data
                })
            }
        }
    }

    getClinicData = async (patient_id) => {
        let res = await PrescriptionService.fetchPatientClinics({ 'type': 'Clinic', 'patient_id': patient_id, limit: 1,page:0 })
        if (res.status === 200) {
            console.log("Clinic Details: ", res.data.view.data)
            this.setState({ bht: res.data.view.data[0]?.bht })
        }
    }

    async getUser() {
        let id = await localStorageService.getItem('userInfo').id
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                console.log('User', user_res.data.view)
                this.setState({ user: user_res?.data?.view })
            }
        }
    }

    async printData() {
        this.setState({ printLoaded: false, ploaded: false })
        // console.log('clicked', request_id)

        let res = await LocalPurchaseServices.getLPRequestByID(this.state.lp_request_id)
        if (res.status === 200) {
            console.log("Data: ", res.data.view)
            // await this.getHospital(res.data.view?.owner_id)
            await this.getUser();

            this.setState({
                ploaded: true,
                supplier: res.data.view?.Employee,
                purchaseOrderData: res.data.view,
                printLoaded: true,
            }, () => {
                this.getUOMFroPrint(res.data.view)
                
            })
        }
    }

    async getUOMFroItem(data){

        console.log('cheking uom sdsdsd', data.item_id)
        let params={
            item_snap_id:data?.ItemSnap?.id
            // item_snap_id:'7b1f51d4-8ed9-4b19-a98a-003565de2a6f'
        }
        let res = await InventoryService.GetUomById(params)
        if (res.status === 200){
            console.log('cheking sddsdsdsd', res)

            let selected_umo = res.data.view.data.find((e)=>e?.ItemSnap?.id == data?.ItemSnap?.id)

            console.log('cheking sele', selected_umo)
            this.setState({
                Uom_list : selected_umo,
                
            })
        }
    }

    async getUOMFroPrint(data){

        console.log('cheking uom inc', data.item_id)
        let params={
            item_snap_id:data?.ItemSnap?.id
            // item_snap_id:'7b1f51d4-8ed9-4b19-a98a-003565de2a6f'
        }
        let res = await InventoryService.GetUomById(params)
        if (res.status === 200){
            console.log('cheking uom', res)

            let selected_umo = res.data.view.data.find((e)=>e?.ItemSnap?.id == data?.ItemSnap?.id)

            console.log('cheking selecterd uom', selected_umo)
            this.setState({
                Uom_Data:selected_umo,
            }, ()=>{
                document.getElementById('lp_print_view').click()
            })
        }
    }

    loadPreviousLPRequest = async () => {
        this.setState({ lp_loading: false })

        let role = this.state.role
        let owner_id = await localStorageService.getItem('owner_id')
        const currentYear = new Date().getFullYear();

        if (role === 'Chief Pharmacist' || role === 'Drug Store Keeper' || role === 'Hospital Director') {
            // let res1 = await LocalPurchaseServices.getLPRequest({ not_lp_request_id: this.state.lp_request_id, from: dateParse(new Date('2023-01-01')), to: dateParse(new Date()), item_id: this.state.lp_config_data.LPRequest.item_id, owner_id: owner_id })
            // console.log('DATA: ', res1.data.view.data)
            let res = await LocalPurchaseServices.getLPRequest({
                ...this.state.lp_formData,
                from: dateParse(new Date(currentYear, 0, 1)), to: dateParse(new Date(currentYear, 11, 31)), item_id: this.state.data?.item_id, owner_id: owner_id, not_lp_request_id: this.state.data?.id 
            })

            if (res.status === 200) {
                console.log('Previous DATA: ', res.data.view.data)
                this.setState({ lp_data: res.data.view.data, lp_totalItems: res.data.view.totalItems }, ()=>{
                    this.loadHospitals(res.data.view.data)
                    this.getGrnItemDetails(res.data.view.data)
                })
            }

        } else {
            let res = await LocalPurchaseServices.getLPRequest({ ...this.state.lp_formData, from: dateParse(new Date(currentYear, 0, 1)), to: dateParse(new Date(currentYear, 11, 31)), item_id: this.state.data?.item_id, not_lp_request_id: this.state.data?.id, owner_id: owner_id, })
            // let res1 = await LocalPurchaseServices.getLPRequest({
            //     not_lp_request_id: this.state.lp_request_id, from: dateParse(new Date()), to: dateParse(new Date()), item_id: this.state.lp_config_data.LPRequest.item_id
            // })
            if (res.status === 200) {
                console.log('Previous DATA: ', res.data.view.data)
                this.setState({ lp_data: res.data.view.data, lp_totalItems: res.data.view.totalItems }, ()=>{
                    this.loadHospitals(res.data.view.data)
                    this.getGrnItemDetails(res.data.view.data)
                }) 
            }
        }

        this.setState({ lp_loading: true })
    }

    async loadHospitals(mainData){
        console.log('checkinf min data' , mainData)
        let params = { 
            issuance_type: ["Hospital"], 
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: mainData?.map(x=>x.Pharmacy_drugs_store?.owner_id)
        };
    
        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('ceking ospital', res.data.view.data)
            this.setState({
                hospitalData:res.data.view.data
            })
        }

    }

    async getGrnItemDetails (data){

        let params = {
            search_type: "ConsignmentGRNSum",
            order_no: data?.map(x=>x.id),
        }
        let res = await ConsignmentService.getConsignmentItems(params)

        if (res.status === 200) {
            console.log("grn Data: ", res.data.view)
            this.setState({ grn_data: res.data.view })
        }
        
    }

    getBalanceDueOnOrder = async () => {
        this.setState({ balance_loading: false })
        const today = new Date();
        const fiveYearsAgo = new Date(today.getFullYear() - 2, 0, 1);
        const fiveYearsAfter = today.setFullYear(today.getFullYear() + 5); 

        console.log("local perchace details", this.state.lp_config_data)
        let params = { ...this.state.balance_formData, item_id: this.state.data?.item_id, status: 'Active', from : dateParse(fiveYearsAgo), to : dateParse(fiveYearsAfter) }

        let res = await ConsignmentService.getBalanceDueOnOrder(params)
        if (res.status === 200) {
            console.log("Balance Data: ", res.data.view.data)
            this.setState({ balance_data: res.data.view.data, balance_totalData: res.data.view.totalItems })
        }

        this.setState({ balance_loading: true })
    }

    loadHistory = async () => {
        this.setState({ history_loading: false })

        let res = await LocalPurchaseServices.getLPRequestApprovals({ lp_request_id: this.state.lp_request_id, 'order[0]': ['sequence', 'ASC'] });
        if (res.status === 200) {
            let data = res.data.view.data.filter(word => word.Employee)
            this.setState({ history_data: data, history_totalItems: data.length })
            console.log("History Data :", res.data.view.data)
        }

        this.setState({ history_loading: true })
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let id = this.props.match.params.id;

        let owner_id = await localStorageService.getItem('owner_id');
        let res = await LocalPurchaseServices.getLPRequestByID(this.state.lp_request_id)

        if (res.status === 200) {
            this.setState({ data: res?.data?.view });
            console.log("LP Data: ", res.data.view)
        }

        await this.getHospitalEstimation(res?.data?.view?.owner_id)// for get hospital estimation
        await this.getHospital(res.data.view.owner_id)
        await this.getClinicData(res.data.view.patient_id)
        // await this.getWardById(res.data.view.ward_id, res.data.view.owner_id)
        await this.loadConfigData()
        await this.loadPreviousLPRequest()
        await this.getBalanceDueOnOrder()
        await this.loadHistory()
        await this.getApprovedInfo()
        await this.getUOMFroItem(res?.data?.view)


        this.setState({loading: true, owner_id: owner_id });

        let formData = this.state.formData
        
        console.log('chheking commen data', this.state.role, this.state.data.required_quantity )
        if (this.state.role === 'Hospital Director'){
            formData.approved_qty = this.state.data.required_quantity 
        } else if (this.state.role === 'MSD AD') {
            formData.approved_qty = this.state.data.approved_qty 
        } else if (this.state.role === 'MSD Director') {
            formData.approved_qty = this.state.data.approved_qty
        } 

        this.setState({
            formData
        })
    }

    async getApprovedInfo(){
        let params = {
            lp_request_id : this.state.lp_request_id
        }
        let res = await  LocalPurchaseServices.getLPRequestApprovals(params)

        if (res.status === 200) {
            // this.setState({ data: res.data.view });
            console.log("LP aproved qty: ", res)

            let hospital_director_qty = res.data.view.data.filter((item) => item.approval_user_type === 'Hospital Director');

            hospital_director_qty.forEach((item) => {
             this.setState({hospitalDirectorQty: item.approved_qty})
            });

            let msd_ad = res.data.view.data.filter((item) => item.approval_user_type === 'MSD AD');

            msd_ad.forEach((item) => {
                this.setState({msdAdQty: item.approved_qty})
               });

               let msd_director = res.data.view.data.filter((item) => item.approval_user_type === 'MSD Director');

               msd_director.forEach((item) => {
                this.setState({msdDirector: item.approved_qty})
               });
        }

    }

    async onSubmit(action) {

        console.log('cheking action' , action)
        let role = this.state.role
        let owner_id = this.state.owner_id
        let user = await localStorageService.getItem('userInfo')

        if (action === 'APPROVED') {

            if (this.state.lp_config_data && this.state.hospital_approval_config_id && this.state.id) {
                // let approve_res = await LocalPurchaseServices.changeLPRequest(this.state.lp_request_id, { approved_quantity: this.state.formData.approve_qty })
                // if (approve_res.status === 200 || approve_res.status === 201) {
                let otherPostData = {
                    approved_qty: this.state.formData.approved_qty,
                    remark: this.state.formData.remark,
                    lp_request_id: this.state.lp_request_id,
                    hospital_approval_config_id: this.state.hospital_approval_config_id,
                    approval_type: this.state.lp_config_data.approval_type,
                    approved_by: user.id, approval_user_type: role,
                    status: action, sequence: this.state.lp_config_data.sequence,
                    owner_id: owner_id
                }
                
                let res = await LocalPurchaseServices.patchLPRequestApprovals(this.state.id,otherPostData)
                if (res.status && res.status == 200) {
                    this.setState({
                        alert: true,
                        message: 'LP Approved Successfully',
                        severity: 'success',
                        progress: false
                    })

                    setTimeout(() => {
                        window.location.href = '/localpurchase/request'; // Replace with the desired URL
                    }, 1200);
                    // }
                    // else {
                    //     this.setState({
                    //         alert: true,
                    //         message: 'LP Approved Unsuccessful',
                    //         severity: 'success',
                    //     })
                    // }
                } else {
                    this.setState({
                        alert: true,
                        message: 'LP Approved Unsuccessful',
                        severity: 'error',
                        progress: false
                    })
                }
            } else {
                this.setState({
                    alert: true,
                    message: "Parameter was not passed correctly",
                    severity: 'error',
                    progress: false
                })
            }

        } else {

            if (this.state.formData.remark) {

                if (this.state.lp_config_data && this.state.hospital_approval_config_id && this.state.id) {
                   
                    let otherPostData = {
                        approved_qty: this.state.formData.approved_qty,
                        remark: this.state.formData.remark,
                        lp_request_id: this.state.lp_request_id,
                        hospital_approval_config_id: this.state.hospital_approval_config_id,
                        approval_type: this.state.lp_config_data.approval_type,
                        approved_by: user.id, approval_user_type: role,
                        status: action, sequence: this.state.lp_config_data.sequence,
                        owner_id: owner_id
                    }

                    console.log('ceking parameters', otherPostData)
                    
                    let res = await LocalPurchaseServices.patchLPRequestApprovals(this.state.id,otherPostData)
                    if (res.status && res.status == 200) {
                        this.setState({
                            alert: true,
                            message: 'LP Rejected Successfully',
                            severity: 'success',
                        })
    
                        setTimeout(() => {
                            window.location.href = '/localpurchase/request'; 
                        }, 1200);
                    } else {
                        this.setState({
                            alert: true,
                            message: 'LP Rejected Unsuccessful',
                            severity: 'error',
                        })
                    }
                } else {
                    this.setState({
                        alert: true,
                        message: "Parameter was not passed correctly",
                        severity: 'error',
                    })
                }

            } else {
                this.setState({
                    alert: true,
                    message: "Please Provide a Remark",
                    severity: 'warning',
                })
            }


        }
    }

   
    async componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        let roles = await localStorageService.getItem('userInfo')?.roles

        console.log('roles', roles[0])

        if (roles[0] === 'MSD SCO' || roles[0] === 'HSCO' || roles[0] === 'HSCO' || roles[0] === 'MSD AD' || roles[0] === 'MSD Director') {
            this.setState({
                isDirector : true,
            })
        }

        if (roles[0] === 'MSD Director') {
            this.setState({
                isMsdAd : true,
            })
        }

        let id = this.props.match.params.id;

        this.setState({
            id: id,
            userRoles: roles,
            role: params.get('role') ? params.get('role') : null,
            isPending: params.get('is_pending') ? params.get('is_pending') : false,
            lp_request_id: params.get('lp_request_id') ? params.get('lp_request_id') : null,
            hospital_approval_config_id: params.get('hospital_approval_config_id') ? params.get('hospital_approval_config_id') : null,
        }, () => {
            this.loadData()
        })
    }

    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }
    

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                <LoonsCard>
                    <Tabs style={{ minHeight: 39, height: 26 }}
                        indicatorColor="primary"
                        variant='fullWidth'
                        textColor="primary"
                        value={this.state.value}
                        onChange={this.handleChange}
                        // onChange={(event, newValue) => {
                        //     console.log(newValue, 'checking new newValue')
                        //     this.setState({ mainTab: newValue })
                        // }} 
                        >
                        
                        <Tab
                            label="Local Purchase Request Details"
                            {...a11yProps(0)}
                        />

                        {includesArrayElements(this.state.userRoles,['MSD SCO', 'HSCO', 'MSD AD', 'MSD Director', 'Hospital Director'])&&
                        <Tab
                            label="Drug Profile"
                            {...a11yProps(1)}
                        />}

                    </Tabs>

                    <TabPanel value={this.state.value} index={0} >
                        {/* <DebitNoteApprovalPending /> */}
                        <div className='mt-5'>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <div style={{ flex: 1 }}>
                                    <Typography variant="h6" className="font-semibold">Local Purchase Request Details</Typography>
                                </div>
                                {
                                    this.state.loading &&
                                    <div>
                                        <Button
                                            onClick={() => this.printData()}
                                            startIcon='print'
                                        >
                                            <span className="capitalize">Print</span>
                                        </Button>
                                    </div>
                                }
                            </div>
                            <Divider />
                            {/* Main Grid */}
                            <ValidatorForm className="pt-2"
                                onSubmit={() => null}
                                onError={() => null}>
                                <Grid container spacing={2} direction="row" style={{ marginLeft: "12px", marginTop: "12px" }}>
                                    {/* Filter Section */}
                                    <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginRight: "12px" }}>
                                        {/* Item Series Definition */}
                                        {/* Item Details */}
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <SubTitle title="Local Purchase Initial Details" />
                                                <Divider className='mt-2' />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('LP Request ID :', this.state.loading ? this.state.data?.request_id ? this.state.data?.request_id : 'Not Available' : 'Loading')}
                                            </Grid>
                                            {/* Name*/}
                                            {/* <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Procurement No :', 'Not Available')}
                                            </Grid> */}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Institute :', this.state.loading ? this.state.hospital?.name ? (this.state.hospital.name + " " + this.state.hospital?.Department?.name) : 'Not Available' : 'Loading')}
                                            </Grid>
                                            {/* Short Reference*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Ward Name :', this.state.loading ? this.state.data?.Pharmacy_drugs_store?.short_reference
                                                    ? this.state.data?.Pharmacy_drugs_store?.short_reference : 'Not Available' : 'Loading')}
                                            </Grid>
                                            {renderRadioCard("Patient Basis or Not :", ['yes', 'no'], this.state.loading ? this.state.data?.is_patient_base === true ? 'yes' : 'no' : 'no')}
                                        </Grid>
                                        {
                                            this.state.loading && this.state.data?.is_patient_base &&
                                            <>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                    >
                                                        <SubTitle title="Patient Details" />
                                                        <Divider className='mt-2' />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('PHN No :', this.state.loading ? this.state.data?.Patient?.phn ? this.state.data?.Patient?.phn : this.state.data?.phn : 'Loading')}
                                                    </Grid>

                                                    {/* Name*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('NIC :', this.state.loading ? this.state.data?.Patient?.nic ? this.state.data?.Patient?.nic : this.state.data?.nic : 'Loading')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Name :', this.state.loading ? this.state.data?.Patient?.name ? this.state.data?.Patient?.name : this.state.data?.patient_name: 'Loading')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('BHT No :', this.state.loading ? this.state.data?.Patient?.bht ? this.state.data?.Patient?.bht : this.state.data?.bht_or_clinic_no: 'Loading')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Contact No :', this.state.loading ? this.state.data?.Patient?.contact_no ? this.state.data?.Patient?.contact_no : 'Not Available' : 'Loading')}
                                                    </Grid>
                                                </Grid>
                                            </>
                                        }
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <SubTitle title="Item Details" />
                                                <Divider className='mt-2' />
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}
                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Sr No :', this.state.loading ? this.state.data?.ItemSnap ? this.state.data.ItemSnap.sr_no : this.state.data?.item_name ? 'New Item ((-)Serial Number)' : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid item lg={3} md={3} sm={6} xs={6}>
                                                        <SubTitle title='Item Name' />
                                                    </Grid>
                                                    <Grid item lg={9} md={9} sm={6} xs={6}>
                                                        <Typography variant='body1' style={{ marginTop: '3px', textJustify: "justify" }}>{this.state.loading ? this.state.data?.ItemSnap?.medium_description ? this.state.data?.ItemSnap?.medium_description : this.state.data?.item_name ? this.state.data?.item_name : 'Not Available' : 'Loading'}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid item lg={3} md={3} sm={6} xs={6}>
                                                        <SubTitle title='UOM' />
                                                    </Grid>
                                                    <Grid item lg={9} md={9} sm={6} xs={6}>
                                                        {/* {console.log('hdhdhdhdhdhdddjdjdjd', this.state.Uom_list)} */}
                                                        <Typography variant='body1' style={{ marginTop: '3px', textJustify: "justify" }}>{this.state.loading ? (this.state.Uom_list?.UOM?.name ? this.state.Uom_list?.UOM?.name : 'Not Available' ) : 'Loading'}</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        {/* Serial Number*/}
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Required Quantity :', this.state.loading ? this.state.data?.required_quantity ? this.state.data?.required_quantity : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Required Date: ', this.state.loading ? this.state.data?.required_date ? dateParse(this.state.data.required_date) : 'Not Available' : 'Loading')}
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={2} style={{ marginBottom: "12px" }}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Justification :', this.state.loading ? this.state.data?.justification ? this.state.data?.justification : 'Not Available' : 'Loading')}
                                            </Grid>
                                            {this.state.userRoles.includes('Chief Pharmacist') || this.state.userRoles.includes('Drug Store Keeper') ?
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <Grid container spacing={2}>
                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                            <SubTitle title="Attachments" />
                                                        </Grid>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <SwasthaFilePicker
                                                                // uploadingSectionVisibility={this.state.loginUserRoles.includes('Hospital Admin')}
                                                                id="file_public"
                                                                singleFileEnable={true}
                                                                multipleFileEnable={false}
                                                                dragAndDropEnable={true}
                                                                tableEnable={true}

                                                                documentName={true}//document name enable
                                                                documentNameValidation={['required']}
                                                                documenterrorMessages={['this field is required']}
                                                                documentNameDefaultValue={null}//document name default value. if not value set null

                                                                type={false}
                                                                types={null}
                                                                typeValidation={null}
                                                                typeErrorMessages={null}
                                                                defaultType={null}// null

                                                                description={true}
                                                                descriptionValidation={null}
                                                                descriptionErrorMessages={null}
                                                                defaultDescription={null}//null

                                                                onlyMeEnable={false}
                                                                defaultOnlyMe={false}

                                                                source="local_purchase"
                                                                source_id={this.state.lp_request_id}

                                                                //accept="image/png"
                                                                // maxFileSize={1048576}
                                                                // maxTotalFileSize={1048576}
                                                                maxFilesCount={1}
                                                                validators={[
                                                                    'required',
                                                                    // 'maxSize',
                                                                    // 'maxTotalFileSize',
                                                                    // 'maxFileCount',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                    // 'file size too lage',
                                                                    // 'Total file size is too lage',
                                                                    // 'Too many files added',
                                                                ]}
                                                                /* selectedFileList={
                                                                    this.state.data.fileList
                                                                } */
                                                                label="Select Attachment"
                                                                singleFileButtonText="Upload Data"
                                                            // multipleFileButtonText="Select Files"
                                                            >
                                                            </SwasthaFilePicker>
                                                        </Grid>
                                                    </Grid>
                                                </Grid> : null
                                            }
                                        </Grid>
                                        <Divider></Divider>

                                        <Grid container spacing={2} style={{ marginTop: "24px" }}>
                                            <Grid item lg={3} md={3} xs={12} sm={12}>
                                                <SubTitle title="Alternative Drug Availability :" />
                                            </Grid>
                                            <Grid item lg={9} md={9} xs={12} sm={12} style={{ border: "1px solid #000", borderRadius: "12px", padding: "8px" }}>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                                        <FormControl component="fieldset">
                                                            <RadioGroup
                                                                name="yesno"
                                                                aria-disabled
                                                                value={this.state.selected}
                                                                // onChange={(e) => {
                                                                //     let formData = this.state.formData
                                                                //     formData.selected = e.target.value
                                                                //     this.setState({ formData })
                                                                // }}
                                                                style={{ display: "block", marginTop: "3px" }}
                                                            >
                                                                <FormControlLabel
                                                                    style={{ marginRight: "12px" }}
                                                                    disabled
                                                                    value="yes"
                                                                    control={<Radio />}
                                                                    label="Yes"
                                                                />
                                                                <FormControlLabel
                                                                    style={{ marginLeft: "12px" }}
                                                                    disabled
                                                                    value="no"
                                                                    control={<Radio />}
                                                                    label="No"
                                                                />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                {this.state.selected === 'yes' &&
                                                    <Grid container spacing={2} style={{ marginLeft: '8px' }}>

                                                        <Grid container spacing={2} style={{ margin: '8px' }}>
                                                            <Grid className='w-full' item lg={12} md={12} sm={12} xs={12}>
                                                                <SubTitle title="Item Name :" />
                                                            </Grid>
                                                            <Grid className=" w-full"
                                                                item
                                                                lg={8}
                                                                md={8}
                                                                sm={12}
                                                                xs={12}>
                                                                <TextValidator
                                                                    disabled
                                                                    className=" w-full"
                                                                    placeholder="Item Name"
                                                                    name="item_name"
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                    }}
                                                                    value={
                                                                        this.state.formData
                                                                            .item_name
                                                                    }
                                                                    type="text"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            formData: {
                                                                                ...this
                                                                                    .state
                                                                                    .formData,
                                                                                item_name:
                                                                                    e.target
                                                                                        .value,
                                                                            },
                                                                        })
                                                                    }}
                                                                // validators={[
                                                                //     'required',
                                                                // ]}
                                                                // errorMessages={[
                                                                //     'this field is required',
                                                                // ]}
                                                                />
                                                            </Grid>
                                                            <Grid className='w-full' item lg={12} md={12} sm={12} xs={12}>
                                                                <SubTitle title="Available Qty :" />
                                                            </Grid>
                                                            <Grid className=" w-full"
                                                                item
                                                                lg={8}
                                                                md={8}
                                                                sm={12}
                                                                xs={12}>
                                                                <TextValidator
                                                                    disabled
                                                                    className=" w-full"
                                                                    placeholder="Quantity"
                                                                    name="quantity"
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                    }}
                                                                    value={String(this.state.formData.quantity)}
                                                                    type="number"
                                                                    min={0}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            formData: {
                                                                                ...this
                                                                                    .state
                                                                                    .formData,
                                                                                quantity:
                                                                                    e.target
                                                                                        .value,
                                                                            },
                                                                        })
                                                                    }}
                                                                // validators={
                                                                //     ['minNumber:' + 0, 'required:' + true]}
                                                                // errorMessages={[
                                                                //     'Quantity Should be > 0',
                                                                //     'this field is required'
                                                                // ]}
                                                                />
                                                            </Grid>
                                                            <Grid className='w-full' item lg={12} md={12} sm={12} xs={12}>
                                                                <SubTitle title="Item Type :" />
                                                            </Grid>
                                                            <Grid className=" w-full"
                                                                item
                                                                lg={8}
                                                                md={8}
                                                                sm={12}
                                                                xs={12}>
                                                                <Autocomplete
                                                                    disabled
                                                                    disableClearable
                                                                    className="w-full"
                                                                    options={this.state.type}
                                                                    onChange={(e, value) => {
                                                                        if (null != value) {
                                                                            let formData =
                                                                                this.state.formData
                                                                            formData.type =
                                                                                e.target.value
                                                                            this.setState({
                                                                                formData,
                                                                            })
                                                                        }
                                                                    }}
                                                                    value={this.state.type.find((item) => item.label === this.state.formData.type)
                                                                    }
                                                                    getOptionLabel={(option) =>
                                                                        option.label
                                                                    }
                                                                    renderInput={(params) => (
                                                                        <TextValidator
                                                                            {...params}
                                                                            placeholder="Please choose"
                                                                            fullWidth
                                                                            variant="outlined"
                                                                            size="small"
                                                                            value={this.state.formData.type}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                        <br />
                                                    </Grid>
                                                }
                                            </Grid>
                                        </Grid>

                                        {renderRadioCard('Formulate at MSD :', ['yes', 'no'], this.state.data?.ItemSnap?.formulatory_approved ? this.state.data?.ItemSnap?.formulatory_approved === 'Y' ? 'yes' : 'no' : null)}

                                        {renderRadioCard('Category :', ['complementary', 'regular'], 'complementary')}
                                        <br />
                                        <Grid container spacing={2}>
                                            <Grid item lg={3} md={3} xs={12} sm={12}>
                                                <SubTitle title="Estimation :" />
                                            </Grid>
                                            <Grid item lg={9} md={9} xs={12} sm={12} style={{ border: "1px solid #000", borderRadius: "12px", padding: "8px", paddingBottom: "40px" }}>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                                        <FormControl component="fieldset">
                                                            <RadioGroup
                                                                name="yesno"
                                                                aria-disabled
                                                                value={this.state.estimationData.length > 0 ? 'yes' : 'no'}
                                                                // onChange={(e) => {
                                                                //     let formData = this.state.formData
                                                                //     formData.selected = e.target.value
                                                                //     this.setState({ formData })
                                                                // }}
                                                                style={{ display: "block", marginTop: "3px" }}
                                                            >
                                                                <FormControlLabel
                                                                    style={{ marginRight: "12px" }}
                                                                    disabled
                                                                    value="yes"
                                                                    control={<Radio />}
                                                                    label="Yes"
                                                                />
                                                                <FormControlLabel
                                                                    style={{ marginLeft: "12px" }}
                                                                    disabled
                                                                    value="no"
                                                                    control={<Radio />}
                                                                    label="No"
                                                                />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>
                                                    <br />
                                                    {this.state.estimationData.length > 0 ?
                                                        <Grid container spacing={2} style={{ marginLeft: '8px' }}>
                                                            if yes;
                                                            {this.state.estimationData.length > 0 ?
                                                                <>
                                                                    {renderDetailCard('Annual Estimation :', this.state.estimationData[0] ? this.state.estimationData[0].estimation : "Not Available", { marginLeft: "4px" })}
                                                                    <br />
                                                                    {renderDetailCard('Monthly Requirement :', this.state.estimationData[0] ? roundDecimal(parseInt(this.state.estimationData[0].estimation, 10) / 12, 2) : "Not Available", { marginLeft: "4px" })}
                                                                </>
                                                                :
                                                                null
                                                            }
                                                        </Grid> :
                                                        <Grid container spacing={2} style={{ marginLeft: '8px' }}>

                                                            {renderDetailCard('Reason :', '')}
                                                            <Grid container spacing={2} style={{ margin: '8px' }}>
                                                                <Grid className=" w-full"
                                                                    item
                                                                    lg={8}
                                                                    md={8}
                                                                    sm={12}
                                                                    xs={12}>
                                                                    <TextValidator
                                                                        disabled
                                                                        multiline
                                                                        rows={4}
                                                                        className=" w-full"
                                                                        placeholder="Reason"
                                                                        name="description"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        value={
                                                                            this.state.filterData
                                                                                .description.replace("${itemName}", this.state.data?.ItemSnap?.medium_description).replace("${srNo}", this.state.data?.ItemSnap?.sr_no)
                                                                        }
                                                                        type="text"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                filterData: {
                                                                                    ...this
                                                                                        .state
                                                                                        .filterData,
                                                                                    description:
                                                                                        e.target
                                                                                            .value,
                                                                                },
                                                                            })
                                                                        }}
                                                                        validators={[
                                                                            'required',
                                                                        ]}
                                                                        errorMessages={[
                                                                            'this field is required',
                                                                        ]}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                            <br />
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <br></br>
                                        {/* <br />
                                        {renderDetailCard('Hospital Available Stock :', 0)}
                                        <br />
                                        {renderDetailCard('Hospital Serviceable Stock :', 0)}
                                        <br />
                                        {renderDetailCard('MSD Available Stock :', 0)}
                                        <br />
                                        {renderDetailCard('Nearest Hospital 1 Available Stock :', 0)}
                                        <br />
                                        {renderDetailCard('Nearest Hospital 2 Available Stock :', 0)}
                                        <br />
                                        {renderDetailCard('Nearest Hospital 3 Available Stock :', 0)}
                                        <br /> */}
                                        {/* Available Drug List */}
                                        {
                                            this.state.loading &&
                                            <>
                                                <Divider style={{ marginBottom: "20px" }} />
                                                <AvailableDrug items={this.state.data?.ItemSnap?.id ? [{
                                                    id: this.state.data?.ItemSnap?.id, code: this.state.data?.ItemSnap?.sr_no, name: this.state.data?.ItemSnap?.medium_description
                                                }] : []} owner_id={this.state.owner_id} role={this.state.role} />
                                            </>
                                        }
                                        {
                                            // 'MSD SCO', 'MSD SCO Supply', 'MSD AD', 'MSD Director', 'HSCO'
                                            this.state.userRoles.includes('MSD SCO') || this.state.userRoles.includes('MSD SCO Supply') || this.state.userRoles.includes('MSD AD') || this.state.userRoles.includes('MSD Director') || this.state.userRoles.includes('HSCO') ?
                                                <>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <Divider style={{ marginBottom: "24px" }} />
                                                        <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                                            <CardTitle title='Balance Due on Order' style={{ marginLeft: "8px" }} />
                                                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: '12px', backgroundColor: "#fff", borderRadius: "12px" }}>
                                                                {this.state.loading && this.state.balance_loading ?
                                                                    <LoonsTable
                                                                        //title={"All Aptitute Tests"}
                                                                        id={'all_items'}
                                                                        data={this.state.balance_data}
                                                                        columns={this.state.balance_column}
                                                                        options={{
                                                                            pagination: true,
                                                                            serverSide: true,
                                                                            count: this.state.balance_totalData,
                                                                            rowsPerPage: this.state.balance_formData.limit,
                                                                            page: this.state.balance_formData.page,
                                                                            rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                                            print: true,
                                                                            viewColumns: true,
                                                                            download: true,
                                                                            onTableChange: (action, tableState) => {
                                                                                console.log(action, tableState)
                                                                                switch (action) {
                                                                                    case 'changePage':
                                                                                        // this.setPage(tableState.page)
                                                                                        let formData = this.state.balance_formData
                                                                                        formData.page = tableState.page
                                                                                        this.setState(
                                                                                            { formData, },
                                                                                            () => {
                                                                                                this.getBalanceDueOnOrder()
                                                                                            }
                                                                                        )
                                                                                        break
                                                                                    case 'sort':
                                                                                        // this.sort(tableState.page, tableState.sortOrder);
                                                                                        this.setState({
                                                                                            limit: tableState.rowsPerPage,
                                                                                            page: 0,
                                                                                        }, () => {
                                                                                            this.getBalanceDueOnOrder()
                                                                                        })
                                                                                        break
                                                                                    default:
                                                                                        console.log('action not handled.')
                                                                                }
                                                                            }
                                                                        }}></LoonsTable>
                                                                    : (
                                                                        //loading effect
                                                                        <Grid className="justify-center text-center w-full pt-12">
                                                                            <CircularProgress size={30} />
                                                                        </Grid>
                                                                    )
                                                                }
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                </>
                                                : null
                                        }
                                        {/* {!this.state.isPending && */}
                                        <>
                                            <Divider style={{ marginBottom: "25px" }} />
                                            <Grid container spacing={2} style={{ marginTop: "12px", padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                                <CardTitle title='Previous LP Requests in this Year' style={{ marginLeft: "8px" }} />
                                                <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: '12px', backgroundColor: "#fff", borderRadius: "12px" }}>
                                                    {this.state.lp_loading ?
                                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                                            <LoonsTable
                                                                //title={"All Aptitute Tests"}
                                                                id={'allLPData'}
                                                                data={this.state.lp_data}
                                                                columns={this.state.lp_data_columns}
                                                                options={{
                                                                    pagination: true,
                                                                    count: this.state.lp_totalItems,
                                                                    rowsPerPage: this.state.lp_formData.limit,
                                                                    page: this.state.lp_formData.page,
                                                                    serverSide: true,
                                                                    print: true,
                                                                    viewColumns: true,
                                                                    download: true,
                                                                    rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                                    onTableChange: (
                                                                        action,
                                                                        tableState
                                                                    ) => {
                                                                        console.log(
                                                                            action,
                                                                            tableState
                                                                        )
                                                                        switch (action) {
                                                                            case 'changePage':
                                                                                this.setState({ lp_formData: { page: tableState.page, limit: tableState.rowsPerPage } }, () => {
                                                                                    this.loadPreviousLPRequest()
                                                                                })
                                                                                console.log('page', this.state.page);
                                                                                break;
                                                                            case 'changeRowsPerPage':
                                                                                this.setState({
                                                                                    lp_formData: {
                                                                                        limit: tableState.rowsPerPage,
                                                                                        page: 0,
                                                                                    }
                                                                                }, () => {
                                                                                    this.loadPreviousLPRequest()
                                                                                })
                                                                                break;
                                                                            case 'sort':
                                                                                //this.sort(tableState.page, tableState.sortOrder);
                                                                                break
                                                                            default:
                                                                                console.log(
                                                                                    'action not handled.'
                                                                                )
                                                                        }
                                                                    },
                                                                }}
                                                            ></LoonsTable>
                                                        </Grid>
                                                        :
                                                        (
                                                            <Grid className='justify-center text-center w-full pt-12'>
                                                                <CircularProgress size={30} />
                                                            </Grid>
                                                        )
                                                    }
                                                </Grid>
                                            </Grid>
                                        </>


                                        <Divider style={{ margin: "24px 0" }} />
                                    
                                        <br />
                                        <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                            <CardTitle title='Summary of Information' style={{ marginLeft: "8px" }} />
                                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: '12px', backgroundColor: "#fff", borderRadius: "12px" }}>
                                                {renderDetailCard('SR No :', this.state.loading ? this.state.data?.ItemSnap?.sr_no : 'Loading')}
                                                {renderDetailCard('Item Name :', this.state.loading ? (this.state.data?.ItemSnap?.medium_description ? this.state.data?.ItemSnap?.medium_description :  this.state.data?.item_name) : 'Loading')}
                                                {renderDetailCard('Required Quantity :', this.state.loading ? this.state.data?.required_quantity ? this.state.data?.required_quantity : 'Not Available' : 'Loading')}
                                                {renderDetailCard('Unit Price:', this.state.loading ? this.state.data?.unit_price ? this.state.data?.unit_price : 'Not Available' : 'Loading')}
                                                {renderDetailCard('Total Price :', this.state.loading ? (convertTocommaSeparated((Number(this.state.data?.required_quantity) * Number(this.state.data?.unit_price)), 2)) : 'Loading')}
                                                { this.state.isDirector && renderDetailCard('Hospital Director Approved Qty :',this.state.loading ? this.state.hospitalDirectorQty : 'Loading')}
                                                { this.state.isMsdAd && renderDetailCard('MSD AD Approved Qty :',this.state.loading ? this.state.msdAdQty : 'Loading')}
                                                {/* {renderDetailCard('MSD Director Approved Qty :',this.state.loading ? this.state.msdDirector : 'Loading')} */}


                                                {this.state.userRoles.includes('Drug Store Keeper') || this.state.userRoles.includes('Hospital Director') || this.state.userRoles.includes('Chief Pharmacist') ?
                                                    renderDetailCard('Annual Hospital Allocation for LP in this year :', '************* LKR') :
                                                    renderDetailCard('Annual National Allocation for LP in this year :', '************* LKR')
                                                }
                                            </Grid>
                                        </Grid>
                                        <br />
                                        {includesArrayElements(this.state.userRoles, ['Drug Store Keeper', 'Chief Pharmacist', 'MSD SCO', 'HSCO']) ? null :
                                            <div>
                                                {renderDetailCard('Approving Quantity :', '')}
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={4}
                                                        md={6}
                                                        sm={8}
                                                        xs={12}
                                                    >
                                                        <TextValidator
                                                            className=" w-full"
                                                            placeholder="Approving Quantity"
                                                            name="quantity"
                                                            required
                                                            InputLabelProps={{
                                                                shrink: false,
                                                            }}
                                                            value={
                                                                String(this.state.formData
                                                                    .approved_qty)
                                                            }
                                                            type="number"
                                                            min={0}
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    formData: {
                                                                        ...this
                                                                            .state
                                                                            .formData,
                                                                            approved_qty:
                                                                            parseInt(e.target
                                                                                .value, 10),
                                                                    },
                                                                })
                                                            }}
                                                            validators={
                                                                ['minNumber:' + 0, 'required:' + true]}
                                                            errorMessages={[
                                                                'Approval Quantity Should be > 0',
                                                                'this field is required'
                                                            ]}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>}

                                        {renderDetailCard('Remark :', '')}
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={8}
                                                md={8}
                                                sm={12}
                                                xs={12}
                                            >
                                                <TextValidator
                                                    multiline
                                                    rows={4}
                                                    className=" w-full"
                                                    placeholder="Remark"
                                                    name="remark"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .remark
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                remark:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                        className=" w-full flex justify-end"
                                                    >
                                                        {this.state.loading ? (
                                                            Array.isArray(this.state.lp_config_data?.HospitalApprovalConfig?.available_actions) &&
                                                            this.state.lp_config_data.HospitalApprovalConfig.available_actions.map((action) => {
                                                                // console.log(action?.name); // Print the value
                                                                return <Button
                                                                    className="mt-2 mr-2"
                                                                    progress={this.state.progress}
                                                                    type="submit"
                                                                    // color="#d8e4bc"
                                                                    startIcon={action.name === 'Reject' ? 'checklist' : 'save'}
                                                                    style={action.name === 'Reject' ? { backgroundColor: '#F02020' } : { backgroundColor: colors.blue }}
                                                                    scrollToTop={
                                                                        true
                                                                    }
                                                                    onClick={() => this.setState({progress:true},()=>{this.onSubmit(action.action)})}
                                                                >
                                                                    <span className="capitalize">
                                                                        {action.name}
                                                                    </span>
                                                                </Button>
                                                            })
                                                        ) : null}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                            <CardTitle title='LP Approved Quantity History' style={{ marginLeft: "8px" }} />
                                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: '12px', backgroundColor: "#fff", borderRadius: "12px" }}>
                                                {this.state.history_loading ?
                                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'allLPHistoryData'}
                                                            data={this.state.history_data}
                                                            columns={this.state.history_column}
                                                            options={{
                                                                pagination: true,
                                                                count: this.state.history_totalItems,
                                                                rowsPerPage: 10,
                                                                page: 0,
                                                                serverSide: true,
                                                                print: true,
                                                                viewColumns: true,
                                                                download: true,
                                                                // rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                                onTableChange: (
                                                                    action,
                                                                    tableState
                                                                ) => {
                                                                    console.log(
                                                                        action,
                                                                        tableState
                                                                    )
                                                                    switch (action) {
                                                                        case 'changePage':
                                                                            // this.setState({ lp_formData: { page: tableState.page } }, () => {
                                                                            //     this.loadPreviousLPRequest()
                                                                            // })
                                                                            // console.log('page', this.state.page);
                                                                            break;
                                                                        case 'changeRowsPerPage':
                                                                            // this.setState({
                                                                            //     lp_formData: {
                                                                            //         limit: tableState.rowsPerPage,
                                                                            //         page: 0,
                                                                            //     }
                                                                            // }, () => {
                                                                            //     this.loadPreviousLPRequest()
                                                                            // })
                                                                            break;
                                                                        case 'sort':
                                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                                            break
                                                                        default:
                                                                            console.log(
                                                                                'action not handled.'
                                                                            )
                                                                    }
                                                                },
                                                            }}
                                                        ></LoonsTable>
                                                    </Grid>
                                                    :
                                                    (
                                                        <Grid className='justify-center text-center w-full pt-12'>
                                                            <CircularProgress size={30} />
                                                        </Grid>
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                            {this.state.ploaded ?
                                // <PurchaseOrderList />
                                <LpPrint purchaseOrderData={this.state.purchaseOrderData} hospital={this.state.hospital} supplier={this.state.supplier} user={this.state.user} uom={this.state.Uom_Data}/>
                                :
                                <Grid className="justify-center text-center w-full pt-12">
                                    {/* <CircularProgress size={30} /> */}
                                </Grid>
                            }
                        </div>
                    </TabPanel>

                    {/* {includesArrayElements(this.state.userRoles,['MSD SCO', 'HSCO', 'MSD AD', 'MSD Director', 'Hospital Director'])&& */}
                    <TabPanel value={this.state.value} index={1}>
                        {/* <DebitNoteApprovalApproved /> */}
                        <DrugProfileDashboard item_id={this.state.data?.ItemSnap?.id} ></DrugProfileDashboard>
                    </TabPanel>
                    {/* } */}
                    {/* Filtr Section */}

                </LoonsCard>
                    
                </MainContainer>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={1200}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(ApprovalIndividualDetails)
