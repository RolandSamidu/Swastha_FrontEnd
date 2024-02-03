import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import ReactToPrint from 'react-to-print' 
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
    CircularProgress,
    Dialog
} from '@material-ui/core'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Rating from '@mui/material/Rating';
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DashboardServices from 'app/services/DashboardServices'
import moment from 'moment';
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'

import HospitalConfigServices from 'app/services/HospitalConfigServices';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import EmployeeServices from 'app/services/EmployeeServices'

import MomentUtils from '@date-io/moment'
import { KeyboardDateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'

import AssignmentIcon from '@material-ui/icons/Assignment';

import {
    Box,
} from '@material-ui/core'

import {
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    LoonsTable,
} from 'app/components/LoonsLabComponents' 
import { dateParse, dateTimeParse, roundDecimal } from 'utils'
import localStorageService from 'app/services/localStorageService'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import PharmacyService from 'app/services/PharmacyService'
import EstimationService from 'app/services/EstimationService'
import AvailableDrug from './AvailableDrug'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import PrescriptionService from 'app/services/PrescriptionService'
import CloseIcon from '@material-ui/icons/Close';
import CancelIcon from '@mui/icons-material/Cancel';

import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import LPQuotationView from './LPRequest/LPQuotationView'
import LPPrintView from './LPRequest/LPPrintView'
import LPHospitalPrintCopy from './LPRequest/LPHospitalPrintView'
import LpPrint from './LPRequest/LpPrint' 
import { Tooltip} from "@material-ui/core";
import PrintIcon from '@material-ui/icons/Print';

import DialogActions from '@mui/material/DialogActions';
import InventoryService from 'app/services/InventoryService'

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})

const pageStyle = `
    @page {
        margin-left:5mm;
        margin-right:5mm;
        margin-bottom:5mm;
        margin-top:8mm;
    }

    @table {
        tr {
            width: 5px,
        }
    }

    @media print {
        .print-table tr:not(:first-child):nth-of-type(22n+1) {
            page-break-before: always;
        }
        .print-table tbody {
            counter-reset: rowNumber;
        }
        .print-table tbody tr:not(:first-child) {
            counter-increment: rowNumber;
        }
        .print-table tbody tr:not(:first-child):before {
            content: counter(rowNumber) ".";
            display: inline-block;
            margin-right: 0.5em;
        }
        .page-break {
            page-break-before: always;
        }

        .bottom {
            position: fixed;
            bottom: 0;
        }
        .header, .header-space,
        {
            height: 2000px;
        }
        .footer, .footer-space {
            height: 55px;
        }
        .footer {
            position: fixed;
            bottom: 0;
        }
    }
    `

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

