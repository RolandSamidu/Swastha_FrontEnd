import { CircularProgress, Divider, Grid, InputAdornment, Typography } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { LoonsSnackbar, LoonsTable, SubTitle } from "app/components/LoonsLabComponents";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import React, { Component } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search';
import localStorageService from 'app/services/localStorageService';
import MDSService from 'app/services/MDSService'
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import VehicleService from "app/services/VehicleService";


class MDS_AddVehicle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            owner_id: null,
            order_delivery_id: null,
            vehicle_filterData: {
                page: 0,
                limit: 10,
                storage_type: null,
                vehicle_type: null,
                search: null
            },
            vehicle_totalitems: null,
            driver_totalitems: null,
            helper_totalitems: null,
            vehicle_data: [],
            driver_data: [],
            helper_data: [],
            summary_data: [],

            loadData: {
                type: ["Consultant"]
            },
            vehicle_columns: [
                {
                    name: 'reg_no',
                    label: 'Vehicle Reg No',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'VehicleType',
                    label: 'Vehicle Type',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Vehicle Storage Type',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'max_volume',
                    label: 'Max Volume',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', this.state.vehicle_data[tableMeta.rowIndex]);
                            return (
                                <>
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <LoonsButton
                                            // color="success"
                                            className="mt-2"
                                            progress={false}
                                            disabled={(this.state.vehicle_data[tableMeta.rowIndex].reserved || this.state.vehicleReserved)}
                                            scrollToTop={true}
                                            onClick={() => { this.handleReserve(this.state.vehicle_data[tableMeta.rowIndex], tableMeta.rowIndex) }}
                                        >
                                            <span className="capitalize">{this.state.vehicle_data[tableMeta.rowIndex].reserved ? 'Reserved' : 'Reserve'}</span>
                                        </LoonsButton>
                                    </div>

                                </>
                            )
                        },
                    },
                },
                {
                    name: 'no_of_items',
                    label: 'Reserved Date',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Time',
                    options: {
                        display: true
                    }
                },
            ],
            driver_columns: [
                {
                    name: 'vh',
                    label: 'Driver ID',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'Employee',
                    label: 'Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Contact Number',
                    options: {
                        display: true
                    }
                },
                // {
                //     name: 'no_of_items',
                //     label: 'DOB',
                //     options: {
                //         display: true
                //     }
                // },
                // {
                //     name: 'no_of_items',
                //     label: 'Address',
                //     options: {
                //         display: true
                //     }
                // },
                {
                    name: 'no_of_items',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', this.state.driver_data[tableMeta.rowIndex]);
                            return (
                                <>
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <LoonsButton
                                            // color="success"
                                            className="mt-2"
                                            progress={false}
                                            disabled={(this.state.driver_data[tableMeta.rowIndex].assigned || this.state.driverReserved)}
                                            scrollToTop={true}
                                            onClick={() => { this.handleDriverAssign(this.state.driver_data[tableMeta.rowIndex], tableMeta.rowIndex) }}
                                        >
                                            <span className="capitalize">{this.state.driver_data[tableMeta.rowIndex].assigned ? 'Assigned' : 'Assign'}</span>
                                        </LoonsButton>
                                    </div>

                                </>
                            )
                        },
                    }
                },

            ],
            Helper_columns: [
                {
                    name: 'vh',
                    label: 'Driver ID',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'Employee',
                    label: 'Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Contact Number',
                    options: {
                        display: true
                    }
                },
                // {
                //     name: 'no_of_items',
                //     label: 'DOB',
                //     options: {
                //         display: true
                //     }
                // },
                // {
                //     name: 'no_of_items',
                //     label: 'Address',
                //     options: {
                //         display: true
                //     }
                // },
                {
                    name: 'no_of_items',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', this.state.helper_data[tableMeta.rowIndex]);
                            return (
                                <>
                                    <div style={{ display: "flex", alignItems: 'center' }}>
                                        <LoonsButton
                                            // color="success"
                                            className="mt-2"
                                            progress={false}
                                            disabled={(this.state.helper_data[tableMeta.rowIndex].assigned || this.state.helperReserved)}
                                            scrollToTop={true}
                                            onClick={() => { this.handleHelperAssign(this.state.helper_data[tableMeta.rowIndex], tableMeta.rowIndex) }}
                                        >
                                            <span className="capitalize">{this.state.helper_data[tableMeta.rowIndex].assigned ? 'Assigned' : 'Assign'}</span>
                                        </LoonsButton>
                                    </div>

                                </>
                            )
                        },
                    }
                },

            ],
            summary_columns: [
                {
                    name: 'vehicle',
                    label: 'Vehicle Reg No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('vehicle', tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                            }
                        }
                    }
                },
                {
                    name: 'driver',
                    label: 'Driver Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('driver', tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex].Employee == null || tableMeta.rowData[tableMeta.columnIndex].Employee == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].Employee.name)
                            }
                        }
                    }
                },
                {
                    name: 'helper',
                    label: 'Helper Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('helper', tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex].Employee == null || tableMeta.rowData[tableMeta.columnIndex].Employee == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].Employee.name)
                            }
                        }
                    }
                },
            ],
            storage_types: [
                { label: 'AC' },
                { label: 'Cool' },
                { label: 'Normal' }
            ],
            vehicle_types: [
                { label: 'Van' },
                { label: 'Ambulance' },
                { label: 'Light Truck' },
                { label: 'Medium Truck' },
                { label: 'Heavy Truck' }
            ],
            vehicletableDataLoaded: false,
            drivertableDataLoaded: false,
            helpertableDataLoaded: false,
            summaryDataLoaded: false,


            summaryView: false,

            assigned_driver: null,
            assigned_helper: null,
            reserved_vehicle: null,

            vehicleReserved: false,
            driverReserved: false,
            helperReserved: false,

            alert: false,
            message: '',
            severity: 'success',
        }
    }

    async loadOwnerID() {
        let value = await localStorageService.getItem('owner_id')
        console.log(value)
        if (value) {
            this.setState({
                owner_id: value
            })
            this.loadVehicleData()
        }
        else {
            this.setState({
                owner_id: null,
            })
        }
    }

    async loadData() {
        this.setState({ loaded: false })
        let user_res = await VehicleService.getVehicleUsers(this.state.loadData);
        if (user_res.status == 200) {
            console.log('data', user_res.data.view.data);
            this.setState({
                employees: user_res.data.view.data,
                totalPages: user_res.data.view.totalPages,
                totalItems: user_res.data.view.totalItems,
            })
        }

        let res = await PharmacyOrderService.getRemarks()
        if (res.status == 200) {
            let remarks = [...res.data.view.data, { remark: 'Other' }]
            this.setState({
                remarks: remarks,
                loaded: true
            },
                () => { console.log(this.state.remarks); this.render() })
            return;
        }

    }

    async handleDriverAssign(driver, index) {
        this.setState({
            drivertableDataLoaded: false,
        })

        let driver_data = this.state.driver_data;
        if (index != -1) {
            driver_data[index].assigned = 'true'
        }

        console.log('driver', driver);
        this.setState({
            driver_data,
            driverReserved: true,
            assigned_driver: driver,
            drivertableDataLoaded: true

        })
    }

    async handleHelperAssign(Helper, index) {
        this.setState({
            helpertableDataLoaded: false
        })

        let helper_data = this.state.helper_data;
        if (index != -1) {
            helper_data[index].assigned = 'true'
        }

        console.log('Helper', Helper);
        this.setState({
            helper_data,
            helperReserved: true,
            helpertableDataLoaded: true,
            assigned_helper: Helper,

        }, () => this.handleSummaryView())
    }

    async handleReserve(vehicle, index) {
        this.setState({
            vehicletableDataLoaded: false
        })

        let vehicle_data = this.state.vehicle_data;
        if (index != -1) {
            vehicle_data[index].reserved = 'true'
        }

        console.log('vehicle', vehicle);
        this.setState({
            vehicle_data,
            vehicleReserved: true,
            pickUpDialogView: true,
            reserved_vehicle: vehicle,
            driverView: true,
            vehicletableDataLoaded: true,
            drivertableDataLoaded: false,
            helpertableDataLoaded: false,
        }, () => this.loadDataAfterReserve())
    }

    async handleSummaryView() {

        this.setState({
            summaryDataLoaded: false
        })
        let reservation = {
            vehicle: this.state.reserved_vehicle,
            driver: this.state.assigned_driver,
            helper: this.state.assigned_helper,
        }
        let summary_data = this.state.summary_data
        summary_data.push(reservation);
        this.setState({
            summary_data,
            summaryView: true,
            summaryDataLoaded: true,
        }, () => console.log('summary', this.state.summary_data))
    }

    async loadDataAfterReserve() {
        let drivers = [];
        let helpers = [];
        console.log('reserved_vehicle', this.state.reserved_vehicle)
        if (this.state.reserved_vehicle.VehicleUsers.length > 0) {
            this.state.reserved_vehicle.VehicleUsers.forEach(element => {
                if (element.type === 'Driver') {
                    drivers.push({ ...element, assigned: false })
                }
                else if (element.type === 'Helper') {
                    helpers.push({ ...element, assigned: false })
                }
            });
        } else {
            this.setState({
                alert: true,
                message: 'No drivers or Helpers Found',
                severity: 'error',

            })
        }
        this.setState({
            driver_data: drivers,
            helper_data: helpers,
            driver_totalitems: drivers.length,
            helper_totalitems: helpers.length,
            drivertableDataLoaded: true,
            helpertableDataLoaded: true,
        })
    }

    async loadVehicleData() {
        this.setState({ vehicletableDataLoaded: false })
        let vehicle_filterData =this.state.vehicle_filterData
        vehicle_filterData.order_delivery_id= this.state.order_delivery_id
        let res = await MDSService.getAllVehicles(vehicle_filterData,this.state.owner_id)
        if (res.status && res.status == 200) {
            let data = [];
            if (res.data.view.data.length > 0) {
                res.data.view.data.forEach((element) => {
                    data.push({ ...element, reserved: false })
                })
            }
            this.setState({
                vehicle_data: data,
                vehicle_totalitems: res.data.view.totalItems,
                vehicletableDataLoaded: true
            })
        }
        else {
            return;
        }


    }

    async handleCancel() {
        this.setState({
            vehicleReserved: false,
            driverReserved: false,
            helperReserved: false,
            driverView: false,
            summaryView: false,
        }, () => {
            this.loadVehicleData();
        })
    }

    async handleSubmit() {
        let body = {

            vehicle_id: this.state.reserved_vehicle.id,
            driver_id: this.state.assigned_driver.Employee.id,
            helper_id: this.state.assigned_helper.Employee.id,
            order_delivery_id: this.state.order_delivery_id,
            status: "Active"
        }

        console.log('body', body);
        let res = await MDSService.AddVehicleToOrder(body)
        if (res.status && res.status == 201) {
            this.setState({
                alert: true,
                message: 'Vehicle Added Successfully',
                severity: 'success',
            })
        } else {
            this.setState({
                alert: true,
                message: 'Vehicle Addition Unsuccessful',
                severity: 'error',
            })
        }
    }


    async componentDidMount() {
        // let selectedObj = this.props.location.state
        this.setState({
            order_delivery_id: this.props.delivery_id
        }, () => console.log('iddddd', this.props.delivery_id))
        this.loadOwnerID();
        this.loadData();
        // let order = this.state.order;
        // order.order_exchange_id = this.props.id.id

        // this.setState({
        //     order
        // }, () => console.log("patient", this.state.order))
    }

    render() {

        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <ValidatorForm>
                            <Grid item xs={12}>
                                <Typography variant='h6' className="font-semibold"> 1. Select Vehicle</Typography>

                            </Grid>
                            <Grid item xs={12} className='my-5'>
                                <Grid item xs={12}>
                                    <Typography variant='subtitle1' className="font-semibold"> Filters</Typography>
                                    <Divider />
                                </Grid>
                                <Grid item xs={12} style={{ display: 'flex' }}>
                                    <Grid item xs={4} className='mx-2'>
                                        <SubTitle title="Storage type" />
                                        <Autocomplete
                                        disableClearable className="w-full"
                                            options={this.state.storage_types}
                                            onChange={(e, value) => {
                                                let vehicle_filterData = this.state.vehicle_filterData
                                                if (value != null) {
                                                    vehicle_filterData.storage_type = value.label
                                                } else {
                                                    vehicle_filterData.storage_type = null
                                                }

                                                this.setState({ vehicle_filterData })
                                            }}
                                            /*  defaultValue={this.state.all_district.find(
                                            (v) => v.id == this.state.formData.district_id
                                            )} */
                                            // value={this
                                            //     .state
                                            //     .all_ven
                                            //     .find((v) => v.id == this.state.formData.ven_id)}
                                            getOptionLabel={(
                                                option) => option.label
                                                    ? option.label
                                                    : ''}
                                            renderInput={(params) => (
                                                <TextValidator {...params} placeholder="Storage Type"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={4} className='mx-2'>
                                        <SubTitle title="Storage type" />
                                        <Autocomplete
                                        disableClearable className="w-full"
                                            options={this.state.vehicle_types}
                                            onChange={(e, value) => {
                                                let vehicle_filterData = this.state.vehicle_filterData
                                                if (value != null) {
                                                    vehicle_filterData.vehicle_type = value.label
                                                } else {
                                                    vehicle_filterData.vehicle_type = null
                                                }

                                                this.setState({ vehicle_filterData })
                                            }}
                                            /*  defaultValue={this.state.all_district.find(
                                            (v) => v.id == this.state.formData.district_id
                                            )} */
                                            // value={this
                                            //     .state
                                            //     .all_ven
                                            //     .find((v) => v.id == this.state.formData.ven_id)}
                                            getOptionLabel={(
                                                option) => option.label
                                                    ? option.label
                                                    : ''}
                                            renderInput={(params) => (
                                                <TextValidator {...params} placeholder="Vehicle Type"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                        <LoonsButton
                                            className="mt-2"
                                            progress={false}
                                            scrollToTop={true}
                                        //onClick={this.handleChange}
                                        >
                                            <span className="capitalize">Filter</span>
                                        </LoonsButton>
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                    <SubTitle title='Search' />
                                    <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                        //value={this.state.formData.search} 
                                        onChange={(e, value) => {
                                            let vehicle_filterData = this.state.vehicle_filterData
                                            if (e.target.value != '') {
                                                vehicle_filterData.search = e.target.value;
                                            } else {
                                                vehicle_filterData.search = null
                                            }
                                            this.setState({ vehicle_filterData })
                                            console.log("form dat", this.state.vehicle_filterData)
                                        }}

                                        onKeyPress={(e) => {
                                            if (e.key == "Enter") {
                                                // this.LoadOrderItemDetails()
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
                            <Grid item xs={12} className='my-3'>
                                {
                                    this.state.vehicletableDataLoaded
                                        ? (
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'}
                                                data={this.state.vehicle_data}
                                                columns={this.state.vehicle_columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    print: false,
                                                    download: false,
                                                    viewColumns: false,
                                                    count: this.state.vehicle_totalitems,
                                                    rowsPerPage: this.state.vehicle_filterData.limit,
                                                    page: this.state.vehicle_filterData.page,
                                                    // onTableChange: (action, tableState) => {
                                                    //     console.log('trigg', action, tableState)
                                                    //     switch (action) {
                                                    //         case 'changePage':
                                                    //             this.setPage(tableState.page)
                                                    //             break
                                                    //         case 'sort':
                                                    //             //this.sort(tableState.page, tableState.sortOrder);
                                                    //             break
                                                    //         default:
                                                    //             console.log('action not handled.')
                                                    //     }
                                                    // }
                                                }}></LoonsTable>
                                        )
                                        : (
                                            //load loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )
                                }
                            </Grid>
                        </ValidatorForm>

                    </Grid>
                    {this.state.driverView &&
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <ValidatorForm>
                                        <Grid item xs={12}>
                                            <Typography variant='h6' className="font-semibold"> 2. Select Driver</Typography>

                                        </Grid>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Grid item xs={4} >
                                                <SubTitle title='Search' />
                                                <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                                    //value={this.state.formData.search} 
                                                    onChange={(e, value) => {
                                                        let vehicle_filterData = this.state.vehicle_filterData
                                                        if (e.target.value != '') {
                                                            vehicle_filterData.search = e.target.value;
                                                        } else {
                                                            vehicle_filterData.search = null
                                                        }
                                                        this.setState({ vehicle_filterData })
                                                        console.log("form dat", this.state.vehicle_filterData)
                                                    }}

                                                    onKeyPress={(e) => {
                                                        if (e.key == "Enter") {
                                                            // this.LoadOrderItemDetails()
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
                                    <Grid item xs={12}>
                                        {
                                            this.state.drivertableDataLoaded
                                                ? (
                                                    <LoonsTable
                                                        //title={"All Aptitute Tests"}
                                                        id={'allAptitute'}
                                                        data={this.state.driver_data}
                                                        columns={this.state.driver_columns}
                                                        options={{
                                                            pagination: true,
                                                            serverSide: true,
                                                            print: false,
                                                            download: false,
                                                            viewColumns: false,
                                                            count: this.state.driver_totalitems,
                                                            rowsPerPage: 10,
                                                            page: 0,
                                                            // onTableChange: (action, tableState) => {
                                                            //     console.log('trigg', action, tableState)
                                                            //     switch (action) {
                                                            //         case 'changePage':
                                                            //             this.setPage(tableState.page)
                                                            //             break
                                                            //         case 'sort':
                                                            //             //this.sort(tableState.page, tableState.sortOrder);
                                                            //             break
                                                            //         default:
                                                            //             console.log('action not handled.')
                                                            //     }
                                                            // }
                                                        }}></LoonsTable>
                                                )
                                                : (
                                                    //load loading effect
                                                    <Grid className="justify-center text-center w-full pt-12">
                                                        <CircularProgress size={30} />
                                                    </Grid>
                                                )
                                        }
                                    </Grid>
                                </Grid>
                                {/* <Divider orientation="vertical" flexItem /> */}
                                <Grid item xs={6}>

                                    <ValidatorForm>
                                        <Grid item xs={12}>
                                            <Typography variant='h6' className="font-semibold"> 3. Select Helper</Typography>

                                        </Grid>
                                        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Grid item xs={4} >
                                                <SubTitle title='Search' />
                                                <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                                    //value={this.state.formData.search} 
                                                    onChange={(e, value) => {
                                                        let vehicle_filterData = this.state.vehicle_filterData
                                                        if (e.target.value != '') {
                                                            vehicle_filterData.search = e.target.value;
                                                        } else {
                                                            vehicle_filterData.search = null
                                                        }
                                                        this.setState({ vehicle_filterData })
                                                        console.log("form dat", this.state.vehicle_filterData)
                                                    }}

                                                    onKeyPress={(e) => {
                                                        if (e.key == "Enter") {
                                                            // this.LoadOrderItemDetails()
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
                                    <Grid item xs={12}>
                                        {
                                            this.state.helpertableDataLoaded
                                                ? (
                                                    <LoonsTable
                                                        //title={"All Aptitute Tests"}
                                                        id={'allAptitute'}
                                                        data={this.state.helper_data}
                                                        columns={this.state.Helper_columns}
                                                        options={{
                                                            pagination: true,
                                                            serverSide: true,
                                                            print: false,
                                                            download: false,
                                                            viewColumns: false,
                                                            count: this.state.helper_totalitems,
                                                            rowsPerPage: 10,
                                                            page: 0,
                                                            // onTableChange: (action, tableState) => {
                                                            //     console.log('trigg', action, tableState)
                                                            //     switch (action) {
                                                            //         case 'changePage':
                                                            //             this.setPage(tableState.page)
                                                            //             break
                                                            //         case 'sort':
                                                            //             //this.sort(tableState.page, tableState.sortOrder);
                                                            //             break
                                                            //         default:
                                                            //             console.log('action not handled.')
                                                            //     }
                                                            // }
                                                        }}></LoonsTable>
                                                )
                                                : (
                                                    //load loading effect
                                                    <Grid className="justify-center text-center w-full pt-12">
                                                        <CircularProgress size={30} />
                                                    </Grid>
                                                )
                                        }
                                    </Grid>
                                </Grid>
                                {
                                    this.state.summaryView &&
                                    <>
                                        <Grid item xs={12}>
                                            <Typography variant='h6' className="font-semibold"> Vehicle Summary</Typography>
                                            <Divider />
                                            {
                                                this.state.summaryDataLoaded
                                                    ? (
                                                        <LoonsTable
                                                            //title={"All Aptitute Tests"}
                                                            id={'allAptitute'}
                                                            data={this.state.summary_data}
                                                            columns={this.state.summary_columns}
                                                            options={{
                                                                pagination: false,
                                                                serverSide: true,
                                                                print: false,
                                                                download: false,
                                                                viewColumns: false
                                                                // count: this.state.totalItems,
                                                                // rowsPerPage: this.state.filterData.limit,
                                                                // page: this.state.filterData.page,
                                                                // onTableChange: (action, tableState) => {
                                                                //     console.log('trigg', action, tableState)
                                                                //     switch (action) {
                                                                //         case 'changePage':
                                                                //             this.setPage(tableState.page)
                                                                //             break
                                                                //         case 'sort':
                                                                //             //this.sort(tableState.page, tableState.sortOrder);
                                                                //             break
                                                                //         default:
                                                                //             console.log('action not handled.')
                                                                //     }
                                                                // }
                                                            }}></LoonsTable>
                                                    )
                                                    : (
                                                        //load loading effect
                                                        <Grid className="justify-center text-center w-full pt-12">
                                                            <CircularProgress size={30} />
                                                        </Grid>
                                                    )
                                            }
                                        </Grid>
                                        <Grid item xs={12}>

                                            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                                <Grid item lg={1} md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <LoonsButton
                                                        // color="success"
                                                        className="mt-2"
                                                        progress={false}
                                                        type="submit"
                                                        scrollToTop={true}
                                                        onClick={() => this.handleSubmit()}
                                                    >
                                                        <span className="capitalize">Save</span>
                                                    </LoonsButton>
                                                </Grid>
                                                <Grid item lg={1} md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                    <LoonsButton
                                                        color="secondary"
                                                        className="mt-2"
                                                        progress={false}
                                                        // type="submit"
                                                        scrollToTop={true}
                                                        onClick={()=>this.handleCancel()}
                                                    >
                                                        <span className="capitalize">Cancel</span>
                                                    </LoonsButton>
                                                </Grid>
                                            </div>
                                        </Grid>
                                    </>

                                }

                            </Grid>

                        </>
                    }
                </Grid>
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
            </>
        )
    }
}

export default MDS_AddVehicle