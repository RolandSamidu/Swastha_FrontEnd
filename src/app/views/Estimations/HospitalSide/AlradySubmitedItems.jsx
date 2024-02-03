import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    Dialog,
    InputAdornment
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import moment from 'moment';

import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, timeParse, convertTocommaSeparated } from 'utils'
import SearchIcon from '@material-ui/icons/Search'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination from '@material-ui/lab/Pagination';
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    LoonsTable,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@mui/icons-material/Edit';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import * as appConst from '../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import localStorageService from 'app/services/localStorageService'
import Filters from '../Filters'
import SingalViewPharma from '../ReportsPharma/SingalViewPharma'
import SingalView from '../Reports/SingalView'

import HistoryIcon from '@mui/icons-material/History';
import EstimationItemHistory from './CPEstimateditemsViews/Estimation_item_History';
import FileSaver from 'file-saver'
import ReportService from 'app/services/ReportService'

const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
    root: {
        display: 'flex',
    },
    rootCell: {
        padding: '0px !important'
    }
})

class AlradySubmitedItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitting: false,
            loaded: false,
            alert: false,
            message: '',
            severity: 'success',
            totalItems: 0,
            totalPages: 0,
            openRows: {},
            isEditable: true,

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],

            filterData: {
                //warehouse_id: this.props.warehouse_id,
                //searh_type: 'searh_type',
                //used_for_estimates: 'Y',
                //not_in_sub_estimated: true,
                sub_estimation_id: this.props.id,
                page: 0,
                limit: 10,
                orderby_sr: true,
                //'order[0]': ['createdAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            data: [

            ],
            formData: {

            },
            data: [],
            estimationData: null,

            item_history_data: {
                page: 0,
                limit: 10,
                'order[0]': ['createdAt', 'DESC'],
            },
            selectedHistoryId: null,
            openItemHistory: false,


        }
    }


    handleRowToggle = async (rowId) => {

        this.setState({ isEditable: false })

        this.setState((prevState) => ({
            openRows: {
                //...prevState.openRows,
                [rowId]: !prevState.openRows[rowId]
            }
        }));
        this.setState({ isEditable: true })
    };


    async getHospitalEstimation(itemId) {
        let owner_id = await localStorageService.getItem('owner_id')
        let estimationYear = Number(this.props.EstimationData?.HosptialEstimation?.Estimation?.EstimationSetup?.year) - 1
        const firstDay = new Date(estimationYear, 0, 1);

        // Create a new Date object for the last day of the year
        // To get the last day of the year, go to the first day of the next year (January 1 of next year)
        const lastDay = new Date(estimationYear + 1, 0, 0);

        if (itemId) {
            let params = {
                owner_id: owner_id,
                item_id: itemId,
                //estimation_status: 'Active',
                //available_estimation: 'Active',
                //status: 'Active',
                //hospital_estimation_status: 'Active',
                estimation_from: dateParse(firstDay),
                estimation_to: dateParse(lastDay),
                estimation_type: 'Annual',
                search_type: 'EstimationMonthly'
            }

            let res = await EstimationService.getAllEstimationITEMS(params)
            if (res.status == 200) {
                console.log("loaded data estimation", res.data)
                this.setState({
                    estimationData: res.data?.view[0]
                })
                return true
            }
        }
    }


    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem('owner_id')
        let filterData = this.state.filterData
        // filterData.owner_id = owner_id
        let res = await EstimationService.getSubHospitalEstimationItems(filterData)

        if (res.status == 200) {
            console.log("all data", res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems, totalPages: res.data?.view?.totalPages, loaded: true })
        } else {
            this.setState({ loaded: true })

        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }


    async submit(data) {
        console.log("clicked data", data)
        var owner_id = await localStorageService.getItem('owner_id');
        const user = await localStorageService.getItem('userInfo');
        this.setState({ submitting: true })
        let formData = {
            owner_id: owner_id,
            created_by: user.id,
            sub_estimation_id: data.sub_estimation_id,
            item_id: data.item_id,
            jan: data.jan,
            feb: data.fab,
            mar: data.mar,
            apr: data.apr,
            may: data.may,
            june: data.june,
            july: data.july,
            aug: data.aug,
            sep: data.sep,
            oct: data.oct,
            nov: data.nov,
            dec: data.dec,
            estimation: data.estimation,
            remark: data.remark,
            stock_position: data.stock_position

        }

        let res = await EstimationService.EditSubHospitalEstimationItems(data.id, formData)
        console.log("Estimation Data added", res)
        if (res.status === 200) {

            let data = this.state.data
            let newdata = data.filter((x) => x.item_id != data.item_id)

            this.setState({
                data: newdata,
                alert: true,
                message: 'Estimation Edit successfully!',
                severity: 'success',
                submitting: false
            }
                , () => {
                    this.setPage(0)
                }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Estimation Edit was Unsuccessful!',
                severity: 'error',
                submitting: false
            })
        }


    }


    async componentDidMount() {
        let expected_date = this.props.EstimationData?.expected_date
        ReportService.checkReportLogins()
        console.log('cheking estimation items', this.props.EstimationData)

        if (this.props.EstimationData?.HosptialEstimation?.Estimation?.consumables === 'N') {
            this.setState({
                nonCons: true
            })
        }

        if (dateParse(expected_date) >= dateParse(new Date())) {
            this.setState({ isEditable: true })
        } else {
            this.setState({ isEditable: false })
        }
        this.loadData()
        //this.loadFilterData()
    }

    async downloadExcel() {
        this.setState({
            printloaded: true,
        })
        let id = '6efafe92-dbf7-02ad-2001-a49414b8498d'

        //let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        //var owner_id = await localStorageService.getItem('owner_id');

        let parameters = [

            { name: "sub_estimation_id", value: this.props.id },

        ]

        let bodyData = {
            template: 'excel',
            parameters: parameters,
        }
        let res = await ReportService.downloadReport(id, bodyData)

        const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
        FileSaver.saveAs(blob, 'report.xlsx')

        this.setState({
            printloaded: false,
        })
    }




    render() {
        const { classes } = this.props
        const { data, openRows } = this.state;
        return (
            < Fragment >
                <Filters onSubmit={(data) => {
                    let filterData = this.state.filterData
                    //filterData == { ...filterData, ...data }
                    Object.assign(filterData, data)
                    this.setState({ filterData }, () => {
                        this.setPage(0)
                    })
                }}></Filters>

                <div>
                    {this.state.loaded ?
                        <ValidatorForm className="w-full">


                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>SR No</TableCell>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Standard Cost</TableCell>
                                            {this.state.nonCons &&
                                                <TableCell>Stock on Hand</TableCell>
                                            }
                                            <TableCell>Total Forecasted Estimation</TableCell>
                                            <TableCell>Total Cost</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, index) => {
                                            let validate = false
                                            if (
                                                data[index].jan >= 0 &&
                                                data[index].feb >= 0 &&
                                                data[index].mar >= 0 &&
                                                data[index].apr >= 0 &&
                                                data[index].may >= 0 &&
                                                data[index].june >= 0 &&
                                                data[index].july >= 0 &&
                                                data[index].aug >= 0 &&
                                                data[index].sep >= 0 &&
                                                data[index].oct >= 0 &&
                                                data[index].nov >= 0 &&
                                                data[index].dec >= 0
                                            ) { validate = true }
                                            return (<React.Fragment key={row.item_id}>
                                                <TableRow>
                                                    <TableCell>
                                                        <IconButton
                                                            aria-label="expand row"
                                                            size="small"
                                                            onClick={() => this.handleRowToggle(row.item_id)}
                                                        >
                                                            {openRows[row.item_id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{row.ItemSnap?.sr_no}</TableCell>
                                                    <TableCell>{row.ItemSnap?.medium_description}</TableCell>
                                                    <TableCell>{convertTocommaSeparated(row.ItemSnap?.standard_cost, 2)}</TableCell>
                                                    {this.state.nonCons &&
                                                        <TableCell>
                                                            <TextValidator

                                                                //className=" w-full"
                                                                // placeholder="Received Qty"
                                                                disabled={!this.state.isEditable}
                                                                name="estimation"
                                                                InputLabelProps={{ shrink: false }}
                                                                value={this.state.data[index]?.stock_position}
                                                                type="number"
                                                                variant="outlined"
                                                                size="small"
                                                                onFocus={() => openRows[row.item_id] ? null : this.handleRowToggle(row.item_id)}
                                                                //onBlur={() => this.handleRowToggle(row.item_id)}
                                                                onChange={(e) => {
                                                                    let val = parseFloat(e.target.value)
                                                                    data[index].stock_position = val
                                                                    this.setState({
                                                                        data
                                                                    })
                                                                }}

                                                            />
                                                        </TableCell>
                                                    }
                                                    <TableCell>
                                                        <TextValidator

                                                            //className=" w-full"
                                                            // placeholder="Received Qty"
                                                            disabled={!this.state.isEditable}
                                                            name="estimation"
                                                            InputLabelProps={{ shrink: false }}
                                                            value={this.state.data[index]?.estimation}
                                                            type="number"
                                                            variant="outlined"
                                                            size="small"
                                                            onFocus={() => openRows[row.item_id] ? null : this.handleRowToggle(row.item_id)}
                                                            //onBlur={() => this.handleRowToggle(row.item_id)}
                                                            onChange={(e) => {


                                                                let enteredVal = parseFloat(e.target.value);
                                                                let divided_val = Math.floor(enteredVal / 12) * 12; // Round down to the nearest multiple of 12
                                                                let val = divided_val;

                                                                data[index].estimation = enteredVal
                                                                data[index].jan = val / 12
                                                                data[index].feb = val / 12
                                                                data[index].mar = val / 12
                                                                data[index].apr = val / 12
                                                                data[index].may = val / 12
                                                                data[index].june = val / 12
                                                                data[index].july = val / 12
                                                                data[index].aug = val / 12
                                                                data[index].sep = val / 12
                                                                data[index].oct = val / 12
                                                                data[index].nov = val / 12
                                                                data[index].dec = val / 12 + (enteredVal % 12)
                                                                data[index].edited = true
                                                                this.setState({
                                                                    data
                                                                })



                                                            }}

                                                        />
                                                    </TableCell>
                                                    <TableCell>{convertTocommaSeparated((row.ItemSnap?.standard_cost * (this.state.data[index]?.estimation || 0)), 2)}</TableCell>
                                                    <TableCell> {data[index].status}</TableCell>

                                                    <TableCell>
                                                        <div className='flex items-center' style={{ marginLeft: '-10px' }}>
                                                            {(validate && this.state.isEditable) &&
                                                                <Button
                                                                    style={{ height: 'fitContent' }}
                                                                    progress={this.submitting}
                                                                    disabled={data[index].edited ? false : true}

                                                                    onClick={() => {

                                                                        if ((Number(data[index].estimation) > (Number(this.state.estimationData?.estimation || 0) + Number(this.state.estimationData?.estimation || 0) * 10 / 100)) && (data[index]?.remark == null || data[index]?.remark == "")) {
                                                                            this.setState({
                                                                                alert: true,
                                                                                message: 'Your Total Estimation was Over the Limit. Pleace Enter the Remark',
                                                                                severity: 'error',
                                                                                submitting: false
                                                                            })

                                                                        } else {
                                                                            this.submit(data[index])
                                                                        }
                                                                    }}
                                                                    scrollToTop={true}

                                                                >
                                                                    <span className="capitalize">
                                                                        <span className="capitalize">
                                                                            Save
                                                                        </span>
                                                                    </span>
                                                                </Button>
                                                            }

                                                            <Tooltip title="Item History">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        // console.log('dhhdjakshadahdl',data[index])
                                                                        this.setState({
                                                                            selectedHistoryId: data[index]?.sub_estimation_id,
                                                                            openItemHistory: true,
                                                                            history_item_loading: true
                                                                        })

                                                                    }}>
                                                                    <HistoryIcon color='primary' />
                                                                </IconButton>
                                                            </Tooltip>


                                                        </div>

                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className={classes.rootCell} colSpan={9}>
                                                        <Collapse style={{ backgroundColor: '#d7dffa' }} in={openRows[row.item_id]} timeout="auto" unmountOnExit>
                                                            {/* Content you want to show when row is expanded */}
                                                            <div className='w-full px-10 py-5'>
                                                                <Grid container spacing={2}>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Jan"></SubTitle>
                                                                        <TextValidator

                                                                            // placeholder="Received Qty"
                                                                            name="jan"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.jan}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].jan = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Feb"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="feb"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.feb}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].feb = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Mar"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="mar"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.mar}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].mar = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Apr"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="apr"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.apr}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].apr = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="May"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="may"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.may}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].may = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="June"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="june"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.june}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].june = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="July"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="July"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.july}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].july = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Aug"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="aug"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.aug}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].aug = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Sep"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="sep"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.sep}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].sep = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Oct"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="oct"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.oct}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].oct = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Nov"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="nov"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.nov}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].nov = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Dec"></SubTitle>
                                                                        <TextValidator


                                                                            // placeholder="Received Qty"
                                                                            name="dec"
                                                                            disabled={!this.state.isEditable}
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.dec}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].dec = parseFloat(e.target.value)
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>

                                                                </Grid>

                                                                <div>
                                                                    <SubTitle title="Remark"></SubTitle>

                                                                    <Autocomplete
                                                                        disableClearable
                                                                        className="w-full"
                                                                        // ref={elmRef}
                                                                        value={(appConst.estimations_remarks.includes(this.state.data[index].remark) || this.state.data[index].remark == null) ? this.state.data[index].remark : 'Other'}
                                                                        options={appConst.estimations_remarks}
                                                                        onChange={(e, value) => {
                                                                            let data = this.state.data
                                                                            if (value == 'Other') {
                                                                                data[index].remark = ''
                                                                                data[index].edited = true
                                                                            } else {
                                                                                data[index].remark = value
                                                                                data[index].edited = true
                                                                            }

                                                                            this.setState({
                                                                                data
                                                                            })
                                                                        }}
                                                                        getOptionLabel={(option) => option}
                                                                        renderInput={(params) => (
                                                                            <TextValidator
                                                                                {...params}
                                                                                placeholder="Select Remark"
                                                                                //variant="outlined"
                                                                                fullWidth="fullWidth"
                                                                                variant="outlined"
                                                                                size="small"
                                                                            />
                                                                        )}
                                                                    />
                                                                    {((!appConst.estimations_remarks.includes(this.state.data[index].remark) && this.state.data[index].remark != null) || this.state.data[index].remark == 'Other') &&
                                                                        <TextValidator

                                                                            className='w-full'
                                                                            // placeholder="Received Qty"
                                                                            name="Remark"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.remark}
                                                                            multiline={true}
                                                                            rows={2}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].remark = e.target.value
                                                                                data[index].edited = true
                                                                                this.setState({
                                                                                    data
                                                                                })


                                                                            }}
                                                                        />
                                                                    }







                                                                </div>


                                                                <div>
                                                                    {/* <SingalViewPharma item_id={row.item_id} warehouse_id={this.props.warehouse_id} owner_id={this.state.owner_id} estimationYear={this.props.EstimationData?.HosptialEstimation?.Estimation?.EstimationSetup?.year}></SingalViewPharma> */}
                                                                    <SingalView item_id={row.item_id} sr_no={row.ItemSnap?.sr_no} owner_id={this.state.owner_id} estimationYear={this.props.EstimationData?.HosptialEstimation?.Estimation?.EstimationSetup?.year} estimationData={this.props.EstimationData?.HosptialEstimation}></SingalView>
                                                                </div>
                                                            </div>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </React.Fragment>)
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <div className="flex justify-end mt-3">
                                <ValidatorForm onSubmit={() => { this.setPage(this.state.filterData.page) }}>
                                    <TextValidator
                                        className='mt--1 w-100'

                                        name="Page"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.filterData.page + 1}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let filterData = this.state.filterData
                                            filterData.page = e.target.value - 1
                                            this.setState({ filterData })

                                        }}

                                    />
                                </ValidatorForm>
                                <Pagination count={this.state.totalPages} page={this.state.filterData.page + 1} onChange={(e, value) => { this.setPage(value - 1) }} />
                            </div>







                        </ValidatorForm>
                        :
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress
                                size={30}
                            />
                        </Grid>
                    }
                    <Button className="ml-3" progress={this.state.printloaded} onClick={() => { this.downloadExcel() }}>Download Estimation Sheet</Button>

                </div>


                <Dialog fullWidth maxWidth="lg" open={this.state.openItemHistory} onClose={() => { this.setState({ openItemHistory: false, viewCompleteEstimations: true }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Item Estimations History" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    openItemHistory: false,
                                    viewCompleteEstimations: true

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                        {this.state.history_item_loading ?

                            <EstimationItemHistory data={this.state.selectedHistoryId}></EstimationItemHistory>

                            :
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress
                                    size={30}
                                />
                            </Grid>
                        }
                    </MainContainer>
                </Dialog>




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

export default withStyles(styleSheet)(AlradySubmitedItems)