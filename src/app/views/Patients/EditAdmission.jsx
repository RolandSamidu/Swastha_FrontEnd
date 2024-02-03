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
import DashboardServices from 'app/services/DashboardServices';
import {
    Button,
    CardTitle,
    SubTitle,
    ImageView,
    DatePicker,
    CheckboxValidatorElement,
    LoonsSnackbar,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import { dateParse, timeParse, dateTimeParse } from "utils";
import moment from "moment";

const styleSheet = (theme) => ({})

class EditAdmission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            loadClinic: false,
            activeStep: 1,
            patient_pic: null,
            FrontDeskAdmin: false,
            loadConsultant: false,
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
                trasfered_from_hospital: null,
                nic: null,
                passport_no: null,
                PHM: 'PHM',
                phn: 'moh',
                religion: null,
                title: null
            },
            bht_open: false,
            formData: {
                //guardian detail
                title: null,   // this.props.data.title,
                name: null, //this.props.data.name,
                nic: null,//this.props.data.nic,
                mode: null, //'Direct',
                type: null, //'Ward',
                //admission detail
                admissionWard: '',
                trasfered_from_hospital: null,
                ward: '',
                consultant_id: null,
                telephone: this.props.data.contact_no,
                address: this.props.data.address,
                stat: 'Normal',
                medicoLegal: false,
                transport_mod: null,
                dateOfBirth: null, //this.props.data.date_of_birth ,
                bht: null,
                patientId: null,
                clinicId: null,
                consultantId: null,
                dateTime: new Date(),
            },
        }
    }

    async componentDidMount() {
        // let selectedObj = this.props.location.state
        this.loadConsultant(this.props.data.Pharmacy_drugs_store.id)

        this.loadPreData()
        let selectedObj = this.props.data
        selectedObj.clinicId = selectedObj.Pharmacy_drugs_store.id

        this.setState({
            formData: selectedObj,
        })
        console.log("seleced patient", selectedObj)

        // this.loadPreData()
        //this.loadConsultant()
        var user = await localStorageService.getItem('userInfo');
        var check_userrole = user.roles.filter((ele) => ele == 'Front Desk Admin')

        if (check_userrole.length > 0) {
            this.setState({
                FrontDeskAdmin: true,
            })
        }

        // user.roles
        let store_data = await localStorageService.getItem('Login_user_Hospital_front_desk');

        let formData = this.state.formData;
        formData.hospital_id = store_data.hospital_id;

        //formData.hospital_id = user.hospital_id;
        this.setState({ formData, loaded: true })




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
                loadConsultant: true,

            })
        }

    }
    async loadHospital(name_like) {
        let params_ward = { issuance_type: 'Hospital', department_type_name: ['Hospital', 'Training'], name_like: name_like }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
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
        let store_data = await localStorageService.getItem('Login_user_Hospital_front_desk');

        let clinicDataSet = await ClinicService.fetchAllClinicsNew(params, store_data.owner_id)
        if (200 == clinicDataSet.status) {
            this.setState({
                clinicData: clinicDataSet.data.view.data,
                loadClinic: true
            })
        }
    }

    /**
     * Submit User data
     */
    onSubmit = async () => {
        //check if user tried to proceed with an invalid phn
        let hospital_data = await localStorageService.getItem('Login_user_Hospital_front_desk')

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
                mode,
                admissionWard,
                type,
                ward,
                consultant_id,
                trasfered_from_hospital,
                stat,
                medicoLegal,
                telephone,
                address,
                transport_mod,
                dateOfBirth,
                dateTime,
                clinicId,
                hospital_id,
                bht,
                status
            } = this.state.formData

            const patientClinicObj = {
                guardian: this.state.formData.guardian,
                //patient_id: this.state.patientObj.id,
                clinicId: clinicId,
                //TODO ; Confirm mapping for this
                consultant_id: consultant_id,
                mode: mode,
                transport_mod: transport_mod,
                type: type,
                trasfered_from_hospital: trasfered_from_hospital,
                // TODO : Confirm what this is
                bht: bht,
                stat: stat,
                medico_legal: medicoLegal,
                admit_date_time: dateTime,
                hospital_id: hospital_id,
                status: status
            }

            let res = await PatientClinicService.editPatientClinic(
                patientClinicObj, this.state.formData.clinic_patient_id
            )
            console.log("admittion patient", res)

            if (200 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Clinic patient Registration Successful',
                    severity: 'success',
                })

                /* let data = res.data.posted.data;
                let url = appConst.PRINT_URL + hospital_data.owner_id + '/patientAdmission.html?';
                url = url + "institute=" + '';
                url = url + "&patientTitle=" + String(this.state.patientObj.title == null ? "" : this.state.patientObj.title);
                url = url + "&patientName=" + String(this.state.patientObj.name == null ? "" : this.state.patientObj.name);
                url = url + "&age=" + String(this.state.patientObj.age);
                url = url + "&patientGender=" + String(this.state.patientObj.gender);
                url = url + "&patientMaritalstatus=" + String(this.state.patientObj.marital_status);
                url = url + "&patientNIC=" + String(this.state.patientObj.nic == null ? "" : this.state.patientObj.nic);
                url = url + "&patientAddress=" + String(this.state.patientObj.address == null ? "" : this.state.patientObj.address);
                url = url + "&patientID=" + String(this.state.patientObj.phn == null ? "" : this.state.patientObj.phn);

                url = url + "&bht=" + String(data.bht == null ? '' : data.bht);
                url = url + "&nameOfGuardian=" + String(this.state.formData.name == null ? "" : this.state.formData.name);
                url = url + "&addressOfGuardian=" + String(this.state.formData.address == null ? "" : this.state.formData.address);
                url = url + "&telephonOfGuardian=" + String(this.state.formData.telephone == null ? "" : this.state.formData.telephone);
                url = url + "&admissionDate=" + String(dateParse(data.admit_date_time));
                url = url + "&admissionTime=" + String(timeParse(data.admit_date_time));
                url = url + "&wardName=" + String(this.state.formData.admissionWard);
                url = url + "&consultantName=" + String(this.state.all_consultant.filter((ele) => ele.id == data.consultant_id)[0]?.name);

                let child = window.open(url, '_blank');
 */

                window.location.reload()
            } else {
                this.setState({
                    alert: true,
                    message: res.error ? res.error : 'Clinic patient Registration Unsuccessful',
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
    intToString(num) {
        return num.toString()
    }
    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (

            <Fragment>
                {this.state.loaded ?
                    <div>
                        {/* Content start*/}
                        <div className="w-full">
                            <ValidatorForm
                            autoComplete="off"
                                // className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.onSubmit()}
                                onError={() => null}
                            >

                                <Grid container spacing={2} className="flex ">
                                    <Grid className=" w-full" item lg={3} md={3} sm={12} xs={12} >
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={1}>
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
                                                preview_width="50px"
                                                preview_height="50px"
                                                radius={25}
                                            /> 
                                        </Grid> */}

                                                <Grid
                                                    className="my-auto"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle
                                                        title={
                                                            this.state.formData.name
                                                            // null ==
                                                            //     this.state.patientObj
                                                            //     ? ''
                                                            //     : this.state
                                                            //         .patientObj
                                                            //         .name
                                                        }
                                                    />
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
                                                            this.state.formData.phn
                                                            // null ==
                                                            //     this.state.patientObj
                                                            //     ? ''
                                                            //     : this.state
                                                            //         .patientObj
                                                            //         .phn
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
                                                            this.state.formData.nic
                                                            // null ==
                                                            //     this.state.patientObj
                                                            //     ? ''
                                                            //     : this.state
                                                            //         .patientObj
                                                            //         .nic
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
                                                        title={dateParse(this.state.formData.date_of_birth)
                                                            // null ==
                                                            //     this.state.patientObj
                                                            //     ? ''
                                                            //     : dateTimeParse(this.state.patientObj.date_of_birth)
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
                                                        title={null ==
                                                            this.state.formData
                                                            ? ''
                                                            : this.state
                                                                .formData
                                                                .age ? this.state
                                                                    .formData
                                                                    .age.split("-")[0] + "Y-" + this.state
                                                                        .formData
                                                                        .age.split("-")[1] + "M-" + this.state
                                                                            .formData
                                                                            .age.split("-")[2] + "D" : ""
                                                            // null ==
                                                            //     this.state.patientObj
                                                            //     ? ''
                                                            //     : this.state
                                                            //         .patientObj
                                                            //         .age ? this.state
                                                            //             .patientObj
                                                            //             .age.split("-")[0] + "Y-" + this.state
                                                            //                 .patientObj
                                                            //                 .age.split("-")[1] + "M-" + this.state
                                                            //                     .patientObj
                                                            //                     .age.split("-")[2] + "D" : ""
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
                                                            this.state.formData.gender
                                                        }
                                                    />
                                                </Grid>

                                            </Grid>
                                        </Grid>
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
                                                            ? '-'
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
                                                {/* To Do - Check Why this is null backend */}
                                                <SubTitle
                                                    title={


                                                        this.state.patientObj?.Moh == null
                                                            ? '-'
                                                            : this.state.patientObj?.Moh?.name}
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
                                                    title={this.state.patientObj.mobile_no !== null
                                                        ? this.state.patientObj.mobile_no
                                                        : '-'

                                                        // this.state.patientObj?.PHM == null
                                                        //     ? '-'
                                                        //     : this.state.patientObj?.PHM?.name

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


                                                    title={this.state.patientObj?.GN == null
                                                        ? '-'
                                                        : this.state.patientObj?.GN?.name}

                                                // : this.state
                                                //       .patientObj.GN
                                                //       .name

                                                />
                                            </Grid>
                                        </Grid>


                                    </Grid>









                                    <Grid className=" w-full" item lg={9} md={9} sm={12} xs={12} >


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
                                                        <CardTitle title="Guardian Details 1" />
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
                                                                    let formData = this.state.formData;
                                                                    formData.guardian.title = value.label;
                                                                    this.setState({ formData })
                                                                    
                                                                   
                                                                }
                                                            }}
                                                            defaultValue={{
                                                                label: this.state
                                                                    .formData?.guardian?.title,
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
                                                                this.state.formData?.guardian?.name
                                                            }
                                                            size="small"
                                                            onChange={(e) => {
                                                                let formData = this.state.formData;
                                                                formData.guardian.name = e.target.value;
                                                                this.setState({ formData })
                                                            }}
                                                        /*  validators={['required']}
                                                         errorMessages={[
                                                             'this field is required',
                                                         ]} */
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
                                                                this.state.formData?.guardian?.nic
                                                            }
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => {

                                                                let formData = this.state.formData;
                                                                formData.guardian.nic = e.target.value.toUpperCase();
                                                                this.setState({ formData })


                                                            }}
                                                          validators={['matchRegexp:^([0-9]{9}[x|X|v|V]|[0-9]{12})$']}
                                                         errorMessages={[
                                                             'Invalid NIC',
                                                         ]} 
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
                                                                let formData = this.state.formData;
                                                                formData.guardian.contact_no = e.target.value;
                                                                this.setState({ formData })
                                                            }}
                                                            value={this.state.formData?.guardian?.contact_no ? this.intToString(this.state.formData?.guardian?.contact_no) : null}
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
                                                                let formData = this.state.formData;
                                                                formData.guardian.address = e.target.value;
                                                                this.setState({ formData })
                                                            }}
                                                            value={
                                                                this.state.formData?.guardian?.address
                                                            }
                                                        /* validators={['required']}
                                                        errorMessages={[
                                                            'this field is required',
                                                        ]} */
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>

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
                                                                            mode:
                                                                                value.label,
                                                                        },
                                                                    })
                                                                }
                                                            }
                                                            }
                                                            value={appConst.admission_mode.find((v) =>
                                                                v.label == this.state.formData.mode
                                                            )}
                                                            //chnge from
                                                            // value={this.state.admission_mode.find(
                                                            //     (v) =>
                                                            //         v.id ==
                                                            //         this.state.formData
                                                            //             .mode
                                                            // )}
                                                            //changed to


                                                            defaultValue={{
                                                                label: this.state
                                                                    .formData?.mode,
                                                            }}
                                                            // value={

                                                            //     {label: this.state
                                                            //         .formData
                                                            //         .mode,}
                                                            // }
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
                                                                    value={appConst.admission_mode.find(

                                                                        (v) =>
                                                                            v.label ==
                                                                            this.state.formData
                                                                                .mode
                                                                    )}
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
                                                    {this.state.formData.mode == "Transferred from Hospital" ?
                                                        <Grid
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="Hospital" />

                                                            <Autocomplete
                                        disableClearable
                                                                className="w-full"
                                                                options={
                                                                    this.state.all_hospitals
                                                                }

                                                                onChange={(
                                                                    e,
                                                                    value
                                                                ) => {
                                                                    if (value != null) {
                                                                        let formData = this.state.formData
                                                                        formData.trasfered_from_hospital = value.id
                                                                        this.setState({
                                                                            formData,
                                                                        })
                                                                    }
                                                                }}
                                                                value={this.state.all_hospitals.find((v) => v.id == this.state.formData.trasfered_from_hospital
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
                                                            value={appConst.admission_type.find(

                                                                (v) =>
                                                                    v.label ==
                                                                    this.state.formData
                                                                        .type
                                                            )}
                                                            // value={{
                                                            //     label: this.state
                                                            //         .formData
                                                            //         .type,
                                                            // }}
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
                                                                    value={appConst.admission_type.find(

                                                                        (v) =>
                                                                            v.label ==
                                                                            this.state.formData
                                                                                .type
                                                                    )}
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
                                                    {this.state.loadClinic ?
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
                                                                        this.loadConsultant(value.id)
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
                                                                            this.state.formData.clinicId
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
                                                        : null}
                                                    {this.state.loadConsultant ? <Grid
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Consultant" />
                                                        {/* //changefrom */}
                                                        <Autocomplete
                                        disableClearable
                                                            className="w-full"
                                                            options={this.state.all_consultant}
                                                            //options={this.state.allWH.filter((ele) => ele.status == "Active")}
                                                            onChange={(e, value) => {
                                                                if (value != null) {
                                                                    let formData = this.state.formData;
                                                                    formData.consultant_id = value.id
                                                                    this.setState({ formData })

                                                                }
                                                            }}
                                                            value={this.state.all_consultant.find((obj) => obj.id == this.state.formData.consultant_id
                                                            )}
                                                            getOptionLabel={(option) => option.name}
                                                            renderInput={(params) => (
                                                                <TextValidator
                                                                    {...params}
                                                                    placeholder="Consultant"
                                                                    //variant="outlined"
                                                                    fullWidth
                                                                    variant="outlined"
                                                                    size="small"
                                                                    value={this.state.all_consultant.find((obj) => obj.id == this.state.formData.consultant_id
                                                                    )}
                                                                // validators={[
                                                                //     'required',
                                                                // ]}
                                                                // errorMessages={[
                                                                //     'this field is required',
                                                                // ]}
                                                                />
                                                            )}
                                                        />
                                                        {/* //here */}


                                                        {/* //previous */}

                                                        {/* <Autocomplete
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
                                                    


                                                    //  value={this.state.all_consultant.find((obj) => obj.id == this.state.formData.consultant_id)}
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
                                                                this.state
                                                                     .formData
                                                                     .consultant_id
                                                            }
                                                           validators={[
                                                              'required',
                                                          ]}
                                                          errorMessages={[
                                                              'this field is required',
                                                          ]} 
                                                         />
                                                     )}
                                             /> */}
                                                    </Grid> : null}
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
                                                        <SubTitle title="Transport Mode" />
                                                        <RadioGroup defaultValue={this.state.formData.mode} row>
                                                            <FormControlLabel
                                                                label={'By Foot'}
                                                                name="Countable"
                                                                value={true}
                                                                onChange={() => {
                                                                    let formData = this.state.formData
                                                                    if (formData != null || formData == "By Foot") {
                                                                        formData.mode = 'By Foot';

                                                                        this.setState({
                                                                            formData,
                                                                        })
                                                                    }
                                                                }}
                                                                control={
                                                                    <Radio color="primary" size='small' />
                                                                }
                                                                display="inline"
                                                                checked={this.state.formData.mode == 'By Foot' ? true : false
                                                                }
                                                            />

                                                            <FormControlLabel
                                                                label={'Wheel Chair'}
                                                                name="Countable"
                                                                value={false}
                                                                onChange={() => {
                                                                    let formData = this.state.formData
                                                                    formData.mode = 'Wheel Chair';
                                                                    this.setState({
                                                                        formData,
                                                                    })
                                                                }}
                                                                control={
                                                                    <Radio color="primary" size='small' />
                                                                }
                                                                display="inline"
                                                                checked={this.state.formData.mode == 'Wheel Chair' ? true : false
                                                                }
                                                            />
                                                            <FormControlLabel
                                                                label={'Trolley'}
                                                                name="Countable"
                                                                value={false}
                                                                onChange={() => {
                                                                    let formData = this.state.formData
                                                                    formData.mode = 'Trolley';
                                                                    this.setState({
                                                                        formData,
                                                                    })
                                                                }}
                                                                control={
                                                                    <Radio color="primary" size='small' />
                                                                }
                                                                display="inline"
                                                                checked={this.state.formData.mode == 'Trolley' ? true : false
                                                                }
                                                            />
                                                        </RadioGroup>

                                                        {/* <Autocomplete
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
                                                            .formData
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
                                                                    .formData
                                                                    .transport_mod
                                                            }
                                                    
                                                        />
                                                    )}
                                                /> */}
                                                    </Grid>

                                                    <Grid
                                                        item
                                                        lg={8}
                                                        md={8}
                                                        sm={12}
                                                        xs={12}
                                                        className="mt-1"
                                                    >
                                                        {/* <SubTitle title="Stat" /> */}
                                                        <RadioGroup row defaultValue={this.state.formData.stat}>
                                                            <FormControlLabel
                                                                label={'Normal'}
                                                                name="Stat"
                                                                value={true}
                                                                onChange={() => {
                                                                    let formData = this.state.formData
                                                                    if (this.state.formData.stat != null) {
                                                                        formData.stat = null;

                                                                        this.setState({
                                                                            formData,
                                                                        })
                                                                    }



                                                                }}
                                                                control={
                                                                    <Radio color="primary" size='small' />
                                                                }
                                                                display="inline"
                                                                checked={this.state.formData.stat == null ? true : false
                                                                }
                                                            />

                                                            <FormControlLabel
                                                                label={'Stat'}
                                                                name="Stat"
                                                                value={false}
                                                                onChange={() => {
                                                                    let formData = this.state.formData
                                                                    formData.stat = true;
                                                                    this.setState({
                                                                        formData,
                                                                    })
                                                                }}
                                                                control={
                                                                    <Radio color="primary" size='small' />
                                                                }
                                                                display="inline"
                                                                checked={this.state.formData.stat == true ? true : false
                                                                }
                                                            />
                                                            <FormControlLabel
                                                                label={'Medico Legal'}
                                                                name="Stat"
                                                                value={false}
                                                                onChange={() => {
                                                                    let formData = this.state.formData
                                                                    formData.stat = false;
                                                                    this.setState({
                                                                        formData,
                                                                    })
                                                                }}
                                                                control={
                                                                    <Radio color="primary" size='small' />
                                                                }
                                                                display="inline"
                                                                checked={this.state.formData.stat == false ? true : false
                                                                }
                                                            />
                                                        </RadioGroup>
                                                    </Grid>


                                                    {/* <Grid
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
                                    </Grid> */}

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
                                                    {this.state.FrontDeskAdmin ?
                                                        <Grid
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="BHT" />
                                                            <Grid container spacing={2}>
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
                                                                                checked={this.state.bht_open}
                                                                                onChange={() => {
                                                                                    let bht_open = this.state.bht_open
                                                                                    bht_open = !bht_open;
                                                                                    this.setState({
                                                                                        bht_open
                                                                                    })
                                                                                }
                                                                                }
                                                                                name="Manual BHT"
                                                                                value="false"
                                                                            />
                                                                        }
                                                                        label="Manual BHT"
                                                                    />
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    lg={7}
                                                                    md={7}
                                                                    sm={12}
                                                                    xs={12}
                                                                >
                                                                    <TextValidator
                                                                        className=" w-full"
                                                                        placeholder="BHT"
                                                                        name="bht"
                                                                        InputLabelProps={{
                                                                            shrink: false,
                                                                        }}
                                                                        // value={"it"}
                                                                        type="number"
                                                                        value={
                                                                            this.state.formData.bht
                                                                        }
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                formData: {
                                                                                    ...this.state
                                                                                        .formData,
                                                                                    bht: e.target
                                                                                        .value,
                                                                                },
                                                                            })
                                                                        }}
                                                                        disabled={!this.state.bht_open}
                                                                    /*  validators={['required']}
                                                                     errorMessages={[
                                                                         'this field is required',
                                                                     ]} */
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        : ""}
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
                                </Grid>


                            </ValidatorForm>
                        </div>

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
                    </div>
                    : null}
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(EditAdmission)
