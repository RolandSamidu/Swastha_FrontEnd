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
    Tooltip
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import localStorageService from 'app/services/localStorageService'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import ClinicService from 'app/services/ClinicService'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse, includesArrayElements, roundDecimal } from 'utils'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'

const styleSheet = (theme) => ({})

class ApprovalItemDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            role: null,
            totalItems: 0,
            userRoles: [],
            warehousesData:[],

            all_item_category:[],

            data: [],
            columns: [
                {
                    name: 'requestedId', // field name in the row object
                    label: 'LP Request ID', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest?.request_id}</p>
                            )
                        }
                    },
                },
                {
                    name: 'estimatedDate', // field name in the row object
                    label: 'Required Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest ? dateParse(this.state.data[tableMeta.rowIndex]?.LPRequest.required_date) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'requestedDate',
                    label: 'Requested Date',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest ? dateParse(this.state.data[tableMeta.rowIndex]?.LPRequest.createdAt) : 'Not Available'}</p>
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

                            let HospitalData = this.state.hospitalData.find((e)=>e?.owner_id === this.state.data[tableMeta.rowIndex].LPRequest?.owner_id)
                            
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


                            // console.log('incomming data', data)

                            let warehouse = this.state.warehousesData.find((e)=>e?.id === this.state.data[tableMeta.rowIndex].LPRequest?.ItemSnap?.primary_wh)
                            
                            return (
                                <p>{warehouse?.name ? warehouse?.name: 'Not Available'}</p>
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
                            let HospitalData = this.state.hospitalData.find((e)=>e?.owner_id === this.state.data[tableMeta.rowIndex].LPRequest?.owner_id)
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest ?.Pharmacy_drugs_store?.name ? this.state.data[tableMeta.rowIndex]?.LPRequest ?.Pharmacy_drugs_store?.name+ ' ' + this.state.data[tableMeta.rowIndex]?.LPRequest ?.Pharmacy_drugs_store?.Department?.name : HospitalData?.name}</p>
                            )
                        }
                    },
                },
                {
                    name: 'srNo',
                    label: 'SR No',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest.ItemSnap ? this.state.data[tableMeta.rowIndex]?.LPRequest.ItemSnap.sr_no : this.state.data[tableMeta.rowIndex]?.LPRequest.item_name ? "New Item (No Serial Number)" : 'Not Available'}</p>

                            )
                        }
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest?.ItemSnap ? this.state.data[tableMeta.rowIndex]?.LPRequest.ItemSnap.medium_description : this.state.data[tableMeta.rowIndex]?.LPRequest.item_name ? this.state.data[tableMeta.rowIndex]?.LPRequest.item_name : 'Not Available'}</p>
                            )
                        }
                    },
                },
                // {
                //     name: 'code',
                //     label: 'Warehouse Code',
                //     options: {
                //         // filter: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <p>{this.state.data[tableMeta.rowIndex]?.LPRequest?.ItemSnap?.medium_description ? this.state.data[tableMeta.rowIndex]?.LPRequest?.ItemSnap?.medium_description : "Not Available"}</p>
                //             )
                //         }
                //     },
                // },
                /* {
                    name: 'requestedBy',
                    label: 'Requested By',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest?.ItemSnap?.medium_description}</p>
                            )
                        }
                    },
                }, */
                {
                    name: 'requestedQuantity',
                    label: 'Requested Quantity',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest ? parseInt(this.state.data[tableMeta.rowIndex]?.LPRequest.required_quantity, 10) : 'Not Available'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'value',
                    label: 'Estimated Value',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.LPRequest ? roundDecimal(this.state.data[tableMeta.rowIndex]?.LPRequest.cost, 2) : 'Not Available'}</p>
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
                /*  {
                     name: 'availability',
                     label: 'Availability in other hospitals',
                     options: {
                         // filter: true,
                         customBodyRender: (value, tableMeta, updateValue) => {
                             return (
                                 <p>{'Not Available'}</p>
                             )
                         }
                     },
                 }, */
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].id;
                            let lp_request_id = this.state.data[tableMeta.rowIndex].lp_request_id;
                            let hospital_approval_config_id = this.state.data[tableMeta.rowIndex].hospital_approval_config_id;

                            return (
                                <Tooltip title="View LP Approval">
                                    <IconButton
                                        className="text-black mr-2"
                                        onClick={() => {
                                            window.location = `/localpurchase/approval_list/${id}?role=${this.state.role}&lp_request_id=${lp_request_id}&hospital_approval_config_id=${hospital_approval_config_id}&is_pending=true`
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

            loading: false,
            filterData: {
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
                search:null
            },

            enableDates: false,
            isCreated :false,
            isRequired :false,

            groupStatus: [],

            category: [
                { label: 'Pharmaceutical' },
                { label: 'Surgical' },
            ],

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },
        }
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
            },()=>{
                this.loadData()
            })
            
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources
        let user_roles = await localStorageService.getItem('userInfo').roles
        let owner_id = await localStorageService.getItem('owner_id')
        console.log('cheking user_roles', owner_id )
        if (includesArrayElements(user_roles, ['MSD SCO', 'MSD SCO Supply','HSCO', 'MSD AD', 'MSD Director', 'MSD DDG'])) {
            owner_id = null
        } else if (includesArrayElements(user_roles,['Devisional Pharmacist','RDHS'])){
            let owner_id_list = this.state.dpInstitution.map((dataset) => dataset?.owner_id)
            let uniquOwnerrIds = [...new Set(owner_id_list)]
            owner_id = uniquOwnerrIds
        }

        console.log('cheking owner id', owner_id )

        this.setState({ loading: false });
        const newFormData = { ...this.state.formData, owner_id: owner_id, status: "Pending", approval_user_type: user_roles[0] }

        let res = await LocalPurchaseServices.getLPRequestApprovals(newFormData)

        if (res.status === 200) {
            console.log('LP Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, role: user_roles[0], totalItems: res.data.view.totalItems },()=>{
                this.loadHospitals(res?.data?.view?.data)
            })
        }

        let status_res = await LocalPurchaseServices.getLPRequest({ search_type: 'GroupByStatus', owner_id: owner_id, status: ['Pending Approval', 'APPROVED'] })
        if (status_res.status === 200) {
            console.log("Status: ", status_res.data.view)
            this.setState({ groupStatus: status_res.data.view })
        }

        this.setState({ loading: true })
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        // let formData = this.state.formData
        // formData.age =
        //     formData.age_all.years +
        //     '-' +
        //     formData.age_all.months +
        //     '-' +
        //     formData.age_all.days

        // let res = await PatientServices.createNewPatient(formData)
        // if (res.status == 201) {
        //     this.setState({
        //         alert: true,
        //         message: 'Patient Registration Successful',
        //         severity: 'success',
        //     })
        // } else {
        //     this.setState({
        //         alert: true,
        //         message: 'Patient Registration Unsuccessful',
        //         severity: 'error',
        //     })
        // }
    }

    async loadHospitals(mainData){
        console.log('checkinf min data' , mainData)
        let params = { 
            issuance_type: ["Hospital", 'RMSD Main'], 
            // limit: 1, 
            // page: 0,
            'order[0]': ['createdAt', 'ASC'],
            selected_owner_id: mainData?.map(x=>x.LPRequest?.owner_id)
        };
    
        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status === 200) {
            console.log('ceking ospital', res.data.view.data)
            this.setState({
                hospitalData:res.data.view.data
            })
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

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    async loadCategories() {
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
    }

    async componentDidMount() {
        let userRoles = await localStorageService.getItem('userInfo').roles
        this.setState({ userRoles: userRoles }, () => {
            
            this.getWarehouse()
            this.detDPInstitution()
            this.loadCategories()
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <CardTitle title="Local Purchase Approval" />
                   {/*  <Grid container spacing={2} className='mt-2 mb-2' style={{ marginLeft: "-1px" }}>
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                           
                            <Grid container spacing={2} style={{ background: "#E6F7FF", border: "1px solid #BAE7FF", borderRadius: "8px", width: "100%" }}>
                                <Grid item xs={12} sm={6} lg={6} md={6} style={{ display: "flex", justifyContent: "center" }}>
                                    <Typography variant='body1'>Pending Approvals: {this.state.loading ? this.state.groupStatus[1] ? this.state.groupStatus[1]?.counts : "Not Available" : "Loading"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={6} md={6} style={{ display: "flex", justifyContent: "center" }}>
                                    <Typography variant='body1'>Approved: {this.state.loading ? this.state.groupStatus[0] ? this.state.groupStatus[0]?.counts : "Not Available" : "Loading"}</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid> */}
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
                                                        this.state.formData
                                                            .start_sr_no
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
                                                        this.state.formData
                                                            .end_sr_no
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
                                                    value={
                                                        this.state.formData
                                                            .search
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
                                                            this.state.formData
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
                                                        this.state.formData.start_date || this.state.formData.req_start_date
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
                                                            this.state.formData
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
                                                        this.state.formData.end_date || this.state.formData.req_end_date
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
                                                            this.state.formData

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
                                                        this.state.formData
                                                            .request_id
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
                                                            let formData =
                                                                this.state.formData
                                                                formData.status =
                                                                e.target.value
                                                            this.setState({
                                                                formData,
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
                                                                this.state.formData
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
                                                                formData: {
                                                                    ...this.state
                                                                        .formData,
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
                                            // <Grid container
                                            // style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                            // >
                                            <Grid
                                                
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                    {/* <Grid container>
                                                        <Grid
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                            className=" w-full"
                                                        > */}
                                                            {/* Submit Button */}
                                                            <Button
                                                                className="mt-6"
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
                                                        {/* </Grid>
                                                    </Grid> */}
                                                </Grid>
                                                // </Grid>
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
                                                        <SubTitle title="Institution Name" /> 
                                                        <Autocomplete
                                                            disableClearable
                                                            className="w-full"
                                                            options={this.state.pharmacy_list || []} 
                                                            onChange={(e, value) => {
                                                                console.log('ceking val', value)
                                                                if (value != null) {
                                                                    let formData = this.state.formData;
                                                                    formData.from_owner_id = value.owner_id;
                                                                    this.setState({ formData });
                                                                } else {
                                                                    let formData = this.state.formData;
                                                                    formData.from_owner_id = null;
                                                                    this.setState({ formData });
                                                                }
                                                            }}
                                                            value={
                                                                this.state.all_pharmacy &&
                                                                this.state.all_pharmacy.find((v) => v.owner_id === this.state.formData.from_owner_id)
                                                            }
                                                            getOptionLabel={(option) => (option && option.name ? (option.name + ' - ' + option?.Department?.name) : '')}
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Institution Name"
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
                                                                    let formData = this.state.formData;
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
                                                        style={{ display: "flex", height: 'fit-content' }}
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
                                                                this.state.formData
                                                                    .search
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
                                                count: this.state.totalItems,
                                                pagination: true,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,
                                                serverSide: true,
                                                print: true,
                                                viewColumns: true,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
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
                                                            let formaData = this.state.formData;
                                                            formaData.limit = tableState.rowsPerPage;
                                                            this.setState({ formaData })
                                                            this.setPage(0)
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

export default withStyles(styleSheet)(ApprovalItemDetails)
