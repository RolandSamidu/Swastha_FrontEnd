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
    TableCell,
    Table,
    TableBody,
    TableRow,
    Radio,
    RadioGroup,
    FormGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@material-ui/core'
import { Autocomplete, createFilterOptions } from '@material-ui/lab';
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
    CheckBox,
    CardTitle
}
    from "app/components/LoonsLabComponents";
// import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'

import { fullScreenRequest, fullScreenRequestInsideApp } from '../../../utils'
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

class SampleForm extends Component {
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


        }
    }

    //set input value changes


    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme

        return (

            <Fragment>

                <ValidatorForm
                    //className="pt-5 p"
                    id="create-course-form"
                    onSubmit={this.createFormSubmit}
                    onError={() => null}
                >


                    <div >
                        <Grid className='w-full' container spacing={1}>
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

                            <Grid className='w-full' item lg={6} md={6} sm={12} xs={12}>
                                <RadioGroup row>
                                    <FormControlLabel
                                        label={"Create"}
                                        name="Create"
                                        value={"create"}
                                        onChange={() => {
                                            let formData = this.state.formData;
                                            formData.type = "create";
                                            this.setState({ formData })
                                        }}
                                        control={
                                            <Radio color="primary" />
                                        }
                                        display="inline"
                                        checked={true}
                                    />

                                    <FormControlLabel
                                        label={"Upload"}
                                        name="Upload"
                                        value={"upload"}
                                        onChange={() => {

                                        }}
                                        control={
                                            <Radio color="primary" />
                                        }
                                        display="inline"
                                        checked={
                                            this.state.formData.type
                                                == "upload"
                                                ? true
                                                : false
                                        }
                                    />


                                </RadioGroup>
                            </Grid>


                            <Grid className='mt--2' item lg={6} md={6} sm={12} xs={12}>
                                <DatePicker
                                    className="w-full"
                                    value={this.state.filterData.from}
                                    placeholder="Date From"
                                    // minDate={new Date()}
                                    //maxDate={new Date("2020-10-20")}
                                    // required={true}
                                    // errorMessages="this field is required"
                                    onChange={date => {
                                        // let data = this.state.filterData;
                                        // data['from'] = date;
                                        //  this.setState({ filterData: data })

                                    }}
                                />
                            </Grid>

                            <Grid className='mt--2' item lg={6} md={6} sm={12} xs={12}>
                                <Autocomplete
                                        disableClearable
                                    className="mb-4 w-full"
                                    options={[
                                        { label: '2020/21' },
                                        { label: '2019/20' },
                                        { label: '2018/19' }
                                    ]}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Year"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid className='w-full mt--4' item lg={6} md={6} sm={12} xs={12}>
                                <RadioGroup row>
                                    <FormControlLabel
                                        label={"Check box 1"}
                                        control={
                                            <CheckBox
                                                checked={true}
                                                //onChange={this.handleCheckbox}
                                                name="disagree"
                                                color="primary"
                                                //value={this.state.formData.agreement === false ? true : false}
                                                //checked={this.state.formData.agreement === false ? true : false}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            //disabled={this.state.approved_status != "Pending" ? true : false}
                                            />
                                        }
                                    />

                                    <FormControlLabel
                                        label={"Check box 2"}
                                        control={
                                            <CheckBox
                                                checked={false}
                                                //onChange={this.handleCheckbox}
                                                name="disagree"
                                                color="primary"
                                                //value={this.state.formData.agreement === false ? true : false}
                                                //checked={this.state.formData.agreement === false ? true : false}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            //disabled={this.state.approved_status != "Pending" ? true : false}
                                            />
                                        }
                                    />
                                    <FormControlLabel
                                        label={"Check box 3"}
                                        control={
                                            <CheckBox
                                                checked={false}
                                                //onChange={this.handleCheckbox}
                                                name="disagree"
                                                color="primary"
                                                //value={this.state.formData.agreement === false ? true : false}
                                                //checked={this.state.formData.agreement === false ? true : false}
                                                validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            //disabled={this.state.approved_status != "Pending" ? true : false}
                                            />
                                        }
                                    />


                                </RadioGroup>
                            </Grid>
                            <Grid className='w-full mt--4' item lg={6} md={6} sm={12} xs={12}>
                                <TextValidator
                                    className="w-full"

                                    placeholder="Age"
                                    name="name"
                                    InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                //onChange={this.handleChange}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
                                />
                            </Grid>

                            <Grid className='w-full mt--2' item lg={6} md={6} sm={12} xs={12}>
                                <TextValidator
                                    className=" w-full"

                                    placeholder="Test Types"
                                    name="name"
                                    InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                //onChange={this.handleChange}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
                                />
                            </Grid>

                            <Grid className='w-full mt--2' item lg={6} md={6} sm={12} xs={12}>
                                <TextValidator
                                    className="show-on-fullScreen w-full"

                                    placeholder="Hidden Input"
                                    name="name"
                                    InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                //onChange={this.handleChange}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
                                />
                            </Grid>
                            <Grid className='w-full mt--1' item lg={6} md={6} sm={12} xs={12}>
                                <TextValidator
                                    className="show-on-fullScreen w-full"

                                    placeholder="Hidden Input 2"
                                    name="name"
                                    InputLabelProps={{ shrink: false }}

                                    // value={"it"}
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                //onChange={this.handleChange}
                                /* validators={['required']}
                                errorMessages={[
                                    'this field is required',
                                ]} */
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

                            {/* Button */}
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div style={{ float: 'left', }}>

                                </div>
                            </Grid>

                        </Grid>
                    </div>
                    <Button
                        progress={false}
                        type="submit"
                        scrollToTop={true}
                        startIcon="save"
                    //onClick={this.handleChange}
                    >
                        <span className="capitalize">Submit</span>
                    </Button>

                </ValidatorForm>




            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(SampleForm)
