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
    InputAdornment,
    Divider,
    Tooltip,
    CircularProgress,
    TableCell,
    Table,
    Paper,
    Radio,
    RadioGroup,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    TableBody,
    TableRow,
    Chip
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
    FilePicker,
    ExcelToTable,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsSwitch,
    LoonsCard,
    Button,
    CardTitle
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
import ExaminationServices from 'app/services/ExaminationServices'
import InventoryService from 'app/services/InventoryService'
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

class Allergies extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            patient_id: null,
            itemId: this.props.itemId,
            //form data
            formData: {
                //dashboard_id:"d0865518-530d-47ec-8f39-5f338f5c3874",
                patient_id: window.dashboardVariables.patient_clinic_id,
                widget_id: this.props.widget_id,
                examination_data: [{
                    widget_input_id: this.props.itemId,
                    question: "",
                    answer: "",
                    other_answers: {
                        complaint: "",
                        duration: "",
                        remark: "",
                    }
                }

                ]
            },

            //snackbar
            snackbar: false,
            snackbar_severity: '',
            snackbar_message: '',

            //save button
            buttonProgress: false,

            //dialog box


            //dialog box - edit form
            buttonProgress_editForm: false,

            //all faculties
            all_faculties: [],

            //table data
            table_data_loading: true,
            data: [],
            totalItems: 0,
            totalPages: 0,
            filterData: { limit: 20, page: 0, name: '', description: '', status: '', search: '' },


            food: [],
            drugs: [],
            other: [],
            loaded: false,

            all_drugs: [],

        }
    }


    async loadData() {

        let params = {
            patient_id: window.dashboardVariables.patient_id,
            widget_input_id: this.props.itemId,
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
            this.setState({
                // loaded: false,
                food: [],
                drugs: [],
                other: [],
            })
            console.log("Examination Data ", res.data.view.data)
            res.data.view.data.forEach(element => {
                if (element.question == 'Food Allergies') {
                    this.state.food.push(element.answer)
                } else if (element.question == "Drug Allergies" && element.other_answers) {
                    this.state.drugs.push(element.other_answers.short_description)
                } else {
                    this.state.other.push(element.answer)
                }

            });
            this.setState({ loaded: true })

        }


    }

    async submit() {
        console.log("formdata", this.state.formData)
        let formData = this.state.formData;

        let res = await ExaminationServices.saveData(formData)
        console.log("Examination Data added", res)
        if (201 == res.status) {
            this.setState({
                alert: true,
                message: 'Examination Data Added Successful',
                severity: 'success',
            }, () => {
                this.loadData()
            })
        }
    }

    async loadItems(search) {
        let params = { "search": search }
        let res = await InventoryService.fetchAllItems(params);
        if (res.status == 200) {
            let drugs = [];

            res.data.view.data.forEach(element => {
                drugs.push({
                    sr_no: element.sr_no,
                    id: element.id,
                    short_description: element.short_description,
                    short_description: element.short_description
                })
            });

            this.setState({ all_drugs: drugs })
            console.log("drugs", res.data.view.data)
        }
    }

    async componentDidMount() {
        console.log("dashboardVariables", window.dashboardVariables)
        this.loadData()
        // this.loadItems()
        //this.interval = setInterval(() => this.loadData(), 5000);
    }
    componentWillUnmount() {
        // clearInterval(this.interval);
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme
        let patient_id = this.state.patient_id
        if (patient_id != this.props.patient_id) {
            this.setState({
                patient_id: this.props.patient_id
            })
            this.loadData()
        }
        return (

            <Fragment>

                <ValidatorForm autoComplete="off" onSubmit={() => { this.submit() }} className='w-full'>
                    <Grid container className='w-full'>
                        <Grid item lg={12} md={12} sm={12} xs={12} className='hide-on-fullScreen' >
                            {/* Hide  */}


                            <Autocomplete
                                        disableClearable
                                className="mb-1 w-full"
                                options={this.state.all_drugs}

                                onChange={(e, value) => {
                                    if (value != null) {
                                        let formData = this.state.formData;
                                        formData.examination_data[0].question = "Drug Allergies";
                                        formData.examination_data[0].other_answers = value
                                        this.setState({ formData })

                                    }
                                }}

                                getOptionLabel={(option) => option.short_description}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Add New Allergie"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            console.log("as", e.target.value)

                                            //let formData = this.state.formData;
                                            //formData.examination_data[0].question = "Drug Allergies";
                                            //formData.examination_data[0].answer = e.target.value
                                            //this.setState({ formData })
                                            if (e.target.value.length > 2) {
                                                this.loadItems(e.target.value)
                                            }

                                        }}

                                    />
                                )}
                            />


                        </Grid>
                        {/* <Grid item lg={3} md={3} sm={3} xs={3} className='hide-on-fullScreen  mt-3' >
                            <Button
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                                //startIcon="save"
                                onClick={() => { this.submit() }}
                            >
                                <span className="capitalize">SAVE</span>
                            </Button>
                        </Grid> */}

                    </Grid>


                </ValidatorForm>



                <Grid container className='px-2 mt-2'>
                    {
                        this.state.loaded ?

                            this.state.drugs.map((item, key) => (
                                <Grid item className='hide-on-fullScreen px-1 py-1'>
                                    <div className='px-2  border-radius-8' style={{ backgroundColor: "#d2e3fc", color: 'red' }}>{item}</div>
                                </Grid>


                            ))

                            : null
                    }
                </Grid>







                <Grid className="py-4 " container spacing={1}>
                    <Grid item lg={4} md={4} sm={1} xs={1}>
                        <Paper className=" show-on-fullScreen border-radius-8 px-3 py-1 pb-4" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        /// ---- Show Full Screen
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <div>
                                <Typography className="font-semibold" variant="h6" style={{ fontSize: 14, }}>Drugs Allergies</Typography>
                                <Grid container >


                                    {
                                        this.state.loaded ?
                                            this.state.drugs.map((item, key) => (
                                                <Grid item lg={6} md={6} sm={12} xs={12} className=' px-2  mt-2' >
                                                    <div className='px-2  border-radius-8' style={{ backgroundColor: "#fafafa" }}>{item}</div>
                                                </Grid>
                                            ))
                                            : null
                                    }

                                </Grid>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item lg={4} md={4} sm={1} xs={1}>
                        <Paper className="show-on-fullScreen border-radius-8 px-3 py-1  pb-4" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <div>
                                <Typography className="font-semibold" variant="h6" style={{ fontSize: 14, }}>Food Allergies</Typography>
                                <Grid container >


                                    {
                                        this.state.loaded ?
                                            this.state.food.map((item, key) => (
                                                <Grid item lg={6} md={6} sm={12} xs={12} className=' px-2  mt-2' >
                                                    <div className='px-2  border-radius-8' style={{ backgroundColor: "#fafafa" }}>{item}</div>
                                                </Grid>
                                            ))
                                            : null
                                    }

                                </Grid>
                            </div>
                        </Paper>
                    </Grid>

                    <Grid item lg={4} md={4} sm={1} xs={1}>
                        <Paper className="show-on-fullScreen border-radius-8 px-3 py-1  pb-4" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <div>
                                <Typography className="font-semibold w-full" variant="h6" style={{ fontSize: 14, }}>Other Allergies</Typography>
                                <Grid className='w-full' container >
                                    {
                                        this.state.loaded ?
                                            this.state.other.map((item, key) => (
                                                <Grid item lg={6} md={6} sm={12} xs={12} className=' px-2  mt-2' >
                                                    <div className='px-2  border-radius-8' style={{ backgroundColor: "#fafafa" }}>{item}</div>
                                                </Grid>
                                            ))
                                            : null
                                    }

                                </Grid>
                            </div>
                        </Paper>
                    </Grid>


                </Grid>



                <div className='show-on-fullScreen mt-10'>

                    <ValidatorForm
                        className="w-full"
                        id="create-course-form"
                        onSubmit={() => { this.submit() }}
                        onError={() => null}
                    >
                        <Typography className="font-semibold w-full" variant="h6" style={{ fontSize: 16, }}>Add New Allergies</Typography>

                        <Grid className='w-full' container spacing={1}>

                            <Grid className='w-full' item lg={6} md={6} sm={12} xs={12}>

                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={[
                                        { label: 'Food Allergies' },
                                        { label: 'Drug Allergies' },
                                        { label: 'Other Allergies' }
                                    ]}
                                    getOptionLabel={(option) => option.label}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            let formData = this.state.formData;
                                            formData.examination_data[0].question = value.label;
                                            this.setState({ formData })

                                        }
                                    }}

                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Type"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid className='w-full' item lg={6} md={6} sm={12} xs={12}>

                                {
                                    this.state.formData.examination_data[0].question == 'Drug Allergies' ?

                                        <Autocomplete
                                        disableClearable
                                            className="mb-1 w-full"
                                            options={this.state.all_drugs}

                                            onChange={(e, value) => {
                                                if (value != null) {
                                                    let formData = this.state.formData;
                                                    formData.examination_data[0].question = "Drug Allergies";
                                                    formData.examination_data[0].other_answers = value
                                                    this.setState({ formData })

                                                }
                                            }}

                                            getOptionLabel={(option) => option.short_description}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    placeholder="Add New Allergie"
                                                    //variant="outlined"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        console.log("as", e.target.value)

                                                        //let formData = this.state.formData;
                                                        //formData.examination_data[0].question = "Drug Allergies";
                                                        //formData.examination_data[0].answer = e.target.value
                                                        //this.setState({ formData })
                                                        if (e.target.value.length > 2) {
                                                            this.loadItems(e.target.value)
                                                        }

                                                    }}

                                                />
                                            )}
                                        />
                                        :
                                        <TextValidator
                                            className=" w-full"

                                            placeholder="Add New Allergie"
                                            name="allergie"
                                            InputLabelProps={{ shrink: false }}

                                            // value={"it"}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {

                                                let formData = this.state.formData;
                                                formData.examination_data[0].answer = e.target.value
                                                this.setState({ formData })


                                            }}
                                        /* validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]} */
                                        />
                                }
                            </Grid>

                            <Grid className='mt--2' item lg={12} md={12} sm={12} xs={12}>


                                <TextValidator
                                    className="w-full"
                                    placeholder="Description"
                                    name="description"
                                    InputLabelProps={{ shrink: false }}

                                    // value={this.state.formData.description}
                                    type="text"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    onChange={this.handleChange}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
                                />
                            </Grid>



                        </Grid>

                        <Button
                            className='mt-2'
                            progress={false}
                            type="submit"
                            scrollToTop={true}
                            startIcon="save"
                        //onClick={this.handleChange}
                        >
                            <span className="capitalize">Submit</span>
                        </Button>

                    </ValidatorForm>

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

            </Fragment >

        )
    }
}

export default withStyles(styleSheet)(Allergies)
