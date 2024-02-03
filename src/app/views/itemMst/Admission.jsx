import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControlLabel,
    Checkbox,
    Hidden,
    FormGroup,
    TextField,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import ClinicService from 'app/services/ClinicService'
import PatientServices from 'app/services/PatientServices'
import PatientClinicService from 'app/services/PatientClinicService'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'

import {
    Button,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    DatePicker,
    CheckboxValidatorElement,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'

const styleSheet = (theme) => ({})

class Admission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            patient_pic: null,
            //snackbar related
            alert: false,
            message: '',
            severity: 'success',
            phnSearch: null,
            clinicData: [],
            patientObj: null,
            formData: {
                //guardian detail
                title: 'Mr',
                name: null,
                nic: null,
                admissionMode: 'Direct',
                admissionType: 'Ward',
                //admission detail
                admissionWard: '',
                admissionType: '',
                ward: '',
                consultant: null,
                telephone: null,
                address: null,
                stat: false,
                medicoLegal: false,
                transportMode: null,
                dateOfBirth: null,

                patientId: null,
                clinicId: null,
                consultantId: null,
                dateTime: new Date(),
            },
        }
    }

    componentDidMount() {
        this.loadPreData()
    }

    /**
     * Function to retrieve required data sets to inputs
     */
    async loadPreData() {
        //clinic data
        let params = {}
        let store_data = await localStorageService.getItem('Login_user_Hospital');

        let clinicDataSet = await ClinicService.fetchAllClinicsNew(params, store_data.owner_id)

        //let clinicDataSet = await ClinicService.fetchAllClinics()
        if (200 == clinicDataSet.status) {
            this.setState({
                clinicData: clinicDataSet.data.view.data,
            })
        }
    }

    /**
     * Submit User data
     */
    onSubmit = async () => {
        //check if user tried to proceed with an invalid phn
        if (null == this.state.patientObj) {
            this.setState({
                alert: true,
                message: 'Please enter a valid PHN to proceed',
                severity: 'error',
            })
        } else {
            let {
                title,
                name,
                nic,
                admissionMode,
                admissionWard,
                admissionType,
                ward,
                consultant,
                stat,
                medicoLegal,
                telephone,
                address,
                transportMode,
                dateOfBirth,
                dateTime,
                clinicId,
            } = this.state.formData

            const patientClinicObj = {
                guardian: {
                    title,
                    name,
                    contact_no: telephone,
                    nic,
                    address,
                },
                patient_id: this.state.patientObj.id,
                clinic_id: clinicId,
                //TODO ; Confirm mapping for this
                consultant_id: 1,
                mode: admissionMode,
                type: admissionType,
                transport_mod: transportMode,
                // TODO : Confirm what this is
                bht: 1445,
                stat,
                medico_legal: medicoLegal,
                admit_date_time: dateTime,
            }

            let res = await PatientClinicService.createNewPatientClinic(
                patientClinicObj
            )
            if (201 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Clinic patient Registration Successful',
                    severity: 'success',
                })
            } else {
                this.setState({
                    alert: true,
                    message: 'Clinic patient Registration Unsuccessful',
                    severity: 'error',
                })
            }
        }
    }

    /**
     *
     * @param {} val
     * Update the status based on the check box selection
     */
    handleChange = (val) => {
        const formDataSet = this.state.formData
        this.setState({
            formData: {
                ...formDataSet,
                ['stat' == val.target.name ? 'stat' : 'medicoLegal']:
                    val.target.checked,
            },
        })
    }

    handlePhnSubmit = async () => {
        const patientdata = await PatientServices.fetchPatientsByAttribute(
            'phn',
            this.state.phnSearch
        )
        if (200 == patientdata.status) {
            this.setState({
                patientObj:
                    0 < patientdata.data.view.totalItems
                        ? patientdata.data.view.data[0]
                        : null,
            })
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* Content start*/}
                        <div className="w-full">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.onSubmit()}
                                onError={() => null}
                            >
                                <Grid container spacing={2} className="flex ">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={1}>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <CardTitle title="Search Patient" />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="PHN" />
                                                <ValidatorForm
                                                    ref={'innnr-form'}
                                                    className="pt-2"
                                                    onSubmit={() =>
                                                        this.handlePhnSubmit()
                                                    }
                                                    onError={() => null}
                                                >
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="PHN Value"
                                                        name="01243293492392"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                phnSearch:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }}
                                                    />
                                                </ValidatorForm>
                                            </Grid>

                                            <Grid
                                                item
                                                className="mt-2"
                                                lg={6}
                                                md={8}
                                                sm={12}
                                                xs={12}
                                            >
                                                <ImageView
                                                    image_data={
                                                        this.state.patient_pic
                                                    }
                                                    preview_width="70px"
                                                    preview_height="70px"
                                                    radius={25}
                                                />
                                            </Grid>

                                            <Grid
                                                className="my-auto"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj
                                                                .name
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={1}>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <CardTitle title="Guardian Details" />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Title" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={[
                                                        { label: 'Mr' },
                                                        { label: 'Mrs' },
                                                        { label: 'Miss' },
                                                    ]}
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    title: value.label,
                                                                },
                                                            })
                                                        }
                                                    }}
                                                    defaultValue={{
                                                        label: this.state
                                                            .formData.title,
                                                    }}
                                                    value={{
                                                        label: this.state
                                                            .formData.title,
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Title"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Name" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Name"
                                                    name="name"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    // value={"it"}
                                                    type="text"
                                                    variant="outlined"
                                                    value={
                                                        this.state.formData.name
                                                    }
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this.state
                                                                    .formData,
                                                                name: e.target
                                                                    .value,
                                                            },
                                                        })
                                                    }}
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="NIC" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="NIC"
                                                    name="nic"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    // value={"it"}
                                                    type="text"
                                                    value={
                                                        this.state.formData.nic
                                                    }
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this.state
                                                                    .formData,
                                                                nic: e.target
                                                                    .value.toUpperCase(),
                                                            },
                                                        })
                                                    }}
                                                    validators={['required','matchRegexp:^([0-9]{9}[x|X|v|V]|[0-9]{12})$']}
                                                    errorMessages={[
                                                        'this field is required','Invalid NIC',
                                                    ]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={1}>
                                            <Hidden smDown>
                                                <Grid
                                                    className="h-40px"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                ></Grid>
                                            </Hidden>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Telephone" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Telephone"
                                                    name="telephone"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    // value={"it"}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this.state
                                                                    .formData,
                                                                telephone:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .telephone
                                                    }
                                                    validators={['matchRegexp:^[0]{1}[0-9]{1}[0-9]{1}[0-9]{7}$']}
                                                errorMessages={[
                                                    'Invalid Phone Number'
                                                ]}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Address" />
                                                <TextValidator
                                                    className="w-full"
                                                    placeholder="Address"
                                                    name="address"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    // value={this.state.formData.description}
                                                    type="text"
                                                    multiline
                                                    rows={3}
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this.state
                                                                    .formData,
                                                                address:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .address
                                                    }
                                                    validators={['required']}
                                                    errorMessages={[
                                                        'this field is required',
                                                    ]}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} className="flex ">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={5}
                                                xs={5}
                                            >
                                                <SubTitle title="PHN" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={5}
                                                xs={5}
                                            >
                                                {/* <SubTitle title="121212324224324" /> */}
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj
                                                                .phn
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={5}
                                                xs={5}
                                            >
                                                <SubTitle title="NIC" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={7}
                                                xs={7}
                                            >
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj
                                                                .nic
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={5}
                                                xs={5}
                                            >
                                                <SubTitle title="Date Of Birth" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={7}
                                                xs={7}
                                            >
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj
                                                                .date_of_birth
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={5}
                                                xs={5}
                                            >
                                                <SubTitle title="Age" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={7}
                                                xs={7}
                                            >
                                                <SubTitle
                                                      title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                            .patientObj
                                                            .age?this.state
                                                            .patientObj
                                                            .age.split("-")[0]+"Y-"+this.state
                                                            .patientObj
                                                            .age.split("-")[1]+"M-"+this.state
                                                            .patientObj
                                                            .age.split("-")[2]+"D":""
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={5}
                                                xs={5}
                                            >
                                                <SubTitle title="Gender" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={7}
                                                xs={7}
                                            >
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj
                                                                .gender
                                                                ? 'Male'
                                                                : 'Female'
                                                    }
                                                />
                                            </Grid>

                                        </Grid>
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={1}>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <CardTitle title="Admission Detail" />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Admission Mode" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.admission_mode
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    admissionMode:
                                                                        value.label,
                                                                },
                                                            })
                                                        }
                                                    }}
                                                    defaultValue={{
                                                        label: this.state
                                                            .formData
                                                            .admissionMode,
                                                    }}
                                                    value={{
                                                        label: this.state
                                                            .formData
                                                            .admissionMode,
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Admission Mode"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .admissionMode
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Admission Type" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.admission_type
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    admissionType:
                                                                        value.label,
                                                                },
                                                            })
                                                        }
                                                    }}
                                                    defaultValue={{
                                                        label: this.state
                                                            .formData
                                                            .admissionType,
                                                    }}
                                                    value={{
                                                        label: this.state
                                                            .formData
                                                            .admissionType,
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Admission Type"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .admissionType
                                                            }
                                                            size="small"
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Ward" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.clinicData
                                                    }
                                                    onChange={(e, value) => {
                                                        if (value != null) {
                                                            if (null != value) {
                                                                this.setState({
                                                                    formData: {
                                                                        ...this
                                                                            .state
                                                                            .formData,
                                                                        clinicId:
                                                                            value.id,
                                                                    },
                                                                })
                                                            }
                                                        }
                                                    }}
                                                    value={this.state.clinicData.find(
                                                        (v) =>
                                                            v.id ==
                                                            this.state.formData
                                                                .clinicId
                                                    )}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                            ? option.name
                                                            : ''
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Ward"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .clinicId
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Consultant" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.consultant
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    consultant:
                                                                        value.label,
                                                                },
                                                            })
                                                        }
                                                    }}
                                                    value={{
                                                        label: this.state
                                                            .formData
                                                            .consultant,
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Consultant"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .consultant
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
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
                                            <Hidden smDown>
                                                <Grid
                                                    className="h-40px"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                ></Grid>
                                            </Hidden>
                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Transport Mode" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.transport_mode
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    transportMode:
                                                                        value.label,
                                                                },
                                                            })
                                                        }
                                                    }}
                                                    defaultValue={{
                                                        label: this.state
                                                            .formData
                                                            .transportMode,
                                                    }}
                                                    value={{
                                                        label: this.state
                                                            .formData
                                                            .transportMode,
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Transport Mode"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .transportMode
                                                            }
                                                            validators={[
                                                                'required',
                                                            ]}
                                                            errorMessages={[
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={2}
                                                md={2}
                                                sm={12}
                                                xs={12}
                                                className="mt-3"
                                            >
                                                <SubTitle title="Start" />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="stat"
                                                            value="stat"
                                                        />
                                                    }
                                                    label="Stat"
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <CheckboxValidatorElement
                                                            onChange={
                                                                this
                                                                    .handleChange
                                                            }
                                                            name="medicoLegal"
                                                            value="Start"
                                                        />
                                                    }
                                                    label="Medico Legal"
                                                />
                                            </Grid>

                                            <Grid
                                                className="mt--3"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Date of Birth" />
                                                <DatePicker
                                                    className="w-full"
                                                    value={
                                                        this.state.formData
                                                            .dateOfBirth
                                                    }
                                                    placeholder="Date From"
                                                    // minDate={new Date()}
                                                    maxDate={new Date()}
                                                    errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this.state
                                                                    .formData,
                                                                dateOfBirth:
                                                                    date,
                                                            },
                                                        })
                                                    }}
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <MuiPickersUtilsProvider
                                                    utils={MomentUtils}
                                                >
                                                    <DateTimePicker
                                                        label="Date and Time"
                                                        inputVariant="outlined"
                                                        value={
                                                            this.state.formData
                                                                .dateTime
                                                        }
                                                        onChange={(date) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    dateTime:
                                                                        date,
                                                                },
                                                            })
                                                        }}
                                                    />
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} className="flex ">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Address" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj
                                                                .address
                                                    }
                                                />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Moh Division" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj
                                                                .Moh.name
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="PHM Division" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj
                                                                .PHM.name
                                                    }
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="GN Divison" />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={6}
                                                md={6}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle
                                                    title={
                                                        null ==
                                                            this.state.patientObj
                                                            ? ''
                                                            : this.state
                                                                .patientObj.GN
                                                                .name
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid
                                    className=" w-full flex justify-end"
                                    item
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"
                                    // onClick={this.onSubmit}
                                    >
                                        <span className="capitalize">Save</span>
                                    </Button>
                                </Grid>
                            </ValidatorForm>
                        </div>

                        {/* Content End */}
                    </LoonsCard>
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
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(Admission)
