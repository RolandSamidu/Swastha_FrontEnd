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
    Divider,
    Tooltip,
    CircularProgress,
    InputAdornment,
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

class Diagnosis extends Component {
    constructor(props) {
        super(props)
        this.state = {

            //form data
            formData: initial_form_data,

            //snackbar
            snackbar: false,
            snackbar_severity: '',
            snackbar_message: '',

            //save button
            buttonProgress: false,

            //dialog box
            dialogBox: false,
            dialogBox_type: null,
            dialogBox_data: dialogBox_faculty_data,
            dialogBox_message: '',
            dialogBox_message_severity: '',

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
            columnsInMin: [
                {
                    name: 'diagnosis', // field name in the row object
                    label: 'Diagnosis', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customHeadRender: () => null,
                    }
                },
                /* {
                    name: 'duration',
                    label: 'Duration',
                    options: {
                        // filter: true,
                    },
                }, */

            ],
        }
    }

    //set input value changes
    async loadData() {
       /*  const searchparams = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        }); */

        let params = {
            patient_id: this.props.patient_id,
            //widget_input_id: this.props.itemId,
            question: "diagnosis",
            // limit: 10
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
                list: [],

            })
            console.log("Examination Data ", res.data.view.data)
            res.data.view.data.forEach(element => {
                if (element.question == "diagnosis" && element.other_answers) {
                    this.state.data.push(element.other_answers)
                }

            });
            this.setState({ loaded: true })

        }


    }

    componentDidMount() {
        this.loadData()
    }
    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme

        return (

            <Fragment>
                <Grid container >
                    {this.state.loaded ?
                        <LoonsTable

                            //title={"All Aptitute Tests"}
                            id={'Diagnosis'}
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
                        : null}
                </Grid >





                {/* <div className='show-on-fullScreen mt-10'>

                    <ValidatorForm
                        className="w-full"
                        id="create-course-form"
                        onSubmit={this.createFormSubmit}
                        onError={() => null}
                    >
                        <Typography className="font-semibold w-full" variant="h6" style={{ fontSize: 16, }}>Add New Allergies</Typography>

                        <Grid className='w-full' container spacing={1}>

                            <Grid className='w-full' item lg={6} md={6} sm={12} xs={12}>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={[
                                        { label: 'Food Allergie' },
                                        { label: 'Drugs Allergie' },
                                        { label: 'Other Allergie' }
                                    ]}
                                    getOptionLabel={(option) => option.label}
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
                                <TextValidator
                                    className=" w-full"

                                    placeholder="Name"
                                    name="name"
                                    InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={this.handleChange}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />
                            </Grid>

                            <Grid className='mt--2' item lg={12} md={12} sm={12} xs={12}>


                                <TextValidator
                                    className="w-full"
                                    placeholder="Faculty Description"
                                    name="description"
                                    InputLabelProps={{ shrink: false }}

                                    // value={this.state.formData.description}
                                    type="text"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    size="small"
                                    onChange={this.handleChange}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
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

                </div> */}


            </Fragment >

        )
    }
}

export default withStyles(styleSheet)(Diagnosis)
