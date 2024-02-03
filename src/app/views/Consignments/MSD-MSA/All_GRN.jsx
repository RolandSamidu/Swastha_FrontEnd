import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
    ValidatorFormExted
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
import PrintIcon from '@material-ui/icons/Print';



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
            printLoad:true,

            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            allGrnNumbers:[],

            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                search: null,
                'order[0]': ['updatedAt', 'DESC'],
                grn_no:null
            },
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
                                            //this.loadGRNItemsWithGrnID(this.state.data[dataIndex].id)
                                            this.setState({
                                            }, () => {
                                                window.location.href = `/consignments/grn-items/${this.state.data[dataIndex].id}`
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

                }
            ],
            alert: false,
            message: "",
            severity: 'success',
        }
    }


    async loadData() {
        this.setState({ loaded: false })

        //let login_user_pharmacy_drugs_stores = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let params = this.state.filterData;
        params.warehouse_id = this.state.selected_warehouse


        let res = await ConsignmentService.getGRN(params)
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
        }

    }

    async loadGrnNumber(e){

        let params = this.state.filterData;
        params.warehouse_id = this.state.selected_warehouse
        params.search = e

        let res = await ConsignmentService.getGRN(params)

        if (res.status === 200) {
            console.log('grn numbe',res.data.view.data)

            this.setState({
                allGrnNumbers:res.data.view.data
            })
        }
    }


    async loadWarehouses() {
        this.setState({ Loaded: false })
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


    componentDidMount() {
        this.loadWarehouses()
        // this.loadGrnNumber()

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
                            <Button
                                color='primary'
                                onClick={() => {
                                    this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                }}>
                                <ApartmentIcon />
                                {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}Change Warehouse
                            </Button>
                        </div>
                        {/*   <CardTitle title="All GRN" /> */}



                        <ValidatorForm onSubmit={() => { this.loadData() }}>
                            <Grid container spacing={1}>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={3}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="GRN Number" />
                                    <Autocomplete
                                        // disableClearable
                                        className="mb-1 w-full"
                                        options={this.state.allGrnNumbers}

                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData
                                                filterData.grn_no = value.grn_no

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

                                                    //let formData = this.state.formData;
                                                    //formData.examination_data[0].question = "Drug Allergies";
                                                    //formData.examination_data[0].answer = e.target.value
                                                    //this.setState({ formData })
                                                    if (e.target.value.length > 3) {
                                                        this.loadGrnNumber(e.target.value)
                                                    }

                                                }}

                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        className="mt-6"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                    >
                                        <span className="capitalize">Filter</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>


                        <ValidatorForm onSubmit={() => { this.setPage(0) }}>
                            <Grid container spacing={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                    
                                >
                                    {/* <SubTitle title="Search" > */}
                                    <TextValidator
                                        className=" w-full"
                                        placeholder="Search"
                                        name="invoice_no"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.filterData.search}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let filterData = this.state.filterData;
                                            filterData.search = e.target.value;
                                            this.setState({ filterData })

                                        }}
                                        // validators={['required']}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        className="mt-1"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                    >
                                        <span className="capitalize">Search</span>
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
                                                rowsPerPage: 20,
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

                


                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >

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
                </Dialog>

            </Fragment>
        );
    }
}

export default withStyles(styleSheet)(All_GRN)
