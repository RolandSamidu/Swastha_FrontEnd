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
import CloseIcon from '@material-ui/icons/Close';

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
import Dispatched from './Dispatched'

import Completed from './Completed'
import RejectedOrders from './RejectedOrders'
import AllOrder_DeliveryDetails from './AllOrder_DeliveryDetails'
import AllOrder_OrderDetails from './AllOrder_OrderDetails'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import ItemWiseOrdersByMe from './ItemWiseOrdersByMe'

const drawerWidth = 270;
const styleSheet = (theme) => ({
    Dialogroot: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },

    root: {
        display: 'flex',
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#bad4ec"
        // backgroundColor: themeColors['whiteBlueTopBar'].palette.primary.main
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth - 80}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        //padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})

class AllOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mainTab: 0,
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,

            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],

            type: 'Order',
            loadType: false,
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


        console.log('All orders', this.props.type)
        let type
        if (this.props.type) {
            type = this.props.type
        } else {
            const query = new URLSearchParams(this.props.location.search);
            type = query.get('type')
        }
        this.setState({ type: type, loadType: true })
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
                selected_warehouse_name: selected_warehouse_cache.name,
                dialog_for_select_warehouse: false,
                warehouseSelectDone: true,
                Loaded: true
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
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
        }
    }

    componentDidMount() {


        this.loadWarehouses()
        // this.loadData()

    }

    changeType(type) {
        this.setState({ type: type, Loaded: false, loadType: true })

        setTimeout(() => {
            this.setState({ Loaded: true })
        }, 500)
        //this.setState({Loaded:true})
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        {/* <CardTitle title="My Orders" /> */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" className="font-semibold">Order Details</Typography>


                            <div className='flex'>
                                <Grid
                                    className='pt-3 pr-3'
                                >
                                    <Typography>{this.state.selected_warehouse_name !== null ? "You're in " + this.state.selected_warehouse_name : null}</Typography>
                                </Grid>
                                <Button
                                    color='primary'
                                    onClick={() => {
                                        this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                    }}>
                                    <ApartmentIcon />
                                    {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}Change Warehouse
                                </Button>

                                {this.state.loadType ?
                                    <RadioGroup className='px-5' row="row" defaultValue={this.state.type}>


                                        <FormControlLabel onChange={() => { this.changeType('Order') }} value="Order" control={<Radio />} label="Order" />
                                        <FormControlLabel onChange={() => { this.changeType('EXCHANGE') }} value="EXCHANGE" control={<Radio />} label="Exchange" />
                                        <FormControlLabel onChange={() => { this.changeType('Return') }} value="Return" control={<Radio />} label="Return" />
                                        <FormControlLabel onChange={() => { this.changeType('RMSD Order') }} value="RMSD Order" control={<Radio />} label="Distribution" />

                                    </RadioGroup>
                                    : null}
                            </div>

                        </div>
                        <Divider className='mb-3 mt-3' />

                        <Tabs style={{ minHeight: 39, height: 26 }}
                            indicatorColor="primary"
                            variant='fullWidth'
                            textColor="primary"
                            value={this.state.mainTab}
                            onChange={(event, newValue) => {
                                console.log(newValue)
                                this.setState({ mainTab: newValue })
                            }} >

                            <Tab label={<span className="font-bold text-12">ORDER BASE</span>} />
                            <Tab label={<span className="font-bold text-12">ITEM BASE </span>} />


                        </Tabs>

                        {

                            this.state.Loaded && this.state.mainTab == 0 ?
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


                                                    {/* <Tab label={<span className="font-bold text-12">TO BE APPROVED</span>} /> */}
                                                    <Tab label={<span className="font-bold text-12">PENDING</span>} />
                                                    <Tab label={<span className="font-bold text-12">ALLOCATED</span>} />
                                                    <Tab label={<span className="font-bold text-12">ISSUED</span>} />
                                                    <Tab label={<span className="font-bold text-12">DISPATCHED</span>} />
                                                    <Tab label={<span className="font-bold text-12">COMPLETED</span>} />
                                                    <Tab label={<span className="font-bold text-12">REJECTED</span>} />
                                                    <Tab label={<span className="font-bold text-12">ALL ORDERS</span>} />

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


                                            {/* {this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                    <ToBeApproved type={this.state.type} loaded={this.state.Loaded}></ToBeApproved>
                                                </div> : null
                                            } */}
                                            {this.state.activeTab == 0 ?
                                                <div className='w-full'>
                                                    <ToBeAllocated type={this.state.type} loaded={this.state.Loaded}></ToBeAllocated>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 1 ?
                                                <div className='w-full'>
                                                    <ToBeIssued type={this.state.type} loaded={this.state.Loaded}></ToBeIssued>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 2 ?
                                                <div className='w-full'>
                                                    <ToBeReceived type={this.state.type} loaded={this.state.Loaded}></ToBeReceived>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 3 ?
                                                <div className='w-full'>
                                                    <Dispatched type={this.state.type} loaded={this.state.Loaded}></Dispatched>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 4 ?
                                                <div className='w-full'>
                                                    <Completed type={this.state.type} loaded={this.state.Loaded}></Completed>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 5 ?
                                                <div className='w-full'>
                                                    <RejectedOrders type={this.state.type} loaded={this.state.Loaded}></RejectedOrders>
                                                </div> : null
                                            }
                                            {this.state.activeTab == 6 ?
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
                                                                    <AllOrder_OrderDetails type={this.state.type}></AllOrder_OrderDetails>
                                                                </div> : null
                                                        }
                                                        {this.state.activeSecondaryTab == 1 ?
                                                            <div className='w-full'>
                                                                <AllOrder_DeliveryDetails type={this.state.type} loaded={this.state.Loaded}></AllOrder_DeliveryDetails>
                                                            </div> : null
                                                        }


                                                    </Fragment>

                                                </div> : null
                                            }

                                            {this.state.activeTab == 6 ?
                                                <div className='w-full'>
                                                    <h1>REJECTED</h1>
                                                </div> : null
                                            }
                                        </main>
                                    </>
                                ) : this.state.Loaded && this.state.mainTab == 1 ?
                                    <div>
                                        <ItemWiseOrdersByMe></ItemWiseOrdersByMe>
                                    </div>
                                    : null
                        }


                    </LoonsCard>
                </MainContainer>
                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

                    {/* <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle> */}
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Select Your Warehouse" />

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_warehouse: false }) }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded.sort((a, b) => (a.name.localeCompare(b.name)))}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.state.owner_id = value.owner_id
                                        localStorageService.setItem('Selected_Warehouse', value);
                                        this.setState({
                                            owner_id: value.owner_id, selected_warehouse: value.id, dialog_for_select_warehouse: false,
                                            selected_warehouse_name: value.name
                                        }, () => { this.loadWarehouses() })

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