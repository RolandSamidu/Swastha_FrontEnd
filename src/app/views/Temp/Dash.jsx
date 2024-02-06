import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Card,
    Icon,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    Checkbox,
    Typography,
    TextField,
    Fab,
    Dialog,
    IconButton,

} from '@material-ui/core'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Alert, AlertTitle } from '@material-ui/lab';
import 'date-fns'
import { Resizable } from 'react-resizable'
import { ResizableBox } from 'react-resizable'
import Test from './Test'
import Diagnosis from './Diagnosis'
import {
    LoonsTable,
    DatePicker,
    FilePicker,
    Button,
    ExcelToTable,
    Widget,
    WidgetComponent,
    LoonsDialogBox,
    LoonsSnackbar,
    CardTitle,
    SubTitle
} from 'app/components/LoonsLabComponents'
import List from './List'
import SampleForm from './SampleForm'
import HelthStatus from './HelthStatus'
import ReportDashboard from '../dashboard/ReportDashboard'
import CPDashboard from '../dashboard/CPDashboard'
import DSPDashboard from '../dashboard/DSPDashboard'
import localStorageService from 'app/services/localStorageService'
import APDashboard from '../dashboard/APDashboard'
import CloseIcon from '@material-ui/icons/Close';
import Notice from './Notice'

//temparaly added
import EstimationService from 'app/services/EstimationService'
import DashboardServices from 'app/services/DashboardServices'
import PharmacyService from 'app/services/PharmacyService'
import HigherLavelSmartDashboard from '../dashboard/UserDashboards/HigherLavelSmartDashboard'

import { includesArrayElements } from 'utils'
import { he } from 'date-fns/locale'
import Widgets1 from './widgets/Widgets1'
import Widgets2 from './widgets/Wedgets2'
import WidgetsCounts from './widgets/WidgetsCounts/WidgetsCounts'
import WidgetsDivider from './widgets/WidgetsDivider/WidgetsDivider'
import Widgets2Count from './widgets/WidgetsCounts/Widgets2Count'
import Calendar from '../../components/calendar/Calendar'
import ApexChart from '../../components/ApexChart/ApexChart'
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';

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

    container: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        padding: "10px",
        backgroundColor: "#F5F5F5",
        gap: "10px",
    },
    leftContainer: {
        background: 'linear-gradient(241.25deg, rgba(254, 222, 255, 0.225) 4.4%, rgba(255, 231, 251, 0.325) 61.77%, rgba(254, 243, 255, 0.27) 119.94%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',

        display: "flex",
        flexDirection: "column",
        width: "33.333%",
        border: "2px solid rgba(255, 255, 255, 1)",
        borderRadius: "20px",
        padding: "20px 15px",
        gap: "20px",
    },

    topHead: {
        display: "flex",

        width: "100%",
        justifyContent: "space-between",

    },

    title: {
        fontFamily: 'Inter',
        fontSize: '20px',
        fontWeight: 600,
        lineHeight: '24px',
        letterSpacing: '0em',
        textAlign: 'left',
    },

    TopButton: {
        width: '90px',
        height: '38px',
        borderRadius: '10px',
        backgroundColor: '#FFD6F6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: "#ffffff",
        fontFamily: 'Inter',
        letterSpacing: '0em',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '14px',
        background: 'linear-gradient(136.67deg, #FF409A 8.34%, #C438EF 95.26%)',

    },
    listView: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    list: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 10px",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: "10px",
    },
    listName: {
        fontFamily: 'Inter',
        fontSize: '15px',
        fontWeight: 600,
        lineHeight: '18.15px',
        letterSpacing: '0em',
        textAlign: 'left',
        color: "rgba(61, 61, 61, 1)"
    },
    listTest: {
        fontFamily: 'Inter',
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: '18.15px',
        letterSpacing: '0em',
        color: "rgba(61, 61, 61, 1)"
    },
    listTime: {
        fontFamily: 'Inter',
        fontSize: '15px',
        fontWeight: 400,
        lineHeight: '18.15px',
        letterSpacing: '0em',
        color: "rgba(173, 0, 255, 1)"
    },
    rightContainer: {
        flex: 3,
        display: "flex",
        flexDirection: "column",
        width: "66.666%",
        gap: "10px",
    },
    rightContainerTop: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        gap: "10px",
    },
    rightContainerTopLeft: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",

    },

    rightContainerTopRight: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
    },
    graph: {
        backgroundColor: "rgba(255, 255, 255, 1)",
        borderRadius: "20px",
        padding: "5px",
        boxShadow: "0px 0px 50px 10px rgba(0, 0, 0, 0.05)",
        width: "400px",
    },
    rightContainerBottom: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

})

