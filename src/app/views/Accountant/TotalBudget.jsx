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
    InputAdornment
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@material-ui/icons/Search';
import { CircularProgress } from '@material-ui/core'

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
import { SimpleCard } from 'app/components'
import { dateParse, roundDecimal } from 'utils'
import FinanceDocumentServices from 'app/services/FinanceDocumentServices'
import localStorageService from 'app/services/localStorageService'

const styleSheet = (theme) => ({})

class TotalBudget extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [
                {
                    year: dateParse(new Date()),
                    total_budget: '3000',
                    used_budget: "1000",
                    remaining_budget: "2000"
                },
                {
                    year: dateParse(new Date()),
                    total_budget: '3000',
                    used_budget: "1000",
                    remaining_budget: "2000"
                },
                {
                    year: dateParse(new Date()),
                    total_budget: '3000',
                    used_budget: "1000",
                    remaining_budget: "2000"
                },
            ],
            columns: [
                {
                    name: 'year', // field name in the row object
                    label: 'Year', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     return 0
                        // }
                    },
                },
                {
                    name: 'amount',
                    label: 'Total Budget',
                    options: {
                        // filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.amount;
                            return <p>{data ? roundDecimal(data, 2) : 'Not Available'}</p>
                        },
                    },
                },
                {
                    name: 'issued_amount',
                    label: 'Used Budget',
                    options: {
                        // filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = (this.state.data[dataIndex]?.issued_amount && this.state.data[dataIndex]?.allocated_amount) ? parseFloat(this.state.data[dataIndex]?.issued_amount) + parseFloat(this.state.data[dataIndex]?.allocated_amount) : 0;
                            return <p>{data ? roundDecimal(data, 2) : 'Not Available'}</p>
                        },
                    },
                },
                {
                    name: 'remaining_budget',
                    label: 'Remaining Budget',
                    options: {
                        // filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = (this.state.data[dataIndex]?.amount && this.state.data[dataIndex]?.issued_amount && this.state.data[dataIndex]?.allocated_amount) ? parseFloat(this.state.data[dataIndex]?.amount) - parseFloat(this.state.data[dataIndex]?.allocated_amount) - parseFloat(this.state.data[dataIndex]?.issued_amount) : 0;
                            return <p>{data ? roundDecimal(data, 2) : 'Not Available'}</p>
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
            // filterData: {
            //     seriesStartNumber: null,
            //     seriesEndNumber: null,
            //     itemGroupName: null,
            //     shortRef: null,
            //     description: null,
            // },

            formData: {
                budget: 0,
                allocated_amount: 0,
                issued_amount: 0,
                year: new Date().getFullYear(),
            },


            filterData: {
                limit: 20,
                page: 0,
                'order[0]': [
                    'updatedAt', 'DESC'
                ]
            },

            loaded: false,
            totalItems: 0
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let formData = this.state.filterData
        let res = await FinanceDocumentServices.getFinacneBudgetSetups(formData)
        if (res.status === 200) {
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loaded: true })
    }

    async saveStepOneSubmit() { }

    async SubmitAll() {
        let id = await localStorageService.getItem('userInfo')?.id
        let formData = { ...this.state.formData, created_by: id }
        console.log("FormData: ", formData)
        if (id) {
            let res = await FinanceDocumentServices.createFinacneBudgetSetups(formData)
            if (res.status === 201) {
                this.setState({
                    alert: true,
                    message: 'Finance Budget Setup was Successful',
                    severity: 'success',
                }, () => {
                    this.loadData()
                })
            } else {
                this.setState({
                    alert: true,
                    message: 'Cannot have two values for the same year',
                    severity: 'error',
                })
            }
        } else {
            this.setState({
                alert: true,
                message: 'ID is not present in the Local Storage to continue',
                severity: 'error',
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadData()
        })
    }

    // handleFileSelect = (event) => {
    //     const { selectedFiles, selectedFileList } = this.props
    //     let files = event.target.files

    //     this.setState({ files: files }, () => {
    //         console.log('files', this.state.files)
    //     })
    // }

    clearField = () => {
        let formData = this.state.formData;
        if (formData.allocated_amount === 0 && formData.budget === 0 && formData.issued_amount === 0 && formData.year === new Date().getFullYear()) {
            this.setState({
                // loading: false,
                alert: true,
                message: 'Filters have been cleared already',
                severity: 'info',
            })
        } else {
            formData.allocated_amount = 0;
            formData.budget = 0;
            formData.year = new Date().getFullYear()
            formData.issued_amount = 0

            this.setState({
                formData,
                key: Date.now(),
            })

            this.setState({
                // loading: false,
                alert: true,
                message: 'Filters have been cleared',
                severity: 'info',
            })
        }
    }


    componentDidMount() {
        this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    {/* Filtr Section */}
                    <LoonsCard>
                        <CardTitle title="Total Budget" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.SubmitAll()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                                {/* Serial Number*/}
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Year" />
                                                    <div style={{ height: "5px", margin: 0, padding: 0 }}></div>
                                                    <DatePicker
                                                        style={{ border: '1px solid #e5e7eb', borderRadius: 5 }}
                                                        key={this.state.key}
                                                        className="w-full"
                                                        onChange={(date) => {
                                                            let formData = this.state.formData
                                                            formData.year = date.getFullYear()
                                                            this.setState({ formData })
                                                            console.log(this.state.formData.year)
                                                        }}
                                                        format="yyyy"
                                                        openTo='year'
                                                        views={["year"]}
                                                        value={new Date(this.state.formData.year, 0, 1)}
                                                        placeholder="Year"
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Request ID*/}
                                        <Grid
                                            style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        > <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Total Budget For this Year" />
                                                    <TextValidator
                                                        key={this.state.key}
                                                        className=" w-full"
                                                        placeholder="Total Budget"
                                                        name="budget"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={String(this.state.formData.budget)}
                                                        type="number"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.budget = parseInt(e.target.value, 10)
                                                            this.setState({ formData })
                                                        }}
                                                        validators={
                                                            ['minNumber:' + 0, 'required:' + true]}
                                                        errorMessages={[
                                                            'Budget Should be > 0',
                                                            'this field is required'
                                                        ]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        > <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Allocated Amount" />
                                                    <TextValidator
                                                        key={this.state.key}
                                                        className=" w-full"
                                                        placeholder="Allocated Amount"
                                                        name="allocated_amount"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={String(this.state.formData.allocated_amount)}
                                                        type="number"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.allocated_amount = parseInt(e.target.value, 10)

                                                            this.setState({ formData })
                                                        }}
                                                        validators={
                                                            ['minNumber:' + 0, 'required:' + true]}
                                                        errorMessages={[
                                                            'Budget Should be > 0',
                                                            'this field is required'
                                                        ]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        > <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Issued Amount" />
                                                    <TextValidator
                                                        key={this.state.key}
                                                        className=" w-full"
                                                        placeholder="Issued Amount"
                                                        name="issued_amount"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={String(this.state.formData.issued_amount)}
                                                        type="number"
                                                        variant="outlined"
                                                        size="small"
                                                        min={0}
                                                        onChange={(e) => {
                                                            let formData = this.state.formData
                                                            formData.issued_amount = parseInt(e.target.value, 10)

                                                            this.setState({ formData })
                                                        }}
                                                        validators={
                                                            ['minNumber:' + 0, 'required:' + true]}
                                                        errorMessages={[
                                                            'Budget Should be > 0',
                                                            'this field is required'
                                                        ]}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* Submit and Cancel Button */}
                                        <Grid
                                            style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
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
                                                        scrollToTop={
                                                            true
                                                        }
                                                        color="#d8e4bc"
                                                        startIcon="cached"
                                                        style={{ backgroundColor: '#2e8b57' }}
                                                        onClick={this.clearField}
                                                    >
                                                        <span className="capitalize">
                                                            Reset
                                                        </span>
                                                    </Button>
                                                    <Button
                                                        className="mt-2"
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="save"
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Add
                                                        </span>
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* Table Section */}
                                <Grid container className="mt-3 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Divider className='mt-2' />
                                        {this.state.loaded ?
                                            (
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allAptitute'}
                                                    data={this.state.data}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        serverSide: true,
                                                        rowsPerPage: this.state.filterData.limit,
                                                        page: this.state.filterData.page,
                                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                        selectableRows: false,
                                                        onTableChange: (
                                                            action,
                                                            tableState
                                                        ) => {
                                                            console.log(
                                                                action,
                                                                tableState
                                                            )
                                                            switch (action) {
                                                                case 'changePage':
                                                                    this.setPage(tableState.page)
                                                                    break
                                                                case 'changeRowsPerPage':
                                                                    let formData = this.state.filterData
                                                                    formData.limit = tableState.rowsPerPage
                                                                    this.setState({ formData })
                                                                    this.setPage(0)
                                                                    break;
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
                                            ) : (
                                                <Grid className='justify-center text-center w-full pt-12'>
                                                    <CircularProgress size={30} />
                                                </Grid>
                                            )
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>
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

export default withStyles(styleSheet)(TotalBudget)
