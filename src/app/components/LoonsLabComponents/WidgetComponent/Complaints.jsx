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
    SubTitle
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'

import ExaminationServices from 'app/services/ExaminationServices'
import PropTypes from "prop-types";
import localStorageService from 'app/services/localStorageService'


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

class Complaints extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: "Complaint is added Successfull",
            severity: 'success',
            data: [],

            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "complaints",
                    other_answers: {
                        complaint: "",
                        duration: "",
                        remark: "",
                    }
                }

                ]
            },
            columns: [
                {
                    name: 'complaint', // field name in the row object
                    label: 'Complaint', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'duration',
                    label: 'Duration',
                    options: {
                        // filter: true,
                    },
                },


                {
                    name: 'remark',
                    label: 'Remark',
                    options: {},
                },

            ],
            columnsInMin: [
                {
                    name: 'complaint', // field name in the row object
                    label: 'Complaint', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        // customHeadRender: () => null,
                    }
                },
                {
                    name: 'duration',
                    label: 'Duration',
                    options: {
                        // filter: true,
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
            this.setState({ data: [] })
            console.log("Examination Data ", res.data.view.data)
            res.data.view.data.forEach(element => {
                if (element.question == 'complaints') {
                    this.state.data.push(element.other_answers)
                }

            });
            this.setState({ loaded: true })

        }


    }


    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;
        let patientSummary = await localStorageService.getItem('patientSummary')
        if(!patientSummary.complaints){
            patientSummary.complaints = []
        }
        let res = await ExaminationServices.saveData(formData)
        console.log("Examination Data added", res)
        console.log(patientSummary, 'Summary')
        if (201 == res.status) {

            patientSummary.complaints.push(formData.examination_data[0].other_answers)
            localStorageService.setItem('patientSummary', patientSummary)
            
            /* formData.examination_data[0].other_answers = {
                complaint: "",
            }*/
            this.setState({
                alert: true,
                message: 'Examination Data Added Successful',
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
        console.log("item id", this.props.itemId)
        this.loadData()
        //this.interval = setInterval(() =>  this.loadData(), 5000);
    }
    componentWillUnmount() {
        //clearInterval(this.interval);
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
                            <Grid container className='w-full'>
                                <Grid item lg={12} md={12} sm={12} xs={12} className='hide-on-fullScreen' >


                                    <TextValidator
                                        className="w-full"

                                        name="complaint"
                                        placeholder="Complaint"
                                        InputLabelProps={{ shrink: false }}

                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {

                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.complaint = e.target.value
                                            this.setState({ formData })


                                        }}
                                        value={this.state.formData.examination_data[0].other_answers.complaint}

                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />


                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12} className='hide-on-fullScreen' >


                                    <TextValidator
                                        className="w-full"

                                        name="duration"
                                        placeholder="Duration"
                                        InputLabelProps={{ shrink: false }}

                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {

                                            let formData = this.state.formData;
                                            formData.examination_data[0].other_answers.duration = e.target.value
                                            this.setState({ formData })


                                        }}

                                    /* validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]} */
                                    />


                                </Grid>


                            </Grid>







                            <Grid container>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <div className='show-on-fullScreen'>
                                        <LoonsTable

                                            //title={"All Aptitute Tests"}
                                            id={'Complaints'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                print: false,
                                                viewColumns: false,
                                                download: false,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(
                                                                tableState.page
                                                            )
                                                            break
                                                        case 'sort':
                                                            //this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        ></LoonsTable>
                                    </div>
                                    <div className="hide-on-fullScreen">
                                        {this.state.data.length > 0 ?
                                            <LoonsTable

                                                //title={"All Aptitute Tests"}
                                                id={'Complaints'}
                                                data={this.state.data}
                                                columns={this.state.columnsInMin}
                                                options={{
                                                    pagination: false,
                                                    serverSide: true,
                                                    print: false,
                                                    viewColumns: false,
                                                    download: false,
                                                    onTableChange: (action, tableState) => {
                                                        console.log(action, tableState)
                                                        switch (action) {
                                                            case 'changePage':
                                                                this.setPage(
                                                                    tableState.page
                                                                )
                                                                break
                                                            case 'sort':
                                                                //this.sort(tableState.page, tableState.sortOrder);
                                                                break
                                                            default:
                                                                console.log(
                                                                    'action not handled.'
                                                                )
                                                        }
                                                    },
                                                }}
                                            ></LoonsTable>
                                            :

                                            <div className='w-full text-center'>New Patient</div>
                                        }
                                    </div>




                                </Grid>

                                <Grid className='show-on-fullScreen' item lg={12} md={12} sm={12} xs={12}>

                                    {/*  <ValidatorForm
                                    className="mt-10 pt-5 px-2 border-radius-4 w-full"
                                    onSubmit={() => this.submit()}
                                    onError={() => null}
                                    style={{ backgroundColor: "#f1f3f4" }}
                                > */}

                                    <Grid className='mt-3 px-5' container spacing={2} >

                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <Typography variant="h6" style={{ fontSize: 16, color: 'black' }}>Add New Complaint</Typography>

                                        </Grid>
                                        {/* Section 1 */}
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <TextValidator
                                                className="w-full"

                                                name="complaint"
                                                placeholder="Complaint"
                                                InputLabelProps={{ shrink: false }}

                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {

                                                    let formData = this.state.formData;
                                                    formData.examination_data[0].other_answers.complaint = e.target.value
                                                    this.setState({ formData })


                                                }}
                                                value={this.state.formData.examination_data[0].other_answers.complaint}

                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                            <TextValidator
                                                className="w-full"

                                                name="duration"
                                                placeholder="Duration"
                                                InputLabelProps={{ shrink: false }}

                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {

                                                    let formData = this.state.formData;
                                                    formData.examination_data[0].other_answers.duration = e.target.value
                                                    this.setState({ formData })


                                                }}

                                            /* validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]} */
                                            />



                                        </Grid>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <TextValidator
                                                className="w-full"

                                                name="remark"
                                                placeholder="Remark"
                                                InputLabelProps={{ shrink: false }}
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {

                                                    let formData = this.state.formData;
                                                    formData.examination_data[0].other_answers.remark = e.target.value
                                                    this.setState({ formData })


                                                }}
                                                multiline={true}
                                                rows={5}

                                            // valid
                                            />
                                        </Grid>


                                        <Button
                                        className="mt-1 mb-2"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="save"



                                    >
                                        <span className="capitalize">
                                            Save
                                        </span>
                                    </Button>

                                    </Grid>

                                    
                                    {/*  </ValidatorForm> */}
                                </Grid>
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

export default withStyles(styleSheet)(Complaints)
