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
                        question: 'hernia',
                        other_answers: {
                            obstructed: 'no',
                            tenderness: 'no',
                            reducible: 'no',
                            indirect_inguinal_hernia: null,
                            direct_inguinal_hernia: null,
                            epigastric_hernia: null,
                            incisional_hernia: null,
                            femoral_hernia: null,
                            umbilical_hernia: null,
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
            question: 'hernia',
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
                        {/* checkboxes */}
                        <Grid className="" item lg={6} md={12} sm={6} xs={12}>
                            <SubTitle title="Type" />
                            <FormControlLabel
                                label="Indirect Inguinal Hernia"
                                name="indirect_inguinal_hernia"
                                value={false}
                                onChange={() => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.indirect_inguinal_hernia = true
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
                            <FormControlLabel
                                label="Direct Inguinal Hernia"
                                name="direct_inguinal_hernia"
                                value={false}
                                onChange={() => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.direct_inguinal_hernia = true
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
                            <FormControlLabel
                                label="Incisional Hernia"
                                name="incisional_hernia"
                                value={false}
                                onChange={() => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.incisional_hernia = true
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
                            <FormControlLabel
                                label="Epigastric Hernia"
                                name="epigastric_hernia"
                                value={false}
                                onChange={() => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.epigastric_hernia = true
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
                            <FormControlLabel
                                label="Femoral Hernia"
                                name="femoral_hernia"
                                value={false}
                                onChange={() => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.femoral_hernia = true
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
                            <FormControlLabel
                                label="Umbilical Hernia"
                                name="umbilical_hernia"
                                value={false}
                                onChange={() => {
                                    let formData = this.state.formData
                                    formData.examination_data[0].other_answers.umbilical_hernia = true
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
                        <Grid>
                            <Grid
                                className=""
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Obstructed" />
                                <RadioGroup
                                    defaultValue={
                                        this.state.formData.examination_data[0]
                                            .other_answers.obstructed
                                    }
                                    row
                                >
                                    <FormControlLabel
                                        label={'No'}
                                        name="no"
                                        value="no"
                                        size="small"
                                        onChange={() => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers.obstructed =
                                                'no'
                                            this.setState({ formData })
                                        }}
                                        control={<Radio color="primary" />}
                                        display="inline"
                                        // checked={
                                        //     !this.state.formData.examination_data[0].other_answers.probable
                                        // }
                                    />
                                    <FormControlLabel
                                        label={'Yes'}
                                        name="yes"
                                        value="yes"
                                        size="small"
                                        onChange={() => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers.obstructed =
                                                'yes'
                                            this.setState({ formData })
                                        }}
                                        control={<Radio color="primary" />}
                                        display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                    />
                                </RadioGroup>
                            </Grid>
                            <Grid
                                className=""
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Tenderness" />
                                <RadioGroup
                                    defaultValue={
                                        this.state.formData.examination_data[0]
                                            .other_answers.tenderness
                                    }
                                    row
                                >
                                    <FormControlLabel
                                        label={'No'}
                                        name="no"
                                        value="no"
                                        size="small"
                                        onChange={() => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers.tenderness =
                                                'no'
                                            this.setState({ formData })
                                        }}
                                        control={<Radio color="primary" />}
                                        display="inline"
                                        // checked={
                                        //     !this.state.formData.examination_data[0].other_answers.probable
                                        // }
                                    />
                                    <FormControlLabel
                                        label={'Yes'}
                                        name="yes"
                                        value="yes"
                                        size="small"
                                        onChange={() => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers.tenderness =
                                                'yes'
                                            this.setState({ formData })
                                        }}
                                        control={<Radio color="primary" />}
                                        display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                    />
                                </RadioGroup>
                            </Grid>{' '}
                            <Grid
                                className=""
                                item
                                lg={12}
                                md={12}
                                sm={12}
                                xs={12}
                            >
                                <SubTitle title="Reducible" />
                                <RadioGroup
                                    defaultValue={
                                        this.state.formData.examination_data[0]
                                            .other_answers.reducible
                                    }
                                    row
                                >
                                    <FormControlLabel
                                        label={'No'}
                                        name="no"
                                        value="no"
                                        size="small"
                                        onChange={() => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers.reducible =
                                                'no'
                                            this.setState({ formData })
                                        }}
                                        control={<Radio color="primary" />}
                                        display="inline"
                                        // checked={
                                        //     !this.state.formData.examination_data[0].other_answers.probable
                                        // }
                                    />
                                    <FormControlLabel
                                        label={'Yes'}
                                        name="yes"
                                        value="yes"
                                        size="small"
                                        onChange={() => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers.reducible =
                                                'yes'
                                            this.setState({ formData })
                                        }}
                                        control={<Radio color="primary" />}
                                        display="inline"
                                        // checked={this.state.formData.examination_data[0].other_answers.probable}
                                    />
                                </RadioGroup>
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

export default withStyles(styleSheet)(Inspection)
