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
import SearchIcon from '@mui/icons-material/Search';
import FileCopyIcon from '@mui/icons-material/FileCopy';

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
import localStorageService from 'app/services/localStorageService'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import PharmacyService from 'app/services/PharmacyService'
import ApprovalPrimary from './ApprovalPrimary'

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

class ApprovalSecondary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],
            id: null,
            lp_request_id: null,
            hospital_approval_config_id: null,
            hospital: {},
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

    loadData = async () => {
        //function for load initial data from backend or other resources
        let hospital_id = await localStorageService.getItem('main_hospital_id');
        let owner_id = await localStorageService.getItem('owner_id')

        this.setState({ loading: false });

        let id = this.props.match.params.id;
        let res = await LocalPurchaseServices.getLPRequestByID(id)

        if (res.status === 200) {
            this.setState({ data: res.data.view });
            console.log("LP Data: ", res.data.view)
        }

        let hospital_res = await PharmacyService.getPharmacyById(hospital_id, owner_id, { limit: 1 })
        if (hospital_res.status === 200) {
            this.setState({ hospital: hospital_res.data.view })
        }

        this.setState({ loading: true });

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
        // const params = new URLSearchParams(this.props.location.search);
        // let id = this.props.match.params.id;
        const { id, lp_request_id, hospital_approval_config_id } = this.props
        this.setState({
            id: id,
            lp_request_id: lp_request_id,
            hospital_approval_config_id: hospital_approval_config_id
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
                        <CardTitle title="Local Purchase Details" />
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
                                        <SubTitle title="Local Purchase Initial Details" />
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
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('LP Request ID :', this.state.loading ? this.state.data?.request_id ? this.state.data.request_id : 'Not Available' : 'Loading')}
                                            </Grid>

                                            {/* Name*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Procurement No :', '****************')}
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Institute :', this.state.loading ? this.state.hospital?.name ? this.state.hospital.name : 'Not Available' : 'Loading')}
                                            </Grid>

                                            {/* Short Reference*/}
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                {renderSubsequentDetailCard('Ward Name :', 'Cardiology')}
                                            </Grid>
                                            {renderRadioCard("Patient Basis or Not :", 'yes')}
                                            {/* Patient Details*/}
                                            <Grid
                                                item
                                                xs={12}
                                                sm={12}
                                                md={12}
                                                lg={12}
                                            >
                                                <SubTitle title="Patient Details" />
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
                                                        {renderSubsequentDetailCard('Name of the Patient :', 'A. N. Kumara')}
                                                    </Grid>
                                                </Grid>
                                                <br />
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
                                                        {renderSubsequentDetailCard('BHT / Clinic No :', '45')}
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={4}
                                                        md={4}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        {renderSubsequentDetailCard('PHN No :', '0770778451')}
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
                                                {renderRadioCard('Alternative Drug Availability :', 'yes')}
                                                {renderRadioCard('Formulate at MSD :', 'yes')}
                                                {renderDetailCard('Category :', '')}
                                                <br />
                                                <Grid container spacing={2}>
                                                    <Grid item xs={4} sm={4}>
                                                        <SubTitle title="Estimation :" />
                                                    </Grid>
                                                    <Grid item xs={8} sm={8} style={{ border: "1px solid #000", borderRadius: "12px", padding: "8px" }}>
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
                                                            {renderDetailCard('Annual Estimation :', '3600', { marginLeft: "4px" })}
                                                            <br />
                                                            {renderDetailCard('Monthly Requirement :', '300', { marginLeft: "4px" })}
                                                            <br />
                                                        </Grid>
                                                        {/* <div style={{ height: '20px', backgroundColor: 'grey' }}></div> */}
                                                    </Grid>
                                                </Grid>
                                                <br />
                                                <Typography variant='body1'>{`Quantity Locally Purchased (of the same item) during the year : ${'450'}`}</Typography>
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
                                                            <Button
                                                                className="mt-2 mr-2"
                                                                progress={false}
                                                                // type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="save"
                                                                onClick={() => {
                                                                    window.location = `/localpurchase/approval_list_drug/${this.state.id}?lp_request_id=${this.state.lp_request_id}&hospital_approval_config_id=${this.state.hospital_approval_config_id}`
                                                                }}
                                                            >
                                                                <span className="capitalize">
                                                                    View Drug Availability
                                                                </span>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
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

export default withStyles(styleSheet)(ApprovalSecondary)
