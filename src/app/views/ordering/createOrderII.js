import {
    Grid,
    InputAdornment,
    Dialog,
    Button,
    CircularProgress,
    Tooltip,
    Divider,
    Badge,
    TextField,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import ViewListIcon from '@material-ui/icons/ViewList'
import ListIcon from '@material-ui/icons/List'
import { green, yellow, orange } from '@material-ui/core/colors'
import VisibilityIcon from '@material-ui/icons/Visibility'
import CancelIcon from '@material-ui/icons/Cancel'
import { Alert, Autocomplete } from '@material-ui/lab'
import {
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    MainContainer,
    SubTitle,
    CardTitle,
    CheckBox,
} from '../../../app/components/LoonsLabComponents'
import PatientServices from 'app/services/PatientServices'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import LowStockWarning from '../../../app/views/orders/LowStockWarning'
import DivisionsServices from '../../services/DivisionsServices'
import Row from '../../../app/views/orders/Components/Row'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import GroupSetupService from '../../services//datasetupServices/GroupSetupService'
import CategoryService from '../../services/datasetupServices/CategoryService'
import ClassDataSetupService from '../../services/datasetupServices/ClassDataSetupService'
import WarehouseServices from '../../services/WarehouseServices'
import MSDService from '../../services/MSDService'
import ReactEcharts from 'echarts-for-react'
import localStorageService from '../../services/localStorageService'
import CloseIcon from '@material-ui/icons/Close'
import DistributionCenterServices from '../../services/DistributionCenterServices'
import { dateParse, dateTimeParse, roundDecimal } from 'utils'
import ItemsBatchView from '../../../app/views/orders/ItemsBatchView'
import moment from 'moment'

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
})

