import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
    Icon,
    IconButton,
    TextField,
    TextareaAutosize,
    Tooltip,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import {
    Button,
    CardTitle,
    LoonsCard,
    DatePicker,
    LoonsSnackbar,
    LoonsSwitch,
    LoonsTable,
    MainContainer,
} from 'app/components/LoonsLabComponents'
import React, { Component } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { FlexibleHeightXYPlot } from 'react-vis'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import CloseIcon from '@material-ui/icons/Close'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import { withStyles } from '@material-ui/core/styles'
import MSD_AddPickUpPerson from './MDS_AddPickUpPerson'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import WarehouseServices from 'app/services/WarehouseServices'
import localStorageService from 'app/services/localStorageService'
import VisibilityIcon from '@material-ui/icons/Visibility'
import { dateParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import LabeledInput from 'app/components/LoonsLabComponents/LabeledInput'

const drawerWidth = 270

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
        backgroundColor: '#bad4ec',
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

class MDS_AddDeliveryDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            changed: [],
            checked: false,
            selectedOrder: null,
            dataFilter: false,
            pickUpDialogView: false,
            pickUpAllDialogView: false,
            remarkDialogView: false,
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            owner_id: null,
            data: [],
            selected_id: [],
            selectedAll: false,
            columns: [
                {
                    name: 'select_id',
                    label: '',
                    options: {
                        display: true,
                        customHeadRender: (columnMeta, updateDirection) => (
                            <th key={columnMeta.index}>
                                <input
                                    type="checkbox"
                                    disabled={!this.state.dataFilter}
                                    style={{ width: "20px", height: "20px", outline: "none", cursor: "pointer" }}
                                    checked={this.state.selectedAll}
                                    onChange={this.handleSelectAll}
                                />
                            </th>
                        ),
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.data) {
                                // console.log(deliveryObj)
                                console.log(this.state.data)
                                return <input
                                    type="checkbox"
                                    style={{
                                        width: "20px",
                                        height: "20px", outline: "none",
                                        cursor: "pointer"
                                    }}
                                    value={this.state.data[dataIndex].id
                                    }
                                    disabled={
                                        !this.state.dataFilter
                                    }
                                    checked={this.state.selected_id.includes(this.state.data[dataIndex].id)}
                                    onChange={this.handleChange}
                                />
                            } else {
                                return "N/A"
                            }

                        }
                    }
                },
                {
                    name: 'order_id',
                    label: 'Order Id',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'delivered_date',
                    label: 'Delivered Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            let data = dateParse(
                                this.state.data[tableMeta.rowIndex]
                                    ?.delivered_date
                            )
                            if (data == null) {
                                return <p>{'-'}</p>
                            } else {
                                return <p>{data}</p>
                            }
                        },
                    },
                },
                {
                    name: 'fromStore',
                    label: 'Drug Store (From)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            if (
                                tableMeta.rowData[tableMeta.columnIndex] ==
                                null ||
                                tableMeta.rowData[tableMeta.columnIndex] == ''
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .name
                            }
                        },
                    },
                },
                {
                    name: 'toStore',
                    label: 'Drug Store (To)',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", tableMeta);
                            if (
                                tableMeta.rowData[tableMeta.columnIndex] ==
                                null ||
                                tableMeta.rowData[tableMeta.columnIndex] == ''
                            ) {
                                return 'N/A'
                            } else {
                                return tableMeta.rowData[tableMeta.columnIndex]
                                    .name
                            }
                        },
                    },
                },
                {
                    name: 'number_of_items',
                    label: 'No Of Items',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'Delivery',
                    label: 'Pick Up Person',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", this.state.data[tableMeta.rowIndex]);
                            if (
                                tableMeta.rowData[tableMeta.columnIndex] == null
                            ) {
                                return 'N/A'
                            } else {
                                return this.state.data[tableMeta.rowIndex]
                                    .Delivery
                                    ? this.state.data[tableMeta.rowIndex]
                                        .Delivery.Employee
                                        ? this.state.data[tableMeta.rowIndex]
                                            .Delivery.Employee.name
                                        : 'N/A'
                                    : 'N/A'
                            }
                        },
                    },
                },
                {
                    name: 'Delivery',
                    label: 'Contact Number',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log("tableMeta", this.state.data[tableMeta.rowIndex]);
                            if (
                                tableMeta.rowData[tableMeta.columnIndex] == null
                            ) {
                                return 'N/A'
                            } else {
                                return this.state.data[tableMeta.rowIndex]
                                    .Delivery
                                    ? this.state.data[tableMeta.rowIndex]
                                        .Delivery.Employee
                                        ? this.state.data[tableMeta.rowIndex]
                                            .Delivery.Employee.contact_no
                                        : 'N/A'
                                    : 'N/A'
                            }
                        },
                    },
                },
                {
                    name: 'Delivery',
                    label: 'Remarks',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('tablemeta', this.state.data[tableMeta.rowIndex].Delivery)
                            return this.state.data[tableMeta.rowIndex].Delivery
                                ? this.state.data[
                                    tableMeta.rowIndex
                                ].Delivery.Remarks.map((item) => {
                                    // console.log('item', item);
                                    if (item.Remarks) {
                                        return (
                                            <>
                                                <p>
                                                    {item.Remarks.remark
                                                        ? item.Remarks.remark
                                                        : 'N/A'}
                                                </p>
                                                <p>
                                                    {item.other_remarks
                                                        ? item.other_remarks
                                                        : ''}
                                                </p>
                                            </>
                                        )
                                    } else {
                                        return (
                                            <p>
                                                {item.other_remarks
                                                    ? item.other_remarks
                                                    : ''}
                                            </p>
                                        )
                                    }
                                    // return (<p>{item.other_remarks}</p>)
                                })
                                : 'N/A'
                        },
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let deliveryObj =
                                tableMeta.rowData[tableMeta.columnIndex - 1]
                            console.log(
                                'gg',
                                this.state.data[tableMeta.rowIndex]
                            )
                            // console.log("deliveryObj",deliveryObj)
                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Add Details">
                                        <IconButton
                                            disabled={
                                                deliveryObj
                                                    ? deliveryObj.Employee !=
                                                    null &&
                                                    deliveryObj.Remarks !=
                                                    null
                                                    : false
                                            }

                                            style={deliveryObj ? {
                                                color: '#808080'
                                            } : {
                                                color: '#ff0000'
                                            }}

                                            onClick={() => {

                                                console.log(
                                                    'clicked',
                                                    this.state.data[
                                                    tableMeta.rowIndex
                                                    ]
                                                )

                                                this.state.selectedOrder =
                                                    this.state.data[
                                                    tableMeta.rowIndex
                                                    ]
                                                this.setState({
                                                    pickUpDialogView: true,
                                                })
                                                console.log(
                                                    'selected ',
                                                    this.state.selectedOrder
                                                )
                                            }}

                                        >

                                            <PersonAddIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="View">
                                        <IconButton
                                            disabled={deliveryObj == null}
                                            className="text-black"
                                            onClick={() =>
                                                this.handleView(
                                                    this.state.data[
                                                    tableMeta.rowIndex
                                                    ]
                                                )
                                            }
                                        >
                                            <VisibilityIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        },
                    },
                },
            ],
            tableDataLoaded: false,
            filterData: {
                from: null,
                limit: 20,
                to: null,
                pending_delivery_only: true,
                status: ["Pending", "Pending Approval", "APPROVED"],
                required_date: null,
                page: 0,
                'order[0][0]': 'createdAt',
                'order[0][1]': 'DESC',
            },
            alert: false,
            message: '',
            severity: 'success',
            statusChangeRow: null,
            conformingDialog: false,
            totalItems: 0,
            formData: [],
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSelectAll = this.handleSelectAll.bind(this);
    }

    handleChange(e) {
        const { value, checked } = e.target;
        let updatedSelectedItems = [... this.state.selected_id];

        if (checked) {
            updatedSelectedItems.push(value);
        } else {
            updatedSelectedItems = updatedSelectedItems.filter(item => item !== value);
        }
        this.setState({ selected_id: updatedSelectedItems });
    }

    handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        const selectedIds = isChecked
            ? this.state.data
                .filter((row) => row.Delivery?.Employee !== null && row.Delivery?.Remarks !== null)
                .map((row) => row.id)
            : [];

        this.setState({
            selectedAll: isChecked,
            selected_id: selectedIds,
        });
    };

    async handleView(obj) {
        console.log('obj', obj)
        let mode = obj.Delivery.delivery_mode
        if (mode) {
            switch (mode) {
                case 'Delivery':
                    //window.location = `/main-drug-store/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`;
                    window.location = `/hospital-ordering/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`

                    break
                case 'Pick Up':
                    //window.location=`/MDS/individualorder/${obj.Delivery.id}`
                    window.location = `/hospital-ordering/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`
                    break
                default:
                    //window.location = `/main-drug-store/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`;
                    window.location = `/hospital-ordering/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`

                    break
            }
        } else {
            window.location = `/main-drug-store/all-items/${obj.id}?pickUpPersonID=${obj.Delivery.pickup_person_id}`
        }
    }

    async loadWarehouses() {
        this.setState({ loaded: false })
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)
        var id = user.id
        var all_pharmacy_dummy = []
        var selected_warehouse_cache = await localStorageService.getItem(
            'Selected_Warehouse'
        )
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        } else {
            // this.state.genOrder.created_by = id
            // this.state.genOrder.warehouse_id = selected_warehouse_cache.id
            // this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            // this.state.suggestedWareHouses.warehouse_id = selected_warehouse_cache.id
            // this.state.formData.owner_id = selected_warehouse_cache.owner_id
            this.state.filterData.from = selected_warehouse_cache.id
            this.setState({
                owner_id: selected_warehouse_cache.owner_id,
                selected_warehouse: selected_warehouse_cache.id,
                dialog_for_select_warehouse: false,
                warehouseSelectDone: true,
            })
            console.log(this.state.selected_warehouse)
        }
        let params = { employee_id: id }
        let res = await WarehouseServices.getWareHouseUsers(params)
        if (res.status == 200) {
            console.log('warehouseUsers', res.data.view.data)

            res.data.view.data.forEach((element) => {
                all_pharmacy_dummy.push({
                    warehouse: element.Warehouse,
                    name: element.Warehouse.name,
                    main_or_personal: element.Warehouse.main_or_personal,
                    owner_id: element.Warehouse.owner_id,
                    id: element.warehouse_id,
                    pharmacy_drugs_stores_id:
                        element.Warehouse.pharmacy_drugs_store_id,
                })
            })
            console.log('warehouse', all_pharmacy_dummy)
            this.setState({
                all_warehouse_loaded: all_pharmacy_dummy,
                loaded: true,
            })
        }
    }

    // handleChange = (index) => {
    //     console.log('fkhsabfh', index)
    //     let arr = this.state.changed
    //     if (this.state.changed[index].checked) {
    //         arr[index].checked = false
    //         // obj.checked=false
    //         // this.state.changed[index].checked = false;
    //         this.setState({ changed: arr }, () =>
    //             console.log('arr', this.state.changed)
    //         )
    //     } else {
    //         arr[index].checked = true
    //         // this.state.changed[index].checked = false;
    //         this.setState({ changed: arr }, () =>
    //             console.log('arr', this.state.changed)
    //         )
    //     }
    // }

    async toChangeStatus(row) {
        this.setState({
            statusChangeRow: row,
            conformingDialog: true,
        })
    }

    async agreeToChangeStatus() {
        this.changeStatus(this.state.statusChangeRow)
        this.setState({ conformingDialog: false })
    }

    display() {
        alert(this.state.selected_id.length);
        // this.setState({pickUpAllDialogView: true})

    }

    // Change user status
    async changeStatus(row) {
        console.log('comming data', this.state.data[row])
        let data = this.state.data[row]
        let statusChange = {
            status: data.status == 'Deactive' ? 'Active' : 'Deactive',
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

        const { type } = this.props;
        let filterData = this.state.filterData
        if (type == 'SellsOrder') {
            filterData.type = 'Sales Order'
        }else if (type == 'Exchange direct warehouse') {
            filterData.type = 'Exchange direct warehouse'
        } else {
            filterData.type = ['Order', 'RMSD Order']
        }
        let res = await PharmacyOrderService.getPickUpPersonOrders(
            this.state.filterData
        )
        if (res.status == 200) {
            this.setState(
                {
                    data: res.data.view.data,
                    tableDataLoaded: true,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    console.log('data', this.state.data)
                    this.render()
                }
            )
            return
        }
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
                console.log('New formdata', this.state.filterData)
                this.preLoadData()
            }
        )
    }

    componentDidMount() {
        this.loadWarehouses()
        this.preLoadData()
    }

    render() {
        const { classes } = this.props
        return (
            <>
                <MainContainer>
                    <ValidatorForm
                        onSubmit={() => this.preLoadData()}
                        onError={() => null}>
                        <Grid
                            container="container"
                            spacing={2}
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                alignContent: "center"
                            }}
                        >
                            <Grid item="item">
                                <Typography variant="h6" className="font-semibold">Required Date:</Typography>
                            </Grid>
                            <Grid item="item" xs={4}>
                                <DatePicker className="w-full" value={this.state.filterData.required_date}
                                    //label="Date From"
                                    placeholder="Required Date"
                                    minDate={new Date()}

                                    //maxDate={new Date("2020-10-20")}
                                    required={true}

                                    // errorMessages="this field is required"
                                    onChange={date => {
                                        let filteredData = { ...this.state.filterData };
                                        const dateObject = dateParse(new Date(date));
                                        filteredData.required_date = dateObject;
                                        this.setState({ filterData: filteredData })
                                    }}
                                />
                            </Grid>
                            <Grid item="item" className='mt-1'>
                                <LoonsButton color="primary" size="medium" type="submit" onClick={() => this.setState({ dataFilter: true })}>Filter</LoonsButton>
                            </Grid>
                            {/* <Grid item="item" xs={2}>
                            <Button
                            onClick={() => {
                                window.location = '/order/newpickupperson'
                            }}
                            >
                            Add new pick-up person
                            </Button>
                        </Grid> */}
                        </Grid>
                    </ValidatorForm>

                    <Grid container="container" spacing={2}>
                        <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                            {this.state.tableDataLoaded ? (
                                <LoonsTable
                                    //title={"All Aptitute Tests"}
                                    id={'allAptitute'}
                                    data={this.state.data}
                                    columns={this.state.columns}
                                    options={{
                                        pagination: true,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        rowsPerPage:
                                            this.state.filterData.limit,
                                        page: this.state.filterData.page,
                                        onTableChange: (action, tableState) => {
                                            console.log(
                                                'trigg',
                                                action,
                                                tableState
                                            )
                                            switch (action) {
                                                case 'changePage':
                                                    this.setPage(
                                                        tableState.page
                                                    )
                                                    this.setState({ selected_id: [], selectedAll: false })
                                                    break
                                                case 'sort':
                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                    break
                                                default:
                                                    console.log(
                                                        'action not handled.'
                                                    )
                                            }
                                        },
                                    }}
                                ></LoonsTable>
                            ) : (
                                //load loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                        </Grid>


                        <Grid >
                            <Tooltip title="View">
                                <Button

                                    onClick={() =>
                                        this.setState({
                                            pickUpAllDialogView: true,
                                        })
                                    }
                                >
                                    Add Delivery
                                </Button>
                            </Tooltip>
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
                    onClose={() => {
                        this.setState({ conformingDialog: false })
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {'Conformation'}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you Sure to change status of this User?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="text"
                            onClick={() => {
                                this.setState({ conformingDialog: false })
                            }}
                            color="primary"
                        >
                            Disagree
                        </Button>
                        <Button
                            variant="text"
                            onClick={() => {
                                this.agreeToChangeStatus()
                            }}
                            color="primary"
                            autoFocus
                        >
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    maxWidth="lg "
                    open={
                        this.state.pickUpDialogView
                    } /* onClose={() => { this.setState({ pickUpDialogView: false }) }} */
                >
                    <MuiDialogTitle
                        disableTypography
                        className={classes.Dialogroot}
                    >
                        <CardTitle title="Select PickUp Person/Remarks " />
                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={() => {
                                this.setState({ pickUpDialogView: false })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        {/* <Admission patientDetails={this.state.selectedPatient}></Admission> */}
                        {/* <AddPickUpPerson id={this.state.selectedOrder ? this.state.selectedOrder.id : null} ></AddPickUpPerson> */}
                        <MSD_AddPickUpPerson
                            id={{ ...this.state.selectedOrder }}
                            onSuccess={() => {
                                this.setState(
                                    {
                                        pickUpDialogView: false,
                                    },
                                    () => {
                                        this.preLoadData()
                                    }
                                )
                            }}
                        ></MSD_AddPickUpPerson>
                    </div>
                </Dialog>

                <Dialog
                    maxWidth="lg "
                    open={
                        this.state.pickUpAllDialogView
                    } /* onClose={() => { this.setState({ pickUpDialogView: false }) }} */
                >
                    <MuiDialogTitle
                        disableTypography
                        className={classes.Dialogroot}
                    >
                        <CardTitle title="Select PickUp Person/Remarks " />
                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={() => {
                                this.setState({ pickUpAllDialogView: false })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        {/* <Admission patientDetails={this.state.selectedPatient}></Admission> */}
                        {/* <AddPickUpPerson id={this.state.selectedOrder ? this.state.selectedOrder.id : null} ></AddPickUpPerson> */}
                        <MSD_AddPickUpPerson
                            id={{ ...this.state.selected_id }}
                            type={"Bulk"}
                            onSuccess={() => {
                                this.setState(
                                    {
                                        pickUpAllDialogView: false,
                                    },
                                    () => {
                                        this.preLoadData()
                                    }
                                )
                            }}
                        ></MSD_AddPickUpPerson>
                    </div>
                </Dialog>
            </>
        )
    }
}

export default withStyles(styleSheet)(MDS_AddDeliveryDetails)
