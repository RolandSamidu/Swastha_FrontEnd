import React, { Component, Fragment } from "react";
import {
    Button,
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsTable,
    MainContainer,
    SubTitle,
    ValidatorForm,
    LoonsSnackbar
} from "../../../components/LoonsLabComponents";
import {
    CircularProgress, Grid, Tooltip, IconButton, Typography,
    Dialog,
    MuiDialogContent,
    MuiDialogActions,
} from "@material-ui/core";

import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { TextValidator } from 'react-material-ui-form-validator'
import { Autocomplete } from "@material-ui/lab";
import * as appConst from "../../../../appconst";
import Paper from "@material-ui/core/Paper";
import Buttons from "@material-ui/core/Button";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ReceiptIcon from '@material-ui/icons/Receipt';
import ConsignmentService from "../../../services/ConsignmentService";
import localStorageService from "app/services/localStorageService";
import WarehouseServices from "app/services/WarehouseServices";

import CloseIcon from '@material-ui/icons/Close';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import ApartmentIcon from '@material-ui/icons/Apartment';
import { dateParse } from "utils";
import AddIcon from '@mui/icons-material/Add';

import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';




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


class Unallocated_GRN_Items extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: true,
            totalConsignment: 0,

            submitting_process:false,
            selected_warehouse: null,
            owner_id: null,
            dialog_for_select_warehouse: false,
            all_warehouse_loaded: [],
            dialog_for_less_qty: false,

            totalItems: 0,
            filterData: {
                limit: 20,
                page: 0,
                qty_grater_than_zero:true,
                type: ['Consignment GRN', 'Donation GRN'],
                status: ['Pending', 'Active'],
                'order[0]': ['updatedAt', 'DESC'],
                grn_status: ["APPROVED PARTIALLY COMPLETED", "APPROVED COMPLETED"]
            },
            data: [],
            selected_item: null,
            remaining_qty: 0,
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            // let id = this.state.data.ConsignmentItems[dataIndex].item_schedule.id;
                            //  console.log("aaa", this.state.data.ConsignmentItems[dataIndex])
                            return (
                                <Grid className="px-2">
                                    <IconButton
                                        onClick={() => {
                                            // window.location.href = `/spc/consignment/addDetails/${id}`
                                            console.log("selected Item", this.state.data[dataIndex])
                                            this.loadWarehouseBin()
                                            this.setState({
                                                batchView: true,
                                                selected_item: this.state.data[dataIndex],
                                                // selectedConsignmentItem: id
                                            }, () => {
                                                // this.loadConsignmentItemsById(this.state.data.ConsignmentItems[dataIndex].id)
                                            })
                                        }}>
                                        <AddIcon color='primary' fontSize='medium' />
                                    </IconButton>
                                </Grid>
                            )

                        },
                    },

                },
                {
                    name: 'GrnNo', // field name in the row object
                    label: 'GRN No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.GRN?.grn_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'srNo', // field name in the row object
                    label: 'SR No', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.sr_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Item Name', // field name in the row object
                    label: 'Item Name', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.ItemSnap?.medium_description
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Batch', // field name in the row object
                    label: 'Batch', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.batch_no
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'MFD', // field name in the row object
                    label: 'MFD', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.mfd
                                ;
                            return (
                                <p>{dateParse(data)}</p>
                            )
                        }
                    },
                },
                {
                    name: 'exd', // field name in the row object
                    label: 'EXD', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.exd
                                ;
                            return (
                                <p>{dateParse(data)}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Pack Size', // field name in the row object
                    label: 'Pack Size', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.pack_size
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Unit Price', // field name in the row object
                    label: 'Unit Price', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ItemSnapBatch?.unit_price
                                ;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Order Qty', // field name in the row object
                    label: 'Order Qty', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.ConsignmentItemBatch?.quantity;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Received Qty', // field name in the row object
                    label: 'Received Qty', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.quantity;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Damage', // field name in the row object
                    label: 'Damage', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.damage;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Shortage', // field name in the row object
                    label: 'Shortage', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.shortage;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'Excess', // field name in the row object
                    label: 'Excess', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.data[dataIndex]?.excess;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'status', // field name in the row object
                    label: 'Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true
                    },
                },


            ],


            bin_loaded: false,
            bin_column: [
                {
                    name: 'bin_id',
                    label: 'bin_id',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.bin[dataIndex]?.bin_id;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'stored_volume',
                    label: 'Stored Volume',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.bin[dataIndex]?.stored_volume;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'volume',
                    label: 'volume',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.bin[dataIndex]?.volume;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },



                {
                    name: 'Qty',
                    label: 'Qty',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <div style={{ width: 100 }}>
                                    <TextValidator
                                        //className=" w-full"
                                        placeholder="Qty"
                                        name="Qty"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.bin[dataIndex].quantity}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.bin[dataIndex].quantity = e.target.value
                                            this.setState({ formData })
                                        }}
                                        onBlur={() => {


                                        }}

                                        onClick={() => {
                                            let formData = this.state.formData;
                                            let orderQty = isNaN(Number(this.state.selected_item?.quantity)) ? 0 : Number(this.state.selected_item?.quantity)
                                            let allocated_qty = 0;

                                            /*  allocated_qty = formData.bin.reduce((accumulator, object) => {
                                                 return accumulator + object.quantity
                                             }, 0); */
                                            formData.bin.forEach(element => {
                                                allocated_qty += isNaN(Number(element.quantity)) ? 0 : Number(element.quantity);
                                            });

                                            console.log("order qty", orderQty)
                                            console.log("allocated_qty", allocated_qty)

                                            if (formData.bin[dataIndex]?.quantity > 0) {

                                            } else {
                                                formData.bin[dataIndex].quantity = orderQty - allocated_qty
                                                this.setState({ formData })
                                            }

                                        }}
                                    /* validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                                    errorMessages={[
                                        'Invalid Inputs',
                                    ]} */
                                    />
                                </div>
                            )
                        }
                    },

                },


            ],

            formData: {
                bin: []
            },

            alert: false,
            message: "",
            severity: 'success',
        }
    }


    async loadData() {
        this.setState({ loaded: false })

        var user = await localStorageService.getItem('userInfo');

        //filterData.msa_id = user.id;
        let filterData = this.state.filterData
        filterData.warehouse_id = this.state.selected_warehouse

        let res = await ConsignmentService.getGRNItems(filterData)
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
                this.loadData()
                this.loadWarehouseBin()
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



    async loadWarehouseBin() {
        this.setState({
            bin_loaded: false,

        })
        let filter = { warehouse_id: this.state.selected_warehouse }
        const res = await WarehouseServices.getAllWarehouseBins(filter)
        console.log("form", res)

        if (200 == res.status) {
            let formData = this.state.formData;
            formData.bin = res.data.view.data
            this.setState(
                {
                    formData,
                    bin_loaded: true,
                },
                () => {
                }
            )
        }

    }




    componentDidMount() {
        this.loadWarehouses()
        //this.loadData();
        // this.loadWarehouseBin();
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

    handleSubmit (){

        
        let bin_data = this.state.formData.bin.filter((ele) => !isNaN(ele.quantity) && ele.quantity > 0)

        let total_qty = 0

        
        for (let index = 0; index < bin_data.length; index++) {
            let item = null
            let item_valume = 0;
            let type = this.state.selected_item?.GRN?.type
            if (type == "Donation GRN") {
                item = this.state.selected_item?.DonationItemsBatch
                console.log("donation item", item)
                item_valume = parseFloat(item?.length) * parseFloat(item?.height) * parseFloat(item?.width);
            } else {
                item = this.state.selected_item.ConsignmentItemBatch?.item
                item_valume = parseFloat(item?.depth) * parseFloat(item?.height) * parseFloat(item?.width);
            }

            total_qty = total_qty + Number(bin_data[index].quantity)
        }

        if (Number(this.state.selected_item?.quantity) == 0) {
            this.setState({
                alert: true,
                message: 'Cannot Allocate! Receive Quantity is Zero',
                severity: 'error',
                submitting_process:false
            })
        } else if (total_qty < Number(this.state.selected_item?.quantity)){
            this.setState({
                dialog_for_less_qty: true
            })
        } else {
            this.submitData()
        }

    }

    async submitData() {
        let formData = this.state.formData;
        console.log("Form Data", formData)
        this.setState({ submitting_process: true, dialog_for_less_qty: false })
        let submit_data = {
            grn_item_id: this.state.selected_item?.id,
            item_batch_id: this.state.selected_item?.ItemSnapBatch?.id,//snapbatchid
            warehouse_id: this.state.selected_warehouse,
            consignment_item_id: this.state.selected_item?.ConsignmentItemBatch?.item_id,
            grn_id: this.state.selected_item?.grn_id,
            item_id: this.state.selected_item?.ItemSnapBatch?.item_id,//snap id
            type: "Consignment GRN",
            consignment_id: this.state.selected_item?.GRN?.consignment_id,
            bin_details: [],

        }



        let bin_data = this.state.formData.bin.filter((ele) => !isNaN(ele.quantity) && ele.quantity > 0)

        let total_qty = 0



        for (let index = 0; index < bin_data.length; index++) {
            let item = null
            let item_valume = 0;
            let type = this.state.selected_item?.GRN?.type
            if (type == "Donation GRN") {
                item = this.state.selected_item?.DonationItemsBatch
                console.log("donation item", item)
                item_valume = parseFloat(item?.length) * parseFloat(item?.height) * parseFloat(item?.width);
            } else {
                item = this.state.selected_item.ConsignmentItemBatch?.item
                item_valume = parseFloat(item?.depth) * parseFloat(item?.height) * parseFloat(item?.width);
            }


            total_qty = total_qty + Number(bin_data[index].quantity)
            let volume_factor = parseFloat(item?.volume_factor?item?.volume_factor:1);

            let volume = ((parseFloat(bin_data[index].quantity) / volume_factor ? volume_factor : 1) * item_valume) / 1000000;


            submit_data.bin_details.push({
                warehouse_id: this.state.selected_warehouse,
                bin_id: bin_data[index].id,
                consignment_item_batch_id: this.state.selected_item?.consignment_item_batch_id,
                quantity: bin_data[index].quantity,
                volume: volume,
                item_bin_type: type == "Donation GRN" ? "Donation item" : "Consignment item"
            })

        }

        console.log("submitting Form Data", submit_data)

        if (total_qty > Number(this.state.selected_item?.quantity)) {
            this.setState({
                alert: true,
                message: 'Cannot Allocate More Than Order Quantity',
                severity: 'error',
                submitting_process:false
            })
        }  else {

            let res = await ConsignmentService.addGRNToBin(submit_data)
            console.log("allocated", res)
            if (res.status == 201) {
                this.setState({
                    alert: true,
                    message: 'Bin Allocation Success',
                    severity: 'success',
                    submitting_process:false
                }, () => {
                    window.location.reload()
                    //this.loadWarehouseBin()
                    //this.loadData()

                })
            } else {
                this.setState({
                    alert: true,
                    message: 'Cannot Allocate the Bin',
                    severity: 'error',
                    submitting_process:false
                })
            }
        }


    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="h6" className="font-semibold"> Unallocated Items </Typography>
                            <Button
                                color='primary'
                                onClick={() => {
                                    this.setState({ dialog_for_select_warehouse: true, Loaded: false })
                                }}>
                                <ApartmentIcon />
                                {/* {loaded ? selectedWarehouse.name : 'Chanage Warehouse'} */}Change Warehouse
                            </Button>
                        </div>
                        {/* <CardTitle title=" GRN Items " />
                         */}
                        <ValidatorForm
                            className="mt-10"
                            onSubmit={() => this.loadData()}
                        // onError={() => null}
                        >
                            <Grid container spacing={2}>
                                <Grid
                                    item
                                    lg={4}
                                    md={4}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle
                                        title={
                                            'GRN Type'
                                        }
                                    ></SubTitle>
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={[{ name: "Consignment GRN" }, { name: "Donation GRN" }]}
                                        /*  defaultValue={this.setState.all_uoms.find(
                                                   (v) => v.value == ''
                                               )}  */
                                        getOptionLabel={(
                                            option
                                        ) =>
                                            option.name
                                        }
                                        /*  getOptionSelected={(option, value) =>
                                                  console.log("ok")
                                              } */

                                        //  value={this.state.filterData.type}
                                        onChange={(
                                            event,
                                            value
                                        ) => {
                                            if (value != null) {
                                                let filterData = this.state.filterData
                                                filterData.type = value.name
                                                this.setState({
                                                    filterData
                                                })
                                            } else {
                                                let filterData = this.state.filterData
                                                filterData.type = null
                                                this.setState({
                                                    filterData
                                                })
                                            }

                                        }}

                                        renderInput={(
                                            params
                                        ) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="GRN Type"
                                                //variant="outlined"
                                                //value={}
                                                value={this.state.filterData.type}
                                                fullWidth
                                                // disabled={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                variant="outlined"
                                                size="small"
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid
                                    className=" w-full flex-end"
                                    item
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    xs={12}
                                >
                                    <Button
                                        className="mt-6 flex-end"
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


                <Dialog fullWidth maxWidth="lg " open={this.state.batchView} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Bin Details" />

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ batchView: false }) }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>
                    <ValidatorForm
                        className="mt-10 px-12 pb-10"
                        onSubmit={() => this.handleSubmit()}
                    // onError={() => null}
                    >


                        {this.state
                            .bin_loaded ? (
                            <div>

                                <Grid container>
                                    <Grid item sm={4}>
                                        <SubTitle title="Item Name"></SubTitle>
                                        {this.state.selected_item?.ItemSnapBatch?.ItemSnap?.medium_description}
                                    </Grid>

                                    <Grid item sm={4}>
                                        <SubTitle title="Order Quantity"></SubTitle>
                                        {this.state.selected_item?.ConsignmentItemBatch?.quantity}
                                    </Grid>

                                    <Grid item sm={4}>
                                        <SubTitle title="Received Quantity"></SubTitle>
                                        {this.state.selected_item?.quantity}
                                    </Grid>

                                </Grid>

                                <LoonsTable
                                    //title={"All Aptitute Tests"}

                                    id={'batches'}
                                    data={this.state.formData.bin}
                                    columns={this.state.bin_column}
                                    options={{
                                        pagination: false,
                                        serverSide: true,
                                        count: this.state.totalItems,
                                        //rowsPerPage: 20,
                                        // page: this.state.formData.page,
                                        print: false,
                                        viewColumns: false,
                                        download: false,
                                        onRowClick: this.onRowClick,
                                        onTableChange: (action, tableState
                                        ) => {
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
                                        },
                                    }}
                                ></LoonsTable>

                                <Button progress={this.state.submitting_process} className="mt-3" type='submit'>Save</Button>
                            </div>

                        ) : (
                            //load loading effect
                            <Grid className="justify-center text-center w-full pt-12">
                                {/*  <CircularProgress
        size={30}
    /> */}
                            </Grid>
                        )}





                    </ValidatorForm>

                </Dialog>



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
                                        this.setState({ owner_id: value.owner_id, selected_warehouse: value.id, dialog_for_select_warehouse: false, Loaded: true }, () => {
                                            this.loadWarehouseBin()
                                            this.loadData()
                                        })
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

                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_less_qty} >
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Quantity is less than Received Quantity, Do you want to proceed?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={()=>{this.submitData()}}>Yes</Button>
                        <Button style={{backgroundColor:'red'}} onClick={ ()=>{
                              this.setState({
                                dialog_for_less_qty: false
                            })
                        }} autoFocus>
                            No
                        </Button>
                    </DialogActions>
                    
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
        );
    }
}

export default withStyles(styleSheet)(Unallocated_GRN_Items)
