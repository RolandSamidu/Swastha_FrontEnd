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

import { Autocomplete, Alert } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse, convertTocommaSeparated } from 'utils'
import SearchIcon from '@material-ui/icons/Search'

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

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination from '@material-ui/lab/Pagination';

import MuiDialogTitle from '@material-ui/core/DialogTitle';
import EstimationService from 'app/services/EstimationService'
import InventoryService from 'app/services/InventoryService'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import localStorageService from 'app/services/localStorageService'
import AlradyEstimatedWarehouseView from '../CPEstimateditemsViews/AlradyEstimatedWarehouseView'
import Filters from '../../Filters'

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
        '& > *': {
            borderBottom: 'unset',
        },
    },
    rootCell: {
        padding: '0px !important'
    }
})

class HospitalItemsList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditable: false,
            rows: [
                { id: 1, name: 'John', age: 25 },
                { id: 2, name: 'Jane', age: 30 },
                // ... other rows
            ],
            openRows: {},
            actions: [],
            hospital_estimation_approvals_id: null,
            sequence: null,
            remark: null,

            submitting: false,
            loaded: false,
            alert: false,
            message: '',
            severity: 'success',
            totalItems: 0,
            totalPages: 0,

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],

            filterData: {
                //warehouse_id: this.props.warehouse_id,
                //searh_type: 'searh_type',
                //used_for_estimates: 'Y',
                //not_in_sub_estimated: true,
                hospital_estimation_id: this.props.id,
                'order[0]': ['estimation', 'ASC'],
                page: 0,
                limit: 10,
                //orderby_sr: true
            },
            edit: false,
            editEstimationId: null,
            selected_view_data: null,
            viewCompleteEstimations: false,
            formData: {

            },
            data: [],


        }
    }

    handleRowToggle = (rowId) => {
        this.setState((prevState) => ({
            openRows: {
                //...prevState.openRows,
                [rowId]: !prevState.openRows[rowId]
            }
        }));
    };

    async loadEstimations(data) {
        let item_ids = data.map((x) => x.item_id)


        let params = {
            hospital_estimation_id: this.props.id,
            item_id: item_ids
        }

        let res = await EstimationService.getSubHospitalEstimationItems(params)

        if (res.status == 200) {
            console.log("all estimation data", res.data.view.data);
            let estimatedData = res.data?.view?.data


            let reArrangeData = [];

            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let ItemEstimations = estimatedData.filter((x => x.item_id == element.item_id))
                let sum_jan = 0
                let sum_feb = 0
                let sum_mar = 0
                let sum_apr = 0
                let sum_may = 0
                let sum_june = 0
                let sum_july = 0
                let sum_aug = 0
                let sum_sep = 0
                let sum_oct = 0
                let sum_nov = 0
                let sum_dec = 0
                let sum_estimation = 0
                let sum_stock_position = 0
                if (ItemEstimations.length > 0) {
                    for (let i = 0; i < ItemEstimations.length; i++) {
                        const e = ItemEstimations[i];

                        sum_jan += parseFloat(e.jan)
                        sum_feb += parseFloat(e.feb)
                        sum_mar += parseFloat(e.mar)
                        sum_apr += parseFloat(e.apr)
                        sum_may += parseFloat(e.may)
                        sum_june += parseFloat(e.june)
                        sum_july += parseFloat(e.july)
                        sum_aug += parseFloat(e.aug)
                        sum_sep += parseFloat(e.sep)
                        sum_oct += parseFloat(e.oct)
                        sum_nov += parseFloat(e.nov)
                        sum_dec += parseFloat(e.dec)
                        sum_estimation += parseFloat(e.estimation)
                        sum_stock_position += parseFloat(e.stock_position)

                    }

                }

                let temp = {
                    ItemSnap: element.ItemSnap,
                    item_id: element.item_id,
                    hospital_estimation_id: element.hospital_estimation_id,
                    hospital_estimation_item_id: element.id,
                    status: element.status,
                    jan: element.estimation != 0 ? Number(element.jan) : sum_jan,
                    feb: element.estimation != 0 ? Number(element.feb) : sum_feb,
                    mar: element.estimation != 0 ? Number(element.mar) : sum_mar,
                    apr: element.estimation != 0 ? Number(element.apr) : sum_apr,
                    may: element.estimation != 0 ? Number(element.may) : sum_may,
                    june: element.estimation != 0 ? Number(element.june) : sum_june,
                    july: element.estimation != 0 ? Number(element.july) : sum_july,
                    aug: element.estimation != 0 ? Number(element.aug) : sum_aug,
                    sep: element.estimation != 0 ? Number(element.sep) : sum_sep,
                    oct: element.estimation != 0 ? Number(element.oct) : sum_oct,
                    nov: element.estimation != 0 ? Number(element.nov) : sum_nov,
                    dec: element.estimation != 0 ? Number(element.dec) : sum_dec,
                    estimation: element.estimation != 0 ? Number(element.estimation) : sum_estimation,
                    stock_position: element.stock_position != 0 ? Number(element.stock_position) : sum_stock_position,
                    remark: element.remark,
                    sum_estimations: sum_estimation,
                    sum_stock_positions: sum_stock_position,
                    ItemEstimations: ItemEstimations

                }
                reArrangeData.push(temp)

            }




            this.setState({ data: reArrangeData, loaded: true })
        } else {
            this.setState({ loaded: true })

        }
    }



    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem('owner_id')
        let filterData = this.state.filterData
        // filterData.owner_id = owner_id
        let res = await EstimationService.getAllEstimationITEMS(filterData)

        if (res.status == 200) {
            console.log("all data", res.data.view.data);

            if (res.data.view.data[0]?.HosptialEstimation?.Estimation?.consumables === "N") {
                this.setState({
                    nonCons: true
                })
            }

            this.setState({ totalItems: res.data?.view?.totalItems, totalPages: res.data?.view?.totalPages, owner_id: res.data?.view?.data[0]?.HosptialEstimation?.Warehouse?.owner_id })
            this.loadEstimations(res.data?.view?.data)

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
            status: 'Submited',
            owner_id: owner_id,
            created_by: user.id,
            //item_id: data.item_id,
            jan: data.jan,
            feb: data.feb,
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

        let res = await EstimationService.addEstimationToItems(data.hospital_estimation_item_id, formData)
        console.log("Estimation Data added", res)
        if (res.status === 200) {

            let data = this.state.data

            this.setState({
                alert: true,
                message: 'Estimation Submit successfully!',
                severity: 'success',
                submitting: false
            }
                , () => {
                    this.loadData()
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


    async submitAction(status) {
        var owner_id = await localStorageService.getItem('owner_id');
        const user = await localStorageService.getItem('userInfo');
        let data = {
            hospital_estimation_id: this.props.id,
            status: status,
            approved_by: user.id,
            remark: this.state.remark,
            owner_id: owner_id,
            sequence: this.state.sequence
        }

        let res = await EstimationService.EditEstimationsApprovals(this.state.hospital_estimation_approvals_id, data)
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Approved",
            },
                () => {
                    window.location = `/estimation/director/hospital_estimations_list`

                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
            })
        }
    }


    async loadActions() {
        //let owner_id = await localStorageService.getItem('owner_id')
        let user_info = await localStorageService.getItem('userInfo')

        let filterData = {
            hospital_estimation_id: this.props.id,
            status: 'Pending',
            approval_user_type: user_info.roles[0]

        }
        let res = await EstimationService.getEstimationsApprovals(filterData)

        if (res.status == 200) {
            console.log("all data of actions", res.data.view.data);

            this.setState({
                hospital_estimation_approvals_id: res?.data?.view?.data[0]?.id,
                actions: res?.data?.view?.data[0]?.MSDApprovalConfig?.available_actions,
                sequence: res?.data?.view?.data[0]?.MSDApprovalConfig?.sequence
            })

        }
    }


    async componentDidMount() {

        console.log('cheking props', this.props)
        this.loadData()
        this.loadActions()
        //this.loadFilterData()
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
                        <ValidatorForm className="w-full mt-5">


                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>SR No
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => {
                                                        let filterData = this.state.filterData
                                                        if (filterData.orderby_sr == null) {
                                                            filterData.orderby_sr = true
                                                            this.setState({ filterData },()=>{this.setPage(0)})
                                                        }
                                                    }
                                                    }
                                                >
                                                    {this.state.filterData.orderby_sr ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>


                                            </TableCell>
                                            <TableCell>Item Name</TableCell>

                                            <TableCell>Standard Cost</TableCell>
                                            {this.state.nonCons &&
                                                <TableCell>Stock on Hand</TableCell>
                                            }
                                            <TableCell>Total Estimation
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => {
                                                        let filterData = this.state.filterData
                                                        filterData.orderby_sr = null
                                                        if (filterData['order[0]'][1] == 'DESC') {
                                                            filterData['order[0]'] = ['estimation', 'ASC']

                                                        } else {
                                                            filterData['order[0]'] = ['estimation', 'DESC']
                                                        }
                                                        this.setState({ filterData }, () => {
                                                            this.setPage(0)
                                                        })
                                                    }
                                                    }
                                                >
                                                    {this.state.filterData['order[0]'][1] == 'DESC' ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>Total Cost</TableCell>
                                            {/* 
                                            <TableCell>Submited Warehouses</TableCell>
                                            <TableCell>Pharmacy Estimations</TableCell> */}
                                            <TableCell>Status</TableCell>

                                            {/* <TableCell>Actions</TableCell> */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, index) => {
                                            let validate = false
                                            if (
                                                data[index].jan &&
                                                data[index].feb &&
                                                data[index].mar &&
                                                data[index].apr &&
                                                data[index].may &&
                                                data[index].june &&
                                                data[index].july &&
                                                data[index].aug &&
                                                data[index].sep &&
                                                data[index].oct &&
                                                data[index].nov &&
                                                data[index].dec
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
                                                                disabled={!this.state.isEditable}
                                                                //className=" w-full"
                                                                placeholder="Stock on Hand"
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
                                                                    // data[index].jan = val / 12
                                                                    // data[index].feb = val / 12
                                                                    // data[index].mar = val / 12
                                                                    // data[index].apr = val / 12
                                                                    // data[index].may = val / 12
                                                                    // data[index].june = val / 12
                                                                    // data[index].july = val / 12
                                                                    // data[index].aug = val / 12
                                                                    // data[index].sep = val / 12
                                                                    // data[index].oct = val / 12
                                                                    // data[index].nov = val / 12
                                                                    // data[index].dec = val / 12
                                                                    this.setState({
                                                                        data
                                                                    })



                                                                }}

                                                            />
                                                        </TableCell>
                                                    }
                                                    <TableCell>
                                                        <TextValidator
                                                            disabled={!this.state.isEditable}
                                                            //className=" w-full"
                                                            // placeholder="Received Qty"
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
                                                                data[index].dec = (val / 12) + (enteredVal % 12)
                                                                this.setState({
                                                                    data
                                                                })



                                                            }}

                                                        />
                                                    </TableCell>
                                                    <TableCell>{convertTocommaSeparated((row.ItemSnap?.standard_cost * (this.state.data[index]?.estimation || 0)), 2)}</TableCell>
                                                    {/*  <TableCell> {data[index].ItemEstimations.length}</TableCell>
                                                    <TableCell> {data[index].sum_estimations}</TableCell>
                                                    */}
                                                    <TableCell> {data[index].status}</TableCell>
                                                    {/* <TableCell>
                                                        <div className='flex items-center' style={{ marginLeft: '-10px' }}>


                                                            {data[index].ItemEstimations.length > 0 &&
                                                                <Tooltip title="View All Estimations">
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                selected_view_data: data[index].ItemEstimations,
                                                                                viewCompleteEstimations: true
                                                                            })
                                                                        }}>
                                                                        <VisibilityIcon color='primary' />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }
                                                        </div>

                                                    </TableCell> */}
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
                                                                            disabled={!this.state.isEditable}
                                                                            // placeholder="Received Qty"
                                                                            name="jan"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.jan}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].jan = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Feb"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="feb"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.feb}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].feb = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Mar"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="mar"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.mar}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].mar = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Apr"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="apr"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.apr}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].apr = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="May"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="may"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.may}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].may = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="June"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="june"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.june}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].june = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="July"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="July"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.july}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].july = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Aug"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="aug"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.aug}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].aug = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Sep"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="sep"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.sep}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].sep = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>

                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Oct"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="oct"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.oct}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].oct = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Nov"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="nov"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.nov}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].nov = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                        <SubTitle title="Dec"></SubTitle>
                                                                        <TextValidator
                                                                            disabled={!this.state.isEditable}

                                                                            // placeholder="Received Qty"
                                                                            name="dec"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.data[index]?.dec}
                                                                            type="number"
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                let data = this.state.data
                                                                                data[index].dec = parseFloat(e.target.value)
                                                                                data[index].estimation = data[index].jan + data[index].feb + data[index].mar + data[index].apr + data[index].may + data[index].june + data[index].july + data[index].aug + data[index].sep + data[index].oct + data[index].nov + data[index].dec
                                                                                this.setState({
                                                                                    data
                                                                                })

                                                                            }}

                                                                        />
                                                                    </Grid>

                                                                </Grid>



                                                                <div>
                                                                    <SubTitle title="Remark"></SubTitle>
                                                                    <TextValidator
                                                                        disabled={!this.state.isEditable}
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

                                                                            data[index].remark = e.target.value
                                                                            this.setState({
                                                                                data
                                                                            })
                                                                        }

                                                                        }

                                                                    />
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



                            <div className='flex items-center mt-5' >

                                {this.state.actions?.map((x) =>


                                    <Button
                                        className="m-1"
                                        style={{ height: 'fitContent' }}
                                        progress={this.submittingFinal}
                                        onClick={() => {
                                            this.submitAction(x.action)
                                        }}
                                        scrollToTop={true}

                                    >
                                        <span className="capitalize">
                                            <span className="capitalize">
                                                {x.name}
                                            </span>
                                        </span>
                                    </Button>

                                )}




                                {/* <div className='px-2'>
                                        <Alert severity='info'>
                                            <strong>When You're Finish Estimation you Can Not Update. Make Sure the Estimation is Complete Before Submit.</strong>
                                        </Alert>
                                    </div> */}
                            </div>


                        </ValidatorForm>
                        :
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress
                                size={30}
                            />
                        </Grid>
                    }

                </div>



                <Dialog fullWidth maxWidth="lg" open={this.state.viewCompleteEstimations} onClose={() => { this.setState({ viewCompleteEstimations: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Submitted Forecasted Estimation" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    viewCompleteEstimations: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                        <AlradyEstimatedWarehouseView data={this.state.selected_view_data}></AlradyEstimatedWarehouseView>
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

export default withStyles(styleSheet)(HospitalItemsList)