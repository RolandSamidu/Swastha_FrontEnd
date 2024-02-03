import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import PharmacyService from 'app/services/PharmacyService'
import CancelIcon from '@material-ui/icons/Cancel';
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
    InputAdornment,
    IconButton,
    Icon,
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
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from "app/services/WarehouseServices";
import { element } from 'prop-types'
import { dateParse } from 'utils'

const styleSheet = (theme) => ({})

class ToBeApproved extends Component {
    constructor(props) {
        super(props)
        this.state = {

            Loaded: false,
            totalItems: 0,
            all_placed_orders: 0,

            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],

            orderDeleteWarning: false,
            orderToDelete: null,

            alert: false,
            message: '',
            severity: 'success',

            filterData: {

                status: ['ORDERED'],
                // status: 'Pending',
                date_type: null,
                from_date: null,
                to_date: null,
                from: null,
                limit: 10,
                page: 0,
                search: null,

            },

            filterDataValidation: {
                date_type: true,
                from_date: true,
                to_date: true,
                search: true
            },

            // filterData: {
            //     search: null
            // },

            data: [],
            columns: [
                /* {
                    name: 'id',
                    label: 'id',
                    options: {
                        display: false,
                    },
                }, */
                {
                    // name: 'requested_date',
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
                    name: 'order_id',
                    label: 'Order ID',
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
                    name: 'drug_store',
                    label: 'Drug Store',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].toStore.name
                            )
                        },
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
                    },
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
                                    <Tooltip title='Edit Order List'>
                                        <IconButton
                                            className="text-black mr-1"
                                            onClick={() => {
                                                window.location = "/order/create?orderID=" + this.state.data[tableMeta.rowIndex].id
                                            }}
                                        >
                                            <Icon>mode_edit_outline</Icon>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title='Delete Order'>
                                        <IconButton
                                            className="text-black mr-1"
                                            onClick={() => {
                                                this.setState({
                                                    orderDeleteWarning: true,
                                                    orderToDelete: this.state.data[tableMeta.rowIndex].id
                                                })
                                            }}
                                        >
                                            <Icon>delete</Icon>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title='View Order'>
                                        <IconButton
                                            className="text-black"
                                            onClick={() => this.viewIndividualOrder(
                                                this.state.data[tableMeta.rowIndex].id,
                                                this.state.data[tableMeta.rowIndex].Delivery ?
                                                   this.state.data[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                            )}
                                        >
                                            <Icon>visibility</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                        },
                    },
                },
            ],
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
            console.log();
            this.setState(
                { alert: true, message: "Order Could Not be Deleted. Please Try Again", severity: 'error' }
            )
        }

    }

    async handleFilterButton() {

        let filterData = this.state.filterData;

        if ((filterData.date_type) && (filterData.from_date) && (filterData.to_date) ||
            !(filterData.date_type) && !(filterData.from_date) && !(filterData.to_date)) {
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
        }

    }

    viewIndividualOrder(id, pickUpPersonID) {
        window.location = `/RMSD/AllItems/${id}?pickUpPersonID=${pickUpPersonID}`;
    }

    async loadOrderList(filters) {

        this.setState({ Loaded: false })
        let res = await PharmacyOrderService.getAllOrders(filters);
        if (res.status) {

            this.setState({
                data: res.data.view.data,
                Loaded: true,
                all_placed_orders: res.data.view.totalItems ? res.data.view.totalItems:0,
                totalItems: res.data.view.totalItems
            }, () => {
                this.render()
            })

        } else {
            console.log(res.status);
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
            console.log("this.state.selected_warehouse",this.state.selected_warehouse)
            console.log("filterData.from",this.state.filterData.from)
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

    componentDidMount() {

        this.loadWarehouses()
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
                        <Grid lg={12} md={12} sm={12} xs={12} style={{ textAlign: 'end' }} className='pr-5'>
                            <h3>No of All Placed Orders : {this.state.all_placed_orders}</h3>
                        </Grid>

                        <Grid item lg={2} md={2} sm={2} xs={2} className="px-2">
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

                                        filterData.date_type = value.value;

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
                                    // validators={[
                                    //     'required',
                                    // ]}
                                    // errorMessages={[
                                    //     'this field is required',
                                    // ]}
                                    />
                                )}
                            />
                            {
                                this.state.filterDataValidation.date_type ?
                                    ("") :
                                    (<span style={{ color: 'red' }}>this field is required</span>)
                            }


                        </Grid>

                        <Grid item lg={2} md={2} sm={2} xs={2} className="px-2">
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

                                        filterData.from_date = date;

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

                        <Grid item lg={2} md={2} sm={2} xs={2} className="px-2">
                            <SubTitle title="Date Range (to)" />
                            <DatePicker
                                className="w-full"

                                value={
                                    this.state.filterData.to_date
                                }
                                placeholder="Date Range (To)"
                                // minDate={new Date()}
                                maxDate={new Date()}
                                // required={true}
                                // errorMessages="this field is required"
                                onChange={(date) => {
                                    let filterData = this.state.filterData
                                    if (date) {
                                        let filterDataValidation = this.state.filterDataValidation;
                                        filterDataValidation.to_date = true;

                                        filterData.to_date = date;

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
                            <>
                                {
                                    this.state.filterDataValidation.to_date ?
                                        ("") :
                                        (<span style={{ color: 'red' }}>this field is required</span>)
                                }
                            </>


                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2} className="text-left px-2">
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
                        <Grid item lg={1} md={1} sm={1} xs={1} ></Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2} style={{ display: 'flex', flexDirection: 'column' }}>

                            <TextValidator
                                className='w-full mt-5'
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
                        <Grid item lg={1} md={1} sm={1} xs={1} className="text-left px-2">
                            <Button
                                className="text-left px-2 mt-6"
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
                <Grid container className="mt-4 pb-5">
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {
                            this.state.Loaded ?
                                <>
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}

                                        id={'toBeApproved'}
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
                                </> :
                                (
                                    //load loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress
                                            size={30}
                                        />
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
                                        startIcon={<CancelIcon />}
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

export default withStyles(styleSheet)(ToBeApproved)