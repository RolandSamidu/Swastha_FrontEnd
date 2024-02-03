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
import { yearMonthParse, dateParse, yearParse, convertTocommaSeparated, includesArrayElements, roundDecimal } from 'utils'
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
import AlradyEstimatedWarehouseView from './AlradyEstimatedWarehouseView'
import SingalView from '../../Reports/SingalView'
import Filters from '../../Filters'
import * as appConst from '../../../../../appconst'

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

class OtherItemsPharmacist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isEditable: false,
            rows: [],
            owner_id: null,
            openRows: {},

            loginUserRoles: [],

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
                used_for_estimates: 'Y',
                institutes: [1, 2, 3, 4, 5, 6],
                page: 0,
                limit: 10,
                orderby_sr: true,
                //'order[0]': ['updatedAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            selected_view_data: null,
            viewCompleteEstimations: false,
            formData: {

            },
            data: [],
            estimationData: null,

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
            }
        }
    }


    /*     async loadData() {
            this.setState({ loaded: false })
            let owner_id = await localStorageService.getItem('owner_id')
            let filterData = this.state.filterData
            filterData.owner_id = owner_id
            let res = await EstimationService.getAllEstimationITEMS(filterData)
    
            if (res.status == 200) {
                console.log("all data", res.data.view.data);
                if ( res.data?.view?.data[0].HosptialEstimation?.status == "Pending Approvals") {
                    this.setState({ isEditable: false })
                }
                this.setState({ totalItems: res.data?.view?.totalItems, totalPages: res.data?.view?.totalPages })
                this.loadEstimations(res.data?.view?.data)
    
            } else {
                this.setState({ loaded: true })
    
            }
        } */

    async loadHospitalEstimation() {

        // let user_info = await localStorageService.getItem('userInfo')

        let owner_id = await localStorageService.getItem('owner_id')
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        let filterData = {
            hospital_estimation_id: this.props.id,
            owner_id: owner_id,
            page: 0,
            limit: 1,
            'order[0]': ['updatedAt', 'DESC']
        }
        let res = await EstimationService.getAllEstimationITEMS(filterData)

        if (res.status == 200) {
            if (res.data?.view?.data[0]?.HosptialEstimation?.status == "GENERATED") {


                let expected_date

                if (login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.institute_type == 'Provincial') {
                    expected_date = this.props.EstimationData?.Estimation?.dp_required_date
                } else {
                    expected_date = this.props.EstimationData?.end_date
                }



                if (dateParse(expected_date) >= dateParse(new Date())) {
                    this.setState({ isEditable: true })
                } else {
                    this.setState({ isEditable: false })
                }


            }
        }
        this.setState({ isEditable: true })
        /*   if (includesArrayElements(user_info, ['MSD AD'])) {
              this.setState({ isEditable: false })
          } */
    }


    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem('owner_id')
        let filterData = this.state.filterData
        //filterData.owner_id = owner_id
        let res = await InventoryService.fetchAllItems(filterData);
        let data = []
        if (res.status == 200) {

            console.log("all item data", res.data?.view?.data);
            if (res.data?.view?.data.length == 0) {
                this.setState({ loaded: true })
            }
            for (let index = 0; index < res.data?.view?.data.length; index++) {
                const element = res.data?.view?.data[index];
                data.push({
                    sr_no: element.sr_no,
                    medium_description: element.medium_description,
                    item_level: element.Institution?.name,
                    item_id: element.id,
                    jan: null,
                    feb: null,
                    mar: null,
                    apr: null,
                    may: null,
                    june: null,
                    july: null,
                    aug: null,
                    sep: null,
                    oct: null,
                    nov: null,
                    dec: null,
                    estimation: null,
                    remark: element.remark
                })
            }
            this.setState({
                totalItems: res.data?.view?.totalItems,
                totalPages: res.data?.view?.totalPages,
                data: data,
                loaded: true
            })


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
            hospital_estimation_id: this.props.id,
            warehouse_id: this.props.warehouse_id,
            status: 'Submited',
            owner_id: owner_id,
            created_by: user.id,
            item_id: data.item_id,
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
            real_estimation: data.estimation,
            remark: data.remark
        }

        let res = await EstimationService.addHospitalItemEstimations(formData)
        console.log("Estimation Data added", res)
        if (res.status === 201) {


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




    async componentDidMount() {
        let owner_id = await localStorageService.getItem('owner_id')
        const user = await localStorageService.getItem('userInfo');

        this.setState({ owner_id, loginUserRoles: user.roles })
        this.loadHospitalEstimation()
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
                        <ValidatorForm className="w-full mt-5">


                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>SR No</TableCell>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Standard Cost</TableCell>
                                            <TableCell>Total Estimation</TableCell>
                                            <TableCell>Total Cost</TableCell>
                                            <TableCell>Actions</TableCell>
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
                                                    <TableCell>{row.sr_no}</TableCell>
                                                    <TableCell>{row.medium_description}</TableCell>
                                                    <TableCell>{convertTocommaSeparated(row.ItemSnap?.standard_cost, 2)}</TableCell>
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

                                                    <TableCell>
                                                        <div className='flex items-center' style={{ marginLeft: '-10px' }}>
                                                            {((validate || includesArrayElements(this.state.loginUserRoles, ['MSD AD'])) && this.state.isEditable) &&
                                                                <Button
                                                                    style={{ height: 'fitContent' }}
                                                                    progress={this.submitting}
                                                                    disabled={!this.state.isEditable}
                                                                    onClick={() => {
                                                                        if ((Number(data[index].estimation) > (Number(this.state.estimationData?.estimation || 0) + Number(this.state.estimationData?.estimation || 0) * 10 / 100)) && (data[index]?.remark == null || data[index]?.remark == "" || data[index]?.remark == undefined)) {
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
                                                                            } else {
                                                                                data[index].remark = value
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
                                                                                this.setState({
                                                                                    data
                                                                                })


                                                                            }}
                                                                        />
                                                                    }
                                                                </div>

                                                                <div>
                                                                    <SingalView item_id={row.item_id} sr_no={row.ItemSnap?.sr_no} owner_id={this.state.owner_id} estimationYear={this.props.EstimationData?.Estimation?.EstimationSetup?.year} estimationData={this.props.EstimationData}></SingalView>
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



                <Dialog fullWidth maxWidth="lg" open={this.state.viewCompleteEstimations} onClose={() => { this.setState({ viewCompleteEstimations: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Submitted Estimations" />
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

export default withStyles(styleSheet)(OtherItemsPharmacist)