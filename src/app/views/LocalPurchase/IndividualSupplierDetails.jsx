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

class IndividualSupplierDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
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
            columns: [
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
            formData: {
                page: 0,
                limit: 20,
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
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", alignItems: "center" }}>
                                <Typography variant='h6' className="font-semibold">ABC Company</Typography>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Stack direction="column" spacing={2}>
                                    <Chip label="Blacklisted" style={{ background: "#F02020", width: "fit-content" }} />
                                    <Rating name="half-rating-read" defaultValue={3.5} precision={0.1} readOnly />
                                </Stack>
                            </Grid>
                        </Grid>
                        <Divider className='mt-2' />
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row" style={{ marginLeft: "12px", marginTop: "12px" }}>
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
                                        <Grid container spacing={2}>
                                            {/* Serial Number*/}

                                            {/* <br />
                                            {renderRadioCard("is Supplier Blacklisted ?", 'yes')} */}
                                            {/* Patient Details*/}
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
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    {/* Name*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Supplier ID :', 'ML/LL/010')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Registered Date :', dateParse(new Date()))}
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Supplier Name :', 'A. N. Kumara')}
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Business Registration No :', '45678')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={2}
                                                        md={2}
                                                        sm={4}
                                                        xs={4}
                                                    >
                                                        <FileCopyIcon />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('VAT Registration No :', '8569')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={2}
                                                        md={2}
                                                        sm={4}
                                                        xs={4}
                                                    >
                                                        <FileCopyIcon />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('NMRA Supplier / Pharmacy Reg No :', '***************')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={2}
                                                        md={2}
                                                        sm={4}
                                                        xs={4}
                                                    >
                                                        <FileCopyIcon />
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderRadioCard('is Supplier BlackListed :', 'yes')}
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                {/* Item Details */}
                                                <Grid container spacing={2}>
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
                                                </Grid>
                                                <Grid container spacing={2}>
                                                    {/* Serial Number*/}
                                                    {/* Name*/}
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('Address :', '86, SUMANGALA MAWATHA, KURUNEGALA')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('District :', "KURUNEGALA")}
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                {/* Serial Number*/}
                                                {renderDetailCard('Fax :', '0112458796')}
                                                <br />
                                                {renderDetailCard('Email :', 'abc@gmail.com')}
                                                <br />
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={12}
                                                        lg={12}
                                                    >
                                                        <SubTitle title="Registered Items" />
                                                        <Divider className='mt-2' />
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Grid container spacing={2} style={{ border: "1px solid #000", padding: '8px', borderRadius: '12px' }}>
                                                    <LoonsTable
                                                        id={"itemDetails"}
                                                        data={this.state.data}
                                                        columns={this.state.columns}
                                                        options={{
                                                            pagination: true,
                                                            serverSide: true,
                                                            count: this.state.data.length,
                                                            rowsPerPage: this.state.formData.limit,
                                                            page: this.state.formData.page,
                                                            // rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                            onTableChange: (action, tableState) => {
                                                                switch (action) {
                                                                    case 'changePage':
                                                                        // const page = tableState.page;
                                                                        // const rowsPerPage = tableState.rowsPerPage;
                                                                        // const startIndex = page * rowsPerPage;
                                                                        // const endIndex = startIndex + rowsPerPage;
                                                                        // this.setState({
                                                                        //     formData: {
                                                                        //         ...this.state.formData,
                                                                        //         page: page
                                                                        //     },
                                                                        //     filterScheduleData: this.state.scheduleData.slice(startIndex, endIndex)
                                                                        // });
                                                                        break
                                                                    case 'changeRowsPerPage':
                                                                        // this.setState({
                                                                        //     formData: {
                                                                        //         ...this.state.formData,
                                                                        //         page: 0,
                                                                        //         limit: tableState.rowsPerPage
                                                                        //     },
                                                                        //     filterScheduleData: this.state.scheduleData.slice(0, tableState.rowsPerPage)
                                                                        // });
                                                                        break;
                                                                    case 'sort':
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
                                                <br />
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
                                </Grid>
                            </Grid>
                        </Grid>
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

export default withStyles(styleSheet)(IndividualSupplierDetails)
