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

class Allergies extends Component {
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
            list: ["Cetirizine(Zyrtec, Zyrtec Allergy)",
                "Desloratadine(Clarinex)",
                "Fexofenadine(Allegra, Allegra Allergy)",
                "Levocetirizine(Xyzal, Xyzal Allergy)",
                "Loratadine(Alavert, Claritin)"]

        }
    }

    //set input value changes


    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme

        return (

            <Fragment>
                <Grid container >
                    {
                        this.state.list.map((item, key) => (
                            <Grid item lg={12} md={12} sm={12} xs={12} className='hide-on-fullScreen px-4 mt-2'>
                                <div className='px-2  border-radius-8' style={{ backgroundColor: "#d2e3fc" }}>{item}</div>
                            </Grid>


                        ))
                    }

                </Grid >

                <ValidatorForm>
                    <Grid container >
                        <Grid item lg={12} md={12} sm={12} xs={12} className='hide-on-fullScreen mt-2 px-4' >
                            <Autocomplete
                                        disableClearable
                                className="mb-1 w-full"
                                options={[
                                    { label: 'Amo' },
                                    { label: 'Penadol' },
                                    { label: 'Paradine' }
                                ]}
                                getOptionLabel={(option) => option.label}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Add New Allergie"
                                        //variant="outlined"
                                        fullWidth
                                        variant="outlined"
                                        size="small"

                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" >
                                                    <Button
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={true}
                                                    //startIcon="save"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">SAVE</span>
                                                    </Button>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                            />

                        </Grid>
                        

                    </Grid>


                </ValidatorForm>




                <Grid className="py-4 " container spacing={1}>
                    <Grid item lg={4} md={4} sm={1} xs={1}>
                        <Paper className=" show-on-fullScreen border-radius-8 px-3 py-1 pb-4" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <div>
                                <Typography className="font-semibold" variant="h6" style={{ fontSize: 14, }}>Drugs Allergies</Typography>
                                <Grid container >


                                    {
                                        this.state.list.map((item, key) => (
                                            <Grid item lg={6} md={6} sm={12} xs={12} className=' px-2  mt-2' >
                                                <div className='px-2  border-radius-8' style={{ backgroundColor: "#fafafa" }}>{item}</div>
                                            </Grid>
                                        ))

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
                                        this.state.list.map((item, key) => (
                                            <Grid item lg={6} md={6} sm={12} xs={12} className=' px-2  mt-2' >
                                                <div className='px-2  border-radius-8' style={{ backgroundColor: "#fafafa" }}>{item}</div>
                                            </Grid>
                                        ))

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
                                        this.state.list.map((item, key) => (
                                            <Grid item lg={6} md={6} sm={12} xs={12} className=' px-2  mt-2' >
                                                <div className='px-2  border-radius-8' style={{ backgroundColor: "#fafafa" }}>{item}</div>
                                            </Grid>
                                        ))

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

                </div>


            </Fragment >

        )
    }
}

export default withStyles(styleSheet)(Allergies)
