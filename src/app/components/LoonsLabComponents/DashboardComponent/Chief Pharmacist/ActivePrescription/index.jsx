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
    Tab,
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiAccordion from '@material-ui/core/Accordion'
import { Autocomplete, TabContext, TabPanel } from '@material-ui/lab'
import 'date-fns'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import CloseIcon from '@material-ui/icons/Close'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import SearchIcon from '@material-ui/icons/Search'
import DashboardServices from 'app/services/DashboardServices'
import { dateParse } from '../../../../../../utils'
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
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as appConst from '../../../../../../appconst'
import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
import localStorageService from 'app/services/localStorageService'
import ClinicService from 'app/services/ClinicService'
import WarehouseServices from 'app/services/WarehouseServices'
import PharmacyPrescription from '../../../../../views/Prescription/PharmacyPrescription'
import PharmacyPrescriptionSupport from './pharmacyPrescriptionSupport'
const drawerWidth = 270
let activeTheme = MatxLayoutSettings.activeTheme

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
        width:'100%'
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

const Accordion = withStyles({
    root: {
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion)

class ActivePrescription extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: true,
            activeStep: 0,
            registrationdialogView: false,
            login_hospital: {},

            dialog_for_select_frontDesk: false,
            all_front_desk: [],
            activeTab: 'prescription',
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],
            all_clinics: [],
            all_wards: [],
            all_consultant: [],
            all_hospitals: [],

            alert: false,
            message: '',
            severity: 'success',

            Loaded: false,
            userRoles: [],

            totalItems: 0,
            totalPages: 0,
            formData: {
                limit: 5,
                page: 0,
                'order[0]': ['createdAt', 'DESC'],
                passport_no: null,
                type: 'Clinic',
                driving_license: null,
                mobile_no: '',
                clinic_id: null,
                owner_id: null,
                phn: '',
                bht: '',
                nic: '',
                no_druglist: true,

                search: null,
            },
            data: [],
            columns: [
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
                },
                {
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

    async loadDistrict(text) {
        let district_res = await DivisionsServices.getAllDistrict({
            name_like: text,
            limit: 99999,
        })
        if (district_res.status == 200) {
            console.log('district', district_res.data.view.data)
            this.setState({
                all_district: district_res.data.view.data,
            })
        }
    }

    async loadMOH(text) {
        let moh_res = await DivisionsServices.getAllMOH({
            limit: 99999,
            search: text,
        })
        if (moh_res.status == 200) {
            console.log('moh', moh_res.data.view.data)
            this.setState({
                all_moh: moh_res.data.view.data,
            })
        }
    }

    async loadPHM(text) {
        let phm_res = await DivisionsServices.getAllPHM({
            limit: 99999,
            search: text,
        })
        if (phm_res.status == 200) {
            console.log('phm', phm_res.data.view.data)
            this.setState({
                all_phm: phm_res.data.view.data,
            })
        }
    }

    async loadGN(text) {
        let gn_res = await DivisionsServices.getAllGN({
            limit: 99999,
            search: text,
        })
        if (gn_res.status == 200) {
            console.log('gn', gn_res.data.view.data)
            this.setState({
                all_gn: gn_res.data.view.data,
            })
        }
    }

    async loadHospitals(text) {
        let params_ward = { issuance_type: 'Hospital', name_like: text }
        let hospitals = await DashboardServices.getAllHospitals(params_ward)
        if (hospitals.status == 200) {
            console.log('all_hospitals', hospitals.data.view.data)
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
    }

    handleDrawerClose() {
        this.setState({ drawerOpen: false })
    }

    async searchPatients() {
        this.setState({ Loaded: false })

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
        let store_data = await localStorageService.getItem(
            'Login_user_Hospital'
        )

        if (store_data != null) {
            let params_clinic = { issuance_type: 'Clinic' }
            let clinics = await DashboardServices.getAllClinics(
                params_clinic,
                store_data.owner_id
            )
            if (clinics.status == 200) {
                console.log('clinics', clinics.data.view.data)
                this.setState({ all_clinics: clinics.data.view.data })
            }

            let params_ward = { issuance_type: 'Ward' }
            let wards = await DashboardServices.getAllClinics(
                params_ward,
                store_data.owner_id
            )
            if (wards.status == 200) {
                console.log('wards', wards.data.view.data)
                this.setState({ all_wards: wards.data.view.data })
            }
        }
    }

    async loadClinics(text) {
        let store_data = await localStorageService.getItem(
            'Login_user_Hospital_front_desk'
        )

        if (store_data != null) {
            let params_clinic = { issuance_type: 'Clinic', name_like: text }
            let clinics = await DashboardServices.getAllClinics(
                params_clinic,
                store_data.owner_id
            )
            if (clinics.status == 200) {
                console.log('clinics', clinics.data.view.data)
                this.setState({ all_clinics: clinics.data.view.data })
            }
        }
    }

    async loadWards(text) {
        let store_data = await localStorageService.getItem(
            'Login_user_Hospital_front_desk'
        )

        if (store_data != null) {
            let params_ward = { issuance_type: 'Ward', name_like: text }
            let wards = await DashboardServices.getAllClinics(
                params_ward,
                store_data.owner_id
            )
            if (wards.status == 200) {
                console.log('wards', wards.data.view.data)
                this.setState({ all_wards: wards.data.view.data })
            }
        }
    }

    async loadFrontDesk() {
        var user = await localStorageService.getItem('userInfo')
        //console.log('user', user)

        var id = user.id
        var all_front_desk_dummy = []

        var frontDesk_id = await localStorageService.getItem(
            'Login_user_Hospital'
        )
        if (!frontDesk_id) {
            this.setState({
                dialog_for_select_frontDesk: true,
                userRoles: user.roles,
            })
        } else {
            this.setState(
                {
                    login_hospital: frontDesk_id,
                    userRoles: user.roles,
                },
                () => {
                    this.loadConsultant()
                }
            )
        }

        //
        /*     let params = { employee_id: id, type: "Pharmacy" }
            let res = await PatientServices.getAllFront_Desk(params);
            if (res.status == 200) {
                console.log("Pharmacy", res.data.view.data)
    
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
    
               
            } */

        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params)
        let all_pharmacy_dummy = []
        if (res.status == 200) {
            console.log('CPALLOders', res.data.view.data)

            res.data.view.data.forEach((element) => {
                /* all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }
 
                ) */
                if (element.Warehouse.main_or_personal == 'Personal') {
                    all_front_desk_dummy.push({
                        Pharmacy_drugs_store: element.Warehouse,
                        name: element.Warehouse.name,
                        id: element.id,
                        owner_id: element.Warehouse.owner_id,
                        pharmacy_drugs_stores_id:
                            element.Warehouse.pharmacy_drugs_store_id,
                    })
                }
            })
            console.log('desk data', all_front_desk_dummy)
            this.setState({ all_front_desk: all_front_desk_dummy })
        }
    }

    async loadRelatedHospitals(value) {
        let params = { issuance_type: 'Hospital' }
        let res = await ClinicService.fetchAllClinicsNew(params, value.owner_id)
        if (res.status == 200) {
            console.log('hospital', res.data.view.data)
            if (res.data.view.data.length > 0) {
                this.saveDataInLocal({
                    hospital_id: res.data.view.data[0].id,
                    owner_id: value.owner_id,
                    pharmacy_drugs_stores_id: value.pharmacy_drugs_stores_id,
                    frontDesk_id: value.id,
                    name: value.name,
                })

                this.setState({ dialog_for_select_frontDesk: false })
            }
        }
    }

    async saveDataInLocal(data) {
        await localStorageService.setItem('Login_user_Hospital', data)
        this.setState({ login_hospital: data }, () => {
            //this.getAllClinics()
            this.loadConsultant()
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
        var user = await localStorageService.getItem('userInfo')

        let formData = {
            hospital_id: user.hospital_id,
            limit: 20,
            page: 0,
            'order[0]': ['createdAt', 'DESC'],
            passport_no: null,
            driving_license: null,
            type: 'Clinic',
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
            this.searchPatients()
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
        console.log(
            'hospital id',
            this.state.login_hospital.pharmacy_drugs_stores_id
        )
        let params = {
            type: 'Consultant',
            //pharmacy_drugs_stores_id: this.state.login_hospital.pharmacy_drugs_stores_id
        }

        let cunsultantData = await PatientServices.getAllFront_Desk(params)
        // console.log("consultants", cunsultantData.data.view.data)
        let all_consultant = []
        if (200 == cunsultantData.status) {
            cunsultantData.data.view.data.forEach((element) => {
                console.log('single emplyee', element.Employee)
                all_consultant.push(element.Employee)
            })

            this.setState({
                all_consultant: all_consultant,
            })
        }
    }

    // onRowClick = (rowData, rowMeta) => {
    //     let selected_data = this.state.data[rowMeta.rowIndex]
    //     this.setState({
    //         selectedPatient: selected_data,
    //         registrationdialogView: true,
    //     })
    // }

    async componentDidMount() {
        /*   const { history } = this.props;
          window.addEventListener("popstate", () => {
          history.go(1);
        }); */

        let owner_id = await localStorageService.getItem('owner_id')

        let filterData = this.state.formData
        filterData.owner_id = owner_id
        this.setState({ filterData }, () => {
            // this.loadFrontDesk()
            // this.loadData()
            this.searchPatients()
        })

        // this.getAllClinics()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        //const elmRef = useAutocompleteInputClear(value, v => !v || !v.id)
        return (
            <Fragment>
                <div className={classes.root}>
                    <main className='w-full'
                    // className={clsx(
                    //     classes.content,
                    //     {
                    //         [classes.contentShift]: this.state.drawerOpen,
                    //     },
                    //     'px-3'
                    // )}
                    >
                        {/* <div className={classes.drawerHeader} /> */}

                        {/* {this.state.Loaded ?
                            <div>
                                {this.state.activeTab == 0 ?
                                    <div className='w-full'>
                                        <PharmacyPatients filterData={this.state.formData} loaded={this.state.Loaded}></PharmacyPatients>
                                    </div> : null
                                }

                            </div>
                            : null} */}
                        {/* <TabContext value={this.state.activeTab}> */}
                        {/* <Box>
                                <TabList style={{ minHeight: 39, height: 26 }}
                                        //indicatorColor="primary"
                                        textColor="primary"
                                        // value={this.state.activeTab}
                                        onChange={(event, newValue) => {
                                            console.log(newValue)
                                            this.setState({ activeTab: newValue })
                                        }} >
                                        <Tab value="patient" label={<span className="font-bold text-12">Patient</span>} />
                                        <Tab value="prescription" label={<span className="font-bold text-12">Prescription</span>} />
                                </TabList>
                            </Box> */}
                        {/* <TabPanel value="patient">
                                <Grid
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    xs={12}
                                >
                                    {this.state.Loaded ?
                                        <div>
                                            {this.state.activeTab == 'patient'?
                                                <div className='w-full'>
                                                    <PharmacyPatients filterData={this.state.formData} loaded={this.state.Loaded}></PharmacyPatients>
                                                </div> : null
                                            }

                                        </div>
                                    : null}
                                </Grid>
                            </TabPanel> */}
                        <Grid lg={12} md={12} sm={12} xs={12}>
                            {this.state.Loaded ? (
                                <div>
                                    <div className="w-full">
                                        <PharmacyPrescriptionSupport
                                            filterData={this.state.formData}
                                            loaded={this.state.Loaded}
                                        ></PharmacyPrescriptionSupport>
                                    </div>
                                </div>
                            ) : null}
                        </Grid>
                        {/* </TabContext> */}
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

                <Dialog maxWidth="lg " open={this.state.registrationdialogView}>
                    <MuiDialogTitle
                        disableTypography
                        className={classes.Dialogroot}
                    >
                        <CardTitle title="Patient Registration" />

                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={() => {
                                this.setState({ registrationdialogView: false })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                </Dialog>

                {/* <Dialog
                    fullWidth
                    maxWidth="sm"
                    open={this.state.dialog_for_select_frontDesk}
                >
                    <MuiDialogTitle
                        disableTypography
                        className={classes.Dialogroot}
                    >
                        <CardTitle title="Select Your Pharmacy" /> */}

                {/* <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_frontDesk: false }) }}>
                            <CloseIcon />
                        </IconButton>
 */}
                {/* </MuiDialogTitle>

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
                                        this.loadRelatedHospitals(value)
                                        this.setState({
                                            frontDesk_id: value.id,
                                        })
                                    }
                                }}
                                value={{
                                    name: this.state.frontDesk_id
                                        ? this.state.all_front_desk.find(
                                              (obj) =>
                                                  obj.id ==
                                                  this.state.frontDesk_id
                                          ).name
                                        : null,
                                    id: this.state.frontDesk_id,
                                }}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Pharmacy"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </ValidatorForm>
                    </div>
                </Dialog> */}
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(ActivePrescription)
