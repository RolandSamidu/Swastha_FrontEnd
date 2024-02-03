import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    Card,
    TextField,
    InputBase,
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
import VisibilityIcon from '@material-ui/icons/Visibility'
import EditIcon from '@material-ui/icons/Edit'
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
import Chart from './chart'
import { dateParse } from 'utils'
import PropTypes from 'prop-types'

import ExaminationServices from 'app/services/ExaminationServices'
// import BloodPressureChart from '../../BloodPressureChart'

const styleSheet = (theme) => ({})

class PieChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: 'Complications is added Successfull',
            severity: 'success',
            data: [],
            // legendaryData: [
            //     '2022-12-01',
            //     '2022-12-02',
            //     '2022-12-03',
            //     '2022-12-04',
            //     '2022-12-05',
            //     '2022-12-06',
            //     '2022-12-07',
            // ],

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [
                    {
                        widget_input_id: this.props.itemId,
                        question: 'inve_lipid_profile',
                        other_answers: {
                            'Total Cholesterol': {
                                test_name: 'Total Cholesterol',
                                value: null,
                                lower_range: 0,
                                upper_range: 200,
                                units: '|mg/dl',
                            },
                            TGL: {
                                test_name: 'TGL',
                                value: null,
                                lower_range: 50,
                                upper_range: 150,
                                units: '|mg/dl',
                            },
                            HDL: {
                                test_name: 'HDL',
                                value: null,
                                lower_range: 60,
                                upper_range: null,
                                units: '|mg/dl',
                            },
                            LDL: {
                                test_name: 'LDL',
                                value: null,
                                lower_range: 0,
                                upper_range: 100,
                                units: '|mg/dl',
                            },
                            VLDL: {
                                test_name: 'VLDL',
                                value: null,
                                lower_range: 10,
                                upper_range: 30,
                                units: '|mg/dl',
                            },
                            'Chol/HDL': {
                                test_name: 'Chol/HDL',
                                value: null,
                                lower_range: 2,
                                upper_range: 5,
                                units: '|mg/dl',
                            },
                        },
                    },
                ],
            },

            columns: [
                {
                    name: 'test_name', // field name in the row object
                    label: 'Test Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'value',
                    label: 'Value',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let rowValue = Object.values(
                                this.state.formData.examination_data[0]
                                    .other_answers
                            )[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers[rowValue.test_name]
                                            ?.value
                                    }
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers[
                                            rowValue.test_name
                                        ].value = e.target.value

                                        if (
                                            rowValue.test_name ==
                                                'Total Cholesterol' ||
                                            rowValue.test_name == 'HDL'
                                        ) {
                                            if (
                                                formData.examination_data[0]
                                                    .other_answers[
                                                    'Total Cholesterol'
                                                ].value != null &&
                                                formData.examination_data[0]
                                                    .other_answers['HDL']
                                                    .value != null
                                            ) {
                                                formData.examination_data[0].other_answers[
                                                    'Chol/HDL'
                                                ].value =
                                                    parseFloat(
                                                        formData
                                                            .examination_data[0]
                                                            .other_answers[
                                                            'Total Cholesterol'
                                                        ].value
                                                    ) /
                                                    parseFloat(
                                                        formData
                                                            .examination_data[0]
                                                            .other_answers[
                                                            'HDL'
                                                        ].value
                                                    )
                                            }
                                        }

                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <p className="px-2">
                                                    {
                                                        this.state.formData
                                                            .examination_data[0]
                                                            ?.other_answers[
                                                            rowValue.test_name
                                                        ]?.units
                                                    }
                                                </p>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )
                        },
                    },
                },
                {
                    name: 'lower_range', // field name in the row object
                    label: 'Lower Range', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let rowValue = Object.values(
                                this.state.formData.examination_data[0]
                                    .other_answers
                            )[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers[rowValue.test_name]
                                            ?.lower_range
                                    }
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers[
                                            rowValue.test_name
                                        ].lower_range = e.target.value
                                        this.setState({ formData })
                                    }}
                                    // validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            )
                        },
                    },
                },
                {
                    name: 'upper_range', // field name in the row object
                    label: 'Upper Range', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let rowValue = Object.values(
                                this.state.formData.examination_data[0]
                                    .other_answers
                            )[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "
                                    variant="outlined"
                                    size="small"
                                    value={
                                        this.state.formData.examination_data[0]
                                            .other_answers[rowValue.test_name]
                                            ?.upper_range
                                    }
                                    onChange={(e) => {
                                        let formData = this.state.formData
                                        formData.examination_data[0].other_answers[
                                            rowValue.test_name
                                        ].upper_range = e.target.value
                                        this.setState({ formData })
                                    }}
                                    //validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            )
                        },
                    },
                },
            ],
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
            question: 'inve_lipid_profile',
            'order[0]': ['createdAt', 'DESC'],
            limit: 10,
        }

        let res
        if (this.props.loadFromCloud) {
            res = await ExaminationServices.getDataFromCloud(params)
        } else {
            res = await ExaminationServices.getData(params)
        }
        //console.log("Examination Data ", res)
        if (200 == res.status) {
            console.log('Examination Data blood pressure', res.data.view.data)
            this.setState({ data: [] })
            let date = []
            let total = []
            let TGL = []
            let HDL = []
            let LDL = []
            let VLDL = []
            let CholHDL = []

            res.data.view.data.forEach((element) => {
                date.push(dateParse(element.createdAt))
                total.push(element.other_answers['Total Cholesterol'].value)
                TGL.push(element.other_answers['TGL'].value)
                HDL.push(element.other_answers['HDL'].value)
                LDL.push(element.other_answers['LDL'].value)
                VLDL.push(element.other_answers['VLDL'].value)
                CholHDL.push(element.other_answers['Chol/HDL'].value)
            })
            this.setState({
                data: {
                    date: date,
                    total: total,
                    TGL: TGL,
                    HDL: HDL,
                    LDL: LDL,
                    VLDL: VLDL,
                    CholHDL: CholHDL,
                },
                loaded: true,
            })
            console.log('Examination Data', this.state.data)
        }
    }

    async submit() {
        console.log('formdata', this.state.formData)
        let formData = this.state.formData

        let res = await ExaminationServices.saveData(formData)
        console.log('Investigation Data added', res)
        if (201 == res.status) {
            this.setState(
                {
                    alert: true,
                    message: 'Investigation Data Added Successful',
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
        //console.log("item id", Object.values(this.state.formData.examination_data[0].other_answers))
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
                {this.state.loaded ? (
                    <div className="w-full">
                        <ValidatorForm
                            onSubmit={() => {
                                this.submit()
                            }}
                            className="w-full"
                        >
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div>
                                    {this.state.loaded ? (
                                        <Chart
                                            height="600px"
                                            className="mt--10"
                                            // data={this.state.legendaryData}
                                            // data={this.state.data}
                                            // legendData={[
                                            //     'Temp01',
                                            //     'Temp02',
                                            //     'Temp03',
                                            //     'Temp04',
                                            //     'Temp05',
                                            // ]}
                                        ></Chart>
                                    ) : null}
                                </div>
                            </Grid>

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
                        </ValidatorForm>
                    </div>
                ) : null}
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(PieChart)
