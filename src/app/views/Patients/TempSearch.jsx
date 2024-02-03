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
    FormControlLabel,
    Radio,
    RadioGroup,
    CircularProgress,
    InputAdornment,
    Dialog,
    MuiDialogContent,
    MuiDialogActions,
    Typography,
    //Accordion,
    AccordionDetails,
    AccordionSummary,
    Tabs,
    Tab
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiAccordion from "@material-ui/core/Accordion";
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import CloseIcon from '@material-ui/icons/Close';
import { themeColors } from "app/components/MatxTheme/themeColors";
import SearchIcon from '@material-ui/icons/Search';
import DashboardServices from "app/services/DashboardServices";
import { dateParse } from "../../../utils"
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Registration from './Registration';
import RegisterdPatients from './RegisterdPatients'
import AdmissionsPatients from './AdmissionsPatients'
import Admission from './Admission';
import AdmissionClinic from './AdmissionClinic';
import AdmissionOPD from './AdmissionOPD';

import ClinicPatients from './ClinicPatients'
import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
import localStorageService from 'app/services/localStorageService';
import ClinicService from 'app/services/ClinicService';
import HospitalConfigServices from 'app/services/HospitalConfigServices'
import moment from "moment";
import SearchFromCloud from './SearchFromCloud';

const drawerWidth = 55;
let activeTheme = MatxLayoutSettings.activeTheme;


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
        backgroundColor: "#bad4ec"
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
        //marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})


const Accordion = withStyles({
    root: {
        "&$expanded": {
            margin: "auto"
        }
    },
    expanded: {}
})(MuiAccordion);

class TempSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: true,
            activeStep: 0,
            registrationdialogView: false,
            login_hospital: {},


            searched_patient: false,
            searched_admission: false,
            searched_clinic: false,




            dialog_for_select_frontDesk: false,
            all_front_desk: [],
            activeTab: 0,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],
            all_clinics: [],
            all_OPD: [],
            params_OPD:[],
            all_consultant: [],
            all_hospitals: [],

            alert: false,
            message: '',
            severity: 'success',

            Loaded: true,
            userRoles: [],


            newAddedPatient: null,
            admissiondialogView: false,
            addBHTStarting: false,
            clinicdialogView: false,
            OPDdialogView: false,

            SearchFromClouddialogView: false,
            CanSearchFromCloud: false,

            totalItems: 0,
            totalPages: 0,
            formData: {
                limit: 100,
                page: 0,
                'order[0]': ['createdAt', 'DESC'],
                passport_no: null,
                driving_license: null,
                mobile_no: '',
                clinic_id: null,
                phn: '',
                bht: '',
                nic: '',

                search: null

            },

            bhtFormData: {
                owner_id: null,
                key: null,
                value: null
            },


            data: [],
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
                    name: 'phn',
                    label: 'PHN',
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
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <Button
                                        color="secondary"
                                        className="mr-1 ml-1"
                                    /*  onClick={() => {
                                         let selected_data = this.state.data[tableMeta.rowIndex]
                                         this.setState({ selectedPatient: selected_data, admissiondialogView: true })
                                     }} */
                                    >
                                        Admit to Ward
                                    </Button>

                                    <Button
                                        color="secondary"
                                        className="mr-1 ml-1"
                                    /* onClick={() => {
                                        this.props.history.push({
                                            pathname:
                                                '/patients/admission-clinic',
                                            state: this.state.data[
                                                tableMeta.rowIndex
                                            ],
                                        })
                                        // this.handleUpdate(res.rowData)
                                    }} */
                                    >
                                        Assign to clinic
                                    </Button>

                                    <Button
                                        color="secondary"
                                        className="mr-1 ml-1"
                      
                                    >
                                        Assign to OPD
                                    </Button>

                                    {/*  <Button
                                        color="secondary"
                                        className="mr-1 ml-1"
                                        onClick={() => {
                                            this.props.history.push({
                                                pathname:
                                                    '/patients/info/' + this.state.data[tableMeta.rowIndex].id
                                            })
                                            // this.handleUpdate(res.rowData)
                                        }}
                                    >
                                        Examination details
                                    </Button> */}
                                </>
                            )
                        },
                    },
                },
            ],
        }
    }



    async loadData() {


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

        //function for load initial data from backend or other resources
        /* let id = this.props.match.params.id;
        let params = { patient_id: id, checktype: 'snap' }
        let res = await PatientServices.getPatientInfo(params)
        if (res.status) {
            console.log("all uoms", res.data.view.data)
            if (res.data.view.data.length != 0) {
                this.setState({
                    data: res.data.view.data,
                    loaded: true,
                    totalItems: res.data.view.totalItems,
                    totalPages: res.data.view.totalPages
                })
            } else {
                this.setState({
                    loaded: true,
                })
            }
        } */


        let params_ward = { issuance_type: 'Hospital' }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }




    }
    handleDrawerOpen() {
        this.setState({ drawerOpen: true })
    };

    handleDrawerClose() {
        this.setState({ drawerOpen: false })
    };

    async searchPatients() {
        this.setState({ Loaded: false })
        let formData = this.state.formData;

        if (formData.search != null || formData.search != "") {
            this.setState({
                //isPhnFound: true,
                formData,
                searched_patient: true,
                activeTab: 0,
                Loaded: true,
                //data: patientdata.data.view.data,
                //totalItems: patientdata.data.view.totalItems,
                //totalPages: patientdata.data.view.totalPages
            })
        }


        /* const patientdata = await PatientServices.fetchPatientsByAttribute(formData)

        if (200 == patientdata.status) {
            if (0 >= patientdata.data.view.totalItems) {
                this.setState({
                    isPhnFound: false,
                    Loaded: true,

                })

            } else {
                console.log('Patient Data====>', patientdata.data.view.data)

                this.setState({
                    isPhnFound: true,
                    Loaded: true,
                    data: patientdata.data.view.data,
                    totalItems: patientdata.data.view.totalItems,
                    totalPages: patientdata.data.view.totalPages
                })

            }
        } */
    }



    async getAllClinics() {

        let store_data = await localStorageService.getItem('Login_user_Hospital_front_desk');

        if (store_data != null) {
            let params_clinic = { issuance_type: 'Clinic' }
            let clinics = await DashboardServices.getAllClinics(params_clinic, store_data.owner_id);
            if (clinics.status == 200) {
                console.log("clinics", clinics.data.view.data)
                this.setState({ all_clinics: clinics.data.view.data })
            }

            let params_ward = { issuance_type: 'Ward' }
            let wards = await DashboardServices.getAllClinics(params_ward, store_data.owner_id);
            if (wards.status == 200) {
                console.log("wards", wards.data.view.data)
                this.setState({ all_wards: wards.data.view.data })
            }

            let params_OPD = { issuance_type: 'OPD' }
            let OPD = await DashboardServices.getAllClinics(params_OPD, store_data.owner_id);
            if (OPD.status == 200) {
                console.log("wards", OPD.data.view.data)
                this.setState({ all_OPD: OPD.data.view.data })
            }
        }


    }


    async loadFrontDesk() {


        var user = await localStorageService.getItem('userInfo');
        //console.log('user', user)

        var id = user.id;
        var all_front_desk_dummy = [];


        var frontDesk_id = await localStorageService.getItem('Login_user_Hospital_front_desk');
        if (!frontDesk_id) {
            this.setState({ dialog_for_select_frontDesk: true, userRoles: user.roles })


        } else {
            this.setState({
                login_hospital: frontDesk_id, userRoles: user.roles
            }, () => {
                this.loadConsultant()
            })
        }

        //
        let params = { employee_id: id, type: ["Front Desk", "Front Desk Admin"] }
        let res = await PatientServices.getAllFront_Desk(params);
        if (res.status == 200) {
            console.log("frontdesk", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_front_desk_dummy.push(
                    {
                        Pharmacy_drugs_store: element.Pharmacy_drugs_store,
                        name: element.Pharmacy_drugs_store.name,
                        id: element.id,
                        pharmacy_drugs_stores_id: element.pharmacy_drugs_stores_id,
                    }

                )
            });


            console.log("desk data", all_front_desk_dummy)
            this.setState({ all_front_desk: all_front_desk_dummy })
        }

    }

    async loadRelatedHospitals(value) {
        let params = { issuance_type: "Hospital" }
        let res = await ClinicService.fetchAllClinicsNew(params, value.Pharmacy_drugs_store.owner_id);
        if (res.status == 200) {
            console.log("hospital", res.data.view.data)
            if (res.data.view.data.length > 0) {
                this.saveDataInLocal(
                    {
                        hospital_id: res.data.view.data[0].id,
                        owner_id: value.Pharmacy_drugs_store.owner_id,
                        pharmacy_drugs_stores_id: value.pharmacy_drugs_stores_id,
                        frontDesk_id: value.id,
                        name: value.name
                    })

                this.setState({ dialog_for_select_frontDesk: false, })
            }

        }
    }

    async saveDataInLocal(data) {

        await localStorageService.setItem('Login_user_Hospital_front_desk', data);
        this.setState({ login_hospital: data }, () => {
            //this.getAllClinics()
            // this.loadConsultant()
            //this.clearSearch();
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

    async clearSearch() {

        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');

        let formData = {
            hospital_id: user.hospital_id,
            limit: 100,
            page: 0,
            'order[0]': ['createdAt', 'DESC'],
            passport_no: null,
            driving_license: null,
            mobile_no: null,
            clinic_id: null,
            phn: '',
            bht: '',
            nic: '',
            date_of_registered_from: null,
            date_of_registered_to: null,
            discharge_from: null,
            discharge_to: null,
            admit_from: null,
            admit_to: null,
            date_of_birth: null,
            gender: '',
            address: '',
            nearest_hospital: '',

            ward_id: '',

            email: '',
            citizenship: '',
            ethinic_group: '',
            religion: '',
            //marital_status: '',
            district_id: null,
            moh_id: null,
            phm_id: null,
            gn_id: null,
            search: '',

        }
        this.setState({ formData }, () => {
            // this.searchPatients();

        })
    }


    async loadConsultant() {
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
        console.log("hospital id", this.state.login_hospital.pharmacy_drugs_stores_id)
        let params = {
            type: 'Consultant',
            //pharmacy_drugs_stores_id: this.state.login_hospital.pharmacy_drugs_stores_id

        }

        let cunsultantData = await PatientServices.getAllFront_Desk(params)
        // console.log("consultants", cunsultantData.data.view.data)
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

    onRowClick = (rowData, rowMeta) => {
        let selected_data = this.state.data[rowMeta.rowIndex]
        this.setState({ selectedPatient: selected_data, registrationdialogView: true })
    }


    patientAdded(res) {
        // console.log("response", res.patient)
        //this.searchPatients()
        this.getAddedPatient(res.patient.id)
        this.setState({
            registrationdialogView: false
        })
    }

    async getAddedPatient(id) {
        const patientdata = await PatientServices.getPatientById(id, {})

        if (200 == patientdata.status) {
            // console.log('Patient Data====>', patientdata.data.view)
            this.setState({ newAddedPatient: patientdata.data.view, admissiondialogView: true })
        }

    }


    registerdPatientToClinic(res) {
        // console.log("response", res.patient)
        //this.searchPatients()
        this.getAddedPatientForClinic(res.patient.id)
        this.setState({
            registrationdialogView: false
        })
    }
    registerdPatientToOPD(res) {
        // console.log("response", res.patient)
        //this.searchPatients()
        this.getAddedPatientForOPD(res.patient.id)
        this.setState({
            registrationdialogView: false
        })
    }

    async getAddedPatientForClinic(id) {
        const patientdata = await PatientServices.getPatientById(id, {})

        if (200 == patientdata.status) {
            // console.log('Patient Data====>', patientdata.data.view)
            this.setState({ newAddedPatient: patientdata.data.view, clinicdialogView: true })
        }

    }

    async getAddedPatientForOPD(id) {
        const patientdata = await PatientServices.getPatientById(id, {})

        if (200 == patientdata.status) {
            // console.log('Patient Data====>', patientdata.data.view)
            this.setState({ newAddedPatient: patientdata.data.view, OPDdialogView: true })
        }

    }


    async submitBhtStart() {

        let store_data = await localStorageService.getItem('Login_user_Hospital_front_desk');


        let bhtFormData = this.state.bhtFormData;

        bhtFormData.owner_id = store_data.owner_id;
        bhtFormData.key = bhtFormData.owner_id + ".ward.all.bhtstart";
        bhtFormData.value = (bhtFormData.value.padStart(5, '0')) + "/" + moment().format('YYYY')


        let res = await HospitalConfigServices.postBHTStartNumber(bhtFormData)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'BHT Starting Setup Successful',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'BHT Starting Setup Unsuccessful',
                severity: 'error',
            })
        }
    }


    async componentDidMount() {

        this.loadFrontDesk()
        //this.loadData()
        //this.getAllClinics()


        //this.searchPatients()
    }

    checkFromCloud(value) {
        if (/^([0-9]{9}[x|X|v|V]|[0-9]{12})$/.test(value) || /^([0-9]{11})$/.test(value)) {
            this.setState({ CanSearchFromCloud: true })
        }else{
            this.setState({ CanSearchFromCloud: false })
        }
    }

    async syncFinish(res) {
        let formData = this.state.formData;
        formData.page = 0;
        this.setState({ formData, SearchFromClouddialogView: false })
        this.searchPatients()
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props
        //const elmRef = useAutocompleteInputClear(value, v => !v || !v.id)
        return (
            <Fragment>
                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar
                        style={{ zIndex: 99 }}
                        size="small"
                        position="absolute"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: this.state.drawerOpen,
                        })}
                    >


                        <Toolbar style={{ minHeight: 44 }}>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerOpen.bind(this)}
                                edge="start"
                                className={clsx(classes.menuButton, this.state.drawerOpen && classes.hide)}
                            >
                                <MenuIcon />
                            </IconButton>



                            <ValidatorForm
                                autoComplete="off"
                                onSubmit={() => this.searchPatients()}
                                onError={() => null}
                                className="w-full"
                            >

                                <Grid container spacing={2}>
                                    <Grid item lg={6} md={6} xs={6}>
                                        <Tabs style={{ minHeight: 39, height: 26 }}
                                            //indicatorColor="primary"
                                            textColor="primary"
                                            value={this.state.activeTab}
                                            onChange={(event, newValue) => {
                                                console.log(newValue)
                                                this.setState({ activeTab: newValue })
                                            }} >
                                            {/*  <Tab label={<span className="font-bold text-12">Patients</span>} />
                                            <Tab label={<span className="font-bold text-12">Admission</span>} />
                                            <Tab label={<span className="font-bold text-12">Cliinic</span>} /> */}
                                        </Tabs>
                                    </Grid>

                                    <Grid item lg={6} md={6} xs={6}>
                                        <div className='flex items-center justify-end'>
                                            <p className='px-2' style={{ color: 'black' }}><span className="font-bold text-14">You're in {this.state.login_hospital.name}</span></p>
                                            <Button
                                                className="mx-1 "
                                                progress={false}
                                                scrollToTop={false}
                                                //startIcon="search"
                                                onClick={() => {
                                                    //window.open(`/patients/registration`, '_blank');
                                                    this.setState({ dialog_for_select_frontDesk: true })
                                                }}
                                            >
                                                <span className="capitalize">Change</span>
                                            </Button>


                                            {/*  <TextValidator
                                                className='w-90 mt--1'
                                                placeholder="Search"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state.formData.search
                                                }
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData
                                                    formData.search = e.target.value.toLowerCase();
                                                    this.setState({ formData })
                                                    console.log("form dat", this.state.formData)
                                                }}
                                               
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end" >
                                                            <IconButton type='submit' >

                                                                <SearchIcon ></SearchIcon>
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}

                                            /> */}
                                        </div>

                                    </Grid>


                                </Grid>
                            </ValidatorForm>
                        </Toolbar>
                    </AppBar>





                    <main
                        className={clsx(classes.content, 'px-3')}
                    >
                        <div className={classes.drawerHeader} />


                        <Grid container className='w-full flex justify-center align-middle'>


                            <Grid item lg={6} md={6} xs={6}>
                                <Grid container className='w-full flex justify-center align-middle'>
                                    <Grid item lg={6} md={6} xs={6}>
                                        <img
                                            className="w-300"
                                            src="/assets/images/swastha_logo _full_height.png"
                                            alt=""
                                        />
                                    </Grid >
                                </Grid>

                                <ValidatorForm
                                    onSubmit={() => {
                                        let formData = this.state.formData;
                                        formData.page = 0;
                                        this.setState({ formData })
                                        this.searchPatients()
                                    }
                                    }
                                    onError={() => null}
                                    className="w-full"
                                >
                                    <TextValidator
                                        className='mt--1'
                                        autoFocus={true}
                                        placeholder="Search Patient"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="Normal"
                                        value={
                                            this.state.formData.search
                                        }
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.search = e.target.value.toUpperCase();
                                            this.checkFromCloud(e.target.value)
                                            this.setState({ formData })
                                            console.log("form dat", this.state.formData)
                                        }}
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" >
                                                    <IconButton type='submit' /* onClick={()=>{this.searchPatients()}} */>

                                                        <SearchIcon ></SearchIcon>
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}

                                    />

                                </ValidatorForm>

                                <Grid container className='w-full flex justify-center align-middle mt-3'>

                                    <Grid item>
                                        <Button
                                            className="mx-1 "
                                            progress={false}
                                            scrollToTop={false}
                                            //startIcon="search"
                                            onClick={() => {
                                                //window.open(`/patients/registration`, '_blank');
                                                this.setState({ registrationdialogView: true })
                                            }}
                                        >
                                            <span className="capitalize">New Patient</span>
                                        </Button>

                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className="mx-1 "
                                            progress={false}
                                            scrollToTop={false}
                                            //startIcon="search"
                                            onClick={() => {
                                                window.open(`/patients/advanced_search`, "_self");
                                                // this.setState({ dialog_for_select_frontDesk: true })
                                            }}
                                        >
                                            <span className="capitalize">Advanced Search</span>
                                        </Button>

                                    </Grid>

                                    <Grid item>
                                        <Button
                                            className="mx-1 "
                                            progress={false}
                                            scrollToTop={false}
                                            disabled={!this.state.CanSearchFromCloud}
                                            //startIcon="search"
                                            onClick={() => {
                                                this.setState({
                                                    SearchFromClouddialogView: true
                                                })
                                                // this.setState({ dialog_for_select_frontDesk: true })
                                            }}
                                        >
                                            <span className="capitalize">Search From MPI</span>
                                        </Button>

                                    </Grid>

                                </Grid>




                                <Grid container className='w-full flex justify-center align-middle'>
                                    {/*  <img
                className="w-130"
                style={{width:150,marginTop:50}}
                src="/assets/images/ministry_logo.png"
                alt=""

            /> */}
                                </Grid>

                            </Grid>
                        </Grid>


                        <Dialog fullWidth maxWidth="md" open={this.state.searched_patient} >

                            <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                                <AppBar
                                    style={{ zIndex: 99 }}
                                    size="small"
                                    position="absolute"
                                    className={clsx(classes.appBar, {
                                        [classes.appBarShift]: this.state.drawerOpen,
                                    })}
                                >


                                    <Toolbar style={{ minHeight: 44 }}>
                                        <IconButton
                                            color="inherit"
                                            aria-label="open drawer"
                                            onClick={this.handleDrawerOpen.bind(this)}
                                            edge="start"
                                            className={clsx(classes.menuButton, this.state.drawerOpen && classes.hide)}
                                        >
                                            <MenuIcon />
                                        </IconButton>



                                        <ValidatorForm
                                            onSubmit={() => {
                                                let formData = this.state.formData;
                                                formData.page = 0;
                                                this.setState({ formData })
                                                this.searchPatients()
                                            }}
                                            onError={() => null}
                                            className="w-full"
                                        >

                                            <Grid container spacing={2}>
                                                <Grid item lg={6} md={6} xs={6}>
                                                    <Tabs style={{ minHeight: 39, height: 26 }}
                                                        //indicatorColor="primary"
                                                        textColor="primary"
                                                        value={this.state.activeTab}
                                                        onChange={(event, newValue) => {
                                                            console.log(newValue)
                                                            this.setState({ activeTab: newValue })
                                                        }} >
                                                        <Tab label={<span className="font-bold text-12">Patients</span>} />
                                                        <Tab label={<span className="font-bold text-12">Admission</span>} />
                                                        <Tab label={<span className="font-bold text-12">Cliinic</span>} />
                                                    </Tabs>
                                                </Grid>

                                                <Grid item lg={6} md={6} xs={6}>
                                                    <div className='flex items-center justify-end '>
                                                        <IconButton className='mr--2' aria-label="close" onClick={() => { this.setState({ searched_patient: false }) }}>
                                                            <CloseIcon />
                                                        </IconButton>
                                                    </div>

                                                </Grid>


                                            </Grid>
                                        </ValidatorForm>
                                    </Toolbar>
                                </AppBar>

                                <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ searched_patient: false }) }}>
                                    <CloseIcon />
                                </IconButton>

                            </MuiDialogTitle>



                            <div className="w-full h-full px-5 py-5">

                                {this.state.Loaded ?
                                    <div>
                                        {this.state.activeTab == 0 ?
                                            <div className='w-full'>

                                                <RegisterdPatients filterData={this.state.formData} loaded={this.state.Loaded}></RegisterdPatients>
                                            </div> : null
                                        }
                                        {this.state.activeTab == 1 ?
                                            <div className='w-full'>
                                                <AdmissionsPatients filterData={this.state.formData} loaded={this.state.Loaded}></AdmissionsPatients>
                                            </div> : null
                                        }
                                        {this.state.activeTab == 2 ?
                                            <div className='w-full'>
                                                <ClinicPatients filterData={this.state.formData} loaded={this.state.Loaded}></ClinicPatients>
                                            </div> : null
                                        }
                                    </div>
                                    : null}

                            </div>
                        </Dialog>








                    </main>
                </div>

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


                <Dialog maxWidth="lg " open={this.state.registrationdialogView} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Patient Registration" />

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ registrationdialogView: false }) }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <Registration registerdPatient={(res) => { this.patientAdded(res) }} registerdPatientToClinic={(res) => { this.registerdPatientToClinic(res)}} registerdPatientToOPD={(res) => { this.registerdPatientToOPD(res)}}></Registration>
                    </div>
                </Dialog>

   


                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_frontDesk} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Select Your Front Desk" />

                        {/* <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_frontDesk: false }) }}>
                            <CloseIcon />
                        </IconButton>
 */}
                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            //onSubmit={() => this.searchPatients()}
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                // ref={elmRef}
                                options={this.state.all_front_desk}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.loadRelatedHospitals(value);
                                        this.setState({ frontDesk_id: value.id })

                                    }
                                }}
                                value={{
                                    name: this.state.frontDesk_id ? (this.state.all_front_desk.find((obj) => obj.id == this.state.frontDesk_id).name) : null,
                                    id: this.state.frontDesk_id
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Front Desk"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />

                        </ValidatorForm>
                    </div>
                </Dialog>

                <Dialog maxWidth="lg " open={this.state.admissiondialogView} /* onClose={() => { this.setState({ admissiondialogView: false }) }} */>

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Patient Admission to Ward" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ admissiondialogView: false })
                                //window.location.reload();
                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 ">
                        <Admission patientDetails={this.state.newAddedPatient}></Admission>
                    </div>
                </Dialog>


                <Dialog maxWidth="lg " open={this.state.clinicdialogView} /* onClose={() => { this.setState({ clinicdialogView: false }) }} */>
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Patient Assign to Clinic" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ clinicdialogView: false })
                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <AdmissionClinic patientDetails={this.state.newAddedPatient}></AdmissionClinic>
                    </div>
                </Dialog>


                <Dialog maxWidth="lg " open={this.state.OPDdialogView} /* onClose={() => { this.setState({ clinicdialogView: false }) }} */>
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Patient Assign to OPD" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ OPDdialogView: false })
                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <AdmissionOPD patientDetails={this.state.newAddedPatient}></AdmissionOPD>
                    </div>
                </Dialog>


                <Dialog fullWidth maxWidth="sm" open={this.state.addBHTStarting} /* onClose={() => { this.setState({ admissiondialogView: false }) }} */>

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Setup Starting BHT" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ addBHTStarting: false })
                                //window.location.reload();
                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 ">

                        <ValidatorForm
                            className='px-2 pb-5'
                            onSubmit={() => this.submitBhtStart()}
                            onError={() => null}>

                            <Grid
                                className=" w-full"
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="BHT" />

                                <TextValidator
                                    className=" w-full"
                                    placeholder="BHT"
                                    name="bht"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={this.state.bhtFormData.value}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let bhtFormData = this.state.bhtFormData
                                        bhtFormData.value = e.target.value
                                        this.setState({ bhtFormData })
                                    }}
                                /*  validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                                 errorMessages={[
                                     'Invalid Inputs',
                                 ]} */
                                />
                            </Grid>


                            <Grid
                                className=" w-full flex justify-start"
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
                </Dialog>


                <Dialog fullWidth maxWidth="md" open={this.state.SearchFromClouddialogView} /* onClose={() => { this.setState({ clinicdialogView: false }) }} */>
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Patient From MPI" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ SearchFromClouddialogView: false })
                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 pb-5">
                        <SearchFromCloud filterData={this.state.formData} syncFinish={(res) => { this.syncFinish(res) }} ></SearchFromCloud>
                    </div>
                </Dialog>


            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(TempSearch)
