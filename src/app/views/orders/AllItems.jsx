import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import SearchIcon from '@material-ui/icons/Search'
import AppBar from '@material-ui/core/AppBar';
import { useParams } from 'react-router';
import { withRouter } from "react-router";
import {
    Grid,
    CircularProgress,
    IconButton,
    InputAdornment,
    Tooltip,
    Dialog,
    DialogTitle,
    Divider
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
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import PharmacyService from 'app/services/PharmacyService'
import localStorageService from 'app/services/localStorageService'
import MDSService from 'app/services/MDSService'
import { dateTimeParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MDS_AddVehicleNew from "./MDS_AddVehicleNew";
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import RequisitionDocument from './Print/RequisitionDocument';
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { roundDecimal } from '../../../utils'


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


class AllItems extends Component {


    constructor(props) {

        super(props)
        this.state = {
            vehicleDialogView:false,
            Loaded: false,
            activeTab: 0,
            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            all_item_drug_store: [],
            totalItems: 0,
            isEdit: false,
            editData:[],
            request_quantity:null,
            itemId:null,
            ploaded:false,
            loginUser:null,
            pickUpPerson:[],


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
                // 'order[0]': [
                //     'createdAt', 'DESC'
                // ],
                order_by_sr : true
                // limit: 10,
                // page: 0,
            },
            

            filterDataValidation: {
                ven_id: true,
                class_id: true,
                category_id: true,
                group_id: true,
                to: true,

                search: true,
                status: true
            },

            // filterData: {
            //     search: null
            // },

            order: [],
            data: [],


            vehicle_filterData: {
                page: 0,
                limit: 10,
                //order_delivery_id: null,
                order_delivery_id: null,
                order_exchange_id: this.props.match.params.id,
                "order[0][0]": 'updatedAt',
                "order[0][1]": 'Desc'
            },

            vehicleLoaded: false,


            vehicle_data: [],
            vehicle_columns: [
                {
                    name: 'Vehicle',
                    label: 'Hospital ID',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('datatatta', tableMeta);
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

            ],
            // split_order_columns: [
            //     {
            //         name: 'name',
            //         label: 'Drug Store',
            //         options: {
            //             display: true,
            //             customBodyRender: (value, tableMeta, updateValue) => { 
            //                 // console.log('ssssssssssssssssssssssssssssssssss',this.state.splitData[tableMeta.columnIndex].toStore?.name)
            //                 return (this.state.splitData[tableMeta.columnIndex].toStore?.name)
            //             }
            //         }
            //     },
            //     {
            //         name: 'order_id',
            //         label: 'Order ID',
            //         options: {
            //             display: true,
            //             // customBodyRender: (value, tableMeta, updateValue) => {
            //             //     // console.log('data', tableMeta);
            //             //     return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
            //             // }
            //         }
            //     },
            
            //     {
            //         name: 'status',
            //         label: 'Status',
            //         options: {
            //             display: true,
            //             // customBodyRender: (value, tableMeta, updateValue) => {
            //             //     // console.log('data', tableMeta);
            //             //     return (tableMeta.rowData[tableMeta.columnIndex].max_volume)
            //             // }
            //         }
            //     },

            //     {
            //         name: 'number_of_items',
            //         label: 'Number Of Items',
            //         options: {
            //             display: true,
            //             // customBodyRender: (value, tableMeta, updateValue) => {
            //             //     // console.log('data', tableMeta);
            //             //     return (tableMeta.rowData[tableMeta.columnIndex].status)
            //             // }
            //         }
            //     },

            // ],


            columns: [
                // {
                //     name: 'id',
                //     label: 'id',
                //     options: {
                //         display: false,
                //     },
                // },
                {
                    name: 'SRNumber',
                    label: 'SR No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnap.sr_no

                            )
                        }
                    },
                },
                {
                    name: 'itemName',
                    label: 'Item Name',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnap.medium_description

                            )
                        }
                    },
                },
                {
                    name: 'strength',
                    label: 'Strength',
                    options: {
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                this.state.data[tableMeta.rowIndex].ItemSnap.strength

                            )
                        }
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EU'){ 
                                let data = roundDecimal(this.state.data[tableMeta.rowIndex]?.request_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                                return data
                            } else {
                                let data = this.state.data[tableMeta.rowIndex]?.request_quantity
                                return data
                            }
                            
                            
                        }
                    },
                },
                {
                    name: 'approved_quantity',
                    label: 'Approved Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EU'){
                                let data = roundDecimal(this.state.data[tableMeta.rowIndex]?.approved_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                                return data
                            } else {
                                let data = this.state.data[tableMeta.rowIndex]?.request_quantity
                                return data
                            }
                            
                            
                        }
                    },
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        display: false,
                    },
                },
                
                {
                    name: 'issued_quantity',
                    label: 'Issued Qty',
                    options: {
                        display: false,
                    },
                },
                {
                    name: 'recieved_quantity',
                    label: 'Received Qty',
                    options: {
                        display: false,
                    },
                },
                
                {
                    name: 'receivedDateTime',
                    label: 'Received Date & Time',
                    options: {
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[tableMeta.rowIndex].OrderExchange.recieved_date ?
                                    dateTimeParse(this.state.data[tableMeta.rowIndex].OrderExchange.recieved_date) : 'N/A'
                            )
                        }
                    },
                },

                {
                    name: 'actions',
                    label: 'Actions',
                    options: {
                      display: true,
                      customBodyRender: (value, tableMeta, updateValue) => {
                        const status = this.state.data[tableMeta.rowIndex]?.status;
                        const allowedStatuses = ['Pending', 'Active', 'Pending Approval'];
                        if (allowedStatuses.includes(status)) {
                          return (
                            <IconButton>
                              <EditIcon
                                color="primary"
                                onClick={() => { this.handleCheckboxChange(this.state.data[tableMeta.rowIndex]?.id) }}
                              />
                            </IconButton>
                          );
                        } else {
                          return null;
                        }
                      },
                    },
                },
            ]



        }
    }

    handleEditChange = (event) => {
        this.setState({
            editData: {
                ...this.state.editData,
                request_quantity: event.target.value
            },
            
        });
      };
    
      async updateSingleItem() {
         console.log('My value',this.state.editData)
         let editData
         if (this.state.editData?.ItemSnap?.converted_order_uom === 'EU') {
                editData = {
                    ...this.state.editData,
                    request_quantity: this.state.editData?.request_quantity / this.state.editData?.ItemSnap?.item_unit_size
                }
         } else {
                editData = {
                    ...this.state.editData,
                }
         }

        let res = await PharmacyOrderService.updateOrderItems(this.state.itemId, editData)

        if (res.status) {
            if (res.status == 200) {
                this.setState({
                    loaded: true,
                    alert: true,
                    message: "Item Update Success",
                    isEdit: false

                }, () => {
                    window.location.reload();
                    // this.render()
                })
            }
        }
        else {
            this.setState(
                { alert: true, message: "Item Update failed. Please Try Again", }
            )
        }

    }
    
    async handleCheckboxChange(id) {
        console.log('id', id)
        this.setState({itemId:id})

        let filters = this.state.filterData
        let res = await PharmacyOrderService.getOrderItemsByID(filters, id)

        if (res.status === 200) {
            console.log('hshshshhsh', res.data.view)

            let updatedEditData

            if (res.data.view?.ItemSnap?.converted_order_uom === "EU") {
                updatedEditData = {
                    ...res.data.view,
                    request_quantity: res.data.view.request_quantity * res.data.view?.ItemSnap?.item_unit_size,
                  };
                
            } else {
                updatedEditData = {
                    ...res.data.view,
                  };
            }

            console.log('hshshshhsh okokokko', updatedEditData)

            this.setState({
                editData:updatedEditData,
            })
        }

        this.setState({isEdit:true})
    }

    handleFilterButton() {

        this.LoadOrderItemDetails(this.state.filterData);
    }

    handleSearchButton() {

        let filterData = this.state.filterData;

        if (filterData.search) {
            // alert("Sent the Request")
            this.LoadOrderItemDetails(this.state.filterData);

        }
        else {

            let filterDataValidation = this.state.filterDataValidation;

            filterDataValidation.search = false;

            this.setState({ filterDataValidation })
        }


    }
    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New filterData", this.state.filterData)
            this.LoadOrderItemDetails(this.state.filterData)
        })
    }

    async loadData() {

        //function for load initial data from backend or other resources
        let ven_res = await WarehouseServices.getVEN({ limit: 99999 })
        if (ven_res.status == 200) {
            // console.log('Ven', ven_res.data.view.data)
            this.setState({ all_ven: ven_res.data.view.data })
        }
        let cat_res = await CategoryService.fetchAllCategories({ limit: 99999 })
        if (cat_res.status == 200) {
            // console.log('Categories', cat_res.data.view.data)
            this.setState({ all_item_category: cat_res.data.view.data })
        }
        let class_res = await
            ClassDataSetupService.fetchAllClass({ limit: 99999 })
        if (class_res.status == 200) {
            // console.log('Classes', class_res.data.view.data)
            this.setState({ all_item_class: class_res.data.view.data })
        }
        let group_res = await GroupSetupService.fetchAllGroup({ limit: 99999 })
        if (group_res.status == 200) {
            // console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_group: group_res.data.view.data })
        }
        //let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy('001', {})
        let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')
 
        this.setState({loginUser:userInfo.name})

        if (userInfo.roles.includes('RMSD MSA') || userInfo.roles.includes('RMSD Distribution Officer')) {
            owner_id = null
        }
        let durgStore_res = await WarehouseServices.getAllWarehousewithOwner({ store_type: 'drug_store' }, owner_id)

        if (durgStore_res.status == 200) {
            // console.log('Groups', group_res.data.view.data)
            this.setState({ all_item_drug_store: durgStore_res.data.view.data })
        }
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
                // console.log("State ", this.state.data)
            })
        }

    }

    async LoadOrderDetails() {

        let res = await PharmacyOrderService.getOrdersByID(this.props.match.params.id)
        if (res.status) {
            console.log("Order Data", res.data.view)
            this.setState({
                order: res.data.view,
            }, () => {
                console.log("Order Data2", this.state.order?.fromStore?.owner_id ,this.state.order?.toStore?.owner_id,"mode", this.state.order.Delivery?.delivery_mode)
                this.render()
                this.preLoadData()
                // console.log("State ", this.state.order)
            })
        }

    }

    async LoadVehicleData() {
        this.setState({
            vehicleLoaded: false
        })
        let res = await MDSService.getAllOrderVehicles(this.state.vehicle_filterData)
        console.log('vehicle', res)
        if (res.status === 200) {
            this.setState({
                vehicle_data: res.data.view.data,
                vehicleLoaded: true
            }, () => console.log('resdata', this.state.vehicle_data))
        }
    }


    componentDidMount() {

        this.loadData()
        this.LoadOrderDetails()
        this.LoadOrderItemDetails(this.state.filterData)
        this.LoadVehicleData()
        this.setState({pickUpPerson:this.props.pickUpPerson})

        console.log('props', this.props.match.params.id)
       
    }
    async loadOwnerID() {
        let value = await localStorageService.getItem('Selected_Warehouse')
        if (value) {
            this.setState({
                owner_id: value.owner_id
            })
        }
        else {
            this.setState({
                owner_id: null,
            })
        }
    }
    async preLoadData() {
        this.setState({
            loaded: false
        })
        let vehicle_filterData = this.state.vehicle_filterData
        vehicle_filterData.order_delivery_id=this.state.order.Delivery?.id
        console.log("order2",vehicle_filterData)
        let res = await MDSService.getAllOrderVehicles(vehicle_filterData)
        if (res.status && res.status == 200) {
            this.setState({
                vehicle_filterData,
                // order: res.data.view.data,
                vehicle_totalItems: res.data.view.totalItems,
                loaded: true
            }, () => console.log('resdata', this.state.order))
        }
    }


    async printData() {
        console.log("clicked")
        this.setState({ printLoaded: false })
        let res = await PharmacyOrderService.getOrderItems(this.state.filterData)

        console.log('pdata', res.data.view.data)
        
        if (res.status === 200) { 
            console.log('pdata', res.data.view.data)
            this.setState(
                { 
                    printData: res.data.view.data,
                    ploaded: true,
                    printLoaded: true,
                },
                () => {
                    // this.render()
                    document.getElementById('print_button_006').click() 
                    // this.getCartItems()
                }
            )
            console.log('Print Data', this.state.printData)
        }

        this.setState({ showLoading: true });

        setTimeout(() => {
         this.setState({ showLoading: false });
        }, 5000);
    }


     // split order
    //  async getSplitOrder(){

    //     let params = {
    //         splited_from:this.props.match.params.id,
    //         page:0,
    //         limit:10,
    //     }

    //     let res = await ChiefPharmacistServices.getAllOrders(params)
    //     // console.log('splitdata', res)

    //     if (res.status === 200) {
            
    //         console.log('splitdata', res.data.view.data)

    //         this.setState({
    //             splitData:res.data.view.data,
    //             totalItems:res.data.view.totalItems
    //         })
    //     }
    // }
    


    render() {
        let { theme } = this.props
        const { classes } = this.props
        return (
            <MainContainer>
                            <Fragment>
                            

<ValidatorForm
    className=""
    onSubmit={() => this.SubmitAll()}
    onError={() => null}>

    <Grid container>
        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
            <SubTitle title={"Ven"}></SubTitle>
            <Autocomplete
                className="w-full"
                options={this.state.all_ven}
                /*  defaultValue={dummy.find(
                     (v) => v.value == ''
                 )} */
                getOptionLabel={(option) =>
                    option.name ?
                        (option.name)
                        : ('')
                }
                getOptionSelected={(option, value) =>
                    console.log("ok")
                }
                onChange={(event, value) => {

                    let filterData = this.state.filterData
                    if (value != null) {
                        filterData.ven_id = value.id
                        // filterData.ven = value.name
                    } else {
                        filterData.ven_id = null
                    }
                    this.setState({ filterData })

                }}
                value={this.state.all_ven.find((v) =>
                    v.id == this.state.filterData.ven_id
                )}



                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        placeholder="Ven"
                        //variant="outlined"
                        //value={}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        validators={[
                            'required',
                        ]}
                        errorMessages={[
                            'this field is required',
                        ]}
                    />
                )}
            />

        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
            <SubTitle title={"Item Class"}></SubTitle>
            <Autocomplete
                className="w-full"
                options={this.state.all_item_class}
                /*  defaultValue={dummy.find(
                     (v) => v.value == ''
                 )} */
                getOptionLabel={(option) =>
                    option.description ?
                        (option.description)
                        : ('')
                }
                getOptionSelected={(option, value) =>
                    console.log("ok")
                }
                onChange={(event, value) => {

                    let filterData = this.state.filterData
                    if (value != null) {

                        filterData.class_id = value.id


                    } else {
                        filterData.class_id = null
                    }
                    this.setState({ filterData })

                }}
                value={this.state.all_item_class.find((v) =>
                    v.id == this.state.filterData.class_id
                )}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        placeholder="Item Class"
                        //variant="outlined"
                        //value={}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        validators={[
                            'required',
                        ]}
                        errorMessages={[
                            'this field is required',
                        ]}
                    />
                )}
            />

        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
            <SubTitle title={"Item Category"}></SubTitle>
            <Autocomplete
                className="w-full"
                options={this.state.all_item_category}
                /*  defaultValue={dummy.find(
                     (v) => v.value == ''
                 )} */

                getOptionLabel={(option) =>
                    option.description ?
                        (option.description)
                        : ('')
                }
                getOptionSelected={(option, value) =>
                    console.log("ok")
                }
                onChange={(event, value) => {
                    let filterData = this.state.filterData
                    if (value != null) {

                        filterData.category_id = value.id


                    } else {
                        filterData.category_id = null
                    }
                    this.setState({ filterData })
                }}
                value={this.state.all_item_category.find((v) =>
                    v.id == this.state.filterData.category_id
                )}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        placeholder="Item Category"
                        //variant="outlined"
                        //value={}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        validators={[
                            'required',
                        ]}
                        errorMessages={[
                            'this field is required',
                        ]}
                    />
                )}
            />

        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
            <SubTitle title={"Status"}></SubTitle>
            <Autocomplete
                className="w-full"
                options={[{ value: "ORDERED" }, { value: "APPROVED" }, { value: "ISSUED" }, { value: "ALLOCATED" }, { value: 'PARTIAL RECEIVED' }, { value: "RECEIVED" }, { value: "DROPPED" }, { value: "REJECTED" }]}
                /*  defaultValue={dummy.find(
                     (v) => v.value == ''
                 )} */
                getOptionLabel={(option) => option.value}
                getOptionSelected={(option, value) =>
                    console.log("ok")
                }
                onChange={(event, value) => {
                    let filterData = this.state.filterData
                    if (value != null) {

                        // let filterDataValidation = this.state.filterDataValidation;
                        // filterDataValidation.status = true;

                        filterData.status = value.value
                        // this.setState({ filterDataValidation })

                    } else {
                        filterData.status = null
                    }
                    this.setState({ filterData })
                }}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        placeholder="Status"
                        //variant="outlined"
                        //value={}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        validators={[
                            'required',
                        ]}
                        errorMessages={[
                            'this field is required',
                        ]}
                    />
                )}
            />

        </Grid>

    </Grid>
    <Grid container>

        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
            <SubTitle title={"Item Group"}></SubTitle>
            <Autocomplete
                className="w-full"
                options={this.state.all_item_group}
                /*  defaultValue={dummy.find(
                     (v) => v.value == ''
                 )} */

                getOptionLabel={(option) =>
                    option.description ?
                        (option.description)
                        : ('')
                }
                getOptionSelected={(option, value) =>
                    console.log("ok")
                }
                onChange={(event, value) => {
                    let filterData = this.state.filterData
                    if (value != null) {

                        filterData.group_id = value.id


                    } else {
                        filterData.group_id = null
                    }
                    this.setState({ filterData })
                }}
                value={this.state.all_item_group.find((v) =>
                    v.id == this.state.filterData.group_id
                )}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        placeholder="Item Group"
                        //variant="outlined"
                        //value={}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        validators={[
                            'required',
                        ]}
                        errorMessages={[
                            'this field is required',
                        ]}
                    />
                )}
            />

        </Grid>
        <Grid item lg={3} md={3} sm={3} xs={3} className="px-2 mb-2">
            <SubTitle title={"Drug Store"}></SubTitle>
            <Autocomplete
                className="w-full"
                options={this.state.all_item_drug_store}
                /*  defaultValue={dummy.find(
                     (v) => v.value == ''
                 )} */
                getOptionLabel={(option) =>
                    option.name ?
                        (option.name)
                        : ('')
                }
                getOptionSelected={(option, value) =>
                    console.log("ok")
                }
                onChange={(event, value) => {

                    console.log("fromStore", value);
                    let filterData = this.state.filterData
                    if (value != null) {

                        // let filterDataValidation = this.state.filterDataValidation;
                        // filterDataValidation.from = true;

                        filterData.to = value.id

                        // this.setState({ filterDataValidation })


                    } else {
                        filterData.to = null
                    }
                    this.setState({ filterData })

                }}
                value={this.state.all_item_drug_store.find((v) =>
                    v.id == this.state.filterData.to
                )}
                renderInput={(params) => (
                    <TextValidator
                        {...params}
                        placeholder="Drug Store"
                        //variant="outlined"
                        //value={}
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                        size="small"
                        validators={[
                            'required',
                        ]}
                        errorMessages={[
                            'this field is required',
                        ]}
                    />
                )}
            />

        </Grid>
        <Grid item lg={1} md={1} sm={1} xs={1} className="text-left px-2">
            <Button
                className="mt-6"
                progress={false}
                scrollToTop={false}
                // type='submit'
                startIcon="search"
                onClick={() => { this.handleFilterButton() }}
            >
                <span className="capitalize">Filter</span>
            </Button>
        </Grid>
        <Grid item lg={2} md={2} sm={2} xs={2} className="text-left px-2 mb-2" >

        </Grid>
        <Grid item
            lg={2} md={2} sm={2} xs={2}
            className='px-2 mb-2'
            style={{ display: 'flex', flexDirection: 'column' }}>

            <TextValidator
                className='w-full mt-5'
                placeholder="SR No"
                //variant="outlined"

                variant="outlined"
                size="small"
                value={this.state.filterData.search}
                onChange={(e, value) => {
                    let filterData = this.state.filterData
                    if (e.target.value) {
                        let filterDataValidation = this.state.filterDataValidation;
                        filterDataValidation.search = true;

                        filterData.search = e.target.value;

                        this.setState({ filterDataValidation })
                    } else {
                        filterData.search = null;
                    }

                    this.setState({ filterData })
                    // console.log("form dat", this.state.filterData)
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
                            {/* <SearchIcon></SearchIcon> */}
                        </InputAdornment>
                    )
                }} />
            {
                /*  this.state.filterDataValidation.search ?
                     ("") :
                     (<span style={{ color: 'red' }}>this field is required</span>) */
            }

        </Grid>
        <Grid item lg={1} md={1} sm={1} xs={1} className="text-left pl-4 pr-0" >
            <Button
                className="mt-6 "
                progress={false}
                scrollToTop={false}
                // type='submit'
                startIcon="search"
                onClick={() => { this.handleSearchButton() }}
            >
                <span className="capitalize">Search</span>
            </Button>
        </Grid>
    </Grid>

