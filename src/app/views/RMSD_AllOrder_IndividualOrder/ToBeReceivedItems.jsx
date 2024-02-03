import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import Paper from "@material-ui/core/Paper";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Collapse } from '@mui/material'
import { withRouter } from "react-router";
import {
    Grid,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    IconButton,
    Icon,
    Tabs,
    InputAdornment,
    Tab,
    Dialog,
    Tooltip
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import PharmacyService from 'app/services/PharmacyService'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import CancelIcon from '@material-ui/icons/Cancel';
import { dateTimeParse } from 'utils'

const styleSheet = (theme) => ({})

class ToBeReceivedItems extends Component {
    constructor(props) {
        super(props)
        this.state = {

            Loaded: false,
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            all_item_drug_store: [],
            warehouse: null,
            selected_bin: null,
            selected_order_item: null,
            totalItems: 0,

            progress:false,
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],

            alert: false,
            message: '',
            severity: 'success',

            complainDialog: false,
            AllReceivedConfirmation:false,
            totalReceivedItems: null,
            AddReceivedItems: null,
            ReceivedItemID: null,

            filterData: {

                // status: ['ORDERED', 'ISSUED', 'PARTIAL RECEIVED'],
                search: null,
                ven_id: null,
                class_id: null,
                category_id: null,
                group_id: null,
                // from: '8688da15-9f31-40a5-83e8-4a603479155a',
                from: null,
                // order_exchange_id: 'ecbebbe1-8b8c-496e-a68d-9cad9ff3f826',
                order_exchange_id: this.props.match.params.id,
                to: null,
                search: null,

                limit: 10,
                page: 0,

            },

            filterDataValidation: {

                search: true,
            },

            Order: [],

            data: [],

            openState: [],

            columns: [
                // {
                //     name: 'id',
                //     label: 'id',
                //     options: {
                //         display: false,
                //     },
                // },
                {
                    name: 'SRNumber',
                    label: 'SR No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].OrderItem.ItemSnap.sr_no

                            )
                        }
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].OrderItem.ItemSnap.medium_description

                            )
                        }
                    },
                },
                {
                    name: 'batch',
                    label: 'Batch',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnapBatchBin.ItemSnapBatch.batch_no

                            )
                        }

                    },
                },
                {
                    name: 'strength',
                    label: 'Strength',
                    options: {
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].OrderItem.ItemSnap.strength ?
                                this.state.data[tableMeta.rowIndex].OrderItem.ItemSnap.strength : 'N/A'

                            )
                        }
                    },
                },
                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].OrderItem.request_quantity ?
                                parseInt(this.state.data[tableMeta.rowIndex].OrderItem.request_quantity):'N/A'
                            )
                        }
                    },
                },
                {
                    name: 'approved_quantity',
                    label: 'Approved Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity ?
                                parseInt(this.state.data[tableMeta.rowIndex].OrderItem.approved_quantity):'N/A'
                            )
                        }
                    },
                },
                {
                    name: 'issued_quantity',
                    label: 'Issued Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].allocated_quantity ?
                                parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity):'N/A'
                            )
                        }
                    },
                },
                {
                    name: 'recieved_quantity',
                    label: 'Received Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity ?
                                parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity):'N/A'
                            )
                        }
                    },
                },


                // {
                //     name: 'receivedQty',
                //     label: 'Received Qty',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <>
                //                     {
                //                         <ValidatorForm
                //                             className=""
                //                             onSubmit={() => this.SubmitAll()}
                //                             onError={() => null}>

                //                             <TextValidator
                //                                 // className= "w-full"
                //                                 placeholder="Received Amount"
                //                                 name="received_amount"
                //                                 InputLabelProps={{
                //                                     shrink: false,
                //                                 }}
                //                                 // style={{width:'75%'}}
                //                                 value={tableMeta.rowData[7]}
                //                                 type="text"
                //                                 variant="outlined"
                //                                 size="small"
                //                             // onChange={(e) => {
                //                             //     let filterData =
                //                             //         this.state.filterData
                //                             //     filterData.input =
                //                             //         e.target.value
                //                             //     this.setState({ filterData })
                //                             // }}
                //                             /*  validators={['required']}
                //                              errorMessages={[
                //                                  'this field is required',
                //                              ]} */
                //                             />

                //                         </ValidatorForm>


                //                     }

                //                 </>
                //             )
                //         },
                //     },
                // },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return (

                                 (parseInt(this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity)) < (parseInt(this.state.data[tableMeta.rowIndex].allocated_quantity)) ?
                                    (
                                        <>
                                            <Tooltip title="Add Received Quantity">
                                                <IconButton
                                                    className="text-black mr-1"
                                                    onClick={() => {
                                                        this.setState({
                                                            complainDialog: true,
                                                            totalReceivedItems: this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity,
                                                            ReceivedItemID: this.state.data[tableMeta.rowIndex].order_item_id,
                                                            selected_order_item: this.state.data[tableMeta.rowIndex]
                                                        })

                                                    }}
                                                >
                                                    <Icon style={{ fontSize: 'medium' }}>addcircle</Icon>
                                                </IconButton>
                                            </Tooltip>
                                            <Button
                                                className="my-1 ml-1"
                                                progress={false}
                                                scrollToTop={false}
                                                // type='submit'
                                                // startIcon="save"
                                                onClick={() => {
                                                    this.setState({
                                                        AllReceivedConfirmation: true,
                                                        // totalReceivedItems: this.state.data[tableMeta.rowIndex].OrderItem.recieved_quantity,
                                                        ReceivedItemID: this.state.data[tableMeta.rowIndex].order_item_id,
                                                        selected_order_item: this.state.data[tableMeta.rowIndex]
                                                    })

                                                }}
                                            >
                                                <span className="capitalize">All Received</span>
                                            </Button>




                                        </>
                                    ) :
                                    ("")



                            )
                        },
                    },
                },
                // {
                //     name: 'receivedDateTime',
                //     label: 'Received Date & Time',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 // this.state.data[tableMeta.rowIndex].OrderExchange.recieved_date ?
                //                 //     dateTimeParse(this.state.data[tableMeta.rowIndex].OrderExchange.recieved_date) : 'N/A'
                //                 ''
                //             )
                //         }

                //     },
                // },
            ]
        }
    }

    // handleAddSteps(event, index) {
    //     let newOpenState = this.state.openState[0];
    //     console.log(0)
    //     console.log(this.state.openState)
    //     newOpenState.open = !(this.state.openState[0].open);
    //     this.setState({ newOpenState });
    // }

    // handleAddReceivingSteps() {

    //     let newNewData = this.state.newData[0];
    //     let count = newNewData.receivedSteps.length;
    //     console.log(newNewData)
    //     console.log(count)
    //     newNewData.receivedSteps[count] = {
    //         receivedQty: '',
    //         receivedDateTime: '',
    //     };
    //     this.setState({ newNewData });
    // }

    async handleAllReceived() {
        console.log('totalReceivedItems' , this.state.totalReceivedItems)
        console.log('ReceivedItemID' , this.state.ReceivedItemID)
        console.log('selected_order_item' , this.state.selected_order_item)

        const d = new Date();
        let res = await PharmacyOrderService.AddReceivedItemQuantity({

            order_item_id: this.state.ReceivedItemID,
            activity: "ITEM FORCE RECEIVED",
            date: d.toISOString(),
            status: "ITEM FORCE RECEIVED",
            type: "ITEM FORCE RECEIVED",


        })
        if (res.status) {
            if (res.data.posted == "data has been added successfully.") {
                this.setState({
                    complainDialog: false,
                    alert: true,
                    message: 'data has been added successfully.',
                    severity: 'success',
                })
                this.LoadOrderItemDetails(this.state.filterData)
            } else {
                this.setState(
                    {
                        alert: true,
                        message: "Received Item Quantity Could Not be Added. Please Try Again",
                        severity: 'error',
                    }
                )
            }


        } else {
            this.setState(
                {
                    alert: true,
                    message: "Received Item Quantity Could Not be Added. Please Try Again",
                    severity: 'error',
                }
            )
        }
    }


    async handleAddReceivedItems() {

        this.setState({progress:true})
        const d = new Date();
        let itemVol = (parseInt(this.state.selected_order_item.allocated_volume) * parseInt(this.state.AddReceivedItems)) / parseInt(this.state.selected_order_item.allocated_quantity)

        let res = await PharmacyOrderService.AddReceivedItemQuantity({

            order_item_id: this.state.ReceivedItemID,
            activity: "ITEM RECEIVED",
            date: d.toISOString(),
            status: "ITEM RECEIVED",
            type: "ITEM RECEIVED",
            quantity: this.state.AddReceivedItems,

            bin_id: this.state.selected_bin,
            item_allocation_id: this.state.selected_order_item.id,
            item_batch_bin_id: this.state.selected_order_item.ItemSnapBatchBin.id,
            item_batch_id: this.state.selected_order_item.ItemSnapBatchBin.ItemSnapBatch.id,

            warehouse_id: this.state.filterData.from,
            volume: itemVol


        })
        console.log("res", res);
        console.log("res.data", res.data.posted);
        if (res.status) {
            if (res.data.posted == "data has been added successfully.") {
                this.setState({
                    complainDialog: false,
                    alert: true,
                    message: 'data has been added successfully.',
                    severity: 'success',
                    AddReceivedItems: null,
                    totalReceivedItems: null,
                    ReceivedItemID: null,
                    selected_order_item: null,
                    progress:false
                })
                this.LoadOrderItemBatchDetails(this.state.filterData)
            } else {
                this.setState(
                    {
                        complainDialog: false,
                        alert: true,
                        message: "Received Item Quantity Could Not be Added. Please Try Again",
                        severity: 'error',
                        totalReceivedItems: null,
                        ReceivedItemID: null,
                        selected_order_item: null,
                        progress:false
                    }
                )
            }

        } else {
            this.setState(
                {
                    complainDialog: false,
                    alert: true,
                    message: "Received Item Quantity Could Not be Added. Please Try Again",
                    severity: 'error',
                    totalReceivedItems: null,
                    ReceivedItemID: null,
                    selected_order_item: null
                }
            )
        }
    }



    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New filterData", this.state.filterData)
            this.LoadOrderItemBatchDetails(this.state.filterData)
        })
    }

    handleFilterButton() {

        console.log("this.state.filterdata", this.state.filterData);
        this.LoadOrderItemBatchDetails(this.state.filterData)
    }

    handleSearchButton() {

        let filterData = this.state.filterData;

        if (filterData.search) {
            // alert("Sent the Request")
            this.LoadOrderItemBatchDetails(this.state.filterData)
        }
        else {

            let filterDataValidation = this.state.filterDataValidation;

            filterDataValidation.search = false;

            this.setState({ filterDataValidation })
        }


    }


    // async LoadOrderItemDetails(filters) {

    //     this.setState({ Loaded: false })
    //     let res = await PharmacyOrderService.getOrderItems(filters)
    //     if (res.status) {
    //         console.log("Order Item Data", res.data.view.data)
    //         this.setState({
    //             data: res.data.view.data,
    //             Loaded: true,
    //         }, () => {
    //             this.render()
    //             // console.log("State ", this.state.data)
    //         })
    //     }

    // }

    async LoadOrderItemBatchDetails(filters) {

        console.log("LoadOrderItemBatchDetails",filters);
        console.log("LoadOrderItemBatchDetails",filters.from);
        this.setState({ Loaded: false })
        let res = await PharmacyOrderService.getOrderBatchItems(filters)
        if (res.status) {
            console.log("Order Item Batch Data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                Loaded: true,
            }, () => {
                this.render()
                // console.log("State ", this.state.data)
            })
        }

    }

    async LoadBinDetails(id) {

        console.log("this.props.match.params.id",id);
        let res = await WarehouseServices.getWarehousesBinsById(id)
        if (res.status) {
            console.log("Bin Data", res.data.view)
            this.setState({
                warehouse: res.data.view,
                selected_bin: res.data.view.WarehousesBins[0].id
            }, () => {
                this.render()
                // console.log("State ", this.state.order)
            })
        }

    }

    async LoadOrderDetails() {

        // console.log("this.props.match.params.id",this.props.match.params.id);
        let res = await PharmacyOrderService.getOrdersByID(this.props.match.params.id)
        if (res.status) {
            console.log("Order Data", res.data.view)
            this.setState({
                order: res.data.view,
            }, () => {
                this.render()
                // console.log("State ", this.state.order)
            })
        }

    }

    async loadData() {

        //function for load initial data from backend or other resources
        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {
            // console.log('Ven', ven_res.data.view.data)
            this.setState({ all_ven: ven_res.data.view.data })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            // console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await
            ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            // console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            // console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
        let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        if (durgStore_res.status == 200) {
            // console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_drug_store: durgStore_res.data.view.data })
        }
    }

    async loadWarehouses() {
        // this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            // this.state.genOrder.created_by = id
            // this.state.genOrder.warehouse_id = selected_warehouse_cache.id
            // this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            // this.state.suggestedWareHouses.warehouse_id = selected_warehouse_cache.id
            // this.state.formData.owner_id = selected_warehouse_cache.owner_id
            let filterData = this.state.filterData;
            filterData.from = selected_warehouse_cache.id
            this.setState({
                filterData,
                owner_id: selected_warehouse_cache.owner_id,
                selected_warehouse: selected_warehouse_cache.id,
                dialog_for_select_warehouse: false,
                warehouseSelectDone: true
            })
            console.log("this.state.selected_warehouse", this.state.selected_warehouse)
            console.log("filterData.from", this.state.filterData.from)
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params);
        if (res.status == 200) {
            console.log("warehouseUsers", res.data.view.data)

            res.data.view.data.forEach(element => {
                all_pharmacy_dummy.push(
                    {
                        warehouse: element.Warehouse,
                        name: element.Warehouse.name,
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouse", all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
            console.log("filterData.from.end", this.state.filterData.from)
            this.LoadBinDetails(this.state.filterData.from)
        }
    }

    componentDidMount() {
        // this.load_days(31)
        this.loadWarehouses()
        this.loadData()
        this.LoadOrderDetails()
        // this.LoadOrderItemDetails(this.state.filterData)
        // this.LoadOrderItemBatchDetails(this.state.warehouse_id)

        this.LoadOrderItemBatchDetails(this.state.filterData)


    }

    render() {
        return (

            <Fragment>
                <div className='w-full'>
                    <ValidatorForm
                        className=""
                        onSubmit={() => this.SubmitAll()}
                        onError={() => null}>


                        <Grid container>
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                                <SubTitle title={"Ven"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_ven}
                                    /*  defaultValue={dummy.find(
                                         (v) => v.value == ''
                                     )} */
                                    getOptionLabel={(option) =>
                                        option.name ?
                                            (option.name)
                                            : ('')
                                    }
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {

                                        let filterData = this.state.filterData
                                        if (value != null) {
                                            filterData.ven_id = value.id
                                            // filterData.ven = value.name
                                        } else {
                                            filterData.ven = null
                                        }
                                        this.setState({ filterData })

                                    }}
                                    value={this.state.all_ven.find((v) =>
                                        v.id == this.state.filterData.ven_id
                                    )}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Ven"
                                            //variant="outlined"
                                            //value={}
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
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                                <SubTitle title={"Item Class"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_item_class}
                                    /*  defaultValue={dummy.find(
                                         (v) => v.value == ''
                                     )} */
                                    getOptionLabel={(option) =>
                                        option.description ?
                                            (option.description)
                                            : ('')
                                    }
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {

                                        let filterData = this.state.filterData
                                        if (value != null) {

                                            filterData.class_id = value.id


                                        } else {
                                            filterData.class_id = null
                                        }
                                        this.setState({ filterData })

                                    }}
                                    value={this.state.all_item_class.find((v) =>
                                        v.id == this.state.filterData.class_id
                                    )}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Item Class"
                                            //variant="outlined"
                                            //value={}
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
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                                <SubTitle title={"Item Category"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_item_category}
                                    /*  defaultValue={dummy.find(
                                         (v) => v.value == ''
                                     )} */

                                    getOptionLabel={(option) =>
                                        option.description ?
                                            (option.description)
                                            : ('')
                                    }
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {
                                        let filterData = this.state.filterData
                                        if (value != null) {

                                            filterData.category_id = value.id


                                        } else {
                                            filterData.category_id = null
                                        }
                                        this.setState({ filterData })
                                    }}
                                    value={this.state.all_item_category.find((v) =>
                                        v.id == this.state.filterData.category_id
                                    )}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Item Category"
                                            //variant="outlined"
                                            //value={}
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
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                                <SubTitle title={"Item Group"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_item_group}
                                    /*  defaultValue={dummy.find(
                                         (v) => v.value == ''
                                     )} */

                                    getOptionLabel={(option) =>
                                        option.description ?
                                            (option.description)
                                            : ('')
                                    }
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {
                                        let filterData = this.state.filterData
                                        if (value != null) {

                                            filterData.group_id = value.id


                                        } else {
                                            filterData.group_id = null
                                        }
                                        this.setState({ filterData })
                                    }}
                                    value={this.state.all_item_group.find((v) =>
                                        v.id == this.state.filterData.group_id
                                    )}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Item Group"
                                            //variant="outlined"
                                            //value={}
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
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>

                        </Grid>
                        <Grid container>
                            <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
                                <SubTitle title={"Drug Store"}></SubTitle>
                                <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.all_item_drug_store}
                                    /*  defaultValue={dummy.find(
                                         (v) => v.value == ''
                                     )} */
                                    getOptionLabel={(option) =>
                                        option.name ?
                                            (option.name)
                                            : ('')
                                    }
                                    getOptionSelected={(option, value) =>
                                        console.log("ok")
                                    }
                                    onChange={(event, value) => {

                                        console.log("fromStore", value);
                                        let filterData = this.state.filterData
                                        if (value != null) {

                                            // let filterDataValidation = this.state.filterDataValidation;
                                            // filterDataValidation.from = true;

                                            filterData.to = value.id

                                            // this.setState({ filterDataValidation })


                                        } else {
                                            filterData.to = null
                                        }
                                        this.setState({ filterData })

                                    }}
                                    value={this.state.all_item_drug_store.find((v) =>
                                        v.id == this.state.filterData.to
                                    )}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Drug Store"
                                            //variant="outlined"
                                            //value={}
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
                                                'this field is required',
                                            ]}
                                        />
                                    )}
                                />

                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1} className="text-left px-2 mb-2">
                                <Button
                                    className="mt-6"
                                    progress={false}
                                    scrollToTop={false}
                                    // type='submit'
                                    startIcon="search"
                                    onClick={() => { this.handleFilterButton() }}
                                >
                                    <span className="capitalize">Filter</span>
                                </Button>
                            </Grid>
                            <Grid item lg={5} md={5} sm={5} xs={5} className="text-left px-2 mb-2" >

                            </Grid>
                            <Grid item
                                lg={2} md={2} sm={2} xs={2}
                                className='mb-2 px-2'
                                style={{ display: 'flex', flexDirection: 'column' }}>

                                <TextValidator
                                    className='w-full mt-5'
                                    placeholder="SR No"
                                    //variant="outlined"

                                    variant="outlined"
                                    size="small"
                                    value={this.state.filterData.search}
                                    onChange={(e, value) => {
                                        let filterData = this.state.filterData
                                        if (e.target.value) {
                                            let filterDataValidation = this.state.filterDataValidation;
                                            filterDataValidation.search = true;

                                            filterData.search = e.target.value;

                                            this.setState({ filterDataValidation })
                                        } else {
                                            filterData.search = null;
                                        }

                                        this.setState({ filterData })
                                        // console.log("form dat", this.state.filterData)
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
                                                {/* <SearchIcon></SearchIcon> */}
                                            </InputAdornment>
                                        )
                                    }} />
                                {
                                    this.state.filterDataValidation.search ?
                                        ("") :
                                        (<span style={{ color: 'red' }}>this field is required</span>)
                                }

                            </Grid>
                            <Grid item lg={1} md={1} sm={1} xs={1} className="text-left pl-4 pr-0" >
                                <Button
                                    className="mt-6 "
                                    progress={false}
                                    scrollToTop={false}
                                    // type='submit'
                                    startIcon="search"
                                    onClick={() => { this.handleSearchButton() }}
                                >
                                    <span className="capitalize">Search</span>
                                </Button>
                            </Grid>

                        </Grid>



                    </ValidatorForm>
                    <Dialog
                        fullWidth
                        maxWidth="sm"
                        open={this.state.complainDialog}
                        onClose={() => {
                            this.setState({ complainDialog: false })
                        }}>
                        <div className="w-full h-full px-5 py-5">

                            <Grid container className=''>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <LoonsCard>
                                        <ValidatorForm
                                            className=""
                                            onSubmit={() => this.SubmitAll()}
                                            onError={() => null}>

                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <h4 className='mt-5'>Total Received Items : {this.state.totalReceivedItems}</h4>
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12} className="mb-2 mt-5">
                                                <h5 className=''>Selected Bin : </h5>
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.warehouse && this.state.warehouse.WarehousesBins}
                                                    /*  defaultValue={dummy.find(
                                                         (v) => v.value == ''
                                                     )} */
                                                    getOptionLabel={(option) =>
                                                        option.bin_id ?
                                                            (option.bin_id)
                                                            : ('')
                                                    }
                                                    getOptionSelected={(option, value) =>
                                                        console.log("ok")
                                                    }
                                                    onChange={(event, value) => {

                                                        // let filterData = this.state.filterData
                                                        if (value != null) {
                                                            this.state.selected_bin = value.id
                                                        } else {
                                                            this.state.selected_bin = null
                                                        }
                                                        // this.setState({ filterData })

                                                    }}
                                                    value={this.state.warehouse && this.state.warehouse.WarehousesBins.find((v) =>
                                                        v.id == this.state.selected_bin
                                                    )}
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Select Bin"
                                                            //variant="outlined"
                                                            //value={}
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
                                                                'this field is required',
                                                            ]}
                                                        />
                                                    )}
                                                />

                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12}
                                                // style={{ visibility: `${this.state.filterData.visible}` }}
                                                className="mt-5">

                                                <h5 className=''>Amount of Received Items : </h5>
                                                <TextValidator
                                                    className='mt-2'
                                                    fullWidth
                                                    placeholder="Received Amount"
                                                    name="received_amount"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.AddReceivedItems
                                                    }
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
                                                            AddReceivedItems: e.target.value,
                                                        })
                                                    }}
                                                /* validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]} */
                                                />
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <Button
                                                    className="mt-3 mb-5"
                                                    progress={this.state.progress}
                                                    scrollToTop={false}
                                                    // type='submit'
                                                    // startIcon="search"
                                                    onClick={() => { this.handleAddReceivedItems() }}
                                                >
                                                    <span className="capitalize">Add Received Items</span>
                                                </Button>
                                            </Grid>
                                        </ValidatorForm>
                                    </LoonsCard>
                                </Grid>
                            </Grid>

                        </div>
                    </Dialog>
                    <Dialog
                    maxWidth="lg "
                    open={this.state.AllReceivedConfirmation}
                    onClose={() => {
                        this.setState({ AllReceivedConfirmation: false })
                    }}>
                    <div className="w-full h-full px-5 py-5">

                        <CardTitle title="Are you sure you want to delete?"></CardTitle>
                        <div>
                            <p>Order Details Will be Update as All Items Received. This
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
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        // startIcon="delete"
                                        onClick={() => {
                                            this.setState({ AllReceivedConfirmation: false });
                                            this.handleAllReceived()
                                        }}>
                                        <span className="capitalize">Confirm</span>
                                    </Button>

                                    <Button
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon={<CancelIcon fontSize='small' />}
                                        onClick={() => {
                                            this.setState({ AllReceivedConfirmation: false });
                                        }}>
                                        <span className="capitalize">Cancel</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>
                    {/* <Dialog
                        maxWidth="lg "
                        open={this.state.complainDialog}
                        onClose={() => {
                            this.setState({ complainDialog: false })
                        }}>
                        <div className="w-full h-full px-5 py-5">

                            <Grid container className=''>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <LoonsCard>
                                        <Grid container className='mt-5'>
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <SubTitle title={"Order ID : 001"} />
                                                <SubTitle title={"Sub Order ID : 001"} />
                                                <SubTitle title={"Item ID : 001"} />
                                                <SubTitle title={"Item Name : 001"} />
                                            </Grid>
                                            <Grid item lg={6} md={6} sm={6} xs={6}>
                                                <SubTitle title={`Pick Up Person ID : `} />
                                                <SubTitle title={`Pick Up Person Name : `} />
                                                <div
                                                    className='mt-4'
                                                    style={{ display: 'flex', alignItems: 'center' }}>
                                                    <Icon style={{ fontSize: 'large' }}>person</Icon>
                                                    <Button
                                                        className="ml-3"
                                                        progress={false}
                                                        scrollToTop={false}
                                                    // type='submit'
                                                    // startIcon="search"
                                                    //onClick={() => { this.loadConsignmentList() }}
                                                    >
                                                        <span className="capitalize">View Profile</span>
                                                    </Button>
                                                </div>

                                            </Grid>
                                        </Grid>
                                        <Grid container className='' style={{ marginTop: '35px' }}>
                                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                                <h5>Issued Qty and Received Qty are Mismatched</h5>
                                                <p>Issued Qty and Received Qty are Mismatched.Issued Qty and Received Qty are Mismatched.
                                                    Issued Qty and Received Qty are Mismatched.Issued Qty and Received Qty are Mismatched
                                                </p>
                                            </Grid>
                                        </Grid>
                                        <Grid container className='mt-3' >
                                            <Grid item lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
                                                <Button
                                                    className=""
                                                    progress={false}
                                                    scrollToTop={false}
                                                // type='submit'
                                                // startIcon="search"
                                                //onClick={() => { this.loadConsignmentList() }}
                                                >
                                                    <span className="capitalize">Complain</span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </LoonsCard>
                                </Grid>
                            </Grid>

                        </div>
                    </Dialog> */}
                    <Grid container className="mt-2 pb-5">
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            {
                                this.state.Loaded ?
                                    <>
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}

                                            id={'to_be_received_items'}
                                            data={
                                                this.state.data
                                            }
                                            columns={
                                                this.state.columns
                                            }
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,

                                                print: true,
                                                viewColumns: true,
                                                download: true,
                                                onTableChange: (action, tableState) => {
                                                    console.log(action, tableState)
                                                    switch (
                                                    action
                                                    ) {
                                                        case 'changePage':
                                                            this.setPage(
                                                                tableState.page
                                                            )
                                                            break
                                                        case 'sort':
                                                            // this.sort(tableState.page, tableState.sortOrder);
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        ></LoonsTable>
                                    </> :
                                    (
                                        //loading effect
                                        <Grid className="justify-center text-center w-full pt-12">
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )

                            }

                        </Grid>
                    </Grid>
                    {/* <Grid container className="mt-2 pb-5">
                                        <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                            <TableContainer component={Paper}>
                                                <Table aria-label="collapsible table">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>

                                                            </TableCell>
                                                            {
                                                                this.state.newCol.map((col) => (
                                                                    <TableCell align="center">
                                                                        <strong>{col.headerName}</strong>
                                                                    </TableCell>
                                                                ))
                                                            }

                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {
                                                            this.state.newData.map((row, index) => (
                                                                this.state.openState.push({
                                                                    index: index,
                                                                    open: false
                                                                }),
                                                                <TableRow
                                                                    key={row.SRNumber}
                                                                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell>
                                                                        <IconButton
                                                                            aria-label="expand row"
                                                                            size="small"
                                                                            align="center"
                                                                            // onClick={() => (this.state.openState[index].open = !(this.state.openState[index].open))}
                                                                            onClick={(event, index) => this.handleAddSteps()}
                                                                        >
                                                                            {this.state.openState[index].open ? <KeyboardArrowUpIcon></KeyboardArrowUpIcon> : <KeyboardArrowDownIcon></KeyboardArrowDownIcon>}
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <TableCell align="center">{row.SRNumber}</TableCell>
                                                                    <TableCell align="center">{row.itemID}</TableCell>
                                                                    <TableCell align="center">{row.itemName}</TableCell>
                                                                    <TableCell align="center">{row.dosage}</TableCell>
                                                                    <TableCell align="center">{row.orderQty}</TableCell>
                                                                    <TableCell align="center">{row.approvedQty}</TableCell>
                                                                    <TableCell align="center">{row.issuedQty}</TableCell>
                                                                    <TableCell align="center">{
                                                                        <Collapse in={this.state.openState[index].open} timeout='auto' unmountOnExit>
                                                                            <Table>
                                                                                <TableHead>
                                                                                    <TableRow>
                                                                                        <TableCell align="center">Received Qty</TableCell>
                                                                                        <TableCell align="center">Actions</TableCell>
                                                                                        <TableCell align="center">Received Date & Time</TableCell>
                                                                                    </TableRow>
                                                                                </TableHead>
                                                                                <TableBody>
                                                                                    {
                                                                                        row.receivedSteps.map((colRow) => (
                                                                                            <TableRow>
                                                                                                <TableCell align="center">{colRow.receivedQty}</TableCell>
                                                                                                <TableCell align="center">
                                                                                                    {
                                                                                                        <>
                                                                                                            <Button
                                                                                                                className="my-1"
                                                                                                                progress={false}
                                                                                                                scrollToTop={false}
                                                                                                                // type='submit'
                                                                                                                // startIcon="save"
                                                                                                                onClick={null}
                                                                                                            >
                                                                                                                <span className="capitalize">Received</span>
                                                                                                            </Button>
                                                                                                            <IconButton
                                                                                                                className="text-black ml-1"
                                                                                                                onClick={(event,index) => this.handleAddReceivingSteps()}
                                                                                                            >
                                                                                                                <Icon style={{ fontSize: 'medium' }}>addcircle</Icon>
                                                                                                            </IconButton>

                                                                                                        </>
                                                                                                    }
                                                                                                </TableCell>
                                                                                                <TableCell align="center">{colRow.receivedDateTime}</TableCell>
                                                                                            </TableRow>
                                                                                        ))
                                                                                    }

                                                                                </TableBody>
                                                                            </Table>
                                                                        </Collapse>
                                                                    }</TableCell>
                                                                    <TableCell align="center">{row.allReceivedQty}</TableCell>
                                                                    <TableCell align="center">{
                                                                        <>
                                                                            <Button
                                                                                className="my-1"
                                                                                progress={false}
                                                                                scrollToTop={false}
                                                                                // type='submit'
                                                                                // startIcon="save"
                                                                                onClick={() => {
                                                                                    this.setState({ complainDialog: true })
                                                                                }}
                                                                            >
                                                                                <span className="capitalize">All Received</span>
                                                                            </Button>
                                                                        </>

                                                                    }</TableCell>

                                                                    <TableCell align="center">{row.allReceivedDateTime}</TableCell>

                                                                </TableRow>
                                                            ))
                                                        }
                                                    </TableBody>
                                                </Table>

                                            </TableContainer>
                                        </Grid>
                                    </Grid> */}
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
                </div>
            </Fragment>

        )
    }
}

export default withRouter(ToBeReceivedItems)
