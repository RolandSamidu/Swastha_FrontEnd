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

class GeneralAbdomen extends Component {
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
                        question: 'general_abdomen',
                        other_answers: {
                            appearance: 'normal',
                            tenderness: 'no',
                            tenderness_type: null,
                            general_type_abdomen: '',
                            general_region_abdomen: '',
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
            question: 'general_abdomen',
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
                        {/* General Abdomen */}
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Appearance" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.appearance
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
                                        formData.examination_data[0].other_answers.appearance =
                                            'normal'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                                <FormControlLabel
                                    label={'Distended'}
                                    name="distended"
                                    value="distended"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.appearance =
                                            'distended'
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
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Scars" />
                            <Autocomplete
                                        disableClearable
                                className="w-half"
                                value={
                                    this.state.formData.examination_data[0]
                                        .other_answers.general_type_abdomen
                                }
                                options={appConst.general_type_abdomen}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.general_type_abdomen =
                                            value
                                        this.setState({ formData })
                                    } else {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.general_type_abdomen =
                                            { label: '' }
                                        this.setState({ formData })
                                    }
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Type"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.formData
                                                .examination_data[0]
                                                .other_answers
                                                .general_type_abdomen
                                        }
                                    />
                                )}
                            />
                            <Autocomplete
                                        disableClearable
                                className="w-half"
                                value={
                                    this.state.formData.examination_data[0]
                                        .other_answers.general_region_abdomen
                                }
                                options={appConst.general_region_abdomen}
                                onChange={(e, value) => {
                                    if (null != value) {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.general_region_abdomen =
                                            value
                                        this.setState({ formData })
                                    } else {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.general_region_abdomen =
                                            { label: '' }
                                        this.setState({ formData })
                                    }
                                }}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Region"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state.formData
                                                .examination_data[0]
                                                .other_answers
                                                .general_region_abdomen
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
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
                                    label={'Present'}
                                    name="present"
                                    value="present"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.tenderness =
                                            'present'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>
                        </Grid>

                        <Grid className="" item lg={12} md={12} sm={12} xs={12}>
                            <SubTitle title="Tenderness Type" />
                            <RadioGroup
                                defaultValue={
                                    this.state.formData.examination_data[0]
                                        .other_answers.tenderness_type
                                }
                                row
                            >
                                <FormControlLabel
                                    label={'Superficial'}
                                    name="superficial"
                                    value="superficial"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.tenderness_type =
                                            'superficial'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={
                                    //     !this.state.formData.examination_data[0].other_answers.probable
                                    // }
                                />
                                <FormControlLabel
                                    label={'Deep'}
                                    name="deep"
                                    value="deep"
                                    size="small"
                                    onChange={() => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers.tenderness_type =
                                            'deep'
                                        this.setState({ formData })
                                    }}
                                    control={<Radio color="primary" />}
                                    display="inline"
                                    // checked={this.state.formData.examination_data[0].other_answers.probable}
                                />
                            </RadioGroup>
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

export default withStyles(styleSheet)(GeneralAbdomen)
