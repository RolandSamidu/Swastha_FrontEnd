import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar'
import DistributionDropped from '../main_page_tabs/dropped_Items'
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
import OrderBase_AllOrders from '../main_page_tabs/OrderBase_AllOrders'
import OrderBase_ToBeApproved from '../main_page_tabs/OrderBase_ToBeApproved'
import OrderBase_ToBeIssued from '../main_page_tabs/OrderBase_ToBeIssued'
import OrderBase_ToBeAllocated from '../main_page_tabs/OrderBase_ToBeAllocated'
import OrderBase_ToBeDelivered from '../main_page_tabs/OrderBase_ToBeDelivered'
import OrderBase_Completed from '../main_page_tabs/OrderBase_Completed'
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import EmployeeServices from 'app/services/EmployeeServices'
import LoonsButton from 'app/components/LoonsLabComponents/Button'



const styleSheet = (theme) => ({})

class SalesOrder extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeTab: 0,
            activeSecondaryTab: 0,
            Loaded: true,
            selected_warehouse: null,
            dialog_for_select_warehouse: false,
            dialog_for_select_employee: false,
            all_warehouse_loaded: [],
            selected_coverUp_emp:null,
            selected_employee: [],
            owner_id: null,

            alert: false,
            message: '',
            severity: 'success',

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
            formData: {
                cover_up_employee_id: null,
                covered_up_employee_id: null,
                remark: null
            },
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        // this.loadWarehouses()
        this.loadAssignedEmployees();
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

    async loadAssignedEmployees() {
        var user = await localStorageService.getItem('userInfo');
        var userId = user.id;
        var owner_id = await localStorageService.getItem('owner_id');
        var userRoles = user.roles;

        var all_employee_dummy = [];

        let res = await EmployeeServices.getEmployees({
            owner_id: owner_id,
            type: ['MSD Distribution Officer','MSD SCO','MSD SCO Supply']
        })
        if (res.status == 200) {
            console.log("Assigned Employees", res.data.view.data);
            all_employee_dummy = res.data.view.data;
        }
        this.setState({ selected_employee: all_employee_dummy })
    }

    async handleSubmit() {
        let formData = this.state.formData;
        formData.cover_up_employee_id = await localStorageService.getItem('userInfo').id;
        formData.covered_up_employee_id = this.state.selected_coverUp_emp.id;

        let res = await EmployeeServices.createEmployeeCoverUp(formData);
        if (res.status === 201) {
            await localStorageService.setItem('coverUpInfo', this.state.selected_coverUp_emp);
            this.setState({
                alert: true,
                message: 'Employee cover up history saved!',
                severity: 'success',
                processing: false
            }, () => {
                window.location.reload()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Employee cover up history was unsaved!',
                severity: 'error',
                processing: false
            })
        }
        this.setState({ dialog_for_select_employee: false })
    }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <Typography variant="h6" className="font-semibold">Sales Order</Typography>
                            <LoonsButton
                                color='primary'
                                onClick={() => {
                                    this.setState({ dialog_for_select_employee: true, Loaded: false })
                                }}>
                                <ApartmentIcon />
                                Cover Ups
                            </LoonsButton>
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
                                    {/* <Tab label={<span className="font-bold text-12">Item Base Order</span>} /> */}


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
                                                                <Tab label={<span className="font-bold text-12">VEHICLE IN</span>} />
                                                                <Tab label={<span className="font-bold text-12">PENDING DELIVERY</span>} />
                                                                <Tab label={<span className="font-bold text-12">TO BE ISSUED</span>} />
                                                                <Tab label={<span className="font-bold text-12">TO BE COMPLETED</span>} />
                                                                <Tab label={<span className="font-bold text-12">COMPLETED</span>} />
                                                                <Tab label={<span className="font-bold text-12">ALL ORDERS</span>} />
                                                                {/*  <Tab label={<span className="font-bold text-12">DROPPED ITEMS</span>} /> */}
                                                            </Tabs>
                                                        </Grid>
                                                    </AppBar>

                                                    {this.state.activeSecondaryTab == 0 ?
                                                        <div className='w-full'>
                                                            <OrderBase_ToBeAllocated type={"Sales Order"} />

                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 1 ?
                                                        <div className='w-full'>
                                                            <OrderBase_ToBeIssued type={"Sales Order"} />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 2 ?
                                                        <div className='w-full'>
                                                            <OrderBase_ToBeApproved type={"Sales Order"} />
                                                        </div> : null
                                                    }
                                                    {
                                                        this.state.activeSecondaryTab == 3 ?
                                                            <div className='w-full'>
                                                                <OrderBase_ToBeDelivered type={"Sales Order"} />

                                                            </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 4 ?
                                                        <div className='w-full'>
                                                            <OrderBase_Completed type={"Sales Order"} />
                                                        </div> : null
                                                    }
                                                    {this.state.activeSecondaryTab == 5 ?
                                                        <div className='w-full'>
                                                            <OrderBase_AllOrders type={"Sales Order"} />
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
                                    {/* {this.state.activeTab == 1 ?
                                        <div className='w-full'>

                                        </div> : null
                                    } */}
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
                                onSubmit={()=> window.location.reload()}
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
                    <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_employee} onClose={() => {
                        this.setState({ dialog_for_select_employee: false });
                        window.location.reload();
                    }}>

                        <MuiDialogTitle disableTypography>
                            <CardTitle title="Select Your Employee" />
                            <br />
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <LoonsButton
                                    color='primary'
                                    onClick={() => {
                                        this.setState({ dialog_for_select_employee: false })
                                        localStorage.removeItem("coverUpInfo");
                                        window.location.reload()
                                    }}>
                                    <ApartmentIcon />
                                    Change to me
                                </LoonsButton>
                            </div>
                        </MuiDialogTitle>

                        <div className="w-full h-full px-5 py-5">
                            <ValidatorForm
                                onError={() => null}
                                onSubmit={() => this.handleSubmit()}
                                className="w-full">
                                <Grid className=" w-full" item="item">
                                    <SubTitle title="Employee" />
                                    <Autocomplete
                                        disableClearable
                                    className="w-full"
                                    options={this.state.selected_employee}
                                    onChange={(e, value) => {
                                        if (value != null) {   
                                            this.setState({selected_coverUp_emp:value})                                    
                                            //localStorageService.setItem('coverUpInfo', value);                                       
                                        }
                                    }}
                                    //value={this.state.selected_employee.find((v) => v.id == this.state.selected_coverUp_emp)}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => (
                                        <TextValidator
                                            {...params}
                                            placeholder="Select Your Employee"                                        
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                        />
                                    )}
                                />
                                </Grid>
                                <Grid className=" w-full" item="item">
                                    <SubTitle title="Remark" />
                                    <TextValidator className='' required={true} placeholder="Remark"
                                        //variant="outlined"
                                        fullWidth="fullWidth" variant="outlined" size="small" value={this.state.formData.remark} onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (e.target.value != '') {
                                                formData.remark = e.target.value;
                                            } else {
                                                formData.remark = null
                                            }
                                            this.setState({ formData })
                                        }}
                                    /* validators={[
                                    'required',
                                    ]}
                                    errorMessages={[
                                    'this field is required',
                                    ]} */
                                    />
                                </Grid>
                                <Grid item="item">
                                    {/* Submit Button */}
                                    <LoonsButton className="mt-5 mr-2" progress={false} type='submit'>
                                        <span className="capitalize">Save</span>
                                    </LoonsButton>
                                </Grid>
                            </ValidatorForm>
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
                        variant="filled"
                    ></LoonsSnackbar>
                </MainContainer>
            </Fragment>

        )
    }
}

export default withStyles(styleSheet)(SalesOrder)