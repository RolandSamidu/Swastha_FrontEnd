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
    colors,
    CircularProgress
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import localStorageService from '../../services/localStorageService'
import LocalPurchaseServices from '../../services/LocalPurchaseServices'

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
import * as appConst from '../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse } from 'utils'

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

class ApprovalDrugAvailability extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            id: null,
            lp_request_id: null,
            lp_config_data: null,
            hospital_approval_config_id: null,
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
                                        window.location = `/localpurchase/chief_pharmacist/123`
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
                    request_id: "R001",
                    request_by: "Harish",
                    request_date: dateParse(new Date()),
                    request_quantity: '20',
                    amount: '2000'
                },
                {
                    request_id: "R002",
                    request_by: "Harish",
                    request_date: dateParse(new Date()),
                    request_quantity: '30',
                    amount: '3000'
                },
                {
                    request_id: "R003",
                    request_by: "Harish",
                    request_date: dateParse(new Date()),
                    request_quantity: '40',
                    amount: '4000'
                },
            ],
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
                sr_no: null,
                item_name: null,
                request_id: null,
                consultant_id: null,
                status: null,
                description: null,
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
                item_id: this.props.match.params.item_id,
                remark: null,
            },
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources

        // let user_roles = await localStorageService.getItem('userInfo').roles

        this.setState({ loading: false });
        // const newFormData = { ...this.state.formData, status: "Pending", approval_user_type: user_roles[0], lp_request_id: this.state.lp_request_id }

        let res = await LocalPurchaseServices.getLPRequestApprovalByID(this.state.id)

        if (res.status === 200) {
            console.log('LP Data: ', res.data.view);
            this.setState({ lp_config_data: res.data.view })
        }

        let user_roles = await localStorageService.getItem('userInfo').roles

        if (user_roles[0] === 'Chief Pharmacist' || user_roles[0] === 'Drug Store Keeper' || user_roles[0] === 'Hospital Director') {
            let owner_id = await localStorageService.getItem('owner_id')
            // let res1 = await LocalPurchaseServices.getLPRequest({ not_lp_request_id: this.state.lp_request_id, from: dateParse(new Date('2023-01-01')), to: dateParse(new Date()), item_id: this.state.lp_config_data.LPRequest.item_id, owner_id: owner_id })
            // console.log('DATA: ', res1.data.view.data)
            let res1 = await LocalPurchaseServices.getLPRequest({ from: dateParse(new Date('2023-01-01')), to: dateParse(new Date('2023-12-31')), item_id: this.state.lp_config_data?.LPRequest.item_id, owner_id: owner_id })
            console.log('DATA: ', res1.data.view.data)
            this.setState({ lp_data: res1.data.view.data })
        } else {
            let res1 = await LocalPurchaseServices.getLPRequest({ from: dateParse(new Date('2023-01-01')), to: dateParse(new Date('2023-12-31')), item_id: this.state.lp_config_data?.LPRequest.item_id })
            // let res1 = await LocalPurchaseServices.getLPRequest({
            //     not_lp_request_id: this.state.lp_request_id, from: dateParse(new Date()), to: dateParse(new Date()), item_id: this.state.lp_config_data.LPRequest.item_id
            // })
            this.setState({ lp_data: res.data.view.data })
            this.setState({ lp_data: res1.data.view.data })
            console.log('DATA: ', res1.data.view.data)
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

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        let id = this.props.match.params.id;
        this.setState({
            id: id,
            lp_request_id: params.get('lp_request_id') ? params.get('lp_request_id') : null,
            hospital_approval_config_id: params.get('hospital_approval_config_id') ? params.get('hospital_approval_config_id') : null,
        }, () => {
            this.loadData()
        })

        // this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Drug Availability" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => null}
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
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="SR Number" />

                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="SR Number"
                                                        name="sr_no"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .sr_no
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
                                                                    sr_no:
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
                                                            this.state.filterData
                                                                .item_name
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
                                                                    item_name:
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
                                                    <SubTitle title="Consultant Name" />

                                                    <Autocomplete
                                                        className="w-full"
                                                        options={this.state.consultant}
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let filterData =
                                                                    this.state.filterData
                                                                filterData.consultant_id =
                                                                    e.target.value
                                                                this.setState({
                                                                    filterData,
                                                                })
                                                            }
                                                        }}
                                                        value={this.state.consultant.find((consultant) => consultant.id == this.state.filterData.consultant_id)
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
                                                                        .consultant_id
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* Description*/}
                                                {/* Submit and Cancel Button */}
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
                                                            className=" w-full flex justify-end"
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
                                                                    Search
                                                                </span>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
                                <Grid container className='mt-5 mb-5'>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Grid container spacing={2}>

                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('SR No :', '**********')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Item Name :', 'ABC Product')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Required Quantity :', '400')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Required Date :', dateParse(new Date()))}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Name of the Institute :', '**********')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Requested Consultant :', '**********')}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* Table Section */}
                                <Grid container className="mt-5 pb-5">
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
                                <br />
                                <Grid container spacing={2} style={{ marginTop: "12px", padding: "24px", background: "#B3ACAC", borderRadius: "12px", marginBottom: "12px" }}>
                                    <CardTitle title='Previous LP Requests in this Year' style={{ marginLeft: "8px" }} />
                                    {this.state.loading ?
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.lp_data}
                                                columns={this.state.lp_data_columns}
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
                                        :
                                        (
                                            <Grid className='justify-center text-center w-full pt-12'>
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )
                                    }
                                </Grid>
                                <br />
                                {renderDetailCard('Remark :', '')}
                                <Grid container spacing={2} className='mb-5'>
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
                                            placeholder="Justification"
                                            name="description"
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
                                                {/* <div
                                                        onClick={() => {
                                                            handleClose()
                                                        }}
                                                    >
                                                        {close}
                                                    </div> */}
                                                {/* <Button
                                                    className="mt-2 mr-2"
                                                    progress={false}
                                                    // type="submit"
                                                    // color="#d8e4bc"
                                                    // startIcon="checklist"
                                                    style={{ backgroundColor: '#F02020' }}
                                                    scrollToTop={
                                                        true
                                                    }
                                                //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">
                                                        Reject
                                                    </span>
                                                </Button>
                                                <Button
                                                    className="mt-2 mr-2"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={
                                                        true
                                                    }
                                                // startIcon="save"
                                                //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">
                                                        Approve
                                                    </span>
                                                </Button>
                                                <Button
                                                    className="mt-2"
                                                    progress={false}
                                                    // type="submit"
                                                    scrollToTop={
                                                        true
                                                    }
                                                    style={{ backgroundColor: '#17D12B' }}
                                                // startIcon="save"
                                                //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">
                                                        View Drug Profile
                                                    </span>
                                                </Button> */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
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

export default withStyles(styleSheet)(ApprovalDrugAvailability)
