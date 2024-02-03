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
    Checkbox
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
import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils'

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

import SPCServices from 'app/services/SPCServices'


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

const AddInputDate = ({ onChange = (date) => date, val = null, text = "Add", tail = null }) => (
    <DatePicker
        className="w-full"
        value={val}
        //label="Date From"
        placeholder={`⊕ ${text}`}
        minDate={new Date()}
        format='dd/MM/yyyy'
        //maxDate={new Date("2020-10-20")}
        // required={true}
        // errorMessages="this field is required"
        onChange={onChange}
    />
)

const AddTextInput = ({ type = 'text', onChange = (e) => e, val = "", text = "Add", tail = null }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="sr_no"
        InputLabelProps={{
            shrink: false,
        }}
        value={val}
        type="text"
        variant="outlined"
        size="small"
        onChange={onChange}
        validators={[
            'required',
        ]}
        errorMessages={[
            'this field is required',
        ]}
    />
)

const AddNumberInput = ({ type = 'number', onChange = (e) => e, val = "", text = "Add", tail = null }) => (
    <TextValidator
        className=" w-full"
        placeholder={`⊕ ${text}`}
        // name="issued_amount"
        InputLabelProps={{
            shrink: false,
        }}
        value={val ? String(val) : String(0)}
        type="number"
        variant="outlined"
        size="small"
        min={0}
        onChange={onChange}
        validators={
            ['minNumber:' + 0, 'required:' + true]}
        errorMessages={[
            'Value Should be > 0',
            'this field is required'
        ]}
    />
)

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