const renderRadioCard = (label, value) => {
    return (
        <Grid className="w-full"
            item
            lg={6}
            md={6}
            sm={6}
            xs={6}>
            <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", alignItems: "center" }}>
                    <SubTitle title={label} />
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={6}>
                    <FormControl component="fieldset">
                        <RadioGroup
                            name="yesno"
                            aria-disabled
                            value={value}
                            // onChange={(e) => {
                            //     let formData = this.state.formData
                            //     formData.selected = e.target.value
                            //     this.setState({ formData })
                            // }}
                            style={{ display: "block", marginTop: "3px" }}
                        >
                            <FormControlLabel
                                disabled
                                value="yes"
                                control={<Radio />}
                                label="Yes"
                            />
                            <FormControlLabel
                                disabled
                                value="no"
                                control={<Radio />}
                                label="No"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
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

class IndividualPurchaseDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            estimationData: [],
            hospital: {},
            open: false,
            userRoles: [],
            totalItemList:null,
            supplierInfo:null,
            qprintLoad:false,
            sampleDate:null, 
            selected:null, 
            closingDate:null,
            hospitalDet:{},
            hospitalCopy:false,
            selecedCount: null,
            Uom_Data:[],
            supplier_search : null,

            open_supplier_list:false,

            supplire_list_data :{
                lp_request_id: null,
                page: 0,
                limit: 10,
                quotation_no:null,
                'order[0]': ['createdAt', 'DESC'],
            },

            createQuotation: false,
            isShopping: false,
            isNormal: false,

            quotationData:{
                lp_request_id : null,
                supplier_id : [],
                closing_date : null,
                delivery_date : null, 
                is_sample_needed : null,
                owner_id: null,
                sample_required_date : null,
                remark : null
            },
            printLoad: false,

            selected_id: [],
            supplier_loading: true,
            totalSupplierItems: 0,
            supplier_filters: {
                page: 0,
                limit: 20,
                search: '',
            },

            supplier_search_data:[],
            confirmMsg:false,

            supplier_data: [
                // {
                //     id: "A1001",
                //     name: "Samam",
                //     mqp: "250",
                //     rating: '4.2',
                // }
            ],

            selectedSupplier_printList: [],
            selected_supplier_printList_column: [
                {
                    name: 'supplier_no',
                    label: 'Supplier No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.selectedSupplier_printList[tableMeta.rowIndex]?.Supplier?.registartion_no
                            )
                        }
                    }
                },

                {
                    name: 'supplier_name',
                    label: 'Supplier Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.selectedSupplier_printList[tableMeta.rowIndex]?.Supplier?.name
                            )
                        }
                         
                    }
                },

                {
                    name: 'supplier_company',
                    label: 'Supplier Company',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.selectedSupplier_printList[tableMeta.rowIndex]?.Supplier?.company
                            )
                        }
                         
                    }
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            
                            if (this.state.selectedSupplier_printList[tableMeta.rowIndex]?.type === "Retender") {
                                return (
                                    "Retender"
                                )
                            } else {
                                return " "
                            }
                            
                        }
                         
                    }
                },

                {
                    name: 'print',
                    label: 'Print',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                 <Grid className="px-2">
                                    <Tooltip title="Print">
                                        <IconButton
                                            onClick={() => {
                                                this.onQuotationSubmit(this.state.selectedSupplier_printList[tableMeta.rowIndex])
                                            }}>
                                            <PrintIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid> 
                            )
                        }
                         
                    }
                },
            ],

            selected_list: [],
            selected_supplier_list_column: [
                {
                    name: 'registartion_no', // field name in the row object
                    label: 'Supplier Id ', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'Supplier Name ', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'address', // field name in the row object
                    label: 'Supplier Address ', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'company', // field name in the row object
                    label: 'Supplier Company ', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },

            ],

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


            selectedSuppliersList: [],
            supplier_column: [
                {
                    name: '',
                    label: '',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            
                            if (this.state.data) {
                                return <input
                                    type="checkbox"
                                    style={{
                                        width: "20px",
                                        height: "20px", outline: "none",
                                        cursor: "pointer"
                                    }}
                                    value={this.state.supplier_data[dataIndex]?.id
                                    }
                                    defaultChecked={this.state.selectedSuppliersList.includes(this.state.supplier_data[dataIndex]?.id)}
                                    checked={this.state.selectedSuppliersList.includes(this.state.supplier_data[dataIndex]?.id)}
                                    
                                    onClick={()=>{
                                        this.clickingSupplier(this.state.supplier_data[dataIndex]?.id)
                                        this.countSelectedItems(this.state.supplier_data[dataIndex])
                                    }}
                                />
                            } else {
                                return "N/A"
                            }

                        }
                    }
                },
                {
                    name: 'registartion_no',
                    label: 'Supplier ID',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return value
                        // }
                    }
                },
                {
                    name: 'name',
                    label: 'Supplier Name',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'address',
                    label: 'Supplier Address',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'company',
                    label: 'Company',
                    options: {
                        display: true
                    }
                },
                /* {
                    name: 'mqp',
                    label: 'MQP (LKR)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>
                                    {this.state.supplier_data[tableMeta.rowIndex]?.mqp ? this.state.supplier_data[tableMeta.rowIndex]?.mqp : 0}
                                </span>
                            )
                        }
                    }
                },
                {
                    name: 'cost',
                    label: 'Total Cost (LKR)',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.supplier_data[tableMeta.rowIndex]?.mqp && this.state.data?.cost ? parseFloat(this.state.supplier_data[tableMeta.rowIndex]?.mqp * this.state.data?.required_quantity) : 0}</span>
                            )
                        }
                    }
                },
                {
                    name: 'rating',
                    label: 'Rating',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Rating name="half-rating-read" defaultValue={this.state.supplier_data[tableMeta.rowIndex]?.rating ? this.state.supplier_data[tableMeta.rowIndex]?.rating : 0} precision={0.1} readOnly />
                            )
                        }
                    }
                }, */
                /* {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <IconButton
                                    className="text-black"
                                    onClick={() => { }
                                    }>
                                    <Icon color="primary">visibility</Icon>
                                </IconButton>
                            )
                        }
                    }
                } */
            ],


            role: null,
            bht: null,

            alert: false,
            message: '',
            severity: 'success',

            formData: {
                closingDate: null,
                patient_name: null,
                delivery: null,
                sampleDate: null,
                selected: false,
            },

            lp_formData: {
                limit: 10,
                page: 0,
            },

            loading: false,
            printWindow: false,
            value: 0,

            selected_list:[]
        }

        this.componentRef = React.createRef();
        this.reactToPrintRef = React.createRef();
       // this.handleChange = this.handleChange.bind(this)
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        let hospital_id = await localStorageService.getItem('main_hospital_id');
        let owner_id = await localStorageService.getItem('owner_id')

        this.setState({ loading: false });

        let id = this.props.match.params.id;
        let res = await LocalPurchaseServices.getLPRequestByID(id)

        if (res.status === 200) {
            this.setState({ data: res.data.view },()=>{
                this.loadPreviousLPRequest()
            });
            console.log("LP Data: ", res.data.view)
        }

        let hospital_res = await PharmacyService.getPharmacyById(hospital_id, owner_id, { limit: 1 })
        if (hospital_res.status === 200) {
            this.setState({ hospital: hospital_res.data.view }, () => {
                this.getHospitalEstimation()// for get hospital estimation
                this.getHospital(res.data.view?.owner_id)
                this.getClinicData(res.data.view?.patient_id)
            })
        }

        this.setState({ loading: true });
    }

    countSelectedItems = (data) => {

        let count = this.state.selectedSuppliersList.length;
        console.log('selected data', data)

        // const newArray = [...this.state.selected_list, data];

        // this.setState({
        //     selecedCount:count,
        //     selected_list: newArray
        // })

        // console.log('selected temp array', this.state.selected_list)

        let selectedSuppliersList = this.state.selected_list;
        let index = selectedSuppliersList.indexOf(data)
        if (index==-1) {
            selectedSuppliersList.push(data);
        } else {
            selectedSuppliersList.splice(index,1)
        }

        console.log('cheking suppier list', selectedSuppliersList)
        this.setState({ selected_list: selectedSuppliersList, selecedCount:count, });
    }

    loadPreviousLPRequest = async () => {
        this.setState({ lp_loading: false })

        let role = this.state.role
        let owner_id = await localStorageService.getItem('owner_id')
        const currentYear = new Date().getFullYear();
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (role === 'Chief Pharmacist' || role === 'Drug Store Keeper' || role === 'Hospital Director') {

            let res = await LocalPurchaseServices.getLPRequest({
                ...this.state.lp_formData,
                from: dateParse(new Date(currentYear, 0, 1)), to: dateParse(yesterday), item_id: this.state.data?.item_id, owner_id: owner_id
            })

            if (res.status === 200) {
                console.log('Previous DATA-2 ', res.data.view.data)
                this.setState({ lp_data: res.data.view.data, lp_totalItems: res.data.view.totalItems })
            }

        } else {
            let res = await LocalPurchaseServices.getLPRequest({ ...this.state.lp_formData, from: dateParse(yesterday), to: dateParse(new Date(currentYear, 11, 31)), item_id: this.state.data?.item_id })

            if (res.status === 200) {
                console.log('Previous DATA-1: ', res.data.view.data)
                this.setState({ lp_data: res.data.view.data, lp_totalItems: res.data.view.totalItems })
            }
        }

        this.setState({ lp_loading: true })
    }



    async getHospital(owner_id) {
        let params = { issuance_type: ['Hospital', 'RMSD Main'] }
        let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, params)
        if (durgStore_res.status == 200) {
            console.log('hospital', durgStore_res.data.view.data)
            this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
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
        console.log('clicked', this.props.match.params.id)

        let res = await LocalPurchaseServices.getLPRequestByID(this.props.match.params.id)
        if (res.status === 200) {
            // console.log("Data: ", res.data.view)
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
                Uom_Data:selected_umo
            }, ()=>{
                document.getElementById('lp_print_view').click()
            })
        }
    }

    async SubmitAll() {

    }


    async getHospitalEstimation() {
        let owner_id = await localStorageService.getItem('owner_id')
        let itemId = this.state.data?.ItemSnap?.id
        // console.log("checking item id", this.state.data?.ItemSnap?.id)

        if (itemId) {
        let params = {
            owner_id: owner_id,
            item_id: [itemId],
            estimation_status: 'Active',
            available_estimation: 'Active',
            status: 'Active',
            hospital_estimation_status: 'Active',
            //'order[0]': ['createdAt', 'DESC'],
            from: dateParse(moment().startOf('year')),
            to: dateParse(moment().endOf('year')),
            'order[0]': ['estimation', 'DESC'],
        }

        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            // console.log("loaded data estimation", res.data)
            this.setState({
                estimationData: res.data?.view?.data
            })
        }

    }
    }

    getClinicData = async (patient_id) => {
        if (patient_id) {
            let res = await PrescriptionService.fetchPatientClinics({ 'type': 'Clinic', 'patient_id': patient_id, limit: 1 })
            if (res.status === 200) {
                // console.log("Clinic Details: ", res.data.view.data)
                this.setState({ bht: res.data.view.data[0]?.bht })
            }
        }
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            // console.log('files', this.state.files)
        })
    }

    clickingSupplier(id) {
       
        console.log('cheking id det', id)
        let selectedSuppliersList = this.state.selectedSuppliersList;
        let index = selectedSuppliersList.indexOf(id)
        if (index==-1) {
            selectedSuppliersList.push(id);
        } else {
            selectedSuppliersList.splice(index,1)
        }

        console.log('cheking selected list', selectedSuppliersList)
        this.setState({ selectedSuppliersList: selectedSuppliersList });
    }
      
    
    handleChange = (event, newValue) => {
        this.setState({ value: newValue })
    }

    onQuotationSubmit = async (data) => {
        // console.log('sdaaaaaaaaaaaaaa', data)
        // let params = { issuance_type: 'Hospital' }
        // let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(data.owner_id, params)

        // if (durgStore_res.status == 200) {
        //     console.log('hospital', durgStore_res.data.view.data)
        //     this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
        // }

        // console.log('checking print data', data)
        this.setState({
            qprintLoad: true,
            supplierInfo : data,
        }, ()=>{
            document.getElementById('LP_QUOTATION_PRINT').click();
            this.render()
        })
        

        setTimeout(() => {
            this.setState({
                qprintLoad: false,
            })
        }, 3000);
      
    }


    copyOfHospitalPrint = async () => {

        // console.log('checking print data copy', this.state.selectedSupplier_printList)
        this.setState({
            hospitalCopy: true,
            supplierInfo : this.state.selectedSupplier_printList[0],
        }, ()=>{
            document.getElementById('LP_HOSPITAL_PRINT_COPY').click();
            this.render()
        })

        setTimeout(() => {
            this.setState({
                hospitalCopy: false,
            })
        }, 3000);
      
    }

    display() {
        alert(this.state.selected_id.join(','));
        console.log(this.state.selected_id)
    }

    async loadAllSuppliers(value) {
        let supplier_filters =  this.state.supplier_filters
        supplier_filters.search = null
        this.setState({ supplier_loading: false, supplier_filters })
        let params = this.state.supplier_filters
        params.search = value

        let res = await HospitalConfigServices.getAllSuppliers(this.state.supplier_filters)
        if (res.status == 200) {
            // console.log('Suppliers: ', res.data.view.data)
            // console.log('Suppliers params: ', params)
            this.setState(
                { supplier_data: res.data.view.data, totalSupplierItems: res.data.view.totalItems, supplier_loading: true, params }
            )
        }
    }


    async setSupplierPage(page) {
        //Change paginations
        let supplier_filters = this.state.supplier_filters
        supplier_filters.page = page
        this.setState({
            supplier_filters
        }, () => {
            console.log("New formdata", this.state.supplier_filters)
            this.loadAllSuppliers()
        })
    }

    // async saveQuotation(){

    //     let owner_id = await localStorageService.getItem('owner_id')
        
    //     let params = this.state.quotationData

    //     params.lp_request_id = this.props.match.params.id;
    //     params.supplier_id = this.state.selectedSuppliersList;
    //     params.closing_date = this.state.formData.closingDate;
    //     params.delivery_date = this.state.formData.delivery;
    //     params.is_sample_needed = this.state.formData.selected;
    //     params.owner_id = owner_id;
    //     params.sample_required_date = this.state.formData.sampleDate;
    //     console.log("ownwr id checking", params)
    //     let res =  await LocalPurchaseServices.createLPQuotation(params)

    //     if (res.status === 201) {
    //         console.log('dave data', res)
    //         this.setState({
    //             alert: true,
    //             message: 'Adding Local Purchase was Successful',
    //             severity: 'success',
    //             // source_id: res.data.posted.res.id
    //         }, ()=>{
    //             this.setState({      
    //                 open: false,
    //             })
                
    //             this.getSupplierPrintDet()
    //             this.handleChange({}, 1)
    //         })

    //     } else {
    //         this.setState({
    //             alert: true,
    //             message: 'Adding Local Purchase was Unsuccessful',
    //             severity: 'error',
    //         })
    //     }
        
    // }

    async saveQuotation() {
        const owner_id = await localStorageService.getItem('owner_id');
        console.log('cheking lp data ownid', this.state?.data?.owner_id)
        // const params = this.state.quotationData;
        let params = this.state.quotationData
        let id = {
            lp_request_id:this.props.match.params.id
        }
        console.log('existingData params', id)
        const existingData = await LocalPurchaseServices.getLPQuotationInfo(id);
        console.log('existingData', existingData)
        if (existingData.data.view.data.length !== 0) {
            // this.setState({
            //     alert: true,
            //     message: 'Data already exists for the given Local Purchase Request ID.',
            //     severity: 'warning',
            // });
            // return;

            params.lp_request_id = this.props.match.params.id;
            params.supplier_id = this.state.selectedSuppliersList;
            params.closing_date = this.state.formData.closingDate;
            params.delivery_date = this.state.formData.delivery;
            params.is_sample_needed = this.state.formData.selected;
            
            params.sample_required_date = this.state.formData.sampleDate;
            params.type = "Retender";

            if (this.state.role === 'RDHS' || this.state.role === 'Accounts Clerk RMSD' || this.state.role === 'Devisional Pharmacist') {
                params.owner_id = this.state?.data?.owner_id
            } else {
                params.owner_id = owner_id;
            }
    
            console.log('cheking lp params', params)

            const res = await LocalPurchaseServices.createLPQuotation(params);
    
            if (res.status === 201) {

                this.setState(
                    {
                        alert: true,
                        message: 'Adding Local Purchase was Successful',
                        severity: 'success',
                    },
                    () => {
                        this.setState({
                            open: false,
                        });
    
                        this.getSupplierPrintDet();
                        this.handleChange({}, 1);
                        // this.onQuotationSubmit()
                    }
                );
            } else {
                // Quotation creation unsuccessful
                this.setState({
                    alert: true,
                    message: 'Adding Local Purchase was Unsuccessful',
                    severity: 'error',
                });
            }

        } else {

        params.lp_request_id = this.props.match.params.id;
        params.supplier_id = this.state.selectedSuppliersList;
        params.closing_date = this.state.formData.closingDate;
        params.delivery_date = this.state.formData.delivery;
        params.is_sample_needed = this.state.formData.selected;
        
        params.sample_required_date = this.state.formData.sampleDate;


        if (this.state.role === 'RDHS' || this.state.role === 'Accounts Clerk RMSD' || this.state.role === 'Devisional Pharmacist') {
            params.owner_id = this.state?.data?.owner_id
        } else {
            params.owner_id = owner_id;
        }

        console.log('cheking lp params - 1', params)
    
        try {
            const res = await LocalPurchaseServices.createLPQuotation(params);
    
            if (res.status === 201) {
                // Quotation creation successful
                this.setState(
                    {
                        alert: true,
                        message: 'Adding Local Purchase was Successful',
                        severity: 'success',
                    },
                    () => {
                        this.setState({
                            open: false,
                        });
    
                        this.getSupplierPrintDet();
                        this.handleChange({}, 1);
                        // this.onQuotationSubmit()
                    }
                );
            } else {
                // Quotation creation unsuccessful
                this.setState({
                    alert: true,
                    message: 'Adding Local Purchase was Unsuccessful',
                    severity: 'error',
                });
            }
        } catch (error) {
            // Handle any error that occurred during the API call
            console.error('Error creating quotation:', error);
            this.setState({
                alert: true,
                message: 'An error occurred while creating the quotation.',
                severity: 'error',
            });
        }
        }

        
    }
    

    async getSupplierPrintDet(){

        let params = this.state.supplire_list_data
        params.lp_request_id = this.props.match.params.id
    
        let res = await LocalPurchaseServices.getLPQuotationInfo(params)

        if (res.status === 200){
            console.log('checking supplie infor', res)
            this.setState({
                selectedSupplier_printList:res.data.view.data,
                printWindow:true,
                totalItemList : res.data.view.totalItems
            })
        }
    }

    async setPage(page) {
        let filterData = this.state.supplire_list_data
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.getSupplierPrintDet()
            }
        )
    }

    async setPageForPrevius(page) {
        let filterData = this.state.lp_formData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadPreviousLPRequest()
            }
        )
    }

    // loadPreviousLPRequest = async () => {
    //     this.setState({ lp_loading: false })

    //     let role = this.state.role
    //     let owner_id = await localStorageService.getItem('owner_id')
    //     const currentYear = new Date().getFullYear();

    //     console.log('DATA:--------->>>>>> ', this.state.data?.ItemSnap?.id)
    //     if (role === 'Chief Pharmacist' || role === 'Drug Store Keeper' || role === 'Hospital Director') {
    //         // let res1 = await LocalPurchaseServices.getLPRequest({ not_lp_request_id: this.state.lp_request_id, from: dateParse(new Date('2023-01-01')), to: dateParse(new Date()), item_id: this.state.lp_config_data.LPRequest.item_id, owner_id: owner_id })
            
    //         let res = await LocalPurchaseServices.getLPRequest({
    //             ...this.state.lp_formData,
    //             from: dateParse(new Date(currentYear, 0, 1)), to: dateParse(new Date(currentYear, 11, 31)), item_id: this.state.data?.item_id, owner_id: owner_id
    //         })

    //         if (res.status === 200) {
    //             console.log('Previous DATA: ', res.data.view.data)
    //             this.setState({ lp_data: res.data.view.data, lp_totalItems: res.data.view.totalItems })
    //         }

    //     } else {
    //         let res = await LocalPurchaseServices.getLPRequest({ ...this.state.lp_formData, from: dateParse(new Date(currentYear, 0, 1)), to: dateParse(new Date(currentYear, 11, 31)), item_id: this.state.data?.item_id })
    //         // let res1 = await LocalPurchaseServices.getLPRequest({
    //         //     not_lp_request_id: this.state.lp_request_id, from: dateParse(new Date()), to: dateParse(new Date()), item_id: this.state.lp_config_data.LPRequest.item_id
    //         // })
    //         if (res.status === 200) {
    //             console.log('Previous DATA: ', res.data.view.data)
    //             this.setState({ lp_data: res.data.view.data, lp_totalItems: res.data.view.totalItems })
    //         }
    //     }

    //     this.setState({ lp_loading: true })
    // }



    async componentDidMount() {

        console.log('hdhdhhdhdhdhdh', this.props.match.params.id)
        const params = new URLSearchParams(this.props.location.search);
        let roles = await localStorageService.getItem('userInfo')?.roles

        console.log('cheking login role', roles)
        this.setState({
            userRoles: roles,
            role: roles[0],
            createQuotation: params.get('create_quotation') ? params.get('create_quotation') : false,
            isShopping: params.get('is_shopping') ? params.get('is_shopping') : false,
            isNormal: params.get('is_normal') ? params.get('is_normal') : false,
        }, () => {
            this.loadData()
            
            this.loadAllSuppliers()
            this.getSupplierPrintDet()
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        {this.state.isShopping && <>
                            <Typography variant="h4" className="font-semibold">Shopping Method</Typography>
                            <Divider className='mt-2 mb-4' />
                        </>
                        }
                        {this.state.isNormal && <>
                            <Typography variant="h4" className="font-semibold">Procurement Method</Typography>
                            <Divider className='mt-2 mb-4' />
                        </>}
                        <div style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ flex: 1 }}>
                                <Typography variant="h6" className="font-semibold">Local Purchase Details</Typography>
                            </div>
                            {this.state.loading &&
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
                        <Grid container spacing={2} direction="row" style={{ marginLeft: "12px", marginTop: "12px" }}>
                            {/* Filter Section */}
                            <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginRight: "12px" }}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
                                    {/* Item Series heading */}
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
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('LP Request ID :', this.state.loading ? this.state.data?.request_id ? this.state.data.request_id : 'Not Available' : 'Loading')}
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
                                                {renderSubsequentDetailCard('Institute :', this.state.loading ? this.state.hospital?.name ? this.state.hospital.name : 'Not Available' : 'Loading')}
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
                                                    ? this.state.data?.Pharmacy_drugs_store.short_reference : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid item lg={12} xs={12} md={12} sm={12}>
                                                <Grid container spacing={2}>
                                                    {renderRadioCard("Patient Basis or Not :", this.state.loading ? this.state.data?.is_patient_base === true ? 'yes' : 'no' : null)}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    {/* Patient Details*/}
                                    {
                                        this.state.loading && this.state.data?.is_patient_base &&
                                        <>
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
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Name of the Patient :', this.state.loading ? this.state.data?.Patient ? this.state.data?.Patient?.name : 'Not Available' : 'Loading')}
                                                    </Grid>
                                                </Grid>
                                                <br />
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
                                                        {renderSubsequentDetailCard('BHT / Clinic No :', this.state.loading ? this.state?.bht ? this.state.bht : 'Not Available' : 'Loading')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('PHN No :', this.state.loading ? this.state.data?.Patient ? this.state.data?.Patient?.phn : 'Not Available' : 'Loading')}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </>
                                    }
                                    <br />
                                    {/* Item Details */}
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
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
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
                                                {renderSubsequentDetailCard('Sr No :', this.state.loading ? this.state.data?.ItemSnap ? this.state.data?.ItemSnap?.sr_no : this.state.data?.item_name ? 'New Item ((-)Serial Number)' : 'Not Available' : 'Loading')}
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
                                        </Grid>
                                    </Grid>
                                    <br />
                                    {/* Serial Number*/}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Required Quantity :', this.state.loading ? this.state.data ? parseInt(this.state.data?.required_quantity, 10) : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Required Date: ', this.state.loading ? this.state.data ? dateParse(this.state.data?.required_date) : 'Not Available' : 'Loading')}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        {renderSubsequentDetailCard('Justification :', this.state.loading ? this.state.data ? this.state.data?.justification : 'Not Available' : 'Loading')}
                                    </Grid>
                                    {this.state.userRoles.includes('Drug Store Keeper') || this.state.userRoles.includes('Chief Pharmacist') ?
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
                                                    <SubTitle title="Attachments :" />
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
                                                        source_id={this.props.match.params.id}

                                                        maxFilesCount={1}
                                                        validators={[
                                                            'required',

                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]}

                                                        label="Select Attachment"
                                                        singleFileButtonText="Upload Data"
                                                    >
                                                    </SwasthaFilePicker>
                                                </Grid>
                                            </Grid>
                                        </Grid> : null
                                    }
                                    <br />
                                    {
                                        this.state.loading && this.state.data?.ItemSnap?.id &&
                                        <Grid
                                            className="w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <AvailableDrug items={this.state.data?.ItemSnap?.id ? [{
                                                id: this.state.data?.ItemSnap?.id, 
                                                code: this.state.data?.ItemSnap?.sr_no, 
                                                name: this.state.data?.ItemSnap?.medium_description
                                            }] : []} owner_id={this.state.data?.owner_id} role={this.state.role} />
                                        </Grid>
                                    }
                                    <Grid
                                        className="w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Divider style={{ marginBottom: "40px" }} />
                                        <Grid container spacing={2} style={{ marginTop: "12px", padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                            <CardTitle title='Previous LP Requests in this Year' style={{ marginLeft: "8px" }} />
                                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ padding: '12px', backgroundColor: "#fff", borderRadius: "12px" }}>
                                               
                                                {this.state.lp_loading && this.state.data?.ItemSnap?.id ?
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
                                                                onTableChange: (action, tableState) => {
                                                                    console.log(action, tableState)
                                                                    switch (action) {
                                                                        case 'changePage':
                                                                            this.setPageForPrevius(tableState.page)
                                                                            break
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
                                    {renderRadioCard('Formulate at MSD :', this.state.loading ? this.state.data?.ItemSnap?.formulatory_approved ? this.state.data.ItemSnap.formulatory_approved === 'Y' ? 'yes' : "no" : null : null)}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={6}
                                                xs={6}>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", alignItems: "center" }}>
                                                        <SubTitle title={'Category'} />
                                                    </Grid>
                                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                                        <FormControl component="fieldset">
                                                            <RadioGroup
                                                                name="complementaryregular"
                                                                aria-disabled
                                                                value={'complementary'}

                                                                style={{ display: "block", marginTop: "3px" }}
                                                            >
                                                                <FormControlLabel
                                                                    disabled
                                                                    value="complementary"
                                                                    control={<Radio />}
                                                                    label="Complementary"
                                                                />
                                                                <FormControlLabel
                                                                    disabled
                                                                    value="regular"
                                                                    control={<Radio />}
                                                                    label="Regular"
                                                                />
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={3} sm={3}>
                                                <SubTitle title="Estimation :" />
                                            </Grid>
                                            <Grid item xs={9} sm={9} style={{ border: "1px solid #000", borderRadius: "12px", padding: "8px", paddingBottom: "40px" }}>
                                                {this.state.loading ?
                                                    <Grid container spacing={2}>
                                                        <Grid item lg={6} md={6} sm={6} xs={6}>
                                                            <FormControl component="fieldset">
                                                                <RadioGroup
                                                                    name="yesno"
                                                                    aria-disabled
                                                                    value={this.state.estimationData.length > 0 ? 'yes' : 'no'}
          
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
                                                            <>
                                                                {renderDetailCard('Annual Estimation :', this.state.estimationData[0] ? this.state.estimationData[0].estimation : "Not Available", { marginLeft: "4px" })}
                                                                <br />
                                                                {renderDetailCard('Monthly Requirement :', this.state.estimationData[0] ? roundDecimal(parseInt(this.state.estimationData[0].estimation, 10) / 12, 2) : "Not Available", { marginLeft: "4px" })}
                                                            </>
                                                            :
                                                            null
                                                        }
                                                        <br />
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
                                    <br />
                                    {/* <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Typography variant='body1'>{`Quantity Locally Purchased (of the same item) during the year : ${'450'}`}</Typography>
                                    </Grid>
                                    <br /> */}

                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Divider className='mt-2' />
                                    </Grid>

                                    <br />
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}
                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >

                                                {renderSubsequentDetailCard('MQP (LKR) :', this.state.loading ? this.state.data?.unit_price ? parseFloat(this.state.data.unit_price).toLocaleString("en-US") : 'Not Available' : 'Loading')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Approved Qty :', this.state.loading ? this.state.data?.approved_qty ? parseInt(this.state.data?.approved_qty) : parseInt(this.state.data?.required_quantity) : 'Loading')}
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}
                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Total Value (LKR) :', this.state.loading ? this.state.data?.approved_qty ? parseFloat(this.state.data?.unit_price * this.state.data?.approved_qty).toLocaleString('en-US') : parseFloat(this.state.data?.unit_price * this.state.data?.required_quantity).toLocaleString('en-US') : "Loading")}
                                            </Grid>
                                        </Grid>
                                        <br />
                                    </Grid>

                                    <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} sm={12} md={12} lg={12}>

                                        <><AppBar position="static" color="default">
                                                    <Tabs
                                                        value={this.state.value}
                                                        onChange={this.handleChange}
                                                        // aria-label="basic tabs example"
                                                        variant="fullWidth"
                                                        indicatorColor="primary"
                                                        textColor="primary"
                                                        aria-label="full width tabs example"

                                                    >
                                                        <Tab
                                                            label="Add Supplier Details"
                                                            // style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                            {...a11yProps(0)}
                                                        />
                                                        <Tab
                                                            label="Quotation Analysis Report"
                                                            // style={{ border: "1px solid rgb(229, 231, 235)" }}
                                                            {...a11yProps(1)}
                                                        />
                                                    </Tabs>
                                                </AppBar>
                                                {/* </Box> */}
                                                <TabPanel value={this.state.value} index={0}>
                                                    {this.state.createQuotation ?
                                                        <>
                                                            <Grid
                                                                className=" w-full mt-5"
                                                                item
                                                                lg={12}
                                                                md={12}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <Grid container spacing={2}>
                                                                    <CardTitle title='Add Supplier Details' style={{ marginLeft: "8px" }} />
                                                                    
                                                                    <Grid item lg={12} md={12} sm={12} xs={12} >
                                                                        <ValidatorForm>
                                                                        <Grid container spacing={2}>
                                                                            <Grid item  lg={3} md={3} sm={12} xs={12}>
                                                                                    <SubTitle title="Search Here" />
                                                                                    <TextValidator
                                                                                        placeholder="Search"
                                                                                        fullWidth
                                                                                        variant="outlined"
                                                                                        value={this.state.supplier_search}
                                                                                        size="small"
                                                                                        // value={this.state.supplier_filters.search}
                                                                                        onChange={(e)=>{

                                                                                            if (e.target.value.length  > 3) {
                                                                                                this.loadAllSuppliers(e.target.value)

                                                                                                this.setState({
                                                                                                    supplier_search : e.target.value
                                                                                                })
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                            </Grid>
                                                                            <Grid item  lg={3} md={3} sm={12} xs={12}>
                                                                                    <Button
                                                                                        className="mt-6"
                                                                                        progress={false}
                                                                                        type="submit"
                                                                                        scrollToTop={
                                                                                            true
                                                                                        }
                                                                                        startIcon="close"
                                                                                        onClick={()=>{
                                                                                            this.setState({
                                                                                                supplier_search : ''
                                                                                            },()=>{
                                                                                                this.loadAllSuppliers(null)
                                                                                            })
                                                                                            // this.loadAllSuppliers(null)
                                                                                        }}
                                                                                    >
                                                                                        <span className="capitalize">
                                                                                            Clear
                                                                                        </span>
                                                                                    </Button>
                                                                            </Grid>
                                                                        </Grid>
                                                                        </ValidatorForm>
                                                                        {this.state.selecedCount ?
                                                                        <Grid container display='flex' alignItems='center' justifyContent='center'>
                                                                            <Grid item>
                                                                                <p className='pt-3 pb-3 pl-20 pr-20' 
                                                                                    style={{backgroundColor: '#D4F1F4', border:'1px solid #75E6DA', borderRadius:'5px'}}>
                                                                                    {this.state.selecedCount} supplire is selected. 
                                                                                    <Tooltip title="View">
                                                                                        <IconButton
                                                                                            onClick={() => {
                                                                                                this.setState({
                                                                                                    open_supplier_list:true
                                                                                                })
                                                                                            }}>
                                                                                            <AssignmentIcon/>
                                                                                            
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </p>
                                                                            </Grid>
                                                                        </Grid>
                                                                        :
                                                                        <Grid container display='flex' alignItems='center' justifyContent='center'>
                                                                            <Grid item>
                                                                                <p className='pt-3 pb-3 pl-20 pr-20' 
                                                                                style={{backgroundColor: '#D4F1F4', border:'1px solid #75E6DA', borderRadius:'5px'}}>
                                                                                    0 supplire is selected.</p>
                                                                            </Grid>
                                                                        </Grid>
                                                                        }
                                                                        {this.state.supplier_loading ?
                                                                            <LoonsTable
                                                                                //title={"All Aptitute Tests"}
                                                                                id={'all_items'} data={this.state.supplier_data} columns={this.state.supplier_column}
                                                                                options={{
                                                                                    pagination: true,
                                                                                    serverSide: true,
                                                                                    count: this.state.totalSupplierItems,
                                                                                    rowsPerPage: this.state.supplier_filters.limit,
                                                                                    page: this.state.supplier_filters.page,
                                                                                    print: true,
                                                                                    viewColumns: true,
                                                                                    download: true,
                                                                                    onTableChange: (action, tableState) => {
                                                                                        console.log(action, tableState)
                                                                                        switch (action) {
                                                                                            case 'changePage':
                                                                                                this.setSupplierPage(tableState.page)
                                                                                                break
                                                                                            case 'sort':
                                                                                                // this.sort(tableState.page, tableState.sortOrder);
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
                                                                    <Grid
                                                                        item="item"
                                                                        lg={12}
                                                                        md={12}
                                                                        sm={12}
                                                                        xs={12}
                                                                        style={{
                                                                            display: 'flex',
                                                                            marginTop: '24px',
                                                                            paddingRight: 0,
                                                                            justifyContent: 'flex-end'
                                                                        }}>
                                                                        <Button type="submit"
                                                                            // disabled={!(this.state.selecedCount > 2)}
                                                                            onClick={() => this.setState({ confirmMsg: true })}
                                                                            startIcon={<KeyboardDoubleArrowRightIcon />}
                                                                        >
                                                                            <span className="capitalize">Save</span>
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                        : null
                                                    }
                                                </TabPanel>
                                                <TabPanel value={this.state.value} index={1} >
                                                    <>
                                                        <Grid
                                                            className=" w-full mt-5"
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <Grid container spacing={2} >
                                                                <CardTitle title='Quotation Analysis Report' style={{ marginLeft: "8px" }} />

                                                                    {/* <Grid item lg={12} md={12} sm={12} xs={12} >
                                                                            <ValidatorForm>
                                                                            <Grid container spacing={2}>
                                                                                <Grid item  lg={3} md={3} sm={12} xs={12}>
                                                                                        <SubTitle title="Quotation Number" />
                                                                                        <TextValidator
                                                                                            placeholder="Quotation Number"
                                                                                            fullWidth
                                                                                            variant="outlined"
                                                                                            size="small"
                                                                                            value={this.state.supplier_filters.search}
                                                                                            onChange={(e)=>{
                                                                                                let supp  = this.state.supplire_list_data
                                                                                                supp.quotation_no = e.target.value
                                                                                                
                                                                                                this.setState({
                                                                                                    supp
                                                                                                })
                                                                                            }}
                                                                                        />
                                                                                </Grid>
                                                                                <Grid item  lg={3} md={3} sm={12} xs={12}>
                                                                                        <Button
                                                                                            className="mt-6"
                                                                                            progress={false}
                                                                                            type="submit"
                                                                                            scrollToTop={
                                                                                                true
                                                                                            }
                                                                                            startIcon="search"
                                                                                            onClick={()=>{this.getSupplierPrintDet()}}
                                                                                        >
                                                                                            <span className="capitalize">
                                                                                                Search
                                                                                            </span>
                                                                                        </Button>
                                                                                </Grid>
                                                                            </Grid>
                                                                            </ValidatorForm>
                                                                        </Grid> */}

                                                                <Grid item lg={12} md={12} sm={12} xs={12} >
                                                                <Button
                                                                    className="mt-6"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={
                                                                        true
                                                                    }
                                                                    // style={{backgroundColor:'yellow'}}
                                                                    startIcon="print"
                                                                    onClick={()=>{this.copyOfHospitalPrint()}}
                                                                >
                                                                    <span className="capitalize">
                                                                        Copy of Hospital print
                                                                    </span>
                                                                </Button>
                                                                </Grid>
                                                                
                                                                <Grid item lg={12} md={12} sm={12} xs={12}>

                                                                    {console.log('supplier loading',this.state.supplier_loading )}
                                                                    {this.state.supplier_loading ?
                                                                        <LoonsTable
                                                                            //title={"All Aptitute Tests"}
                                                                            id={'all_items'} data={this.state.selectedSupplier_printList} columns={this.state.selected_supplier_printList_column}
                                                                            options={{
                                                                                pagination: true,
                                                                                serverSide: true,
                                                                                count: this.state.totalItemList,
                                                                                rowsPerPage: this.state.supplire_list_data.limit,
                                                                                page: this.state.supplire_list_data.page,
                                                                                print: true,
                                                                                viewColumns: true,
                                                                                download: true,
                                                                                onTableChange: (action, tableState) => {
                                                                                    console.log(action, tableState)
                                                                                    switch (action) {
                                                                                        case 'changePage':
                                                                                            this.setPage(tableState.page)
                                                                                            break
                                                                                        case 'sort':
                                                                                            // this.sort(tableState.page, tableState.sortOrder);
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
                                                </TabPanel>
                                                {/* <TabPanel value={this.state.value} index={2}>
                                                    <RejectedLPRequest />
                                                </TabPanel>
                                                <TabPanel value={this.state.value} index={3}>
                                                    <AllLocalPurchaseRequest />
                                                </TabPanel> */}
                                            </>
                                            {/* </Box> */}
                                        </Grid>
                                    </Grid>


                                   

                                    {/* {this.state.printWindow ? */}
                                        
                                    {/* :null} */}
                                </Grid>
                            </Grid>
                        </Grid>
                    </LoonsCard>
                </MainContainer>
                {this.state.ploaded ?
                    // <PurchaseOrderList />
                    <LpPrint purchaseOrderData={this.state.purchaseOrderData} hospital={this.state.hospital} supplier={this.state.supplier} user={this.state.user} uom={this.state.Uom_Data} />
                    :
                    <Grid className="justify-center text-center w-full pt-12">
                        {/* <CircularProgress size={30} /> */}
                    </Grid>
                }
                <Dialog fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.open}
                >
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Quotation Details" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ open: false })         
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm onSubmit={()=>{this.saveQuotation()}}>
                            <Grid container spacing={2}>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Closing Date" />
                                    <MuiPickersUtilsProvider
                                        utils={MomentUtils}
                                        className="w-full"
                                    >
                                        <KeyboardDateTimePicker
                                            className="w-full"
                                            inputVariant="outlined"
                                            clearable
                                            value={
                                                (this.state.formData.closingDate)
                                            }
                                            placeholder='Enter Date'
                                            minDate={new Date()}
                                            autoOk={true}
                                            size='small'
                                            onChange={(date) => {
                                                this.setState({
                                                    formData: {
                                                        ...this
                                                            .state
                                                            .formData,
                                                        closingDate:
                                                            dateTimeParse(date),
                                                    },
                                                })
                                            }}
                                            required={true}
                                        />
                                    </MuiPickersUtilsProvider>
                                    {/* <LoonsDatePicker className="w-full"
                                        value={this.state.formData.closingDate}
                                        placeholder="Enter Date"
                                        minDate={new Date()}
                                        required={true}
                                        size='small'
                                        onChange={(date) => {
                                            this.setState({
                                                formData: {
                                                    ...this
                                                        .state
                                                        .formData,
                                                    closingDate:
                                                        dateParse(date),
                                                },
                                            })
                                        }}
                                        format='dd/MM/yyyy'
                                    /> */}
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Delivery OK (On / Before)" />
                                    <MuiPickersUtilsProvider
                                        utils={MomentUtils}
                                        className="w-full"
                                    >
                                        <KeyboardDateTimePicker
                                            className="w-full"
                                            inputVariant="outlined"
                                            clearable
                                            value={
                                                (this.state.formData.delivery)
                                            }
                                            placeholder='Enter Date'
                                            minDate={new Date()}
                                            autoOk={true}
                                            size='small'
                                            onChange={(date) => {
                                                this.setState({
                                                    formData: {
                                                        ...this
                                                            .state
                                                            .formData,
                                                        delivery:
                                                        dateTimeParse(date),
                                                    },
                                                })
                                            }}
                                            required={true}
                                        />
                                    </MuiPickersUtilsProvider>
                                    {/* <LoonsDatePicker className="w-full"
                                        value={this.state.formData.delivery}
                                        placeholder="Enter Date"
                                        minDate={new Date()}
                                        required={true}
                                        size='small'
                                        onChange={(date) => {
                                            this.setState({
                                                formData: {
                                                    ...this
                                                        .state
                                                        .formData,
                                                    delivery:
                                                        dateParse(date),
                                                },
                                            })
                                        }}
                                        format='dd/MM/yyyy'
                                    /> */}
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Sample Needed" />
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            name="yesno"
                                            // aria-disabled
                                            value={this.state.formData.selected}
                                            onChange={(e) => {
                                                let formData = this.state.formData
                                                formData.selected = e.target.value === 'true' ? true : false
                                                this.setState({ formData })
                                            }}
                                            style={{ display: "block", marginTop: "3px" }}
                                        >
                                            <FormControlLabel
                                                // disabled
                                                value={true}
                                                control={<Radio />}
                                                label={"Yes"}
                                            />
                                            <FormControlLabel
                                                // disabled
                                                value={false}
                                                control={<Radio />}
                                                label={"No"}
                                            />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {
                                    this.state.formData.selected &&
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Date" />
                                        <MuiPickersUtilsProvider
                                            utils={MomentUtils}
                                            className="w-full"
                                        >
                                            <KeyboardDateTimePicker
                                                className="w-full"
                                                inputVariant="outlined"
                                                value={
                                                    this.state.formData.sampleDate
                                                }
                                                placeholder='Enter Date'
                                                minDate={new Date()}
                                                size='small'
                                                autoOk={true}
                                                clearable
                                                required={true}
                                                onChange={(date) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this
                                                                .state
                                                                .formData,
                                                            sampleDate:
                                                            dateTimeParse(date),
                                                        },
                                                    })
                                                }}
                                            />
                                        </MuiPickersUtilsProvider>
                                        {/* <LoonsDatePicker className="w-full"
                                            value={this.state.formData.sampleDate}
                                            placeholder="Enter Date"
                                            minDate={new Date()}
                                            required={true}
                                            size='small'
                                            onChange={(date) => {
                                                this.setState({
                                                    formData: {
                                                        ...this
                                                            .state
                                                            .formData,
                                                        sampleDate:
                                                            dateParse(date),
                                                    },
                                                })
                                            }}
                                            format='dd/MM/yyyy'
                                        /> */}
                                    </Grid>
                                }
                                <Grid
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    style={{
                                        display: 'flex',
                                        marginTop: '12px',
                                        justifyContent: 'flex-end'
                                    }}>
                                    <Button
                                        // type="reset"
                                        className='mr-2'
                                        style={{ backgroundColor: "#FF0800" }}
                                        onClick={() => this.setState({ open: false })}
                                        startIcon='close'
                                    >
                                        <span className="capitalize">Cancel</span>
                                    </Button>
                                    <Button
                                        type="submit"
                                        // onClick={() => this.setState({ open: false })}
                                        startIcon={<KeyboardDoubleArrowRightIcon />}
                                    >
                                        <span className="capitalize">Proceed</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </div>
                </Dialog>
                {this.state.qprintLoad ?
                <>
                    <div className='hidden'>
                        {console.log('checking print pass dataset', this.state.hospital)}
                        <LPPrintView ref={this.componentRef} hospital={this.state.hospital} id={this.props.match.params.id} lpSupplierInfo={this.state.supplierInfo}/>
                    </div>
                
                    <ReactToPrint
                        trigger={() => <button className='hidden' id="LP_QUOTATION_PRINT">Print</button>} // Render nothing as trigger since you want to trigger it programmatically
                        onBeforeGetContent={() => console.log('Clicked the Print')}
                        content={() => this.componentRef.current} // Access the ref's current property and call a method in the child component
                        pageStyle={pageStyle}
                    // documentTitle={letterTitle}
                />
                </>
                :null} 

                {this.state.hospitalCopy ?
                <>
                    <div className='hidden'>
                        {/* {console.log('checking print pass dataset', this.state.hospital)} */}
                        <LPHospitalPrintCopy ref={this.componentRef} hospital={this.state.hospital} id={this.props.match.params.id} lpSupplierInfo={this.state.supplierInfo}/>
                    </div>
                
                    <ReactToPrint
                        trigger={() => <button className='hidden' id="LP_HOSPITAL_PRINT_COPY">Print</button>} // Render nothing as trigger since you want to trigger it programmatically
                        onBeforeGetContent={() => console.log('Clicked the Print')}
                        content={() => this.componentRef.current} // Access the ref's current property and call a method in the child component
                        pageStyle={pageStyle}
                    // documentTitle={letterTitle}
                />
                </>
                :null} 

                <Dialog fullWidth maxWidth="md" open={this.state.open_supplier_list}>

                    <Grid item="item" lg={12} md={12} xs={12} className='ml-5 mr-5 mt-5'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <CardTitle title="Selected Supplier List"></CardTitle>
                            <IconButton aria-label="close" onClick={() => { this.setState({ open_supplier_list: false }) }}><CloseIcon /></IconButton>
                        </div>
                    </Grid>

                    <Divider></Divider>

                    <div className="w-full h-full mt-5 mb-5 ml-5 mr-5 ">
                    <LoonsTable
                        id={'all_items'} 
                        data={this.state.selected_list} 
                        columns={this.state.selected_supplier_list_column}
                        options={{
                            pagination: false,
                            serverSide: false,
                            count: this.state.selecedCount,
                            print: false,
                            viewColumns: false,
                            download: false,
                        }}
                        ></LoonsTable>
                    </div>
                </Dialog>

                <Dialog fullWidth maxWidth="md" open={this.state.confirmMsg}>

                    {/* <Grid item="item" lg={12} md={12} xs={12} className='ml-5 mr-5 mt-5'>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <CardTitle title="Selected Supplier List"></CardTitle>
                            <IconButton aria-label="close" onClick={() => { this.setState({ open_supplier_list: false }) }}><CloseIcon /></IconButton>
                        </div>
                    </Grid>

                    <Divider></Divider> */}

                    <div className="w-full h-full mt-5 mb-5 ml-5 mr-5 " style={{height:'75px', overflow: 'scroll'}}>
                    <LoonsTable
                        id={'all_items'} 
                        data={this.state.selected_list} 
                        columns={this.state.selected_supplier_list_column}
                        options={{
                            pagination: false,
                            serverSide: false,
                            count: this.state.selecedCount,
                            print: false,
                            viewColumns: false,
                            download: false,
                        }}
                        ></LoonsTable>
                    </div>

                    <Grid container className='mt-3 ml-5'>
                        <Grid item>
                            <p style={{fontWeight:'bold'}}>Are you sure you want to submit?</p>
                        </Grid>
                    </Grid>

                    <DialogActions>
                        <Button onClick={()=>{
                            this.setState({
                                confirmMsg: false,
                                open: true
                            })
                        }}>Yes</Button>
                        <Button style={{backgroundColor:'red'}} onClick={ ()=>{
                              this.setState({
                                confirmMsg: false
                            })
                        }} autoFocus>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>


                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(IndividualPurchaseDetails)
