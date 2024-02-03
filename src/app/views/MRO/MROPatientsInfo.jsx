import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Icon,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    Checkbox,
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    InputAdornment,
    Dialog,
    Tooltip,
    //Accordion,
    TextField,
    AccordionDetails,
    AccordionSummary,
} from '@material-ui/core'
import LoonsButton from 'app/components/LoonsLabComponents/Button'

import { Autocomplete } from '@material-ui/lab'
//import 'date-fns'

import Typography from '@material-ui/core/Typography'

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
import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import UtilityServices from 'app/services/UtilityServices'

import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import MROPatientDetails from './MROPatientDetails'


import * as Util from '../../../utils'
const drawerWidth = 270

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: '#bad4ec',
        // backgroundColor: themeColors['whiteBlueTopBar'].palette.primary.main
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth - 80}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        //padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})


class MROPatientsInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: true,
            activeStep: 0,
            trasnsferDialogView: false,
            admissiondialogView: false,
            dischargeDialogView: false,
            titleName: 'Patient Registration',
            isUpdate: false,
            alert: false,
            message: '',
            severity: 'success',
            loadedDiagnosis: true,
            Loaded: this.props.loaded,
            selectedPatient: null,
            is_load: false,
            totalItems: 0,
            totalPages: 0,
            // formData: this.props.filterData,
            data: [],
            allDiagnosis: [],
            itemCodes: [],
            updateStop: true,
            filterData: {
                limit: 100,
                page: 0,
                'order[0]': ['createdAt', 'DESC'],

            },
            formData: {
                hospital_id: null,
                patient_id: null,
                clinic_id: null,
                consultant_id: null,
                guardian_id: null,
                mode: null,
                type: null,
                transport_mod: null,
                stat: null,
                medico_legal: null,
                admit_date_time: null,
                reason_id: null,
                transfer_date_time: null,
                transfer_from: null,
                status: null,
                primary_diagnosis: null,
                other_diagnosis: null,
                phn: null,
                bht: null,
                patient_ward: null,
                name: null,
                address: null,
                origin: null,
                mobile: null,
                gender: null,
                age: null,
                transfer_time: null,
                icd_code: null,//ask
                additional_diagnosis: null,
                discharged_ward: null,
                ward_discharged_on: null,
                ward_discharged_at: null,
                admission_time: null,//ask,
                discharge_date_time: null,
                transfer_date: null,
                discharge_mode: null,
                mro_primary_diagnosis_id: null,
                mro_discharge_date_time: null,
                mro_discharge_mode: 'Alive',
                mro_medico_legal: false,
                mro_secondary_diagnosis_ids: null,
                mro_status: null,
                mro_request_type: null,

                description: null
            },
            stops: [{
                warehouse_id: null,

            }
            ],

            patient: {},
            mro_second: [{
                id: null
            }],
            age: {
                age_years: '',
                age_months: '',
                age_days: '',
            },
            diease_type: null,
            icd_code: null,

            warning_alert: false,
            temp_primary_diagnosis: null,

            warning_alert_secondory: false,
            temp_secondary_diagnosis: null,
            temp_secondory_index: null
        }
    }
    async getAge() {
        let age = this.state.formData.age
        console.log("age not", age)
        let newAge = await UtilityServices.getAge(Util.dateParse(age))
        console.log('newage2 ', newAge)
        // let calAge = newAge.age_years + " Y " + newAge.age_months + " M " + newAge.age_days + " D "

        this.setState({
            age: newAge
        })
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState(
            {
                formData,
            },
            () => {
                this.searchPatients()
            }
        )
    }
    clearDataTable() {
        this.setState({
            formData: {
                diease_type2: "",
                icd_code2: ""
            },
            diease_type: "",
            icd_code: ''
        })

    }
    // Remove item form the table
    async loadDiagnosis(value) {
        let params = { limit: 99999, page: 0, search: value }
        const res = await PatientServices.getDiagnosis(params)

        if (res.status == 200) {
            this.setState({ allDiagnosis: res.data.view.data })

        }
    }

    addStop() {
        this.setState({ updateStop: false })
        if (this.state.stops[this.state.stops.length - 1] && this.state.stops[this.state.stops.length - 1].id == null || this.state.stops[this.state.stops.length - 1].id == undefined) {
            this.setState({
                alert: true,
                severity: "Error",
                message: "No Diagnosis added"
            })
        } else {
            let empty = false
            this.state.stops.find((item) => {
                if (item.id == null) {
                    empty = true
                }
            })
            if (empty) {
                this.setState({
                    alert: true,
                    severity: "Error",
                    message: "Please fill or remove it first"
                })
            } else {
                this.state.stops.push({
                    id: null,
                    no: null,
                    warehouse_name: null
                })
            }

        }
        this.setState({ updateStop: true })
        console.log("STOPS", this.state.stops);
    }

    removeStop(index) {
        this.setState({ updateStop: false })
        if (this.state.stops.length == 1) {
            this.setState({
                alert: true,
                severity: "Error",
                message: "Add Diagnosis"
            })
        } else {
            this.state.stops.splice(index, 1)
            this.state.stops.forEach((item, index) => {
                this.state.stops[index].no = index + 1
            })
        }
        this.setState({ updateStop: true })
        console.log("STOPS", this.state.stops);
    }

    async loadData() {
        this.setState({
            is_load: false
        })
        console.log("aaaa", this.props.patient_id)
        let patient = await PatientServices.getPatientByIdClinic(this.props.match.params.id, this.state.filterData)

        console.log("data", patient)
        if (patient.status == 200) {
            this.getDiagnosebyId(patient.data.view?.primary_diagnosis)
            console.log("item Data", patient.data.view?.Patient.date_of_birth)
            let formData = {
                hospital_id: patient.data.view?.hospital_id,
                patient_id: patient.data.view?.patient_id,
                clinic_id: patient.data.view?.clinic_id,
                consultant_id: patient.data.view?.consultant_id,
                guardian_id: patient.data.view?.guardian_id,
                mode: patient.data.view?.mode,
                type: patient.data.view?.type,
                transport_mod: patient.data.view?.transport_mod,
                stat: patient.data.view?.stat,
                medico_legal: patient.data.view?.medico_legal,
                admit_date_time: patient.data.view?.admit_date_time,
                reason_id: patient.data.view?.reason_id,
                transfer_date_time: patient.data.view?.transfer_date_time,
                transfer_from: patient.data.view?.transfer_from,
                status: patient.data.view?.status,
                primary_diagnosis: patient.data.view?.primary_diagnosis,
                other_diagnosis: patient.data.view?.other_diagnosis,

                age: patient.data.view?.Patient.date_of_birth,

                //add mro
                //mro_primary_diagnosis_id: patient.data.view?.mro_primary_diagnosis_id,
                mro_discharge_date_time: patient.data.view.mro_discharge_date_time ? patient.data.view.mro_discharge_date_time : patient.data.view?.discharge_date_time,
                mro_secondary_diagnosis_data: patient.data.view?.MRO_S_D,
                mro_primary_diagnosis_data: patient.data.view?.MRO_P_D,
                mro_discharge_mode: patient.data.view.mro_discharge_mode ? patient.data.view.mro_discharge_mode : "Alive",
                mro_medico_legal: patient.data.view?.mro_medico_legal,
                // mro_secondary_diagnosis_ids:patient.data.view?,
                mro_status: patient.data.view?.mro_status,

                phn: patient.data.view?.Patient.phn,
                bht: patient.data.view?.bht,
                patient_ward: patient.data.view?.Pharmacy_drugs_store?.name,
                // // nic: patient.nic,
                name: patient.data.view?.Patient.name,
                // dob: Util.dateParse(patient.Patient.date_of_birth),
                address: patient.data.view?.Patient.address,
                origin: patient.data.view?.Patient.nearest_hospital,
                mobile: patient.data.view.Patient?.mobile_no,
                gender: patient.data.view.Patient?.gender,
                // age: patient.data.view.Patient?.age,
                // discharge_date_time:patient.data.view.discharge_date_time,

                transfer_time: patient.data.view.Patient?.transfer_time,
                // icd_code:patient.Patient.icd_code,//ask
                additional_diagnosis: patient.data.view.Patient?.additional_diagnosis,
                discharged_ward: patient.data.view.Patient?.discharged_ward,
                // age: await UtilityServices.Patient.getAge(Util.dateParse(patient.data.view.date_of_birth)),

                // primary_diagnosis:patient.data.view.primary_diagnosis,
                admission_time: patient?.admit_date_time,//ask
                discharge_date_time: Util.dateTimeParse(patient.data.view?.discharge_date_time),
                transfer_date: patient?.transfer_date_time,
                discharge_mode: patient?.discharge_mode,


            }

            this.setState({
                patient: patient.data.view,
                formData,
                is_load: true,
                //patient_age:await UtilityServices.getAge('1974-04-11')
            }, () => {
                this.getAge()
            })

        }


    }
    async submit() {

        let mro_second = []
        let itemId = this.props.match.params.id;
        this.state.stops.forEach(element => {
            if (element.id != null) {
                mro_second.push(element.id)
            }

        });
        let formData = this.state.formData
        formData.age = this.state.ageYear + this.state.ageMonth + this.state.ageDay
        formData.mro_secondary_diagnosis_ids = mro_second
        formData.mro_status = 'Discharged'
        formData.mro_request_type = 'Discharged'

        console.log("Form Data new", formData)

        if (this.state.isUpdate) {
            formData.status = 'Discharged'

            formData.medico_legal = formData.mro_medico_legal
            formData.mro_primary_diagnosis_id = formData.primary_diagnosis
            delete formData.primary_diagnosis;

            console.log("patient discharge", formData)
            if (formData.mro_secondary_diagnosis_ids.length > 0) {
                formData.other_diagnosis = formData.mro_secondary_diagnosis_ids[0]
            }
            formData.discharge_mode = formData.mro_discharge_mode
            formData.discharge_date_time = formData.mro_discharge_date_time
        }

        let res = await PatientServices.patchPatientByIdClinic(formData, itemId)
        if (res.status == 200) {
            this.setState({
                alert: true,
                message: 'Patient has been updated Successfully.',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Cannot Update Patient ',
                severity: 'error',
            })
        }

    }
    async getDiagnosebyId(id) {
        this.setState({
            loadedDiagnosis: false
        })
        let params = { limit: 99999, page: 0 }
        const res = await PatientServices.getDiagnosisbyID(params, id)

        if (res.status == 200) {
            let allDiagnosis = []
            allDiagnosis.push(res.data.view)

            this.setState({
                loadedDiagnosis: true,
                allDiagnosis: allDiagnosis
            })

        } else {
            this.setState({
                loadedDiagnosis: true,

            })
        }
    }

    async validateFromEmmr(value, type) {

        if (this.state.age.age_years != null) {
            let params = {
                icd_code: value.icd_code,
                disMode: this.state.formData.mode,
                gen: this.state.formData.gender,
                ageY: this.state.age.age_years,
                force_publish: false
            }
            console.log("params", params)

            const res = await PatientServices.validateFromEMMR(params)

            if (res.status == 200) {
                console.log("emmr res", res.data.view)
                if (res.data.view.status == true) {
                    let formData = this.state.formData;
                    formData.primary_diagnosis = value.id
                    formData.mro_primary_diagnosis_id = value.id
                    formData.mro_primary_diagnosis_data = value.type
                    this.setState({ formData })
                    console.log("ok")
                } else if (res.data.view.force_available) {
                    console.log("need to conform")
                    this.setState({
                        warning_alert: true,
                        temp_primary_diagnosis: value
                    })

                } else {
                    document.getElementById('primary-diagnosis').value = null;
                    console.log("invaled")
                    this.setState({
                        alert: true,
                        message: 'Invalid Diagnosis',
                        severity: 'error',
                    })

                }
            }else{
               
                 let formData = this.state.formData;
                formData.primary_diagnosis = value.id
                formData.mro_primary_diagnosis_id = value.id
                formData.mro_primary_diagnosis_data = value.type
                this.setState({ formData }) 
            }

        } else {

            this.setState({
                alert: true,
                message: 'Please Enter the Age',
                severity: 'error',
            })
        }


    }

    async validateFromEmmrSecondory(value, index) {

        if (this.state.age.age_years != null) {
            let params = {
                icd_code: value.icd_code,
                disMode: this.state.formData.mode,
                gen: this.state.formData.gender,
                ageY: this.state.age.age_years,
                force_publish: false
            }
            console.log("params", params)

            const res = await PatientServices.validateFromEMMR(params)

            if (res.status == 200) {
                console.log("emmr res", res.data.view)
                if (res.data.view.status == true) {

                    let stops = this.state.stops;
                    stops[index].id = value.id
                    this.setState({ stops })

                } else if (res.data.view.force_available) {
                    console.log("need to conform")
                    this.setState({
                        warning_alert_secondory: true,
                        temp_secondary_diagnosis: value,
                        temp_secondory_index: index
                    })

                } else {
                    console.log("invaled")
                    document.getElementById("secondory_diagnosis_"+index).value = null;
                
                    this.setState({
                        alert: true,
                        message: 'Invalid Diagnosis',
                        severity: 'error',
                    })

                }
            }else{
               
                 let stops = this.state.stops;
                stops[index].id = value.id
                this.setState({ stops }) 
            }

        } else {

        
            this.setState({
                alert: true,
                message: 'Please Enter the Age',
                severity: 'error',
            })
        }


    }


    componentDidMount() {
        // console.log('ID', this.props.match.params.id)
        this.loadData()

        // this.loadDiagnosis()
        // this.searchPatients()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <CardTitle title={this.state.formData.mro_status !== 'Discharged' ?
                        "Updating Discharging Details" : "Details of Discharge "} />

                    <div className="w-full">
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.submit()}
                            onError={() => null}
                        >
                            <Grid container={2} spacing={2}>



                                <Grid item
                                    lg={8}
                                    md={8}
                                    sm={12}
                                    xs={12}>
                                    <LoonsCard>
                                        <Grid container spacing={1}>
                                            <Grid
                                                item
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Discharge Mode" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.discharge_mode
                                                    }
                                                    disabled={this.state.formData.mro_status == "Discharged"}
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    mro_discharge_mode:
                                                                        value.label,
                                                                    discharge_mode: value.label

                                                                },
                                                            })
                                                        }
                                                    }}

                                                    value={{
                                                        label: this.state.formData.mro_discharge_mode,
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Discharge Mode"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .mro_discharge_mode
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
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Age Year" />
                                                <TextValidator
                                                    className="w-full"

                                                    name="secondary"
                                                    placeholder="Age Year"
                                                    InputLabelProps={{ shrink: false }}
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.age.age_years}

                                                /* validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Age Month" />
                                                <TextValidator
                                                    className="w-full"

                                                    name="secondary"
                                                    placeholder="Age Month"
                                                    InputLabelProps={{ shrink: false }}
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.age.age_months}

                                                /* validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                />
                                            </Grid>
                                            <Grid
                                                className="w-full"
                                                item
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Age Day" />
                                                <TextValidator
                                                    className="w-full"
                                                    name="secondary"
                                                    placeholder="Age Day"
                                                    InputLabelProps={{ shrink: false }}
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.age.age_days}

                                                /* validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                />
                                            </Grid>



                                        </Grid>


                                        <Typography
                                            variant="h6"
                                            style={{ fontSize: 16, color: 'black' }}
                                        >
                                            Primary Diagnosis
                                        </Typography>
                                        {this.state.formData.mro_status !== 'Discharged' ?
                                            <Grid className=" w-full" item lg={10} md={10} sm={12} xs={12} >
                                                {/* <SubTitle title="Disease Type" /> */}
                                                {this.state.loadedDiagnosis ?
                                                    <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        id="primary-diagnosis"
                                                        options={this.state.allDiagnosis.filter((ele) => ele.status == "Active")}
                                                        onChange={(e, value) => {
                                                            console.log("aaaa", value)
                                                            if (value != null) {
                                                                this.validateFromEmmr(value, "primary")

                                                            }
                                                        }}
                                                        value={this.state.allDiagnosis.find((obj) => obj.id == this.state.formData.primary_diagnosis)}
                                                        getOptionLabel={(option) => option.type + " - " + option.icd_code}
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Disease Type + ICD CODE"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    if (e.target.value.length >= 3) {
                                                                        this.loadDiagnosis(e.target.value)
                                                                    }
                                                                }}
                                                                value={this.state.allDiagnosis.find((obj) => obj.id == this.state.formData.primary_diagnosis)?.icd_code}

                                                                validators={[
                                                                    'required',
                                                                ]}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                ]}
                                                            />
                                                        )}
                                                    />

                                                    : null}
                                            </Grid>
                                            :
                                            <Grid className=" w-full" item lg={10} md={10} sm={12} xs={12} >
                                                <TextValidator
                                                    className="w-full"

                                                    name="secondary"
                                                    placeholder="Procedure Type"
                                                    InputLabelProps={{ shrink: false }}
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.formData.mro_primary_diagnosis_data ? (this.state.formData.mro_primary_diagnosis_data.icd_code + "-" + this.state.formData.mro_primary_diagnosis_data.type) : ""}

                                                /* validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                />

                                            </Grid>
                                        }

                                        <Typography
                                            variant="h6"
                                            style={{ fontSize: 16, color: 'black' }}
                                        >
                                            Secondary Diagnosis
                                        </Typography>
                                        <Grid container>
                                            {/* <Grid item lg={2} md={2} xs={2}>Add Diagnosis</Grid> */}

                                            <Grid item lg={10} md={10} xs={10}>
                                                {this.state.formData.mro_status !== 'Discharged' ?
                                                    <Grid container
                                                        className=" w-full" >

                                                        {this.state.updateStop ? this.state.stops.map((row, index) => (
                                                            console.log("ROW", index, row),
                                                            <div style={{ display: 'flex', width: 'inherit', alignItems: 'center' }}>
                                                                {/* <Grid item lg={1} md={1} xs={1}>{index+1}</Grid>
                                                                <Grid item lg={2} md={2} xs={2}>{index+1}{index == 0 ? "st" : index == 1 ? "nd" : index == 2 ? "rd" :  "th"} Stop</Grid>                                                                                                                                 */}
                                                                <Grid item lg={10} md={10} xs={12}>
                                                                    <Autocomplete
                                        disableClearable
                                                                        options={this.state.allDiagnosis}
                                                                        id={"secondory_diagnosis_"+index}
                                                                        onChange={(e, value) => {

                                                                            let stops = this.state.stops
                                                                            let exist = false
                                                                            if (stops[index] && value != null) {
                                                                                stops.find(stop => {
                                                                                    if (stop.id == value.id) {
                                                                                        exist = true
                                                                                    }
                                                                                })
                                                                                if (exist) {
                                                                                    this.setState({
                                                                                        message: "Diagnosis Already Added",
                                                                                        severity: 'Error',
                                                                                        alert: true
                                                                                    })
                                                                                } else {

                                                                                    this.validateFromEmmrSecondory(value, index)

                                                                                }

                                                                            } else {
                                                                                stops[index].id = null
                                                                                console.log('stops', stops)
                                                                                this.setState({ stops })
                                                                            }

                                                                        }}

                                                                        value={this.state.allDiagnosis.find((v) => v.id == row.id)}
                                                                        getOptionLabel={(option) => option.type + " - " + option.icd_code}
                                                                        renderInput={(params) => (
                                                                            <TextField
                                                                                {...params}
                                                                                placeholder="Diagnosis"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                required="required"
                                                                                onChange={(e) => {
                                                                                    if (e.target.value.length >= 3) {
                                                                                        this.loadDiagnosis(e.target.value)
                                                                                    }
                                                                                }}
                                                                                validators={[
                                                                                    'required',
                                                                                ]}
                                                                                errorMessages={[
                                                                                    'this field is required',
                                                                                ]}
                                                                            />

                                                                        )} />
                                                                </Grid>
                                                                {this.state.stops.length - 1 == index ? <Grid item lg={2} md={2} xs={2}> {this.state.formData.mro_status !== 'Discharged' ? <Button style={{ backgroundColor: 'red', color: 'white' }} className='ml-2 mt-1' onClick={() => {
                                                                    console.log("INDEX", index);
                                                                    this.removeStop(index)
                                                                }}>-</Button> : null}</Grid> : null}

                                                            </div>
                                                        )
                                                        ) :
                                                            <Grid className="justify-center text-center w-full mt-2 pt-12">
                                                                <CircularProgress size={30} />
                                                            </Grid>}
                                                        <Grid className="mt-2"> {this.state.formData.mro_status !== 'Discharged' ? <LoonsButton onClick={() => { this.addStop() }}>+</LoonsButton> : null}</Grid>
                                                    </Grid>

                                                    :
                                                    <Grid container>
                                                        {this.state.formData.mro_secondary_diagnosis_data.map((row) => (

                                                            <Grid
                                                                className=" w-full"
                                                                item
                                                                lg={12}
                                                                md={12}
                                                                sm={12}
                                                                xs={12}
                                                            >
                                                                <TextValidator
                                                                    className="w-full"

                                                                    name="secondary"
                                                                    placeholder="Procedure Type"
                                                                    InputLabelProps={{ shrink: false }}
                                                                    disabled={true}
                                                                    type="text"
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={row.Diagnosis ? (row.Diagnosis.icd_code + "-" + row.Diagnosis.type) : ""}

                                                                /* validators={['required']}
                                                                errorMessages={[
                                                                    'this field is required',
                                                                ]} */
                                                                />
                                                            </Grid>

                                                        ))}
                                                    </Grid>}
                                            </Grid>
                                        </Grid>




                                        <Grid container={3}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Discharged Ward" />
                                                <TextValidator
                                                    className="w-full"
                                                    value={this.state.formData.patient_ward}
                                                    name="DischargedWard"
                                                    placeholder="Discharged Ward"
                                                    InputLabelProps={{ shrink: false }}
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {

                                                        let formData = this.state.formData;
                                                        formData.discharged_ward = e.target.value
                                                        this.setState({ formData })


                                                    }}

                                                /* validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                lg={4}
                                                md={4}
                                                sm={12}
                                                xs={12}
                                                className='ml-2 w-full'
                                            >
                                                <SubTitle title="Ward Discharged Date and Time" />
                                                <MuiPickersUtilsProvider
                                                    utils={MomentUtils}
                                                >
                                                    <DateTimePicker
                                                        // label="Date and Time"
                                                        inputVariant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.formData.mro_discharge_date_time ? this.state.formData.mro_discharge_date_time : this.state.formData.discharge_date_time
                                                        }
                                                        disabled={this.state.formData.mro_status == "Discharged"}
                                                        onChange={(date) => {
                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    mro_discharge_date_time:
                                                                        date,
                                                                },
                                                            })
                                                        }}

                                                    />
                                                </MuiPickersUtilsProvider>
                                            </Grid>
                                            <Grid item
                                                lg={3}
                                                md={3}
                                                sm={12}
                                                xs={12}>
                                                <FormControlLabel
                                                    label="Medico-Legal"
                                                    className="mb-4 mt-4"
                                                    name="Medico-Legal"
                                                    disabled={this.state.formData.mro_status == "Discharged"}
                                                    onChange={(e) => {
                                                        let formData = this.state.formData
                                                        if (formData.mro_medico_legal == null || formData.mro_medico_legal === false) {
                                                            formData.mro_medico_legal = true
                                                            this.setState({
                                                                formData
                                                            })
                                                        } else {
                                                            formData.mro_medico_legal = false
                                                            this.setState({
                                                                formData
                                                            })
                                                        }
                                                    }
                                                    }
                                                    control={
                                                        <Checkbox
                                                            size="small"
                                                            checked={this.state.formData.mro_medico_legal}
                                                        />
                                                    }

                                                />
                                            </Grid>

                                            <Grid container={3}>
                                            </Grid>



                                        </Grid>
                                        <Typography
                                            variant="h6"
                                            style={{ fontSize: 16, color: 'black' }}
                                        >
                                            Summery
                                        </Typography>
                                        <Grid className=" w-full" container={2}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={10}
                                                md={10}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Procedure Type" />
                                                <TextValidator
                                                    className="w-full"

                                                    name="procedure_type"
                                                    placeholder="Procedure Type"
                                                    InputLabelProps={{ shrink: false }}
                                                    disabled={true}
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {

                                                        let formData = this.state.formData;
                                                        formData.procedure = e.target.value
                                                        this.setState({ formData })


                                                    }}

                                                /* validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                />
                                            </Grid>
                                            {/* <Grid
                                        className="ml-1 w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Description" />
                                        <TextValidator
                                            className="w-full"
                                            placeholder="Description"
                                            name="Description"
                                            disabled={true}
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={
                                                this.state.formData.description
                                            }
                                            type="text"
                                            multiline
                                            rows={3}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                this.setState({
                                                    formData: {
                                                        ...this.state.formData,
                                                        description:
                                                            e.target.value,
                                                    },
                                                })
                                            }}
                                            // validators={['required']}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                        />
                                    </Grid> */}
                                        </Grid>

                                        {this.state.formData.mro_status !== 'Discharged' ?
                                            this.state.formData.status == 'Discharged' ?
                                                <Button
                                                    className="mt-2 mb-2"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={true}
                                                    startIcon="save"
                                                    disabled={this.state.formData.mro_status == 'Discharged' ? true : false

                                                    }
                                                >
                                                    <span className="capitalize">
                                                        Save
                                                    </span>
                                                </Button>
                                                : null : null}
                                        {this.state.formData.mro_status !== 'Discharged' ?
                                            <Button
                                                className="mt-2 mb-2 ml-2"

                                                progress={false}
                                                type="submit"
                                                scrollToTop={true}
                                                startIcon="update"
                                                disabled={this.state.formData.mro_status == 'Discharged' ? true : false}
                                                onClick={() => {
                                                    let isUpdate = this.state.isUpdate
                                                    this.setState({
                                                        isUpdate: true
                                                    })
                                                }}
                                            >
                                                <span className="capitalize">
                                                    Update
                                                </span>
                                            </Button>
                                            : null}
                                    </LoonsCard>


                                </Grid>
                                <Grid item lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}>
                                    {this.state.is_load ? <MROPatientDetails patient={this.state.patient} /> : null}
                                </Grid>
                            </Grid>


                        </ValidatorForm>
                    </div>

                    {/* <FlowDiagramComp data={this.state.hierachy} /> */}

                    {/*  <LoonsSnackbar
                        open={this.state.alert}
                        onClose={() => {
                            this.setState({ alert: false })
                        }}
                        message={this.state.message}
                        autoHideDuration={3000}
                        severity={this.state.severity}
                        elevation={2}
                        variant="filled"
                    ></LoonsSnackbar> */}
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

                <LoonsDiaLogBox
                    title="Are you sure?"
                    show_alert={true}
                    alert_severity="info"
                    alert_message="Please Conform the Diagnosis"
                    //message="testing 2"
                    open={this.state.warning_alert}
                    show_button={true}
                    show_second_button={true}
                    btn_label="No"
                    onClose={() => {
                        document.getElementById('primary-diagnosis').value = null;
                        this.setState({ warning_alert: false })
                    }}
                    second_btn_label="Yes"
                    secondButtonAction={() => {
                        let formData = this.state.formData;
                        let value = this.state.temp_primary_diagnosis;

                        formData.primary_diagnosis = value.id
                        formData.mro_primary_diagnosis_id = value.id
                        formData.mro_primary_diagnosis_data = value.type
                        this.setState({ formData, warning_alert: false })
                    }}
                >
                </LoonsDiaLogBox>



                <LoonsDiaLogBox
                    title="Are you sure?"
                    show_alert={true}
                    alert_severity="info"
                    alert_message="Please Conform the Diagnosis"
                    //message="testing 2"
                    open={this.state.warning_alert_secondory}
                    show_button={true}
                    show_second_button={true}
                    btn_label="No"
                    onClose={() => {
                        document.getElementById("secondory_diagnosis_"+this.state.temp_secondory_index).value = null;
                        this.setState({ warning_alert_secondory: false })
                    }}
                    second_btn_label="Yes"
                    secondButtonAction={() => {
                        let value = this.state.temp_secondary_diagnosis;
                        let index = this.state.temp_secondory_index;
                        
                        let stops = this.state.stops;
                        stops[index].id = value.id
                        this.setState({ stops })
                        this.setState({ stops, warning_alert_secondory: false })
                    }}
                >
            </LoonsDiaLogBox>

            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(MROPatientsInfo)