class Dash extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 250,
            height: 200,
            user_roles: [],
            owner_id: null,

            error_dialog_visible: false,
            error_message: "",
            submit_code_visibility: true,

            formData: { store_id: null },

            alert: false,
            message: '',
            severity: 'success',
        }
    }

    // On top layout
    onResize = (event, { element, size, handle }) => {
        this.setState({ width: size.width, height: size.height })
    }





    async componentDidMount() {
        console.log('size', window.innerHeight)
        window.screen_id = "dashboard"
        /* 
                console.log(window.location.pathname); 
                console.log(window.location.origin); */
        let user_roles = await localStorageService.getItem('userInfo').roles
        let owner_id = await localStorageService.getItem('owner_id')

        this.setState({ user_roles, owner_id })

        if (user_roles.includes('Drug Store Keeper') ||
            user_roles.includes('Medical Laboratory Technologist') ||
            user_roles.includes('Radiographer') ||
            user_roles.includes('Drug Store Officer') ||
            user_roles.includes('RMSD ADMIN') ||
            user_roles.includes('Hospital Admin') ||
            user_roles.includes('RMSD OIC') ||
            user_roles.includes('RMSD MSA') ||
            user_roles.includes('RMSD Pharmacist') ||
            user_roles.includes('RMSD Distribution Officer') ||
            user_roles.includes('Sales User') ||
            user_roles.includes('Sales Officer')) {
            //this.checkEstimations()
        }

    }


    async checkEstimations() {

        let params = { owner_id: this.state.owner_id }

        let res = await EstimationService.getEstimations(params);
        console.log("estimation res", res)
        if (res.status == 200) {
            console.log("estimation res data", res.data.view)
            if (res.data.view.data?.length == 0) {
                this.setState({
                    error_dialog_visible: true,
                    error_message: "Your estimation cannot be found. Please enter the institution code from MSMIS with four digits.",
                    submit_code_visibility: true,
                })
            } else {
                this.setState({
                    error_dialog_visible: false
                })
            }
        }
    }


    async getDrugStoreDetails() {

        let params = { issuance_type: 'drug_store', store_id: this.state.formData.store_id }
        let res = await DashboardServices.getAllHospitals(params);
        if (res.status == 200) {
            console.log("all_drug_store", res.data.view.data)
            if (res.data.view.data?.length == 0) {
                this.setState({
                    error_dialog_visible: true,
                    error_message: "The warehouse code you entered cannot be found. Please contact the system support (071 655 7823).",
                    submit_code_visibility: false,
                })
            } else if (res.data.view.data?.length > 1) {
                this.setState({
                    error_dialog_visible: true,
                    error_message: "This warehouse code is already taken. Please contact the system support (071 655 7823).",
                    submit_code_visibility: false,
                })
            } else if (res.data.view.data?.length == 1 & res.data.view.data[0].owner_id != "NA0000") {
                this.setState({
                    error_dialog_visible: true,
                    error_message: "This warehouse code is already taken. Please contact the system support (071 655 7823).",
                    submit_code_visibility: false,
                })
            } else if (res.data.view.data?.length == 1 & res.data.view.data[0].owner_id == "NA0000") {

                let owner_id = await localStorageService.getItem("owner_id")
                let formData = {
                    new_owner_id: owner_id,
                    levels: []

                }
                let res_update = await PharmacyService.updateWard(res.data.view.data[0]?.owner_id, res.data.view.data[0]?.id, formData);
                if (res_update.status) {
                    this.setState({
                        alert: true,
                        message: 'update Successfuly',
                        severity: 'success',
                    }, () => {
                        // this.loadData()
                        window.location.reload()

                    })
                } else {
                    this.setState({ alert: true, message: "Update Unsuccessful", severity: 'error' })
                }


                //need to call patch API

            }
        }
    }



    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>

                {includesArrayElements(this.state.user_roles, ['Super Admin', 'ADMIN', 'Secretary', 'Minister', 'MSD AUDITOR', 'MSD Director', 'MSD DDG', 'MSD AD', 'MSD SCO', 'MSD SCO QA', 'MSD SCO SUPPLY', 'MSD Distribution Officer', 'Distribution Officer', 'DGHS', 'HSCO', 'Account Supply', 'Chief Accountant', 'MSD SDA', 'SPC MA', 'SPC Accountant', 'SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM', 'SPC Procurement Officer', 'Procurement Officer', 'SPC Manager', 'IT ADMIN', 'MSD MSA', 'Development Officer']) ? (
                    <HigherLavelSmartDashboard type="higherLavelDashboard"></HigherLavelSmartDashboard>
                ) :
                    includesArrayElements(this.state.user_roles, ['Hospital Director']) ? (
                        <HigherLavelSmartDashboard type="hospitalDirector"></HigherLavelSmartDashboard>
                    ) :
                        this.state.user_roles.includes('Counter Pharmacist') ? (
                            <ReportDashboard></ReportDashboard>
                        ) :
                            this.state.user_roles.includes('Chief Pharmacist') ? (
                                <CPDashboard></CPDashboard>
                            ) : this.state.user_roles.includes('Drug Store Keeper') ? (
                                /*  <DSPDashboard></DSPDashboard> */
                                <div className="p-8 flex justify-center items-center h-full">
                                    {/* <img
                            className="w-400"
                            src="/assets/images/swastha_logo.png"
                            alt=""
                        /> */}
                                </div>
                            ) : this.state.user_roles.includes('Admin Pharmacist') ? (
                                <APDashboard></APDashboard>
                            ) : (
                                <div className={classes.container}>
                                    <div className={classes.leftContainer}>
                                        <div className={classes.topHead}>
                                            <div className={classes.title}>
                                                Today’s Patient Queue
                                            </div>
                                            <div className={classes.TopButton}>
                                                Walk In
                                            </div>
                                        </div>
                                        <div className={classes.searchContainer}>
                                            <Paper
                                                component="form"
                                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', boxShadow: "none", roundes: "10px", border: "1px solid rgba(0, 0, 0, 0.05)", backgroundColor: "rgba(255, 255, 255, 1)" }}
                                            >
                                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                                    <SearchIcon />
                                                </IconButton>
                                                <InputBase
                                                    sx={{ ml: 1, flex: 1, fontSize: "14px" }}
                                                    placeholder="Search by..."
                                                    inputProps={{ 'aria-label': 'Search by...' }}
                                                />

                                            </Paper>
                                        </div>
                                        <div className={classes.listView}>
                                            <div className={classes.list}>
                                                <div className={classes.textContainer}>
                                                    <div className={classes.listName}>
                                                        Michael Johnson
                                                    </div>
                                                    <div className={classes.listTest}>
                                                        Blood Test
                                                    </div>
                                                </div>
                                                <div className={classes.listTime}>
                                                    10:30
                                                </div>
                                            </div>
                                            <div className={classes.list}>
                                                <div className={classes.textContainer}>
                                                    <div className={classes.listName}>
                                                        Michael Johnson
                                                    </div>
                                                    <div className={classes.listTest}>
                                                        Blood Test
                                                    </div>
                                                </div>
                                                <div className={classes.listTime}>
                                                    10:30
                                                </div>
                                            </div>
                                            <div className={classes.list}>
                                                <div className={classes.textContainer}>
                                                    <div className={classes.listName}>
                                                        Michael Johnson
                                                    </div>
                                                    <div className={classes.listTest}>
                                                        Blood Test
                                                    </div>
                                                </div>
                                                <div className={classes.listTime}>
                                                    10:30
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.rightContainer}>
                                        <div className={classes.rightContainerTop}>
                                            <div className={classes.rightContainerTopLeft}>
                                                <Widgets1 title={"Today’s Patient"} background={"rgba(213, 115, 191, 1)"} >

                                                    <WidgetsCounts countFontSize="32px" count={10} name={"Appointments"} />
                                                    <WidgetsDivider />

                                                    <WidgetsCounts countFontSize="32px" count={5} name={"Follow-up"} />
                                                    <WidgetsDivider />

                                                    <WidgetsCounts countFontSize="32px" count={5} name={"Walk-In"} />
                                                    <WidgetsDivider />

                                                    <WidgetsCounts countFontSize="32px" count={20} name={"Total"} />

                                                </Widgets1>

                                                <Widgets1 title={"This Month’s Patients"} background={"rgba(0, 173, 209, 1)"} >
                                                    <WidgetsCounts countFontSize="32px" count={50} name={"Appointments"} />
                                                    <WidgetsDivider />
                                                    <WidgetsCounts countFontSize="32px" count={20} name={"Follow-up"} />
                                                    <WidgetsDivider />
                                                    <WidgetsCounts countFontSize="32px" count={10} name={"Walk-In"} />
                                                    <WidgetsDivider />
                                                    <WidgetsCounts countFontSize="32px" count={80} name={"Total"} />
                                                </Widgets1>
                                                <Widgets1 title={"Income"} background={"rgba(255, 135, 73, 1)"} >
                                                    <WidgetsCounts countFontSize="20px" count={"Rs 1500"} name={"Today"} />
                                                    <WidgetsDivider />
                                                    <WidgetsCounts countFontSize="20px" count={"Rs 8000"} name={"Past week"} />
                                                    <WidgetsDivider />
                                                    <WidgetsCounts countFontSize="20px" count={"Rs 15 000"} name={"Past month"} />
                                                </Widgets1>
                                                <Widgets1 title={"My Clinics"} background={"rgba(93, 190, 124, 1)"} >
                                                    <WidgetsCounts countFontSize="20px" count={"5"} name={"Today’s Clinics"} />
                                                    <WidgetsDivider />

                                                    <WidgetsCounts countFontSize="20px" count={"20"} name={"Next Appointment"} />
                                                    <WidgetsDivider />

                                                    <WidgetsCounts countFontSize="20px" count={"2 hr"} name={"Next clinic start in"} />
                                                </Widgets1>
                                            </div>
                                            <div className={classes.rightContainerTopRight}>
                                                <div className={classes.graph}>
                                                    <ApexChart />
                                                </div>
                                                <Widgets2 title={"In Queue"} background={"rgba(69, 193, 193, 1)"} timeAgo={"5 min ago"} height={"90px"} >
                                                    <Widgets2Count count={15} name={"Patients"} />
                                                </Widgets2>
                                                <Widgets2 title={"Patients"} background={"rgba(161, 107, 187, 1)"} timeAgo={"This month"}  >
                                                    <div className="" style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                    }}>
                                                        <div style={{
                                                            paddingLeft: "20px",
                                                        }}>
                                                            <Widgets2Count count={150} name={"New Patients"} />
                                                            <Widgets2Count count={200} name={"Old Patients"} />
                                                        </div>
                                                        <div style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "end",
                                                            textAlign: "center",
                                                            alignItems: "center",
                                                            fontWeight: 700,
                                                            fontSize: "10px",
                                                            color: "rgba(255, 255, 255, 1)",
                                                            lineHeight: "12.1px",
                                                            paddingBottom: "10px",
                                                        }}>
                                                            -2%
                                                            <p>on this week</p>
                                                        </div>
                                                    </div>
                                                </Widgets2>
                                            </div>
                                        </div>
                                        <div className={classes.rightContainerBottom}>
                                            <Calendar />
                                        </div>
                                    </div>
                                </div>
                            )
                }




                <Dialog fullWidth maxWidth="sm" open={this.state.error_dialog_visible} >


                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Error" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    error_dialog_visible: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>


                    <div className="w-full h-full p-5">
                        <Alert severity='info' className='mt-1'>

                            <Typography className='mt-2'>
                                {this.state.error_message}
                            </Typography>
                        </Alert>

                        {this.state.submit_code_visibility &&
                            <ValidatorForm onSubmit={() => this.getDrugStoreDetails()} onError={() => null}>

                                <Grid
                                    className=" w-full"
                                    item
                                >
                                    <SubTitle title="Code" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Code"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                        value={this.state.formData.store_id}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            formData.store_id = e.target.value
                                            this.setState({ formData })
                                            console.log(
                                                'form dat',
                                                this.state.formData
                                            )
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>


                                <Grid
                                    className=" w-full mt-3"
                                    item
                                >
                                    <Button type="submit">
                                        Check
                                    </Button>
                                </Grid>


                            </ValidatorForm>
                        }


                    </div>
                </Dialog>



                <Notice></Notice>

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

export default withStyles(styleSheet)(Dash)
