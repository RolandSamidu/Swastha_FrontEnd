import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/styles'
import {
    Card,
    TextField,
    MenuItem,
    IconButton,
    Icon,
    Grid,
    Paper,
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
import ModifiedAreaChart from '../dashboard/shared/ModifiedAreaChart'

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

class HelthStatus extends Component {
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

            <Fragment >

                <Grid className="pt-4" container spacing={1}>
                    <Grid item lg={4} md={4} sm={1} xs={1}>
                        <Paper className="border-radius-8 px-3 py-1" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <Typography className="font-semibold" variant="h6" style={{ fontSize: 14, }}>BP</Typography>
                            <Typography className="font-semibold" variant="h6" style={{ fontSize: 16, color: "#717272" }}>118/78</Typography>

                            <ValidatorForm>
                                <TextValidator
                                    className="w-full"
                                    placeholder="BP"
                                    name="NewBP"
                                    InputLabelProps={{ shrink: false }}

                                    // value={this.state.formData.description}
                                    type="text"

                                    variant="outlined"
                                    size="small"
                                    onChange={this.handleChange}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />


                            </ValidatorForm>


                            <div className=''>
                                <ModifiedAreaChart
                                    height="280px"
                                    width="250px"
                                    className="show-on-fullScreen"
                                    option={{
                                        series: [

                                            {
                                                lineStyle: {
                                                    width: 2,
                                                    color: themeColors[activeTheme].palette.primary.main,
                                                },
                                                data: [
                                                    180,
                                                    150,
                                                    160,
                                                    140,
                                                    120,
                                                    118
                                                ],
                                                type: 'line',
                                            },
                                            {
                                                lineStyle: {
                                                    width: 2,
                                                    color: themeColors[activeTheme].palette.secondary.main,
                                                },
                                                data: [
                                                    100,
                                                    90,
                                                    95,
                                                    88,
                                                    80,
                                                    78
                                                ],
                                                type: 'line',
                                            },
                                        ],
                                        xAxis: {
                                            axisLabel: {
                                                color: themeColors[activeTheme].palette.primary.main,
                                                margin: 20,
                                            },
                                            data: [
                                                '2022/01/05',
                                                '2022/01/12',
                                                '2022/01/19',
                                                '2022/01/25',
                                                '2022/02/05',
                                                '2022/02/15',

                                            ],
                                        },
                                        yAxis: {
                                            type: 'value',
                                            //min: 10,
                                            //max: 1000,
                                            axisLabel: {
                                                color: themeColors[activeTheme].palette.primary.main,
                                                margin: 0,
                                                fontSize: 13,
                                                fontFamily: 'roboto',
                                            },
                                            splitLine: {
                                                show: true,
                                                lineStyle: {
                                                    color: 'rgba(0, 0, 0, .1)',
                                                },
                                            },


                                        },
                                        color: [
                                            {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 0,
                                                y2: 1,
                                                colorStops: [
                                                    {
                                                        offset: 0,
                                                        color: themeColors[activeTheme].palette.primary.main, // color at 0% position
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: 'rgba(255,255,255,0)', // color at 100% position
                                                    },
                                                ],
                                                global: true, // false by default
                                            },
                                        ],
                                    }}
                                />
                            </div>





                        </Paper>
                    </Grid>
                    <Grid item lg={4} md={4} sm={1} xs={1}>
                        <Paper className="border-radius-8 px-3 py-1" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <Typography className="font-semibold" variant="h6" style={{ fontSize: 14, }}>Cholesterol</Typography>
                            <Typography className="font-semibold" variant="h6" style={{ fontSize: 16, color: "#717272" }}>240</Typography>

                            <ValidatorForm>
                                <TextValidator
                                    className="w-full"
                                    placeholder="Cholesterol"
                                    name="NewBP"
                                    InputLabelProps={{ shrink: false }}

                                    // value={this.state.formData.description}
                                    type="text"

                                    variant="outlined"
                                    size="small"
                                    onChange={this.handleChange}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />


                            </ValidatorForm>

                            <div >
                                <ModifiedAreaChart
                                    height="280px"
                                    className="show-on-fullScreen"
                                    option={{
                                        series: [

                                            {
                                                lineStyle: {
                                                    width: 2,
                                                    color: themeColors[activeTheme].palette.primary.main,
                                                },
                                                data: [
                                                    200,
                                                    260,
                                                    255,
                                                    255,
                                                    250,
                                                    240
                                                ],
                                                type: 'line',
                                            },

                                        ],
                                        xAxis: {
                                            axisLabel: {
                                                color: themeColors[activeTheme].palette.primary.main,
                                                margin: 20,
                                            },
                                            data: [
                                                '2022/01/05',
                                                '2022/01/12',
                                                '2022/01/19',
                                                '2022/01/25',
                                                '2022/02/05',
                                                '2022/02/15',

                                            ],
                                        },
                                        yAxis: {
                                            type: 'value',
                                            //min: 10,
                                            //max: 1000,
                                            axisLabel: {
                                                color: themeColors[activeTheme].palette.primary.main,
                                                margin: 0,
                                                fontSize: 13,
                                                fontFamily: 'roboto',
                                            },
                                            splitLine: {
                                                show: true,
                                                lineStyle: {
                                                    color: 'rgba(0, 0, 0, .1)',
                                                },
                                            },


                                        },
                                        color: [
                                            {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 0,
                                                y2: 1,
                                                colorStops: [
                                                    {
                                                        offset: 0,
                                                        color: themeColors[activeTheme].palette.primary.main, // color at 0% position
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: 'rgba(255,255,255,0)', // color at 100% position
                                                    },
                                                ],
                                                global: false, // false by default
                                            },
                                        ],
                                    }}
                                />
                            </div>

                        </Paper>
                    </Grid>

                    <Grid item lg={4} md={4} sm={1} xs={1}>
                        <Paper className="border-radius-8 px-3 py-1" elevation={12} style={{ backgroundColor: "#d2e3fc" }}
                        //maxConstraints={[300, 300]}
                        // height={this.state.height} width={this.state.width} onResize={this.onResize} 
                        >
                            <Typography className="font-semibold" variant="h6" style={{ fontSize: 14, }}>Sugar</Typography>
                            <Typography className="font-semibold" variant="h6" style={{ fontSize: 16, color: "#717272" }}>90</Typography>

                            <ValidatorForm>
                                <TextValidator
                                    className="w-full"
                                    placeholder="Sugar"
                                    name="NewBP"
                                    InputLabelProps={{ shrink: false }}

                                    // value={this.state.formData.description}
                                    type="text"

                                    variant="outlined"
                                    size="small"
                                    onChange={this.handleChange}
                                    validators={['required']}
                                    errorMessages={[
                                        'this field is required',
                                    ]}
                                />


                            </ValidatorForm>

                            <div >
                                <ModifiedAreaChart
                                    height="280px"
                                    className="show-on-fullScreen"
                                    option={{
                                        series: [

                                            {
                                                lineStyle: {
                                                    width: 2,
                                                    color: themeColors[activeTheme].palette.primary.main,
                                                },
                                                data: [
                                                    75,
                                                    80,
                                                    70,
                                                    100,
                                                    90,
                                                    90
                                                ],
                                                type: 'line',
                                            },

                                        ],
                                        xAxis: {
                                            axisLabel: {
                                                color: themeColors[activeTheme].palette.primary.main,
                                                margin: 20,
                                            },
                                            data: [
                                                '2022/01/05',
                                                '2022/01/12',
                                                '2022/01/19',
                                                '2022/01/25',
                                                '2022/02/05',
                                                '2022/02/15',

                                            ],
                                        },
                                        yAxis: {
                                            type: 'value',
                                            //min: 10,
                                            //max: 1000,
                                            axisLabel: {
                                                color: themeColors[activeTheme].palette.primary.main,
                                                margin: 0,
                                                fontSize: 13,
                                                fontFamily: 'roboto',
                                            },
                                            splitLine: {
                                                show: true,
                                                lineStyle: {
                                                    color: 'rgba(0, 0, 0, .1)',
                                                },
                                            },


                                        },
                                        color: [
                                            {
                                                type: 'linear',
                                                x: 0,
                                                y: 0,
                                                x2: 0,
                                                y2: 1,
                                                colorStops: [
                                                    {
                                                        offset: 0,
                                                        color: themeColors[activeTheme].palette.primary.main, // color at 0% position
                                                    },
                                                    {
                                                        offset: 1,
                                                        color: 'rgba(255,255,255,0)', // color at 100% position
                                                    },
                                                ],
                                                global: false, // false by default
                                            },
                                        ],
                                    }}
                                />
                            </div>

                        </Paper>
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

export default withStyles(styleSheet)(HelthStatus)
