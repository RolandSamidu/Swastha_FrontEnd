import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Tabs,
    Tab,
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
import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import moment from 'moment';

import { Autocomplete, Alert } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse, convertTocommaSeparated, roundDecimal, timeParse } from 'utils'
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
import FileSaver from 'file-saver'
import ReportService from 'app/services/ReportService'

import SingalView from '../../Reports/SingalView'
import PrintSubmitLetter from './PrintSubmitLetter'

import Filters from '../../Filters'
import * as appConst from '../../../../../appconst'

import HistoryIcon from '@mui/icons-material/History';
import EstimationHistory from './Estimation_History';



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

class DefaultItemsPharmacist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            submittingFinal: false,
            isEditable: false,
            warning_msg: false,
            rows: [

            ],
            openRows: {},
            institute_type: null,
            owner_id: null,
            user_roles: [],

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

            nonCons: false,

            filterData: {
                //warehouse_id: this.props.warehouse_id,
                //searh_type: 'searh_type',
                //used_for_estimates: 'Y',
                //not_in_sub_estimated: true,
                hospital_estimation_id: this.props.id,
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
            estimationDataAll: [],



            history_loading: false,
            openHistory: false,
            openItemHistory: false,
            selectedId: null,

            estimation_item_history: [],
            history_item_loading: false,


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
        var owner_id_temp = await localStorageService.getItem('owner_id');
        let owner_id = this.state.owner_id || owner_id_temp
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

    async getHospitalEstimationAll(itemIds) {
        let owner_id = await localStorageService.getItem('owner_id')
        let estimationYear = Number(this.props.EstimationData?.Estimation?.EstimationSetup?.year) - 1
        const firstDay = new Date(estimationYear, 0, 1);

        // Create a new Date object for the last day of the year
        // To get the last day of the year, go to the first day of the next year (January 1 of next year)
        const lastDay = new Date(estimationYear, 0, 0);



        let par = {
            item_id: itemIds,
            owner_id: this.state.owner_id,
            year: estimationYear,
            //estimation_from: dateParse(firstDay),
            //estimation_to: dateParse(lastDay),
            estimation_type: 'Annual',
            search_type: 'EstimationGroup'
        }

        let resp = await EstimationService.getAllEstimationITEMS(par)

        if (resp.status === 200) {
            let finalData = resp.data.view.filter(x => x.year == estimationYear)
            console.log('last year estimations', finalData)
            this.setState({
                estimationDataAll: finalData
            })

        }



    }

    async loadEstimations(data) {
        let item_ids = data.map((x) => x.item_id)

        this.getHospitalEstimationAll(item_ids)

        let params = {
            hospital_estimation_id: this.props.id,
            item_id: item_ids
        }
        this.setState({ loaded: true })
        let res = await EstimationService.getSubHospitalEstimationItems(params)

        if (res.status == 200) {
            console.log("all estimation data 1234", res.data.view.data);
            let estimatedData = res.data?.view?.data


            let reArrangeData = [];
            if (estimatedData.length == 0) {
                this.setState({ loaded: true })
            }

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
                let sum_stockPosition = 0
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
                        sum_stockPosition += parseFloat(e.stock_position)

                    }

                }

                let temp = {
                    ItemSnap: element.ItemSnap,
                    item_id: element.item_id,
                    hospital_estimation_id: element.hospital_estimation_id,
                    hospital_estimation_item_id: element.id,
                    status: element.status,
                    jan: element.status == "Submited" ? Number(element.jan) : sum_jan,
                    feb: element.status == "Submited" ? Number(element.feb) : sum_feb,
                    mar: element.status == "Submited" ? Number(element.mar) : sum_mar,
                    apr: element.status == "Submited" ? Number(element.apr) : sum_apr,
                    may: element.status == "Submited" ? Number(element.may) : sum_may,
                    june: element.status == "Submited" ? Number(element.june) : sum_june,
                    july: element.status == "Submited" ? Number(element.july) : sum_july,
                    aug: element.status == "Submited" ? Number(element.aug) : sum_aug,
                    sep: element.status == "Submited" ? Number(element.sep) : sum_sep,
                    oct: element.status == "Submited" ? Number(element.oct) : sum_oct,
                    nov: element.status == "Submited" ? Number(element.nov) : sum_nov,
                    dec: element.status == "Submited" ? Number(element.dec) : sum_dec,
                    estimation: element.status == "Submited" ? Number(element.estimation) : sum_estimation,
                    stock_position: element.status == "Submited" ? Number(element.stock_position) : sum_stockPosition,
                    remark: element.remark,
                    sum_estimations: sum_estimation,
                    sum_stockPositions: sum_stockPosition,
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
        let user_info = await localStorageService.getItem('userInfo')
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        let filterData = this.state.filterData
        filterData.owner_id = this.state.owner_id || owner_id
        filterData.consumables = this.props.EstimationData?.Estimation?.consumables

        let res = await EstimationService.getAllEstimationITEMS(filterData)


        this.setState({ user_roles: user_info.roles })

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
            } else if (user_info.roles.includes('Devisional Pharmacist') && dateParse(this.props.EstimationData?.end_date) >= dateParse(new Date())) {
                this.setState({ isEditable: true })
            } else if (user_info.roles.includes("IT ADMIN") && dateParse(this.props.EstimationData?.end_date) < dateParse(new Date())) {
                this.setState({ isEditable: true })
            }
            this.setState({ totalItems: res.data?.view?.totalItems, institute_type: res.data?.view?.data[0]?.HosptialEstimation?.Estimation?.institute_category, totalPages: res.data?.view?.totalPages })
            if (res.data.view.data.length > 0) {
                this.loadEstimations(res.data?.view?.data)
            } else {
                this.setState({ loaded: true, data: [] })
            }

        } else {
            this.setState({ loaded: true, data: [] })

        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData }, () => { this.loadData() })
    }

    async setHistoryPage(page) {
        let filterData = this.state.history_data
        filterData.page = page
        this.setState({ filterData }, () => { this.getHistoryDetails() })
    }




    async submit(data) {
        console.log("clicked data", data)
        var owner_id_temp = await localStorageService.getItem('owner_id');
        let owner_id = this.state.owner_id || owner_id_temp
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


    async finishEstimation() {

        var owner_id_temp = await localStorageService.getItem('owner_id');
        let owner_id = this.state.owner_id || owner_id_temp


        let res = await EstimationService.editStatusHospitalEstimationById(this.props.id, { "status": 'Pending Approvals', 'owner_id': owner_id, institute_type: this.state.institute_type })
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
                //submittingFinal:false
            },
                () => {
                    window.location = `/estimation/hospital_estimations_list`

                })
        } else {
            console.log("error message", res.response.data.error)
            this.setState({
                alert: true,
                severity: 'error',
                message: res.response.data.error,
                submittingFinal: false
            })
        }
    }

    async downloadExcel() {
        this.setState({
            printloaded: true,
        })
        let id = 'e07331b6-2c42-be60-bdc8-ac45840ca006'

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        var owner_id = await localStorageService.getItem('owner_id');

        let parameters = [

            { name: "year", value: this.props.EstimationData?.Estimation?.EstimationSetup?.year },
            { name: "owner_id", value: owner_id },

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


    async componentDidMount() {
        let owner_id = this.props.EstimationData?.Warehouse?.owner_id
        this.setState({ owner_id })
        ReportService.checkReportLogins()

        console.log("EstimationData", this.props.EstimationData)

        if (this.props.EstimationData?.Estimation?.consumables === 'N') {
            this.setState({
                nonCons: true
            })
        }

        console.log("search params", this.props.sr_no)
        if (this.props.sr_no) {
            let filterData = this.state.filterData
            filterData.sr_no = this.props.sr_no

            this.setState({ filterData }, () => {
                this.loadData()
            })
        } else {
            let filterData = this.state.filterData
            filterData.status = "Pending"
            this.setState({ filterData }, () => {
                this.loadData()
            })
        }
        //this.loadFilterData()
    }

    handleTabChange = (event, newValue) => {
        let filterData = this.state.filterData
        filterData.sr_no = this.props.sr_no

        if (newValue == 0) {
            filterData.status = "Pending"
            filterData.page = 0
        } else {
            filterData.status = "Submited"
            filterData.page = 0
        }
        this.setState({ filterData, activeTab: newValue }, () => {
            this.loadData()
        })
    };

    // async getHistoryDetails() {
    //     let params = this.state.history_data
    //     params.hospital_estimation_item_id = this.state.selectedId

    //     console.log('cheking hospital_estimation_item_id', params)

    //     this.setState({
    //         history_loading: true,
    //         params
    //     })
    //     // params.hospital_estimation_item_id = '77d927f9-70f4-4d7f-92e5-cec5cc01df27'

    //     // let res = await EstimationService.getEstimationHistory(params)

    //     // if (res.status === 200){
    //     //     console.log('cheking res', res)
    //     //     this.setState({
    //     //         estimation_history : res.data.view.data,
    //     //         history_loading: true,
    //     //         totalHistoryItems: res.data.view.totalItems
    //     //     })

    //     // }
    // }




    render() {
        const { classes } = this.props
        const { data, openRows } = this.state;

        return (
            < Fragment >

                <PrintSubmitLetter hospital_estimation_id={this.props.id} estimationYear={this.props.EstimationData?.Estimation?.EstimationSetup?.year} estimationData={this.props.EstimationData}></PrintSubmitLetter>

                <Filters onSubmit={(data) => {
                    let filterData = this.state.filterData
                    //filterData == { ...filterData, ...data }
                    Object.assign(filterData, data)
                    this.setState({ filterData }, () => {
                        this.setPage(0)
                    })
                }}></Filters>


                <Tabs
                    className='mt-5'
                    value={this.state.activeTab}
                    onChange={this.handleTabChange}

                    style={{ minHeight: 39, height: 26 }}
                    indicatorColor="primary"
                    variant='fullWidth'
                    textColor="primary"
                >

                    <Tab label="PENDING" />
                    < Tab label="SAVED" />


                </Tabs>

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
                                            <TableCell>Last Year Estimation</TableCell>
                                            {this.state.nonCons &&
                                                <TableCell>Stock on Hand</TableCell>
                                            }
                                            <TableCell>Total Estimation</TableCell>
                                            <TableCell>Total Cost</TableCell>
                                            <TableCell>Estimation Deviation</TableCell>
                                            <TableCell>Submitted Warehouses</TableCell>
                                            {this.state.nonCons &&
                                                <TableCell>Store Stock</TableCell>
                                            }
                                            <TableCell>Pharmacy Estimations</TableCell>

                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, index) => {
                                            let validate = false
                                            let itemEstimation = this.state.estimationDataAll?.filter((x) => x.item_id == row.item_id)[0]?.estimation || null
                                            let deviation = roundDecimal(((Number(data[index].estimation) - Number(itemEstimation || 0)) / Number(itemEstimation == 0 ? 1 : itemEstimation || 1) * 100), 2)

                                            let rowColor = ""


                                            let exceedEstimations = false
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



                                            /*  if ((Number(data[index].estimation) > (Number(itemEstimation || 0) + Number(itemEstimation || 0) * 10 / 100))) {
                                                 exceedEstimations=true
                                             }else{
                                                 exceedEstimations=false
                                             } */

                                            if (deviation > 10) {
                                                rowColor = 'red'
                                            } else if (deviation < -10) {
                                                rowColor = '#fff145'
                                            } else if (-10 <= deviation <= 10) {
                                                rowColor = '#00e183'
                                            }


                                            return (<React.Fragment key={row.item_id}>
                                                <TableRow >
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
                                                    <TableCell>{itemEstimation}</TableCell>
                                                    {this.state.nonCons &&
                                                        <TableCell >
                                                            <Tooltip title="Stock on Hand" arrow>

                                                                <TextValidator
                                                                    disabled={!this.state.isEditable}
                                                                    //className=" w-full"
                                                                    placeholder="Stock on Hand"
                                                                    name="stock_position"
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
                                                            </Tooltip>
                                                        </TableCell>
                                                    }
                                                    <TableCell >
                                                        <Tooltip title="After Click You Can See Last Year Estimation, Consuptions and Other Informations. " arrow>

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
                                                        </Tooltip>
                                                    </TableCell>
                                                    <TableCell>{convertTocommaSeparated((row.ItemSnap?.standard_cost * (this.state.data[index]?.estimation || 0)), 2)}</TableCell>
                                                    <TableCell>
                                                        <div className='flex justify-center text-center items-center' style={{ width: 90, height: 25, borderRadius: 50, backgroundColor: rowColor }}>
                                                            {deviation} %
                                                        </div>
                                                    </TableCell>



                                                    <TableCell> {data[index].ItemEstimations.length}</TableCell>
                                                    {this.state.nonCons &&
                                                        <TableCell> {data[index].sum_stockPositions}</TableCell>
                                                    }
                                                    <TableCell> {data[index].sum_estimations}</TableCell>
                                                    <TableCell style={{ paddingLeft: 10, paddingRight: 10 }}> {data[index].status}</TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center' style={{ marginLeft: '-10px' }}>
                                                            {(validate && this.state.isEditable) &&
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

                                                            <Tooltip title="Item History">
                                                                <IconButton
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            openHistory: true,
                                                                            selectedId: data[index]?.hospital_estimation_item_id,
                                                                            history_loading: true,
                                                                        })

                                                                    }}>
                                                                    <HistoryIcon color='primary' />
                                                                </IconButton>
                                                            </Tooltip>

                                                        </div>

                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell className={classes.rootCell} colSpan={13}>
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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
                                                                                data[index].estimation = Number(data[index].jan) + Number(data[index].feb) + Number(data[index].mar) + Number(data[index].apr) + Number(data[index].may) + Number(data[index].june) + Number(data[index].july) + Number(data[index].aug) + Number(data[index].sep) + Number(data[index].oct) + Number(data[index].nov) + Number(data[index].dec)
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

                            {this.state.activeTab == 1 &&
                                <div className='flex items-center mt-5' >

                                    {!this.state.user_roles.includes('Devisional Pharmacist') &&
                                        <Button
                                            style={{ height: 'fitContent' }}
                                            progress={this.submittingFinal}
                                            onClick={() => {
                                                document.getElementById('print_signSheet_004').click()
                                            }}
                                            scrollToTop={true}

                                        >
                                            <span className="capitalize">
                                                <span className="capitalize">
                                                    Print Sign Sheet
                                                </span>
                                            </span>
                                        </Button>
                                    }

                                    {!this.state.user_roles.includes('Devisional Pharmacist') &&
                                        <Button className="ml-3" progress={this.state.printloaded} onClick={() => { this.downloadExcel() }}>Download Estimation Sheet</Button>
                                    }


                                    {(this.state.isEditable && !this.state.user_roles.includes('Devisional Pharmacist')) &&

                                        <Button
                                            className="mx-2"
                                            style={{ height: 'fitContent' }}
                                            disabled={this.state.data.length == 0 ? true : false}
                                            progress={this.state.submittingFinal}
                                            onClick={() => {
                                                this.setState({ warning_msg: true, submittingFinal: true })
                                            }}
                                            scrollToTop={true}

                                        >
                                            <span className="capitalize">
                                                <span className="capitalize">
                                                    Finish Forecasted Estimation
                                                </span>
                                            </span>
                                        </Button>
                                    }

                                    {(this.state.isEditable && !this.state.user_roles.includes('Devisional Pharmacist')) &&

                                        <div className='px-2'>
                                            <Alert severity='info'>
                                                <strong>When You're Finish Forecasted Estimation you Can Not Update. Make Sure the Estimation is Complete Before Submit.</strong>
                                            </Alert>
                                        </div>
                                    }
                                </div>
                            }

                            {this.state.activeTab == 0 &&

                                <div className='px-2'>
                                    <Alert severity='info'>
                                        <strong>Please Go To Saved Tab to Submit the Estimation.</strong>
                                    </Alert>
                                </div>
                            }


                        </ValidatorForm>
                        :
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress
                                size={30}
                            />
                        </Grid>
                    }

                </div>


                <LoonsDiaLogBox
                    title="Are you sure?"
                    show_alert={true}
                    alert_severity="info"
                    alert_message="When You're Finish Forecasted Estimation you Can Not Update. Make Sure the Estimation is Complete Before Submit."
                    //message="testing 2"
                    open={this.state.warning_msg}
                    show_button={true}
                    show_second_button={true}
                    btn_label="No"
                    onClose={() => {
                        this.setState({ warning_msg: false })
                    }}
                    second_btn_label="Yes"
                    secondButtonAction={() => {
                        // this.setState({ warning_msg: false })
                        this.setState({ warning_msg: false })
                        this.finishEstimation()

                    }}
                >
                </LoonsDiaLogBox>


                <Dialog fullWidth maxWidth="lg" open={this.state.viewCompleteEstimations} onClose={() => { this.setState({ viewCompleteEstimations: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Submitted Forecasted Estimations" />
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

                {/* estimation history popup*/}
                <Dialog fullWidth maxWidth="lg" open={this.state.openHistory} onClose={() => { this.setState({ openHistory: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title="Estimations History" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    openHistory: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                        {this.state.history_loading ?
                            <EstimationHistory data={this.state.selectedId}></EstimationHistory>
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

export default withStyles(styleSheet)(DefaultItemsPharmacist)