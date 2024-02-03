import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    IconButton,
    Icon,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import { SimpleCard } from 'app/components'

const styleSheet = (theme) => ({})

class ClinicSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            // data: [
            //     {
            //         seriesNumber: '1',
            //         groupName: 'Group 1',
            //         category: 'Category 1',
            //         shortReference: 'SH1',
            //     },
            //     {
            //         seriesNumber: '2',
            //         groupName: 'Group 2',
            //         category: 'Category 2',
            //         shortReference: 'SH2',
            //     },
            //     {
            //         seriesNumber: '3',
            //         groupName: 'Group 3',
            //         category: 'Category 3',
            //         shortReference: 'SH3',
            //     },
            // ],
            columns: [
                {
                    name: 'drug_store', // field name in the row object
                    label: 'ware house', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                    },
                },
                {
                    name: 'groupName',
                    label: 'Return request ID',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'category',
                    label: 'SR No',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'category',
                    label: 'SR Name',
                    options: {
                        // filter: true,
                    },
                }, {
                    name: 'category',
                    label: 'Return Qty',
                    options: {
                        // filter: true,
                    },
                },
               
                {
                    name: 'shortReference',
                    label: 'Custodian',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Custodian contact number',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Delivery mode',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Remarks',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'shortReference',
                    label: 'Remarks',
                    options: {
                        // filter: true,
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <IconButton
                                        className="text-black mr-2"
                                        onClick={null}
                                    >
                                        <Icon>mode_view_outline</Icon>
                                    </IconButton>
                                </>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],

            loading: false,
            formData: {
                seriesStartNumber: null,
                seriesEndNumber: null,
                itemGroupName: null,
                shortRef: null,
                description: null,
            },
        }
    }



   
    componentDidMount() {
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        {/* <CardTitle title="Clinic Setup" /> */}

                        <ValidatorForm
                            className="pt-2"
                         
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
                                        {/* Item Series heading */}
                                        
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                            
                                                {/* Submit and Cancel Button */}
                                                <Grid
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                            className=" w-full flex justify-end"
                                                        >
                                                            {/* Submit Button */}
                                                            <Button
                                                                className="mt-2 mr-2"
                                                                progress={false}
                                                                type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                //onClick={this.handleChange}
                                                            >
                                                                <span className="capitalize">
                                                                   Add New Custodian
                                                                </span>
                                                            </Button>
                                                          
                                                           
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Table Section */}
                                <Grid container className="mt-3 pb-5">
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
                                                
                                            }}
                                        ></LoonsTable>
                                    </Grid>

                                    {/* Tempary Dashboard */}
                                    {/* Submit and Cancel Button */}
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid
                                                item
                                                 lg={12}
                                               md={12}
                                                sm={12}
                                                xs={12}
                                                className=" w-full flex justify-end"
                                            >
                                                {/* Submit Button */}
                                                <Button
                                                    className="mt-2 mr-2"
                                                    progress={false}
                                                    // type="submit"
                                                    scrollToTop={true}
                                                    // startIcon="save"
                                                    
                                                >
                                                    <span className="capitalize">
                                                      Checkout
                                                    </span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>

                <LoonsSnackbar
                    open={this.state.alert}
                    
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

export default withStyles(styleSheet)(ClinicSetup)
