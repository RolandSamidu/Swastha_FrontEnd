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
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { dateParse, convertTocommaSeparated } from 'utils'

import LocalPurchaseServices from 'app/services/LocalPurchaseServices'
import HospitalConfigServices from 'app/services/HospitalConfigServices';
import PrescriptionService from 'app/services/PrescriptionService';
import InventoryService from 'app/services/InventoryService';

import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import BackupTableIcon from '@mui/icons-material/BackupTable';
import localStorageService from 'app/services/localStorageService'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeselectIcon from '@mui/icons-material/Deselect';

import LocalDetails from './ApprovalDetails'
import DelailsView from './ApprovalDetailsView'
import SPCServices from 'app/services/SPCServices'
// import AllDebitNotes from '../local/AllDebitNotes'

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

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null }) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => {
        setIsFocused(true);
    };
    const handleBlur = () => {
        setIsFocused(false);
    };

    return (
        <Autocomplete
            disableClearable
            onFocus={handleFocus}
            onBlur={handleBlur}
            options={options}
            getOptionLabel={getOptionLabel}
            // id="disable-clearable"
            onChange={onChange}
            value={val}
            size='small'
            renderInput={(params) => (
                < div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                    <input type="text" {...params.inputProps}
                        style={{ marginTop: '5.5px', padding: '6.5px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                        placeholder={`⊕ ${text}`}
                        onChange={onChange}
                        value={val}
                    // required
                    />
                    <div
                        style={{
                            position: 'absolute',
                            top: '7.5px',
                            right: 8,
                        }}
                        onClick={null}
                    >
                        {isFocused ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </div>
                </div >
            )}
        />);
}

class CanceledDebitNotes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            isOverflow: false,
            role: null,
            open: false,
            viewDet: false,
            consignmentOpen: false,
            approveOpen: false,
            rejectOpen: false,
            forwardOpen: false,
            isReject: false,
            isForward: false,

            itemList: [],
            // single_data:{},
            single_data: [
                {
                    id: "A1001",
                    ItemSnap: {
                        sr_no: "00100148",
                        short_description: "Panadol",
                    },
                    available_qty: "250",
                    order_qty: null
                },
                {
                    id: "A1002",
                    ItemSnap: {
                        sr_no: "00100149",
                        short_description: "Atrolip",
                    },
                    available_qty: "350",
                    order_qty: null
                },
            ],
            selected_id: null,
            collapseButton: 0,
            userRoles: [],
            sequence: 0,

            data: [
                {
                    wharf_ref_no: "03145",
                    po_no: "12345",
                    wdn_date: new Date(),
                    wdn_no: "WDN001",
                    invoice_no: "CHE1234",
                    supplier_code: "AB1234",
                    grn_no: "06074",
                    shipment_status: "Completed",
                    debit_status: "Not Checked",
                    total: "7500",
                    debit_note_number: "Sample",
                    shipment_no: "IM00203/2023",
                },
                {
                    wharf_ref_no: "01378",
                    po_no: "22445",
                    wdn_date: new Date(),
                    wdn_no: "WDN002",
                    invoice_no: "CHE1222",
                    supplier_code: "AB2345",
                    grn_no: "Pending",
                    shipment_status: "In Transit",
                    debit_status: "Not Checked",
                    total: "10000",
                    debit_note_number: "Sample",
                    shipment_no: "IM00203/2023",
                },
                {
                    wharf_ref_no: "01278",
                    po_no: "24457",
                    wdn_date: new Date(),
                    wdn_no: "WDN003",
                    invoice_no: "CHE1234",
                    supplier_code: "AB2358",
                    grn_no: "Pending",
                    shipment_status: "In Transit",
                    debit_status: "Not Checked",
                    total: "13000",
                    debit_note_number: "Sample",
                    shipment_no: "IM00203/2023",
                },
            ],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex]?.id
                            let sequence = (tableMeta.rowIndex) % 3;
                            return (
                                <>

                                    <Tooltip title="View Debit Note">
                                        <IconButton
                                            className="text-black mr-2"
                                            onClick={() => {
                                                // window.location = `/spc/wdn_consignment_list/123`
                                                this.setState({ viewDet: true, sequence: sequence, selected_id: id, selected_data: this.state.data[tableMeta.rowIndex] })
                                            }}
                                        >
                                            <Icon color='primary'>visibility</Icon>
                                        </IconButton>
                                    </Tooltip>
                                    {/* 
                                    <Tooltip title="Print Debit Note">
                                        <IconButton
                                            className="text-black"
                                            onClick={() => {
                                                // window.location = `/localpurchase/request/${id}`
                                            }}
                                        >
                                            <Icon color='primary'>print</Icon>
                                        </IconButton>
                                    </Tooltip> */}
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'debit_note_no', // field name in the row object
                    label: 'Debit Note No', // column title that will be shown in table
                    customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                            <p>{this.state.data[tableMeta.rowIndex]?.Consignment?.debit_note_no}</p>
                        )
                    }
                },
                {
                    name: 'wdn_no',
                    label: 'WDN No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Consignment?.wdn_no}</p>
                            )
                        }
                    },
                },
                {
                    name: 'shipment_no', // field name in the row object
                    label: 'Wharf Ref No', // column title that will be shown in table
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Consignment?.shipment_no}</p>
                            )
                        }
                    },
                },
                {
                    name: 'po_no',
                    label: 'PO No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Consignment?.po_no}</p>
                            )
                        }
                    },
                },
                {
                    name: 'debit_note_date',
                    label: 'Debit Note Date',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{dateParse(this.state.data[tableMeta.rowIndex]?.createdAt)}</p>
                            )
                        }
                    },
                },

                // {
                //     name: 'invoice_no',
                //     label: 'Invoice No',
                //     options: {
                //         display: true,
                //         // filter: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <p>{this.state.data[tableMeta.rowIndex]?.Consignment?.invoice_no}</p>
                //             )
                //         }
                //     },
                // },
                // {
                //     name: 'supplier_code',
                //     label: 'Supplier',
                //     options: {
                //         display: true,
                //         customBodyRender: (Supplier) => Supplier?.registration_no ? Supplier?.registration_no : "N/A"
                //     },
                // },
                // {
                //     name: 'grn_no',
                //     label: 'GRN No',
                //     options: {
                //         display: true,
                //         // filter: true,
                //     },
                // },
                {
                    name: 'shipment_status',
                    label: 'Shipment Status',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Consignment?.status}</p>
                            )
                        }
                    },
                },
                {
                    name: 'debit_status',
                    label: 'Debit Status',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.status}</p>
                            )
                        }
                    },
                },
                // {
                //     name: 'total',
                //     label: 'Order Total',
                //     options: {
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <p>{convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.final_value, 2)}</p>
                //             )
                //         }
                //     },
                // },
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
                wharf_ref_no: null,
                delivery_from: null,
                delivery_to: null,
                due_from: null,
                due_to: null,
                wdn_from: null,
                wdn_to: null,
                wdn_no: null,
                po_no: null,
                invoice_no: null,
                debit_status: null,
                debit_status_id: null,
                debit_note_number: null,
                shipment_status: null,
                shipment_status_id: null,
                shipment_no: null,
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                status: ["CANCELED"],
                debit_note_type: "Imports",
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
                type: "Foreign",
                status: ["CANCELED"],
                // item_id: this.props.match.params.item_id
                // item_id: this.props.match.params.item_id
            },

            all_Suppliers: [],
            all_manufacture: [],

            formSingleData: {
                order_qty: null,
                po_by: "HOSPITAL",
                order_no: null,
                supplier_id: null,
                manufacture_id: null,
                lp_request_id: null,
                order_date: null,
                status: "Active",
                type: "lprequest",
                created_by: null,
                order_date_to: null,
                no_of_items: null,
                estimated_value: null,
                order_for_year: null,
                order_items: [],
                agent_id: 'd13941b2-7b77-42e7-ae5a-f07f9143a5dc',

                currency: "LKR",
                indent_no: null,
                // item_id: this.props.match.params.item_id
            },
        }
        // this.loadSingleLPData = this.loadSingleLPData.bind(this)
        this.loadSingleLPData = () => {
            this.loadSingleLPData.bind(this)
        };
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let formData = this.state.filterData;
        // const formData = { ...this.state.formData, status: ['APPROVED'], type: "LOCAL" }
        const formData = { ...this.state.filterData }

        let res = await SPCServices.getAllDebitNotes(formData)

        if (res.status === 200) {
            console.log('LDCN Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
    }

    loadSingleData = async (id) => {
        this.setState({ single_loading: false, open: false });
        let res = await SPCServices.getAllDebitNoteByID(id)

        if (res.status === 200) {
            console.log('WDN Single Data: ', res.data.view);
            this.setState({ single_data: res.data.view })
        }

        this.setState({ single_loading: true, open: true })
    }

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

    loadItemData = async () => {
        let formData = this.state.filterData
        if (formData.item_name && formData.item_name.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.item_name,/*  is_prescrible: "true", limit: 10, page: 0, */ 'order[0]': ['sr_no', 'ASC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
            }
        } else if (formData.sr_no && formData.sr_no.length > 3) {
            let res = await InventoryService.fetchAllItems({ search: formData.sr_no,/*  is_prescrible: "true", limit: 10, page: 0,  */'order[0]': ['sr_no', 'ASC'] })
            if (res.status === 200) {
                this.setState({ itemList: res.data.view.data });
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

    getDebitNoteStatus = async () => {

        let res = await SPCServices.getAllDebitNotes(this.state.filterData)

        if (res.status === 200) {
            let list = res.data.view.data.map((dataset) => dataset?.status)
            let uniquitemslist = [...new Set(list)]

            console.log('chcking uniq list', uniquitemslist)
            this.setState({ Debut_note_status_List: uniquitemslist })
        }
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
            return accumulator + item.order_qty;
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
            this.getDebitNoteStatus()
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.filterData.item_name !== this.state.filterData.item_name || prevState.filterData.sr_no !== this.state.filterData.sr_no) {
            this.loadItemData();
        } if (prevState.storedData !== this.state.storedData) {
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


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                {/* Filtr Section */}
                <ValidatorForm
                    className="pt-2"
                    onSubmit={() => this.setPage(0)}
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
                                        <Grid item className='w-full' lg={12} md={12} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="WDN Number" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Enter WDN Number"
                                                        name="wdn_no"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .wdn_no
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
                                                                    wdn_no:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="PO Number" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Enter PO Number"
                                                        name="po_no"
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
                                                    // validators={[
                                                    //     'required',
                                                    // ]}
                                                    // errorMessages={[
                                                    //     'this field is required',
                                                    // ]}
                                                    />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Invoice Number" />
                                                    <TextValidator
                                                        className=" w-full"
                                                        placeholder="Enter Invoice Number"
                                                        name="sr_no"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.filterData
                                                                .invoice_no
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
                                                                    invoice_no:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
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
                                        {/* <Grid
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
                                                <div style={{ flex: 1 }}>
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
                                                <div style={{ flex: 1 }}>
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
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="WDN Date" />
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }} className='mr-2'>
                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.filterData.wdn_from
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
                                                            filterData.wdn_from = date
                                                            this.setState({ filterData })
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <DatePicker
                                                        className="w-full"
                                                        value={
                                                            this.state.filterData.wdn_to
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
                                                            filterData.wdn_to = date
                                                            this.setState({ filterData })
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </Grid> */}
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="WHARF Ref Number" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Enter WHARF Ref Number"
                                                name="shipment_no"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.filterData
                                                        .shipment_no
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
                                                            shipment_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Shipment Number" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Enter Shipment Number"
                                                name="wharf_ref_no"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.filterData
                                                        .wharf_ref_no
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
                                                            wharf_ref_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Debit Note Number" />
                                            <TextValidator
                                                className=" w-full"
                                                placeholder="Enter Debit Note Number"
                                                name="debit_note_no"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.filterData
                                                        .debit_note_no
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
                                                            debit_note_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }}
                                            />
                                        </Grid>
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Debit Note Status" />
                                            <AddInput
                                                options={[]}
                                                val={this.state.filterData.debit_status}
                                                getOptionLabel={(option) => option.name || ""}
                                                text='Enter Debit Note Status'
                                                onChange={(e, value) => {
                                                    const newFormData = {
                                                        ...this.state.filterData,
                                                        debit_status: e.target.textContent ? e.target.textContent : e.target.value,
                                                        debit_status_id: value ? value.id : null,
                                                    };

                                                    this.setState({ filterData: newFormData });
                                                }
                                                }
                                            />
                                        </Grid> */}
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Shipment Status" />
                                            <AddInput
                                                options={this.state.Debut_note_status_List}
                                                val={this.state.filterData.shipment_status}
                                                getOptionLabel={(option) => option}
                                                text='Enter Shipment Status'
                                                onChange={(e, value) => {
                                                    const newFormData = {
                                                        ...this.state.filterData,
                                                        shipment_status: value,
                                                        // shipment_status_id: value ? value.id : null,
                                                    };

                                                    this.setState({ filterData: newFormData });
                                                }
                                                }
                                            />
                                        </Grid> */}
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
                                                    <Button
                                                        className="mt-2 ml-2"
                                                        progress={false}
                                                        type="button"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon="format_paint"
                                                        onClick={() => {

                                                            let filterData = this.state.filterData
                                                            filterData = {
                                                                ...this.state.filterData,
                                                                wharf_ref_no: "",
                                                                delivery_from: "",
                                                                delivery_to: "",
                                                                due_from: "",
                                                                due_to: "",
                                                                wdn_from: "",
                                                                wdn_to: "",
                                                                wdn_no: '',
                                                                po_no: "",
                                                                invoice_no: "",
                                                                debit_status: "",
                                                                debit_status_id: "",
                                                                debit_note_number: "",
                                                                shipment_status: "",
                                                                shipment_status_id: "",
                                                                shipment_no: "",
                                                                limit: 20,
                                                                page: 0,
                                                                'order[0]': ['updatedAt', 'DESC'],
                                                                status: ["CANCELED"],
                                                                debit_note_type: "Imports",

                                                            }

                                                            this.setState({
                                                                filterData: filterData,
                                                                selectedStatus: '',
                                                            }, () => {
                                                                this.loadData()
                                                            })
                                                        }}
                                                    >
                                                        <span className="capitalize">
                                                            Clear Filters
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
                                        id={'allDebitNotes'}
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
                                                        break;
                                                    case 'changeRowsPerPage':
                                                        this.setState({
                                                            filterData: {
                                                                ...this.state.filterData,
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
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="xl"
                    open={this.state.viewDet}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="View Debit Note - WDN" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ viewDet: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <DelailsView sequence={this.state.sequence} selected_data={this.state.selected_id} storeData={this.handleDataStore} handleReject={() => this.setState({ rejectOpen: true })} handleClose={() => this.setState({ viewDet: false })} submitOpen={() => this.setState({ forwardOpen: true })} />
                    </div>
                </Dialog>
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="xl"
                    open={this.state.open}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Debit Note Creation - LDCN" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ open: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <LocalDetails sequence={this.state.sequence} selected_data={this.state.selected_id} data={this.state.selected_data} storeData={this.handleDataStore} handleReject={() => this.setState({ rejectOpen: true })} handleClose={() => this.setState({ open: false })} submitOpen={() => this.setState({ forwardOpen: true })} />
                    </div>
                </Dialog>
                <Dialog fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.forwardOpen}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Confirmation Dailog" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ forwardOpen: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure to finish and forward the Debit Note?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ forwardOpen: false })
                            }}>No</Button>
                            <Button onClick={() => {
                                this.setState({ forwardOpen: false, isForward: true })
                            }} autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <Dialog fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.rejectOpen}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        <CardTitle title="Confirmation Dailog" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ rejectOpen: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4 pb-5">
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure to reject the Debit Note?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ rejectOpen: false })
                            }}>No</Button>
                            <Button onClick={() => {
                                this.setState({ rejectOpen: false, isReject: true })
                            }} autoFocus>
                                Yes
                            </Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <Dialog fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.isForward}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
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
                                {this.state.sequence === 0 ? "You have successfully forwarded the Debit Note to the supervisor" : this.state.sequence === 1 ? "You have successfully forwarded the Debit Note to the Manager" : "You have successfully approved the Debit Note"}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            {this.state.sequence === 0 &&
                                <Button
                                    startIcon="print"
                                    onClick={() => {
                                        this.setState({ isForward: false, open: false })
                                    }}>Print Draft</Button>
                            }
                            <Button onClick={() => {
                                this.setState({ isForward: false, open: false })
                            }}>Cancel</Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <Dialog fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.isReject}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
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
                                You have successfully rejected the Debit Note and returned it
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ isReject: false, open: false })
                            }}>Done</Button>
                        </DialogActions>
                    </div>
                </Dialog>
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

export default withStyles(styleSheet)(CanceledDebitNotes)
