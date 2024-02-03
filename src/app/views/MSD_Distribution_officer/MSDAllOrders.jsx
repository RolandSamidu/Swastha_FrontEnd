import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar'
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
import MSD_AllDropped from './main_page_tabs/dropped_Items'
import MSD_AllOrders from './main_page_tabs/MSD_AllOrders'
import MSD_ToBeApproved from './main_page_tabs/MSD_ToBeApproved'
import MSD_ToBeIssued from './main_page_tabs/MSD_ToBeIssued'
import MSD_ToBeAllocated from './main_page_tabs/MSD_ToBeAllocated'
import MSD_ToBeDelivered from './main_page_tabs/MSD_ToBeDelivered'
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import LoonsButton from 'app/components/LoonsLabComponents/Button'



const styleSheet = (theme) => ({})

class DistributionAllOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: true,
            selected_warehouse:null,
            owner_id:null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id:null,

            tabVisibility: {
                to_be_issued: 'visible',
                to_be_received: 'visible',
                completed: 'visible'
            },
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

        }

    }

    componentDidMount() {
        //this.loadWarehouses()
    }

    // async loadWarehouses() {
    //     this.setState({Loaded:false})
    //     var user = await localStorageService.getItem('userInfo');
    //     console.log('user', user)
    //     var id = user.id;
    //     var all_pharmacy_dummy = [];
    //     var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
    //     if (!selected_warehouse_cache) {
    //         this.setState({ dialog_for_select_warehouse: true })
    //     } 
    //     else {             
    //         this.setState({ owner_id: selected_warehouse_cache.owner_id,selected_warehouse:selected_warehouse_cache.id ,dialog_for_select_warehouse:false, Loaded:true})
    //     }
    //     let params = { employee_id: id }
    //     let res = await WarehouseServices.getWareHouseUsers(params);
    //     if (res.status == 200) {
    //         console.log("warehouseUsers", res.data.view.data)

    //         res.data.view.data.forEach(element => {
    //             all_pharmacy_dummy.push(
    //                 {
    //                     warehouse: element.Warehouse,
    //                     name: element.Warehouse.name,
    //                     main_or_personal:element.Warehouse.main_or_personal,
    //                     owner_id:element.Warehouse.owner_id,
    //                     id: element.warehouse_id,
    //                     pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
    //                 }

    //             )
    //         });
    //         console.log("warehouse", all_pharmacy_dummy)
    //         this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
    //     }
    // }

    render() {

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>    
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'10px'}}>
                        <Typography variant="h6" className="font-semibold">My Orders</Typography>
                            {/* <LoonsButton
                                color='primary'
                                onClick={() => {
                                    this.setState({dialog_for_select_warehouse:true, Loaded:false})
                                }}>
                                <ApartmentIcon/>
                                Chanage Warehouse
                            </LoonsButton> */}
                        </div>
                <Divider />
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

                                    <Tab label={<span className="font-bold text-12">Order Base</span>} />
                                    <Tab label={<span className="font-bold text-12">Item Base Order</span>} />


                                </Tabs>
                            </Grid>
                        </AppBar>

                        <main>

                            {this.state.Loaded ?
                                <div>
                                    {this.state.activeTab == 0 ?
                                        <div className='w-full'>

                                            {this.state.Loaded ? (

                                                <Fragment>
                                                    <AppBar position="static" color="default" className="mb-4">
                                                        <Grid item lg={12} md={12} xs={12}>
                                                            <Tabs style={{ minHeight: 39, height: 26 }}
                                                                indicatorColor="primary"
                                                                variant='fullWidth'
                                                                textColor="primary"
                                                                value={this.state.activeSecondaryTab}
                                                                onChange={(event, newValue) => {
                                                                  //console.log(newValue)
                                                                    this.setState({ activeSecondaryTab: newValue })
                                                                }} >
                                                                <Tab label={<span className="font-bold text-12">ALL ORDERS</span>} />
                                                                <Tab label={<span className="font-bold text-12">TO BE APPROVED</span>} />
                                                                <Tab label={<span className="font-bold text-12">TO BE ISSUED</span>} />
                                                                <Tab label={<span className="font-bold text-12">TO BE ALLOCATED</span>} />
                                                                <Tab label={<span className="font-bold text-12">TO BE DELIVERED</span>} />
                                                                <Tab label={<span className="font-bold text-12">DROPPED ITEMS</span>} />
                                                            </Tabs>
                                                        </Grid>
                                                    </AppBar>
                                                    {
                                                        this.state.activeSecondaryTab == 0 ?
                                                            <div className='w-full'>
                                                                <MSD_AllOrders />
                                                            </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 1 ?
                                                        <div className='w-full'>
                                                            <MSD_ToBeApproved />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 2 ?
                                                        <div className='w-full'>
                                                            <MSD_ToBeIssued />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 3 ?
                                                        <div className='w-full'>
                                                            <MSD_ToBeAllocated />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 4 ?
                                                        <div className='w-full'>
                                                            <MSD_ToBeDelivered />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 5 ?
                                                        <div className='w-full'>
                                                            <MSD_AllDropped />
                                                        </div> : null
                                                    }


                                                </Fragment>
                                            ) : (
                                                //load loading effect
                                                <Grid className="justify-center text-center w-full pt-12">
                                                    <CircularProgress
                                                        size={30}
                                                    />
                                                </Grid>
                                            )}
                                        </div> : null
                                    }
                                    {this.state.activeTab == 1 ?
                                        <div className='w-full'>

                                        </div> : null
                                    }
                                </div>
                                : null}
                        </main>
                    </LoonsCard>
                    {/* <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            className="w-full">
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded}
                                onChange={(e, value) => {
                                    if (value != null) {                                       
                                        localStorageService.setItem('Selected_Warehouse', value);    
                                        this.setState({dialog_for_select_warehouse:false, Loaded:true})                                    
                                    }
                                }}
                                value={{
                                    name: this.state.selected_warehouse ? (this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse).name) : null,
                                    id: this.state.selected_warehouse
                                }}
                                getOptionLabel={(option) => option.name != null ? option.name+" - "+ option.main_or_personal : null}
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
                </Dialog> */}
                </MainContainer>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(DistributionAllOrders)