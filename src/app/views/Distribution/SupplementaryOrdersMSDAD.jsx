import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar'
import DistributionDropped from './main_page_tabs/dropped_Items'
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



import SupplementaryOrders from './msdADTabsForSupplimentary/SupplementaryOrders'

import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import LoonsButton from 'app/components/LoonsLabComponents/Button'



const styleSheet = (theme) => ({})

class SupplementaryOrdersMSDAD extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: true,
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id: null,

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
        // this.loadWarehouses()
        window.addEventListener("pageshow", function (event) {
            var historyTraversal = event.persisted ||
                (typeof window.performance != "undefined" &&
                    window.performance.navigation.type === 2);
            if (historyTraversal) {
                // Handle page restore.
                window.location.reload();
            }
        });
    }

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
            this.setState({ owner_id: selected_warehouse_cache.owner_id, selected_warehouse: selected_warehouse_cache.id, dialog_for_select_warehouse: false, Loaded: true })
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

    render() {

        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                       


                        <main>
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
                                                    <Tab label={<span className="font-bold text-12">PENDING</span>} />
                                                    <Tab label={<span className="font-bold text-12">APPROVED</span>} />
                                                    <Tab label={<span className="font-bold text-12">REJECTED</span>} />
                                                </Tabs>
                                            </Grid>
                                        </AppBar>

                                        {this.state.activeSecondaryTab == 0 ?
                                            <div className='w-full'>
                                                <SupplementaryOrders status="PENDING"/>

                                            </div> : null
                                        }
                                        {this.state.activeSecondaryTab == 1 ?
                                            <div className='w-full'>
                                                <SupplementaryOrders status="APPROVED" />
                                            </div> : null
                                        }
                                        {this.state.activeSecondaryTab == 2 ?
                                            <div className='w-full'>
                                                <SupplementaryOrders status="REJECTED"/>
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
                            </div>

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

export default withStyles(styleSheet)(SupplementaryOrdersMSDAD)