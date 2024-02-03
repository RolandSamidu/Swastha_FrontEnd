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

import BudgetView from './components/BudgetView'
import ApprovedPOView from './components/ApprovedPOView'
import VoucherView from './components/VoucherView'
import MonthlyView from './components/MonthlyView'

const styleSheet = (theme) => ({})

class AllView extends Component {
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
                        <br />
                        <Grid container spacing={2} className="flex mb-5" style={{ flexWrap: "wrap" }}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <BudgetView />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <MonthlyView />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <ApprovedPOView />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <VoucherView />
                            </Grid>
                        </Grid>
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

export default withStyles(styleSheet)(AllView)
