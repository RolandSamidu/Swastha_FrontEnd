import React, { Component, Fragment, useState } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    Divider,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    Typography,
    Checkbox,
    Button,
} from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import 'date-fns'

import {
    DatePicker,
    LoonsSnackbar,
    CardTitle,
    SubTitle,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import ConfirmationDialog from 'app/components/ConfirmationDialog/ConfirmationDialog'


import SearchIcon from '@mui/icons-material/Search';
import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils'

import EmployeeServices from 'app/services/EmployeeServices'

import CloseIcon from '@material-ui/icons/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import localStorageService from 'app/services/localStorageService'

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
            // disableClearable
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
        this.state = {
            activeStep: 1,
            role: null,
            checked: false,
            supervisor_remark: null,
            isEdit: this.props?.isEdit,

            // single_data:{},
            ploaded: false,
            POData: {},
            purchaseOrderData: {},
            printLoaded: false,

            data: {},
            approvalData: {},
            itemList: [],
            itemData: [],

            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
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
                                        :
                                        <Tooltip title="Selection Disabled">
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
                    label: 'Ordered Qty',
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

                                    //quantity - itemRemaining

                                    validators={[
                                        'required', 'minNumber: 0', `maxNumber:${quantity - itemRemaining}`
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
                invoice_no: false,
                invoice_date: false,
                wharf_ref_no: false,
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
    }

    openConfirmAlert = (status, name) => {
        if (this.state.checked && name === "Approved") {
            this.setState({ supervisor_remark: "", approvalStatus: status, approvalName: name, configOpen: true })
        } else if (!this.state.checked && name === "Reject" && this.state.supervisor_remark !== "" && !isNull(this.state.supervisor_remark)) {
            this.setState({ approvalStatus: status, approvalName: name, configOpen: true })
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

    loadApprovalData = async () => {
        const { data } = this.props;
        let userRoles = await localStorageService.getItem('userInfo')?.roles;
        const params = {
            consignment_id: data?.id, approval_user_type: userRoles, status: 'Pending', approval_type: this.props.isResubmit ? "RESUBMISSION" : ""
        };
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
            // this.loadData()
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

    loadItemData = async () => {
        const { data } = this.props
        try {
            this.setState({ loading: false });
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

            // Load item data
            await this.getUser();

            this.setState({
                ploaded: true,
                POData: po_res_single.data.view,
                purchaseOrderData: consignment_res.data.view,
                printLoaded: true,
            }, () => {
                document.getElementById('ldcn_print').click();
            });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }

    async componentDidMount() {
        let userRoles = await localStorageService.getItem('userInfo')?.roles
        const { data, id } = this.props;
        console.log("ID: ", id, data)
        this.setState({ filterData: data, selected_id: id, userRoles: userRoles, loading: false }, async () => {
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
            console.log("Data: ", data)
        })
    }

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
        const orderAmount = isNaN(parseFloat(this.state.filterData?.order_amount)) ? 0 : parseFloat(this.state.filterData?.order_amount)


        return orderAmount;
    };


    handleTransitExchangeTotal = () => {
        const orderAmount = this.handleOrderExchangeTotal()
        const quantity = this.handleOrderQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)

        const total = this.state.itemList.reduce((accumulator, item) => {
            const itemTotal = this.calculateTransitItemTotal(item);
            return accumulator + (itemTotal * itemPerPrice);
        }, 0);

        return total;
    };

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

    formatRemarks = () => {
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
            });
        } if (this.state.verified !== prevState.verified) {
            const remarks = this.formatRemarks();
            this.setState({ supervisor_remark: remarks.join('\n') })
        }
    }

    onSubmit = () => {
        this.setState({ configOpen: true })
    }

    onSave = async () => {
        const { id } = this.props
        try {
            const { invoice_no, invoice_date, remark, supervisor_remark } = this.state.filterData

            const order_amount = this.state.transitExchageTotal;
            const total = parseFloat(this.state.orderExchageTotal);
            const values_in_currency = parseFloat(this.state.transitExchageTotal);
            const values_in_lkr = parseFloat(this.state.transitExchageTotal);

            let data = {
                invoice_no: invoice_no,
                invoice_date: invoice_date,
                wdn_recieved: null,
                received_date: null,
                remark: remark,
                total: total,
                supervisor_remark: supervisor_remark,
                values_in_currency: values_in_currency,
                values_in_lkr: values_in_lkr,
                order_amount: order_amount,
            }

            let consignment_res = await SPCServices.changeConsignmentByID(id, data)
            if (consignment_res.status === 200) {
                this.setState({
                    severity: "success",
                    alert: true,
                    message: "SPC Consignment was Updated",
                })
                if (this.props.isResubmit) {
                    this.setState({ isSave: true })
                } else {
                    setTimeout(() => {
                        this.props.handleClose()
                    }, 1200)
                }

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

    updateConsignmentItems = async (selectedIndex) => {
        console.log(1)
        const item = this.state.itemList[selectedIndex]
        const itemAllocatedQuantity = parseInt(this.state.itemData[selectedIndex]?.allocated_quantity ?? 0, 10);
        const itemTransitQuantity = parseInt(this.state.itemData[selectedIndex]?.transit_quantity ?? 0, 10);
        const itemRemainingQuantity = itemAllocatedQuantity - itemTransitQuantity

        if (item?.quantity >= item?.transit_quantity + itemRemainingQuantity) {
            const data = {
                transit_quantity: item?.transit_quantity
            }

            console.log(2)
            try {
                let res = await SPCServices.changeConsignmentItemById(item?.id, data)
                if (res.status) {
                    console.log(3)
                    this.setState({ alert: true, severity: "success", message: "SPC Consignment Item Updated Successfully" })
                }
            } catch (err) {
                this.setState({ alert: true, severity: "error", message: `Error: ${err}` })
            }
        } else {
            this.setState({ alert: true, severity: "error", message: `Error: Transit Quantity > Order Quantity` })
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

    onResubmit = async () => {
        const { id } = this.props
        if (id) {
            let res = await SPCServices.createConsignmentResubmission({ consignment_id: id })
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
                                                    <Typography variant="h6" className="font-semibold">Shipping Details </Typography>
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
                                            <AddTextInput onChange={(e) => {
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
                                            }} val={this.state.filterData.ldcn_ref_no} text='Enter Shipment No' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="LDCN Number" />
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
                                            }} val={this.state.filterData.wdn_no} text='Enter LDN Number' type='text' />
                                        </Grid>
                                        <Grid
                                            className=" w-full"
                                            item
                                            lg={3}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <SubTitle title="LDCN Date" />
                                            <AddInputDate onChange={(date) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.wdn_date = date
                                                this.setState({ filterData })
                                            }} val={this.state.filterData.ldcn_date} text='Enter LDCN Date' />
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
                                            lg={4}
                                            md={4}
                                            sm={6}
                                            xs={12}
                                        >
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Invoice Number" />
                                                    <AddTextInput disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
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
                                                        }} val={this.state.filterData.invoice_no} text='Enter Invoice No' type='text' />
                                                </div>
                                                <div>
                                                    {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                        <Checkbox
                                                            checked={this.state.verified.invoice_no && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, invoice_no: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    }
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
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="Invoice Date" />
                                                    <AddInputDate disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                        onChange={(date) => {
                                                            let filterData =
                                                                this.state.filterData
                                                            filterData.invoice_date = date
                                                            this.setState({ filterData })
                                                        }} val={this.state.filterData.invoice_date} text='Enter Invoice Date' />
                                                </div>
                                                <div>
                                                    {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                        <Checkbox
                                                            checked={this.state.verified.invoice_date && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, invoice_date: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    }
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
                                            <div style={{ display: "flex", flexDirection: "row" }}>
                                                <div style={{ flex: 1 }}>
                                                    <SubTitle title="WHARF Ref No" />
                                                    <AddTextInput disable={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")} onChange={(e) => {
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
                                                <div>
                                                    {Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) &&
                                                        <Checkbox
                                                            checked={this.state.verified.wharf_ref_no && !this.state.checked}
                                                            onChange={(e) => {
                                                                this.setState({ verified: { ...this.state.verified, wharf_ref_no: e.target.checked } })
                                                            }}
                                                            name="chkbox_confirm"
                                                            color="secondary"
                                                            checkedIcon={<CloseIcon />}
                                                        />
                                                    }
                                                </div>
                                            </div>
                                        </Grid>

                                        <Grid item lg={12} md={12} sm={12} xs={12}></Grid>
                                        <Grid item lg={4} md={4} sm={6} xs={6}>
                                            <SubTitle title="LDCN Recieved" />
                                            <AddInput
                                                options={[{ label: "YES" }, { label: "NO" }]}
                                                val={this.state.filterData.ldcn_recieved}
                                                getOptionLabel={(option) => option.label || ""}
                                                text='LDCN Recieved: N/A'
                                                onChange={(e, value) => {
                                                    const newFormData = {
                                                        ...this.state.filterData,
                                                        ldcn_recieved: e.target.textContent ? e.target.textContent : e.target.value,
                                                        ldcn_recieved_id: value ? value.id : null,
                                                    };

                                                    this.setState({ formData: newFormData });
                                                }
                                                }
                                            />
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={6} xs={6}>
                                            <SubTitle title="Received Date" />
                                            <AddInputDate onChange={(date) => {
                                                let filterData =
                                                    this.state.filterData
                                                filterData.received_date = date
                                                this.setState({ filterData })
                                            }} val={this.state.filterData.received_date} text='Received Date: N/A' />
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
                                                        {renderDetailCard('Order Total', `LKR ${convertTocommaSeparated(this.state.orderLKRTotal, 4)}`)}
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
                                                        {renderDetailCard('Transit Total', `LKR ${convertTocommaSeparated(this.state.transitLKRTotal, 4)}`)}
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
                                                        {renderDetailCard('Allocated Total', `LKR ${convertTocommaSeparated(this.state.allocatedLKRTotal, 4)}`)}
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
                                                        {renderDetailCard('Remaining Total', `LKR ${convertTocommaSeparated(this.state.orderLKRTotal - this.state.transitLKRTotal - this.state.allocatedLKRTotal, 4)}`)}
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

                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        ></Grid>
                                        <Grid
                                            item
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            xs={12}
                                        >
                                            <SubTitle title="Remarks" />
                                            <TextValidator
                                                multiline
                                                disabled={!(this.state.isEdit && this.state.filterData.status !== "APPROVED")}
                                                minRows={4}
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
                                        {this.state.loading && Array.isArray(this.state.approvalData?.SPCApprovalConfig?.available_actions) ? (
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
                                            </>) : this.state.filterData?.supervisor_remark && (
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
                                                        progress="false"
                                                        type="button"

                                                        startIcon={<CloseIcon />}
                                                        style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                        onClick={this.props.handleClose}
                                                    >
                                                        <span className="capitalize">
                                                            Close
                                                        </span>
                                                    </Button>
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
                                                                    <Typography className=" text-gray font-semibold text-13" style={{ lineHeight: '1' }}>Checked</Typography>
                                                                </div>
                                                                <div>
                                                                    <Checkbox
                                                                        defaultChecked={this.state.checked ? this.state.checked : false}
                                                                        checked={this.state.checked ? this.state.checked : false}
                                                                        // required
                                                                        onChange={() => {
                                                                            this.setState({ checked: !this.state.checked })
                                                                        }}
                                                                        name="chkbox_confirm"
                                                                        color="primary"
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                        {/* Submit Button */}
                                                        <Button
                                                            className="mr-2 py-2 px-4"
                                                            progress="false"
                                                            // type="submit"

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
                                                                progress="false"
                                                                // type="submit"

                                                                disabled={this.state.isSave}
                                                                style={!this.state.isSave ? { backgroundColor: "#4BB543", color: "white", borderRadius: "10px" } : { backgroundColor: "#dddddd", color: "white", borderRadius: "10px" }}
                                                                startIcon={<SaveIcon />}
                                                                onClick={() => this.setState({ updateOpen: true })}
                                                            >
                                                                <span className="capitalize">
                                                                    save
                                                                </span>
                                                            </Button>
                                                        }
                                                        {this.props.isResubmit &&
                                                            <Button
                                                                className="mr-2 py-2 px-4"
                                                                progress="false"
                                                                // type="submit"
                                                                disabled={!this.state.isSave}

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
                                                                    key={action.name}
                                                                    className="py-2 px-4 mr-2"
                                                                    variant="contained"
                                                                    type='submit'
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
                                                                progress="false"
                                                                type="button"

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

                {/* {this.state.ploaded &&
                    <LDCNPrint purchaseOrderData={this.state.purchaseOrderData} POData={this.state.POData} ItemData={this.state.itemList} hospital={this.state.hospital} user={this.state.user} />
                } */}
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
