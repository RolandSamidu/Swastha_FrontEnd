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
import * as appConst from '../../../../../appconst'

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
    Charts,
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import { dateParse } from 'utils'
import PropTypes from "prop-types";

import ExaminationServices from 'app/services/ExaminationServices'
import { Autocomplete } from '@material-ui/lab'

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

class GlasgowComaScale extends Component {
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
                    question: "glasgowComaScale",
                    other_answers: {
                        eyes: null,
                        voice: null,
                        motor: null,
                        gcs: null,
                    }
                }

                ]
            },

        }
    }

    static propTypes = {
        onReload: PropTypes.func,
    }

    async loadData() {
        this.setState({
            // loaded: false,
            // data: [],
        })
        let params = {
            patient_id: window.dashboardVariables.patient_id,
            widget_input_id: this.props.itemId,
            question: 'glasgowComaScale',
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
            console.log("Examination Data GlasgowComaScale", res.data.view.data)
            this.setState({ data: [] })
            let data = [];
            let other_answers = [];

            res.data.view.data.forEach(element => {
                data.push(element.other_answers)
            });
            this.setState({ data: data, loaded: true })
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
                //this.onReload()
                // this.calculateGCS();
            })
        }
    }

    // calculateGCS() {
    //     let formData = this.state.formData;
    //     formData.examination_data[0].other_answers.gcs = formData.examination_data[0].other_answers.eyes + formData.examination_data[0].other_answers.voice + formData.examination_data[0].other_answers.motor;
    //     this.setState(
    //         {
    //             formData 
    //         }
    //     )
    // }

    async onReload() {
        const { onReload } = this.props;

        onReload &&
            onReload();
    }

    //set input value changes
    componentDidMount() {
        console.log("item id", this.props.itemId)
        this.loadData()
        //this.interval = setInterval(() => this.loadData(), 5000);
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
                <ValidatorForm onSubmit={() => { this.submit() }} className='flex mx-2' >
                    <Grid container spacing={1}>
                        {/* Eyes */}
                        <Grid className='' item lg={4} md={6} sm={6} xs={6}>
                            <SubTitle title='Eyes' />
                            <TextValidator                                
                                placeholder=""
                                //variant="outlined"
                                fullWidth
                                type='number'
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.eyes = e.target.value;
                                        if(formData.examination_data[0].other_answers.motor && formData.examination_data[0].other_answers.voice){
                                            formData.examination_data[0].other_answers.gcs = parseInt(formData.examination_data[0].other_answers.motor,10) + parseInt(formData.examination_data[0].other_answers.voice,10) + parseInt(e.target.value,10);
                                        }
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.eyes
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| 4</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    'required',
                                    'isNumber',
                                    'maxNumber:' + 4,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'Please enter a number',
                                    'Maximum Number is 4'
                                ]}                               
                            />  

                        </Grid>

                        {/* Voice */}
                        <Grid className='' item lg={4} md={6} sm={6} xs={6}>
                            <SubTitle title='Voice' />
                            <TextValidator                                
                                placeholder=""
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type='number'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.voice = e.target.value
                                        if(formData.examination_data[0].other_answers.motor && formData.examination_data[0].other_answers.eyes){
                                            formData.examination_data[0].other_answers.gcs = parseInt(formData.examination_data[0].other_answers.motor,10) + parseInt(formData.examination_data[0].other_answers.eyes,10) + parseInt(e.target.value,10);
                                        }
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.voice
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| 5</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    'required',
                                    'isNumber',
                                    'maxNumber:' + 5,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'Please enter a number',
                                    'Maximum Number is 5'
                                ]}                              
                            />  
                        </Grid>

                        {/* Motor */}
                        <Grid className='' item lg={4} md={6} sm={6} xs={6}>
                            <SubTitle title='Motor' />
                            <TextValidator                                
                                placeholder=""
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type='number'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.motor = e.target.value
                                        if(formData.examination_data[0].other_answers.voice && formData.examination_data[0].other_answers.eyes){
                                            formData.examination_data[0].other_answers.gcs = parseInt(formData.examination_data[0].other_answers.voice,10) + parseInt(formData.examination_data[0].other_answers.eyes,10) + parseInt(e.target.value,10);
                                        }
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.motor
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| 6</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    'required',
                                    'isNumber',
                                    'maxNumber:' + 6,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'Please enter a number',
                                    'Maximum Number is 6'
                                ]}                                
                            />  
                        </Grid>

                        {/* GCS */}
                        <Grid className='' item lg={4} md={6} sm={6} xs={6}>
                            <SubTitle title='GCS' />
                            <TextValidator                                
                                // placeholder="| 6"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                number
                                // onChange={(e) => {
                                //     let formData = this.state.formData
                                //         formData.examination_data[0].other_answers.motor = e.target.value
                                //         this.setState(
                                //             {
                                //                 formData 
                                //             }
                                //         )
                                // }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.gcs
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| 15</p>
                                        </InputAdornment>
                                    )
                                }}
                                // validators={[
                                //     'required',
                                // ]}
                                // errorMessages={[
                                //     'this field is required',
                                // ]}                               
                            /> 
                        </Grid>

                        {/* save */}
                        <Grid className='flex justify-start' item lg={12} md={12} sm={12} xs={12}>
                            <Button
                                className='' progress={false} type="submit" startIcon="save"
                            >
                                <span className="capitalize">
                                    Save
                                </span>
                            </Button>
                        </Grid>
                        
                    </Grid>

                </ValidatorForm>
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

export default withStyles(styleSheet)(GlasgowComaScale)
