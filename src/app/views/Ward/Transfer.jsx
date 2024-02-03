import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Hidden,
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
import EmployeeServices from 'app/services/EmployeeServices'
import DashboardServices from 'app/services/DashboardServices'
import {
    Button,
    CardTitle,
    SubTitle,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import {  dateTimeParse } from "utils";

const styleSheet = (theme) => ({})

class Transfer extends Component {
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
            all_reasons: [],
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
                guardian_nic: null,
                id: null,
                marital_status: null,
                mobile_no: null,
                mobile_no2: null,
                name: null,
                nearest_hospital: null,
                nic: null,
                passport_no: null,
                phn: null,
                religion: null,
                title: null,

            },
            formData: {
                transfer_mode: 'To Ward',
                hospital_id: this.props.patientDetails.hospital_id,
                clinic_id: this.props.patientDetails.clinic_id,
                consultant_id: null,
                transfer_from: null,
                patient_id: this.props.patientDetails.patient_id,
                transfer_date_time: new Date(),
                bht: this.props.patientDetails.bht,
                transfered_hospital_id: null,

                /*  guardian_id: null,
                 mode: null,
                 type: null,
                 transport_mod:null,
                 bht: null,
                 stat: false,
                 medico_legal: false,                              
                 discharge_mode: null,
                 primary_diagnosis: null,               
                 transfer_date_time: null,
                 discharge_date_time: null,
                 other_diagnosis: null, */

                //admit_date_time: null, 
                reason_id: null,
                status: "Transfer"

            },
            loaded: false
        }
    }

    async componentDidMount() {
        // let selectedObj = this.props.location.state
        let selectedObj = this.props.patientDetails
        this.setState({
            patientObj: selectedObj,
        }, () => console.log("patient", selectedObj))
        this.loadConsultant()
        this.loadReasons()
        this.loadPreData()
        // this.loadHospitals()
        var user = await localStorageService.getItem('userInfo');
        let store_data = await localStorageService.getItem('Login_user_Hospital');

        let formData = this.state.formData;
        //formData.hospital_id = store_data.hospital_id;
        formData.admissionMode = selectedObj.mode;
        formData.admissionType = selectedObj.type;

        //formData.hospital_id = user.hospital_id;
        this.setState({ formData }, () => this.render())




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
    async loadReasons() {
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
            type: '',
        }

        let reasonData = await PatientServices.getAllReasons(params)
        console.log("Reasons", reasonData.data.view.data)
        // let all_consultant = [];
        if (200 == reasonData.status) {

            // reasonData.data.view.data.forEach(element => {
            //     console.log("single reason", element)
            //     all_consultant.push(element.Employee)
            // });

            this.setState({
                all_reasons: reasonData.data.view.data,
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


    async loadHospital(name_like) {
        let params_ward = { issuance_type: 'Hospital',department_type_name:['Hospital'],name_like:name_like }   
        let hospitals = await DashboardServices.getAllHospitals(params_ward);   
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }
    }

    /**
     * Submit User data
     */
    onSubmit = async () => {
        console.log('data', this.state.formData)
        let res = await PatientClinicService.admitPatient(
            this.state.formData, this.state.patientObj.id
        )
        console.log("admittion patient", res)
        if (200 == res.status) {
            this.setState({
                alert: true,
                message: 'Clinic patient Transfer Successful',
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

                            <Grid container spacing={2} className="flex ">
                                <Grid className=" w-full" item lg={4} md={4} sm={12} xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid
                                            item
                                            // className="mt-2"
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            {/* <ImageView
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
                                    </Grid>

                                    <Grid container spacing={1} className="flex ">
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
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
                                                    sm={7}
                                                    xs={7}
                                                >
                                                    <SubTitle title="Address" />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={7}
                                                    xs={7}
                                                >
                                                    <SubTitle
                                                        title={this.state.patientObj ? this.state.patientObj.Patient ? this.state.patientObj.Patient.address : '' : ''}
                                                    />
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={7}
                                                    xs={7}
                                                >
                                                    <SubTitle title="Moh Division" />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={7}
                                                    xs={7}
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
                                                    sm={7}
                                                    xs={7}
                                                >
                                                    {/* To Do - Check Why this is null backend */}
                                                    <SubTitle title="PHM Division" />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={7}
                                                    xs={7}
                                                >
                                                    <SubTitle
                                                        title={this.state.patientObj ? this.state.patientObj.Patient.PHM ? this.state.patientObj.Patient.PHM.name : '' : ''}
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={7}
                                                    xs={7}
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




                                    </Grid>



                                </Grid>
                                <Grid className=" w-full" item lg={8} md={8} sm={12} xs={12}>
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
                                                    <CardTitle title="Transfer Detail" />
                                                </Grid>




                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Transfer Mode" />
                                                    <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={
                                                            appConst.all_transfer_mode
                                                        }
                                                        onChange={(e, value) => {
                                                            if (value != null) {

                                                                let newStatus = '';
                                                                if (value.value == "To Hospital") {
                                                                    newStatus = "Transfer to Hospital"
                                                                } else if (value.value == "Shared Care") {
                                                                    newStatus = "Shared Care"
                                                                } else {
                                                                    newStatus = "Transfer"
                                                                }

                                                                this.setState({
                                                                    formData: {
                                                                        ...this.state.formData, transfer_mode: value.value, status: newStatus
                                                                    },
                                                                })

                                                            }
                                                        }}
                                                        value={appConst.all_transfer_mode.find((v) => v.value == this.state.formData.transfer_mode)}
                                                        getOptionLabel={(option) => {
                                                            return option.label ? option.label : ''
                                                        }
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Mode"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={this.state.formData.transfer_mode}
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

                                                {this.state.formData.transfer_mode == 'To Hospital' || this.state.formData.transfer_mode == 'Shared Care' ?
                                                    <Grid item lg={12} md={12} m={12} xs={12} >
                                                        <SubTitle title="Hospital" />
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={this.state.all_hospitals}
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
                                                            getOptionLabel={(option) => option.name ? option.name : ''}
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                {...params}
                                                                placeholder="Nearest Hospital"
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

                                                    : null}






                                                {this.state.formData.transfer_mode == 'To Ward' ?
                                                    <Grid
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Transfer To" />
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
                                                                                transfer_from:
                                                                                    value.id,
                                                                            },
                                                                        })
                                                                    }
                                                                    this.loadConsultant(value.id)
                                                                }
                                                            }}
                                                            value={this.state.clinicData.find(
                                                                (v) =>
                                                                    v.id ==
                                                                    this.state.formData.transfer_from
                                                            )}
                                                            getOptionLabel={(option) => {
                                                                console.log('option name', option.name);
                                                                return option.name
                                                                    ? option.name
                                                                    : ''
                                                            }
                                                            }
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Ward"
                                                                    //variant="outlined"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={this.state.formData.transfer_from}
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
                                                    : null}


                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Reffered Consultant" />
                                                    <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={
                                                            this.state.all_consultant
                                                        }
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                this.setState({
                                                                    formData: {
                                                                        ...this.state.formData, consultant_id: value.id,
                                                                    },
                                                                })
                                                            }
                                                        }}

                                                        value={this.state.all_consultant.find((obj) => obj.id == this.state.formData.consultant_id)}
                                                        getOptionLabel={(option) =>
                                                            option.name
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
                                                                    this.state.formData.consultant_id
                                                                }
                                                            /*     validators={[
                                                                   'required',
                                                               ]}
                                                               errorMessages={[
                                                                   'this field is required',
                                                               ]}  */
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
                                                    <SubTitle title="Reason For Transfer" />
                                                    <Autocomplete
                                        disableClearable
                                                        className="w-full"
                                                        options={
                                                            this.state.all_reasons
                                                        }
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                console.log('reason value', value)
                                                                this.setState({
                                                                    formData: {
                                                                        ...this.state.formData, reason_id: value.id,
                                                                    },
                                                                }, () => console.log(this.state.formData))
                                                            }
                                                        }}

                                                        value={this.state.all_reasons.find((obj) => obj.id == this.state.patientObj.reason_id)}
                                                        getOptionLabel={(option) =>
                                                            option.reason
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Reason"
                                                                //variant="outlined"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state.patientObj.reason_id
                                                                }
                                                            /*   validators={[
                                                                  'required',
                                                              ]}
                                                              errorMessages={[
                                                                  'this field is required',
                                                              ]} */
                                                            />
                                                        )}
                                                    />
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
                                                    <SubTitle title="Transferred Date and Time" />
                                                    <MuiPickersUtilsProvider
                                                        utils={MomentUtils}
                                                    >
                                                        <DateTimePicker
                                                            // label="Date and Time"
                                                            inputVariant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state.formData.transfer_date_time
                                                            }
                                                            onChange={(date) => {
                                                                this.setState({
                                                                    formData: {
                                                                        ...this
                                                                            .state
                                                                            .formData,
                                                                        transfer_date_time:
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
                                                <span className="capitalize">Transfer</span>
                                            </Button>
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

export default withStyles(styleSheet)(Transfer)
