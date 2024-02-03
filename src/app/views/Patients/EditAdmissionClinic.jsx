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
import localStorageService from 'app/services/localStorageService';
import EmployeeServices from 'app/services/EmployeeServices';
import DashboardServices from 'app/services/DashboardServices';
import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import * as Util from '../../../utils'

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
    LoonsTable
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../appconst'
import UtilityServices from 'app/services/UtilityServices'

const styleSheet = (theme) => ({})

class EditAdmissionClinic extends Component {
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
                //guardian detail
                title: 'Mr',
                name: null,
                nic: null,
                admissionMode: 'Direct',
                admissionType: 'Clinic',
                //admission detail
                admissionWard: '',
                trasfered_from_hospital: null,
                ward: '',
                consultant_id: null,
                telephone: null,
                address: null,
                stat: false,
                medicoLegal: false,
                transportMode: 'By Foot',
                dateOfBirth: null,

                patientId: null,
                clinicId: null,
                consultantId: null,
                dateTime: new Date(),
            },
            filterData: {
                limit: 20,
                page: 0,
            },
            totalItems: 0,
            totalPages: 0,
            tableDataLoaded: false,
            assignedClinics: [],
            all_hospitals: [],
            columns: [
                {
                    name: 'clinic',
                    label: 'Clinic Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {this.state.assignedClinics[
                                        tableMeta.rowIndex
                                    ].Pharmacy_drugs_store.name
                                    }
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'transport_mod',
                    label: 'Transport Mode',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {this.state.assignedClinics[
                                        tableMeta.rowIndex
                                    ].transport_mod
                                    }
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'admit_date_time',
                    label: 'Date Time',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {Util.dateTimeParse(
                                        this.state.assignedClinics[
                                            tableMeta.rowIndex
                                        ].admit_date_time
                                    )
                                    }
                                </p>
                            )
                        },
                    },
                },
            ]

        }
    }

    async componentDidMount() {
        // let selectedObj = this.props.location.state
        let selectedObj = this.props.patientDetails
        console.log("data selected", selectedObj)
        this.setState({
            patientObj: selectedObj,
        }, () => {
            this.getAllAssignedClinics()
            this.loadPreData()
            //this.loadConsultant()
        })

        var user = await localStorageService.getItem('userInfo');
        let store_data = await localStorageService.getItem('Login_user_Hospital_front_desk');

        let formData = this.state.formData;
        formData.hospital_id = store_data.hospital_id;
        // formData.hospital_id = user.hospital_id;
        this.setState({ formData })

    }

    /**
     * Function to retrieve required data sets to inputs
     */
    async loadPreData() {
        //clinic data
        let params = {
            issuance_type: 'Clinic',
            is_clinic: true
        }

        let store_data = await localStorageService.getItem('Login_user_Hospital_front_desk');

        let clinicDataSet = await ClinicService.fetchAllClinicsNew(params, store_data.owner_id)
        // let clinicDataSet = await ClinicService.fetchAllClinics(params)
        if (200 == clinicDataSet.status) {
            this.setState({
                clinicData: clinicDataSet.data.view.data,
            })
        }
    }

    async loadConsultant(clinic_id) {
        /* let params = {
            type: 'Consultant',
            designation: 'Consultant',
            limit: 99999999999,
            page: 0
        } */

        /*       let cunsultantData = await EmployeeServices.getEmployees(params)
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
   async loadHospital(name_like) {
        let params_ward = { issuance_type: 'Hospital',department_type_name:['Hospital'],name_like:name_like }   
        let hospitals = await DashboardServices.getAllHospitals(params_ward);   
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }
    }

    async getAllAssignedClinics() {
        //clinic data
        let filterData = this.state.filterData;
        filterData.patient_id = this.state.patientObj.id

        let data = await ClinicService.getAssignedClinics(filterData)
        console.log("data", data.data.view.data)
        if (200 == data.status) {
            filterData.page = data.data.view.currentPage
            this.setState({
                totalPages: data.data.view.totalPages,
                totalItems: data.data.view.totalItems,
                filterData: filterData,
                assignedClinics: data.data.view.data,
                tableDataLoaded: true
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.getAllAssignedClinics()
            }
        )
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
                consultant_id,
                stat,
                medicoLegal,
                telephone,
                address,
                transportMode,
                dateOfBirth,
                dateTime,
                clinicId,
                hospital_id,
                trasfered_from_hospital,
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
                consultant_id: consultant_id,
                trasfered_from_hospital: trasfered_from_hospital,
                mode: admissionMode,
                type: 'Clinic',
                admissionType: admissionType,
                transport_mod: transportMode,
                // TODO : Confirm what this is
               // bht: 1445,
                stat,
                medico_legal: medicoLegal,
                admit_date_time: dateTime,
                hospital_id: hospital_id
            }

            let hospital_data = await localStorageService.getItem('Login_user_Hospital_front_desk')

            let res = await PatientClinicService.createNewPatientClinic(
                patientClinicObj
            )

            if (201 == res.status) {
                this.setState({
                    alert: true,
                    message: 'Clinic patient Registration Successful',
                    severity: 'success',
                })

                console.log('clinic reg', res)
                let data = res.data.posted.data;
                let url = appConst.PRINT_URL +hospital_data.owner_id + '/patientClinicCard.html?';
                url = url + "institute=" + '';
                url = url + "&patientTitle=" + String(this.state.patientObj.title);
                url = url + "&patientName=" + String(this.state.patientObj.name);
                url = url + "&age=" + String(await UtilityServices.getAgeString(this.state.patientObj.date_of_birth));
                url = url + "&patientGender=" + String(this.state.patientObj.gender==null?"":this.state.patientObj.gender);
                url = url + "&patientMaritalstatus=" + String(this.state.patientObj.marital_status==null?"":this.state.patientObj.marital_status);
                url = url + "&patientNIC=" + String(this.state.patientObj.nic);
                url = url + "&patientAddress=" + String(this.state.patientObj.address);
                url = url + "&patientID=" + String(this.state.patientObj.phn);
                url = url + "&patientDOB=" + String(this.state.patientObj.date_of_birth == null ? "" : Util.dateParse(this.state.patientObj.date_of_birth));

                url = url + "&clinicRegNo=" + String(data.bht);
                url = url + "&clinicNo=" + String(data.bht);
                url = url + "&departmentTitle=" + String(this.state.clinicData.filter((ele) => ele.id == data.clinic_id)[0].name);
                url = url + "&consultantName=" + String(this.state.all_consultant.filter((ele) => ele.id == data.consultant_id)[0].name);



                //window.open(url, '_blank'); 
                let child = window.open(url, '_blank');
                 let url2 = appConst.PRINT_URL +hospital_data.owner_id + '/clinicNo.html?clinicNo=' + data.bht;
                 let child2 = window.open(url2, '_blank');
                setTimeout(() => {
                     child.close()
                    child2.close()
                }, 2000);

                /*   let url2=appConst.PRINT_URL+'/ClinicNo.html?clinicNo='+data.bht;
                 window.open(url2, '_blank');  */

                window.location.reload()


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

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>

                {/* Content start*/}
                <div className="w-full">
                    <ValidatorForm
                    autoComplete="off"
                        className="pt-2"
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
                                        <Grid
                                            item
                                            className="mt-2"
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                           {/*  <ImageView
                                                image_data={
                                                    this.state.patient_pic
                                                }
                                                preview_width="50"
                                                preview_height="50"
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
                                                        : Util.dateTimeParse(this.state.patientObj.date_of_birth)
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
                                            <SubTitle title="Patient Type" />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={7}
                                            xs={7}
                                        >
                                            {/* TODO - Check this attribute */}
                                            <SubTitle title="" />
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
                                            {/* To Do - Check Why this is null backend */}
                                            <SubTitle
                                                title={
                                                    this.state.patientObj.Moh == null
                                                        ? ''
                                                        : this.state.patientObj.Moh.name
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
                                                        this.state.patientObj.PHM
                                                        ? ''
                                                        : this.state.patientObj.PHM.name
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
                                                title={
                                                    null ==
                                                        this.state.patientObj.GN
                                                        ? ''
                                                        : this.state.patientObj.GN.name
                                                    // : this.state
                                                    //       .patientObj.GN
                                                    //       .name
                                                }
                                            />
                                        </Grid>
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
                                                    /* validators={['required']}
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
                                                <CardTitle title="Clinic Detail" />
                                            </Grid>

                                            <Grid
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Clinic Mode" />
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
                                                            placeholder="Clinic Mode"
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

                                            {this.state.formData.admissionMode == "Transferred from Hospital" ?
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
                                                        appConst.admission_type_clinic
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
                                                <SubTitle title="Clinic" />
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

                                                                this.loadConsultant(value.id)
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
                                                            ? option.name+" - "+option.description
                                                            : ''
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Clinic"
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
                                                                this.state
                                                                    .formData
                                                                    .consultant_id
                                                            }
                                                        /* validators={[
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
                                            {/* <Grid
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
                                                <SubTitle title="Stamps" />
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
                                                            value="medicoLegal"
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
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid container spacing={2} className="flex ">

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
                                        <span className="capitalize">Update</span>
                                    </Button>
                                </Grid>

                            </Grid>
                        </Grid>
                    </ValidatorForm>



                    {this.state
                        .tableDataLoaded ? (
                        <LoonsTable
                            //title={"All Aptitute Tests"}
                            id={'allclinics'}
                            data={
                                this.state
                                    .assignedClinics
                            }
                            columns={
                                this.state
                                    .columns
                            }
                            options={{
                                pagination: true,
                                serverSide: true,
                                print: false,
                                viewColumns: false,
                                download: false,
                                count: this.state.totalItems,
                                rowsPerPage: 100,
                                page: this.state.filterData.page,
                                onTableChange: (
                                    action,
                                    tableState
                                ) => {
                                    console.log(
                                        action,
                                        tableState
                                    )
                                    switch (
                                    action
                                    ) {
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
                    ) : (
                        //load loading effect
                        <Grid className="justify-center text-center w-full pt-12">

                        </Grid>
                    )}


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

            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(EditAdmissionClinic)
