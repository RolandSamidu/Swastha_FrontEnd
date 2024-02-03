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
    TextField
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
import UndoOutlinedIcon from '@material-ui/icons/UndoOutlined';
import { dateParse, dateTimeParse } from 'utils'
import ClinicService from 'app/services/ClinicService'

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
            pharmacy_list:[],

            userRoles:null,
            pharmacy_data:[],

            alert: false,
            message: '',
            severity: 'success',

            filterData: {

                status: null,
                date_type: null,
                from_date: null,
                to_date: null,
                // to: '600329c7-f99f-4f04-9f7c-240090526aee',
                from: null,
                // from: this.state.selected_warehouse,
                to: null,
                'order[0]': [
                    'createdAt', 'DESC'
                ],
                type: this.props.type,
                limit: 10,
                page: 0,
                search: null,
                to_owner_id: null,
            },

            filterDataValidation: {
                date_type: true,
                from_date: true,
                to_date: true,
                search: true,
                to: true,
                status: true,
                orderReqDate: true,

            },

            // pharmacy_list:[],

            // filterData: {
            //     search: null,
            // },

            data: [],
            columns: [

                {
                    name: 'drug_store',
                    label: 'Institution',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex].toStore.name)
                        }

                    }

                }, {
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
                }, {
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
                }, {
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
                    label: 'Issued Date',
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
                },
                {
                    name: 'book_no',
                    label: 'Reference No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    <p>BK {this.state.data[tableMeta.rowIndex].book_no} / F {this.state.data[tableMeta.rowIndex].page_no}</p>
                                </>
                            )
                        }
                    }
                },
                {
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
                                                            <Icon color="error">delete</Icon>
                                                        </IconButton>
                                                        <IconButton
                                                            // className="text-black"
                                                            onClick={() => this.viewIndividualOrder(
                                                                this.state.data[tableMeta.rowIndex].id,
                                                                this.state.data[tableMeta.rowIndex].Delivery ?
                                                                    this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                            )}
                                                        >
                                                            <Icon color="primary">visibility</Icon>
                                                        </IconButton>
                                                    </div>
                                                </>
                                            )
                                            : (
                                                tableMeta.rowData[2] == "REJECTED" || tableMeta.rowData[2] == "SYSTEM REJECTED"
                                                    ? (
                                                        <>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                {/* < Button className="ml-3" progress={false} scrollToTop={false}
                                                                    style={{ height: '30px' }}
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
                                                                </Button> */}

                                                                <Tooltip title="Re-order">
                                                                    <IconButton
                                                                        className="text-black"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                orderReOrderWarning: true,
                                                                                orderToReOrder: this
                                                                                    .state
                                                                                    .data[tableMeta.rowIndex]

                                                                            })
                                                                        }}>
                                                                        <UndoOutlinedIcon/>
                                                                    </IconButton>
                                                                </Tooltip>


                                                                <IconButton
                                                                    className="text-black"
                                                                    onClick={() => this.viewIndividualOrder(
                                                                        this.state.data[tableMeta.rowIndex].id,
                                                                        this.state.data[tableMeta.rowIndex].Delivery ?
                                                                            this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                                                    )}>
                                                                    <Icon color="primary">visibility</Icon>
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
                                                                    <Icon color="primary">visibility</Icon>
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
        window.location = `/hospital-ordering/all-items/${id}?pickUpPersonID=${pickUpPersonID}`;
    }

    handleSearchButton() {

        let filterData = this.state.filterData;

        if (filterData.search) {
            // alert("Sent the Request")
            this.loadOrderList()
        }
        else {

            let filterDataValidation = this.state.filterDataValidation;

            if (!(filterData.search)) {
                filterDataValidation.search = false;
            }

            this.setState({ filterDataValidation })
        }


    }

    // async handleFilterButton() {

    //     console.log("this.state.filterData", this.state.filterData);

    //     let filterData = this.state.filterData;

    //     if (((filterData.date_type) && (filterData.from_date) && (filterData.to_date) && (filterData.status) && (filterData.from)) ||
    //         (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && !(filterData.status) && !(filterData.from)) ||
    //         ((filterData.date_type) && (filterData.from_date) && (filterData.to_date) && !(filterData.status) && !(filterData.from)) ||
    //         (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && !(filterData.status) && (filterData.from)) ||
    //         (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && (filterData.status) && !(filterData.from)) ||
    //         (!(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date) && (filterData.status) && (filterData.from))) {
    //         // alert("Sent the Request");
    //         this.loadOrderList(this.state.filterData)
    //     }
    //     else {
    //         let filterDataValidation = this.state.filterDataValidation;

    //         if (!(filterData.date_type)) {
    //             filterDataValidation.date_type = false;
    //         }
    //         if (!(filterData.from_date)) {
    //             filterDataValidation.from_date = false;
    //         }
    //         if (!(filterData.to_date)) {
    //             filterDataValidation.to_date = false;
    //         }

    //         this.setState({ filterDataValidation })
    //     }

    // }

    async loadPharmacy() {

        let user_roles = await localStorageService.getItem("userInfo").roles
        let filterData = {
            page: 0,
            limit: 9999,
            issuance_type: ['pharmacy', 'drug_store'],
        }
        let owner_id = await localStorageService.getItem('owner_id')

        let allClinics = await PharmacyService.getPharmacy(owner_id, filterData)
        if (allClinics.status == 200) {
            console.log(allClinics)
            this.setState({
                pharmacy_data: allClinics.data.view.data,
                userRoles:user_roles
            })
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
            this.loadOrderList()
        })
    }

    async reorder() {

        const d = new Date();
        let items = []
        let orderItems = await PharmacyOrderService.getOrderItems({ order_exchange_id: this.state.orderToReOrder.id })
        if (orderItems.status) {
            console.log("Order Item Data", orderItems.data.view.data)
            // items = orderItems.data.view.data
            //OrderExchange.type
        }

        orderItems.data.view.data.map((i) => {
            items.push({
                request_quantity: i.request_quantity,
                item_id: i.item_id,
                type:"Sales Order",
                date: dateParse(d)

            })
        })

        let body = {

            from: this.state.orderToReOrder.from,
            to: this.state.orderToReOrder.to,
            created_by: this.state.orderToReOrder.created_by,
            type: this.props.type,
            
            // order_id: "ecb86814-4ec8-45d4-be5c-fc36f5b10c22",
            required_date: this.state.orderReqDate,

            status: "Active",
            item_list: items

        }

        console.log("order data body",body)

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
            this.loadOrderList()
        } else {
            this.setState(
                { alert: true, message: "Order Could Not be Re-Ordered. Please Try Again", severity: 'error' }
            )
        }


    }

    async removeOrder() {
        this.setState({ Loaded: false })
        let res = await PharmacyOrderService.deleteOrder(this.state.orderToDelete)
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
            this.loadOrderList()
        } else {
            this.setState(
                { alert: true, message: "Order Could Not be Deleted. Please Try Again", severity: 'error' }
            )
        }

    }


    async loadOrderList() {

        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo')
        let params = this.state.filterData
        if (user.roles[0] === 'NMQAL Pharmacist'){
            params.type = ['Order','SAMPLE']
        }
        let res = await PharmacyOrderService.getAllOrders(params);
        if (res.status) {
            console.log("this.state.getAllOrders", res.data.view.data);
            this.setState({
                data: res.data.view.data,
                Loaded: true,
                all_orders: res.data.view.totalItems,
                totalItems: res.data.view.totalItems
            }, () => {
                this.render()
            })

        } else {
            console.log(res.status);
        }

    }

    async getPharmacyDetails(search){

        let params ={
            limit:500,
            page:0,
            issuance_type:['Hospital','RMSD Main','MSD Main'],
            search:search 
        }

        let res = await ClinicService.fetchAllClinicsNew(params, null);

        if (res.status == 200) {
            console.log('phar', res)

            this.setState({
                pharmacy_list:res.data.view.data
            })
        }
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
    }

    // async getPharmacyDetails(search) {
    //     let params = {
    //         limit: 500,
    //         page: 0,
    //         issuance_type: ['Hospital', 'RMSD Main'],
    //         search: search
    //     };

    //     let res = await ClinicService.fetchAllClinicsNew(params, null);

    //     if (res.status === 200) {
    //         console.log('phar------------------>>>>> check', res);

    //         this.setState({
    //             pharmacy_list: res.data.view.data
    //         });
    //     }
    // }

    componentDidMount() {

        this.loadWarehouses()
        this.loadDrugStoreData()
        this.loadOrderList()
        this.loadPharmacy()

        console.log('order type',this.props.type)


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

                    <Grid item="item" className="px-2" lg={3} md={3} sm={3} xs={3}>
                            <SubTitle title="Institution" />
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.pharmacy_list || []} 
                                onChange={(e, value) => {
                                    if (value != null) {
                                        let formData = this.state.filterData
                                        formData.to_owner_id = value.owner_id;
                                        this.setState({ formData });
                                    } else {
                                        let formData = this.state.filterData
                                        formData.to_owner_id = null;
                                        this.setState({ formData });
                                    }
                                }}
                                value={
                                    this.state.all_pharmacy &&
                                    this.state.all_pharmacy.find((v) => v.owner_id === this.state.filterData.to_owner_id)
                                }
                                getOptionLabel={(option) => (option && option.name ? (option.name + ' - ' + option?.Department?.name) : '')}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Institution"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            if (e.target.value.length > 3) {
                                                this.getPharmacyDetails(e.target.value);
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        {this.state.userRoles !== 'MSD MSA' || this.state.userRoles !== 'RMSD OIC' || this.state.userRoles !== 'RMSD MSA' 
                || this.state.userRoles !== 'RMSD Pharmacist' || this.state.userRoles !== 'RMSD Distribution Officer' ? (
                        <Grid item lg={3} md={3} sm={3} xs={3}>
                                    <SubTitle title="Pharmacy" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.pharmacy_data}
                                        getOptionLabel={(option) =>
                                            option.name != null
                                                ? option.name
                                                : null
                                        }
                                        onChange={(e, value) => {
                                            if (value == null) {
                                                let incommingFilters =
                                                    this.state.filterData
        
                                                incommingFilters.to = null
                                                this.setState({
                                                    incommingFilters,
                                                })
                                            } else {
                                                let incommingFilters =
                                                    this.state.filterData
                                                incommingFilters.to = value.id
                                                this.setState({
                                                    incommingFilters,
                                                })
                                            }
                                        }}
                                        //value={this.state.pharmacy_data.find((obj) => obj.id == this.state.incommingFilters.)}

                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Pharmacy"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    /> 
                                </Grid>
                            ) : null}

                        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2">
                            <SubTitle title={"Status"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={[{ value: "ORDERED" }, { value: "Pending" }, { value: "Pending Approval" }, { value: "APPROVED" }, { value: "REJECTED" }, { value: "SYSTEM REJECTED" }, { value: "ISSUED" }, { value: "RECEIVED" }, { value: "COMPLETED" }, { value: "Pending" }]}
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
                            <SubTitle title={"Drug Store"}></SubTitle>
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.drugStoreData.sort((a, b) => (a.name?.localeCompare(b.name)))}
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
                                // maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {
                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.from_date = true;

                                        filterData.from_date = date

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
                                minDate={this.state.filterData.from_date}
                                maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {

                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.to_date = true;

                                        filterData.to_date = date

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
                            <SubTitle title="Vehicle Number" />
                            <TextValidator
                                className='w-full'
                                placeholder="Exp- LP-3428"
                                //variant="outlined"
                                // fullWidth="fullWidth" 
                                variant="outlined"
                                size="small"
                                value={this.state.filterData.vehicle_no}
                                onChange={(e, value) => {

                                    let filterData = this.state.filterData
                                    if (e.target.value) {

                                        // let filterDataValidation = this.state.filterDataValidation;
                                        // filterDataValidation.vehicle_no = true;

                                        filterData.vehicle_no = e.target.value;

                                        this.setState({ filterData })

                                    } else {
                                        filterData.vehicle_no = null
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
                                this.state.filterDataValidation.to_date ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }
                        </Grid>
                        <Grid item lg={1} md={1} sm={1} xs={1} className="px-2" >
                            <Button
                                className="mt-6"
                                progress={false}
                                scrollToTop={false}
                                // type='submit'
                                startIcon="search"
                                onClick={() => this.setPage(0)}
                            >
                                <span className="capitalize">Filter</span>
                            </Button>
                        </Grid>
                        {/* <Grid item lg={5} md={5} sm={5} xs={5}>

                        </Grid> */}
                        <Grid container>

                        
                        <Grid item lg={3} md={3} sm={3} xs={3} >

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
                        this.setState({ orderReOrderWarning: false, orderReqDate: null })
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

                            
                                                this.setState({ filterDataValidation,orderReqDate:dateParse(date) })

                                            } else {
                                                this.setState({orderReqDate:null})
                                                
                                            }

                                            // this.setState({
                                            //     filterData,
                                            // })
                                            // console.log("filterData", this.state.filterData);
                                        }}
                                    />
                                    {
                                        this.state.orderReqDate ?
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
                                            if (this.state.orderReqDate) {
                                                this.setState({ orderReOrderWarning: false });
                                                this.reorder()
                                            } else {
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
                                            this.setState({ orderReOrderWarning: false, orderReqDate: null });
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