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
    Checkbox,
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

class Tumour extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: "Complications is added Successful",
            severity: 'success',
            data: [],

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "tumour",
                    other_answers: {
                        tendernessL: 'no',
                        tendernessR: 'no',
                        sizeL1: null,
                        sizeL2: null,
                        sizeR1: null,
                        sizeR2: null,
                        surfaceL: 'smooth',
                        surfaceR: 'smooth',
                        ConsistanceL: 'hard',
                        ConsistanceR: 'hard',
                        HavinessL: 'present',
                        HavinessR: 'present',
                        Lymphade_nopathyL: 'no',
                        Lymphade_nopathyR: 'no',
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
            question: 'tumour',
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
            console.log("Examination Data Tumour", res.data.view.data)
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
                        {/* left and right */}
                            <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                                <Grid container spacing={1}>
                                    {/* 1st Row */}
                                        <Grid className='' item lg={2} md={2} sm={12} xs={12}>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <SubTitle title='Left' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <SubTitle title='Right' />
                                        </Grid>

                                    {/* 2nd Row */}
                                        <Grid className='' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Tenderness' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tendernessL} row> 
                                                    <FormControlLabel
                                                        label='No'
                                                        name='no'
                                                        value='no'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.tendernessL = 'no'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Yes'
                                                        name='yes'
                                                        value='yes'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.tendernessL = 'yes'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tendernessR} row> 
                                                    <FormControlLabel
                                                        label='No'
                                                        name='no'
                                                        value='no'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.tendernessR = 'no'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Yes'
                                                        name='yes'
                                                        value='yes'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.tendernessR = 'yes'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>

                                        {/* 3rd Row */}
                                        <Grid className='' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Size' />
                                        </Grid>
                                        <Grid className='flex' item lg={5} md={5} sm={12} xs={12}>
                                            <TextValidator                                
                                                placeholder=""
                                                //variant="outlined"
                                                // fullWidth
                                                variant="outlined"
                                                size="small"
                                                type = 'number'
                                                onChange={(e) => {
                                                    let formData = this.state.formData
                                                        formData.examination_data[0].other_answers.sizeL1 = e.target.value
                                                        this.setState(
                                                            {
                                                                formData 
                                                            }
                                                        )
                                                }}
                                                value={
                                                    this.state.formData.examination_data[0].other_answers.sizeL1
                                                }
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end" >
                                                            <p className='px-2'>| cm *</p>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                validators={[
                                                    'required',
                                                    // 'maxNumber:' + 300,
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                    // 'please enter a valid weight',
                                                ]}                              
                                            />
                                            <TextValidator                                
                                                placeholder=""
                                                //variant="outlined"
                                                // fullWidth
                                                variant="outlined"
                                                size="small"
                                                type = 'number'
                                                onChange={(e) => {
                                                    let formData = this.state.formData
                                                        formData.examination_data[0].other_answers.sizeL2 = e.target.value
                                                        this.setState(
                                                            {
                                                                formData 
                                                            }
                                                        )
                                                }}
                                                value={
                                                    this.state.formData.examination_data[0].other_answers.sizeL2
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
                                                    // 'maxNumber:' + 300,
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                    // 'please enter a valid weight',
                                                ]}                              
                                            />
                                        </Grid>
                                        <Grid className='flex' item lg={5} md={5} sm={12} xs={12}>
                                            <TextValidator                                
                                                placeholder=""
                                                //variant="outlined"
                                                // fullWidth
                                                variant="outlined"
                                                size="small"
                                                type = 'number'
                                                onChange={(e) => {
                                                    let formData = this.state.formData
                                                        formData.examination_data[0].other_answers.sizeR1 = e.target.value
                                                        this.setState(
                                                            {
                                                                formData 
                                                            }
                                                        )
                                                }}
                                                value={
                                                    this.state.formData.examination_data[0].other_answers.sizeR1
                                                }
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end" >
                                                            <p className='px-2'>| cm *</p>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                validators={[
                                                    'required',
                                                    // 'maxNumber:' + 300,
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                    // 'please enter a valid weight',
                                                ]}                              
                                            />
                                            <TextValidator                                
                                                placeholder=""
                                                //variant="outlined"
                                                // fullWidth
                                                variant="outlined"
                                                size="small"
                                                type = 'number'
                                                onChange={(e) => {
                                                    let formData = this.state.formData
                                                        formData.examination_data[0].other_answers.sizeR2 = e.target.value
                                                        this.setState(
                                                            {
                                                                formData 
                                                            }
                                                        )
                                                }}
                                                value={
                                                    this.state.formData.examination_data[0].other_answers.sizeR2
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
                                                    // 'maxNumber:' + 300,
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                    // 'please enter a valid weight',
                                                ]}                              
                                            />
                                        </Grid>

                                        {/* 4th Row */}
                                        <Grid className='' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Surface' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.surfaceL} row> 
                                                    <FormControlLabel
                                                        label='Smooth'
                                                        name='smooth'
                                                        value='smooth'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.surfaceL = 'smooth'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Irregular'
                                                        name='irregular'
                                                        value='irregular'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.surfaceL = 'irregular'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Nodular'
                                                        name='nodular'
                                                        value='nodular'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.surfaceL = 'nodular'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.surfaceR} row> 
                                                    <FormControlLabel
                                                        label='Smooth'
                                                        name='smooth'
                                                        value='smooth'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.surfaceR = 'smooth'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Irregular'
                                                        name='irregular'
                                                        value='irregular'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.surfaceR = 'irregular'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Nodular'
                                                        name='nodular'
                                                        value='nodular'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.surfaceL = 'nodular'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>

                                        {/* 5th Row */}
                                        <Grid className='' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Consistance' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.ConsistanceL} row> 
                                                    <FormControlLabel
                                                        label='Hard'
                                                        name='hard'
                                                        value='hard'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.ConsistanceL = 'hard'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Soft'
                                                        name='soft'
                                                        value='soft'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.ConsistanceL = 'soft'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Firm'
                                                        name='firm'
                                                        value='firm'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.ConsistanceL = 'firm'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.ConsistanceR} row> 
                                                    <FormControlLabel
                                                        label='Hard'
                                                        name='hard'
                                                        value='hard'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.ConsistanceR = 'hard'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Soft'
                                                        name='soft'
                                                        value='soft'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.ConsistanceR = 'soft'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Firm'
                                                        name='firm'
                                                        value='firm'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.ConsistanceR = 'firm'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>

                                        {/* 6th Row */}
                                        <Grid className='' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Haviness' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.HavinessL} row> 
                                                    <FormControlLabel
                                                        label='Present'
                                                        name='present'
                                                        value='present'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.HavinessL = 'present'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='No'
                                                        name='no'
                                                        value='no'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.HavinessL = 'no'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.HavinessR} row> 
                                                    <FormControlLabel
                                                        label='Present'
                                                        name='present'
                                                        value='present'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.HavinessR = 'present'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='No'
                                                        name='no'
                                                        value='no'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.HavinessR = 'no'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>

                                        {/* 7th Row */}
                                        <Grid className='' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Lymphade_nopathy' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.Lymphade_nopathyL} row> 
                                                    <FormControlLabel
                                                        label='No'
                                                        name='no'
                                                        value='no'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.Lymphade_nopathyL = 'no'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Yes'
                                                        name='yes'
                                                        value='yes'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.Lymphade_nopathyL = 'yes'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.Lymphade_nopathyR} row> 
                                                    <FormControlLabel
                                                        label='No'
                                                        name='no'
                                                        value='no'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.Lymphade_nopathyR = 'no'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                    <FormControlLabel
                                                        label='Yes'
                                                        name='yes'
                                                        value='yes'
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.Lymphade_nopathyR = 'yes'
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                            </RadioGroup>
                                        </Grid>
                                </Grid>
                            </Grid>

                        {/* Save */}
                        <Grid className='flex justify-start' item lg={12} md={12} sm={12} xs={12}>
                            <Button
                                progress={false} type="submit" startIcon="save"
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

export default withStyles(styleSheet)(Tumour)
