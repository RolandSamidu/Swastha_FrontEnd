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
import Chart from './Age_Weight'
import { dateParse } from 'utils'
import PropTypes from "prop-types";

import ExaminationServices from 'app/services/ExaminationServices'
import BloodPressureChart from '../../BloodPressureChart'
import Age_Weight from './Age_Weight'
import Age_Height from './Age_Height'
import Height_Weight from './Height_Weight'
import Age_BMI from './Age_BMI'
import Age_OFC from './Age_OFC'

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

class DevelopmentCharts extends Component {
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
                    question: "development_charts",
                    other_answers: {

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
                                                <p className='px-2'>{ this.state.formData.examination_data[0].other_answers[rowValue.test_name].units}</p>
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
                                    validators={['required']}
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
                                    validators={['required']}
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
            // widget_input_id: this.props.itemId,
            question: 'growth_General',
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
            console.log("Examination Data blood pressure", res.data.view.data)
            this.setState({ data: [] })
            let height = [];
            let weight = [];
            let bmi = [];
            let patient_age = [];
            let ofc = [];

            res.data.view.data.forEach(element => {
                // date.push(dateParse(element.createdAt))
                height.push(element.other_answers.height)
                weight.push(element.other_answers.weight)
                bmi.push(element.other_answers.bmi)
                patient_age.push(element.other_answers.patient_age)
                ofc.push(element.other_answers.ofc)


            });
            this.setState({ data: { height: height, weight: weight, bmi:  bmi, patient_age:patient_age, ofc:ofc }, loaded: true })
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
        console.log("Examination Data for Chart", this.state.data)
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
                                <div className='ml-5 mt-5' >
                                    <SubTitle title="Age - Weight Chart"/>
                                    {this.state.loaded ?
                                        <Age_Weight
                                            height="250px"
                                            type="line"
                                            className=''
                                            data={this.state.data}>

                                        </Age_Weight>
                                        : null}
                                </div>

                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className='ml-5 mt-5' >
                                    <SubTitle title="Age - Height Chart"/>
                                    {this.state.loaded ?
                                        <Age_Height
                                            height="250px"
                                            type="line"
                                            className=''
                                            data={this.state.data}>

                                        </Age_Height>
                                        : null}
                                </div>

                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className='ml-5 mt-5' >
                                    <SubTitle title="Age - OFC/OC Chart"/>
                                    {this.state.loaded ?
                                        <Age_OFC
                                            height="250px"
                                            type="line"
                                            className=''
                                            data={this.state.data}>

                                        </Age_OFC>
                                        : null}
                                </div>

                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className='ml-5 mt-5' >
                                    <SubTitle title="Height - Weight Chart"/>
                                    {this.state.loaded ?
                                        <Height_Weight
                                            height="250px"
                                            type="line"
                                            className=''
                                            data={this.state.data}>

                                        </Height_Weight>
                                        : null}
                                </div>

                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className='ml-5 mt-5' >
                                    <SubTitle title="Age - BMI Chart"/>
                                    {this.state.loaded ?
                                        <Age_BMI
                                            height="250px"
                                            type="line"
                                            className=''
                                            data={this.state.data}>

                                        </Age_BMI>
                                        : null}
                                </div>

                            </Grid>

                            <Grid className='px-3 mt-1' item lg={12} md={12} sm={12} xs={12}>

                                {/* <Grid container spacing={2}>
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


                                </Grid> */}
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

export default withStyles(styleSheet)(DevelopmentCharts)
