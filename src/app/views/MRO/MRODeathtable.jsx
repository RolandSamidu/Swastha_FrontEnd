import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility';
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
    Tooltip,
    //Accordion,
    AccordionDetails,
    AccordionSummary
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
// import Registration from './Registration';
import MuiAccordion from "@material-ui/core/Accordion";
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import clsx from 'clsx';
import { merge } from 'lodash'
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
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
import { themeColors } from "app/components/MatxTheme/themeColors";
import SearchIcon from '@material-ui/icons/Search';
import DashboardServices from "app/services/DashboardServices";
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
// import Admission from './Admission';

import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
import localStorageService from 'app/services/localStorageService';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import CancelIcon from '@material-ui/icons/Cancel';
// import Transfer from './Transfer';
// import Discharge from './Discharge';

import * as Util from '../../../utils'
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

class MRODeathtable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: true,
            activeStep: 0,
            trasnsferDialogView: false,
            admissiondialogView: false,
            dischargeDialogView: false,
            titleName: 'Patient Registration',

            alert: false,
            message: '',
            severity: 'success',

            Loaded: this.props.loaded,
            selectedPatient: null,
            patient_id:null,
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
                            let id = this.state.data[tableMeta.rowIndex].id

                            return (
                                <Grid className='flex items-center'>
                                    <Tooltip title='Patient'>
                          <IconButton
                              onClick={() => {
                                  console.log('clicked')
                                  let selected_data = this.state.data[tableMeta.rowIndex]
                                  console.log('clicked', selected_data)
                                  window.dashboardVariables=selected_data;
                                  console.log("dashboard Variables",window.dashboardVariables)

                                  window.location = `/mro/patients/info/${id}`
                                 
                              }}
                          >
                              <VisibilityIcon color='primary' />
                          </IconButton>
                      </Tooltip>
                                </Grid>
                            )
                        },
                    },
                },
                // {
                //     name: 'status',
                //     label: 'Status',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'Patient',
                    label: 'PHN',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[tableMeta.columnIndex].phn == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].phn)
                            }
                        }
                    },
                },
                {
                    name: 'bht',
                    label: 'BHT',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'Patient',
                    label: 'Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[tableMeta.columnIndex].name == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].title + ". " + tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    },
                },
                {
                    name: 'Patient',
                    label: 'Age',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[tableMeta.columnIndex].age == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].age)
                            }
                        }
                    },
                },
                {
                    name: 'Pharmacy_drugs_store',
                    label: 'Ward',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[tableMeta.columnIndex].name == null) {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    },
                },
                {
                    name: 'Employee',
                    label: 'Consultant',
                    options: {
                        customBodyRenderLite: (dataIndex) => {


                            if (this.state.data[dataIndex].Employee==null) {
                                return 'N/A'
                            } else {
                                return this.state.data[dataIndex].Employee.name
                            }
                        }
                    },
                },
                // {
                //     name: 'mode',
                //     label: 'Admission Mode',
                //     options: {
                //         display: true,
                //     },
                // },
                {
                    name: 'admit_date_time',
                    label: 'Date/Time (Admitted)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data[dataIndex].status == 'Transfer') {

                            } else if (this.state.data[dataIndex].admit_date_time) {
                                return Util.dateTimeParse(this.state.data[dataIndex].admit_date_time)
                            }
                        },
                    }
                },
                {
                    name: 'transfer_date_time',
                    label: 'Date/Time (Transfer)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data[dataIndex].transfer_date_time) {
                                return Util.dateTimeParse(this.state.data[dataIndex].transfer_date_time)
                            }
                        },
                    },
                },
                {
                    name: 'discharge_date_time',
                    label: 'Date/Time (Discharge)',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data[dataIndex].discharge_date_time) {
                                return Util.dateTimeParse(this.state.data[dataIndex].discharge_date_time)
                            }
                        },
                    },
                },
                {
                    name: 'discharge_mode',
                    label: 'Discharge Mode',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                           
                            if (this.state.data[dataIndex].discharge_mode==null) {
                                return 'N/A'
                            } else {
                                return this.state.data[dataIndex].discharge_mode
                            }
                    },
                    }
                }


            ],
        }
    }

    editIconAction(tableMeta) {
        this.setState({
            registrationdialogView: true,
            tableRowData: this.state.data[tableMeta.rowIndex],
            titleName: "Patient Update"

        })
    }

    async loadData() {

    }


    async searchPatients() {

        // var user = await localStorageService.getItem('userInfo');
        this.setState({ Loaded: false })
        let formData = this.state.formData;
        // formData.type = 'Ward';
        let store_data = await localStorageService.getItem('Login_user_Hospital');
        if (store_data == null) {
            // window.location.reload()
        }
        formData.hospital_id = store_data.hospital_id;
        let newParams={
            ...formData,...{
                // not_status:'Transfer to Hospital',
                // mro_status: 'Discharged',
                discharge_mode:'Death',
                // status:'Discharged'
            }

        }
        const patientdata = await PatientServices.fetchClinicWardPatientsByAttribute(newParams)


        if (200 == patientdata.status) {
            if (0 >= patientdata.data.view.totalItems) {
                this.setState({
                    data:patientdata.data.view.data,
                    phn:patientdata.data.view.data.patient_id,
                    isPhnFound: false,
                    Loaded: true,

                })
            } else {
                console.log('Patient Data Admi', patientdata.data.view.data)
                this.setState({
                    patient_id:patientdata.data.view.data.patient_id,
                })
                console.log("P ID",this.state.patient_id)
                // let patients = [];

                // patientdata.data.view.data.forEach(element => {
                //     let data=merge({}, element.Patient, element)
                //     patients.push(data)
                // });


                this.setState({
                    isPhnFound: true,
                    Loaded: true,
                    data: patientdata.data.view.data,
                    totalItems: patientdata.data.view.totalItems,
                    totalPages: patientdata.data.view.totalPages
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
        //  this.setState({ selectedPatient: selected_data, registrationdialogView: true })
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                {this.state
                    .Loaded ? (
                    <LoonsTable
                        //title={"All Aptitute Tests"}

                        id={'patientsAdmission'}
                        data={
                            this.state
                                .data
                        }
                        columns={
                            this.state
                                .columns
                        }
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
                        <CircularProgress
                            size={30}
                        />
                    </Grid>
                )}

                {/* <Dialog maxWidth="lg " open={this.state.registrationdialogView} onClose={() => { this.setState({ registrationdialogView: false }) }}>
                    <div className="w-full h-full px-5 py-5">
                        <Admission patientDetails={this.state.selectedPatient}></Admission>
                    </div>
                </Dialog> */}


                <Dialog maxWidth="lg " open={this.state.admissiondialogView} /* onClose={() => { this.setState({ admissiondialogView: false }) }} */>


                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Patient Admission to Ward" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ admissiondialogView: false })

                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        {/* <Admission patientDetails={this.state.selectedPatient}></Admission> */}
                    </div>
                </Dialog>




                <Dialog maxWidth="lg" open={this.state.trasnsferDialogView} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Patient Transfer to Ward" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ trasnsferDialogView: false })

                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        {/* <Transfer patientDetails={this.state.selectedPatient}></Transfer> */}
                    </div>
                </Dialog>

                <Dialog maxWidth="lg" open={this.state.dischargeDialogView} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Patient Discharge from Ward" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ dischargeDialogView: false })

                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        {/* <Discharge patientDetails={this.state.selectedPatient}></Discharge> */}
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

export default withStyles(styleSheet)(MRODeathtable)