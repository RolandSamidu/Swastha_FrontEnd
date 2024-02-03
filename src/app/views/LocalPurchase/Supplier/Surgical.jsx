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
    Typography,
    Tooltip,
    Icon,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import Item from './item'
import HospitalConfigServices from 'app/services/HospitalConfigServices'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    SwasthaFilePicker,
    LoonsSwitch,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import { dateParse } from 'utils'

const styleSheet = (theme) => ({})

class Surgical extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            source_id: null,
            all_Suppliers: [],
            columns: [
                {
                    name: 'seriesNumber', // field name in the row object
                    label: 'Series Number', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'groupName',
                    label: 'Group Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'category',
                    label: 'Category Name',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Short Reference',
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
                                <>
                                    <IconButton
                                        className="text-black mr-2"
                                        onClick={null}
                                    >
                                        <Icon>mode_edit_outline</Icon>
                                    </IconButton>
                                    <IconButton
                                        className="text-black"
                                        onClick={null}
                                    >
                                        <Icon>delete_sweep</Icon>
                                    </IconButton>
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

            loading: false,
            formData: {
                isNewSupplier: false,
                supplier_id: null,
                registered_date: null,
                supplier_name: null,
                business_reg_no: null,
                vat_reg_no: null,
                phar_reg_no: null,
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

    async loadAllSuppliers(search) {
        let params = { search: search }

        let res = await HospitalConfigServices.getAllSuppliers(params)
        if (res.status) {
            console.log("all Suppliers", res.data.view.data)
            this.setState({
                all_Suppliers: res.data.view.data,

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
                                {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <Grid container spacing={2} style={{ display: 'flex', justifyContent: "flex-end" }}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                            style={{ minHeight: "150px", borderRadius: "12px", backgroundColor: "#D5ECF0", display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8px' }}
                                        >
                                            <SubTitle title="Enter Valid Email of Supplier" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Supplier Email"
                                                name="email"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .supplier_email
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
                                                            supplier_email:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }}
                                                validators={[
                                                    'required', 'isEmail'
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                    'Please enter a valid Email Address'
                                                ]}
                                            />
                                            <div style={{ justifyContent: "flex-end", display: "flex" }}>
                                                <Button
                                                    className="mt-2"
                                                    progress={false}
                                                    style={{ width: "fit-content" }}
                                                    // type="submit"
                                                    scrollToTop={
                                                        true
                                                    }
                                                    startIcon='backup'
                                                //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">
                                                        Send
                                                    </span>
                                                </Button>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid> */}
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                    <SubTitle title="Supplier Details" />
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
                                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "10px 0" }}>
                                        <div style={{ marginRight: "12px" }}>
                                            <Typography className=" text-gray font-semibold text-13" style={{ lineHeight: '1', }}>Add New</Typography>
                                        </div>
                                        <div>
                                            <Tooltip title="Add New Supplier">
                                                <LoonsSwitch
                                                    value={this.state.formData.isNewSupplier}
                                                    color="primary"
                                                    onChange={() => {
                                                        let formData = this.state.formData;
                                                        // formData.patient_id = null;
                                                        // formData.phn = null;
                                                        // formData.patient_name = null;
                                                        // formData.bht = null;
                                                        // formData.nic = null;
                                                        formData.isNewSupplier = !formData.isNewSupplier;
                                                        this.setState({ formData });
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </Grid>
                                {/* Serial Number*/}
                                {!this.state.formData.isNewSupplier &&
                                    <>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={8}
                                            xs={12}
                                        >
                                            <SubTitle title="Select Supplier" />
                                            <Autocomplete
                                                // disableClearable
                                                className="w-full"
                                                options={this.state.all_Suppliers}
                                                getOptionLabel={(option) => option.name}
                                                value={this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    if (value != null) {
                                                        formData.supplier_id = value.id
                                                    } else {
                                                        formData.supplier_id = null
                                                    }
                                                    this.setState({ formData })
                                                }

                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Supplier"
                                                        //variant="outlined"
                                                        //value={}
                                                        onChange={(e) => {
                                                            if (e.target.value.length > 2) {
                                                                this.loadAllSuppliers(e.target.value)
                                                            }
                                                        }}
                                                        value={this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id)}
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
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={8}
                                            xs={12}
                                        >
                                            <SubTitle title="Supplier ID" />
                                            <TextValidator
                                                disabled
                                                className=" w-full"
                                                placeholder="Supplier ID"
                                                name="id"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .supplier_id
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
                                                            supplier_id:
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
                                    </>
                                }
                                {/* Name*/}
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={4}
                                    md={4}
                                    sm={8}
                                    xs={12}
                                >
                                    <SubTitle title="Supplier Name" />
                                    <TextValidator
                                        disabled={!this.state.formData.isNewSupplier}
                                        className=" w-full"
                                        placeholder="Supplier Name"
                                        name="id"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        value={
                                            this.state.formData
                                                .supplier_name
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
                                                    supplier_name:
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
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                    <Grid container spacing={2}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={8}
                                            xs={12}
                                        >
                                            <SubTitle title="Registered Date" />
                                            <DatePicker
                                                style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                                key={this.state.key}
                                                className="w-full"
                                                onChange={(date) => {
                                                    let formData = this.state.formData
                                                    formData.registered_date = dateParse(date)
                                                    this.setState({ formData })
                                                }}
                                                // format="yyyy"
                                                // openTo='year'
                                                // views={["year"]}
                                                value={this.state.formData.registered_date}
                                                placeholder="Registered Date"
                                            />
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
                                    <Grid container spacing={2}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={8}
                                            md={8}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Business Registration No" />
                                            <div>
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Registration No"
                                                    name="id"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .business_reg_no
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
                                                                business_reg_no:
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
                                            {/* <div>
                                                    <Button
                                                        className="ml-2"
                                                        style={{ backgroundColor: '#F20A0A', marginTop: "5px" }}
                                                        progress={false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon='backup'
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Upload
                                                        </span>
                                                    </Button>
                                                </div> */}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                            style={{ display: "flex", alignItems: "end" }}
                                        >
                                            <Grid container>
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
                                                        style={{ backgroundColor: '#F20A0A', marginTop: "5px" }}
                                                        progress={false}
                                                        disabled={this.state.source_id ? true : false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="backup"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Upload
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {this.state.source_id &&
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

                                                    source="lp_supplier_bus"
                                                    source_id={this.state.source_id}

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
                                                    /* selectedFileList={
                                                        this.state.data.fileList
                                                    } */
                                                    label="Select Attachment"
                                                    singleFileButtonText="Upload Data"
                                                // multipleFileButtonText="Select Files"
                                                >
                                                </SwasthaFilePicker>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                    <Grid container spacing={2}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={8}
                                            md={8}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="VAT Registration No" />
                                            <div>
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Registration No"
                                                    name="id"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .vat_reg_no
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
                                                                vat_reg_no:
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
                                            {/* <div>
                                                    <Button
                                                        className="ml-2"
                                                        style={{ backgroundColor: '#F20A0A', marginTop: "5px" }}
                                                        progress={false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon='backup'
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Upload
                                                        </span>
                                                    </Button>
                                                </div> */}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                            style={{ display: "flex", alignItems: "end" }}
                                        >
                                            <Grid container>
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
                                                        style={{ backgroundColor: '#F20A0A', marginTop: "5px" }}
                                                        progress={false}
                                                        disabled={this.state.source_id ? true : false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="backup"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Upload
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {this.state.source_id &&
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

                                                    source="lp_supplier_vat"
                                                    source_id={this.state.source_id}

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
                                                    /* selectedFileList={
                                                        this.state.data.fileList
                                                    } */
                                                    label="Select Attachment"
                                                    singleFileButtonText="Upload Data"
                                                // multipleFileButtonText="Select Files"
                                                >
                                                </SwasthaFilePicker>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                    <Grid container spacing={2} style={{ marginTop: '12px', marginBottom: "12px" }}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={8}
                                            md={8}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="NMRA Supplier / Pharmacy Registration No :" />
                                            <div>
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Registration No"
                                                    name="id"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .phar_reg_no
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
                                                                phar_reg_no:
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
                                            {/* <div>
                                                    <Button
                                                        className="ml-2"
                                                        style={{ backgroundColor: '#F20A0A', marginTop: "5px" }}
                                                        progress={false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon='backup'
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Upload
                                                        </span>
                                                    </Button>
                                                </div> */}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                            style={{ display: "flex", alignItems: "end" }}
                                        >
                                            <Grid container>
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
                                                        style={{ backgroundColor: '#F20A0A', marginTop: "5px" }}
                                                        progress={false}
                                                        disabled={this.state.source_id ? true : false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="backup"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Upload
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {this.state.source_id &&
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

                                                    source="lp_supplier_phar"
                                                    source_id={this.state.source_id}

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
                                                    /* selectedFileList={
                                                        this.state.data.fileList
                                                    } */
                                                    label="Select Attachment"
                                                    singleFileButtonText="Upload Data"
                                                // multipleFileButtonText="Select Files"
                                                >
                                                </SwasthaFilePicker>
                                            </Grid>
                                        }
                                    </Grid>
                                </Grid>
                                {/* Short Reference*/}
                                <Grid className=" w-full"
                                    item
                                    lg={8}
                                    md={8}
                                    sm={12}
                                    xs={12}>
                                    <SubTitle title="Is Supplier Blacklisted?" />
                                    <FormControl component="fieldset">
                                        <RadioGroup
                                            name="yesno"
                                            value={this.state.formData.selected}
                                            onChange={(e) => {
                                                let formData = this.state.formData
                                                formData.selected = e.target.value
                                                this.setState({ formData })
                                            }}
                                        >
                                            <div>
                                                <FormControlLabel
                                                    value="yes"
                                                    control={<Radio />}
                                                    label="Yes"
                                                />
                                                <FormControlLabel
                                                    value="no"
                                                    control={<Radio />}
                                                    label="No"
                                                />
                                            </div>
                                            {/* <div>
                                                    <Button
                                                        className="ml-2"
                                                        style={{ backgroundColor: '#F20A0A', marginTop: "5px" }}
                                                        progress={false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon='backup'
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Upload
                                                        </span>
                                                    </Button>
                                                </div> */}
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {this.state.formData.selected === 'yes' &&
                                    <>
                                        <Grid className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                            style={{ display: "flex", alignItems: "end" }}>
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
                                                        style={{ backgroundColor: '#F20A0A', marginTop: "5px" }}
                                                        progress={false}
                                                        disabled={this.state.source_id ? true : false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="backup"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Upload
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {this.state.source_id &&
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

                                                    source="lp_supplier_black"
                                                    source_id={this.state.source_id}

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
                                                    /* selectedFileList={
                                                        this.state.data.fileList
                                                    } */
                                                    label="Select Attachment"
                                                    singleFileButtonText="Upload Data"
                                                // multipleFileButtonText="Select Files"
                                                >
                                                </SwasthaFilePicker>
                                            </Grid>
                                        }
                                    </>
                                }
                                {/* Patient Details*/}
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                    <SubTitle title="Contact Details" />
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
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Address" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Address"
                                                name="address"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .address
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
                                                            address:
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
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="District" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="District"
                                                name="district"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .district
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
                                                            district:
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
                                            <SubTitle title="Fax" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Fax"
                                                name="fax"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .fax
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
                                                            fax:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }}
                                                validators={[
                                                    'required', 'matchRegexp:^\s*([0-9a-zA-Z]*)\s*$'
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                    'Invalid Inputs'
                                                ]}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        {/* Serial Number*/}
                                        {/* Name*/}
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={8}
                                            md={8}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Tel" />
                                            <div style={{ display: "flex" }}>
                                                <div className='mr-2' style={{ flex: 1 }}>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Phone Number"
                                                        name="phone"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .phone1
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
                                                                    phone1:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required', 'matchRegexp:^\s*([0-9a-zA-Z]*)\s*$'
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                            'Invalid Inputs'
                                                        ]}
                                                    />
                                                </div>
                                                <div className='ml-2' style={{ flex: 1 }}>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Phone Number"
                                                        name="phone"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .phone2
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
                                                                    phone2:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required', 'matchRegexp:^\s*([0-9a-zA-Z]*)\s*$'
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                            'Invalid Inputs'
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        {/* Serial Number*/}
                                        {/* Name*/}
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={8}
                                            md={8}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Email" />
                                            <div style={{ display: "flex" }}>
                                                <div className='mr-2' style={{ flex: 1 }}>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Email Address"
                                                        name="email"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .email1
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
                                                                    email1:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required', 'isEmail'
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                            'Please enter a valid Email Address'
                                                        ]}
                                                    />
                                                </div>
                                                <div className='ml-2' style={{ flex: 1 }}>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Email Address"
                                                        name="email"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .email2
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
                                                                    email2:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        validators={[
                                                            'required', 'isEmail'
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required',
                                                            'Please enter a valid Email Address'
                                                        ]}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    {/* Item Details */}
                                    <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: "12px" }}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <SubTitle title="Item Registration" />
                                            <Divider className='mt-2' />
                                        </Grid>
                                    </Grid>
                                    {/* Serial Number*/}
                                    <Grid container spacing={2} style={{ marginTop: "12px", marginBottom: "12px" }}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Item />
                                        </Grid>
                                    </Grid>
                                    {/* Submit and Cancel Button */}
                                    <Grid
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
                                                {/* Submit Button */}
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
                                                        Register
                                                    </span>
                                                </Button>
                                            </Grid>
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

export default withStyles(styleSheet)(Surgical)
