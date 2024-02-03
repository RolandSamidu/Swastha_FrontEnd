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
import Titles from './titles';
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
import * as Util from '../../../../../../utils'
import UtilityServices from 'app/services/UtilityServices'
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
        console.log("aaaa", this.props.patient_id)
        let patient = await PatientServices.getPatientById(this.props.patient_id, {})
        if (200 == patient.status) {
            this.setState({
                patient: patient.data.view,
                is_load: true,
                patient_age:await UtilityServices.getAge(Util.dateParse( patient.data.view.date_of_birth))
            })
            console.log("aaaa", patient.data.view)
        }


    }

    async submit() {

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
                <Grid container >
                   {/*  <Titles clinic={''} title={"Patient Info"} date={''} />
 */}
                    {this.state.is_load ?
                        <Grid container >

                            <Grid item lg={6} md={6} sm={6} xs={6} className='' >
                                <SubTitle title={"Name"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2' >
                                {this.state.patient.name}
                            </Grid>
                            {/*************************** */}

                            <Grid item lg={6} md={6} sm={6} xs={6} className='' >
                                <SubTitle title={"Gender"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2' >
                                {this.state.patient.gender}
                            </Grid>
                            {/*************************** */}
                            <Grid item lg={6} md={6} sm={6} xs={6} className='' >
                                <SubTitle title={"Marital Status"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2' >
                                {this.state.patient.marital_status}
                            </Grid>
                            {/*************************** */}
                            <Grid item lg={6} md={6} sm={6} xs={6} className='' >
                                <SubTitle title={"Birthday"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2' >
                                {Util.dateParse(this.state.patient.date_of_birth)}
                            </Grid>
                            {/*************************** */}
                            <Grid item lg={6} md={6} sm={6} xs={6} className='' >
                                <SubTitle title={"Age"}></SubTitle>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={6} className='mt-2' >
                                {this.state.patient_age.age_years+" Y "+this.state.patient_age.age_months+" M "+this.state.patient_age.age_days+" D "}
                            </Grid>
                            {/*************************** */}



                        </Grid>
                        : null}




                </Grid >






            </Fragment >

        )
    }
}

export default withStyles(styleSheet)(PatientInfo)
