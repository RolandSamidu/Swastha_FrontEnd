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

class Pulse extends Component {
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
                    question: "pulse",
                    other_answers: {
                        rate: null,
                        volume: 'normal',
                        rhythm: 'regular',
                        charactor: 'normal',
                        pulseDeficit: 'no',
                        pulsusParadoxus: 'no',
                        pulsusAlternans: 'no',
                        peripheralPulses: 'normal',
                        left: null,
                        right: null,
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
            question: 'pulse',
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
            console.log("Examination Data blood pressure", res.data.view.data)
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
                        {/* Rate */}
                        <Grid className='' item lg={6} md={6} sm={6} xs={12}>
                            {/* <SubTitle title='Rate' /> */}
                            <TextValidator                                
                                placeholder="Rate"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                onChange={(e) => {
                                    let formData = this.state.formData
                                        formData.examination_data[0].other_answers.rate = e.target.value
                                        this.setState(
                                            {
                                                formData 
                                            }
                                        )
                                }}
                                value={
                                    this.state.formData.examination_data[0].other_answers.rate
                                }
                                validators={[
                                    'required',
                                    'maxNumber:' + 250,
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    'please enter a valid number',
                                ]}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <p className='px-2'>| min</p>
                                        </InputAdornment>
                                    )
                                }}
                                                            
                            />  
                        </Grid>

                        {/* volume */}
                        <Grid className='' item lg={6} md={6} sm={6} xs={12}>
                            <SubTitle title='volume' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.volume} row>
                                <FormControlLabel
                                    label={"Normal"}
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.volume = "normal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Low"}
                                    name="low"
                                    value="low"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.volume = "low"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={"High"}
                                    name="high"
                                    value="high"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.volume = "high"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                            </RadioGroup>
                        </Grid>

                        {/* Rhythm */}
                        <Grid className='' item lg={6} md={6} sm={12} xs={12}>
                            <SubTitle title='Rhythm' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.rhythm} row>
                                <FormControlLabel
                                    label={"Regular"}
                                    name="regular"
                                    value="regular"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.rhythm = "regular"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Irregular"}
                                    name="irregular"
                                    value="irregular"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.rhythm = "irregular"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                
                            </RadioGroup>
                        </Grid>

                        {/* Advanced Options */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <Typography className="mt-2 w-full" variant="h6" style={{ fontSize: 16, }}>Advanced Options</Typography>
                        </Grid>
                        
                        {/* Charactor */}
                        <Grid className='' item lg={6} md={6} sm={12} xs={12}>
                            <SubTitle title='Charactor' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.charactor} row>
                                <FormControlLabel
                                    label={"Normal"}
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.charactor = "normal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={"Slowrising"}
                                    name="slowrising"
                                    value="slowrising"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.charactor = "slowrising"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={"Collapsing"}
                                    name="collapsing"
                                    value="collapsing"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.charactor = "collapsing"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={"Slowrising"}
                                    name="slowrising"
                                    value="slowrising"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.charactor = "slowrising"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                
                            </RadioGroup>
                        </Grid>

                        {/* Pulse Deficit */}
                        <Grid className='' item lg={6} md={6} sm={6} xs={12}>
                            <SubTitle title='Pulse Deficit' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.pulseDeficit} row>
                                <FormControlLabel
                                    label={"Yes"}
                                    name="yes"
                                    value="yes"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.pulseDeficit = "yes"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.pulseDeficit = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                            
                                
                            </RadioGroup>
                        </Grid>

                        {/* Pulsus Paradoxus */}
                        <Grid className='' item lg={6} md={6} sm={6} xs={12}>
                            <SubTitle title='Pulsus Paradoxus' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.pulsusParadoxus} row>
                                <FormControlLabel
                                    label={"Yes"}
                                    name="yes"
                                    value="yes"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.pulsusParadoxus = "yes"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.pulsusParadoxus = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />   
                            </RadioGroup>
                        </Grid>

                        {/* Pulsus Alternans */}
                        <Grid className='' item lg={12} md={6} sm={6} xs={12}>
                            <SubTitle title='Pulsus Alternans' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.pulsusAlternans} row>
                                <FormControlLabel
                                    label={"Yes"}
                                    name="yes"
                                    value="yes"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.pulsusAlternans = "yes"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.pulsusAlternans = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />   
                            </RadioGroup>
                        </Grid>

                        {/* Peripheral Pulses */}
                        <Grid className='' item lg={12} md={12} sm={6} xs={12}>
                            <SubTitle title='Peripheral Pulse' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.peripheralPulses} row>
                                <FormControlLabel
                                    label={"Normal"}
                                    name="normal"
                                    value="normal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.peripheralPulses = "normal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={"Abnormal"}
                                    name="abnormal"
                                    value="abnormal"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.peripheralPulses = "abnormal"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />   
                            </RadioGroup>
                        </Grid>
                        
                        { this.state.formData.examination_data[0].other_answers.peripheralPulses === 'abnormal' ?
                            <Grid className='' item lg={6} md={6} sm={6} xs={12}>
                            <SubTitle title='Left' />
                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.all_transfer_mode
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let formData = this.state.formData
                                                            formData.left = value.value
                                                            this.setState(
                                                                {
                                                                    formData
                                                                }
                                                            )
                                                        }
                                                    }}
                                                    // defaultValue={{
                                                    //     label: this.state
                                                    //         .formData
                                                    //         .transportMode,
                                                    // }}
                                                    // value={{
                                                    //     label: this.state
                                                    //         .formData
                                                    //         .transportMode,
                                                    // }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .left
                                                            }
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />
                            </Grid>
                            : null
                        }

                        { this.state.formData.examination_data[0].other_answers.peripheralPulses == 'abnormal' ?
                            <Grid className='' item lg={6} md={6} sm={6} xs={12}>
                            <SubTitle title='Right' />
                            <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        appConst.all_transfer_mode
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let formData = this.state.formData
                                                            formData.right = value.value
                                                            this.setState(
                                                                {
                                                                    formData
                                                                }
                                                            )
                                                        }
                                                    }}
                                                    // defaultValue={{
                                                    //     label: this.state
                                                    //         .formData
                                                    //         .transportMode,
                                                    // }}
                                                    // value={{
                                                    //     label: this.state
                                                    //         .formData
                                                    //         .transportMode,
                                                    // }}
                                                    getOptionLabel={(option) =>
                                                        option.label
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select"
                                                            //variant="outlined"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                            value={
                                                                this.state
                                                                    .formData
                                                                    .right
                                                            }
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                        />
                                                    )}
                                                />
                            </Grid>
                            : null
                        }           
                        
                        

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

export default withStyles(styleSheet)(Pulse)
