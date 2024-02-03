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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import DnsIcon from '@mui/icons-material/Dns';
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

class BudgetView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            data: [],

            alert: false,
            message: '',
            severity: 'success',

            patient_pic: null,
            all_district: [],
            all_moh: [],
            all_phm: [],
            all_gn: [],

            // filterData: {
            //     seriesStartNumber: null,
            //     seriesEndNumber: null,
            //     itemGroupName: null,
            //     shortRef: null,
            //     description: null,
            // },


            formData: {
                year: new Date().getFullYear(),
                limit: 20,
                page: 0,
                'order[0]': [
                    'updatedAt', 'DESC'
                ]
            },

            totalBudget: 0,
            usedBudget: 0,
            remainingBudget: 0,

            loaded: false,
            totalItems: 0
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let formData = this.state.formData
        let res = await FinanceDocumentServices.getFinacneBudgetSetups(formData)
        if (res.status === 200) {
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }
        this.getData()

        this.setState({ loaded: true })
    }

    getData() {
        let total_budget = 0
        let used_budget = 0
        let remaining_budget = 0

        if (Array.isArray(this.state.data)) {
            total_budget = this.state.data[0]?.amount
            if (this.state.data[0]?.issued_amount && this.state.data[0]?.allocated_amount) {
                used_budget = parseFloat(this.state.data[0]?.issued_amount) + parseFloat(this.state.data[0]?.allocated_amount)
                if (this.state.data[0]?.amount) {
                    remaining_budget = parseFloat(this.state.data[0]?.amount) - parseFloat(this.state.data[0]?.allocated_amount) - parseFloat(this.state.data[0]?.issued_amount)
                }
            }
        }

        this.setState({ totalBudget: total_budget, usedBudget: used_budget, remainingBudget: remaining_budget })
    }

    // handleFileSelect = (event) => {
    //     const { selectedFiles, selectedFileList } = this.props
    //     let files = event.target.files

    //     this.setState({ files: files }, () => {
    //         console.log('files', this.state.files)
    //     })
    // }

    componentDidMount() {
        this.loadData()
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <Grid container style={{ background: "#DAF5F2", borderRadius: "12px", padding: "8px", height: "100%" }}>
                    <Grid container spacing={1} className="flex mb-5 mt-5 mr-2 ml-2">
                        <Grid item lg={10} md={10} sm={10} xs={10} style={{ alignSelf: "center" }}>
                            <Typography variant="h6" component="h6">
                                Total Budget :  {this.state.loaded ? this.state.totalBudget.toLocaleString('en-US', { style: 'currency', currency: 'LKR' }) : "LKR 0.00"}
                            </Typography>
                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                            <AccountBalanceIcon sx={{ height: "48px", width: "48px" }} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} className="flex mb-5" style={{ flexWrap: "wrap" }}>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ height: "100%" }}>
                            <LoonsCard>
                                <Grid container spacing={2} className="flex mb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h6" component="h6" style={{ color: "#2C0AE6" }}>
                                            Used Budget
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={10} md={10} sm={10} xs={10} style={{ alignSelf: "center" }}>
                                                <Typography variant="h6" component="h6">
                                                    {this.state.loaded ? this.state.usedBudget.toLocaleString('en-US', { style: 'currency', currency: 'LKR' }) : "LKR 0.00"}
                                                </Typography>
                                            </Grid>
                                            <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <DnsIcon style={{ width: "36px", height: "36px" }} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>
                        <Grid item lg={6} md={6} sm={6} xs={6} style={{ height: "100%" }}>
                            <LoonsCard>
                                <Grid container spacing={2} className="flex mb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Typography variant="h6" component="h6" style={{ color: "#2C0AE6" }}>
                                            Remaining Budget
                                        </Typography>
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <Grid container spacing={2}>
                                            <Grid item lg={10} md={10} sm={10} xs={10} style={{ alignSelf: "center" }}>
                                                <Typography variant="h6" component="h6">
                                                    {this.state.loaded ? this.state.remainingBudget.toLocaleString('en-US', { style: 'currency', currency: 'LKR' }) : "LKR 0.00"}
                                                </Typography>
                                            </Grid>
                                            <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: "flex", justifyContent: "flex-end" }}>
                                                <DnsIcon style={{ width: "36px", height: "36px" }} />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </LoonsCard>
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

export default withStyles(styleSheet)(BudgetView)
