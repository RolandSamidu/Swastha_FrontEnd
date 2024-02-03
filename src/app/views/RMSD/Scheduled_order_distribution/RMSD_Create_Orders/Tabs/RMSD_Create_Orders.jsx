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
import FeedIcon from '@mui/icons-material/Feed';
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
import { dateTimeParse, roundDecimal } from "utils";
import moment from 'moment';

const styleSheet = (theme) => ({})

class RMSD_Create_Orders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            batchTotal: [],
            prescriptionDrugAssign: [],
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
            medDetails: {},
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
                        display: false, 
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
                    name: 'institute_name',
                    label: 'Drug Store',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].institute_name == null) {
                                return 'N/A'
                            } else {
                                return this.state.data[tableMeta.rowIndex].institute_name
                            }
                        }
                        // filter: true,
                    }
                }, {
                    name: 'store_quantity',
                    label: 'Drug Store Stock Quantity',
                    options: {
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].institute_store_quantity == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].institute_store_quantity)
                            }

                        }
                        // filter: true,
                    }
                },{
                    name: 'store_recervable_quantity',
                    label: 'Drug Store Servisable Quantity',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].store_recervable_quantity == null) {
                                return 'N/A'
                            } else {
                                return this.state.data[tableMeta.rowIndex].store_recervable_quantity
                            }

                        }
                        // filter: true,
                    }
                },
                 {
                    name: 'my_stock_quantity',
                    label: 'My Stock Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].rmsd_store_quantity == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].rmsd_store_quantity)
                            }

                        }
                    }
                },{
                    name: 'mystock_days',
                    label: 'My Stock Days',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].mystock_days == null) {
                                return 'N/A'
                            } else {
                                return Math.ceil(this.state.data[tableMeta.rowIndex].mystock_days)
                            }
                        }
                    }
                }, 
                {
                    name: 'prescribable amount',
                    label: 'Prescribable Amount',
                    options: {
                        display:false,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            console.log("this.state.prescriptionDrugAssign", this.state.prescriptionDrugAssign)
                            let data = this.state.prescriptionDrugAssign.filter((item) => item.drug_id == this.state.data[tableMeta.rowIndex].item_id)

                            if (data.length == 0) {
                                return '0'
                            } else {
                                let qty = Number(data[0].total_quantity) * (this.state.data[tableMeta.rowIndex].RMSDDistribution?.order_for) / 180
                                return roundDecimal(qty, 1)
                            }
                        }
                    }
                }, {
                    name: 'store_recervable_quantity',
                    label: 'My Available Quantity',
                    options: {
                        display:false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].rmsd_store_recervable_quantity == null) {
                                return 'N/A'
                            } else {
                                return this.state.data[tableMeta.rowIndex].rmsd_store_recervable_quantity
                            }
                        }
                        // filter: true,
                    }
                }, {
                    name: 'estimated_consumption',
                    label: 'System Estimated Consumption',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].estimated_consumption == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].estimated_consumption)
                            }

                        }
                    }
                }, {
                    name: 'minimum_stock_level',
                    label: 'My Minimum Stock Level',
                    options: {
                        display:false,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].rmsd_minimum_stock_level == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].rmsd_minimum_stock_level)
                            }

                        }
                    }
                }, {
                    name: 'minimum_stock_level',
                    label: 'Drug Store Minimum Stock Level',
                    options: {
                        display:false,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].institute_minimum_stock_level == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].institute_minimum_stock_level)
                            }

                        }
                    }
                }, {
                    name: 'on_order_amount',
                    label: 'On Order Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].on_order_amount == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].on_order_amount)
                            }

                        }
                    }
                }, {
                    name: 'on_order_committed',
                    label: 'On Order (Committed)',
                    options: {
                        display:false,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].on_order_committed == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].on_order_committed)
                            }

                        }
                    }
                }, {
                    name: 'in_transit',
                    label: 'In Transit Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].in_transit == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].in_transit)
                            }

                        }
                    }
                }, {
                    name: 'annual_estimated_quantity',
                    label: 'Annual Estimated Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].annual_estimated_quantity == null) {
                                return 'N/A'
                            } else {
                                return parseInt(this.state.data[tableMeta.rowIndex].annual_estimated_quantity)
                            }

                        }
                    }
                }, {
                    name: 'remaining_annual_estimated_quantity',
                    label: 'Remain Annual Estimate Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].remaining_annual_estimated_quantity == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].remaining_annual_estimated_quantity)
                            }

                        }
                    }
                }, {
                    name: 'pack_size',
                    label: 'Minimum Pack Size',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex].pack_size == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(this.state.data[tableMeta.rowIndex].pack_size)
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
                                    //defaultValue={value != null ? value : 0}
                                    style={{
                                        width: 80
                                    }}
                                    variant="outlined"
                                    size="small"
                                    value={this.state.data[tableMeta.rowIndex].order_quantity}
                                    onChange={(e) => {
                                        let data = this.state.data;
                                        data[tableMeta.rowIndex].order_quantity = e.target.value
                                        this.setState({ data })
                                    }}
                                ></TextValidator>
                            )

                        }
                    }
                }, {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {




                            return (
                                <Grid className="flex items-center">
                                    <Tooltip
                                        title={"Add to Cart"}>
                                        <IconButton
                                            disabled={this.state.data[tableMeta.rowIndex].status == "Active" ? false : true}
                                            className="px-2"
                                            onClick={() => {
                                                if (this.state.data[tableMeta.rowIndex].order_quantity > 0) {

                                                    this.addtocart(this.state.data[tableMeta.rowIndex].id, this.state.data[tableMeta.rowIndex].order_quantity)
                                                } else {
                                                    this.setState(
                                                        { alert: true, message: "Please Add Order Quantity", severity: 'error' }
                                                    )
                                                }

                                            }}
                                            size="small"
                                            aria-label="view">
                                            <ShoppingCartIcon style={{ color: this.state.data[tableMeta.rowIndex].status == "Active" ? "green" : "gray" }} />
                                        </IconButton>
                                    </Tooltip>


                                    <Tooltip title="View">
                                        <IconButton
                                            className="px-2"
                                            onClick={() => {
                                                //this.state.addSuggestedWareHouseCart.order_item_details = []
                                                this.setState({
                                                    batchTotal: [],
                                                    myStockData: [],
                                                    rows2: [],
                                                    itemTotalQty: 0,
                                                    selectedItem: tableMeta.rowIndex,
                                                    //orderQty: this.state.cartStatus[tableMeta.rowIndex].order_quantity,
                                                    consumpEstimate: tableMeta.rowData[8]
                                                })
                                                this.state.addtocart = this.state.data[tableMeta.rowIndex].id
                                                this.state.medDetails.itemName = tableMeta.rowData[1]
                                                this.state.medDetails.drugStore = tableMeta.rowData[3]
                                                // this.state.consumpEstimate = tableMeta.rowData[8]
                                                this.getBatchData()
                                                this.setState({ individualView: true })


                                            }}
                                            size="small"
                                            aria-label="view">
                                            <VisibilityIcon
                                                style={{ color: yellow[600] }} />
                                        </IconButton>
                                    </Tooltip>

                                    {/* add stock movement icon  */}
                                    <Tooltip title="Stock Movement">
                                        <IconButton
                                              onClick={() => {
                                                window.location = `/drugbalancing/checkStock/detailedview/${this.state.data[tableMeta.rowIndex].item_id}`
                                                    
                                                    // /${this.state.data[tableMeta.rowIndex].item_batch_id}
                                                    // ?from=${this.state.filterData.from}
                                                    // &to=${this.state.filterData.to}
                                                    // &batch_id=${this.state.data[tableMeta.rowIndex].batch_id}
                                            }}
                                            className="px-2"
                                            size="small"
                                            aria-label="View Item Stocks"
                                        >
                                            <FeedIcon />
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
                // 'order[0]': [
                //     'updatedAt', 'DESC'
                // ],
                order : ['sr_no']
            },
            rows: [],
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
                created_by: null,
                limit: 10,
                page: 0,
                warehouse_id: this.props.warehouse_id,
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
            let item_ids = res.data.view.data.map(x => x.item_id)
            //console.log("loadPrescriptionDrugAssign", item_ids)
            this.loadPrescriptionDrugAssign(item_ids)
            this.setState({
                data: res.data.view.data,
                // loaded: true,
                totalItems: res.data.view.totalItems,
            }, () => {
                this.render()
                this.getCartItems()
            })
        }
    }
    async loadPrescriptionDrugAssign(itemIds) {
        let params = {
            owner_id: this.state.owner_id,
            from: moment().subtract(180, 'days').format('YYYY-MM-DD'),
            to: moment().format('YYYY-MM-DD'),
            drug_id: itemIds,
            search_type: 'Sum'
        }
        let res = await PharmacyOrderService.prescriptionDrugAssign(params)
        //let order_id = 0
        console.log("loadPrescriptionDrugAssign", res.data.view)
        if (res.status) {

            this.setState({
                prescriptionDrugAssign: res.data.view,
                loaded: true,
            }, () => {

            })
        }
    }


    async getCartItems() {
        let res2 = await PharmacyOrderService.getCartItemsRMSD(this.state.getCartItems)
        if (res2.status) {
            this.setState({
                cartItems: res2.data.view
            }, () => {
                console.log("cart", res2.data.view)
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
                    orderID: res?.data?.posted?.data?.data[0]?.RMSDDistribution?.id,
                    orderExistWarning: true
                })

            setTimeout(() => {
                this.loadOrderList()
            }, 2000);
        }
    }
    async removeOrder() {
        this.setState({ loaded: false })
        let res = await PharmacyOrderService.deleteRmsd_distributions(this.state.orderID)
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

    genByConsumption() {
        this.setState({ genByConsumption: true })
    }



    async addtocart(id, order_quantity) {
        let res = await PharmacyOrderService.addToCartRMSD(id, { order_quantity: order_quantity })
        if (res.status) {
            if (res.data.patched == "data updated successfully.") {
                this.setState({
                    loaded: true,
                    alert: true,
                    message: "Item Added to Cart Successfully",
                    severity: 'success'
                }, () => {
                    this.loadOrderList()

                })
            }
        } else {
            this.setState(
                { alert: true, message: "Item adding to cart failed. Please Try Again", severity: 'error' }
            )
        }

    }




    async loadWarehouses() {
        this.setState({ loaded: false })
        var user = await localStorageService.getItem('userInfo');
        var owner_id = await localStorageService.getItem('owner_id');
        console.log('warehouse_id', this.props.warehouse_id)
        var id = user.id;

        let getCartItems = this.state.getCartItems
        let genOrder = this.state.genOrder
        let formData = this.state.formData

        getCartItems.created_by = id
        genOrder.created_by = id

        genOrder.warehouse_id = this.props.warehouse_id
        getCartItems.warehouse_id = this.props.warehouse_id
        formData.warehouse_id = this.props.warehouse_id
        formData.owner_id = owner_id
        formData.created_by = id
        this.setState({ getCartItems, genOrder, formData, owner_id: owner_id, selected_warehouse: this.props.warehouse_id, warehouseSelectDone: true, loaded: true },()=>{
            this.loadData()
            this.loadOrderList()
        })


    }



    render() {


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
                                        options={["Estimation Based","Consumption Based"]}
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
                                {this.state.loaded && this.state.warehouseSelectDone ? <Badge badgeContent={this.state.cartItems.totalItems} color="primary">
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
                        </Grid>
                        <Grid item="item" lg={6} md={6}>

                        </Grid>
                        <Grid item="item" lg={12} md={12} xs={12} className="mt-10">

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
                    this.setState({ individualView: false })
                }}>
                <div className="w-full h-full px-5 py-5">
                    <Grid container="container">


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
                                            this.generateOrder()
                                            /* this.setState({
                                                message: "Error connecting to backend",
                                                severity: "Error",
                                                alert: true
                                            }) */
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