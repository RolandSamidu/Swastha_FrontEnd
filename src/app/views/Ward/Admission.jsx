import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControlLabel,
    Hidden,
    RadioGroup,
    Radio,
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

import {
    Button,
    CardTitle,
    SubTitle,
    DatePicker,
    CheckboxValidatorElement,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import {  dateTimeParse } from "utils";

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
            all_consultant: [],
            all_reasons: [],
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
                consultant_id: this.props.patientDetails.consultant_id,
                hospital_id: this.props.patientDetails.hospital_id,
                /*  hospital_id: null,
                 patient_id: null,
                 clinic_id: null,
                 guardian_id: null,
                 mode: null,
                 type: null,
                 transport_mod:null,
                 bht: null,
                 medico_legal: false,                              
                 discharge_mode: null,
                 primary_diagnosis: null,               
                 transfer_date_time: null,
                 discharge_date_time: null,
                 other_diagnosis: null,
                 transfer_from: null, */
                admit_date_time: this.props.patientDetails.admit_date_time,
                reason_id: null,
                stat: this.props.patientDetails.stat,
                medico_legal: this.props.patientDetails.medico_legal,
                status: "Admitted"

            },
            loaded: false
        }
    }

    async componentDidMount() {
        this.setState({
            loaded: false
        })
        // let selectedObj = this.props.location.state
        let selectedObj = this.props.patientDetails
        this.setState({
            patientObj: selectedObj,
        }, () => console.log("patient", selectedObj))
        this.loadConsultant()
        this.loadReasons()
        this.loadPreData()
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
            }, () => console.log("consultant", this.state.all_consultant))
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
           // is_clinic: true
        }
        let store_data = await localStorageService.getItem('Login_user_Hospital');

        let clinicDataSet = await ClinicService.fetchAllClinicsNew(params, store_data.owner_id)
        if (200 == clinicDataSet.status) {
            this.setState({
                clinicData: clinicDataSet.data.view.data,
                loaded: true
            }, () => console.log("clinic data", this.state.clinicData))
        }
    }

    /**
     * Submit User data
     */
    onSubmit = async () => {
        console.log('data', this.state.formData)
        //check if user tried to proceed with an invalid phn
        if (null == this.state.patientObj) {
            this.setState({
                alert: true,
                message: 'Please enter a valid PHN to proceed',
                severity: 'error',
            })
        } else {
            // let {
            //     title,
            //     name,
            //     nic,
            //     admissionMode,
            //     admissionWard,
            //     admissionType,
            //     ward,
            //     consultant_id,
            //     stat,
            //     medicoLegal,
            //     telephone,
            //     address,
            //     transportMode,
            //     dateOfBirth,
            //     dateTime,
            //     clinicId,
            //     hospital_id
            // } = this.state.formData

            // const patientClinicObj = {
            //     guardian: {
            //         title,
            //         name,
            //         contact_no: telephone,
            //         nic,
            //         address,
            //     },
            //     patient_id: this.state.patientObj.id,
            //     clinic_id: clinicId,
            //     //TODO ; Confirm mapping for this
            //     consultant_id: consultant_id,
            //     mode: admissionMode,
            //     admissionType: admissionType,
            //     type: 'Ward',
            //     transport_mod: transportMode,
            //     // TODO : Confirm what this is
            //     //bht: 1445,
            //     stat,
            //     medico_legal: medicoLegal,
            //     admit_date_time: dateTime,
            //     hospital_id: hospital_id
            // }

            let res = await PatientClinicService.admitPatient(
                this.state.formData, this.state.patientObj.id
            )
            console.log("admittion patient", res)
            if (200 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Clinic patient Admitted Successful',
                    severity: 'success',
                })

                /*     let data = res.data.posted.data;
                    let url = appConst.PRINT_URL + '/patientAdmission.html?';
                    url = url + "institute=" + '';
                    url = url + "&patientTitle=" + this.state.patientObj.title;
                    url = url + "&patientName=" + this.state.patientObj.name;
                    url = url + "&age=" + this.state.patientObj.age;
                    url = url + "&patientGender=" + this.state.patientObj.gender;
                    url = url + "&patientMaritalstatus=" + this.state.patientObj.marital_status;
                    url = url + "&patientNIC=" + this.state.patientObj.nic;
                    url = url + "&patientAddress=" + this.state.patientObj.address;
                    url = url + "&patientID=" + this.state.patientObj.phn;
    
                    url = url + "&bht=" + data.bht;
                    url = url + "&nameOfGuardian=" + this.state.formData.name;
                    url = url + "&addressOfGuardian=" + this.state.formData.address;
                    url = url + "&telephonOfGuardian=" + this.state.formData.telephone;
                    url = url + "&admissionDate=" + dateParse(data.admit_date_time);
                    url = url + "&admissionTime=" + timeParse(data.admit_date_time);
                    url = url + "&wardName=" + this.state.formData.admissionWard;
                    url = url + "&consultantName=" + this.state.all_consultant.filter((ele) => ele.id == data.consultant_id)[0].name;
    
                    let child = window.open(url, '_blank'); */


                window.location.reload()
            } else {
                this.setState({
                    alert: true,
                    message: 'Action Unsuccessful',
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

        formDataSet.stat = val == "true" ? true : false;
        this.setState({
            formData: formDataSet,
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        console.log('reason value', this.state.patientObj.reason_id ? this.state.patientObj.reason_id : 'nah')
        return (
            <Fragment >
                {this.state.loaded ?
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

                                    <Grid container spacing={2} className="flex ">
                                       
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


                                        {/* <Grid
                                            item
                                            className="mt-2"
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <ImageView
                                                image_data={
                                                    this.state.patient_pic
                                                }
                                                preview_width="200px"
                                                preview_height="200px"
                                                radius={25}
                                            />
                                        </Grid> */}

                                        {/* <Grid
                                            className="my-auto"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle
                                                title={this.state.patientObj ? this.state.patientObj.Patient ? this.state.patientObj.Patient.name : '' : ''}
                                            />
                                        </Grid> */}
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
                                                    this.setState({
                                                        formData: {
                                                            ...this
                                                                .state
                                                                .formData,
                                                            mode:
                                                                value.label,
                                                        },
                                                    })
                                                }}
                                                // defaultValue={{
                                                //     label: this.state
                                                //         .formData
                                                //         .admissionMode,
                                                // }}
                                                value={{
                                                    label: this.state.patientObj.mode,
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
                                                            this.state.patientObj.mode
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
                                                                type:
                                                                    value.label,
                                                            },
                                                        })
                                                    }
                                                }}
                                                // defaultValue={{
                                                //     label: this.state
                                                //         .formData
                                                //         .admissionType,
                                                // }}
                                                value={{
                                                    label: this.state.patientObj.type,
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
                                                            this.state.patientObj.type
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
                                                                    clinic_id:
                                                                        value.id,
                                                                },
                                                            })
                                                        }
                                                        this.loadConsultant(value.id)
                                                    }
                                                }}
                                                value={this.state.clinicData.find(
                                                    (obj) =>
                                                        obj.id == this.state.patientObj.clinic_id
                                                )}

                                                // value={{label:this.state.patientObj?this.state.patientObj.Pharmacy_drugs_store ? this.state.patientObj.Pharmacy_drugs_store.name :'':''}}

                                                getOptionLabel={(option) => {
                                                    console.log('option name', option);
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
                                                        value={this.state.patientObj.clinic_id}
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
                                                    this.state.all_consultant
                                                }
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        this.setState({
                                                            formData: {
                                                                ...this.state.formData,
                                                                consultant_id: value.id,
                                                            },
                                                        })
                                                    }
                                                }}

                                                value={this.state.all_consultant.find((obj) => obj.id == this.state.patientObj.consultant_id)}
                                                getOptionLabel={(option) => {
                                                    console.log('option consult', option);
                                                    return option.name
                                                }}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Consultant"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.patientObj.consultant_id
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
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Reason" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.all_reasons
                                                }
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        this.setState({
                                                            formData: {
                                                                ...this.state.formData,
                                                                reason_id: value.id,
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
                                                        placeholder="Reason Admitted"
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
                                                                transport_mod:
                                                                    value.label,
                                                            },
                                                        })
                                                    }
                                                }}
                                                defaultValue={{
                                                    label: this.state
                                                        .formData
                                                        .transport_mod,
                                                }}
                                                value={{
                                                    label: this.state
                                                        .patientObj
                                                        .transport_mod,
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
                                                                .patientObj
                                                                .transport_mod
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
                                            {/* <SubTitle title="Stat" /> */}
                                        </Grid>
                                        <RadioGroup row>
                                                    <FormControlLabel
                                                        label={'Normal'}
                                                        name="Stat"
                                                        value={true}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            if(formData != null || formData == "Normal"){
                                                                formData.stat = 'Normal';

                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.formData.stat == 'Medico Legal' ? true : false
                                                    }  
                                                    />

                                                    <FormControlLabel
                                                        label={'Stat'}
                                                        name="Stat"
                                                        value={false}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            formData.stat = 'stat';
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.formData.stat == 'stat' ? true : false
                                                    }                                                    
                                                    />
                                                     <FormControlLabel
                                                        label={'Medico Legal'}
                                                        name="Stat"
                                                        value={false}
                                                        onChange={() => {
                                                            let formData = this.state.formData
                                                            formData.stat = 'Medico Legal';
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        control={
                                                            <Radio color="primary" size='small' />
                                                        }
                                                        display="inline"
                                                        checked={this.state.formData.stat == 'Medico Legal' ? true : false
                                                    }                                                    
                                                    />
                                                </RadioGroup>


                                        {/* <Grid
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <FormControlLabel
                                                control={
                                                    <CheckboxValidatorElement
                                                        checked={this.state.formData.stat}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.stat = !formData.stat;
                                                            this.setState({
                                                                formData
                                                            })
                                                        }
                                                        }
                                                        name="stat"
                                                        value="true"
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
                                                        checked={this.state.formData.medico_legal}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.medico_legal = !formData.medico_legal;
                                                            this.setState({
                                                                formData
                                                            })
                                                        }
                                                        }
                                                        name="medico_legal"
                                                        value="false"
                                                    />
                                                }
                                                label="Medico Legal"
                                            />
                                        </Grid> */}

                                        {/* <Grid
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
                                                this.state.patientObj ? this.state.patientObj.Patient ? this.state.patientObj.Patient.date_of_birth :'':''
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
                                    </Grid> */}
                                        <Grid
                                            className="mt--3"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Ward Admission Date" />
                                            <DatePicker
                                                className="w-full"
                                                value={
                                                    this.state.patientObj
                                                        .admit_date_time
                                                }
                                                placeholder="Admitted Date"
                                                // minDate={new Date()}
                                                maxDate={new Date()}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state
                                                                .formData,
                                                            admit_date_time:
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
                                                        this.state.patientObj
                                                            .admit_date_time
                                                    }
                                                    onChange={(date) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                admit_date_time:
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
                                        <span className="capitalize">Save</span>
                                    </Button>
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

export default withStyles(styleSheet)(Admission)
