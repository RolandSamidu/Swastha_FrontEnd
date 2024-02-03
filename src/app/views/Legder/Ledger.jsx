import React, { Component, Fragment } from 'react'
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle
} from "app/components/LoonsLabComponents";
import SearchIcon from '@material-ui/icons/Search'
import { CircularProgress, Grid, Divider, IconButton, Icon, InputAdornment } from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import WarehouseServices from 'app/services/WarehouseServices';
import localStorageService from 'app/services/localStorageService';
import PrescriptionService from 'app/services/PrescriptionService';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import { convertTocommaSeparated, dateParse, timeParse } from 'utils';
import InventoryService from 'app/services/InventoryService';
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { phamacistsTypes } from 'appconst';
import { Autocomplete } from '@material-ui/lab'
import ConsignmentService from 'app/services/ConsignmentService';
import EstimationService from 'app/services/EstimationService';
import ReactToPrint from 'react-to-print';
import PrintIcon from '@mui/icons-material/Print';
import { withStyles } from '@material-ui/styles';

const styles = {
    /*  root: {
         '& > * + *': {
             marginTop: theme.spacing(2),
         },
     }, */
    tableHeadCell: {
        width: '5%', textAlign: 'center', backgroundColor: 'white', fontWeight: 600, border: 0,
    },
    tabledataCell: {
        width: '5%', textAlign: 'center', backgroundColor: 'white', fontWeight: 500, border: 0,
    },

    customerHeadCell: {
        width: '15%', textAlign: 'center', backgroundColor: 'white', fontWeight: 600, border: 0,
    },

    customerCell: {
        width: '15%', textAlign: 'center', backgroundColor: 'white', fontWeight: 500, border: 0,
    },

    print: {
        paddingTop: '5px'
    }
};

class Legder extends Component {

