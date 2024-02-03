import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar'
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
import MSD_MSA_AllDropped from './main_page_tabs/dropped_Items'
import MSD_MSA_AllOrders from './main_page_tabs/MSD_MSA_AllOrders'
import MSD_MSA_Completed from './main_page_tabs/MSD_MSA_Completed'
import MSD_MSA_ToBeApproved from './main_page_tabs/MSD_MSA_ToBeApproved'
import MSD_MSA_ToBeIssued from './main_page_tabs/MSD_MSA_ToBeIssued'
import MSD_MSA_ToBeAllocated from './main_page_tabs/MSD_MSA_ToBeAllocated'
import MSD_MSA_ToBeDelivered from './main_page_tabs/MSD_MSA_ToBeDelivered'
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import ItemWiseOrders from '../ItemWiseOrders'
import { includesArrayElements } from 'utils'

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

class DistributionAllOrders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: false,
            selected_warehouse: null,
            selected_warehouse_name: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id: null,

            type: 'Order',
            loadType: false,

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

        this.loadWarehouses()
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

        if (includesArrayElements(user.roles,['MSD MSA'])) {
            this.setState({ activeSecondaryTab: 1 })
        }


        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        const query = new URLSearchParams(this.props.location.search);
        const type = query.get('type')
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            this.setState({ owner_id: selected_warehouse_cache.owner_id, selected_warehouse: selected_warehouse_cache.id, dialog_for_select_warehouse: false, Loaded: true, selected_warehouse_name: selected_warehouse_cache.name }, () => {

                this.changeType(type)
            })
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

    changeType(type) {
        this.setState({ type: type, Loaded: false, loadType: true })

        setTimeout(() => {
            this.setState({ Loaded: true })
        }, 500)
        //this.setState({Loaded:true})
    }

    render() {
        const { classes } = this.props
        return (

            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Typography variant="h6" className="font-semibold">Direct Distribution</Typography>
                            <div className='flex'>
                                <Grid
                                    className='pt-3 pr-3'
                                >
                                    <Typography>{this.state.selected_warehouse_name !== null ? "You're in " + this.state.selected_warehouse_name : null}</Typography>
                                </Grid>
                                <LoonsButton
                                    color='primary'
                                    onClick={() => {
                                        this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                    }}>
                                    <ApartmentIcon />
                                    Change Warehouse
                                </LoonsButton>

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
                                                                {/* <Tab label={<span className="font-bold text-12">APPROVED ORDERS</span>} />      */}
                                                                <Tab label={<span className="font-bold text-12">PENDING</span>} />
                                                                <Tab label={<span className="font-bold text-12">ALLOCATED</span>} />
                                                                <Tab label={<span className="font-bold text-12">ISSUED</span>} />
                                                                <Tab label={<span className="font-bold text-12">COMPLETED</span>} />
                                                                <Tab label={<span className="font-bold text-12">DROPPED ORDERS</span>} />
                                                                <Tab label={<span className="font-bold text-12">ALL ORDERS</span>} />
                                                            </Tabs>
                                                        </Grid>
                                                    </AppBar>
                                                    {/* {this.state.activeSecondaryTab == 0 ?
                                                        <div className='w-full'>
                                                            <MSD_MSA_ToBeApproved type={this.state.type} />
                                                        </div> : null
                                                    } */}

                                                    {this.state.activeSecondaryTab == 0 ?
                                                        <div className='w-full'>
                                                            <MSD_MSA_ToBeAllocated type={this.state.type} />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 1 ?
                                                        <div className='w-full'>
                                                            <MSD_MSA_ToBeIssued type={this.state.type} />
                                                        </div> : null
                                                    }


                                                    {this.state.activeSecondaryTab == 2 ?
                                                        <div className='w-full'>
                                                            <MSD_MSA_ToBeDelivered type={this.state.type} />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 3 ?
                                                        <div className='w-full'>
                                                            <MSD_MSA_Completed type={this.state.type} />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 4 ?
                                                        <div className='w-full'>
                                                            <MSD_MSA_AllDropped type={this.state.type} />
                                                        </div> : null
                                                    }
                                                    {
                                                        this.state.activeSecondaryTab == 5 ?
                                                            <div className='w-full'>
                                                                <MSD_MSA_AllOrders type={this.state.type} />
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
                                            <ItemWiseOrders type={this.state.type}></ItemWiseOrders>
                                        </div> : null
                                    }
                                </div>
                                : null}
                        </main>
                    </LoonsCard>
                    <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

                        {/* <MuiDialogTitle disableTypography>
                            <CardTitle title="" />
                        </MuiDialogTitle> */}
                        <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                            <CardTitle title="Select Your Warehouse" />
                            <IconButton aria-label="close" className={classes.closeButton}
                                onClick={() => {
                                    this.setState({
                                        dialog_for_select_warehouse: false

                                    })
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </MuiDialogTitle>



                        <div className="w-full h-full px-5 py-5">
                            <ValidatorForm
                                onError={() => null}
                                className="w-full">
                                <Autocomplete
                                    disableClearable
                                    className="w-full"
                                    options={this.state.all_warehouse_loaded.sort((a, b) => (a.name.localeCompare(b.name)))}
                                    onChange={(e, value) => {
                                        if (value != null) {
                                            localStorageService.setItem('Selected_Warehouse', value);
                                            this.setState({ dialog_for_select_warehouse: false, selected_warehouse_name: value.name }, () => { this.loadWarehouses() })
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
                </MainContainer>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(DistributionAllOrders)