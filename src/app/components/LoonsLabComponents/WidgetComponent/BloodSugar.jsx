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
    Radio,
    RadioGroup,
    Divider,
    Tooltip,
    CircularProgress,
    TableCell,
    Table,
    TableBody,
    InputAdornment,
    TableRow,
    FormControlLabel,
} from '@material-ui/core'
import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import {
    LoonsTable,
    DatePicker,
    Button,
    FilePicker,
    ExcelToTable,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsSwitch,
    LoonsCard,
    CardTitle,
    SubTitle,
    Charts
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import BloodSugarChart from './BloodSugarChart'
import { dateParse } from 'utils'
import PropTypes from "prop-types";
import ExaminationServices from 'app/services/ExaminationServices'

const styleSheet = (theme) => ({})

const initial_form_data = {
    name: "",
    description: "",
}

const dialogBox_faculty_data = {
    id: "",
    name: "",
    description: "",
}

class BloodSugar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: "Complications is added Successfull",
            severity: 'success',
            data: [],

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "blood_sugar",
                    other_answers: {
                        fbs: null,
                        ppbs: null,
                        rbs: null
                    }
                }

                ]
            },
            columns: [
                {
                    name: 'complication', // field name in the row object
                    label: 'Complication', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },



                {
                    name: 'remark',
                    label: 'Remark',
                    options: {},
                },

            ],
            columnsInMin: [
                {
                    name: 'complication', // field name in the row object
                    label: 'Complication', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customHeadRender: () => null,
                    }
                },
                /* {
                    name: 'remark',
                    label: 'Remark',
                    options: {
                        customHeadRender: ()=>null,
                    },
                }, */

            ],

        }
    }

    static propTypes = {
        onReload: PropTypes.func,
    }
    async loadData() {
        this.setState({
            // loaded: false,
            //data: [],
        })
        let params = {
            patient_id: window.dashboardVariables.patient_id,
            widget_input_id: this.props.itemId,
            question: 'blood_sugar',
            'order[0]': [
                'createdAt', 'DESC'
            ],
            limit: 10
        }


        let res;
        if (this.props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {
            this.setState({ data: [] })
            console.log("Examination Data blood sugar", res.data.view.data)
            let date = [];
            let fbs = [];
            let ppbs = [];
            let rbs = [];

            res.data.view.data.forEach(element => {
                date.push(dateParse(element.createdAt))
                fbs.push(element.other_answers.fbs)
                ppbs.push(element.other_answers.ppbs)
                rbs.push(element.other_answers.rbs)


            });
            this.setState({ data: { date: date, fbs: fbs, ppbs: ppbs, rbs: rbs }, loaded: true })
            console.log("Examination Data blood sugar grap", this.state.data)
        }


    }


    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;

        let res = await ExaminationServices.saveData(formData)
        console.log("Examination Data added", res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Examination Data Added Successful',
                severity: 'success',
            }, () => {
                this.loadData()
                // this.onReload()
            })
        }
    }

    async onReload() {
        const { onReload } = this.props;

        onReload &&
            onReload();
    }

    //set input value changes
    componentDidMount() {
        console.log("item id", this.props.itemId)
        this.loadData()
        //this.interval = setInterval(() =>  this.loadData(), 5000);
    }
    componentWillUnmount() {
        // clearInterval(this.interval);
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme

        return (


            <Fragment>
                {this.state.loaded ?
                    <div className='w-full'>
                        <ValidatorForm onSubmit={() => { this.submit() }} className='w-full'>
                            <Grid container className='w-full'>
                                <Grid item lg={12} md={12} sm={12} xs={12} className='hide-on-fullScreen' >


                                    <TextValidator
                                        className="w-full"

                                        name="fbs"
                                        placeholder="FBS"
                                        InputLabelProps={{ shrink: false }}

                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {

                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.fbs = e.target.value
                                            this.setState({ formData })


                                        }}
                                        value={this.state.formData.examination_data[0].other_answers.fbs}

                                        validators={['maxNumber:500']}
                                        errorMessages={[
                                            'Invalid Count'
                                        ]}

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" >
                                                    {/*  <p className='px-2'>mmol/L</p> */}
                                                    <p className='px-2'>mg/dl</p>
                                                </InputAdornment>
                                            )
                                        }}
                                    />


                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12} className='hide-on-fullScreen' >


                                    <TextValidator
                                        className="w-full"

                                        name="PPBS"
                                        placeholder="PPBS"
                                        InputLabelProps={{ shrink: false }}

                                        type="number"
                                        variant="outlined"
                                        size="small"

                                        onChange={(e) => {

                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.ppbs = e.target.value
                                            this.setState({ formData })


                                        }}
                                        value={this.state.formData.examination_data[0].other_answers.ppbs}

                                        validators={['maxNumber:500']}
                                        errorMessages={[
                                            'Invalid Count'
                                        ]}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" >
                                                    {/*  <p className='px-2'>mmol/L</p> */}
                                                    <p className='px-2'>mg/dl</p>
                                                </InputAdornment>
                                            )
                                        }}
                                    />


                                </Grid>


                                <Grid item lg={12} md={12} sm={12} xs={12} className='hide-on-fullScreen' >


                                    <TextValidator
                                        className="w-full"

                                        name="rbs"
                                        placeholder="RBS"
                                        InputLabelProps={{ shrink: false }}

                                        type="number"
                                        variant="outlined"
                                        size="small"

                                        onChange={(e) => {

                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.rbs = e.target.value
                                            this.setState({ formData })


                                        }}
                                        value={this.state.formData.examination_data[0].other_answers.rbs}

                                        validators={['maxNumber:500']}
                                        errorMessages={[
                                            'Invalid Count'
                                        ]}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" >
                                                    {/*  <p className='px-2'>mmol/L</p> */}
                                                    <p className='px-2'>mg/dl</p>
                                                </InputAdornment>
                                            )
                                        }}
                                    />


                                </Grid>

                                {/*  <Button
                                    className="mt-1 mb-2"
                                    progress={false}
                                    type="submit"
                                    scrollToTop={true}
                                    startIcon="save"



                                >
                                    <span className="capitalize">
                                        Save
                                    </span>
                                </Button> */}

                            </Grid>





                            <Grid container>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <div >
                                        {this.state.loaded ?
                                            <BloodSugarChart
                                                height="280px"
                                                type="line"
                                                className='show-on-fullScreen'
                                                data={this.state.data}>

                                            </BloodSugarChart>
                                            : null}
                                    </div>
                                    <div className="hide-on-fullScreen">

                                    </div>

                                </Grid>
                            </Grid>

                            <Grid className='show-on-fullScreen' item lg={12} md={12} sm={12} xs={12}>

                                {/*  <ValidatorForm
                                className="mt-10 pt-5 px-2 border-radius-4 w-full"
                                onSubmit={() => this.submit()}
                                onError={() => null}
                                style={{ backgroundColor: "#f1f3f4" }}
                            > */}

                                <Grid className='mt-3' container spacing={2} >

                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h6" style={{ fontSize: 16, color: 'black' }}>Add New Blood Sugar</Typography>

                                    </Grid>
                                    {/* Section 1 */}
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <TextValidator
                                            className="w-full"

                                            name="fbs"
                                            placeholder="FBS"
                                            InputLabelProps={{ shrink: false }}

                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {

                                                let formData = this.state.formData;
                                                formData.examination_data[0].other_answers.fbs = e.target.value
                                                this.setState({ formData })


                                            }}
                                            value={this.state.formData.examination_data[0].other_answers.fbs}

                                            validators={['maxNumber:500']}
                                            errorMessages={[
                                                'Invalid Count'
                                            ]}

                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end" >
                                                        {/*  <p className='px-2'>mmol/L</p> */}
                                                        <p className='px-2'>mg/dl</p>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />




                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <TextValidator
                                            className="w-full"

                                            name="ppbs"
                                            placeholder="PPBS"
                                            InputLabelProps={{ shrink: false }}

                                            type="number"
                                            variant="outlined"
                                            size="small"

                                            onChange={(e) => {

                                                let formData = this.state.formData;
                                                formData.examination_data[0].other_answers.ppbs = e.target.value
                                                this.setState({ formData })


                                            }}
                                            value={this.state.formData.examination_data[0].other_answers.ppbs}

                                            validators={['maxNumber:500']}
                                            errorMessages={[
                                                'Invalid Count'
                                            ]}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end" >
                                                        {/*  <p className='px-2'>mmol/L</p> */}
                                                        <p className='px-2'>mg/dl</p>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>

                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <TextValidator
                                            className="w-full"

                                            name="rbs"
                                            placeholder="RBS"
                                            InputLabelProps={{ shrink: false }}

                                            type="number"
                                            variant="outlined"
                                            size="small"

                                            onChange={(e) => {

                                                let formData = this.state.formData;
                                                formData.examination_data[0].other_answers.rbs = e.target.value
                                                this.setState({ formData })


                                            }}
                                            value={this.state.formData.examination_data[0].other_answers.rbs}

                                            validators={['maxNumber:500']}
                                            errorMessages={[
                                                'Invalid Count'
                                            ]}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end" >
                                                        {/*  <p className='px-2'>mmol/L</p> */}
                                                        <p className='px-2'>mg/dl</p>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Button
                                        className="mt-1 mb-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"



                                    >
                                        <span className="capitalize">
                                            Save
                                        </span>
                                    </Button>
                                </Grid>


                                {/* </ValidatorForm> */}
                            </Grid>

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
                        </ValidatorForm>

                    </div>
                    : null}
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(BloodSugar)