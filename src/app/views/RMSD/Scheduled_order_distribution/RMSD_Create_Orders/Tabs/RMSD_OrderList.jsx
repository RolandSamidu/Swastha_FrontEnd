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
import RMSD_UpdateQuantity from './RMSD_UpdateQuantity';
import { withStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
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
class RMSD_OrderList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            qtyDialogView: false,
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
                    name: 'institute_name',
                    label: 'Drug Store',
                    options: {
                        display: true
                    }
                }, {
                    name: 'order_quantity',
                    label: 'Order Qty',
                    options: {
                        display: true
                    }
                }, {
                    name: 'mystock_days',
                    label: 'Order Stock Days',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                           let qty=this.state.data[tableMeta.rowIndex]?.order_quantity
                           let order_for=this.state.data[tableMeta.rowIndex]?.RMSDDistribution?.order_for
                            return (Math.floor(Number(qty)/Number(order_for)))
                        }
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
                                                update_item_id: this.state.data[tableMeta.rowIndex].id,
                                                update_item_qty: this.state.data[tableMeta.rowIndex].order_quantity,
                                                qtyDialogView: true
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
                page: 0
            },
            update_item_id: null,
            update_item_qty: null,
            warehouse_id: null,
            tableDataLoaded: true,
            formData: {
                warehouse_id: this.props.warehouse_id,
                rmsd_distribution_id: null,
                created_by: null,
                required_date: null,
                type: "RMSD Order",
                order : ['sr_no']
            },
            getCartItems: {
                created_by: null,
                status: 'Cart',
                limit: 10,
                page: 0,
                warehouse_id: this.props.warehouse_id
            },
            msg: null,
            alert: false,
            message: '',
            severity: 'success',
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id: null,
        }
    }

    async loadWarehouses() {
        this.setState({ tableDataLoaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            this.state.formData.warehouse_id = selected_warehouse_cache.id
            this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            this.setState({ owner_id: selected_warehouse_cache.owner_id, selected_warehouse: selected_warehouse_cache.id, dialog_for_select_warehouse: false })
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
                        main_or_personal: element.Warehouse.main_or_personal,
                        owner_id: element.Warehouse.owner_id,
                        id: element.warehouse_id,
                        pharmacy_drugs_stores_id: element.Warehouse.pharmacy_drugs_store_id,
                    }

                )
            });
            console.log("warehouseByUser", all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy, tableDataLoaded: true })
        }
    }




    async getCartItems() {

        let res2 = await PharmacyOrderService.getCartItemsRMSD(this.state.getCartItems)
        if (res2.status) {

            let formData = this.state.formData;
            if (res2.data.view.data.length > 0) {
                formData.rmsd_distribution_id = res2.data.view.data[0].rmsd_distribution_id
            }


            this.setState({
                data: res2.data.view.data,
                formData: formData,
                tableDataLoaded: true,
                totalItems: res2.data.view.totalItems
            }, () => {
                console.log("cart", res2.data.view.data)
                this.render()
            })
        }
    }

    async handleDelete(id) {

        const body = {
            status: 'Active',
            // order_quantity:0
        }

        let res = await PharmacyOrderService.removeFromCartRMSD(id, body)
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

   /*  async getLatestorder(id) {


        let filterData = {
            owner_id: null,
            from: this.props.warehouse_id,
            to: null,
            created_by: null,
            type: "RMSD Order",
            required_date: this.state.required_date,
            limit: 1,
            page: 0,
            'order[0]': ['createdAt', 'DESC'],
        }
        let owner_id = await localStorageService.getItem('owner_id')
        let userInfo = await localStorageService.getItem('userInfo')
        let selected_Warehouse = await localStorageService.getItem('Selected_Warehouse')

        filterData.owner_id = owner_id
        filterData.created_by = userInfo.id
        filterData.to = selected_Warehouse.warehouse.id

        let orders = await ChiefPharmacistServices.getAllOrders(filterData)
        if (orders.status == 200) {
            if (orders.data.view.data.length > 0) {

                let rsData = orders.data.view.data[0]
                console.log('created Orders', orders.data.view.data)
                window.location = `/msa_all_order/all-orders/order/${rsData.id}/${rsData.number_of_items}/${rsData.order_id}/${rsData.Employee.name}/${rsData.Employee.contact_no}/${rsData.status}/${rsData.type}`
            }

        }

    } */

    async getLatestorder(data) {
        window.location = `/msa_all_order/all-orders/order/${data.id}/${data.number_of_items}/${data.order_id}/${null}/${null}/${data.status}/${data.type}`

    }

    async placeOrder() {
     const { orderPlaced } = this.props;
        this.setState({ tableDataLoaded: false })
        let res = await PharmacyOrderService.placeRMSDOrder(this.state.formData)
        console.log("status", res);
        if (res.status) {
            this.setState({ msg: res.data.posted.msg })
            this.state.tableDataLoaded = true
            this.state.msg == ("data has been added successfully.")
                ? this.setState({ alert: true, message: this.state.msg, severity: 'success' },
                    () => { 
                        this.getCartItems()
                        this.getLatestorder(res.data.posted.res[0]) 
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


    async componentDidMount() {
        // this.loadWarehouses()
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        let getCartItems = this.state.getCartItems
        let formData = this.state.formData;

        getCartItems.created_by = id;
        formData.created_by = id;
        this.setState({ getCartItems, formData }, () => {
            this.getCartItems()
        })
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
                            qtyDialogView: false,
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
                        <RMSD_UpdateQuantity id={this.state.update_item_id} qty={this.state.update_item_qty} view={this.state.qtyDialogView}
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

export default withStyles(styleSheet)(RMSD_OrderList)
