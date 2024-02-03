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
import Review from '../review'

const styleSheet = (theme) => ({})

class Reviews extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    genericName: 'Panadol',
                    brandName: 'Atrolip',
                    dosage: '100',
                    packSize: '100',
                    packType: 'Normal',
                    manufacturer: 'Nimal',
                    country: "Japan",
                    agent: "Lakmal",
                    regNo: "R101",
                    dateOfReg: dateParse(new Date()),
                    regType: "Normal",
                    schedule: "Tomorrow",
                },
            ],
            columns: [
                {
                    name: 'genericName', // field name in the row object
                    label: 'Generic Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
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
                    name: 'dosage',
                    label: 'Dosage',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'packSize',
                    label: 'Pack Size',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'packType',
                    label: 'Pack Type',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'manufacturer',
                    label: 'Manufacturer',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'country',
                    label: 'Country',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'agent',
                    label: 'Agent',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'regNo',
                    label: 'Reg No',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'dateOfReg',
                    label: 'Date of Reg',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'regType',
                    label: 'Reg Type',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'schedule',
                    label: 'Schedule',
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
                            <Grid container spacing={2}>
                                {/* Item Series heading */}
                                {/* Serial Number*/}
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
                                            <SubTitle title="Date From" />
                                            <DatePicker
                                                style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                                key={this.state.key}
                                                className="w-full"
                                                onChange={(date) => {
                                                    let formData = this.state.formData
                                                    formData.date_from = dateParse(date)
                                                    this.setState({ formData })
                                                }}
                                                // format="yyyy"
                                                // openTo='year'
                                                // views={["year"]}
                                                value={this.state.formData.date_from}
                                                placeholder="Date From"
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
                                            <SubTitle title="Date to" />
                                            <DatePicker
                                                style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                                key={this.state.key}
                                                className="w-full"
                                                onChange={(date) => {
                                                    let formData = this.state.formData
                                                    formData.date_to = dateParse(date)
                                                    this.setState({ formData })
                                                }}
                                                // format="yyyy"
                                                // openTo='year'
                                                // views={["year"]}
                                                value={this.state.formData.date_to}
                                                placeholder="Registered Date"
                                            />
                                        </Grid>
                                    </Grid>
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
                                                <SubTitle title="Item Name" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Item Name"
                                                    name="id"
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
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Sr No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Sr No"
                                                    name="id"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .sr_no
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
                                                                sr_no:
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
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
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
                                                className="mt-2 mr-2"
                                                progress={false}
                                                // type="submit"
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
                                <Grid container spacing={2} style={{ margin: '24px 0' }}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Review />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
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
                                                    Add
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>
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

export default withStyles(styleSheet)(Reviews)
