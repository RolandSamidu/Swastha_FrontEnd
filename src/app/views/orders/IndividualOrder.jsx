import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
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
    Typography,
    Dialog,
    Tooltip,
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
import ToBeReceivedItems from './ToBeReceivedItems'
import WarehouseServices from 'app/services/WarehouseServices'
import CategoryService from 'app/services/datasetupServices/CategoryService'
import ClassDataSetupService from 'app/services/datasetupServices/ClassDataSetupService'
import GroupSetupService from 'app/services/datasetupServices/GroupSetupService'
import DroppedItems from './DroppedItems'
import AllItems from './AllItems'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import EmployeeServices from 'app/services/EmployeeServices'
import VehicleService from 'app/services/VehicleService'
import { dateParse, timeParse } from 'utils'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import localStorageService from 'app/services/localStorageService';
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'

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

class IndividualOrder extends Component {

    constructor(props) {
        super(props)
        this.state = {

            Loaded: false,
            activeTab: 0,
            data: [],
            order: [],
            drug_store: null,
            filterData: {

                status: null,
                ven_id: null,
                class_id: null,
                category_id: null,
                group_id: null,
                to: null,
                search: null,
                type: 'Order',
                order_exchange_id: this.props.match.params.id,
                'order[0]': [
                    'createdAt', 'DESC'
                ],
                // limit: 10,
                // page: 0,
            },
            pickUpPerson: {
                id: null,
                name: null,
                contactNum: null
            },

            split_data:{
                splited_from:this.props.match.params.id,
                page:0,
                limit:10,
            },
               

            orderSummury: {
                orderBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                approvedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                allocatedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                issuedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                receivedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                compleleBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                },
                issueSubmitedBy: {
                    name: 'N/A',
                    designation: 'N/A',
                    date: 'N/A',
                    time: 'N/A'
                }

            },

            split_order_columns: [
                {
                    name: 'name',
                    label: 'Drug Store',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => { 
                            console.log('ssssssssssssssssssssssssssssssssss',this.state.splitData[tableMeta.rowIndex].toStore?.name)
                            return (this.state.splitData[tableMeta.rowIndex].toStore?.name)
                        }
                    }
                },
                {
                    name: 'order_id',
                    label: 'Order ID',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // console.log('data', tableMeta);
                        //     return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                        // }
                    }
                },
            
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // console.log('data', tableMeta);
                        //     return (tableMeta.rowData[tableMeta.columnIndex].max_volume)
                        // }
                    }
                },

                {
                    name: 'number_of_items',
                    label: 'Number Of Items',
                    options: {
                        display: true,
                        // customBodyRender: (value, tableMeta, updateValue) => {
                        //     // console.log('data', tableMeta);
                        //     return (tableMeta.rowData[tableMeta.columnIndex].status)
                        // }
                    }
                },
                
                {
                    name: 'name',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                        console.log('mydata',this.state.splitData[tableMeta.rowIndex] )
                        return (
                            <>
                                <Tooltip title='View Order'>
                                    <IconButton
                                        className="text-black"
                                        onClick={() => this.viewIndividualOrder(
                                            this.state.splitData[tableMeta.rowIndex]?.id,
                                            this.state.splitData[tableMeta.rowIndex]?.Delivery ?
                                            this.state.splitData[tableMeta.rowIndex]?.Delivery?.Employee?.id : null
                                        )}
                                    >
                                        <Icon color="primary">visibility</Icon>
                                    </IconButton>
                                </Tooltip>
                            </>
                        )
                        }
                    }
                    }
                

            ],

            employees: [],
            pickUpFilterData: {
                // type: ["Helper", "Driver", "Health Service Assistant", "Medical Officer",]
                type: ["Helper", 'Health Service Assistant', 'Driver', 'Drug Store Keeper', 'Chief MLT', 'Chief Radiographer', 'Pharmacist', 'RMSD MSA', 'RMSD OIC', 'RMSD Pharmacist']

            },
            deliveryDataLoaded: false,
            deliveryDateDialogView: false,

            updateOrder: {
                delivery_id: null,
                pickup_person_id: null,
            },
            pickUpDialogView: false,
            changePickUpPerson: false,

            updateDeliveryData: {
                required_date: null,
            }
        }
    }

    // async LoadOrderItemDetails() {

    //     let res = await PharmacyOrderService.getOrderItemsByID({ order_exchange_id: this.props.match.params.id })
    //     if (res.status) {
    //         console.log("Order Item Data", res.data.view.data)
    //         this.setState({
    //             data: res.data.view.data,
    //             Loaded: true,
    //         })
    //     }

    // }

    async loadDeliveryData() {
        this.setState({ deliveryDataLoaded: false })
        let pickUpFilterData = this.state.pickUpFilterData
        let hospital = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        pickUpFilterData.created_location_id = hospital[0].pharmacy_drugs_stores_id;


        let user_res = await VehicleService.getVehicleUsers(pickUpFilterData);
        if (user_res.status == 200) {
            console.log('data', user_res.data.view.data);
            this.setState({
                employees: user_res.data.view.data,
                deliveryDataLoaded: true
                // totalPages: user_res.data.view.totalPages,
                // totalItems: user_res.data.view.totalItems,
            })
        }

        // let res = await PharmacyOrderService.getRemarks()
        // if (res.status == 200) {
        //     let remarks = [...res.data.view.data, { remark: 'Other' }]
        //     this.setState({
        //         remarks: remarks,
        //         deliveryDataLoaded: true
        //     },
        //         () => { console.log(this.state.remarks); this.render() })
        //     return;
        // }

    }

    viewIndividualOrder(id, pickUpPersonID) {
        window.location = `/hospital-ordering/all-items/${id}?pickUpPersonID=${pickUpPersonID}`;
    }

    handleUpdatePickUpDetails() {

        this.setState({ changePickUpPerson: true })
        let updateOrder = this.state.updateOrder;
        updateOrder.pickup_person_id = this.state.order.Delivery.pickup_person_id
        updateOrder.delivery_id = this.state.order.Delivery.id
        this.setState({ updateOrder })

        this.setState({ pickUpDialogView: true })
        this.loadDeliveryData();

    }

    async LoadPickUpPersonDetails() {

        if (this.state.changePickUpPerson) {
            let res = await EmployeeServices.getEmployeeByID(this.state.updateOrder.pickup_person_id)
            console.log("pickUpPerson Data", res.data)
            if (res.status) {
                console.log("pickUpPerson Data", res.data.view)
                this.setState({
                    pickUpPerson: {
                        id: res.data.view.nic,
                        name: res.data.view.name,
                        contactNum: res.data.view.contact_no,
                    },
                })
            }
        } else {
            const query = new URLSearchParams(this.props.location.search);
            const PID = query.get('pickUpPersonID');
            console.log("pickUpPersonID", PID)

            if (PID) {
                let res = await EmployeeServices.getEmployeeByID(PID)
                console.log("pickUpPerson Data", res.data)
                if (res.status) {
                    console.log("pickUpPerson Data", res.data.view)
                    this.setState({
                        pickUpPerson: {
                            id: res.data.view.nic,
                            name: res.data.view.name,
                            contactNum: res.data.view.contact_no,
                        },
                    })
                }
            }
        }



    }

    async onSubmit() {

        let body = { pickup_person_id: this.state.updateOrder.pickup_person_id, remarks: [] }
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
        this.LoadPickUpPersonDetails()
        this.LoadOrderDetails()
    }

    async LoadOrderDetails() {


        let res = await PharmacyOrderService.getOrdersByID(this.props.match.params.id)
        console.log('order', res.data.view)
        let updateDeliveryData = this.state.updateDeliveryData;
        updateDeliveryData.required_date = res.data.view?.required_date
        if (res.status) {
            console.log("Order-gagagga", res.data.view)
            this.setState({
                Loaded: true,
                order: res.data.view,
                drug_store: res.data.view.toStore,
                updateDeliveryData
            })
        }

    }

    async LoadOrderSummury() {


        let res = await PharmacyOrderService.getOrderSummuries({ order_exchange_id: this.props.match.params.id })
        if (res.status) {
            console.log("Order Summury Data", res.data.view.data)

            let order_summury = this.state.orderSummury

            res.data.view.data.forEach(element => {

                if (element.Employee) {
                    if (element.activity == "ORDERED") {
                        order_summury.orderBy.name = element.Employee.name
                        order_summury.orderBy.designation = element.Employee.designation
                        order_summury.orderBy.date = element.createdAt
                        order_summury.orderBy.time = element.createdAt

                    } else {
                        if (element.activity == "APPROVED") {
                            order_summury.approvedBy.name = element.Employee.name
                            order_summury.approvedBy.designation = element.Employee.designation
                            order_summury.approvedBy.date = element.createdAt
                            order_summury.approvedBy.time = element.createdAt
                        } else {
                            if (element.activity == "ALLOCATED") {
                                order_summury.allocatedBy.name = element.Employee.name
                                order_summury.allocatedBy.designation = element.Employee.designation
                                order_summury.allocatedBy.date = element.createdAt
                                order_summury.allocatedBy.time = element.createdAt
                            } else {
                                if (element.activity == "ISSUED") {
                                    order_summury.issuedBy.name = element.Employee.name
                                    order_summury.issuedBy.designation = element.Employee.designation
                                    order_summury.issuedBy.date = element.createdAt
                                    order_summury.issuedBy.time = element.createdAt
                                }
                                else {
                                    if (element.activity == "RECEIVED") {
                                        order_summury.receivedBy.name = element.Employee.name
                                        order_summury.receivedBy.designation = element.Employee.designation
                                        order_summury.receivedBy.date = element.createdAt
                                        order_summury.receivedBy.time = element.createdAt
                                    }
                                    if (element.activity == "COMPLETED") {
                                        order_summury.compleleBy.name = element.Employee.name
                                        order_summury.compleleBy.designation = element.Employee.designation
                                        order_summury.compleleBy.date = element.createdAt
                                        order_summury.compleleBy.time = element.createdAt
                                    }
                                    if (element.activity == "ISSUE SUBMITTED") {
                                        order_summury.issueSubmitedBy.name = element.Employee.name
                                        order_summury.issueSubmitedBy.designation = element.Employee.designation
                                        order_summury.issueSubmitedBy.date = element.createdAt
                                        order_summury.issueSubmitedBy.time = element.createdAt
                                    }
                                    else {
                                        this.setState({
                                            order_summury
                                        })
                                    }
                                }
                            }
                        }
                    }
                }


            }


            );
            this.setState({
                order_summury
            })
        }

    }

    componentDidMount() {

        // this.LoadOrderItemDetails()
        this.LoadPickUpPersonDetails()
        this.LoadOrderDetails()
        this.LoadOrderSummury()
        this.LoadOrderItemDetails(this.state.filterData)
        this.getSplitOrder()


    }
    async LoadOrderItemDetails(filters) {

        this.setState({ Loaded: false })
        let res = await PharmacyOrderService.getOrderItems(filters)
        if (res.status) {
            console.log("Order Item Data", res.data.view.data)

            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                Loaded: true,
            }, () => {

                this.render()
                console.log("TableData", this.state.data)
            })
        }

    }

    async onChangeDeliveryDate() {
        console.log('aaaa', this.state.updateDeliveryData)

        let res = await PharmacyOrderService.editPlaceOrder(this.state.updateDeliveryData, this.state.order.id)

        if (res.status && res.status == 200) {
            this.setState({
                alert: true,
                message: 'Delivery Date Update Successfully',
                severity: 'success',
                deliveryDateDialogView: false
            }, () => {
                this.LoadOrderDetails()
            })
            //  window.location.reload();
        } else {
            this.setState({
                alert: true,
                message: 'Delivery Date Update Unsuccessful',
                severity: 'error',
            })
        }


    }

         // split order
         async getSplitOrder(){

            let res = await ChiefPharmacistServices.getAllOrders(this.state.split_data)
            // console.log('splitdata', res)
    
            if (res.status === 200) {
                
                console.log('splitdata', res.data.view.data)
    
                this.setState({
                    splitData:res.data.view.data,
                    totalItems:res.data.view.totalItems
                })
            }
        }
        async setPage(page) {
            //Change paginations
            let split_data = this.state.split_data
            split_data.page = page
            this.setState({
                split_data
            }, () => {
                this.getSplitOrder(this.state.split_data)
            })
        }
        

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <Grid container spacing={2}>
                            <Grid item lg={9} md={9} sm={12} xs={12}>
                                {/* <CardTitle title="Individual Order" /> */}
                                <div className='flex'>
                                    <Typography variant="h6" className="font-semibold" >Individual Order</Typography>
                                    <Typography variant="h6" className="font-semibold" style={{ color: this.state.order?.special_normal_type == "SUPPLEMENTARY" ? "red" : "green" }}> ({this.state.order?.special_normal_type})</Typography>
                                </div>
                                <Divider />
                            </Grid>
                            <Grid item lg={3} md={3} sm={12} xs={12}>
                                <CardTitle title={`Status : ${this.state.order?.status}`} />
                            </Grid>
                        </Grid>

                        <Grid container className='mt-3 mb-2'>

                            <Grid item lg={2} md={2} sm={2} xs={2}>
                                <SubTitle title={`Order ID : ${this.state.order.order_id}`} />
                                <SubTitle title={`Drug Store : ${this.state.drug_store?.name}`} />
                                <SubTitle title={`Distribution Officer : ${this.state.order.DistributionOfficer?.name}`} />
                                <SubTitle title={`Delivery Mode : ${this.state.order?.Delivery?.delivery_mode != null ? this.state.order?.Delivery?.delivery_mode : "N/A"}`} />
                                <SubTitle title={`Delivery Date:`} />
                                <Grid container spacing={1}>
                                    <Grid item lg={9} md={9} sm={9} xs={9}>
                                        {dateParse(this.state.order?.required_date)}
                                    </Grid>
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
                                        <Button
                                            className="mt-1"
                                            progress={false}
                                            disabled={(this.state.order.status == "REJECTED" || this.state.order.status == "ISSUED" || this.state.order.status == "COMPLETED" || this.state.order.status == "RECIEVED")}
                                            scrollToTop={false}
                                            // type='submit'
                                            // startIcon="search"
                                            onClick={() => { this.setState({ deliveryDateDialogView: true }) }}
                                        >
                                            <span className="capitalize">Change</span>
                                        </Button>
                                    </Grid>
                                </Grid>


                            </Grid>
                            <Grid item lg={1} md={1} sm={2} xs={2}>
                                {/* <SubTitle title={`Drug Store : ${this.state.drug_store}`} /> */}
                            </Grid>
                            <Grid item lg={6} md={5} sm={5} xs={5}></Grid>
                            <Grid item lg={2} md={3} sm={3} xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                                <SubTitle title={`Pick Up Person : `} />
                                <Icon className='ml-5' style={{ fontSize: 'large' }}>person</Icon>
                                {
                                    // (this.state.pickUpPerson.id) && 
                                    (this.state.order.status != "REJECTED" || this.state.order.status != "ISSUED" || this.state.order.status != "COMPLETED" || this.state.order.status != "RECIEVED") ?
                                        (
                                            <Button
                                                className="ml-3"
                                                progress={false}
                                                disabled={(this.state.order.status == "REJECTED" || this.state.order.status == "ISSUED" || this.state.order.status == "COMPLETED" || this.state.order.status == "RECIEVED")}
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
                            <Grid item lg={9} md={9} sm={9} xs={9}></Grid>
                            <Grid item lg={3} md={3} sm={3} xs={3}>
                                <SubTitle title={`ID : ${this.state.pickUpPerson.id ? this.state.pickUpPerson.id : "Not Assigned"}`} />
                                <SubTitle title={`Name : ${this.state.pickUpPerson.name ? this.state.pickUpPerson.name : "Not Assigned"}`} />
                                <SubTitle title={`Contact Number : ${this.state.pickUpPerson.contactNum ? this.state.pickUpPerson.contactNum : "Not Assigned"}`} />
                            </Grid>
                        </Grid>
                        <AppBar position="static" color="default" className="mb-4">
                            <Grid item lg={12} md={12} xs={12}>
                                <Tabs
                                    style={{ minHeight: 39, height: 26 }}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    variant="fullWidth"
                                    value={this.state.activeTab}
                                    onChange={(event, newValue) => {
                                        // console.log(newValue)
                                        this.setState({ activeTab: newValue })
                                    }} >
                                    <Tab label={<span className="font-bold text-12">ALL ITEMS</span>} />
                                    <Tab label={<span className="font-bold text-12">TO BE RECEIVED ITEMS</span>} />

                                    <Tab label={<span className="font-bold text-12">DROPPED ITEMS</span>} />

                                </Tabs>
                            </Grid>
                        </AppBar>
                        <main>

                            <Fragment>
                                {
                                    this.state.activeTab == 0 ?
                                        <div className='w-full'>
                                            <AllItems
                                            
                                                pickUpPerson={this.state.pickUpPerson}
                                            // order_ids={this.state.order.order_requirement_id}
                                            ></AllItems>
                                        </div> : null
                                }
                                {
                                    this.state.activeTab == 1 ?
                                        <div className='w-full'>
                                            <ToBeReceivedItems orderStatus={this.state.order.status} toStore={this.state.drug_store} ></ToBeReceivedItems>
                                        </div> : null
                                }
                                {
                                    this.state.activeTab == 2 ?
                                        <div className='w-full'>
                                            <DroppedItems></DroppedItems>
                                        </div> : null
                                }
                            </Fragment>

                            <Grid container className='w-full mt-5'>
                                <Grid item xs={12} style={{border:'3px solid #6495ED', backgroundColor:'rgba(64, 224, 208, 0.3)', borderRadius:'5px'}}>
                                    <div className='p-3 m-3 mb-0'>
                                        <p className='m-0 p-0' style={{fontWeight:'bold'}}>Splitted Orders</p>
                                        <hr style={{borderColor: '#6495ED', width: '100%', borderWidth: '1px', borderStyle: 'solid'}}></hr>
                                        <div className='mt-3'>
                                        <LoonsTable

                                                id={'split_order'}
                                                data={
                                                    this.state.splitData
                                                }
                                                columns={
                                                    this.state.split_order_columns
                                                }
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    print: false,
                                                    viewColumns: false,
                                                    download: false,
                                                    onTableChange: (action, tableState) => {
                                                        console.log(action, tableState)
                                                        switch (
                                                        action
                                                        ) {
                                                            case 'changePage':
                                                                this.setPage(
                                                                    tableState.page
                                                                )
                                                                break
                                                            case 'sort':
                                                                // this.sort(tableState.page, tableState.sortOrder);
                                                                break
                                                            default:
                                                                console.log(
                                                                    'action not handled.'
                                                                )
                                                        }
                                                    },
                                                }}
                                            ></LoonsTable>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid container className='mb-3 mt-5 px-3 py-3' style={{ backgroundColor: "#f7e5cc" }}>

                            


                                <h4>Order Summary</h4>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Order By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.orderBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.orderBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.orderBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.orderBy.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Approved By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.approvedBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.approvedBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.approvedBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.approvedBy.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Allocated By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.allocatedBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.allocatedBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.allocatedBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.allocatedBy.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Issue Submited By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.issueSubmitedBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.issueSubmitedBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.issueSubmitedBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.issueSubmitedBy.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Issued By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.issuedBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.issuedBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.issuedBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.issuedBy.time)} />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Received By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.receivedBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.receivedBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.receivedBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.receivedBy.time)} />
                                    </Grid>
                                </Grid>



                                <Grid container>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={"Complele By"} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.compleleBy.name} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={this.state.orderSummury.compleleBy.designation} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={dateParse(this.state.orderSummury.compleleBy.date)} />
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <SubTitle title={timeParse(this.state.orderSummury.compleleBy.time)} />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </main>

                    </LoonsCard>
                </MainContainer>
                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={this.state.pickUpDialogView}
                    onClose={() => { this.setState({ pickUpDialogView: false }) }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                            <CardTitle title="Change Pick Up Person" />

                            <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ pickUpDialogView: false }) }}>
                                <CloseIcon />
                            </IconButton>

                        </MuiDialogTitle>
                        <Fragment >

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




                <Dialog
                    fullWidth
                    maxWidth="md"
                    open={this.state.deliveryDateDialogView}
                    onClose={() => { this.setState({ deliveryDateDialogView: false }) }}
                >
                    <div className="w-full h-full px-5 py-5">
                        <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                            <CardTitle title="Change Pick Up Person" />

                            <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ deliveryDateDialogView: false }) }}>
                                <CloseIcon />
                            </IconButton>

                        </MuiDialogTitle>
                        <Fragment >

                            <div className="w-full">
                                <ValidatorForm
                                    onSubmit={() => this.onChangeDeliveryDate()}
                                >
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} lg={12} >
                                            {/* <Typography variant='h6' className="font-semibold"> Pick Up Person :</Typography> */}
                                            <SubTitle title="Delivery Date :" />
                                            <DatePicker
                                                className="w-full"
                                                placeholder="Delivery Date"
                                                minDate={new Date()}
                                                value={this.state.updateDeliveryData.required_date}
                                                //format={"yyyy"}
                                                //required={true}
                                                //errorMessages="this field is required"
                                                onChange={(date) => {
                                                    let updateDeliveryData = this.state.updateDeliveryData
                                                    updateDeliveryData.required_date = date
                                                    this.setState({ updateDeliveryData })
                                                }}
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
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(IndividualOrder)