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
    TextField,
    InputAdornment,
    CircularProgress,
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
import SearchIcon from '@material-ui/icons/Search';

const styleSheet = (theme) => ({})

class ClinicSetup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
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

            loading: true,
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
                        <Grid container spacing={2}>
                        <Grid item lg={3} xs={12} className='mt-5'>
                            <h4 >Filters</h4>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                    </Grid>
                    
                        <Grid container="container" spacing={2} direction="row">
                            <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                <Grid container="container" spacing={2}>
                                    {/* Ven */}
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="status" />
                                       <Autocomplete
                                        disableClearable className="w-full" options={this.state.options}  getOptionLabel={(option) => option.title} renderInput={(params) => <TextField {...params} variant="outlined" size='small'/>}/>
                                    </Grid>
                                  
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                    <SubTitle title="Date" />
                                    <Autocomplete
                                        disableClearable className="w-full" options={this.state.options}  getOptionLabel={(option) => option.title} renderInput={(params) => <TextField {...params} variant="outlined" size='small'/>}/>
                                    </Grid>
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="Date Range" />
                                      <DatePicker/>
                                    </Grid>
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                        <SubTitle title="to" />
                                        <DatePicker/>
                                    </Grid>                                   
                                    <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                    <SubTitle title="Search" />
                                    <TextField className='' placeholder="Search"
                                            //variant="outlined"
                                            fullWidth="fullWidth" variant="outlined" size="small"  
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon></SearchIcon>
                                                    </InputAdornment>
                                                )
                                            }}/>
                                    </Grid>
                                
                                    
                                </Grid>
                                </Grid>
                                </Grid>

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
                                                    
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Table Section */}
                                <Grid container className="mt-3 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        {
                                        this.state.loading
                                            ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 10,
                                                page: this.state.page,
                                                // onTableChange: (action, tableState) => {
                                                //     console.log(action, tableState)
                                                //     switch (action) {
                                                //         case 'changePage':
                                                //             // this.setPage(     tableState.page )
                                                //             break
                                                //         case 'sort':
                                                //             //this.sort(tableState.page, tableState.sortOrder);
                                                //             break
                                                //         default:
                                                //             console.log('action not handled.')
                                                //     }
                                                // }
                                            }}></LoonsTable>
                                            : (
                                                //loading effect
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>
                                            )
                                    }
                                    </Grid>

                                    {/* Tempary Dashboard */}
                                    {/* Submit and Cancel Button */}
                                    
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
