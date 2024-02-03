import React, { Component, Fragment } from "react";
import MainContainer from "../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../components/LoonsLabComponents/CardTitle";
import LoonsCard from "../../components/LoonsLabComponents/LoonsCard";
import { CircularProgress, Divider, Grid, Icon, IconButton, InputAdornment, Tooltip, Typography } from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Button, DatePicker, LoonsTable, LoonsSnackbar, } from "app/components/LoonsLabComponents";
import SubTitle from "../../components/LoonsLabComponents/SubTitle";
import Paper from '@material-ui/core/Paper';
import { Autocomplete } from "@mui/material";
import { Dialog } from "@mui/material";
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import DonarService from '../../services/DonarService'

import VisibilityIcon from '@material-ui/icons/Visibility'

import localStorageService from 'app/services/localStorageService'
import EmployeeServices from 'app/services/EmployeeServices'
import InventoryService from 'app/services/InventoryService'
import ChiefPharmacistServices from "app/services/ChiefPharmacistServices";
import WarehouseServices from 'app/services/WarehouseServices';

import { withStyles } from '@material-ui/core/styles'
import { dateParse } from "utils";
import * as appConst from '../../../appconst'

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

class OrderConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //snackbar
            alert: false,
            message: '',
            severity: 'success',
            warehouse_type_dis: true,
            order_type_dis: true,
            newOrderConfig: false,
            classes: styleSheet,
            loading: true,
            sr_no: [],
            all_Warehouses: [],
            all_Warehouses2: [],
            from_warehouse: [],
            totalItems: 0,
            formData: {
                from_warehouse_id: null,
                to_warehouse_id: null,
                type: 'Approve',
                order_type: null,
                approval_user: null,
                owner_id: null,
            },
            empData: [],
            allDonorData: [],
            donarName: [],
            // totalItems: 0,
            filterData: {
                order_type: null,
                to_warehouse_id: null,
                from_warehouse_id: null,
                owner_id: null,
                limit: 20,
                page: 0,
                'sr_no[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            columns: [
                {
                    name: 'order_type', // field name in the row object
                    label: 'Order Type', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                    },
                },
                {
                    name: 'name', // field name in the row object
                    label: 'From warehouse', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.fromStore?.name

                        },
                    },
                },
                {
                    name: 'country', // field name in the row object
                    label: 'Donor Country', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.toStore?.name
                        },
                    },
                },
                //     {
                //         name: 'description', // field name in the row object
                //         label: 'Description', // column title that will be shown in table
                //         options: {
                //             filter: true,
                //             display: true,
                //             width: 10,
                //         },
                //     },
                //     {
                //         name: 'delivery_date', // field name in the row object
                //         label: 'Delivery Date', // column title that will be shown in table
                //         options: {
                //             filter: true,
                //             display: true,
                //             width: 10,
                //             customBodyRender: (value, tableMeta, updateValue) => {
                //                 return dateParse(value)
                //             },
                //         },
                //     },
                //     {
                //         name: 'delivery_person', // field name in the row object
                //         label: 'Delivery Person', // column title that will be shown in table
                //         options: {
                //             filter: true,
                //             display: true,
                //             width: 10,
                //         },
                //     },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        width: 10,
                        // customBodyRenderLite: (dataIndex) => {
                        //     let status = this.state.data[dataIndex]?.status
                        //     // 'Approve'
                        //     // 
                        //     if(status === 'Active'){
                        //         // let status2 
                        //         return 'To Be Approved'
                        //     }
                        //     else if (status === 'Approve')
                        //     {
                        //         return 'Submitted to HSCO'  
                        //     }
                        //     else if(status === 'Approved'){
                        //         return 'Approved'  
                        //     }
                        //     // return dateParse(value)
                        // },
                    },
                },
                //     {
                //         name: 'action',
                //         label: 'Action',
                //         options: {
                //             customBodyRenderLite: (dataIndex) => {
                //                 let id = this.state.data[dataIndex].id
                //             //     let donar_id = this.state.data[dataIndex]?.Don.id
                //                 // [dataIndex]?.Donor?.id
                //                 return (
                //                     <Grid className="flex items-center">
                //                         {/* <Tooltip title="Edit">
                //                             <IconButton> */}
                //                                 {/* <Button color="primary"> */}

                //                                 {/* {status} */}
                //                                 {/* </Button>
                //                             </IconButton>
                //                         </Tooltip> */}
                //                         <IconButton
                //                             onClick={() => {
                //                               //   window.location.href = `/donation/view-donation-items/${id}`
                //                             }}
                //                             className="px-2"
                //                             size="small"
                //                             aria-label="View Item"
                //                         >
                //                             <VisibilityIcon />
                //                         </IconButton>
                //                     </Grid>
                //                 )
                //             },
                //         },
                //     },
            ],
            // totalItems: 0,
            pending: 0,
        }
    }
    componentDidMount() {
        this.LoadData()
        this.allWarehouses()
    }
    async LoadData() {
        this.setState({ loading: false })
        let owner_id = await localStorageService.getItem('owner_id')
        let filterData = this.state.filterData;
        filterData.owner_id = owner_id;

        let res = await ChiefPharmacistServices.getAllOrdersApprovalConfig(filterData)
        if (res.status == 200) {
            this.setState({
                data: res.data.view.data,
                totalItems: res.data.view.totalItems,
                loading: true
            })
        }
    }
    async loadItemWarehouse(label) {
        let owner_id = null
        let params = {}
        if (label === 'drug_store' || label === 'Pharmacy') {
            owner_id = await localStorageService.getItem("owner_id")
            params = {
                // warehouser_search_type :label,
                store_type: label,
                //limit: 20,
                //page: 0,
            }
        } else {
            params = {
                warehouser_search_type: label,
                // store_type :label,
               // limit: 20,
                //page: 0,
            }
        }

        // let params ={
        //     warehouser_search_type :label,
        //     store_type :label,
        //     limit: 20,
        //     page: 0,
        // }
        let res = await WarehouseServices.getAllWarehousewithOwner(params, owner_id)
        if (res.status == 200) {

            this.setState({
                all_Warehouses: res.data.view.data,
            }, () => {
                console.log('warehouses', this.state.all_Warehouses)
            })

        }
    }
    async allWarehouses() {
        let owner_id = null
        let params = {
            //     warehouser_search_type :label,
            //   limit: 20,
            //   page: 0,
        }
        let res = await WarehouseServices.getAllWarehousewithOwner(params, owner_id)
        if (res.status == 200) {

            this.setState({
                all_Warehouses2: res.data.view.data,
            }, () => {
                console.log('warehouses', this.state.all_Warehouses)
            })

        }
    }
    async loadFromWarehouse(label) {
        let owner_id = await localStorageService.getItem("owner_id")
        let params = {
            type: label,
            //   limit: 20,
            //   page: 0,
        }
        let res = await WarehouseServices.getAllWarehousewithOwner(params, owner_id)
        if (res.status == 200) {

            this.setState({
                from_warehouse: res.data.view.data,
            }, () => {
                console.log('warehouses', this.state.all_Warehouses)
            })

        }
    }
    async createApprovalConfig() {
        let formData = this.state.formData
        formData.owner_id = await localStorageService.getItem("owner_id")
        console.log('formData', formData)
        let res = await ChiefPharmacistServices.createApprovalConfig(formData)
        if (201 == res.status) {

            this.setState({
                //    res:res.data.posted.data.id,
                alert: true,
                message: 'Config Created Successfuly',
                severity: 'success',
                resloaded: true,
            }, () => {
                window.location.reload()
                //   console.log('ress',res)
                //   window.location.href = `/donation/donation-registration-note/${this.state.res}`
            })
        } else {
            this.setState({
                alert: true,
                message: 'Config Creation was Unsuccessful',
                severity: 'error',
            })
        }
    }



    render() {
        const { classes } = this.props
        return (
            <MainContainer>
                <LoonsCard>
                    <CardTitle title="View Order Configuration" />

                    <Grid item lg={12} className=" w-full mt-2">
                        <ValidatorForm
                            className="pt-2"
                            ref={'outer-form'}
                            onSubmit={() => null}
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
                                    <SubTitle title="Type" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.order_type}
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData;
                                                filterData.order_type = value.label;
                                                //   this.loadItemWarehouse(value.label)
                                                console.log('SR no', filterData)
                                                this.setState({
                                                    filterData,
                                                })
                                            }
                                        }}
                                        getOptionLabel={(option) =>
                                            option.label
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Type"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            //   onChange={(e) => {
                                            //       console.log("as", e.target.value)
                                            //       if (e.target.value.length > 4) {
                                            //           this.loadAllItems(e.target.value)
                                            //       }
                                            //   }}
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
                                    <SubTitle title="From Warehouse" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={
                                            this.state.all_Warehouses2
                                        }
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData
                                                filterData.from_warehouse_id = value.id
                                                this.setState(
                                                    {
                                                        filterData
                                                    }
                                                )
                                            }
                                        }}
                                        getOptionLabel={(option) =>
                                            option.name
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="From Warehouse"
                                                fullWidth
                                                variant="outlined"
                                                size="small"

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
                                    <SubTitle title="To Warehouse" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={
                                            this.state.all_Warehouses2
                                        }
                                        onChange={(e, value) => {
                                            if (null != value) {
                                                let filterData = this.state.filterData
                                                filterData.to_warehouse_id = value.id
                                                this.setState(
                                                    {
                                                        filterData
                                                    }
                                                )
                                            }
                                        }}
                                        getOptionLabel={(option) =>
                                            option.name
                                        }
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="To Warehouse"
                                                fullWidth
                                                variant="outlined"
                                                size="small"

                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid
                                    className=" w-full flex-end mt-1"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-5 flex-end"
                                        progress={false}
                                        // onClick={() => {
                                        //     window.open('/estimation/all-estimation-items');
                                        // }}
                                        color="primary" style={{ fontWeight: 'bold', marginTop: -3 }}
                                        type="submit"
                                        scrollToTop={true}
                                        startIcon="search"
                                    >
                                        <span className="capitalize">Filter</span>
                                    </Button>
                                </Grid>
                                <Grid container={2}>
                                    <Grid item
                                        lg={4}
                                        md={2}
                                        sm={12}
                                        xs={12}
                                        justify="flex-start">
                                        <Button
                                            className="mt-6 justify-end"
                                            progress={false}
                                            scrollToTop={true}

                                            onClick={() => {
                                                //     window.location.href = `/donation/donation-registration-note/${this.props.match.params.id}`
                                                this.setState({
                                                    newOrderConfig: true
                                                })
                                            }}
                                        >
                                            <span className="capitalize"> Create New</span>
                                        </Button>
                                    </Grid>
                                </Grid>



                            </Grid>
                        </ValidatorForm>
                    </Grid>

                    <Grid className=" w-full" spacing={1} style={{ marginTop: 20, backgroundColor: 'red' }}>
                        <Paper elevation={0} square
                            style={{ backgroundColor: '#E6F6FE', border: '1px solid #DEECF3', height: 40 }}>
                            <Grid item lg={12} className=" w-full mt-2">
                                <Grid container spacing={1} className="flex">
                                    <Grid className="flex"
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                        spacing={2}
                                        justify="space-between"
                                        style={{ marginLeft: 10, paddingLeft: 30, paddingRight: 50 }}>

                                        <SubTitle title={`Total Items to be approved: ${this.state.totalItems}`} />
                                        {/* <SubTitle title={`Pending: ${this.state.pending}`} /> */}
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>

                    <ValidatorForm>
                        {/* Table Section */}
                        <Grid container="container" className="mt-3 pb-5">
                            <Grid item="item" lg={12} md={12} sm={12} xs={12}>
                                {this.state.loading ? (
                                    <LoonsTable
                                        //title={"All Aptitute Tests"}
                                        id={'allAptitute'}
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            rowsPerPage: 10,
                                            page: this.state.page,
                                            onTableChange: (
                                                action,
                                                tableState
                                            ) => {
                                                console.log(action, tableState)
                                                switch (action) {
                                                    case 'changePage':
                                                        // this.setPage(     tableState.page )
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
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                    </ValidatorForm>

                    <Dialog fullWidth maxWidth="sm" open={this.state.newOrderConfig} >
                        <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                            <CardTitle title="New Order Config" />
                            <IconButton aria-label="close" className={classes.closeButton}
                                onClick={() => {
                                    this.setState({
                                        newOrderConfig: false
                                    })
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </MuiDialogTitle>
                        <div className="w-full h-full px-5 py-5">
                            <ValidatorForm
                                //   className="pt-2"
                                ref={'outer-form'}
                                onSubmit={() => this.createApprovalConfig()}
                                onError={() => null}
                            >
                                <Grid container={2}>
                                    <Grid
                                        className="w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Order Type" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.order_type}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let formData = this.state.formData;
                                                    formData.order_type = value.label;
                                                    this.loadFromWarehouse(value.label)
                                                    //   console.log('SR no',formData)
                                                    this.setState({
                                                        order_type_dis: false
                                                        // formData,
                                                    })
                                                }
                                                if (null == value) {
                                                    this.setState({
                                                        order_type_dis: true
                                                        // formData,
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Order Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"

                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className="w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="From Warehouse" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={
                                                this.state.from_warehouse
                                            }
                                            disabled={this.state.order_type_dis}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let formData = this.state.formData
                                                    formData.from_warehouse_id = value.id
                                                    this.setState(
                                                        {
                                                            formData
                                                        }
                                                    )
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="From Warehouse"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"

                                                />
                                            )}
                                        />
                                    </Grid>


                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Warehouse Type" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.warehouse_types2}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    //   let formData = this.state.formData;
                                                    //   formData.warehouse_type = value.value;
                                                    this.loadItemWarehouse(value.value)
                                                    //   console.log('SR no',formData)
                                                    this.setState({
                                                        warehouse_type_dis: false
                                                        // formData,
                                                    })
                                                }
                                                if (null == value) {
                                                    this.setState({
                                                        warehouse_type_dis: true
                                                        // formData,
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Warehouse Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                //   onChange={(e) => {
                                                //       console.log("as", e.target.value)
                                                //       if (e.target.value.length > 4) {
                                                //           this.loadAllItems(e.target.value)
                                                //       }
                                                //   }}
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="To Warehouse" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={
                                                this.state.all_Warehouses
                                            }
                                            disabled={this.state.warehouse_type_dis}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let formData = this.state.formData
                                                    formData.to_warehouse_id = value.id
                                                    this.setState(
                                                        {
                                                            formData
                                                        }
                                                    )
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                option.name
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="To Warehouse"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"

                                                />
                                            )}
                                        />
                                    </Grid>


                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid
                                        className=" w-full"
                                        item
                                        lg={6}
                                        md={6}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Approval User Type" />
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appConst.approval_users}
                                            onChange={(e, value) => {
                                                if (null != value) {
                                                    let formData = this.state.formData;
                                                    formData.approval_user = value.label;
                                                    //   this.loadItemWarehouse(value.label)
                                                    //   console.log('SR no',formData)
                                                    this.setState({
                                                        formData,
                                                    })
                                                }
                                            }}
                                            getOptionLabel={(option) =>
                                                option.label
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Approval User Type"
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                //   onChange={(e) => {
                                                //       console.log("as", e.target.value)
                                                //       if (e.target.value.length > 4) {
                                                //           this.loadAllItems(e.target.value)
                                                //       }
                                                //   }}
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item
                                    lg={4}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                    justify="flex-start">
                                    <Button
                                        className="mt-6 justify-end"
                                        progress={false}
                                        scrollToTop={true}

                                        onClick={() => {
                                            this.createApprovalConfig()
                                            //     window.location.href = `/donation/donation-registration-note/${this.props.match.params.id}`
                                            // this.setState({
                                            //       newOrderConfig:true
                                            // })
                                        }}
                                    >
                                        <span className="capitalize"> Create</span>
                                    </Button>
                                </Grid>

                                {/* <Grid container={2}>


 
                                    </Grid> */}


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
                </LoonsCard >
            </MainContainer >
        )
    }
}

export default withStyles(styleSheet)(OrderConfig)
