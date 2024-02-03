import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    FormControlLabel,
    Radio,
    RadioGroup,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

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
import * as appConst from '../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import DashboardServices from 'app/services/DashboardServices';
import UtilityServices from 'app/services/UtilityServices'
import localStorageService from 'app/services/localStorageService';
import { dateParse } from "../../../utils"
import thunk from 'redux-thunk';
const styleSheet = (theme) => ({})

class Registration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],
            all_hospitals:[],

            // after phn change
            isPhnFound: false,
            phnDataSet: [],
            tableDataLoaded: false,
            loading: false,
            filterData: {
                limit: 10,
                page: 0,
            },
            totalItems: 0,
            totalPages: 0,
            formData: {
                //phn: null,
                pharmacy_drugstore_id: null,//Hard coded by roshan
                nic: null,
                search_mobile: null,
                passport_no: null,
                driving_license: null,
                title: 'Mr',
                name: null,
                gender: 'male',
                date_of_birth: null,
                age_all: { days: null, months: null, years: null },
                age: null,
                address: null,
                email: null,
                contact_no: null,
                contact_no2: null,
                mobile_no: null,
                mobile_no2: null,
                citizenship: 'Sri lankan',
                ethinic_group: null,
                religion: null,
                marital_status: 'single',
                district_id: null,
                moh_id: null,
                phm_id: null,
                gn_id: null,
                nearest_hospital: null,
            },
            columns: [
                /* {
                    name: 'id',
                    label: 'id',
                    options: {
                        display: false,
                    },
                }, */
                {
                    name: 'name',
                    label: 'Name',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'nic',
                    label: 'NIC Number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'passport_no',
                    label: 'Passport Number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'passport_no',
                    label: 'Passport Number',
                    options: {
                        display: true,
                    },
                }, {
                    name: 'mobile_no',
                    label: 'Mobile Number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'phn',
                    label: 'PHN',
                    options: {
                        display: true,
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
                                    <Button
                                        color="secondary"
                                        className="mr-1 ml-1"
                                        onClick={() => {
                                            this.props.history.push({
                                                pathname: '/patients/admission',
                                                state: this.state.phnDataSet[
                                                    tableMeta.rowIndex
                                                ],
                                            })
                                            // this.handleUpdate(res.rowData)
                                        }}
                                    >
                                        Admit to Ward
                                    </Button>

                                    <Button
                                        color="secondary"
                                        className="mr-1 ml-1"
                                        onClick={() => {
                                            this.props.history.push({
                                                pathname:
                                                    '/patients/admission-clinic',
                                                state: this.state.phnDataSet[
                                                    tableMeta.rowIndex
                                                ],
                                            })
                                            // this.handleUpdate(res.rowData)
                                        }}
                                    >
                                        Assign to clinic
                                    </Button>

                                    <Button
                                        color="secondary"
                                        className="mr-1 ml-1"
                                        onClick={() => {
                                            this.props.history.push({
                                                pathname:
                                                    '/patients/info/' + this.state.phnDataSet[tableMeta.rowIndex].id
                                            })
                                            // this.handleUpdate(res.rowData)
                                        }}
                                    >
                                        Examination details
                                    </Button>
                                </>
                            )
                        },
                    },
                },
            ],
        }
    }

    searchSubmit = async () => {
        this.setState({
            tableDataLoaded: false,
        })

        // let filterData = this.state.filterData

        console.log('Phn====>', this.state.formData.phn)

        const patientdata = await PatientServices.fetchPatientsByAttribute(
            'phn',
            this.state.formData.phn
        )

        if (200 == patientdata.status) {
            if (0 >= patientdata.data.view.totalItems) {
                this.setState({
                    isPhnFound: false,
                })
                // //no data set
                // this.setState({
                //     alert: true,
                //     message: 'No PHN value found for ' + this.state.phnSearch,
                //     severity: 'error',
                // })
            } else {
                console.log('Patient Data====>', patientdata.data.view.data)

                this.setState({
                    isPhnFound: true,
                    tableDataLoaded: true,
                    phnDataSet: patientdata.data.view.data,
                })

                // console.log('Phn Found====>', patientdata.data.view.data[0])
                // this.setState({
                //     patientObj: patientdata.data.view.data[0],
                // })
            }
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

       

    }
     async loadHospital(name_like) {
        let params_ward = { issuance_type: 'Hospital',department_type_name:['Hospital'],name_like:name_like }   
        let hospitals = await DashboardServices.getAllHospitals(params_ward);   
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }
    }


    async loadMOH(district_id) {
        let moh_res = await DivisionsServices.getAllMOH({ limit: 99999, district_id: district_id })
        if (moh_res.status == 200) {
            console.log('moh', moh_res.data.view.data)
            this.setState({
                all_moh: moh_res.data.view.data,
            })
        }
    }

    async loadPHM(moh_id) {
        let phm_res = await DivisionsServices.getAllPHM({ limit: 99999, moh_id: moh_id })
        if (phm_res.status == 200) {
            console.log('phm', phm_res.data.view.data)
            this.setState({
                all_phm: phm_res.data.view.data,
            })
        }
    }

    async loadGN(moh_id) {

        let gn_res = await DivisionsServices.getAllGN({ limit: 99999, moh_id: moh_id })
        if (gn_res.status == 200) {
            console.log('gn', gn_res.data.view.data)
            this.setState({
                all_gn: gn_res.data.view.data,
            })
        }
    }



    async saveStepOneSubmit() { }

    async SubmitAll() {
        let hospital_data = await localStorageService.getItem('Login_user_Hospital')
        
        if (this.props.usage === "update") {
            let formData = this.state.formData;
            let id = this.props.data.id
            let res = await PatientServices.patchPatient(formData, id)
            if (res.status == 200) {
                this.setState({
                    alert: true,
                    message: 'Patient Updated Successful',
                    severity: 'success',
                })
                window.location.reload()
            } else {
                this.setState({
                    alert: true,
                    message: 'Patient Updated Unsuccessful',
                    severity: 'error',
                })
            }
            console.log(res)

        } else {
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

                let data=res.data.posted.data;
                let url=appConst.PRINT_URL +hospital_data.owner_id+'/patientId.html?';
                url=url+"institute="+'';
                url=url+"&patientTitle="+data.title;
                url=url+"&patientName="+data.name;
                url=url+"&patientDOB="+data.date_of_birth;
                url=url+"&patientTeleNo01="+data.contact_no==null?'':data.contact_no;
                url=url+"&patientTeleNo02="+data.contact_no2==null?'':data.contact_no2;
                url=url+"&patientMobile01="+'';
                url=url+"&patientMobile02="+'';
                url=url+"&patientID="+data.phn;
                
    
                let child=  window.open(url, '_blank'); 

                //window.location.reload()
            } else {
                this.setState({
                    alert: true,
                    message: 'Patient Registration Unsuccessful',
                    severity: 'error',
                })
            }
        }
    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    async addNicNumber() {
        let res = await UtilityServices.getBdayByNic(this.state.formData.nic)
        var age = await UtilityServices.getAge(res.bday);
        console.log("res", res)
        console.log("res age", age)
        if (res != false) {
            /*  data['age'] = age;
             data['dob'] = res.bday;
             data['gender'] = res.gender; */
            let formData = this.state.formData;
            formData.gender = res.gender;
            formData.date_of_birth = res.bday;
            formData.age_all = { days: age.age_days, months: age.age_months, years: age.age_years }
            formData.age = age.age_years + '-' + age.age_months + '-' + age.age_days;
            this.setState({ formData })
        }
    }

    async bDayFromAge() {
        let age_all = this.state.formData.age_all;
        let age = age_all.years + '-' + age_all.months + '-' + age_all.days;
        let date = moment(age);

        //var diffDuration = moment.duration(today.diff(date));
        var ageInMillis = ((age_all.years * 365 * 24 * 60 * 60) + (age_all.months * 30 * 24 * 60 * 60) + (age_all.days * 24 * 60 * 60)) * 1000;
        var dateOfBirth = new Date(new Date().getTime() - ageInMillis);

        let formData = this.state.formData;
        formData.date_of_birth = moment(dateOfBirth).format("YYYY-MM-DD");
        this.setState({ formData })

    }

    async calculateAge() {
        let formData = this.state.formData;
        var age = await UtilityServices.getAge(formData.date_of_birth);
        formData.age_all = { days: age.age_days, months: age.age_months, years: age.age_years }
        formData.age = age.age_years + '-' + age.age_months + '-' + age.age_days;
        this.setState({ formData })
    }

    copyProperites() {
        let {
            title,
            name,
            mobile_no,
            mobile_no2,
            contact_no,
            contact_no2,
            nic,
            email,
            guardian_nic,
            passport_no,
            driving_license,
            phn,
            date_of_birth,
            gender,
            marital_status,
            ethinic_group,
            citizenship,
            religion,
            address,
            district_id,
            moh_id,
            phm_id,
            gn_id,
            nearest_hospital
        } = this.props.data;

        let formData = this.state.formData;
        formData.title = title
        formData.name = name
        formData.mobile_no = mobile_no
        formData.contact_no = contact_no
        formData.email = email
        formData.guardian_nic = guardian_nic
        formData.passport_no = passport_no
        formData.driving_license = driving_license
        formData.phn = phn
        formData.date_of_birth = date_of_birth
        formData.gender = gender
        formData.marital_status = marital_status
        formData.ethinic_group = ethinic_group
        formData.citizenship = citizenship
        formData.religion = religion
        formData.address = address
        formData.district_id = district_id
        formData.moh_id = moh_id
        formData.phm_id = phm_id
        formData.gn_id = gn_id
        formData.nearest_hospital = nearest_hospital
        formData.mobile_no2 = mobile_no2
        formData.contact_no2 = contact_no2
        formData.nic = nic
        this.setState({formData})
    }

    async componentDidMount() {
        this.loadData()


        let store_data = await localStorageService.getItem('Login_user_Hospital');


        //this.bDayFromAge()
        var user = await localStorageService.getItem('userInfo');
        let formData = this.state.formData;
        formData.hospital_id = store_data.hospital_id;
        formData.pharmacy_drugstore_id = store_data.pharmacy_drugs_stores_id;
        this.setState({ formData })
        this.copyProperites()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        let {
            data
        } = this.props;

        return (
            <Fragment>



                {this.state.activeStep == 1 ? (
                    <div className="w-full">
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.SubmitAll()}
                            onError={() => null}
                         >
                            <Grid
                                container
                                spacing={2}
                                className="flex "
                            >
                                {/*  <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <input
                                                className="hidden"
                                                onChange={this.handleFileSelect}
                                                id={'profilePic'}
                                                type="file"
                                            //accept={accept}
                                            />
                                            <label htmlFor={'profilePic'}>
                                                <ImageView
                                                    image_data={
                                                        this.state.patient_pic
                                                    }
                                                    preview_width="213px"
                                                    preview_height="213px"
                                                    radius={25}
                                                    onClick={() => { }}
                                                />
                                            </label>
                                        </Grid> */}

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
                                            <SubTitle title="Title" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={[
                                                    { label: 'Mr' },
                                                    { label: 'Mrs' },
                                                    { label: 'Miss' },
                                                    { label: 'Rev' },
                                                    { label: 'Thero' },
                                                    { label: 'Baby' },
                                                    { label: 'Baby of' },
                                                    { label: 'Master' },
                                                    { label: 'Dr' },
                                                    { label: 'Prof' }
                                                ]}
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.title =
                                                            value.label
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                defaultValue={{
                                                    label: this.state.formData.title,
                                                }}
                                                value={{
                                                    label: this.state.formData.title,
                                                }}
                                                getOptionLabel={(
                                                    option
                                                ) => option.label}
                                                renderInput={(
                                                    params
                                                ) => (
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
                                                value={this.state.formData.name}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.name =
                                                        e.target.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                                validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >

                                            <Grid container spacing={1}>
                                                <Grid className="w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}>
                                                    <SubTitle title="NIC" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="NIC"
                                                        name="nic"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={this.state.formData.nic}
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData =
                                                                this.state.formData
                                                            formData.nic =
                                                                e.target.value.toUpperCase()
                                                            this.setState({ formData }, () => {
                                                                this.addNicNumber(formData.nic)
                                                            })

                                                        }}
                                                        validators={['matchRegexp:^([0-9]{9}[x|X|v|V]|[0-9]{12})$']}
                                                        errorMessages={[
                                                            'Invalid NIC',
                                                        ]}
                                                    />
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Mobile No 1" />
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Mobile No 1"
                                                        name="mobileno1"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .mobile_no
                                                        }
                                                        type="number"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData =
                                                                this.state
                                                                    .formData
                                                            formData.mobile_no =
                                                                e.target.value
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                                                        errorMessages={[
                                                            'Invalid Inputs',
                                                        ]}
                                                    />
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Mobile No 2" />
                                                    <TextValidator
                                                        className="w-full"
                                                        placeholder="Mobile No 2"
                                                        name="mobileno2"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .mobile_no2
                                                        }
                                                        type="number"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData =
                                                                this.state
                                                                    .formData
                                                            formData.mobile_no2 =
                                                                e.target.value
                                                            this.setState({
                                                                formData,
                                                            })
                                                        }}
                                                        validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                                                        errorMessages={[
                                                            'Invalid Inputs',
                                                        ]}
                                                    />
                                                </Grid>


                                            </Grid>


                                        </Grid>



                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Gender" />
                                            <RadioGroup row>
                                                <FormControlLabel
                                                    label={'Male'}
                                                    name="gender"
                                                    value={'male'}
                                                    onChange={() => {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.gender =
                                                            'male'
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }}
                                                    control={
                                                        <Radio color="primary" />
                                                    }
                                                    display="inline"
                                                    checked={
                                                        this.state.formData.gender ==
                                                            'male'
                                                            ? true
                                                            : false
                                                    }
                                                />

                                                <FormControlLabel
                                                    label={'Female'}
                                                    name="gender"
                                                    value={'female'}
                                                    onChange={() => {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.gender =
                                                            'female'
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }}
                                                    control={
                                                        <Radio color="primary" />
                                                    }
                                                    display="inline"
                                                    checked={
                                                        this.state.formData.gender ==
                                                            'female'
                                                            ? true
                                                            : false
                                                    }
                                                />
                                            </RadioGroup>
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
                                                    this.state.formData.date_of_birth
                                                }
                                                placeholder="Date From"
                                                // minDate={new Date()}
                                                maxDate={new Date()}
                                                // required={true}
                                                // errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.date_of_birth = dateParse(date);
                                                    this.setState({
                                                        formData,
                                                    }, () => { this.calculateAge() })
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
                                            <SubTitle title="Age" />

                                            <Grid
                                                container
                                                className="items-center"
                                            >
                                                <Grid
                                                    item
                                                    lg={3}
                                                    md={3}
                                                    sm={3}
                                                    xs={3}
                                                >
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Years"
                                                        name="years"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        // value={
                                                        //     data
                                                        //         .age_all
                                                        //         .years
                                                        // }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            let formData =
                                                                this
                                                                    .state
                                                                    .formData
                                                            formData.age_all.years =
                                                                e.target.value
                                                            this.setState(
                                                                {
                                                                    formData,
                                                                }, () => { this.bDayFromAge() }
                                                            )
                                                        }}
                                                    /*  validators={['required']}
                                                 errorMessages={[
                                                     'this field is required',
                                                 ]} */
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={1}
                                                    md={1}
                                                    sm={1}
                                                    xs={1}
                                                >
                                                    <div className="px-2">
                                                        <SubTitle title="Y" />
                                                    </div>
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={3}
                                                    md={3}
                                                    sm={3}
                                                    xs={3}
                                                >
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Months"
                                                        name="months"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        // value={
                                                        //     data
                                                        //         .age_all
                                                        //         .years
                                                        // }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            let formData =
                                                                this
                                                                    .state
                                                                    .formData
                                                            formData.age_all.months =
                                                                e.target.value
                                                            this.setState(
                                                                {
                                                                    formData,
                                                                }, () => { this.bDayFromAge() }
                                                            )
                                                        }}
                                                    /* validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={1}
                                                    md={1}
                                                    sm={1}
                                                    xs={1}
                                                >
                                                    <div className="px-2">
                                                        <SubTitle title="M" />
                                                    </div>
                                                </Grid>

                                                <Grid
                                                    item
                                                    lg={3}
                                                    md={3}
                                                    sm={3}
                                                    xs={3}
                                                >
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Days"
                                                        name="days"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        // value={
                                                        //     this.state
                                                        //         .formData
                                                        //         .age_all
                                                        //         .days
                                                        // }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(
                                                            e
                                                        ) => {
                                                            let formData =
                                                                this
                                                                    .state
                                                                    .formData
                                                            formData.age_all.days =
                                                                e.target.value
                                                            this.setState(
                                                                {
                                                                    formData,
                                                                }, () => { this.bDayFromAge() }
                                                            )
                                                        }}
                                                    /*  validators={['required']}
                                                 errorMessages={[
                                                     'this field is required',
                                                 ]} */
                                                    />
                                                </Grid>
                                                <Grid
                                                    item
                                                    lg={1}
                                                    md={1}
                                                    sm={1}
                                                    xs={1}
                                                >
                                                    <div className="px-2">
                                                        <SubTitle title="D" />
                                                    </div>
                                                </Grid>
                                            </Grid>
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
                                            <SubTitle title="Marital Status" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    appConst.marital_status
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.marital_status =
                                                            value.label
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                defaultValue={{
                                                    label: this.state
                                                        .formData
                                                        .marital_status,
                                                }}
                                                value={{
                                                    label: this.state.formData
                                                        .marital_status
                                                }
                                                }
                                                getOptionLabel={(
                                                    option
                                                ) => option.label}
                                                renderInput={(
                                                    params
                                                ) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Marital Status"
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
                                            <SubTitle title="Address" />
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Address"
                                                name="address"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .address
                                                }
                                                type="text"
                                                multiline
                                                rows={3}
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.address =
                                                        e.target.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                            /* validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]} */
                                            />
                                        </Grid>



                                        <Grid
                                            style={{ marginTop: -1 }}
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Email" />
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Email"
                                                name="email"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .email
                                                }
                                                type="email"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.email =
                                                        e.target.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                              validators={['isEmail']}
                                         errorMessages={[
                                             'Invalid Email',
                                         ]} 
                                            />
                                        </Grid>


                                        <Grid className="w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Passport No" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Passport No"
                                                name="passport_no"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={this.state.formData.passport_no}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData =
                                                        this.state.formData
                                                    formData.passport_no =
                                                        e.target.value
                                                    this.setState({ formData })

                                                }}
                                                validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                                                errorMessages={[
                                                    'Invalid Inputs',
                                                ]}
                                            />

                                        </Grid>
                                        <Grid className="w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}>

                                            <SubTitle title="Driving License No" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Driving License No"
                                                name="driving_license"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={this.state.formData.driving_license}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData =
                                                        this.state.formData
                                                    formData.driving_license =
                                                        e.target.value
                                                    this.setState({ formData })

                                                }}
                                                validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                                                errorMessages={[
                                                    'Invalid Inputs',
                                                ]}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Telephone No 1" />
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Telephone No 1"
                                                name="contact_no"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .contact_no
                                                }
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.contact_no =
                                                        e.target.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                                validators={['matchRegexp:^[0]{1}[0-9]{1}[0-9]{1}[0-9]{7}$']}
                                                errorMessages={[
                                                    'Invalid Phone Number'
                                                ]}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        // lg={6}
                                        // md={6}
                                        // sm={12}
                                        // xs={12}
                                        >
                                            <SubTitle title="Telephone No 2" />
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Telephone No 2"
                                                name="contact_no2"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .contact_no2
                                                }
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.contact_no2 =
                                                        e.target.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                                validators={['matchRegexp:^[0]{1}[0-9]{1}[0-9]{1}[0-9]{7}$']}
                                                errorMessages={[
                                                    'Invalid Phone Number'
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
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Citizenship" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    appConst.citizenship
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.citizenship =
                                                            value.label
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                defaultValue={{
                                                    label: this.state.formData
                                                        .citizenship,
                                                }}
                                                value={{
                                                    label: this.state.formData
                                                        .citizenship,
                                                }}
                                                getOptionLabel={(
                                                    option
                                                ) => option.label}
                                                renderInput={(
                                                    params
                                                ) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Citizenship"
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
                                            <SubTitle title="Ethic Group" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    appConst.ethic_group
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.ethinic_group =
                                                            value.label
                                                        this.setState({
                                                            formData,
                                                        })
                                                    } else {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.ethinic_group = null
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                defaultValue={{
                                                    label: this.state
                                                        .formData
                                                        .ethinic_group,
                                                }}
                                                value={{
                                                    label: this.state.formData
                                                        .ethinic_group,
                                                }}
                                                getOptionLabel={(
                                                    option
                                                ) => option.label}
                                                renderInput={(
                                                    params
                                                ) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Ethic Group"
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
                                            <SubTitle title="Religion" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    appConst.religion
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.religion =
                                                            value.label
                                                        this.setState({
                                                            formData,
                                                        })
                                                    } else {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.religion = null
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}

                                                value={{
                                                    label: this.state.formData
                                                        .religion,
                                                }}
                                                getOptionLabel={(
                                                    option
                                                ) => option.label}
                                                renderInput={(
                                                    params
                                                ) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Religion"
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
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="District" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state
                                                        .all_district
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData = this.state.formData
                                                        formData.district_id = value.id
                                                        this.loadMOH(value.id)
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                     (v) => v.id == this.state.formData.district_id
                                                 )} */
                                                value={this.state.all_district.find(
                                                    (v) =>
                                                        v.id ==
                                                        this.state.formData
                                                            .district_id
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
                                                        placeholder="District"
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
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="MOH Division" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.all_moh
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.moh_id =
                                                            value.id

                                                        this.loadPHM(value.id)
                                                        this.loadGN(value.id)
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                value={this.state.all_moh.find(
                                                    (v) =>
                                                        v.id ==
                                                        this.state.formData
                                                            .moh_id
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
                                                        placeholder="MOH Division"
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
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="PHM Division" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.all_phm
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.phm_id =
                                                            value.id
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                value={this.state.all_phm.find(
                                                    (v) =>
                                                        v.id ==
                                                        this.state.formData
                                                            .phm_id
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
                                                        placeholder="PHM Division"
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
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="GN Division" />
                                            <Autocomplete
                                        disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.all_gn
                                                }
                                                onChange={(
                                                    e,
                                                    value
                                                ) => {
                                                    if (value != null) {
                                                        let formData =
                                                            this.state
                                                                .formData
                                                        formData.gn_id =
                                                            value.id
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                value={this.state.all_gn.find(
                                                    (v) =>
                                                        v.id ==
                                                        this.state.formData
                                                            .gn_id
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
                                                        placeholder="GN Division"
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
                                            <SubTitle title="Nearest Hospital" />
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
                                                        let formData =this.state.formData
                                                        formData.nearest_hospital =value.name
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                value={this.state.all_hospitals.find((v) =>v.name ==this.state.formData.nearest_hospital
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

                                    </Grid>

                                </Grid>


                                <Grid
                                    container
                                    spacing={2}
                                    className="flex mt-2 px-2"
                                >




                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid container spacing={1}>



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




                                        </Grid>                                                </Grid>



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
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">
                                        {this.props.usage === "update" ? 'Update' : 'Save'}
                                    </span>
                                </Button>
                            </Grid>
                        </ValidatorForm>
                    </div>
                ) : null}



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
            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(Registration)
