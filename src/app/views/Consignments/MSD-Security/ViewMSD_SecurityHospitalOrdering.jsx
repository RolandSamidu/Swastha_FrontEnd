import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
    LoonsSnackbar,
} from "../../../components/LoonsLabComponents";
import { Grid, Tooltip, IconButton, Dialog } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Alert, Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from '@material-ui/core/Paper';
import Buttons from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';

import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import { dateTimeParse,timeParse,dateParse } from "utils";

import ConsignmentService from "../../../services/ConsignmentService";
import WarehouseServices from "app/services/WarehouseServices";
import VehicleService from "../../../services/VehicleService";
import localStorageService from "app/services/localStorageService";

class ViewMSD_SecurityHospitalOrdering extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arrive_dialog: false,
            depature_dialog: false,
            loaded: false,
            totalConsignment: 0,
            driverData: [],
            all_Warehouses2:[],
            params: {
                limit: 20,
                page: 0
            },

            alert: false,
            message: '',
            severity: 'success',

            arrive_formData: {
                vehicle_id: null,
                consignment_id: null,
                arrival_time: dateTimeParse(new Date()),
                confirm_type: "Arrived"
            },
            depature_formData: {
                vehicle_id: null,
                consignment_id: null,
                depature_time: dateTimeParse(new Date()),
                confirm_type: "Departured"
            },
            formData: {
                vehicle_type:null,
                delivery_date: null,
                agent: '',
                status: '',
                time_period: '',
                order_no: '',
            },

            totalItems: 0,
            filterData: {
                
                limit: 20,
                page: 0,
                delivery_date: null,
                vehicle_type:null,
                agent: '',
                status: '',
                time_period: '',
                from_warehouse_id: null,
                to_warehouse_id: null,
                order_no: '',
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: false,
                        // sort: false,
                        // empty: true,
                        // print: false,
                        // download: false,
                        customBodyRenderLite: (dataIndex) => {
                            let status = this.state.data[dataIndex].status;
                            return (
                                <Grid className="flex items-center">
                                    {/*  <Tooltip title="Edit">
                                        <Buttons
                                         color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}>
                                            View
                                        </Buttons>
                                    </Tooltip> */}
                                    <Grid className="px-2">
                                        <Tooltip title="Arrived">
                                            <Button
                                                disabled={status === 'Departured' ? false : true}
                                                onClick={() => {
                                                    let arrive_formData = this.state.arrive_formData;
                                                   
                                                    arrive_formData.arrival_time = dateTimeParse(new Date());
                                                    arrive_formData.consignment_id = this.state.data[dataIndex].consignment_id;
                                                    arrive_formData.vehicle_id = this.state.data[dataIndex].vehicle_id;

                                                    this.setState({
                                                        arrive_dialog: true,
                                                        arrive_formData,
                                                        selected_id: this.state.data[dataIndex].id
                                                    })

                                                    //console.log("row data", this.state.data[dataIndex])
                                                }}>
                                                Check-In
                                            </Button>
                                        </Tooltip>
                                    </Grid>

                                    <Grid className="px-2">
                                        <Tooltip title="Departured">
                                            <Button
                                                disabled={status === "Departured" ? false : true}
                                                onClick={() => {
                                                    let depature_formData=this.state.depature_formData;

                                                   
                                                    depature_formData.depature_time = dateTimeParse(new Date());
                                                    depature_formData.consignment_id = this.state.data[dataIndex].consignment_id;
                                                    depature_formData.vehicle_id = this.state.data[dataIndex].vehicle_id;
                                                    this.setState({
                                                        depature_dialog: true,
                                                        depature_formData,
                                                        selected_id: this.state.data[dataIndex].id
                                                    })
                                                }}>
                                                Check-out
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                    }
                },
                {
                    name: 'Vehicle', // field name in the row object
                    label: 'Vehicle No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Vehicle.reg_no;
                            return data;
                        }
                    },
                },
                {
                    name: 'OrderExchange', // field name in the row object
                    label: 'Delivery Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].OrderDelivery.OrderExchange.required_date;
                            console.log("deliverydate:",data)
                            
                            return  <p>{dateParse(data)}</p>;;
                        }
                    },
                },
                {
                    name: 'Driver', // field name in the row object
                    label: 'Delivery Person', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let data = this.state.data[dataIndex].Consignment.delivery_person.name;
                        //     return data;
                        // }
                    },
                },
                {
                    name: 'Vehicle', // field name in the row object
                    label: 'Arrival Time', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Vehicle.arrival_time;
                            console.log("arrivaltime",data)
                            // if(data == null || data == ""){
                            //     return " - "
                            // }else{
                            //     return (
                            //         <p> {timeParse(data)} </p>
                            //     )
                            // }
                        },

                    },

                },
                {
                    name: 'depature_time', // field name in the row object
                    label: 'Departure Time', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Vehicle.depature_time;
                            console.log("departureTime",data)
                            // if(data == null || data == ""){
                            //     return " - "
                            // }else{
                            //     return (
                            //         <p> {timeParse(data)} </p>
                            //     )
                            // }
                           
                        },

                    },
                },

                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].OrderDelivery.OrderExchange.status;
                            console.log("deliverydate:",data)
                            
                            return  data;
                        }
                    },
                },


            ],
            alert: false,
            message: "",
            severity: 'success',
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let params = {
                to_owner_id : '000',
                limit: 20,
                page: 0,
                from_date: null,
                to_date:null,
                'order[0][0]': 'updatedAt', 
                'order[0][1]': 'Desc', 
        }
        let res = await ConsignmentService.getOrderDeliveryVehicleReuqests(params)
        console.log("Form data",res)

        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
        this.setState({
            totalConsignment: this.state.data.length
        })
        console.log("dataordering",this.state.data)
    }

    // Load vehicle data onto table
    // async loadVehicleData() {
    //     this.setState({loaded: false})
    //     var ownerId = await localStorageService.getItem('owner_id');
    //     let drivers = await VehicleService.fetchAllVehicles(this.state.params, "001");
    //     console.log("driverData",drivers)
    //     if (drivers.status === 200) {
    //         // this.setState({
    //         //         loaded: true,
    //         //         driverData: drivers.data.view.data,
    //         //         driverTableFormData: drivers.data.view.data,
    //         //         totalPages: drivers.data.view.totalPages,
    //         //         totalItems: drivers.data.view.totalItems,
    //         //     },
    //         //     () => {
    //         //         this.render()
    //         //     }
    //         // )
    //     }
    // }


    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }
    async allWarehouses() {
        let owner_id = null
        let params ={
        //     warehouser_search_type :label,
          //   limit: 20,
          //   page: 0,
        }
        let res = await WarehouseServices.getAllWarehousewithOwner(params,owner_id)
        if (res.status == 200) {
           
            this.setState({ 
                all_Warehouses2: res.data.view.data,
             },()=>{
                console.log('warehouses', this.state.all_Warehouses)
            })
  
        }
    }

    componentDidMount() {
        this.loadData()
        this.allWarehouses()
        // this.loadVehicleData()
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit({
            //add vehicle type filter this.state.vehicle_type
            order_no: this.state.order_no,
            status: this.state.status,
            delivery_date: this.state.delivery_date,
            agent: this.state.agent,
            time_period: this.state.time_period,
        })
    }

   async arrivedSubmit() {
         let res = await ConsignmentService.patchConsignmentContainer(this.state.selected_id,this.state.arrive_formData)
        if (res.status == 200) {
            this.setState({
                alert: true,
                message: 'Vehicle Arrived Successful',
                severity: 'success',
                arrive_dialog:false
            },()=>{
                this.loadData()
            })
        } else {
            this.setState({
                alert: true,
                message: 'Cannot Set Vehicle Arrived',
                severity: 'error',
            })
        } 
    }

    async depatureSubmit() {
        let res = await ConsignmentService.patchConsignmentContainer(this.state.selected_id,this.state.depature_formData)
       if (res.status == 200) {
           this.setState({
               alert: true,
               message: 'Vehicle Departured Successful',
               severity: 'success',
               depature_dialog:false
            },()=>{
                this.loadData()
            })
       } else {
           this.setState({
               alert: true,
               message: 'Cannot Set Vehicle Depature',
               severity: 'error',
           })
       } 
   }

    render() {
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title=" View Hospital Ordering" />
                        <Grid item lg={12} className=" w-full mt-2">
                            <ValidatorForm
                                className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.onSubmit()}
                                onError={() => null}
                            >
                                <Grid container spacing={1} className="flex">
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Time Type" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.time_period}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.time_period = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.time_period}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="From Warehouse" />
                                        <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.all_Warehouses2
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let filterData = this.state.filterData
                                                            filterData.from_warehouse_id = value.id
                                                            this.setState(
                                                                {
                                                                    filterData
                                                                }
                                                            )
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="From Warehouse"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                           
                                                        />
                                                    )}
                                                />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="To Warehouse" />
                                        <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.all_Warehouses2
                                                    }
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            let filterData = this.state.filterData
                                                            filterData.to_warehouse_id = value.id
                                                            this.setState(
                                                                {
                                                                    filterData
                                                                }
                                                            )
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="To Warehouse"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                           
                                                        />
                                                    )}
                                                />
                                    </Grid>




                                    
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Delivery effective date range" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.delivery_date}
                                            placeholder="Date From"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date =>{
                                                
                                                    let filterData = this.state.filterData;
                                                    filterData.delivery_date = date;
                                                    this.setState({filterData})
                                              
                                            }}
                                        />
                                    </Grid>
                                  {/*   <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Agent" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.admission_mode}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.status = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.agent}
                                                />
                                            )}
                                        />
                                    </Grid> */}
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Status" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={appConst.order_status}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.status = e.target.value;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.status}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Order List" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Please Enter"
                                            name="order_list"
                                            InputLabelProps={{ shrink: false }}
                                            value={this.state.filterData.order_no}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.order_no = e.target.value;
                                                this.setState({ filterData })

                                            }}
                                            // validators={['required']}
                                            errorMessages={[
                                                'this field is required',
                                            ]}
                                        />
                                    </Grid>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                    >
                                        <Grid
                                            className=" flex " item lg={2} md={2} sm={12} xs={12}
                                        >
                                            <Grid
                                                style={{ marginTop: 10 }}
                                            >
                                                <Button
                                                    className="mt-4"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={true}
                                                >
                                                    <span className="capitalize">Search</span>
                                                </Button>
                                            </Grid>

                                            <Grid
                                                style={{ marginTop: 22, marginLeft: 4 }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    style={{ margin: 3 }}
                                                >
                                                    <span className="capitalize">Reset</span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </ValidatorForm>
                        </Grid>

                        
                        <Grid className=" w-full" spacing={1} style={{ marginTop: 20, backgroundColor: 'red' }}>
                            <Paper elevation={0} square
                                style={{ backgroundColor: '#E6F6FE', border: '1px solid #DEECF3', height: 40 }}>
                                <Grid item lg={12} className=" w-full mt-2">
                                    <Grid container spacing={1} className="flex">
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                            spacing={2}
                                            style={{ marginLeft: 10 }}
                                        >
                                            <SubTitle title={`Total Orders: ${this.state.totalConsignment}`} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/*Table*/}
                        <Grid style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <LoonsTable
                                        id={"MSD_AD_ORDERS"}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 20,
                                            page: this.state.filterData.page,

                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(tableState.page)
                                                        break;
                                                    case 'sort':
                                                        break;
                                                    default:
                                                        console.log('action not handled.');
                                                }
                                            }

                                        }
                                        }
                                    ></LoonsTable> : ' '
                            }

                        </Grid>
                    </LoonsCard>
                </MainContainer>


                <Dialog fullWidth maxWidth="sm" open={this.state.arrive_dialog} >

                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Vehicle Arrive" />

                        {/*  <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_frontDesk: false }) }}>
                            <CloseIcon />
                        </IconButton> */}
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onSubmit={() => this.arrivedSubmit()}
                            onError={() => null}
                            className="w-full"
                        >


                            <MuiPickersUtilsProvider
                                utils={MomentUtils}
                                className="w-full"
                            >
                                <DateTimePicker
                                    className="w-full"
                                    label="Date and Time"
                                    inputVariant="outlined"
                                    value={
                                        this.state.arrive_formData.arrival_time
                                    }
                                    onChange={(date) => {
                                        this.setState({
                                            arrive_formData: {
                                                ...this.state.arrive_formData, arrival_time: dateTimeParse(date),
                                            },
                                        })
                                    }}
                                />
                            </MuiPickersUtilsProvider>


                            <Button
                                className="mt-2 "
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                            >
                                <span className="capitalize">Save</span>
                            </Button>

                            <Button
                                className="mt-2 ml-1"
                                progress={false}
                                onClick={() => {
                                    this.setState({ arrive_dialog: false })

                                }}
                                scrollToTop={true}
                            >
                                <span className="capitalize">Cancel</span>
                            </Button>

                        </ValidatorForm>
                    </div>
                </Dialog>





                <Dialog fullWidth maxWidth="sm" open={this.state.depature_dialog} >

                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Vehicle depatured" />

                        {/*  <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_frontDesk: false }) }}>
                            <CloseIcon />
                        </IconButton> */}
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onSubmit={() => this.depatureSubmit()}
                            onError={() => null}
                            className="w-full"
                        >


                            <MuiPickersUtilsProvider
                                utils={MomentUtils}
                                className="w-full"
                            >
                                <DateTimePicker
                                    className="w-full"
                                    label="Date and Time"
                                    inputVariant="outlined"
                                    value={
                                        this.state.depature_formData.depature_time
                                    }
                                    onChange={(date) => {
                                        this.setState({
                                            depature_formData: {
                                                ...this.state.depature_formData, depature_time: dateTimeParse(date),
                                            },
                                        })
                                    }}
                                />
                            </MuiPickersUtilsProvider>


                            <Button
                                className="mt-2 "
                                progress={false}
                                type="submit"
                                scrollToTop={true}
                            >
                                <span className="capitalize">Save</span>
                            </Button>

                            <Button
                                className="mt-2 ml-1"
                                progress={false}
                                onClick={() => {
                                    this.setState({ depature_dialog: false })

                                }}
                                scrollToTop={true}
                            >
                                <span className="capitalize">Cancel</span>
                            </Button>

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

            </Fragment>
        )

    }
}

export default ViewMSD_SecurityHospitalOrdering
