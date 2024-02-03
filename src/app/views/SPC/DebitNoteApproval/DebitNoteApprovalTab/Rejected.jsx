import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import VisibilityIcon from '@material-ui/icons/Visibility'
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
    InputAdornment,
    IconButton,
    Icon,
    Typography,
    CircularProgress,
    Tooltip
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import localStorageService from 'app/services/localStorageService'
import LocalPurchaseServices from 'app/services/LocalPurchaseServices'

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
import * as appConst from '../../../../../appconst'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import { SimpleCard } from 'app/components'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse, includesArrayElements, roundDecimal } from 'utils'
import ConsignmentService from 'app/services/ConsignmentService'

const styleSheet = (theme) => ({})

class DebitNoteApprovalPending extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            role: null,
            totalItems: 0,
            userRoles: [],

            data: [],
            columns: [

                {
                    name: 'status',
                    label: 'Action',
                    options: {
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {

                            return (
                                <Grid className="w-full flex" >

                                    <Grid container spacing={1} style={{ display: 'contents' }}>
                                        <Grid item className="mt-2">
                                            <Tooltip title="Approve">
                                                <IconButton
                                                    onClick={() => {
                                                        window.location.href = ` /spc/debit_note_approval_single_view/${this.state.data[dataIndex]?.debit_note_id}/${this.state.data[dataIndex]?.id}/${this.state.data[dataIndex]?.DebitNote?.consignment_id}`
                                                    }}
                                                    color='primary'
                                                    className="px-2"
                                                    size="small"
                                                    aria-label="View Item Stocks"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                                {/* <Button
                                                        onClick={() => this.handleApproval(tableMeta.rowIndex)}
                                                        // disabled={disbaleApprove}
                                                        //startIcon="thumb_up"
                                                        variant="contained"
                                                    >
                                                        Approve
                                                    </Button> */}
                                            </Tooltip>
                                        </Grid>
                                        {/* 
                                            <Grid item className="mt-2">
                                                <Tooltip title="Reject">
                                                    <Button
                                                        onClick={() => this.handleReject(tableMeta.rowIndex)}
                                                        // disabled={disbaleApprove}
                                                        //startIcon="thumb_down"
                                                        variant="contained"
                                                        color="secondary"
                                                    >
                                                        Reject
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                             */}
                                    </Grid>

                                </Grid>
                            )
                        }
                    }
                },
                {
                    name: 'debit_note_no',
                    label: 'Debit Note Number',
                    options: {
                        display: true,
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            console.log('checking data', this.state.data)
                            return (
                                this.state.data[dataIndex]?.DebitNote?.debit_note_no
                            )
                        }
                    }
                },
                {
                    name: 'owner_id',
                    label: 'Owner Id',
                    options: {
                        display: true,
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (

                                this.state.data[dataIndex]?.owner_id

                            )
                        }
                    }
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (

                                this.state.data[dataIndex]?.DebitNote?.status

                            )
                        }
                    }
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        display: true,
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (

                                this.state.data[dataIndex]?.DebitNote?.type

                            )
                        }
                    }
                },
                {
                    name: 'debit_note_type',
                    label: 'Debit Note Type',
                    options: {
                        display: true,
                        filter: false,
                        customBodyRenderLite: (dataIndex) => {
                            return (

                                this.state.data[dataIndex]?.DebitNote?.debit_note_type

                            )
                        }
                    }
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

            groupStatus: [],

            category: [
                { label: 'Pharmaceutical' },
                { label: 'Surgical' },
            ],

            formData: {
                debit_note_no: "",
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                status: 'REJECTED',
                search: null,
            },
        }
    }

    async loadData() {
        this.setState({ loading: false })
        let params = this.state.formData

        let res = await ConsignmentService.getDabitNoteApproval(params)

        if (res.status === 200) {
            console.log('checking aprival data', res)
            let filterdData = []
            if (includesArrayElements(this.state.userInfo?.roles, ['SPC MA'])) {
                filterdData = res.data?.view?.data
            } else {
                filterdData = res.data.view.data.filter((index) => this.state.userInfo?.roles[0] === index?.approval_user_type)
            }
            this.setState({
                data: filterdData,
                totalItems: res.data.view.totalItems,
                loading: true
            })
        }
    }


    getUserInformation = async () => {
        let user = localStorageService.getItem("userInfo")
        this.setState({
            userInfo: user
        }, () => {
            this.loadData()
        })
        console.log('cheking user', user)
    }

    async componentDidMount() {
        this.getUserInformation()
    }

    setPage(page) {
        let fd = this.state.formData
        fd.page = page

        this.setState({
            fd
        }, () => {
            this.loadData()
        })
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <CardTitle title="Debit Note Rejected" />

                    <ValidatorForm
                        className="pt-2"
                        onSubmit={() => this.setPage(0)}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} className='mb-10' sm={12} md={12} lg={12}>
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
                                                lg={4}
                                                md={4}
                                                sm={6}
                                                xs={12}
                                            >
                                                <SubTitle title="Debit Note Number" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Debit Note Number"

                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.formData
                                                            .debit_note_no
                                                    }
                                                    type="text"
                                                    variant="outlined"
                                                    size="small"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            formData: {
                                                                ...this
                                                                    .state
                                                                    .formData,
                                                                debit_note_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }}
                                                    InputProps={{
                                                        endAdornment: (
                                                            <InputAdornment position="end">
                                                                <SearchIcon></SearchIcon>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />
                                            </Grid>

                                            <Grid
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                item
                                                lg={8}
                                                md={8}
                                                sm={6}
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
                                                            className="mt-2"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="search"
                                                        //onClick={this.handleChange}
                                                        >
                                                            <span className="capitalize">
                                                                Search
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>

                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <br />
                            {/* Table Section */}
                            {this.state.loading ?
                                <Grid container className="mt-5 pb-5">
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                count: this.state.totalItems,
                                                pagination: true,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,
                                                serverSide: true,
                                                print: true,
                                                viewColumns: true,
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                download: true,
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
                                                            this.setPage(
                                                                tableState.page
                                                            )
                                                            break
                                                        case 'changeRowsPerPage':
                                                            let formaData = this.state.formData;
                                                            formaData.limit = tableState.rowsPerPage;
                                                            this.setState({ formaData })
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
                                    </Grid>
                                </Grid>
                                :
                                (
                                    <Grid className='justify-center text-center w-full pt-12'>
                                        <CircularProgress size={30} />
                                    </Grid>
                                )
                            }
                        </Grid>
                    </ValidatorForm>
                </div>
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

export default withStyles(styleSheet)(DebitNoteApprovalPending)
