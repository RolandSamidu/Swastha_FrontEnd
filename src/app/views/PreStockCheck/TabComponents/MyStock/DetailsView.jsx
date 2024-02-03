import {
    CircularProgress,
    Dialog,
    Divider,
    Grid,
    InputAdornment,
    Typography,
    FormControlLabel,
    Radio,
    Tooltip,
    Icon,
    IconButton,
    Box
} from '@material-ui/core'
import ReactToPrint from "react-to-print";
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import { Autocomplete } from '@material-ui/lab'
import {
    Button,
    CardTitle,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    MainContainer,
    SubTitle,
    PrintDataTable,
} from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import React, { Fragment } from 'react'
import { Component } from 'react'
import SearchIcon from '@material-ui/icons/Search'
import { TextValidator } from 'react-material-ui-form-validator'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import WarehouseServices from 'app/services/WarehouseServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import ApartmentIcon from '@material-ui/icons/Apartment'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import localStorageService from 'app/services/localStorageService'
import { convertTocommaSeparated, dateParse, dateTimeParse, getDateDifference, addDateToToday } from 'utils'
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'
import StockPositionDetailsReport from './StockPositionDetailsReport/index'
import { ValidatorForm } from 'react-form-validator-core';
import * as appConst from '../../../../../appconst'


