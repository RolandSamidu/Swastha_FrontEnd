import { CircularProgress, Divider, Grid, IconButton, Typography } from "@material-ui/core";
import { LoonsSnackbar, LoonsTable, MainContainer } from "app/components/LoonsLabComponents";
import ClearIcon from '@mui/icons-material/Clear';
import React, { Component } from "react";
import LoonsButton from "app/components/LoonsLabComponents/Button";
import MDSService from "app/services/MDSService";


class MDS_ChangeWorkers extends Component {

    constructor(props) {
        super(props)
        this.state = {
            vehicle_id: null,

            selectedDriversLoaded: false,
            driversDataLoaded: false,
            selectedHelpersLoaded: false,
            helperDataLoaded: false,

            selecteddrivers_columns: [
                {
                    name: 'driver_id',
                    label: 'Driver ID',
                    options: {
                        display: false
                    }
                },
                {
                    name: 'name',
                    label: 'Driver Name',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'Contact No',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'DOB',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'Address',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('meta', tableMeta)
                            return (
                                <Grid>
                                    <IconButton
                                        onClick={() => this.removeDriver(this.state.selecteddrivers_data[tableMeta.rowIndex].id)}
                                        className="px-2"
                                        size="small"
                                        aria-label="delete">
                                        <ClearIcon />
                                    </IconButton>
                                </Grid>
                            );
                        }
                    }
                },
            ],
            selectedhelpers_columns: [
                {
                    name: 'driver_id',
                    label: 'Helper ID',
                    options: {
                        display: false
                    }
                },
                {
                    name: 'name',
                    label: 'Helper Name',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'Contact No',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'DOB',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'Address',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('meta', this.state.selecteddrivers_data[tableMeta.rowIndex])
                            return (
                                <Grid>
                                    <IconButton
                                        onClick={() => this.removeHelper(this.state.selectedHelpers_data[tableMeta.rowIndex].id)}
                                        className="px-2"
                                        size="small"
                                        aria-label="delete">
                                        <ClearIcon />
                                    </IconButton>
                                </Grid>
                            );
                        }
                    }
                },
            ],
            driver_columns: [
                {
                    name: 'vh',
                    label: 'Helper ID',
                    options: {
                        display: false
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
                {
                    name: 'no_of_items',
                    label: 'DOB',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Address',
                    options: {
                        display: true
                    }
                },
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
                                            disabled={(this.state.driver_data[tableMeta.rowIndex].assigned || this.state.driverReserved)}
                                            scrollToTop={true}
                                            onClick={() => { this.handleDriverAssign(this.state.driver_data[tableMeta.rowIndex],tableMeta.rowIndex) }}
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
            helper_columns: [
                {
                    name: 'vh',
                    label: 'Helper ID',
                    options: {
                        display: false
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
                {
                    name: 'no_of_items',
                    label: 'DOB',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'Address',
                    options: {
                        display: true
                    }
                },
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
                                            onClick={() => { this.handleHelperAssign(this.state.helper_data[tableMeta.rowIndex],tableMeta.rowIndex) }}
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

            selecteddrivers_data: [],
            selectedHelpers_data: [],
            driver_data: [],
            helper_data:[],

            alert: false,
            message: '',
            severity: 'success',

            summaryView:false,
            summary_data:[],
            assigned_driver: null,
            assigned_helper: null,

            driverReserved:false,
            helperReserved:false,

            order_delivery_id:null,
            order_vehicleID:null,

            driver_totalitems:null,
            helper_totalitems:null,

        }
    }

    async handleDriverAssign(driver,index) {
        this.setState({
            driversDataLoaded: false,
        })

        let driver_data = this.state.driver_data;
        if(index != -1){
            driver_data[index].assigned = 'true'
        }

        console.log('driver', driver);
        this.setState({
            driver_data,
            driverReserved:true,
            assigned_driver: driver,
            driversDataLoaded:true

        })
    }

    async handleHelperAssign(Helper, index) {
        this.setState({
            helperDataLoaded:false
        })

        let helper_data = this.state.helper_data;
        if(index != -1){
            helper_data[index].assigned = 'true'
        }

        console.log('Helper', Helper);
        this.setState({
            helper_data,
            helperReserved:true,
            helperDataLoaded:true,
            assigned_helper: Helper,

        }, () => this.handleSummaryView())
    }

    async handleSummaryView() {

        this.setState({
            summaryDataLoaded: false
        })
        let reservation = {
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

    async preLoadData() {
        this.setState({
            reservationDetailsLoaded: false
        })
        let res = await MDSService.getVehicleByID('null', this.state.vehicle_id)
        console.log('status', res);
        if (res.status && res.status == 200) {
            this.setState({
                vehicle: res.data.view,
            }, () => this.loadWorkerData())
        }
    }

    async loadWorkerData() {
        let drivers = [];
        let helpers = [];
        // console.log('reserved_vehicle', this.state.reserved_vehicle)

        let res = await MDSService.getVehicleByID('null', this.state.vehicle_id)

        if (res.status && res.status == 200 && res.data.view.VehicleUsers.length > 0) {
            res.data.view.VehicleUsers.forEach(element => {
                if (element.type === 'Driver') {
                    drivers.push({...element,assigned:false})
                }
                else if (element.type === 'Helper') {
                    helpers.push({...element,assigned:false})
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
            driver_totalitems:drivers.length,
            helper_totalitems:helpers.length,
            driversDataLoaded: true,
            helperDataLoaded: true,
        },()=> console.log('driver_data',drivers))
    }

    async removeDriver(id) {
        this.setState({
            selectedDriversLoaded: false
        })
        let selecteddrivers_data = this.state.selecteddrivers_data.filter((obj) => obj.id != id)
        this.setState({
            alert: true,
            message: 'Driver Removed Successfully',
            severity: 'success',
            selecteddrivers_data,
            selectedDriversLoaded: true
        })
    }

    async removeHelper(id) {
        this.setState({
            selectedHelpersLoaded: false
        })
        let selectedHelpers_data = this.state.selectedHelpers_data.filter((obj) => obj.id != id)
        this.setState({
            alert: true,
            message: 'Helper Removed Successfully',
            severity: 'success',
            selectedHelpers_data,
            selectedHelpersLoaded: true
        })
    }

    async setData() {
        let drivers = []
        let helpers = []

        drivers.push(this.props.drivers);
        helpers.push(this.props.helpers);

        // console.log('drivers', drivers);
        // console.log('helpers', helpers);

        this.setState({
            selecteddrivers_data: drivers,
            selectedHelpers_data: helpers,
            selectedDriversLoaded: true,
            selectedHelpersLoaded: true
        }, () => this.preLoadData())
    }

    async handleSubmit(){

        let body = {

            vehicle_id: this.state.vehicle_id,
            driver_id: this.state.assigned_driver.Employee.id,
            helper_id: this.state.assigned_helper.Employee.id,
            order_delivery_id: this.state.order_delivery_id,
            status: "Active"
        }
        console.log('body',body);
        let res = await MDSService.UpdateVehicleWorkers(body,this.state.order_vehicleID)
        if (res.status && res.status == 200) {
            this.setState({
                alert: true,
                message: 'Workers Updated Successfully',
                severity: 'success',
            })
        }else {
            this.setState({
                alert: true,
                message: 'Workers Update Unsuccessful',
                severity: 'error',
            })
        }
    }

    async handleCancel(){
        this.setState({

            driverReserved:false,
            helperReserved:false,
            driversDataLoaded: false,
            helperDataLoaded: false,
            summaryView:false,
        },() =>{
            this.loadWorkerData();
        })
    }

    async componentDidMount() {
        this.setState({
            vehicle_id:this.props.vehicle_id,
            order_vehicleID:this.props.order_vehicleID,
            order_delivery_id:this.props.order_delivery_id
        },()=>  this.setData())
       
    }


    render() {

        return (
            <>
                <MainContainer>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" className="font-semibold">Selected Drivers</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            {
                                this.state.selectedDriversLoaded
                                    ? (
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.selecteddrivers_data}
                                            columns={this.state.selecteddrivers_columns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                print: false,
                                                download: false,
                                                viewColumns: false,
                                                rowsPerPage: 10,
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
                            <Typography variant="h6" className="font-semibold">Assign New Drivers</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            {
                                this.state.driversDataLoaded
                                    ? (
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.driver_data}
                                            columns={this.state.driver_columns}
                                            options={{
                                                pagination: false,
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
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant="h6" className="font-semibold">Selected Helpers</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            {
                                this.state.selectedHelpersLoaded
                                    ? (
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.selectedHelpers_data}
                                            columns={this.state.selectedhelpers_columns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                print: false,
                                                download: false,
                                                viewColumns: false,
                                                rowsPerPage: 10,
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
                            <Typography variant="h6" className="font-semibold">Assign New Helpers</Typography>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}>
                            {
                                this.state.helperDataLoaded
                                    ? (
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.helper_data}
                                            columns={this.state.helper_columns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                print: false,
                                                download: false,
                                                viewColumns: false,
                                                rowsPerPage: 10,
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
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant='h6' className="font-semibold"> Workers Summary</Typography>
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
                            </Grid>
                        </Grid>

                    }
                </MainContainer>
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled">
                </LoonsSnackbar>
            </>

        )
    }

}

export default MDS_ChangeWorkers