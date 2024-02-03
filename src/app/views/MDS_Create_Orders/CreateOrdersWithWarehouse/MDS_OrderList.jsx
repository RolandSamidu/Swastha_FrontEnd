import { CircularProgress, Dialog, Grid, Icon, IconButton } from '@material-ui/core'
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    MainContainer
} from 'app/components/LoonsLabComponents'
import React, { Component } from 'react'
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import MDS_UpdateQunatity from './MDS_UpdateQuantity';
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import { roundDecimal } from 'utils';


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
class MDS_OrderList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            qtyDialogView:false,
            orderingMode: 'order',
            activeTab: 0,
            data: [],
            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        display: true
                    }
                }, {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        display: true
                    }
                }, {
                    name: 'drug_store_name',
                    label: 'Drug Store',
                    options: {
                        display: true
                    }
                }, {
                    name: 'order_quantity',
                    label: 'Order Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex]?.converted_order_uom === "EU"){ 
                                return roundDecimal(this.state.data[tableMeta.rowIndex]?.order_quantity * this.state.data[tableMeta.rowIndex]?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.display_unit
                            } else {
                                return this.state.data[tableMeta.rowIndex]?.order_quantity
                            }
                        }
                    }
                }, {
                    name: 'mystock_days',
                    label: 'Order Stock Days',
                    options: {
                        display: true
                    }
                }, {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('meta', tableMeta);
                            return (
                                <>
                                    < IconButton
                                        className="text-black mr-2"
                                        // disabled={!((this.state.data[tableMeta.rowIndex].pickUpPerson == '') || (this.state.data[tableMeta.rowIndex].pickUpPerson == null) || (this.state.data[tableMeta.rowIndex].remarks == '') || (this.state.data[tableMeta.rowIndex].remarks == null))}
                                        onClick={() => {
                                            this.setState({
                                                update_item_id:this.state.data[tableMeta.rowIndex].id,
                                                update_item_unit:this.state.data[tableMeta.rowIndex].measuring_unit,
                                                update_item_qty:this.state.data[tableMeta.rowIndex].order_quantity,
                                                qtyDialogView:true
                                            })
                                        }} >
                                        <Icon>mode_edit_outline</Icon>
                                    </IconButton>
                                    <IconButton className="text-black"
                                        onClick={() => this.handleDelete(this.state.data[tableMeta.rowIndex].id)}>
                                        <Icon>delete_sweep</Icon>
                                    </IconButton>
                                </>
                            )
                        }
                    }
                }
            ],
            totalItems: 0,
            filterData: {
                limit: 10,
                page: 0,
                order:['sr_no']
            },
            update_item_id:null,
            update_item_unit:null,
            update_item_qty:null,
            warehouse_id: null,
            tableDataLoaded: true,
            formData: {
                order_requirement_id: null,
                warehouse_id: null,
                required_date: null,
                limit: 10,
                page: 0,
                order:['sr_no']
            },
            getCartItems: {
                pharmacy_order_id: null,
                status: 'Cart',
                limit: 10,
                page: 0,
                type:"Direct Warehouses",
                to:this.props.selectedWarehouseTo,
                warehouse_id: null
            },
            msg: null,
            alert: false,
            message: '',
            severity: 'success',
            selected_warehouse:null,
            owner_id:null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id:null,
        }
    }

    async loadWarehouses() {
        this.setState({tableDataLoaded: false})
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({dialog_for_select_warehouse: true})
        } 
        else {  
            this.state.formData.warehouse_id = selected_warehouse_cache.id
            this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            this.setState({owner_id: selected_warehouse_cache.owner_id,selected_warehouse:selected_warehouse_cache.id ,dialog_for_select_warehouse:false})
            console.log(this.state.selected_warehouse)
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
                        main_or_personal:element.Warehouse.main_or_personal,
                        owner_id:element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouseByUser", all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy, tableDataLoaded:true})
        }
    }


