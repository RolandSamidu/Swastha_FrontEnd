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
// import Registration from './Registration';
import EMMRSuccessList from './EMMRSuccessList'
import EMMRFailedList from './EMMRFailedList'
// import MRODeathtable from './MRODeathtable'
// import MRORegisterdPatients from './MRORegisterdPatients'
// import MROLoginToEIMMR from './MROLoginToEIMMR'


// import TransferdPatient from './TransferdPatient';
// import TransferdPatientHospital from './TransferdPatientHospital';
// import * as appConst from '../../../../appconst'

import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
import localStorageService from 'app/services/localStorageService';
import ClinicService from 'app/services/ClinicService';
import EmployeeServices from 'app/services/EmployeeServices'
// import { ward_status_types } from '../../../appconst'
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


// const Accordion = withStyles({
//     root: {
//         "&$expanded": {
//             margin: "auto"
//         }
//     },
//     expanded: {}
// })(MuiAccordion);

class EMMRSearch extends Component {
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
                // passport_no: null,
                // driving_license: null,
                // mobile_no: '',
                // clinic_id: null,
                // discharge_from:null,
                // admit_to:null,
                phn: '',
                bht: '',
                patient_name:'',
                // nic: '',
                // status: 'Discharged',
                // mro_status: 'Pending',
                ward_id: '',
                search: null

            },
            patient_id:null,
            // data: [],
            // columns: [
            //     /* {
            //         name: 'id',
            //         label: 'id',
            //         options: {
            //             display: false,
            //         },
            //     }, */
            //     {
            //         name: 'name',
            //         label: 'Name',
            //         options: {
            //             display: true,
            //         },
            //     },
            //     {
            //         name: 'phn',
            //         label: 'PHN',
            //         options: {
            //             display: true,
            //         },
            //     },
            //     {
            //         name: 'nic',
            //         label: 'NIC Number',
            //         options: {
            //             display: true,
            //         },
            //     },
            //     {
            //         name: 'passport_no',
            //         label: 'Passport Number',
            //         options: {
            //             display: true,
            //         },
            //     },
            //     {
            //         name: 'passport_no',
            //         label: 'Passport Number',
            //         options: {
            //             display: true,
            //         },
            //     }, {
            //         name: 'mobile_no',
            //         label: 'Mobile Number',
            //         options: {
            //             display: true,
            //         },
            //     },

            //     {
            //         name: 'action',
            //         label: 'Action',
            //         options: {
            //             filter: true,
            //             display: false,
            //             customBodyRender: (value, tableMeta, updateValue) => {
            //                 return (
            //                     <>
            //                         <Button
            //                             color="secondary"
            //                             className="mr-1 ml-1"
            //                         /*  onClick={() => {
            //                              let selected_data = this.state.data[tableMeta.rowIndex]
            //                              this.setState({ selectedPatient: selected_data, admissiondialogView: true })
            //                          }} */
            //                         >
            //                             Admit to Ward
            //                         </Button>

            //                         <Button
            //                             color="secondary"
            //                             className="mr-1 ml-1"
            //                         /* onClick={() => {
            //                             this.props.history.push({
            //                                 pathname:
            //                                     '/patients/admission-clinic',
            //                                 state: this.state.data[
            //                                     tableMeta.rowIndex
            //                                 ],
            //                             })
            //                             // this.handleUpdate(res.rowData)
            //                         }} */
            //                         >
            //                             Assign to clinic
            //                         </Button>

            //                         {/*  <Button
            //                             color="secondary"
            //                             className="mr-1 ml-1"
            //                             onClick={() => {
            //                                 this.props.history.push({
            //                                     pathname:
            //                                         '/patients/info/' + this.state.data[tableMeta.rowIndex].id
            //                                 })
            //                                 // this.handleUpdate(res.rowData)
            //                             }}
            //                         >
            //                             Examination details
            //                         </Button> */}
            //                     </>
            //                 )
            //             },
            //         },
            //     },
            // ],
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



        let params_ward = { issuance_type: 'Hospital' }
        let hospitals = await DashboardServices.getAllHospitals(params_ward);
        if (hospitals.status == 200) {
            console.log("all_hospitals", hospitals.data.view.data)
            this.setState({ all_hospitals: hospitals.data.view.data })
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

        this.setState({
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
                this.setState({ all_clinics: clinics.data.view.data })
            }

            let params_ward = { issuance_type: 'Ward', employee_id: user.id }
            let wards = await DashboardServices.getAllClinics(params_ward, store_data.owner_id);
            if (wards.status == 200) {
                console.log("wards", wards.data.view.data)
                //let ward_id = wards.data.view.data[0].id;
                let formData = this.state.formData;
                // formData.ward_id = ward_id
                this.setState({ all_wards: wards.data.view.data, formData }, () => {
                    setTimeout(() => {
                        this.searchPatients()
                    }, 1000);

                })


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
            this.getAllClinics();
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
            // passport_no: null,
            // driving_license: null,
            // mobile_no: null,
            // clinic_id: null,
            phn: '',
            bht: '',
            patient_name:'',
            discharge_from:"",
            admit_to:"",
            // nic: '',
            // date_of_registered_from: null,
            // date_of_registered_to: null,
            // discharge_from: null,
            // discharge_to: null,
            // admit_from: null,
            // admit_to: null,
            // date_of_birth: null,
            // gender: '',
            // address: '',
            // nearest_hospital: '',

            ward_id: null,
            // this.state.formData.ward_id,

            // email: '',
            // citizenship: '',
            // ethinic_group: '',
            // religion: '',
            //marital_status: '',
            // district_id: null,
            // moh_id: null,
            // phm_id: null,
            // gn_id: null,
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
        this.getAllClinics()

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
                                            <Tab label={<span className="font-bold text-12">EMMR Success List </span>} />
                                            <Tab label={<span className="font-bold text-12">EMMR Failed List</span>} />
                                            

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
                                onSubmit={() => this.searchPatients()}
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
                                        <SubTitle title="Patient Name" />

                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Patient Name"
                                            name="patient_name"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={this.state.formData.patient_name}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let formData =
                                                    this.state.formData
                                                formData.patient_name =
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
                                </Grid>

                                {this.state.activeTab == 1 || this.state.activeTab == 2 || this.state.activeTab == 3 || this.state.activeTab == 4 ?
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Date of Clinic (To)" />
                                            <DatePicker
                                                className="w-full"
                                                value={
                                                    this.state.formData
                                                        .admit_to
                                                }
                                                placeholder="Date of Clinic (To)"
                                                // minDate={new Date()}
                                                maxDate={new Date()}
                                                // required={true}
                                                // errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData =
                                                        this.state
                                                            .formData
                                                    formData.admit_to =
                                                    dateParse(date)
                                                    this.setState({
                                                        formData,
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        : null}
                                    {/************************************************* */}


                                    {this.state.activeTab == 1 || this.state.activeTab == 2 || this.state.activeTab == 3 || this.state.activeTab == 4 ?                                        <Grid
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







                                <Divider className='mt-2' />
                                <Grid container spacing={1} className='px-2 mt-2'>
                                    <Grid item>
                                        <Button
                                            className="my-1"
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
                                        <EMMRSuccessList filterData={this.state.formData} loaded={this.state.Loaded} patient_id={this.state.patient_id}></EMMRSuccessList>
                                    </div> : null
                                }
                                {this.state.activeTab == 1 ?
                                    <div >
                                        <EMMRFailedList filterData={this.state.formData} loaded={this.state.Loaded}></EMMRFailedList>
                                    </div> : null
                                }
                                {/* {this.state.activeTab == 2 ?
                                    <div >
                                        <MRODeathtable filterData={this.state.formData} loaded={this.state.Loaded}></MRODeathtable>
                                    </div> : null
                                }
                                {this.state.activeTab == 3?
                                    <div >
                                        <MRORegisterdPatients filterData={this.state.formData} loaded={this.state.Loaded}></MRORegisterdPatients>
                                    </div> : null
                                }

                                {this.state.activeTab == 4 ?
                                    <div >
                                        <MROLoginToEIMMR filterData={this.state.formData} loaded={this.state.Loaded}></MROLoginToEIMMR>
                                    </div> : null
                                }  */}

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
                        {/* <Registration></Registration> */}
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

export default withStyles(styleSheet)(EMMRSearch)