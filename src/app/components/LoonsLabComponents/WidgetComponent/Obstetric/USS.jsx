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

class USS extends Component {
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
                        question: 'uss',
                        other_answers: {
                            hc_weeks: null,
                            hc_dates: null,
                            ac_weeks: null,
                            ac_dates: null,
                            fl_weeks: null,
                            fl_dates: null,
                            crl_weeks: null,
                            crl_dates: null,
                            bpd_weeks: null,
                            bpd_dates: null,
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
            question: 'uss',
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
                        <Grid className="" item lg={6} md={6} sm={6} xs={6}>
                            <SubTitle title="Ultra Sound Scan Date" />
                            <DatePicker className="w-full" placeholder="USS" />
                        </Grid>
                        <Grid container spacing={2}>
                            {/* columns */}
                            <Grid
                                className="center"
                                item
                                lg={2}
                                md={6}
                                sm={6}
                                xs={6}
                            ></Grid>
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <SubTitle title="Weeks" />
                            </Grid>
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <SubTitle title="Date" />
                            </Grid>
                            {/* HC Input */}
                            <Grid
                                className="mt-2 "
                                item
                                lg={2}
                                md={6}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="HC" />
                            </Grid>
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.hc_weeks =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.hc_weeks
                                    }
                                    InputProps={{}}
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
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.hc_dates =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.hc_dates
                                    }
                                    InputProps={{}}
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
                            {/* AC */}
                            <Grid
                                className="mt-2"
                                item
                                lg={2}
                                md={6}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="AC" />
                            </Grid>
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.ac_weeks =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.ac_weeks
                                    }
                                    InputProps={{}}
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
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.ac_dates =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.ac_dates
                                    }
                                    InputProps={{}}
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
                            {/* FL */}
                            <Grid
                                className="mt-2"
                                item
                                lg={2}
                                md={6}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="FL" />
                            </Grid>
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.fl_weeks =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.fl_weeks
                                    }
                                    InputProps={{}}
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
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.fl_dates =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.fl_dates
                                    }
                                    InputProps={{}}
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
                            {/* CRL */}
                            <Grid
                                className="mt-2"
                                item
                                lg={2}
                                md={6}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle title="CRL" />
                            </Grid>
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.crl_weeks =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.crl_weeks
                                    }
                                    InputProps={{}}
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
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.crl_dates =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.crl_dates
                                    }
                                    InputProps={{}}
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
                            {/* BPD */}
                            <Grid
                                className="mt-2 "
                                item
                                lg={2}
                                md={6}
                                sm={6}
                                xs={6}
                            >
                                <SubTitle
                                    styles={{ textAlign: 'center' }}
                                    title="BPD"
                                />
                            </Grid>
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="text"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.bpd_weeks =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.bpd_weeks
                                    }
                                    InputProps={{}}
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
                            <Grid className="" item lg={5} md={6} sm={6} xs={6}>
                                <TextValidator
                                    placeholder=""
                                    //variant="outlined"
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type="number"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.bpd_dates =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.bpd_dates
                                    }
                                    InputProps={{}}
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
                        </Grid>
                        <Grid className="" item lg={6} md={6} sm={6} xs={6}>
                            <Typography
                                className="font-semibold"
                                variant="h6"
                                style={{ fontSize: 14 }}
                            >
                                USS EDD
                            </Typography>
                            <SubTitle title="USS EDD (Expected Date of delivery)" />
                            <DatePicker
                                className="w-full"
                                placeholder="USS EDD"
                            />
                        </Grid>
                        <Grid className="" item lg={6} md={6} sm={6} xs={6}>
                            <Typography
                                className="font-semibold"
                                variant="h6"
                                style={{ fontSize: 14 }}
                            >
                                POA
                            </Typography>
                            <SubTitle title="POA (Period of Amenorrhea)" />
                            <DatePicker className="w-full" placeholder="POA" />
                        </Grid>
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

export default withStyles(styleSheet)(USS)
