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
import { calculatePOA, dateParse, generateEED } from 'utils'
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

class LMP extends Component {
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
                        question: 'lmp',
                        other_answers: {
                            date: 'certain',
                            cycles: 'regular',
                            lmp: null,
                            edd: null,
                            poa: null,
                            poa_weeks: null,
                            poa_dates: null,
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
            question: 'lmp',
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
                            <Typography
                                className="font-semibold"
                                variant="h6"
                                style={{ fontSize: 14 }}
                            >
                                LMP
                            </Typography>
                            <SubTitle title="LMP (Last Menstrual period)" />
                            <DatePicker
                                className="w-full"
                                placeholder="LMP"
                                maxDate={new Date()}
                                value={
                                    this.state.formData.examination_data[0]
                                        .other_answers.lmp
                                }
                                //format={"yyyy"}
                                //required={true}
                                errorMessages="this field is required"
                                onChange={(date) => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.lmp =
                                        dateParse(date)
                                    let edd = generateEED(date)
                                    let poa = calculatePOA(date)
                                    formData.examination_data[0].other_answers.edd =
                                        edd
                                    formData.examination_data[0].other_answers.poa =
                                        poa
                                    console.log('EDD', edd)
                                    console.log('POA ', poa)
                                    this.setState({ formData })
                                }}
                            />
                        </Grid>
                        <Grid className="" item lg={6} md={6} sm={6} xs={6}>
                            <Typography
                                className="font-semibold"
                                variant="h6"
                                style={{ fontSize: 14 }}
                            >
                                EDD
                            </Typography>
                            <SubTitle title="EDD (Expected Date of delivery)" />
                            <DatePicker
                                className="w-full"
                                placeholder="EDD"
                                value={
                                    this.state.formData.examination_data[0]
                                        .other_answers.edd
                                }
                            />
                        </Grid>
                        <Grid className="" item lg={6} md={12} sm={12} xs={12}>
                            <SubTitle title="Date" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.date
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'Certain'}
                                    name="certain"
                                    value="certain"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.date =
                                            'certain'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={'Uncertain'}
                                    name="uncertain"
                                    value="uncertain"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.date =
                                            'uncertain'
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
                        <Grid className="" item lg={6} md={12} sm={12} xs={12}>
                            <SubTitle title="Cycles" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.cycles
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'Regular'}
                                    name="regular"
                                    value="regular"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.cycles =
                                            'regular'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={'Irregular'}
                                    name="irregular"
                                    value="irregular"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.cycles =
                                            'irregular'
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

                        <Grid
                            className={{ display: 'flex' }}
                            item
                            lg={12}
                            md={6}
                            sm={6}
                            xs={6}
                        >
                            <Typography
                                className="font-semibold"
                                variant="h6"
                                style={{ fontSize: 14 }}
                            >
                                POA
                            </Typography>
                            <SubTitle title="POA (Period of Amenorrhea)" />
                            <Grid className="" item lg={6} md={6} sm={6} xs={6}>
                                <TextValidator
                                    className="w-full "
                                    placeholder="POA Weeks"
                                    name="poa"
                                    InputLabelProps={{ shrink: false }}
                                    // value={"it"}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.poa_weeks =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.poa_dates
                                    }
                                />
                            </Grid>
                            <Grid className="" item lg={6} md={6} sm={6} xs={6}>
                                <TextValidator
                                    className=" w-full"
                                    placeholder="POA Dates"
                                    name="poa_dates"
                                    InputLabelProps={{ shrink: false }}
                                    // value={"it"}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.poa_dates =
                                            e.target.value

                                        this.setState({
                                            formData,
                                        })
                                    }}
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers.poa_dates
                                    }
                                />
                            </Grid>
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

export default withStyles(styleSheet)(LMP)
