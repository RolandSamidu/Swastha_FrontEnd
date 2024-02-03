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
import { yearMonthParse, dateParse, yearParse, convertTocommaSeparated, roundDecimal } from 'utils'
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
import SingalView from '../Reports/SingalView'
import Filters from '../Filters'
import FileSaver from 'file-saver'

import CardComponent from './cardComponent'
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
            owner_id: null,
            estimationData: this.props.EstimationData,
            selected_item_id: null,
            allEstimationsloaded: false,
            isEditable: false,
            rows: [

            ],
            openRows: {},
            actions: [],
            hospital_estimation_approvals_id: null,
            sequence: null,
            remark: null,

            estimation_data: [],
            total_estimation: null,
            estimation_loading: false,

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
                orderby_sr: true,
                page: 0,
                limit: 10,
                //'order[0]': ['updatedAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            selected_view_data: null,
            viewCompleteEstimations: false,
            formData: {

            },
            data: [],
            estimationDataAll: [],

            allEstimationsloaded: false,
            EstimatedHospitalData: [],
            selected_item_data: null,

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



    async loadHospitalsEstimations(item_id) {

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        let params = {
            estimation_id: this.props.id,
            item_id: item_id,
            institute_type: 'Provincial',
            //search_type:'EstimationMonthly',
            finnished_estimaion: true,
            district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district

        }

        let res = await EstimationService.getAllEstimationITEMS(params)

        if (res.status == 200) {
            console.log("all estimation data hospital wise", res.data);
            let estimatedData = res.data?.view?.data

            this.setState({ EstimatedHospitalData: estimatedData, allEstimationsloaded: true })
        } else {
            this.setState({ allEstimationsloaded: true })

        }
    }





    async loadEstimations(data) {
        let item_ids = data.map((x) => x.id)

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        let params = {
            estimation_id: this.props.id,
            item_id: item_ids,
            institute_type: 'Provincial',
            search_type: 'EstimationMonthly',
            finnished_estimaion: true,
            district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district

        }
        this.getHospitalEstimationAll(item_ids)
        let res = await EstimationService.getAllEstimationITEMS(params)

        if (res.status == 200) {
            console.log("all estimation data", res.data);
            let estimatedData = res.data?.view


            let reArrangeData = [];

            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let ItemEstimations = estimatedData.filter((x => x.item_id == element.id))
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
                let count = 0
                if (ItemEstimations.length > 0) {
                    for (let i = 0; i < ItemEstimations.length; i++) {
                        const e = ItemEstimations[i];

                        sum_jan += parseFloat(e.January)
                        sum_feb += parseFloat(e.February)
                        sum_mar += parseFloat(e.March)
                        sum_apr += parseFloat(e.April)
                        sum_may += parseFloat(e.May)
                        sum_june += parseFloat(e.June)
                        sum_july += parseFloat(e.July)
                        sum_aug += parseFloat(e.August)
                        sum_sep += parseFloat(e.September)
                        sum_oct += parseFloat(e.October)
                        sum_nov += parseFloat(e.November)
                        sum_dec += parseFloat(e.December)
                        sum_estimation += parseFloat(e.estimation)
                        count = e.count
                    }

                }

                let temp = {
                    ItemSnap: { sr_no: element.sr_no, medium_description: element.medium_description, institution_level: element.Institution?.description, short_description: element.short_description, standard_cost: element.standard_cost },
                    item_id: element.id,
                    hospital_estimation_id: this.props.id,
                    //hospital_estimation_item_id: element.id,
                    //status: element.status,
                    /*  jan: element.estimation != 0 ? Number(element.jan) : sum_jan,
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
                     estimation: element.estimation != 0 ? Number(element.estimation) : sum_estimation, */
                    jan: sum_jan,
                    feb: sum_feb,
                    mar: sum_mar,
                    apr: sum_apr,
                    may: sum_may,
                    june: sum_june,
                    july: sum_july,
                    aug: sum_aug,
                    sep: sum_sep,
                    oct: sum_oct,
                    nov: sum_nov,
                    dec: sum_dec,
                    estimation: sum_estimation,
                    sum_estimations: sum_estimation,
                    ItemEstimations: ItemEstimations,
                    count: count


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
        filterData.used_for_estimates = 'Y'
        filterData.priority = 'Yes'
        filterData.consumables = this.state.estimationData?.consumables
        filterData.category_id = this.props.estimatedData?.item_category

        //filterData.owner_id = owner_id
        // let res = await EstimationService.getAllEstimationITEMS(filterData)
        let res = await InventoryService.fetchAllItems(filterData)

        if (res.status == 200) {
            console.log("all data", res.data.view.data);
            /*  if (res.data?.view?.data[0].HosptialEstimation?.status == "GENERATED") {
                 this.setState({ isEditable: true })
             } */
            this.setState({ totalItems: res.data?.view?.totalItems, totalPages: res.data?.view?.totalPages })
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









    async componentDidMount() {
        console.log("estimation data 123", this.props.EstimationData)
        var owner_id = await localStorageService.getItem('owner_id');
        let from_owner_id = this.props.EstimationData?.Warehouse?.owner_id
        this.setState({ owner_id: owner_id })
        ReportService.checkReportLogins()
        this.loadData()
        this.getEstimationDetails()

    }

    async getEstimationDetails() {

        let estimation_id = this.props.EstimationData?.id
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        console.log('login_user_pharmacy_drugs_stores', login_user_pharmacy_drugs_stores)

        let params = {
            select_type: 'GROUP',
            group_by_status: true,
            estimation_id: estimation_id,
            // district : 'KANDY',
            district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district,
            institute_type: 'Provincial',
        }

        let res = await EstimationService.getEstimations(params)

        if (res.status === 200) {
            console.log('cheking Res', res)
            const total_count = res.data.view.reduce((total, item) => Number(total) + Number(item?.count || 0), 0)

            console.log('cheking total', total_count)
            this.setState({
                estimation_data: res.data.view,
                total_estimation: total_count,
                estimation_loading: true
            })
        }
    }


    async getHospitalEstimationAll(itemIds) {
        let owner_id = await localStorageService.getItem('owner_id')
        let estimationYear = Number(this.props.EstimationData?.EstimationSetup?.year) - 1
        const firstDay = new Date(estimationYear, 0, 1);
        const lastDay = new Date(estimationYear + 1, 0, 0);

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')


        let par = {
            item_id: itemIds,
            district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district,
            //owner_id: owner_id,
            year: estimationYear,
            //estimation_from: dateParse(firstDay),
            //estimation_to: dateParse(lastDay),
            provincial: true,
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




    calculateTotal() {
        return this.state.estimation_data.reduce((total, item) => {
            return Number(total) + Number(item?.count || 0);
        }, 0);
    }






    async downloadData() {
        this.setState({ printloaded: true })
        const chunkSize = 100
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
        filterData.used_for_estimates = 'Y'
        filterData.priority = 'Yes'
        filterData.consumables = this.state.estimationData?.consumables
        filterData.category_id = this.props.estimatedData?.item_category
        filterData.limit = limit
        filterData.page = page

        //filterData.owner_id = owner_id
        // let res = await EstimationService.getAllEstimationITEMS(filterData)
        let res = await InventoryService.fetchAllItems(filterData)

        if (res.status == 200) {
            console.log("data", res.data.view.data);
            let tempData = await this.loadEstimationsForDownload(res.data.view.data)
            return tempData
        } else {
            return []

        }
    }


    async loadEstimationsForDownload(data) {
        let item_ids = data.map((x) => x.id)

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')

        let params = {
            estimation_id: this.props.id,
            item_id: item_ids,
            institute_type: 'Provincial',
            search_type: 'EstimationMonthly',
            //finnished_estimaion: true,
            hospital_estimation_status: ['Pending Approvals', 'APPROVED', 'Active'],
            district: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district

        }

        let res = await EstimationService.getAllEstimationITEMS(params)

        if (res.status == 200) {
            console.log("all estimation data", res.data);
            let estimatedData = res.data?.view


            let reArrangeData = [];

            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                let ItemEstimations = estimatedData.filter((x => x.item_id == element.id))
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
                let count = 0
                if (ItemEstimations.length > 0) {
                    for (let i = 0; i < ItemEstimations.length; i++) {
                        const e = ItemEstimations[i];

                        sum_jan += parseFloat(e.January)
                        sum_feb += parseFloat(e.February)
                        sum_mar += parseFloat(e.March)
                        sum_apr += parseFloat(e.April)
                        sum_may += parseFloat(e.May)
                        sum_june += parseFloat(e.June)
                        sum_july += parseFloat(e.July)
                        sum_aug += parseFloat(e.August)
                        sum_sep += parseFloat(e.September)
                        sum_oct += parseFloat(e.October)
                        sum_nov += parseFloat(e.November)
                        sum_dec += parseFloat(e.December)
                        sum_estimation += parseFloat(e.estimation)
                        count = e.count
                    }

                }

                let temp = {
                    ItemSnap: { sr_no: element.sr_no, medium_description: element.medium_description, institution_level: element.Institution?.description, short_description: element.short_description, standard_cost: element.standard_cost },
                    item_id: element.id,
                    hospital_estimation_id: this.props.id,
                    //hospital_estimation_item_id: element.id,
                    //status: element.status,
                    /*  jan: element.estimation != 0 ? Number(element.jan) : sum_jan,
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
                     estimation: element.estimation != 0 ? Number(element.estimation) : sum_estimation, */
                    jan: sum_jan,
                    feb: sum_feb,
                    mar: sum_mar,
                    apr: sum_apr,
                    may: sum_may,
                    june: sum_june,
                    july: sum_july,
                    aug: sum_aug,
                    sep: sum_sep,
                    oct: sum_oct,
                    nov: sum_nov,
                    dec: sum_dec,
                    estimation: sum_estimation,
                    sum_estimations: sum_estimation,
                    ItemEstimations: ItemEstimations,
                    count: count


                }
                reArrangeData.push(temp)

            }

            return reArrangeData;
        } else {
            return []

        }
    }



    async downloadExcelSheet(data) {
        const items = [['SR NO', 'Description', 'Institution Level', 'Standard Cost', 'Estimation', 'Total'],
        ];



        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            items.push([element.ItemSnap?.sr_no, element.ItemSnap?.medium_description, element.ItemSnap?.institution_level, element.ItemSnap?.standard_cost, element.estimation, (element.ItemSnap?.standard_cost * (element.estimation || 0))])
        }



        let csv = ''

        // Loop the array of objects
        for (let row = 0; row < items.length; row++) {
            let keysAmount = Object.keys(items[row]).length
            let keysCounter = 0

            // csv += "SR,Item Name,Estimation\r\n"


            // If this is the first row, generate the headings
            if (row === 0) {
                csv += "SR NO, Description, Institution Level, Standard Cost, Estimation, Total \r\n"


            } else {
                csv += '\"' + items[row][0].toString() + '\"' + "   ," + '\"' + items[row][1] + '\"' + "," + items[row][2] + "," + items[row][3] + "," + items[row][4] + "," + items[row][5] + '\r\n'
                /*      csv += '\"' + items[row][0].startsWith('0') ? "'" + items[row][0] : items[row][0] + '\"' + "," +
             '\"' + items[row][1] + '\"' + "," +
             items[row][2] + "," +
             items[row][3] + "," +
             items[row][4] + "," +
             items[row][5] + '\r\n'; */

                // for (let key in items[row]) {
                // csv += padLeadingZeros((items[row][key]),8).toString() + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
                //csv += '=\"' + (items[row][key]).toString() + '\"' + (keysCounter + 1 < keysAmount ? ',' : '\\r\\n');


                /*  if (key === 'SR NO') {
                     csv += '=\"' + items[row][key] + '\"' + (keysCounter + 1 < keysAmount ? ',' : '\\r\\n');
                 } else {
                     csv += items[row][key] + (keysCounter + 1 < keysAmount ? ',' : '\\r\\n');
                 }
*/
                //    keysCounter++
                // }
            }

            // keysCounter = 0
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
        let id = 'b248a9cc-0038-8dc5-ba9d-f86eb462bdbc'

        let login_user_pharmacy_drugs_stores = await localStorageService.getItem('login_user_pharmacy_drugs_stores')
        var owner_id = await localStorageService.getItem('owner_id');

        let parameters = [
            { name: "district", value: login_user_pharmacy_drugs_stores[0]?.Pharmacy_drugs_store?.district },
            { name: "estimation_id", value: this.props.id },
            { name: "institution_type", value: 'Provincial' },
            { name: "year", value: this.props.EstimationData?.EstimationSetup?.year },
            /*  { name: "ownerid", value: owner_id }, */

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


                {this.state.estimation_loading &&
                    <Grid className='mt-5 w-full m-0 p-0'
                        container
                        display='flex'
                        alignItems='center'
                        justifyContent='center'

                    >
                        {/* {this.state.estimation_data.map((item, index) => (
                    <Fragment key={index}> */}
                        {/* <Grid item > */}
                        <CardComponent
                            name={"Pending"}
                            count={(this.state.estimation_data.filter((e) => e?.hospital_status === 'Pending').map((x) => x?.count)) || 0}
                            colour={'linear-gradient(45deg, #ffffff, #98E4FF)'}
                            total={this.state.total_estimation}
                            estimationData={this.props.EstimationData}
                            status={"Pending"}

                        ></CardComponent>
                        <CardComponent
                            name={"Generated"}
                            count={(this.state.estimation_data.filter((e) => e?.hospital_status === 'GENERATED').map((x) => x?.count)) || 0}
                            colour={'linear-gradient(45deg, #ffffff, #f6efba)'}
                            total={this.state.total_estimation}
                            estimationData={this.props.EstimationData}
                            status={"GENERATED"}
                        ></CardComponent>
                        <CardComponent
                            name={"Pending Approvals"}
                            count={(this.state.estimation_data.filter((e) => e?.hospital_status === 'Pending Approvals').map((x) => x?.count)) || 0}
                            colour={'linear-gradient(45deg, #ffffff, #ffd1d0)'}
                            total={this.state.total_estimation}
                            estimationData={this.props.EstimationData}
                            status={"Pending Approvals"}
                        ></CardComponent>
                        <CardComponent
                            name={"Approved"}
                            count={(this.state.estimation_data.filter((e) => e?.hospital_status === 'APPROVED').map((x) => x?.count)) || 0}
                            colour={'linear-gradient(45deg, #ffffff, #9cf1d1)'}
                            total={this.state.total_estimation}
                            estimationData={this.props.EstimationData}
                            status={"APPROVED"}
                        ></CardComponent>
                        <CardComponent
                            name={"Active"}
                            count={(this.state.estimation_data.filter((e) => e?.hospital_status === 'Active').map((x) => x?.count)) || 0}
                            colour={'linear-gradient(45deg, #ffffff, #d9d6f8)'}
                            total={this.state.total_estimation}
                            estimationData={this.props.EstimationData}
                            status={"Active"}
                        ></CardComponent>
                        <CardComponent
                            name={"Rejected"}
                            count={(this.state.estimation_data.filter((e) => e?.hospital_status === 'Rejected').map((x) => x?.count)) || 0}
                            colour={'linear-gradient(45deg, #ffffff, #f1b5b5)'}
                            total={this.state.total_estimation}
                            estimationData={this.props.EstimationData}
                            status={"Rejected"}
                        ></CardComponent>

                        {/* </Fragment>
                    ))} */}
                        {/* </Grid> */}

                    </Grid>
                }


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
                                            <TableCell>Level</TableCell>
                                            <TableCell>Standard Cost</TableCell>
                                            <TableCell>Last Year Estimation</TableCell>
                                            <TableCell>Total Estimation</TableCell>
                                            <TableCell>Estimation Deviation</TableCell>
                                            <TableCell>Total Cost</TableCell>
                                            <TableCell>Submitted Hospital Warehouses</TableCell>
                                            {/* <TableCell>Hospital Estimations</TableCell> */}
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, index) => {
                                            let validate = false
                                            let itemEstimation = this.state.estimationDataAll.find(x => x.item_id == row.item_id)?.estimation || null
                                            let deviation = roundDecimal(((Number(this.state.data[index]?.estimation || 0) - Number(itemEstimation || 0)) / Number(itemEstimation == 0 ? 1 : itemEstimation || 1) * 100), 2)

                                            let rowColor = ""
                                            if (deviation > 10) {
                                                rowColor = 'red'
                                            } else if (deviation < -10) {
                                                rowColor = '#fff145'
                                            } else if (-10 <= deviation <= 10) {
                                                rowColor = '#00e183'
                                            }





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
                                                    <TableCell>{row.ItemSnap?.institution_level}</TableCell>
                                                    <TableCell>{convertTocommaSeparated(row.ItemSnap?.standard_cost, 2)}</TableCell>
                                                    <TableCell> {convertTocommaSeparated(itemEstimation || 0, 2)}</TableCell>
                                                    <TableCell> {convertTocommaSeparated(this.state.data[index]?.estimation||0,2)}</TableCell>
                                                    <TableCell>
                                                        <div className='flex justify-center text-center items-center' style={{ width: 90, height: 25, borderRadius: 50, backgroundColor: rowColor }}>
                                                            {deviation} %
                                                        </div>

                                                    </TableCell>
                                                    <TableCell>{convertTocommaSeparated((row.ItemSnap?.standard_cost * (this.state.data[index]?.estimation || 0)), 2)}</TableCell>

                                                    {/* <TableCell>
                                                        <TextValidator

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


                                                                let val = parseFloat(e.target.value)
                                                                data[index].estimation = val
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
                                                                data[index].dec = val / 12
                                                                data[index].edited = true
                                                                this.setState({
                                                                    data
                                                                })



                                                            }}

                                                        />
                                                    </TableCell> */}
                                                    <TableCell> {data[index].count}</TableCell>
                                                    {/*  <TableCell> {data[index].sum_estimations}</TableCell> */}
                                                    <TableCell> {data[index].status}</TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center' style={{ marginLeft: '-10px' }}>


                                                            {data[index].count > 0 &&
                                                                <Tooltip title="View All Estimations">
                                                                    <IconButton
                                                                        onClick={() => {
                                                                            //this.loadHospitalsEstimations(row.item_id)
                                                                            this.setState({
                                                                                selected_item_id: row.item_id,
                                                                                selected_item_data: row,
                                                                                //selected_view_data: data[index].ItemEstimations,
                                                                                viewCompleteEstimations: true
                                                                            })
                                                                        }}>
                                                                        <VisibilityIcon color='primary' />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            }




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
                                                                    <SingalView item_id={row.item_id} sr_no={row.ItemSnap?.sr_no} owner_id={this.state.owner_id} estimationYear={this.props.EstimationData?.EstimationSetup?.year} estimationData={this.props.EstimationData} dpView={true}></SingalView>
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
                <Button className="ml-3" progress={this.state.printloaded} onClick={() => { this.downloadExcel() }}>Download CSV</Button>



                <Dialog fullWidth maxWidth="lg" /* fullScreen */ open={this.state.viewCompleteEstimations} onClose={() => { this.setState({ viewCompleteEstimations: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>

                        <CardTitle title={"Submitted Estimations - ( " + this.state.selected_item_data?.ItemSnap?.sr_no + " " + this.state.selected_item_data?.ItemSnap?.medium_description + " )"} />
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
                        <AlradyEstimatedWarehouseView item_id={this.state.selected_item_id} id={this.props.id} estimationData={this.props.EstimationData} dpView={true}></AlradyEstimatedWarehouseView>

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