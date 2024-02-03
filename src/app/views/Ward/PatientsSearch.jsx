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
import AdmissionsPatients from './AdmissionsPatients'
import TransferdPatient from './TransferdPatient';
import TransferdPatientHospital from './TransferdPatientHospital';

import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
import localStorageService from 'app/services/localStorageService';
import ClinicService from 'app/services/ClinicService';
import EmployeeServices from 'app/services/EmployeeServices'
import { ward_status_types } from '../../../appconst'
const drawerWidth = 270;
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
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
        width: `calc(100% - ${drawerWidth - 80}px)`,
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

class PatientsSearch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: true,
            activeStep: 0,
            registrationdialogView: false,
            login_hospital: {},

            dialog_for_select_frontDesk: false,
            all_front_desk: [],
            activeTab: 0,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],
            all_clinics: [],
            all_wards: [],
            all_hospitals: [],

            alert: false,
            message: '',
            severity: 'success',

            Loaded: false,

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
                status: '',
                ward_id: '',
                search: null

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


    async loadDistrict(text){
        let district_res = await DivisionsServices.getAllDistrict({
            name_like:text,
            limit: 99999,

        })
        if (district_res.status == 200) {
            console.log('district', district_res.data.view.data)
            this.setState({
                all_district: district_res.data.view.data,
            })
        }
    }


    async loadMOH(text){
        let moh_res = await DivisionsServices.getAllMOH({ limit: 99999,search:text })
        if (moh_res.status == 200) {
            console.log('moh', moh_res.data.view.data)
            this.setState({
                all_moh: moh_res.data.view.data,
            })
        }
    }


    async loadPHM(text){
        let phm_res = await DivisionsServices.getAllPHM({ limit: 99999,search:text })
        if (phm_res.status == 200) {
            console.log('phm', phm_res.data.view.data)
            this.setState({
                all_phm: phm_res.data.view.data,
            })
        }
    }

    async loadGN(text){
        let gn_res = await DivisionsServices.getAllGN({ limit: 99999,search:text })
        if (gn_res.status == 200) {
            console.log('gn', gn_res.data.view.data)
            this.setState({
                all_gn: gn_res.data.view.data,
            })
        }
    }


    async loadHospitals(text){
        let params_ward = { issuance_type: 'Hospital',name_like:text }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
        }
    }


    async loadData() {


        
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
    }
    handleDrawerOpen() {
        this.setState({ drawerOpen: true })
    };

    handleDrawerClose() {
        this.setState({ drawerOpen: false })
    };

    async searchPatients() {
        this.setState({ Loaded: false })

        this.setState({
            //formData,
            //isPhnFound: true,
            Loaded: true,
            //data: patientdata.data.view.data,
            //totalItems: patientdata.data.view.totalItems,
            //totalPages: patientdata.data.view.totalPages
        })



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
        var user = await localStorageService.getItem('userInfo');

        let store_data = await localStorageService.getItem('Login_user_Hospital');

        if (store_data != null) {
            let params_clinic = { issuance_type: 'Clinic' }
            let clinics = await DashboardServices.getAllClinics(params_clinic, store_data.owner_id);
            if (clinics.status == 200) {
                console.log("clinics", clinics.data.view.data)
                this.setState({
                    all_clinics: clinics.data.view.data
                })
            }

            let params_ward = { issuance_type: 'Ward', employee_id: user.id }
            let wards = await DashboardServices.getAllClinics(params_ward, store_data.owner_id);
            if (wards.status == 200) {
                console.log("wards", wards.data.view.data)
                let ward_id = wards.data.view.data[0].id;
                let formData = this.state.formData;
                formData.ward_id = ward_id
                this.setState({ all_wards: wards.data.view.data, formData }, () => {
                    setTimeout(() => {
                        this.searchPatients()
                    }, 1000);

                })


            }
        }


    }


    async loadClinics(text) {

        let store_data = await localStorageService.getItem('Login_user_Hospital');

        if (store_data != null) {
            let params_clinic = { issuance_type: 'Clinic',name_like:text }
            let clinics = await DashboardServices.getAllClinics(params_clinic, store_data.owner_id);
            if (clinics.status == 200) {
                console.log("clinics", clinics.data.view.data)
                this.setState({ all_clinics: clinics.data.view.data })
            }

        
        }


    }

    async loadWards(text) {

        let store_data = await localStorageService.getItem('Login_user_Hospital');

        if (store_data != null) {
          
            let params_ward = { issuance_type: 'Ward',name_like:text }
            let wards = await DashboardServices.getAllClinics(params_ward, store_data.owner_id);
            if (wards.status == 200) {
                console.log("wards", wards.data.view.data)
                this.setState({ all_wards: wards.data.view.data })
            }
        }


    }


    async loadFrontDesk() {


        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)

        var id = user.id;
        var all_front_desk_dummy = [];


        let emp_res = await EmployeeServices.getAsignEmployees({ employee_id: id });
        if (emp_res.status == 200) {
            console.log("frontdesk", emp_res.data.view.data[0].Pharmacy_drugs_store.owner_id)
            this.loadRelatedHospitals(emp_res.data.view.data[0])




            /*   this.setState({
                  login_hospital: frontDesk_id
              }) */
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
                        // frontDesk_id: value.id,
                        name: value.name
                    })

                this.setState({ dialog_for_select_frontDesk: false, })
            }

        }
    }

    async saveDataInLocal(data) {

        await localStorageService.setItem('Login_user_Hospital', data);
        this.setState({ login_hospital: data, loaded: true }, () => {
            //this.getAllClinics();
            this.searchPatients()
            this.render();
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
            limit: 20,
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

            ward_id: this.state.formData.ward_id,

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
            this.searchPatients();

        })
    }


    onRowClick = (rowData, rowMeta) => {
        let selected_data = this.state.data[rowMeta.rowIndex]
        this.setState({ selectedPatient: selected_data, registrationdialogView: true })
    }

    async componentDidMount() {

        this.loadFrontDesk()
        this.loadData()
        //this.getAllClinics()

        //this.searchPatients()
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
                                onSubmit={() => {
                                    let formData = this.state.formData;
                                    formData.page = 0
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
                                            <Tab label={<span className="font-bold text-12">Admission</span>} />
                                            <Tab label={<span className="font-bold text-12">Transfered to Ward</span>} />
                                            <Tab label={<span className="font-bold text-12">Transfered to Hospital</span>} />

                                        </Tabs>



                                    </Grid>

                                    <Grid item lg={6} md={6} xs={6}>
                                        <div className='flex items-center justify-end'>



                                            <TextValidator
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
                                                /* validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */

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
                                        </div>

                                    </Grid>


                                </Grid>
                            </ValidatorForm>
                        </Toolbar>
                    </AppBar>
                    <Drawer
                        className={classes.drawer}
                        variant="persistent"
                        anchor="left"
                        open={this.state.drawerOpen}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >

                        <Grid className='items-center pl-4' container>
                            <Grid item lg={6} md={6} xs={6}>
                                {/*  <Button
                                    className=""
                                    progress={false}
                                    scrollToTop={false}
                                    //startIcon="search"
                                    onClick={() => {
                                        //window.open(`/patients/registration`, '_blank');
                                        this.setState({ registrationdialogView: true })

                                    }}
                                >
                                    <span className="capitalize">New Patient</span>
                                </Button> */}
                            </Grid>
                            <Grid item lg={6} md={6} xs={6}>
                                <div className={classes.drawerHeader}>
                                    <IconButton onClick={this.handleDrawerClose.bind(this)}>
                                        <ChevronLeftIcon />
                                    </IconButton>
                                </div>
                            </Grid>

                        </Grid>
                        {/* <Divider />
 */}
                        <div >
                            <ValidatorForm
                                className='px-2'
                                onSubmit={() => {
                                    let formData = this.state.formData;
                                    formData.page = 0
                                    this.setState({ formData })
                                    this.searchPatients()
                                }}
                                onError={() => null}>

                                <Grid container className='px-2'>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="PHN" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="PHN"
                                            autoFocus={true}
                                            name="phn"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={this.state.formData.phn}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.phn =
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
                                            value={this.state.formData.bht}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.bht =
                                                    e.target.value
                                                this.setState({ formData })
                                            }}
                                           /*  validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                                            errorMessages={[
                                                'Invalid Inputs',
                                            ]} */
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
                                                this.setState({ formData })
                                            }}
                                        /* validators={['matchRegexp:^([0-9]{9}[x|X|v|V]|[0-9]{12})$']}
                                        errorMessages={[
                                            'Invalid NIC',
                                        ]}  */
                                        />
                                    </Grid>




                                    {/*********************************************************************** */}
                                    {this.state.activeTab == 0 ?
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Date of Admission (From)" />
                                            <DatePicker
                                                className="w-full"
                                                value={
                                                    this.state.formData
                                                        .admit_from
                                                }
                                                placeholder="Date of Admission (From)"
                                                // minDate={new Date()}
                                                maxDate={new Date()}
                                                // required={true}
                                                // errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.admit_from =
                                                        dateParse(date)
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        : null}


                                    {this.state.activeTab == 0 ?
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Date of Discharge (From)" />
                                            <DatePicker
                                                className="w-full"
                                                value={
                                                    this.state.formData
                                                        .discharge_from
                                                }
                                                placeholder="Date of Discharge (From)"
                                                // minDate={new Date()}
                                                maxDate={new Date()}
                                                // required={true}
                                                // errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.discharge_from =
                                                        dateParse(date)
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        : null}

                                    {this.state.activeTab == 0 ?
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Date of Discharge (To)" />
                                            <DatePicker
                                                className="w-full"
                                                value={
                                                    this.state.formData
                                                        .discharge_to
                                                }
                                                placeholder="Date of Discharge (To)"
                                                // minDate={new Date()}
                                                maxDate={new Date()}
                                                // required={true}
                                                // errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.discharge_to =
                                                        dateParse(date)
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        : null}
                                    {/************************************************* */}



                                    <Grid
                                        className=" w-full"
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
                                            options={this.state.all_wards.filter((ele) => ele.status == "Active")}

                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    formData.ward_id = value.id
                                                    this.setState({ formData })
                                                }
                                            }}
                                            value={{
                                                name: this.state.formData.ward_id ? (this.state.all_wards.find((obj) => obj.id == this.state.formData.ward_id).name) : null,
                                                id: this.state.formData.ward_id
                                            }}
                                            getOptionLabel={(option) => option.name}
                                            defaultValue={{
                                                name: this.state
                                                    .formData
                                                    .ward_id,
                                            }}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Ward"
                                                    value={
                                                        this.state.all_wards.find((obj) => obj.id == this.state.formData.ward_id)}
                                                    //variant="outlined"
                                                    onChange={(e)=>{
                                                        if(e.target.value.length>=3){
                                                            this.loadWards(e.target.value)
                                                        }
                                                    }}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>


                                    {/************************************************* */}


                                    {this.state.activeTab == 1 ?
                                        <Grid
                                            className=" w-full"
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
                                                options={this.state.all_wards.filter((ele) => ele.status == "Active")}

                                                onChange={(e, value) => {
                                                    if (value != null) {
                                                        let formData = this.state.formData;
                                                        formData.transfer_from = value.id
                                                        this.setState({ formData })

                                                    }
                                                }}
                                                value={{
                                                    name: this.state.formData.transfer_from ? (this.state.all_wards.find((obj) => obj.id == this.state.formData.transfer_from).name) : null,
                                                    id: this.state.formData.transfer_from
                                                }}

                                                getOptionLabel={(option) => option.name}
                                                defaultValue={{
                                                    name: this.state
                                                        .formData
                                                        .transfer_from,
                                                }}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Transfer To"
                                                        value={
                                                            this.state.all_wards.find((obj) => obj.id == this.state.formData.transfer_from)}
                                                        //variant="outlined"
                                                        onChange={(e)=>{
                                                            if(e.target.value.length>=3){
                                                                this.loadWards(e.target.value)
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


                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Status" />

                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={ward_status_types}

                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    formData.status = value.name;
                                                    this.setState({ formData })

                                                }
                                            }}
                                            value={{
                                                name: this.state.formData.status
                                            }}

                                            getOptionLabel={(option) => option.name}
                                            defaultValue={{
                                                name: ward_status_types[0].name,
                                            }}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Status"
                                                    value={this.state.formData.status}
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                />
                                            )}
                                        />
                                    </Grid>

                                    {/********************************************************************* */}




                                    {/************************************************* */}



                                    <Accordion square className='elevation-z0 mt-2'>

                                        <AccordionSummary
                                            style={{ padding: 0 }}
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1a-content"
                                            id="panel1a-header"
                                        >
                                            <SubTitle title="Advanced Search" />
                                        </AccordionSummary>

                                        <AccordionDetails className='px-0'>
                                            <Grid container spacing={1}>
                                                <Grid
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
                                                                .date_of_birth
                                                        }
                                                        placeholder="Date From"
                                                        // minDate={new Date()}
                                                        maxDate={new Date()}
                                                        // required={true}
                                                        // errorMessages="this field is required"
                                                        onChange={(date) => {
                                                            let formData = this.state.formData
                                                            formData.date_of_birth = dateParse(date)
                                                            this.setState({
                                                                formData,
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
                                                                this.state
                                                                    .formData
                                                                    .gender ==
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
                                                                this.state
                                                                    .formData
                                                                    .gender ==
                                                                    'female'
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                    </RadioGroup>
                                                </Grid>
                                                {/*  <Grid item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}>
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Age"
                                                        name="age"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state
                                                                .formData
                                                                .age

                                                        }
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
                                                            formData.age =
                                                                e.target.value
                                                            this.setState(
                                                                {
                                                                    formData,
                                                                }
                                                            )
                                                        }}
                                                     validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                                    />
                                                </Grid> */}

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
                                                    className=" w-full"
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
                                                                formData.nearest_hospital = value.name
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        value={this.state.all_hospitals.find((v) => v.name == this.state.formData.nearest_hospital
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
                                                                onChange={(e)=>{
                                                                    if(e.target.value.length>=3){
                                                                        this.loadHospitals(e.target.value)
                                                                    }
                                                                }}
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
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
                                                    <SubTitle title="Mobile Number" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Mobile Number"
                                                        name="mobile_no"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.formData
                                                                .mobile_no
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData =
                                                                this.state.formData
                                                            formData.mobile_no =
                                                                e.target.value
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
                                                            label: this.state
                                                                .formData
                                                                .citizenship,
                                                        }}
                                                        value={{
                                                            label: this.state
                                                                .formData
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
                                                            }
                                                        }}
                                                        defaultValue={{
                                                            label: this.state
                                                                .formData
                                                                .ethinic_group,
                                                        }}
                                                        value={{
                                                            label: this.state
                                                                .formData
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
                                                            }
                                                        }}
                                                        defaultValue={{
                                                            label: this.state
                                                                .formData
                                                                .religion,
                                                        }}
                                                        value={{
                                                            label: this.state
                                                                .formData
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
                                                            label: this.state
                                                                .formData
                                                                .marital_status,
                                                        }}
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
                                                                let formData =
                                                                    this.state
                                                                        .formData
                                                                formData.district_id =
                                                                    value.id
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}
                                                        /*  defaultValue={this.state.all_district.find(
                                                             (v) => v.id == this.state.formData.district_id
                                                         )} */


                                                        value={{
                                                            name: this.state.formData.district_id ? (this.state.all_district.find((obj) => obj.id == this.state.formData.district_id).name) : null,
                                                            id: this.state.formData.district_id
                                                        }}

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
                                                                onChange={(e)=>{
                                                                    if(e.target.value.length>=3){
                                                                        this.loadDistrict(e.target.value)
                                                                    }
                                                                }}
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
                                                                this.setState({
                                                                    formData,
                                                                })
                                                            }
                                                        }}

                                                        value={{
                                                            name: this.state.formData.moh_id ? (this.state.all_moh.find((obj) => obj.id == this.state.formData.moh_id).name) : null,
                                                            id: this.state.formData.moh_id
                                                        }}

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
                                                                onChange={(e)=>{
                                                                    if(e.target.value.length>=3){
                                                                        this.loadMOH(e.target.value)
                                                                    }
                                                                }}
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
                                                        value={{
                                                            name: this.state.formData.phm_id ? (this.state.all_phm.find((obj) => obj.id == this.state.formData.phm_id).name) : null,
                                                            id: this.state.formData.phm_id
                                                        }}

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
                                                                onChange={(e)=>{
                                                                    if(e.target.value.length>=3){
                                                                        this.loadPHM(e.target.value)
                                                                    }
                                                                }}
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
                                                        value={{
                                                            name: this.state.formData.gn_id ? (this.state.all_gn.find((obj) => obj.id == this.state.formData.gn_id).name) : null,
                                                            id: this.state.formData.gn_id
                                                        }}

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
                                                                onChange={(e)=>{
                                                                    if(e.target.value.length>=3){
                                                                        this.loadGN(e.target.value)
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
                                        </AccordionDetails>

                                    </Accordion>



                                </Grid>





                                <Divider className='mt-2' />
                                <Grid container spacing={1} className='px-2 mt-2'>
                                    <Grid item>
                                        <Button
                                            className="my-1"
                                            color='primary'
                                            progress={false}
                                            scrollToTop={false}
                                            type='submit'
                                            startIcon="search"
                                        //onClick={() => { this.loadConsignmentList() }}
                                        >
                                            <span className="capitalize">Search</span>
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            className="my-1"
                                            progress={false}
                                            color='secondary'
                                            scrollToTop={true}
                                            //type='submit'
                                            startIcon="clearAll"
                                            onClick={() => { this.clearSearch() }}
                                        >
                                            <span className="capitalize">Clear</span>
                                        </Button>
                                    </Grid>
                                </Grid>



                            </ValidatorForm>
                        </div>






                    </Drawer>
                    <main
                        className={clsx(classes.content, {
                            [classes.contentShift]: this.state.drawerOpen,
                        }, 'px-3')}
                    >
                        <div className={classes.drawerHeader} />

                        {this.state.Loaded ?
                            <div>

                                {this.state.activeTab == 0 ?
                                    <div >
                                        <AdmissionsPatients filterData={this.state.formData} loaded={this.state.Loaded}></AdmissionsPatients>
                                    </div> : null
                                }



                                {this.state.activeTab == 1 ?
                                    <div >
                                        <TransferdPatient filterData={this.state.formData} loaded={this.state.Loaded}></TransferdPatient>
                                    </div> : null
                                }

                                {this.state.activeTab == 2 ?
                                    <div >
                                        <TransferdPatientHospital filterData={this.state.formData} loaded={this.state.Loaded}></TransferdPatientHospital>
                                    </div> : null
                                }

                            </div>
                            : null}

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
                        <Registration></Registration>
                    </div>
                </Dialog>





                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_frontDesk} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Select Your Front Desk1" />

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






            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(PatientsSearch)