class OrderTab1 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Allversions: [],
            prescriptionDrugAssign: [],
            loadingSuggestedWarehoues: false,
            showItemBatch: false,
            item_warehouse_id: null,
            batchTotal: [],
            updateQty: true,
            itemTotalQty: 0,
            selected_warehouse: '0',
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id: null,
            addtocart: null,
            cartStatus: [],
            selectedItem: 0,
            ids: [],
            loaded: false,
            lowStockWarning: false,
            suggestedWareHous: false,
            expiredStockWarning: false,
            orderExistWarning: false,
            individualView: false,
            orderDeleteWarning: false,
            orderID: null,
            medDetails: {
                itemName: 'Panadol',
                drugStore: 'Tangalle',
            },
            consumpEstimate: null,
            orderQty: null,
            activeStep: 1,
            data: [],
            myStockData: [],

            selectedID: null,
            orderItemData: [],
            orderItemDataTot: [],
            selected_type: 'all',
            selected_agent_id: null,
            selected_category_id: null,
            selected_order_type: null,

            myStockCols: [
                // {     name: 'invoice',     label: 'Invoice No',     options: {} },
                {
                    name: 'batch',
                    label: 'Batch No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.myStockData[tableMeta.rowIndex]) {
                                // return "N/A"
                                return this.state.myStockData[
                                    tableMeta.rowIndex
                                ].ItemSnapBatch.batch_no
                            }
                        },
                    },
                },
                {
                    name: 'exp',
                    label: 'Exp Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.myStockData[dataIndex]) {
                                let data =
                                    this.state.myStockData[dataIndex]
                                        .ItemSnapBatch.exd
                                if (data) {
                                    return <p>{dateTimeParse(data)}</p>
                                } else {
                                    return 'N/A'
                                }
                            }
                        },
                    },
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: 'minPack',
                    label: 'Min Pack Size',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (
                                this.state.batchTotal[tableMeta.rowIndex] ==
                                undefined
                            ) {
                                this.state.batchTotal.push(
                                    parseInt(
                                        this.state.myStockData[
                                            tableMeta.rowIndex
                                        ].quantity
                                    )
                                )
                            }

                            if (this.state.myStockData[tableMeta.rowIndex]) {
                                // return "N/A"
                                return this.state.myStockData[
                                    tableMeta.rowIndex
                                ].ItemSnapBatch.pack_size
                            }
                        },
                    },
                },
                {
                    name: 'quantity',
                    label: 'Stock Qty',
                    options: {},
                },
                {
                    name: 'quantity2',
                    label: 'Available Qty',
                    options: {},
                },
            ],
            consumption: [
                {
                    name: 'exp',
                    label: 'Order From',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.orderItemData[dataIndex]) {
                                let data =
                                    this.state.orderItemData[dataIndex]
                                        .OrderExchange?.fromStore.name
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: 'request_quantity',
                    label: 'Stock Qty',
                    options: {},
                },
            ],

            columns: [{
                name: 'id', // field name in the row object
                label: '', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    width: 10,
                    customBodyRender: (value, tableMeta, updateValue) =>
                        <CheckBox
                            disabled={this.state.selected_type == 'all' ? false :
                                ((this.state.selected_type == this.state.data[tableMeta?.rowIndex]?.item_type_id &&
                                    this.state.selected_agent_id == this.state.data[tableMeta?.rowIndex]?.agent_id &&
                                    this.state.selected_category_id == this.state.data[tableMeta?.rowIndex]?.category_id &&
                                    this.state.selected_order_type == this.state.data[tableMeta?.rowIndex]?.order_type

                                )
                                    ? false : true)}
                            checked={this.state.ids.includes(value)}
                            onChange={(e, value) => {

                                console.log(tableMeta, "NNNN")

                                if (!this.state.ids.includes(this.state.data[tableMeta?.rowIndex]?.id)) {


                                    let val = this.state.ids;
                                    val.push(this.state.data[tableMeta?.rowIndex]?.id);
                                    this.setState({
                                        ids: val,
                                        selected_type: this.state.data[tableMeta?.rowIndex]?.item_type_id,
                                        selected_agent_id: this.state.data[tableMeta?.rowIndex]?.agent_id,
                                        selected_category_id: this.state.data[tableMeta?.rowIndex]?.category_id,
                                        selected_order_type: this.state.data[tableMeta?.rowIndex]?.order_type
                                    })



                                } else {
                                    let val = this.state.ids.filter((data) => data !== this.state.data[tableMeta?.rowIndex]?.id);
                                    console.log("filtered data", val)

                                    if (val.length == 0) {
                                        this.setState({
                                            selected_type: 'all',
                                            ids: val,
                                            selected_agent: null,
                                            selected_agent_id: null,
                                            selected_category_id: null,
                                            selected_order_type: null
                                        })
                                    } else {
                                        this.setState({
                                            ids: val,
                                        })
                                    }
                                }
                            }}></CheckBox> 

                },
            },

            {
                name: 'version', // field name in the row object
                label: 'Version Number', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    width: 10,
                    customBodyRenderLite: (dataIndex) => {
                        let data = this.state.data[dataIndex].MSDRequirement?.version_no
                        return data
                    }
                }
            },
            {
                name: 'version', // field name in the row object
                label: 'Version Created Date', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    width: 10,
                    customBodyRenderLite: (dataIndex) => {
                        let data = dateParse(this.state.data[dataIndex].MSDRequirement?.createdAt)
                        return data
                    }
                }
            },

            {
                name: 'sr_no', // field name in the row object
                label: 'SR Number', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    width: 10,
                    customBodyRenderLite: (dataIndex) => {
                        let data = this.state.data[dataIndex]?.sr_no
                        return data
                    }
                },
            },
            {
                name: 'item_name',
                label: 'Item Name',
                options: {
                    customBodyRenderLite: (dataIndex) => {
                        let data = this.state.data[dataIndex]?.item_name
                        return data
                    }
                    // filter: true,
                },
                width: 20,
            },
            {
                name: 'agent', // field name in the row object
                label: 'Agent', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    width: 10,
                    customBodyRenderLite: (dataIndex) => {
                        let data = this.state.data[dataIndex]?.agent
                        return data
                    }

                }
            },
            {
                name: 'category', // field name in the row object
                label: 'Category Code', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    width: 10,
                    customBodyRenderLite: (dataIndex) => {
                        let data = this.state.data[dataIndex]?.category
                        return data
                    }

                }
            },
            {
                name: 'order_type', // field name in the row object
                label: 'Order Type', // column title that will be shown in table
                options: {
                    filter: true,
                    display: true,
                    width: 10,
                    customBodyRenderLite: (dataIndex) => {
                        let data = this.state.data[dataIndex]?.order_type
                        return data
                    }

                }
            },
            {
                name: 'ven',
                label: 'Ven',
                options: {
                    customBodyRenderLite: (dataIndex) => {
                        let data = this.state.data[dataIndex]?.ven
                        return data
                    }
                    // filter: true,
                },
            },
            {
                name: 'item_type',
                label: 'Item Type',
                options: {
                    // filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value) {
                            return value
                        } else {
                            return 'N/A'
                        }
                    },
                },
            },
            {
                name: 'standard_unit_cost',
                label: 'Standard unit cost',
                options: {
                    // filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value) {
                            return value
                        } else {
                            return 'N/A'
                        }
                    },
                },
            },
            {
                name: 'annual_estimation',
                label: `annual estimation for ${new Date().getFullYear()}`,
                options: {
                    // filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value) {
                            return value
                        } else {
                            return 'N/A'
                        }
                    },
                },
            },
            {
                name: 'msd_quantity',
                label: 'MSD stock',
                options: {
                    // filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value) {
                            return value
                        } else {
                            return 'N/A'
                        }
                    },
                },
            },
            {
                name: 'institutional_quantity',
                label: 'Insitutional Stock',
                options: {
                    // filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (value) {
                            return value
                        } else {
                            return 'N/A'
                        }
                    },
                },
            },

            {
                name: 'due_order_quantity',
                label: 'Due on order stock',
                options: {
                    // filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (!value) {
                            return 'N/A'
                        } else {
                            return value
                        }
                    },
                },
            },
            ],

            suggestedWareHouseColumn: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <IconButton
                                    onClick={() => {
                                        this.setState({
                                            item_warehouse_id:
                                                this.state.rows2[dataIndex]
                                                    .warehouse_id,
                                            showItemBatch: true,
                                        })
                                    }}
                                >
                                    <ListIcon />
                                </IconButton>
                            )
                        },
                    },
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: '	Drug Store',
                    label: 'Drug Store',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.rows2[dataIndex].warehouse_name
                            return data
                        },
                    },
                },
                {
                    name: 'Type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.rows2[dataIndex]
                                    .warehouse_main_or_personal
                            return data
                        },
                    },
                },
                {
                    name: 'Stock Qty',
                    label: 'Stock Qty',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.rows2[dataIndex].total_quantity
                            return data
                        },
                    },
                },

                {
                    name: 'Order',
                    label: 'Order Qty',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <div className="row">
                                    <TextField
                                        variant="outlined"
                                        size="small"
                                        className=" w-100"
                                        placeholder="Order Qty"
                                        onChange={(e) => {
                                            if (
                                                parseInt(e.target.value) <=
                                                parseInt(
                                                    this.state.rows2[
                                                        dataIndex
                                                    ].total_quantity
                                                ) ||
                                                e.target.value == null ||
                                                e.target.value == ''
                                            ) {
                                                this.addSuggestedWareHouseCart(
                                                    this.state.rows2[dataIndex]
                                                        .warehouse_id,
                                                    e.target.value,
                                                    this.state.rows2[dataIndex]
                                                        .warehouse_name,
                                                    this.state.rows2[dataIndex]
                                                        .total_quantity,
                                                    10
                                                )
                                            } else {
                                                this.addSuggestedWareHouseCart(
                                                    this.state.rows2[dataIndex]
                                                        .warehouse_id,
                                                    this.state.rows2[dataIndex]
                                                        .total_quantity,
                                                    this.state.rows2[dataIndex]
                                                        .warehouse_name,
                                                    this.state.rows2[dataIndex]
                                                        .row.total_quantity,
                                                    10
                                                )
                                                this.setState({
                                                    alert: true,
                                                    message:
                                                        'Store Quantity Exceeded. Please enter a lower value. Maxumim stock of ' +
                                                        this.state.rows2[
                                                            dataIndex
                                                        ].total_quantity +
                                                        ' will be added.',
                                                    severity: 'Error',
                                                })
                                            }
                                        }}
                                        type="number"
                                    ></TextField>
                                </div>
                            )
                        },
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',
            patient_pic: null,
            selectedType: null,
            selectedDays: null,
            all_ven: [],
            all_item_class: [],
            all_item_type: [],
            all_item_category: [],
            all_item_group: [],
            all_days: [],
            day_month: [
                {
                    id: 1,
                    name: 'Days',
                },
                {
                    id: 2,
                    name: 'Months',
                },
            ],

            loading: false,
            formData: {
                ven_id: null,
                class_id: null,
                category_id: null,
                group_id: null,
                item_id: null,
                item_type_id: null,
                version_no: null,
                created_by: localStorage.getItem('userInfo').id,
                page: 0,
                limit: 20,
                search: null,
                'order[0]': ['updatedAt', 'DESC'],
            },
            rows: [
                {
                    storeName: 'Distribution Center',
                    dStoreID: 1,
                    batch: '',
                    reason: 'New',
                    stockQty: 4000,
                    price: 3.99,
                    batchDetails: [
                        {
                            no: '1',
                            invoiceNo: 'TESTINVO1',
                            batchNo: 'TESTBatch1',
                            expDate: '2020-01-01',
                            stockQty: '2000',
                        },
                        {
                            no: '2',
                            invoiceNo: 'TESTINVO2',
                            batchNo: 'TESTBatch2',
                            expDate: '2020-01-01',
                            stockQty: '2000',
                        },
                    ],
                },
                {
                    storeName: 'Drug Store 1',
                    dStoreID: 2,
                    batch: '',
                    reason: 'New',
                    stockQty: 4500,
                    price: 3.99,
                    batchDetails: [
                        {
                            no: '23',
                            invoiceNo: 'TESTINVO3',
                            batchNo: 'TESTBatch3',
                            expDate: '2020-01-01',
                            stockQty: '2000',
                        },
                        {
                            no: '4',
                            invoiceNo: 'TESTINVO4',
                            batchNo: 'TESTBatch4',
                            expDate: '2020-01-01',
                            stockQty: '2500',
                        },
                    ],
                },
                {
                    storeName: 'Drug Store 2',
                    dStoreID: 3,
                    batch: '',
                    reason: 'New',
                    stockQty: 6500,
                    price: 3.99,
                    batchDetails: [
                        {
                            no: '5',
                            invoiceNo: 'TESTINVO5',
                            batchNo: 'TESTBatch5',
                            expDate: '2020-01-01',
                            stockQty: '2000',
                        },
                        {
                            no: '6',
                            invoiceNo: 'TESTINVO6',
                            batchNo: 'TESTBatch6',
                            expDate: '2020-01-01',
                            stockQty: '1500',
                        },
                        {
                            no: '7',
                            invoiceNo: 'TESTINVO5',
                            batchNo: 'TESTBatch5',
                            expDate: '2020-01-01',
                            stockQty: '1000',
                        },
                        {
                            no: '8',
                            invoiceNo: 'TESTINVO6',
                            batchNo: 'TESTBatch6',
                            expDate: '2020-01-01',
                            stockQty: '2000',
                        },
                    ],
                },
                {
                    storeName: 'Drug Store 3',
                    dStoreID: 4,
                    batch: '',
                    reason: 'New',
                    stockQty: 5500,
                    price: 3.99,
                    batchDetails: [
                        {
                            no: '9',
                            invoiceNo: 'TESTINVO7',
                            batchNo: 'TESTBatch7',
                            expDate: '2020-01-01',
                            stockQty: '2000',
                        },
                        {
                            no: '10',
                            invoiceNo: 'TESTINVO8',
                            batchNo: 'TESTBatch8',
                            expDate: '2020-01-01',
                            stockQty: '3500',
                        },
                    ],
                },
            ],
            rows2: [],
            genOrder: {
                warehouse_id: null,
                created_by: null,
                order_for: 0,
                type: 'Pharmacy',
            },
            getCartItems: {
                //pharmacy_order_id: null,
                status: 'Cart',
                limit: 20,
                page: 0,
                warehouse_id: null,
            },
            suggestedWareHouses: {
                item_id: 0,
                warehouse_id: null,
                limit: 20,
                page: 0,
            },
            addSuggestedWareHouseCart: {
                order_item_id: 0,
                order_item_details: [],
            },
            cartItems: [],
            msg: null,
            options: {
                legend: {
                    data: ['Actual Consumption', 'Suggested Consumption'],
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: 'Actual Consumption',
                        type: 'bar',
                        data: [320, 302, 301, 334, 390, 330, 320],
                    },
                    {
                        name: 'Suggested Consumption',
                        type: 'bar',
                        data: [150, 212, 201, 154, 190, 330, 410],
                    },
                ],
                tooltip: {
                    trigger: 'axis',
                },
                color: ['#3483eb', '#34bdeb'],
            },
            totalItems: 0,
            warehouseSelectDone: false,
        }
    }
    async getOrderItems() {
        this.setState({ updateQty: false })

        let params = {
            to: this.state.genOrder.warehouse_id,
            item_id: this.state.data[this.state.selectedID]?.item_id,
            status: ['Pending', 'ORDERED', 'APPROVED', 'Active'],
            from_date: null,
            to_date: null,
            // 'order[0]': [
            //     'createdAt', 'DESC'
            // ],
        }
        let batch_res = await DistributionCenterServices.getSingleOrderItems(
            params
        )
        if (batch_res.status == 200) {
            this.setState({ orderItemData: batch_res.data.view.data })
            console.log('Batchs', this.state.orderItemData)
            this.setState({ updateQty: true })
        }
    }

    async getOrderItemsTotal() {
        this.setState({ updateQty: false })

        let params = {
            to: this.state.genOrder.warehouse_id,
            item_id: this.state.data[this.state.selectedID]?.item_id,
            status: ['Pending', 'ORDERED', 'APPROVED', 'Active'],
            sum_needed: true,
            from_date: null,
            to_date: null,
            // 'order[0]': [
            //     'createdAt', 'DESC'
            // ],
        }
        let batch_res = await DistributionCenterServices.getSingleOrderItems(
            params
        )
        if (batch_res.status == 200) {
            this.setState({ orderItemDataTot: batch_res.data.view.data })
            console.log('total', this.state.orderItemDataTot)
            this.setState({ updateQty: true })
        }
    }

    genOrderDays(day, type) {
        return day * type
    }

    load_days(max) {
        for (let index = 1; index < max; index++) {
            this.state.all_days.push({ id: index, date: index.toString() })
        }
        this.render()
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState(
            {
                formData,
            },
            () => {
                console.log('New formdata', this.state.formData)
                this.loadOrderList()
            }
        )
    }

    async loadVertionNumbers() {
        let formData = {
            created_by: localStorageService.getItem("userInfo").id,
            type: this.state.activeType,
            search_type: "REQUIREMENT",
            from: dateParse(moment().add(-30, 'days')),
            to: dateParse(moment().add(1, 'days')),
            'order[0]': [
                'createdAt', 'DESC'
            ],
        }
        let res = await MSDService.getAllOrders(formData)
        //let order_id = 0
        if (res.status) {

            this.setState({
                Allversions: res.data.view.data,
            }, () => {
            })
        }
    }

    componentDidMount() {
        this.loadWarehouses()
        this.loadVertionNumbers()
        this.load_days(31)
        this.loadData()
        this.loadOrderList()
    }

    async getBatchData() {
        this.setState({ updateQty: false })
        let params = {
            warehouse_id: this.state.genOrder.warehouse_id,
            item_id: this.state.data[this.state.selectedItem].item_id,
            exp_date_grater_than_zero: true,
            quantity_grater_than_zero: true,
            'order[0]': ['createdAt', 'DESC'],
        }
        let batch_res = await DistributionCenterServices.getBatchData(params)
        if (batch_res.status == 200) {
            this.setState({ myStockData: batch_res.data.view.data })
            console.log('Batch Data', this.state.myStockData)
            this.setState({ updateQty: true })
        }
    }

    placeOrders = async () => {
        this.setState({
            loaded: false,
        })
        let res = await MSDService.createOrder({
            created_by: localStorageService.getItem('userInfo').id,
            type: 'MSD Order',
            ids: this.state.ids,
            msd_requirement_id: this.state.data[0].msd_requirement_id,
        })
        if (res.status) {
            this.setState({
                alert: true,
                message: 'Successfully placed an order',
                severity: 'success',
                loaded: true,
            })
            //this.props.history.push("/ordering/upcoming") //commented By Roshan
            this.props.history.push("/sco/oder-list")

        } else {
            this.setState({
                alert: true,
                message: 'error when  placing an order',
                severity: 'error',
                loaded: true,
            })
        }
    }

    async loadData() {
        //function for load initial data from backend or other resources
        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {
            console.log('Ven', ven_res.data.view.data)
            this.setState({ all_ven: ven_res.data.view.data })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await ClassDataSetupService.fetchAllClass({
            limit: 99999,
        })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }

        let item_type_res = await WarehouseServices.getItemTypes({})

        if (item_type_res.status == 200) {
            this.setState({ all_item_type: item_type_res.data.view.data })
        }

    }

    async loadOrderList() {
        this.setState({ loaded: false, cartStatus: [] })
        this.state.formData = {
            ...this.state.formData,
            created_by: localStorageService.getItem('userInfo').id,
            status: 'Order',
        }

        let res = await MSDService.getAllOrders(this.state.formData)
        //let order_id = 0
        if (res.status) {
            // if (res.data.view.data.length != 0) {
            //     order_id = res
            //         .data
            //         .view
            //         .data[0]
            //         .pharmacy_order_id
            // }
            //this.state.getCartItems.pharmacy_order_id = order_id
            // let item_ids = res.data.view.data.map(x => x.item_id)
            //console.log("loadPrescriptionDrugAssign", item_ids)
            // this.loadPrescriptionDrugAssign(item_ids)
            console.log("order list data loaded", res.data.view.data)
            this.setState(
                {
                    data: res.data.view.data,
                    loaded: true,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                    // this.getCartItems()
                }
            )
        }
    }

    createOrderS = async () => {
        this.setState({ loaded: false })
        this.state.formData = {
            created_by: localStorageService.getItem('userInfo').id,
            type: 'MSD Order',
            msd_requirement_id: this.state.data[0]?.MSDRequirement?.id,
        }

        let res = await MSDService.createOrdder(this.state.formData)
        //let order_id = 0
        if (res.status) {
            // if (res.data.view.data.length != 0) {
            //     order_id = res
            //         .data
            //         .view
            //         .data[0]
            //         .pharmacy_order_id
            // }
            //this.state.getCartItems.pharmacy_order_id = order_id
            // let item_ids = res.data.view.data.map(x => x.item_id)
            //console.log("loadPrescriptionDrugAssign", item_ids)
            // this.loadPrescriptionDrugAssign(item_ids)

            this.setState({
                message: 'order has ben created successfully',
                severity: 'success',
                alert: true,
            })

            this.loadOrderList()
        }
    }

    // async loadPrescriptionDrugAssign(itemIds) {
    //     let params = {
    //         owner_id: this.state.owner_id,
    //         from: moment().subtract(180, 'days').format('YYYY-MM-DD'),
    //         to: moment().format('YYYY-MM-DD'),
    //         drug_id: itemIds,
    //search_type:'Sum'
    //     }
    //     let res = await PharmacyOrderService.prescriptionDrugAssign(params)
    //     //let order_id = 0
    //     console.log("loadPrescriptionDrugAssign", res.data.view)
    //     if (res.status) {

    //         this.setState({
    //             prescriptionDrugAssign: res.data.view,
    //             loaded: true,
    //         }, () => {

    //         })
    //     }
    // }

    // async getCartItems() {
    //     let res2 = await PharmacyOrderService.getOrderList(this.state.getCartItems)
    //     if (res2.status) {
    //         this.setState({
    //             cartItems: res2.data.view.data
    //         }, () => {
    //             console.log("cart", res2.data.view.data)
    //             this.render()
    //         })
    //     }
    // }

    async generateOrder() {
        this.setState({ loaded: false })
        let payload = {
            created_by: localStorageService.getItem('userInfo').id,
            type: 'Msd Order',
        }
        let res = await MSDService.genOrder(payload)
        if (res.status) {
            this.setState({ msg: res.data.posted.msg })
            this.state.msg == 'data has been added successfully.'
                ? this.setState({
                    alert: true,
                    message: this.state.msg,
                    severity: 'success',
                })
                : this.setState({
                    alert: true,
                    message: this.state.msg,
                    severity: 'error',
                    orderID: res.data.posted.data.data[0].MSDRequirement.id,
                    orderExistWarning: true,
                })

            setTimeout(() => {
                this.loadOrderList()
            }, 2000);
        }
    }

    async removeOrder() {
        this.setState({ loaded: false })
        let res = await MSDService.deleteOrderRequement(this.state.orderID)
        if (res.status) {
            if (res.data.view == 'data deleted successfully.') {
                this.setState(
                    {
                        loaded: true,
                        alert: true,
                        message: res.data.view,
                        severity: 'success',
                        cartItems: [],
                    },
                    () => {
                        this.render()
                        // this.getCartItems()
                    }
                )
            }
            this.generateOrder()
        } else {
            this.setState({
                alert: true,
                message: 'Order Could Not be Deleted. Please Try Again',
                severity: 'error',
            })
        }
    }

    addSuggestedWareHouseCart(
        warehouseid,
        orderqty,
        drugstore,
        storeqty,
        storerecieveqty
    ) {
        this.setState({ updateQty: false })
        if (
            this.state.addSuggestedWareHouseCart.order_item_details.length == 0
        ) {
            this.state.addSuggestedWareHouseCart.order_item_details.push({
                warehouse_id: warehouseid,
                order_quantity: orderqty,
                drug_store_name: drugstore,
                store_quantity: storeqty,
                store_recervable_quantity: storerecieveqty,
            })
        } else {
            let found = false
            let pos = 0
            this.state.addSuggestedWareHouseCart.order_item_details.find(
                (warehouse, index) => {
                    if (warehouse != null) {
                        if (warehouse.warehouse_id == warehouseid) {
                            console.log('orderItem warehouse equal', index)
                            found = true
                            pos = index
                        }
                    }
                }
            )

            if (found) {
                if ((orderqty == '0') | (orderqty == null) | (orderqty == '')) {
                    console.log('removed', pos)
                    this.state.addSuggestedWareHouseCart.order_item_details.splice(
                        pos,
                        1
                    )
                } else {
                    console.log('orderItem Index', pos)
                    this.state.addSuggestedWareHouseCart.order_item_details[
                        pos
                    ].order_quantity = orderqty
                }
            } else {
                this.state.addSuggestedWareHouseCart.order_item_details.push({
                    warehouse_id: warehouseid,
                    order_quantity: orderqty,
                    drug_store_name: drugstore,
                    store_quantity: storeqty,
                    store_recervable_quantity: storerecieveqty,
                })
            }
        }

        this.state.itemTotalQty = 0
        for (
            let index = 0;
            index <
            this.state.addSuggestedWareHouseCart.order_item_details.length;
            index++
        ) {
            this.state.itemTotalQty += parseInt(
                this.state.addSuggestedWareHouseCart.order_item_details[index]
                    .order_quantity
            )
        }
        console.log('OrderItems total', this.state.itemTotalQty)
        this.setState({ updateQty: true })
        console.log('OrderItems', this.state.addSuggestedWareHouseCart)
    }

    async saveStepOneSubmit() { }

    async SubmitAll() { }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState(
            {
                files: files,
            },
            () => { }
        )
    }

    async loadWarehouses() {
        this.setState({ loaded: true })
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        var id = user.id
        var all_pharmacy_dummy = []
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        } else {
            this.state.genOrder.created_by = id
            this.state.genOrder.warehouse_id = selected_warehouse_cache.id
            this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            this.state.suggestedWareHouses.warehouse_id =
                selected_warehouse_cache.id
            this.state.formData.warehouse_id = selected_warehouse_cache.id
            this.state.formData.owner_id = selected_warehouse_cache.owner_id
            this.setState({
                owner_id: selected_warehouse_cache.owner_id,
                selected_warehouse: selected_warehouse_cache.id,
                dialog_for_select_warehouse: false,
                warehouseSelectDone: true,
            })
            console.log(this.state.selected_warehouse)
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params)
        if (res.status == 200) {
            console.log('warehouseUsers', res.data.view.data)

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
            console.log('warehouse', all_pharmacy_dummy)
            this.setState({
                all_warehouse_loaded: all_pharmacy_dummy,
                loaded: true,
            })
        }
    }

    setSuggestedPage(page) {
        let suggestedWareHouses = this.state.suggestedWareHouses
        suggestedWareHouses.page = page
        this.setState(
            {
                suggestedWareHouses,
            },
            () => {
                this.suggestedWareHouse()
            }
        )
    }

    render() {
        const { classes } = this.props
        const SuggestedTable = (
            <TableContainer component={Paper}>
                {this.state.loadingSuggestedWarehoues ? (
                    <LoonsTable
                        //title={"All Aptitute Tests"}
                        id={'suggested'}
                        data={this.state.rows2}
                        columns={this.state.suggestedWareHouseColumn}
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: this.state.suggestedtotalItems,
                            rowsPerPage: 20,
                            page: this.state.suggestedWareHouses.page,
                            onTableChange: (action, tableState) => {
                                console.log(action, tableState)
                                switch (action) {
                                    case 'changePage':
                                        this.setSuggestedPage(tableState.page)
                                        break
                                    case 'sort':
                                        //this.sort(tableState.page, tableState.sortOrder);
                                        break
                                    default:
                                        console.log('action not handled.')
                                }
                            },
                        }}
                    ></LoonsTable>
                ) : null}
            </TableContainer>
        )

        const OrderQTY = (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '10px',
                }}
            >
                <div>Order Qty</div>
                <div className="pr-5 pl-5">
                    <input
                        value={
                            this.state.updateQty
                                ? parseInt(this.state.orderQty) +
                                parseInt(this.state.itemTotalQty)
                                : null
                        }
                    ></input>
                </div>
            </div>
        )
        const EstimateConsumption = (
            <div
                style={{
                    display: 'flex',
                }}
            >
                <div>System Estimated Consumption</div>
                <div className="pr-5 pl-5">
                    <input value={this.state.consumpEstimate}></input>
                </div>
            </div>
        )
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* Filtr Section */}

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'nowrap',
                                justifyContent: 'space-between',
                                aligroupItems: 'baseline',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    aligroupItems: 'baseline',
                                }}
                            >
                                <ValidatorForm
                                    onSubmit={() => null}
                                    onError={() => null}
                                >
                                    <Grid
                                        container="container"
                                        lg={12}
                                        md={12}
                                        xs={12}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                        }}
                                    >
                                        {/* <Grid
                                        item="item"
                                        lg={4}
                                        md={4}
                                        xs={12}
                                        className="mr-2"
                                    > */}

                                        {/* </Grid> */}
                                    </Grid>
                                </ValidatorForm>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    aligroupItems: 'baseline',
                                }}
                            >
                                <div className="mr-2">
                                    {/*   <h6>Order From: Counter Pharmacist</h6> */}
                                </div>
                            </div>
                        </div>

                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadOrderList()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container="container" spacing={2} direction="row">

                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    <Grid container="container" spacing={2}>

                                        <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                            <SubTitle title="Version" />
                                            <Autocomplete
                                                className="w-full"
                                                options={this.state.Allversions}
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData
                                                    if (value != null) {
                                                        formData.version_no = value
                                                    } else {
                                                        formData.version_no = null
                                                    }
                                                    console.log(this.state.formData);
                                                    this.setState({ formData })
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                getOptionLabel={(option) => option.version_no ? option.version_no : ''}
                                                value={this.state.formData.version_no}

                                                renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Version"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                                        </Grid>

                                        {/* Ven */}
                                        <Grid
                                            item="item"
                                            xs={12}
                                            sm={12}
                                            md={3}
                                            lg={3}
                                        >
                                            <SubTitle title="Ven" />
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_ven}
                                                onChange={(e, value) => {
                                                    let formData =
                                                        this.state.formData
                                                    if (value != null) {
                                                        formData.ven_id = value.id
                                                    } else {
                                                        formData.ven_id = null
                                                    }
                                                    console.log(this.state.formData)
                                                    this.setState({ formData })
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                          (v) => v.id == this.state.formData.district_id
                                          )} */
                                                value={this.state.all_ven.find(
                                                    (v) =>
                                                        v.id ==
                                                        this.state.formData.ven_id
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.name ? option.name : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Ven"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        {/* Serial/Family Number */}
                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Item Class" />
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_item_class}
                                                onChange={(e, value) => {
                                                    let formData =
                                                        this.state.formData
                                                    if (value != null) {
                                                        formData.class_id = value.id
                                                    } else {
                                                        formData.class_id = null
                                                    }
                                                    console.log(this.state.formData)
                                                    this.setState({ formData })
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                          (v) => v.id == this.state.formData.district_id
                                          )} */
                                                value={this.state.all_item_class.find(
                                                    (v) =>
                                                        v.id ==
                                                        this.state.formData.class_id
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.description
                                                        ? option.description
                                                        : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Class"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        {/* Serial Family Name*/}
                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Item Category" />

                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={
                                                    this.state.all_item_category
                                                }
                                                onChange={(e, value) => {
                                                    let formData =
                                                        this.state.formData
                                                    if (value != null) {
                                                        formData.item_category_id =
                                                            value.id
                                                    } else {
                                                        formData.item_category_id =
                                                            null
                                                    }
                                                    console.log(this.state.formData)
                                                    this.setState({ formData })
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                          (v) => v.id == this.state.formData.district_id
                                          )} */
                                                value={this.state.all_item_category.find(
                                                    (v) =>
                                                        v.id ==
                                                        this.state.formData
                                                            .category_id
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.description
                                                        ? option.description
                                                        : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Category"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        {/* Item Group*/}
                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Item Group" />

                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_item_group}
                                                onChange={(e, value) => {
                                                    let formData =
                                                        this.state.formData
                                                    if (value != null) {
                                                        formData.item_group_id =
                                                            value.id
                                                    } else {
                                                        formData.item_group_id =
                                                            null
                                                    }
                                                    console.log(this.state.formData)
                                                    this.setState({ formData })
                                                }}
                                                value={this.state.all_item_group.find(
                                                    (v) =>
                                                        v.id ==
                                                        this.state.formData.group_id
                                                )}
                                                getOptionLabel={(option) =>
                                                    option.description
                                                        ? option.description
                                                        : ''
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Group"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth"
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Item Type" />
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_item_type.filter((ele) => ele.status == "Active")}
                                                onChange={(e, value) => {
                                                    if (value != null) {
                                                        let formData = this.state.formData;
                                                        formData.item_type_id = value.id
                                                        this.setState({ formData })

                                                    }
                                                }}
                                                value={this.state.all_item_type.find((obj) => obj.id == this.state.formData.item_type_id
                                                )}

                                                getOptionLabel={(option) => option.name}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Type"
                                                        //variant="outlined"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />

                                        </Grid>

                                        <Grid
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}

                                        >
                                            {/* Submit Button */}
                                            <LoonsButton
                                                className=" mr-2"
                                                style={{ marginTop: 26 }}
                                                progress={false}
                                                type="submit"
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    {this.state.isUpdate
                                                        ? 'Update'
                                                        : 'Filter'}
                                                </span>
                                            </LoonsButton>
                                        </Grid>
                                        <Grid
                                            item="item"
                                            lg={12}
                                            md={12}
                                            xs={12}
                                        ></Grid>
                                        <Grid
                                            item="item"
                                            lg={3}
                                            md={3}
                                            xs={3}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                marginTop: '-20px',
                                            }}
                                        >
                                            <SubTitle title="Search" />

                                            <TextValidator
                                                className=""
                                                placeholder="Search"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                value={this.state.formData.search}
                                                onChange={(e, value) => {
                                                    let formData =
                                                        this.state.formData
                                                    if (e.target.value != '') {
                                                        formData.search =
                                                            e.target.value
                                                    } else {
                                                        formData.search = null
                                                    }
                                                    this.setState({ formData })
                                                    console.log(
                                                        'form dat',
                                                        this.state.formData
                                                    )
                                                }}
                                                onKeyPress={(e) => {
                                                    if (e.key == 'Enter') {
                                                        this.loadOrderList()
                                                    }
                                                }}
                                                /* validators={[
                                          'required',
                                          ]}
                                          errorMessages={[
                                          'this field is required',
                                          ]} */
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment
                                                            position="end"
                                                            onClick={() => {
                                                                this.loadOrderList()
                                                            }}
                                                        >
                                                            <SearchIcon></SearchIcon>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>

                                {/* Table Section */}
                                <Grid container="container" className="mt-3 pb-5">
                                    <Grid
                                        item="item"
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        {this.state.loaded ? (
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state.totalItems,
                                                    rowsPerPage:
                                                        this.state.formData.limit,
                                                    page: this.state.formData.page,
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
                                        ) : (
                                            //loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                {this.state.data.length > 0 ? (
                                    <LoonsButton
                                        disabled={this.state.ids.length === 0 ? true : false}
                                        color="primary"
                                        size="medium"
                                        type="submit"
                                        onClick={this.placeOrders}
                                        style={{ marginLeft: '90%' }}
                                    >
                                        Place Order
                                    </LoonsButton>
                                ) : <></>}
                            </Grid>
                        </ValidatorForm>

                    </LoonsCard>
                </MainContainer>

                <Dialog
                    maxWidth="lg "
                    open={this.state.lowStockWarning}
                    onClose={() => {
                        this.setState({ lowStockWarning: false })
                    }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <CardTitle title="Insufficient Stock Balance"></CardTitle>
                        <div>
                            <p>
                                {this.state.medDetails.itemName}
                                stock balance is insufficient in{' '}
                                {this.state.medDetails.drugStore}. Would you
                                like to place the order from suggested Drug
                                Store?
                            </p>
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Grid
                                    className="w-full flex justify-end"
                                    item="item"
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                >
                                    <LoonsButton
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="save"
                                        onClick={() => {
                                            this.setState({
                                                lowStockWarning: false,
                                                suggestedWareHous: true,
                                                itemTotalQty: 0,
                                                orderQty: 0,
                                            })
                                        }}
                                    >
                                        <span className="capitalize">Yes</span>
                                    </LoonsButton>

                                    <LoonsButton
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="close"
                                        onClick={() => {
                                            this.setState({
                                                lowStockWarning: false,
                                            })
                                        }}
                                    >
                                        <span className="capitalize">No</span>
                                    </LoonsButton>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>
                <Dialog
                    maxWidth="lg "
                    open={this.state.expiredStockWarning}
                    onClose={() => {
                        this.setState({ expiredStockWarning: false })
                    }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <CardTitle title="Expiring Stocks"></CardTitle>
                        <div>
                            <p>
                                {this.state.medDetails.itemName}
                                stock is expired in{' '}
                                {this.state.medDetails.drugStore}. Would you
                                like to place the order from suggested Drug
                                Store?
                            </p>
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Grid
                                    className="w-full flex justify-end"
                                    item="item"
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                >
                                    <LoonsButton
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        onClick={() => {
                                            this.setState({
                                                expiredStockWarning: false,
                                                suggestedWareHous: true,
                                            })
                                        }}
                                    >
                                        <span className="capitalize">Yes</span>
                                    </LoonsButton>

                                    <LoonsButton
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="close"
                                        onClick={() => {
                                            this.setState({
                                                expiredStockWarning: false,
                                            })
                                        }}
                                    >
                                        <span className="capitalize">No</span>
                                    </LoonsButton>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>
                <Dialog
                    maxWidth="lg "
                    open={this.state.orderExistWarning}
                    onClose={() => {
                        this.setState({ orderExistWarning: false })
                    }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <CardTitle title="Order Requirement already exist"></CardTitle>
                        <div>
                            <p>
                                Order Requirement already exist. Please delete
                                before regenerate.
                            </p>
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Grid
                                    className="w-full flex justify-end"
                                    item="item"
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                >
                                    <LoonsButton
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="delete"
                                        onClick={() => {
                                            this.setState({
                                                orderExistWarning: false,
                                                orderDeleteWarning: true,
                                            })
                                        }}
                                    >
                                        <span className="capitalize">
                                            Delete
                                        </span>
                                    </LoonsButton>

                                    <LoonsButton
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon={<ViewListIcon />}
                                        onClick={() => {
                                            this.setState({
                                                orderExistWarning: false,
                                            })
                                        }}
                                    >
                                        <span className="capitalize">View</span>
                                    </LoonsButton>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    maxWidth="lg "
                    open={this.state.orderDeleteWarning}
                    onClose={() => {
                        this.setState({ orderDeleteWarning: false })
                    }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <CardTitle title="Are you sure you want to delete?"></CardTitle>
                        <div>
                            <p>
                                This order will be deleted and you will have to
                                apply for a new order. This cannot be undone.
                            </p>
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Grid
                                    className="w-full flex justify-end"
                                    item="item"
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}
                                >
                                    <LoonsButton
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="delete"
                                        onClick={() => {
                                            this.setState({
                                                orderDeleteWarning: false,
                                            })
                                            this.removeOrder()
                                        }}
                                    >
                                        <span className="capitalize">
                                            Delete
                                        </span>
                                    </LoonsButton>

                                    <LoonsButton
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon={<CancelIcon />}
                                        onClick={() => {
                                            this.setState({
                                                orderDeleteWarning: false,
                                            })
                                        }}
                                    >
                                        <span className="capitalize">
                                            Cancel
                                        </span>
                                    </LoonsButton>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    style={{
                        padding: '10px',
                    }}
                    maxWidth="lg"
                    open={this.state.suggestedWareHous}
                    onClose={() => {
                        this.setState({ suggestedWareHous: false })
                    }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <Grid container="container">
                            <Grid item="item" lg={12} md={12}>
                                <CardTitle title="Suggeted Ware House"></CardTitle>
                            </Grid>
                            <Grid
                                item="item"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    marginTop: '10px',
                                }}
                                lg={6}
                                md={6}
                            >
                                {EstimateConsumption}
                            </Grid>
                            <Grid item="item" lg={6} md={6}>
                                {OrderQTY}
                            </Grid>
                            <Grid
                                item="item"
                                lg={12}
                                md={12}
                                xs={12}
                                className="mt-10"
                            >
                                {SuggestedTable}
                            </Grid>
                            <Grid
                                item="item"
                                lg={12}
                                md={12}
                                xs={12}
                                className="flex justify-end mt-6"
                            >
                                <Button
                                    startIcon={<CancelIcon />}
                                    onClick={() => {
                                        this.setState({
                                            suggestedWareHous: false,
                                        })
                                    }}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="ml-2"
                                    startIcon={
                                        <ShoppingCartIcon size="medium" />
                                    }
                                    color="warning"
                                    onClick={() => {
                                        if (
                                            this.state.addSuggestedWareHouseCart
                                                .order_item_details.length != 0
                                        ) {
                                            this.addSuggested()
                                        } else {
                                            this.addtocart()
                                        }

                                        this.setState({
                                            suggestedWareHous: false,
                                        })
                                    }}
                                    style={{
                                        backgroundColor: 'green',
                                        color: 'white',
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Dialog>

                <Dialog
                    style={{
                        padding: '10px',
                    }}
                    maxWidth="lg"
                    open={this.state.individualView}
                    onClose={() => {
                        // this.setState({individualView: false})
                    }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <Grid container="container">
                            <Grid
                                item="item"
                                lg={12}
                                md={12}
                                xs={12}
                                className="mb-4"
                            >
                                <LoonsCard>
                                    <Grid container="container">
                                        <Grid
                                            item="item"
                                            lg={12}
                                            md={12}
                                            xs={12}
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    justifyContent:
                                                        'space-between',
                                                }}
                                            >
                                                <CardTitle title="Suggeted Ware House"></CardTitle>
                                                <IconButton
                                                    aria-label="close"
                                                    onClick={() => {
                                                        this.setState({
                                                            individualView: false,
                                                        })
                                                    }}
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </div>
                                        </Grid>
                                        <Grid
                                            item="item"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                marginTop: '10px',
                                            }}
                                            lg={6}
                                            md={6}
                                        >
                                            {EstimateConsumption}
                                        </Grid>
                                        <Grid item="item" lg={6} md={6}>
                                            {OrderQTY}
                                        </Grid>
                                        <Grid
                                            item="item"
                                            lg={12}
                                            md={12}
                                            xs={12}
                                            className="mt-10"
                                        >
                                            {SuggestedTable}
                                        </Grid>
                                    </Grid>
                                </LoonsCard>
                            </Grid>

                            <Grid
                                item="item"
                                lg={6}
                                md={6}
                                xs={12}
                                className="pr-2"
                            >
                                <LoonsCard>
                                    <Grid
                                        container="container"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Grid item="item" lg={6} md={6} xs={4}>
                                            <Typography
                                                variant="h6"
                                                className="font-semibold"
                                            >
                                                Pending Orders
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item="item"
                                            lg={6}
                                            md={6}
                                            xs={4}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            Total Requested Quanituty :{' '}
                                            {parseFloat(
                                                this.state.orderItemDataTot
                                                    .length > 0
                                                    ? this.state
                                                        .orderItemDataTot[0]
                                                        .request_quantity
                                                    : 0
                                            )}
                                        </Grid>
                                    </Grid>
                                    <Divider className="mb-4" />
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.orderItemData}
                                        columns={this.state.consumption}
                                        options={{
                                            filterType: 'textField',
                                            pagination: true,
                                            size: 'medium',
                                            serverSide: true,
                                            print: false,
                                            viewColumns: false,
                                            download: false,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
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
                                </LoonsCard>
                            </Grid>

                            <Grid
                                item="item"
                                lg={6}
                                md={6}
                                xs={12}
                                className="pl-2"
                            >
                                <LoonsCard>
                                    <Grid container="container">
                                        <Grid item="item" lg={6} md={6} xs={4}>
                                            <Typography
                                                variant="h6"
                                                className="font-semibold"
                                            >
                                                My Stock
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item="item"
                                            lg={3}
                                            md={3}
                                            xs={4}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            Stock:{' '}
                                            {this.state.updateQty
                                                ? this.state.batchTotal.length
                                                : 'N/A'}
                                        </Grid>
                                        <Grid
                                            item="item"
                                            lg={3}
                                            md={3}
                                            xs={4}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            QTY:{' '}
                                            {this.state.updateQty
                                                ? this.state.batchTotal.reduce(
                                                    (partialSum, a) =>
                                                        partialSum + a,
                                                    0
                                                )
                                                : 'N/A'}
                                        </Grid>
                                    </Grid>
                                    <Divider className="mb-4" />

                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.myStockData}
                                        columns={this.state.myStockCols}
                                        options={{
                                            filterType: 'textField',
                                            pagination: true,
                                            size: 'medium',
                                            serverSide: true,
                                            print: false,
                                            viewColumns: false,
                                            download: false,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
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
                                </LoonsCard>
                            </Grid>

                            <Grid
                                item="item"
                                lg={12}
                                md={12}
                                xs={12}
                                className="flex justify-end mt-6"
                            >
                                <Button
                                    startIcon={<CancelIcon />}
                                    onClick={() => {
                                        this.setState({ individualView: false })
                                    }}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                    }}
                                >
                                    Cancel
                                </Button>

                                {
                                    this.state.cartStatus.length != 0 ? (
                                        <Button
                                            disabled={
                                                this.state.cartStatus[
                                                    this.state.selectedItem
                                                ].buttonState
                                            }
                                            className="ml-2"
                                            startIcon={
                                                <ShoppingCartIcon size="medium" />
                                            }
                                            color="warning"
                                            onClick={() => {
                                                if (
                                                    this.state.itemTotalQty ==
                                                    '' ||
                                                    this.state.itemTotalQty ==
                                                    0 ||
                                                    this.state.itemTotalQty ==
                                                    null
                                                ) {
                                                    this.setState({
                                                        message:
                                                            'Please Enter a value before adding to Cart',
                                                        alert: true,
                                                        severity: 'Error',
                                                    })
                                                } else {
                                                    let message =
                                                        this.state.message
                                                    if (
                                                        message ==
                                                        'Low stocks in the selected Warehouse'
                                                    ) {
                                                        this.setState({
                                                            lowStockWarning: true,
                                                            alert: true,
                                                        })
                                                    } else {
                                                        /*  else if (message == "Expiring stocks in the Selected Warehouse") {
                                                  this.setState({ expiredStockWarning: true, alert: true })
                                              } else if (message == "Some Values are not loaded to the database") {
                                                  this.setState({ alert: true })
                                              } */
                                                        if (
                                                            this.state
                                                                .addSuggestedWareHouseCart
                                                                .order_item_details
                                                                .length != 0
                                                        ) {
                                                            this.addSuggested()
                                                        } else {
                                                            this.addtocart()
                                                        }
                                                    }

                                                    this.setState({
                                                        individualView: false,
                                                    })
                                                }
                                            }}
                                            style={{
                                                backgroundColor:
                                                    this.state.cartStatus[
                                                        this.state.selectedItem
                                                    ].color,
                                                color: 'white',
                                            }}
                                        >
                                            {
                                                this.state.cartStatus[
                                                    this.state.selectedItem
                                                ].tooltip
                                            }
                                        </Button>
                                    ) : (
                                        <Button
                                            className="ml-2"
                                            startIcon={
                                                <ShoppingCartIcon size="medium" />
                                            }
                                            color="warning"
                                            onClick={() => {
                                                if (
                                                    this.state.itemTotalQty ==
                                                    '' ||
                                                    this.state.itemTotalQty ==
                                                    0 ||
                                                    this.state.itemTotalQty ==
                                                    null
                                                ) {
                                                    this.setState({
                                                        message:
                                                            'Please Enter a value before adding to Cart',
                                                        alert: true,
                                                        severity: 'Error',
                                                    })
                                                } else {
                                                    if (
                                                        this.state
                                                            .addSuggestedWareHouseCart
                                                            .order_item_details
                                                            .length != 0
                                                    ) {
                                                        this.addSuggested()
                                                    } else {
                                                        this.addtocart()
                                                    }
                                                    this.setState({
                                                        individualView: false,
                                                    })
                                                }
                                            }}
                                            style={{
                                                backgroundColor: 'green',
                                                color: 'white',
                                            }}
                                        >
                                            Add to Cart
                                        </Button>
                                    )
                                    // <Button         disabled="true"         className="ml-2"
                                    // startIcon={<ShoppingCartIcon size = "medium" />}         color="warning"
                                    // style={{             backgroundColor: 'grey',             color: 'white'
                                    // }}>Added to Cart</Button>
                                }
                            </Grid>
                        </Grid>
                    </div>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth="lg "
                    open={this.state.showItemBatch}
                    onClose={() => {
                        this.setState({ showItemBatch: false })
                    }}
                >
                    <MuiDialogTitle
                        disableTypography
                        className={classes.Dialogroot}
                    >
                        <CardTitle title="Item Batch Info" />
                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={() => {
                                this.setState({ showItemBatch: false })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <ItemsBatchView
                            id={this.state.selected_item_id}
                            warehouse_id={this.state.item_warehouse_id}
                        ></ItemsBatchView>
                    </div>
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

export default withStyles(styleSheet)(OrderTab1)
