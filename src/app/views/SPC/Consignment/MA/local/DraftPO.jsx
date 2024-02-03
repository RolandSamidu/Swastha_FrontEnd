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
    DialogActions,
    DialogTitle
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
import * as appConst from '../../../../../../appconst'
import SearchIcon from '@mui/icons-material/Search';
import { convertTocommaSeparated, dateParse } from 'utils'

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

import LocalDetails from './IndividualDetails'
// import LocalPortDetails from './PortIndividualDetails'
import SPCServices from 'app/services/SPCServices'
import EmployeeServices from 'app/services/EmployeeServices'

import LDCNPrint from '../../print/LDCNPrint'

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

class ApprovalPO extends Component {
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
            cancelOpen: false,
            forwardOpen: false,
            isReject: false,
            isForward: false,
            sequence: 0,
            approval_data: null,
            selected_data: null,
            isApprove: false,

            itemList: [],
            ploaded: false,
            POData: {},
            purchaseOrderData: {},
            printLoaded: false,

            // single_data:{},
            single_data: [],
            selected_id: null,
            collapseButton: 0,
            userRoles: [],

            data: [],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let data = this.state?.approval_data ? this.state.approval_data[tableMeta.rowIndex] : null;
                            let id = this.state.data[tableMeta.rowIndex]?.id;
                            return (
                                <>
                                    <Tooltip title={this.state.userRoles.includes('SPC Supervisor') ? "Approve LDCN" : 'View LDCN'}>
                                        <IconButton
                                            className="text-black"
                                            onClick={() => {
                                                // window.location = `/spc/wdn_consignment_list/123`
                                                this.setState({ selected_id: id, selected_data: data }, () => {
                                                    this.loadSingleData(id)
                                                })
                                            }}
                                        >
                                            <Icon color='primary'>visibility</Icon>
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Print LDCN">
                                        <IconButton
                                            className="text-black"
                                            onClick={() => {
                                                this.setState({ selected_id: id, selected_data: data }, () => {
                                                    this.printData(id)
                                                })
                                                // window.location = `/spc/wdn_consignment_list/123`
                                                // this.setState({ sequence: sequence, approveOpen: true }, () => {
                                                //     // this.loadSingleData(id)
                                                // })
                                            }}
                                        >
                                            <Icon color='primary'>print</Icon>
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'wdn_no', // field name in the row object
                    label: 'LDCN No', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'ldcn_ref_no', // field name in the row object
                    label: 'Shipment No', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'po_no', // field name in the row object
                    label: 'PO No', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'shipment_no', // field name in the row object
                    label: 'WHARF REF No', // column title that will be shown in table
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'invoice_no',
                    label: 'Invoice No',
                    options: {
                        display: true,
                    },
                },
                {
                    name: 'createdBy',
                    label: 'Created By',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.Create ? this.state.data[tableMeta.rowIndex]?.Create?.name : 'N/A'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'createdAt',
                    label: 'Date Created',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.data[tableMeta.rowIndex]?.createdAt ? dateParse(this.state.data[tableMeta.rowIndex]?.createdAt) : 'N/A'}</p>
                            )
                        }
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        display: true,
                        // filter: true,
                    },
                },
            ],

            alert: false,
            message: '',
            severity: 'success',

            // loading: false,
            // single_loading: false,

            loading: true,
            single_loading: true,

            totalItems: 0,

            filterData: {
                po_no: null,
                invoice_no: null,
                wdn_no: null,
                ldcn_ref_no: null,
                shipment_no: null,
                limit: 20,
                page: 0,
                type: "Local",
                status: ["Draft", "Pending", 'New'],
                'order[0]': ['updatedAt', 'DESC'],
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
                status: ["Draft", "Pending", 'New'],
                type: "Local"
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
        this.loadSingleData = this.loadSingleData.bind(this)
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        let formData = this.state.filterData;
        // const formData = { ...this.state.formData, status: ['APPROVED'], type: "LOCAL" }
        if (this.state.userRoles.includes('SPC Supervisor')) {
            let res = await SPCServices.getConsignmentApprovals({ ...formData, type: 'Local', status: "Pending", approval_user_type: this.state.userRoles })

            if (res.status === 200) {
                console.log('LDCN Approval Data: ', res.data.view.data);
                this.setState({ data: res.data.view.data.map(item => item.Consignment), totalItems: res.data.view.totalItems, approval_data: res.data.view.data })
            }
        } else {
            let res = await SPCServices.getConsignment({ ...formData, type: 'Local' })
            if (res.status === 200) {
                console.log('LDCN Data: ', res.data.view.data);
                this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
            }
        }

        this.setState({ loading: true, ploaded: false })
    }

    loadSingleData = async (id) => {
        this.setState({ single_loading: false, open: false, approveOpen: false });

        let res = await SPCServices.getConsignmentByID(id)

        if (res.status === 200) {
            console.log('SPC Single Data: ', res.data.view);
            this.setState({ single_data: res.data.view })
        }

        this.setState({ single_loading: true, open: true, approveOpen: true, })
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

    async submitData() {

    }

    onSubmit = async (status, remark, data) => {
        let userRoles = await localStorageService.getItem('userInfo')?.roles
        let id = await localStorageService.getItem('userInfo')?.id
        let owner_id = await localStorageService.getItem('owner_id')
        let params = {
            spc_approval_config_id: this.state.selected_data?.spc_approval_config_id,
            id: this.state.selected_data?.id,
            consignment_id: this.state.selected_data?.consignment_id,
            approved_by: id,
            type: status,
            approval_type: `${userRoles[0]} ${status}`,
            approval_user_type: userRoles[0],
            supervisor_remark: remark,
            remark: remark,
            owner_id: owner_id,
            sequence: this.state.selected_data?.sequence,
            status: status,
        }
        try {
            let consignment_res = await SPCServices.changeConsignmentByID(this.state.selected_data?.consignment_id, { supervisor_remark: remark });
            let approval_res = await SPCServices.changeConsignmentApproval(this.state.selected_data?.id, params);

            if (consignment_res.status === 200 && approval_res.status === 200) {
                this.setState(
                    {
                        alert: true,
                        message: "SPC Consignment Approval was Successful",
                        severity: "success",
                        open: false,
                        isReject: status === "REJECTED",
                        isForward: status !== "REJECTED",
                        isApprove: true,
                    },
                    () => {
                        this.loadData();
                    }
                );
            } else {
                this.setState({
                    alert: true,
                    message: "SPC Consignment Approval was Unsuccessful",
                    severity: "error",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            this.setState({
                alert: true,
                message: "An error occurred during SPC Consignment Approval",
                severity: "error",
            });
        }
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

    async printData(id) {
        try {
            this.setState({ printLoaded: false, ploaded: false });
            let consignmentData = {}
            const consignment_res = await SPCServices.getConsignmentByID(id);

            if (consignment_res.status !== 200) {
                console.error("Error fetching consignment:", consignment_res);
                return;
            }

            let aprovalData = await SPCServices.getConsignmentApprovals({ consignment_id: id })
            if (aprovalData.status == 200) {

                consignmentData = { approvalData: aprovalData.data.view.data[0] }
                console.error("aprovalData:", aprovalData);
            }

            const po_res = await SPCServices.getAllPurchaseOrders({ po_no: consignment_res.data.view?.po_no });
            const po_res_single = await SPCServices.getPurchaseOrderByID(po_res.data.view.data?.[0]?.id);

            // Add error handling for the po_res status
            if (po_res.status !== 200 && po_res_single.status !== 200) {
                console.error("Error fetching purchase orders:", po_res);
                return;
            }

            // Load item data
            await this.loadItemData(consignment_res.data.view);
            await this.getUser();

            this.setState({
                ploaded: true,
                POData: po_res_single.data.view,
                purchaseOrderData: { ...consignment_res.data.view, ...consignmentData },
                printLoaded: true,
            }, () => {
                document.getElementById('ldcn_print').click();
                this.loadData()
            });
        } catch (error) {
            console.error("An error occurred:", error);
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

    componentDidMount() {
        let roles = localStorageService.getItem('userInfo')?.roles
        this.setState({
            roles: roles[0],
            userRoles: roles
        }, () => {
            this.loadData()
        })
    }

    // componentDidUpdate(prevProps, prevState) {
    //     if (prevState.filterData.item_name !== this.state.filterData.item_name || prevState.filterData.sr_no !== this.state.filterData.sr_no) {
    //         this.loadItemData();
    //     }
    // }


    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
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
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        <IconButton onClick={() => { this.loadData() }}>
                                                                            <SearchIcon />
                                                                        </IconButton>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
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
                                                <SubTitle title="Invoice No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Enter Invoice Number"
                                                    name="invoice_no"
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
                                                <SubTitle title="LDCN No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Enter LDCN Number"
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
                                                <SubTitle title="Shipment No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Enter Shipment No"
                                                    name="wharf_ref_no"
                                                    InputLabelProps={{
                                                        shrink: false,
                                                    }}
                                                    value={
                                                        this.state.filterData
                                                            .ldcn_ref_no
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
                                                                ldcn_ref_no:
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
                                                sm={6}
                                                xs={12}
                                            >
                                                {/* DEV Note -> wharf_ref_no has been mapped to shipment_no */}
                                                <SubTitle title="WHARF Ref No" />
                                                <TextValidator
                                                    className=" w-full"
                                                    placeholder="Enter WHARF Ref No"
                                                    name="wharf_ref_no"
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
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                item
                                                lg={8}
                                                md={8}
                                                sm={6}
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
                </div>
                {this.state.ploaded &&
                    // <PurchaseOrderList />
                    <LDCNPrint purchaseOrderData={this.state.purchaseOrderData} POData={this.state.POData} ItemData={this.state.itemList} hospital={this.state.hospital} user={this.state.user} />
                }
                <Dialog
                    fullWidth={true}
                    maxWidth="xl"
                    open={this.state.approveOpen}>
                    <MuiDialogTitle disableTypography="disableTypography" className={classes.Dialogroot}>
                        {/* {this.state.sequence === 0 ? */}
                        <CardTitle title="LDCN Individual Details" />
                        {/* :
                            <CardTitle title="LCDN Individual Port Details" />
                        } */}
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({ approveOpen: false })
                            }}>
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <div className="w-full h-full px-4">
                        {/* {this.state.sequence === 0 ? */}
                        <LocalDetails
                            isEdit={this.state.userRoles.includes("SPC MA")}
                            isResubmit={false} data={this.state.single_data}
                            id={this.state.selected_id}
                            handleClose={() => {
                                this.setState({ approveOpen: false }, () => {
                                    this.loadData()
                                })
                            }}
                            onSubmit={(status, remark, data) => { this.onSubmit(status, remark, data) }}
                            handleReject={() => this.setState({ rejectOpen: true })}
                            handleCancel={() => {
                                console.log("cacel")
                                this.setState({ cancelOpen: true })
                            }}
                        />
                        {/* <LocalPortDetails data={this.state.single_data} handleClose={() => this.setState({ approveOpen: false })} submitOpen={() => this.setState({ forwardOpen: true })} handleReject={() => this.setState({ rejectOpen: true })} />
                    } */}
                    </div>
                </Dialog>
                <Dialog fullWidth={true}
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
                                You have successfully forwarded the LDCN
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ isForward: false, approveOpen: false })
                            }}>Done</Button>
                        </DialogActions>
                    </div>
                </Dialog>
                <Dialog fullWidth={true}
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
                                You have rejected the LDCN and returned it
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {
                                this.setState({ isReject: false, open: false, approveOpen: false })
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

export default withStyles(styleSheet)(ApprovalPO)
