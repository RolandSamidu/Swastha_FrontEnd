import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    LoonsTable,
    DatePicker
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse, includesArrayElements } from 'utils'

import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import InventoryService from 'app/services/InventoryService';
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import EmployeeServices from 'app/services/EmployeeServices'
import PharmacyService from 'app/services/PharmacyService'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import localStorageService from 'app/services/localStorageService'

import PrintIcon from '@mui/icons-material/Print';
import LPPrintView from './LPPrintView'
import ClinicService from 'app/services/ClinicService'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'

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

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null }) => (
    <Autocomplete
        disableClearable
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
                {tail ? <div
                    style={{
                        position: 'absolute',
                        top: '7.5px',
                        right: 8,
                    }}
                    onClick={null}
                >
                    {tail}
                </div> : null}
            </div >
        )}
    />)

class AllLocalPurchaseRequest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isOverflow: false,
            role: null,
            open: false,
            itemList: [],
            single_data: {},
            appPerson:[],
            warehousesData:[],

            enableDates: false,
            isCreated :false,
            isRequired :false,


            userRoles: [],
            selected_id: null,
            collapseButton: 0,
            data: [],
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
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.required_date ? dateParse(this.state.data[tableMeta.rowIndex]?.required_date) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'institute', 
                    label: 'Institute',
                    options: {
                        
                        customBodyRender: (value, tableMeta, updateValue) => {


                            // console.log('incomming data', this.state.hospitalData)
                            // console.log('incomming data ---------', this.state.data)

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
                    label: 'From',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let HospitalData = this.state.hospitalData.find((e)=>e?.owner_id === this.state.data[tableMeta.rowIndex]?.owner_id)
                            return (
                                <p>{this.state.data[tableMeta.rowIndex] ?.Pharmacy_drugs_store?.name ? this.state.data[tableMeta.rowIndex] ?.Pharmacy_drugs_store?.name+ ' ' + this.state.data[tableMeta.rowIndex]?.LPRequest ?.Pharmacy_drugs_store?.Department?.name : HospitalData?.name} </p>
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
                                <p>{this.state.data[tableMeta.rowIndex]?.ItemSnap ? this.state.data[tableMeta.rowIndex]?.ItemSnap?.sr_no : this.state.data[tableMeta.rowIndex]?.item_name ? "New Item ((-)Serial Number)" : 'Not Available'}</p>
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
                        
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let approved = this.state?.appPerson.filter((e)=>e?.lp_request_id === this.state.data[tableMeta.rowIndex]?.id)

                            let approved_types = approved.map((e)=>e.approval_user_type)
                            // console.log('cheking app',approved )

                            if (this.state.data[tableMeta.rowIndex]?.status === 'Pending Approval'){
                                return (
                                    <p>{this.state.data[tableMeta.rowIndex]?.status + ' (' + approved_types + ' )'}</p>
                                )
                            } else {
                                return (
                                    <p>{this.state.data[tableMeta.rowIndex]?.status}</p> 
                                )
                            }
                            
                        }
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
                            return (
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
            dpInstitution:[],

            enableDates: false,
            isCreated :false,
            isRequired :false,

            loading: false,
            single_loading: false,
            totalItems: 0,

            all_item_category: [],

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

            all_Suppliers: [],
            all_manufacture: [],

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

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let formData = this.state.filterData;
        let user_roles = await localStorageService.getItem('userInfo').roles
        console.log('jkkllo_____oiiuuytree', user_roles[0])

        let owner_id = await localStorageService.getItem('owner_id')
        if (includesArrayElements(user_roles, ['MSD SCO', 'MSD SCO Supply','HSCO', 'MSD AD', 'MSD Director', 'MSD DDG'])) {
            owner_id = null
        } else if (includesArrayElements(user_roles,['Devisional Pharmacist','RDHS'])){
            let owner_id_list = this.state.dpInstitution.map((dataset) => dataset?.owner_id)
            let uniquOwnerrIds = [...new Set(owner_id_list)]
            owner_id = uniquOwnerrIds
        }
        const { sr_no, item_name, ...formData } = this.state.filterData

        let res = await LocalPurchaseServices.getLPRequest({ ...formData, owner_id: owner_id })

        if (res.status === 200) {
            // console.log('LP Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems },()=>{
                this.loadHospitals(res?.data?.view?.data)
                this.getApprovedPerson(res.data.view.data)
            })
        }

        this.setState({ loading: true })
    }

    loadItemData = async () => {
        let formData = this.state.filterData
        if (formData.item_name && formData.item_name.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.item_name,/*  is_prescrible: "true", limit: 10, page: 0, */ 'order[0]': ['sr_no', 'ASC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        } else if (formData.sr_no && formData.sr_no.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.sr_no,/*  is_prescrible: "true", limit: 10, page: 0,  */'order[0]': ['sr_no', 'ASC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        }
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

    async loadHospitals(mainData){
        console.log('checkinf min data' , mainData)
        let params = { 
            issuance_type: ["Hospital", "RMSD Main"], 
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: mainData?.map(x=>x?.owner_id)
        };
    
        console.log('checkinf id', mainData?.map(x=>x?.Pharmacy_drugs_store?.owner_id))

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('ceking ospital', res.data.view.data)
            this.setState({
                hospitalData:res.data.view.data
            })
        }

    }

    async getApprovedPerson(data){
        // console.log('data cheking', data)

        let id
        for (let i = 0; i < data.length; i++){

            if (data[i].status === 'Pending Approval') {
                // console.log('data cheking ok', data)
                id = data.map((e)=>e.id)
            }
        }

        // console.log('data cheking id', id)
        const newFormData = { 
            status: "Pending", 
            lp_request_id: id
        }
        let res = await LocalPurchaseServices.getLPRequestApprovals(newFormData) 

        if (res.status === 200){
            console.log('cheking data - 1', res)
            this.setState({
                appPerson:res?.data?.view?.data
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        this.setState({
            formData
        }, () => {
            // console.log("New Form Data: ", this.state.formData)
            this.loadData()
        })
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            // console.log('files', this.state.files)
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

    async loadCategories() {
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
    }

    componentDidMount() {
        let roles = localStorageService.getItem('userInfo')?.roles
        this.setState({
            role: roles[0],
            userRoles: roles
        }, () => {
            // this.loadData()
            this.getWarehouse()
            this.detDPInstitution()
            this.loadCategories()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filterData.item_name !== this.state.filterData.item_name || prevState.filterData.sr_no !== this.state.filterData.sr_no) {
            this.loadItemData();
        }
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <CardTitle title="All LP Request" />
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
                                                    //         .search
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
                                            {/* Description*/}
                                            {/* <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Status" />
                                                <Autocomplete
                                                    className="w-full"
                                                    options={appConst.lp_status}
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.status =
                                                                e.target.value
                                                            this.setState({
                                                                filterData,
                                                            })
                                                        }
                                                    }}
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
                                                            value={
                                                                this.state.filterData
                                                                    .status
                                                            }
                                                        />
                                                    )}
                                                />
                                            </Grid> */}
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
                                                    sm={6}
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
                    {this.state.ploaded ?
                        // <PurchaseOrderList />
                        <LPPrintView purchaseOrderData={this.state.purchaseOrderData} hospital={this.state.hospital} supplier={this.state.supplier} user={this.state.user} />
                        :
                        <Grid className="justify-center text-center w-full pt-12">
                            {/* <CircularProgress size={30} /> */}
                        </Grid>
                    }
                </div>
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

export default withStyles(styleSheet)(AllLocalPurchaseRequest)
