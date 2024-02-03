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
    Chip,
} from '@material-ui/core'

import { themeColors } from 'app/components/MatxTheme/themeColors'
import { MatxLayoutSettings } from 'app/components/MatxLayout/settings'
import DateRangeIcon from '@material-ui/icons/DateRange'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
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
import { dateParse } from 'utils'
import PropTypes from "prop-types";

import ExaminationServices from 'app/services/ExaminationServices'
import PatientServices from 'app/services/PatientServices'
import UtilityServices from 'app/services/UtilityServices'
import PrintInvestigation from './PrintInvestigation'

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
            loaded: true,
            alert: false,
            message: "Complications is added Successfull",
            severity: 'success',
            data: [],
            selectedTestsList: [],

            TestList: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",

                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "investigation_requests_list",
                    other_answers: {
                        favourites: [{
                            lable: 'Annual Screen',
                            all_tests: [{ test_name: 'FBC', urgent: false }]
                        },
                        {
                            lable: 'Monthly RV',
                            all_tests: [{ test_name: 'UFR', urgent: false }]
                        },

                        ],
                        bloodTest: [{ test_name: 'FBC', urgent: false }, { test_name: 'ESR', urgent: false }, { test_name: 'Blood Pic', urgent: false }],
                        urineTest: [{ test_name: 'UFR', urgent: false }, { test_name: 'U Culture', urgent: false }],
                        test1: [{ test_name: 'PT/INR', urgent: false }, { test_name: 'APTT', urgent: false }],
                        test2: [{ test_name: 'Blood Culture', urgent: false }],
                        test3: [{ test_name: 'Lumba Puncture', urgent: false }],
                        test4: [{ test_name: 'CXR', urgent: false }, { test_name: 'ECG', urgent: false }],
                        test5: [{ test_name: 'Renal', urgent: false }, { test_name: 'Liver P', urgent: false }, { test_name: 'Liver F', urgent: false }, { test_name: 'S.Cr', urgent: false }, { test_name: 'Bu', urgent: false }, { test_name: 'SE', urgent: false }, { test_name: 'SGOT', urgent: false }, { test_name: 'SGPT', urgent: false }, { test_name: 'RGT', urgent: false }, { test_name: 'Trop I', urgent: false }, { test_name: 'CRP', urgent: false }],



                    }
                }

                ]
            },





            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "inve_lipid_profile",
                    other_answers: {
                        "Total Cholesterol": { test_name: 'Total Cholesterol', value: null, lower_range: 0, upper_range: 200, units: "|mg/dl" },
                        "TGL": { test_name: 'TGL', value: null, lower_range: 50, upper_range: 150, units: "|mg/dl" },
                        "HDL": { test_name: 'HDL', value: null, lower_range: 60, upper_range: null, units: "|mg/dl" },
                        "LDL": { test_name: 'LDL', value: null, lower_range: 0, upper_range: 100, units: "|mg/dl" },
                        "VLDL": { test_name: 'VLDL', value: null, lower_range: 10, upper_range: 30, units: "|mg/dl" },
                        "Chol/HDL": { test_name: 'Chol/HDL', value: null, lower_range: 2, upper_range: 5, units: "|mg/dl" },

                    }
                }

                ]
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
            question: 'inve_lipid_profile',
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
            let date = [];
            let total = [];
            let TGL = [];
            let HDL = [];
            let LDL = [];
            let VLDL = [];
            let CholHDL = [];


            res.data.view.data.forEach(element => {
                date.push(dateParse(element.createdAt))
                total.push(element.other_answers["Total Cholesterol"].value)
                TGL.push(element.other_answers["TGL"].value)
                HDL.push(element.other_answers["HDL"].value)
                LDL.push(element.other_answers["LDL"].value)
                VLDL.push(element.other_answers["VLDL"].value)
                CholHDL.push(element.other_answers["Chol/HDL"].value)


            });
            this.setState({ data: { date: date, total: total, TGL: TGL, HDL: HDL, LDL: LDL, VLDL: VLDL, CholHDL: CholHDL }, loaded: true })
            console.log("Examination Data", this.state.data)
        }


    }


    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;

        /*     let res = await ExaminationServices.saveData(formData)
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
            } */
    }

    async onReload() {
        const { onReload } = this.props;

        onReload &&
            onReload();
    }

    async fetchPatientInfo() {
        PatientServices.getPatientById(window.dashboardVariables.patient_id, {}).then(async (obj) => {
            if (obj.status == 200) {

                var age = await UtilityServices.getAge(obj.data.view.date_of_birth);
                //return age.age_years + 'Y ' + age.age_months + 'M ' + age.age_days + 'D ';
                let data = obj.data.view;
                data.age = age.age_years + 'Y ' + age.age_months + 'M ' + age.age_days + 'D ';
                console.log("patient info", data)
                this.setState({ patientInfo: data })

            }
        });
    }

    //set input value changes
    componentDidMount() {
        this.fetchPatientInfo()
        //console.log("item id", Object.values(this.state.formData.examination_data[0].other_answers))
        //this.loadData()
        //this.interval = setInterval(() => this.loadData(), 5000);

    }
    componentWillUnmount() {
        // clearInterval(this.interval);
    }

    selectingTest(test) {
        console.log("selected test", test)
        let selectedTestsList = this.state.selectedTestsList;
        if (selectedTestsList.includes(test)) {
            this.setState({
                alert: true,
                message: 'Test is Alrady Selected',
                severity: 'error',
            })
        } else {
            selectedTestsList.push(test)
            this.setState({ selectedTestsList })
        }

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
                            <div className='w-full px-3 mt-5'>
                                <Grid container spacing={1}>
                                    <Grid item lg={9} md={9} sm={12} xs={12}>
                                        <Grid container spacing={2}>

                                            {/**favourites */}
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Card elevation={6} className="px-main-card py-3 w-full">


                                                    {this.state.TestList.examination_data[0].other_answers.favourites.map((item, key) => (
                                                        <Chip
                                                            //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                            label={item.lable}
                                                            clickable
                                                            //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                            //onDelete={handleDelete}
                                                            onClick={() => {
                                                                item.all_tests.forEach(element => {
                                                                    this.selectingTest(element)
                                                                });

                                                            }}
                                                            //deleteIcon={<DoneIcon />}
                                                            variant="outlined"
                                                        />


                                                    ))
                                                    }


                                                </Card>
                                            </Grid>

                                            {/**blood tests */}
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Card elevation={6} className="px-main-card py-3 w-full">


                                                    {this.state.TestList.examination_data[0].other_answers.bloodTest.map((item, key) => (
                                                        <Chip
                                                            //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                            label={item.test_name}
                                                            clickable
                                                            //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                            //onDelete={handleDelete}
                                                            onClick={() => {
                                                                this.selectingTest(item)

                                                            }}
                                                            //deleteIcon={<DoneIcon />}
                                                            variant="outlined"
                                                        />


                                                    ))
                                                    }


                                                </Card>
                                            </Grid>

                                            {/**urine Test*/}
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Card elevation={6} className="px-main-card py-3 w-full">


                                                    {this.state.TestList.examination_data[0].other_answers.urineTest.map((item, key) => (
                                                        <Chip
                                                            //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                            label={item.test_name}
                                                            clickable
                                                            //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                            //onDelete={handleDelete}
                                                            onClick={() => {
                                                                this.selectingTest(item)

                                                            }}
                                                            //deleteIcon={<DoneIcon />}
                                                            variant="outlined"
                                                        />


                                                    ))
                                                    }


                                                </Card>
                                            </Grid>

                                            {/**Test1*/}
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Card elevation={6} className="px-main-card py-3 w-full">


                                                    {this.state.TestList.examination_data[0].other_answers.test1.map((item, key) => (
                                                        <Chip
                                                            //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                            label={item.test_name}
                                                            clickable
                                                            //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                            //onDelete={handleDelete}
                                                            onClick={() => {
                                                                this.selectingTest(item)

                                                            }}
                                                            //deleteIcon={<DoneIcon />}
                                                            variant="outlined"
                                                        />


                                                    ))
                                                    }


                                                </Card>
                                            </Grid>

                                            {/**Test2*/}
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Card elevation={6} className="px-main-card py-3 w-full">


                                                    {this.state.TestList.examination_data[0].other_answers.test2.map((item, key) => (
                                                        <Chip
                                                            //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                            label={item.test_name}
                                                            clickable
                                                            //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                            //onDelete={handleDelete}
                                                            onClick={() => {
                                                                this.selectingTest(item)

                                                            }}
                                                            //deleteIcon={<DoneIcon />}
                                                            variant="outlined"
                                                        />


                                                    ))
                                                    }


                                                </Card>
                                            </Grid>

                                            {/**Test3*/}
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Card elevation={6} className="px-main-card py-3 w-full">


                                                    {this.state.TestList.examination_data[0].other_answers.test3.map((item, key) => (
                                                        <Chip
                                                            //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                            label={item.test_name}
                                                            clickable
                                                            //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                            //onDelete={handleDelete}
                                                            onClick={() => {
                                                                this.selectingTest(item)

                                                            }}
                                                            //deleteIcon={<DoneIcon />}
                                                            variant="outlined"
                                                        />


                                                    ))
                                                    }


                                                </Card>
                                            </Grid>

                                            {/**Test4*/}
                                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                                <Card elevation={6} className="px-main-card py-3 w-full">


                                                    {this.state.TestList.examination_data[0].other_answers.test4.map((item, key) => (
                                                        <Chip
                                                            //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                            label={item.test_name}
                                                            clickable
                                                            //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                            //onDelete={handleDelete}
                                                            onClick={() => {
                                                                this.selectingTest(item)

                                                            }}
                                                            //deleteIcon={<DoneIcon />}
                                                            variant="outlined"
                                                        />


                                                    ))
                                                    }


                                                </Card>
                                            </Grid>

                                            {/**Test5*/}
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Card elevation={6} className="px-main-card py-3 w-full">


                                                    {this.state.TestList.examination_data[0].other_answers.test5.map((item, key) => (
                                                        <Chip
                                                            //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                            label={item.test_name}
                                                            clickable
                                                            //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                            //onDelete={handleDelete}
                                                            onClick={() => {
                                                                this.selectingTest(item)

                                                            }}
                                                            //deleteIcon={<DoneIcon />}
                                                            variant="outlined"
                                                        />


                                                    ))
                                                    }


                                                </Card>
                                            </Grid>

                                        </Grid>


                                    </Grid>

                                    <Grid item lg={3} md={3} sm={12} xs={12}>
                                        {/**Selected all test */}
                                        <Card elevation={6} className="px-main-card py-3 w-full">

                                            <CardTitle title="Selected Investigations"></CardTitle>
                                            <div className='mt-2'></div>
                                            {this.state.selectedTestsList.map((item, index) => (
                                                <Chip
                                                    //icon={selectedFavourites.includes(item) ? <DoneIcon /> : null}
                                                    label={item.test_name}
                                                    clickable
                                                    //color={selectedFavourites.includes(item) ? "primary" : "default"}
                                                    onDelete={() => {
                                                        let selectedTestsList = this.state.selectedTestsList
                                                        selectedTestsList.splice(index, 1)
                                                        this.setState({ selectedTestsList })
                                                    }}

                                                    deleteIcon={<CloseIcon />}
                                                    variant="outlined"
                                                />


                                            ))
                                            }

                                            <PrintInvestigation patientInfo={this.state.patientInfo} testList={this.state.selectedTestsList} letterTitle="Investigation List"></PrintInvestigation>

                                        </Card>

                                    </Grid>
                                </Grid>


                            </div>















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
