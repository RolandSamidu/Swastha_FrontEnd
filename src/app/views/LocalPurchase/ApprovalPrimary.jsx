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
    Chip,
    Typography,
    colors,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import Stack from '@mui/material/Stack';

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
import { dateParse } from 'utils'
import { Rating } from '@mui/material'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import localStorageService from 'app/services/localStorageService'

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

const renderDetailCard = (label, value, style = {}) => {
    return (
        <Grid container spacing={2} style={style}>
            <Grid
                className=" w-full"
                item
                lg={6}
                md={6}
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
        <Grid className=" w-full"
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

class ApprovalPrimary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            lp_config_data: null,
            id: null,
            data: [
                {
                    msd_availability: "300",
                    balance: "3000",
                    date: dateParse(new Date()),
                    alternative_stock: "100",
                    institution_available: "200",
                    institution_serviceable: "400",
                    hospital_stock: "600",
                    status: "Good"
                },
                {
                    msd_availability: "200",
                    balance: "2400",
                    date: dateParse(new Date()),
                    alternative_stock: "200",
                    institution_available: "200",
                    institution_serviceable: "400",
                    hospital_stock: "600",
                    status: "Good"
                },
                {
                    msd_availability: "200",
                    balance: "2400",
                    date: dateParse(new Date()),
                    alternative_stock: "200",
                    institution_available: "200",
                    institution_serviceable: "400",
                    hospital_stock: "600",
                    status: "Bad"
                },
                {
                    msd_availability: "200",
                    balance: "2400",
                    date: dateParse(new Date()),
                    alternative_stock: "200",
                    institution_available: "200",
                    institution_serviceable: "400",
                    hospital_stock: "600",
                    status: "Better"
                }
            ],
            columns: [
                {
                    name: 'msd_availability', // field name in the row object
                    label: 'MSD Available Stock', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'balance',
                    label: 'Balance Due to an Order',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'date',
                    label: 'Date due on Order',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'alternative_stock',
                    label: 'Available Alternative Drug Quantity',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'institution_available',
                    label: 'Institution Available Stock',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'institution_serviceable',
                    label: 'Institution Serviceable Stock',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'hospital_stock',
                    label: 'Nearest Hospital Stock',
                    options: {
                        // filter: true,
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
                            return (
                                <IconButton
                                    className="text-black mr-2"
                                    onClick={() => {
                                        window.location = `/localpurchase/request/123`
                                    }}
                                >
                                    <Icon>visibility</Icon>
                                </IconButton>
                            )
                        },
                    },
                },
            ],
            lp_data: [
                {
                    sr_no: "S1001",
                    item_name: "Panadol",
                    mqp: '240',
                },
                {
                    sr_no: "S1002",
                    item_name: "Panadol",
                    mqp: '360',
                },
                {
                    sr_no: "S1003",
                    item_name: "Panadol",
                    mqp: '480',
                },
                {
                    sr_no: "S1004",
                    item_name: "Panadol",
                    mqp: '600',
                },
            ],
            lp_columns: [
                {
                    name: 'sr_no', // field name in the row object
                    label: 'Series Number', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'mqp',
                    label: 'MQP (Rs)',
                    options: {
                        // filter: true,
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

            loading: false,

            filterData: {
                item_name: null,
                quantity: null,
                type: null,
                description: null,
                remark: null,
            },

            formData: {
                page: 0,
                limit: 20,
            },

            selected: true,

            ward: [
                { id: 1, label: "W101" },
                { id: 2, label: "W102" },
                { id: 3, label: "W103" },
                { id: 4, label: "W104" },
                { id: 5, label: "W105" },
            ],

            type: [
                { id: 1, label: "Regular" },
                { id: 2, label: "Intermediate" },
                { id: 3, label: "Advanced" },
                // { id: 4, label: "W104" },
                // { id: 5, label: "W105" },
            ],

            bht: [
                { id: 1, label: "B101" },
                { id: 2, label: "B102" },
                { id: 3, label: "B103" },
                { id: 4, label: "B104" },
                { id: 5, label: "B105" },
            ]
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources
        this.setState({ loading: false })
        let res = await LocalPurchaseServices.getLPRequestApprovalByID(this.state.id)

        if (res.status === 200) {
            console.log('LP Data: ', res.data.view);
            this.setState({ lp_config_data: res.data.view })
        }

        this.setState({ loading: true })
        // let district_res = await DivisionsServices.getAllDistrict({
        //     limit: 99999,
        // })
        // if (district_res.status == 200) {
        //     console.log('district', district_res.data.view.data)
        //     this.setState({
        //         all_district: district_res.data.view.data,
        //     })
        // }

        // let moh_res = await DivisionsServices.getAllMOH({ limit: 99999 })
        // if (moh_res.status == 200) {
        //     console.log('moh', moh_res.data.view.data)
        //     this.setState({
        //         all_moh: moh_res.data.view.data,
        //     })
        // }

        // let phm_res = await DivisionsServices.getAllPHM({ limit: 99999 })
        // if (phm_res.status == 200) {
        //     console.log('phm', phm_res.data.view.data)
        //     this.setState({
        //         all_phm: phm_res.data.view.data,
        //     })
        // }

        // let gn_res = await DivisionsServices.getAllGN({ limit: 99999 })
        // if (gn_res.status == 200) {
        //     console.log('gn', gn_res.data.view.data)
        //     this.setState({
        //         all_gn: gn_res.data.view.data,
        //     })
        // }
    }

    async saveStepOneSubmit() { }

    async onSubmit(action) {
        let user = await localStorageService.getItem('userInfo')
        let user_roles = await localStorageService.getItem('userInfo').roles
        let owner_id = await localStorageService.getItem('owner_id')

        if (this.state.formData.remark) {
            if (this.state.lp_config_data && this.state.hospital_approval_config_id && this.state.id) {
                let res = await LocalPurchaseServices.patchLPRequestApprovals(this.state.id, { remark: this.state.formData.remark, lp_request_id: this.state.lp_request_id, hospital_approval_config_id: this.state.hospital_approval_config_id, approval_type: this.state.lp_config_data.approval_type, approved_by: user.id, approval_user_type: user_roles[0], status: action, sequence: this.state.lp_config_data.sequence, owner_id: owner_id })
                if (res.status && res.status == 200) {
                    this.setState({
                        alert: true,
                        message: 'LP Approved Successfully',
                        severity: 'success',
                    })

                    setTimeout(() => {
                        window.location.href = '/localpurchase/approval_list'; // Replace with the desired URL
                    }, 1000);
                } else {
                    this.setState({
                        alert: true,
                        message: 'LP Approved Unsuccessful',
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

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    componentDidMount() {
        const { id, lp_request_id, hospital_approval_config_id } = this.props
        this.setState({
            id: id,
        }, () => {
            this.loadData()
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
                        <CardTitle title='Local Purchase Request Details' />
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
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Sr No :', '10089')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Item Name :', "ABC Product")}
                                        </Grid>
                                    </Grid>
                                    <br />
                                    {/* Serial Number*/}
                                    <Grid container spacing={2}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Required Quantity :', '3600')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Required Date: ', dateParse(new Date()))}
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Grid container spacing={2}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            {renderSubsequentDetailCard('Justification :', 'Good')}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                                    <SubTitle title="Attachments" />

                                                </Grid>
                                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                                    <FileCopyIcon />
                                                    <FileCopyIcon />
                                                    {/* <Typography variant='body1' style={{ marginTop: '3px' }}>Good</Typography> */}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <br />
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
                                    <br />
                                    <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: '25px', padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                        <CardTitle title='Drug Availability' style={{ marginLeft: "8px" }} />
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    rowsPerPage: this.state.formData.limit,
                                                    page: this.state.formData.page,
                                                    serverSide: true,
                                                    print: false,
                                                    viewColumns: false,
                                                    download: false,
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
                                    <Grid container spacing={2} style={{ marginTop: "12px", padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                        <CardTitle title='Previous LP Requests in this Year' style={{ marginLeft: "8px" }} />
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.lp_data}
                                                columns={this.state.lp_columns}
                                                options={{
                                                    pagination: true,
                                                    rowsPerPage: this.state.formData.limit,
                                                    page: this.state.formData.page,
                                                    serverSide: true,
                                                    print: false,
                                                    viewColumns: false,
                                                    download: false,
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
                                                            value={'yes'}
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
                                                {this.state.selected &&
                                                    <Grid container spacing={2} style={{ marginLeft: '8px' }}>
                                                        if yes;
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
                                                                    validators={[
                                                                        'required',
                                                                    ]}
                                                                    errorMessages={[
                                                                        'this field is required',
                                                                    ]}
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
                                                                    className=" w-full"
                                                                    placeholder="Quantity"
                                                                    name="quantity"
                                                                    InputLabelProps={{
                                                                        shrink: false,
                                                                    }}
                                                                    value={
                                                                        String(this.state.formData
                                                                            .quantity)
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
                                                                                quantity:
                                                                                    e.target
                                                                                        .value,
                                                                            },
                                                                        })
                                                                    }}
                                                                    validators={
                                                                        ['minNumber:' + 0, 'required:' + true]}
                                                                    errorMessages={[
                                                                        'Quantity Should be > 0',
                                                                        'this field is required'
                                                                    ]}
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
                                                                    disableClearable
                                                                    className="w-full"
                                                                    options={this.state.type}
                                                                    onChange={(e, value) => {
                                                                        if (null != value) {
                                                                            let filterData =
                                                                                this.state.filterData
                                                                            filterData.type =
                                                                                e.target.value
                                                                            this.setState({
                                                                                filterData,
                                                                            })
                                                                        }
                                                                    }}
                                                                    value={this.state.type.find((item) => item.id == this.state.filterData.type)
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
                                                                            value={
                                                                                this.state.filterData
                                                                                    .type
                                                                            }
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
                                    </Grid>
                                    {renderRadioCard('Alternative Drug Availability :', 'yes')}
                                    {renderRadioCard('Formulate at MSD :', 'yes')}
                                    {renderDetailCard('Category :', 'Complementary or Regular')}
                                    <br />
                                    <Grid container spacing={2}>
                                        <Grid item lg={3} md={3} xs={12} sm={12}>
                                            <SubTitle title="Estimation :" />
                                        </Grid>
                                        <Grid item lg={9} md={9} xs={12} sm={12} style={{ border: "1px solid #000", borderRadius: "12px", padding: "8px" }}>
                                            <Grid container spacing={2}>
                                                <Grid item lg={6} md={6} sm={6} xs={6}>
                                                    <FormControl component="fieldset">
                                                        <RadioGroup
                                                            name="yesno"
                                                            aria-disabled
                                                            value={'yes'}
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
                                                {this.state.selected ?
                                                    <Grid container spacing={2} style={{ marginLeft: '8px' }}>
                                                        if yes;
                                                        {renderDetailCard('Annual Estimation :', '3600', { marginLeft: "4px" })}
                                                        <br />
                                                        {renderDetailCard('Monthly Requirement :', '300', { marginLeft: "4px" })}
                                                        <br />
                                                    </Grid> :
                                                    <Grid container spacing={2} style={{ marginLeft: '8px' }}>
                                                        if no;
                                                        {renderDetailCard('Reason :', '')}
                                                        <Grid container spacing={2} style={{ margin: '8px' }}>
                                                            <Grid className=" w-full"
                                                                item
                                                                lg={8}
                                                                md={8}
                                                                sm={12}
                                                                xs={12}>
                                                                <TextValidator
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
                                                                            .description
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
                                    <br />
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
                                                    this.state.filterData
                                                        .remark
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
                                                            remark:
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
                                                                progress={false}
                                                                type="submit"
                                                                // color="#d8e4bc"
                                                                startIcon={action.name === 'Reject' ? 'checklist' : 'save'}
                                                                style={action.name === 'Reject' ? { backgroundColor: '#F02020' } : { backgroundColor: colors.blue }}
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                onClick={() => this.onSubmit(action.action)}
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
                                    {/* <Grid container spacing={2}>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <br />
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
                                                                // source_id={this.state.loginUserHospital}



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
                                                                selectedFileList={
                                                                    this.state.data.fileList
                                                                }
                                                                label="Select Attachment"
                                                                singleFileButtonText="Upload Data"
                                                            // multipleFileButtonText="Select Files"
                                                            >
                                                            </SwasthaFilePicker>
                                                        </Grid>
                                                    </Grid> */}

                                    {/* Submit and Cancel Button */}
                                    {/* <Grid
                                                        item
                                                        lg={12}
                                                        md={12}
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
                                                                <Button
                                                                    className="mt-2 mr-2"
                                                                    progress={false}
                                                                    type="submit"
                                                                    scrollToTop={
                                                                        true
                                                                    }
                                                                    startIcon="save"
                                                                //onClick={this.handleChange}
                                                                >
                                                                    <span className="capitalize">
                                                                        Request
                                                                    </span>
                                                                </Button>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid> */}
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>
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

export default withStyles(styleSheet)(ApprovalPrimary)
