import {
    CircularProgress,
    Dialog,
    Divider,
    Grid,
    InputAdornment,
    Typography,
    IconButton,
    Tooltip,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
    Button,
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    MainContainer,
    PrintDataTable,
    SubTitle,
} from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import React, { Fragment } from 'react'
import { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { TextValidator } from 'react-material-ui-form-validator'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import WarehouseServices from '../../services/WarehouseServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import ApartmentIcon from '@material-ui/icons/Apartment'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import localStorageService from 'app/services/localStorageService'
import InventoryService from 'app/services/InventoryService'
import HealingIcon from '@mui/icons-material/Healing'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import VisibilityIcon from '@material-ui/icons/Visibility'
import DivisionsServices from 'app/services/DivisionsServices'
import PatientServices from 'app/services/PatientServices'
import FeedIcon from '@mui/icons-material/Feed';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ListIcon from '@material-ui/icons/List';
import CloseIcon from '@material-ui/icons/Close';
import DashboardReportServices from 'app/services/DashboardReportServices'
import { dateParse, roundDecimal } from 'utils'
import { ValidatorForm } from 'react-form-validator-core';


class ItemStock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateData: {
                noOfDays: 0,
            },
            user_role: null,
            selectWarehouseView: false,
            selectWarehouseViewName: null,
            loadingSuggestedWarehoues: false,
            suggestedWareHouses: {
                item_id: null,
                warehouse_id: null,
                // limit: 20,
                // page: 0
            },


            alert: false,
            message: '',
            severity: 'success',
            pload: false,
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
                limit: 25,
                //warehouse_id: this.props.warehouse_id,
                //owner_id: '000',
                zero_needed: true,
                search: null,
                orderby_drug: true,
                orderby_sr: true,
                start_sr: null,
                end_sr: null

            },

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            loaded: true,
            printLoaded: false,
            totalItems: 0,
            selectWarehouseView: false,
            warehouse_loaded: false,
            selectedWarehouse: null,
            allWarehouses: [],
            consumption: null,
            columns: [
                {
                    name: 'action',
                    label: 'Actions',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.ItemSnap?.id
                            return (
                                <Grid container={2}>
                                    {/* <Grid item>
                                        {this.state.user_role == "Counter Pharmacist" || this.state.user_role == 'Drug Store Keeper' || this.state.user_role == 'Medical Laboratory Technologist' || this.state.user_role == 'Radiographer' || this.state.user_role == 'Chief MLT' || this.state.user_role == 'Chief Radiographer' ||
                                            this.state.user_role == 'Admin Pharmacist' || this.state.user_role == 'RMSD MSA' ||
                                            this.state.user_role == 'RMSD OIC' || this.state.user_role == 'MSD MSA' || this.state.user_role == 'RMSD Pharmacist'
                                            ?
                                            <Tooltip title="Check Stock">
                                                <IconButton
                                                    onClick={() => {

                                                        let suggestedWareHouses = this.state.suggestedWareHouses
                                                        suggestedWareHouses.item_id = id
                                                        console.log('clicked_id', id)
                                                        this.setState({ suggestedWareHouses, individualView: true }, () => {
                                                            this.suggestedWareHouse()
                                                        })
                                                    }}
                                                    className="px-2"
                                                    size="small"
                                                    aria-label="View Item Stocks"
                                                >
                                                    <WarehouseIcon />
                                                </IconButton>
                                            </Tooltip>

                                            : null}
                                    </Grid> */}
                                    <Grid item>
                                        <Tooltip title="Stock Movement">
                                            <IconButton
                                                onClick={() => {
                                                    window.location = `/drugbalancing/checkStock/detailedview/${id}`

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
                                    <Grid item>

                                        <Tooltip title="Item Description">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/item-mst/view-item-mst/${id}`
                                                }}
                                                className="px-2"
                                                size="small"
                                                aria-label="View Item"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                    </Grid>
                                </Grid>
                            )
                        },
                    },
                },

                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        sort: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            if (
                                tableMeta.rowData[tableMeta.columnIndex] == null
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .sr_no
                            }
                        },
                    },

                },
                // {
                //     name: 'item_id', // field name in the row object
                //     label: 'Item Code', // column title that will be shown in table
                //     options: {
                //         filter: true,
                //         display: true,
                //         width: 10
                //     }
                // },
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        sort: true, // enable sorting
                        customSort: (data, colIndex, order) => {
                            return data.sort((a, b) => {
                                if (a.data[colIndex].sr_no < b.data[colIndex].sr_no) {
                                    return -1;
                                }
                                if (a.data[colIndex].sr_no > b.data[colIndex].sr_no) {
                                    return 1;
                                }
                                return 0;
                            });
                        },
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            if (
                                tableMeta.rowData[tableMeta.columnIndex] == null
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .medium_description
                            }
                        },
                    },
                },
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'Dosage', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            if (
                                tableMeta.rowData[tableMeta.columnIndex] == null
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .strength
                            }
                        },
                    },
                },
                {
                    name: 'stock', // field name in the row object
                    label: 'Stock Qty', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);

                            let item_id =
                                this.state.data[tableMeta.rowIndex]?.item_id
                            //  console.log('invent', this.state.inventory_data.find(x => x.item_id == item_id))
                            let qty = this.state.inventory_data.find(
                                (x) => x.item_id == item_id
                            )

                            if (qty == null || qty == undefined) {
                                return 0
                            } else {
                                return Math.floor(qty.quantity)
                            }
                        },
                    },
                },
                {
                    name: 'reorder_level', // field name in the row object
                    label: 'Re-Order Level', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: false,
                        width: 10,

                    },
                },
                /* {
                    name: 'lead_time', // field name in the row object
                    label: 'Lead Time', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10
                    }
                }, */
                {
                    name: 'consumption', // field name in the row object
                    label: 'Consumption', // column title that will be shown in table
                    // getConsumptionDet(id)
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('abcccc',this.state.data[tableMeta.rowIndex])
                            let consumption = this.state.data[tableMeta.rowIndex]?.consumption

                            if (consumption === null || consumption === undefined) {
                                return 0;
                            } else {
                                return roundDecimal(Math.abs(consumption / 30), 2)
                            }

                        },
                    },
                },
                {
                    name: '', // field name in the row object
                    label: 'Stock Days', // column title that will be shown in table
                    // getConsumptionDet(id)
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('abcccc', this.state.data[tableMeta.rowIndex]);

                            // stock qty
                            let item_id = this.state.data[tableMeta.rowIndex]?.item_id;
                            let qty = this.state.inventory_data.find((x) => x.item_id == item_id);
                            let stockQty = 0;

                            if (qty == null || qty == undefined) {
                                stockQty = 0;
                            } else {
                                stockQty = parseFloat(qty.quantity);
                            }

                            // consumption
                            let consumption = this.state.data[tableMeta.rowIndex]?.avarage_consumption;
                            let consumptionQty = 0;

                            if (consumption == null || consumption == undefined) {
                                consumptionQty = 0;
                            } else {
                                // when consumption is less than 0, it round up as 1
                                let consumptionValue = Math.abs(this.state.data[tableMeta.rowIndex].avarage_consumption / 30);

                                if (consumptionValue < 0) {
                                    consumptionQty = 1
                                } else {
                                    consumptionQty = consumptionValue
                                }
                            }

                            // stock days
                            let stockDays = roundDecimal(stockQty / consumptionQty);

                            if (stockDays === null || stockDays === undefined || stockDays === Infinity || isNaN(stockDays)) {
                                return 0;
                            } else {
                                var years = Math.floor(stockDays / 365);
                                var months = Math.floor((stockDays % 365) / 30);
                                // var weeks = Math.floor((stockDays % 365) % 30 / 7);
                                var days = (stockDays % 365) % 30 % 7;

                                if (years > 0) {
                                    return <div style={{ borderRadius: "5px", background: "#b6d7a8", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}> <p>{years} {'Y'} {months} {'M'} {days} {'D'}</p></div>
                                } else {
                                    if (months >= 6) {
                                        return <div style={{ borderRadius: "5px", background: "#b6d7a8", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}> <p>{years} {'Y'} {months} {'M'} {days} {'D'}</p></div>
                                    } else if (months >= 3) {
                                        return <div style={{ borderRadius: "5px", background: "#ffe599", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}> <p>{years} {'Y'} {months} {'M'} {days} {'D'}</p></div>
                                    } else if (months >= 2) {
                                        return <div style={{ borderRadius: "5px", background: "#ffe599", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}> <p>{years} {'Y'} {months} {'M'} {days} {'D'}</p></div>
                                    } else if (months >= 1) {
                                        return <div style={{ borderRadius: "5px", background: "#FFFF00", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}> <p>{years} {'Y'} {months} {'M'} {days} {'D'}</p></div>
                                    } else if (months < 0 && days > 0) {

                                    } else {
                                        return <div style={{ borderRadius: "5px", background: "#f78686", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}> <p>{years} {'Y'} {months} {'M'} {days} {'D'}</p></div>
                                    }
                                }

                            }
                        },
                    },
                },
                {
                    name: 'minimum_stock_level', // field name in the row object
                    label: 'Minimun Stock Level', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: false,
                        width: 10,
                    },
                },

                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
            ],
            data: [],
            printData: [],
            inventory_data: [],
            suggestedWareHouseColumn: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <IconButton onClick={() => {
                                this.setState({
                                    item_warehouse_id: this.state.rows2[dataIndex].warehouse_id,
                                    showItemBatch: true
                                })

                            }}>
                                <ListIcon />
                            </IconButton>
                        }
                    }
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: '	Drug Store',
                    label: 'Drug Store',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rows2[dataIndex].warehouse_name
                            return data
                        }
                    }
                },
                {
                    name: 'Type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rows2[dataIndex].warehouse_main_or_personal
                            return data
                        }
                    }
                },
                {
                    name: 'Stock Qty',
                    label: 'Stock Qty',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rows2[dataIndex].total_quantity
                            return data
                        }
                    }
                },



            ],

        }
    }

    async getConsumptionDet(id, maindata) {
        console.log('idxddfdffdf', maindata)

        var today = new Date()
        var current_date = new Date()
        var preDay = current_date.setMonth(current_date.getMonth() - 1);   //  befour 1 month

        console.log('dates', dateParse(today), 'and', dateParse(preDay))

        let params = {
            to: dateParse(today),
            from: dateParse(preDay),
            item_id: id,
            avarage_consumption: true,
            warehouse_id: this.state.formData.warehouse_id,
            owner_id: this.state.formData.owner_id,
            distribution_officer_id: this.state.formData.distribution_officer_id,
            page: this.state.formData.page,
            limit: this.state.formData.limit,
        }
        let res = await DashboardReportServices.getBatchConsumption(params)
        console.log('dggdgdgd', res)

        let updatedArray = []
        if (res.status) {
            updatedArray = maindata.map((obj1) => {
                const obj2 = res.data.view.find((obj) => obj.item_id === obj1.item_id);

                if (obj2) {
                    return { ...obj1, ...obj2 };
                }
                return obj1;
            });

        }

        this.setState(
            {
                data: updatedArray,
                //loaded: true,
                // totalItems: res.data.view.totalItems,
            },
            () => {
                this.render()
                // this.getCartItems()
            }
        )
    }


    async suggestedWareHouse() {
        console.log('called')
        console.log('call', this.state.suggestedWareHouses.item_id)
        this.setState({ loadingSuggestedWarehoues: false })
        let res = await PharmacyOrderService.getSuggestedWareHouse(
            this.state.suggestedWareHouses
        )
        if (res.status) {
            console.log('suggested', res.data)
            this.setState({
                rows2: res.data.view.data,
                suggestedtotalItems: res.data.view.totalItems,
                loadingSuggestedWarehoues: true
            }, () => {
                this.render()
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
        // GET SR
        let start_sr = await PharmacyOrderService.getDefaultItems(this.state.formData)
        if (start_sr.status == 200) {
            console.log('start_sr', start_sr.data.view.data)
            this.setState({ all_start_sr: start_sr.data.view.data })
        }
        let end_sr = await PharmacyOrderService.getDefaultItems(this.state.formData)
        if (end_sr.status == 200) {
            console.log('end_sr', end_sr.data.view.data)
            this.setState({ all_end_sr: end_sr.data.view.data })
        }
    }



    async printData() {
        this.setState({ printLoaded: false })
        let params = this.state.formData
        delete params.limit
        delete params.page
        let res = await PharmacyOrderService.getDefaultItems(
            this.state.formData
        )
        let order_id = 0
        if (res.status) {
            if (res.data.view.data.length != 0) {
                order_id = res.data.view.data[0].pharmacy_order_id
            }
            console.log('data', res.data.view.data)
            let item_ids = res.data.view.data.map((el) => el.item_id)
            this.loadStockData(item_ids)
            this.setState(
                {
                    printData: res.data.view.data,
                    printLoaded: true,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                    document.getElementById('print_button_001').click()
                    // this.getCartItems()
                }
            )
            console.log('Print Data', this.state.printData)
        }
    }

    async loadOrderList() {
        this.setState({ loaded: false, cartStatus: [] })
        let res = await PharmacyOrderService.getDefaultItems(this.state.formData
        )
        let order_id = 0
        if (res.status) {
            if (res.data.view.data.length != 0) {
                order_id = res.data.view.data[0].pharmacy_order_id
            }

            // const processedData = await Promise.all(res.data.view.data.map(async (item) => {
            //     // Perform asynchronous operation here using await
            //     let consumption =   await  this.getConsumptionDet(item.item_id)
            //     // Return the processed item
            //     return { ...item, cnsmptn: consumption };

            //   }));

            // Perform asynchronous operation here using await
            //   this.getConsumptionDet(res.data.view.data[0].item_id)
            // Return the processed item



            // console.log('datapass', res)
            this.setState({
                totalItems: res.data.view.totalItems,
            })
            let item_ids = res.data.view.data.map((el) => el.item_id)
            this.loadStockData(item_ids)
            this.getConsumptionDet(item_ids, res.data.view.data)

        }
    }

    async loadStockData(itemList) {

        let params = {
            warehouse_id: this.props.warehouse_id,
            items: itemList,
            zero_needed: true,
            owner_id: this.state.formData.owner_id,
            distribution_officer_id: this.state.formData.distribution_officer_id
        }
        let res = await InventoryService.getInventoryFromSR(params)
        if (res.status) {
            console.log('inventory data', res.data.posted.data)
            this.setState({
                inventory_data: res.data.posted.data,
                loaded: true,
            })
        }
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

    async loadWarehouses() {
        this.setState({
            warehouse_loaded: false,
        })
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        var id = user.id
        var all_pharmacy_dummy = []
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        if (!selected_warehouse_cache) {
            this.setState({
                selectWarehouseView: true,
            })
        } else {
            this.state.formData.warehouse_id = selected_warehouse_cache.id
            this.setState({
                selectWarehouseView: false,
                warehouse_loaded: true,
            })
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
            console.log('warehouse', all_pharmacy_dummy)
            this.setState({
                allWarehouses: all_pharmacy_dummy,
            })
        }
    }

    async componentDidMount() {
        // this.loadWarehouses();
        // this.load_days(31)
        let login_user_info = await localStorageService.getItem('userInfo')

        let selected_Warehouse = await localStorageService.getItem('Selected_Warehouse')?.warehouse?.id

        this.setState({ user_role: login_user_info.roles[0] })
        let warehouse_id = null;

        if (login_user_info.roles.includes('Drug Store Keeper') ||
            login_user_info.roles.includes('Store Keeper') ||
            login_user_info.roles.includes('RMSD Distribution Officer') ||
            login_user_info.roles.includes('Drugstore Pharmacist(S)') ||
            login_user_info.roles.includes('Blood Bank Consultant') ||
            login_user_info.roles.includes('Blood Bank MLT (NOIC)') ||
            login_user_info.roles.includes('Blood Bank MLT') ||

            login_user_info.roles.includes('Chief MLT') ||
            login_user_info.roles.includes('RMSD ADMIN') ||
            login_user_info.roles.includes('RMSD MSA') ||
            login_user_info.roles.includes('RMSD Pharmacist') ||
            login_user_info.roles.includes('RMSD OIC') ||
            login_user_info.roles.includes('MSD MSA') ||
            login_user_info.roles.includes('Pharmacist') ||
            login_user_info.roles.includes('Counter Pharmacist') ||
            login_user_info.roles.includes('Dispenser') ||
            login_user_info.roles.includes('Admin Pharmacist') ||
            login_user_info.roles.includes('Medical Laboratory Technologist') ||
            login_user_info.roles.includes('Radiographer')
        ) {
            //'Sales User', 'Super Admin', 'ADMIN', 'MSD SCO', 'MSD SCO Supply', 'MSD SCO QA', 'MSD Distribution Officer',
            warehouse_id = this.props.warehouse_id ? this.props.warehouse_id : selected_Warehouse

        } else {
            warehouse_id = null;
        }






        if (
            login_user_info.roles.includes('MSD Distribution Officer') ||
            login_user_info.roles.includes('MSD SCO') ||
            login_user_info.roles.includes('MSD SCO Supply')
        ) {
            this.setState({
                formData: {
                    ...this.state.formData,
                    owner_id: this.props?.owner_id,
                    warehouse_id: warehouse_id,
                    distribution_officer_id: login_user_info.id,
                    user_role: login_user_info.roles[0]
                }

            }, () => {
                this.loadData()
                this.loadOrderList()
            })
        } else {

            this.setState({
                formData: {
                    ...this.state.formData,
                    owner_id: this.props?.owner_id,//'000',

                    warehouse_id: warehouse_id,
                    user_role: login_user_info.roles[0]
                }

            }, () => {
                this.loadData()
                this.loadOrderList()
            })
        }

        // this.getConsumptionDet()
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <Grid container spacing={2}>
                            <Grid
                                item
                                lg={12}
                                xs={12}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    className="font-semibold"
                                >
                                    Current Stock Level
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item lg={3} xs={12} className="mt-5">
                                <h4>Filters</h4>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                        </Grid>
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadOrderList()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid
                                container="container"
                                spacing={2}
                                direction="row"
                            >
                                <Grid
                                    item="item"
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                >
                                    <Grid container="container" spacing={2}>

                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Start SR" />
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Start SR"
                                                fullWidth={true}
                                                variant="outlined"
                                                size="small"
                                                type="number"
                                                minLength={8}
                                                value={this.state.formData.start_sr}
                                                onChange={(e) => {
                                                    let formData = this.state.formData;
                                                    formData.start_sr = e.target.value;
                                                    this.setState({ formData });
                                                }}
                                                validators={this.state.formData.start_sr ? ['minStringLength:8', 'matchRegexp:^[0-9]+$'] : null}
                                                errorMessages={[
                                                    'Number must be at least 8 digits',
                                                    'Only numbers are allowed',
                                                ]}
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
                                            <SubTitle title="End SR" />
                                            <TextValidator
                                                className="w-full"
                                                placeholder="End SR"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                type='number'
                                                minLength={8}
                                                value={
                                                    this.state.formData.end_sr
                                                }
                                                onChange={(e) => {
                                                    let formData = this.state.formData;
                                                    formData.end_sr = e.target.value;
                                                    this.setState({ formData });
                                                }}
                                                validators={this.state.formData.end_sr ? ['minStringLength:8', 'matchRegexp:^[0-9]+$'] : null}
                                                errorMessages={[
                                                    'Number must be at least 8 digits',
                                                    'Only numbers are allowed',
                                                ]}
                                            />

                                        </Grid>


                                        {/* Serial/Family Number */}
                                        <Grid
                                            className="w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Item Class" />
                                            <Autocomplete
                                                multiple  // Enable multiple selections
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_item_class.sort((a, b) =>
                                                    a.description?.localeCompare(b.description)
                                                )}
                                                onChange={(e, values) => {
                                                    let selectedIds = values.map((value) => value.id);
                                                    let formData = { ...this.state.formData };

                                                    formData.class_id = selectedIds;
                                                    this.setState({ formData });
                                                }}
                                                value={this.state.all_item_class.filter((option) =>
                                                    this.state.formData?.class_id && this.state.formData?.class_id.includes(option.id)
                                                )}
                                                getOptionLabel={(option) => (option.description + ' - ' + option.code)}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Class"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>


                                        {/* <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Stock Qty >= More Than" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="StockQty >= More Than"
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
                                        </Grid> */}

                                        {/* Stock Days 1 */}
                                        {/* <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Stock Qty <= Less Than" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Stock Qty <= Less Than"
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
                                        </Grid> */}

                                        {/* Serial Family Name*/}
                                        <Grid
                                            className="w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Item Category" />
                                            <Autocomplete
                                                multiple // enable multiple selecting
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_item_category.sort((a, b) =>
                                                    a.description?.localeCompare(b.description)
                                                )}
                                                // set as multiple select
                                                onChange={(e, values) => {
                                                    let selectedIds = values.map((value) => value.id);
                                                    let formData = { ...this.state.formData };

                                                    formData.category_id = selectedIds;
                                                    this.setState({ formData });
                                                }}
                                                value={this.state.all_item_category.filter((option) =>
                                                    this.state.formData.category_id.includes(option.id)
                                                )}
                                                getOptionLabel={(option) => (option.description ? option.description : "")}
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Category"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>


                                        {/* Item Group*/}
                                        <Grid
                                            className="w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Item Group" />
                                            <Autocomplete
                                                multiple
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_item_group.sort((a, b) =>
                                                    a.code?.localeCompare(b.code)
                                                )}

                                                onChange={(e, values) => {
                                                    let selectedIds = values.map((value) => value.id);
                                                    let formData = { ...this.state.formData };

                                                    formData.group_id = selectedIds;
                                                    this.setState({ formData });
                                                }}

                                                value={this.state.all_item_group.filter((option) =>
                                                    this.state.formData.group_id.includes(option.id)
                                                )}

                                                getOptionLabel={(option) => (option.code + "-" + option.name)}

                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Item Group"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>


                                        {/* Drug Store Qty*/}
                                        {/* <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Drug Store Qty" />

                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Drug Store Qty"
                                                name="drug_store_qty"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .description
                                                }
                                                type="text"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state
                                                                .formData,
                                                            description:
                                                                e.target.value,
                                                        },
                                                    })
                                                }}
                                                // validators={['required']}
                                                errorMessages={[
                                                    'this field is required',
                                                ]}
                                            />
                                        </Grid> */}
                                        <Grid
                                            className=" w-full mt-6"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        // style={{
                                        //     display: 'flex',
                                        //     alignItems: 'flex-end',
                                        // }}

                                        >
                                            <LoonsButton
                                                color="primary"
                                                size="medium"
                                                type="submit"
                                            >
                                                Filter
                                            </LoonsButton>
                                        </Grid>

                                        <Grid
                                            className="mt-5 "
                                            item
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                            style={{ marginLeft: 'auto' }}
                                        >

                                            <TextValidator
                                                className="w-full"
                                                placeholder="Search by SR Number"
                                                //variant="outlined"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state.formData
                                                        .search
                                                }
                                                onChange={(e, value) => {
                                                    let formData =
                                                        this.state.formData
                                                    formData.search =
                                                        e.target.value
                                                    this.setState({
                                                        formData,
                                                    })
                                                    console.log(
                                                        'form data',
                                                        this.state.formData
                                                    )
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
                                                    ),
                                                }}
                                            />

                                        </Grid>

                                    </Grid>


                                </Grid>

                                <Grid item xs={12}>
                                    {/* Print Section */}
                                    <Grid container>
                                        <Grid
                                            item
                                            lg={9}
                                            md={8}
                                            sm={6}
                                            xs={6}
                                        ></Grid>
                                        <Grid
                                            className="flex justify-end"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={6}
                                        >
                                            {/*  <Button
                                                onClick={() => this.printData()}
                                                size="small"
                                                startIcon="print"
                                            >
                                                Print
                                            </Button> */}
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            {this.state.printLoaded ? (
                                                <div className="hidden">
                                                    <PrintDataTable
                                                        title="Item Stock Report"
                                                        invisibleTable={true}
                                                        data={this.state.printData}
                                                        tableStructure={[
                                                            {
                                                                name: 'ItemSnap.sr_no',
                                                            },
                                                            {
                                                                name: 'ItemSnap.medium_description',
                                                            },
                                                            {
                                                                name: 'ItemSnap.strength',
                                                            },
                                                            {
                                                                name: 'ItemSnap.strength',
                                                            },
                                                            {
                                                                name: 'reorder_level',
                                                            },
                                                            {
                                                                name: 'reorder_level',
                                                            },
                                                            {
                                                                name: 'minimum_stock_level',
                                                            },
                                                            {
                                                                name: 'status',
                                                            },
                                                        ]}
                                                        tableHeaders={[
                                                            {
                                                                name: 'sr_no',
                                                                label: 'SR Number',
                                                            },
                                                            {
                                                                name: 'short_description',
                                                                label: 'Item Name',
                                                            },
                                                            {
                                                                name: 'strength',
                                                                label: 'Dosage',
                                                            },
                                                            {
                                                                name: 'stock',
                                                                label: 'Stock Quantity',
                                                            },
                                                            {
                                                                name: 'reorder_level',
                                                                label: 'Re-Order Level',
                                                            },
                                                            {
                                                                name: 'cnsmptn',
                                                                label: 'Consumption',
                                                            },
                                                            {
                                                                name: 'minimum_stock_level',
                                                                label: 'Minimum Stock Level',
                                                            },
                                                            {
                                                                name: 'status',
                                                                label: 'Status',
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            ) : null}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item xs={12}>
                                    {/* Table Section */}
                                    <Grid
                                        container
                                        className="pb-5"
                                        spacing={2}
                                    >
                                        <Grid item sm={12} xs={12} className='mt-3'>
                                            <Grid container spacing={2}>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'>
                                                        <span style={{ display: 'inline-block', height: '15px', width: '15px', background: '#b6d7a8', marginRight: '5px' }}></span>
                                                        6 months {'<'}, </p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'> <span style={{ display: 'inline-block', height: '15px', width: '15px', background: '#fff2cc', marginRight: '5px' }}></span>
                                                        3 -6 months </p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'> <span style={{ display: 'inline-block', height: '15px', width: '15px', background: '#ffe599', marginRight: '5px' }}></span>
                                                        2 - 3 months</p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'> <span style={{ display: 'inline-block', height: '15px', width: '15px', background: '#FFFF00', marginRight: '5px' }}></span>
                                                        1 - 2 months </p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'> <span style={{ display: 'inline-block', height: '15px', width: '15px', background: '#FFA500', marginRight: '5px' }}></span>
                                                        1 months</p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'> <span style={{ display: 'inline-block', height: '15px', width: '15px', background: '#f78686', marginRight: '5px' }}></span>
                                                        Out of Stock {'>'}</p>
                                                </Grid>

                                            </Grid>


                                        </Grid>
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
                                                        filterType: 'textField',
                                                        selectableRows: "none",
                                                        sorting: true,
                                                        sortColumnIndex: 1, // set sr_no as the default sort column
                                                        sortDirection: 'asc',
                                                        pagination: true,
                                                        size: 'medium',
                                                        serverSide: true,
                                                        print: true,
                                                        viewColumns: true,
                                                        download: true,
                                                        count: this.state
                                                            .totalItems,
                                                        rowsPerPage:
                                                            this.state.formData
                                                                .limit,
                                                        page: this.state.formData
                                                            .page,
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
                                </Grid>

                            </Grid>
                        </ValidatorForm>
                    </LoonsCard>
                </MainContainer>
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.selectWarehouseView}
                >
                    <MuiDialogTitle disableTypography="disableTypography">
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm onError={() => null} className="w-full">
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                // ref={elmRef}
                                options={this.state.allWarehouses}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        localStorageService.setItem(
                                            'Selected_Warehouse',
                                            value
                                        )
                                        this.setState({
                                            selectWarehouseView: false,
                                        })

                                        this.loadWarehouses()
                                        this.setState({
                                            warehouse_loaded: true,
                                            selectedWarehouse: value,
                                        })
                                        this.loadOrderList()
                                    }
                                }}
                                value={{
                                    name: this.state.selectedWarehouse
                                        ? this.state.allWarehouses.filter(
                                            (obj) =>
                                                obj.id ==
                                                this.state.selectedWarehouse
                                        ).name
                                        : null,
                                    id: this.state.selectedWarehouse,
                                }}
                                getOptionLabel={(option) =>
                                    option.name != null
                                        ? option.name +
                                        ' - ' +
                                        option.main_or_personal
                                        : null
                                }
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        //variant="outlined"
                                        fullWidth="fullWidth"
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />
                        </ValidatorForm>
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
                                                <CardTitle title="Check Stock"></CardTitle>
                                                <IconButton aria-label="close" onClick={() => { this.setState({ individualView: false }) }}><CloseIcon /></IconButton>
                                            </div>
                                        </Grid>

                                        <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                            {this.state.loadingSuggestedWarehoues ?
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'suggested'} data={this.state.rows2}
                                                    columns={this.state.suggestedWareHouseColumn}

                                                    options={{
                                                        pagination: true,
                                                        sort: true,
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
                                                        }
                                                    }}></LoonsTable>
                                                : null}
                                        </Grid>

                                    </Grid>


                                </LoonsCard>
                            </Grid>



                        </Grid>
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

export default ItemStock
