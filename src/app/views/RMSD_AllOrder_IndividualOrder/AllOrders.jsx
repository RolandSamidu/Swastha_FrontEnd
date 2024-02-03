import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import ApartmentIcon from '@material-ui/icons/Apartment';

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
    Typography
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

import ToBeApproved from './ToBeApproved'
import ToBeAllocated from './ToBeAllocated'
import ToBeIssued from './ToBeIssued'
import ToBeReceived from './ToBeReceived'
import Completed from './Completed'
import AllOrder_DeliveryDetails from './AllOrder_DeliveryDetails'
import AllOrder_OrderDetails from './AllOrder_OrderDetails'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import Rejected from './Rejected'


const styleSheet = (theme) => ({})

class AllOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,

            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],

            // to_be_approved_len:0,
            // to_be_allocated_len:0,
            // to_be_issued_len:0,
            // to_be_received_len:0,
            // completed_len:0,


            // tabVisibility: {

            //     to_be_approved:'visible',
            //     to_be_allocated:'visible',
            //     to_be_issued: 'visible',
            //     to_be_received: 'visible',
            //     completed: 'visible',

            // },

        }

    }

    // async loadOrderList() {

    //     this.setState({Loaded: false})

    //     let to_be_approved = await PharmacyOrderService.getAllOrders({status: 'Pending', to: '600329c7-f99f-4f04-9f7c-240090526aee'});
    //     let to_be_allocated = await PharmacyOrderService.getAllOrders({status: 'Approved', to: '600329c7-f99f-4f04-9f7c-240090526aee'});
    //     let to_be_issued = await PharmacyOrderService.getAllOrders({status: 'Allocated', to: '600329c7-f99f-4f04-9f7c-240090526aee'});
    //     let to_be_received = await PharmacyOrderService.getAllOrders({status: 'Issued', to: '600329c7-f99f-4f04-9f7c-240090526aee'});
    //     let completed = await PharmacyOrderService.getAllOrders({status: 'Received', to: '600329c7-f99f-4f04-9f7c-240090526aee'});

    //     if (to_be_approved.status) {

    //         this.setState({
    //             to_be_approved_len: to_be_approved.data.view.data.length
    //         })

    //     }
    //     if (to_be_allocated.status) {

    //         this.setState({
    //             to_be_allocated_len: to_be_allocated.data.view.data.length
    //         })

    //     }
    //     if (to_be_issued.status) {

    //         this.setState({
    //             to_be_issued_len: to_be_issued.data.view.data.length
    //         })

    //     }
    //     if (to_be_received.status) {

    //         this.setState({
    //             to_be_received_len: to_be_received.data.view.data.length
    //         })

    //     }
    //     if (completed.status) {

    //         this.setState({
    //             completed_len: completed.data.view.data.length,

    //         } )

    //     }
    //     this.setState({Loaded: true})

    // }

    // componentDidMount() {

    //     this.loadOrderList()

    // }
    async loadWarehouses() {
        this.setState({ Loaded: false })
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
            this.setState({ 
                owner_id: selected_warehouse_cache.owner_id, 
                selected_warehouse: selected_warehouse_cache.id, 
                dialog_for_select_warehouse: false, 
                warehouseSelectDone: true 
            })
            console.log(this.state.selected_warehouse)
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
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy, Loaded: true })
        }
    }

    componentDidMount() {
        this.loadWarehouses()
        // this.loadData()

    }

    render() {

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* <CardTitle title="My Orders" /> */}
                        <div style={{ display: 'flex', alignItems: 'center' , justifyContent:'space-between' }}>
                            <Typography variant="h6" className="font-semibold">My Orders</Typography>
                            <Button
                                color='primary'
                                onClick={() => {
                                    this.setState({dialog_for_select_warehouse:true , Loaded:false})
                                }}>
                                <ApartmentIcon />
                                {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}Change Warehouse
                            </Button>
                        </div>
                        <Divider className='mb-3 mt-3' />
                        {
                            this.state.Loaded ?
                                (
                                    <>
                                        <AppBar position="static" color="default" className="mb-4 mt-2">
                                            <Grid item lg={12} md={12} xs={12}>
                                                <Tabs style={{ minHeight: 39, height: 26 }}
                                                    indicatorColor="primary"
                                                    variant='fullWidth'
                                                    textColor="primary"
                                                    value={this.state.activeTab}
                                                    onChange={(event, newValue) => {
                                                        console.log(newValue)
                                                        this.setState({ activeTab: newValue })
                                                    }} >

                                                    <Tab label={<span className="font-bold text-12">ALL ORDERS</span>} />
                                                    <Tab label={<span className="font-bold text-12">TO BE APPROVED</span>} />
                                                    <Tab label={<span className="font-bold text-12">TO BE ALLOCATED</span>} />
                                                    <Tab label={<span className="font-bold text-12">TO BE ISSUED</span>} />
                                                    <Tab label={<span className="font-bold text-12">TO BE RECEIVED</span>} />
                                                    <Tab label={<span className="font-bold text-12">COMPLETED</span>} />
                                                    <Tab label={<span className="font-bold text-12">REJECTED</span>} />

                                                    {/* <Tab label={
                                            this.state.tabVisibility.to_be_approved == 'visible' ?
                                                (
                                                    <>
                                                        <Badge badgeContent={`${this.state.to_be_approved_len}`} color="primary" >
                                                            <span className="font-bold text-12">TO BE APPROVED</span>
                                                        </Badge>
                                                    </>
                                                ) :
                                                (
                                                    <span className="font-bold text-12">TO BE APPROVED</span>
                                                )

                                        }
                                        onClick={() => { this.state.tabVisibility.to_be_approved = 'hidden' }} />

                                    <Tab label={
                                            this.state.tabVisibility.to_be_allocated == 'visible' ?
                                                (
                                                    <>
                                                        <Badge badgeContent={`${this.state.to_be_allocated_len}`} color="primary" >
                                                            <span className="font-bold text-12">TO BE ALLOCATED</span>
                                                        </Badge>
                                                    </>
                                                ) :
                                                (
                                                    <span className="font-bold text-12">TO BE ALLOCATED</span>
                                                )

                                        }
                                        onClick={() => { this.state.tabVisibility.to_be_allocated = 'hidden' }} />
                                    <Tab
                                        label={
                                            this.state.tabVisibility.to_be_issued == 'visible' ?
                                                (
                                                    <>
                                                        <Badge badgeContent={`${this.state.to_be_issued_len}`} color="primary" >
                                                            <span className="font-bold text-12">TO BE ISSUED</span>
                                                        </Badge>
                                                    </>
                                                ) :
                                                (
                                                    <span className="font-bold text-12">TO BE ISSUED</span>
                                                )

                                        }
                                        onClick={() => { this.state.tabVisibility.to_be_issued = 'hidden' }}
                                    />
                                    <Tab
                                        label={
                                            this.state.tabVisibility.to_be_received == 'visible' ?
                                                (
                                                    <>
                                                        <Badge badgeContent={`${this.state.to_be_received_len}`} color="primary" >
                                                            <span className="font-bold text-12">TO BE RECEIVED</span>
                                                        </Badge>
                                                    </>
                                                ) :
                                                (
                                                    <span className="font-bold text-12">TO BE RECEIVED</span>
                                                )

                                        }
                                        onClick={() => { this.state.tabVisibility.to_be_received = 'hidden' }}
                                    />
                                    <Tab
                                        label={
                                            this.state.tabVisibility.completed == 'visible' ?
                                                (
                                                    <>
                                                        <Badge badgeContent={`${this.state.completed_len}`} color="primary" >
                                                            <span className="font-bold text-12">COMPLETED</span>
                                                        </Badge>
                                                    </>
                                                ) :
                                                (
                                                    <span className="font-bold text-12">COMPLETED</span>
                                                )

                                        }
                                        onClick={() => { this.state.tabVisibility.completed = 'hidden' }}
                                    /> */}
                                                    {/* <Tab label={<span className="font-bold text-12">REJECTED</span>} /> */}


                                                </Tabs>
                                            </Grid>
                                        </AppBar>

                                        <main>

                                            {this.state.activeTab == 0 ?
                                                <div className='w-full'>
                                                    <Fragment>
                                                        <AppBar position="static" color="default" className="mb-4">
                                                            <Grid item lg={12} md={12} xs={12}>
                                                                <Tabs style={{ minHeight: 39, height: 26 }}
                                                                    indicatorColor="primary"
                                                                    variant='fullWidth'
                                                                    textColor="primary"
                                                                    value={this.state.activeSecondaryTab}
                                                                    onChange={(event, newValue) => {
                                                                        console.log(newValue)
                                                                        this.setState({ activeSecondaryTab: newValue })
                                                                    }} >
                                                                    <Tab label={<span className="font-bold text-12">Order Details</span>} />
                                                                    <Tab label={<span className="font-bold text-12">Delivery Details</span>} />
                                                                </Tabs>
                                                            </Grid>
                                                        </AppBar>
                                                        {
                                                            this.state.activeSecondaryTab == 0 ?
                                                                <div className='w-full'>
                                                                    <AllOrder_OrderDetails></AllOrder_OrderDetails>
                                                                </div> : null
                                                        }
                                                        {this.state.activeSecondaryTab == 1 ?
                                                            <div className='w-full'>
                                                                <AllOrder_DeliveryDetails loaded={this.state.Loaded}></AllOrder_DeliveryDetails>
                                                            </div> : null
                                                        }


                                                    </Fragment>

                                                </div> : null
                                            }
                                            {this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                    <ToBeApproved loaded={this.state.Loaded}></ToBeApproved>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 2 ?
                                                <div className='w-full'>
                                                    <ToBeAllocated loaded={this.state.Loaded}></ToBeAllocated>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 3 ?
                                                <div className='w-full'>
                                                    <ToBeIssued loaded={this.state.Loaded}></ToBeIssued>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 4 ?
                                                <div className='w-full'>
                                                    <ToBeReceived loaded={this.state.Loaded}></ToBeReceived>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 5 ?
                                                <div className='w-full'>
                                                    <Completed loaded={this.state.Loaded}></Completed>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 6 ?
                                                <div className='w-full'>
                                                    <Rejected></Rejected>
                                                </div> : null
                                            }
                                        </main>
                                    </>
                                ) : null

                        }

                    </LoonsCard>
                </MainContainer>
                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.state.owner_id = value.owner_id
                                        this.setState({ owner_id: value.owner_id, selected_warehouse: value.id, dialog_for_select_warehouse: false,Loaded:true})
                                        localStorageService.setItem('Selected_Warehouse', value);
                                        // this.loadData()
                                    }
                                }}
                                value={{
                                    name: this.state.selected_warehouse ? (this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse).name) : null,
                                    id: this.state.selected_warehouse
                                }}
                                getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />

                        </ValidatorForm>
                    </div>
                </Dialog>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(AllOrders)