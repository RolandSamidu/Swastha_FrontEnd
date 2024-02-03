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
    Button,
    TableBody,
    TableRow,
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

class Test extends Component {
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
                        <Grid container spacing={2}>
                            <Grid item lg={12} md={12} sm={12} xs={12}>

                                <TextValidator
                                    className="show-on-fullScreen w-full"

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

                            <Grid item lg={12} md={12} sm={12} xs={12}>


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

                </ValidatorForm>




            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(Test)
