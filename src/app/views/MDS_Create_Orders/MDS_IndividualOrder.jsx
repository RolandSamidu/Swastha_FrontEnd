import {
    CircularProgress,
    Dialog,
    Divider,
    Grid,
    Icon,
    IconButton,
    InputAdornment,
    Typography
} from "@material-ui/core";
import { Button, CardTitle, LoonsCard, LoonsSnackbar, LoonsTable, MainContainer, SubTitle } from "app/components/LoonsLabComponents";
import React, { Fragment } from "react";
import { Component } from "react";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import { Autocomplete } from "@material-ui/lab";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import LoonsButton from "app/components/LoonsLabComponents/Button";
import SearchIcon from '@material-ui/icons/Search';
import ChiefPharmacistServices from "app/services/ChiefPharmacistServices";
import PharmacyOrderService from "app/services/PharmacyOrderService";
import WarehouseServices from "app/services/WarehouseServices";
import CategoryService from "app/services/datasetupServices/CategoryService";
import ClassDataSetupService from "app/services/datasetupServices/ClassDataSetupService";
import GroupSetupService from "app/services/datasetupServices/GroupSetupService";
import localStorageService from "app/services/localStorageService";
import MDSService from "app/services/MDSService";
import ClearIcon from '@mui/icons-material/Clear';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import LoonsDatePicker from "app/components/LoonsLabComponents/DatePicker";
import MDS_AddVehicle from "./MDS_AddVehicle";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles'
import MDS_VehiclePopUp from "./MDS_VehiclePopUp";
import MDS_ChangeWorkers from "./MDS_ChangeWorkers";
import CancelIcon from '@material-ui/icons/Cancel';
import EmployeeServices from 'app/services/EmployeeServices'
import VehicleService from 'app/services/VehicleService'


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

class MDS_IndividualOrder extends Component {