class ShipmentValues extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            role: null,

            itemList: [],
            itemData: [],
            totalItems: 0,

            orderQty: 0,
            orderLKRTotal: 0,
            orderExchageTotal: 0,
            transitQty: 0,
            transitLKRTotal: 0,
            transitExchageTotal: 0,
            allocatedQty: 0,
            allocatedLKRTotal: 0,
            allocatedExchangeTotal: 0,

            // single_data:{},

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            data: [],
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
                                    {this.state.itemList[tableMeta.rowIndex].selected ?
                                        <Tooltip title="Item Selected">
                                            <IconButton
                                                className="text-black mr-2"
                                                onClick={() => null}
                                            >
                                                <Icon color='secondary'>check_circle</Icon>
                                            </IconButton>
                                        </Tooltip> :
                                        <Tooltip title="Item Unselected">
                                            <IconButton
                                                className="text-black mr-2"
                                                onClick={() => null}
                                            >
                                                <Icon color='error'>highlight_off</Icon>
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
                                <p style={{ textAlign: "center" }}>{tableMeta.rowIndex + 1}</p>
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
                            return (<p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.price ? convertTocommaSeparated(this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.price, 0) : "N/A"}</p>)
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
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.quantity ? convertTocommaSeparated(this.state.itemList[tableMeta.rowIndex]?.quantity, 0) : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Quantity',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.allocated_quantity ? convertTocommaSeparated(this.state.itemList[tableMeta.rowIndex]?.allocated_quantity, 0) : "Not Available"}</p>
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
                            return (<p>{this.state.itemList[tableMeta.rowIndex]?.transit_quantity ? convertTocommaSeparated(this.state.itemList[tableMeta.rowIndex]?.transit_quantity, 0) : "0"}</p>)
                        }
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
                                        const allocatedQuantity = parseInt(this.state.itemList[tableMeta.rowIndex]?.allocated_quantity || 0);
                                        const remainingQuantity = Math.max(quantity - allocatedQuantity - transitQuantity, 0);

                                        return isNaN(remainingQuantity) ? 'N/A' : remainingQuantity;
                                    })()
                                }</p>
                            )
                        }
                    },
                },
            ],

            // loading: false,
            // single_loading: false,
            filterData: {},

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },
        }
    }

    loadItemData = async () => {
        const { data } = this.props
        try {
            const spcConsignmentItems = data?.consignmentItems;
            const consignmentItemIds = spcConsignmentItems.map(item => item.item_id);

            if (Array.isArray(spcConsignmentItems) && spcConsignmentItems.length > 0) {
                let itemResponse = await SPCServices.getAllSPCPODeliverySchedules({ spc_po_id: spcConsignmentItems[0].spc_po_id });
                const initialArray = itemResponse.data.view.data;
                const newArray = initialArray.map(item => {
                    const matchingIndex = consignmentItemIds.indexOf(item.id);

                    if (matchingIndex !== -1) {
                        return {
                            ...item,
                            selected: true,
                            transit_quantity: spcConsignmentItems[matchingIndex]?.transit_quantity ? spcConsignmentItems[matchingIndex]?.transit_quantity : '0'
                        };
                    } else {
                        return {
                            ...item,
                            selected: false,
                            transit_quantity: '0'
                        };
                    }
                });
                this.setState({ itemList: newArray, totalItems: itemResponse.data.view.totalItems, itemData: initialArray });
            } else {
                this.setState({ alert: true, severity: "info", message: "Info: Seems that you haven't add Item Details" })
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ alert: true, severity: "error", message: `Error: ${error}` })
        }
    };

    // async setPage(page) {
    //     //Change paginations
    //     let formData = this.state.filterData
    //     formData.page = page
    //     this.setState({
    //         formData
    //     }, () => {
    //         console.log("New Form Data: ", this.state.formData)
    //         this.loadData()
    //     })
    // }

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

    onSubmit = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleNext()
    };

    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    };

    async componentDidMount() {
        const { data } = this.props;
        this.setState({ filterData: data, loading: false }, async () => {
            await this.loadItemData()
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
                loading: true
            });
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
    // handleTransitLKRTotal = () => {
    //     const orderAmount = this.handleOrderLKRTotal()
    //     const quantity = this.handleOrderQuantity()
    //     const itemPerPrice = parseFloat(orderAmount / quantity)

    //     const total = this.state.itemList.reduce((accumulator, item) => {
    //         const itemTotal = this.calculateTransitItemTotal(item);
    //         return accumulator + (itemTotal * itemPerPrice);
    //     }, 0);

    //     return total;
    // };

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
        const quantity = this.state.itemData.reduce((accumulator, item) => {
            return accumulator + parseInt(item?.quantity ?? 0, 10);
        }, 0);
        return quantity;
    };

    handleAllocatedQuantity = () => {
        const quantity = this.state.itemList.reduce((accumulator, item) => {
            return accumulator + parseInt(item?.allocated_quantity ?? 0, 10);
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

    componentDidUpdate(prevProps, prevState) {
        if (this.state.data !== prevState.data) {
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
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
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
                                            <Grid item lg={12} md={12} sm={12} xs={12} className='px-4 py-4' style={{ borderRadius: "10px", backgroundColor: "#3B71CA", margin: "0 8px" }}>
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
                                                            {renderDetailCard('Order Total', `LKR ${convertTocommaSeparated(this.state.orderLKRTotal, 2)}`)}
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
                                                            {renderDetailCard('Transit Total', `LKR ${convertTocommaSeparated(this.state.transitLKRTotal, 2)}`)}
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
                                                            {renderDetailCard('Allocated Total', `LKR ${convertTocommaSeparated(this.state.transitLKRTotal, 2)}`)}
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
                                                            {renderDetailCard('Remaining Total', `LKR ${convertTocommaSeparated(Math.max(this.state.orderLKRTotal - this.state.allocatedLKRTotal - this.state.transitLKRTotal, 0), 2)}`)}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Remaining Quantity', `${convertTocommaSeparated(Math.max(this.state.orderQty - this.state.allocatedQty - this.state.transitQty, 0), 0)}`)}
                                                        </div>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12} className='px-4 py-4'>
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
                                                className='mt-5'
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
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="chevron_left"
                                                            style={{ borderRadius: "10px" }}
                                                            onClick={this.onBack}
                                                        >
                                                            <span className="capitalize">
                                                                Previous
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="close"
                                                            style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                            onClick={this.props.handleClose}
                                                        >
                                                            <span className="capitalize">
                                                                Cancel
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            style={{ borderRadius: "10px" }}
                                                            className="py-2 px-4"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            endIcon="chevron_right"
                                                        // onClick={this.props.handleNext}
                                                        >
                                                            <span className="capitalize">
                                                                Next
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
                        </Grid>
                    </ValidatorForm>
                </div>
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

export default withStyles(styleSheet)(ShipmentValues)
