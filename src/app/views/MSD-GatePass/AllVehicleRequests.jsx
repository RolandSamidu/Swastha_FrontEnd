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
} from "../../components/LoonsLabComponents";
import SearchIcon from '@material-ui/icons/Search';
import { Grid, Tooltip, IconButton, Dialog,InputAdornment, } from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Alert, Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../appconst";
import Paper from '@material-ui/core/Paper';
import Buttons from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';

import MomentUtils from '@date-io/moment'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import { DateTimePicker } from '@material-ui/pickers'
import { dateTimeParse } from "utils";

import ConsignmentService from "../../services/ConsignmentService";
import { element } from "prop-types";

class AllVehicleRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {

            note:false,
            arrive_dialog: false,
            depature_dialog: false,
            loaded: false,
            totalConsignment: 0,

            alltypes:[],
            alert: false,
            message: '',
            severity: 'success',

            note_formDate:{
                vehicle_id: null,
                note : "",
                confirm_type: "Note"

            },
            arrive_formData: {
                vehicle_id: null,
                arrival_time: dateTimeParse(new Date()),
                confirm_type: "Arrived"
            },
            depature_formData: {
                vehicle_id: null,
                depature_time: dateTimeParse(new Date()),
                confirm_type: "Departured"
            },
            formData: {
                // vehicle_type:null,
                // delivery_date: null,
                // status: '',
                // time_period: '',
                search:null 
            },

            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                to_date: null,
                from_date: null,
                vehicle_type: null,
                reg_no:null,
                required_date:true,
                search:null ,
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
                                        <Tooltip title="Check-In">
                                            <Button
                                                disabled={(status === 'Active' || status != 'Arrived') ? false :  true }
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
                                                Check-in
                                            </Button>
                                        </Tooltip>
                                    </Grid>

