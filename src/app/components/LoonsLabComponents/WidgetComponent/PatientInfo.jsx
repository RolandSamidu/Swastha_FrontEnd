import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Switch,
    Typography,
    Divider,
    Tooltip,
    CircularProgress,
    TableCell,
    Table,
    Paper,
    Radio,
    RadioGroup,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TableBody,
    TableRow,
    Chip
} from '@material-ui/core'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DateRangeIcon from '@material-ui/icons/DateRange'

import {
    LoonsTable,
    DatePicker,
    FilePicker,
    ExcelToTable,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsSwitch,
    LoonsCard,
    Button,
    CardTitle,
    SubTitle
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import PatientServices from 'app/services/PatientServices'
import * as Util from '../../../../utils'
import UtilityServices from 'app/services/UtilityServices'

import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import WcIcon from '@material-ui/icons/Wc';
import CropFreeOutlinedIcon from '@material-ui/icons/CropFreeOutlined';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import ImageAspectRatioOutlinedIcon from '@material-ui/icons/ImageAspectRatioOutlined';
import localStorageService from 'app/services/localStorageService'


const styleSheet = (theme) => ({})




class PatientInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {

            patient_id: null,
            itemId: this.props.itemId,
            patient: {},
            is_load: false
            //form data

        }
    }


    async loadData() {
        //console.log("aaaa", window.dashboardVariables.patient_id)
        this.setState({
            is_load: false
        })
        let patientSummary = await localStorageService.getItem('patientSummary')
        let patient = await PatientServices.getPatientById(window.dashboardVariables.patient_id, {})
        if (200 == patient.status) {
            this.setState({
                patient: patient.data.view,
                is_load: true,
                patient_age : await UtilityServices.getAge(Util.dateParse(patient.data.view.date_of_birth))
            })
            patientSummary.patientDetails = this.state.patient
            patientSummary.patientDetails.patient_age = this.state.patient_age
            localStorageService.setItem('patientSummary', patientSummary)
            console.log("aaaa", patient.data.view)
        }


    }

    async submit() {

    }
    componentDidMount() {
        console.log("dashboardVariables", window.dashboardVariables)
        this.loadData()
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme
        let patient_id = this.state.patient_id
        if (patient_id != this.props.patient_id) {
            this.setState({
                patient_id: this.props.patient_id
            })
            this.loadData()
        }
        return (

            <Fragment>
                {this.state.is_load ?
                    <Grid container >
                        {/*  <Titles clinic={''} title={"Patient Info"} date={''} />
 */}

                        <Grid container className='px-2'>

                            <Grid container>
                                <Grid item lg={1} md={1} sm={1} xs={1} className='' >
                                    {/* <SubTitle title={"Name"}></SubTitle> */}
                                    <PermIdentityIcon className='mt-2'></PermIdentityIcon>
                                </Grid>
                                <Grid item lg={11} md={11} sm={11} xs={11} className='mt-2 pl-4' >
                                    {this.state.patient.name}
                                </Grid>
                            </Grid>
                            {/*************************** */}
                            <Grid container>
                                <Grid item lg={1} md={1} sm={1} xs={1} className='' >
                                    <CropFreeOutlinedIcon className='mt-2'></CropFreeOutlinedIcon>
                                </Grid>
                                <Grid item lg={11} md={11} sm={11} xs={11} className='mt-2 pl-4' >
                                    {this.state.patient.phn}
                                </Grid>
                            </Grid>
                            {/*************************** */}
                            <Grid container>
                                <Grid item lg={1} md={1} sm={1} xs={1} className='' >
                                    <WcIcon className='mt-2'></WcIcon>
                                </Grid>
                                <Grid item lg={11} md={11} sm={11} xs={11} className='mt-2 pl-4' >
                                    {this.state.patient.gender}
                                </Grid>

                            </Grid>
                            {/*************************** */}
                           {/*  <Grid container>
                                <Grid item lg={1} md={1} sm={1} xs={1} className='' >
                                    <CalendarTodayOutlinedIcon className='mt-2'></CalendarTodayOutlinedIcon>
                                </Grid>
                                <Grid item lg={11} md={11} sm={11} xs={11} className='mt-2 pl-4' >
                                    {Util.dateParse(this.state.patient.date_of_birth)}
                                </Grid>
                            </Grid> */}
                            {/*************************** */}
                            <Grid container>
                                <Grid item lg={1} md={1} sm={1} xs={1} className='' >
                                    <ImageAspectRatioOutlinedIcon className='mt-2'></ImageAspectRatioOutlinedIcon>
                                </Grid>
                                <Grid item lg={11} md={11} sm={11} xs={11} className='mt-2 pl-4' >
                                    {this.state.patient_age.age_years + " Y " + this.state.patient_age.age_months + " M " + this.state.patient_age.age_days + " D "}
                                </Grid>
                            </Grid>
                            {/*************************** */}
                            <Grid container>

                                <Grid item lg={2} md={2} sm={2} xs={2} className=' show-on-fullScreen' >
                                    <SubTitle title={"Marital Status"}></SubTitle>
                                </Grid>
                                <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                    {this.state.patient.marital_status}
                                </Grid>
                            </Grid>
                        </Grid>



                        <Grid container className='px-2 show-on-fullScreen '>
                            <Grid item lg={2} md={2} sm={2} xs={2} className='show-on-fullScreen' >
                                <SubTitle title={"NIC"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                {this.state.patient.nic}
                            </Grid>
                            {/*************************** */}

                            <Grid item lg={2} md={2} sm={2} xs={2} className='show-on-fullScreen' >
                                <SubTitle title={"Address"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                {this.state.patient.address}
                            </Grid>
                            {/*************************** */}

                            <Grid item lg={2} md={2} sm={2} xs={2} className='show-on-fullScreen' >
                                <SubTitle title={"Contact No"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                {this.state.patient.contact_no + ", " + this.state.patient.contact_no2}
                            </Grid>
                            {/*************************** */}
                            <Grid item lg={2} md={2} sm={2} xs={2} className='show-on-fullScreen' >
                                <SubTitle title={"Mobile No"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                {this.state.patient.mobile_no + ", " + this.state.patient.mobile_no2}
                            </Grid>
                            {/*************************** */}
                            <Grid item lg={2} md={2} sm={2} xs={2} className='show-on-fullScreen' >
                                <SubTitle title={"District"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                {this.state.patient?.District?.name}
                            </Grid>
                            {/*************************** */}
                            <Grid item lg={2} md={2} sm={2} xs={2} className='show-on-fullScreen' >
                                <SubTitle title={"GN"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                {this.state.patient?.GN?.name}
                            </Grid>
                            {/*************************** */}
                            <Grid item lg={2} md={2} sm={2} xs={2} className='show-on-fullScreen' >
                                <SubTitle title={"Moh"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                {this.state.patient?.Moh?.name}
                            </Grid>
                            {/*************************** */}
                            <Grid item lg={2} md={2} sm={2} xs={2} className='show-on-fullScreen' >
                                <SubTitle title={"PHM"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2 show-on-fullScreen' >
                                {this.state.patient?.PHM?.name}
                            </Grid>
                            {/*************************** */}
                        </Grid>



                    </Grid >
                    : null}






            </Fragment >

        )
    }
}

export default withStyles(styleSheet)(PatientInfo)
