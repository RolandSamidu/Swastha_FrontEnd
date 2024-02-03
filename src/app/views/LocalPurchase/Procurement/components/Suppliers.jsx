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
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
// import Item from './item'

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
// import * as appConst from '../../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { dateParse } from 'utils'
import FileCopyIcon from '@mui/icons-material/FileCopy';

const styleSheet = (theme) => ({})

class Suppliers extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    regNo: "45/P/P/784512",
                    bidder: 'ABC Company',
                    bidderContact: '0114879542',
                    manufacture: 'ABC Company',
                    manufactureContact: '0778456310',
                    agent: 'ABC Company',
                    agentContact: '0117845123',
                    history: "Yes",
                },
                {
                    regNo: "45/P/P/784512",
                    bidder: 'ABC Company',
                    bidderContact: '0114879542',
                    manufacture: 'ABC Company',
                    manufactureContact: '0778456310',
                    agent: 'ABC Company',
                    agentContact: '0117845123',
                    history: "Yes",
                },
                {
                    regNo: "45/P/P/784512",
                    bidder: 'ABC Company',
                    bidderContact: '0114879542',
                    manufacture: 'ABC Company',
                    manufactureContact: '0778456310',
                    agent: 'ABC Company',
                    agentContact: '0117845123',
                    history: "Yes",
                },
            ],
            columns: [
                {
                    name: 'regNo', // field name in the row object
                    label: 'Registeration No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'bidder',
                    label: 'Bidder Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'bidderContact',
                    label: 'Bidder Contact',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'manufacture',
                    label: 'Manufacture',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'manufactureContact',
                    label: 'Manufacture Contact',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'agent',
                    label: 'Local Agent',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'agentContact',
                    label: 'Local Agent Contact',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'history',
                    label: 'Supplier History',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: "action",
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <IconButton
                                    className="text-black"
                                    onClick={null}
                                >
                                    {/* Submit Button */}
                                    <Button
                                        className="mt-2 mr-2"
                                        progress={false}
                                        // type="submit"
                                        scrollToTop={
                                            true
                                        }
                                        startIcon="save"
                                    //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">
                                            Send Quotation Request Letter
                                        </span>
                                    </Button>
                                </IconButton>
                            )
                        },
                    },
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
                date_from: null,
                date_to: null,
                item_name: null,
                sr_no: null,


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

        let district_res = await DivisionsServices.getAllDistrict({
            limit: 99999,
        })
        if (district_res.status == 200) {
            console.log('district', district_res.data.view.data)
            this.setState({
                all_district: district_res.data.view.data,
            })
        }

        let moh_res = await DivisionsServices.getAllMOH({ limit: 99999 })
        if (moh_res.status == 200) {
            console.log('moh', moh_res.data.view.data)
            this.setState({
                all_moh: moh_res.data.view.data,
            })
        }

        let phm_res = await DivisionsServices.getAllPHM({ limit: 99999 })
        if (phm_res.status == 200) {
            console.log('phm', phm_res.data.view.data)
            this.setState({
                all_phm: phm_res.data.view.data,
            })
        }

        let gn_res = await DivisionsServices.getAllGN({ limit: 99999 })
        if (gn_res.status == 200) {
            console.log('gn', gn_res.data.view.data)
            this.setState({
                all_gn: gn_res.data.view.data,
            })
        }
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        let formData = this.state.formData
        formData.age =
            formData.age_all.years +
            '-' +
            formData.age_all.months +
            '-' +
            formData.age_all.days

        let res = await PatientServices.createNewPatient(formData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Patient Registration Successful',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Patient Registration Unsuccessful',
                severity: 'error',
            })
        }
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
                            <Grid container className="mt-15 pb-5">
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

export default withStyles(styleSheet)(Suppliers)
