import React, { Component, Fragment, useState } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Dialog,
    Divider,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    Collapse
} from '@material-ui/core'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse, includesArrayElements } from 'utils'

import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import PrescriptionService from 'app/services/PrescriptionService';
import InventoryService from 'app/services/InventoryService';
import PharmacyService from 'app/services/PharmacyService'
import EmployeeServices from 'app/services/EmployeeServices'

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import BackupTableIcon from '@mui/icons-material/BackupTable';
import localStorageService from 'app/services/localStorageService'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import PrintIcon from '@mui/icons-material/Print';
import LPPrintView from './LPPrintView'
import ClinicService from 'app/services/ClinicService'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null }) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    };
    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Autocomplete
            disableClearable
            onFocus={handleFocus}
            onBlur={handleBlur}
            options={options}
            getOptionLabel={getOptionLabel}
            // id="disable-clearable"
            onChange={onChange}
            value={val}
            size='small'
            renderInput={(params) => (
                < div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                    <input type="text" {...params.inputProps}
                        style={{ marginTop: '5.5px', padding: '6.5px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                        placeholder={`⊕ ${text}`}
                        onChange={onChange}
                        value={val}
                    // required
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '7.5px',
                            right: 8,
                        }}
                        onClick={null}
                    >
                        {isFocused ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </div>
                </div >
            )}
        />);
}

class CompletedLPRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isOverflow: false,
            role: null,
            open: false,
            itemList: [],
            warehousesData: [],
            single_data: {},

            all_item_category:[],

            enableDates: false,
            isCreated :false,
            isRequired :false,

            msdDirector:null,

            category: [
                { label: 'Pharmaceutical' },
                { label: 'Surgical' },
            ],

            selected_id: null,
            collapseButton: 0,
            userRoles: [],
            data: [],
            supplierDataList:[],
            columns: [
                {
                    name: 'request_id', // field name in the row object
                    label: 'Request ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
               
                {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('teq dtatette',this.state.data )
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.required_date ? dateParse(this.state.data[tableMeta.rowIndex]?.required_date) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.ItemSnap ? this.state.data[tableMeta.rowIndex]?.ItemSnap.sr_no : this.state.data[tableMeta.rowIndex]?.item_name ? "New Item ((-)Serial Number)" : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.ItemSnap ? this.state.data[tableMeta.rowIndex]?.ItemSnap?.medium_description : this.state.data[tableMeta.rowIndex]?.item_name ? this.state.data[tableMeta.rowIndex]?.item_name : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'requested_by',
                    label: 'Requested By',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Employee ? this.state.data[tableMeta.rowIndex]?.Employee?.name : 'Not Available'}</p>
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

                            let HospitalData = this.state.hospitalData.find((e)=>e?.owner_id === this.state.data[tableMeta.rowIndex]?.owner_id)
                            
                            return (
                                <p>{HospitalData?.name ? HospitalData?.name + '( ' + HospitalData?.Department?.name + ' )' : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'warehouse', 
                    label: 'Primary Warehose',
                    options: {
                        
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let warehouse = this.state.warehousesData.find((e)=>e?.id === this.state.data[tableMeta.rowIndex]?.ItemSnap?.primary_wh)
                            
                            return (
                                <p>{warehouse?.name ? warehouse?.name : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'From',
                    label: 'Requested From',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let HospitalData = this.state.hospitalData.find((e)=>e?.owner_id === this.state.data[tableMeta.rowIndex]?.owner_id)
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Pharmacy_drugs_store?.name ? this.state.data[tableMeta.rowIndex]?.Pharmacy_drugs_store?.name+ ' ' + this.state.data[tableMeta.rowIndex]?.Pharmacy_drugs_store?.Department?.name : HospitalData?.name}</p>
                            )
                        }
                    },
                },
                {
                    name: 'required_quantity',
                    label: 'Required Quantity',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.required_quantity ? String(parseInt(this.state.data[tableMeta.rowIndex]?.required_quantity, 10)) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex]?.id
                            let cost = this.state.data[tableMeta.rowIndex]?.cost
                            return (
                                <>
                                    {
                                        
                                            <Grid container>
                                                <Grid item lg={3} md={4} sm={6} xs={12}>
                                                    <Tooltip title="View LP">
                                                        <IconButton
                                                            className="text-black mr-2"
                                                            onClick={() => {
                                                                window.location = `/localpurchase/view/${id}`
                                                            }}
                                                        >
                                                            <Icon color='primary'>visibility</Icon>
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid> 
                                            
                                    }
                                </>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],
            hospitalData:[],

            loading: false,
            single_loading: false,
            totalItems: 0,

            filterData: {
                // item_name: null,
                // sr_no: null,
                // item_id: null,
                // request_id: null,
                // requested_by: null,
                // status: null,
                // search: null,
                start_sr_no: null,
                end_sr_no: null,
                start_date: null,
                end_date: null,
                item_name: null,
                request_id: null,
                institutional_code: null,
                warehouse_code: null,
                // consultant_id: null,
                status: null,
                category: null,
                description: null,
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },

            consultant: [
                { id: 1, label: 'Haris' },
                { id: 2, label: 'Sadun' },
                { id: 3, label: 'Ishara' },
                { id: 4, label: 'Gayan' },
            ],

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },

            supplierInfo:{
                name:null,
                unit_price:null
            },

            all_Suppliers: [],
            all_manufacture: [],

            dpInstitution: [],

            formSingleData: {
                order_qty: null,
                po_by: "HOSPITAL",
                order_no: null,
                supplier_id: null,
                manufacture_id: null,
                lp_request_id: null,
                order_date: null,
                status: "Active",
                type: "lprequest",
                created_by: null,
                order_date_to: null,
                no_of_items: null,
                estimated_value: null,
                order_for_year: null,
                order_items: [],
                agent_id: 'd13941b2-7b77-42e7-ae5a-f07f9143a5dc',

                currency: "LKR",
                indent_no: null,
                // item_id: this.props.match.params.item_id
            },
        }
        
    }

    async detDPInstitution (){

        var info = await localStorageService.getItem('login_user_pharmacy_drugs_stores');
        let login_user_district = info[0]?.Pharmacy_drugs_store?.district

        let params = {
            issuance_type: ["RMSD Main"],
            'order[0]': ['createdAt', 'ASC'],
            district: login_user_district,
            // limit:1,
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('cheking institjhjj', res)
            this.setState({
                dpInstitution:res.data.view.data
            }, ()=>{
                this.loadData()
            })
            
        }
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let formData = this.state.filterData;
        let user_roles = await localStorageService.getItem('userInfo').roles
        let owner_id = await localStorageService.getItem('owner_id')
        if (includesArrayElements(user_roles, ['MSD SCO', 'MSD SCO Supply','HSCO', 'MSD AD', 'MSD Director', 'MSD DDG'])) {
            owner_id = null

        } else if (includesArrayElements(user_roles,['Devisional Pharmacist','RDHS','Accounts Clerk RMSD'])){
            let owner_id_list = this.state.dpInstitution.map((dataset) => dataset?.owner_id)
            let uniquOwnerrIds = [...new Set(owner_id_list)]
            owner_id = uniquOwnerrIds
        }
        const { sr_no, item_name, ...formData } = this.state.filterData

        let res = await LocalPurchaseServices.getLPRequest({ ...formData, owner_id: owner_id, status: ['PO CREATED'] })

        if (res.status === 200) {
            console.log('LP Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems }, ()=>{
                this.loadHospitals(res?.data?.view?.data)
            })
        }

        this.setState({ loading: true })
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New Form Data: ", this.state.formData)
            this.loadData()
            
        })
    }

    async getWarehouse(){
        let params = { 
            owner_id: '000'
        };
    
        let warehouses = await WarehouseServices.getWarehoure(params) 

        if (warehouses.status === 200) {
            console.log('ceking warehouse', warehouses.data.view.data)
            this.setState({
                warehousesData:warehouses.data.view.data
            })
        }

    }

    componentDidMount() {
        console.log('inc datattatata', this.props)
        let roles = localStorageService.getItem('userInfo')?.roles
        this.setState({
            roles: roles[0],
            userRoles: roles
        }, () => {
            this.detDPInstitution()
            this.getWarehouse()
            this.loadCategories()
        })
    }

    async getPharmacyDetails(search) {
        let params = {
            limit: 500,
            page: 0,
            issuance_type: ['Hospital', 'RMSD Main', 'MSD Main'],
            search: search
        };

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('phar------------------>>>>> check', res);

            this.setState({
                pharmacy_list: res.data.view.data
            });
        }
    }

    async loadHospitals(mainData){
        console.log('checkinf min data' , mainData)
        let params = { 
            issuance_type: ["Hospital", "RMSD Main"], 
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: mainData?.map(x=>x?.owner_id)
        };
    
        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('ceking ospital', res.data.view.data)
            this.setState({
                hospitalData:res.data.view.data
            })
        }

    }

    async loadCategories() {
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <CardTitle title="Approved Local Purchase" />
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.setPage(0)}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} className='mb-10' sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
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
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Start SR Number" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="SR Number"
                                                    name="sr_no"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .start_sr_no
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
                                                                start_sr_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon></SearchIcon>
                                                            </InputAdornment>
                                                        ),
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
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="End SR Number" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="SR Number"
                                                    name="sr_no"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .end_sr_no
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
                                                                end_sr_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon></SearchIcon>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            </Grid>
                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Item Name" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Item Name"
                                                    name="item_name"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    // value={
                                                    //     this.state.filterData
                                                    //         .item
                                                    // }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                search:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon></SearchIcon>
                                                            </InputAdornment>
                                                        ),
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
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Date Type" /> 
                                                <Autocomplete
                                                    disableClearable
                                                    className="w-full"
                                                    options={appConst.lp_date_range} 
                                                    onChange={(e, value) => {
                                                        
                                                        let formData =
                                                            this.state.filterData
                                                        formData.start_date=null
                                                        formData.end_date=null
                                                        formData.req_start_date=null 
                                                        formData.req_end_date=null
                                                        
                                                        if (value.label === 'Requested Date') {
                                                            this.setState({
                                                                enableDates: true,
                                                                isCreated :true,
                                                                isRequired :false,
                                                                formData
                                                            })
                                                        } else if (value.label === 'Required Date') {
                                                            this.setState({
                                                                enableDates: true,
                                                                isRequired :true,
                                                                isCreated :false,
                                                                formData
                                                            })
                                                        }
                                                    }}
                                                    // value={
                                                    //     this.state.all_pharmacy &&
                                                    //     this.state.all_pharmacy.find((v) => v.owner_id === this.state.formData.owner_id)
                                                    // }
                                                    getOptionLabel={(option) => (option.label)}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Institution"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            // onChange={(e) => {
                                                            //     if (e.target.value.length > 3) {
                                                            //         this.getPharmacyDetails(e.target.value);
                                                            //     }
                                                            // }}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Start Date" />
                                                <DatePicker
                                                    className="w-full"
                                                    value={
                                                        this.state.filterData.start_date || this.state.filterData.req_start_date
                                                    }
                                                    disabled ={!this.state.enableDates}
                                                    //label="Date From"
                                                    placeholder="Expiry Date"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date("2020-10-20")}
                                                    // required={true}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData =
                                                            this.state.filterData
                                                        if (this.state.isCreated) {
                                                            formData.start_date = date
                                                            this.setState({ formData })
                                                        } else if (this.state.isRequired) {
                                                            formData.req_start_date = date
                                                            this.setState({ formData })
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="End Date" />
                                                <DatePicker
                                                    className="w-full"
                                                    value={
                                                        this.state.filterData.end_date || this.state.filterData.req_end_date
                                                    }
                                                    disabled ={!this.state.enableDates}
                                                    //label="Date From"
                                                    placeholder="Expiry Date"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date("2020-10-20")}
                                                    // required={true}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let formData =
                                                            this.state.filterData

                                                        if (this.state.isCreated) {
                                                            formData.end_date = date
                                                            this.setState({ formData })
                                                        } else if (this.state.isRequired) {
                                                            formData.req_end_date = date
                                                            this.setState({ formData })
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Request ID" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Request ID"
                                                    name="request_id"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .request_id
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
                                                                request_id:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon></SearchIcon>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            </Grid>
                                            {/* Short Reference*/}
                                            {/* <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Start Date" />
                                                <DatePicker
                                                    className="w-full"
                                                    value={
                                                        this.state.filterData.start_date
                                                    }
                                                    //label="Date From"
                                                    placeholder="Expiry Date"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date("2020-10-20")}
                                                    // required={true}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let filterData =
                                                            this.state.filterData
                                                        filterData.start_date = date
                                                        this.setState({ filterData })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="End Date" />
                                                <DatePicker
                                                    className="w-full"
                                                    value={
                                                        this.state.filterData.end_date
                                                    }
                                                    //label="Date From"
                                                    placeholder="Expiry Date"
                                                    // minDate={new Date()}
                                                    //maxDate={new Date("2020-10-20")}
                                                    // required={true}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let filterData =
                                                            this.state.filterData
                                                        filterData.end_date = date
                                                        this.setState({ filterData })
                                                    }}
                                                />
                                            </Grid> */}
                                            {/* Description*/}
                                            
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Item Category" />
                                                <Autocomplete
                                                disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.all_item_category
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this.state
                                                                        .filterData,
                                                                    category_id:
                                                                        value.id,
                                                                },
                                                            })
                                                        }
                                                    }}
                                                    // value={this.state.formData.find(
                                                    //     (v) =>
                                                    //         v.id ==
                                                    //         this.state.filterData
                                                    //             .category_id
                                                    // )}
                                                    getOptionLabel={(option) => (option.code+" - "+option.description)}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Category Name"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {this.state.userRoles.includes('Drug Store Keeper') || this.state.userRoles.includes('Chief Pharmacist') || this.state.userRoles.includes('Hospital Director') ?
                                                <Grid
                                                    style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                    item
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
                                                            className=" w-full"
                                                        >
                                                            {/* Submit Button */}
                                                            <Button
                                                                className="mt-2"
                                                                progress={false}
                                                                type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="search"
                                                            //onClick={this.handleChange}
                                                            >
                                                                <span className="capitalize">
                                                                    Filter
                                                                </span>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                :
                                                <>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={4}
                                                        md={4}
                                                        sm={6}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Institutional Code" />
                                                        <Autocomplete
                                                            disableClearable
                                                            className="w-full"
                                                            options={this.state.pharmacy_list || []} 
                                                            onChange={(e, value) => {
                                                                if (value != null) {
                                                                    let formData = this.state.filterData;
                                                                    formData.from_owner_id = value.owner_id;
                                                                    this.setState({ formData });
                                                                } else {
                                                                    let formData = this.state.filterData;
                                                                    formData.from_owner_id = null;
                                                                    this.setState({ formData });
                                                                }
                                                            }}
                                                            value={
                                                                this.state.all_pharmacy &&
                                                                this.state.all_pharmacy.find((v) => v.owner_id === this.state.filterData.from_owner_id)
                                                            }
                                                            getOptionLabel={(option) => (option && option.name ? (option.name + ' - ' + option?.Department?.name) : '')}
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Institution"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    onChange={(e) => {
                                                                        if (e.target.value.length > 3) {
                                                                            this.getPharmacyDetails(e.target.value);
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={4}
                                                        md={4}
                                                        sm={6}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Warehouse" />
                                                        <Autocomplete
                                                            disableClearable
                                                            className="w-full"
                                                            options={this.state.warehousesData} 
                                                            onChange={(e, value) => {
                                                                console.log('ceking val', value)
                                                                if (value != null) {
                                                                    let formData = this.state.filterData;
                                                                    formData.primary_wh = value.id;
                                                                    this.setState({ formData });
                                                                } else {
                                                                    let formData = this.state.formData;
                                                                    formData.primary_wh = null;
                                                                    this.setState({ formData });
                                                                }
                                                            }}
                                                            // value={
                                                            //     this.state.all_pharmacy &&
                                                            //     this.state.all_pharmacy.find((v) => v.owner_id === this.state.formData.from_owner_id)
                                                            // }
                                                            getOptionLabel={(option) => (option && option.name ? (option.name) : '')}
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Warehouse"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    // onChange={(e) => {
                                                                    //     if (e.target.value.length > 3) {
                                                                    //         this.getPharmacyDetails(e.target.value);
                                                                    //     }
                                                                    // }}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    {/* <Grid
                                                        style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                        item
                                                        lg={8}
                                                        md={8}
                                                        sm={6}
                                                        xs={12}
                                                    >
                                                        <Grid container spacing={2}> */}
                                                             <Grid
                                                                item
                                                                lg={4}
                                                                md={4}
                                                                sm={6}
                                                                xs={12}
                                                                className=" w-full"
                                                            >
                                                                {/* Submit Button */}
                                                                <Button
                                                                    className="mt-6"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={
                                                                        true
                                                                    }
                                                                    size="small"
                                                                    startIcon="search"
                                                                //onClick={this.handleChange}
                                                                >
                                                                    <span className="capitalize">
                                                                        Filter
                                                                    </span>
                                                                </Button>
                                                            </Grid>
                                                        {/* </Grid>
                                                    </Grid> */}
                                                </>
                                            }
                                            {/* Submit and Cancel Button */}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                                <Grid item lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}>
                                                     <SubTitle title="Search" />
                                                        <TextValidator
                                                            className=" w-full"
                                                            placeholder="Item Name or Sr Number"
                                                            name="search"
                                                            InputLabelProps={{
                                                                shrink: false,
                                                            }}
                                                            value={
                                                                this.state.filterData
                                                                    .search
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
                                                                        search:
                                                                            e.target
                                                                                .value,
                                                                    },
                                                                })
                                                            }}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <SearchIcon></SearchIcon>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={1}
                                                    md={1}
                                                    sm={6}
                                                    xs={12}
                                                    className=" w-full"
                                                >
                                                    {/* Submit Button */}
                                                    <Button
                                                        className="mt-7 "
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="search"
                                                        size="small"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Search
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                            </Grid>
                            <br />
                            {/* Table Section */}
                            {this.state.loading ?
                                <Grid container className="mt-5 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,
                                                serverSide: true,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                print: true,
                                                count: this.state.totalItems,
                                                viewColumns: true,
                                                download: true,
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
                                                            this.setPage(
                                                                tableState.page
                                                            )
                                                            break
                                                        case 'changeRowsPerPage':
                                                            this.setState({
                                                                filterData: {
                                                                    limit: tableState.rowsPerPage,
                                                                    page: 0,
                                                                },
                                                            }, () => {
                                                                this.loadData()
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
                                </Grid>
                                :
                                (
                                    <Grid className='justify-center text-center w-full pt-12'>
                                        <CircularProgress size={30} />
                                    </Grid>
                                )
                            }
                        </Grid>
                    </ValidatorForm>
                </div>
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="lg"
                    open={this.state.open}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Create Purchase Order" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ open: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ marginRight: "20px" }}>
                                    {/* <SubTitle title={"LP Request No"}></SubTitle> */}
                                    <Typography className=" text-gray font-semibold text-13">LP Request No: </Typography>
                                </div>
                                <div>
                                    <Typography className='text-13'>{this.state.single_data ? this.state.single_data?.request_id : null}</Typography>
                                </div>
                            </div>
                            <div style={{ display: "flex" }}>
                                <div style={{ marginRight: "20px" }}>
                                    {/* <SubTitle title={"LP Request No"}></SubTitle> */}
                                    <Typography className=" text-gray font-semibold text-13">Requested By : </Typography>
                                </div>
                                <div>
                                    <Typography className='text-13'>{this.state.single_data?.Employee ? this.state.single_data?.Employee?.name + " / " + this.state.single_data?.Employee?.designation : null}</Typography>
                                </div>
                            </div>
                        </div>
                        <br />
                        <Typography className='text-20'>Item Details</Typography>
                        <Divider className='mt-2' />
                        <TableContainer style={{ margin: "12px 0 30px 0" }}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align='center'>SR Number</StyledTableCell>
                                        <StyledTableCell align="center">SR Description</StyledTableCell>
                                        <StyledTableCell align="center">Schedule&nbsp;Date</StyledTableCell>
                                        <StyledTableCell align="center">Order&nbsp;Quantity</StyledTableCell>
                                        <StyledTableCell align="center">Allocated&nbsp;Quantity</StyledTableCell>
                                        <StyledTableCell align="center">Order&nbsp;Qty</StyledTableCell>
                                        <StyledTableCell align="center">Status</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                {this.state.single_loading && this.state.single_data ?
                                    <TableBody>
                                        <StyledTableRow key={this.state.single_data?.id}>
                                            <StyledTableCell component="th" scope="row">
                                                {this.state.single_data?.ItemSnap?.sr_no ? this.state.single_data?.ItemSnap?.sr_no : 'Not Available'}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{this.state.single_data?.ItemSnap?.short_description ? this.state.single_data?.ItemSnap?.short_description : 'Not Available'}</StyledTableCell>
                                            <StyledTableCell align="center">{this.state.single_data?.required_date ? dateParse(this.state.single_data?.required_date) : 'Not Available'}</StyledTableCell>
                                            <StyledTableCell align="center">{this.state.single_data?.required_quantity ? this.state.single_data?.required_quantity : 'Not Available'}</StyledTableCell>
                                            <StyledTableCell align="center">{this.state.single_data?.allocated_quantity ? this.state.single_data?.allocated_quantity : 'Not Available'}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                                                <ValidatorForm>
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Order Qty"
                                                        //variant="outlined"
                                                        disabled
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        min={0}
                                                        value={
                                                            // this.state.selectedData[this.state.selectedData.indexOf(isadded[0])]?.qty
                                                            String(this.state.msdDirector ? this.state.msdDirector : 0)
                                                            // String(this.state.formSingleData.order_qty ? this.state.formSingleData.order_qty : 0
                                                        }
                                                        // onChange={(e, value) => {
                                                        //     // let selectedData = this.state.selectedData;
                                                        //     // selectedData[selectedData.indexOf(isadded[0])].qty = e.target.value
                                                        //     // this.setState({ selectedData })
                                                        //     let formData = this.state.formSingleData
                                                        //     if (e.target.value === '') {
                                                        //         formData.order_qty = 0
                                                        //     } else {
                                                        //         formData.order_qty = parseInt(e.target.value, 10)
                                                        //     }
                                                        //     this.setState({ formData })
                                                        // }}

                                                        validators={[
                                                            'required', 'minNumber: 0', 'maxNumber:' + parseInt(this.state.single_data?.required_quantity ? this.state.single_data?.required_quantity : 0 - this.state.single_data?.allocated_quantity ? this.state.single_data?.allocated_quantity : 0)
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required', 'Quantity Should Greater-than: 0 ', 'Over Quantity'
                                                        ]}
                                                    />
                                                </ValidatorForm>
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{this.state.single_data?.status ? this.state.single_data?.status : 'Not Available'}</StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                    : (
                                        <Grid className='justify-center text-center w-full pt-12'>
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )
                                }
                            </Table>
                        </TableContainer>
                        <Divider className='mt-2' />
                        <br />
                        {this.state.formSingleData.order_qty && this.state.formSingleData.order_qty > 0 ?
                            <ValidatorForm
                                ref="form"
                                onSubmit={() => { this.grouping() }}
                                onError={err => console.log("Error :", err)}
                            >
                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Supplier"}></SubTitle>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.supplierDataList}
                                            getOptionLabel={(option) => option?.Supplier?.name}
                                            // value={this.state.supplierInfo.name}
                                            onChange={(event, value) => {
                                                console.log('list checking', this.state.supplierDataList)
                                                let formData = this.state.formSingleData
                                                let supplierInfo = this.state.supplierInfo
                                                if (value != null) {
                                                    formData.supplier_id = value.supplier_id
                                                    supplierInfo.name = value.Supplier?.name
                                                    supplierInfo.unit_price = value.unit_price
                                                } else {
                                                    formData.supplier_id = null
                                                }
                                                this.setState({ formData, supplierInfo })
                                            }

                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Supplier"
                                                    //variant="outlined"
                                                    //value={}
                                                    // onChange={(e) => {
                                                    //     // if (e.target.value.length > 2) {
                                                    //     //     this.loadAllSuppliers(e.target.value)
                                                    //     // }
                                                    // }}
                                                    value={this.state.supplierInfo.name}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    validators={['required']}
                                                    errorMessages={['this field is required']}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    {/* <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Manufacture"}></SubTitle>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.all_manufacture}
                                            getOptionLabel={(option) => option.name}
                                            value={this.state.all_manufacture.find((v) => v.id == this.state.formSingleData.manufacture_id)}
                                            onChange={(event, value) => {
                                                let formData = this.state.formSingleData
                                                if (value != null) {
                                                    formData.manufacture_id = value.id
                                                } else {
                                                    formData.manufacture_id = null
                                                }
                                                this.setState({ formData })
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Manufacture"
                                                    //variant="outlined"
                                                    //value={}
                                                    onChange={(e) => {
                                                        if (e.target.value.length > 2) {
                                                            this.loadAllManufacture(e.target.value)
                                                        }
                                                    }}
                                                    value={this.state.all_manufacture.find((v) => v.id == this.state.formSingleData.manufacture_id)}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    validators={['required']}
                                                    errorMessages={['this field is required']}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Procurement No"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Procurement No"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formSingleData
                                                    .indent_no
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formSingleData;
                                                formData.indent_no = e.target.value
                                                this.setState({ formData })

                                            }}
                                            validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid> */}
                                    {/* <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Currency"}></SubTitle>
                                            <Autocomplete
                                                defaultValue={'LKR'}
                                                disableClearable
                                                className="w-full"
                                                options={appconst.all_currencies}
                                                getOptionLabel={(option) => option.cc}
                                                value={appconst.all_currencies.find((value) => value.cc == this.state.formData.currency)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    formData.currency = value.cc

                                                    this.setState({ formData })
                                                }

                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Currency"
                                                        //variant="outlined"
                                                        value={this.state.formData.currency}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                        validators={['required']}
                                                        errorMessages={['this field is required']}
                                                    />
                                                )}
                                            />
                                        </Grid> */}
                                </Grid>
                                < Button
                                    className="mt-2 mr-2"
                                    progress={false}
                                    scrollToTop={false}
                                    //onClick={() => {  }}
                                    type="submit"

                                >
                                    <span className="capitalize">Add Details</span>
                                </Button>
                            </ValidatorForm> : null
                        }
                        {this.state.formSingleData.order_items.length > 0 ?
                            < ValidatorForm
                                ref="form"
                                onSubmit={() => this.submitData()}
                                onError={() => null}
                            >
                                {this.state.formSingleData.order_items.map((item, index) => (
                                    <div style={{ backgroundColor: '#e8e8e8', borderRadius: '12px' }} className='px-10 mt-5 pb-5'>
                                        <Grid
                                            className="flex justify-around align-center"
                                            spacing={2}
                                        >
                                            <Grid item className="flex align-center" lg={11} md={11} sm={11} xs={11}>
                                                <Grid className="flex align-center" item style={{ alignItems: 'center' }}>
                                                    <SubTitle title={item.short_description + " - " + item.sr_no} />
                                                    <div className='mx-5'></div>
                                                    {this.calculateTotalQty(item)}
                                                </Grid>
                                            </Grid>
                                            <Grid item className="flex justify-end" lg={1} md={1} sm={1} xs={1}>
                                                <IconButton aria-label="collapse" className="mt-2" >
                                                    {this.state.collapseButton === index ?
                                                        <KeyboardArrowDownIcon onClick={() => this.setState({ collapseButton: -1 })}
                                                        /> :
                                                        <KeyboardArrowRightIcon onClick={() => this.setState({ collapseButton: index })}
                                                        />
                                                    }
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        <Collapse in={this.state.collapseButton === index} >
                                            <div>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                                        <SubTitle title={"Unit Price"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Enter Unit Price"
                                                            //variant="outlined"
                                                            disabled
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            type='number'
                                                            min={0}
                                                            style={{color:'black'}}
                                                            value={ this.state.supplierInfo.unit_price ? this.state.supplierInfo.unit_price : 0}
                                                            // value={this.state.formData.order_items[index].standard_cost}
                                                            // onChange={(e, value) => {
                                                            //     let formData = this.state.formData;
                                                            //     formData.order_items[index].standard_cost = e.target.value
                                                            //     this.setState({ formData })
                                                            // }}
                                                            validators={[
                                                                'required', 'minNumber: 0',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required', 'Unit Price should be > 0 '
                                                            ]}
                                                        />
                                                        <SubTitle title={"Schedule Details"}></SubTitle>
                                                    </Grid>
                                                    <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: "-16px" }}>
                                                        {item.schedule.map((scheduleItem, scheduleIndex) => (
                                                            <Grid container spacing={2}>
                                                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                                                    <DatePicker
                                                                        className="w-full"
                                                                        placeholder="Schedule Date"
                                                                        value={this.state.formSingleData.order_items[index].schedule[scheduleIndex].schedule_date}
                                                                        onChange={(date) => {
                                                                            let formData = this.state.formSingleData;
                                                                            formData.order_items[index].schedule[scheduleIndex].schedule_date = date
                                                                            formData.order_items[index].schedule[scheduleIndex].standard_cost = formData.order_items[index].standard_cost
                                                                            this.setState({ formData })
                                                                        }}
                                                                        minDate={scheduleIndex > 0 ? this.state.formSingleData.order_items[index].schedule[scheduleIndex - 1].schedule_date : new Date()}
                                                                        required={true}
                                                                        errorMessages={'this field is required'}
                                                                    />
                                                                </Grid>
                                                                <Grid item lg={3} md={3} sm={3} xs={3}>
                                                                    <TextValidator
                                                                        className="w-full"
                                                                        variant="outlined"
                                                                        placeholder="Quantity"
                                                                        size="small"
                                                                        type='number'
                                                                        min={0}
                                                                        onBlur={() => this.onBlur(index)}
                                                                        onFocus={() => this.setRemainingQuantity(index, scheduleIndex)}
                                                                        value={this.state.formSingleData.order_items[index].schedule[scheduleIndex].quantity}
                                                                        onChange={(e) => {
                                                                            let formData = this.state.formSingleData;
                                                                            formData.order_items[index].schedule[scheduleIndex].quantity = e.target.value
                                                                            this.setState({ formData })
                                                                        }}
                                                                        validators={['required', 'minNumber: 0', 'maxNumber:' + this.state.formSingleData.order_items[index].schedule[scheduleIndex].maxQuantity]}
                                                                        errorMessages={['this field is required', 'Quantity should be > 0', 'Over Quantity']}
                                                                    />
                                                                </Grid>
                                                                <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                                                                    {(this.state.formData.order_items[index].schedule.length - 1) == scheduleIndex ?
                                                                        <IconButton aria-label="add" disabled={this.state.isOverflow}>
                                                                            <AddCircleOutlineIcon
                                                                                onClick={() => {
                                                                                    this.addNewSchedule(index, scheduleIndex)
                                                                                }}
                                                                            />
                                                                        </IconButton>
                                                                        : null}
                                                                </Grid>
                                                            </Grid>
                                                        ))
                                                        }
                                                    </Grid>
                                                    <Grid item lg={12} md={12} sm={12} xs={12} style={{ marginTop: "-20px" }}>
                                                        <SubTitle title={"Additional Condition"}></SubTitle>
                                                        <TextValidator
                                                            className='w-full'
                                                            placeholder="Additional Condition"
                                                            //variant="outlined"
                                                            multiline={true}
                                                            rows={4}
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={this.state.formData.order_items[index].additional_condition}
                                                            onChange={(e, value) => {
                                                                let formData = this.state.formData;
                                                                formData.order_items[index].additional_condition = e.target.value
                                                                this.setState({ formData })
                                                            }}
                                                        /*  validators={[
                                                             'required'
                                                         ]}
                                                         errorMessages={[
                                                             'this field is required'
                                                         ]} */
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Collapse>
                                    </div>
                                ))
                                }
                                < Button
                                    className="mt-2 mr-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                >
                                    <span className="capitalize">Submit</span>
                                </Button>
                            </ValidatorForm>
                            : null}
                    </div>
                </Dialog>
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

export default withStyles(styleSheet)(CompletedLPRequest)
