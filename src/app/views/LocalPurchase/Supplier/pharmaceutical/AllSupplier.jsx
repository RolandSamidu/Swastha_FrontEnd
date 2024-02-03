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

const styleSheet = (theme) => ({})

class AllSupplier extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    genericName: 'Panadol',
                    brandeName: 'Atrolip',
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
                                    onClick={() => { window.location = '/localpurchase/supplier_pharmaceutical/123' }}
                                >
                                    <Icon>visibility</Icon>
                                </IconButton>
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

            loading: false,
            formData: {
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
                registered_date: null,
                supplier_name: null,
                business_reg_no: null,
                vat_reg_no: null,
                address: null,
                district: null,
                fax: null,
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
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={6}
                                    xs={12}
                                >
                                    <SubTitle title="Date of Recieved From" />
                                    <DatePicker
                                        style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                        key={this.state.key}
                                        className="w-full"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.recieved_from = dateParse(date)
                                            this.setState({ formData })
                                        }}
                                        // format="yyyy"
                                        // openTo='year'
                                        // views={["year"]}
                                        value={this.state.formData.recieved_from}
                                        placeholder="Date of Recieved From"
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
                                    <SubTitle title="Date of Recieved to" />
                                    <DatePicker
                                        style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                        key={this.state.key}
                                        className="w-full"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.recieved_to = dateParse(date)
                                            this.setState({ formData })
                                        }}
                                        // format="yyyy"
                                        // openTo='year'
                                        // views={["year"]}
                                        value={this.state.formData.recieved_to}
                                        placeholder="Registered Date"
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
                                    <SubTitle title="Device Name" />
                                    <TextValidator
                                        disabled
                                        className=" w-full"
                                        placeholder="Device Name"
                                        name="id"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            this.state.formData
                                                .device_name
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
                                                    device_name:
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
                                    <SubTitle title="Brand Name" />
                                    <TextValidator
                                        disabled
                                        className=" w-full"
                                        placeholder="Brand Name"
                                        name="id"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            this.state.formData
                                                .brande_name
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
                                                    brande_name:
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
                                    <SubTitle title="Device Type" />
                                    <TextValidator
                                        disabled
                                        className=" w-full"
                                        placeholder="Device Type"
                                        name="id"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            this.state.formData
                                                .device_type
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
                                                    device_type:
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
                                    <SubTitle title="Manufacture" />
                                    <TextValidator
                                        disabled
                                        className=" w-full"
                                        placeholder="Manufacture"
                                        name="id"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            this.state.formData
                                                .manufacture
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
                                                    manufacture:
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
                                    <SubTitle title="Agent" />
                                    <TextValidator
                                        disabled
                                        className=" w-full"
                                        placeholder="Agent"
                                        name="id"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            this.state.formData
                                                .agent
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
                                                    agent:
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
                                    <SubTitle title="Country" />
                                    <TextValidator
                                        disabled
                                        className=" w-full"
                                        placeholder="Country"
                                        name="id"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            this.state.formData
                                                .country
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
                                                    country:
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
                                    <SubTitle title="Date of Expiry From" />
                                    <DatePicker
                                        style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                        key={this.state.key}
                                        className="w-full"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.expiry_from = dateParse(date)
                                            this.setState({ formData })
                                        }}
                                        // format="yyyy"
                                        // openTo='year'
                                        // views={["year"]}
                                        value={this.state.formData.expiry_from}
                                        placeholder="Date of Exp From"
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
                                    <SubTitle title="Date of Expiry to" />
                                    <DatePicker
                                        style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                        key={this.state.key}
                                        className="w-full"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.expiry_to = dateParse(date)
                                            this.setState({ formData })
                                        }}
                                        // format="yyyy"
                                        // openTo='year'
                                        // views={["year"]}
                                        value={this.state.formData.expiry_to}
                                        placeholder="Date of Expiry to"
                                    />
                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={8}
                                    md={8}
                                    sm={12}
                                    xs={12}
                                    style={{ display: "flex", alignSelf: "flex-end" }}
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
                                                // type="submit"
                                                scrollToTop={
                                                    true
                                                }
                                                startIcon="save"
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Add New List
                                                </span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                    <Grid container spacing={2} className='flex justify-end'>
                                        <Grid
                                            className="w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Keyword" />
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ flex: 1, marginRight: "8px" }}>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Device Name/Supplier ID"
                                                        name="id"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .keyword
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
                                                                    keyword:
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
                                                </div>
                                                <div style={{ marginLeft: "8px", marginTop: "5px" }}>
                                                    <Button
                                                        progress={false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="save"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Search
                                                        </span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
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

export default withStyles(styleSheet)(AllSupplier)
