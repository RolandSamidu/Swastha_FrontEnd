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

const conditionData = [
    {
        label: 'Acute',
        value: 'acute',
    },
    {
        label: 'Chronic',
        value: 'chronic',
    },
]

const data = [
    {
        label: 'No',
        value: 'no',
    },
    {
        label: 'Present',
        value: 'present',
    },
]

class Haematocele extends Component {
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
                    question: "haematocele",
                    other_answers: {
                        haematocele : 'no',
                        conditionL: null,
                        conditionR: null,
                        translucentL: 'no',
                        translucentR: 'no',
                        tendernessL: 'present',
                        tendernessR: 'present',
                        palpableL: 'no',
                        palpableR: 'no',
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
            question: 'haematocele',
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
            console.log("Examination Data Haematocele", res.data.view.data)
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
                <ValidatorForm onSubmit={() => { this.submit() }} className='flex mx-2 mt-4' >
                    <Grid container spacing={1}>

                        {/* Haematocele */}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title='Haematocele' />
                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.haematocele} row>
                                <FormControlLabel
                                    label={"No"}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.haematocele = "no"
                                        this.setState({ formData })
                                    }}
                                    control={
                                        <Radio size='small' color="primary" />
                                    }
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={"Present"}
                                    name="present"
                                    value="present"
                                    onChange={() => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers.haematocele = "present"
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

                        {/* left and right */}
                        { this.state.formData.examination_data[0].other_answers.haematocele === 'present' ?
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
                                        <Grid className='mt-2' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Condition' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup row>
                                                { conditionData.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.conditionL = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup row>
                                                { conditionData.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.conditionR = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>

                                    {/* 3rd Row */}
                                        <Grid className='mt-2' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Translucent' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.translucentL} row>
                                                { data.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.translucentL = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.translucentR} row>
                                                { data.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.translucentR = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>

                                        {/* 4th Row */}
                                        <Grid className='mt-2' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Tenderness' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tendernessL} row>
                                                { data.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.tendernessL = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.tendernessR} row>
                                                { data.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.tendernessR = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>

                                        {/* 5th Row */}
                                        <Grid className='mt-2' item lg={2} md={2} sm={12} xs={12}>
                                            <SubTitle title='Testis Palpable Separately' />
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.palpableL} row>
                                                { data.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.palpableL = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>
                                        <Grid className='' item lg={5} md={5} sm={12} xs={12}>
                                            <RadioGroup defaultValue={this.state.formData.examination_data[0].other_answers.palpableR} row>
                                                { data.map((data) => 
                                                    <FormControlLabel
                                                        label={data.label}
                                                        name={data.value}
                                                        value={data.value}
                                                        onChange={() => {
                                                            let formData = this.state.formData;
                                                            formData.examination_data[0].other_answers.palpableR = data.value
                                                            this.setState({ formData })
                                                        }}
                                                        control={
                                                            <Radio size='small' color="primary" />
                                                        }
                                                        display="inline"
                                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                                    />
                                                )}
                                            </RadioGroup>
                                        </Grid>
                                </Grid>
                            </Grid>
                        : null
                        }

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

export default withStyles(styleSheet)(Haematocele)
