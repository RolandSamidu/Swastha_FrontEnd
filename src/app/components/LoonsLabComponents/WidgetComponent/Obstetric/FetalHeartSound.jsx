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

class FetalHeartSound extends Component {
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
                        question: 'fetal_heart_sound',
                        other_answers: {
                            fetal_heart_sound: 'yes',
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
            question: 'fetal_heart_sound',
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
                        {/*Fetal Heart Sound*/}
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Fetal Heart Sound" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.fetal_heart_sound
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
                                        formData.examination_data[0].other_answers.fetal_heart_sound =
                                            'yes'
                                        this.setState({
                                            fetal_heart: true,
                                            formData,
                                        })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={'No'}
                                    name="no"
                                    value="no"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.fetal_heart_sound =
                                            'no'
                                        this.setState({
                                            fetal_heart: false,
                                            formData,
                                        })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />

                                <FormControlLabel
                                    label={'Difficult to detect'}
                                    name="difficult_to_detect"
                                    value="difficult_to_detect"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.fetal_heart_sound =
                                            'difficult_to_detect'
                                        this.setState({
                                            fetal_heart: false,
                                            formData,
                                        })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>
                        </Grid>
                        {this.state.fetal_heart ? (
                            <div>
                                <Grid
                                    className=""
                                    item
                                    lg={12}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                >
                                    <TextValidator
                                        placeholder="Fetal Heart Sound"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        type="number"
                                        onChange={(e) => {
                                            let formData = this.state.formData
                                            formData.examination_data[0].other_answers.heart_sound =
                                                e.target.value

                                            this.setState({
                                                formData,
                                            })
                                        }}
                                        value={
                                            this.state.formData
                                                .examination_data[0]
                                                .other_answers.heart_sound
                                        }
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <p className="px-2">
                                                        | min
                                                    </p>
                                                </InputAdornment>
                                            ),
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
                            </div>
                        ) : null}
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

export default withStyles(styleSheet)(FetalHeartSound)
