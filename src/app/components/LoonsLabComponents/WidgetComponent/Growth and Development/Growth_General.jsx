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
import * as Util from '../../../../../utils'

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
import PatientServices from 'app/services/PatientServices'
import UtilityServices from 'app/services/UtilityServices'

const styleSheet = (theme) => ({})

class Growth_General extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: "Complications is added Successfull",
            severity: 'success',
            data: [],
            patient_age: null,

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "growth_General",
                    other_answers: {
                        height: null,
                        weight: null,
                        bmi: null,
                        ofc: null,
                        patient_age: null,
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
            question: 'growth_General',
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
            console.log("Examination Data Growth_General", res.data.view.data)
            this.setState({ data: [] })
            let data = [];
            let other_answers = [];

            res.data.view.data.forEach(element => {
                data.push(element.other_answers)
            });
            this.setState({ data: data, loaded: true })
        }
        let patient = await PatientServices.getPatientById(window.dashboardVariables.patient_id, {})
        if (200 == patient.status) {
            this.setState({
                patient_age : await UtilityServices.getAgeStringYearAndMonth(Util.dateParse(patient.data.view.date_of_birth))
            })
        }


    }


    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;
        formData.examination_data[0].other_answers.patient_age = this.state.patient_age

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
                        {/* Height */}
                        <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Height' /> */}
                            <TextValidator                                
                                placeholder="Height"
                                //variant="outlined"
                                fullWidth
                                // type = 'number'
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.height= e.target.value;
                                        if(formData.examination_data[0].other_answers.weight){
                                            formData.examination_data[0].other_answers.bmi= (parseFloat(formData.examination_data[0].other_answers.weight)) / ((parseFloat(e.target.value)/100) * (parseFloat(e.target.value)/100)) ;
                                        }
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.height
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| cm</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    'required',
                                    'maxNumber:' + 300,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'please enter a valid height',
                                ]}                               
                            />  

                        </Grid>

                        {/* Weight */}
                        <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Weight' /> */}
                            <TextValidator                                
                                placeholder="Weight"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type = 'number'
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.weight = e.target.value
                                        if(formData.examination_data[0].other_answers.height){
                                            let tempBMI = (parseFloat(e.target.value)) / ((parseFloat(formData.examination_data[0].other_answers.height)/100) * (parseFloat(formData.examination_data[0].other_answers.height)/100));
                                            formData.examination_data[0].other_answers.bmi = Math.round((tempBMI*100)/100)
                                        }
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.weight
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| kg</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    'required',
                                    'maxNumber:' + 300,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'please enter a valid weight',
                                ]}                              
                            />  
                        </Grid>

                        {/* BMI */}
                        <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='Growth_General' /> */}
                            <TextValidator 
                                fullWidth
                                placeholder='BMI'
                                variant="outlined"
                                size="small"
                                value={
                                    parseFloat(this.state.formData.examination_data[0].other_answers.bmi)
                                }
                                                               
                            /> 
                        </Grid>

                        {/* OFC (Occipitofrontal Circumference) */}
                        <Grid className='' item lg={6} md={6} sm={6} xs={6}>
                            {/* <SubTitle title='OFC (Occipitofrontal Circumference)' /> */}
                            <TextValidator                                
                                placeholder="OFC (Occipitofrontal Circumference)"
                                //variant="outlined"
                                fullWidth
                                type = 'number'
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.ofc= e.target.value;
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.ofc
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| cm</p>
                                        </InputAdornment>
                                    )
                                }}
                                validators={[
                                    'required',
                                    'maxNumber:' + 300,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'please enter a valid height',
                                ]}                               
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

export default withStyles(styleSheet)(Growth_General)