                                    <Grid className="px-2">
                                        <Tooltip title="Check-out">
                                            <Button
                                                disabled={status === "Arrived" ? false : true}
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
                                                Check-Out
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            );
                        }
                    }
                },
                {
                    name: 'institute', // field name in the row object
                    label: 'Institute', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].OrderDelivery.OrderExchange.fromStore.name;
                            return data;
                        }
                    },
                },
                {
                    name: 'pickup', // field name in the row object
                    label: 'Pickup Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].OrderDelivery.OrderExchange.required_date;
                            return  <p>{dateTimeParse(data)}</p>;
                        }
                    },
                },
                {
                    name: 'vehicle_no', // field name in the row object
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
                    name: 'vehicle_type', // field name in the row object
                    label: 'Vehicle Type', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].Vehicle.make;
                            if (data == null || data == " "){
                                return "- "
                            }else{
                                return data;
                            }
                           
                        }
                    },
                },
                {
                    name: 'estimated_loadtime', // field name in the row object
                    label: ' Estimated Load Time', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].OrderDelivery.OrderExchange.allocated_date;
                            if (data == null || data == " "){
                                return " - "
                            }else{
                                return  <p>{dateTimeParse(data)}</p>;;
                            }
                        }
                    },
                },
                {
                    name: 'custodian', // field name in the row object
                    label: 'Custodian', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex].OrderDelivery.Employee.name +"-"+ this.state.data[dataIndex].OrderDelivery.Employee.designation;
                            return data;
                        }
                    },
                },
                // {
                //     name: 'contact_no', // field name in the row object
                //     label: 'Contact Number', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             let data = this.state.data[dataIndex].OrderDelivery.Employee.name 
                //             return data;

                //         }
                //     },
                // },
                {
                    name: 'action', // field name in the row object
                    label: 'Action ', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <Grid className="flex items-center">
                                   <Tooltip title="View">
                                        <IconButton className="px-2" size="small" aria-label="delete">
                                            <VisibilityIcon onClick={() => { window.location.href = "/" + this.state.data[tableMeta.rowIndex].id }} color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        },
                    },
                },

                {
                    name: 'note', // field name in the row object
                    label: 'Note', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <Grid className="px-2">
                                <Tooltip title="Note">
                                    <Button
                                        onClick={() => {
                                            let note=this.state.note;
                                            this.setState({
                                                note: true,
                                                selected_id: this.state.data[dataIndex].id
                                                
                                            })
                                        }}>
                                      Note
                                    </Button>
                                </Tooltip>
                            </Grid>
                    )
                        },

                    },
                },


            ],
            alert: false,
            message: "",
            severity: 'success',
        }
    }
    async loadGroups() {
        let params = { limit: 99999, page: 0 }
        const res = await ConsignmentService.getOrderDeliveryVehicleTypes(params)

        let loadVehicleTypes = this.state.alltypes
        if (res.status == 200) {
            var loadedData = res.data.view.data
            loadedData.forEach(element => {
                let loadType = {}
                loadType.name =element.name 
                loadType.id = element.id
                loadType.status = element.status
                loadVehicleTypes.push(loadType)
            });
        }
            else {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: res.data.error,
                })
            };
            this.setState({
                alltypes : loadVehicleTypes
            }) 
            console.log("Vehicle Type",this.state.alltypes)      
    }


    async loadData() {
        this.setState({ loaded: false })

        let res = await ConsignmentService.getOrderDeliveryVehicleReuqests(this.state.filterData)
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
    }


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

    componentDidMount() {
        this.loadData()
        //Drop down
        this.loadGroups()
    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }

    onSubmit = () => {
        this.handleFilterSubmit({
            order_no: this.state.order_no,
            status: this.state.status,
            delivery_date: this.state.delivery_date,
            agent: this.state.agent,
            time_period: this.state.time_period,
        })
    }
    async checkInNote() {
        let res = await ConsignmentService.patchOrderDeliveryVehicleReuqests(this.state.selected_id,this.state.note_formDate)
       if (res.status == 200) {
           this.setState({
               alert: true,
               message: 'Note Added Succesfully',
               severity: 'success',
               note:false
           },()=>{
               this.loadData()
           })
       } else {
           this.setState({
               alert: true,
               message: 'Cannot Set Note',
               severity: 'error',
           })
       } 
   }

   async checkInSubmit() {
         let res = await ConsignmentService.patchOrderDeliveryVehicleReuqests(this.state.selected_id,this.state.arrive_formData)
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
    clearField = () => {
        this.setState({
            filterData: {
                to_date: null,
                from_date: null,
                vehicle_type: null,
                reg_no:"",
            },
        })
    }

    async checkOutSubmit() {
        let res = await ConsignmentService.patchOrderDeliveryVehicleReuqests(this.state.selected_id,this.state.depature_formData)
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
                        <CardTitle title=" All Vehicle Requests " />
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
                                        <SubTitle title="Vehicle Type" />
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.alltypes}
                                            clearOnBlur={true}
                                            clearText="clear"
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let filterData = this.state.filterData;
                                                    filterData.vehicle_type = value.id;
                                                    this.setState({ filterData })
                                                }
                                            }}
                                            value={{
                                                name: this.state.filterData.vehicle_type ? (this.state.alltypes.find((obj) => obj.id == this.state.filterData.vehicle_type).name) : null,
                                                id: this.state.filterData.vehicle_type
                                            }}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Please choose"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    value={this.state.filterData.vehicle_type}
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
                                        <SubTitle title="From" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.from_date}
                                            placeholder="From"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date =>{
                                                
                                                    let filterData = this.state.filterData;
                                                    filterData.from_date = date;
                                                    this.setState({filterData})
                                              
                                            }}
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
                                        <SubTitle title="To" />
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.filterData.to_date}
                                            placeholder="To"
                                            // minDate={new Date()}
                                            // maxDate={new Date()}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date =>{
                                                
                                                    let filterData = this.state.filterData;
                                                    filterData.to_date = date;
                                                    this.setState({filterData})
                                              
                                            }}
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
                                        <SubTitle title="Registration Number" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Registration number"
                                            name="order_list"
                                            // InputProps={{
                                            // endAdornment: (
                                            //         <InputAdornment position="end" disablePointerEvents="true">
                                                       
                                            //         </InputAdornment>
                                            //     )
                                            // }}
                                            value={this.state.filterData.reg_no}
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            onChange={(e) => {
                                                let filterData = this.state.filterData;
                                                filterData.reg_no = e.target.value;
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
                                                    <span className="capitalize">Filter</span>
                                                </Button>
                                            </Grid>

                                            <Grid
                                                style={{ marginTop: 17, marginLeft: 4 }}
                                            >
                                                <Button
                                                    className="mt-2"
                                                    variant="outlined"
                                                    style={{ margin: 4 }}
                                                    onClick={ this.clearField }
                                                >
                                                    <span className="capitalize">Clear</span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item="item" lg={12} md={12} xs={4}>
                                                <div className='flex items-center'>
                                                    <TextValidator className='w-full' placeholder="Search"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" value={this.state.filterData.search} onChange={(e, value) => {
                                                            let filterData = this.state.filterData
                                                            filterData.search = e.target.value;
                                                            this.setState({ filterData })
                                                            console.log("form dat", this.state.filterData)
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
                                                                     <Tooltip title="Search">
                                                                     <IconButton size="small" aria-label="delete">
                                                                <SearchIcon className="text-primary"
                                                                alt="search"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                                 
                                                                </InputAdornment>
                                                            )
                                                        }} />
                                                </div>

                                            </Grid>

                                </Grid>
                            </ValidatorForm>
                        </Grid>

                        {/*Table*/}
                        <Grid style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <LoonsTable
                                        id={"MSD_VEHICLE_REQUESTS"}
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
                            onSubmit={() => this.checkInSubmit()}
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
                            onSubmit={() => this.checkOutSubmit()}
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

                {/* note */}
                <Dialog fullWidth maxWidth="sm" open={this.state.note} >

<MuiDialogTitle disableTypography>
    <CardTitle title="Vehicle Arrive" />

    {/*  <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ dialog_for_select_frontDesk: false }) }}>
        <CloseIcon />
    </IconButton> */}
</MuiDialogTitle>

<div className="w-full h-full px-5 py-5">
    <ValidatorForm
        onSubmit={() => this.checkInNote()}
        onError={() => null}
        className="w-full"
    >
   <SubTitle title="Add Note" />
                                        <TextValidator
                                            className=" w-full"
                                            placeholder="Note"
                                            name="note"
                                            InputLabelProps={{
                                                shrink: false,
                                            }}
                                            value={this.state.note_formDate.note
                                            }
                                            type="text"
                                            variant="outlined"
                                            size="small"
                                            multiline
                                            rows={3}
                                            onChange={(e) => {
                                                let note_formDate = this.state.note_formDate
                                                note_formDate.note = e.target.value
                                                this.setState({ note_formDate })
                                            }}
                                        /*  validators={['required']}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                        />



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
                this.setState({ note: false })

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

export default AllVehicleRequests
