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
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination from '@material-ui/lab/Pagination';
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

class OtherItemsPharmacist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            owner_id: null,
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
            estimationData: null,
            filterData: {
                //warehouse_id: this.props.warehouse_id,
                //searh_type: 'searh_type',
                //used_for_estimates: 'Y',
                //not_in_sub_estimated: true,
                //sub_estimation_id: this.props.id,
                page: 0,
                limit: 10,
                'order[0]': ['createdAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            enteredData: [

            ],
            formData: {

            },
            data: [],

        }
    }


    handleRowToggle = (rowId) => {
        this.getHospitalEstimation(rowId)
        this.setState((prevState) => ({
            openRows: {
                //...prevState.openRows,
                [rowId]: !prevState.openRows[rowId]
            }
        }));
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
                owner_id: this.state.owner_id,
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
            }
        }
    }


    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem('owner_id')
        let filterData = this.state.filterData
        filterData.owner_id = this.state.owner_id
        let res = await EstimationService.getAllEstimationITEMS(filterData)

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
        this.setState({ submitting: true })

        let res = await EstimationService.createSubHospitalEstimationItems(data)
        console.log("Estimation Data added", res)
        if (res.status === 201) {

            let enteredData = this.state.enteredData
            let newEnteredData = enteredData.filter((x) => x.item_id != data.item_id)

            this.setState({
                enteredData: newEnteredData,
                alert: true,
                message: 'Estimation Submit successfully!',
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
                message: 'Estimation Submit was Unsuccessful!',
                severity: 'error',
                submitting: false
            })
        }


    }


    async componentDidMount() {
        let expected_date = this.props.EstimationData?.expected_date
        var owner_id = await localStorageService.getItem('owner_id');
        let from_owner_id = this.props.EstimationData?.Warehouse?.owner_id

        if (dateParse(expected_date) >= dateParse(new Date())) {
            this.setState({ isEditable: true })
        } else {
            this.setState({ isEditable: false })
        }
        this.setState({ owner_id: from_owner_id || owner_id })
        this.loadData()
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
                        <ValidatorForm className="w-full">





                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>SR No</TableCell>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Standard Cost</TableCell>
                                            <TableCell>Total Forecasted Estimation</TableCell>
                                            <TableCell>Total Cost</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, i) => {

                                            let enteredData = this.state.enteredData
                                            let index = enteredData.findIndex((x) => x.item_id == row?.ItemSnap?.id)

                                            let validate = false
                                            if (
                                                enteredData[index]?.jan >= 0 &&
                                                enteredData[index]?.feb >= 0 &&
                                                enteredData[index]?.mar >= 0 &&
                                                enteredData[index]?.apr >= 0 &&
                                                enteredData[index]?.may >= 0 &&
                                                enteredData[index]?.june >= 0 &&
                                                enteredData[index]?.july >= 0 &&
                                                enteredData[index]?.aug >= 0 &&
                                                enteredData[index]?.sep >= 0 &&
                                                enteredData[index]?.oct >= 0 &&
                                                enteredData[index]?.nov >= 0 &&
                                                enteredData[index]?.dec >= 0
                                            ) { validate = true }
                                            return (
                                                <React.Fragment key={row?.ItemSnap?.id}>
                                                    <TableRow>
                                                        <TableCell>
                                                            <IconButton
                                                                aria-label="expand row"
                                                                size="small"
                                                                onClick={() => this.handleRowToggle(row?.ItemSnap?.id)}
                                                            >
                                                                {openRows[row?.ItemSnap?.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell>{row.ItemSnap?.sr_no}</TableCell>
                                                        <TableCell>{row.ItemSnap?.medium_description}</TableCell>
                                                        <TableCell>{convertTocommaSeparated(row.ItemSnap?.standard_cost, 2)}</TableCell>
                                                        <TableCell>
                                                            <TextValidator
                                                                //className=" w-full"
                                                                // placeholder="Received Qty"
                                                                name="estimation"
                                                                InputLabelProps={{ shrink: false }}
                                                                value={this.state.enteredData[index]?.estimation}
                                                                type="number"
                                                                variant="outlined"
                                                                size="small"
                                                                onFocus={() => openRows[row?.ItemSnap?.id] ? null : this.handleRowToggle(row?.ItemSnap?.id)}

                                                                onChange={(e) => {

                                                                    if (index == -1) {
                                                                        let enteredVal = parseFloat(e.target.value);
                                                                        let divided_val = Math.floor(enteredVal / 12) * 12; // Round down to the nearest multiple of 12
                                                                        let val = divided_val;
                                                                        enteredData.push(
                                                                            {
                                                                                sub_estimation_id: this.props.id,
                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                estimation: enteredVal,
                                                                                jan: val / 12,
                                                                                feb: val / 12,
                                                                                mar: val / 12,
                                                                                apr: val / 12,
                                                                                may: val / 12,
                                                                                june: val / 12,
                                                                                july: val / 12,
                                                                                aug: val / 12,
                                                                                sep: val / 12,
                                                                                oct: val / 12,
                                                                                nov: val / 12,
                                                                                dec: (val / 12) + (enteredVal % 12),
                                                                            })

                                                                        this.setState({
                                                                            enteredData
                                                                        })
                                                                    } else {
                                                                        let enteredVal = parseFloat(e.target.value);
                                                                        let divided_val = Math.floor(enteredVal / 12) * 12; // Round down to the nearest multiple of 12
                                                                        let val = divided_val;
                                                                        enteredData[index].estimation = enteredVal
                                                                        enteredData[index].jan = val / 12
                                                                        enteredData[index].feb = val / 12
                                                                        enteredData[index].mar = val / 12
                                                                        enteredData[index].apr = val / 12
                                                                        enteredData[index].may = val / 12
                                                                        enteredData[index].june = val / 12
                                                                        enteredData[index].july = val / 12
                                                                        enteredData[index].aug = val / 12
                                                                        enteredData[index].sep = val / 12
                                                                        enteredData[index].oct = val / 12
                                                                        enteredData[index].nov = val / 12
                                                                        enteredData[index].dec = (val / 12) + (enteredVal % 12)
                                                                        this.setState({
                                                                            enteredData
                                                                        })
                                                                    }


                                                                }}

                                                            />
                                                        </TableCell>
                                                        <TableCell>{convertTocommaSeparated((row.ItemSnap?.standard_cost * (this.state.enteredData[index]?.estimation || 0)), 2)}</TableCell>
                                                        <TableCell> {data[i].status}</TableCell>

                                                        <TableCell>
                                                            <div className='flex items-center' style={{ marginLeft: '-10px' }}>
                                                                {(validate && this.state.isEditable) &&
                                                                    <Button
                                                                        style={{ height: 'fitContent' }}
                                                                        progress={this.submitting}
                                                                        disabled={!this.state.isEditable}
                                                                        onClick={() => {
                                                                            if ((Number(enteredData[index].estimation) > (Number(this.state.estimationData?.estimation || 0) + Number(this.state.estimationData?.estimation || 0) * 10 / 100)) && (enteredData[index]?.remark == null || enteredData[index]?.remark == "" || enteredData[index]?.remark == undefined)) {
                                                                                this.setState({
                                                                                    alert: true,
                                                                                    message: 'Your Total Estimation was Over the Limit. Pleace Enter the Remark',
                                                                                    severity: 'error',
                                                                                    submitting: false
                                                                                })

                                                                            } else {
                                                                                this.submit(enteredData[index])
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


                                                            </div>

                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className={classes.rootCell} colSpan={8}>
                                                            <Collapse style={{ backgroundColor: '#d7dffa' }} in={openRows[row.item_id]} timeout="auto" unmountOnExit>
                                                                {/* Content you want to show when row is expanded */}
                                                                <div className='w-full px-10 py-5'>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Jan"></SubTitle>
                                                                            <TextValidator

                                                                                // placeholder="Received Qty"
                                                                                name="jan"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.jan}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                jan: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].jan = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec
                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }

                                                                                }}

                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Feb"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="feb"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.feb}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                feb: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].feb = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Mar"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="mar"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.mar}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                mar: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].mar = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Apr"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="apr"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.apr}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                apr: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].apr = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="May"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="may"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.may}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                may: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].may = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="June"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="june"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.june}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                june: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].june = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>

                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="July"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="july"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.july}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                july: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].july = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>

                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Aug"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="aug"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.aug}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                aug: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].aug = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Sep"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="sep"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.sep}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                sep: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].sep = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>

                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Oct"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="oct"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.oct}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                oct: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].oct = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Nov"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="nov"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.nov}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                nov: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].nov = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Dec"></SubTitle>
                                                                            <TextValidator
                                                                                //className=" w-full"
                                                                                // placeholder="Received Qty"
                                                                                name="dec"
                                                                                InputLabelProps={{ shrink: false }}
                                                                                value={this.state.enteredData[index]?.dec}
                                                                                type="number"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                onChange={(e) => {

                                                                                    if (index == -1) {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                dec: parseFloat(e.target.value),
                                                                                            })

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    } else {
                                                                                        enteredData[index].dec = parseFloat(e.target.value)
                                                                                        enteredData[index].estimation = enteredData[index].jan + enteredData[index].feb + enteredData[index].mar + enteredData[index].apr + enteredData[index].may + enteredData[index].june + enteredData[index].july + enteredData[index].aug + enteredData[index].sep + enteredData[index].oct + enteredData[index].nov + enteredData[index].dec

                                                                                        this.setState({
                                                                                            enteredData
                                                                                        })
                                                                                    }


                                                                                }}

                                                                            />
                                                                        </Grid>

                                                                    </Grid>
                                                                    <div>
                                                                        <SubTitle title="Remark"></SubTitle>
                                                                        <TextValidator

                                                                            className='w-full'
                                                                            // placeholder="Received Qty"
                                                                            name="Remark"
                                                                            InputLabelProps={{ shrink: false }}
                                                                            value={this.state.enteredData[index]?.remark}
                                                                            multiline={true}
                                                                            rows={2}
                                                                            variant="outlined"
                                                                            size="small"
                                                                            onChange={(e) => {

                                                                                if (index == -1) {
                                                                                    enteredData.push(
                                                                                        {
                                                                                            sub_estimation_id: this.props.id,
                                                                                            item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                            remark: e.target.value,

                                                                                        })

                                                                                    this.setState({
                                                                                        enteredData
                                                                                    })
                                                                                } else {
                                                                                    enteredData[index].remark = e.target.value
                                                                                    this.setState({
                                                                                        enteredData
                                                                                    })
                                                                                }

                                                                            }}

                                                                        />
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

export default withStyles(styleSheet)(OtherItemsPharmacist)