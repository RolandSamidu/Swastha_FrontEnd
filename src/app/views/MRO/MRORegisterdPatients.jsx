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
    Tooltip
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import MuiAccordion from "@material-ui/core/Accordion";
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { MatxLayoutSettings } from "app/components/MatxLayout/settings";
import clsx from 'clsx';
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
import EditIcon from '@material-ui/icons/Edit';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import BallotIcon from '@material-ui/icons/Ballot';
import QueuePlayNextIcon from '@material-ui/icons/QueuePlayNext';
import SingleBedIcon from '@material-ui/icons/SingleBed';
import HotelIcon from '@material-ui/icons/Hotel';



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
// import Admission from './Admission';
// import AdmissionClinic from './AdmissionClinic';
// import PrintDocuments from './PrintDocuments';

import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
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

class MRORegisterdPatients extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: true,
            activeStep: 0,
            registrationdialogView: false,
            admissiondialogView: false,
            clinicdialogView: false,
            printDialogView:false,

            alert: false,
            message: '',
            severity: 'success',
            selectedPatient: null,
            Loaded: this.props.loaded,

            titleName: 'Patient Registration',

            totalItems: 0,
            totalPages: 0,
            formData: this.props.filterData,
            data: [],
            tableRowData: {},
            columns: [
                // {
                //     name: 'action',
                //     label: 'Action',
                //     options: {
                //         filter: true,
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <>


                //                     <Tooltip title="Admit to Ward">
                //                         <IconButton
                //                             className="p-1"
                //                             onClick={() => {
                //                                 console.log('clicked')
                //                                 let selected_data = this.state.data[tableMeta.rowIndex]
                //                                 console.log('clicked', selected_data)
                //                                 this.setState({ selectedPatient: selected_data, admissiondialogView: true })
                //                             }}
                //                             size="small"
                //                             aria-label="view"
                //                         >

                //                             <HotelIcon color="secondary" />
                //                         </IconButton>
                //                     </Tooltip>



                //                     <Tooltip title="Assign to clinic">
                //                         <IconButton
                //                             className="p-1"
                //                             onClick={() => {
                //                                 let selected_data = this.state.data[tableMeta.rowIndex]
                //                                 this.setState({ selectedPatient: selected_data, clinicdialogView: true })
                //                             }}
                //                             size="small"
                //                             aria-label="view"
                //                         >

                //                             <QueuePlayNextIcon style={{ color: '#c11adf' }} />
                //                         </IconButton>
                //                     </Tooltip>





                //                     <Tooltip title="Edit">
                //                         <IconButton
                //                             className="px-2"
                //                             onClick={() => {
                //                                 this.editIconAction(tableMeta)
                //                             }}
                //                             size="small"
                //                             aria-label="view"
                //                         >

                //                             <EditIcon color="primary" />
                //                         </IconButton>
                //                     </Tooltip>


                //                     <Tooltip title="Print Documents">
                //                         <IconButton
                //                             className="px-2"
                //                             onClick={() => {
                //                                 console.log('clicked')
                //                                 let selected_data = this.state.data[tableMeta.rowIndex]
                //                                 console.log('clicked', selected_data)
                //                                 this.setState({ selectedPatient: selected_data, printDialogView: true })
                //                             }}
                //                             size="small"
                //                             aria-label="view"
                //                         >

                //                             <AssignmentIcon style={{ color: '#079f13' }} />
                //                         </IconButton>
                //                     </Tooltip>

                //                 </>
                //             )
                //         },
                //     },
                // },

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
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let passport_no = this.state.data[dataIndex].passport_no ? this.state.data[dataIndex].passport_no : '';
                            let driving_license = this.state.data[dataIndex].driving_license ? this.state.data[dataIndex].driving_license : '';

                            let data = "" + passport_no;
                            data += ", " + driving_license;

                            return <p>{data}</p>

                        },
                    },
                },


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
        this.setState({ Loaded: false })
        let formData = this.state.formData;
        const patientdata = await PatientServices.fetchPatientsByAttribute(formData)

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
        }
    }

    setDataToFields(rowData) {
        this.setState({
            isUpdate: true,
            id: rowData.id,
            formData: {
                name: rowData.name,
                phn: rowData.phn,
                nic: rowData.nic,
                passport_no: rowData.passport_no,
                driving_license: rowData.driving_license,
                mobile_no: rowData.mobile_no,

            }
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

    componentDidMount() {
        console.log("danukkmk: ")
        this.searchPatients()

    }

    onRowClick = (rowData, rowMeta) => {
        console.log("----RowClick");
        console.log("rowData: ", rowData);
        console.log("rowMeta: ", rowMeta);
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
                        id={'allAptitute'}
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
                )
                }

                <Dialog maxWidth="lg " open={this.state.registrationdialogView} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title={this.state.titleName} />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ registrationdialogView: false })
                                // window.location.reload();
                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        {/* <Registration usage="update" data={this.state.tableRowData}></Registration> */}
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
                        {/* <Admission patientDetails={this.state.selectedPatient}></Admission> */}
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
                        {/* <AdmissionClinic patientDetails={this.state.selectedPatient}></AdmissionClinic> */}
                    </div>
                </Dialog>



                <Dialog fullWidth maxWidth="md " open={this.state.printDialogView} /* onClose={() => { this.setState({ admissiondialogView: false }) }} */>

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Patient Document Print" />

                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ printDialogView: false })
                                //window.location.reload();
                            }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>
                    <div className="w-full px-5 ">
                        {/* <PrintDocuments patientDetails={this.state.selectedPatient} tab="patients"></PrintDocuments> */}
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

            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(MRORegisterdPatients)
