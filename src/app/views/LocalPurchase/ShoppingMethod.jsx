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
    TextField,
    Badge,
    InputAdornment,
    IconButton,
    Icon,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

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
import { Stack } from '@mui/material'

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

const renderRadioCard = (label, value) => {
    return (
        <Grid className=" w-full"
            item
            lg={8}
            md={8}
            sm={8}
            xs={8}>
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

class ShoppingMethod extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
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
                    name: 'request_by',
                    label: 'Requested By',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'request_date',
                    label: 'Requested Date',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'request_quantity',
                    label: 'Requested Quantity',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'amount',
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
            formData: {
                request_id: 458,
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
                remark: null,
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
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Shopping Method" />
                        {/* Main Grid */}
                        <ValidatorForm className="pt-2"
                            onSubmit={() => this.SubmitAll()}
                            onError={() => null}>
                            <Grid container spacing={2} direction="row" style={{ marginLeft: "12px", marginTop: "12px", marginBottom: "12px" }}>
                                {/* Filter Section */}
                                <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginRight: "12px" }}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
                                        {/* Item Series heading */}
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <SubTitle title="Local Purchase Initial Details" />
                                            <Divider className='mt-2' />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            className='w-full'
                                            style={{ marginLeft: "24px" }}
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
                                                    {renderSubsequentDetailCard('LP Request ID :', '458')}
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
                                                    {renderSubsequentDetailCard('Institute :', 'National Hospital - Kandy')}
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
                                                    {renderSubsequentDetailCard('Ward Name :', 'Cardiology')}
                                                </Grid>
                                                {renderRadioCard("Patient Basis or Not :", 'yes')}
                                                {/* Patient Details*/}
                                            </Grid>
                                        </Grid>
                                        <Grid container spacing={2} style={{ marginBottom: "24px" }}>
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
                                            <Grid item xs={12} sm={12} md={12} lg={12} className='w-full' style={{ marginLeft: "24px" }}>
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                    >
                                                        {/* Item Details */}
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
                                                    </Grid>
                                                    <br />
                                                    {/* Serial Number*/}
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
                                                                        <SubTitle title="Attachments :" />
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                                                        <FileCopyIcon />
                                                                        <FileCopyIcon />
                                                                        {/* <Typography variant='body1' style={{ marginTop: '3px' }}>Good</Typography> */}
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                    <br />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={2} style={{ marginTop: "12px", padding: "24px", background: "#B3ACAC", borderRadius: "12px" }}>
                                            <CardTitle title='Previous LP Requests in this Year' style={{ marginLeft: "8px" }} />
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
                                        <Grid container spacing={2} className='mt-2 mb-2'>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                                className=" w-full flex justify-end"
                                            >
                                                <Button
                                                    style={{ alignItems: "flex-start", display: "flex" }}
                                                    className="mt-2 mr-2"
                                                    progress={false}
                                                    // type="submit"
                                                    // color="#d8e4bc"
                                                    startIcon={<KeyboardDoubleArrowRightIcon />}
                                                    scrollToTop={
                                                        true
                                                    }
                                                //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">
                                                        Send Quotation Request Letter
                                                    </span>
                                                </Button>
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

export default withStyles(styleSheet)(ShoppingMethod)
