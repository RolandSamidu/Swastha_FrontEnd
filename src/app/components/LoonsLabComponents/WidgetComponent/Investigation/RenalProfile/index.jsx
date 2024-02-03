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
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
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
    Charts
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import Chart from './Chart'
import { dateParse } from 'utils'
import PropTypes from "prop-types";

import ExaminationServices from 'app/services/ExaminationServices'
import BloodPressureChart from '../../BloodPressureChart'

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

class GlycemicControl extends Component {
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
                    question: "inve_renal_profile",
                    other_answers: {
                        "Serum Creatinine": { test_name: 'Serum Creatinine', value: null, lower_range: null, upper_range: 200, units: "|mg/dl" },
                        "Urea": { test_name: 'Urea', value: null, lower_range: 50, upper_range: 150, units: "|mg/dl" },
                        "Sodium": { test_name: 'Sodium', value: null, lower_range: 60, upper_range: null, units: "|mmol/l" },
                        "Potassium": { test_name: 'Potassium', value: null, lower_range: null, upper_range: 100, units: "|mmol/l" },
                        "Chloride": { test_name: 'Chloride', value: null, lower_range: 10, upper_range: 30, units: "|mmol/l" },
                        "Calcium": { test_name: 'Calcium', value: null, lower_range: 60, upper_range: null, units: "|mg/dl" },
                        "Inorganic": { test_name: 'Inorganic', value: null, lower_range: null, upper_range: 100, units: "|mg/dl" },
                        "Phosphorus": { test_name: 'Phosphorus', value: null, lower_range: 10, upper_range: 30, units: "|mg/dl" },
                        "Uric Acid": { test_name: 'Uric Acid', value: null, lower_range: 2, upper_range: 5, units: null },
                        
                    }
                }

                ]
            },

            columns: [
                {
                    name: 'test_name', // field name in the row object
                    label: 'Test Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'value',
                    label: 'Value',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let rowValue = Object.values(this.state.formData.examination_data[0].other_answers)[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "

                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.examination_data[0].other_answers[rowValue.test_name]?.value}
                                    onChange={(e) => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers[rowValue.test_name].value = e.target.value;

                                        this.setState({ formData })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']}

                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" >
                                                <p className='px-2'>{this.state.formData.examination_data[0]?.other_answers[rowValue.test_name]?.units}</p>
                                            </InputAdornment>
                                        )
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
                            let rowValue = Object.values(this.state.formData.examination_data[0].other_answers)[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "

                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.examination_data[0].other_answers[rowValue.test_name]?.lower_range}
                                    onChange={(e) => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers[rowValue.test_name].lower_range = e.target.value;
                                        this.setState({ formData })
                                    }}
                                    // validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            )
                        },
                    }
                },
                {
                    name: 'upper_range', // field name in the row object
                    label: 'Upper Range', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let rowValue = Object.values(this.state.formData.examination_data[0].other_answers)[dataIndex]

                            return (
                                <TextValidator
                                    className="w-10 "

                                    variant="outlined"
                                    size="small"
                                    value={this.state.formData.examination_data[0].other_answers[rowValue.test_name]?.upper_range}
                                    onChange={(e) => {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].other_answers[rowValue.test_name].upper_range = e.target.value;
                                        this.setState({ formData })
                                    }}
                                    //validators={['required']}
                                    errorMessages={['this field is required']}
                                />
                            )
                        },
                    }
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
            question: 'inve_renal_profile',
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
            console.log("Examination Data", res.data.view.data)
            this.setState({ data: [] })

            let date = [];
            let Serum_Creatinine = [];
            let Urea = [];
            let Sodium = [];
            let Potassium = [];
            let Chloride = [];
            let Calcium = [];
            let Inorganic = [];
            let Phosphorus = [];
            let Uric_Acid = [];

            res.data.view.data.forEach(element => {
                date.push(dateParse(element.createdAt))
                Serum_Creatinine.push(element.other_answers["Serum Creatinine"].value)
                Urea.push(element.other_answers["Urea"].value)
                Sodium.push(element.other_answers["Sodium"].value)
                Potassium.push(element.other_answers["Potassium"].value)
                Chloride.push(element.other_answers["Chloride"].value)
                Calcium.push(element.other_answers["Calcium"].value)
                Inorganic.push(element.other_answers["Inorganic"].value)
                Phosphorus.push(element.other_answers["Phosphorus"].value)
                Uric_Acid.push(element.other_answers["Uric Acid"].value)

            });
            this.setState({ data: { date: date, Serum_Creatinine: Serum_Creatinine,Urea:Urea,Sodium:Sodium,Potassium:Potassium,Chloride:Chloride,Calcium:Calcium,Inorganic:Inorganic,Phosphorus:Phosphorus,Uric_Acid:Uric_Acid }, loaded: true })
            console.log("Examination Data", this.state.data)
        }


    }


    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;

        let res = await ExaminationServices.saveData(formData)
        console.log("Investigation Data added", res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Investigation Data Added Successful',
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
                {this.state.loaded ?
                    <div className='w-full'>
                        <ValidatorForm onSubmit={() => { this.submit() }} className='w-full'>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div >
                                    {this.state.loaded ?
                                        <Chart
                                            height="300px"
                                            type="line"
                                            className='mt- 10'
                                            data={this.state.data}>

                                        </Chart>
                                        : null}
                                </div>

                            </Grid>

                            <Grid className='px-3 mt-1' item lg={12} md={12} sm={12} xs={12}>

                                <Grid container spacing={2}>
                                    <LoonsTable
                                        title={""}
                                        id={"data_table"}

                                        data={Object.values(this.state.formData.examination_data[0].other_answers)}
                                        columns={this.state.columns}
                                        options={{
                                            serverSide: true,
                                            pagination: false,
                                            download: false,
                                            print: false,
                                            filter: false,
                                            viewColumns: false
                                        }
                                        }
                                    ></LoonsTable>


                                </Grid>
                                <Button className="mt-2" progress={false} type="submit" startIcon="save"
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">Save</span>
                                </Button>

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
                    : null}
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(GlycemicControl)
