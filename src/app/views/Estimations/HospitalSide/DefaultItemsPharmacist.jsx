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
import { yearMonthParse, dateParse, yearParse, roundDecimal, convertTocommaSeparated, padLeadingZeros } from 'utils'
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
import PrintEstimationForm from './PrintEstimationForm'
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

class DefaultItemsPharmacist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            printloaded: false,
            printData: [],

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

            estimationDataAll: [],

            filterData: {
                warehouse_id: this.props.warehouse_id,
                search_type: 'NOTSUBESTIMATED',
                used_for_estimates: 'Y',
                not_in_sub_estimated: true,
                sub_estimation_id: this.props.id,

                page: 0,
                limit: 10,
                orderby_sr: true,
                //'order[0]': ['createdAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            enteredData: [

            ],
            estimationData: null,
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





    async loadData() {
        this.setState({ loaded: false })
        let owner_id = await localStorageService.getItem('owner_id')

        let filterData = this.state.filterData
        filterData.owner_id = this.state.owner_id || owner_id
        filterData.consumables = this.props.EstimationData?.HosptialEstimation?.Estimation?.consumables
        filterData.hospital_estimation_id = this.props.EstimationData?.hospital_estimation_id

        //let res = await WarehouseServices.getDefaultItems(this.state.filterData)
        let res = await EstimationService.getAllEstimationITEMS(filterData)

        if (res.status == 200) {
            console.log("data", res.data.view.data);
            let item_ids = res.data.view.data?.map((x) => x.item_id)

            this.getHospitalEstimationAll(item_ids)

            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems, totalPages: res.data?.view?.totalPages, loaded: true })
        } else {
            this.setState({ loaded: true })

        }
    }


    async printData() {

        this.setState({ printloaded: true })
        const chunkSize = 50
        const chunkedArrays = [];

        // Split the items array into smaller chunks


        const data = [];


        // Call the getPackDetails function for each chunk and merge the results
        for (let i = 0; i < this.state.totalItems / chunkSize; i++) {
            const chunkData = await this.loadDataForPrint(i, chunkSize);
            data.push(...chunkData);
            console.log('all data', data)
        }

        this.setState({ printloaded: false, printData: data },
            () => {
                document.getElementById('print_presc_01').click();
            })

    }

    async downloadData() {
        this.setState({ printloaded: true })
        const chunkSize = 50
        const chunkedArrays = [];

        // Split the items array into smaller chunks


        const data = [];


        // Call the getPackDetails function for each chunk and merge the results
        for (let i = 0; i < this.state.totalItems / chunkSize; i++) {
            const chunkData = await this.loadDataForPrint(i, chunkSize);
            data.push(...chunkData);
            console.log('all data', data)
        }

        this.setState({ printloaded: false, printData: data },
            () => {
                this.downloadExcelSheet(data)
                // document.getElementById('print_presc_01').click();
            })
    }


    async loadDataForPrint(page, limit) {
        let owner_id = await localStorageService.getItem('owner_id')

        let filterData = this.state.filterData
        filterData.limit = limit
        filterData.page = page
        filterData.owner_id = this.state.owner_id || owner_id
        filterData.consumables = this.props.EstimationData?.HosptialEstimation?.Estimation?.consumables
        filterData.hospital_estimation_id = this.props.EstimationData?.hospital_estimation_id

        //let res = await WarehouseServices.getDefaultItems(this.state.filterData)
        let res = await EstimationService.getAllEstimationITEMS(filterData)

        if (res.status == 200) {
            console.log("data", res.data.view.data);
            return res.data.view.data
        } else {
            return []

        }
    }


    async downloadExcelSheet(data) {
        const items = [['SR NO', 'Description', 'Estimation'],
        ];


        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            items.push([element.ItemSnap?.sr_no, element.ItemSnap?.medium_description, ''])
        }



        let csv = ''

        // Loop the array of objects
        for (let row = 0; row < items.length; row++) {
            let keysAmount = Object.keys(items[row]).length
            let keysCounter = 0

            // csv += "SR,Item Name,Estimation\r\n"


            // If this is the first row, generate the headings
            if (row === 0) {
                csv += "SR,Item Name,Estimation\r\n"


            } else {

                csv += '\"' + items[row][0] + '\"' + "," + items[row][1] + ',' + items[row][2] + '\r\n'
                for (let key in items[row]) {
                    // csv += padLeadingZeros((items[row][key]),8).toString() + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
                    //csv += '=\"' + (items[row][key]).toString() + '\"' + (keysCounter + 1 < keysAmount ? ',' : '\\r\\n');


                    /*  if (key === 'SR NO') {
                         csv += '=\"' + items[row][key] + '\"' + (keysCounter + 1 < keysAmount ? ',' : '\\r\\n');
                     } else {
                         csv += items[row][key] + (keysCounter + 1 < keysAmount ? ',' : '\\r\\n');
                     }
  */
                    keysCounter++
                }
            }

            keysCounter = 0
        }

        // Once we are done looping, download the .csv by creating a link
        let link = document.createElement('a')
        link.id = 'download-csv'
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
        link.setAttribute('download', 'Estimations.csv');
        document.body.appendChild(link)
        document.querySelector('#download-csv').click()
    }




    async downloadExcel() {
        this.setState({
            printloaded: true,
        })
        let id = 'e07331b6-2c42-be60-bdc8-ac45840ca006'

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        var owner_id = await localStorageService.getItem('owner_id');

         let parameters = [
           
            { name: "year", value: this.props.EstimationData?.HosptialEstimation?.Estimation?.EstimationSetup?.year },
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
                    //this.setPage(0)
                    this.loadData()
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

    async getHospitalEstimationAll(itemIds) {
        let owner_id = await localStorageService.getItem('owner_id')
        let estimationYear = Number(this.props.EstimationData?.HosptialEstimation?.Estimation?.EstimationSetup?.year) - 1


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

    async componentDidMount() {
        var owner_id = await localStorageService.getItem('owner_id');
        console.log('EstimationData', this.props.EstimationData)
        ReportService.checkReportLogins()
        if (this.props.EstimationData?.HosptialEstimation?.Estimation?.consumables === 'N') {
            this.setState({
                nonCons: true
            })
        }

        let expected_date = this.props.EstimationData?.expected_date
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
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, i) => {

                                            let enteredData = this.state.enteredData
                                            let index = enteredData.findIndex((x) => x.item_id == row?.ItemSnap?.id)

                                            let validate = false
                                            let itemEstimation = this.state.estimationDataAll?.filter((x) => x.item_id == row.item_id)[0]?.estimation || null
                                            let deviation = roundDecimal(((Number(this.state.enteredData[index]?.estimation || 0) - Number(itemEstimation || 0)) / Number(itemEstimation == 0 ? 1 : itemEstimation || 1) * 100), 2)

                                            let rowColor = ""
                                            if (deviation > 10) {
                                                rowColor = 'red'
                                            } else if (deviation < -10) {
                                                rowColor = '#fff145'
                                            } else if (-10 <= deviation <= 10) {
                                                rowColor = '#00e183'
                                            }

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
                                                        <TableCell>{itemEstimation}</TableCell>

                                                        {this.state.nonCons &&
                                                            <TableCell>
                                                                <Tooltip title="Stock on Hand" arrow>
                                                                    <TextValidator
                                                                        //className=" w-full"
                                                                        placeholder="Stock on Hand"
                                                                        disabled={!this.state.isEditable}
                                                                        name="Stock on Hand"
                                                                        InputLabelProps={{ shrink: false }}
                                                                        value={this.state.enteredData[index]?.stock_position}
                                                                        type="number"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onFocus={() => openRows[row?.ItemSnap?.id] ? null : this.handleRowToggle(row?.ItemSnap?.id)}

                                                                        onChange={(e) => {

                                                                            if (index == -1) {
                                                                                enteredData.push(
                                                                                    {
                                                                                        sub_estimation_id: this.props.id,
                                                                                        item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                        stock_position: e.target.value,
                                                                                        remark: null
                                                                                    })

                                                                                this.setState({
                                                                                    enteredData
                                                                                })
                                                                            } else {
                                                                                let val = e.target.value
                                                                                enteredData[index].stock_position = val
                                                                                // enteredData[index].jan = val / 12
                                                                                // enteredData[index].feb = val / 12
                                                                                // enteredData[index].mar = val / 12
                                                                                // enteredData[index].apr = val / 12
                                                                                // enteredData[index].may = val / 12
                                                                                // enteredData[index].june = val / 12
                                                                                // enteredData[index].july = val / 12
                                                                                // enteredData[index].aug = val / 12
                                                                                // enteredData[index].sep = val / 12
                                                                                // enteredData[index].oct = val / 12
                                                                                // enteredData[index].nov = val / 12
                                                                                // enteredData[index].dec = val / 12
                                                                                this.setState({
                                                                                    enteredData
                                                                                })
                                                                            }


                                                                        }}

                                                                    />
                                                                </Tooltip>
                                                            </TableCell>
                                                        }
                                                        <TableCell>
                                                            <Tooltip title="After Click You Can See Last Year Estimation, Consuptions and Other Informations. " arrow>
                                                                <TextValidator
                                                                    //className=" w-full"
                                                                    // placeholder="Received Qty"
                                                                    name="estimation"
                                                                    InputLabelProps={{ shrink: false }}
                                                                    value={this.state.enteredData[index]?.estimation}
                                                                    disabled={!this.state.isEditable}
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
                                                                                    remark: null
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
                                                                        console.log("enterd data row", enteredData[index])

                                                                    }}

                                                                />
                                                            </Tooltip>
                                                        </TableCell>

                                                        <TableCell>{convertTocommaSeparated((row.ItemSnap?.standard_cost * (this.state.enteredData[index]?.estimation || 0)), 2)}</TableCell>
                                                        <TableCell>
                                                            <div className='flex justify-center text-center items-center' style={{ width: 90, height: 25, borderRadius: 50, backgroundColor: rowColor }}>
                                                                {deviation} %
                                                            </div>
                                                        </TableCell>

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
                                                        <TableCell className={classes.rootCell} colSpan={10}>
                                                            <Collapse style={{ backgroundColor: '#d7dffa' }} in={openRows[row.item_id]} timeout="auto" unmountOnExit>
                                                                {/* Content you want to show when row is expanded */}
                                                                <div className='w-full px-10 py-5'>
                                                                    <Grid container spacing={2}>
                                                                        <Grid item lg={2} md={2} sm={6} xs={6}>
                                                                            <SubTitle title="Jan"></SubTitle>
                                                                            <TextValidator

                                                                                // placeholder="Received Qty"
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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
                                                                                disabled={!this.state.isEditable}
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
                                                                                                remark: null
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


                                                                        <Autocomplete
                                                                            disableClearable
                                                                            className="w-full"
                                                                            disabled={!this.state.isEditable}
                                                                            // ref={elmRef}
                                                                            value={(appConst.estimations_remarks.includes(this.state.enteredData[index]?.remark) || this.state.enteredData[index]?.remark == null) ? this.state.enteredData[index]?.remark : 'Other'}
                                                                            options={appConst.estimations_remarks}
                                                                            onChange={(e, value) => {
                                                                                let enteredData = this.state.enteredData

                                                                                if (index == -1) {

                                                                                    if (value == 'Other') {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                remark: '',

                                                                                            })
                                                                                    } else {
                                                                                        enteredData.push(
                                                                                            {
                                                                                                sub_estimation_id: this.props.id,
                                                                                                item_id: this.state.data[i]?.ItemSnap?.id,
                                                                                                remark: value,

                                                                                            })
                                                                                    }

                                                                                    this.setState({
                                                                                        enteredData
                                                                                    })
                                                                                } else {

                                                                                    if (value == 'Other') {
                                                                                        enteredData[index].remark = ''
                                                                                    } else {
                                                                                        enteredData[index].remark = value
                                                                                    }

                                                                                    this.setState({
                                                                                        enteredData
                                                                                    })
                                                                                }


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
                                                                        {((!appConst.estimations_remarks.includes(this.state.enteredData[index]?.remark) && this.state.enteredData[index]?.remark != null) || this.state.enteredData[index]?.remark == 'Other') &&
                                                                            <TextValidator
                                                                                disabled={!this.state.isEditable}
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

                                                                                    let enteredData = this.state.enteredData
                                                                                    enteredData[index].remark = e.target.value
                                                                                    this.setState({
                                                                                        enteredData
                                                                                    })


                                                                                }}
                                                                            />
                                                                        }





                                                                    </div>

                                                                    <div>
                                                                        {/* <SingalViewPharma item_id={row.item_id} warehouse_id={this.props.warehouse_id} owner_id={this.state.owner_id} estimationYear={this.props.EstimationData?.HosptialEstimation?.Estimation?.EstimationSetup?.year}></SingalViewPharma>
                                                                         */}
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

                <Button progress={this.state.printloaded} onClick={() => { this.printData() }}>Print</Button>
                <Button className="ml-3" progress={this.state.printloaded} onClick={() => { this.downloadExcel() }}>Download Estimation Sheet</Button>

                {this.state.printloaded &&
                    <div className='mt-2'>
                        <Alert severity='info'>
                            <strong>Start Downloading. Please Wait... </strong>
                        </Alert>
                    </div>
                }

                {!this.state.printloaded &&
                    <PrintEstimationForm data={this.state.printData}></PrintEstimationForm>
                }
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