import React, { Component, Fragment, useState } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Dialog,
    Divider,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Card,
    CircularProgress,
    Typography, 
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    Radio,
    RadioGroup,
    FormControl,
    FormControlLabel,
    Collapse,
    Checkbox,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@material-ui/core'
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { convertTocommaSeparated, dateParse } from 'utils'

import HospitalConfigServices from 'app/services/HospitalConfigServices';
import CloseIcon from '@material-ui/icons/Close';

import localStorageService from 'app/services/localStorageService'
import DeselectIcon from '@mui/icons-material/Deselect';
import AllOutIcon from '@mui/icons-material/AllOut';

import ForieignShipment from './MA/foreign/ForeignShipment'
import LocalShipment from './MA/local/LocalShipment'
import SPCServices from 'app/services/SPCServices'
import { isNull } from 'lodash'
import { ConfirmationDialog } from 'app/components'
import { Chip } from '@mui/material'
import EmployeeServices from 'app/services/EmployeeServices'
import LDCNPrint from './print/LDCNPrint'
import WDNPrint from './print/WDNPrint'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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
})

class PODetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isOverflow: false,
            role: null,
            open: false,
            consignmentOpen: false,
            approveOpen: false,
            rejectOpen: false,
            forwardOpen: false,
            isReject: false,
            isForward: false,
            orderNo: null,
            SPCPOId: null,
            details: {},

            itemList: [],
            ploaded: false,
            POData: {},
            purchaseOrderData: {},
            deliveryData: [],
            printLoaded: false,
            user: {},

            // single_data:{},
            itemArray: [],
            single_data: [],
            selected_id: null,
            selected_item: null,
            collapseButton: 0,
            userRoles: [],
            createdConsignment: false,
            consignment_id: null,
            allChargers:{},

            data: [],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].id
                            let order_no = this.state.data[tableMeta.rowIndex]?.OrderList?.order_no
                            let status = this.state.data[tableMeta.rowIndex]?.status
                            const condition = (status === 'APPROVED' || status === 'SPC APPROVED' || status === 'AMENDED') && this.state.userRoles.includes("SPC MA")
                            return (
                                <>
                                    <Tooltip title="Create Consignment">
                                        <IconButton
                                            className="text-black"
                                            disabled={!condition}
                                            onClick={() => {
                                                this.setState({
                                                    selected_item: this.state.data[tableMeta.rowIndex], orderNo: order_no, details: { supplierId: this.state.data[tableMeta.rowIndex]?.supplier_id, indentNo: this.state.data[tableMeta.rowIndex]?.indent_no }
                                                }, () => {
                                                    this.loadSingleData(id)
                                                })
                                            }}
                                        >
                                            <Icon color={condition ? 'primary' : 'disabled'}>add</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'po_no', // field name in the row object
                    label: 'PO No', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                    },
                },
                {
                    name: 'supplier_code',
                    label: 'Supplier Code',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Supplier?.registration_no
                                    ? this.state.data[tableMeta.rowIndex]?.Supplier?.registration_no : 'N/A'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'order_no',
                    label: 'Order No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p className='capitalize'>{this.state.data[tableMeta.rowIndex]?.status ? this.state.data[tableMeta.rowIndex]?.status : 'N/A'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'currency',
                    label: 'Currency',
                    options: {
                        display: true,
                        // filter: true,
                    },
                },
                {
                    name: 'grand_total',
                    label: 'Total',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let val = this.state.data[tableMeta.rowIndex]?.grand_total
                            if (this.state.data[tableMeta.rowIndex]?.type == "local") {
                                val = Number(val) - Number(this.state.data[tableMeta.rowIndex]?.total_tax)
                            }
                            return (
                                <p className='capitalize'>{val ? convertTocommaSeparated(val) : 'N/A'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'total_payable',
                    label: 'Remaining Total',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let val = this.state.data[tableMeta.rowIndex]?.total_payable
                            if (this.state.data[tableMeta.rowIndex]?.type == "local") {
                                val = Number(val) - Number(this.state.data[tableMeta.rowIndex]?.total_tax)
                            }
                            return (
                                <p className='capitalize'>{val ? convertTocommaSeparated(val) : 'N/A'}</p>
                            )
                        }
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            // loading: false,
            // single_loading: false,
            storedData: {},

            loading: true,
            single_loading: true,

            totalItems: 0,
            filterData: {
                po_no: null,
                delivery_from: null,
                delivery_to: null,
                due_from: null,
                due_to: null,
                status: null,
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                status: ['APPROVED', 'SPC APPROVED', 'AMENDED']
            },
            isLocal: true,

            consultant: [
                { id: 1, label: 'Haris' },
                { id: 2, label: 'Sadun' },
                { id: 3, label: 'Ishara' },
                { id: 4, label: 'Gayan' },
            ],

            formSampleData: {
                isLocal: null,
            },

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },

            all_Suppliers: [],
            all_manufacture: [],

            formSingleData: {
                // order_qty: null,
                // po_by: "HOSPITAL",
                // order_no: null,
                // supplier_id: null,
                // manufacture_id: null,
                // lp_request_id: null,
                // order_date: null,
                // status: "Active",
                // type: "lprequest",
                // created_by: null,
                // order_date_to: null,
                // no_of_items: null,
                // estimated_value: null,
                // order_for_year: null,
                // order_items: [],
                // agent_id: 'd13941b2-7b77-42e7-ae5a-f07f9143a5dc',

                // currency: "LKR",
                // indent_no: null,
                // // item_id: this.props.match.params.item_id
            },
            total_payable: 0,
            total_tax: 0,
            exchange_rate: 0,
        }
        this.loadSingleData = this.loadSingleData.bind(this)
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        const formData = this.state.filterData;

        let res = await SPCServices.getAllPurchaseOrders(formData)

        if (res.status === 200) {
            console.log('SPC Purchase Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
    }

    loadSingleData = async (id) => {
        try {
            this.setState({ single_loading: false, open: false, createdConsignment: false });
            // let formData = { 'order[0]': ['updatedAt', 'DESC'], limit: 10, page: 0, agent_type: "SPC", order_no: order_no }
            // let response = await SchedulesServices.getScheduleOrderList(formData)
            let response = await SPCServices.getPurchaseOrderByID(id);

            if (response.status === 200) {
                console.log("Test: ", response.data?.view)
                this.setState({
                    allChargers : response.data?.view,
                    total_payable: response.data.view?.grand_total, total_tax: response?.data?.view?.type != "local" ? 0 : response.data.view?.total_tax, exchange_rate: response.data.view?.exchange_rate, formSampleData: {
                        ...this.state.formSampleData, isLocal: response.data?.view?.po_type === "F" || response.data?.view?.po_type === "Foreign" ? false : true
                    }
                })
                console.log("Test: vvvvvvv ", this.state.allChargers)

                try {
                    const spcPOItems = response.data?.view?.SPCPOItems;
                    if (Array.isArray(spcPOItems) && spcPOItems.length > 0) {
                        let itemResponse = await SPCServices.getAllSPCPODeliverySchedules({ spc_po_id: spcPOItems?.[0]?.spc_po_id });
                        let sumQuantityDifferenceArray = [];
                        itemResponse.data.view.data.forEach(item => {
                            const quantity = parseInt(item.quantity ?? 0, 10);
                            const allocatedQuantity = parseInt(item.allocated_quantity ?? 0, 10);
                            const difference = quantity - allocatedQuantity;
                            sumQuantityDifferenceArray.push(difference > 0);
                        });
                        this.setState({
                            single_data: itemResponse.data.view.data, SPCPOId: spcPOItems[0].spc_po_id, single_loading: true, open: true, itemArray: sumQuantityDifferenceArray
                        });
                    } else {
                        this.setState({ alert: true, severity: "info", message: "Info: Seems that you haven't add Item Details" })
                    }
                } catch (error) {
                    console.error('Error loading data:', error);
                    this.setState({ alert: true, severity: "error", message: `Error: ${error}` })
                }
            }
            // this.setState({ single_loading: true, open: true });
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ alert: true, severity: "error", message: `Error: ${error}` })
            // this.setState({ single_loading: true, open: true });
        }
    };

    async loadAllSuppliers(search) {
        let params = { search: search }

        let res = await HospitalConfigServices.getAllSuppliers(params)
        if (res.status) {
            console.log("all Suppliers", res.data.view.data)
            this.setState({
                all_Suppliers: res.data.view.data,
            })
        }
    }

    async loadItemData(data) {
        try {
            const spcConsignmentItems = data?.SPCConsignmentItems;

            if (Array.isArray(spcConsignmentItems)) {
                const consignmentItemIds = spcConsignmentItems.map(item => item.item_id);
                const itemResponse = await SPCServices.getAllSPCPODeliverySchedules({ spc_po_id: spcConsignmentItems[0].spc_po_id });

                const initialArray = itemResponse.data.view.data;
                const newArray = initialArray.map(item => {
                    const matchingIndex = consignmentItemIds.indexOf(item.id);

                    return {
                        ...item,
                        selected: matchingIndex !== -1,
                        transit_quantity: matchingIndex !== -1
                            ? spcConsignmentItems[matchingIndex]?.transit_quantity || '0'
                            : '0'
                    };
                });

                this.setState({ itemList: newArray });
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ alert: true, severity: "error", message: `Error: ${error}` });
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

    async loadAllManufacture(search) {
        let params = { search: search }

        let res = await HospitalConfigServices.getAllManufacturers(params)
        if (res.status) {
            console.log("all Manufacturers", res.data.view.data)
            this.setState({
                all_manufacture: res.data.view.data,
            })
        }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New Form Data: ", this.state.formData)
            this.loadData()
        })
    }


    handleDataStore = (data) => {
        this.setState((prevState) => {
            // Merge the new data with the previous state
            const updatedData = { ...prevState.storedData, ...data };
            return { storedData: updatedData };
        });
    };


    async submitData() {

    }

    handleFileSelect = (event) => {
        const { selectedFiles, selectedFileList } = this.props
        let files = event.target.files

        this.setState({ files: files }, () => {
            console.log('files', this.state.files)
        })
    }

    selectRow = (index) => {
        let single_data = this.state.single_data;

        if (single_data[index].selected) {
            single_data[index].selected = false
        } else {
            single_data[index].selected = true
        }

        this.setState({ single_data }, () => {
            // this.render()
            console.log("Selected Data :", this.state.single_data)
        })
    }

    handleTotal = () => {
        const orderedQuantity = this.state.single_data.reduce((accumulator, item) => {
            return accumulator + (item?.transit_qty ? item.transit_qty : 0);
        }, 0);
        return orderedQuantity
    }

    componentDidMount() {
        let roles = localStorageService.getItem('userInfo')?.roles
        this.setState({
            roles: roles[0],
            userRoles: roles
        }, () => {
            this.loadData()
        })
    }

    onSubmit = async () => {
        this.setState({ forwardOpen: false })
        const { isLocal } = this.state.formSampleData
        const item_data = this.state.single_data;
        const totalOrderedQuantity = this.handleTotal();

        if (!isNull(isLocal)) {
            const data = this.state.storedData
            const owner_id = await localStorageService.getItem('owner_id')
            const user_id = await localStorageService.getItem('userInfo')?.id
            const selectedItems = item_data.filter(item => item.selected === true);

            const newFormData = {
                ...data, owner_id: owner_id, order_no: this.state.orderNo, created_by: user_id, type: isLocal ? "Local" : "Foreign", po_no: this.state.selected_item?.po_no, hs_code: this.state.selected_item?.hs_code, 
                currency: this.state.selected_item?.currency_short, currency_type: this.state.selected_item?.currency, 
                //currency_rate: this.state.selected_item?.exchange_rate, 
                //exchange_rate: this.state.selected_item?.exchange_rate,
                currency_rate: data?.currency_rate, 
                exchange_rate: data?.currency_rate,

                 consignment_quantity: totalOrderedQuantity, items: selectedItems.map(item => ({
                    item_id: item?.id, purchase_price: item?.price, transit_quantity: (item?.transit_qty ? item?.transit_qty : 0), spc_po_id: this.state.SPCPOId, po_item_id: item?.spc_po_item_id
                }))
            }

            console.log("SUBMITTED DATA", newFormData)

            let res = await SPCServices.createConsignment(newFormData)

            if (res.status) {
                this.setState({
                    severity: "success",
                    alert: true,
                    message: "Consignment Creation was Successfull",
                    isForward: true,
                    consignment_id: res.data?.posted?.id,
                    createdConsignment: true,
                    // consignmentOpen: false
                })
            } else {
                this.setState({
                    severity: "error",
                    alert: true,
                    message: "Consignment Creation was Unsuccessfull"
                })
            }
        } else {
            this.setState({
                severity: "error",
                alert: true,
                message: "Something Went Wrong"
            })
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.storedData !== this.state.storedData) {
            console.log("Data :", this.state.storedData)
        }
    }

    handleDeselectAll = () => {
        const { single_data } = this.state;
        const updatedData = single_data.map(item => {
            return { ...item, selected: false };
        });
        this.setState({ single_data: updatedData });
    };

    async printData() {
        if (this.state.consignment_id) {
            try {
                this.setState({ printLoaded: false, ploaded: false });

                const consignment_res = await SPCServices.getConsignmentByID(this.state.consignment_id);

                if (consignment_res.status !== 200) {
                    console.error("Error fetching consignment:", consignment_res);
                    return;
                }

                const po_res = await SPCServices.getAllPurchaseOrders({ po_no: consignment_res.data.view?.po_no });
                const po_res_single = await SPCServices.getPurchaseOrderByID(po_res.data.view.data?.[0]?.id);

                // Add error handling for the po_res status
                if (po_res.status !== 200 && po_res.status !== 200) {
                    console.error("Error fetching purchase orders:", po_res);
                    return;
                }

                // Load item data
                await this.loadItemData(consignment_res.data.view);
                await this.getUser();

                const vesselDetails = consignment_res.data.view?.ConsigmentVesselData || []
                const fcl_table_values = Array.isArray(vesselDetails?.[0]?.fcl_table_values)
                    ? vesselDetails?.[0]?.fcl_table_values
                    : JSON.parse(vesselDetails?.[0]?.fcl_table_values || '[]');

                this.setState({
                    ploaded: true,
                    POData: po_res_single.data.view,
                    purchaseOrderData: consignment_res.data.view,
                    deliveryData: fcl_table_values,
                    printLoaded: true,
                }, () => {
                    this.state.formSampleData.isLocal ?
                        document.getElementById('ldcn_print').click() :
                        document.getElementById('wdn_print').click()
                });
            } catch (error) {
                console.error("An error occurred:", error);
            }
        }
    }


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2 px-main-8">
                    <Card  className="px-main-card py-3">
                        {/* Filtr Section */}
                        <CardTitle title="PO List" />
                        <ValidatorForm
                            className="pt-2"
                            onSubmit={() => this.loadData()}
                            onError={() => null}
                        >
                            {/* Main Grid */}
                            <Grid container spacing={2} direction="row">
                                {/* Filter Section */}
                                <Grid item xs={12} className='mb-10' sm={12} md={12} lg={12}>
                                    {/* Item Series Definition */}
                                    <Grid container spacing={2}>
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                            lg={12}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            className=" w-full"
                                                            item
                                                            lg={6}
                                                            md={6}
                                                            sm={12}
                                                            xs={12}
                                                        >
                                                            <SubTitle title="PO Number" />
                                                            <TextValidator
                                                                className=" w-full"
                                                                placeholder="Enter PO Number"
                                                                name="sr_no"
                                                                InputLabelProps={{
                                                                    shrink: false,
                                                                }}
                                                                value={
                                                                    this.state.filterData
                                                                        .po_no
                                                                }
                                                                type="text"
                                                                variant="outlined"
                                                                size="small"
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            po_no:
                                                                                e.target
                                                                                    .value,
                                                                        },
                                                                    })
                                                                }}
                                                                InputProps={{
                                                                    endAdornment: (
                                                                        <InputAdornment position="end">
                                                                            <IconButton onClick={() => { this.loadData() }}>
                                                                                <SearchIcon />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                            // validators={[
                                                            //     'required',
                                                            // ]}
                                                            // errorMessages={[
                                                            //     'this field is required',
                                                            // ]}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Status" />
                                                    <Autocomplete
                                                        className="w-full"
                                                        options={appConst.consignment_list_status}
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let filterData =
                                                                    this.state.filterData
                                                                filterData.status =
                                                                    value?.label
                                                                this.setState({
                                                                    filterData
                                                                })
                                                            }
                                                        }}
                                                        getOptionLabel={(option) =>
                                                            option.label
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Please choose"
                                                                fullWidth
                                                                variant="outlined"
                                                                size="small"
                                                                value={
                                                                    this.state.filterData
                                                                        .status
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Expected Delivery Date" />
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }} className='mr-2'>
                                                            <DatePicker
                                                                className="w-full"
                                                                value={
                                                                    this.state.filterData.delivery_from
                                                                }
                                                                //label="Date From"
                                                                placeholder="From"
                                                                // minDate={new Date()}
                                                                //maxDate={new Date("2020-10-20")}
                                                                // required={true}
                                                                // errorMessages="this field is required"
                                                                onChange={(date) => {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.delivery_from = date
                                                                    this.setState({ filterData })
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{ flex: 1 }} className='ml-2'>
                                                            <DatePicker
                                                                className="w-full"
                                                                value={
                                                                    this.state.filterData.delivery_to
                                                                }
                                                                //label="Date From"
                                                                placeholder="To"
                                                                // minDate={new Date()}
                                                                //maxDate={new Date("2020-10-20")}
                                                                // required={true}
                                                                // errorMessages="this field is required"
                                                                onChange={(date) => {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.delivery_to = date
                                                                    this.setState({ filterData })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={6}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Expected Due Date" />
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }} className='mr-2'>
                                                            <DatePicker
                                                                className="w-full"
                                                                value={
                                                                    this.state.filterData.due_from
                                                                }
                                                                //label="Date From"
                                                                placeholder="From"
                                                                // minDate={new Date()}
                                                                //maxDate={new Date("2020-10-20")}
                                                                // required={true}
                                                                // errorMessages="this field is required"
                                                                onChange={(date) => {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.due_from = date
                                                                    this.setState({ filterData })
                                                                }}
                                                            />
                                                        </div>
                                                        <div style={{ flex: 1 }} className='ml-2'>
                                                            <DatePicker
                                                                className="w-full"
                                                                value={
                                                                    this.state.filterData.due_to
                                                                }
                                                                //label="Date From"
                                                                placeholder="To"
                                                                // minDate={new Date()}
                                                                //maxDate={new Date("2020-10-20")}
                                                                // required={true}
                                                                // errorMessages="this field is required"
                                                                onChange={(date) => {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.due_to = date
                                                                    this.setState({ filterData })
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <Grid container spacing={2}>
                                                        <Grid
                                                            item
                                                            lg={12}
                                                            md={12}
                                                            sm={12}
                                                            xs={12}
                                                            className=" w-full flex justify-end"
                                                        >
                                                            {/* Submit Button */}
                                                            <Button
                                                                className="mt-2"
                                                                progress={false}
                                                                type="submit"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon="search"
                                                            //onClick={this.handleChange}
                                                            >
                                                                <span className="capitalize">
                                                                    Search
                                                                </span>
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                {/* Submit and Cancel Button */}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <br />
                                {/* Table Section */}
                                {this.state.loading ?
                                    <Grid container className="mt-5 pb-5">
                                        <Grid item lg={12} md={12} sm={12} xs={12}>
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allApprovedPO'}
                                                data={this.state.data}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    rowsPerPage: this.state.filterData.limit,
                                                    page: this.state.filterData.page,
                                                    serverSide: true,
                                                    rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                    print: true,
                                                    count: this.state.totalItems,
                                                    viewColumns: true,
                                                    download: true,
                                                    onTableChange: (
                                                        action,
                                                        tableState
                                                    ) => {
                                                        console.log(
                                                            action,
                                                            tableState
                                                        )
                                                        switch (action) {
                                                            case 'changePage':
                                                                this.setPage(
                                                                    tableState.page
                                                                )
                                                                break
                                                            case 'changeRowsPerPage':
                                                                this.setState({
                                                                    filterData: {
                                                                        limit: tableState.rowsPerPage,
                                                                        page: 0,
                                                                    },
                                                                }, () => {
                                                                    this.loadData()
                                                                })
                                                                break;
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
                                        </Grid>
                                    </Grid>
                                    :
                                    (
                                        <Grid className='justify-center text-center w-full pt-12'>
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </ValidatorForm>
                    </Card>
                </div>
                <Dialog
                    fullWidth={true}
                    maxWidth="lg"
                    open={this.state.open}>
                    <MuiDialogTitle disableTypography={true} className={classes.Dialogroot}>
                        <CardTitle title="Create Shipment" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ open: false }, () => {
                                    this.handleDeselectAll()
                                })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5">
                        <div className="pb-5 pt-2" style={{ display: "flex", justifyContent: "flex-end" }}><Chip
                            size="small"
                            label={this.state.itemArray.includes(true) ? "Allocation Possible" : "Allocation Not Possible"}
                            color={this.state.itemArray.includes(true) ? "success" : "error"}
                            variant="outlined"
                        /></div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div style={{ display: "flex" }}>
                                <div style={{ marginRight: "20px" }}>
                                    {/* <SubTitle title={"LP Request No"}></SubTitle> */}
                                    <Typography className=" text-gray font-semibold text-13">PO No: </Typography>
                                </div>
                                <div>
                                    <Typography className='text-13'>{this.state.selected_item?.po_no ? this.state.selected_item?.po_no : 'N/A'}</Typography>
                                </div>
                            </div>
                            <div style={{ display: "flex" }}>
                                <div style={{ marginRight: "20px" }}>
                                    {/* <SubTitle title={"LP Request No"}></SubTitle> */}
                                    <Typography className=" text-gray font-semibold text-13">Requested By : </Typography>
                                </div>
                                <div>
                                    <Typography className='text-13'>{this.state.selected_item?.Employee ? this.state.selected_item?.Employee?.name + " / " + this.state.selected_item?.Employee?.designation : null}</Typography>
                                </div>
                            </div>
                        </div>
                        <br />
                        <Typography className='text-20'>Item Details</Typography>
                        <Divider className='mt-2' />
                        <TableContainer style={{ margin: "12px 0 30px 0" }}>
                            <Table aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align='center'>Action</StyledTableCell>
                                        <StyledTableCell align='center'>SR Number</StyledTableCell>
                                        <StyledTableCell align="center">SR Name</StyledTableCell>
                                        <StyledTableCell align="center">Unit Price</StyledTableCell>
                                        <StyledTableCell align="center">Units</StyledTableCell>
                                        <StyledTableCell align="center">Unit Type</StyledTableCell>
                                        <StyledTableCell align="center">Order&nbsp;Quantity</StyledTableCell>
                                        <StyledTableCell align="center">Pending&nbsp;Quantity</StyledTableCell>
                                        <StyledTableCell align="center">Consignment&nbsp;Quantity</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                {this.state.single_loading && this.state.single_data ? this.state.single_data?.map((element, index) => (
                                    <TableBody key={index}>
                                        {/* <StyledTableRow key={element?.id}> */}
                                        <StyledTableRow >
                                            <StyledTableCell component="th" scope="row">
                                                {parseInt(parseInt(element?.quantity ?? 0, 10) - parseInt(element?.allocated_quantity ?? 0, 10), 10) > 0 ?
                                                    <Checkbox
                                                        disabled={parseInt(parseInt(element?.quantity ?? 0, 10) - parseInt(element?.allocated_quantity ?? 0, 10), 10) <= 0}
                                                        defaultChecked={this.state.single_data[index]?.selected ? this.state.single_data[index]?.selected : false}
                                                        checked={this.state.single_data[index]?.selected ? this.state.single_data[index]?.selected : false}
                                                        onChange={() => {
                                                            this.selectRow(index)
                                                        }}
                                                        name="chkbox_confirm"
                                                        color="primary"
                                                    /> : <AllOutIcon color='error' />
                                                }
                                            </StyledTableCell>
                                            {/* {this.state.single_data[index]?.selected ?
                                            <StyledTableCell align="center" component="th" scope="row">
                                                {element?.SPCPOItem?.ItemSnap?.sr_no ? element?.SPCPOItem?.ItemSnap?.sr_no : 'N/A'}
                                            </StyledTableCell>
                                            :
                                            <StyledTableCell align="center" scope="row">
                                                {element?.SPCPOItem?.ItemSnap?.sr_no ? element?.SPCPOItem?.ItemSnap?.sr_no : 'N/A'}
                                            </StyledTableCell>
                                            } */}
                                            <StyledTableCell component="th" scope="row">
                                                {element?.SPCPOItem?.ItemSnap?.sr_no ? element?.SPCPOItem?.ItemSnap?.sr_no : 'N/A'}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">{element?.SPCPOItem?.ItemSnap?.short_description ? element?.SPCPOItem?.ItemSnap?.short_description : 'Not Available'}</StyledTableCell>

                                            <StyledTableCell align="center">{element?.SPCPOItem?.price ? parseInt(element?.SPCPOItem?.price, 10) : 'N/A'}</StyledTableCell>
                                            <StyledTableCell align="center">{element?.SPCPOItem?.unit ? parseInt(element?.SPCPOItem?.unit, 10) : 'N/A'}</StyledTableCell>
                                            <StyledTableCell align="center">{element?.SPCPOItem?.unit_type ? element?.SPCPOItem?.unit_type : 'Not Available'}</StyledTableCell>

                                            <StyledTableCell align="center">{element?.quantity ? parseInt(element?.quantity, 10) : 'N/A'}</StyledTableCell>
                                            <StyledTableCell align="center">{parseInt(parseInt(element?.quantity ?? 0, 10) - parseInt(element?.allocated_quantity ?? 0, 10), 10)}</StyledTableCell>
                                            <StyledTableCell align="center" style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                                                <ValidatorForm>
                                                    <TextValidator
                                                        className='w-full'
                                                        placeholder="Consignment Qty"
                                                        //variant="outlined"
                                                        disabled={!this.state.single_data[index]?.selected}
                                                        // disabled={isadded.length == 1 ? false : true}
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        type='number'
                                                        min={0}
                                                        value={
                                                            // this.state.selectedData[this.state.selectedData.indexOf(isadded[0])]?.qty
                                                            String(this.state.single_data[index]?.transit_qty)
                                                        }
                                                        onChange={(e, value) => {
                                                            // let data = this.state.single_data
                                                            // if (e.target.value === '') {
                                                            //     data[index]?.order_qty = 0
                                                            // } else {
                                                            //     data[index]?.order_qty = parseInt(e.target.value, 10)
                                                            // }
                                                            // this.setState({ data })
                                                            let single_data = this.state.single_data;
                                                            single_data[index].transit_qty = parseInt(e.target.value, 10)
                                                            this.setState({ single_data })
                                                        }}

                                                        validators={[
                                                            'required', 'minNumber: 0', 'maxNumber:' + parseInt(parseInt(element?.quantity ?? 0, 10) - parseInt(element?.allocated_quantity ?? 0, 10), 10)
                                                        ]}
                                                        errorMessages={[
                                                            'this field is required', 'Quantity Should Greater-than: 0 ', 'Over Quantity'
                                                        ]}
                                                    />
                                                </ValidatorForm>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    </TableBody>
                                ))
                                    : (
                                        <Grid className='justify-center text-center w-full pt-12'>
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )
                                }
                            </Table>
                        </TableContainer>
                        <Divider className='mt-2' />
                        {(this.state.single_data.filter((data) => data.selected === true && (data.transit_qty != null && data.transit_qty > 0 && data.transit_qty <= parseInt(parseInt(data?.quantity ?? 0, 10) - parseInt(data?.allocated_quantity ?? 0, 10), 10))).length === this.state.single_data.filter((data) => data.selected == true).length && this.state.single_data.filter((data) => data.selected == true).length > 0) &&
                            <Grid item lg={12} md={12} sm={12} xs={12} className='mt-5 mb-5'>
                                <div style={{ display: "flex", flexDirection: "row" }}>
                                    <div style={{ flex: 1 }}><Typography variant='h5'>Total Consignment Added</Typography></div>
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", alignItems: "center" }}>
                                        <Typography variant="h5">{this.handleTotal()}</Typography>
                                 
                                        <Button
                                            className="ml-4"
                                            // color="danger"
                                            progress={false}
                                            // type="submit"
                                            scrollToTop={
                                                true
                                            }
                                            
                                            onClick={this.handleDeselectAll}
                                        >
                                                         <DeselectIcon/>
                                            <span className="capitalize ml-2">
                                   
                                                Remove All
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                                <Grid container spacing={2} className='mt-5'>
                                    <Grid
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Shipment Type" />
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                name="truefalse"
                                                value={this.state.formSampleData.isLocal}
                                                onChange={(e) => {
                                                    let formSampleData = this.state.formSampleData
                                                    formSampleData.isLocal = e.target.value === 'true' ? true : false;
                                                    this.setState({ formSampleData })
                                                }}
                                                style={{ display: "block", marginLeft: "12px" }}
                                            >
                                                <FormControlLabel
                                                    value={true}
                                                    disabled
                                                    control={<Radio />}
                                                    label="Local Shipment"
                                                />
                                                <FormControlLabel
                                                    disabled
                                                    value={false}
                                                    control={<Radio />}
                                                    label="Foreign Shipment"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    <Grid
                                        item
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        xs={12}
                                        style={{
                                            display: 'flex',
                                            marginTop: '12px',
                                            paddingRight: 0,
                                            justifyContent: 'flex-end'
                                        }}>
                                        {                    // this.state.isSave && this.state.isNormal &&
                                            this.state.formSampleData.isLocal !== null &&
                                            <Button
                                                type="submit"
                                                // disabled={!this.state.selected_id.length}
                                                // className='ml-2'
                                                onClick={() => {
                                                    this.setState({ consignmentOpen: true, storedData: {} })
                                                }}
                                                startIcon='save'
                                            >
                                                <span className="capitalize">Proceed with Shipment</span>
                                            </Button>
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                    </div>
                </Dialog>
                <Dialog
                    fullWidth={true}
                    maxWidth="xl"
                    open={this.state.consignmentOpen}>
                    <MuiDialogTitle disableTypography={true} className={classes.Dialogroot}>
                        <CardTitle title="Consignment Creation" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ consignmentOpen: false, open: false, createdConsignment: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <DialogContent>
                        {
                            this.state.formSampleData.isLocal ?
                                <LocalShipment totalPayable={this.state.total_payable} total_tax={this.state.total_tax} exchangeRate={this.state.exchange_rate} storeData={this.handleDataStore} details={this.state.details} created={this.state.createdConsignment} handlePrint={() => this.printData()} handleClose={() => this.setState({ consignmentOpen: false })} submitOpen={() => this.setState({ forwardOpen: true })} itemData={this.state.single_data} allChargers={this.state.allChargers} /> :
                                <ForieignShipment exchangeRate={this.state.exchange_rate} totalPayable={this.state.total_payable} storeData={this.handleDataStore} details={this.state.details} created={this.state.createdConsignment} handlePrint={() => this.printData()} handleClose={() => this.setState({ consignmentOpen: false })} submitOpen={() => this.setState({ forwardOpen: true })} itemData={this.state.single_data}  allChargers={this.state.allChargers} />
                        }
                    </DialogContent>
                </Dialog>
                <ConfirmationDialog
                    text={this.state.formSampleData.isLocal ? "Are you Sure to forward the LDCN?" : "Are you Sure to forward the WDN?"}
                    open={this.state.forwardOpen}
                    onConfirmDialogClose={() => { this.setState({ forwardOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ forwardOpen: false }, () => {
                            this.onSubmit()
                        })
                    }}
                />
                <ConfirmationDialog
                    text={this.state.formSampleData.isLocal ? "Are you Sure you want to reject the LDCN?" : "Are you Sure you want to reject the WDN?"}
                    open={this.state.rejectOpen}
                    onConfirmDialogClose={() => { this.setState({ rejectOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ rejectOpen: false, isReject: true })
                    }}
                />
                <Dialog fullWidth={true}
                    maxWidth="sm"
                    open={this.state.isForward}>
                    <MuiDialogTitle disableTypography={true} className={classes.Dialogroot}>
                        <CardTitle title="Confirmation Message" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ isForward: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {this.state.formSampleData.isLocal ? "You have successfully forwarded the LDCN" : "You have successfully forwarded the WDN"}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ isForward: false, open: false }, () => {
                                    this.handleDeselectAll()
                                })
                            }}>Done</Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <Dialog fullWidth={true}
                    maxWidth="sm"
                    open={this.state.isReject}>
                    <MuiDialogTitle disableTypography={true} className={classes.Dialogroot}>
                        <CardTitle title="Confirmation Message" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ isReject: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {this.state.formSampleData.isLocal ? "You have rejected the LDCN and returned it" : "You have rejected the WDN and returned it"}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ isReject: false, open: false }, () => {
                                    this.handleDeselectAll()
                                })
                            }}>Done</Button>
                        </DialogActions>
                    </div>
                </Dialog>
                {this.state.ploaded && (
                    this.state.formSampleData.isLocal ?
                        <LDCNPrint purchaseOrderData={this.state.purchaseOrderData} POData={this.state.POData} ItemData={this.state.itemList} hospital={this.state.hospital} user={this.state.user} deliveryData={this.state.deliveryData} /> :
                        <WDNPrint purchaseOrderData={this.state.purchaseOrderData} POData={this.state.POData} ItemData={this.state.itemList} hospital={this.state.hospital} user={this.state.user} deliveryData={this.state.deliveryData} />
                )
                }
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={1200}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(PODetails)