    constructor(props) {
        super(props)
        this.state = {
            order: null,
            formData: {
                ven_id: null,
                item_class_id: null,
                item_category: null,
                status: null,
                item_group: null,
                drug_store: null,
                search: null,
                order_exchange_id: this.props.match.params.id
            },
            remarks: null,
            data: [],
            summary_data: [
                {
                    storage_type: 'Cold Storage',
                    no_of_items: 10
                },
                {
                    storage_type: 'Room Temperature',
                    no_of_items: 20
                },
                {
                    storage_type: 'Humidity',
                    no_of_items: 30
                }
            ],
            summary_columns: [
                {
                    name: 'storage_type',
                    label: 'Storage Type',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'no_of_items',
                    label: 'No of Items',
                    options: {
                        display: true
                    }
                },
            ],
            columns: [
                {
                    name: 'Vehicle',
                    label: 'Vehicle Owner',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex].owner_id)
                        }
                    }
                },
                {
                    name: 'Vehicle',
                    label: 'Vehicle Reg No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                        }
                    }
                },
                {
                    name: 'Driver',
                    label: 'Driver',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex]?.name)
                        }
                    }
                },
                {
                    name: 'ordered_qty',
                    label: 'Vehicle Type',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     return this
                        //         .state
                        //         .itemTable[tableMeta.rowIndex]
                        //         .request_quantity
                        // }
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'Vehicle Storage Type',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'Vehicle',
                    label: 'Max Volume',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex].max_volume)
                        }
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'Reserved Capacity',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'Vehicle',
                    label: 'Status',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex].status)
                        }
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'Reserved Date',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'drugstore_qty',
                    label: 'Time',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('data', this.state.order[tableMeta.rowIndex])
                            console.log('tabledata', tableMeta.rowData[tableMeta.rowIndex])
                            return (
                                <Grid>
                                    <IconButton
                                        onClick={() => this.setState({
                                            selected_vehicle_id: this.state.order[tableMeta.rowIndex].id,
                                            deleteWarning_view: true,
                                        })}
                                        className="px-2"
                                        size="small"
                                        aria-label="delete">
                                        <ClearIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => this.showVehicleSpec(tableMeta.rowData[tableMeta.rowIndex].id)}
                                        className="px-2"
                                        size="small"
                                        aria-label="delete">
                                        <LocalShippingIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => this.showWorkers(tableMeta.rowData[tableMeta.rowIndex].id, this.state.order[tableMeta.rowIndex].id, this.state.order[tableMeta.rowIndex])}
                                        className="px-2"
                                        size="small"
                                        aria-label="delete">
                                        <PersonIcon />
                                    </IconButton>

                                </Grid>
                            );
                        }
                    }

                }
            ],
            totalItems: null,
            loaded: false,
            vehicle_data: [],
            partnership_data: [
                {
                    something: 'fk'
                }
            ],
            approveOrder: {
                order_exchange_id: this.props.match.params.id,
                activity: "ordered",
                date: "2022-07-02T22:11:38.000Z",
                status: "APPROVED",
                remark_id: null,
                remark_by: null,
                type: "APPROVED",
            },
            tableDataLoaded: true,
            request_partnership: false,
            vehicle_totalItems: null,
            partnership_totalItems: null,
            vehicle_filterData: {
                page: 0,
                limit: 10,
                order_delivery_id: null,
                "order[0][0]": 'updatedAt',
                "order[0][1]": 'Desc'
            },
            partnership_filterData: {
                page: 0,
                limit: 10
            },
            selected_vehicle_id: null,
            order_vehicle_id: null,
            selectedvehicle_drivers: null,
            selectedvehicle_helpers: null,
            deleteWarning_view: false,
            viewLoaded: false,
            alert: false,
            message: '',
            severity: 'success',
            updateOrder: {
                delivery_id: null,
                pickup_person_id: null,
            },
            changePickUpPerson: false,
            pickUpDialogView: false,
            employees: [],
            pickUpPerson: {
                id: null,
                name: null,
                contactNum: null
            },

        }
    }

    async removeVehicle() {
        console.log('selected', this.state.selected_vehicle_id);
        let res = await MDSService.removeVehicle(this.state.selected_vehicle_id)
        if (res.status && res.status == 200) {
            this.setState({
                selected_vehicle_id: null,
                alert: true,
                message: 'Vehicle Removed Successfully',
                severity: 'success',
            }, () => this.preLoadData())
        } else {
            this.setState({
                selected_vehicle_id: null,
                alert: true,
                message: 'Vehicle Removal Unsuccessful',
                severity: 'error',
            })
        }

    }

    async LoadPickUpPersonDetails(id) {
            let res = await EmployeeServices.getEmployeeByID(id)
            console.log("pickUpPerson Data", res.data)
            if (res.status) {
                console.log("pickUpPerson Data", res.data.view)
                this.setState({
                    pickUpPerson: {
                        id: res.data.view.employee_id,
                        name: res.data.view.name,
                        contactNum: res.data.view.contact_no,
                    },
                    viewLoaded: true,
                })
            }
        
    }

    async preLoadData() {
        this.setState({
            loaded: false,
            viewLoaded: false,
        })
        let res = await MDSService.getAllOrderVehicles(this.state.vehicle_filterData)
        if (res.status && res.status == 200) {
            this.setState({
                order: res.data.view.data,
                vehicle_totalItems: res.data.view.totalItems,
                loaded: true,

            }, () => this.LoadPickUpPersonDetails(res.data.view.data[0].OrderDelivery.pickup_person_id))
        }
    }

    async showVehicleSpec(id) {
        console.log('akjbfgafb', id);
        this.setState({
            selected_vehicle_id: id,
            vehicleSpecsView: true
        })
    }

    async showWorkers(id, orderVehicleId, data) {
        console.log('akjbfgafb', id);
        this.setState({
            selected_vehicle_id: id,
            order_vehicle_id: orderVehicleId,
            selectedvehicle_drivers: data.Driver,
            selectedvehicle_helpers: data.Helper,
            workerView: true
        })
    }

    handleUpdatePickUpDetails() {

        this.setState({ changePickUpPerson: true })
        let updateOrder = this.state.updateOrder;
        updateOrder.pickup_person_id = this.state.order[0].OrderDelivery.pickup_person_id
        updateOrder.delivery_id = this.state.order[0].OrderDelivery.id
        this.setState({ updateOrder })

        this.setState({ pickUpDialogView: true })
        this.loadDeliveryData();

    }

    async loadDeliveryData() {
        this.setState({ deliveryDataLoaded: false })
        let user_res = await VehicleService.getVehicleUsers(this.state.pickUpFilterData);
        if (user_res.status == 200) {
            console.log('data', user_res.data.view.data);
            this.setState({
                employees: user_res.data.view.data,
                deliveryDataLoaded: true
                // totalPages: user_res.data.view.totalPages,
                // totalItems: user_res.data.view.totalItems,
            })
        }
    }

    async onSubmit() {

        let body = { pickup_person_id: this.state.updateOrder.pickup_person_id, remarks: [],  vehicle_details: []}
        console.log("body", body)
        let res = await PharmacyOrderService.updatePickUpDetails(this.state.updateOrder.delivery_id, body)
        if (res.status && res.status == 200) {
            this.setState({
                alert: true,
                message: 'Order Updated Successfully',
                severity: 'success',
            })
            // window.location.reload();
        } else {
            this.setState({
                alert: true,
                message: 'Order Updated Unsuccessful',
                severity: 'error',
            })
        }

        this.setState({ pickUpDialogView: false })
        this.preLoadData()
        // this.LoadPickUpPersonDetails()
        // this.LoadOrderDetails()
    }

    // async approveOrder() {
    //     let approve = await ChiefPharmacistServices.approveOrder(this.state.approveOrder)
    //     if (approve.status == 201) {
    //         console.log(approve.data)
    //         if (approve.data.posted == "data has been added successfully.") {
    //             console.log("done")
    //             window.location = '/chiefPharmacist/AllOders'
    //         } else {
    //             alert("Failed")
    //         }
    //     }
    // }

    // async setPage(page) {
    //     //Change paginations
    //     let getCartItems = this.state.getCartItems
    //     getCartItems.page = page
    //     this.setState({
    //         getCartItems
    //     }, () => {
    //         console.log("New formdata", this.state.getCartItems)
    //         this.getCartItems()
    //     })
    // }

    componentDidMount() {
        let vehicle_filterData = this.state.vehicle_filterData
        vehicle_filterData.order_delivery_id = this.props.match.params.id
        this.setState({
            vehicle_filterData
        }, () => this.preLoadData())

    }

    render() {

        const { classes } = this.props

        return (
            <MainContainer>
                {this.state.viewLoaded ?
                    <LoonsCard>
                        <Grid container style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Individual Order</h3>
                            {/* {
                        this.state.order && this.state.order.type == 'Order' ?
                            (<h5 style={{ color: 'red' }}>Special Order</h5>) :
                            ('')
                    } */}

                        </Grid>
                        <Divider />
                        <Grid container className='mt-5 mb-2'>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={`Order ID : ${this.state.order[0].OrderDelivery.OrderExchange ? this.state.order[0].OrderDelivery.OrderExchange.order_id : 'N/A'}`} />
                            </Grid>
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={`Drug Store : ${this.state.order[0].OrderDelivery.OrderExchange.fromStore ? this.state.order[0].OrderDelivery.OrderExchange.fromStore.name : 'na'}`} />
                            </Grid>
                            <Grid item lg={4} md={2} sm={2} xs={2}></Grid>
                            {/* <Grid item lg={2} md={3} sm={3} xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                <SubTitle title={`Vehicle : `} />
                                <LocalShippingIcon className='ml-3' fontSize='medium' />
                                {
                                    (this.state.pickUpPerson.id) && (this.state.order.status != "REJECTED") ?
                                        (
                                            <Button
                                                className="ml-3"
                                                progress={false}
                                                scrollToTop={false}
                                                // type='submit'
                                                // startIcon="search"
                                                onClick={() => { this.handleUpdatePickUpDetails() }}
                                            >
                                                <span className="capitalize">Change</span>
                                            </Button>
                                        )
                                        :
                                        ("")
                                }
                                <Icon className='ml-5' style={{ fontSize: 'large' }}>person</Icon>
                            </Grid> */}
                            <Grid item lg={2} md={3} sm={3} xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                <SubTitle title={`Pick Up Person : `} />
                                <Icon className='ml-3' style={{ fontSize: 'large' }}>person</Icon>
                                {
                                    (this.state.pickUpPerson.id) && (this.state.order[0].status != "REJECTED") ?
                                        (
                                            <Button
                                                className="ml-3"
                                                progress={false}
                                                scrollToTop={false}
                                                // type='submit'
                                                // startIcon="search"
                                                onClick={() => { this.handleUpdatePickUpDetails() }}
                                            >
                                                <span className="capitalize">Change</span>
                                            </Button>
                                        )
                                        :
                                        ("")
                                }

                            </Grid>
                        </Grid>
                        <Grid container className='mb-5'>
                            <Grid item lg={8} md={6} sm={6} xs={6}></Grid>
                            {/* <Grid item lg={2} md={3} sm={3} xs={3}>
                                <SubTitle title={`ID : ${this.state.order[0].Vehicle ? this.state.order[0].Vehicle.reg_no : "Not Assigned"}`} />
                                <SubTitle title={`Type : ${this.state.order[0].Vehicle ? this.state.order[0].Vehicle.make : "Not Assigned"}`} />
                            </Grid> */}
                            <Grid item lg={2} md={3} sm={3} xs={3}>
                                <SubTitle title={`ID : ${this.state.pickUpPerson ? this.state.pickUpPerson.id : "Not Assigned"}`} />
                                <SubTitle title={`Name : ${this.state.pickUpPerson ? this.state.pickUpPerson.name : "Not Assigned"}`} />
                                <SubTitle title={`Contact Number : ${this.state.pickUpPerson ? this.state.pickUpPerson.contactNum : "Not Assigned"}`} />
                            </Grid>
                        </Grid>
                        <Divider className='mb-4'></Divider>
                        {/**Need to connect backend */}
                        {/* <Grid container spacing={2} >
                <Grid item xs={12} lg={12}>
                    <Typography variant='h6' className="font-semibold"> This order contains below transfer storage types</Typography>
                    <Divider />

                </Grid>

                <Grid item xs={6} lg={6}>
                    {
                        this.state.tableDataLoaded
                            ? (
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allAptitute'}
                                    data={this.state.summary_data}
                                    columns={this.state.summary_columns}
                                    options={{
                                        pagination: false,
                                        serverSide: false,
                                        print: false,
                                        download: false,
                                        viewColumns: false,
                                        count: this.state.vehicle_totalItems,
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

                                    }}
                                >

                                </LoonsTable>
                            )
                            : (
                                //load loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )
                    }
                </Grid>

            </Grid> */}

                        <Grid container spacing={2} className='my-5'>
                            <Grid item xs={12} lg={5}>
                                <Typography variant='h5' className="font-semibold"> Selected Vehicles</Typography>
                            </Grid>
                            <Grid item xs={12} lg={7} style={{ display: 'flex', alignItems: 'center' }}>

                                <Grid item xs={3}>
                                    <LoonsButton
                                        className="mt-2"
                                        progress={false}
                                        scrollToTop={true}
                                        startIcon="add"

                                        onClick={() => this.setState({ vehicleDialogView: true })}
                                    >
                                        <span className="capitalize">Add Vehicle</span>
                                    </LoonsButton>
                                </Grid>
                                <Grid item xs={4}>
                                    <LoonsButton
                                        disabled={true}
                                        className="mt-2"
                                        progress={false}
                                        scrollToTop={true}
                                        startIcon="add"
                                        onClick={() => this.setState({ request_partnership: !(this.state.request_partnership) })}
                                    >
                                        <span className="capitalize">Request Vehicle Partnership</span>
                                    </LoonsButton>
                                </Grid>

                            </Grid>

                        </Grid>
                        <Grid container="container" spacing={2}>
                            <Grid item="item" xs={12}>
                                <Typography variant="h6" className="font-semibold">Filters</Typography>
                                <Divider></Divider>
                            </Grid>
                        </Grid>
                        <ValidatorForm onSubmit={() => this.LoadOrderItemDetails()} onError={() => null}>
                            <Grid container="container" spacing={2}>
                                <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                    <SubTitle title="Required Date" />
                                    <LoonsDatePicker className="w-full"
                                        value={this.state.formData.required_date}
                                        placeholder="Required Date"
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        // required={!this.state.date_selection}
                                        disabled={true}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.required_date = date
                                            this.setState({ formData })
                                        }}
                                    />
                                </Grid>

                                {/* Serial/Family Number */}
                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Issue Date" />
                                    <LoonsDatePicker className="w-full"
                                        value={this.state.formData.issue_date}
                                        placeholder="Issue Date"
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        // required={!this.state.date_selection}
                                        disabled={true}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let formData = this.state.issue_date
                                            formData.issue_date = date
                                            this.setState({ formData })
                                        }} />
                                </Grid>
                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Pick Up Date" />
                                    <LoonsDatePicker className="w-full"
                                        value={this.state.formData.pick_up_date}
                                        placeholder="From"
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        // required={!this.state.date_selection}
                                        disabled={true}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.pick_up_date = date
                                            this.setState({ formData })
                                        }} />
                                </Grid>
                                <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="Pick Up Time" />
                                    <LoonsDatePicker className="w-full"
                                        value={this.state.formData.time}
                                        placeholder="Pick Up Time"
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        // required={!this.state.date_selection}
                                        disabled={true}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let formData = this.state.formData
                                            formData.time = date
                                            this.setState({ formData })
                                        }} />
                                </Grid>
                                <Grid
                                    item="item"
                                    lg={1}
                                    md={1}
                                    sm={12}
                                    xs={12}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-end'
                                    }}>
                                    <LoonsButton className="mt-2" progress={false} type="submit" scrollToTop={true}
                                    //onClick={this.handleChange}
                                    >
                                        <span className="capitalize">Filter</span>
                                    </LoonsButton>
                                </Grid>
                                <Grid
                                    item="item"
                                    lg={3}
                                    md={3}
                                    xs={3}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        marginTop: '-20px'
                                    }}>
                                    <SubTitle title='Search' />
                                    <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                        //value={this.state.formData.search} 
                                        onChange={(e, value) => {
                                            let formData = this.state.formData
                                            if (e.target.value != '') {
                                                formData.search = e.target.value;
                                            } else {
                                                formData.search = null
                                            }
                                            this.setState({ formData })
                                            console.log("form dat", this.state.formData)
                                        }}

                                        onKeyPress={(e) => {
                                            if (e.key == "Enter") {
                                                this.LoadOrderItemDetails()
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
                        <Grid container="container" className="mt-2 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {
                                    this.state.loaded
                                        ? <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'all_items'}
                                            data={this.state.order}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.vehicle_totalItems,
                                                rowsPerPage: this.state.vehicle_filterData.limit,
                                                page: this.state.vehicle_filterData.page,
                                                print: true,
                                                viewColumns: true,
                                                download: true,
                                                // onTableChange: (action, tableState) => {
                                                //     console.log(action, tableState)
                                                //     switch (action) {
                                                //         case 'changePage':
                                                //             this.setPage(tableState.page)
                                                //             break
                                                //         case 'sort':
                                                //             // this.sort(tableState.page, tableState.sortOrder);
                                                //             break
                                                //         default:
                                                //             console.log('action not handled.')
                                                //     }
                                                // }
                                            }}></LoonsTable>
                                        : (
                                            //loading effect
                                            <Grid className="justify-center text-center w-full pt-12">
                                                <CircularProgress size={30} />
                                            </Grid>
                                        )
                                }

                            </Grid>
                        </Grid>
                        {
                            this.state.request_partnership && <>
                                <Grid item xs={12} lg={5}>
                                    <Typography variant='h6' className="font-semibold"> Request Vehicle Partnership</Typography>
                                </Grid>
                                <Grid container="container" spacing={2}>
                                    <Grid item="item" xs={12}>
                                        <Typography variant="h6" className="font-semibold">Filters</Typography>
                                        <Divider></Divider>
                                    </Grid>
                                </Grid>
                                <ValidatorForm onSubmit={() => this.LoadOrderItemDetails()} onError={() => null}>
                                    <Grid container="container" spacing={2}>
                                        <Grid item="item" xs={12} sm={12} md={3} lg={3}>
                                            <SubTitle title="Warehouse" />
                                            <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_ven} onChange={(e, value) => {
                                                let formData = this.state.formData
                                                if (value != null) {
                                                    formData.ven_id = value.id
                                                } else {
                                                    formData.ven_id = null
                                                }

                                                this.setState({ formData })
                                            }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                value={this
                                                    .state
                                                    .all_ven
                                                    .find((v) => v.id == this.state.formData.ven_id)}

                                                getOptionLabel={(option) => option.name ? option.name : ''}

                                                renderInput={(params) => (
                                                    <TextValidator {...params}
                                                        placeholder="Warehouse"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small" />
                                                )} />
                                        </Grid>

                                        {/* Serial/Family Number */}
                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Vehicle Storage Types" />
                                            <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_class} onChange={(e, value) => {

                                                let formData = this.state.formData
                                                if (value != null) {
                                                    formData.item_class_id = value.id
                                                } else {
                                                    formData.item_class_id = null
                                                }

                                                this.setState({ formData })
                                            }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                value={this
                                                    .state
                                                    .all_item_class
                                                    .find((v) => v.id == this.state.formData.item_class_id)} getOptionLabel={(
                                                        option) => option.description
                                                            ? option.description
                                                            : ''} renderInput={(params) => (
                                                                <TextValidator {...params} placeholder="Storage Types"
                                                                    //variant="outlined"
                                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                                            )} />
                                        </Grid>
                                        <Grid className=" w-full" item="item" lg={3} md={3} sm={12} xs={12}>
                                            <SubTitle title="Vehicle Types" />
                                            <Autocomplete
                                        disableClearable className="w-full" options={this.state.all_item_category} onChange={(e, value) => {
                                                let formData = this.state.formData
                                                if (value != null) {
                                                    formData.item_category = value.id
                                                } else {
                                                    formData.item_category = null
                                                }

                                                this.setState({ formData })
                                            }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */
                                                value={this
                                                    .state
                                                    .all_item_category
                                                    .find((v) => v.id == this.state.formData.all_item_category)} getOptionLabel={(
                                                        option) => option.description
                                                            ? option.description
                                                            : ''} renderInput={(params) => (
                                                                <TextValidator {...params} placeholder="Item Category"
                                                                    //variant="outlined"
                                                                    fullWidth="fullWidth" variant="outlined" size="small" />
                                                            )} />
                                        </Grid>
                                        <Grid
                                            item="item"
                                            lg={1}
                                            md={1}
                                            sm={12}
                                            xs={12}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'flex-end'
                                            }}>
                                            <LoonsButton className="mt-2" progress={false} type="submit" scrollToTop={true}
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">Filter</span>
                                            </LoonsButton>
                                        </Grid>
                                        <Grid item="item" lg={12} md={12} xs={12}></Grid>
                                        <Grid
                                            item="item"
                                            lg={3}
                                            md={3}
                                            xs={3}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                marginTop: '-20px'
                                            }}>
                                            <SubTitle title='Search' />
                                            <TextValidator className='w-full' placeholder="Search" fullWidth="fullWidth" variant="outlined" size="small"
                                                //value={this.state.formData.search} 
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData
                                                    if (e.target.value != '') {
                                                        formData.search = e.target.value;
                                                    } else {
                                                        formData.search = null
                                                    }
                                                    this.setState({ formData })
                                                    console.log("form dat", this.state.formData)
                                                }}

                                                onKeyPress={(e) => {
                                                    if (e.key == "Enter") {
                                                        this.LoadOrderItemDetails()
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
                                <Grid container="container" className="mt-2 pb-5">
                                    <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                        {
                                            this.state.loaded
                                                ? <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'all_items'} data={this.state.partnership_data}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        serverSide: true,
                                                        count: this.state.totalItems,
                                                        rowsPerPage: 20,
                                                        // page: this.state.formData.page,
                                                        print: true,
                                                        viewColumns: true,
                                                        download: true,
                                                        onTableChange: (action, tableState) => {
                                                            console.log(action, tableState)
                                                            switch (action) {
                                                                case 'changePage':
                                                                    this.setPage(tableState.page)
                                                                    break
                                                                case 'sort':
                                                                    // this.sort(tableState.page, tableState.sortOrder);
                                                                    break
                                                                default:
                                                                    console.log('action not handled.')
                                                            }
                                                        }
                                                    }}></LoonsTable>
                                                : (
                                                    //loading effect
                                                    <Grid className="justify-center text-center w-full pt-12">
                                                        <CircularProgress size={30} />
                                                    </Grid>
                                                )
                                        }

                                    </Grid>
                                </Grid>
                            </>
                        }

                    </LoonsCard>
                    : (
                        //loading effect
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    )}

                <Dialog fullWidth maxWidth="xl" open={this.state.vehicleDialogView}
                    onClose={() => { this.setState({ vehicleDialogView: false }, () => this.preLoadData()) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Select New Vehicle" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ vehicleDialogView: false }, () => this.preLoadData())
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <MDS_AddVehicle delivery_id={this.state.vehicle_filterData.order_delivery_id} />
                    </div>
                </Dialog>

                <Dialog maxWidth="lg" open={this.state.vehicleSpecsView}
                    onClose={() => {
                        this.setState({
                            vehicleSpecsView: false,
                            selected_vehicle_id: null
                        }, () => this.preLoadData())
                    }}
                >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Vehicle Details" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    vehicleSpecsView: false,
                                    selected_vehicle_id: null
                                }, () => this.preLoadData())
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <MDS_VehiclePopUp id={this.state.selected_vehicle_id} />
                    </div>
                </Dialog>

                <Dialog maxWidth="lg " open={this.state.workerView}
                    onClose={() => {
                        this.setState({
                            workerView: false,
                            selected_vehicle_id: null
                        },
                            () => this.preLoadData())
                    }}
                >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Vehicle Details" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    workerView: false,
                                    selected_vehicle_id: null
                                }, () => this.preLoadData())
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <MDS_ChangeWorkers vehicle_id={this.state.selected_vehicle_id} order_vehicleID={this.state.order_vehicle_id} order_delivery_id={this.state.vehicle_filterData.order_delivery_id} drivers={this.state.selectedvehicle_drivers} helpers={this.state.selectedvehicle_helpers} />
                    </div>
                </Dialog>

                <Dialog
                    maxWidth="lg "
                    open={this.state.deleteWarning_view}
                    onClose={() => {
                        this.setState({
                            deleteWarning_view: false,
                            selected_vehicle_id: null
                        })
                    }}>
                    <div className="w-full h-full px-5 py-5">

                        <CardTitle title="Are you sure you want to delete?"></CardTitle>
                        <div>
                            <p>This Vehicle Will be removed from this Order. This
                                cannot be undone.</p>
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end'
                                }}>
                                <Grid
                                    className="w-full flex justify-end"
                                    item="item"
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={6}>
                                    <Button
                                        className="mt-2"
                                        progress={false}
                                        type="submit"
                                        startIcon="delete"
                                        onClick={() => {
                                            this.setState({ deleteWarning_view: false });
                                            this.removeVehicle()
                                        }}>
                                        <span className="capitalize">Delete</span>
                                    </Button>

                                    <Button
                                        className="mt-2 ml-2"
                                        progress={false}
                                        type="submit"
                                        startIcon={<CancelIcon fontSize='small' />}
                                        onClick={() => {
                                            this.setState({
                                                deleteWarning_view: false,
                                                selected_vehicle_id: null
                                            });
                                        }}>
                                        <span className="capitalize">Cancel</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Dialog>

                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={this.state.pickUpDialogView}
                    onClose={() => { this.setState({ pickUpDialogView: false }) }}
                >
                    <div className="w-full h-full px-5 py-5">

                        <Fragment >
                            <CardTitle title="Change Pick Up Person" />
                            {this.state.deliveryDataLoaded ?
                                <div className="w-full">
                                    <ValidatorForm
                                        onSubmit={() => this.onSubmit()}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} lg={12} >
                                                {/* <Typography variant='h6' className="font-semibold"> Pick Up Person :</Typography> */}
                                                <SubTitle title="Pick Up Person :" />
                                                <Autocomplete
                                        disableClearable
                                                    className="w-full"
                                                    options={this.state.employees}
                                                    onChange={(e, value) => {
                                                        if (null != value) {
                                                            console.log("value.id", value.id)
                                                            let updateOrder = this.state.updateOrder;
                                                            updateOrder.pickup_person_id = value.id
                                                            this.setState({ updateOrder })

                                                        }
                                                    }}
                                                    value={this.state.employees.find((v) =>
                                                        v.id == this.state.updateOrder.pickup_person_id
                                                    )}
                                                    getOptionLabel={(option) => {
                                                        console.log("option", option)
                                                        return option.name ? option.name : ''

                                                    }

                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="User Type"
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>

                                            <Grid item lg={1} md={1} sm={12} xs={12} style={{ display: 'flex', alignItems: 'center' }}>
                                                <Button
                                                    className="mt-2"
                                                    progress={false}
                                                    type="submit"
                                                    scrollToTop={true}
                                                //onClick={this.handleChange}
                                                >
                                                    <span className="capitalize">Save</span>
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </ValidatorForm>
                                </div>
                                : null}
                            {/* Content End */}

                        </Fragment>



                        {/* <AddPickUpPerson id={this.state.selectedOrder} ></AddPickUpPerson> */}
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
                    variant="filled">
                </LoonsSnackbar>
            </MainContainer>
        )
    }

}
export default withStyles(styleSheet)(MDS_IndividualOrder)