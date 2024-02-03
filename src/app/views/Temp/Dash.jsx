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
    }

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
                
                {includesArrayElements(this.state.user_roles,['Super Admin', 'ADMIN','Secretary','Minister','MSD AUDITOR','MSD Director', 'MSD DDG', 'MSD AD', 'MSD SCO', 'MSD SCO QA', 'MSD SCO SUPPLY', 'MSD Distribution Officer','Distribution Officer','DGHS','HSCO','Account Supply', 'Chief Accountant','MSD SDA','SPC MA','SPC Accountant','SPC Supervisor', 'SPC MI', 'SPC PO', 'SPC DGM','SPC Procurement Officer','Procurement Officer','SPC Manager','IT ADMIN','MSD MSA','Development Officer' ]) ? (
                    <HigherLavelSmartDashboard type="higherLavelDashboard"></HigherLavelSmartDashboard>
                ):
                includesArrayElements(this.state.user_roles,['Hospital Director']) ? (
                    <HigherLavelSmartDashboard type="hospitalDirector"></HigherLavelSmartDashboard>
                ):
                this.state.user_roles.includes('Counter Pharmacist') ? (
                    <ReportDashboard></ReportDashboard>
                ) :
                 this.state.user_roles.includes('Chief Pharmacist') ? (
                    <CPDashboard></CPDashboard>
                ) : this.state.user_roles.includes('Drug Store Keeper') ? (
                    /*  <DSPDashboard></DSPDashboard> */
                    <div className="p-8 flex justify-center items-center h-full">
                        <img
                            className="w-400"
                            src="/assets/images/swastha_logo.png"
                            alt=""
                        />
                    </div>
                ) : this.state.user_roles.includes('Admin Pharmacist') ? (
                    <APDashboard></APDashboard>
                ) : (
                    <div className="p-8 flex justify-center items-center h-full">
                        <img
                            className="w-400"
                            src="/assets/images/swastha_logo.png"
                            alt=""
                        />
                    </div>
                )}




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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(Dash)
