import React, { Component, Fragment, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator'
import {
    Grid,
    Divider,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Checkbox,
    Button
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'
import CloseIcon from '@material-ui/icons/Close';

import {
    DatePicker,
    LoonsSnackbar,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../../../appconst'
import { convertTocommaSeparated, roundDecimal } from 'utils'
import ConfirmationDialog from 'app/components/ConfirmationDialog/ConfirmationDialog'

import EmployeeServices from 'app/services/EmployeeServices'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import SaveIcon from '@mui/icons-material/Save';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import localStorageService from 'app/services/localStorageService';
import ReactToPrint from 'react-to-print';

import WDNPrint from '../../print/WDNPrint'
import SPCServices from 'app/services/SPCServices'
import { isNull, isUndefined } from 'lodash'
import { Chip } from '@mui/material'


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

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null, disable = true, require = false }) => (
    <TextValidator
        className=" w-full"
        disabled={disable}
        placeholder={`⊕ ${text}`}
        // name="issued_amount"
        InputLabelProps={{
            shrink: false,
        }}
        value={String(val)}
        type="number"
        variant="outlined"
        size="small"
        min={0}
        onChange={onChange}
        validators={
            require ? ['minNumber:' + 0, 'required:' + true] : []}
        errorMessages={require ? [
            'Value Should be > 0',
            'this field is required'
        ] : []}
    />
)

const renderDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={4} xs={4}>
                <Grid container spacing={2}>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                        <Typography variant="subtitle1">
                            {label}
                        </Typography>
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}>
                        <Typography variant="subtitle1">:</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={8} md={8} sm={8} xs={8}>
                <Typography variant="subtitle1">
                    {value}
                </Typography>
            </Grid>
        </Grid>
    )
}

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null, disable = true, require = false }) => (
    <DatePicker
        className="w-full"
        value={val}
        //label="Date From"
        disabled={disable}
        placeholder={`⊕ ${text}`}
        // minDate={new Date()}
        format='dd/MM/yyyy'
        //maxDate={new Date("2020-10-20")}
        required={require}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null, disable = true, require = false }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        disabled={disable}
        InputLabelProps={{
            shrink: false,
        }}
        value={val}
        type="text"
        variant="outlined"
        size="small"
        onChange={onChange}
        validators={require ? [
            'required',
        ] : []}
        errorMessages={require ? [
            'this field is required',
        ] : []}
    />
)

