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
    InputAdornment,
    Card
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import SearchIcon from '@material-ui/icons/Search';
import { CircularProgress } from '@material-ui/core'
import BusinessIcon from '@mui/icons-material/Business';
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';
import { Typography } from '@material-ui/core'

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

class ApprovedPOView extends Component {
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

            chartData: {
                labels: ['Gouse & Gloves', 'LM', 'SPMC'],
                data: [30, 50, 70],
            },

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

        const { chartData } = this.state;
        const chartOptions = {
            series: [
                {
                    type: 'pie',
                    radius: ['50%', '70%'],
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '12',
                            color: "#fff",
                            // fontWeight: 'bold',
                        },
                    },
                    data: chartData.labels.map((label, index) => ({
                        value: chartData.data[index],
                        name: label,
                        label: {
                            show: true,
                            formatter: '{b}\n{c}',
                        },
                        itemStyle: {
                            borderWidth: 1,
                            borderColor: '#fff',
                            color: ["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"][index % chartData.labels.length]
                        },
                    })),
                },
            ],
        };

        return (
            <Fragment>
                <Grid container style={{ background: "#DBC499", borderRadius: "12px", padding: "8px", height: "100%" }}>
                    <Grid container spacing={2} className="flex mb-5" style={{ flexWrap: "wrap" }}>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <LoonsCard>
                                <Grid container spacing={2} className="flex mb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h6" component="h6" style={{ color: "#2C0AE6" }}>
                                            Total No. of PO
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={10} md={10} sm={10} xs={10} style={{ alignSelf: "center" }}>
                                                <Typography variant="h5" component="h5" style={{ color: "#E4122A", textAlign: "center" }}>
                                                    156
                                                </Typography>
                                            </Grid>
                                            <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <BusinessIcon style={{ width: "36px", height: "36px" }} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <LoonsCard >
                                <Grid container spacing={2} className="flex mb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h6" component="h6" style={{ color: "#2C0AE6" }}>
                                            No. of Approved PO
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={10} md={10} sm={10} xs={10} style={{ alignSelf: "center" }}>
                                                <Typography variant="h5" component="h5" style={{ color: "#E4122A", textAlign: "center" }}>
                                                    150
                                                </Typography>
                                            </Grid>
                                            <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <BusinessIcon style={{ width: "36px", height: "36px" }} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} className="flex mb-5 mt-5">
                        <ReactEcharts
                            echarts={echarts}
                            option={chartOptions}
                            style={{ height: '400px', width: '100%' }}
                        />
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

export default withStyles(styleSheet)(ApprovedPOView)
