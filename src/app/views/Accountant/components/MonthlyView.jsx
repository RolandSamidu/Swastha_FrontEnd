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

class MonthlyView extends Component {
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
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                data: [100, 140, 230, 100, 130, 220, 120, 210, 200, 120, 190, 150]
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
            xAxis: {
                type: 'category',
                data: chartData.labels,
                axisLine: {
                    lineStyle: {
                        color: '#333',
                    },
                },
                axisLabel: {
                    color: '#333',
                    interval: 0,
                    rotate: 45,
                    margin: 10,
                },
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#333',
                    },
                },
                axisLabel: {
                    color: '#333',
                },
            },
            series: [
                {
                    type: 'line',
                    data: chartData.data,
                    lineStyle: {
                        color: 'blue',
                        width: 2,
                    },
                    itemStyle: {
                        color: 'blue',
                    },
                    label: {
                        show: true,
                        position: 'top',
                        color: 'blue',
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: 'rgba(30, 144, 255, 0.8)',
                                },
                                {
                                    offset: 1,
                                    color: 'rgba(255, 255, 255, 0)',
                                },
                            ],
                        },
                    },
                },
            ],
            grid: {
                top: '10%',
                left: '3%',
                right: '3%',
                bottom: '3%',
                containLabel: true,
            },
        };

        return (
            <Fragment>
                <Grid container style={{ background: "#FFF", borderRadius: "12px", padding: "8px", height: "100%" }}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
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

export default withStyles(styleSheet)(MonthlyView)
