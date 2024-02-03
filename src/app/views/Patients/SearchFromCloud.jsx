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
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';


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
import Admission from './Admission';
import AdmissionClinic from './AdmissionClinic';
import PrintDocuments from './PrintDocuments';

import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import EmployeeServices from 'app/services/EmployeeServices';
import DivisionsServices from 'app/services/DivisionsServices'
import { dateParse, timeParse } from 'utils';
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

class SearchFromCloud extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerOpen: true,
            activeStep: 0,
            registrationdialogView: false,
            admissiondialogView: false,
            clinicdialogView: false,
            printDialogView: false,

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
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>

                                    <div className='flex items-center'>
                                        <Tooltip title="Save In Hospital">
                                            <IconButton
                                                className="p-1"
                                                onClick={() => {
                                                    console.log('clicked')
                                                    let selected_data = this.state.data[tableMeta.rowIndex]
                                                    console.log('clicked', selected_data)
                                                    this.registerPatient(selected_data)
                                                }}
                                                size="small"
                                                aria-label="view"
                                            >

                                                <ArrowDownwardIcon color="secondary" />
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
                            let passport_no = this.state.data[dataIndex].passport_no ? this.state.data[dataIndex].passport_no : '';
                            let driving_license = this.state.data[dataIndex].driving_license ? this.state.data[dataIndex].driving_license : '';

                            let data = "" + passport_no;
                            data += ", " + driving_license;

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

                            let data = "" + dateParse(date) + " " + timeParse(date);

                            return <p>{data}</p>

                        },
                    },
                },


            ],
        }
    }




    async loadData() {

    }


    async searchPatientsFromCloud() {
        this.setState({ Loaded: false })
        let formData = this.state.formData;
        const patientdata = await PatientServices.fetchPatientsFromCloudByAttribute(formData)

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
        } else {
            this.setState({
                isPhnFound: false,
                Loaded: true,

            })
        }
    }





    async registerPatient(data) {
        console.log("selected patient", data)
        data.from_mpi = true;
        let res = await PatientServices.createNewPatient(data)
        if (res.status == 201) {
            this.setState({
                alert: true,
                message: 'Patient Registration Successful From Cloud',
                severity: 'success',
                submitting: false
            }, () => {

                const { syncFinish } = this.props;
                // let registerd_patient = this.state.registerd_patient;
                syncFinish &&
                    syncFinish(res.data);

            })



        }else{
            console.log("response error",res)
            this.setState({
                alert: true,
                message: 'patient Registration Unsuccessful',
                severity:'error'
                })
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
                this.searchCloud()
            }
        )
    }

    async searchCloud() {
        let formData = this.state.formData
        let res = await EmployeeServices.userLoginCloud()
        if (res) {
            this.searchPatientsFromCloud(formData)
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Connect to the MPI"
            })
        }
    }

    componentDidMount() {
        this.searchCloud()
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
                        title={"Total:" + this.state.totalItems}
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
                        <Registration usage="update" data={this.state.tableRowData}></Registration>
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

export default withStyles(styleSheet)(SearchFromCloud)
