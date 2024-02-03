import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle
} from "../../../components/LoonsLabComponents";

import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
    CircularProgress, Grid, Tooltip, IconButton, Typography,
    Dialog,
    MuiDialogContent,
    MuiDialogActions,
} from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ReceiptIcon from '@material-ui/icons/Receipt';
import ConsignmentService from "../../../services/ConsignmentService";
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import CloseIcon from '@material-ui/icons/Close';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { dateParse } from "utils";
import LoonsDatePicker from 'app/components/LoonsLabComponents/DatePicker'

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

    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },


    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})

class All_GRN extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            totalConsignment: 0,
            loginUserRole: null,

            allwarehoses: [],
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],

            totalItems: 0,
            filterData: {
                type: ['Donation GRN', 'Consignment GRN'],
                limit: 20,
                page: 0,
                status: [{ label: 'Completed', value: "COMPLETED" }, { label: 'Partially Completed', value: "PARTIALLY COMPLETED" }],
                'order[0]': ['updatedAt', 'DESC'],
                owner_id: '000',
                grn_no: null,
                search: null
            },
            allGrnNumbers: null,
            data: [],

            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let id = this.state.data[dataIndex];

                            return (
                                <Grid className="px-2">
                                    <IconButton
                                        onClick={() => {
                                            // window.location.href = `/spc/consignment/addDetails/${id}`
                                            console.log("selected GRN", this.state.data[dataIndex])
                                            console.log("passedid", this.state.data[dataIndex].id)
                                            //this.loadGRNItemsWithGrnID(this.state.data[dataIndex].id)
                                            this.setState({
                                            }, () => {
                                                if (this.state.loginUserRole.includes('HSCO')) {
                                                    window.location.href = ` /consignments/grn-items/${this.state.data[dataIndex].id}`

                                                } else {
                                                    window.location.href = `/consignments/msdAd/grn-items/${this.state.data[dataIndex].id}`
                                                }

                                            })
                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                </Grid>
                            )

                        },
                    },

                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.type
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'grn_no',
                    label: 'GRN No',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.grn_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'order_no',
                    label: 'Order No',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Consignment?.order_no;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'invoice_no',
                    label: 'Invoice No',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.Consignment?.invoice_no;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Warehouse',
                    label: 'Warehouse',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let warehouse_id = this.state.data[dataIndex]?.warehouse_id;
                            let data = "";
                            if (warehouse_id) {
                                data = this.state.allwarehoses.find((x) => x.id == warehouse_id)?.name
                            }
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'status',
                    label: 'GRN Status',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let status = this.state.data[dataIndex]?.status;
                            if (status == "APPROVED COMPLETED") {
                                return "COMPLETED"
                            } else if (status == "COMPLETED") {
                                return "COMPLETED"
                            } else if (status == "REJECTED") {
                                return "REJECTED"
                            } else if (status == "APPROVED PARTIALLY COMPLETED") {
                                return "PARTIALLY COMPLETED"
                            } else if (status == "Pending") {
                                return "PENDING"
                            } else if (status == "Active") {
                                return "PROCESSING"
                            } else if (status == "CANCELLED") {
                                return "CANCELLED"
                            }

                        }
                    },

                },


                {
                    name: 'status',
                    label: 'AD Status',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let status = this.state.data[dataIndex]?.status;
                            if (status == "APPROVED COMPLETED") {
                                return "APPROVED"
                            } else if (status == "COMPLETED") {
                                return "PENDING"
                            } else if (status == "REJECTED") {
                                return "REJECTED"
                            } else if (status == "APPROVED PARTIALLY COMPLETED") {
                                return "APPROVED"
                            } else if (status == "Pending") {
                                return "PENDING"
                            } else if (status == "Active") {
                                return "PROCESSING"
                            } else if (status == "CANCELLED") {
                                return "NOT ADDED"
                            }


                        }
                    },

                },
            ],
            alert: false,
            message: "",
            severity: 'success',
        }
    }


    async loadGrnNumber() {

        let filterData = { ...this.state.filterData }
        let status = this.state.filterData?.status?.map((x) => x.value)
        filterData.status = status
        console.log('filtergsgssssssgsggsgs', filterData)

        let res = await ConsignmentService.getGRN(filterData)

        if (res.status === 200) {
            console.log('grn numbe', res.data.view.data)

            this.setState({
                allGrnNumbers: res.data.view.data
            })
        }
    }


    async loadData() {
        this.setState({ loaded: false })
        let filterData = { ...this.state.filterData }
        let status = this.state.filterData?.status?.map((x) => x.value)
        filterData.status = status
        let userRoles = await localStorageService.getItem('userInfo').roles
        this.setState({
            loginUserRole: userRoles
        })
        // /filterData.type = 
        //let login_user_pharmacy_drugs_stores = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        // params.warehouse_id = this.state.selected_warehouse
        let res = await ConsignmentService.getGRN(filterData)
        if (res.status == 200) {
            this.setState(
                {
                    loaded: true,
                    data: res.data.view.data,
                    totalPages: res.data.view.totalPages,
                    totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        } else {
            this.setState(
                {
                    loaded: true,
                    data: []
                },
                () => {
                    this.render()
                }
            )

        }

    }


    async loadWarehouses() {
        this.setState({ Loaded: false })
        var user = await localStorageService.getItem('userInfo');
        console.log('user', user)
        var id = user.id;
        var all_pharmacy_dummy = [];
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse');
        console.log('selected_warehouse_cache', selected_warehouse_cache)
        if (!selected_warehouse_cache) {
            this.setState({ dialog_for_select_warehouse: true })
        }
        else {
            // this.state.genOrder.created_by = id
            // this.state.genOrder.warehouse_id = selected_warehouse_cache.id
            // this.state.getCartItems.warehouse_id = selected_warehouse_cache.id
            // this.state.suggestedWareHouses.warehouse_id = selected_warehouse_cache.id
            // this.state.formData.owner_id = selected_warehouse_cache.owner_id
            this.setState({
                owner_id: selected_warehouse_cache.owner_id,
                selected_warehouse: selected_warehouse_cache.id,
                dialog_for_select_warehouse: false,
                warehouseSelectDone: true
            }, () => {
                this.loadData();
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
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy, Loaded: true })
        }
    }


    async loadAllWarehouses() {
        //allwarehoses
        var owner_id = await localStorageService.getItem('owner_id');
        let params = {}
        let warehouse = await WarehouseServices.getWarehoureWithOwnerId(owner_id, params)
        if (warehouse.status == 200) {
            this.setState({ allwarehoses: warehouse.data.view.data })
        }

    }

    componentDidMount() {
        // this.loadWarehouses()
        this.loadAllWarehouses()
        this.loadData()
        this.loadGrnNumber()

    }

    handleFilterSubmit = (val) => {
        this.loadData()
    }




    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" className="font-semibold"> All GRN </Typography>

                        </div>
                        {/*   <CardTitle title="All GRN" /> */}

                        <ValidatorForm className="pt-2"
                            onSubmit={() => this.setPage(0)}
                            onError={() => null}
                        >
                            <Grid container spacing={1}>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle
                                        title={
                                            'Status'
                                        }
                                    ></SubTitle>
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.status_grn}
                                        value={this.state.filterData.status}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                // let formData = this.state.formData;
                                                let filterData = this.state.filterData;
                                                filterData.status = []
                                                value.forEach(element => {
                                                    filterData.status.push(element)
                                                });
                                                //formData.uoms = value.id
                                                this.setState({ filterData })

                                            }

                                        }}

                                        multiple
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Status"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle
                                        title={
                                            'Warehouse'
                                        }
                                    ></SubTitle>
                                    <Autocomplete

                                        className="w-full"
                                        options={this.state.allwarehoses}
                                        onChange={(event, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData;
                                                filterData.warehouse_id = value.id;

                                                this.setState({
                                                    filterData,
                                                })

                                            } else if (value == null) {
                                                let filterData = this.state.filterData;
                                                filterData.warehouse_id = null;
                                                this.setState({
                                                    filterData,
                                                })
                                            }
                                        }}


                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Warehouse"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle
                                        title={
                                            'Type'
                                        }
                                    ></SubTitle>
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={appConst.type_grn}
                                        onChange={(event, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData;
                                                filterData.type = value.value;

                                                console.log('SR no', filterData)
                                                this.setState({
                                                    filterData,

                                                })

                                            } else if (value == null) {
                                                let filterData = this.state.filterData;
                                                filterData.type = null;
                                                this.setState({
                                                    filterData,
                                                    // srNo:false
                                                })
                                            }
                                        }}


                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Type"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="From" />
                                    <LoonsDatePicker
                                        className="w-full"
                                        value={this.state.filterData.from}
                                        placeholder="From"
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        // required={!this.state.date_selection}
                                        // disabled={this.state.date_selection}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let filterData = this.state.filterData
                                            filterData.from = date
                                            this.setState({ filterData })
                                        }}
                                    />

                                </Grid>
                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                    <SubTitle title="To" />
                                    <LoonsDatePicker
                                        className="w-full"
                                        value={this.state.filterData.to}
                                        placeholder="to"
                                        // minDate={new Date()}

                                        //maxDate={new Date()}
                                        // required={!this.state.date_selection}
                                        // disabled={this.state.date_selection}
                                        errorMessages="this field is required"
                                        onChange={(date) => {
                                            let filterData = this.state.filterData
                                            filterData.to = date
                                            this.setState({ filterData })
                                        }}
                                    />

                                </Grid>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="GRN Number" />
                                    <TextValidator
                                    className="w-full"
                                    placeholder="GRN Number"
                                    fullWidth="fullWidth"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.filterData.grn_no}
                                    onChange={(e, value) => {
                                        let filterData = this.state.filterData
                                        if (e.target.value != '') {
                                            filterData.grn_no = e.target.value
                                        } else {
                                            filterData.grn_no = null
                                        }
                                        this.setState({ filterData })
                                      
                                    }}
                                   
                                    /* validators={[
                                    'required',
                                    ]}
                                    errorMessages={[
                                    'this field is required',
                                    ]} */
                                 
                                />
                                    {/* <Autocomplete
                                        // disableClearable
                                        className="mb-1 w-full"
                                        options={this.state.allGrnNumbers}

                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData;
                                                filterData.grn_no = value.grn_no;

                                                this.setState({
                                                    filterData
                                                })

                                            }
                                        }}

                                        getOptionLabel={(option) => option.grn_no}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="GRN Number"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    console.log("as", e.target.value)

                                                    let filterData = this.state.filterData;
                                                    filterData.grn_no = e.target.value;

                                                    this.setState({
                                                        filterData
                                                    })

                                                }}

                                            />
                                        )}
                                    /> */}
                                </Grid>



                                <Grid className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}>
                                <SubTitle title="Search" />
                                <TextValidator
                                    className="w-full"
                                    placeholder="Search"
                                    fullWidth="fullWidth"
                                    variant="outlined"
                                    size="small"
                                    value={this.state.filterData.search}
                                    onChange={(e, value) => {
                                        let filterData = this.state.filterData
                                        if (e.target.value != '') {
                                            filterData.search = e.target.value
                                        } else {
                                            filterData.search = null
                                        }
                                        this.setState({ filterData })
                                      
                                    }}
                                   
                                    /* validators={[
                                    'required',
                                    ]}
                                    errorMessages={[
                                    'this field is required',
                                    ]} */
                                 
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
                                    // startIcon="search"
                                    >
                                        <span className="capitalize">Filter</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>

                        <Grid lg={12} className=" w-full mt-2" spacing={2} style={{ marginTop: 20 }}>

                            {
                                this.state.loaded ?
                                    <div className="pt-0">
                                        <LoonsTable
                                            id={"GRN_items"}
                                            data={this.state.data}
                                            columns={this.state.columns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: this.state.filterData.limit,
                                                page: this.state.filterData.page,

                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break;
                                                        case 'sort':
                                                            break;
                                                        default:
                                                            console.log('action not handled.');
                                                    }
                                                }

                                            }
                                            }
                                        >
                                        </LoonsTable>
                                    </div>
                                    :
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                            }
                        </Grid>
                    </LoonsCard>
                </MainContainer>


                {/* <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>



                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            className="w-full"
                        >
                            <Autocomplete
                                        disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.state.owner_id = value.owner_id
                                        this.setState({ owner_id: value.owner_id, selected_warehouse: value.id, dialog_for_select_warehouse: false, Loaded: true }, () => { this.loadData() })
                                        localStorageService.setItem('Selected_Warehouse', value);
                                        // this.loadData()
                                    }
                                }}
                                value={{
                                    name: this.state.selected_warehouse ? (this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse).name) : null,
                                    id: this.state.selected_warehouse
                                }}
                                getOptionLabel={(option) => option.name != null ? option.name + " - " + option.main_or_personal : null}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                )}
                            />

                        </ValidatorForm>
                    </div>
                </Dialog> */}

            </Fragment>
        );
    }
}

export default withStyles(styleSheet)(All_GRN) 