</ValidatorForm>

<Grid container>
    <Grid className='mt-5' item lg={12} md={12} sm={12} xs={12}>
        <Tooltip title="Print">  
            {/* print button */}
            <Button startIcon="print" onClick={() => { this.printData() }}>Print Order</Button>
        </Tooltip>
    </Grid>
</Grid>


<Grid container className="mt-2 pb-5">
    <Grid item lg={12} md={12} sm={12} xs={12}>
        {
            this.state.Loaded ?
                <>
                    <LoonsTable
                        //title={"All Aptitute Tests"}

                        id={'all_items'}
                        data={
                            this.state.data
                        }
                        columns={
                            this.state.columns
                        }
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: this.state.totalItems,
                            rowsPerPage: this.state.filterData.limit,
                            page: this.state.filterData.page,

                            print: true,
                            viewColumns: true,
                            download: true,
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
                </> :
                (
                    //loading effect
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                )

        }

    </Grid>


    {this.state.order?.fromStore?.owner_id === this.state.order?.toStore?.owner_id && this.state.order.Delivery?.delivery_mode === "Pickup" ?
   null :  <>
    {this.state.order?.Delivery?.delivery_mode === 'Delivery' ? 
<Grid
            container justifyContent="flex-end">
    <Grid>
            <LoonsButton
                className="mt-2"
                progress={false}
                scrollToTop={true}
                startIcon="add"

                onClick={() => this.setState({ vehicleDialogView: true })}
            >
                <span className="capitalize">Add Vehicles</span>
            </LoonsButton>
                        </Grid>

                                    </Grid>                                      


 : null} 
<Grid className='mt-5' item lg={12} md={12} sm={12} xs={12}>
    {
        this.state.vehicleLoaded ?
            <>
                <LoonsTable
                    title={"Assigned Vehicles"}

                    id={'all_vehicle'}
                    data={
                        this.state.vehicle_data
                    }
                    columns={
                        this.state.vehicle_columns
                    }
                    options={{
                        pagination: false,
                        serverSide: true,
                        //count: this.state.totalItems,
                        //rowsPerPage: this.state.filterData.limit,
                        //page: this.state.filterData.page,

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
            </> :
            (
                //loading effect
                <Grid className="justify-center text-center w-full pt-12">
                    <CircularProgress size={30} />
                </Grid>
            )

    }

</Grid>
{/* 
<Grid container className='w-full mt-5'>
    <Grid item xs={12} style={{border:'3px solid #6495ED', backgroundColor:'rgba(64, 224, 208, 0.3)', borderRadius:'5px'}}>
        <div className='p-3 m-3'>
            <p className='m-0 p-0' style={{fontWeight:'bold'}}>Splited Order</p>
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
</Grid> */}


{ this.state.ploaded ?
    <RequisitionDocument
    printData={this.state.printData}
    order={this.state.order}
    loginUser={this.state.loginUser}
    pickUpPerson={this.state.pickUpPerson}
    vehicle_data={this.state.vehicle_data}
    />
     :
    null
} 

</>


}
    {/* { this.state.isEdit ? */}
        <Dialog
            fullWidth
            maxWidth="xl"
            open={this.state.isEdit}
            onClose={this.handleCloseDialog}
        >

        <DialogTitle disableTypography>
          <h2>Edit Order</h2>
        </DialogTitle>
        <Divider></Divider>
        <ValidatorForm onSubmit={() => this.updateSingleItem()} className="w-full">
            <Grid container className='mt-3'>
                <Grid item sm={12}>
                    <table style={{width:'100%'}}>
                        <tr>
                            <th style={{width:'20%', textAlign:'center'}}>SR No</th>
                            <th style={{width:'20%', textAlign:'center'}}>Item Name</th>
                            <th style={{width:'20%', textAlign:'center'}}>Status</th>
                            <th style={{width:'20%', textAlign:'center'}}>Order Qty</th>
                            <th style={{width:'20%', textAlign:'center'}}>Approved Qty</th>
                        </tr>

                        <tr>
                            <td style={{width:'20%', textAlign:'center'}}>{this.state.editData.ItemSnap?.sr_no}</td>
                            <td style={{width:'20%', textAlign:'center'}}>{this.state.editData.ItemSnap?.medium_description}</td>
                            <td style={{width:'20%', textAlign:'center'}}>{this.state.editData.ItemSnap?.status}</td>
                            {/* {this.state.editData.ItemSnap?.converted_order_uom === 'EU' ? 
                            <td style={{width:'20%', textAlign:'center'}}>
                                <>
                                {(this.state.editData.request_quantity > 0) &&
                                    <p className='pt-1 pb-1 pl-5 pr-5' style={{border:'1px solid #ffd600', backgroundColor:'#fff59d', borderRadius:'3px', textAlign:'center'}}>{roundDecimal(this.state.editData?.request_quantity / this.state.editData?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.editData?.ItemSnap?.MeasuringUnit?.name }</p>
                                }
                                <TextValidator
                                    className='w-full'
                                    placeholder="Order Qty"
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={this.handleEditChange}
                                    value={this.state.editData.request_quantity}
                                    InputProps={{
                                        endAdornment: (
                                            this.state.editData.ItemSnap?.converted_order_uom === 'EU' ? (
                                                <InputAdornment position="end" className='mr-1'>
                                                    {this.state.editData?.ItemSnap?.DisplayUnit?.name}
                                                </InputAdornment>
                                            ) : null // Render nothing when the condition is not met
                                        )
                                    }}
                                />
                                </>
                                
                            </td>
                            : */}
                            <td style={{width:'20%', textAlign:'center'}}>
                                
                                <TextValidator
                                    className='w-full'
                                    placeholder="Order Qty"
                                    type="text"
                                    variant="outlined"
                                    size="small"
                                    onChange={this.handleEditChange}
                                    value={this.state.editData.request_quantity}
                                />
                                
                            </td>
                            {/* } */}
                            <td style={{width:'20%', textAlign:'center'}}>{this.state.editData.approved_quantity}</td>
                        </tr>
                    </table>   
                </Grid>

                <Grid item sm={12}>
                    <br></br>
                </Grid>

                <Grid item sm={12} container justifyContent='flex-end' className='mb-5'>
                    <Button className='mr-10' type='submit' color='primary'>Save</Button>
                </Grid>
            </Grid>
        </ValidatorForm>
            

        </Dialog>
        {/* : null
    } */}

    <Dialog  fullWidth maxWidth="xl" open={this.state.vehicleDialogView} 
                onClose={() => { this.setState({ vehicleDialogView: false }, () => this.preLoadData()) }}  >
                    <MuiDialogTitle disableTypography
                    //  className={classes.Dialogroot}
                     >
                        <CardTitle title="Select New Vehicle" />
                        <IconButton aria-label="close"
                        //  className={classes.closeButton}
                            onClick={() => {
                                this.setState({ vehicleDialogView: false }, () => this.preLoadData())
                             }}>
                            <CloseIcon />
                         </IconButton> 
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <MDS_AddVehicleNew delivery_id={this.state.vehicle_filterData.order_delivery_id} />
                    </div>
                </Dialog>

</Grid>

</Fragment>


            </MainContainer>
        )
    }
}

export default (withStyles(styleSheet),withRouter)(AllItems)
// withRouter(AllItems)