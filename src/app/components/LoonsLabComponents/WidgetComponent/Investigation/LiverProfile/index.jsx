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
                    question: "inve_liver_profile",
                    other_answers: {
                        "AST": { test_name: 'AST', value: null, lower_range: 0, upper_range: 50, units: "|U/l" },
                        "ALT": { test_name: 'ALT', value: null, lower_range: 0, upper_range: 50, units: "|U/l" },
                        "ALP": { test_name: 'ALP', value: null, lower_range: 30, upper_range: 120, units: "|U/l" },
                        "Total Bilirubin": { test_name: 'Total Bilirubin', value: null, lower_range: 0.3, upper_range: 1.2, units: "|mg/dl" },
                        "Total Protein": { test_name: 'Total Protein', value: null, lower_range: 6.6, upper_range: 8.3, units: "|g/dl" },
                        "Albumin": { test_name: 'Albumin', value: null, lower_range: 3.5, upper_range: 5.2, units: "|g/dl" },
                        "Globulin": { test_name: 'Globulin', value: null, lower_range: null, upper_range: null, units: "|g/dl" },
                        "GGT": { test_name: 'GGT', value: null, lower_range: null, upper_range: null, units: "|g/dl" },
                        "PT/INR": { test_name: 'PT/INR', value: null, lower_range: null, upper_range: 55, units: null },
                        "APTT": { test_name: 'APTT', value: null, lower_range: 30, upper_range: 40, units: null },
                        "BT/CT": { test_name: 'BT/CT', value: null, lower_range: null, upper_range: null, units: null },

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
            question: 'inve_liver_profile',
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
            let AST = [];
            let ALT = [];
            let ALP = [];
            let Total_Bilirubin = [];
            let Total_Protein = [];
            let Albumin = [];
            let Globulin = [];
            let GGT = [];
            let PTINR = [];
            let APTT = [];
            let BTCT = [];


            res.data.view.data.forEach(element => {
                date.push(dateParse(element.createdAt))
                AST.push(element.other_answers["AST"].value)
                ALT.push(element.other_answers["ALT"].value)
                ALP.push(element.other_answers["ALP"].value)
                Total_Bilirubin.push(element.other_answers["Total Bilirubin"].value)
                Globulin.push(element.other_answers["Globulin"].value)
                GGT.push(element.other_answers["GGT"].value)
                PTINR.push(element.other_answers["PT/INR"].value)
                APTT.push(element.other_answers["APTT"].value)
                BTCT.push(element.other_answers["BT/CT"].value)

            });
            this.setState({ data: { date: date, AST: AST, ALT: ALT, ALP: ALP, Total_Bilirubin: Total_Bilirubin, Globulin: Globulin, GGT: GGT, PTINR: PTINR, APTT: APTT, BTCT: BTCT }, loaded: true })
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
