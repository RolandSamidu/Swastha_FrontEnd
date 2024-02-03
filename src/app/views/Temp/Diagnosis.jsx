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

class Diagnosis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alert: false,
            message: "Diagnose is added Successfull",
            severity: 'success',
            data: [{ diagnosis: "Diagnosis 1", description: "Description", condition: "Normal" },
            { diagnosis: "Diagnosis 2", description: "Description", condition: "Normal" }
                , { diagnosis: "Diagnosis 3", description: "Description", condition: "Normal" }],
            columns: [
                {
                    name: 'diagnosis', // field name in the row object
                    label: 'Diagnosis', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    }
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        // filter: true,
                    },
                },

                {
                    name: 'condition',
                    label: 'Condition',
                    options: {},
                },

            ],
            columnsInMin: [
                {
                    name: 'diagnosis', // field name in the row object
                    label: 'Diagnosis', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: false
                    }
                },
                {
                    name: 'description',
                    label: 'Description',
                    options: {
                        // filter: true,
                    },
                },

                {
                    name: 'status',
                    label: 'Status',
                    options: {},
                },

            ],

        }
    }

    //set input value changes


    render() {
        let { theme } = this.props
        const { classes } = this.props
        let activeTheme = MatxLayoutSettings.activeTheme

        return (

            <Fragment>

                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <LoonsTable
                            //title={"All Aptitute Tests"}
                            id={'allAptitute'}
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

                    </Grid>

                    <Grid className='show-on-fullScreen' item lg={12} md={12} sm={12} xs={12}>

                        <ValidatorForm
                            className="mt-10 pt-5 px-2 border-radius-4 w-full"
                            onSubmit={() => this.formSubmit()}
                            onError={() => null}
                            style={{ backgroundColor: "#f1f3f4" }}
                        >

                            <Typography variant="h6" style={{ fontSize: 16, color: 'black' }}>Add New Diagnosis</Typography>
                            <Grid className='mt-3' container spacing={2} >
                                {/* Section 1 */}
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextValidator
                                        className="w-full"

                                        name="diagnosis"
                                        placeholder="diagnosis"
                                        InputLabelProps={{ shrink: false }}

                                        type="text"
                                        variant="outlined"
                                        size="small"

                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                    <TextValidator
                                        className="w-full"

                                        name="Symptoms"
                                        placeholder="Symptoms"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        multiline={true}
                                        rows={3}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextValidator
                                        className="w-full"

                                        name="description"
                                        placeholder="Description"
                                        InputLabelProps={{ shrink: false }}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        multiline={true}
                                        rows={5}

                                    // valid
                                    />
                                </Grid>

                            </Grid>

                            <Button
                                className="mt-1 mb-2"
                                progress={false}
                                //type="submit"
                                scrollToTop={true}
                                startIcon="save"
                                onClick={() => {
                                    this.setState({ alert: true })
                                }

                                }
                            >
                                <span className="capitalize">
                                    Save
                                </span>
                            </Button>
                        </ValidatorForm>
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

            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(Diagnosis)
