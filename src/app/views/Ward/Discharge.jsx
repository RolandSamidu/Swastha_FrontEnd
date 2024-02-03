import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Hidden,
    Typography,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import ClinicService from 'app/services/ClinicService'
import PatientServices from 'app/services/PatientServices'
import PatientClinicService from 'app/services/PatientClinicService'
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import localStorageService from 'app/services/localStorageService';
import DashboardServices from 'app/services/DashboardServices';
import {
    Button,
    CardTitle,
    SubTitle,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import {  dateTimeParse ,dateParse, timeParse} from "utils";

const styleSheet = (theme) => ({})

class Discharge extends Component {
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
            all_consultant: [],
            all_hospitals: [],
            patientObj: {
                address: null,
                age: null,
                citizenship: null,
                contact_no: null,
                contact_no2: null,
                createdAt: null,
                created_by: null,
                date_of_birth: null,
                district_id: 1,
                driving_license: null,
                email: null,
                ethinic_group: null,
                gender: null,
                GN: null,
                guardian_nic: null,
                id: null,
                marital_status: null,
                mobile_no: null,
                mobile_no2: null,
                Moh: null,
                name: null,
                nearest_hospital: null,
                nic: null,
                passport_no: null,
                PHM: null,
                phn: null,
                religion: null,
                title: null
            },
            formData: {
                hospital_id: this.props.patientDetails.hospital_id,
                clinic_id: this.props.patientDetails.clinic_id,
                patient_id: this.props.patientDetails.patient_id,
                discharge_mode: 'Alive',
                discharge_date_time: new Date(),
                // reason_id: null,
                other_diagnosis: null,
                primary_diagnosis: null,
                transfered_hospital_id: null,

                /*  guardian_id: null,
                 mode: null,
                 type: null,
                 transport_mod:null,
                 bht: null,
                 stat: false,
                 medico_legal: false,             */
                //discharge_mode: null,


                status: "Discharged"

            },
            allDiagnosis: [],
            loaded: false
        }
    }
    async loadDiagnosis(value) {
        let params = { limit: 99999, page: 0, search: value }
        const res = await PatientServices.getDiagnosis(params)

        if (res.status == 200) {
            this.setState({ allDiagnosis: res.data.view.data })

        }
    }

    async componentDidMount() {
        // let selectedObj = this.props.location.state
        let selectedObj = this.props.patientDetails
        this.setState({
            patientObj: selectedObj,
        })
        this.loadPreData()
        //this.loadConsultant()
        var user = await localStorageService.getItem('userInfo');
        let store_data = await localStorageService.getItem('Login_user_Hospital');

        let formData = this.state.formData;
        formData.hospital_id = store_data.hospital_id;

        //formData.hospital_id = user.hospital_id;
        this.setState({ formData })




    }

    async loadHospital(name_like) {
        let params_ward = { issuance_type: 'Hospital', department_type_name: ['Hospital', 'Training'], name_like: name_like }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }
    }
    async loadConsultant(clinic_id) {
        /*  let params = {
             type: 'Consultant',
             designation: 'Consultant',
             limit: 99999999999,
             page: 0
         }
         let cunsultantData = await EmployeeServices.getEmployees(params)
         console.log("consultants", cunsultantData.data.view.data)
         if (200 == cunsultantData.status) {
             this.setState({
                 all_consultant: cunsultantData.data.view.data,
             })
         } */

        let params = {
            type: 'Consultant',
            pharmacy_drugs_stores_id: clinic_id

        }

        let cunsultantData = await PatientServices.getAllFront_Desk(params)
        console.log("consultants", cunsultantData.data.view.data)
        let all_consultant = [];
        if (200 == cunsultantData.status) {

            cunsultantData.data.view.data.forEach(element => {
                console.log("single emplyee", element.Employee)
                all_consultant.push(element.Employee)
            });



            this.setState({
                all_consultant: all_consultant,
            })
        }

    }

    /**
     * Function to retrieve required data sets to inputs
     */
    async loadPreData() {
        //clinic data
        let params = {
            issuance_type: 'Ward',
            is_clinic: true
        }
        let store_data = await localStorageService.getItem('Login_user_Hospital');

        let clinicDataSet = await ClinicService.fetchAllClinicsNew(params, store_data.owner_id)
        if (200 == clinicDataSet.status) {
            this.setState({
                clinicData: clinicDataSet.data.view.data,
                loaded: true
            })
        }
    }

    /**
     * Submit User data
     */
    onSubmit = async () => {
        console.log('data', this.state.formData);
        let res = await PatientClinicService.admitPatient(
            this.state.formData, this.state.patientObj.id
        )
        if (200 == res.status) {
            this.setState({
                alert: true,
                message: 'Clinic patient Discharge Successful',
                severity: 'success',
            })

            window.location.reload();

        } else {
            this.setState({
                alert: true,
                message: 'Action Unsuccessful',
                severity: 'error',
            })
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

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>

                {this.state.loaded ?
                    <div className="w-full">
                        <ValidatorForm
                            // className="pt-2"
                            ref={'outer-form'}
                            onSubmit={() => this.onSubmit()}
                            onError={() => null}
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
                                    <Grid container spacing={1}>
                                        <Grid
                                            item
                                            // className="mt-2"
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            {/*  <ImageView
                                            image_data={
                                                this.state.patient_pic
                                            }
                                            preview_width="200px"
                                            preview_height="200px"
                                            radius={25}
                                        /> */}
                                        </Grid>

                                        <Grid
                                            className="my-auto"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle
                                                title={this.state.patientObj ? this.state.patientObj.Patient ? this.state.patientObj.Patient.name : '' : ''}
                                            />
                                        </Grid>



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
                                                title={this.state.patientObj ? this.state.patientObj.Patient ? this.state.patientObj.Patient.phn : '' : ''}
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
                                                title={this.state.patientObj ? this.state.patientObj.Patient ? this.state.patientObj.Patient.nic : '' : ''}
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
                                                title={this.state.patientObj ? this.state.patientObj.Patient ? dateTimeParse(this.state.patientObj.Patient.date_of_birth) : '' : ''}
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
                                                                    .patientObj.Patient.age ? this.state
                                                                        .patientObj
                                                                        .Patient.age.split("-")[0] + "Y-" + this.state
                                                                            .patientObj
                                                                            .Patient.age.split("-")[1] + "M-" + this.state
                                                                            .patientObj
                                                                            .Patient.age.split("-")[2] + "D" : ""
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
                                                title={this.state.patientObj ? this.state.patientObj.Patient ? this.state.patientObj.Patient.gender : '' : ''}
                                            />
                                        </Grid>



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
                                                title={this.state.patientObj ? this.state.patientObj.Patient ? this.state.patientObj.Patient.address : '' : ''}
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
                                            {/* To Do - Check Why this is null backend */}
                                            <SubTitle
                                                title={this.state.patientObj ? this.state.patientObj.Patient.Moh ? this.state.patientObj.Patient.Moh.name : '' : ''}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {/* To Do - Check Why this is null backend */}
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
                                                title={this.state.patientObj ? this.state.patientObj.Patient.PHM ? this.state.patientObj.Patient.PHM.name : '' : ''}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            {/* To Do - Check Why this is null backend */}
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
                                                title={this.state.patientObj ? this.state.patientObj.Patient.GN ? this.state.patientObj.Patient.GN.name : '' : ''}
                                            />
                                        </Grid>

                                    </Grid>

                                </Grid>


                                <Grid
                                    className=" w-full"
                                    item
                                    lg={8}
                                    md={8}
                                    sm={12}
                                    xs={12}
                                >

                                    <Grid container spacing={2} className="flex ">


                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
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
                                                    <CardTitle title="Ward Admission Detail" />
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}

                                                    style={{ display: 'flex' }}
                                                >
                                                    <Typography variant="h8" className="font-semibold">Mode : </Typography>
                                                    <Typography variant="h8" className="font-semibold">{this.state.patientObj ? this.state.patientObj.mode : ''}</Typography>
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}

                                                    style={{ display: 'flex' }}
                                                >
                                                    <Typography variant="h8" className="font-semibold">Ward :
                                                    </Typography>
                                                    <Typography variant="h8" className="font-semibold">{this.state.patientObj ? this.state.patientObj.Pharmacy_drugs_store ? this.state.patientObj.Pharmacy_drugs_store.name : '' : ''}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}

                                                    style={{ display: 'flex' }}
                                                >
                                                    <Typography variant="h8" className="font-semibold">Consultant :
                                                    </Typography>
                                                    <Typography variant="h8" className="font-semibold">{this.state.patientObj ? this.state.patientObj.Employee ? this.state.patientObj.Employee.name : '' : ''}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}

                                                    style={{ display: 'flex' }}
                                                >
                                                    <Typography variant="h8" className="font-semibold">Reason for Admission :
                                                    </Typography>
                                                    <Typography variant="h8" className="font-semibold">{this.state.patientObj ? this.state.patientObj.WardAdmissionReason?.reason : ''}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
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

                                                    style={{ display: 'flex' }}
                                                >
                                                    <Typography variant="h8" className="font-semibold">Date :
                                                    </Typography>
                                                    <Typography variant="h8" className="font-semibold">{this.state.patientObj ? dateParse(this.state.patientObj.admit_date_time) : ''}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}

                                                    style={{ display: 'flex' }}
                                                >
                                                    <Typography variant="h8" className="font-semibold">Time :
                                                    </Typography>
                                                    <Typography variant="h8" className="font-semibold">{this.state.patientObj ? timeParse(this.state.patientObj.admit_date_time) : ''}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}

                                                    style={{ display: 'flex' }}
                                                >
                                                    <Typography variant="h8" className="font-semibold">Status :
                                                    </Typography>
                                                    <Typography variant="h8" className="font-semibold">{this.state.patientObj ? this.state.patientObj.status : ''}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}

                                                    style={{ display: 'flex' }}
                                                >
                                                    <Typography variant="h8" className="font-semibold">Transport By :
                                                    </Typography>
                                                    <Typography variant="h8" className="font-semibold">{this.state.patientObj ? this.state.patientObj.transport_mod : ''}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>

                                    <Grid container spacing={2} className="flex ">


                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
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
                                                    <CardTitle title="Discharge Detail" />
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={6}
                                                    md={6}
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

                                                        onChange={(e, value) => {
                                                            let newStatus = '';
                                                            if (value.value == "Death") {
                                                                newStatus = "Death"
                                                            }
                                                            else if (value.value == "Alive") {
                                                                newStatus = "Alive"
                                                            }
                                                            else if (value.value == "Alive") {
                                                                newStatus = "Alive"
                                                            }
                                                            else if (value.value == "LAMA") {
                                                                newStatus = "LAMA"
                                                            }
                                                            else if (value.value == "Shared Care") {
                                                                newStatus = "Shared Care"
                                                            }
                                                            else if (value.value == "Transfer to Other Hospital") {
                                                                newStatus = "Transfer to Other Hospital"
                                                            } else {
                                                                newStatus = "Alive"
                                                            }

                                                            this.setState({
                                                                formData: {
                                                                    ...this
                                                                        .state
                                                                        .formData,
                                                                    discharge_mode:
                                                                        value.value
                                                                    
                                                                },
                                                            })

                                                        }}

                                                        value={{
                                                            label: this.state.formData.discharge_mode,
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
                                                                        .discharge_mode
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
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >

                                                    <SubTitle title="Discharged Date" />
                                                    <MuiPickersUtilsProvider
                                                        utils={MomentUtils}
                                                    >
                                                        <DateTimePicker
                                                            // label="Date and Time"
                                                            inputVariant="outlined"
                                                            value={
                                                                this.state.formData.discharge_date_time
                                                            }
                                                            onChange={(date) => {

                                                                this.setState({
                                                                    formData: {
                                                                        ...this
                                                                            .state
                                                                            .formData,
                                                                        discharge_date_time:
                                                                            date,
                                                                    },
                                                                })
                                                            }}
                                                        />
                                                    </MuiPickersUtilsProvider>
                                                </Grid>

                                            </Grid>
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                               
                                                {this.state.formData.discharge_mode == 'Transfer to other hospital' ?
                                                    <Grid item lg={12} md={12} m={12} xs={12} >
                                                        <SubTitle title="Hospital" />
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={
                                                                this.state.all_hospitals
                                                            }
                                                            onChange={(e, value) => {
                                                                if (value != null) {
                                                                    let formData = this.state.formData
                                                                    formData.transfered_hospital_id = value.id
                                                                    this.setState({
                                                                        formData,
                                                                    })
                                                                }
                                                            }}
                                                            value={this.state.all_hospitals.find((v) => v.id == this.state.formData.transfered_hospital_id
                                                            )}
                                                            getOptionLabel={(
                                                                option
                                                            ) =>
                                                                option.name
                                                                    ? option.name
                                                                    : ''
                                                            }
                                                            renderInput={(
                                                                params
                                                            ) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Hospital"
                                                                    //variant="outlined"
                                                                    onChange={(e) => {
                                                                        if (e.target.value.length >= 3) {
                                                                            this.loadHospital(e.target.value)
                                                                        }
                                                                    }}
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                />
                                                            )}
                                                        />


                                                    </Grid>

                                                    : ""}

                                                {this.state.formData.discharge_mode == 'Death' ?
                                                    <Grid
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Cause of Death" />
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={this.state.allDiagnosis.filter((ele) => ele.status == "Active")}
                                                            onChange={(e, value) => {
                                                                if (value != null) {
                                                                    let formData = this.state.formData;
                                                                    formData.primary_diagnosis = value.id

                                                                    this.setState({
                                                                        formData

                                                                    })
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
                                                                />
                                                            )}
                                                        />

                                                        {/* <TextValidator
                                                                                    className=" w-full"
                                                                                    placeholder="diagnosis"
                                                                                    name="lessStock"
                                                                                    InputLabelProps={{
                                                                                        shrink: false
                                                                                    }}
                                                                                    value={this.state.patientObj.primary_diagnosis}
                                                                                    type="text"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            formData: {
                                                                                                ...this.state.formData,
                                                                                                primary_diagnosis: e.target.value
                                                                                            }
                                                                                        })
                                                                                    }} /> */}
                                                    </Grid>

                                                    : ""}
                                                {this.state.formData.discharge_mode == 'Alive' || this.state.formData.discharge_mode == 'Transfer to other hospital' || this.state.formData.discharge_mode == 'LAMA' || this.state.formData.discharge_mode == 'Shared Care' ?

                                                    <Grid
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Primary Diagnosis" />
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={this.state.allDiagnosis.filter((ele) => ele.status == "Active")}
                                                            onChange={(e, value) => {
                                                                if (value != null) {
                                                                    let formData = this.state.formData;
                                                                    formData.primary_diagnosis = value.id

                                                                    this.setState({
                                                                        formData

                                                                    })
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
                                                                />
                                                            )}
                                                        />

                                                        {/* <TextValidator
                                                                                    className=" w-full"
                                                                                    placeholder="diagnosis"
                                                                                    name="lessStock"
                                                                                    InputLabelProps={{
                                                                                        shrink: false
                                                                                    }}
                                                                                    value={this.state.patientObj.primary_diagnosis}
                                                                                    type="text"
                                                                                    variant="outlined"
                                                                                    size="small"
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            formData: {
                                                                                                ...this.state.formData,
                                                                                                primary_diagnosis: e.target.value
                                                                                            }
                                                                                        })
                                                                                    }} /> */}
                                                    </Grid>

                                                    : null}
                                                {this.state.formData.discharge_mode == 'Alive' || this.state.formData.discharge_mode == 'Transfer to other hospital' || this.state.formData.discharge_mode == 'LAMA' || this.state.formData.discharge_mode == 'Shared Care'?
                                                    <Grid
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Other Diagnosis" />
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={this.state.allDiagnosis.filter((ele) => ele.status == "Active")}
                                                            onChange={(e, value) => {
                                                                if (value != null) {
                                                                    let formData = this.state.formData;
                                                                    formData.other_diagnosis = value.id
                                                                    this.setState({ formData })
                                                                }
                                                            }}
                                                            value={this.state.allDiagnosis.find((obj) => obj.id == this.state.formData.other_diagnosis)}
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
                                                                />
                                                            )}
                                                        />

                                                        {/* <TextValidator
                                                              className=" w-full"
                                                              placeholder="diagnosis"
                                                              name="lessStock"
                                                              InputLabelProps={{
                                                                  shrink: false
                                                              }}
                                                              value={this.state.patientObj.other_diagnosis}
                                                              type="text"
                                                              variant="outlined"
                                                              size="small"
                                                              onChange={(e) => {
                                                                  this.setState({
                                                                      formData: {
                                                                          ...this.state.formData,
                                                                          other_diagnosis: e.target.value
                                                                      }
                                                                  })
                                                              }} /> */}
                                                    </Grid>

                                                    : null}
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
                                                        <span className="capitalize">Discharge</span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>




                                </Grid>


                            </Grid>

                        </ValidatorForm>
                    </div>
                    : null}
                {/* Content End */}

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

export default withStyles(styleSheet)(Discharge)
