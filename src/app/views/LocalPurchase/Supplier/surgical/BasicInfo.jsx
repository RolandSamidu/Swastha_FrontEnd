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
    Tooltip,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
// import Item from './item'

import {
    DatePicker,
    Button,
    LoonsSwitch,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
// import * as appConst from '../../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { dateParse } from 'utils'
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Review from '../review'

const styleSheet = (theme) => ({})

class BasicInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    device: 'Sample Data',
                    dvrNo: '124587',
                    brandName: 'Atrolip',
                    deviceName: 'Sample Data',
                    deviceType: '1245',
                    agentName: 'L. K. Lanka Ltd',
                    certiflictNo: '4578',
                    mqp: '120',
                },
            ],
            columns: [
                {
                    name: 'device', // field name in the row object
                    label: 'Device', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'dvrNo',
                    label: 'DVR No',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'brandName',
                    label: 'Brand Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'deviceType',
                    label: 'Device Type',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'agentName',
                    label: 'Agent Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'certiflictNo',
                    label: 'Certiflict No',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'mqp',
                    label: 'MQP (LKR)',
                    options: {
                        // filter: true,
                    },
                },
                {
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
                                    <Icon color="danger">delete_sweep</Icon>
                                </IconButton>
                            )
                        }
                    }
                }
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
            formData: {
                isEditItem: null,
                recieved_from: null,
                recieved_to: null,
                device_name: null,
                brande_name: null,
                device_type: null,
                manufacture: null,
                agent: null,
                country: null,
                expiry_from: null,
                expiry_to: null,
                keyword: null,

                supplier_id: 'ML/LL/010',
                registered_date: dateParse(new Date()),
                expiry_date: dateParse(new Date()),
                business_reg_no: '######',
                vat_reg_no: '######',
                pharmacy_reg_no: "######",
                address: 'No: 27/A, Welikadamulla Rd, Wattala',
                district: 'Colombo',
                tel: '0771124875',
                email: 'admin@gmail.com',
                fax: '0112458791',

                supplier_name: null,
                phone1: null,
                phone2: null,
                email1: null,
                email2: null,
                supplier_email: null,

                institute: null,
                ward_id: null,
                bht: null,
                patient_name: null,
                phn: null,
                item_name: null,
                sr_no: null,
                request_quantity: null,
                required_date: null,
                description: null,
                selected: 'yes'
            },

            ward: [
                { id: 1, label: "W101" },
                { id: 2, label: "W102" },
                { id: 3, label: "W103" },
                { id: 4, label: "W104" },
                { id: 5, label: "W105" },
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

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    componentDidMount() {
        this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <ValidatorForm
                    className="pt-2"
                    onSubmit={() => this.SubmitAll()}
                    onError={() => null}
                >
                    {/* Main Grid */}
                    <Grid container spacing={2} direction="row">
                        {/* Filter Section */}
                        <Grid item xs={12} sm={12} md={12} lg={12}>
                            {/* Item Series Definition */}
                            <Grid container spacing={2}>
                                {/* Item Series heading */}
                                {/* Serial Number*/}
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="Supplier ID" />
                                    <div style={{ display: 'flex', margin: "12px 0" }}>
                                        <Typography variant='body1' style={{ margin: "0 12px" }}>{this.state.formData.supplier_id}</Typography>
                                    </div>
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
                                    <SubTitle title="Registered Date" />
                                    <div style={{ display: 'flex', margin: "12px 0" }}>
                                        <Typography variant='body1' style={{ margin: "0 12px" }}>{this.state.formData.registered_date}</Typography>
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="Registration Expiry Date" />
                                    <div style={{ display: 'flex', margin: "12px 0" }}>
                                        <Typography variant='body1' style={{ margin: "0 12px" }}>{this.state.formData.expiry_date}</Typography>
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="Business Registration No" />
                                    <div style={{ display: 'flex', margin: "12px 0" }}>
                                        <div style={{ margin: "0 12px" }}>
                                            <Typography variant='body1'>{this.state.formData.business_reg_no}</Typography>
                                        </div>
                                        <div style={{ flex: 1, justifyContent: "center", display: "flex" }}>
                                            <FileCopyIcon />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="NMRA Supplier / Pharmacy Registration No" />
                                    <div style={{ display: 'flex', margin: "12px 0" }}>
                                        <div style={{ margin: "0 12px" }}>
                                            <Typography variant='body1'>{this.state.formData.pharmacy_reg_no}</Typography>
                                        </div>
                                        <div style={{ flex: 1, justifyContent: "center", display: 'flex' }}>
                                            <FileCopyIcon />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="VAT Registration No" />
                                    <div style={{ display: 'flex', margin: "12px 0" }}>
                                        <div style={{ margin: "0 12px" }}>
                                            <Typography variant='body1'>{this.state.formData.vat_reg_no}</Typography>
                                        </div>
                                        <div style={{ flex: 1, justifyContent: 'center', display: "flex" }}>
                                            <FileCopyIcon />
                                        </div>
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="Address" />
                                    <div style={{ display: 'flex', margin: "12px 0" }}>
                                        <Typography variant='body1' style={{ margin: "0 12px" }}>{this.state.formData.address}</Typography>
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="District" />
                                    <div style={{ display: 'flex', margin: "12px 0" }}>
                                        <Typography variant='body1' style={{ margin: "0 12px" }}>{this.state.formData.district}</Typography>
                                    </div>
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                    style={{ display: "flex", alignSelf: "flex-end" }}
                                >
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                            className=" w-full"
                                        >
                                            <SubTitle title="Tel" />
                                            <div style={{ display: 'flex', margin: "12px 0" }}>
                                                <Typography variant='body1' style={{ margin: "0 12px" }}>{this.state.formData.tel}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid
                                            item
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                            className=" w-full"
                                        >
                                            <SubTitle title="Email" />
                                            <div style={{ display: 'flex', margin: "12px 0" }}>
                                                <Typography variant='body1' style={{ margin: "0 12px" }}>{this.state.formData.email}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid
                                            item
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                            className=" w-full"
                                        >
                                            <SubTitle title="Fax" />
                                            <div style={{ display: 'flex', margin: "12px 0" }}>
                                                <Typography variant='body1' style={{ margin: "0 12px" }}>{this.state.formData.fax}</Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container className="mt-15 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "15px 5px" }}>
                                            <div style={{ marginRight: "12px" }}>
                                                <Typography className=" text-gray font-semibold text-13" style={{ lineHeight: '1', }}>Modify</Typography>
                                            </div>
                                            <div>
                                                <Tooltip title="Modify Item Details">
                                                    <LoonsSwitch
                                                        value={this.state.formData.isEditItem}
                                                        color="primary"
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            // formData.patient_id = null;
                                                            // formData.phn = null;
                                                            // formData.patient_name = null;
                                                            // formData.bht = null;
                                                            // formData.nic = null;
                                                            formData.isEditItem = !formData.isEditItem;
                                                            this.setState({ formData });
                                                        }}
                                                    />
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                rowsPerPage: 10,
                                                page: 0,
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
                                                            // this.setPage(
                                                            //     tableState.page
                                                            // )
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
                                {this.state.formData.isEditItem &&
                                    <Grid container className="mt-2">
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <SubTitle title="Item Details" />
                                            <hr className='mt-2 mb-2' />
                                            <Review />
                                        </Grid>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </ValidatorForm>
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

export default withStyles(styleSheet)(BasicInfo)
