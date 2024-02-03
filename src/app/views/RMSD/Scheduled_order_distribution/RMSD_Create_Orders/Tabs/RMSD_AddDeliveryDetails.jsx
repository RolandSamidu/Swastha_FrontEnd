import { CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Icon, IconButton, TextareaAutosize, Tooltip } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Button, CardTitle, LoonsCard, LoonsSnackbar, LoonsSwitch, LoonsTable, MainContainer } from "app/components/LoonsLabComponents";
import React, { Component } from "react";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { FlexibleHeightXYPlot } from "react-vis";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles'
import RMSD_AddPickUpPerson from "./RMSD_AddPickUpPerson";
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import VisibilityIcon from '@material-ui/icons/Visibility';

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

class RMSD_AddDeliveryDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            changed: [],
            checked: false,
            selectedOrder: null,
            pickUpDialogView: false,
            remarkDialogView: false,
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id: null,
            data: [],
            columns: [
                // {
                //     name: 'order_id',
                //     label: 'Order Id',
                //     options: {
                //         display: true
                //     }
                // },delivered_date
                {
                    name: 'delivered_date',
                    label: 'Delivered Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let data = this.state.data[tableMeta.rowIndex]?.delivered_date
                            if (data == null) {
                                return <p>{'-'}</p>
                            }
                            else {
                                return <p>{data}</p>
                            }
                        }
                    }
                },
                {
                    name: 'fromStore',
                    label: 'Drug Store (From)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }
                },
                {
                    name: 'toStore',
                    label: 'Drug Store (To)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            if (tableMeta.rowData[tableMeta.columnIndex] == null || tableMeta.rowData[tableMeta.columnIndex] == '') {
                                return 'N/A'
                            } else {
                                return (tableMeta.rowData[tableMeta.columnIndex].name)
                            }
                        }
                    }
                },
                {
                    name: 'number_of_items',
                    label: 'No Of Items',
                    options: {
                        display: true
                    }
                },
                {
                    name: 'Delivery',
                    label: 'Pick Up Person',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", this.state.data[tableMeta.rowIndex]);
                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (this.state.data[tableMeta.rowIndex].Delivery ? (this.state.data[tableMeta.rowIndex].Delivery.Employee ? this.state.data[tableMeta.rowIndex].Delivery.Employee.name : 'N/A') : 'N/A')

                            }
                        }
                    }
                },
                {
                    name: 'Delivery',
                    label: 'Contact Number',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", this.state.data[tableMeta.rowIndex]);
                            if (tableMeta.rowData[tableMeta.columnIndex] == null) {
                                return 'N/A'
                            } else {
                                return (this.state.data[tableMeta.rowIndex].Delivery ? (this.state.data[tableMeta.rowIndex].Delivery.Employee ? this.state.data[tableMeta.rowIndex].Delivery.Employee.contact_no : 'N/A') : 'N/A')

                            }
                        }
                    }
                }, {
                    name: 'Delivery',
                    label: 'Remarks',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('tablemeta', this.state.data[tableMeta.rowIndex].Delivery)
                            return (
                                this.state.data[tableMeta.rowIndex].Delivery ?
                                    (
                                        this.state.data[tableMeta.rowIndex].Delivery.Remarks.map((item) => {
                                            // console.log('item', item);
                                            if (item.Remarks) {
                                                return (
                                                    <>
                                                        <p>{item.Remarks.remark ? item.Remarks.remark : 'N/A'}</p>
                                                        <p>{item.other_remarks ? item.other_remarks : ''}</p>
                                                    </>

                                                )
                                            }

                                            else {

                                                return (<p>{item.other_remarks ? item.other_remarks : ''}</p>)

                                            }
                                            // return (<p>{item.other_remarks}</p>)
                                        })
                                    ) :
                                    ("N/A")

                            )


                        }


                    }
                }, {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let deliveryObj = tableMeta.rowData[tableMeta.columnIndex - 1]
                            console.log("gg", this.state.data[tableMeta.rowIndex])
                            // console.log("deliveryObj",deliveryObj)
                            return (
                                <Grid className='flex items-center'>
                                    <Tooltip title='Add Details'>
                                        <IconButton
                                            disabled={deliveryObj ? (deliveryObj.Employee != null && deliveryObj.Remarks != null) : false}
                                            onClick={() => {
                                                console.log('clicked', this.state.data[tableMeta.rowIndex])
                                                this.state.selectedOrder = this.state.data[tableMeta.rowIndex]
                                                this.setState({ pickUpDialogView: true })
                                                console.log('selected ', this.state.selectedOrder)

                                            }}
                                        >
                                            <PersonAddIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Tooltip
                                        title='View'>
                                        <IconButton
                                            disabled={deliveryObj == null}
                                            className="text-black"
                                            onClick={() => this.handleView(this.state.data[tableMeta.rowIndex]) }>
                                             <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip> */}
                                </Grid>

                            )
                        }
                    }
                }
            ],
            tableDataLoaded: false,
            filterData: {
                from: this.props.warehouse_id,
                limit: 20,
                created_by: null,
                page: 0,
                "order[0][0]": 'createdAt',
                "order[0][1]": 'DESC',

            },
            alert: false,
            message: "",
            severity: 'success',
            statusChangeRow: null,
            conformingDialog: false,
            totalItems: 0,
            formData: []
        }
    }

    async handleView(obj) {
        console.log('obj', obj)
        let mode = obj.Delivery.delivery_mode
        if (mode) {
            switch (mode) {
                case 'Delivery':
                    window.location = `/main-drug-store/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`;
                    break
                case 'Pick Up':
                    window.location = `/MDS/individualorder/${obj.Delivery.id}`
                    break
                default:
                    window.location = `/main-drug-store/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`;
                    break

            }
        } else {
            window.location = `/main-drug-store/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`;
        }

    }

    async loadWarehouses() {
        this.setState({ loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            // this.state.genOrder.created_by = id
            // this.state.genOrder.warehouse_id = selected_warehouse_cache.id
            // this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            // this.state.suggestedWareHouses.warehouse_id = selected_warehouse_cache.id
            // this.state.formData.owner_id = selected_warehouse_cache.owner_id
            this.state.filterData.from = selected_warehouse_cache.id;
            this.setState({
                owner_id: selected_warehouse_cache.owner_id,
                selected_warehouse: selected_warehouse_cache.id,
                dialog_for_select_warehouse: false,
                warehouseSelectDone: true
            })
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
            console.log("warehouse", all_pharmacy_dummy)
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy, loaded: true })
        }
    }

    handleChange = (index) => {
        console.log('fkhsabfh', index);
        let arr = this.state.changed;
        if (this.state.changed[index].checked) {
            arr[index].checked = false;
            // obj.checked=false
            // this.state.changed[index].checked = false;
            this.setState({ changed: arr }, () => console.log("arr", this.state.changed))
        } else {
            arr[index].checked = true;
            // this.state.changed[index].checked = false;
            this.setState({ changed: arr }, () => console.log("arr", this.state.changed))
        }
    };

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true
        })
    }

    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({ conformingDialog: false })
    }

    // Change user status
    async changeStatus(row) {
        console.log('comming data', this.state.data[row])
        let data = this.state.data[row]
        let statusChange = {
            "status": data.status == "Deactive" ? "Active" : "Deactive"
        }
        // let res = await VehicleService.changeVehicleUserStatus(
        //     data.id,
        //     statusChange
        // )
        // console.log('res', res)
        // if (res.status == 200) {
        //     this.setState(
        //         {
        //             alert: true,
        //             severity: 'success',
        //             message: 'Successfully changed the status',
        //         },
        //         () => {
        //             this.loadData()
        //         }
        //     )
        // } else {
        //     this.setState(
        //         {
        //             alert: true,
        //             severity: 'error',
        //             message: 'Cannot change the status',
        //         },
        //         () => {
        //             console.log('ERROR UpDate')
        //         }
        //     )
        // }
    }

    async preLoadData() {
        this.setState({ tableDataLoaded: false })
        let res = await PharmacyOrderService.getPickUpPersonOrders(this.state.filterData)
        if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                tableDataLoaded: true,
                totalItems: res.data.view.totalItems
            },
                () => { console.log('data', this.state.data); this.render() })
            return;
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New formdata", this.state.filterData)
            this.preLoadData()
        })
    }

    async componentDidMount() {
        //this.loadWarehouses()
        var user = await localStorageService.getItem('userInfo');
        var id = user.id;
        let filterData = this.state.filterData;
        filterData.created_by = id;
        this.setState({ filterData })
        this.preLoadData()
    }

    render() {
        const { classes } = this.props
        return (
            <>
                < MainContainer >
                    <Grid
                        container="container"
                        spacing={2}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                        <Grid item="item" xs={2}>
                           {/*  <Button
                                onClick={() => { window.location = '/order/newpickupperson' }}>
                                Add new pick-up person
                            </Button> */}
                        </Grid>
                    </Grid>
                    <Grid container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {
                                this.state.tableDataLoaded
                                    ? (
                                        <LoonsTable
                                            //title={"All Aptitute Tests"}
                                            id={'allAptitute'}
                                            data={this.state.data}
                                            columns={this.state.columns} options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,
                                                onTableChange: (action, tableState) => {
                                                    console.log('trigg', action, tableState)
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
                    {/*  <Grid
                        className=" w-full flex justify-end"
                        item="item"
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}>
                        <Button className="mt-2" progress={false} type="submit" scrollToTop={true} startIcon="save"
                        //onClick={this.handleChange}
                        >
                            <span className="capitalize">Check Out</span>
                        </Button>
                    </Grid> */}
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
                <Dialog
                    open={this.state.conformingDialog}
                    onClose={() => { this.setState({ conformingDialog: false }) }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Conformation"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this User?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="text" onClick={() => { this.setState({ conformingDialog: false }) }} color="primary">
                            Disagree
                        </Button>
                        <Button variant="text" onClick={() => { this.agreeToChangeStatus() }} color="primary" autoFocus>
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog maxWidth="lg " open={this.state.pickUpDialogView} /* onClose={() => { this.setState({ pickUpDialogView: false }) }} */ >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Select PickUp Person/Remarks " />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ pickUpDialogView: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        {/* <Admission patientDetails={this.state.selectedPatient}></Admission> */}
                        {/* <AddPickUpPerson id={this.state.selectedOrder ? this.state.selectedOrder.id : null} ></AddPickUpPerson> */}
                        <RMSD_AddPickUpPerson id={{ ...this.state.selectedOrder }}
                            onSuccess={() => {
                                this.setState({
                                    pickUpDialogView: false,
                                }, () => {
                                    this.preLoadData()
                                })


                            }}

                        ></RMSD_AddPickUpPerson>
                    </div>
                </Dialog>
            </>
        );
    }
}

export default withStyles(styleSheet)(RMSD_AddDeliveryDetails);