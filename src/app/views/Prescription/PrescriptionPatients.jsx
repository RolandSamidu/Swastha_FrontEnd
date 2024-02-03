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
    Tooltip,
    //Accordion,
    AccordionDetails,
    AccordionSummary
} from '@material-ui/core'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
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
    LoonsDialogBox
} from 'app/components/LoonsLabComponents'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import * as appConst from '../../../appconst'
import PatientServices from 'app/services/PatientServices'
import DivisionsServices from 'app/services/DivisionsServices'
import localStorageService from 'app/services/localStorageService';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import TransferWithinAStationIcon from '@material-ui/icons/TransferWithinAStation';
import CancelIcon from '@material-ui/icons/Cancel';

import PatientClinicService from '../../services/PatientClinicService';

import * as Util from '../../../utils'
import UtilityServices from 'app/services/UtilityServices';
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

class PrescriptionPatients extends Component {
    constructor(props) {
        super(props)
        this.state = {
            warning_alert: false,

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
                                <Grid className='flex items-center'>
                                    <Tooltip title='Prescription'>
                                        <IconButton
                                            onClick={() => {
                                                let selected_data = this.state.data[tableMeta.rowIndex]
                                                window.dashboardVariables = selected_data;
                                                console.log("dashboard Variables", window.dashboardVariables)

                                                window.location = `/smart_dashboard/?patient_clinic_id=${selected_data.id}&clinic_id=${this.props.filterData.clinic_id}&patient_id=${selected_data.patient_id}`

                                            }}
                                        >
                                            <PersonAddIcon color='secondary' />
                                        </IconButton>
                                    </Tooltip>


                                </Grid>
                            )
                        },
                    },
                },
                /* {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                }, */
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
                /*  {
                     name: 'bht',
                     label: 'BHT',
                     options: {
                         display: true,
                     },
                 }, */
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
                /* {
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
                }, */
                /*  {
                     name: 'Employee',
                     label: 'Consultant',
                     options: {
                         customBodyRender: (value, tableMeta, updateValue) => {
                             if (tableMeta.rowData[tableMeta.columnIndex].name == null) {
                                 return 'N/A'
                             } else {
                                 return tableMeta.rowData[tableMeta.columnIndex].name
                             }
                         }
                     },
                 }, */




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

    async getAge(bday) {
        console.log("patient bday", bday)

        return "ok"
        if (bday != null) {
            // return await UtilityServices.getAgeString(Util.dateParse(bday))
        } else {
            //return ''
        }

    }
    async loadData() {

    }


    async searchPatients() {

        // var user = await localStorageService.getItem('userInfo');
        this.setState({ Loaded: false })
        let formData = this.state.formData;
        //delete formData.clinic_id;
        //formData.type = 'Clinic';
        let store_data = await localStorageService.getItem('Login_user_Clinic');
        if (store_data == null) {
            // window.location.reload()
        }
        //formData.hospital_id = store_data.hospital_id;
        const patientdata = await PatientServices.fetchClinicWardPatientsByAttribute(formData)


        if (200 == patientdata.status) {
            if (0 >= patientdata.data.view.totalItems) {
                this.setState({
                    isPhnFound: false,
                    Loaded: true,

                })
                if (patientdata.data.view.data.length == 0 && formData.phn != '') {
                    this.setState({
                        warning_alert: true
                    })
                }

            } else {
                console.log('Patient Data Admi', patientdata.data.view.data)





                if (patientdata.data.view.data.length == 1) {
                    window.location = `/smart_dashboard/?patient_clinic_id=${patientdata.data.view.data[0].id}&clinic_id=${this.props.filterData.clinic_id}&patient_id=${patientdata.data.view.data[0].patient_id}`
                }

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

    async addPatientToClinic() {
        let owner_id = await localStorageService.getItem('owner_id')

        let logined_hospital_id = await localStorageService.getItem("main_hospital_id")
        let formData = {
            "guardian": {},
            "clinic_id": this.state.formData.clinic_id,
            "hospital_id": logined_hospital_id,
            "phn": this.state.formData.phn,
            "mode": "Direct",
            "type": "Clinic",
            "transport_mod": "By Foot",
            "stat": true,
            "medico_legal": false,
            "admit_date_time": Util.dateParse(new Date())
        }

        let res = await PatientClinicService.createNewPatientClinic(
            formData
        )
        console.log("admittion patient", res)

        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Clinic patient Registration Successful',
                severity: 'success',
                warning_alert:false,
            })
            let data = res.data.posted.data;
            /* let url = appConst.PRINT_URL + owner_id + '/patientAdmission.html?';
            url = url + "institute=" + '';
            url = url + "&patientTitle=" + String(this.state.patientObj.title == null ? "" : this.state.patientObj.title);
            url = url + "&patientName=" + String(this.state.patientObj.name == null ? "" : this.state.patientObj.name);
            url = url + "&age=" + String(await UtilityServices.getAgeString(this.state.patientObj.date_of_birth));
            url = url + "&patientGender=" + String(this.state.patientObj.gender == null ? "" : this.state.patientObj.gender);
            url = url + "&patientMaritalstatus=" + String(this.state.patientObj.marital_status == null ? "" : this.state.patientObj.marital_status);
            url = url + "&patientNIC=" + String(this.state.patientObj.nic == null ? "" : this.state.patientObj.nic);
            url = url + "&patientAddress=" + String(this.state.patientObj.address == null ? "" : this.state.patientObj.address);
            url = url + "&patientID=" + String(this.state.patientObj.phn == null ? "" : this.state.patientObj.phn);

            url = url + "&bht=" + String(data.bht == null ? '' : data.bht);
            url = url + "&nameOfGuardian=" + String(this.state.formData.name == null ? "" : this.state.formData.name);
            url = url + "&addressOfGuardian=" + String(this.state.formData.address == null ? "" : this.state.formData.address);
            url = url + "&telephonOfGuardian=" + String(this.state.formData.telephone == null ? "" : this.state.formData.telephone);
            url = url + "&admissionDate=" + String(Util.dateParse(data.admit_date_time));
            url = url + "&admissionTime=" + String(Util.timeParse(data.admit_date_time));
            url = url + "&wardName=" + String(this.state.formData.admissionWard);
            url = url + "&consultantName=" + String(this.state.all_consultant.filter((ele) => ele.id == data.consultant_id)[0]?.name);
 */
            //let child = window.open(url, '_blank');

            this.searchPatients()

            //window.location.reload()
        } else {
            this.setState({
                alert: true,
                message: res.error ? res.error : 'Clinic patient Registration Unsuccessful',
                warning_alert:false,
                severity: 'error',
            })
        }
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
                            rowsPerPage: 20,
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









                <LoonsDialogBox
                    title="This Patient is Not Registerd in this Clinic"
                    show_alert={true}
                    alert_severity="info"
                    alert_message="Do you want to Register the Patient in to This Clinic?"
                    //message="testing 2"
                    open={this.state.warning_alert}
                    show_button={true}
                    show_second_button={true}
                    btn_label="Ok"
                    onClose={() => {
                        this.addPatientToClinic()
                    }}
                    second_btn_label="Cancel"
                    secondButtonAction={() => {
                        this.setState({ warning_alert: false })
                    }}
                >

                </LoonsDialogBox>




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

export default withStyles(styleSheet)(PrescriptionPatients)
