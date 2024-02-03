import {
    Grid,
    InputAdornment,
    Dialog,
    Button,
    CircularProgress,
    Tooltip,
    Divider,
    Badge
} from '@material-ui/core'
import LoonsButton from "app/components/LoonsLabComponents/Button";
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ViewListIcon from '@material-ui/icons/ViewList';
import { green, yellow } from '@material-ui/core/colors';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CancelIcon from '@material-ui/icons/Cancel';
import { Autocomplete } from '@material-ui/lab'
import {
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    MainContainer,
    SubTitle,
    CardTitle
} from 'app/components/LoonsLabComponents'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import Row from '../Components/Row';
import IconButton from "@material-ui/core/IconButton";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService';
import CategoryService from 'app/services/datasetupServices/CategoryService';
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService';
import WarehouseServices from '../../../../../services/WarehouseServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import ReactEcharts from 'echarts-for-react';
import localStorageService from "app/services/localStorageService";
import CloseIcon from '@material-ui/icons/Close';
import DistributionCenterServices from 'app/services/DistributionCenterServices';
import { dateTimeParse } from "utils";

const styleSheet = (theme) => ({})

class RMSD_Create_Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            batchTotal: [],
            consumpMessage: null,
            updateQty: true,
            itemTotalQty: 0,
            selected_warehouse: '0',
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id: null,
            addtocart: null,
            cartStatus: [
                {
                    buttonState: false
                }
            ],
            selectedItem: 0,
            loaded: false,
            genByConsumption: false,
            lowStockWarning: false,
            suggestedWareHous: false,
            expiredStockWarning: false,
            orderExistWarning: false,
            individualView: false,
            orderDeleteWarning: false,
            orderID: null,
            medDetails: {
                itemName: "Panadol",
                drugStore: "Tangalle"
            },
            consumpEstimate: null,
            orderQty: null,
            activeStep: 1,
            data: [],
            myStockData: [],
            myStockCols: [
                // {     name: 'invoice',     label: 'Invoice No',     options: {} },
                {
                    name: 'batch',
                    label: 'Batch No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.myStockData[tableMeta.rowIndex]) {
                                // return "N/A"
                                return this
                                    .state
                                    .myStockData[tableMeta.rowIndex]
                                    .ItemSnapBatch
                                    .batch_no
                            }

                        }
                    }
                }, {
                    name: 'exp',
                    label: 'Exp Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.myStockData[dataIndex]) {
                                let data = this
                                    .state
                                    .myStockData[dataIndex]
                                    .ItemSnapBatch
                                    .exd;
                                if (data) {
                                    return <p>{dateTimeParse(data)}</p>
                                } else {
                                    return "N/A"
                                }
                            }
                        }
                    }
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: 'minPack',
                    label: 'Min Pack Size',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batchTotal[tableMeta.rowIndex] == undefined) { this.state.batchTotal.push(parseInt(this.state.myStockData[tableMeta.rowIndex].quantity)) }

                            if (this.state.myStockData[tableMeta.rowIndex]) {
                                // return "N/A"
                                return this
                                    .state
                                    .myStockData[tableMeta.rowIndex]
                                    .ItemSnapBatch
                                    .pack_size
                            }
                        }
                    }
                }, {
                    name: 'quantity',
                    label: 'Stock Qty',
                    options: {}
                }, {
                    name: 'quantity2',
                    label: 'Available Qty',
                    options: {}
                },

            ],
            columns: [
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[0] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[0]
                            }
                        }
                    }
                }, {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[1] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[1]
                            }
                        }
                        // filter: true,
                    },
                    width: 20
                }, {
                    name: 'ven',
                    label: 'Ven',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[2] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[2]
                            }
                        }
                        // filter: true,
                    }
                }, {
                    name: 'drug_store_name',
                    label: 'Drug Store',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[3] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[3]
                            }
                        }
                        // filter: true,
                    }
                }, {
                    name: 'store_quantity',
                    label: 'Drug Store Stock Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[4] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[4]
                            }
                        }
                        // filter: true,
                    }
                }, {
                    name: 'store_recervable_quantity',
                    label: 'Drug Store Available Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[5] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[5]
                            }
                        }
                        // filter: true,
                    }
                }, {
                    name: 'mystock_days',
                    label: 'My Stock Days',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[6] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[6]
                            }
                        }
                    }
                }, {
                    name: 'my_stock_quantity',
                    label: 'My Stock Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[7] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[7]
                            }
                        }
                    }
                }, {
                    name: 'estimated_consumption',
                    label: 'System Estimated Consumption',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[8] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[8]
                            }
                        }
                    }
                }, {
                    name: 'minimum_stock_level',
                    label: 'Minimum Stock Level',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[9] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[9]
                            }
                        }
                    }
                }, {
                    name: 'on_order_amount',
                    label: 'On Order Amount',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[9] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[9]
                            }
                        }
                    }
                }, {
                    name: 'on_order_committed',
                    label: 'On Order (Committed)',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[9] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[9]
                            }
                        }
                    }
                }, {
                    name: 'in_transit',
                    label: 'In Transit',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[9] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[9]
                            }
                        }
                    }
                }, {
                    name: 'annual_estimated_quantity',
                    label: 'Annual Estimated Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[9] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[9]
                            }
                        }
                    }
                }, {
                    name: 'remaining_annual_estimated_quantity',
                    label: 'Remain Annual Estimate Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[9] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[9]
                            }
                        }
                    }
                }, {
                    name: 'pack_size',
                    label: 'Pack Size',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (tableMeta.rowData[10] == null) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[10]
                            }
                        }
                    }
                }, {
                    name: 'order_quantity',
                    label: 'Order Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <TextValidator
                                    id={'Hello' + tableMeta.rowIndex}
                                    defaultValue={value != null ? value : 0}
                                    style={{
                                        width: 80
                                    }}
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        this
                                            .state
                                            .cartStatus[tableMeta.rowIndex]
                                            .order_quantity = e.target.value
                                    }}></TextValidator>
                            )

                        }
                    }
                }, {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            this
                                .state
                                .cartStatus
                                .push(
                                    { sr_no: tableMeta.rowData[0], buttonState: false, color: green[500], tooltip: "Add to Cart", order_quantity: 0 }
                                )

                            this.state.cartItems
                                .find((item) => {
                                    if (item.id == this.state.data[tableMeta.rowIndex].id) {
                                        this
                                            .state
                                            .cartStatus[tableMeta.rowIndex]
                                            .buttonState = true
                                        this
                                            .state
                                            .cartStatus[tableMeta.rowIndex]
                                            .color = "grey"
                                        this
                                            .state
                                            .cartStatus[tableMeta.rowIndex]
                                            .tooltip = "Added to Cart"
                                    }
                                })

                            return (
                                <Grid className="flex items-center">
                                    <Tooltip
                                        title={this
                                            .state
                                            .cartStatus[tableMeta.rowIndex]
                                            .tooltip}>
                                        <IconButton
                                            disabled={this
                                                .state
                                                .cartStatus[tableMeta.rowIndex]
                                                .buttonState}
                                            className="px-2"
                                            onClick={() => {

                                                this.setState({
                                                    rows2: [],
                                                    selectedItem: tableMeta.rowIndex,
                                                    orderQty: this.state.cartStatus[tableMeta.rowIndex].order_quantity,
                                                    consumpEstimate: tableMeta.rowData[8]
                                                })
                                                // prettier-ignore
                                                this.state.addtocart = this.state.data[tableMeta.rowIndex].id
                                                this.state.medDetails.itemName = tableMeta.rowData[1]
                                                this.state.medDetails.drugStore = tableMeta.rowData[3]
                                                this.state.suggestedWareHouses.item_id = this.state.data[tableMeta.rowIndex].item_id
                                                this.state.addSuggestedWareHouseCart.order_item_id = this.state.data[tableMeta.rowIndex].id
                                                //this.suggestedWareHouse()
                                                if (this.state.cartStatus[tableMeta.rowIndex].order_quantity <= 0) {
                                                    this.setState(
                                                        { alert: true, message: "You have not added a value", severity: 'error' }
                                                    )
                                                } else {

                                                    this.addtocart()
                                                  /*   console.log("table mata",this.state.data[tableMeta.rowIndex])
                                                    if ((this.state.data[tableMeta.rowIndex].rmsd_store_quantity != null)) {
                                                        if (this.state.cartStatus[tableMeta.rowIndex].order_quantity > parseInt(this.state.data[tableMeta.rowIndex].rmsd_store_quantity)) {
                                                            this.setState({ lowStockWarning: true })
                                                        } else {
                                                            this.addtocart()
                                                        }
                                                    } else {
                                                        this.setState(
                                                            { alert: true, message: "Some Values are not loaded to the database", severity: 'error' }
                                                        )
                                                    } */
                                                }
                                            }}
                                            size="small"
                                            aria-label="view">
                                            <ShoppingCartIcon
                                                style={{
                                                    color: this
                                                        .state
                                                        .cartStatus[tableMeta.rowIndex]
                                                        .color
                                                }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                this.state.addSuggestedWareHouseCart.order_item_details = []
                                                this.setState({
                                                    batchTotal: [],
                                                    myStockData: [],
                                                    rows2: [],
                                                    itemTotalQty: 0,
                                                    selectedItem: tableMeta.rowIndex,
                                                    orderQty: this.state.cartStatus[tableMeta.rowIndex].order_quantity,
                                                    consumpEstimate: tableMeta.rowData[8]
                                                })
                                                this.state.addtocart = this.state.data[tableMeta.rowIndex].id
                                                this.state.medDetails.itemName = tableMeta.rowData[1]
                                                this.state.medDetails.drugStore = tableMeta.rowData[3]
                                                // this.state.consumpEstimate = tableMeta.rowData[8]
                                                this.state.suggestedWareHouses.item_id = this.state.data[tableMeta.rowIndex].item_id
                                                this.state.addSuggestedWareHouseCart.order_item_id = this.state.data[tableMeta.rowIndex].id
                                                this.suggestedWareHouse()
                                                this.getBatchData()
                                                this.setState({ individualView: true })

                                                if ((tableMeta.rowData[4] != null) && (tableMeta.rowData[8] != null)) {
                                                    if (tableMeta.rowData[4].value > tableMeta.rowData[8].value) {
                                                        if (this.state.cartStatus[tableMeta.rowIndex].buttonState != true) {
                                                            this.setState(
                                                                { alert: true, message: "You have not added a value", severity: 'error' }
                                                            )
                                                        }
                                                    } else if (tableMeta.rowData[9] < 1000) {
                                                        this.setState(
                                                            { message: "Expiring stocks in the Selected Warehouse", severity: 'error' }
                                                        )
                                                    }
                                                } else {
                                                    this.setState(
                                                        { message: "Some Values are not loaded to the database", severity: 'error' }
                                                    )
                                                }

                                                if (this.state.cartStatus[tableMeta.rowIndex].buttonState == true) {
                                                    this.setState({ orderQty: tableMeta.rowData[11] })
                                                }
                                            }}
                                            size="small"
                                            aria-label="view">
                                            <VisibilityIcon
                                                style={{
                                                    color: yellow[600]
                                                }} />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        }

                    }
                }
            ],

            alert: false,
            message: '',
            severity: 'success',
            patient_pic: null,
            selectedType: null,
            selectedDays: null,
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            all_days: [],
            day_month: [
                {
                    id: 1,
                    name: "Days"
                }, {
                    id: 2,
                    name: "Months"
                }
            ],

            loading: false,
            formData: {
                ven_id: null,
                class_id: null,
                category_id: null,
                group_id: null,
                item_id: null,
                description: null,
                store_quantity: null,
                lessStock: null,
                moreStock: null,
                page: 0,
                limit: 10,
                warehouse_id: null,
                search: null,
                'order[0]': [
                    'updatedAt', 'DESC'
                ],
            },
            rows:[],
            rows2: [],
            genOrder: {
                warehouse_id: null,
                created_by: null,
                order_for: 0,
                type: "Pharmacy"
            },
            getCartItems: {
                pharmacy_order_id: null,
                status: 'Cart',
               // limit: 10,
                //page: 0,
                warehouse_id: null,
            },
            suggestedWareHouses: {
                item_id: 0,
                warehouse_id: null,
                limit: 10,
                page: 0,
                select_type: "DRUG_STORE_REQUEST"
            },
            addSuggestedWareHouseCart: {
                order_item_id: 0,
                order_item_details: []
            },
            cartItems: [],
            msg: null,
            options: {
                legend: {
                    data: ["Actual Consumption", "Suggested Consumption"]
                },
                grid: {
                    left: "3%",
                    right: "4%",
                    bottom: "3%",
                    containLabel: true
                },
                xAxis: {
                    type: "category",
                    data: [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun"
                    ]
                },
                yAxis: {
                    type: "value"
                },
                series: [
                    {
                        name: "Actual Consumption",
                        type: "bar",
                        data: [
                            320,
                            302,
                            301,
                            334,
                            390,
                            330,
                            320
                        ]
                    }, {
                        name: "Suggested Consumption",
                        type: "bar",
                        data: [
                            150,
                            212,
                            201,
                            154,
                            190,
                            330,
                            410
                        ]
                    }
                ],
                tooltip: {
                    trigger: "axis"
                },
                color: ["#3483eb", "#34bdeb"]
            },
            totalItems: 0,
            warehouseSelectDone: false,

        }

    }
    genOrderDays(day, type) {
        return day * type
    }

    load_days(max) {
        for (let index = 1; index < max; index++) {
            this
                .state
                .all_days
                .push({ id: index, date: index.toString() });
        }
        this.render()
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New formdata", this.state.formData)
            this.loadOrderList()
        })
    }

    componentDidMount() {
        this.loadWarehouses()
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
            'order[0]': [
                'createdAt', 'DESC'
            ],
        }
        let batch_res = await DistributionCenterServices.getBatchData(params)
        if (batch_res.status == 200) {

            this.setState({ myStockData: batch_res.data.view.data })
            console.log('Batch Data', this.state.myStockData)
            this.setState({ updateQty: true })
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
        let class_res = await
            ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
    }

    async loadOrderList() {
        this.setState({ loaded: false, cartStatus: [] })
        let res = await PharmacyOrderService.getRmsd_distributions(this.state.formData)
        let order_id = 0
        if (res.status) {
            if (res.data.view.data.length != 0) {
                order_id = res
                    .data
                    .view
                    .data[0]
                    .pharmacy_order_id
            }
            this.state.getCartItems.pharmacy_order_id = order_id
            this.setState({
                data: res.data.view.data,
                loaded: true,
                totalItems: res.data.view.totalItems,
            }, () => {
                this.render()
                this.getCartItems()
            })
        }
    }

    async getCartItems() {
        let res2 = await PharmacyOrderService.getOrderList(this.state.getCartItems)
        if (res2.status) {
            this.setState({
                cartItems: res2.data.view.data
            }, () => {
                console.log("cart", res2.data.view.data)
                this.render()
            })
        }
    }

    async generateOrder() {
        this.setState({ loaded: false })
        let res = await PharmacyOrderService.crateRmsd_distributions(this.state.genOrder)
        if (res.status) {
            this.setState({ msg: res.data.posted.msg })
            this.state.msg == ("data has been added successfully.")
                ? this.setState({ alert: true, message: this.state.msg, severity: 'success' })
                : this.setState({
                    alert: true,
                    message: this.state.msg,
                    severity: 'error',
                    orderID: res
                        .data
                        .posted
                        .data
                        .data[0]
                        .OrderRequirement
                        .id,
                    orderExistWarning: true
                })

                setTimeout(() => {
                    this.loadOrderList()
                }, 2000);
        }
    }

    genByConsumption() {
        this.setState({ genByConsumption: true })
    }

    async removeOrder() {
        this.setState({ loaded: false })
        let res = await PharmacyOrderService.deleteOrderRequement(this.state.orderID)
        if (res.status) {
            if (res.data.view == "data deleted successfully.") {
                this.setState({
                    loaded: true,
                    alert: true,
                    message: res.data.view,
                    severity: 'success',
                    cartItems: []
                }, () => {
                    this.render()
                    this.setState({
                        cartItems: []
                    })
                })
            }

            this.loadOrderList()
        } else {
            this.setState(
                { alert: true, message: "Order Could Not be Deleted. Please Try Again", severity: 'error' }
            )
        }

    }

    async addtocart() {
        let res = await PharmacyOrderService.addToCartRMSD(
            this.state.addtocart,
            this.state.cartStatus[this.state.selectedItem]
        )
        if (res.status) {
            if (res.data.patched == "data updated successfully.") {
                this.setState({
                    loaded: true,
                    alert: true,
                    message: "Item Added to Cart Successfully",
                    severity: 'success'
                }, () => {
                    this.render()
                    this.loadOrderList()
                    this
                        .state
                        .cartStatus[this.state.selectedItem]
                        .buttonState = true
                    this
                        .state
                        .cartStatus[this.state.selectedItem]
                        .color = "grey"
                    this
                        .state
                        .cartStatus[this.state.selectedItem]
                        .tooltip = "Added to Cart"
                })
            }
        } else {
            this.setState(
                { alert: true, message: "Item adding to cart failed. Please Try Again", severity: 'error' }
            )
        }

    }

    async suggestedWareHouse() {
        let res = await PharmacyOrderService.getSuggestedWareHouse(
            this.state.suggestedWareHouses
        )
        if (res.status) {
            console.log('suggested', res.data)
            this.setState({
                rows2: res.data.view.data
            }, () => {
                this.render()
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
        if (this.state.addSuggestedWareHouseCart.order_item_details.length == 0) {
            this.state.addSuggestedWareHouseCart.order_item_details.push(
                {
                    warehouse_id: warehouseid,
                    order_quantity: orderqty,
                    drug_store_name: drugstore,
                    store_quantity: storeqty,
                    store_recervable_quantity: storerecieveqty
                }
            )
        } else {
            let found = false
            let pos = 0
            this.state.addSuggestedWareHouseCart.order_item_details.find((warehouse, index) => {
                if (warehouse != null) {
                    if (warehouse.warehouse_id == warehouseid) {
                        console.log("orderItem warehouse equal", index);
                        found = true
                        pos = index
                    }
                }
            })

            if (found) {
                if (orderqty == "0" | orderqty == null | orderqty == '') {
                    console.log("removed", pos);
                    this.state.addSuggestedWareHouseCart.order_item_details.splice(pos, 1)
                } else {
                    console.log("orderItem Index", pos);
                    this.state.addSuggestedWareHouseCart.order_item_details[pos].order_quantity = orderqty
                }
            } else {
                this.state.addSuggestedWareHouseCart.order_item_details.push(
                    {
                        warehouse_id: warehouseid,
                        order_quantity: orderqty,
                        drug_store_name: drugstore,
                        store_quantity: storeqty,
                        store_recervable_quantity: storerecieveqty
                    }
                )
            }


        }

        this.state.itemTotalQty = 0
        for (let index = 0; index < this.state.addSuggestedWareHouseCart.order_item_details.length; index++) {
            this.state.itemTotalQty += parseInt(this.state.addSuggestedWareHouseCart.order_item_details[index].order_quantity)
        }
        console.log("OrderItems total", this.state.itemTotalQty);
        this.setState({ updateQty: true })
        console.log('OrderItems', this.state.addSuggestedWareHouseCart);

    }

    async addSuggested() {
        let res = await PharmacyOrderService.suggestedWareHouseCart(
            this.state.addSuggestedWareHouseCart
        )
        if (res.status) {
            if (res.data.posted == "data has been added successfully.") {
                this.setState({
                    loaded: true,
                    alert: true,
                    message: "Item Added to Cart Successfully",
                    severity: 'success'
                }, () => {
                    this.render()
                    this.loadOrderList()
                    this
                        .state
                        .cartStatus[this.state.selectedItem]
                        .buttonState = true
                    this
                        .state
                        .cartStatus[this.state.selectedItem]
                        .color = "grey"
                    this
                        .state
                        .cartStatus[this.state.selectedItem]
                        .tooltip = "Added to Cart"
                })
            }
        } else {
            this.setState(
                { alert: true, message: "Item adding to cart failed. Please Try Again", severity: 'error' }
            )
        }
    }

    async saveStepOneSubmit() { }

    



    async loadWarehouses() {
        this.setState({ loaded: false })
        var user = await localStorageService.getItem('userInfo');
        var owner_id = await localStorageService.getItem('owner_id');
        console.log('warehouse_id', this.props.warehouse_id)
        var id = user.id;

        this.state.genOrder.created_by = id
        this.state.genOrder.warehouse_id = this.props.warehouse_id
        this.state.getCartItems.warehouse_id = this.props.warehouse_id
        this.state.suggestedWareHouses.warehouse_id = this.props.warehouse_id
        this.state.formData.warehouse_id = this.props.warehouse_id
        this.state.formData.owner_id = owner_id
        this.setState({ owner_id: owner_id, selected_warehouse: this.props.warehouse_id, warehouseSelectDone: true, loaded: true })


    }

   

    render() {
        const SuggestedTable = <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {/* <TableCell>
                            <strong>Drug Store ID</strong>
                        </TableCell> */}
                        <TableCell>
                            <strong>Drug Store</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Batch Details</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Reason</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Stock Qty</strong>
                        </TableCell>
                        <TableCell>
                            <strong>Order</strong>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        this.state.rows2.length != 0
                            ? this
                                .state
                                .rows2
                                .map((row) => (
                                    <Row
                                        key={row.name}
                                        row={row}
                                        onChangeFunc={this
                                            .addSuggestedWareHouseCart
                                            .bind(this)} />
                                ))
                            : <TableRow>
                                <TableCell colSpan={10}>
                                    <Typography className='text-center font-semibold'>
                                        No Suggested Warehouses to Display</Typography>
                                </TableCell>
                            </TableRow>
                    }
                </TableBody>
            </Table>
        </TableContainer>;
        const OrderQTY = <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '10px'
            }}>
            <div>
                Order Qty
            </div>
            <div className='pr-5 pl-5'>
                <input value={this.state.updateQty ? parseInt(this.state.orderQty) + parseInt(this.state.itemTotalQty) : null}></input>
            </div>
        </div>;
        const EstimateConsumption = <div style={{
            display: 'flex'
        }}>
            <div>
                System Estimated Consumption
            </div>
            <div className='pr-5 pl-5'>
                <input value={this.state.consumpEstimate}></input>
            </div>
        </div>;
        return (<Fragment>
            <MainContainer>
                {/* Filtr Section */}

                <div
                    style={{
                        display: 'flex',
                        // flexDirection: 'row',
                        // flexWrap: 'nowrap',
                        justifyContent: 'space-between',
                        aligroupItems: 'baseline'
                    }}>
                    <div
                        style={{
                            display: 'flex',
                            width: "70%",
                            aligroupItems: 'baseline',
                        }}>
                        <ValidatorForm
                            onSubmit={() => this.genByConsumption()}
                            onError={() => null}>
                            <Grid
                                container="container"
                                lg={24}
                                md={24}
                                xs={24}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    flexWrap: 'nowrap'
                                }}>

                                {/* <div
                                className="mr-2"
                                style={{
                                    display: 'flex',
                                    aligroupItems: 'flex-end'
                                }}> */
                                }
                                <Grid item="item" lg={3} md={3} xs={12} className="mr-2">
                                    <h5 >Set Order For</h5>
                                </Grid>
                                <Grid item="item" lg={3} md={3} xs={12} className="mr-2">
                                    <Autocomplete
                                        disableClearable
                                        options={this.state.all_days}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                this.state.selectedDays = value.date
                                                if (this.state.selectedType == "Days") {
                                                    this.state.genOrder.order_for = this.genOrderDays(this.state.selectedDays, 1)
                                                } else if (this.state.selectedType == "Months") {
                                                    this.state.genOrder.order_for = this.genOrderDays(this.state.selectedDays, 30)
                                                } else {
                                                    this.state.genOrder.order_for = value.date
                                                }

                                            }
                                        }}
                                        value={this
                                            .state
                                            .all_days
                                            .find((v) => v.id == this.state.all_days_id)}
                                        getOptionLabel={(
                                            option) => option.date
                                                ? option.date
                                                : ''}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Days"
                                                variant="outlined"
                                                size="small"
                                                required="required" />
                                        )} />
                                </Grid>

                                <Grid item="item" lg={3} md={3} xs={12} className="mr-2">

                                    <Autocomplete
                                        disableClearable
                                        options={this.state.day_month}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                if (value.name == "Days") {
                                                    this.state.genOrder.order_for = this.genOrderDays(this.state.selectedDays, 1)
                                                } else {
                                                    this.state.genOrder.order_for = this.genOrderDays(this.state.selectedDays, 30)
                                                }
                                                this.setState({ selectedType: value.name })
                                            }
                                        }}
                                        value={this
                                            .state
                                            .day_month
                                            .find((v) => v.id == this.state.day_month_id)}
                                        getOptionLabel={(
                                            option) => option.name
                                                ? option.name
                                                : ''}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Days"
                                                variant="outlined"
                                                size="small"
                                                required="required" />
                                        )} />
                                </Grid>

                                <Grid item="item" lg={4} md={4} xs={12} className="mr-2">

                                    <Autocomplete
                                        disableClearable
                                        options={["Consumption Based", "Estimation Based"]}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let genOrder = this.state.genOrder;
                                                genOrder.type = value;
                                                this.setState({
                                                    genOrder,
                                                    consumpMessage: value
                                                })
                                            } else {
                                                this.setState({
                                                    consumpMessage: null
                                                })
                                            }
                                        }}
                                        // value={this
                                        //     .state
                                        //     .day_month
                                        //     .find((v) => v.id == this.state.day_month_id)}
                                        // getOptionLabel={(
                                        //     option) => option.name
                                        //     ? option.name
                                        //     : ''}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Based on"
                                                variant="outlined"
                                                size="small"
                                                required="required" />
                                        )} />
                                </Grid>
                                <Grid item="item" lg={2} md={2} xs={12}>
                                    <LoonsButton color="primary" size="medium" type="submit">Generate</LoonsButton>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            aligroupItems: 'baseline'
                        }}>
                        <div className="mr-2">
                           {/*  <h6>Order From: Counter Pharmacist</h6> */}
                        </div>
                        <div>
                            <div>
                                {this.state.loaded && this.state.warehouseSelectDone ? <Badge badgeContent={this.state.cartItems.length} color="primary">
                                    <ShoppingCartIcon fontSize="large" />
                                </Badge>
                                    : <Badge badgeContent='0' color="primary">
                                        <ShoppingCartIcon fontSize="large" />
                                    </Badge>
                                }
                            </div>
                            <div></div>
                        </div>
                    </div>
                </div>

                <ValidatorForm
                    className="pt-2"
                    onSubmit={() => this.loadOrderList()}
                    onError={() => null}>
                    {/* Main Grid */}
                    <Grid container="container" spacing={2} direction="row">
                        <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                            <Grid container="container" spacing={2}>
                                {/* Ven */}
                                <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                    <SubTitle title="Ven" />
                                    <Autocomplete
                                        disableClearable className="w-full"
                                        options={this.state.all_ven}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.ven_id = value.id
                                            } else {
                                                formData.ven_id = null
                                            }
                                            console.log(this.state.formData);
                                            this.setState({ formData })
                                        }}
                                        /*  defaultValue={this.state.all_district.find(
                                        (v) => v.id == this.state.formData.district_id
                                        )} */
                                        value={this
                                            .state
                                            .all_ven
                                            .find((v) => v.id == this.state.formData.ven_id)} getOptionLabel={(
                                                option) => option.name
                                                    ? option.name
                                                    : ''} renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Ven"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small" />
                                                    )} />
                                </Grid>

                                {/* Serial/Family Number */}
                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Item Class" />
                                    <Autocomplete
                                        disableClearable className="w-full"
                                        options={this.state.all_item_class}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.class_id = value.id
                                            } else {
                                                formData.class_id = null
                                            }
                                            console.log(this.state.formData);
                                            this.setState({ formData })
                                        }}
                                        /*  defaultValue={this.state.all_district.find(
                                        (v) => v.id == this.state.formData.district_id
                                        )} */
                                        value={this
                                            .state
                                            .all_item_class
                                            .find((v) => v.id == this.state.formData.class_id)}

                                        getOptionLabel={(
                                            option) => option.description
                                                ? option.description
                                                : ''}

                                        renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Item Class"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                        )} />
                                </Grid>

                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Stock Days >= More Than" />
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Stock Days >= More Than"
                                        name="stockMore"
                                        InputLabelProps={{
                                            shrink: false
                                        }}
                                        value={this.state.formData.moreStock}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        min={0}
                                        onChange={(e) => {
                                            this.setState({
                                                formData: {
                                                    ...this.state.moreStock,
                                                    moreStock: e.target.value
                                                }
                                            })
                                        }} />
                                </Grid>

                                {/* Stock Days 1 */}
                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Stock Days <= Less Than" />
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Stock Days <= Less Than"
                                        name="lessStock"
                                        InputLabelProps={{
                                            shrink: false
                                        }}
                                        value={this.state.formData.lessStock}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            this.setState({
                                                formData: {
                                                    ...this.state.formData,
                                                    lessStock: e.target.value
                                                }
                                            })
                                        }} />
                                </Grid>

                                {/* Serial Family Name*/}
                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Item Category" />

                                    <Autocomplete
                                        disableClearable className="w-full"
                                        options={this.state.all_item_category}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.item_category_id = value.id
                                            } else {
                                                formData.item_category_id = null
                                            }
                                            console.log(this.state.formData);
                                            this.setState({ formData })
                                        }}
                                        /*  defaultValue={this.state.all_district.find(
                                        (v) => v.id == this.state.formData.district_id
                                        )} */
                                        value={this
                                            .state
                                            .all_item_category
                                            .find((v) => v.id == this.state.formData.category_id)}
                                        getOptionLabel={(
                                            option) => option.description
                                                ? option.description
                                                : ''}
                                        renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Item Category"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                        )} />
                                </Grid>

                                {/* Item Group*/}
                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Item Group" />

                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.all_item_group}
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (value != null) {
                                                formData.item_group_id = value.id
                                            } else {
                                                formData.item_group_id = null
                                            }
                                            console.log(this.state.formData);
                                            this.setState({ formData })
                                        }}
                                        value={this
                                            .state
                                            .all_item_group
                                            .find((v) => v.id == this.state.formData.group_id)}
                                        getOptionLabel={(
                                            option) => option.description
                                                ? option.description
                                                : ''}
                                        renderInput={(params) => (
                                            <TextValidator {...params} placeholder="Item Group"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                        )} />
                                </Grid>

                                {/* Drug Store Qty*/}
                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Drug Store Qty" />

                                    <TextValidator className=" w-full" placeholder="Drug Store Qty" name="drug_store_qty" InputLabelProps={{
                                        shrink: false
                                    }} value={this.state.formData.description} type="text" variant="outlined" size="small" onChange={(e) => {
                                        this.setState({
                                            formData: {
                                                ...this.state.formData,
                                                description: e.target.value
                                            }
                                        })
                                    }}
                                    //validators={['required']}

                                    //errorMessages={['this field is required']}
                                    />
                                </Grid>

                                <Grid
                                    item="item"
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                    className=" w-full flex justify-start">
                                    {/* Submit Button */}
                                    <LoonsButton className="mt-5 mr-2" progress={false} type='submit'
                                    //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">
                                            {
                                                this.state.isUpdate
                                                    ? 'Update'
                                                    : 'Filter'
                                            }
                                        </span>
                                    </LoonsButton>
                                    {/* Cancel Button */}
                                    {/* <LoonsButton
                                        className="mt-5"
                                        progress={false}
                                        scrollToTop={true}
                                        color="#cfd8dc"
                                        onClick={this.clearField}>
                                        <span className="capitalize">
                                            Show Short Expo
                                        </span>
                                    </LoonsButton> */}
                                </Grid>
                                <Grid item="item" lg={12} md={12} xs={12}></Grid>
                                <Grid
                                    item="item"
                                    lg={3}
                                    md={3}
                                    xs={3}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        marginTop: '-20px'

                                    }}>
                                    <SubTitle title="Search" />

                                    <TextValidator className='' placeholder="Search"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small" value={this.state.formData.search} onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (e.target.value != '') {
                                                formData.search = e.target.value;
                                            } else {
                                                formData.search = null
                                            }
                                            this.setState({ formData })
                                            console.log("form dat", this.state.formData)
                                        }}

                                        onKeyPress={(e) => {
                                            if (e.key == "Enter") {
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
                                                <InputAdornment position="end">
                                                    <SearchIcon></SearchIcon>
                                                </InputAdornment>
                                            )
                                        }} />

                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {
                                    this.state.loaded && this.state.warehouseSelectDone
                                        ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'} data={this.state.data} columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,
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
                                                            console.log('action not handled.')
                                                    }
                                                }
                                            }}></LoonsTable>
                                        : (
                                            //loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )
                                }

                            </Grid>
                        </Grid>
                    </Grid>
                </ValidatorForm>

            </MainContainer>

            <Dialog
                maxWidth="lg "
                open={this.state.lowStockWarning}
                onClose={() => {
                    this.setState({ lowStockWarning: false })
                }}>
                <div className="w-full h-full px-5 py-5">

                    <CardTitle title="Insufficient Stock Balance"></CardTitle>
                    <div>
                        <p>{this.state.medDetails.itemName}
                            stock balance is insufficient in {this.state.medDetails.drugStore}. Would you like to place the order from suggested Drug Store?</p>
                        <Grid
                            container="container"
                            style={{
                                justifyContent: 'flex-end'
                            }}>
                            <Grid
                                className="w-full flex justify-end"
                                item="item"
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6}>
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
                                            orderQty: 0
                                        })
                                    }}>
                                    <span className="capitalize">Yes</span>
                                </LoonsButton>

                                <LoonsButton
                                    className="mt-2 ml-2"
                                    progress={false}
                                    type="submit"
                                    startIcon="close"
                                    onClick={() => {
                                        this.setState({ lowStockWarning: false });
                                    }}>
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
                }}>
                <div className="w-full h-full px-5 py-5">

                    <CardTitle title="Expiring Stocks"></CardTitle>
                    <div>
                        <p>{this.state.medDetails.itemName}
                            stock is expired in {this.state.medDetails.drugStore}. Would you like to place the order from suggested Drug Store?</p>
                        <Grid
                            container="container"
                            style={{
                                justifyContent: 'flex-end'
                            }}>
                            <Grid
                                className="w-full flex justify-end"
                                item="item"
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6}>
                                <LoonsButton
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    onClick={() => {
                                        this.setState({ expiredStockWarning: false, suggestedWareHous: true })
                                    }}>
                                    <span className="capitalize">Yes</span>
                                </LoonsButton>

                                <LoonsButton
                                    className="mt-2 ml-2"
                                    progress={false}
                                    type="submit"
                                    startIcon="close"
                                    onClick={() => {
                                        this.setState({ expiredStockWarning: false })
                                    }}>
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
                }}>
                <div className="w-full h-full px-5 py-5">

                    <CardTitle title="Order Requirement already exist"></CardTitle>
                    <div>
                        <p>Order Requirement already exist. Please delete before regenerate.</p>
                        <Grid
                            container="container"
                            style={{
                                justifyContent: 'flex-end'
                            }}>
                            <Grid
                                className="w-full flex justify-end"
                                item="item"
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6}>
                                <LoonsButton
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    startIcon="delete"
                                    onClick={() => {
                                        this.setState({ orderExistWarning: false, orderDeleteWarning: true })
                                    }}>
                                    <span className="capitalize">Delete</span>
                                </LoonsButton>

                                <LoonsButton
                                    className="mt-2 ml-2"
                                    progress={false}
                                    type="submit"
                                    startIcon={<ViewListIcon />}
                                    onClick={() => {
                                        this.setState({ orderExistWarning: false });
                                    }}>
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
                }}>
                <div className="w-full h-full px-5 py-5">

                    <CardTitle title="Are you sure you want to delete?"></CardTitle>
                    <div>
                        <p>This order will be deleted and you will have to apply for a new order. This
                            cannot be undone.</p>
                        <Grid
                            container="container"
                            style={{
                                justifyContent: 'flex-end'
                            }}>
                            <Grid
                                className="w-full flex justify-end"
                                item="item"
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6}>
                                <LoonsButton
                                    className="mt-2"
                                    progress={false}
                                    type="submit"
                                    startIcon="delete"
                                    onClick={() => {
                                        this.setState({ orderDeleteWarning: false });
                                        this.removeOrder()
                                    }}>
                                    <span className="capitalize">Delete</span>
                                </LoonsButton>

                                <LoonsButton
                                    className="mt-2 ml-2"
                                    progress={false}
                                    type="submit"
                                    startIcon={<CancelIcon />}
                                    onClick={() => {
                                        this.setState({ orderDeleteWarning: false });
                                    }}>
                                    <span className="capitalize">Cancel</span>
                                </LoonsButton>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Dialog>

            <Dialog
                style={{
                    padding: '10px'
                }}
                maxWidth="lg"
                open={this.state.suggestedWareHous}
                onClose={() => {
                    this.setState({ suggestedWareHous: false })
                }}>
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
                                marginTop: '10px'
                            }}
                            lg={6}
                            md={6}>
                            {EstimateConsumption}
                        </Grid>
                        <Grid item="item" lg={6} md={6}>
                            {OrderQTY}
                        </Grid>
                        <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                            {SuggestedTable}
                        </Grid>
                        <Grid item="item" lg={12} md={12} xs={12} className="flex justify-end mt-6">
                            <Button
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                    this.setState({ suggestedWareHous: false })
                                }}
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white'
                                }}>Cancel</Button>
                            <Button
                                className="ml-2"
                                startIcon={<ShoppingCartIcon size="medium" />}
                                color="warning"
                                onClick={() => {
                                    if (this.state.addSuggestedWareHouseCart.order_item_details.length != 0) {
                                        this.addSuggested()
                                    } else {
                                        this.addtocart()
                                    }

                                    this.setState({ suggestedWareHous: false })
                                }}
                                style={{
                                    backgroundColor: 'green',
                                    color: 'white'
                                }}>Add to Cart</Button>
                        </Grid>
                    </Grid>
                </div>

            </Dialog>

            <Dialog
                style={{
                    padding: '10px'
                }}
                maxWidth="lg"
                open={this.state.individualView}
                onClose={() => {
                    // this.setState({individualView: false})
                }}>
                <div className="w-full h-full px-5 py-5">
                    <Grid container="container">
                        <Grid item="item" lg={12} md={12} xs={12} className="mb-4">
                            <LoonsCard>
                                <Grid container="container">
                                    <Grid item="item" lg={12} md={12} xs={12}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <CardTitle title="Suggeted Ware House"></CardTitle>
                                            <IconButton aria-label="close" onClick={() => { this.setState({ individualView: false }) }}><CloseIcon /></IconButton>
                                        </div>
                                    </Grid>
                                    <Grid
                                        item="item"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            marginTop: '10px'
                                        }}
                                        lg={6}
                                        md={6}>
                                        {EstimateConsumption}
                                    </Grid>
                                    <Grid item="item" lg={6} md={6}>
                                        {OrderQTY}
                                    </Grid>
                                    <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                        {SuggestedTable}
                                    </Grid>
                                </Grid>
                            </LoonsCard>
                        </Grid>

                        <Grid item="item" lg={6} md={6} xs={12} className="pr-2">
                            <LoonsCard>
                                <Grid
                                    container="container"
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                    <Grid item="item" lg={6} md={6} xs={4}>
                                        <Typography variant="h6" className="font-semibold">Consumption</Typography>
                                    </Grid>
                                    <Grid
                                        item="item"
                                        lg={3}
                                        md={3}
                                        xs={4}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                        {this.state.consumpEstimate}
                                    </Grid>
                                </Grid>
                                <Divider className='mb-4' />
                                <ReactEcharts option={this.state.options} />
                            </LoonsCard>
                        </Grid>

                        <Grid item="item" lg={6} md={6} xs={12} className="pl-2">
                            <LoonsCard>
                                <Grid container="container">
                                    <Grid item="item" lg={6} md={6} xs={4}>
                                        <Typography variant="h6" className="font-semibold">My Stock</Typography>
                                    </Grid>
                                    <Grid
                                        item="item"
                                        lg={3}
                                        md={3}
                                        xs={4}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                        Stock: {this.state.batchTotal.length}
                                    </Grid>
                                    <Grid
                                        item="item"
                                        lg={3}
                                        md={3}
                                        xs={4}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                        QTY: {this.state.updateQty ? this.state.batchTotal.reduce((partialSum, a) => partialSum + a, 0) : "N/A"}
                                    </Grid>
                                </Grid>
                                <Divider className='mb-4' />

                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allAptitute'} data={this.state.myStockData} columns={this.state.myStockCols} options={{
                                        filterType: 'textField',
                                        pagination: false,
                                        size: 'medium',
                                        serverSide: true,
                                        print: false,
                                        viewColumns: false,
                                        download: false,
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
                                                    console.log('action not handled.')
                                            }
                                        }
                                    }}></LoonsTable>

                            </LoonsCard>
                        </Grid>

                        <Grid item="item" lg={12} md={12} xs={12} className="flex justify-end mt-6">
                            <Button
                                startIcon={<CancelIcon />}
                                onClick={() => {
                                    this.setState({ individualView: false })
                                }}
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white'
                                }}>Cancel</Button>

                            {
                                this.state.cartStatus.length != 0
                                    ? <Button
                                        disabled={this
                                            .state
                                            .cartStatus[this.state.selectedItem]
                                            .buttonState}
                                        className="ml-2"
                                        startIcon={<ShoppingCartIcon size="medium" />}
                                        color="warning"
                                        onClick={() => {
                                            if (this.state.itemTotalQty == '' || this.state.itemTotalQty == 0 || this.state.itemTotalQty == null) {
                                                this.setState({
                                                    message: "Please Enter a value before adding to Cart",
                                                    alert: true,
                                                    severity: "Error"
                                                })
                                            } else {
                                                let message = this.state.message
                                                if (message == "Low stocks in the selected Warehouse") {
                                                    this.setState({ lowStockWarning: true, alert: true })
                                                } else if (message == "Expiring stocks in the Selected Warehouse") {
                                                    this.setState({ expiredStockWarning: true, alert: true })
                                                } else if (message == "Some Values are not loaded to the database") {
                                                    this.setState({ alert: true })
                                                } else {
                                                    if (this.state.addSuggestedWareHouseCart.order_item_details.length != 0) {
                                                        this.addSuggested()
                                                    } else {
                                                        this.addtocart()
                                                    }
                                                }
                                                this.setState({ individualView: false })
                                            }
                                        }}
                                        style={{
                                            backgroundColor: this
                                                .state
                                                .cartStatus[this.state.selectedItem]
                                                .color,
                                            color: 'white'
                                        }}>{
                                            this
                                                .state
                                                .cartStatus[this.state.selectedItem]
                                                .tooltip
                                        }</Button>
                                    : <Button
                                        className="ml-2"
                                        startIcon={<ShoppingCartIcon size="medium" />}
                                        color="warning"
                                        onClick={() => {
                                            if (this.state.itemTotalQty == '' || this.state.itemTotalQty == 0 || this.state.itemTotalQty == null) {
                                                this.setState({
                                                    message: "Please Enter a value before adding to Cart",
                                                    alert: true,
                                                    severity: "Error"
                                                })
                                            } else {
                                                if (this.state.addSuggestedWareHouseCart.order_item_details.length != 0) {
                                                    this.addSuggested()
                                                } else {
                                                    this.addtocart()
                                                }
                                                this.setState({ individualView: false })
                                            }
                                            console.log('itemtotal', this.state.itemTotalQty);
                                        }}
                                        style={{
                                            backgroundColor: 'green',
                                            color: 'white'
                                        }}>Add to Cart</Button>
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
                maxWidth="lg "
                open={this.state.genByConsumption}
                onClose={() => {
                    this.setState({ genByConsumption: false })
                }}>
                <div className="w-full h-full px-5 py-5">

                    <CardTitle title={`Are you sure you want generate Order by ${this.state.consumpMessage} ?`}></CardTitle>
                    <div>
                        <Grid
                            container="container"
                            style={{
                                justifyContent: 'flex-end'
                            }}>
                            <Grid
                                className="w-full flex justify-end"
                                item="item"
                                lg={6}
                                md={6}
                                sm={6}
                                xs={6}>
                                <LoonsButton
                                    className="mt-2"
                                    progress={false}
                                    //type="submit"

                                    onClick={() => {
                                        this.setState({ genByConsumption: false });
                                        if (this.state.consumpMessage == "Estimation Based") {
                                            this.generateOrder()
                                        } else {
                                            this.setState({
                                                message: "Error connecting to backend",
                                                severity: "Error",
                                                alert: true
                                            })
                                        }
                                    }}>
                                    <span className="capitalize">Yes</span>
                                </LoonsButton>

                                <LoonsButton
                                    className="mt-2 ml-2"
                                    progress={false}
                                    //type="submit"
                                    startIcon={<CancelIcon />}
                                    onClick={() => {
                                        this.setState({ genByConsumption: false });
                                    }}>
                                    <span className="capitalize">No</span>
                                </LoonsButton>
                            </Grid>
                        </Grid>
                    </div>
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
                variant="filled"></LoonsSnackbar>
        </Fragment>
        )
    }
}

export default RMSD_Create_Orders