    constructor(props) {
        super(props)
        this.state = {

            mergedData: [],
            minusQuantity: [],
            plusQuantity: [],

            item_list: [],
            prograssBarLoad: false,
            estimationData: null,
            grnData: [],
            item_des: null,
            item_code: null,
            prograss: false,
            servisableQty: null,
            unServisableQty: null,
            selectiveData: {
                warehouse_id: null,
                item_id: null,
                // limit:20,
                // page:0,
                to: null,
                from: null,
                search: null,
                item_batch_id: null
            },
            load: false,
            warehouseName: null,
            dataplussum: [],
            selectiveDataPlus: {
                page: 0,
                limit: 20
            },
            selectiveDataMinus: {
                page: 0,
                limit: 20
            },

            batchInfo: [],


            filterData: {
                limit: 5,
                page: 0,
                'order[0][0]': 'createdAt',
                'order[0][1]': 'DESC',
            },

            orderdataPlus: [],
            orderdata: [],

            filterData3: {
                limit: 20,
                page: 0,
                to: null,
                from: null,
                search: null,
            },

            formData: {
                ven_id: null,
                class_id: [],
                category_id: [],
                group_id: [],
                item_id: null,
                description: null,
                store_quantity: null,
                lessStock: null,
                moreStock: null,
                page: 0,
                limit: 20,
                //warehouse_id: this.props.warehouse_id,
                owner_id: '000',
                zero_needed: true,
                search: null,
                orderby_drug: true,
                orderby_sr: true,
                start_sr: null,
                end_sr: null

            },

            batchEnable: false,
            // plus
            data: [],
            columns: [
                {
                    name: 'datentime',
                    label: 'Date',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let date = this.state.data[dataIndex]?.createdAt
                            let data = dateParse(date)
                            return <p>{data}</p>
                        }
                    },

                },
                {
                    name: 'grn',
                    label: 'GRN / STV',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.data[dataIndex]
                            console.log('dadadada', data)
                            let viewdata = ""
                            if (data.type == 'GRN') {
                                let grnData = this.state.grnData.filter((presdata) => presdata.id == data.source_id)
                                console.log('grnData---------21212', grnData)
                                viewdata = grnData?.[0]?.GRN?.grn_no
                            }

                            if (data.type == 'Exchange_Issuance') {
                                let exchangeissuancedata = this.state.exchangeissuancedata.filter((presdata) => presdata.order_item_id == data.source_id)
                                viewdata = exchangeissuancedata?.[0]?.OrderItem?.OrderExchange?.order_id
                            }

                            // if (data.type == 'Order Issue' || data.type == 'Order Recieve' || data.type == 'Exchange_Recieve' || data.type == 'Order issue') {
                            //     console.log('orderdata_____1', this.state.orderdataPlus)
                            //     let orderdataPlus = this.state.orderdataPlus?.filter((presdata) => presdata.id == data.source_id)
                            //     console.log('orderdataPlus------------------555 receive', orderdataPlus)
                            //     //  viewdata = orderdata?.[0]?.OrderItem?.OrderExchange?.order_id + ' / ' + orderdata?.[0]?.OrderItem?.OrderExchange?.stv_no
                            //     viewdata = orderdataPlus?.[0]?.OrderItem?.OrderExchange?.stv_no
                            // }

                            if (data.type == 'Order Issue' || data.type == 'Order Recieve' || data.type == 'Exchange_Recieve' || data.type == 'Order issue' || data.type == 'Order Reverse') {
                                console.log('orderdata_____1', this.state.orderdataPlus)
                                let orderdataPlus = this.state.orderdataPlus?.filter((presdata) => presdata.id == data.source_id)
                                viewdata = orderdataPlus?.[0]?.OrderItem?.OrderExchange?.stv_no
                            }

                            if (data.type == 'Clinic_manual' || data.type == 'Drug Balancing'
                                || data.type == 'Excess_manual' || data.type == 'OPD_manual'
                                || data.type == 'Ward_manual' || data.type == 'Waste') {
                                //  let manualdata = this.state.manualdata.filter((presdata) => presdata.id == data.source_id )
                                viewdata = "N/A"
                            }

                            return <p>{viewdata}</p>
                        }

                    },
                },
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.batch_no

                            return <p>{data}</p>
                        }

                    },
                },
                {
                    name: 'batch_status',
                    label: 'Batch Status',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.status

                            return <p>{data}</p>
                        }

                    },
                },

                {
                    name: 'qty',
                    label: 'Quantity',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.data[dataIndex]?.quantity

                            // return <p>{data}</p>
                            if (data < 0) {
                                return <p>{convertTocommaSeparated(Math.abs(data), 2)}</p>
                            } else {
                                return <p>{convertTocommaSeparated(data, 2)}</p>
                            }
                        }

                    },
                },

            ],

            datamin: [],
            columnsminus: [
                {
                    name: 'datentime',
                    label: 'Date & Time',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let date = this.state.datamin[dataIndex]?.createdAt
                            let data = dateParse(date);
                            return <p>{data}</p>
                        }
                    },

                },
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.datamin[dataIndex]?.ItemSnapBatch?.batch_no

                            return <p>{data}</p>
                        }

                    },
                },
                {
                    name: 'batch_status',
                    label: 'Batch Status',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.datamin[dataIndex]?.ItemSnapBatch?.status

                            return <p>{data}</p>
                        }

                    },
                },
                {
                    name: 'stv',
                    label: 'STV',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.datamin[dataIndex]
                            console.log('dadadada', data)
                            let viewdata = ""
                            if (data.type == 'Issuing') {
                                let prescriptiondata = this.state.prescriptiondata.filter((presdata) => presdata.id == data.source_id)
                                viewdata = "Prescription of : " + prescriptiondata[0]?.Patient?.name + ' - PHN ' + prescriptiondata[0]?.Patient?.phn
                            }

                            if (data.type == 'Exchange_Issuance') {
                                let exchangeissuancedata = this.state.exchangeissuancedata.filter((presdata) => presdata.order_item_id == data.source_id)
                                viewdata = exchangeissuancedata?.[0]?.OrderItem?.OrderExchange?.order_id

                            }

                            if (data.type == 'Order Issue' || data.type == 'Order Recieve' || data.type == 'Exchange_Recieve' || data.type == 'Order issue' || data.type == 'Order Reverse') {
                                console.log('orderdata_____1', this.state.orderdata)
                                let orderdata = this.state.orderdata?.filter((presdata) => presdata.id == data.source_id)
                                console.log('orderdata------------------555', orderdata)
                                //  viewdata = orderdata?.[0]?.OrderItem?.OrderExchange?.order_id + ' / ' + orderdata?.[0]?.OrderItem?.OrderExchange?.stv_no
                                viewdata = orderdata?.[0]?.OrderItem?.OrderExchange?.stv_no
                            }

                            if (data.type == 'Clinic_manual' || data.type == 'Drug Balancing'
                                || data.type == 'Excess_manual' || data.type == 'OPD_manual'
                                || data.type == 'Ward_manual' || data.type == 'Waste') {
                                //  let manualdata = this.state.manualdata.filter((presdata) => presdata.id == data.source_id )
                                viewdata = "N/A"
                            }

                            return <p>{viewdata}</p>
                        }

                    },
                },
                {
                    name: 'institution',
                    label: 'Institition/Customer',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.datamin[dataIndex]
                            console.log('dadadada', data)
                            let viewdata = ""
                            if (data.type == 'Issuing') {
                                let prescriptiondata = this.state.prescriptiondata.filter((presdata) => presdata.id == data.source_id)
                                viewdata = prescriptiondata[0]?.Patient?.name
                            }

                            if (data.type == 'Exchange_Issuance') {
                                let exchangeissuancedata = this.state.exchangeissuancedata.filter((presdata) => presdata.order_item_id == data.source_id)
                                viewdata = exchangeissuancedata?.[0]?.OrderItem?.OrderExchange?.fromStore?.name

                            }

                            if (data.type == 'Order Issue' || data.type == 'Order Recieve' || data.type == 'Exchange_Recieve' || data.type == 'Order issue' || data.type == 'Order Reverse' || data.type == 'Order Reverse') {
                                console.log('orderdata_____1', this.state.orderdata)
                                let orderdata = this.state.orderdata?.filter((presdata) => presdata.id == data.source_id)
                                console.log('orderdata------------------555', orderdata)
                                //  viewdata = orderdata?.[0]?.OrderItem?.OrderExchange?.order_id + ' / ' + orderdata?.[0]?.OrderItem?.OrderExchange?.stv_no
                                viewdata = orderdata?.[0]?.OrderItem?.OrderExchange?.fromStore?.name
                            }
                            if (data.type == 'Clinic_manual' || data.type == 'Drug Balancing'
                                || data.type == 'Excess_manual' || data.type == 'OPD_manual'
                                || data.type == 'Ward_manual' || data.type == 'Waste') {
                                //  let manualdata = this.state.manualdata.filter((presdata) => presdata.id == data.source_id )
                                viewdata = "N/A"
                            }

                            return <p>{viewdata}</p>
                        }

                    },
                },

                {
                    name: 'qty',
                    label: 'Quantity',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let data = this.state.datamin[dataIndex]?.quantity

                            if (data < 0) {

                                return <p>{convertTocommaSeparated(Math.abs(data), 2)}</p>
                            } else {
                                return <p>{convertTocommaSeparated(data, 2)}</p>
                                // return <p>{convertTocommaSeparated(data, 2)}</p>
                            }
                        }

                    },
                },

            ],
            suggestedWareHouses: {
                item_id: null,
                warehouse_id: null,
                limit: 20,
                page: 0,
            },



        }
    }

    // async loadWarehouse() {
    //     var res = await localStorageService.getItem('Selected_Warehouse')
    //     console.log('warehouse', res)

    //     this.setState({
    //         warehouse: res
    //     })
    // }

    async loadManualData(manuallist) {

        let manuallistId = manuallist.map(data => data.source_id);

        let params = {

            id: manuallistId,
            page: 0,
            limit: 20,



        }
        let batch_res = await WarehouseServices.getDrugBalancing(params)
        if (batch_res.status == 200) {
            this.setState({

                manualdata: batch_res.data.view.data,
                //loaded: true,
            })
            console.log('manualdata', this.state.manualdata)
        }
    }

    async loadOrderData(orderlist) {
        console.log('check incoming data', orderlist)
        let orderlistId = orderlist.map(data => data.source_id);

        let params = {
            id: orderlistId,
            page: 0,
            limit: 20,
        }
        let batch_res = await PharmacyOrderService.getOrderBatchItems(params)
        if (batch_res.status == 200) {
            console.log('res------------11111', batch_res)
            this.setState({
                orderdata: batch_res.data.view.data,
                // loaded: true
            })

        }
    }


    async loadOrderDataForPluse(orderlist) {
        console.log('check incoming data 2', orderlist)
        let orderlistId = orderlist.map(data => data.source_id);

        let params = {
            id: orderlistId,
            page: 0,
            limit: 20,
        }
        let batch_res = await PharmacyOrderService.getOrderBatchItems(params)
        if (batch_res.status == 200) {
            console.log('res------------11111500', batch_res)
            this.setState({
                orderdataPlus: batch_res.data.view.data,
                // loaded: true
            })

        }
    }

    async loadPrescriptionAdditionalData(prescriptionlist) {
        let prescriptionlistId = prescriptionlist.map(data => data.source_id);

        let params = {

            id: prescriptionlistId,
            page: 0,
            limit: 20,
            no_druglist: true


        }
        let batch_res = await PrescriptionService.fetchPrescriptions(params)
        if (batch_res.status == 200) {
            this.setState({
                prescriptiondata: batch_res.data.view.data,
                //loaded: true,
            })
            console.log('data3', this.state.prescriptiondata)
        }
    }

    async grnItemData(grnItemList) {
        let grnItemlistId = grnItemList.map(data => data.source_id);

        let params = {
            grn_item_ids: grnItemlistId,
            page: 0,
            limit: 20,
        }
        let batch_res = await ConsignmentService.getGRNItems(params)
        if (batch_res.status == 200) {
            console.log('res------------11111', batch_res)
            this.setState({
                grnData: batch_res.data.view.data,
                // loaded: true
            })

        }
    }

    async getBatchInfo(e) {

        let params = { ...this.state.selectiveData }
        params.item_id = this.state.selectiveData.item_id
        params.in_my_warehouse = true
        params.search = e

        let res = await InventoryService.fetchItemBatchByItem_Id(params)

        if (res.status === 200) {
            console.log('check batch info', res.data.view.data)

            // let uniqueList = res.data.view.data.map(dataSet => dataSet.ItemSnapBatch)
            //     .reduce((acc, dataSet) => {
            //         if (!acc.some(item => item.batch_no === dataSet.batch_no && item.id === dataSet.id)) {
            //         acc.push({ id: dataSet.id, batch_no: dataSet.batch_no });
            //         }
            //         return acc;
            //     }, []);

            // let uniqueData = Array.from(new Set(res.data.view.data));

            // console.log('check uniqueData', uniqueList)

            this.setState({
                batchInfo: res.data.view.data
            })
        }

    }


    // data load for table plus
    async loadDataPluse() {
        console.log('selective data', this.state.selectiveData)
        let params = { ...this.state.selectiveData }
        params.recieve = true
        params.limit = this.state.selectiveDataPlus.limit
        params.page = this.state.selectiveDataPlus.page
        params.order = ['createdAt']
        params.item_status = ['Withhold', 'Withdraw', 'Under servilance', 'Active', 'Pending', 'DC', 'Discontinued']

        console.log("loadAdditionalData", params)

        let batch_res = await WarehouseServices.getAdditionalData(params)
        console.log('batch', batch_res)
        if (batch_res.status == 200) {
            let grnItemList = batch_res.data.view.data.filter((data) => data.type == 'GRN');
            // let prescriptionlist = batch_res.data.view.data.filter((data) => data.type == 'Issuing' );
            let orderissuelist = batch_res.data.view.data.filter((data) => data.type == 'Order Issue' || data.type == 'Order Recieve' || data.type == 'Order issue'
                || data.type == 'Exchange_Recieve' || data.type == 'Order Reverse');
            let manuallist = batch_res.data.view.data.filter((data) => data.type == 'Clinic_manual' || data.type == 'Drug Balancing'
                || data.type == 'Excess_manual' || data.type == 'Issuing' || data.type == 'OPD_manual'
                || data.type == 'Ward_manual' || data.type == 'Waste');
            let exchangeissuancelist = batch_res.data.view.data.filter((data) => data.type == 'Exchange_Issuance');
            if (grnItemList.length > 0) {
                this.grnItemData(grnItemList)
            }
            if (orderissuelist.length > 0) {
                console.log('called grn')
                this.loadOrderDataForPluse(orderissuelist)
            }
            if (manuallist.length > 0) {
                this.loadManualData(manuallist)
            }
            if (exchangeissuancelist.length > 0) {
                this.loadExchangeIssuanceData(exchangeissuancelist)
            }



            this.setState({
                data: batch_res.data.view.data,
                totalItemsPlus: batch_res.data.view.totalItems,
                // loaded: true,
            }, () => {
                this.loadDataMinus()
            })
            console.log('data add', this.state.data)
        }
    }


    // data load for table minus
    async loadDataMinus() {

        let params1 = { ...this.state.selectiveData }
        params1.issuance = true
        params1.limit = this.state.selectiveDataMinus.limit
        params1.page = this.state.selectiveDataMinus.page
        params1.order = ['createdAt']
        params1.item_status = ['Withhold', 'Withdraw', 'Under servilance', 'Active', 'Pending', 'DC', 'Discontinued']


        let batch_res1 = await WarehouseServices.getAdditionalData(params1)
        console.log('bat---------------hhdhhddh', batch_res1)
        if (batch_res1.status == 200) {
            let prescriptionlist = batch_res1.data.view.data.filter((data) => data.type == 'Issuing');
            let orderissuelist = batch_res1.data.view.data.filter((data) => data.type == 'Order Issue' || data.type == 'Order Recieve' || data.type == 'Order issue'
                || data.type == 'Exchange_Recieve' || data.type == 'Order Reverse');
            let manuallist = batch_res1.data.view.data.filter((data) => data.type == 'Clinic_manual' || data.type == 'Drug Balancing'
                || data.type == 'Excess_manual' || data.type == 'Issuing' || data.type == 'OPD_manual'
                || data.type == 'Ward_manual' || data.type == 'Waste');
            let exchangeissuancelist = batch_res1.data.view.data.filter((data) => data.type == 'Exchange_Issuance');
            if (prescriptionlist.length > 0) {
                this.loadPrescriptionAdditionalData(prescriptionlist)
            }
            if (orderissuelist.length > 0) {
                console.log('orderissuelist----------------111', orderissuelist)
                this.loadOrderData(orderissuelist)
            }
            if (manuallist.length > 0) {
                this.loadManualData(manuallist)
            }
            if (exchangeissuancelist.length > 0) {
                this.loadExchangeIssuanceData(exchangeissuancelist)
            }

            this.setState({
                datamin: batch_res1.data.view.data,
                totalItemsMinus: batch_res1.data.view.totalItems,
                prograssBarLoad: false,
                loaded: true,
            }, () => {
                this.loadStockData()
                this.loadStockUnservisableData()
                this.loadItemEstimation()
                // this.getUOMByID()
                this.mergeDataArrays()
            })
            console.log('data add-----------------hhjhj', this.state.datamin)
        }
    }

    async loadDataMinusSum() {

        let params1 = { ...this.state.selectiveData }
        params1.issuance = true
        params1.search_type = 'SUM'

        let batch_res1 = await WarehouseServices.getAdditionalData(params1)
        console.log('batch', batch_res1)
        if (batch_res1.status == 200) {

            this.setState({
                dataminsum: batch_res1.data.view,
                // loaded: true,
            }, () => {
                this.loadDataPlusSum()
            })
            console.log('data add', this.state.dataminsum)
        }
    }

    async loadDataPlusSum() {


        let params1 = { ...this.state.selectiveData }
        params1.recieve = true
        params1.search_type = 'SUM'

        let batch_res1 = await WarehouseServices.getAdditionalData(params1)
        console.log('-----4444-------4', batch_res1)
        if (batch_res1.status == 200) {

            this.setState({
                dataplussum: batch_res1.data.view,
                // loaded: true,
            }, () => {
                this.loadDataPluse()
            })
            console.log('datahdhdhdhdhdhdhdh', this.state.dataplussum)
        }
    }



    async loadExchangeIssuanceData(exchangeissuancelist) {

        let exchangeissuanclistId = exchangeissuancelist.map(data => data.source_id);

        let params = {

            order_item_id: exchangeissuanclistId,
            page: 0,
            limit: 5,
        }
        let batch_res = await PharmacyOrderService.getOrderBatchItems(params)
        if (batch_res.status == 200) {
            this.setState({
                exchangeissuancedata: batch_res.data.view.data,
                //loaded: true,
            })
            console.log('exchange', this.state.exchangeissuancedata)
        }
    }


    async setPage(page) {
        //Change paginations
        let selectiveDataPlus = this.state.selectiveDataPlus
        selectiveDataPlus.page = page
        this.setState(
            {
                selectiveDataPlus,
            },
            () => {
                this.dataSubmit()
            }
        )
    }
    async setPagemin(page) {
        //Change paginations
        let selectiveDataMinus = this.state.selectiveDataMinus
        selectiveDataMinus.page = page
        this.setState(
            {
                selectiveDataMinus,
            },
            () => {
                this.dataSubmit()
            }
        )
    }

    // get warehouse
    async loadWarehouses() {

        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        var id = user.id
        var all_pharmacy_dummy = []
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        if (!selected_warehouse_cache) {
            this.setState({ selectwarehouseView: true })
        } else {
            let suggestedWareHouses = this.state.suggestedWareHouses
            suggestedWareHouses.warehouse_id = selected_warehouse_cache?.id

            this.setState({ selectwarehouseView: false })
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params)
        if (res.status == 200) {
            console.log('CPALLOders', res.data.view.data)

            res.data.view.data.forEach((element) => {
                all_pharmacy_dummy.push({
                    warehouse: element.Warehouse,
                    name: element.Warehouse.name,
                    main_or_personal: element.Warehouse.main_or_personal,
                    owner_id: element.Warehouse.owner_id,
                    id: element.warehouse_id,
                    pharmacy_drugs_stores_id:
                        element.Warehouse.pharmacy_drugs_store_id,
                })
            })
            console.log('warehouse-------------------------->>', all_pharmacy_dummy)
            this.setState({ all_pharmacy_dummy })
        }
    }


    // load all item
    async getItem(value) {

        let data = {
            search: value
        }
        let res = await InventoryService.fetchAllItems(data)

        if (res.status === 200) {
            console.log("ITEM------------------------------->>", res)
            this.setState({ item_list: res.data.view.data })
        }
    }

    dataSubmit() {

        console.log('ghhhhhhhhhhhhhhhh', this.state.selectiveData)
        this.setState({
            loaded: false,
            prograssBarLoad: true
        }, () => {
            this.loadDataMinusSum()

        })
    }



    // get national monthly req
    async loadItemEstimation(data) {

        const currentYear = new Date().getFullYear();
        const firstDate = new Date(currentYear, 0, 1);
        const lastDate = new Date(currentYear, 11, 31);

        console.log('firstDate', firstDate)
        console.log('lastDate', lastDate)

        let params = {

            item_id: this.state.selectiveData.item_id,
            // estimation_status: 'Active',
            // available_estimation: 'Active',
            // status: 'Active',
            // hospital_estimation_status: 'Active',
            no_rmsd: true,
            search_type: 'EstimationGroup',
            // from:dateParse(firstDate),
            estimation_from: dateParse(firstDate),
            estimation_to: dateParse(lastDate)

        }

        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            console.log("loaded data estimation", res)
            this.setState({
                estimationData: res.data?.view
            })
        }

        this.setState({
            loaded: true
        })
    }


    // servisable qty
    async loadStockData() {

        let params = {
            warehouse_id: this.state.selectiveData.warehouse_id,
            items: [this.state.selectiveData.item_id],
            zero_needed: true,
            // distribution_officer_id: this.state.formData.distribution_officer_id
        }

        console.log('servisable qty----111', params)
        let res = await InventoryService.getInventoryFromSR(params)
        if (res.status) {
            console.log('servisable qty', res.data.posted.data)
            this.setState({
                servisableQty: res.data.posted.data,
                loaded: true,
            })
        }
    }

    // unservisable qty
    async loadStockUnservisableData() {

        let params = {
            warehouse_id: this.state.selectiveData.warehouse_id,
            items: [this.state.selectiveData.item_id],
            zero_needed: true,
            item_status: ['Withhold', 'Withdraw', 'Under servilance']
            // distribution_officer_id: this.state.formData.distribution_officer_id
        }

        console.log('servisable qty----111', params)
        let res = await InventoryService.getInventoryFromSR(params)
        if (res.status) {
            console.log('servisable qty', res.data.posted.data)
            this.setState({
                unServisableQty: res.data.posted.data,
                loaded: true,
            })
        }
    }

    async getUOMByID() {

        let id = this.state.selectiveData.item_id

        let params = {
            item_id: id
        }

        const res = await InventoryService.GetUomById(params)

        if (res === 200) {
            console.log('item-----data', res)
        }
    }

    mergeDataArrays = () => {

        const mergedArray = [...this.state.data, ...this.state.datamin];
        console.log('mergedata', mergedArray)

        mergedArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const minusQuantity = this.state.mergedData.filter((x) => x.quantity < 0);
        const plusQuantity = this.state.mergedData.filter((x) => x.quantity >= 0);


        this.setState({
            mergedData: mergedArray,
            minusQuantity: minusQuantity,
            plusQuantity: plusQuantity
        });
    };

    renderTable(mergedata) {
        const { classes } = this.props
        let totalPlus = 0;
        return (
            <table className="w-full" >
                <thead>
                    <tr>

                    </tr>
                </thead>
                <tbody>

                    <th>{`+ Receipt\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ${this.state.dataplussum?.[0] ? convertTocommaSeparated(this.state.dataplussum?.[0]?.quantity, 2) : 0}`}</th>
                    <th>{`- Issues \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  ${this.state.dataminsum?.[0] ? convertTocommaSeparated(Math.abs(this.state.dataminsum?.[0]?.quantity), 2) : 0}`}</th>
                    {console.log('mmmm', this.state.mergedData)}
                    <tr>
                        <td>

                            <th className={classes.tableHeadCell}>Date</th>
                            <th className={classes.tableHeadCell}>GRN/STV</th>
                            <th className={classes.tableHeadCell}>Status</th>
                            <th className={classes.tableHeadCell}>Batch No</th>
                            <th className={classes.tableHeadCell}>Quantity</th>

                        </td>
                        <td>
                            <th className={classes.tableHeadCell}>Date</th>
                            <th className={classes.tableHeadCell}>Batch No</th>
                            <th className={classes.tableHeadCell}>Batch Status</th>
                            <th className={classes.tableHeadCell}>STV</th>
                            <th className={classes.customerHeadCell}>Institution/Customer</th>
                            <th className={classes.tableHeadCell}>Quantity</th>
                        </td>
                    </tr>

                    {mergedata.map((x, i) => {

                        if (x.quantity >= 0) {


                            totalPlus += Math.abs(x.quantity)
                        }


                        console.log('totalplus', totalPlus)

                        console.log('xx', x)
                        let data = mergedata.filter((dataminItem) => dataminItem.id == x.id)
                        console.log('dadanew', data)
                        console.log('type', data[0].type)
                        let viewdata = ""
                        let customer = ""
                        if (data[0].type == 'Issuing') {
                            let prescriptiondata = this.state.prescriptiondata.filter((presdata) => presdata.id == data[0].source_id)
                            viewdata = "Prescription of : " + prescriptiondata[0]?.Patient?.name + ' - PHN ' + prescriptiondata[0]?.Patient?.phn
                        }

                        if (data[0].type == 'Exchange_Issuance') {
                            let exchangeissuancedata = this.state.exchangeissuancedata.filter((presdata) => presdata.order_item_id == data[0].source_id)
                            viewdata = exchangeissuancedata?.[0]?.OrderItem?.OrderExchange?.order_id

                        }

                        if (data[0].type == 'Order Issue' || data[0].type == 'Order Recieve' || data[0].type == 'Exchange_Recieve' || data[0].type == 'Order issue' || data[0].type == 'Order Reverse') {
                            console.log('orderdata_____1', this.state.orderdata)
                            let orderdata = this.state.orderdata?.filter((presdata) => presdata.id == data[0].source_id)
                            console.log('orderdata------------------555', orderdata)
                            //  viewdata = orderdata?.[0]?.OrderItem?.OrderExchange?.order_id + ' / ' + orderdata?.[0]?.OrderItem?.OrderExchange?.stv_no
                            viewdata = orderdata?.[0]?.OrderItem?.OrderExchange?.stv_no
                        }

                        if (data[0].type == 'Clinic_manual' || data[0].type == 'Drug Balancing'
                            || data[0].type == 'Excess_manual' || data[0].type == 'OPD_manual'
                            || data[0].type == 'Ward_manual' || data[0].type == 'Waste') {
                            //  let manualdata = this.state.manualdata.filter((presdata) => presdata.id == data.source_id )
                            viewdata = "N/A"
                        }

                        if (data[0].type == null) {
                            //  let manualdata = this.state.manualdata.filter((presdata) => presdata.id == data.source_id )
                            viewdata = "N/A"
                            customer = "N/A"
                        }

                        if (data[0].type == 'Issuing') {
                            let prescriptiondata = this.state.prescriptiondata.filter((presdata) => presdata.id == data[0].source_id)
                            customer = prescriptiondata[0]?.Patient?.name
                        }

                        if (data[0].type == 'Exchange_Issuance') {
                            let exchangeissuancedata = this.state.exchangeissuancedata.filter((presdata) => presdata.order_item_id == data[0].source_id)
                            customer = exchangeissuancedata?.[0]?.OrderItem?.OrderExchange?.fromStore?.name

                        }

                        if (data[0].type == 'Order Issue' || data[0].type == 'Order Recieve' || data[0].type == 'Exchange_Recieve' || data[0].type == 'Order issue' || data[0].type == 'Order Reverse' || data[0].type == 'Order Reverse') {
                            console.log('orderdata_____1', this.state.orderdata)
                            let orderdata = this.state.orderdata?.filter((presdata) => presdata.id == data[0].source_id)
                            console.log('orderdata------------------555', orderdata)
                            //  viewdata = orderdata?.[0]?.OrderItem?.OrderExchange?.order_id + ' / ' + orderdata?.[0]?.OrderItem?.OrderExchange?.stv_no
                            customer = orderdata?.[0]?.OrderItem?.OrderExchange?.fromStore?.name
                        }

                        if (data[0].type == 'Clinic_manual' || data[0].type == 'Drug Balancing'
                            || data[0].type == 'Excess_manual' || data[0].type == 'OPD_manual'
                            || data[0].type == 'Ward_manual' || data[0].type == 'Waste') {
                            //  let manualdata = this.state.manualdata.filter((presdata) => presdata.id == data.source_id )
                            customer = "N/A"
                        }

                        console.log('newwwwwwwww', viewdata)




                        return <tr key={x.quantity}>


                            <td>
                                {/* {i === 0 && (
                                        
                                    )
                                    } */}


                                {x.quantity >= 0 ? <>

                                    <td className={classes.tabledataCell}>{dateParse(x.createdAt)}</td>
                                    <td className={classes.tabledataCell}>{viewdata}</td>
                                    <td className={classes.tabledataCell}>{x.status}</td>
                                    <td className={classes.tabledataCell}>{x.ItemSnapBatch.batch_no}</td>
                                    <td className={classes.tabledataCell}>{Math.abs(x.quantity)}</td>

                                </> : <>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                </>

                                }


                            </td>

                            <td style={{ display: 'block' }}>
                                {/* {i == 0 && (
                                        <tr>
                                            
                                        </tr>
                                    )} */}
                                {x.quantity < 0 ? <>







                                    <td className={classes.tabledataCell}>{dateParse(x.createdAt)}</td>
                                    <td className={classes.tabledataCell}>{x.ItemSnapBatch.batch_no}</td>
                                    <td className={classes.tabledataCell}>{x.status}</td>
                                    <td className={classes.tabledataCell}>{viewdata}</td>
                                    <td className={classes.customerCell}>{customer}</td>
                                    <td className={classes.tabledataCell}>{Math.abs(x.quantity)}</td>

                                </> : <>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>
                                    <td className={classes.tabledataCell}>{' '}</td>

                                </>


                                }




                            </td>




                        </tr>


                    })}

                    <div className='pt-4'>

                    </div>
                    <tr>
                        <th>{`Total:\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ${this.state.dataplussum?.[0] ? convertTocommaSeparated(this.state.dataplussum?.[0]?.quantity, 2) : 0}`}</th>
                        <th>{`Total:\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  ${this.state.dataminsum?.[0] ? convertTocommaSeparated(Math.abs(this.state.dataminsum?.[0]?.quantity), 2) : 0}`}</th>
                    </tr>

                    {/* {mergedata.map((x) => (
                            <tr key={x.createdAt}>
                                <td>{x.createdAt}</td>
                            </tr>
    
                        ))} */}
                </tbody>

                {/* <thead>
                        <tr>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
    
                        {mergedata.map((x) => (
                            <tr key={x.createdAt}>
                                <td>{dateParse(x.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody> */}
            </table>
        );
    }


    componentDidMount() {
        this.loadWarehouses()
        // this.getBatchInfo()
        // this.getItem()
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title="Ledger Report" />
                        <ValidatorForm onSubmit={() => this.dataSubmit()} onError={() => null} className="w-full">
                            <Grid container spacing={2} className='mt-5'>
                                <Grid item xs={12} sm={3}>
                                    {/* warehouse */}
                                    <SubTitle title="Warehouse" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        // ref={elmRef}
                                        options={this.state.all_pharmacy_dummy}
                                        onChange={(e, value) => {

                                            if (value != null) {

                                                let selectiveData = this.state.selectiveData
                                                selectiveData.warehouse_id = value.id
                                                this.setState({
                                                    selectWarehouseView: false,
                                                    selectiveData,
                                                    warehouseName: value.name
                                                })
                                                //this.suggestedWareHouse()
                                            }
                                        }}

                                        getOptionLabel={(option) => option.name
                                            // option.name != null
                                            //     ? option.name +
                                            //     ' - ' +
                                            //     option.main_or_personal
                                            //     : null
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Warehouse"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"

                                                validators={this.state.selectiveData.warehouse_id ? [] : ['required']}
                                                errorMessages={this.state.selectiveData.warehouse_id ? [] : ['this field is required']}

                                            />
                                        )}
                                    />

                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    {/* item */}
                                    <SubTitle title="Item" />
                                    <Autocomplete
                                        disableClearable className="w-full"
                                        options={this.state.item_list}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let selectiveData = this.state.selectiveData
                                                selectiveData.item_id = value.id

                                                this.setState({
                                                    selectiveData,
                                                    item_des: value.sr_no,
                                                    item_code: value.medium_description,
                                                    batchEnable: true
                                                })
                                                // this.getBatchInfo(value.id)
                                            }
                                            else if (value == null) {
                                                let selectiveData = this.state.selectiveData
                                                selectiveData.item = null
                                                this.setState({
                                                    selectiveData

                                                })
                                            }
                                        }}

                                        getOptionLabel={(
                                            option) => option.sr_no + ' - ' + option.medium_description}
                                        renderInput={(params) => (
                                            <TextValidator {...params}
                                                placeholder="Type SR or Name"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    if (e.target.value.length > 3) {
                                                        this.getItem(e.target.value);
                                                    }
                                                }}
                                                validators={this.state.selectiveData.item_id ? [] : ['required']}
                                                errorMessages={this.state.selectiveData.item_id ? [] : ['this field is required']}

                                            />
                                        )} />

                                </Grid>

                                <Grid item xs={12} sm={3}>
                                    {/* item */}
                                    <SubTitle title="Batch No" />
                                    <Autocomplete

                                        disableClearable
                                        className="w-full"
                                        options={this.state.batchInfo}
                                        disabled={!this.state.batchEnable}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let selectiveData = this.state.selectiveData;
                                                selectiveData.item_batch_id = value.id;

                                                this.setState({
                                                    selectiveData,
                                                });
                                            } else {
                                                let selectiveData = this.state.selectiveData;
                                                selectiveData.item_batch_id = null;
                                                this.setState({
                                                    selectiveData,
                                                });
                                            }
                                        }}
                                        getOptionLabel={(option) =>
                                            option.batch_no
                                                ? option.batch_no
                                                : ''
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Batch No"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    if (e.target.value.length > 2) {
                                                        this.getBatchInfo(e.target.value);
                                                    }
                                                }}
                                            // validators={this.state.selectiveData.batch_no ? [] : ['required']}
                                            // errorMessages={
                                            //     this.state.selectiveData.batch_no ? [] : ['This field is required']
                                            // }
                                            />
                                        )}
                                    />

                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <SubTitle title="From date" />
                                    <LoonsDatePicker className="w-full"
                                        value={this.state.selectiveData.from}
                                        placeholder="From Date"
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        required={true}
                                        // disabled={this.state.date_selection}
                                        // errorMessages="this field is required"
                                        onChange={(date) => {
                                            let selectiveData = this.state.selectiveData
                                            selectiveData.from = dateParse(date)
                                            this.setState({ selectiveData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                        format='dd/MM/yyyy'
                                    />
                                </Grid>

                                <Grid item xs={12} sm={3} md={3} lg={3}>
                                    <SubTitle title="To date" />
                                    <LoonsDatePicker className="w-full"
                                        value={this.state.selectiveData.to}
                                        placeholder="To Date"
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        required={true}
                                        // disabled={this.state.date_selection}
                                        // errorMessages="this field is required"
                                        onChange={(date) => {
                                            let selectiveData = this.state.selectiveData
                                            selectiveData.to = dateParse(date)
                                            this.setState({ selectiveData })
                                        }}
                                        validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                        format='dd/MM/yyyy'
                                    />
                                </Grid>



                                <Grid className=" w-full mt-6" item="item" lg={3} md={3} sm={12} xs={12} >
                                    <LoonsButton
                                        color="primary"
                                        size="medium"
                                        type="submit"
                                    >
                                        Submit
                                    </LoonsButton>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        {this.state.loaded ?
                            <>

                                <Grid container className='mt-5'>
                                    <Grid item sm={12}>
                                        <div className='p-5' style={{ border: '3px solid #2C7EF2', background: '#CFD5FF', borderRadius: '5px' }}>
                                            <table className='w-full'>
                                                <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Warehouse </td>
                                                    <td style={{ width: '80%' }}>: {this.state.warehouseName}</td>
                                                </tr>
                                            </table>
                                            <br />
                                            <table className='w-full'>
                                                <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Item Code </td>
                                                    <td style={{ width: '80%' }}>: {this.state.item_des}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Description </td>
                                                    <td style={{ width: '80%' }}>: {this.state.item_code}</td>
                                                </tr>
                                                {/* <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>UOM </td>
                                                    <td style={{ width: '80%' }}>: {}</td>
                                                </tr> */}
                                            </table>
                                            <br></br>
                                            <table className='w-full'>
                                                <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Serviceable Qty </td>
                                                    <td style={{ width: '80%' }}>: {convertTocommaSeparated(this.state.servisableQty?.[0]?.quantity || 0, 2)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Unserviceable Qty </td>
                                                    <td style={{ width: '80%' }}>: {convertTocommaSeparated(this.state.unServisableQty?.[0]?.quantity || 0, 2)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>On Hand </td>
                                                    <td style={{ width: '80%' }}>: {convertTocommaSeparated(Number(this.state.servisableQty?.[0]?.quantity || 0) + Number(this.state.unServisableQty?.[0]?.quantity || 0), 2)}</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>National Monthly Requirement</td>
                                                    <td style={{ width: '80%' }}>: {convertTocommaSeparated(Number((this.state.estimationData?.[0]?.estimation) / 12 || 0), 2)}</td>
                                                </tr>
                                            </table>
                                        </div>
                                    </Grid>
                                </Grid>

                                <div className='p-4' >


                                    <ReactToPrint

                                        trigger={() => <LoonsButton>Print <PrintIcon /></LoonsButton>}
                                        content={() => this.componentRef}


                                    />
                                </div>

                                {this.state.loaded ?
                                    <>

                                        <div style={{ display: 'none' }}>
                                            <div className='p-5' ref={(el) => (this.componentRef = el)} >

                                                <Grid container className='mt-5'>
                                                    <Grid item sm={12}>

                                                        <div className='p-5' style={{ border: '3px solid #2C7EF2', background: '#CFD5FF', borderRadius: '5px' }} >
                                                            <table className='w-full'>
                                                                <tr>
                                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Warehouse </td>
                                                                    <td style={{ width: '80%' }}>: {this.state.warehouseName}</td>
                                                                </tr>
                                                            </table>
                                                            <br />
                                                            <table className='w-full'>
                                                                <tr>
                                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Item Code </td>
                                                                    <td style={{ width: '80%' }}>: {this.state.item_des}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Description </td>
                                                                    <td style={{ width: '80%' }}>: {this.state.item_code}</td>
                                                                </tr>
                                                                {/* <tr>
                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>UOM </td>
                                                    <td style={{ width: '80%' }}>: {}</td>
                                                </tr> */}
                                                            </table>
                                                            <br></br>
                                                            <table className='w-full'>
                                                                <tr>
                                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Serviceable Qty </td>
                                                                    <td style={{ width: '80%' }}>: {convertTocommaSeparated(this.state.servisableQty?.[0]?.quantity || 0, 2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>Unserviceable Qty </td>
                                                                    <td style={{ width: '80%' }}>: {convertTocommaSeparated(this.state.unServisableQty?.[0]?.quantity || 0, 2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>On Hand </td>
                                                                    <td style={{ width: '80%' }}>: {convertTocommaSeparated(Number(this.state.servisableQty?.[0]?.quantity || 0) + Number(this.state.unServisableQty?.[0]?.quantity || 0), 2)}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ width: '20%', fontWeight: 'bold' }}>National Monthly Requirement</td>
                                                                    <td style={{ width: '80%' }}>: {convertTocommaSeparated(Number((this.state.estimationData?.[0]?.estimation) / 12 || 0), 2)}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </Grid>
                                                </Grid>

                                                <Grid container spacing={2} className='mt-5 mb-5  w-full'>
                                                    {/*Table*/}


                                                    <Grid lg={12} sm={12} className="w-full" item style={{ borderLeft: '1px solid black', }}>

                                                        {
                                                            this.state.loaded ?
                                                                <div className="pt-0" >

                                                                    {this.renderTable(this.state.mergedData)}
                                                                </div>
                                                                :
                                                                <Grid className="justify-center text-center w-full pt-12">
                                                                    <CircularProgress size={30} />
                                                                </Grid>
                                                        }
                                                    </Grid>

                                                </Grid>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    this.state.prograssBarLoad ?

                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>

                                        :
                                        null
                                }

                                <Grid container spacing={2} className='mt-5 mb-5  w-full'>
                                    {/*Table*/}
                                    <Grid item lg={6} sm={12} className="w-full" style={{ borderRight: '1px solid black', }}>

                                        {
                                            this.state.loaded ?
                                                <div className="pt-0">
                                                    {/* <h4><spam className='mr-10'>+ Receipt</spam>${this.state.dataplussum?.[0] ? convertTocommaSeparated(this.state.dataplussum?.[0]?.quantity, 2) : 0}</h4> */}
                                                    <LoonsTable

                                                        title={`+ Receipt\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ${this.state.dataplussum?.[0] ? convertTocommaSeparated(this.state.dataplussum?.[0]?.quantity, 2) : 0}`}

                                                        id={'patientsAdmission'}
                                                        // title={'Active Prescription'}
                                                        data={this.state.data}
                                                        columns={this.state.columns}
                                                        options={{
                                                            pagination: true,
                                                            serverSide: true,
                                                            count: this.state.totalItemsPlus,
                                                            // count: 10,
                                                            // rowsPerPage: 5,
                                                            rowsPerPage: 20,
                                                            page: this.state.selectiveDataPlus.page,
                                                            print: false,
                                                            viewColumns: true,
                                                            download: false,
                                                            onRowClick: this.onRowClick,
                                                            onTableChange: (action, tableState) => {
                                                                console.log(action, tableState)
                                                                switch (action) {
                                                                    case 'changePage':
                                                                        this.setPage(tableState.page)
                                                                        break
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
                                                </div>
                                                :
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>
                                        }
                                    </Grid>



                                    <Grid lg={6} sm={12} className="w-full" item style={{ borderLeft: '1px solid black', }}>

                                        {
                                            this.state.loaded ?
                                                <div className="pt-0">
                                                    <LoonsTable
                                                        title={`- Issues \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0  ${this.state.dataminsum?.[0] ? convertTocommaSeparated(Math.abs(this.state.dataminsum?.[0]?.quantity), 2) : 0}`}

                                                        id={'patientsAdmission'}
                                                        // title={'Active Prescription'}
                                                        data={this.state.datamin}
                                                        columns={this.state.columnsminus}
                                                        options={{
                                                            pagination: true,
                                                            serverSide: true,
                                                            count: this.state.totalItemsMinus,
                                                            // count: 10,
                                                            // rowsPerPage: 5,
                                                            rowsPerPage: 20,
                                                            page: this.state.selectiveDataMinus.page,
                                                            print: false,
                                                            viewColumns: true,
                                                            download: false,
                                                            onRowClick: this.onRowClick,
                                                            onTableChange: (action, tableState) => {
                                                                console.log(action, tableState)
                                                                switch (action) {
                                                                    case 'changePage':
                                                                        this.setPagemin(tableState.page)
                                                                        break
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
                                                </div>
                                                :
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress size={30} />
                                                </Grid>
                                        }
                                    </Grid>

                                </Grid>
                            </>
                            :
                            this.state.prograssBarLoad ?

                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>

                                :
                                null
                        }
                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }

}

export default withStyles(styles)(Legder)