const AddInput = ({ options, getOptionLabel, onChange = (e) => e, val = "", text = "Add", tail = null, disable = true, require = false }) => {
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
            disabled={disable}
            onChange={onChange}
            value={val}
            size='small'
            renderInput={(params) => (
                <div ref={params.InputProps.ref} style={{ display: 'flex', position: 'relative' }}>
                    <input type="text" {...params.inputProps}
                        style={{ marginTop: '5px', padding: '6.2px 10px', border: '1px solid #e5e7eb', borderRadius: 4 }}
                        placeholder={`⊕ ${text}`}
                        onChange={onChange}
                        value={val}
                        required={require}
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

class IndividualDetails extends Component {
    constructor(props) {
        super(props)
        this.componentRef = React.createRef();
        this.state = {
            activeStep: 1,
            role: null,
            checked: false,
            supervisor_remark: null,
            isEdit: this.props.isEdit,

            // single_data:{},
            data: {},
            itemList: [],
            itemData: [],

            ploaded: false,
            POData: {},
            purchaseOrderData: {},
            deliveryData: [],
            printLoaded: false,


            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // let id = this.state.data[tableMeta.rowIndex].id
                            return (
                                <>
                                    {this.state.itemList[tableMeta.rowIndex].selected && this.state.isEdit && this.state.filterData.status !== "APPROVED" ?
                                        this.state.itemList[tableMeta.rowIndex]?.edit_selected ?
                                            <Tooltip title="Save PO">
                                                <IconButton
                                                    className="text-black mr-2"
                                                    onClick={() => {
                                                        this.selectRow(tableMeta.rowIndex)
                                                        this.updateConsignmentItems(tableMeta.rowIndex)
                                                        // window.location = `/spc/wdn_consignment_list/123`
                                                        // this.setState({ approveOpen: true })
                                                    }}
                                                >
                                                    <Icon color='primary'>save</Icon>
                                                </IconButton>
                                            </Tooltip>
                                            :
                                            <Tooltip title="Edit PO">
                                                <IconButton
                                                    className="text-black mr-2"
                                                    onClick={() => {
                                                        this.selectRow(tableMeta.rowIndex)
                                                        // window.location = `/spc/wdn_consignment_list/123`
                                                        // this.setState({ approveOpen: true })
                                                    }}
                                                >
                                                    <Icon color='primary'>edit</Icon>
                                                </IconButton>
                                            </Tooltip>
                                        : <Tooltip title="Selection Disabled">
                                            <IconButton
                                                className="text-black mr-2"
                                                onClick={() => {
                                                    // this.selectRow(tableMeta.rowIndex)
                                                    // window.location = `/spc/wdn_consignment_list/123`
                                                    // this.setState({ approveOpen: true })
                                                    this.setState({ alert: true, severity: "info", message: "It appears that either the Subject Clerk has not added this item, or you may not have the necessary permissions to make edits." })
                                                }}
                                            >
                                                <Icon color='primary'>block</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'sequence', // field name in the row object
                    label: 'Sequence', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{tableMeta.rowIndex + 1}</p>
                            );
                        }
                    },
                },
                {
                    name: 'sr_no',
                    label: 'Sr No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap ? this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap?.sr_no : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'item_name',
                    label: 'Description',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap ? this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap?.medium_description : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'order_quantity',
                    label: 'Ordered Quantity',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.quantity ? this.state.itemList[tableMeta.rowIndex]?.quantity : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            const allocatedQuantity = parseInt(this.state.itemData[tableMeta.rowIndex]?.allocated_quantity ?? 0, 10);
                            const transitQuantity = parseInt(this.state.itemData[tableMeta.rowIndex]?.transit_quantity ?? 0, 10);

                            return <p>{allocatedQuantity - transitQuantity}</p>
                        }
                    },
                },
                {
                    name: 'unit_type',
                    label: 'UOM',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.unit_type ? this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.unit_type : "N/A"}</p>
                        }
                    },
                },
                {
                    name: 'per',
                    label: 'Per',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.unit ? this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.unit : "N/A"}</p>
                        }
                    },
                },
                {
                    name: 'unit',
                    label: 'Item Price',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.price ? convertTocommaSeparated(this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.price, 4) : "N/A"}</p>)
                        }
                    },
                },
                {
                    name: 'transit_qty',
                    label: 'Transit Quantity',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            const allocatedQuantity = parseInt(this.state.itemData[tableMeta.rowIndex]?.allocated_quantity ?? 0, 10);
                            const transitQuantity = parseInt(this.state.itemData[tableMeta.rowIndex]?.transit_quantity ?? 0, 10);
                            const quantity = parseInt(this.state.itemData[tableMeta.rowIndex]?.quantity ?? 0, 10);

                            const itemRemaining = allocatedQuantity - transitQuantity;

                            return (
                                <TextValidator
                                    className='w-full'
                                    placeholder="Transit Quantity"
                                    //variant="outlined"
                                    disabled={!this.state.itemList[tableMeta.rowIndex]?.edit_selected}
                                    // disabled={isadded.length == 1 ? false : true}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type='number'
                                    min={0}
                                    value={
                                        // this.state.selectedData[this.state.selectedData.indexOf(isadded[0])]?.qty
                                        String(this.state.itemList[tableMeta.rowIndex]?.transit_quantity ?? 0)
                                    }
                                    onChange={(e, value) => {
                                        const { itemList } = this.state;
                                        const newData = [...itemList];
                                        newData[tableMeta.rowIndex].transit_quantity = e.target.value !== "" ? parseInt(e.target.value, 10) : 0;
                                        this.setState({ itemList: newData });
                                    }}

                                    validators={[
                                        'required', 'minNumber: 0', "maxNumber: " + quantity - itemRemaining
                                    ]}
                                    errorMessages={[
                                        'this field is required', 'Quantity Should Greater-than: 0 ', "Over Quantity"
                                    ]}
                                />
                            )
                        },
                    }
                },
                {
                    name: 'remaining_qty',
                    label: 'Remaining Quantity',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{
                                    (() => {
                                        const quantity = parseInt(this.state.itemList[tableMeta.rowIndex]?.quantity, 10) || 0;
                                        const transitQuantity = parseInt(this.state.itemList[tableMeta.rowIndex]?.transit_quantity, 10) || 0;

                                        const itemAllocatedQuantity = parseInt(this.state.itemData[tableMeta.rowIndex]?.allocated_quantity || 0);
                                        const itemTransitQuantity = parseInt(this.state.itemData[tableMeta.rowIndex]?.transit_quantity || 0);

                                        const itemRemainingQuantity = itemAllocatedQuantity - itemTransitQuantity
                                        const remainingQuantity = Math.max(quantity - transitQuantity - itemRemainingQuantity, 0);

                                        return isNaN(remainingQuantity) ? 'N/A' : remainingQuantity;
                                    })()
                                }</p>
                            )
                        }
                    },
                },
            ],

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            all_Suppliers: [],
            selected_id: null,

            ploaded: false,
            printLoaded: false,
            user: {},
            supplier: {},
            purchaseOrderData: {},
            hospital: {},

            loading: false,
            // single_loading: false,
            filterData: {},

            verified: {
                wharf_ref_no: false,
                invoice_no: false,
                invoice_date: false,
                lc_no: false,
                flight_name: false,
                flight_no: false,
                vessel_date: false,
                weight: false,
                fcl_table: false,
                total_packages: false,
                dispatch_date: false,
                clearance_date: false,
                departure_port: false,
                departure_date: false,
                arrival_port: false,
                arrival_date: false,
                company: false,
                bl_no: false,
                bl_date: false,
                currency_rate: false,
                order_amount: false,
                currency_type: false,
                cid: false,
                pal: false,
                ssl: false,
                cess: false,
                sc: false,
                custom: false,
                scl: false,
                sel: false,
                com: false,
                exm: false,
                otc: false,
                sel: false,
                other: false
            },

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },

            currency_types: [
                { label: "LKR" },
                { label: "INR" },
                { label: "USD" },
            ],

            transitQty: 0,
            transitExchageTotal: 0,
            transitLKRTotal: 0,
            orderQty: 0,
            orderLKRTotal: 0,
            orderExchageTotal: 0,
            allocatedQty: 0,
            allocatedLKRTotal: 0,
            allocatedExchangeTotal: 0,

            configOpen: false,
            approvalStatus: '',
            approvalName: '',
            isSave: false,
            updateOpen: false,
            resubmitOpen: false,
            cancelOpen: false,
            cancelStatus: ["New", "APPROVED"]
        }

        this.formRef = React.createRef();
    }

    openConfirmAlert = async (status, name) => {
        if (this.state.checked && name === "Approved") {
            this.setState({ supervisor_remark: "", approvalStatus: status, approvalName: name, configOpen: true })
        } else if (!this.state.checked && name === "Reject" && this.state.supervisor_remark !== "" && !isNull(this.state.supervisor_remark)) {
            this.setState({ approvalStatus: status, approvalName: name, configOpen: true });
        } else {
            this.setState({ alert: true, severity: "info", message: "Field Management: To reject a field, click the adjacent checkbox. For approval, click the pre-checked checkbox" })
        }
    }

    selectRow = (index) => {
        this.setState(prevState => {
            const newData = [...prevState.itemList]; // Create a new array
            newData[index] = { ...newData[index], edit_selected: !newData[index].edit_selected };
            return { itemList: newData };
        }, () => {
            console.log("Selected Data :", this.state.itemList);
        });
    }

    handleDeselectAll = () => {
        this.setState(prevState => ({
            itemList: prevState.itemList.map(item => ({ ...item, edit_selected: false }))
        }));
    }

    loadData = async () => {
        //function for load initial data from backend or other resources
        this.setState({ loading: false });
        // let formData = this.state.filterData;
        // const formData = { ...this.state.formData, status: ['APPROVED'], type: "LOCAL" }
        const formData = { ...this.state.formData }

        let id = 2020

        let res = await SPCServices.getConsignmentByID(id)

        if (res.status === 200) {
            console.log('WDN Data: ', res.data.view.data);
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems })
        }

        this.setState({ loading: true })
    }

    loadApprovalData = async () => {
        const { data } = this.props;
        let userRoles = await localStorageService.getItem('userInfo')?.roles;
        const params = { consignment_id: data?.id, approval_user_type: userRoles, status: 'Pending', approval_type: this.props.isResubmit ? "RESUBMISSION" : "" };
        let res = await SPCServices.getConsignmentApprovals(params);

        if (res.status === 200) {
            const approvalData = res.data.view.data.length > 0 ? res.data.view.data[0] : {};
            console.log('LDCN Approval Data: ', approvalData);

            this.setState({ approvalData: approvalData });
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

    loadItemData = async () => {
        const { data } = this.props
        try {
            const spcConsignmentItems = data?.SPCConsignmentItems;
            const consignmentItemIds = spcConsignmentItems.map(item => ({ id: item.id, item_id: item.item_id }));

            if (Array.isArray(spcConsignmentItems) && spcConsignmentItems.length > 0) {
                let itemResponse = await SPCServices.getAllSPCPODeliverySchedules({ spc_po_id: spcConsignmentItems[0].spc_po_id });
                const initialArray = itemResponse.data.view.data;
                const newArray = initialArray.map(item => {
                    const matchingIndex = consignmentItemIds.findIndex(obj => obj.item_id === item.id);

                    if (matchingIndex !== -1) {
                        return {
                            ...item,
                            selected: true,
                            id: spcConsignmentItems[matchingIndex]?.id ? spcConsignmentItems[matchingIndex]?.id : null,
                            transit_quantity: spcConsignmentItems[matchingIndex]?.transit_quantity ? spcConsignmentItems[matchingIndex]?.transit_quantity : '0'
                        };
                    } else {
                        return {
                            ...item,
                            id: null,
                            selected: false,
                            transit_quantity: '0'
                        };
                    }
                });
                this.setState({ itemList: newArray, itemData: newArray });
            } else {
                this.setState({ alert: true, severity: "info", message: "Info: Seems that you haven't add Item Details" })
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ alert: true, severity: "error", message: `Error: ${error}` })
        }
    };

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

    handleRowCountChange = (event) => {
        const { value } = event.target;
        const newRowCount = parseInt(value, 10);
        const { fcl_value, fcl_table_values } = this.state.filterData.vessel_details[0];

        if (!isNaN(newRowCount)) {
            if (newRowCount < fcl_value) {
                // const updatedValues = fcl_table_values.slice(0, newRowCount);
                this.setState(prevState => {
                    const updatedValues = prevState.filterData.vessel_details[0].fcl_table_values.slice(0, newRowCount);
                    const updatedFilterData = {
                        ...prevState.filterData,
                        vessel_details: [
                            {
                                ...this.state.filterData.vessel_details[0],
                                fcl_value: newRowCount,
                                fcl_table_values: updatedValues,
                            }]
                    };

                    return {
                        filterData: updatedFilterData,
                    };
                });
                // this.setState({
                //     fcl_value: newRowCount,
                //     fcl_table_values: updatedValues,
                // });
            } else {
                const emptyRow = { container_type: '', container_number: '', container_load: '' };
                const updatedValues = [...fcl_table_values];
                for (let i = fcl_value; i < newRowCount; i++) {
                    updatedValues.push(emptyRow);
                }

                this.setState(prevState => {
                    const updatedFilterData = {
                        ...prevState.filterData,
                        vessel_details: [
                            {
                                ...this.state.filterData.vessel_details[0],
                                fcl_value: newRowCount,
                                fcl_table_values: updatedValues,
                            }]
                    };

                    return {
                        filterData: updatedFilterData,
                    };
                });

                // this.setState({
                //     fcl_value: newRowCount,
                //     fcl_table_values: updatedValues,
                // });
            }
        } else {
            // this.setState({
            //     fcl_value: 0,
            //     fcl_table_values: [],
            // });
            this.setState(prevState => {
                const updatedFilterData = {
                    ...prevState.filterData,
                    vessel_details: [
                        {
                            ...this.state.filterData.vessel_details[0],
                            fcl_value: 0,
                            fcl_table_values: [],
                        }]
                };

                return {
                    filterData: updatedFilterData,
                };
            });
        }
    };

    handleInputChange = (e, val, rowIndex, columnName) => {
        const { value } = e.target;
        const { fcl_table_values } = this.state.filterData.vessel_details[0];
        const updatedValues = [...fcl_table_values];
        const updatedRow = { ...updatedValues[rowIndex] };
        if (isUndefined(val)) {
            updatedRow[columnName] = value;
        } else {
            updatedRow[columnName] = val?.label;
        }

        updatedValues[rowIndex] = updatedRow;
        this.setState(prevState => {
            const updatedFilterData = {
                ...prevState.filterData,
                vessel_details: [
                    {
                        ...this.state.filterData.vessel_details[0],
                        fcl_table_values: updatedValues,
                    }]
            };

            return {
                filterData: updatedFilterData,
            };
        });
        // this.setState({ fcl_table_values: updatedValues });

    };

    renderFCLTableRows = () => {
        const { fcl_value, fcl_table_values } = Array.isArray(this.state.filterData?.vessel_details) ? this.state.filterData?.vessel_details[0] : { fcl_value: 0, fcl_table_values: [] };
        // const fcl_table_values = Array.isArray(this.state.data.ConsigmentVesselData) ? this.state.data.ConsigmentVesselData?.[0]?.fcl_table_values : 0;
        const rows = [];
        for (let i = 0; i < fcl_value; i++) {
            const row = fcl_table_values[i];
            rows.push(
                <tr key={i} style={{ border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                    <td style={{ height: "40px", width: "25%" }}>
                        <AddInput options={[{ label: "20ft FCL" }, { label: "20ft FCL RF" }, { label: "40ft FCL" }, { label: "40ft FCL RF" }]} getOptionLabel={(option) => option.label || ""} disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e, val) => this.handleInputChange(e, val, i, 'container_type')} val={row.container_type || ""} text='Enter Container Type' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "25%" }}>
                        <AddTextInput disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e, val) => this.handleInputChange(e, val, i, 'container_number')} val={row.container_number || ""} text='Enter Container Number' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "25%" }}>
                        <AddInput disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} options={[{ label: "Full" }, { label: "Partial" }]} getOptionLabel={(option) => option.label || ""} onChange={(e, val) => this.handleInputChange(e, val, i, 'container_load')} val={row.container_load || ""} text='Enter Container Load' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "25%" }}>
                        <AddTextInput disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e, val) => this.handleInputChange(e, val, i, 'container_part')} val={row.container_part || ""} text='Enter Container Parts' type='text' />
                    </td>
                </tr>
            );
        }

        return rows;
    }

    renderNonFCLTableRows = () => {
        const { fcl_value, fcl_table_values } = Array.isArray(this.state.filterData?.vessel_details) ? this.state.filterData?.vessel_details[0] : { fcl_value: 0, fcl_table_values: [] };
        // const fcl_table_values = Array.isArray(this.state.data.ConsigmentVesselData) ? this.state.data.ConsigmentVesselData?.[0]?.fcl_table_values : 0;
        const rows = [];
        for (let i = 0; i < fcl_value; i++) {
            const row = fcl_table_values[i];
            rows.push(
                <tr key={i} style={{ border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                    <td style={{ height: "40px", width: "50%" }}>
                        <AddTextInput disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e, val) => this.handleInputChange(e, val, i, 'lorry_no')} val={row.lorry_no || ""} text='Enter Lorry No' type='text' />
                    </td>
                    <td style={{ height: "40px", width: "50%" }}>
                        <AddTextInput disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e, val) => this.handleInputChange(e, val, i, 'remark')} val={row.remark || ""} text='Enter Remark' type='text' />
                    </td>
                </tr>
            );
        }

        return rows;
    }

    async printData() {
        const { id } = this.props;
        try {
            this.setState({ printLoaded: false, ploaded: false });

            const consignment_res = await SPCServices.getConsignmentByID(id);

            if (consignment_res.status !== 200) {
                console.error("Error fetching consignment:", consignment_res);
                return;
            }

            const po_res = await SPCServices.getAllPurchaseOrders({ po_no: consignment_res.data.view?.po_no });
            const po_res_single = await SPCServices.getPurchaseOrderByID(po_res.data.view.data?.[0]?.id);

            // Add error handling for the po_res status
            if (po_res.status !== 200 && po_res_single.status !== 200) {
                console.error("Error fetching purchase orders:", po_res);
                return;
            }

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
                document.getElementById('wdn_print').click();
            });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async componentDidMount() {
        let userRoles = await localStorageService.getItem('userInfo')?.roles
        const { data, id } = this.props;
        console.log("data ---->>", data)
        const vesselDetails = data?.ConsigmentVesselData || []
        const consignmentCharges = data?.ConsigmentCharges || []

        const fcl_table_values = Array.isArray(vesselDetails?.[0]?.fcl_table_values)
            ? vesselDetails?.[0]?.fcl_table_values
            : JSON.parse(vesselDetails?.[0]?.fcl_table_values || '[]');

        const fcl_value = vesselDetails?.[0]?.fcl_value ? vesselDetails?.[0]?.fcl_value : 0;

        const updatedFilterData = {
            ...data,
            vessel_details: [
                {
                    ...vesselDetails?.[0],
                    fcl_table_values: fcl_table_values,
                    fcl_value: fcl_value,
                },
                ...vesselDetails.slice(1),
            ],

            charges: [
                {
                    ...consignmentCharges?.[0],
                },
                ...consignmentCharges.slice(1)
            ]
        }

        this.setState({ filterData: updatedFilterData, selected_id: id, userRoles: userRoles, loading: false }, async () => {
            await this.loadItemData()
            await this.loadApprovalData()
            const transit_qty = this.handleTransitQuantity();
            const order_qty = this.handleOrderQuantity();
            const order_lkr = this.handleOrderLKRTotal();
            const order_exchange = this.handleOrderExchangeTotal();
            const transit_lkr = this.handleTransitLKRTotal();
            const transit_exchange = this.handleTransitExchangeTotal();
            const allocated_qty = this.handleAllocatedQuantity();
            const allocated_exchange = this.handleAllocatedExchangeTotal();
            const allocated_lkr = this.handleAllocatedLKRTotal();
            this.setState({
                transitQty: transit_qty,
                transitExchageTotal: transit_exchange,
                transitLKRTotal: transit_lkr,
                orderQty: order_qty,
                orderLKRTotal: order_lkr,
                orderExchageTotal: order_exchange,
                allocatedQty: allocated_qty,
                allocatedLKRTotal: allocated_lkr,
                allocatedExchangeTotal: allocated_exchange,
                loading: true,
                userRoles: userRoles,
                currentStatus: data.status
            });
        })
    }

    // onSubmit = async () => {
    //     let params = {
    //         approval_user_type: this.state.userRoles,
    //         consignment_id: this.state.selected_id
    //     }
    //     let res = await SPCServices.changeConsignmentApproval(params)
    //     if (res.status) {
    //         // this.setState({alert: true, seve})
    //     } else {

    //     }
    // }

    handleTransitQuantity = () => {
        const quantity = this.state.itemList.reduce((accumulator, item) => {
            return accumulator + this.calculateTransitItemTotal(item);
        }, 0);
        return quantity;
    };

    calculateTransitItemTotal = (item) => {
        return (parseInt(item?.transit_quantity ?? 0));
    };

    handleTransitLKRTotal = () => {
        const orderAmount = this.handleOrderLKRTotal()
        const quantity = this.handleOrderQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)

        const total = this.state.itemList.reduce((accumulator, item) => {
            const itemTotal = this.calculateTransitItemTotal(item);
            return accumulator + (itemTotal * itemPerPrice);
        }, 0);

        return total;
    };

    handleTransitExchangeTotal = () => {
        // const orderAmount = this.state.filterData
        const orderAmount = isNaN(parseFloat(this.state.filterData?.order_amount)) ? 0 : parseFloat(this.state.filterData?.order_amount)

        // console.log('ggggggggggggggggggggg', orderAmount)
        // const quantity = this.handleOrderQuantity()
        // const itemPerPrice = parseFloat(orderAmount / quantity)

        // const total = this.state.itemList.reduce((accumulator, item) => {
        //     const itemTotal = this.calculateTransitItemTotal(item);
        //     return accumulator + (itemTotal * itemPerPrice);
        // }, 0);

        return orderAmount;
    };
    // handleTransitExchangeTotal = () => {
    //     const orderAmount = this.handleOrderExchangeTotal()
    //     const quantity = this.handleOrderQuantity()
    //     const itemPerPrice = parseFloat(orderAmount / quantity)

    //     const total = this.state.itemList.reduce((accumulator, item) => {
    //         const itemTotal = this.calculateTransitItemTotal(item);
    //         return accumulator + (itemTotal * itemPerPrice);
    //     }, 0);

    //     return total;
    // };

    handleOrderExchangeTotal = () => {
        const { data } = this.props
        return parseFloat(data?.total ?? 0);
    };

    handleOrderLKRTotal = () => {
        const { data } = this.props
        return parseFloat(parseFloat(data?.total ?? 0) * parseFloat(data?.currency_rate ?? 1) ?? 0);
    };

    handleOrderQuantity = () => {
        const quantity = this.state.itemList.reduce((accumulator, item) => {
            return accumulator + parseInt(item?.quantity ?? 0, 10);
        }, 0);
        return quantity;
    };

    handleAllocatedQuantity = () => {
        const quantity = this.state.itemList.reduce((accumulator, item) => {
            if (item.selected === false) {
                return accumulator + parseInt(item?.allocated_quantity ?? 0, 10);
            } else {
                return accumulator + parseInt(parseInt(item?.allocated_quantity ?? 0, 10) - parseInt(item?.transit_quantity ?? 0, 10), 10);
            }
        }, 0);
        return quantity;
    };

    handleAllocatedExchangeTotal = () => {
        const orderAmount = this.handleOrderExchangeTotal()
        const quantity = this.handleOrderQuantity()
        const allocatedQuantity = this.handleAllocatedQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)
        const total = parseFloat(allocatedQuantity * itemPerPrice)

        return total;
    };

    handleAllocatedLKRTotal = () => {
        const orderAmount = this.handleOrderLKRTotal()
        const quantity = this.handleOrderQuantity()
        const allocatedQuantity = this.handleAllocatedQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)
        const total = parseFloat(allocatedQuantity * itemPerPrice)

        return total;
    };

    formatRemarks() {
        const resultArray = [];

        for (const key in this.state.verified) {
            if (this.state.verified[key] === true) {
                const formattedKey = key.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                resultArray.push(formattedKey);
            }
        }

        return resultArray;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.itemList !== prevState.itemList) {
            const transit_qty = this.handleTransitQuantity();
            const order_qty = this.handleOrderQuantity();
            const order_lkr = this.handleOrderLKRTotal();
            const order_exchange = this.handleOrderExchangeTotal();
            const transit_lkr = this.handleTransitLKRTotal();
            const transit_exchange = this.handleTransitExchangeTotal();
            this.setState({
                transitQty: transit_qty,
                transitExchageTotal: transit_exchange,
                transitLKRTotal: transit_lkr,
                orderQty: order_qty,
                orderLKRTotal: order_lkr,
                orderExchageTotal: order_exchange,
            }, () => {
                console.log("Item: ", this.state.itemList);
            });
        } if (this.state.verified !== prevState.verified) {
            const remarks = this.formatRemarks();
            this.setState({ supervisor_remark: remarks.join("\n") })
        }
    }

    onSubmit = () => {
        this.setState({ configOpen: true })
    }

    updateVesselDetails = async () => {
        const { id } = this.props
        const { vessel_details, ConsigmentVesselData } = this.state.filterData
        const vesselDetails = {
            ...vessel_details?.[0],
            consignment_id: id,
        };
        if (Array.isArray(ConsigmentVesselData) && ConsigmentVesselData.length > 0) {
            return await SPCServices.changeConsignmentVesselByID(ConsigmentVesselData?.[0]?.id, vesselDetails);
        } else {
            return await SPCServices.createConsignmentVessel(vesselDetails);
        }
    };

    updateConsignmentItems = async (selectedIndex) => {
        const item = this.state.itemList[selectedIndex]
        const itemAllocatedQuantity = parseInt(this.state.itemData[selectedIndex]?.allocated_quantity ?? 0, 10);
        const itemTransitQuantity = parseInt(this.state.itemData[selectedIndex]?.transit_quantity ?? 0, 10);
        const itemRemainingQuantity = itemAllocatedQuantity - itemTransitQuantity

        if (item?.quantity >= item?.transit_quantity + itemRemainingQuantity) {
            const data = {
                transit_quantity: item?.transit_quantity
            }
            try {
                let res = await SPCServices.changeConsignmentItemById(item?.id, data)
                if (res.status) {
                    this.setState({ alert: true, severity: "success", message: "SPC Consignment Item Updated Successfully" })
                }
            } catch (err) {
                this.setState({ alert: true, severity: "error", message: `Error: ${err}` })
            }
        } else {
            this.setState({ alert: true, severity: "error", message: `Error: Transit Quantity > Ordered Quantity` })
        }
    }

    deleteConsignmentItems = async (id, selectedIndex) => {
        const item = this.state.itemList[selectedIndex]
        try {
            let res = await SPCServices.deleteConsignmentItemById(id)
            if (res.status) {
                this.setState({ alert: true, severity: "success", message: "SPC Consignment Item was deleted Successfully" })
            }
        } catch (err) {
            this.setState({ alert: true, severity: "error", message: `Error: ${err}` })
        }
    }

    addConsignmentItems = async (selectedIndex) => {
        const item = this.state.itemList[selectedIndex]
        const params = {
            ...item,
        }
        try {
            let res = await SPCServices.createConsignmentItems(params)
            if (res.status) {
                this.setState({ alert: true, severity: "success", message: "SPC Consignment Item was deleted Successfully" })
            }
        } catch (err) {
            this.setState({ alert: true, severity: "error", message: `Error: ${err}` })
        }
    }

    updateContainerDetails = async () => {
        const { id } = this.props
        const { delivery_details, ConsignmentContainers } = this.state.filterData
        const deliveryDetails = {
            ...delivery_details?.[0],
            consignment_id: id,
        };
        if (Array.isArray(ConsignmentContainers) && ConsignmentContainers.length > 0) {
            return await SPCServices.changeConsignmentVesselByID(ConsignmentContainers?.[0]?.id, deliveryDetails);
        } else {
            return await SPCServices.createConsignmentContainer(deliveryDetails);
        }
    };

    updateContainerCharges = async () => {
        const { id } = this.props
        const { charges, ConsigmentCharges } = this.state.filterData
        const chargesDetails = {
            ...charges?.[0],
            consignment_id: id,
        };
        if (Array.isArray(ConsigmentCharges) && ConsigmentCharges.length > 0) {
            return await SPCServices.changeConsignmentChargesByID(ConsigmentCharges?.[0]?.id, chargesDetails);
        } else {
            return await SPCServices.createConsignmentCharges(chargesDetails);
        }
    };

    onSave = async () => {
        const { id } = this.props
        try {
            const vessel_res = await this.updateVesselDetails();
            const charges_res = await this.updateContainerCharges();
            const { invoice_no, invoice_date, lc_no, remark, currency_type, currency_rate, shipment_account, shipment_no, supervisor_remark } = this.state.filterData

            const order_amount = this.state.transitExchageTotal;
            const values_in_currency = parseFloat(this.state.transitExchageTotal);
            const values_in_lkr = parseFloat(this.state.transitExchageTotal * currency_rate);
            const total = parseFloat(this.state.orderExchageTotal);

            let data = {
                invoice_no: invoice_no,
                lc_no: lc_no,
                invoice_date: invoice_date,
                wdn_recieved: null,
                received_date: null,
                remark: remark,
                supervisor_remark: supervisor_remark,
                total: total,
                shipment_account: shipment_account,
                shipment_no: shipment_no,

                values_in_currency: values_in_currency,
                values_in_lkr: values_in_lkr,

                order_amount: order_amount,
                currency_type: currency_type,
                currency_rate: currency_rate,
            }

            if (charges_res.status === 201 || vessel_res.status === 200 || vessel_res.status === 201 || charges_res.status === 200) {
                let consignment_res = await SPCServices.changeConsignmentByID(id, data)
                if (consignment_res.status) {
                    this.setState({
                        severity: "success",
                        alert: true,
                        message: "SPC Consignment Charges Details and Vessel Details was Updated",
                    }, () => {
                        if (this.props.isResubmit) {
                            this.setState({ isSave: true }, () => {
                                console.log("Data: ", this.state.filterData)
                            })
                        } else {
                            setTimeout(() => {
                                this.props.handleClose()
                            }, 1200)
                        }
                    })
                } else {
                    this.setState({
                        severity: "error",
                        alert: true,
                        message: "SPC Consignment Status Failed to Update",
                    })
                }
            } else {
                this.setState({
                    severity: "error",
                    alert: true,
                    message: "SPC Consignment Charges Details and Vessel Details Updation was Unsuccessfull"
                })
            }
        } catch (error) {
            this.setState({
                severity: "error",
                alert: true,
                message: "An error occurred while processing the request"
            })
        }
    }
    onCancel = async () => {
        const { id } = this.props
        try {

            let data = {
                status: "CANCELLED"
            }

            let consignment_res = await SPCServices.changeConsignmentByID(id, data)
            if (consignment_res.status === 200) {
                this.setState({
                    severity: "success",
                    alert: true,
                    message: "SPC Consignment was Updated",
                })
                this.setState({
                    cancelOpen: false
                })
                setTimeout(() => {
                    this.props.handleClose()
                }, 1200)

            } else {
                this.setState({
                    severity: "error",
                    alert: true,
                    message: "SPC Consignment Updation was Unsuccessfull"
                })
            }
        } catch (error) {
            this.setState({
                severity: "error",
                alert: true,
                message: "An error occurred while processing the request"
            })
        }
    }
    onResubmit = async () => {
        const { id } = this.props
        if (id) {
            let res = await SPCServices.createConsignmentResubmission({ consignment_id: id })
            console.log("Data: ", this.state.filterData)
            if (res.status === 201) {
                this.setState({ alert: true, severity: "success", message: "SPC Consignment has been Resubmitted" }, () => {
                    this.props.handleClose()
                })
            } else {
                this.setState({ alert: true, severity: "error", message: "Failed to Resubmit the SPC Consignment", isSave: false })
            }
        } else {
            this.setState({
                severity: "error",
                alert: true,
                message: "An error occurred while processing the request"
            })
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                {/* Filtr Section */}
                {/* <div className="pb-8 pt-2"> */}
                {/* Filtr Section */}
                <ValidatorForm
                    className="pt-2"
                    ref={this.formRef}
                    onSubmit={this.onSubmit}
                    onError={() => null}
                >
                    {/* Main Grid */}
                    <Grid container spacing={2} direction="row">
                        {/* Filter Section */}
                        <Grid item xs={12} className='mb-5' sm={12} md={12} lg={12}>
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
                                        <Grid container spacing={2} className='prt' ref={(el) => (this.componentRef = el)}>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <Typography variant="h6" className="font-semibold">Shipping Details</Typography>
                                                </div>
                                                <div>
                                                    <Chip
                                                        size="small"
                                                        label={this.state.filterData?.status ? `Status: ${this.state.filterData?.status}` : "Status: N/A"}
                                                        color={this.state.filterData?.status === "REJECTED" ? "error" : "success"}
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>
                                            <Divider className='mt-2' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Shipment No" />
                                            <AddTextInput
                                                onChange={(e) => {
                                                    this.setState({
                                                        filterData: {
                                                            ...this
                                                                .state
                                                                .filterData,
                                                            wharf_no:
                                                                e.target
                                                                    .value,
                                                        },
                                                    })
                                                }} val={this.state.filterData?.wharf_ref_no} text='Enter Shipment No' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="WDN Number" />
                                            <AddTextInput onChange={(e) => {
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
                                            }} val={this.state.filterData?.wdn_no} text='Enter WDN Number' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="WDN Date" />
                                            <AddInputDate onChange={(date) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.wdn_date = date
                                                this.setState({ filterData })
                                            }} val={this.state.filterData?.wdn_date} text='Enter WDN Date' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Indent No" />
                                            <AddTextInput onChange={(e) => {
                                                this.setState({
                                                    filterData: {
                                                        ...this
                                                            .state
                                                            .filterData,
                                                        indent_no:
                                                            e.target
                                                                .value,
                                                    },
                                                })
                                            }} val={this.state.filterData?.indent_no} text='Enter Indent No' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="Supplier" />
                                            <AddTextInput
                                                disable={true}
                                                require={false}
                                                onChange={(e) => null}
                                                val={this.state.filterData?.Supplier?.name} text='Enter Supplier Name' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="WHARF Ref No" />
                                                    <AddTextInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
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
                                                        }} val={this.state.filterData.shipment_no} text='Enter WHARF Ref No' type='text' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.wharf_ref_no && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, wharf_ref_no: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
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
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Invoice Number" />
                                                    <AddTextInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
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
                                                        }} val={this.state.filterData?.invoice_no} text='Enter Invoice No' type='text' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.invoice_no && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, invoice_no: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
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
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Invoice Date" />
                                                    <AddInputDate
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(date) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.invoice_date = date
                                                            this.setState({ filterData })
                                                        }} val={this.state.filterData?.invoice_date} text='Enter Invoice Date' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.invoice_date && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, invoice_date: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
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
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="LC Number" />
                                                    <AddTextInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    lc_no:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }} val={this.state.filterData.lc_no} text='Enter LC No' type='text' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.lc_no && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, lc_no: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>

                                        <Grid item lg={12} md={12} sm={12} xs={12}></Grid>

                                        <Grid item lg={4} md={4} sm={6} xs={6}>
                                            <SubTitle title="WDN Recieved" />
                                            <AddInput
                                                options={[{ label: "YES" }, { label: "NO" }]}
                                                val={this.state.filterData.wdn_recieved}
                                                getOptionLabel={(option) => option.label || ""}
                                                text='WDN Recieved: N/A'
                                                onChange={(e, value) => {
                                                    const newFormData = {
                                                        ...this.state.filterData,
                                                        wdn_recieved: e.target.textContent ? e.target.textContent : e.target.value,
                                                        // wdn_recieved_id: value ? value.id : null,
                                                    };

                                                    this.setState({ formData: newFormData });
                                                }
                                                }
                                            />
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={6} xs={6}>
                                            <SubTitle title="Recieved Date" />
                                            <AddInputDate
                                                onChange={(date) => {
                                                    let filterData =
                                                        this.state.filterData
                                                    filterData.received_date = date
                                                    this.setState({ filterData })
                                                }} val={this.state.filterData.received_date} text='Received Date: N/A' />
                                        </Grid>
                                        {/* <Grid item lg={12} md={12} sm={12} xs={12} style={{ border: "1px solid black", margin: "8px" }}>
                                            <Grid container spacing={2} style={{ backgroundColor: "#FFB6C1" }} className='mb-5'>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={4}
                                                    xs={4}
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
                                                                .wdn_table_no
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
                                                                    wdn_table_no:
                                                                        e.target
                                                                            .value,
                                                                },
                                                            })
                                                        }}
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <IconButton onClick={() => { }}>
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
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={4}
                                                    xs={4}
                                                >
                                                    <SubTitle title="Enter Shipment Number" />
                                                    <AddTextInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                shipment_table_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }} val={this.state.filterData.shipment_table_no} text='Enter Shipment No' type='text' />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={4}
                                                    md={4}
                                                    sm={4}
                                                    xs={4}
                                                >
                                                    <SubTitle title="Enter Wharf Ref No." />
                                                    <AddTextInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                wharf_table_no:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        })
                                                    }} val={this.state.filterData.wharf_table_no} text='Enter Wharf Ref Number' type='text' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                                    <SubTitle title="WDN Recieved" />
                                                    <AddInput
                                                        options={[]}e.target.text
                                                        val={this.state.filterData.wdn_recieved}
                                                        getOptionLabel={(option) => option.name || ""}
                                                        text='Enter WDN Recieved'
                                                        onChange={(e, value) => {
                                                            const newFormData = {
                                                                ...this.state.filterData,
                                                                wdn_recieved: e.target.textContent ? e.target.textContent : e.target.value,
                                                                wdn_recieved_id: value ? value.id : null,
                                                            };

                                                            this.setState({ formData: newFormData });
                                                        }
                                                        }
                                                    />
                                                </Grid>
                                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                                    <SubTitle title="Recieved Date" />
                                                    <AddInputDate onChange={(date) => {
                                                        let filterData =
                                                            this.state.filterData
                                                        filterData.received_date = date
                                                        this.setState({ filterData })
                                                    }} val={this.state.filterData.received_date} text='Enter Received Date' />
                                                </Grid>
                                            </Grid>
                                        </Grid> */}
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <CardTitle title='Vessel/Payments' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Vessel/Flight Name" />
                                                    <AddTextInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this.state.filterData,
                                                                    vessel_details: [
                                                                        {
                                                                            ...this.state.filterData?.vessel_details?.[0],
                                                                            flight_name: e.target.value,
                                                                        }
                                                                    ]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.flight_name : null} text='Enter Vessel/Flight Name' type='text' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.flight_name && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, flight_name: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Voyage Flight Number" />
                                                    <AddTextInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    vessel_details: [{
                                                                        ...this.state.filterData?.vessel_details?.[0],
                                                                        flight_no: e.target.value,
                                                                    }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.flight_no : null} text='Enter Voyage Flight Number' type='text' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.flight_no && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, flight_no: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={6}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Gross Weight (Kg)" />
                                                    <AddNumberInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    vessel_details: [{
                                                                        ...this.state.filterData?.vessel_details?.[0],
                                                                        weight:
                                                                            roundDecimal(parseFloat(e.target
                                                                                .value), 2),
                                                                    }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.weight : null} text='Enter Gross Weight' type='number' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.weight && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, weight: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid
                                            style={{ border: "1px solid #3B71CA", borderRadius: "10px" }}
                                            className="w-full py-4 mt-2 mb-2"
                                            item
                                            lg={6}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    {this.state.filterData?.vessel_details?.[0]?.vessel_type === "FCL" ?
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid lg={4} md={4} xs={4} sm={4} style={{ padding: "8px" }}>
                                                                    <SubTitle title="No of FCL's" />
                                                                    <AddNumberInput
                                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                        onChange={this.handleRowCountChange} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.fcl_value : null} text="Enter No of FCL's" type='number' />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container spacing={2}>
                                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                                    <table style={{ width: "100%" }}>
                                                                        <thead>
                                                                            <tr style={{ backgroundColor: "#626566", border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "25%" }}>Container Type</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "25%" }}>Container Number</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "25%" }}>Container Load</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "25%" }}>Total Parts</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {Array.isArray(this.state.filterData.vessel_details) && (isNull(this.state.filterData.vessel_details?.[0]?.fcl_value) || (!isNaN(this.state.filterData.vessel_details?.[0]?.fcl_value)) && this.state.filterData.vessel_details[0]?.fcl_value === 0) ?
                                                                                <tr style={{ height: "40px" }}>
                                                                                    <td style={{ width: "25%", textAlign: "center" }}>No</td>
                                                                                    <td style={{ width: "25%", textAlign: "center" }}>Any</td>
                                                                                    <td style={{ width: "25%", textAlign: "center" }}>Data</td>
                                                                                    <td style={{ width: "25%", textAlign: "center" }}>!</td>
                                                                                </tr>
                                                                                : this.renderFCLTableRows()}
                                                                        </tbody>
                                                                    </table>
                                                                </Grid>
                                                            </Grid>
                                                        </>
                                                        :
                                                        <>
                                                            <Grid container spacing={2}>
                                                                <Grid lg={4} md={4} xs={4} sm={4} style={{ padding: "8px" }}>
                                                                    <SubTitle title="No of Lorries" />
                                                                    <AddNumberInput
                                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                        onChange={this.handleRowCountChange} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.fcl_value : null} text="Enter No of Lorries" type='number' />
                                                                </Grid>
                                                            </Grid>
                                                            <Grid container spacing={2}>
                                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                                    <table style={{ width: "100%" }}>
                                                                        <thead>
                                                                            <tr style={{ backgroundColor: "#626566", border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "50%" }}>Lorry No</th>
                                                                                <th style={{ color: "white", fontWeight: "bold", width: "50%" }}>Remark</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {Array.isArray(this.state.filterData.vessel_details) && (isNull(this.state.filterData.vessel_details?.[0]?.fcl_value) || (!isNaN(this.state.filterData.vessel_details?.[0]?.fcl_value)) && this.state.filterData.vessel_details[0]?.fcl_value === 0) ?
                                                                                <tr style={{ height: "40px" }}>
                                                                                    <td style={{ width: "50%", textAlign: "center" }}>No</td>
                                                                                    <td style={{ width: "50%", textAlign: "center" }}>Data</td>
                                                                                </tr>
                                                                                : this.renderNonFCLTableRows()}
                                                                        </tbody>
                                                                    </table>
                                                                </Grid>
                                                            </Grid>
                                                        </>

                                                    }
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.fcl_table && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, fcl_table: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid className='w-full' item lg={6} md={6} sm={12} xs={12}>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="Total Packages" />
                                                            <AddNumberInput
                                                                disable={this.state.userRoles.includes('SPC MA') ? false : true}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            vessel_details: [
                                                                                {
                                                                                    ...this.state.filterData.vessel_details[0],
                                                                                    total_packages:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }}
                                                                val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details[0].total_packages : 0}
                                                                text="Enter No of Packages"
                                                                type='number'

                                                            />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.total_packages && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, total_packages: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
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
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="Actual Dispatch Date" />
                                                            <AddInputDate
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                onChange={(date) => {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.vessel_details[0].dispatch_date = date
                                                                    this.setState({ filterData })
                                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.dispatch_date : null} text='Enter Actual Dispatch Date' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.dispatch_date && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, dispatch_date: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="Date of Clearance" />
                                                            <AddInputDate
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                onChange={(date) => {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.vessel_details[0].clearance_date = date
                                                                    this.setState({ filterData })
                                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.clearance_date : null} text='Enter Date of Clearance' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.clearance_date && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, clearance_date: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
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
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="Departure Port" />
                                                            <AddTextInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                // options={[]}
                                                                val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.departure_port : null}
                                                                // getOptionLabel={(option) => option.name || ""}
                                                                text='Enter Departure Port'
                                                                onChange={(e) => {
                                                                    const newFormData = {
                                                                        ...this.state.filterData,
                                                                        vessel_details: [
                                                                            {
                                                                                ...this.state.filterData.vessel_details[0],
                                                                                departure_port: e.target.textContent ? e.target.textContent : e.target.value,
                                                                                // departure_port_id: value ? value.id : null,
                                                                            }]
                                                                    };

                                                                    this.setState({ filterData: newFormData });
                                                                }
                                                                }
                                                            />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.departure_port && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, departure_port: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="Departure Date" />
                                                            <AddInputDate
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                onChange={(date) => {
                                                                    let filterData =
                                                                        this.state.filterData
                                                                    filterData.vessel_details[0].departure_date = date
                                                                    this.setState({ filterData })
                                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.departure_date : null} text='Enter Departure Date' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.departure_date && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, departure_date: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
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
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="Arrival Port" />
                                                            <AddTextInput
                                                                // options={[]}
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.arrival_port : null}
                                                                // getOptionLabel={(option) => option.name || ""}
                                                                text='Enter Arrival Port'
                                                                onChange={(e) => {
                                                                    const newFormData = {
                                                                        ...this.state.filterData,
                                                                        vessel_details: [
                                                                            {
                                                                                ...this.state.filterData.vessel_details[0],
                                                                                arrival_port: e.target.textContent ? e.target.textContent : e.target.value,
                                                                                // departure_port_id: value ? value.id : null,
                                                                            }]
                                                                    };

                                                                    this.setState({ filterData: newFormData });
                                                                }
                                                                }
                                                            />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.arrival_port && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, arrival_port: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="Arrival Date" />
                                                            <AddInputDate
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                onChange={(date) => {
                                                                    let filterData = this.state.filterData
                                                                    filterData.vessel_details[0].arrival_date = date
                                                                    this.setState({ filterData })
                                                                }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.arrival_date : null} text='Enter Arrival Date' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.arrival_date && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, arrival_date: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            className="w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Shipping Company" />
                                                    <AddTextInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        // options={[]}
                                                        val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.company : null}
                                                        // getOptionLabel={(option) => option.name || ""}
                                                        text='Enter Shipping Company'
                                                        onChange={(e) => {
                                                            const newFormData = {
                                                                ...this.state.filterData,
                                                                vessel_details: [
                                                                    {
                                                                        ...this.state.filterData.vessel_details[0],
                                                                        company: e.target.textContent ? e.target.textContent : e.target.value,
                                                                        // departure_port_id: value ? value.id : null,
                                                                    }]
                                                            };

                                                            this.setState({ filterData: newFormData });
                                                        }
                                                        }
                                                    />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.company && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, company: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid className=" w-full" item lg={12} md={12} sm={12} xs={12}></Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="B/L or AWB Number" />
                                                    <AddTextInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    vessel_details: [{
                                                                        ...this.state.filterData?.vessel_details?.[0],
                                                                        bl_no: e.target.value,
                                                                    }]
                                                                },
                                                            })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.bl_no : null} text='Enter B/L or AWB Number' type='text' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.bl_no && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, bl_no: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="B/L or AWB Date" />
                                                    <AddInputDate
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(date) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.vessel_details[0].bl_date = date
                                                            this.setState({ filterData })
                                                        }} val={Array.isArray(this.state.filterData.vessel_details) ? this.state.filterData.vessel_details?.[0]?.bl_date : null} text='Enter B/L or AWB Date' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.bl_date && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, bl_date: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                        </Grid>
                                        <Grid
                                            className="w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <CardTitle title='Shipment Values' />
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12} className='px-4 py-4' style={{ borderRadius: "10px", backgroundColor: "#3B71CA", margin: "12px 8px" }}>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ flex: 1 }}>
                                                        {renderDetailCard('Order Total', `${this.state.filterData?.currency ? this.state.filterData?.currency : ""} ${convertTocommaSeparated(this.state.orderExchageTotal, 4)}`)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        {renderDetailCard('Order Quantity', convertTocommaSeparated(this.state.orderQty, 0))}
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ flex: 1 }}>
                                                        {renderDetailCard('Transit Total', `${this.state.filterData?.currency ? this.state.filterData?.currency : ""} ${convertTocommaSeparated(this.state.transitExchageTotal, 4)}`)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        {renderDetailCard('Transit Quantity', `${convertTocommaSeparated(this.state.transitQty, 0)}`)}
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ flex: 1 }}>
                                                        {renderDetailCard('Allocated Total', `${this.state.filterData?.currency ? this.state.filterData?.currency : ""} ${convertTocommaSeparated(this.state.allocatedExchangeTotal, 4)}`)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        {renderDetailCard('Allocated Quantity', `${convertTocommaSeparated(this.state.allocatedQty, 0)}`)}
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <div style={{ display: "flex", flexDirection: "row" }}>
                                                    <div style={{ flex: 1 }}>
                                                        {renderDetailCard('Remaining Total', `${this.state.filterData?.currency ? this.state.filterData?.currency : ""} ${convertTocommaSeparated(this.state.orderExchageTotal - this.state.transitExchageTotal - this.state.allocatedExchangeTotal, 4)}`)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        {renderDetailCard('Remaining Quantity', `${convertTocommaSeparated(this.state.orderQty - this.state.transitQty - this.state.allocatedQty, 0)}`)}
                                                    </div>
                                                </div>
                                            </Grid>
                                        </Grid>
                                        <Grid item lg={12} md={12} sm={12} xs={12} className='px-4 py-2'>
                                            <LoonsTable
                                                //title={"All Aptitute Tests"}
                                                id={'allItemDetails'}
                                                data={this.state.itemList}
                                                columns={this.state.columns}
                                                options={{
                                                    pagination: true,
                                                    rowsPerPage: 10,
                                                    page: 0,
                                                    serverSide: true,
                                                    rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                    print: true,
                                                    count: this.state.itemList.length,
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
                                                                // this.setPage(
                                                                //     tableState.page
                                                                // )
                                                                break
                                                            case 'changeRowsPerPage':
                                                                // this.setState({
                                                                //     filterData: {
                                                                //         limit: tableState.rowsPerPage,
                                                                //         page: 0,
                                                                //     },
                                                                // }, () => {
                                                                //     // this.loadData()
                                                                // })
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
                                        {/* <Grid item lg={12} md={12} sm={12} xs={12} className='w-full my-4 mx-4 px-4 py-4' style={{ backgroundColor: "#FFB6C1", borderRadius: "12px" }}>
                                            <table style={{ width: "100%", border: "1px solid black", backgroundColor: "white" }}>
                                                <thead>
                                                    <tr style={{ backgroundColor: "#626566", border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                                                        <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Order Qty</th>
                                                        <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Received Qty</th>
                                                        <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Pending Qty</th>
                                                        <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>FOC Qty</th>
                                                        <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>FOC Items</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr style={{ height: "40px" }}>
                                                        <td style={{ width: "20%", textAlign: "center" }}>{convertTocommaSeparated('130000')}</td>
                                                        <td style={{ width: "20%", textAlign: "end" }}>{convertTocommaSeparated('129000')}</td>
                                                        <td style={{ width: "20%", textAlign: "end" }}>{convertTocommaSeparated('1000')}</td>
                                                        <td style={{ width: "20%", textAlign: "end" }}>{convertTocommaSeparated('300')}</td>
                                                        <td style={{ width: "20%", textAlign: "center" }}>
                                                            <p>SR 0001 : 100</p>
                                                            <p>SR 0002 : 200</p>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Grid> */}
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <CardTitle title='Charges' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title={`Order Amount (${this.state.filterData?.currency ? this.state.filterData?.currency : ""}.)`} />
                                                    <AddNumberInput
                                                        disable={true}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    order_amount:
                                                                        roundDecimal(parseFloat(e.target
                                                                            .value), 2),
                                                                },
                                                            })
                                                        }} val={roundDecimal(this.state.transitExchageTotal, 2)} text='Enter Order Amount' type='number' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.order_amount && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, order_amount: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
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
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Currency Type" />
                                                    {/* <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={appConst.all_currencies}
                                                        getOptionLabel={(option) => option.cc}
                                                        value={this.state.filterData?.currency_type ? this.state.filterData?.currency_type : ''}
                                                        onChange={(event, value) => {
                                                            if (value != null) {
                                                                let updatedFilterData = {
                                                                    ...this.state.filterData,
                                                                    currency_type: value?.cc,
                                                                };
                                                                this.setState({
                                                                    filterData: updatedFilterData,
                                                                });
                                                            } else {
                                                                let updatedFilterData = {
                                                                    ...this.state.filterData,
                                                                    currency_type: null,
                                                                };
                                                                this.setState({
                                                                    filterData: updatedFilterData,
                                                                });
                                                            }
                                                        }
                                                        }
                                                        renderInput={(params) => (
                                                            <TextValidator
                                                                {...params}
                                                                placeholder="Currency Type"
                                                                //variant="outlined"
                                                                //value={}
                                                                value={this.state.filterData?.currency_type ? this.state.filterData?.currency_type : ''}
                                                                fullWidth
                                                                // InputLabelProps={{
                                                                //     shrink: true,
                                                                // }}
                                                                variant="outlined"
                                                                size="small"
                                                                validators={['required']}
                                                                errorMessages={['this field is required']}
                                                            />
                                                        )}
                                                    /> */}
                                                    <AddInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        options={appConst.all_currencies}
                                                        val={this.state.filterData?.currency_type ? this.state.filterData?.currency_type : ''}
                                                        getOptionLabel={(option) => option.cc || ''}
                                                        text='Currency Type'
                                                        onChange={(e, value) => {
                                                            if (null != value) {
                                                                let updatedFilterData = {
                                                                    ...this.state.filterData,
                                                                    currency_type: value?.cc,
                                                                };
                                                                // Update the state with the modified filterData object
                                                                this.setState({
                                                                    filterData: updatedFilterData,
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.currency_type && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, currency_type: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
                                            </div>
                                            {/* <Autocomplete
                                                // disableClearable
                                                className="w-full"
                                                options={this.state.currency_types}
                                                onChange={(e, value) => {
                                                    if (null != value) {
                                                        let filterData =
                                                            this.state.filterData
                                                        filterData.currency_type =
                                                            e.target.value
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
                                                        placeholder="Please choose"
                                                        fullWidth
                                                        variant="outlined"
                                                        size="small"
                                                        value={
                                                            this.state.filterData
                                                                .currency_type
                                                        }
                                                    />
                                                )}
                                            /> */}
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Enter Currency Rate" />
                                                    <AddNumberInput
                                                        disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(e) => {
                                                            this.setState({
                                                                filterData: {
                                                                    ...this
                                                                        .state
                                                                        .filterData,
                                                                    currency_rate:
                                                                        roundDecimal(parseFloat(e.target
                                                                            .value), 2),
                                                                },
                                                            })
                                                        }} val={this.state.filterData?.currency_rate} text='Enter Currency Rate' type='number' />
                                                </div>
                                                {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                    <div>
                                                        <Checkbox
                                                            checked={this.state.verified.currency_rate && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, currency_rate: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    </div>
                                                }
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
                                            <SubTitle title="Total LKR" />
                                            <AddNumberInput disable={true} onChange={(e) => {
                                                // this.setState({
                                                //     filterData: {
                                                //         ...this
                                                //             .state
                                                //             .filterData,
                                                //         currency_rate:
                                                //             roundDecimal(parseFloat(e.target
                                                //                 .value), 2),
                                                //     },
                                                // })
                                            }} val={
                                                roundDecimal(parseFloat(this.state.filterData?.order_amount * this.state.filterData?.currency_rate ?? 0), 2)}
                                                text='Enter Total Rate' type='number' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        ></Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="CID" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    cid:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.cid : 0} text='Enter CID' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.cid && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, cid: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="PAL" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    pal:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.pal : 0} text='Enter PAL' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.pal && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, pal: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="SSL" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    ssl:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.ssl : 0} text='Enter SSL' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.ssl && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, ssl: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="CESS" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    cess:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.cess : 0} text='Enter CESS' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.cess && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, cess: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="SC" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    sc:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.sc : 0} text='Enter SC' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.sc && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, sc: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="VAT" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    vat:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.vat : 0} text='Enter SC' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.sc && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, sc: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="SCL" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    scl:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.scl : 0} text='Enter SCL' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.scl && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, scl: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="COM" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    com:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.com : 0} text='Enter COM' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.com && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, com: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="EXM" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    exm:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.exm : 0} text='Enter EXM' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.exm && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, exm: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="OTC" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    otc:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.otc : 0} text='Enter OTC' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.otc && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, otc: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="SEL" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    sel:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.sel : 0} text='Enter SCL' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.sel && !this.state.checked}
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, sel: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                                {/* </Grid> */}
                                                {/* <Grid container spacing={2}> */}
                                                <Grid item lg={3} md={3} sm={12} xs={12}>
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <SubTitle title="OTHER" />
                                                            <AddNumberInput
                                                                disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        filterData: {
                                                                            ...this
                                                                                .state
                                                                                .filterData,
                                                                            charges: [
                                                                                {
                                                                                    ...this.state.filterData.charges[0],
                                                                                    other:
                                                                                        roundDecimal(parseFloat(e.target
                                                                                            .value), 2),
                                                                                }]
                                                                        },
                                                                    })
                                                                }} val={Array.isArray(this.state.filterData.charges) ? this.state.filterData.charges?.[0]?.other : 0} text='Enter Other' type='number' />
                                                        </div>
                                                        {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div>
                                                                <Checkbox
                                                                    checked={this.state.verified.other && !this.state.checked}
                                                                    // required
                                                                    onChange={(e) => {
                                                                        this.setState({ verified: { ...this.state.verified, other: e.target.checked } })
                                                                    }}
                                                                    name="chkbox_confirm"
                                                                    color="secondary"
                                                                    checkedIcon={<CloseIcon />}
                                                                />
                                                            </div>
                                                        }
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {/* <Grid
                                            className=" w-full"
                                            item
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            xs={6}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12} style={{ paddingTop: "30px", paddingBottom: "8px" }}>
                                                    <CardTitle title="Re Delivery Charges" />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Transport" />
                                                    <AddNumberInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                charges: [
                                                                    {
                                                                        ...this.state.filterData.charges[0],
                                                                        transport:
                                                                            roundDecimal(parseFloat(e.target
                                                                                .value), 2),
                                                                    }]
                                                            },
                                                        })
                                                    }} disable={true} val={Array.isArray(this.state.data.ConsigmentCharges) ? this.state.data.ConsigmentCharges?.[0]?.transport : 0} text='Enter Transport' type='number' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Storage" />
                                                    <AddNumberInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                charges: [
                                                                    {
                                                                        ...this.state.filterData.charges[0],
                                                                        storage:
                                                                            roundDecimal(parseFloat(e.target
                                                                                .value), 2),
                                                                    }]
                                                            },
                                                        })
                                                    }} disable={true} val={Array.isArray(this.state.data.charges) ? this.state.data.ConsigmentCharges?.[0]?.storage : 0} text='Enter Storage' type='number' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Detention" />
                                                    <AddNumberInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                charges: [
                                                                    {
                                                                        ...this.state.filterData.charges[0],
                                                                        detention:
                                                                            roundDecimal(parseFloat(e.target
                                                                                .value), 2),
                                                                    }]
                                                            },
                                                        })
                                                    }} val={Array.isArray(this.state.data.ConsigmentCharges) ? this.state.data.ConsigmentCharges?.[0]?.detention : 0} text='Enter Detention' type='number' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Demounting/Mounting" />
                                                    <AddNumberInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                charges: [
                                                                    {
                                                                        ...this.state.filterData.charges[0],
                                                                        type:
                                                                            roundDecimal(parseFloat(e.target
                                                                                .value), 2),
                                                                    }]
                                                            },
                                                        })
                                                    }} disable={true} val={Array.isArray(this.state.data.ConsigmentCharges) ? this.state.data.ConsigmentCharges?.[0]?.type : 0} text='Enter Type' type='number' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Tax" />
                                                    <AddNumberInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                charges: [
                                                                    {
                                                                        ...this.state.filterData.charges[0],
                                                                        tax:
                                                                            roundDecimal(parseFloat(e.target
                                                                                .value), 2),
                                                                    }]
                                                            },
                                                        })
                                                    }} disable={true} val={Array.isArray(this.state.data.ConsigmentCharges) ? this.state.data.ConsigmentCharges?.[0]?.tax : 0} text='Enter Tax' type='number' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Sub Total" />
                                                    <AddNumberInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                charges: [
                                                                    {
                                                                        ...this.state.filterData.charges[0],
                                                                        sub_total:
                                                                            roundDecimal(parseFloat(e.target
                                                                                .value), 2),
                                                                    }]
                                                            },
                                                        })
                                                    }} disable={true} val={Array.isArray(this.state.data.ConsigmentCharges) ? this.state.data.ConsigmentCharges?.[0]?.sub_total : 0} text='Enter Sub Total' type='number' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Shipping Line Damage" />
                                                    <AddNumberInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                charges: [
                                                                    {
                                                                        ...this.state.filterData.charges[0],
                                                                        shipping_line_damage:
                                                                            roundDecimal(parseFloat(e.target
                                                                                .value), 2),
                                                                    }]
                                                            },
                                                        })
                                                    }} disable={true} val={Array.isArray(this.state.data.ConsigmentCharges) ? this.state.data.ConsigmentCharges?.[0]?.shipping_line_damage : 0} text='Enter Shipping Line Damage' type='number' />
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                                    <SubTitle title="Total" />
                                                    <AddNumberInput onChange={(e) => {
                                                        this.setState({
                                                            filterData: {
                                                                ...this
                                                                    .state
                                                                    .filterData,
                                                                total: roundDecimal(parseFloat(e.target
                                                                    .value), 2),
                                                            },
                                                        })
                                                    }} disable={true} val={0} text='Enter Total' type='number' />
                                                </Grid>
                                            </Grid>
                                        </Grid> */}
                                        <Grid
                                            item
                                            lg={6}
                                            md={6}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Remarks" />
                                            <TextValidator
                                                multiline
                                                disabled={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                rows={4}
                                                className=" w-full"
                                                placeholder="Enter Remark"
                                                name="remark"
                                                InputLabelProps={{
                                                    shrink: false,
                                                }}
                                                value={
                                                    this.state.filterData
                                                        .remark
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
                                                            remark:
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
                                        {this.state.loading && Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) ?
                                            <>
                                                <Grid item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}>
                                                    <Divider className='mt-2' />
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={6}
                                                    md={6}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <SubTitle title="Supervisor Remarks" />
                                                    <TextValidator
                                                        multiline
                                                        rows={4}
                                                        className=" w-full"
                                                        placeholder="Supervisor Remarks"
                                                        name="description"
                                                        InputLabelProps={{
                                                            shrink: false,
                                                        }}
                                                        value={
                                                            this.state.supervisor_remark
                                                        }
                                                        type="text"
                                                        variant="outlined"
                                                        size="small"
                                                        onChange={(e) => {
                                                            this.setState({
                                                                supervisor_remark: e.target.value,
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
                                            </> : this.state.filterData?.supervisor_remark && (
                                                <>
                                                    <Grid item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}>
                                                        <Divider className='mt-2' />
                                                    </Grid>
                                                    <Grid
                                                        className=" w-full"
                                                        item
                                                        lg={6}
                                                        md={6}
                                                        sm={12}
                                                        xs={12}
                                                    >
                                                        <SubTitle title="Supervisor Remarks" />
                                                        <TextValidator
                                                            multiline
                                                            rows={4}
                                                            disabled
                                                            className=" w-full"
                                                            placeholder="Supervisor Remarks"
                                                            name="description"
                                                            InputLabelProps={{
                                                                shrink: false,
                                                            }}
                                                            value={this.state.filterData?.supervisor_remark ? this.state.filterData?.supervisor_remark : ""}
                                                            type="text"
                                                            variant="outlined"
                                                            size="small"
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    filterData: {
                                                                        ...this
                                                                            .state
                                                                            .filterData,
                                                                        supervisor_remark: e.target.value,
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
                                                </>
                                            )}
                                            </Grid>
                                        <Grid
                                            className='mt-5'
                                            style={{ display: "flex", height: 'fit-content', justifyContent: "space-between" }}
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
                                                    className=" w-full"
                                                >
                                                    <Button
                                                        className="mr-2 py-2 px-4"
                                                        progress={false}
                                                        // type="submit"
                                                        scrollToTop={
                                                            true
                                                        }
                                                        startIcon={<CloseIcon />}
                                                        style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                        onClick={this.props.handleClose}
                                                    >
                                                        <span className="capitalize">
                                                            Cancel
                                                        </span>
                                                    </Button>
                                                    {/* Submit Button */}
                                                    {/* && this.state.filterData.status === "Pending") */}
                                                    {(this.state.userRoles.includes('SPC Supervisor') && this.state.filterData.status === "New")?
                                                        <Button
                                                        className="mr-2 py-2 px-4"
                                                        progress="false"
                                                        // type="submit"

                                                        style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                        startIcon={<PrintIcon />}
                                                        // onClick={() => this.printData()}
                                                    >
                                                        {/* <span className="capitalize"> */}
                                                            <ReactToPrint
                                                                trigger={() => <span className="capitalize">Print Checklist</span>}
                                                                content={() => this.componentRef}
                                                                pageStyle={`@media print{
                                                                    // body{
                                                                    //     margin: 0;
                                                                    //     padding: 0;
                                                                    // }
                                                                    .prt{
                                                                        margin: 1mm;
                                                                    }
                                                                }`}
                                                            />
                                                        {/* </span> */}
                                                    </Button>
                                                    : null}
                                                </Grid>
                                            </Grid>
                                            {this.state.loading &&
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                        className=" w-full flex justify-end"
                                                    >
                                                        {
                                                            Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                                <div className='mx-2'>
                                                                    <Typography className=" text-gray font-semibold text-13" style={{ lineHeight: '1' }}>All Correct</Typography>
                                                                </div>
                                                                <div>
                                                                    <Checkbox
                                                                        defaultChecked={this.state.checked ? this.state.checked : false}
                                                                        checked={this.state.checked ? this.state.checked : false}
                                                                        // required
                                                                        onChange={() => {
                                                                            this.setState({ checked: !this.state.checked })
                                                                        }}

                                                                        //     checked={this.state.verified.sel && !this.state.checked}
                                                                        // onChange={(e) => {
                                                                        //     this.setState({ verified: { ...this.state.verified, sel: e.target.checked } })
                                                                        // }}

                                                                        name="chkbox_confirm"
                                                                        color="primary"
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                        {/* Submit Button */}
                                                        <Button
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                            startIcon={<PrintIcon />}
                                                            onClick={() => this.printData()}
                                                        >
                                                            <span className="capitalize">
                                                                Print
                                                            </span>
                                                        </Button>
                                                        {this.state.isEdit && this.state.filterData.status !== "APPROVED" &&
                                                            <Button
                                                                className="mr-2 py-2 px-4"
                                                                progress={false}
                                                                // type="submit"
                                                                disabled={this.state.isSave}
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                style={!this.state.isSave ? { backgroundColor: "#3B71CA", color: "white", borderRadius: "10px" } : { backgroundColor: "#dddddd", color: "white", borderRadius: "10px" }}
                                                                startIcon={<SaveIcon />}
                                                                onClick={() => this.setState({ updateOpen: true })}
                                                            >
                                                                <span className="capitalize">
                                                                    Save
                                                                </span>
                                                            </Button>
                                                        }
                                                        {this.props.isResubmit &&
                                                            <Button
                                                                className="mr-2 py-2 px-4"
                                                                progress={false}
                                                                // type="submit"
                                                                disabled={!this.state.isSave}
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                style={this.state.isSave ? { backgroundColor: "#3B71CA", color: "white", borderRadius: "10px" } : { backgroundColor: "#dddddd", color: "white", borderRadius: "10px" }}
                                                                startIcon={<AutorenewIcon />}
                                                                onClick={() => this.setState({ resubmitOpen: true })}
                                                            >
                                                                <span className="capitalize">
                                                                    Re-Submit
                                                                </span>
                                                            </Button>
                                                        }
                                                        {
                                                            Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                            this.state.approvalData.SPCApprovalConfig.available_actions.map((action) => (
                                                                <Button
                                                                    type='submit'
                                                                    key={action.name}
                                                                    className="py-2 px-4 mr-2"
                                                                    variant="contained"
                                                                    startIcon={action.name === 'Reject' ? <BlockIcon /> : <CheckCircleIcon />}
                                                                    style={action.name === 'Reject' ? { backgroundColor: "#DC3545", color: "white", borderRadius: "10px" } : { borderRadius: "10px", backgroundColor: "#4BB543", color: "white" }}
                                                                    onClick={() => this.openConfirmAlert(action.action, action.name)}
                                                                >
                                                                    <span className="capitalize">
                                                                        {action.name}
                                                                    </span>
                                                                </Button>
                                                            ))
                                                        }
                                                        {(this.state.userRoles.includes('SPC Supervisor') && (this.state.cancelStatus.includes(this.state.currentStatus))) &&
                                                            <Button
                                                                className="mr-2 py-2 px-4"
                                                                progress={false}
                                                                type="button"
                                                                scrollToTop={
                                                                    true
                                                                }
                                                                startIcon={<CloseIcon />}
                                                                style={{ backgroundColor: "orange", color: "white", border: "1px solid orange", borderRadius: "10px" }}
                                                                onClick={() => this.setState({
                                                                    cancelOpen: true
                                                                })}
                                                            >
                                                                <span className="capitalize">
                                                                    Cancel
                                                                </span>
                                                            </Button>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            }
                                        </Grid>
                                        {/* Submit and Cancel Button */}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </ValidatorForm>
                <ConfirmationDialog
                    text={`Are you sure to ${this.state.approvalName} ?`}
                    open={this.state.configOpen}
                    onConfirmDialogClose={() => { this.setState({ configOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ configOpen: false }, () => {
                            this.props.onSubmit(this.state.approvalStatus, this.state.supervisor_remark, this.state.approvalData)
                        })
                    }}
                />
                <ConfirmationDialog
                    text="Are you sure to Update?"
                    open={this.state.updateOpen}
                    onConfirmDialogClose={() => { this.setState({ updateOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ updateOpen: false }, () => {
                            this.onSave()
                        })
                    }}
                />
                <ConfirmationDialog
                    text="Are you sure to Re-Submit?"
                    open={this.state.resubmitOpen}
                    onConfirmDialogClose={() => { this.setState({ resubmitOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ resubmitOpen: false }, () => {
                            this.onResubmit()
                        })
                    }}
                />
                <ConfirmationDialog
                    text="Are you sure to Cancel?"
                    open={this.state.cancelOpen}
                    onConfirmDialogClose={() => { this.setState({ cancelOpen: false }) }}
                    onYesClick={() => {
                        this.setState({ resubmitOpen: false }, () => {
                            this.onCancel()
                        })
                    }}
                />
                {this.state.ploaded &&
                    <WDNPrint purchaseOrderData={this.state.purchaseOrderData} POData={this.state.POData} ItemData={this.state.itemList} hospital={this.state.hospital} user={this.state.user} deliveryData={this.state.deliveryData} />
                }
                {/* </div> */}
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

export default withStyles(styleSheet)(IndividualDetails)
