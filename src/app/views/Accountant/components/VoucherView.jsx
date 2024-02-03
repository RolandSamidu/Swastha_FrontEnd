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

class VoucherView extends Component {
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

            totalVoucherChartData: {
                labels: ['Gouse & Gloves', 'SPMC', 'LM', 'SPC'],
                data: [30, 70, 50, 50],
            },
            approvedVoucherChartData: {
                labels: ['Gouse & Gloves', 'SPMC', 'LM', 'SPC'],
                data: [30, 70, 50, 45],
            },
            certifiedVoucherChartData: {
                labels: ['Gouse & Gloves', 'SPMC', 'LM', 'SPC'],
                data: [30, 70, 50, 108],
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

        const { totalVoucherChartData, certifiedVoucherChartData, approvedVoucherChartData } = this.state;
        const totalVoucherChartOptions = {
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
                            // align: 'center',// Set the horizontal alignment to center
                            // verticalAlign: 'middle',
                        },
                    },
                    data: totalVoucherChartData.labels.map((label, index) => ({
                        value: totalVoucherChartData.data[index],
                        name: label,
                        label: {
                            show: true,
                            formatter: '{b}\n{c}',
                        },
                        itemStyle: {
                            borderWidth: 1,
                            color: ["#ffb400", "#d2980d", "#a57c1b", "#786028", "#363445", "#48446e", "#5e569b", "#776bcd", "#9080ff"][index % totalVoucherChartData.labels.length],
                            borderColor: '#fff',
                        },
                    })),
                    grid: {
                        top: '10%',
                        bottom: '15%',
                        left: '5%',
                        right: '5%',
                        containLabel: true
                    },
                },
            ],
        };

        const approvedVoucherChartOptions = {
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
                            // align: 'center',// Set the horizontal alignment to center
                            // verticalAlign: 'middle',
                        },
                    },
                    data: approvedVoucherChartData.labels.map((label, index) => ({
                        value: approvedVoucherChartData.data[index],
                        name: label,
                        label: {
                            show: true,
                            formatter: '{b}\n{c}',
                        },
                        itemStyle: {
                            borderWidth: 1,
                            color: ["#b30000", "#7c1158", "#4421af", "#1a53ff", "#0d88e6", "#00b7c7", "#5ad45a", "#8be04e", "#ebdc78"][index % approvedVoucherChartData.labels.length],
                            borderColor: '#fff',
                        },
                    })),
                    grid: {
                        top: '10%',
                        bottom: '15%',
                        left: '5%',
                        right: '5%',
                        containLabel: true
                    },
                },
            ],
        };

        const certifiedVoucherChartOptions = {
            series: [
                {
                    type: 'pie',
                    radius: ['50%', '70%'],
                    emphasis: {
                        label: {
                            show: true,
                            color: "#fff",
                            fontSize: '12',
                            // fontWeight: 'bold',
                            // align: 'center', // Set the horizontal alignment to center
                            // verticalAlign: 'middle',
                            // position: 'center',
                        },
                    },
                    data: certifiedVoucherChartData.labels.map((label, index) => ({
                        value: certifiedVoucherChartData.data[index],
                        name: label,
                        label: {
                            show: true,
                            formatter: '{b}\n{c}',
                        },
                        itemStyle: {
                            borderWidth: 1,
                            color: ["#e27c7c", "#a86464", "#6d4b4b", "#503f3f", "#333333", "#3c4e4b", "#466964", "#599e94", "#6cd4c5"][index % certifiedVoucherChartData.labels.length],
                            borderColor: '#fff',
                        },
                    })),
                    grid: {
                        top: '10%',
                        bottom: '15%',
                        left: '5%',
                        right: '5%',
                        containLabel: true
                    },
                },
            ],
        };

        return (
            <Fragment>
                <Grid container style={{ background: "#EA97BF", borderRadius: "12px", padding: "8px", height: "100%" }}>
                    <Grid container spacing={2} className="flex mb-5" style={{ flexWrap: "wrap" }}>
                        <Grid item lg={4} md={4} sm={4} xs={4}>
                            <LoonsCard>
                                <Grid container spacing={2} className="flex mb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h6" component="h6" style={{ color: "#2C0AE6", textAlign: "center" }}>
                                            Total No. of Vouchers
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h5" component="h5" style={{ color: "#E4122A", textAlign: "center" }}>
                                            240
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4}>
                            <LoonsCard>
                                <Grid container spacing={2} className="flex mb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h6" component="h6" style={{ color: "#2C0AE6", textAlign: "center" }}>
                                            No. of Approved Vouchers
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h5" component="h5" style={{ color: "#E4122A", textAlign: "center" }}>
                                            230
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>
                        <Grid item lg={4} md={4} sm={4} xs={4}>
                            <LoonsCard >
                                <Grid container spacing={2} className="flex mb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h6" component="h6" style={{ color: "#2C0AE6", textAlign: "center" }}>
                                            No. of Certified Vouchers
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h5" component="h5" style={{ color: "#E4122A", textAlign: "center" }}>
                                            225
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} className="flex mb-5 mt-5" style={{ overflow: "auto" }}>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <Grid container spacing={2} className='flex mb-2 mt-2'>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <ReactEcharts
                                        echarts={echarts}
                                        option={totalVoucherChartOptions}
                                        style={{ height: '250px', width: '100%' }}
                                    />
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <ReactEcharts
                                        echarts={echarts}
                                        option={certifiedVoucherChartOptions}
                                        style={{ height: '250px', width: '100%' }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ display: "flex", alignSelf: "center" }}>
                            <ReactEcharts
                                echarts={echarts}
                                option={approvedVoucherChartOptions}
                                style={{ height: '370px', width: '100%' }}
                            />
                        </Grid>
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

export default withStyles(styleSheet)(VoucherView)
