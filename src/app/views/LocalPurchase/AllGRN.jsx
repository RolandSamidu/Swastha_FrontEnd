import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle
} from "app/components/LoonsLabComponents";

import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import {
    CircularProgress, Grid, Tooltip, IconButton, Typography,
    Dialog,
    MuiDialogContent,
    MuiDialogActions,
    Divider,
} from "@material-ui/core";
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ReceiptIcon from '@material-ui/icons/Receipt';
import ConsignmentService from "app/services/ConsignmentService";
import WarehouseServices from "app/services/WarehouseServices";
import localStorageService from "app/services/localStorageService";
import CloseIcon from '@material-ui/icons/Close';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { dateParse } from "utils";
import PrintIcon from '@mui/icons-material/Print';
import GRNPrintView from './LPRequest/GRNPrintView'

import EmployeeServices from "app/services/EmployeeServices";
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import PharmacyService from "app/services/PharmacyService";
import InventoryService from "app/services/InventoryService";

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

class AllGRN extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            totalConsignment: 0,

            hospital: {},
            supplier: {},
            user: {},
            consignmentData: {},

            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            userRoles: [],

            printLoaded: false,
            grnData: [],

            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },
            data: [],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]
                            let grn_id = this.state.data[dataIndex]?.id;
                            let owner_id = this.state.data[dataIndex]?.owner_id;
                            let supplier_id = this.state.data[dataIndex]?.Consignment?.supplier_id;

                            return (
                                <Grid className="px-2">
                                    <IconButton
                                        onClick={() => {
                                            // window.location.href = `/spc/consignment/addDetails/${id}`
                                            console.log("selected GRN", this.state.data[dataIndex])
                                            //this.loadGRNItemsWithGrnID(this.state.data[dataIndex].id)
                                            this.setState({
                                            }, () => {
                                                window.location.href = `/localpurchase/grn-items/${this.state.data[dataIndex].id}`
                                            })
                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                    <Tooltip title="Print Data">
                                        <IconButton
                                            onClick={() => {
                                                this.setState({
                                                    consignmentData: data
                                                }, () => {
                                                    this.printData(grn_id, owner_id, supplier_id)
                                                })
                                            }}
                                        >
                                            <PrintIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
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


                // {
                //     name: 'status',
                //     label: 'AD Status',
                //     options: {
                //         //filter: true,
                //         display: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let status = this.state.data[dataIndex]?.status;
                //             if (status == "APPROVED COMPLETED") {
                //                 return "APPROVED"
                //             } else if (status == "COMPLETED") {
                //                 return "PENDING"
                //             } else if (status == "REJECTED") {
                //                 return "REJECTED"
                //             } else if (status == "APPROVED PARTIALLY COMPLETED") {
                //                 return "APPROVED"
                //             } else if (status == "Pending") {
                //                 return "PENDING"
                //             } else if (status == "Active") {
                //                 return "PROCESSING"
                //             } else if (status == "CANCELLED") {
                //                 return "NOT ADDED"
                //             }
                //         }
                //     },

                // }
            ],
            alert: false,
            message: "",
            severity: 'success',
        }

        this.printData = this.printData.bind(this)
    }

    async getHospital(owner_id) {
        let params = { issuance_type: 'Hospital' }
        let durgStore_res = await PharmacyService.fetchAllDataStorePharmacy(owner_id, params)
        if (durgStore_res.status == 200) {
            console.log('hospital', durgStore_res.data.view.data)
            this.setState({ hospital: durgStore_res?.data?.view?.data[0] })
        }
    }

    async getSupplier(id) {
        if (id) {
            let supplier_res = await HospitalConfigServices.getAllSupplierByID(id)
            if (supplier_res.status == 200) {
                console.log('supplier', supplier_res.data.view)
                this.setState({ supplier: supplier_res?.data?.view })
            }
        }
    }

    async getUser() {
        let id = await localStorageService.getItem('userInfo').id
        if (id) {
            let user_res = await EmployeeServices.getEmployeeByID(id)
            if (user_res.status == 200) {
                console.log('User', user_res.data.view)
                this.setState({ user: user_res?.data?.view })
            }
        }
    }

    async printData(grn_id, owner_id, supplier_id) {
        this.setState({ printLoaded: false })
        console.log('clicked', grn_id)

        let res = await ConsignmentService.getGRNItems({ grn_id: grn_id })

        if (res.status === 200) {
            console.log("GRN Items :", res.data.view.data)
            await this.getHospital(owner_id)
            await this.getSupplier(supplier_id)
            await this.getUser()
            await this.getUOMByID(res.data.view.data)
            // this.setState(
            //     {
            //         printLoaded: true,
            //         grnData: res.data.view.data,
            //         // totalItems: res.data.view.totalItems,
            //     },
            //     () => {
            //         // this.render()
            //         document.getElementById("grn_print_view").click()
            //         // this.getCartItems()
            //     }
            // )
            // console.log('Print Data', this.state.printData)
        }
    }

    async getUOMByID(data){
        // console.log('item-sssssssssssss----data', data)
        let id = data?.map((e)=>e?.ItemSnapBatch?.ItemSnap?.id)

        let params={
            item_id:id
        }

        const res = await InventoryService.GetUomById(params)

        let updatedArray = []
        if(res.status === 200) {
            console.log('item-----data', res)

            updatedArray = data?.filter((obj1) => {
                const obj2 = res.data.view.data.find((obj) => obj.ItemSnap?.id === obj1.ItemSnapBatch?.ItemSnap?.id);

                obj1.uom = obj2?.UOM?.name

                 return obj1;

            });
            data = updatedArray;
            console.log('item-sssssssssssss----data', data)
            this.setState({
                printLoaded: true,
                grnData: data,
            },
            () => {
                // this.render()
                document.getElementById('grn_print_view').click()
                // this.getCartItems()
            })
            
        }
        // this.setState({ showLoading: true });

        setTimeout(() => {
            this.setState({ printLoaded: false, });
        }, 5000);
    }


    async loadData() {
        this.setState({ loaded: false })

        //let login_user_pharmacy_drugs_stores = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let owner_id = await localStorageService.getItem('owner_id')
        // let params = this.state.filterData;
        // params.warehouse_id = this.state.selected_warehouse
        // params.owner_id = owner_id

        let res = await ConsignmentService.getGRN({ ...this.state.filterData, warehouse_id: this.state.selected_warehouse, owner_id: owner_id, type: ["Consignment GRN", "Donation GRN"] })
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


    async componentDidMount() {
        let role = await localStorageService.getItem('userInfo').roles
        this.setState({
            userRoles: role
        }, () => {
            if (this.state.userRoles.includes('Drug Store Keeper')) {
                this.loadWarehouses()
            } else {
                this.loadData()
            }
        })

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
                            {this.state.userRoles.includes('Drug Store Keeper') &&
                                <Button
                                    color='primary'
                                    onClick={() => {
                                        this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                    }}>
                                    <ApartmentIcon />
                                    {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}Change Warehouse
                                </Button>
                            }
                        </div>
                        <Divider className="mt-2" />
                        {/*   <CardTitle title="All GRN" /> */}
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
                                                rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break;
                                                        case 'changeRowsPerPage':
                                                            let formaData = this.state.filterData;
                                                            formaData.limit = tableState.rowsPerPage;
                                                            this.setState({ formaData })
                                                            this.setPage(0)
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
                        <Grid>
                            {this.state.printLoaded &&
                                <GRNPrintView consignmentData={this.state.consignmentData} grnData={this.state.grnData} hospital={this.state.hospital} supplier={this.state.supplier} user={this.state.user} />
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

export default withStyles(styleSheet)(AllGRN)
