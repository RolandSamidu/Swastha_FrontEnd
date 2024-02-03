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
    //Accordion,
    AccordionDetails,
    AccordionSummary,
    Tooltip,
} from '@material-ui/core'
import EditAdmissionClinic from './EditAdmissionClinic'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import AssignmentIcon from '@material-ui/icons/Assignment'
import MuiAccordion from '@material-ui/core/Accordion'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
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
import { themeColors } from 'app/components/MatxTheme/themeColors'
import SearchIcon from '@material-ui/icons/Search'
import DashboardServices from 'app/services/DashboardServices'
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
import AdmissionClinic from './AdmissionClinic'
import PrintDocuments from './PrintDocuments'

import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
import localStorageService from 'app/services/localStorageService'
import EditOPD from './EditOPD'
import { dateParse, timeParse } from 'utils'

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

class OPDPatients extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: true,
            activeStep: 0,
            registrationdialogView: false,
            printDialogView: false,

            titleName: 'Patient Registration',

            alert: false,
            message: '',
            severity: 'success',

            Loaded: this.props.loaded,
            selectedPatient: null,

            totalItems: 0,
            totalPages: 0,
            formData: this.props.filterData,
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
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <div className="flex items-center">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                className="px-2"
                                                onClick={() => {
                                                    this.editIconAction(
                                                        tableMeta
                                                    )
                                                }}
                                                size="small"
                                                aria-label="view"
                                            >
                                                <EditIcon color="primary" />
                                            </IconButton>
                                        </Tooltip>

                                        <Tooltip title="Print Documents">
                                            <IconButton
                                                className="px-2"
                                                onClick={() => {
                                                    console.log('clicked')
                                                    let selected_data =
                                                        this.state.data[
                                                            tableMeta.rowIndex
                                                        ]
                                                    console.log(
                                                        'clicked',
                                                        selected_data
                                                    )
                                                    this.setState({
                                                        selectedPatient:
                                                            selected_data,
                                                        printDialogView: true,
                                                    })
                                                }}
                                                size="small"
                                                aria-label="view"
                                            >
                                                <AssignmentIcon
                                                    style={{ color: '#079f13' }}
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </>
                            )
                        },
                    },
                },
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
                    name: 'OPD',
                    label: 'OPD',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return <p>{this.state.data[dataIndex]?.clinic}</p>
                        },
                    },
                },
                {
                    name: 'bht',
                    label: 'OPD number',
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
                    name: 'mobile_no',
                    label: 'Mobile Number',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'Passport and Driving License Number',
                    label: 'Passport and Driving License Number',
                    options: {
                        display: false,
                        customBodyRenderLite: (dataIndex) => {
                            let passport_no = this.state.data[dataIndex]
                                .passport_no
                                ? this.state.data[dataIndex].passport_no
                                : ''
                            let driving_license = this.state.data[dataIndex]
                                .driving_license
                                ? this.state.data[dataIndex].driving_license
                                : ''

                            let data = '' + passport_no
                            data += ', ' + driving_license

                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'Registerd Date Time',
                    label: 'Registerd Date Time',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let date = this.state.data[dataIndex].createdAt;
                           
                            let data = "" + dateParse(date)+" "+timeParse(date);
                            
                            return <p>{data}</p>

                        },
                    },
                },
            ],
        }
    }

    editIconAction(tableMeta) {
        console.log('hello555555', this.state.data[tableMeta.rowIndex])

        this.setState({
            registrationdialogView: true,
            selectedPatient: this.state.data[tableMeta.rowIndex],
            titleName: 'Patient Update',
        })
    }

    async loadData() {}

    async searchPatients() {
        var user = await localStorageService.getItem('userInfo')
        this.setState({ Loaded: false })
        let formData = this.state.formData
        formData.type = 'OPD'
        let store_data = await localStorageService.getItem(
            'Login_user_Hospital_front_desk'
        )
        formData.hospital_id = store_data.hospital_id
        const patientdata =
            await PatientServices.fetchClinicWardPatientsByAttribute(formData)

        if (200 == patientdata.status) {
            if (0 >= patientdata.data.view.totalItems) {
                this.setState({
                    isPhnFound: false,
                    Loaded: true,
                })
            } else {
                console.log('Patient Data====>', patientdata.data.view.data)
                let patients = []

                patientdata.data.view.data.forEach((element) => {
                    let el = {
                        "clinic_patient_id":element.id,
                        "clinic": element.Pharmacy_drugs_store?.name,
                        "guardian": element.guardian,
                        "consultant": element.Employee?.name,
                        "bht": element.bht,
                        "type":element.type,
                        "mode":element.mode,
                        "consultant_id":element.consultant_id,
                        "stat":element.stat,
                        "medico_legal":element.medico_legal,
                        "Pharmacy_drugs_store": element.Pharmacy_drugs_store,
                        "admit_date_time": element.admit_date_time,
                        ...element.Patient,
                    }
                    patients.push(el)
                })

                this.setState({
                    isPhnFound: true,
                    Loaded: true,
                    data: patients,
                    totalItems: patientdata.data.view.totalItems,
                    totalPages: patientdata.data.view.totalPages,
                })
            }
        }
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

    componentDidMount() {
        this.searchPatients()
    }

    onRowClick = (rowData, rowMeta) => {
        let selected_data = this.state.data[rowMeta.rowIndex]
        // this.setState({ selectedPatient: selected_data, registrationdialogView: true })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                {this.state.Loaded ? (
                    <LoonsTable
                        //title={"All Aptitute Tests"}
                        title={"Total:"+this.state.totalItems}
                        id={'patientsAdmission'}
                        data={this.state.data}
                        columns={this.state.columns}
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: this.state.totalItems,
                            rowsPerPage: 100,
                            page: this.state.formData.page,
                            print: false,
                            viewColumns: false,
                            download: false,
                            onRowClick: this.onRowClick,
                            onTableChange: (action, tableState) => {
                                console.log(action, tableState)
                                switch (action) {
                                    case 'changePage':
                                        this.setPage(tableState.page)
                                        break
                                    case 'sort':
                                        //this.sort(tableState.page, tableState.sortOrder);
                                        break
                                    default:
                                        console.log('action not handled.')
                                }
                            },
                        }}
                    ></LoonsTable>
                ) : (
                    //load loading effect
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                )}
                {/*   <Dialog maxWidth="lg " open={this.state.registrationdialogView}
                    onClose={() => { this.setState({ registrationdialogView: false }) }}>
                    <div className="w-full h-full px-5 py-5">
                        <AdmissionClinic patientDetails={this.state.selectedPatient}></AdmissionClinic>
                    </div>
                </Dialog> */}

                <Dialog maxWidth="lg " open={this.state.registrationdialogView}>
                    <MuiDialogTitle
                        disableTypography
                        className={classes.Dialogroot}
                    >
                        <CardTitle title={this.state.titleName} />

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
                    <div className="w-full h-full px-5 py-5">
                        <EditOPD
                            usage="update"
                            data={this.state.selectedPatient}
                        ></EditOPD>
                    </div>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={
                        this.state.printDialogView
                    } /* onClose={() => { this.setState({ admissiondialogView: false }) }} */
                >
                    <MuiDialogTitle
                        disableTypography
                        className={classes.Dialogroot}
                    >
                        <CardTitle title="Patient Document Print" />

                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={() => {
                                this.setState({ printDialogView: false })
                                //window.location.reload();
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 ">
                        <PrintDocuments
                            patientDetails={this.state.selectedPatient}
                            tab="OPD"
                        ></PrintDocuments>
                    </div>
                </Dialog>

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

export default withStyles(styleSheet)(OPDPatients)
