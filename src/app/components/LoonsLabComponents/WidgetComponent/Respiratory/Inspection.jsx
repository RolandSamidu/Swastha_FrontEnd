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
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@material-ui/icons/Edit'
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
} from 'app/components/LoonsLabComponents'
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import { dateParse } from 'utils'
import PropTypes from 'prop-types'

import ExaminationServices from 'app/services/ExaminationServices'
import { Autocomplete } from '@material-ui/lab'

const styleSheet = (theme) => ({})

const initial_form_data = {
    name: '',
    description: '',
}

const dialogBox_faculty_data = {
    id: '',
    name: '',
    description: '',
}
const checkbox_data_right = [
    {
        label: 'Upper',
        value: 'upper_r',
    },
    {
        label: 'Middle',
        value: 'middle_r',
    },
    {
        label: 'Lower',
        value: 'lower_r',
    },
]
const checkbox_data_left = [
    {
        label: 'Upper',
        value: 'upper_l',
    },
    {
        label: 'Middle',
        value: 'middle_l',
    },
    {
        label: 'Lower',
        value: 'lower_l',
    },
]

class Inspection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: 'Complications is added Successfull',
            severity: 'success',
            data: [],

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [
                    {
                        widget_input_id: this.props.itemId,
                        question: 'inspection',
                        other_answers: {
                            chest_deformities: 'no',
                            chest_expansion: 'normal',
                            ifRight: false,
                            ifLeft: false,
                            upper_r: false,
                            upper_l: false,
                            middle_r: false,
                            middle_l: false,
                            lower_r: false,
                            lower_l: false,
                            comment: null,
                        },
                    },
                ],
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
            question: 'inspection',
            'order[0]': ['createdAt', 'DESC'],
            limit: 10,
        }

        let res;
        if (this.props.loadFromCloud) {

            res = await ExaminationServices.getDataFromCloud(params)
        } else {

            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {
            console.log('Examination Data Inspection', res.data.view.data)
            this.setState({ data: [] })
            let data = []
            let other_answers = []

            res.data.view.data.forEach((element) => {
                data.push(element.other_answers)
            })
            this.setState({ data: data, loaded: true })
        }
    }

    async submit() {
        console.log('formdata', this.state.formData)
        let formData = this.state.formData

        let res = await ExaminationServices.saveData(formData)
        console.log('Examination Data added', res)
        if (201 == res.status) {
            this.setState(
                {
                    alert: true,
                    message: 'Examination Data Added Successful',
                    severity: 'success',
                },
                () => {
                    this.loadData()
                    //this.onReload()
                }
            )
        }
    }

    async onReload() {
        const { onReload } = this.props

        onReload && onReload()
    }

    //set input value changes
    componentDidMount() {
        console.log('item id', this.props.itemId)
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
                <ValidatorForm
                    onSubmit={() => {
                        this.submit()
                    }}
                    className="flex mx-2 mt-1"
                >
                    <Grid container spacing={2}>
                        {/* Chest Deformities */}
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Chest Deformities" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.chest_deformities
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'Yes'}
                                    name="yes"
                                    value="yes"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.chest_deformities =
                                            'yes'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={'No'}
                                    name="no"
                                    value="no"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.chest_deformities =
                                            'no'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                            </RadioGroup>
                        </Grid>

                        {/* {/ Advanced Options /}
                        <Grid className='' item lg={12} md={12} sm={12} xs={12}>
                            <Typography className="mt-2 w-full" variant="h6" style={{ fontSize: 16, }}>Advanced Options</Typography>
                        </Grid> */}

                        {/* Chest Expansion */}
                        <Grid className="" item lg={12} md={12} sm={6} xs={12}>
                            <SubTitle title="Chest Expansion" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.chest_expansion
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'Normal'}
                                    name="normal"
                                    value="normal"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.chest_expansion =
                                            'normal'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={'Reduced'}
                                    name="reduced"
                                    value="reduced"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.chest_expansion =
                                            'reduced'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                            </RadioGroup>
                        </Grid>
                        {/* checkboxes */}
                        <Grid className="" item lg={12} md={12} sm={6} xs={12}>
                            <FormControlLabel
                                label="Right Side"
                                name="Right"
                                value={false}
                                onChange={() => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.ifRight =
                                        !formData.examination_data[0]
                                            .other_answers.ifRight
                                    this.setState({ formData })
                                }}
                                //defaultValue = 'normal'
                                control={
                                    <Checkbox
                                        color="primary"
                                        // checked={field.displayInSmallView}
                                        size="small"
                                    />
                                }
                                display="inline"
                            />
                        </Grid>

                        {/* right side */}
                        {this.state.formData.examination_data[0].other_answers
                            .ifRight ? (
                            <Grid
                                className=""
                                item
                                lg={12}
                                md={12}
                                sm={6}
                                xs={12}
                            >
                                {/* <SubTitle title='Chest Expansion' /> */}
                                {checkbox_data_right.map((data) => (
                                    <FormControlLabel
                                        // key={i}
                                        label={data.label}
                                        name={data.value}
                                        value={data.value}
                                        onChange={() => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers[
                                                data.value
                                            ] =
                                                !formData.examination_data[0]
                                                    .other_answers[data.value]
                                            this.setState({ formData })
                                        }}
                                        //defaultValue = 'normal'
                                        control={
                                            <Checkbox
                                                color="primary"
                                                // checked={field.displayInSmallView}
                                                size="small"
                                            />
                                        }
                                        display="inline"
                                    />
                                ))}
                            </Grid>
                        ) : null}

                        {/* checkboxes left */}
                        <Grid className="" item lg={12} md={12} sm={6} xs={12}>
                            <FormControlLabel
                                label="Left Side"
                                name="Left"
                                value={false}
                                onChange={() => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.ifLeft =
                                        !formData.examination_data[0]
                                            .other_answers.ifLeft
                                    this.setState({ formData })
                                }}
                                //defaultValue = 'normal'
                                control={
                                    <Checkbox
                                        color="primary"
                                        // checked={field.displayInSmallView}
                                        size="small"
                                    />
                                }
                                display="inline"
                            />
                        </Grid>

                        {/* left side */}
                        {this.state.formData.examination_data[0].other_answers
                            .ifLeft ? (
                            <Grid
                                className=""
                                item
                                lg={12}
                                md={12}
                                sm={6}
                                xs={12}
                            >
                                {checkbox_data_left.map((data) => (
                                    <FormControlLabel
                                        // key={i}
                                        label={data.label}
                                        name={data.value}
                                        value={data.value}
                                        onChange={() => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers[
                                                data.value
                                            ] =
                                                !formData.examination_data[0]
                                                    .other_answers[data.value]
                                            this.setState({ formData })
                                        }}
                                        //defaultValue = 'normal'
                                        control={
                                            <Checkbox
                                                color="primary"
                                                // checked={field.displayInSmallView}
                                                size="small"
                                            />
                                        }
                                        display="inline"
                                    />
                                ))}
                            </Grid>
                        ) : null}

                        {/* </RadioGroup>
                        </Grid> */}
                        <Grid
                            className="flex justify-start"
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <TextValidator
                                placeholder="Commments"
                                //variant="outlined"
                                fullWidth
                                variant="outlined"
                                size="small"
                                type="text"
                                onChange={(e) => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.comment =
                                        e.target.value

                                    this.setState({
                                        formData,
                                    })
                                }}
                                value={
                                    this.state.formData.examination_data[0]
                                        .other_answers.comment
                                }
                            />
                        </Grid>
                        {/* save */}
                        <Grid
                            className="flex justify-start"
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                        >
                            <Button
                                className="mt-1"
                                progress={false}
                                type="submit"
                                startIcon="save"
                            >
                                <span className="capitalize">Save</span>
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

export default withStyles(styleSheet)(Inspection)