/*     async loadOrderList() {
        this.setState({ tableDataLoaded: false })
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        const params = {
            warehouse_id: selected_warehouse_cache.id
        }
        let res = await PharmacyOrderService.getOrderList(params)
        let order_id = 0
        if (res.status) {
            if (res.data.view.data.length != 0) {
                console.log('data', res.data.view.data);
                order_id = res.data.view.data[0].pharmacy_order_id
            }
            // this.state.getCartItems.pharmacy_order_id = order_id
            this.state.formData.order_requirement_id = order_id
            this.setState({
                tableDataLoaded: false
            }, () => {
                this.render()
                this.getCartItems()
            })
        }
    } */

    async getCartItems() {
        this.setState({ tableDataLoaded: false })

        const { type } = this.props;
        let getCartItems = this.state.getCartItems
        if (type == 'SellsOrder') {
            getCartItems.type = 'Sales Order direct warehouse'
        }else if (type == 'Exchange direct warehouse') {
            getCartItems.type = 'Exchange direct warehouse'
        } else {
            getCartItems.type = "Direct Warehouses"
        }
        let res2 = await PharmacyOrderService.getOrderList(getCartItems)
        let formData=this.state.formData;
    
        if (res2.status) {
            formData.order_requirement_id=res2.data.view.data[0]?.pharmacy_order_id
            this.setState({
                data: res2.data.view.data,
                tableDataLoaded: true,
                totalItems: res2.data.view.totalItems,
                formData:formData
            }, () => {
                console.log("cart", res2.data.view.data)
                this.render()
            })
        }
    }

    async handleDelete(id) {

        const body = {
            status: 'Active'
        }

        let res = await PharmacyOrderService.removeFromCart(id, body)
        if (res.status && res.status == 200) {
            this.setState({
                alert: true,
                message: 'Item removed Successfully',
                severity: 'success',
                tableDataLoaded: false
            }, () => this.getCartItems())
        } else {
            this.setState({
                alert: true,
                message: 'Item removal failed',
                severity: 'error',
            })
        }

    }

    async setPage(page) {
        //Change paginations
        let getCartItems = this.state.getCartItems
        getCartItems.page = page
        this.setState({
            getCartItems
        }, () => {
            console.log("New formdata", this.state.getCartItems)
            this.getCartItems()
        })
    }

    async placeOrder() {
        const { orderPlaced } = this.props;
        this.setState({ tableDataLoaded: false })
        let res = await PharmacyOrderService.placeOrder(this.state.formData)
        console.log("status", res);
        if (res.status) {
            this.setState({ msg: res.data.posted })
            this.state.tableDataLoaded = true
            this.state.msg == ("data has been added successfully.")
                ? this.setState({ alert: true, message: this.state.msg, severity: 'success' },()=>{
                    this.getCartItems()
                    orderPlaced &&
                    orderPlaced();
                })
                : this.setState({
                    alert: true,
                    message: this.state.msg,
                    severity: 'error',
                    orderID: res
                        .data
                        .posted
                        .data
                        .data[0]
                        .OrderRequirement
                        .id,
                    orderExistWarning: true
                })

        }
    }


    componentDidMount() {
        this.loadWarehouses()
        //this.loadOrderList()
        this.getCartItems()
    }


    render() {
        const { classes } = this.props
        return (
            <>
                < MainContainer >
                    <ValidatorForm
                        onSubmit={() => this.placeOrder()}
                        onError={() => null}
                    >
                        <Grid container="container" spacing={2}>
                            <Grid item="item" xs={12}>
                                <h2>Order List</h2>
                            </Grid>
                        </Grid>
                        <Grid
                            container="container"
                            spacing={2}
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end'
                            }}>
                            <Grid item="item">
                                <h5>Required date :</h5>
                            </Grid>
                            <Grid item="item" xs={2}>
                                <DatePicker className="w-full" value={this.state.formData.required_date}
                                    //label="Date From"
                                    placeholder="Required Date"
                                    minDate={new Date()}

                                    //maxDate={new Date("2020-10-20")}

                                    required={true}

                                    // errorMessages="this field is required"
                                    onChange={date => {
                                        let formData = this.state.formData;
                                        formData.required_date = date;
                                        this.setState({ formData })

                                    }} />
                            </Grid>
                        </Grid>
                        <Grid container="container" className="mt-3">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {
                                    this.state.tableDataLoaded
                                        ? (
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allAptitute'} data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    serverSide: true,
                                                    count: this.state.totalItems,
                                                    rowsPerPage: this.state.getCartItems.limit,
                                                    page: this.state.getCartItems.page,
                                                    onTableChange: (action, tableState) => {
                                                        console.log(action, tableState)
                                                        switch (action) {
                                                            case 'changePage':
                                                                this.setPage(tableState.page)
                                                                break
                                                            case 'sort':
                                                                //this.sort(tableState.page, tableState.sortOrder);
                                                                break
                                                            default:
                                                                console.log('action not handled.')
                                                        }
                                                    }
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
                        <Grid
                            className=" w-full flex justify-end"
                            item="item"
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}>
                            <Button className="mt-2" progress={false} type="submit" scrollToTop={true} startIcon="save"
                            //onClick={this.handleChange}
                            >
                                <span className="capitalize">Place order</span>
                            </Button>
                        </Grid>
                    </ValidatorForm>
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

                <Dialog maxWidth="lg " open={this.state.qtyDialogView}  
                onClose={() => { 
                    this.setState({ 
                        qtyDialogView: false ,
                        tableDataLoaded: false,
                    }) 
                    this.getCartItems()
                    }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Update Quantity " />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ 
                                    qtyDialogView: false,
                                    tableDataLoaded: false
                                })
                                this.getCartItems()
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        {/* <Admission patientDetails={this.state.selectedPatient}></Admission> */}
                        {/* <AddPickUpPerson id={this.state.selectedOrder ? this.state.selectedOrder.id : null} ></AddPickUpPerson> */}
                       <MDS_UpdateQunatity id={this.state.update_item_id} unit={this.state.update_item_unit} qty={this.state.update_item_qty} view={this.state.qtyDialogView}
                          onSuccess={() => {
                            this.setState({
                                qtyDialogView: false,
                                tableDataLoaded: false,
                            }, () => {
                                this.getCartItems()
                            })


                        }}
                        />
                    </div>
                </Dialog>
            </>

        )
    }
}

export default withStyles(styleSheet)(MDS_OrderList)
