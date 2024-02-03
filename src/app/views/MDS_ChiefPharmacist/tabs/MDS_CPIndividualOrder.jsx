import {
    CircularProgress,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography
} from "@material-ui/core";
import { CardTitle, LoonsCard, LoonsSnackbar, LoonsTable, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import React from "react";
import { Component } from "react";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import { Autocomplete } from "@material-ui/lab";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import LoonsButton from "app/components/LoonsLabComponents/Button";
import SearchIcon from '@material-ui/icons/Search';
import ChiefPharmacistServices from "app/services/ChiefPharmacistServices";
import PharmacyOrderService from "app/services/PharmacyOrderService";
import WarehouseServices from "app/services/WarehouseServices";
import CategoryService from "app/services/datasetupServices/CategoryService";
import ClassDataSetupService from "app/services/datasetupServices/ClassDataSetupService";
import GroupSetupService from "app/services/datasetupServices/GroupSetupService";
import localStorageService from "app/services/localStorageService";
import { dateParse } from 'utils'

class MDS_CPIndividualOrder extends Component {

    constructor(props) {
        super(props)
        this.state = {
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            all_drug_stores: [],
            all_status: [
                {
                    id: 1,
                    name: 'ALLOCATED'
                }, {
                    id: 2,
                    name: 'APPROVED'
                }, {
                    id: 3,
                    name: 'COMPLETED'
                }, {
                    id: 4,
                    name: 'ISSUED'
                }, {
                    id: 5,
                    name: 'ORDERED'
                }, {
                    id: 6,
                    name: 'RECIEVED'
                }, {
                    id: 7,
                    name: 'REJECTED'
                }
            ],
            formData: {
                ven_id: null,
                item_class_id: null,
                item_category: null,
                status: null,
                item_group: null,
                drug_store: null,
                search: null,
                order_exchange_id: this.props.match.params.id
            },
            remarks: null,
            data: [],
            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .itemTable[tableMeta.rowIndex]
                                .ItemSnap
                                .sr_no
                        }
                    }
                }, {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .itemTable[tableMeta.rowIndex]
                                .ItemSnap
                                .short_description
                        }
                    }
                }, {
                    name: 'dosage',
                    label: 'Dosage',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .itemTable[tableMeta.rowIndex]
                                .ItemSnap
                                .strength
                        }
                    }
                }, {
                    name: 'ordered_qty',
                    label: 'Ordered Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .itemTable[tableMeta.rowIndex]
                                .request_quantity
                        }
                    }
                }, {
                    name: 'drugstore_qty',
                    label: 'Drug Store Qty',
                    options: {
                        display: true
                    }
                }, {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true
                    }
                }
            ],
            totalItems: null,
            loaded: false,
            itemTable: [],
            approveOrder: {
                order_exchange_id: this.props.match.params.id,
                activity: "ordered",
                date: null,
                status: "APPROVED",
                remark_id: null,
                remark_by: null,
                type: "APPROVED",
            }
        }
    }

    componentDidMount() {
        this.loadData()
        this.LoadOrderItemDetails()
    }

    async LoadOrderItemDetails() {
        this.setState({ loaded: false })
        let res = await PharmacyOrderService.getOrderItems(this.state.formData)
        if (res.status) {
            console.log("Order Item Data", res.data.view.data)
            this.setState({
                itemTable: res.data.view.data,
                loaded: true
            }, () => {
                this.render()
                console.log("State ", this.state.itemTable)
            })
        }
    }

    async loadData() {
        let orders = await ChiefPharmacistServices.getSingleOrder({ limit: 99999 }, this.props.match.params.id)
        if (orders.status == 200) {
            console.log('Order Details', orders.data.view)
            this.setState({ data: orders.data.view })
        }

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
        let class_res = await ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }

        let warehouses = await WarehouseServices.getWarehoure()
        if (warehouses.status == 200) {
            console.log('Warehouses', warehouses.data.view.data)
            this.setState({ all_drug_stores: warehouses.data.view.data })
        }

        const user = await localStorageService.getItem('userInfo')
        this.state.approveOrder.remark_by = user.id
    }

    async approveOrder() {
        let approveOrder = this.state.approveOrder;
        approveOrder.date = dateParse(new Date())

        let approve = await ChiefPharmacistServices.approveOrder(approveOrder)
        if (approve.status == 201) {
            console.log(approve.data)
            if (approve.data.posted == "data has been added successfully.") {
                this.setState({ alert: true, severity: 'success', message: "Order Status Changed" })
                window.location = '/chiefPharmacist/AllOders'
            } else {
                this.setState({ alert: true, severity: 'error', message: "Order Status Cannot Changed" })
            }
        }
    }

    render() {

        return (
            <MainContainer>
                <LoonsCard>
                    <Grid container="container" lg={12} md={12}>
                        <Grid item="item" lg={6} md={6} xs={6}>
                            <Grid itemm="itemm" xs={12}>
                                <Typography variant="h4" className="font-semibold">Individual Order</Typography>
                            </Grid>
                            <div
                                style={{
                                    // display: 'flex'
                                }}>
                                <Grid item="item" lg={12} xs={12}>
                                    <Typography className="font-semibold">Order ID : {
                                        this.state.loaded
                                            ? this.state.data.order_id
                                            : ''
                                    }</Typography>
                                </Grid>
                                <Grid item="item" lg={6} xs={12}>
                                    <Typography className="font-semibold">Drug Store: {
                                        // this.state.loaded
                                        //     ? this.state.data.fromStore.name : ''
                                        'Pharmacy 1'
                                    }</Typography>
                                </Grid>
                                {/* <Grid item="item" lg={12} xs={12}>
                                    <Typography className="font-semibold">Pick-Up Person ID: {this.state.loaded ?this.state.data.Employee.id : ''}</Typography>
                                </Grid> */
                                }
                                {/* <Grid item="item" lg={6} xs={12}>
                                    <Typography className="font-semibold">Name: {
                                            this.state.loaded
                                                ? this.state.data.Employee.name
                                                : ''
                                        }</Typography>
                                </Grid> */
                                }
                            </div>
                        </Grid>
                        <Grid item="item" lg={3} md={3} xs={3}>
                            <Grid container="container" lg={12} md={12} xs={12}>
                                <Grid item="item" lg={12} md={12} xs={12}>
                                    <Typography variant="h6" className="font-semibold text-center">Vehicle</Typography>
                                </Grid>
                                <Grid item="item" lg={12} md={12} xs={12}>
                                    <Grid
                                        container="container"
                                        style={{
                                            alignItems: 'center'
                                        }}>
                                        <Grid item="item" lg={6} md={6} xs={6}>
                                            <Grid container="container" lg={12} md={12} xs={12}>
                                                <Grid item="item" lg={6} md={6} xs={6}>ID :</Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}><Typography className="font-semibold">0004</Typography></Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>Type : </Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>
                                                    <Typography className="font-semibold">Light Truck</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item="item" lg={2} md={2} xs={2}><AirportShuttleIcon fontSize="medium" /></Grid>
                                        <Grid item="item" lg={3} md={3} xs={3}><LoonsButton>Change</LoonsButton></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item="item" lg={3} md={3} xs={3}>
                            <Grid container="container" lg={12} md={12} xs={12}>
                                <Grid item="item" lg={12} md={12} xs={12}>
                                    <Typography variant="h6" className="font-semibold text-center">Custodian</Typography>
                                </Grid>
                                <Grid item="item" lg={12} md={12} xs={12}>
                                    <Grid
                                        container="container"
                                        style={{
                                            alignItems: 'self-start'
                                        }}>
                                        <Grid item="item" lg={6} md={6} xs={6}>
                                            <Grid container="container" lg={12} md={12} xs={12}>
                                                <Grid item="item" lg={6} md={6} xs={6}>ID :</Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}><Typography className="font-semibold">00002</Typography></Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>Name : </Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>
                                                    <Typography className="font-semibold">{
                                                        this.state.loaded && this.state.data.length != 0
                                                            ? this.state.data.Employee.name
                                                            : ''
                                                    }</Typography>
                                                </Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>Contact No : </Grid>
                                                <Grid item="item" lg={6} md={6} xs={6}>
                                                    <Typography className="font-semibold">0000000000</Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item="item" lg={2} md={2} xs={2}><AccountCircleIcon fontSize="medium" /></Grid>
                                        <Grid item="item" lg={3} md={3} xs={3}><LoonsButton>Change</LoonsButton></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider className='mb-4'></Divider>
                    <Grid container lg={12} md={12} xs={12} style={{ marginBottom: '16px', display: 'flex' }}>
                        <Grid item lg={1} md={1} xs={1}>
                            <Grid container lg={12} md={12} xs={12}>
                                <Grid item lg={12} md={12} xs={12} className='text-center'><h1>{this.state.loaded
                                    ? this.state.data.number_of_items
                                    : ''}</h1></Grid>
                                <Grid item lg={12} md={12} xs={12} className='text-center'>Items</Grid>
                            </Grid>
                        </Grid>
                        <Grid item lg={3} md={3} xs={3}>
                            <Grid container lg={12} md={12} xs={12}>
                                <Grid item lg={12} md={12} xs={12} className='text-center'><h1>1</h1></Grid>
                                <Grid item lg={12} md={12} xs={12} className='text-center'>Not available in Drug Store</Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container="container" spacing={2}>
                        <Grid item="item" xs={12}>
                            <Typography variant="h5" className="font-semibold">Filters</Typography>
                            <Divider></Divider>
                        </Grid>
                    </Grid>
                    <ValidatorForm onSubmit={() => this.LoadOrderItemDetails()} onError={() => null}>
                        <Grid container="container" spacing={2}>
                            <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                <SubTitle title="Ven" />
                                <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_ven} onChange={(e, value) => {
                                    let formData = this.state.formData
                                    if (value != null) {
                                        formData.ven_id = value.id
                                    } else {
                                        formData.ven_id = null
                                    }

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
                                        disableClearable className="w-full" options={this.state.all_item_class} onChange={(e, value) => {

                                    let formData = this.state.formData
                                    if (value != null) {
                                        formData.item_class_id = value.id
                                    } else {
                                        formData.item_class_id = null
                                    }

                                    this.setState({ formData })
                                }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this
                                        .state
                                        .all_item_class
                                        .find((v) => v.id == this.state.formData.item_class_id)} getOptionLabel={(
                                            option) => option.description
                                                ? option.description
                                                : ''} renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Item Class"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                            </Grid>
                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                <SubTitle title="Item Category" />
                                <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_category} onChange={(e, value) => {
                                    let formData = this.state.formData
                                    if (value != null) {
                                        formData.item_category = value.id
                                    } else {
                                        formData.item_category = null
                                    }

                                    this.setState({ formData })
                                }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this
                                        .state
                                        .all_item_category
                                        .find((v) => v.id == this.state.formData.all_item_category)} getOptionLabel={(
                                            option) => option.description
                                                ? option.description
                                                : ''} renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Item Category"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                            </Grid>
                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                <SubTitle title="Status" />
                                <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_status} onChange={(e, value) => {
                                    let formData = this.state.formData
                                    if (value != null) {
                                        formData.status = value.name
                                    } else {
                                        formData.status = null
                                    }

                                    this.setState({ formData })
                                }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this
                                        .state
                                        .all_status
                                        .find((v) => v.id == this.state.formData.status)} getOptionLabel={(
                                            option) => option.name
                                                ? option.name
                                                : ''} renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Status"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                            </Grid>
                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                <SubTitle title="Item Group" />
                                <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_group} onChange={(e, value) => {
                                    let formData = this.state.formData
                                    if (value != null) {
                                        formData.item_group = value.id
                                    } else {
                                        formData.item_group = null
                                    }

                                    this.setState({ formData })
                                }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this
                                        .state
                                        .all_item_group
                                        .find((v) => v.id == this.state.formData.item_group)} getOptionLabel={(
                                            option) => option.description
                                                ? option.description
                                                : ''} renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Item Group"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                            </Grid>
                            <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                <SubTitle title="Drug Store" />
                                <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_drug_stores} onChange={(e, value) => {
                                    let formData = this.state.formData
                                    if (value != null) {
                                        formData.drug_store = value.id
                                    } else {
                                        formData.drug_store = null
                                    }

                                    this.setState({ formData })
                                }}
                                    /*  defaultValue={this.state.all_district.find(
                                    (v) => v.id == this.state.formData.district_id
                                    )} */
                                    value={this
                                        .state
                                        .all_drug_stores
                                        .find((v) => v.id == this.state.formData.drug_store)} getOptionLabel={(
                                            option) => option.name
                                                ? option.name
                                                : ''} renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Drug Store"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                            </Grid>
                            <Grid
                                item="item"
                                lg={1}
                                md={1}
                                sm={12}
                                xs={12}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-end'
                                }}>
                                <LoonsButton className="mt-2" progress={false} type="submit" scrollToTop={true}
                                //onClick={this.handleChange}
                                >
                                    <span className="capitalize">Filter</span>
                                </LoonsButton>
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
                                <SubTitle title='Search' />
                                <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                    //value={this.state.formData.search} 
                                    onChange={(e, value) => {
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
                                            this.LoadOrderItemDetails()
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
                    </ValidatorForm>
                    <Grid container="container" className="mt-2 pb-5">
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {
                                this.state.loaded
                                    ? <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'all_items'} data={this.state.itemTable} columns={this.state.columns} options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            // page: this.state.formData.page,
                                            print: true,
                                            viewColumns: true,
                                            download: true,
                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(tableState.page)
                                                        break
                                                    case 'sort':
                                                        // this.sort(tableState.page, tableState.sortOrder);
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
                    {this.props.match.params.status == 'Pending' ? <ValidatorForm>
                        <Grid container="container" spacing={2}>
                            <Grid item="item" lg={6} xs={12}>
                                <SubTitle title="Remark" />
                                <TextValidator
                                    className="w-full"
                                    placeholder="Remarks"
                                    name="Remarks"
                                    InputLabelProps={{
                                        shrink: false
                                    }}
                                    value={this.state.remarks
                                    }
                                    type="text"
                                    multiline="multiline"
                                    rows={3}
                                    variant="outlined"
                                    size="small"
                                    onChange={(e) => {
                                        this.setState({ remarks: e.target.value })
                                    }}
                                    validators={['required']}
                                    errorMessages={['this field is required']} />
                            </Grid>
                        </Grid>
                        <Grid container="container" spacing={2}>
                            <Grid item="item" lg={1} md={1} sm={12} xs={12}>
                                <LoonsButton className="mt-2" progress={false}
                                    onClick={() => {
                                        this.approveOrder()
                                    }}
                                >
                                    <span className="capitalize">Approve</span>
                                </LoonsButton>
                            </Grid>
                            <Grid item="item" lg={1} md={1} sm={12} xs={12}>
                                <LoonsButton className="mt-2" progress={false}
                                    onClick={() => {
                                        let approveOrder = this.state.approveOrder
                                        approveOrder.status = "REJECTED"
                                        approveOrder.type = "REJECTED"
                                        //approveOrder.activity = "REJECTED"
                                        this.setState({ approveOrder })
                                        console.log(this.state.approveOrder);
                                        this.approveOrder()
                                    }}>
                                    <span className="capitalize">Reject</span>
                                </LoonsButton>
                            </Grid>
                        </Grid>
                    </ValidatorForm> : null}

                </LoonsCard>
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
            </MainContainer>
        )
    }

}
export default MDS_CPIndividualOrder