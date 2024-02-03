import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
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
    Tooltip,
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
    LoonsTable
} from 'app/components/LoonsLabComponents'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import { resolveComponentProps } from '@mui/base'
import PharmacyService from 'app/services/PharmacyService'
import CancelIcon from '@material-ui/icons/Cancel';
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from "app/services/WarehouseServices";
import { dateParse } from 'utils'

const styleSheet = (theme) => ({})

class AllOrder_OrderDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Loaded: false,
            totalItems: 0,
            all_orders: 0,
            drugStoreData: [],
            orderDeleteWarning: false,
            orderToDelete: null,

            orderReOrderWarning: false,
            orderToReOrder: null,
            orderReqDate: null,

            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],

            alert: false,
            message: '',
            severity: 'success',

            filterData: {
                'order[0]': ['updatedAt', 'DESC'],
                status: null,
                date_type: null,
                from_date: null,
                to_date: null,
                from: null,
                to: null,
                special_normal_type: null,
                search: null,

                limit: 10,
                page: 0,

            },

            filterDataValidation: {
                date_type: true,
                from_date: true,
                to_date: true,
                search: true,
                to: true,
                status: true,
                orderReqDate:true

            },

            // filterData: {
            //     search: null,
            // },

            data: [],
            columns: [

                // {
                //     name: 'warehouse_id',
                //     label: 'Warehouse ID',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (this.state.data[tableMeta.rowIndex].toStore.id)
                //         }

                //     }

                // }, 
                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex].toStore.name)
                        }

                    }

                },
                {
                    name: 'order_id',
                    label: 'Order ID',
                    options: {
                        display: true
                    }
                }, {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'number_of_items',
                    label: 'Number of Items',
                    options: {
                        display: true,

                    },
                },
                {
                    name: 'order_type',
                    label: 'Order Type',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex].special_normal_type ?
                                this.state.data[tableMeta.rowIndex].special_normal_type:'N/A')
                        }
                    },
                },
                {
                    name: 'createdAt',
                    label: 'Requested Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].createdAt ?
                                    dateParse(this.state.data[tableMeta.rowIndex].createdAt) : 'N/A'
                            )
                        }
                    },
                },
                {
                    name: 'required_date',
                    label: 'Required Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].required_date ?
                                    dateParse(this.state.data[tableMeta.rowIndex].required_date) : 'N/A'
                            )
                        }
                    }
                },
                {
                    name: 'approved_date',
                    label: 'Approval Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].approved_date ?
                                    dateParse(this.state.data[tableMeta.rowIndex].approved_date) : 'N/A'
                            )
                        }
                    }
                },
                // {
                //     name: 'accepted_date',
                //     label: 'Accepted Date of Warehouse',
                //     options: {
                //         display: true
                //     }
                // }, 
                {
                    name: 'allocated_date',
                    label: 'Allocated Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].allocated_date ?
                                    dateParse(this.state.data[tableMeta.rowIndex].allocated_date) : 'N/A'
                            )
                        }
                    }
                }, {
                    name: 'issued_date',
                    label: 'Issue Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].issued_date ?
                                    dateParse(this.state.data[tableMeta.rowIndex].issued_date) : 'N/A'
                            )
                        }
                    }
                }, {
                    name: 'time_slot',
                    label: 'Time Slot',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return (

                                this.state.data[tableMeta.rowIndex].Delivery ?
                                    ((this.state.data[tableMeta.rowIndex].Delivery.time_from && this.state.data[tableMeta.rowIndex].Delivery.time_to) ?
                                        (this.state.data[tableMeta.rowIndex].Delivery.time_from + "-" + this.state.data[tableMeta.rowIndex].Delivery.time_to) : ("N/A"))
                                    : ("N/A")

                            )
                        }
                    },
                },
                {
                    name: 'received_date',
                    label: 'Received Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].received_date ?
                                    dateParse(this.state.data[tableMeta.rowIndex].received_date) : 'N/A'
                            )
                        }
                    }
                }, {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {
                                        (tableMeta.rowData[2] == "ORDERED") || (tableMeta.rowData[2] == "Pending")
                                            ? (
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        {/* < IconButton className="text-black mr-1" 
                                                        onClick={null
                                                            // () => { window.location = "/order/create?orderID=" + this.state.data[tableMeta.rowIndex].id                             }
                                                        }
                                                        > <Icon
                                                            style={{
                                                                fontSize: 'large'
                                                            }}>mode_edit_outline</Icon>
                                                        </IconButton> */}
                                                        <IconButton
                                                            className="text-black mr-1"
                                                            onClick={() => {
                                                                this.setState({
                                                                    orderDeleteWarning: true,
                                                                    orderToDelete: this
                                                                        .state
                                                                        .data[tableMeta.rowIndex]
                                                                        .id
                                                                })
                                                            }}>
                                                            <Icon
                                                                style={{
                                                                    fontSize: 'large'
                                                                }}>delete</Icon>
                                                        </IconButton>
                                                        <IconButton
                                                            className="text-black"
                                                            onClick={() => this.viewIndividualOrder(
                                                                this.state.data[tableMeta.rowIndex].id,
                                                                this.state.data[tableMeta.rowIndex].Delivery ?
                                                                   this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                            )}
                                                        >
                                                            <Icon
                                                                style={{
                                                                    fontSize: 'large'
                                                                }}>visibility</Icon>
                                                        </IconButton>
                                                    </div>
                                                </>
                                            )
                                            : (
                                                tableMeta.rowData[2] == "REJECTED"
                                                    ? (
                                                        <>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                < Button className="ml-3" progress={false} scrollToTop={false}
                                                                    style={{ height: '30px', fontSize: '11px' }}
                                                                    // type='submit' startIcon="save" 
                                                                    onClick={() => {
                                                                        this.setState({
                                                                            orderReOrderWarning: true,
                                                                            orderToReOrder: this
                                                                                .state
                                                                                .data[tableMeta.rowIndex]

                                                                        })
                                                                    }}>
                                                                    <span className="capitalize">Re-order</span>
                                                                </Button>
                                                                <IconButton
                                                                    className="text-black"
                                                                    onClick={() => this.viewIndividualOrder(
                                                                        this.state.data[tableMeta.rowIndex].id,
                                                                        this.state.data[tableMeta.rowIndex].Delivery ?
                                                                           this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                                    )}>
                                                                    <Icon
                                                                        style={{
                                                                            fontSize: 'large'
                                                                        }}>visibility</Icon>
                                                                </IconButton>
                                                            </div>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <IconButton
                                                                    className="text-black"
                                                                    onClick={() => this.viewIndividualOrder(
                                                                        this.state.data[tableMeta.rowIndex].id,
                                                                        this.state.data[tableMeta.rowIndex].Delivery ?
                                                                           this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                                    )}>
                                                                    <Icon
                                                                        style={{
                                                                            fontSize: 'large'
                                                                        }}>visibility</Icon>
                                                                </IconButton>
                                                            </div>
                                                        </>
                                                    )
                                            )
                                    } </>


                            )
                        },
                    },
                },
            ],

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
        }
    }

    viewIndividualOrder(id, pickUpPersonID) {
        window.location = `/main-drug-store/all-items/${id}?pickUpPersonID=${pickUpPersonID}`;
    }

    handleSearchButton() {

        let filterData = this.state.filterData;

        if (filterData.search) {
            // alert("Sent the Request")
            this.loadOrderList(this.state.filterData)
        }
        else {

            let filterDataValidation = this.state.filterDataValidation;

            if (!(filterData.search)) {
                filterDataValidation.search = false;
            }

            this.setState({ filterDataValidation })
        }


    }

    async handleFilterButton() {

        console.log("this.state.filterData", this.state.filterData);

        let filterData = this.state.filterData;

        if (((filterData.date_type) && (filterData.from_date) && (filterData.to_date) && (filterData.status) && (filterData.from)) ||
            (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && !(filterData.status) && !(filterData.from)) ||
            ((filterData.date_type) && (filterData.from_date) && (filterData.to_date) && !(filterData.status) && (filterData.from)) ||
            (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && !(filterData.status) && (filterData.from)) ||
            (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && (filterData.status) && !(filterData.from)) ||
            (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && (filterData.status) && (filterData.from))) {
            // alert("Sent the Request");
            this.loadOrderList(this.state.filterData)
        }
        else {
            let filterDataValidation = this.state.filterDataValidation;

            if (!(filterData.date_type)) {
                filterDataValidation.date_type = false;
            }
            if (!(filterData.from_date)) {
                filterDataValidation.from_date = false;
            }
            if (!(filterData.to_date)) {
                filterDataValidation.to_date = false;
            }

            this.setState({ filterDataValidation })
            alert("Sent the Request");
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
            this.loadOrderList(this.state.filterData)
        })
    }

    async reorder() {

        const d = new Date();
        let items = []
        let orderItems = await PharmacyOrderService.getOrderItems({ order_exchange_id: this.state.orderToReOrder.id })
        if (orderItems.status) {
            console.log("Order Item Data", orderItems.data.view.data)
            // items = orderItems.data.view.data
        }

        orderItems.data.view.data.map((i) => {
            items.push({
                request_quantity: i.request_quantity,
                item_id: i.item_id,
                date: d.toISOString()

            })
        })

        let body = {

            from: this.state.orderToReOrder.from,
            to: this.state.orderToReOrder.to,
            created_by: this.state.orderToReOrder.created_by,
            type: "Order",
            // order_id: "ecb86814-4ec8-45d4-be5c-fc36f5b10c22",
            required_date: this.state.orderReqDate,

            // status: "Active",
            item_list: items

        }

        let res = await PharmacyOrderService.orderReOrdering(body)
        console.log("res.data.reorder", res.data);
        if (res.status) {
            if (res.data.posted == "data has been added successfully.") {
                this.setState({
                    // Loaded: true,
                    alert: true,
                    message: 'Re-Ordered Succesfully',
                    severity: 'success',
                })
            }
            this.loadOrderList(this.state.filterData)
        } else {
            this.setState(
                { alert: true, message: "Order Could Not be Re-Ordered. Please Try Again", severity: 'error' }
            )
        }


    }

    async removeOrder() {
        this.setState({ Loaded: false })
        let res = await PharmacyOrderService.delOrder(this.state.orderToDelete)
        console.log("res.data", res.data);
        if (res.status) {
            if (res.data.view == "data deleted successfully.") {
                this.setState({
                    Loaded: true,
                    alert: true,
                    message: res.data.view,
                    severity: 'success',
                })
            }
            this.loadOrderList(this.state.filterData)
        } else {
            this.setState(
                { alert: true, message: "Order Could Not be Deleted. Please Try Again", severity: 'error' }
            )
        }

    }


    async loadOrderList(filters) {

        this.setState({ Loaded: false })
        let res = await PharmacyOrderService.getAllOrders(filters);
        if (res.status) {
            console.log("this.state.getAllOrders", res.data.view.data);
            this.setState({
                data: res.data.view.data,
                Loaded: true,
                all_orders: res.data.view.totalItems ? res.data.view.totalItems : 0,
                totalItems: res.data.view.totalItems
            }, () => {
                this.render()
            })

        } else {
            console.log(res.status);
        }

    }

    async loadDrugStoreData() {
        //Fetch department data
        let res = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        if (200 == res.status) {
            this.setState({
                drugStoreData: res.data.view.data,
            })
            console.log("this.state.drugStoreData", this.state.drugStoreData);
        }
    }

    componentDidMount() {

        this.loadWarehouses()
        this.loadDrugStoreData()
        this.loadOrderList(this.state.filterData)


    }


    render() {
        return (
            <Fragment>

                <ValidatorForm
                    className=""
                    onSubmit={() => this.SubmitAll()}
                    onError={() => null}>

                    <Grid container>

                        <Grid item lg={12} md={12} sm={12} xs={12} style={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                            <h2>No of All Orders : {this.state.all_orders}</h2>
                        </Grid>

                    </Grid>
                    <Grid container className='mt-5'>
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title={"Status"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={[{ value: "ORDERED" }, { value: "APPROVED" }, { value: "REJECTED" }, { value: "ISSUED" }, { value: "RECEIVED" }, { value: "COMPLETED" }, { value: "Pending" }]}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) => option.value}
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.status = true;

                                        filterData.status = value.value
                                        this.setState({ filterDataValidation })

                                    } else {
                                        filterData.status = null
                                    }
                                    this.setState({ filterData })
                                }}

                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Status"
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
                            {
                                this.state.filterDataValidation.status ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>
                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title={"Warehouse / Order From"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.drugStoreData}
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

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.to = true;

                                        filterData.drug_store_id = value.id
                                        filterData.to = value.id

                                        this.setState({ filterDataValidation })


                                    } else {
                                        filterData.to = null
                                    }
                                    this.setState({ filterData })

                                }}
                                value={this.state.drugStoreData.find((v) =>
                                    v.id == this.state.filterData.drug_store_id
                                )}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Warehouse / Order From"
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
                            {
                                this.state.filterDataValidation.to ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title={"Date Range"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={[{ label: "Requested Date", value: "REQUESTED DATE" }, { label: "Required Date", value: "REQUIRED DATE" }, { label: "Allocated Date", value: "ALLOCATED DATE" }, { label: "Issued Date", value: "ISSUED DATE" }, { label: "Received Date", value: "RECEIVED DATE" }]}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) => option.label}
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }

                                onChange={(event, value) => {
                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.date_type = true;

                                        filterData.date_type = value.value

                                        this.setState({ filterDataValidation })

                                    } else {
                                        filterData.date_type = null
                                    }
                                    this.setState({ filterData })
                                }}

                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Date Range"
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
                            {
                                this.state.filterDataValidation.date_type ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }

                        </Grid>

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title="Date Range (From)" />
                            <DatePicker
                                className="w-full"
                                value={
                                    this.state.filterData.from_date
                                }
                                placeholder="Date Range (From)"
                                // minDate={new Date()}
                                maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {
                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.from_date = true;

                                        filterData.from_date = date.toISOString()

                                        this.setState({ filterDataValidation })

                                    } else {
                                        filterData.from_date = null
                                    }

                                    this.setState({
                                        filterData,
                                    })
                                    console.log("filterData", this.state.filterData);
                                }}
                            />
                            {
                                this.state.filterDataValidation.from_date ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }
                        </Grid>

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title="Date Range (to)" />
                            <DatePicker
                                className="w-full"

                                value={
                                    this.state.filterData.to_date
                                }
                                placeholder="Date Range (To)"
                                // minDate={new Date()}
                                // maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.to_date = true;

                                        filterData.to_date = date.toISOString()

                                        this.setState({ filterDataValidation })

                                    } else {
                                        filterData.to_date = null
                                    }

                                    this.setState({
                                        filterData,
                                    })
                                    console.log("filterData", this.state.filterData);
                                }}
                            />
                            {
                                this.state.filterDataValidation.to_date ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }
                        </Grid>

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title={"Order Type"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={[{ label: "Normal Order", value: "normal" }, { label: "Special Order", value: "special" }]}
                                /*  defaultValue={dummy.find(
                                     (v) => v.value == ''
                                 )} */
                                getOptionLabel={(option) => option.label}
                                getOptionSelected={(option, value) =>
                                    console.log("ok")
                                }
                                onChange={(event, value) => {

                                    let filterData = this.state.filterData
                                    if (value != null) {

                                        // let filterDataValidation = this.state.filterDataValidation;
                                        // filterDataValidation.date_type = true;

                                        filterData.special_normal_type = value.value

                                        // this.setState({ filterDataValidation })

                                    } else {
                                        filterData.special_normal_type = null
                                    }
                                    this.setState({ filterData })
                                }}

                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Order Type"
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
                            {/* {
                                this.state.filterDataValidation.date_type ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            } */}

                        </Grid>

                        <Grid item lg={1} md={1} sm={1} xs={1} className="px-2" >
                            <Button
                                className="mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => this.handleFilterButton()}
                            >
                                <span className="capitalize">Filter</span>
                            </Button>
                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2}>

                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: 'flex', flexDirection: 'column' }}>

                            <TextValidator
                                className='w-full mt-5 pl-2'
                                placeholder="Order ID"
                                //variant="outlined"
                                // fullWidth="fullWidth" 
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
                                        filterData.search = null
                                    }

                                    this.setState({ filterData })

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
                        <Grid item lg={1} md={1} sm={1} xs={1} className="text-right px-2">
                            <Button
                                className="text-right mt-6"
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
                <Grid container className="mt-5 pb-3">
                    <Grid item lg={12} md={12} sm={12} xs={12} >
                        {
                            this.state.Loaded ?
                                <>
                                    <LoonsTable

                                        //title={"All Aptitute Tests"}
                                        id={'all_orders_order_details'}
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

                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(
                                                    action,
                                                    tableState
                                                )
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
                                </>
                                : (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )
                        }

                    </Grid>
                </Grid>
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
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="delete"
                                        onClick={() => {
                                            this.setState({ orderDeleteWarning: false });
                                            this.removeOrder()
                                        }}>
                                        <span className="capitalize">Delete</span>
                                    </Button>

                                    <Button
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon={<CancelIcon fontSize='small' />}
                                        onClick={() => {
                                            this.setState({ orderDeleteWarning: false });
                                        }}>
                                        <span className="capitalize">Cancel</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>
                <Dialog
                    maxWidth="lg"
                    open={this.state.orderReOrderWarning}
                    onClose={() => {
                        this.setState({ orderReOrderWarning: false , orderReqDate:null })
                    }}>
                    <div className="w-full h-full px-5 py-5">

                        <CardTitle title="Are you sure you want to Re-Order ?"></CardTitle>
                        <div>
                            <p>This order will be Re-order with existing order items.</p>
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end'
                                }}>
                                <Grid item lg={12} md={12} sm={12} xs={12} className="px-2 mb-3">
                                    <SubTitle title="Required Date" />
                                    <DatePicker
                                        className="w-full"
                                        value={
                                            this.state.orderReqDate
                                        }
                                        placeholder="Required Date"
                                        minDate={new Date()}
                                        // maxDate={new Date()}
                                        // required={true}
                                        // errorMessages="this field is required"
                                        onChange={(date) => {
                                            // let filterData = this.state.filterData
                                            if (date) {
                                                console.log(date)
                                                let filterDataValidation = this.state.filterDataValidation;
                                                filterDataValidation.orderReqDate = true;

                                                this.state.orderReqDate = date.toISOString()

                                                this.setState({ filterDataValidation })

                                            } else {
                                                this.state.orderReqDate = null
                                            }

                                            // this.setState({
                                            //     filterData,
                                            // })
                                            // console.log("filterData", this.state.filterData);
                                        }}
                                    />
                                    {
                                        this.state.filterDataValidation.orderReqDate ?
                                            ("") :
                                            (<span style={{ color: 'red' }}>this field is required</span>)
                                    }
                                </Grid>
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
                                        style={{ height: '30px', fontSize: '11px' }}
                                        // startIcon="delete"
                                        onClick={() => {
                                            if(this.state.orderReqDate){
                                                this.setState({ orderReOrderWarning: false });
                                                this.reorder()
                                            }else{
                                                let filterDataValidation = this.state.filterDataValidation;
                                                filterDataValidation.orderReqDate = false;
                                                this.setState({ filterDataValidation });
                                            }

                                        }}>
                                        <span className="capitalize">Re-Order</span>
                                    </Button>

                                    <Button
                                        className="mt-2 ml-1"
                                        progress={false}
                                        type="submit"
                                        style={{ height: '30px', fontSize: '11px' }}
                                        startIcon={<CancelIcon fontSize='small' />}
                                        onClick={() => {
                                            this.setState({ orderReOrderWarning: false , orderReqDate:null});
                                        }}>
                                        <span className="capitalize">Cancel</span>
                                    </Button>
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

export default (AllOrder_OrderDetails)