class DetailsView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            updateData: {
                noOfDays: 0,
            },
            user_role: null,
            printProgress: false,
            //return process
            returnDialog: false,
            returnQuantity: null,
            currentAvailableqty: null,
            drugStoreData: [],
            selected_ds: null,
            remarks: [],
            remarkID: null,
            otherRemark: null,
            currentStock: null,
            itemQuantity: null,
            dateTime: dateTimeParse(new Date()),

            alert: false,
            message: '',
            severity: 'success',
            showLoading: false,
            formData: {
                item_id: null,
                description: null,
                store_quantity: null,
                lessStock: null,
                moreStock: null,
                page: 0,
                limit: 25,
                // warehouse_id: this.props.warehouse_id,
                owner_id: null,
                exp_date_order: true,
                exp_date_grater_than_zero_search: 'false',
                quantity_grater_than_zero_search: 'false',
                search: null,
                item_status: ['Active', 'Pending', 'DC', 'Discontinued'],
                orderby_drug: true,
                orderby_sr: true,
                quantity_grater_than_zero: true,
                exp_from_date: null,
                exd_to_date: null,
                class_id: [],
                category_id: [],
                group_id: [],
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

            columns: [
                {
                    name: 'ItemSnap', // field name in the row object
                    label: 'SR Number', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        sort: true, // enable sorting
                        customSort: (a, b) => {
                            return a.sr_no - b.sr_no; // sort by ascending sr_no values
                        },
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnapBatch?.ItemSnap?.sr_no
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
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

                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnapBatch?.ItemSnap?.medium_description
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                {
                    name: 'batch_no', // field name in the row object
                    label: 'Batch No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex]
                                    .ItemSnapBatch?.batch_no
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return cellData
                            }
                        },
                    },
                },
                {
                    name: 'EXD', // field name in the row object
                    label: 'EXD', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData = dateParse(this.state.data[tableMeta.rowIndex].ItemSnapBatch?.exd)
                            let today = dateParse(new Date())

                            let different = getDateDifference(cellData, today)
                            // let different = getDateDifference('2023-06-23','2023-07-23')

                            console.log('different', different, 'nnnn', cellData)

                            // console.log('date', Y, M, D, different, cellData )


                            if (different[0] === '+') {
                                if (different[1] > 0) {
                                    // more than 1 year
                                    return <div style={{ background: "green", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(cellData)}</p></div>
                                } else {
                                    if (different[2] >= 6) {
                                        // month is 6 - 12
                                        return <div style={{ background: "gray", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(cellData)}</p></div>
                                    } else if (different[2] >= 3) {
                                        // month is 3 - 6
                                        return <div style={{ background: "blue", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(cellData)}</p></div>
                                    } else if (different[2] >= 1) {
                                        // month is 1 - 3
                                        return <div style={{ background: "orange", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p>{dateParse(cellData)}</p></div>
                                    } else {
                                        // less than 1 month
                                        //return <div style={{ background: "red", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(cellData)}</p></div>
                                        return <div style={{ background: "#eb6434", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(cellData)}</p></div>

                                    }

                                }
                            } else {
                                // expaire
                                return <div style={{ background: "red", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(cellData)}</p></div>
                            }
                        },
                    },
                },
                {
                    name: 'quantity', // field name in the row object
                    label: 'Quantity', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let cellData =
                                this.state.data[tableMeta.rowIndex].quantity
                            if (cellData == null) {
                                return 'N/A'
                            } else {
                                return convertTocommaSeparated(Math.floor(cellData))
                            }
                        },
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {

                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('status', this.state.data[tableMeta.rowIndex].ItemSnapBatch.status)

                            let cellData = dateParse(this.state.data[tableMeta.rowIndex].ItemSnapBatch?.exd)
                            let today = dateParse(new Date())

                            let different = getDateDifference(cellData, today)

                            if (different[0] === '+') {
                                return (this.state.data[tableMeta.rowIndex].ItemSnapBatch.status)

                            } else {
                                // expaire
                                return ("Expired")
                            }





                        }
                    },
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return (

                                //  (parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity)) < (parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity)) ?
                                //     (
                                <>
                                    <Tooltip title="Return">
                                        <IconButton
                                            className="text-black mr-1"
                                            // disabled={this.state.data[tableMeta.rowIndex].status === 'RECIEVED' ? true : false}
                                            onClick={() => {
                                                this.LoadCurrentStockLevel(this.state.data[tableMeta.rowIndex].ItemSnapBatchBin?.ItemSnapBatch?.id)
                                                this.loadDrugStoreData()
                                                console.log("return", this.state.data[tableMeta.rowIndex])
                                                this.setState({
                                                    returnDialog: true,
                                                    itemQuantity: this.state.data[tableMeta.rowIndex].quantity,
                                                    // totalReceivedItems: this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity,
                                                    // ReceivedItemID: this.state.data[tableMeta.rowIndex].order_item_id,
                                                    selected_order_item: this.state.data[tableMeta.rowIndex],
                                                    // AddReceivedItems: parseInt(this.state.data[tableMeta.rowIndex]?.allocated_quantity)
                                                })

                                            }}
                                        >
                                            <KeyboardReturnIcon >Return</KeyboardReturnIcon>

                                        </IconButton>
                                    </Tooltip>

                                </>
                            )
                        },
                    },
                },

            ],
            data: [],
            printData: [],
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

        //commented by roshan
        // GET SR
        /* let start_sr = await PharmacyOrderService.getDefaultItems(this.state.formData)
        if (start_sr.status == 200) {
            console.log('start_sr', start_sr.data.view.data)
            this.setState({ all_start_sr: start_sr.data.view.data })
        }
        let end_sr = await PharmacyOrderService.getDefaultItems(this.state.formData)
        if (end_sr.status == 200) {
            console.log('end_sr', end_sr.data.view.data)
            this.setState({ all_end_sr: end_sr.data.view.data })
        } */
    }

    // print 
    async printHandl() {
        this.setState({
            printLoaded: false,
            printProgress: true,
        })

        let params = {
            item_id: this.state.formData.item_id,
            description: this.state.formData.description,
            store_quantity: this.state.formData.store_quantity,
            lessStock: this.state.formData.lessStock,
            moreStock: this.state.formData.moreStock,
            warehouse_id: this.state.formData.warehouse_id,
            owner_id: this.state.formData.owner_id,
            exp_date_order: this.state.formData.exp_date_order,
            exp_date_grater_than_zero_search: this.state.formData.exp_date_grater_than_zero_search,
            quantity_grater_than_zero_search: this.state.formData.quantity_grater_than_zero_search,
            search: this.state.formData.search,
            item_status: this.state.formData.item_status,
            orderby_drug: this.state.formData.orderby_drug,
            orderby_sr: this.state.formData.orderby_sr,
            quantity_grater_than_zero: this.state.formData.quantity_grater_than_zero,
            exp_from_date: this.state.formData.exp_from_date,
            exd_to_date: this.state.formData.exd_to_date,
            class_id: this.state.formData.class_id,
            category_id: this.state.formData.category_id,
            group_id: this.state.formData.group_id,
            start_sr: this.state.formData.start_sr,
            end_sr: this.state.formData.end_sr,
            limit: 1000,
            page: 0
        }
        let formData1 = {
            ...this.state.formData,
            item_status: ['Active', 'Pending', 'DC', 'Discontinued', 'Under Serveilance', 'Withhold', 'Withdraw']
        };
        formData1.limit = 1000;
        let res = await WarehouseServices.getSingleItemWarehouse(formData1)
        if (res.status) {
            console.log('pdata', res.data.view.data)

            let data = res.data.view.data

            data.sort((a, b) => {
                // First, sort by sr_no
                if (a.ItemSnapBatch.ItemSnap.sr_no < b.ItemSnapBatch.ItemSnap.sr_no) return -1;
                if (a.ItemSnapBatch.ItemSnap.sr_no > b.ItemSnapBatch.ItemSnap.sr_no) return 1;

                // If sr_no is the same, sort by exd
                if (new Date(a.ItemSnapBatch.exd) < new Date(b.ItemSnapBatch.exd)) return -1;
                if (new Date(a.ItemSnapBatch.exd) > new Date(b.ItemSnapBatch.exd)) return 1;

                // If exd is the same, sort by batch_no
                if (a.ItemSnapBatch.batch_no < b.ItemSnapBatch.batch_no) return -1;
                if (a.ItemSnapBatch.batch_no > b.ItemSnapBatch.batch_no) return 1;

                return 0; // Objects are equal
            });






            this.setState(
                {
                    pload: true,
                    printReportData: data,
                    printLoaded: true,
                    printProgress: false,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                    document.getElementById('print_presc_0041').click()
                    // this.getCartItems()
                }
            )
            console.log('PrintData', this.state.printReportData)
        }

        this.setState({ showLoading: true, pload: true });

        setTimeout(() => {
            this.setState({ showLoading: false });
        }, 5000);

    }

    // async printData() {
    //     this.setState({ printLoaded: false })
    //     let params = this.state.formData
    //     delete params.limit
    //     delete params.page
    //     let res = await WarehouseServices.getSingleItemWarehouse(
    //         this.state.formData
    //     )
    //     if (res.status) {
    //         console.log('pdata', res.data.view.data)
    //         this.setState(
    //             {
    //                 printData: res.data.view.data,
    //                 printLoaded: true,
    //                 totalItems: res.data.view.totalItems,
    //             },
    //             () => {
    //                 this.render()
    //                 document.getElementById('print_button_001').click() 
    //                 // this.getCartItems()
    //             }
    //         )
    //         console.log('Print Data', this.state.printData)
    //     }

    //     this.setState({ showLoading: true });

    //     setTimeout(() => {
    //      this.setState({ showLoading: false });
    //     }, 5000);
    // }

    async loadOrderList() {
        this.setState({ loaded: false, cartStatus: [] })
        let res = await WarehouseServices.getSingleItemWarehouse(
            this.state.formData
        )
        if (res.status) {
            console.log('data', res.data.view.data)
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

    async loadFilterData() {
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

        //commented by roshan
        // GET SR
        /*  let start_sr = await WarehouseServices.getSingleItemWarehouse({})
         if (start_sr.status == 200) {
             console.log('start_sr', start_sr.data.view.data)
             this.setState({ all_start_sr: start_sr.data.view.data,all_end_sr:start_sr.data.view.data })
         } */
        /* let end_sr = await WarehouseServices.getSingleItemWarehouse(this.state.formData)
        if (end_sr.status == 200) {
            console.log('end_sr', end_sr.data.view.data)
            this.setState({ all_end_sr: end_sr.data.view.data })
        } */
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

    async getUser() {
        var user = await localStorageService.getItem('userInfo')
        console.log('usloginUserer', user.name)
        this.setState({ loginUser: user.name })
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
        //this.loadData()
        /*  let login_user_info = await localStorageService.getItem('userInfo')
 
         if (
             login_user_info.roles.includes('MSD SCO') || login_user_info.roles.includes('MSD SCO Distribution') ||
             login_user_info.roles.includes('MSD SCO QA') || login_user_info.roles.includes('MSD SCO Supply') ||
             login_user_info.roles.includes('Distribution Officer') || login_user_info.roles.includes('MSD Distribution Officer')) {
             this.setState({
                 formData: {
                     ...this.state.formData,
                     owner_id: '000',
                     distribution_officer_id: login_user_info.id
                 }
 
             }, () => {
                 this.loadData()
                 this.loadOrderList()
             })
         } else {
             this.setState({
                 formData: {
                     ...this.state.formData,
                     owner_id: this.props?.owner_id,
                     //distribution_officer_id: login_user_info.id
                 }
 
             }, () => {
 
                 this.loadOrderList()
                 this.getUser()
             })
         } */

        let login_user_info = await localStorageService.getItem('userInfo')
        let selected_Warehouse = await localStorageService.getItem('Selected_Warehouse')


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

            warehouse_id = this.props.warehouse_id ? this.props.warehouse_id : selected_Warehouse.id

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
        } else if (
            login_user_info.roles.includes('Verification Officer')
        ) {
            this.setState({
                formData: {
                    ...this.state.formData,
                    owner_id: this.props?.owner_id,
                    warehouse_id: selected_Warehouse.id,
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
                    distribution_officer_id: null,
                    warehouse_id: warehouse_id,
                    user_role: login_user_info.roles[0]
                }

            }, () => {
                this.loadData()
                this.loadOrderList()
            })
        }


        this.loadFilterData()
        // this.printData()

    }
    async loadDrugStoreData() {
        //Fetch department data
        // let res = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')

        if (userInfo.roles.includes('RMSD MSA') || userInfo.roles.includes('RMSD Distribution Officer')) {
            owner_id = null
        }

        let res = await WarehouseServices.getAllWarehousewithOwner({ store_type: 'drug_store' }, owner_id)
        console.log("warehouses", res)
        if (200 == res.status) {
            this.setState({
                drugStoreData: res.data.view.data,
            })
            console.log("this.state.drugStoreData", this.state.drugStoreData);
        }
        let res2 = await PharmacyOrderService.getRemarks()
        if (res2.status == 200) {
            let remarks = [...res2.data.view.data, { remark: 'Other' }]
            this.setState({
                remarks: remarks,
                // loaded: true
            })
            return;
        }
    }
    async returnRequest() {
        // let  child_id = this.props.id
        // let  parent_id=this.state.formData.parent_id
        let orderItem = this.state.selected_order_item
        var user = await localStorageService.getItem('userInfo')
        var selectedWarehouse = await localStorageService.getItem('Selected_Warehouse')
        let return_item = []
        let return_items = {}
        return_items.item_batch_id = orderItem.ItemSnapBatch.id
        return_items.request_quantity = this.state.returnQuantity
        return_item.push(return_items)

        const returnRequest =
        {
            "item_id": orderItem.ItemSnapBatch?.item_id,
            "total_request_quantity": this.state.returnQuantity,
            "remark_id": this.state.remarkID,
            "other_remark": this.state.otherRemark,
            "from": selectedWarehouse.id,
            "to": this.state.selected_ds,
            "type": "Pharmacy Return",
            "created_by": user.id,
            "return_items": return_item
        }
        console.log("return", orderItem)
        console.log('return', returnRequest)

        let res = await WarehouseServices.returnRequest(returnRequest);
        if (res.status === 201) {
            this.setState({
                alert: true,
                message: 'Return Request sent successfully!',
                severity: 'success',
                returnDialog: false,
                returnQuantity: null,
                otherRemark: null
            }
            )
        } else {
            this.setState({
                alert: true,
                message: 'Return Request was unsuccessful!',
                severity: 'error',
            })
        }

    }
    async LoadCurrentStockLevel(id) {
        let data = {
            warehouse_id: await localStorageService.getItem("Selected_Warehouse").id,
            item_batch_id: id,
            // to:this.props.toStore.id
        }
        // console.log("this.props.match.params.id",this.props.match.params.id);
        let res = await WarehouseServices.getSingleItemWarehouse(data)
        if (res.status) {
            console.log("stock Data", res.data.view.data[0])
            this.setState({
                currentStock: res.data.view.data[0].quantity,
                // returnDialog: true,
            })
        }

    }


    shortExpiary(e) {
        console.log('check selected value', e)
        let formData = this.state.formData
        // today date
        let today = new Date()

        if (e === 'LESS THAN 2 WEEK') {
            /*  let twoWeeksAgo = new Date(today.getTime() - (14 * 24 * 60 * 60 * 1000));
             formData.exp_from_date = dateParse(twoWeeksAgo)
             formData.exd_to_date = dateParse(today) */
            formData.exp_from_date = dateParse(today)
            formData.exd_to_date = dateParse(addDateToToday(14))



            this.setState({ formData })

        } else if (e === 'LESS THAN 1 MONTH') {
            /* let oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
            formData.exp_from_date = dateParse(oneMonthAgo)
            formData.exd_to_date = dateParse(today) */
            formData.exp_from_date = dateParse(today)
            formData.exd_to_date = dateParse(addDateToToday(30))
            this.setState({ formData })

        } else if (e === 'LESS THAN 2 MONTH') {
            /*  let twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
             formData.exp_from_date = dateParse(twoMonthsAgo)
             formData.exd_to_date = dateParse(today) */
            formData.exp_from_date = dateParse(today)
            formData.exd_to_date = dateParse(addDateToToday(60))
            this.setState({ formData })

        } else if (e === 'LESS THAN 3 MONTH') {
            /* let threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
            formData.exp_from_date = dateParse(threeMonthsAgo)
            formData.exd_to_date = dateParse(today) */
            formData.exp_from_date = dateParse(today)
            formData.exd_to_date = dateParse(addDateToToday(90))
            this.setState({ formData })

        } else if (e === 'LESS THAN 6 MONTH') {
            /*  let sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
             formData.exp_from_date = dateParse(sixMonthsAgo)
             formData.exd_to_date = dateParse(today) */

            formData.exp_from_date = dateParse(today)
            formData.exd_to_date = dateParse(addDateToToday(180))
            this.setState({ formData })
        } else if (e === 'LESS THAN 1 YEAR') {
            formData.exp_from_date = dateParse(today)
            formData.exd_to_date = dateParse(addDateToToday(365))
            this.setState({ formData })
        }
    }


    render() {

        const pageStyle = `
 
        @page {
           
           margin-left:5mm;
           margin-right:5mm;
           margin-bottom:5mm;
           margin-top:8mm;
         }
       
       //   @table, th, td {
       //     width: 100%;
       //     border: 1px solid;
       //     border-collapse: collapse;
       //   }
        
       
         @media print {
           .page-break {
               margin-top: 1rem;
               display: block;
               page-break-after: always;
             }
           .header, .header-space,
                  {
                   height: 2000px;
                 }
       .footer, .footer-space {
                   height: 100px;
                 }
       
                 .footerImage{
                   height: 50px;
                   bottom: 0;
                 }
                 .footer {
                   position: fixed;
                   bottom: 0;
                 }
       
               //   table, th, td {
               //     width: 100%;
               //     border: 1px solid;
               //     border-collapse: collapse;
               //   }
          
         }
       `;

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
                                    Batch Wise Stock Level
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
                                                // value={this.state.all_item_class.filter((option) =>
                                                //     this.state.formData.class_id.includes(option.id)
                                                // )}
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
                                                    this.state.formData?.category_id && this.state.formData?.category_id.includes(option.id)
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
                                                    this.state.formData?.group_id && this.state.formData?.group_id.includes(option.id)
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
                                        {/* Ven */}

                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Stock Qty >= More Than" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Stock Qty >= More Than"
                                                name="stockMore"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .moreStock
                                                }
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                min={0}
                                                onChange={(e) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state
                                                                .moreStock,
                                                            moreStock:
                                                                e.target.value,
                                                        },
                                                    })
                                                }}
                                            />
                                        </Grid>

                                        {/* Stock Days 1 */}
                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Stock Qty <= Less Than" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Stock Qty <= Less Than"
                                                name="lessStock"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.formData
                                                        .lessStock
                                                }
                                                type="number"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    this.setState({
                                                        formData: {
                                                            ...this.state
                                                                .formData,
                                                            lessStock:
                                                                e.target.value,
                                                        },
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={1}
                                            md={3}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Not Expired" />
                                            <FormControlLabel
                                                //label={"Yes"}
                                                name="probable"
                                                //value={"true"}
                                                onClick={() => {
                                                    let formData =
                                                        this.state.formData
                                                    if (
                                                        formData.exp_date_grater_than_zero_search ==
                                                        'true'
                                                    ) {
                                                        formData.exp_date_grater_than_zero_search =
                                                            'false'
                                                        this.setState({
                                                            formData,
                                                        })
                                                    } else {
                                                        formData.exp_date_grater_than_zero_search =
                                                            'true'
                                                        this.setState({
                                                            formData,
                                                        })
                                                    }
                                                }}
                                                control={
                                                    <Radio
                                                        color="primary"
                                                        checked={
                                                            this.state.formData
                                                                .exp_date_grater_than_zero_search ===
                                                                'true'
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                }
                                                display="inline"
                                            //checked={this.state.formData.exp_date_grater_than_zero_search=="true"?true:false}
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={2}
                                            md={3}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Available in Stock" />
                                            <FormControlLabel
                                                //label={"Yes"}
                                                name="probable"
                                                value={true}
                                                onClick={() => {
                                                    let formData =
                                                        this.state.formData
                                                    if (
                                                        formData.quantity_grater_than_zero_search ==
                                                        'true'
                                                    ) {
                                                        formData.quantity_grater_than_zero_search =
                                                            'false'
                                                    } else {
                                                        formData.quantity_grater_than_zero_search =
                                                            'true'
                                                    }

                                                    this.setState({ formData })
                                                }}
                                                control={
                                                    <Radio
                                                        color="primary"
                                                        checked={
                                                            this.state.formData
                                                                .quantity_grater_than_zero_search ==
                                                                'true'
                                                                ? true
                                                                : false
                                                        }
                                                    />
                                                }
                                                display="inline"
                                            //checked={this.state.formData.quantity_grater_than_zero_search}
                                            />
                                        </Grid>
                                        {/* date picker from */}
                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="From" />
                                            <LoonsDatePicker
                                                className="w-full"
                                                value={this.state.formData.exp_from_date}
                                                placeholder="From"
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                // required={!this.state.date_selection}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData
                                                    formData.exp_from_date = dateParse(date)
                                                    this.setState({ formData })
                                                }}
                                            />
                                        </Grid>

                                        {/* date picker to */}
                                        <Grid
                                            className=" w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="To" />
                                            <LoonsDatePicker
                                                className="w-full"
                                                value={this.state.formData.exd_to_date}
                                                placeholder="To"
                                                // minDate={new Date()}

                                                //maxDate={new Date()}
                                                // required={!this.state.date_selection}
                                                // disabled={this.state.date_selection}
                                                errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let formData = this.state.formData
                                                    formData.exd_to_date = dateParse(date)
                                                    this.setState({ formData })
                                                }}
                                            />
                                        </Grid>


                                        {/* short expiary*/}
                                        <Grid
                                            className="w-full"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Short Expiary" />
                                            <Autocomplete
                                                // multiple
                                                disableClearable
                                                className="w-full"
                                                options={appConst.short_Expiary}

                                                onChange={(e, values) => {
                                                    this.shortExpiary(values.value)
                                                }}

                                                // value={this.state.all_item_group.filter((option) =>
                                                //     this.state.formData?.group_id && this.state.formData?.group_id.includes(option.id)
                                                // )}

                                                getOptionLabel={(option) => (option.label)}

                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Short Expiary"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid
                                            className=" w-full mt-7"
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}

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
                                            item="item"
                                            lg={3}
                                            md={3}
                                            sm={12}
                                            xs={12}
                                            className="w-full items-center mt-5"
                                            style={{ marginLeft: 'auto' }}
                                        >
                                            {/* <div className="flex items-center"> */}
                                            <TextValidator
                                                className="w-full"
                                                placeholder="Search"
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
                                            {/* </div> */}
                                        </Grid>
                                    </Grid>
                                </Grid>

                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    {/* Print Section */}
                                    <Grid container className="mt-4 pb-2">
                                        <Grid
                                            item
                                            xs={12}
                                            style={{ textAlign: 'right' }}
                                        >
                                            {/* <Grid item xs={12} style={{textAlign:'right'}}> */}
                                            {/* print Button */}
                                            <Button
                                                progress={this.state.printProgress}
                                                onClick={() => {
                                                    this.printHandl()
                                                }}
                                                startIcon="print"
                                            >Print</Button>
                                            {/* </Grid> */}
                                        </Grid>
                                        {/* <Grid
                                            className="flex justify-end"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={6}
                                        >
                                            <Button
                                                onClick={() => this.printData()}
                                                size="small"
                                                startIcon="print"
                                                progress={this.state.printLoaded}
                                            >
                                                Print
                                            </Button>

                                            {this.state.showLoading && (
                                                <Box sx={{
                                                    display: 'flex',
                                                    position: 'fixed',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    zIndex: '9999'
                                                }}>
                                                    <CircularProgress style={{color:"#AED6F1"}} size={100}/>
                                                </Box>
                                                )}
                                            
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            {this.state.printLoaded ? (
                                                <div className="hidden">
                                                    <PrintDataTable
                                                        loginUser = {this.state.loginUser}
                                                        dateTime={this.state.dateTime}
                                                        title="Current Stock Report"
                                                        invisibleTable={true}
                                                        data={this.state.printData}
                                                        tableHeaders={[
                                                            {
                                                                name: 'sr_no',
                                                                label: 'SR Number',
                                                            },
                                                            {
                                                                name: 'medium_description',
                                                                label: 'Item Name',
                                                            },
                                                            {
                                                                name: 'batch_no',
                                                                label: 'Batch No.',
                                                            },
                                                            {
                                                                name: 'exd',
                                                                label: 'EXD',
                                                            },
                                                            {
                                                                name: 'quantity',
                                                                label: 'Quantity',
                                                            },
                                                        ]}
                                                        tableStructure={[
                                                            {
                                                                name: 'ItemSnapBatch.ItemSnap.sr_no',
                                                            },
                                                            {
                                                                name: 'ItemSnapBatch.ItemSnap.long_description',
                                                            },
                                                            {
                                                                name: 'ItemSnapBatch.batch_no',
                                                            },
                                                            {
                                                                name: 'ItemSnapBatch.exd',
                                                            },
                                                            {
                                                                name: 'quantity',
                                                            },
                                                        ]}
                                                    />
                                                </div>
                                            ) : null}
                                        </Grid> */}
                                    </Grid>
                                </Grid>

                                <Grid item="item" xs={12} sm={12} md={12} lg={12}>
                                    {/* Table Section */}
                                    <Grid
                                        container="container"
                                        className="mt-3 pb-5"
                                    >
                                        <Grid
                                            item="item"
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid container item sm={12} xs={12}>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'green', marginRight: '5px' }}></span>
                                                        More than 1 year </p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'gray', marginRight: '5px' }}></span>
                                                        More than 6 months </p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'blue', marginRight: '5px' }}></span>
                                                        More than 3 months</p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'orange', marginRight: '5px' }}></span>
                                                        More than 1 months</p>
                                                </Grid>
                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: '#eb6434', marginRight: '5px' }}></span>
                                                        Less than 1 months</p>
                                                </Grid>

                                                <Grid item xs={6} sm={4} md={3} lg={2}>
                                                    <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'red', marginRight: '5px' }}></span>
                                                        Expired</p>
                                                </Grid>



                                            </Grid>
                                            {this.state.loaded ? (
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allAptitute'}
                                                    data={this.state.data}
                                                    columns={this.state.columns}
                                                    options={{
                                                        filterType: 'textField',
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
                                        {/* add colour box */}


                                    </Grid>
                                </Grid>
                                {this.state.pload ?
                                    <Grid>
                                        <StockPositionDetailsReport printReportData={this.state.printReportData} loginUser={this.state.loginUser} />
                                    </Grid>
                                    : null}

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
                    fullWidth
                    maxWidth="sm"
                    open={this.state.returnDialog}
                    onClose={() => {
                        this.setState({
                            returnDialog: false,
                            returnQuantity: null,
                            otherRemark: null
                        })
                    }}>
                    <div className="w-full h-full px-5 py-5">

                        <Grid container className=''>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <ValidatorForm
                                    className=""
                                    onSubmit={() => this.returnRequest()}
                                    onError={() => null}>
                                    <Grid item lg={12} md={12} sm={12} xs={12}>
                                        <h4 className='mt-5'>Return Item</h4>
                                    </Grid>
                                    {/* <Grid container={2}>
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <h7 className='mt-2'>Total Received Quantity : {parseInt(this.state.totalReceivedItems)}</h7>
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <h7 className='mt-2'>Current Stock : {parseInt(this.state.currentStock)}</h7>
                                            </Grid>
                                            </Grid> */}
                                    <Grid item lg={12} md={12} sm={12} xs={12} className="mb-2 mt-5">
                                        <h5 className=''>Return to : </h5>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.drugStoreData}

                                            getOptionLabel={(option) =>
                                                option.name ?
                                                    (option.name)
                                                    : ('')
                                            }
                                            getOptionSelected={(option, value) =>
                                                console.log("ok")
                                            }
                                            onChange={(event, value) => {
                                                // console.log("selected_bin", this.state.selected_bin)
                                                // let filterData = this.state.filterData
                                                if (value != null) {
                                                    this.setState({
                                                        selected_ds: value.id
                                                    })
                                                    // this.state.selected_ds = value.id
                                                } else {
                                                    this.setState({
                                                        selected_ds: null
                                                    })
                                                }
                                                // this.setState({ filterData })

                                            }}
                                            validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'This field is required',
                                            ]}
                                            // value={this.state.warehouse || this.state.warehouse.WarehousesBins.find((v) =>
                                            //     v.id == this.state.selected_bin
                                            // )}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Select Drugstore"
                                                    //variant="outlined"
                                                    value={this.state.selected_ds}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'This field is required',
                                                    ]}

                                                />
                                            )}
                                        />

                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12}
                                        // style={{ visibility: `${this.state.filterData.visible}` }}
                                        className="mt-5">

                                        <h5 className=''>Return Quantity : </h5>
                                        <TextValidator
                                            className='mt-2'
                                            fullWidth
                                            placeholder="Return Quantity"
                                            name="return_quantity"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}

                                            value={this.state.returnQuantity}
                                            // style={{
                                            //     width: "75%",
                                            //     visibility: this.state.remarks[tableMeta.rowIndex].value
                                            // }}
                                            type="number"
                                            // multiline
                                            // rows={3}
                                            InputProps={{
                                                inputProps: { min: 0 },

                                            }}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {

                                                this.setState({
                                                    returnQuantity: e.target.value,
                                                })
                                            }}
                                            validators={[
                                                'required',
                                                'minNumber: 01',
                                                'maxNumber:' + this.state.itemQuantity
                                                // || 'maxNumber:'+ this.state.currentStock ,

                                            ]}
                                            errorMessages={[
                                                'This field is required',
                                                'Quantity Should Greater-than: 01 ',
                                                `Quantity Should Less-than: ${parseInt(this.state.itemQuantity)} `,
                                                // `Quantity Should Less-than: ${parseInt(this.state.currentStock)} `

                                            ]}
                                        />
                                    </Grid>
                                    <Grid item lg={12} md={12} sm={12} xs={12} className="mb-2 mt-5">
                                        <h5 className=''>Remark : </h5>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.remarks}

                                            getOptionLabel={(option) =>
                                                option.type ?
                                                    (option.type)
                                                    : ('')
                                            }
                                            getOptionSelected={(option, value) =>
                                                console.log("ok")
                                            }
                                            onChange={(event, value) => {
                                                // console.log("selected_bin", this.state.selected_bin)
                                                // let filterData = this.state.filterData
                                                if (value != null) {
                                                    this.setState({
                                                        remarkID: value.id
                                                    })
                                                    // this.state.selected_ds = value.id
                                                } else {
                                                    this.setState({
                                                        remarkID: null
                                                    })
                                                }
                                                // this.setState({ filterData })

                                            }}
                                            validators={[
                                                'required',
                                            ]}
                                            errorMessages={[
                                                'This field is required',
                                            ]}
                                            // value={this.state.warehouse && this.state.warehouse.WarehousesBins.find((v) =>
                                            //     v.id == this.state.selected_bin
                                            // )}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Select Remark"
                                                    //variant="outlined"
                                                    value={this.state.remarkID}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                    validators={[
                                                        'required',
                                                    ]}
                                                    errorMessages={[
                                                        'This field is required',
                                                    ]}
                                                />
                                            )}
                                        />

                                    </Grid>

                                    <Grid item lg={12} md={12} sm={12} xs={12}
                                        // style={{ visibility: `${this.state.filterData.visible}` }}
                                        className="mt-5">

                                        <h5 className=''>Other Remark : </h5>
                                        <TextValidator
                                            className='mt-2'
                                            fullWidth
                                            placeholder="Other Remark"
                                            name="return_quantity"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}

                                            value={this.state.otherRemark}
                                            // style={{
                                            //     width: "75%",
                                            //     visibility: this.state.remarks[tableMeta.rowIndex].value
                                            // }}
                                            type="text"
                                            // multiline
                                            // rows={3}
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                this.setState({
                                                    otherRemark: e.target.value,
                                                })
                                            }}
                                            validators={['required']}
                                            errorMessages={[
                                                'This field is required',
                                            ]}
                                        />
                                    </Grid>

                                    <Grid container={2}>
                                        <Grid item lg={2} md={2} sm={2} xs={2}>
                                            <Button
                                                className="mt-3 mb-5"
                                                progress={this.state.progress}
                                                scrollToTop={false}
                                                // type='submit'
                                                // startIcon="search"
                                                onClick={() => {
                                                    this.setState({
                                                        returnDialog: false
                                                    })
                                                }}
                                            >
                                                <span className="capitalize">Cancel</span>
                                            </Button>
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={4} xs={4}>
                                            <Button
                                                className="mt-3 mb-5"
                                                progress={this.state.progress}
                                                scrollToTop={false}
                                                type='submit'
                                            // startIcon="search"
                                            // onClick={() => { 
                                            //     if(this.state.otherRemark !=null || this.state.remarkID != null || this.state.returnQuantity !=null || this.state.selected_ds != null){
                                            //         this.returnRequest()
                                            //     }
                                            //     else{
                                            //         this.setState({
                                            //             alert:true,
                                            //             message:'Please fill the Fields',
                                            //             severity:'error'
                                            //         })
                                            //     }
                                            // }}
                                            >
                                                <span className="capitalize">Submit</span>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </ValidatorForm>
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

export default DetailsView
