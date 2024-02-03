import {
    CircularProgress,
    Dialog,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
    Popper,
    Paper,
    Divider,
    Tabs,
    Tab,

} from '@material-ui/core';
// import { Button } from '@material-ui/core'
import moment from 'moment';

import {
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsSnackbar,
    LoonsDialogBox,
    LoonsTable,
    SubTitle,
    Button,
    ProgressBar
} from 'app/components/LoonsLabComponents';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents';
import FilterComponent from '../filterComponent';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import { Autocomplete } from '@material-ui/lab';
import RemarkServices from 'app/services/RemarkServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import localStorageService from 'app/services/localStorageService';
import DistributionCenterServices from 'app/services/DistributionCenterServices';
import { dateParse, dateTimeParse, getDateDifference } from "utils";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import WarehouseServices from 'app/services/WarehouseServices';
import VisibilityIcon from '@material-ui/icons/Visibility';
import InventoryService from 'app/services/InventoryService';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import EstimationService from 'app/services/EstimationService';
import ConsignmentService from 'app/services/ConsignmentService'
import MDSService from 'app/services/MDSService'
import MDS_AddVehicleNew from "../../MSD_Medical_Supply_Assistant/MDS_AddVehicleNew";
import HistoryAllocated from './HistoryAllocated';
import HistoryAllocatedInstitute from './HistoryAllocatedInstitute';
import CashSale from './CashSales/index';

import { convertTocommaSeparated, roundDecimal, includesArrayElements } from 'utils';
import { order_type } from 'appconst';
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices';

class AllItemsDistribution extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isEditable: true,
            activeTab: 0,
            historyAllocated: null,
            orderData: null,
            national_estimationData: null,
            printData: null,
            submitting: false,
            submitting_form: false,
            issuing: false,
            totalUpdate: true,
            remainingAllocation: 0,
            batchAllocationItemvalues: [],
            batchAllocationItemUpdated: [],
            batchAllocationPreValue: [],
            batchAllocationItemVolumes: [],
            totalAllocated: 0,
            unable_to_fill: 'hidden',
            remarks_other: 'hidden',
            selected_item: [],
            data: [],
            itemsnap: [],
            itemBatch: [],
            allocatedqty: false,
            msd_reserved_qty: null,
            batch_details_data: [],
            edit_item: [],
            selected_order_item_id: null,
            estimationLoaded: false,
            userRole: null,
            edit_item_columns: [
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no
                        },
                    },
                },
                {
                    name: 'exp_date',
                    label: 'Exp Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.ItemSnapBatch?.exd)
                        },
                    },
                },

                {
                    name: 'my_quantity',
                    label: 'My Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('cheking jjfjfjf',this.state.edit_item[tableMeta.rowIndex] )
                            if (this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === "EUV2V2") { 
                                return convertTocommaSeparated(Math.floor(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity * this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size), 0) + ' ' + this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return convertTocommaSeparated(Math.floor(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity), 0)
                            }

                        },
                    },
                },
                {
                    name: 'my_quantity',
                    label: 'Reserveble Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            //console.log('stockdata', this.state.edit_item[tableMeta.rowIndex])
                            //console.log('stockdata bin_id', this.state.itemsnap)
                            let reserved_quantity = parseFloat(this.state.itemsnap.filter((data) => data.bin_id == this.state.edit_item[tableMeta.rowIndex].bin_id)[tableMeta.rowIndex]?.reserved_quantity);
                            //console.log("quantity", reserved_quantity)
                            // let reserved_quantity = parseFloat(this.state.itemsnap[tableMeta.rowIndex].reserved_quantity)

                            let quantity = (this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))
                            console.log("checkquantity", quantity)

                            if (this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === "EUV2") {
                                if (quantity === '' || quantity === null || isNaN(quantity)) {
                                    return <p>{convertTocommaSeparated(parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity * this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size), 0) + ' ' + this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name}</p>
                                }
                                else {
                                    return (
                                        <p>{convertTocommaSeparated(quantity * this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 0) + ' ' + this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name}</p>
                                    )
                                }
                            } else {
                                if (quantity === '' || quantity === null || isNaN(quantity)) {
                                    return <p>{convertTocommaSeparated(parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity), 0)}</p>
                                }
                                else {
                                    return (
                                        <p>{convertTocommaSeparated(quantity, 0)}</p>
                                    )
                                }
                            }




                        }
                    },
                },
                {
                    name: 'Allocated Quantity',
                    label: 'Allocated Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <ValidatorForm>
                                    {(this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === "EUV2" && this.state.edit_item[tableMeta.rowIndex]?.allocated_quantity > 0) &&
                                        <p className='pt-1 pb-1 pl-5 pr-5' style={{ border: '1px solid #ffd600', backgroundColor: '#fff59d', borderRadius: '3px', textAlign: 'center' }}>{roundDecimal(this.state.edit_item[tableMeta.rowIndex]?.allocated_quantity / this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.MeasuringUnit?.name}</p>
                                    }
                                    <TextValidator
                                        placeholder="Quantity"
                                        value={this.state.edit_item[tableMeta.rowIndex]?.allocated_quantity}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {

                                            let reserved_quantity = parseFloat(this.state.itemsnap.filter((data) => data.bin_id == this.state.edit_item[tableMeta.rowIndex].bin_id)[tableMeta.rowIndex]?.reserved_quantity);

                                            let quantity = (this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))
                                            console.log("checkquantity", quantity)
                                            let reservable_qty = quantity;
                                            // console.log(quantity)

                                            if (quantity === '' || quantity === null || isNaN(quantity)) {
                                                reservable_qty = parseFloat(this.state.batch_details_data[tableMeta.rowIndex].quantity)
                                            } else {
                                                reservable_qty = quantity;
                                            }


                                            if (Number(reservable_qty) + Number(this.state.edit_item[tableMeta.rowIndex].allocated_qty_temp) >= Number(e.target.value)) {
                                                let edit_item = this.state.edit_item;
                                                edit_item[tableMeta.rowIndex].allocated_quantity = e.target.value;
                                                this.setState({ edit_item })
                                            } else {
                                                let edit_item = this.state.edit_item;
                                                edit_item[tableMeta.rowIndex].allocated_quantity = 0;
                                                this.setState({ edit_item })
                                                this.setState(
                                                    { message: "Cannot allocate more than available quantity", alert: true, severity: "Error" }
                                                )
                                            }


                                        }}

                                        validators={[`maxNumber:${Math.floor(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity)}`, `minNumber:0`]}
                                        errorMessages={[
                                            'Cannot Over My Qty', 'Should be Grater than 0'
                                        ]}
                                        InputProps={{
                                            endAdornment: (
                                                this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === "EUV2" ? (
                                                    <InputAdornment position="end" className='mr-1'>
                                                        {this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name}
                                                    </InputAdornment>
                                                ) : null // Render nothing when the condition is not met
                                            )
                                        }}
                                    />
                                </ValidatorForm>)
                        }
                    }
                },
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return (
                                <Grid className="flex items-center">
                                    <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    if (Math.floor(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity) < this.state.edit_item[tableMeta.rowIndex].allocated_quantity) {

                                                    } else if (this.state.edit_item[tableMeta.rowIndex].allocated_quantity < 0) {

                                                    } else {
                                                        this.editItemBatch(this.state.edit_item[tableMeta.rowIndex])
                                                    }
                                                }}>
                                                <SaveIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    {/* <Grid className="px-2">
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                   }}>
                                                <DeleteIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid> */}
                                </Grid>
                            );


                        },
                    },
                },

            ],
            expandedData: null,
            popoveropen: false,
            anchorEl: null,
            ConsignmentItemDetails: [],
            selectedRowMetaData: null,
            warning_alert_without_estimation: false,
            warning_alert_for_lastAllocate: false,
            allocationMessage: '',
            pendingAllocateError: false,
            pendingAllocateErrorMessage: null,
            selected_item_det:{},
            columns: [
                {
                    name: '',
                    label: '',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex]?.newly_added) {
                                return <p style={{ color: 'red' }}>Newly Added</p>
                            }

                        },
                    },
                },
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('SRNO',this.data[tableMeta.rowIndex].ItemSnap.sr_no)
                            return this
                                .state
                                .data[tableMeta.rowIndex]
                                .ItemSnap.sr_no
                        }
                    }
                }, {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .data[tableMeta.rowIndex]
                                .ItemSnap
                                .medium_description
                        }
                    }
                }, {
                    name: 'pack_size',
                    label: 'Pack size',

                    options: {
                        // filter: true,
                        //display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let quantity = this.letPackSize(this.state.data[tableMeta.rowIndex])
                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2') {
                                return this.state.data[tableMeta.rowIndex]?.ItemSnap?.MeasuringUnit?.name
                            } else {
                                return (
                                    (quantity)
                                )
                            }
                            

                        }
                    }
                },
                // {
                //     name: ' Institution_balance',
                //     label: ' Institution Balance',
                //     options: {
                //         // filter: true,
                //     }
                // },
                // , {     name: 'parend_drugstore_qty',     label: 'Parend Drugstore Qty',
                // options: {          filter: true,     } }
                {
                    name: 'my_stock_days',
                    label: 'My Stock Days',

                    options: {
                        // filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            return convertTocommaSeparated(this.calculateMyStockDays(this.state.data[tableMeta.rowIndex]), 2)


                        }
                    }
                },
                {
                    name: '',
                    label: 'MSD Qty',
                    options: {
                        // filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.calculateParentWarehouseQty(this.state.data[tableMeta.rowIndex]), 0)
                        }
                    }
                },
                {
                    name: 'msd_reserved_qty',
                    label: 'MSD Available Qty',
                    options: {
                        display: false,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.ParentReservedQty(this.state.data[tableMeta.rowIndex]), 0)
                        }

                    }
                },
                {
                    name: 'institute_qty',
                    label: 'Insititute Qty',
                    options: {
                        // filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            convertTocommaSeparated(this.instituteQty(this.state.data[tableMeta.rowIndex]), 0)

                        }
                    }
                },
                {
                    name: 'total_remaining_dy',
                    label: 'Insititute Stock Days',

                    options: {
                        // filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.calculateStockDays(this.state.data[tableMeta.rowIndex]), 2)

                        }
                    }
                },
                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('CHECKING DATA', this.state.data[tableMeta.rowIndex])
                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2') {
                                return convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.request_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.request_quantity, 2)
                            }

                        }
                    }
                },
                {
                    name: 'order_qty_days',
                    label: 'Order For(Days)',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.OrderExchange.order_for, 2)
                        }
                    }
                },
                {
                    name: 'order_qty_days',
                    label: 'Order Qty Days',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.request_quantity / this.state.data[tableMeta.rowIndex]?.OrderExchange.order_for, 2)
                        }
                    }
                },



                {
                    name: 'unit_price',
                    label: 'Standard Unit Price',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log("Data: ", this.state.data)
                            return this.state.data[tableMeta.rowIndex]?.ItemSnap.standard_cost;
                        }
                    }
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2') {
                                return convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.allocated_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.allocated_quantity, 2)
                            }

                        }

                    }
                },

                {
                    name: 'to_be_issue_quantity',
                    label: 'Plan to Allocate Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let estimation_qty = 0;
                            let items = this.state.estimationData.filter(((ele) => ele.item_id == this.state.data[tableMeta.rowIndex].item_id))
                            if (items.length > 0) {
                                estimation_qty = items[0].estimation
                            } else {
                                estimation_qty = 0;
                            }

                            return (
                                <div>
                                    {(this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2' && this.state.data[tableMeta.rowIndex].to_be_issue_quantity > 0) &&
                                        <p className='pt-1 pb-1 pl-5 pr-5' style={{ border: '1px solid #ffd600', backgroundColor: '#fff59d', borderRadius: '3px', textAlign: 'center' }}>{roundDecimal(this.state.data[tableMeta.rowIndex].to_be_issue_quantity / this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.MeasuringUnit?.name}</p>
                                    }
                                    <TextValidator
                                        placeholder="Plan to Allocate Qty"
                                        //variant="outlined"
                                        // disabled={estimation_qty == 0 ? true : false}
                                        disabled={(this.state.order?.approval_status == "PENDING" || this.state.order?.approval_status == "REJECTED")}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={roundDecimal(this.state.data[tableMeta.rowIndex].to_be_issue_quantity, 0)}
                                        onFocus={(e) => {
                                            console.log("seleceted Data", this.state.data[tableMeta.rowIndex])
                                            this.setState({ expandedData: this.state.data[tableMeta.rowIndex] });
                                            this.loadLastRecievedData(this.state.data[tableMeta.rowIndex])
                                            this.handlePopper(e)
                                            this.calculateEstimationQty(this.state.data[tableMeta.rowIndex])
                                        }}
                                        onBlur={this.handleCloseSnackbar}
                                        onChange={(e) => {
                                            let data = this.state.data;

                                            data[tableMeta.rowIndex].to_be_issue_quantity = e.target.value;
                                            // data[tableMeta.rowIndex].to_be_issue_quantity_temp = e.target.value;
                                            data[tableMeta.rowIndex].editing = true;
                                            data[tableMeta.rowIndex].rowQtyEnable = true;

                                            this.setState(
                                                {
                                                    data
                                                }
                                            )
                                        }}

                                        InputProps={{
                                            endAdornment: (
                                                <>
                                                    {this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2' ? (
                                                        <InputAdornment position="end" className='mr-1'>
                                                            {this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name}
                                                        </InputAdornment>
                                                    ) : null}

                                                    {this.state.isEditable &&
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                disabled={this.state.order?.approval_status == "PENDING" || this.state.order?.approval_status == "REJECTED"}
                                                                onClick={() => {
                                                                    if (estimation_qty == 0) {
                                                                        this.setState({ selectedRowMetaData: tableMeta, warning_alert_without_estimation: true })
                                                                    } else {
                                                                        this.checkAllocatingQty(tableMeta)
                                                                    }
                                                                }}
                                                            >
                                                                <SaveIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    }


                                                </>
                                            )
                                        }}

                                    />
                                </div>
                            )
                        }
                    }
                },




                {
                    name: 'remark',
                    label: 'Remark',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {


                            return (
                                <div>
                                    <TextValidator
                                        placeholder="Remark"
                                        //variant="outlined"
                                        disabled={!this.state.isEditable}
                                        // disabled={estimation_qty == 0 ? true : false}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        value={this.state.data[tableMeta.rowIndex].remarks}

                                        onChange={(e) => {
                                            let data = this.state.data;

                                            data[tableMeta.rowIndex].remarks = e.target.value;
                                            this.setState(
                                                {
                                                    data
                                                }
                                            )
                                        }}



                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end" >
                                                    {this.state.isEditable &&
                                                        <IconButton
                                                            onClick={() => {
                                                                this.submitRemark(tableMeta)
                                                            }}
                                                        >

                                                            <SaveIcon ></SaveIcon>
                                                        </IconButton>
                                                    }
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </div>
                            )
                        }
                    }
                },


                // , {     name: 'batch_details',     label: 'Batch Details',     options: {
                // filter: true,     } }
                {
                    name: 'total',
                    label: 'Unit Total',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log("Data: ", this.state.data)
                            return convertTocommaSeparated(this.state.data[tableMeta.rowIndex].to_be_issue_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap.standard_cost, 2);
                        }
                    }
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let id = this.state.data[tableMeta.rowIndex].id;
                            return (
                                <>{this.state.isEditable &&
                                    <Grid className='mt-9' container={2} spacing={1}>
                                        {
                                            this.state.data[tableMeta.rowIndex].status == "Active" || this.state.data[tableMeta.rowIndex].status == "APPROVED" || this.state.data[tableMeta.rowIndex].status == "DROPPED" || this.state.data[tableMeta.rowIndex].status == "Pending" || this.state.data[tableMeta.rowIndex].status == "ALLOCATED" || this.state.data[tableMeta.rowIndex].status == "ORDERED" ?
                                                (this.state.data[tableMeta.rowIndex].to_be_issue_quantity == '' || this.state.data[tableMeta.rowIndex].to_be_issue_quantity == 0 || this.state.data[tableMeta.rowIndex].to_be_issue_quantity == null) || this.state.data[tableMeta.rowIndex].editing == true ? null :
                                                    <Grid item>

                                                        < Button style={(this.state.data[tableMeta.rowIndex].status == "ALLOCATED" || this.state.data[tableMeta.rowIndex].status == "DROPPED") ?
                                                            { backgroundColor: '#9b9b9b', color: 'white' } : { backgroundColor: '#1a73e8', color: 'white' }}
                                                            onClick={() => {
                                                                this.setState({
                                                                    batch_details_data: [], 
                                                                    selected_item_det: this.state.data[tableMeta.rowIndex]
                                                                })
                                                                this.state.selected_item = tableMeta.rowIndex
                                                                let items = this.state.estimationData.filter(((ele) => ele.item_id == this.state.data[tableMeta.rowIndex].item_id))
                                                                if (items.length > 0) {

                                                                    /*  this.setState({
                                                                         selected_estimation_id: items[0].id,
                                                                         selected_item_estimation: items[0].estimation,
                                                                         selected_item_remaining_estimation: items[0].estimation - (Number(items[0].allocated_quantity ? items[0].allocated_quantity : 0) + Number(items[0].issued_quantity ? items[0].issued_quantity : 0))
                                                                     }) */
                                                                    this.calculateEstimationQty(this.state.data[tableMeta.rowIndex])
                                                                    console.log("data status", this.state.data[tableMeta.rowIndex].status)

                                                                    if (this.state.data[tableMeta.rowIndex].status === "APPROVED" || this.state.data[tableMeta.rowIndex].status === "Approved" || this.state.data[tableMeta.rowIndex].status === "PENDING" || this.state.data[tableMeta.rowIndex].status === "Pending" || this.state.data[tableMeta.rowIndex].status === "Active" || this.state.data[tableMeta.rowIndex].status === "ACTIVE" || this.state.data[tableMeta.rowIndex].status === "ORDERED") {

                                                                        this.setState({
                                                                            batchAllocationItemvalues: [],
                                                                            batchAllocationItemVolumes: [],
                                                                            batchAllocationPreValue: [],
                                                                            batchAllocationItemUpdated: [],
                                                                            totalAllocated: 0,
                                                                            allocate: {
                                                                                order_item_id: null,
                                                                                activity: "ITEM RECEIVED",
                                                                                date: null,
                                                                                status: "ITEM RECEIVED",
                                                                                remark_id: null,
                                                                                remark_by: null,
                                                                                type: "ITEM RECEIVED",
                                                                                volume: 0,
                                                                                quantity: 0,
                                                                                item_batch_allocation_data: [],
                                                                                warehouse_id: this.state.data[this.state.selected_item].OrderExchange?.to,

                                                                            },
                                                                            allocate_item: true,
                                                                            remainingAllocation: roundDecimal(this.state.data[tableMeta.rowIndex].to_be_issue_quantity, 0),
                                                                            selectedID: this.state.data[tableMeta.rowIndex]
                                                                        }
                                                                            ,
                                                                            () => {
                                                                                this.orderBatchAllocation(this.state.data[tableMeta.rowIndex].item_id)
                                                                            }
                                                                        )



                                                                        this.state.batchAllocationItemvalues = []
                                                                        this.state.batchAllocationItemVolumes = []
                                                                        this.props.id.match.params.type == "Return" ? this.getRetBatchData() : this.getBatchData(false)
                                                                    }
                                                                } else {
                                                                    /*  this.setState({
                                                                         selected_estimation_id: null,
                                                                         selected_item_estimation: "Not Estimated",
                                                                         selected_item_remaining_estimation: "Not Estimated"
                                                                     }) */

                                                                    console.log("selected item", this.state.selected_item)
                                                                    console.log("selected item data", this.state.data[this.state.selected_item])
                                                                    this.setState({
                                                                        batchAllocationItemvalues: [],
                                                                        batchAllocationItemVolumes: [],
                                                                        batchAllocationPreValue: [],
                                                                        batchAllocationItemUpdated: [],
                                                                        totalAllocated: 0,
                                                                        allocate: {
                                                                            order_item_id: null,
                                                                            activity: "ITEM RECEIVED",
                                                                            date: null,
                                                                            status: "ITEM RECEIVED",
                                                                            remark_id: null,
                                                                            remark_by: null,
                                                                            type: "ITEM RECEIVED",
                                                                            volume: 0,
                                                                            quantity: 0,
                                                                            item_batch_allocation_data: [],
                                                                            warehouse_id: this.state.data[this.state.selected_item].OrderExchange?.to,

                                                                        },
                                                                        allocate_item: true,
                                                                        remainingAllocation: roundDecimal(this.state.data[tableMeta.rowIndex].to_be_issue_quantity, 0),
                                                                        selectedID: this.state.data[tableMeta.rowIndex]
                                                                    }
                                                                        ,
                                                                        () => {
                                                                            this.orderBatchAllocation(this.state.data[tableMeta.rowIndex].item_id)
                                                                        }
                                                                    )
                                                                    this.state.batchAllocationItemvalues = []
                                                                    this.state.batchAllocationItemVolumes = []
                                                                    this.props.id.match.params.type == "Return" ? this.getRetBatchData() : this.getBatchData(false)

                                                                }
                                                            }
                                                            }
                                                            disabled={(this.state.data[tableMeta.rowIndex].status == "ALLOCATED" || this.state.data[tableMeta.rowIndex].status == "DROPPED") ? true : false}
                                                        >
                                                            {this.state.data[tableMeta.rowIndex].status == "DROPPED" ? 'Rejected' : this.state.data[tableMeta.rowIndex].status == "ALLOCATED" ? 'Allocated' : <AddCircleIcon />}
                                                        </Button>
                                                    </Grid>
                                                : null
                                        }


                                        {this.state.data[tableMeta.rowIndex].status == "Active" || this.state.data[tableMeta.rowIndex].status == "APPROVED" || this.state.data[tableMeta.rowIndex].status == "Pending" || this.state.data[tableMeta.rowIndex].status == "ALLOCATED" || this.state.data[tableMeta.rowIndex].status == "ISSUE SUBMITTED" ?
                                            <Grid item >
                                                < Button style={{ backgroundColor: '#1a73e8', color: 'white', marginLeft: '2px', visibility: (this.state.data[tableMeta.rowIndex].status == "ALLOCATED" || this.state.data[tableMeta.rowIndex].status == "ISSUE SUBMITTED") ? 'show' : 'hidden' }} onClick={
                                                    () => {
                                                        let selected_item_edit = this.state.data[tableMeta.rowIndex]
                                                        console.log('selectesd item checking', tableMeta.rowIndex)
                                                        this.setState({ selected_item: tableMeta.rowIndex, selected_item_det: this.state.data[tableMeta.rowIndex]})
                                                        
                                                        this.loadBatchData(selected_item_edit.id, selected_item_edit.item_id)

                                                        // this.setState({ allocate_item: true },
                                                        // //     () => {
                                                        // //     this.orderItemAllocation(this.state.warehouseListfull,this.state.uniquitemslistfull)
                                                        // // }
                                                        // )

                                                        // TODO
                                                        this.state.batchAllocationItemvalues = []
                                                        this.state.batchAllocationItemVolumes = []
                                                        this.props.id.match.params.type == "Return" ? this.getRetBatchData() : this.getBatchData(false)

                                                    }
                                                }
                                                > <EditIcon /></Button>
                                            </Grid>
                                            : null
                                        }



                                        {/* <Grid item lg={3} className='ml-7'>
                                        <Tooltip title="View">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/msd_all_order/warehouse-details/${id}`
                                                }}>
                                                <VisibilityIcon color='primary' />
                                            </IconButton>
                                        </Tooltip>

                                        </Grid> */}

                                    </Grid>
                                }
                                </>
                            )
                        }
                    }
                }
            ],
            vehicle_data: [],
            vehicle_columns: [
                {
                    name: 'Vehicle',
                    label: 'Hospital ID',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex].owner_id)
                        }
                    }
                },
                {
                    name: 'Vehicle',
                    label: 'Vehicle Reg No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex].reg_no)
                        }
                    }
                },

                /*  {
                     name: 'ordered_qty',
                     label: 'Vehicle Type',
                     options: {
                         display: true,
                         // customBodyRender: (value, tableMeta, updateValue) => {
                         //     return this
                         //         .state
                         //         .itemTable[tableMeta.rowIndex]
                         //         .request_quantity
                         // }
                     }
                 }, */
                /* {
                    name: 'drugstore_qty',
                    label: 'Vehicle Storage Type',
                    options: {
                        display: true
                    }
                }, */
                {
                    name: 'Vehicle',
                    label: 'Max Volume',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex].max_volume)
                        }
                    }
                },
                /*   {
                      name: 'drugstore_qty',
                      label: 'Reserved Capacity',
                      options: {
                          display: true
                      }
                  }, */
                {
                    name: 'Vehicle',
                    label: 'Status',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('data', tableMeta);
                            return (tableMeta.rowData[tableMeta.columnIndex].status)
                        }
                    }
                },
                /*  {
                     name: 'drugstore_qty',
                     label: 'Reserved Date',
                     options: {
                         display: true
                     }
                 }, */
                /*   {
                      name: 'drugstore_qty',
                      label: 'Time',
                      options: {
                          display: true
                      }
                  }, */

            ],


            batch_details: [
                // {     name: 'invoice',     label: 'Invoice No',     options: {} },
                {
                    name: 'warehousebin',
                    label: 'Warehouse Bin',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batch_details_data[tableMeta.rowIndex]) {
                                return this
                                    .state
                                    .batch_details_data[tableMeta.rowIndex]
                                    .WarehousesBin
                                    .bin_id
                            } else {
                                return "N/A"
                            }
                        }
                    }
                },
                {
                    name: 'batch',
                    label: 'Batch No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batch_details_data[tableMeta.rowIndex]) {
                                return this
                                    .state
                                    .batch_details_data[tableMeta.rowIndex]
                                    ?.ItemSnapBatch
                                    ?.batch_no
                            } else {
                                return "N/A"
                            }
                        }
                    }
                }, {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state.batch_details_data[tableMeta.rowIndex]?.Warehouse?.name
                        }
                    }
                }, {
                    name: 'exp',
                    label: 'Exp Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {

                            if (this.state.batch_details_data[dataIndex]) {
                                let data = this
                                    .state
                                    .batch_details_data[dataIndex]
                                    ?.ItemSnapBatch
                                    ?.exd;

                                let cellData = dateParse(data)
                                let today = dateParse(new Date())

                                let different = getDateDifference(cellData, today)
                                console.log("diff", different)

                                if (different[0] === '+') {
                                    if (different[1] > 0) {
                                        // more than 1 year
                                        return <div style={{ background: "green", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(data)}</p></div>
                                    } else {
                                        if (different[2] >= 6) {
                                            // month is 6 - 12
                                            return <div style={{ background: "gray", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(data)}</p></div>
                                        } else if (different[2] >= 3) {
                                            // month is 3 - 6
                                            return <div style={{ background: "blue", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(data)}</p></div>
                                        } else if (different[2] >= 1) {
                                            // month is 1 - 3
                                            return <div style={{ background: "orange", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p>{dateParse(data)}</p></div>
                                        } else if (different[3] >= 14) {
                                            // bethween 2 weeks - 1 month
                                            //return <div style={{ background: "red", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(cellData)}</p></div>
                                            return <div style={{ background: "#eb6434", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(data)}</p></div>

                                        } else {
                                            // less than 2 weeks
                                            //return <div style={{ background: "red", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(cellData)}</p></div>
                                            return <div style={{ background: "red", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(data)}</p></div>

                                        }

                                    }
                                } else {
                                    // expaire
                                    return <div style={{ background: "red", width: "200px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px" }}> <p style={{ color: 'white' }}>{dateParse(data)}</p></div>
                                }





                                // return <p>{dateParse(data)}</p> 
                            } else {
                                return "N/A"
                            }

                        }
                    }
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: 'minPack',
                    label: 'Min Pack Size',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.batch_details_data[tableMeta.rowIndex]) {
                                return <div>
                                    <Tooltip title={this.state.ConsignmentItemDetails?.filter((obj) => obj.item_id == this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.item_id)[0]?.conversation}>
                                        <div>
                                            {this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2' ? roundDecimal(this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 0)  :
                                            this.state.batch_details_data[tableMeta.rowIndex]
                                                ?.ItemSnapBatch
                                                ?.pack_size}
                                        </div>
                                    </Tooltip>
                                </div>

                            } else {
                                return "N/A"
                            }
                        }
                    }
                }, {
                    name: 'quantity',
                    label: 'Stock Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2'){
                                return convertTocommaSeparated(this.state.batch_details_data[tableMeta.rowIndex]?.quantity * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                            } else {
                               return convertTocommaSeparated(this.state.batch_details_data[tableMeta.rowIndex]?.quantity, 2)
                            }
                        }
                    }
                },
                {
                    name: 'quantity2',
                    label: 'Available Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                          
                            let reserved_quantity = parseFloat(this.state.itemBatch.filter((data) => data.item_batch_bin_id == this.state.batch_details_data[tableMeta.rowIndex].id)[0]?.reserved_quantity);
                            let quantity = (this.state.batch_details_data[tableMeta.rowIndex]?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))

                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2'){
                                if (quantity === '' || quantity === null || isNaN(quantity)) {
                                    let qty = parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity)
                                    return <p>{convertTocommaSeparated(qty < 0 ? 0 : (qty * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size), 2) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name}</p>
                                }
                                else {
                                    return (
                                        <p>{convertTocommaSeparated(quantity < 0 ? 0 : (quantity * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size), 2) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name}</p>
                                    )
                                }
                            } else {
                                if (quantity === '' || quantity === null || isNaN(quantity)) {
                                    let qty = parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity)
                                    return <p>{convertTocommaSeparated(qty < 0 ? 0 : qty, 2)}</p>
                                }
                                else {
                                    return (
                                        <p>{convertTocommaSeparated(quantity < 0 ? 0 : quantity, 2)}</p>
                                    )
                                }
                            }
                            





                        }
                    }
                },
                {
                    name: 'unit_price',
                    label: 'Unit Price',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return roundDecimal(Number(this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch.unit_price), 2)
                        }
                    }
                },
                {
                    name: 'allocatedQty',
                    label: 'Allocate Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            //let minValue = this.state.batch_details_data[tableMeta.rowIndex]?.quantity ? this.state.batch_details_data[tableMeta.rowIndex].quantity : 0;
                            let minPack_validator = parseInt(this.state.batchAllocationItemvalues[tableMeta.rowIndex]) % this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.pack_size === 0 ? true : false

                            /*   let reservable_quantity = parseFloat(this.state.stockData.filter((data) => data.real_warehouse_id == this.state.data[tableMeta.rowIndex]?.OrderExchange?.to && data.item_id == this.state.data[tableMeta.rowIndex]?.item_id)[0]?.quantity) - parseFloat(this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id)[0]?.reserved_quantity)
                              if (reservable_quantity === '' || reservable_quantity === null || isNaN(reservable_quantity)) {
                                  reservable_quantity = parseFloat(this.state.stockData.filter((data) => {
                                      if (data.real_warehouse_id == this.state.data[tableMeta.rowIndex]?.OrderExchange?.to && data.item_id == this.state.data[tableMeta.rowIndex]?.item_id) {
                                          return data
                                      }
                                  })[0]?.quantity)
                              } */
                            let minPlan_to_allocate = roundDecimal(this.state.data[this.state.selected_item].to_be_issue_quantity, 0)
                            //let reservable_quantity = parseFloat(this.state.stockData.filter((data) => data.item_id == this.state.data[this.state.selected_item]?.item_id)[0]?.quantity) - parseFloat(this.state.itemsnap.filter((data) => data.item_id == this.state.data[this.state.selected_item].item_id)[0]?.reserved_quantity)

                            let reserved_quantity = parseFloat(this.state.itemBatch.filter((data) => data.item_batch_bin_id == this.state.batch_details_data[tableMeta.rowIndex].id)[0]?.reserved_quantity);
                            let reservable_quantity = (this.state.batch_details_data[tableMeta.rowIndex]?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))

                            let minValue = Number(reservable_quantity) < 0 ? 0 : Number(reservable_quantity)

                            console.log('fgfgfgfgfgfgfgggg', minValue)

                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2' ) {
                                minValue = minValue * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                            }

                            /* if (reservable_quantity === '' || reservable_quantity === null || isNaN(reservable_quantity)) {
                                reservable_quantity = parseFloat(this.state.stockData.filter((data) => data.item_id == this.state.data[this.state.selected_item]?.item_id)[0]?.quantity)
                            } */
                            // console.log("reservable qty test", reservable_quantity)
                            // console.log("Reservable QTY: ", reservable_quantity)
                            return (
                                <>
                                {(this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2' && this.state.batchAllocationItemvalues[tableMeta.rowIndex] > 0) &&
                                    <p className='pt-1 pb-1 pl-5 pr-5' style={{ border: '1px solid #ffd600', backgroundColor: '#fff59d', borderRadius: '3px', textAlign: 'center' }}>{roundDecimal(this.state.batchAllocationItemvalues[tableMeta.rowIndex] / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.MeasuringUnit?.name}</p>
                                }
                                
                                <TextValidator
                                    className=" w-full"
                                    placeholder="Allocate Qty"
                                    name="stockMore"
                                    InputLabelProps={{
                                        shrink: false
                                    }}
                                    value={this.state.batchAllocationItemvalues[tableMeta.rowIndex]}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    min={0}
                                    InputProps={{
                                        endAdornment: (
                                            this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2' ? (
                                                <InputAdornment position="end" className='mr-1'>
                                                    {this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name}
                                                </InputAdornment>
                                            ) : null // Render nothing when the condition is not met
                                        )
                                    }}
                                    onClick={() => {
                                        let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
                                        let batchAllocationItemUpdated = this.state.batchAllocationItemUpdated;
                                        let batchAllocationPreValue = this.state.batchAllocationPreValue;
                                        //let quantity = parseFloat(this.state.stockData.filter((data) => data.real_warehouse_id == this.state.data[this.state.selected_item]?.OrderExchange?.to && data.item_id == this.state.data[this.state.selected_item]?.item_id)[0]?.quantity)
                                        let quantity = minValue

                                        if (!batchAllocationItemUpdated[tableMeta.rowIndex]) {
                                            if (quantity <= this.state.remainingAllocation) {
                                                if (quantity > this.state.batch_details_data[tableMeta.rowIndex].quantity) {

                                                    if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2') {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(this.state.batch_details_data[tableMeta.rowIndex].quantity / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                                                    } else {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(this.state.batch_details_data[tableMeta.rowIndex].quantity / this.state.batch_details_data[tableMeta.rowIndex]
                                                        ?.ItemSnapBatch
                                                        ?.pack_size) * this.state.batch_details_data[tableMeta.rowIndex]
                                                            ?.ItemSnapBatch
                                                            ?.pack_size;
                                                    }
                                                   
                                                } else {

                                                    if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2') {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(quantity / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                                                    } else {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(quantity / this.state.batch_details_data[tableMeta.rowIndex]
                                                        ?.ItemSnapBatch
                                                        ?.pack_size) * this.state.batch_details_data[tableMeta.rowIndex]
                                                            ?.ItemSnapBatch
                                                            ?.pack_size;
                                                    }
                                                    
                                                }
                                            } else {

                                 
                                                if (this.state.remainingAllocation > this.state.batch_details_data[tableMeta.rowIndex].quantity) {
                                                    if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2') {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(this.state.batch_details_data[tableMeta.rowIndex].quantity / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size;
                                                    } else {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(this.state.batch_details_data[tableMeta.rowIndex].quantity / this.state.batch_details_data[tableMeta.rowIndex]
                                                        ?.ItemSnapBatch
                                                        ?.pack_size) * this.state.batch_details_data[tableMeta.rowIndex]
                                                            ?.ItemSnapBatch
                                                            ?.pack_size;
                                                    }
                                                    
                                                } else {
                                                    if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2') {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(this.state.remainingAllocation / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                                                    } else {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(this.state.remainingAllocation / this.state.batch_details_data[tableMeta.rowIndex]
                                                        ?.ItemSnapBatch
                                                        ?.pack_size) * this.state.batch_details_data[tableMeta.rowIndex]
                                                            ?.ItemSnapBatch
                                                            ?.pack_size;
                                                    }
                                                    
                                                }
                                            }
                                            batchAllocationPreValue[tableMeta.rowIndex] = batchAllocationItemvalues[tableMeta.rowIndex]
                                        } else {
                                            let batchQuantity = this.state.remainingAllocation + batchAllocationPreValue[tableMeta.rowIndex];
                                            if (this.state.remainingAllocation > 0) {
                                                if (quantity <= batchQuantity) {
                                                 
                                                    if (quantity > this.state.batch_details_data[tableMeta.rowIndex].quantity) {
                                                        if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2') {
                                                            batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(quantity / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                                                        } else {
                                                            batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(quantity / this.state.batch_details_data[tableMeta.rowIndex]
                                                            ?.ItemSnapBatch
                                                            ?.pack_size) * this.state.batch_details_data[tableMeta.rowIndex]
                                                                ?.ItemSnapBatch
                                                                ?.pack_size;
                                                        }
                                                        
                                                    } else {
                                                        if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2') {
                                                            batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(quantity / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                                                        } else {
                                                            batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(quantity / this.state.batch_details_data[tableMeta.rowIndex]
                                                            ?.ItemSnapBatch
                                                            ?.pack_size) * this.state.batch_details_data[tableMeta.rowIndex]
                                                                ?.ItemSnapBatch
                                                                ?.pack_size;
                                                        }
                                                       
                                                    }
                                                } else {
                                                    if (batchQuantity > this.state.batch_details_data[tableMeta.rowIndex].quantity) {
                                                        if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2') {
                                                            batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(this.state.batch_details_data[tableMeta.rowIndex].quantity / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                                                        } else {
                                                            batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(this.state.batch_details_data[tableMeta.rowIndex].quantity / this.state.batch_details_data[tableMeta.rowIndex]
                                                            ?.ItemSnapBatch
                                                            ?.pack_size) * this.state.batch_details_data[tableMeta.rowIndex]
                                                                ?.ItemSnapBatch
                                                                ?.pack_size;
                                                        }
                                                       
                                                    } else {
                                                        if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2') {
                                                            batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(batchQuantity / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                                                        } else {
                                                            batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(batchQuantity / this.state.batch_details_data[tableMeta.rowIndex]
                                                            ?.ItemSnapBatch
                                                            ?.pack_size) * this.state.batch_details_data[tableMeta.rowIndex]
                                                                ?.ItemSnapBatch
                                                                ?.pack_size;
                                                        }
                                                        
                                                    }
                                                }
                                            }
                                        }

                                        this.setState({
                                            batchAllocationItemvalues
                                        })
                                    }}
                                    onChange={(e) => {
                                        let batchAllocationItemvalues = this.state.batchAllocationItemvalues;

                                        batchAllocationItemvalues[tableMeta.rowIndex] = Number(e.target.value)

                                        this.setState({
                                            batchAllocationItemvalues
                                        })
                                    }
                                    }
                                    onBlur={(e) => {
                                        console.log("Remaining: ", this.state.remainingAllocation)
                                      
                                        if (!isNaN(parseInt(e.target.value))) {
                                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2'){
                                                if (parseInt(e.target.value) <= minValue && parseInt(e.target.value) % this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size === 0) {

                                                    if (this.state.allocate.item_batch_allocation_data.length != 0) {
    
                                                        let index = this.state.allocate.item_batch_allocation_data.findIndex(item => item.item_batch_bin_id === this.state.batch_details_data[tableMeta.rowIndex].id);
    
                                                        if (index != -1) {
                                                            console.log(index);
                                                            this.state.allocate.item_batch_allocation_data[index].bin_id = this.state.batch_details_data[tableMeta.rowIndex].bin_id
                                                            this.state.allocate.item_batch_allocation_data[index].item_batch_bin_id = this.state.batch_details_data[tableMeta.rowIndex].id
                                                            this.state.allocate.item_batch_allocation_data[index].warehouse_id = this.state.batch_details_data[tableMeta.rowIndex].warehouse_id
                                                            this.state.allocate.item_batch_allocation_data[index].quantity = this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                                            this.state.allocate.item_batch_allocation_data[index].volume = Number(this.state.batch_details_data[tableMeta.rowIndex].volume) / Number(this.state.batch_details_data[tableMeta.rowIndex].quantity) * this.state.batchAllocationItemvalues[tableMeta.rowIndex]
    
    
                                                        } else {
                                                            console.log("not finding");
                                                            this.state.allocate.item_batch_allocation_data.push({
                                                                bin_id: this.state.batch_details_data[tableMeta.rowIndex].bin_id,
                                                                item_batch_bin_id: this.state.batch_details_data[tableMeta.rowIndex].id,
                                                                warehouse_id: this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                                                                quantity: this.state.batchAllocationItemvalues[tableMeta.rowIndex],
                                                                volume: Number(this.state.batch_details_data[tableMeta.rowIndex].volume) / Number(this.state.batch_details_data[tableMeta.rowIndex].quantity) * this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                                            })
                                                        }
    
                                                    } else {
                                                        this.state.allocate.item_batch_allocation_data.push({
                                                            bin_id: this.state.batch_details_data[tableMeta.rowIndex].bin_id,
                                                            item_batch_bin_id: this.state.batch_details_data[tableMeta.rowIndex].id,
                                                            warehouse_id: this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                                                            quantity: this.state.batchAllocationItemvalues[tableMeta.rowIndex],
                                                            volume: Number(this.state.batch_details_data[tableMeta.rowIndex].volume) / Number(this.state.batch_details_data[tableMeta.rowIndex].quantity) * this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                                        })
                                                    }
                                                    console.log('quantity', this.state.batchAllocationItemvalues, 'tablemeta', tableMeta.rowIndex);
                                                    console.log('volumes', this.state.batchAllocationItemVolumes, 'tablemeta', tableMeta.rowIndex);
    
                                                    let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
                                                    let batchAllocationItemUpdated = this.state.batchAllocationItemUpdated;
                                                    let batchAllocationPreValue = this.state.batchAllocationPreValue;
    
                                                    let allocate_quantity = batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);
    
                                                    if (allocate_quantity <= this.state.data[this.state.selected_item].to_be_issue_quantity) {
                                                        this.state.allocate.quantity = allocate_quantity
                                                        if (batchAllocationItemvalues[tableMeta.rowIndex] >= 0 && !batchAllocationItemUpdated[tableMeta.rowIndex]) {
                                                            this.state.remainingAllocation -= batchAllocationItemvalues[tableMeta.rowIndex];
                                                            batchAllocationItemUpdated[tableMeta.rowIndex] = true;
                                                        } else {
                                                            if (batchAllocationPreValue[tableMeta.rowIndex] !== batchAllocationItemvalues[tableMeta.rowIndex]) {
                                                                this.state.remainingAllocation += batchAllocationPreValue[tableMeta.rowIndex];
                                                                this.state.remainingAllocation -= batchAllocationItemvalues[tableMeta.rowIndex];
                                                            }
                                                        }
                                                        batchAllocationPreValue[tableMeta.rowIndex] = batchAllocationItemvalues[tableMeta.rowIndex]
    
                                                        this.setState({
                                                            batchAllocationItemUpdated,
                                                            batchAllocationPreValue,
                                                            batchAllocationItemUpdated,
                                                        })
    
                                                    }
                                                    // else if(allocate_quantity <= ){
                                                    // }
                                                    else {
                                                        this.state.batchAllocationItemVolumes[tableMeta.rowIndex] = 0;
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = 0
                                                        this.setState({
                                                            batchAllocationItemvalues
                                                        })
                                                    }
                                                    this.state.allocate.volume = this.state.allocate.item_batch_allocation_data.reduce((partialSum, a) => partialSum + a.volume, 0);
    
                                                    this.setState({ totalUpdate: true })
                                                    console.log("allocation", this.state.allocate);
                                                } else if (parseInt(e.target.value) > minValue) {
                                                    this.setState({
                                                        alert: true,
                                                        severity: 'error',
                                                        message: `Cannot Exceed > ${minValue}`,
                                                    })
                                                    let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
                                                    let batchAllocationPreValue = this.state.batchAllocationPreValue;
    
                                                    batchAllocationItemvalues[tableMeta.rowIndex] = batchAllocationPreValue[tableMeta.rowIndex]
    
                                                    this.setState({
                                                        batchAllocationItemvalues,
                                                    })
                                                }
                                                else {
                                                    this.setState({
                                                        alert: true,
                                                        severity: 'error',
                                                        message: 'Mismatch Minimum Pack Size',
                                                    })
    
                                                    let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
                                                    let batchAllocationPreValue = this.state.batchAllocationPreValue;
    
                                                    batchAllocationItemvalues[tableMeta.rowIndex] = batchAllocationPreValue[tableMeta.rowIndex]
    
                                                    this.setState({
                                                        batchAllocationItemvalues,
                                                    })
                                                }
                                            } else {
                                                if (parseInt(e.target.value) <= minValue && parseInt(e.target.value) % this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.pack_size === 0) {

                                                    if (this.state.allocate.item_batch_allocation_data.length != 0) {
    
                                                        let index = this.state.allocate.item_batch_allocation_data.findIndex(item => item.item_batch_bin_id === this.state.batch_details_data[tableMeta.rowIndex].id);
    
                                                        if (index != -1) {
                                                            console.log(index);
                                                            this.state.allocate.item_batch_allocation_data[index].bin_id = this.state.batch_details_data[tableMeta.rowIndex].bin_id
                                                            this.state.allocate.item_batch_allocation_data[index].item_batch_bin_id = this.state.batch_details_data[tableMeta.rowIndex].id
                                                            this.state.allocate.item_batch_allocation_data[index].warehouse_id = this.state.batch_details_data[tableMeta.rowIndex].warehouse_id
                                                            this.state.allocate.item_batch_allocation_data[index].quantity = this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                                            this.state.allocate.item_batch_allocation_data[index].volume = Number(this.state.batch_details_data[tableMeta.rowIndex].volume) / Number(this.state.batch_details_data[tableMeta.rowIndex].quantity) * this.state.batchAllocationItemvalues[tableMeta.rowIndex]
    
    
                                                        } else {
                                                            console.log("not finding");
                                                            this.state.allocate.item_batch_allocation_data.push({
                                                                bin_id: this.state.batch_details_data[tableMeta.rowIndex].bin_id,
                                                                item_batch_bin_id: this.state.batch_details_data[tableMeta.rowIndex].id,
                                                                warehouse_id: this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                                                                quantity: this.state.batchAllocationItemvalues[tableMeta.rowIndex],
                                                                volume: Number(this.state.batch_details_data[tableMeta.rowIndex].volume) / Number(this.state.batch_details_data[tableMeta.rowIndex].quantity) * this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                                            })
                                                        }
    
                                                    } else {
                                                        this.state.allocate.item_batch_allocation_data.push({
                                                            bin_id: this.state.batch_details_data[tableMeta.rowIndex].bin_id,
                                                            item_batch_bin_id: this.state.batch_details_data[tableMeta.rowIndex].id,
                                                            warehouse_id: this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                                                            quantity: this.state.batchAllocationItemvalues[tableMeta.rowIndex],
                                                            volume: Number(this.state.batch_details_data[tableMeta.rowIndex].volume) / Number(this.state.batch_details_data[tableMeta.rowIndex].quantity) * this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                                        })
                                                    }
                                                    console.log('quantity', this.state.batchAllocationItemvalues, 'tablemeta', tableMeta.rowIndex);
                                                    console.log('volumes', this.state.batchAllocationItemVolumes, 'tablemeta', tableMeta.rowIndex);
    
                                                    let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
                                                    let batchAllocationItemUpdated = this.state.batchAllocationItemUpdated;
                                                    let batchAllocationPreValue = this.state.batchAllocationPreValue;
    
                                                    let allocate_quantity = batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);
    
                                                    if (allocate_quantity <= this.state.data[this.state.selected_item].to_be_issue_quantity) {
                                                        this.state.allocate.quantity = allocate_quantity
                                                        if (batchAllocationItemvalues[tableMeta.rowIndex] >= 0 && !batchAllocationItemUpdated[tableMeta.rowIndex]) {
                                                            this.state.remainingAllocation -= batchAllocationItemvalues[tableMeta.rowIndex];
                                                            batchAllocationItemUpdated[tableMeta.rowIndex] = true;
                                                        } else {
                                                            if (batchAllocationPreValue[tableMeta.rowIndex] !== batchAllocationItemvalues[tableMeta.rowIndex]) {
                                                                this.state.remainingAllocation += batchAllocationPreValue[tableMeta.rowIndex];
                                                                this.state.remainingAllocation -= batchAllocationItemvalues[tableMeta.rowIndex];
                                                            }
                                                        }
                                                        batchAllocationPreValue[tableMeta.rowIndex] = batchAllocationItemvalues[tableMeta.rowIndex]
    
                                                        this.setState({
                                                            batchAllocationItemUpdated,
                                                            batchAllocationPreValue,
                                                            batchAllocationItemUpdated,
                                                        })
    
                                                    }
                                                    // else if(allocate_quantity <= ){
                                                    // }
                                                    else {
                                                        this.state.batchAllocationItemVolumes[tableMeta.rowIndex] = 0;
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = 0
                                                        this.setState({
                                                            batchAllocationItemvalues
                                                        })
                                                    }
                                                    this.state.allocate.volume = this.state.allocate.item_batch_allocation_data.reduce((partialSum, a) => partialSum + a.volume, 0);
    
                                                    this.setState({ totalUpdate: true })
                                                    console.log("allocation", this.state.allocate);
                                                } else if (parseInt(e.target.value) > minValue) {
                                                    this.setState({
                                                        alert: true,
                                                        severity: 'error',
                                                        message: `Cannot Exceed > ${minValue}`,
                                                    })
                                                    let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
                                                    let batchAllocationPreValue = this.state.batchAllocationPreValue;
    
                                                    batchAllocationItemvalues[tableMeta.rowIndex] = batchAllocationPreValue[tableMeta.rowIndex]
    
                                                    this.setState({
                                                        batchAllocationItemvalues,
                                                    })
                                                }
                                                else {
                                                    this.setState({
                                                        alert: true,
                                                        severity: 'error',
                                                        message: 'Mismatch Minimum Pack Size',
                                                    })
    
                                                    let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
                                                    let batchAllocationPreValue = this.state.batchAllocationPreValue;
    
                                                    batchAllocationItemvalues[tableMeta.rowIndex] = batchAllocationPreValue[tableMeta.rowIndex]
    
                                                    this.setState({
                                                        batchAllocationItemvalues,
                                                    })
                                                }
                                            }
                                           
                                        }
                                    }}

                                    // validators={['maxNumber:' + reservable_quantity]}
                                    validators={['maxNumber:' + minValue]}
                                    errorMessages={
                                        [
                                            'Cannot allocate more than reservable quantity'
                                        ]}

                                />
                                </>

                            )
                        }
                    }
                },

                {
                    name: 'total',
                    label: 'Unit Total',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.batchAllocationItemvalues[tableMeta.rowIndex] ? convertTocommaSeparated(Number(this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch.unit_price) * this.state.batchAllocationItemvalues[tableMeta.rowIndex], 2) : 0

                        }
                    }
                },
            ],
            allocate_dialog_table: [
                // {     name: 'parend_drugstore_qty',     label: 'Parent Drug Store Qty',
                // optionss: {} },
                {
                    name: 'my_stock_days',
                    label: 'My Stock Days',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.batch_details_data[tableMeta.rowIndex]?.quantity, 0)
                        }
                    }
                },
                // {
                //     name: 'stored_quantity',
                //     label: 'MSD Qty',
                //     options: {
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return <p>10</p>
                //     }
                // }
                // },
                {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.batch_details_data[tableMeta.rowIndex]?.Warehouse?.name
                        }
                    }
                },
                // {
                //     name: 'uom',
                //     label: 'UOM',
                //     options: {}
                // }, 
                // {
                //     name: 'consumption',
                //     label: 'Consumption',
                //     options: {}
                // }, 
                {
                    name: 'my_stock_res_qty',
                    label: 'MSD Total Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            // console.log('cheking data', this.state.batch_details_data[tableMeta.rowIndex])
                            let quantity = Number(this.calculateParentWarehouseQty(this.state.data[this.state.selected_item]))

                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2'){
                                return convertTocommaSeparated(isNaN(quantity) ? 0 : quantity * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size , 2) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return convertTocommaSeparated(isNaN(quantity) ? 0 : quantity, 2)
                            }
                            

                        }

                    }
                },
                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2'){
                                return convertTocommaSeparated(this.state.data[this.state.selected_item].request_quantity * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 0) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return convertTocommaSeparated(this.state.data[this.state.selected_item].request_quantity, 0);
                            }
                            
                        }
                    }
                },
                {
                    name: 'to_be_issue_quantity',
                    label: 'Plan to Allocate Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2'){
                                return convertTocommaSeparated(this.state.data[this.state.selected_item].to_be_issue_quantity, 0) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name;
                            } else {
                                return convertTocommaSeparated(this.state.data[this.state.selected_item].to_be_issue_quantity, 0);
                            }
                            
                        }
                    }
                },
                {
                    name: 'Estimation Qty',
                    label: 'Estimation Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return convertTocommaSeparated(this.state.selected_item_estimation, 2);
                        }
                    }
                },
                {
                    name: 'Estimation Qty',
                    label: 'Remaining Estimation',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => (
                            convertTocommaSeparated(this.state.selected_item_remaining_estimation, 2)
                        )

                    }
                }

                , {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EUV2'){
                                return this.state.totalUpdate ? convertTocommaSeparated(((parseInt(this.state.data[this.state.selected_item].allocated_quantity) + parseInt(this.state.allocate.quantity)) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size), 2) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name : null
                            } else {
                                return this.state.totalUpdate ? convertTocommaSeparated((parseInt(this.state.data[this.state.selected_item].allocated_quantity) + parseInt(this.state.allocate.quantity)), 2) : null
                            }
                            
                        }
                    }
                }
            ],
            remarks: [],
            all_status: [
                {
                    id: 1,
                    name: 'ALLOCATED'
                }, {
                    id: 2,
                    name: 'APPROVED'
                }, {
                    id: 3,
                    name: 'COMPLETED'
                }, {
                    id: 4,
                    name: 'ISSUED'
                }, {
                    id: 5,
                    name: 'ORDERED'
                }, {
                    id: 6,
                    name: 'RECIEVED'
                }, {
                    id: 7,
                    name: 'REJECTED'
                }
            ],
            loaded: false,
            filterData: {
                ven_id: null,
                group_id: null,
                category_id: null,
                class_id: null,
                order_exchange_id: null,
                search: null,
                limit: 20,
                page: 0

            },
            allocate: {
                order_item_id: null,
                activity: "ITEM RECEIVED",
                date: null,
                status: "ITEM RECEIVED",
                remark_id: null,
                remark_by: null,
                type: "ITEM RECEIVED",
                volume: 0,
                quantity: 0,
                item_batch_allocation_data: [],
                warehouse_id: null,

            },
            alert: false,
            message: null,
            severity: "success",
            issue: {
                order_exchange_id: this.props.id.match.params.id,
                activity: "ISSUE SUBMITTED",
                date: null,
                status: "ISSUE SUBMITTED",
                remark_id: null,
                remark_by: null,
                type: "ISSUE SUBMITTED",
                quantity: 0,
                time_from: null,
                time_to: null,
                warehouse_id: null
            },
            reject_Order: {
                order_exchange_id: this.props.id.match.params.id,
                activity: "REJECTED",
                date: null,
                status: "REJECTED",
                remark_id: null,
                remark_by: null,
                type: "REJECTED",
                quantity: 0,
                time_from: null,
                time_to: null,
                warehouse_id: null
            },
            retbatchdata: [],
            totalItems: null,
            warehouseListfull: [],
            uniquitemslistfull: [],
            stockData: [],
            warehouseData: [],
            addItemDialog: false,
            all_drugs: [],

            itemAddDialog: {
                order_exchange_id: this.props.id.match.params.id,
                item_id: null,
                request_quantity: null,
                special_normal_type: "Added By MSD"
            },
            itemQuantity: null,
            selectedID: null,
            stockDays: [],
            instituteStockDays: [],

            editItemLoaded: false,
            estimationData: [],
            selected_estimation_id: null,

            selectedItemAnualEstimation: null,
            selectedItemMonthlyEstimation: null,
            selectedIteRemainingEstimation: null,

            selected_item_estimation: "Not Estimated",
            selected_item_remaining_estimation: "Not Estimated",
            remaining_result: 0,
            vehicle_filterData: {
                page: 0,
                limit: 10,
                order_delivery_id: null,
                order_exchange_id: this.props.id.match.params.id,
                "order[0][0]": 'updatedAt',
                "order[0][1]": 'Desc'
            },

        }
    }
    async LoadVehicleData() {
        this.setState({
            vehicleLoaded: false
        })
        let res = await MDSService.getAllOrderVehicles(this.state.vehicle_filterData)
        if (res.status && res.status == 200) {
            this.setState({
                vehicle_data: res.data.view.data,
                vehicleLoaded: true
            }, () => console.log('resdata', this.state.vehicle_data))
        }
    }

    async orderItemAllocation(items) {
        // let data = {
        //     warehouse_id: warehouse_id,
        //     items:items,
        //     group_by_warehouses:true

        // }
        let itemFilter = {
            item_id: items,
            warehouse_id: this.state.allocate.warehouse_id,
            group_by_warehouse_only: true,
            status: 'Active',
            from_date: moment(new Date()).subtract(3, "days").format('YYYY-MM-DD'),
            to_date: moment(new Date()).add(1, "days").format('YYYY-MM-DD'),
            allocation_sum: true
        }

        console.log("paramsss", itemFilter)
        this.setState({ loaded: false })
        let posted = await InventoryService.getOrderItemAllocation(itemFilter)
        if (posted.status == 200) {
            console.log('Orders2', posted)
            this.setState(
                {
                    itemsnap: posted?.data.view.data,
                    loaded: true,
                    editItemLoaded: true
                }
            )
        }
        this.setState({
            loaded: true,
            editItemLoaded: true
        })
        console.log('itemsnap', this.state.itemsnap)
        this.render()

    }
    async orderBatchAllocation(items) {
        // let data = {
        //     warehouse_id: warehouse_id,
        //     items:items,
        //     group_by_warehouses:true

        // }
        let itemFilter = {
            item_id: items,
            // warehouse_id: this.state.allocate.warehouse_id,
            owner_id: '000',
            status: 'Active',
            from_date: null,
            to_date: null,
            allocation_sum: true
        }

        console.log("itemBtach", itemFilter)
        this.setState({ loaded: false })
        let posted = await InventoryService.getOrderItemAllocation(itemFilter)
        if (posted.status == 200) {
            console.log('Orders', posted.data)
            this.setState(
                {
                    itemBatch: posted?.data.view.data,
                    loaded: true,
                }
            )
        }
        this.setState({
            loaded: true
        })
        console.log('itemsnap', this.state.itemsnap)
        this.render()

    }

    async loadBatchData(order_item_id, item_id) {
        console.log('cheking item id', this.state.selected_item)
        this.setState({ editItemLoaded: false, editItemDialogView: true, selected_order_item_id: order_item_id })
        let filters = { order_item_id: order_item_id }
        let res = await PharmacyOrderService.getOrderBatchItems(filters)
        console.log("Order Item Batch Data", res.data.view.data)
        if (res.status) {
            console.log("Order Item Batch Data", res.data.view.data)
            for (let index = 0; index < res.data.view.data.length; index++) {
                res.data.view.data[index].allocated_qty_temp = res.data.view.data[index].allocated_quantity

            }

            let temp = res.data.view.data.map((itemObject) => {
                if (itemObject?.OrderItem?.ItemSnap?.converted_order_uom === "EUV2") {
                    return {
                        ...itemObject,
                        allocated_quantity: itemObject.allocated_quantity * itemObject?.OrderItem?.ItemSnap?.item_unit_size,
                      };
                } else {
                    return {
                        ...itemObject,
                        allocated_quantity: itemObject.allocated_quantity,
                      };
                }
                
              });

            //   console.log("Order TEMP", temp)
            this.setState({ edit_item: temp, editItemLoaded: true })
        }
        this.orderItemAllocation(item_id)
    }

    async loadItems(search) {
        // let params = { "search": search }
        let owner_id = await localStorageService.getItem('owner_id')
        let data = {
            // warehouse_id: this.state.allocate.warehouse_id,
            owner_id: owner_id,
            item_needed: true,
            sr_no: search

        }
        console.log("params2", data)
        this.setState({ loaded: false })
        let posted = await InventoryService.getInventoryFromSR(data)
        if (posted.status == 201) {
            console.log('Orders', posted.data)
            this.setState(
                {
                    all_drugs: posted?.data?.posted?.data,
                    loaded: true,
                }
            )
        }
        this.setState({
            loaded: true
        })
        this.render()
    }


    async submitIssueQty(rowIndex, id) {

        console.log('cheking row imdex', rowIndex, id, this.state.data[rowIndex])
        let formdata
        if (this.state.data[rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2') {
            formdata = {
                to_be_issue_quantity: this.state.data[rowIndex].to_be_issue_quantity / this.state.data[rowIndex]?.ItemSnap?.item_unit_size
            }
        } else {
            formdata = {
                to_be_issue_quantity: this.state.data[rowIndex].to_be_issue_quantity
            }
        }

        if (this.state.data[rowIndex].to_be_issue_quantity) {
            let res = await WarehouseServices.orderItemEdit(formdata, id);
            if (res.status == 200) {
                this.setState({
                    alert: true,
                    severity: 'success',
                    submitting_form: false,
                    message: 'Added Plan to Allocate Quantitiy Successfull',
                }, () => {
                    //window.history.back()
                    this.LoadOrderItemDetails()
                })
            } else {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: 'Unsuccessfull',
                    submitting_form: false
                })
            }
        }
    }

    async editItemBatch(item) {

        // console.log('chekigng item info', item)
        let inc_data 
        if (item?.OrderItem?.ItemSnap?.converted_order_uom === "EUV2") {
            inc_data = {
                allocated_quantity: item?.allocated_quantity / item?.OrderItem?.ItemSnap?.item_unit_size,
                allocated_volume: Number(item.ItemSnapBatchBin?.volume) / (Number(item.ItemSnapBatchBin?.quantity) == 0 ? 1 : Number(item.ItemSnapBatchBin?.quantity)) * Number(item.allocated_quantity)
            }
        } else {
            inc_data = {
                allocated_quantity: item.allocated_quantity,
                allocated_volume: Number(item.ItemSnapBatchBin?.volume) / (Number(item.ItemSnapBatchBin?.quantity) == 0 ? 1 : Number(item.ItemSnapBatchBin?.quantity)) * Number(item.allocated_quantity)
            }
        }
        

        let res = await PharmacyOrderService.editOrderBatchItems(item.id, inc_data)
        if (res.status == 200) {
            this.setState({
                // Loaded: true,
                alert: true,
                message: 'Item Edit Succesfully',
                severity: 'success',
                editItemDialogView: false

            }, () => {
                this.loadData()
                this.LoadOrderItemDetails()
            })
        } else {
            this.setState({
                // Loaded: true,
                alert: true,
                message: 'Item Edit Unsuccesful',
                severity: 'error',

            })
        }
    }

    /*  async loadItemEstimation(data) {
         let item_ids = data.map(x => x.item_id)
         console.log("loaded data", data)
 
 
         let params = {
             //warehouse_id: data[0].OrderExchange.from,
             owner_id: data[0].OrderExchange.fromStore.owner_id,
             item_id: item_ids,
             estimation_status: 'Active',
             available_estimation: 'Active',
             status: 'Active',
             hospital_estimation_status: 'Active',
             'order[0]': ['createdAt', 'DESC'],
             limit: 1000
 
             //from_date:dateParse(new Date(new Date().getFullYear(), 0,1)),
             //to_date:dateParse(new Date(new Date().getFullYear(), 11,31)),
 
         }
 
         let res = await EstimationService.getAllEstimationITEMS(params)
         if (res.status == 200) {
             console.log("loaded data estimation", res.data)
             this.setState({
                 estimationData: res.data?.view?.data
             })
         }
 
         this.setState({
             loaded: true
         })
     } */


    async loadItemEstimation(data) {
        let item_ids = data.map(x => x.item_id)
        console.log("loaded data", data)


        let params = {
            //warehouse_id: data[0].OrderExchange.from,
            owner_id: data[0]?.OrderExchange?.fromStore?.owner_id,
            item_id: item_ids,
            estimation_status: 'Active',
            available_estimation: 'Active',
            status: 'Active',
            hospital_estimation_status: 'Active',
            // 'order[0]': ['createdAt', 'DESC'],
            from: dateParse(moment().startOf('year')),
            to: dateParse(moment().endOf('year')),
            'order[0]': ['estimation', 'DESC'],

            //from_date:dateParse(new Date(new Date().getFullYear(), 0,1)),
            //to_date:dateParse(new Date(new Date().getFullYear(), 11,31)),

        }

        let params_for_national_estimation = {
            item_id: item_ids,
            no_rmsd: true,
            search_type: 'EstimationGroup',
            estimation_from: dateParse(moment().startOf('year')),
            estimation_to: dateParse(moment().endOf('year')),

        }



        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            console.log("loaded data estimation", res.data)
            this.setState({
                estimationData: res.data?.view?.data
            })
        }

        let res_national = await EstimationService.getAllEstimationITEMS(params_for_national_estimation)
        if (res_national.status == 200) {
            console.log("loaded data national estimation", res_national.data)
            this.setState({
                national_estimationData: res_national.data?.view,
                loaded: true
            })
        }


        /*  this.setState({
             loaded: true
         }) */
    }


    componentDidMount() {
        console.log("adsfsafas")
        this.state.filterData.order_exchange_id = this
            .props
            .id
            .match
            .params
            .id
        this.loadData()
        this.LoadOrderItemDetails()
        this.LoadVehicleData()
        this.LoadOrderDetails()
        this.getUserInfo()

    }
    async preLoadData() {
        this.setState({
            loaded: false
        })
        let vehicle_filterData = this.state.vehicle_filterData
        vehicle_filterData.order_delivery_id = this.state.order.Delivery?.id
        console.log("order2", vehicle_filterData)
        let res = await MDSService.getAllOrderVehicles(vehicle_filterData)
        if (res.status && res.status == 200) {
            this.setState({
                vehicle_filterData,
                //order: res.data.view.data,
                vehicle_totalItems: res.data.view.totalItems,
                loaded: true
            }, () => console.log('resdata', this.state.order))
        }
    }

    async LoadOrderDetails() {

        let res = await PharmacyOrderService.getOrdersByID(this.props.id.match.params.id)
        if (res.status) {
            console.log("Order Data 123", res.data.view)
            this.setState({
                order: res.data.view,
            }, () => {
                this.render()
                this.preLoadData()
                // console.log("State ", this.state.order)
            })
        }

    }


    async loadData() {
        let rem_res = await RemarkServices.getRemarks(
            { "type": "Order Remark", "remark": "Order Remark" }
        )
        if (rem_res.status == 200) {
            console.log('Ven', rem_res.data.view.data)
            this.setState({ remarks: rem_res.data.view.data })
        }

        //Add other to Remarks
        this
            .state
            .remarks
            .push({
                createdAt: "2022-07-07T12:23:03.091Z",
                createdBy: null,
                id: "4dbd7efd-fe69-400d-988b-d87307267c76",
                remark: "Other",
                status: "Deactive",
                type: "Order Remark",
                updatedAt: "2022-07-07T12:25:38.341Z"
            })
    }

    async LoadOrderItemDetails() {
        this.setState({ loaded: false })
        console.log("State 1:", this.state.data)
        let warehouseList = []
        let itemList = []
        let uniquitemslist = []

        let res = await PharmacyOrderService.getOrderItems(this.state.filterData)
        if (res.status == 200) {
            console.log("Order Item Data", res.data.view)
            if (res.data.view.data[0]) {
                this.state.allocate.warehouse_id = res.data.view.data[0].OrderExchange.to
                this.state.issue.warehouse_id = res.data.view.data[0].OrderExchange.to

                warehouseList = [res.data.view.data[0].OrderExchange.to, res.data.view.data[0].OrderExchange.from]
                itemList = res.data.view.data.map(data => data.item_id);
                uniquitemslist = [...new Set(itemList)];
            } else {
                this.loadItemEstimation(res.data.view.data)
                this.setState({
                    data: res.data.view.data,
                    totalItems: res.data.view.totalItems
                    //loaded: true
                })
                console.log("table total items", this.state.totalItems)

            } 
            // let temp = res.data.view.data.map((e)=>e.to_be_issue_quantity = e?.to_be_issue_quantity * e?.ItemSnap?.item_unit_size)
            let temp = res.data.view.data.map((itemObject) => {
                if (itemObject?.ItemSnap?.converted_order_uom === "EUV2") {
                    return {
                        ...itemObject,
                        to_be_issue_quantity: itemObject.to_be_issue_quantity * itemObject.ItemSnap?.item_unit_size,
                      };
                } else {
                    return {
                        ...itemObject,
                        to_be_issue_quantity: itemObject.to_be_issue_quantity,
                      };
                }
                
              });
            this.loadItemEstimation(temp)
            this.setState({
                data: temp,
                warehouseListfull: warehouseList,
                uniquitemslistfull: uniquitemslist,
                totalItems: res.data.view.totalItems
                //loaded: true
            },
                // () => {
                //     this.itemLoad(this.state.warehouseListfull,this.state.uniquitemslistfull),

                // },
                () => {
                    // this.multipleFun(this.state.warehouseListfull,this.state.uniquitemslistfull)
                    this.getStockDays(this.state.uniquitemslistfull);
                    this.itemLoad(this.state.warehouseListfull, this.state.uniquitemslistfull);
                },
                {
                }
            )

        }
        console.log("Order Items Data", this.props.id.match.params.id)
    }
    // multipleFun(items,warehouseid){
    //             this.getStockDays(items),
    //             this.itemLoad(items,warehouseid)

    // }
    async itemLoad(warehouse_ids, items) {
        console.log("params1", warehouse_ids)
        let data = {
            //warehouse_id: warehouse_ids[0],
            owner_id: '000',
            items: items,
            // group_by_warehouses: true
        }
        let data2 = {
            warehouse_id: warehouse_ids[1],
            items: items,
            group_by_warehouses: true
        }
        // let warehouse_id = x;
        this.setState({ loaded: false })
        let posted = await InventoryService.getInventoryFromSR(data)
        let posted2 = await InventoryService.getInventoryFromSR(data2)
        console.log("posted", posted, "posted2", posted2)
        if (posted.status == 201 && posted2.status == 201) {
            // console.log('Orders01', posted.data)
            this.setState(
                {
                    stockData: posted?.data?.posted?.data,
                    warehouseData: posted2?.data?.posted?.data,
                    loaded: true,
                }
            )
        }
        // if (posted[1].status == 201) {
        //     console.log('Orders', posted.data)
        //     this.setState(
        //         {
        //             warehouseData: posted?.data?.posted?.data,
        //             loaded: true, 
        //         }
        //     )
        // }
        // console.log("postarr",posted)

        this.setState({
            loaded: true
        }
            , () => {
                this.orderItemAllocation(this.state.uniquitemslistfull)
            }
        )
        this.render()

    }

    updateFilters(ven, category, class_id, group, search) {
        let filterData = this.state.filterData
        filterData.ven_id = ven
        filterData.category_id = category
        filterData.class_id = class_id
        filterData.group_id = group
        filterData.search = search

        this.setState({ filterData })
        console.log("Order Filter Data", this.state.filterData)
        this.LoadOrderItemDetails()
    }

    allocate(item_id, activity, user, date, itemData) {

        console.log("Order selected_item_det Data", itemData)
        
        this.setState({ submitting: true })
        let allocate = this.state.allocate
        allocate.order_item_id = item_id
        allocate.activity = activity
        allocate.status = activity
        allocate.type = activity
        allocate.date = date
        allocate.estimation_id = this.state.selected_estimation_id

        if (itemData?.ItemSnap?.converted_order_uom === 'EUV2') {
            allocate.item_batch_allocation_data = allocate.item_batch_allocation_data
                .filter(item => item.quantity !== 0)
                .map(item => {
                    item.quantity /= itemData?.ItemSnap?.item_unit_size; 
                    return item;
                });
            allocate.quantity = allocate.quantity / itemData?.ItemSnap?.item_unit_size
        } else {
            allocate.item_batch_allocation_data = allocate.item_batch_allocation_data.filter(item => (item.quantity != 0))
            allocate.quantity = allocate.quantity
        }
        // allocate.item_batch_allocation_data = allocate.item_batch_allocation_data.filter(item => (item.quantity != 0))
        this.state.issue.remark_by = user

        console.log("Order selected_item_det new data", this.state.allocate)
        this.setState({ allocate })
        console.log('New Allocate Req', this.state.allocate);
        this.allocateItem()

    }

    async allocateItem() {
        console.log('cheking data', this.state.allocate)
        let allocate = await DistributionCenterServices.allocate(this.state.allocate)
        if (allocate.status == 201) {
            console.log('Allocation response', allocate.data)
            if (allocate.data.posted == "data has been added successfully.") {
                this.setState(
                    { severity: "success", message: "Item quantity status added", batchAllocationItemvalues: [], alert: true, allocate_item: false, submitting: false }, () => {
                        // this.resetButton();
                        this.LoadOrderItemDetails()
                        // this.LoadOrderItemDetails()
                    }
                )

            } else {
                this.setState(
                    { severity: "error", message: "something wrong", batchAllocationItemvalues: [], alert: true, submitting: false }, () => {
                        //this.resetButton();
                        this.LoadOrderItemDetails()
                    }
                )
            }


        } else {
            this.setState(
                { severity: "error", message: "something wrong", alert: true, submitting: false }
            )
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New filterData", this.state.filterData)
            this.LoadOrderItemDetails()
        })
    }

    async getRetBatchData() {
        console.log('warehouse_id', this.state.data[0].OrderExchange.from);
        let batch_res = await DistributionCenterServices.getRetBatchData({
            return_request_id: this.state.data[0].OrderExchange.return_request_id
        })
        if (batch_res.status == 200) {
            console.log('Return req', batch_res.data.view.data)
            let batchlist = batch_res.data.view.data.map(data => data.item_batch_id);

            this.setState({ retbatchdata: batchlist })
            this.getBatchData(batchlist)
        }
    }

    async getBatchData(param) {
        console.log("getBatch", this.state.allocate.warehouse_id);
        let params = {
            //warehouse_id: this.state.allocate.warehouse_id,
            owner_id: '000',
            item_id: this.state.data[this.state.selected_item]?.item_id,
            exp_date_grater_than_zero: true,
            quantity_grater_than_zero: true,
            limit: 100,
            page: 0,
            'order[0]': [
                'createdAt', 'DESC'
            ],
        }
        if (param) {
            params = {
                //warehouse_id: this.state.allocate.warehouse_id,
                owner_id: '000',
                item_batch_id: param,
                exp_date_grater_than_zero: true,
                quantity_grater_than_zero: true,
                limit: 50,
                page: 0,
                'order[0]': [
                    'createdAt', 'DESC'
                ],
                'order[1]': [
                    'exp_date', 'DESC'
                ],
            }
        }
        let batch_res = await DistributionCenterServices.getBatchData(params)
        if (batch_res.status == 200) {
            console.log('Batch Data', batch_res.data.view.data)
            this.setState({ batch_details_data: batch_res.data.view.data })
            this.getPackSizes(batch_res.data.view.data)
        }

    }

    async getItemData(params, index) {
        let itemData = await DistributionCenterServices.getItemData(params)
        if (itemData.status == 200) {
            console.log('Item Data', itemData.data.view)
            let data = this.state.data
            data[index].my_stock_days = itemData.data.view.data[0]?.total_remaining_days
            data[index].stored_quantity = itemData.data.view.data[0]?.mystock_quantity
            this.loadItemEstimation(data)
            this.setState({ data })

        }
        if ((this.state.data.length - 1) == index) {
            this.render()
        }
    }
    async getStockDays(items) {
        let params = {
            warehouse_id: this.state.allocate.warehouse_id,
            item_id: items
        }
        let itemData = await DistributionCenterServices.getItemData(params)
        if (itemData.status == 200) {
            console.log('Stock Days', itemData.data.view)
            // let stockDays = itemData.data.view
            this.setState({
                stockDays: itemData.data.view.data
            })
        }

        params.warehouse_id = this.state.data[0]?.OrderExchange?.from
        let itemData2 = await DistributionCenterServices.getItemData(params)
        if (itemData.status == 200) {
            console.log('Stock Days institiute', itemData2.data.view)
            // let stockDays = itemData.data.view
            this.setState({
                instituteStockDays: itemData2.data.view.data
            })
        }



        this.render()

    }


    async checkAllocation() {

        let data = this.state.data;
        let count = data.filter(x =>
            (x.status).toUpperCase() == 'ACTIVE'
            || (x.status).toUpperCase() == 'PENDING'
            || (x.status).toUpperCase() == 'ORDERD'
        ).length
        if (count > 0) {
            this.setState({
                pendingAllocateError: true,
                pendingAllocateErrorMessage: `You have Not Allocate ${count} items.`
            })

        } else {
            this.issueOrder()
        }


    }

    async rejectOrder() {
        this.setState({ issuing: true })
        let issue = await DistributionCenterServices.issueOrder(this.state.reject_Order)
        if (issue.status == 201) {

            this.setState({
                message: "Order Reject Successfully Completed",
                severity: "Success",
                alert: true,
                issuing: false
            }, () => {
                window.history.back()
            })

        } else {
            this.setState({
                alert: true,
                message: issue.error ? issue.error : 'Order Reject Unsuccessful',
                severity: 'error',
            })
        }
    }

    async issueOrder() {
        /*   if (this.state.issue.time_from == null ||this.state.issue.time_to == null || this.state.issue.date == null){
              this.setState({
                  message:"Please set From and To time",
                  severity:"Error",
                  alert:true
              })
          }else{ */

        this.setState({ issuing: true })
        let issue = await DistributionCenterServices.issueOrder(this.state.issue)
        if (issue.status == 201) {
            if (issue.data.posted == "data has been added successfully.") {
                console.log('Order Issued', issue.data)
                this.setState({
                    message: "Order Issue Successfully Completed",
                    severity: "Success",
                    alert: true,
                    issuing: false
                }, () => {
                    window.history.back()
                    //window.location=document.referrer;
                    // window.location.reload(window.history.back());
                    //window.location.assign(window.history.back());
                    //window.location.reload();
                })
            }
        } else {
            this.setState({
                alert: true,
                message: issue.error ? issue.error : 'Order Issue Unsuccessful',
                severity: 'error',
            })
        }
        /*  }
          */
    }

    resetButton() {
        this.setState({ totalUpdate: false })
        this.state.allocate.item_batch_allocation_data.forEach((element, index) => {
            this.state.allocate.item_batch_allocation_data.splice(index, 1)
            document.getElementById('Hello' + index).value = 0
            this.state.allocate.quantity -= this.state.batchAllocationItemvalues[index]
            this.state.allocate.volume -= this.state.batchAllocationItemVolumes[index]
            this.state.batchAllocationItemvalues[index] = 0
            this.state.batchAllocationItemVolumes[index] = 0
        });

        this.state.allocate.quantity = this.state.batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);
        this.state.allocate.volume = this.state.batchAllocationItemVolumes.reduce((partialSum, a) => partialSum + a, 0);

        this.setState({ totalUpdate: true })

        console.log("RESET BUTTON", this.state.allocate);

    }
    async addSingleItem() {
        let data = this.state.itemAddDialog
        console.log('item data', data)
        let res = await PharmacyOrderService.orderItem(data)
        console.log("res.data.reorder", res.data);
        if (res.status) {
            if (res.data.posted == "data has been added successfully.") {
                this.setState({
                    // Loaded: true,
                    alert: true,
                    message: 'Item Added Succesfully Succesfully',
                    severity: 'success',
                    itemAddDialog: {
                        order_exchange_id: this.props.id.match.params.id,
                        item_id: null,
                        request_quantity: null,
                        special_normal_type: "Added By MSD"
                    }
                })
            }
            this.LoadOrderItemDetails(this.state.filterData)
        }
    }


    letPackSize(row) {
        console.log("this.state.stockData.", this.state.stockData)
        let quantity = this.state.stockData.filter((data) => data.item_id == row.item_id)

        return (
            // <h1>2</h1>
            (quantity[0]?.pack_size == undefined || quantity[0]?.pack_size == null) ? 0 : Math.floor(quantity[0]?.pack_size)
        )
    }

    calculateMyStockDays(row) {
        let data = this.state.stockDays.filter(x => x.item_id == row.item_id)[0]

        let quantity = this.state.warehouseData.filter((data) => data.real_warehouse_id == row.OrderExchange.from && data.item_id == row.item_id)

        if (isNaN(data?.total_remaining_days) || data?.total_remaining_days == null) {
            return Number(quantity[0]?.quantity) / Number(data?.consumption)
        } else {
            return data?.total_remaining_days
        }
    }

    calculateParentWarehouseQty(row) {
        let quantity = this.state.stockData.filter((data) => data.item_id == row.item_id)
        console.log("msd quantity", quantity[0]?.quantity)
        return (
            (quantity[0]?.quantity == undefined || quantity[0]?.quantity == null) ? 0 : Math.floor(quantity[0]?.quantity)

        )

    }


    myReservedQty(row) {

        let quantity = parseFloat(this.state.itemsnap.filter((data) => data.item_id == row.item_id)[0]?.reserved_quantity)
        // TODO (empty) - this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.reserved_quantity
        console.log("quantity2", quantity)
        if (quantity === '' || quantity === null || isNaN(quantity)) {
            // return Math.floor(parseFloat(this.state.stockData.filter((data) => data.real_warehouse_id == row.OrderExchange.to && data.item_id == row.item_id)[0]?.quantity))}
            return 0
        }
        else {
            return Math.floor(quantity)
            //    quantity[0]?.quantity

        }
    }




    /*   calculateMyStockMonth(row) {//commented by roshan
          let data = this.state.stockDays.filter(x => x.item_id == row.item_id)[0]
  
          let quantity = this.state.warehouseData.filter((data) => data.real_warehouse_id == row.OrderExchange.from && data.item_id == row.item_id)
  
          if (isNaN(data?.total_remaining_days) || data?.total_remaining_days == null) {
              return Number(quantity[0]?.quantity) / Number(data?.consumption) / 30
          } else {
              return Number(data?.total_remaining_days) / 30
          }
      } */

    calculateMyStockMonth(row) {//need to change
        let data = this.state.stockDays.filter(x => x.item_id == row.item_id)[0]

        //let quantity = this.state.warehouseData.filter((data) => data.real_warehouse_id == row.OrderExchange.from && data.item_id == row.item_id)

        let quantity = this.state.stockData.filter((data) => data.item_id == row.item_id)

        let msd_stock = (quantity[0]?.quantity == undefined || quantity[0]?.quantity == null) ? 0 : Math.floor(quantity[0]?.quantity)

        let national_estimation = this.state.national_estimationData?.filter(x => x.item_id == row.item_id)[0]?.estimation

        console.log("national_estimation data", this.state.national_estimationData)
        console.log("national_estimation", national_estimation)
        console.log("msd_stock", msd_stock)

        if (!isNaN(Number(national_estimation))) {
            return (12 * Number(msd_stock)) / Number(national_estimation)
        } else {
            return "-"
        }
    }



    msdConsumption(row) {
        let data = this.state.stockDays.filter(x => x.item_id == row.item_id)[0]
        return Number(data?.consumption)
    }

    ParentReservedQty(row) {
        let reserved_qty = parseFloat(this.state.itemsnap.filter((data) => data.item_id == row.item_id)[0]?.reserved_quantity)
        let msd_qty = parseFloat(this.state.stockData.filter((data) => data.item_id == row.item_id)[0]?.quantity)
        let quantity = (isNaN(msd_qty) ? 0 : msd_qty) - (isNaN(reserved_qty) ? 0 : reserved_qty)
        // TODO (empty) - this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.reserved_quantity
        console.log("stock quantitiy", this.state.stockData)
        console.log("stock quantitiyquantity", quantity)

        //console.log("quantity paraant", this.state.stockData.filter((data) => data.item_id == '6d5b7ea5-6b00-40c7-a55c-d0ce37935927')[0]?.quantity)
        //console.log("quantity paraant reserved", isNaN(reserved_qty)?0:reserved_qty)


        if (quantity === '' || quantity === null || isNaN(quantity)) {
            Math.floor(isNaN(msd_qty) ? 0 : msd_qty)
            // return 0
        }
        else {
            return (
                isNaN(Math.floor(quantity)) ? 0 : Math.floor(quantity)
                //    quantity[0]?.quantity
            )
        }
    }

    instituteQty(row) {
        let quantity = this.state.warehouseData.filter((data) => data.real_warehouse_id == row.OrderExchange.from && data.item_id == row.item_id)
        console.log('stockdata5', quantity)
        return (
            // <h1>2</h1>
            isNaN(Math.floor(quantity[0]?.quantity)) ? 0 : Math.floor(quantity[0]?.quantity)
        )
    }


    instituteStokeMonthly(row) {
        let quantity = this.state.warehouseData.filter((data) => data.real_warehouse_id == row.OrderExchange.from && data.item_id == row.item_id)
        let data = this.state.instituteStockDays.filter(x => x.item_id == row.item_id)[0]

        console.log('stockdata5', quantity)
        if (isNaN(data?.total_remaining_days) || data?.total_remaining_days == null) {
            let qt = Number(quantity[0]?.quantity) / Number(data?.consumption) / 30;
            return isNaN(qt) ? 0 : qt
        } else {
            let qt = Number(data?.total_remaining_days) / 30
            return isNaN(qt) ? 0 : qt
        }

    }
    instituteConsumption(row) {
        let data = this.state.instituteStockDays.filter(x => x.item_id == row.item_id)[0]
        return isNaN(Number(data?.consumption)) ? 0 : Number(data?.consumption)

    }

    async calculateEstimationQty(row) {

        this.setState({
            selected_estimation_id: null,
            selected_item_estimation: "Loading",
            selected_item_remaining_estimation: "Loading",
            selectedItemMonthlyEstimation: "Loading",
            remaining_result: 0,
            estimationLoaded: false
        })

        let items = this.state.estimationData.filter(((ele) => ele.item_id == row.item_id))
        // let issuedQty = Number(items[0]?.issued_quantity ? items[0]?.issued_quantity : 0)

        let filteredMyWarehouse = items.filter((ele) => ele.HosptialEstimation?.warehouse_id == row?.OrderExchange?.from)
        console.log("filtered estimation data", filteredMyWarehouse)

        if (filteredMyWarehouse.length > 0) {
            let annualEstimation = isNaN(Math.floor(filteredMyWarehouse[0].estimation)) ? 0 : Math.floor(filteredMyWarehouse[0].estimation)
            console.log("estimation new data 0", annualEstimation)
            let issuedQty = Number(filteredMyWarehouse[0]?.issued_quantity ? filteredMyWarehouse[0]?.issued_quantity : 0)
            let remaining_result = 100 - (Math.floor(annualEstimation - Number(issuedQty))) / Math.floor(annualEstimation) * 100;

            if (isNaN(remaining_result)) {
                remaining_result = 0
            }
            this.setState({
                selected_estimation_id: filteredMyWarehouse[0].id,
                selected_item_estimation: annualEstimation,
                selected_item_remaining_estimation: annualEstimation - issuedQty,
                selectedItemMonthlyEstimation: annualEstimation / 12,
                remaining_result: remaining_result,
                estimationLoaded: true

            })

        } else {
            let params = {
                warehouse_id: row?.OrderExchange?.from
            }
            let estimation_warehouse = await EstimationService.getEstimationRelations(params)

            if (estimation_warehouse.status == 200) {
                if (estimation_warehouse?.data?.view?.data?.length > 0) {

                    let estimationWarehouseIds = estimation_warehouse?.data?.view?.data.map((e) => e.estimated_warehouse_id)
                    const filteredEstimationArray = items.filter(obj => estimationWarehouseIds.includes(obj.HosptialEstimation?.warehouse_id));

                    if (filteredEstimationArray.length > 0) {
                        console.log("estimation new data 1", isNaN(Math.floor(filteredEstimationArray[0].estimation)) ? 0 : Math.floor(filteredEstimationArray[0].estimation))
                        let annualEstimation = isNaN(Math.floor(filteredEstimationArray[0].estimation)) ? 0 : Math.floor(filteredEstimationArray[0].estimation)
                        let issuedQty = Number(filteredEstimationArray[0]?.issued_quantity ? filteredEstimationArray[0]?.issued_quantity : 0)
                        let remaining_result = 100 - (Math.floor(annualEstimation - Number(issuedQty))) / Math.floor(annualEstimation) * 100;

                        if (isNaN(remaining_result)) {
                            remaining_result = 0
                        }

                        this.setState({
                            selected_estimation_id: filteredEstimationArray[0].id,
                            selected_item_estimation: annualEstimation,
                            selected_item_remaining_estimation: annualEstimation - issuedQty,
                            selectedItemMonthlyEstimation: annualEstimation / 12,
                            remaining_result: remaining_result,
                            estimationLoaded: true
                        })

                    } else {
                        if (items.length > 0) {
                            console.log("estimation new data 2", isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation))
                            let annualEstimation = isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation)
                            let issuedQty = Number(items[0]?.issued_quantity ? items[0]?.issued_quantity : 0)
                            let remaining_result = 100 - (Math.floor(annualEstimation - Number(issuedQty))) / Math.floor(annualEstimation) * 100;

                            if (isNaN(remaining_result)) {
                                remaining_result = 0
                            }

                            this.setState({
                                selected_estimation_id: items[0].id,
                                selected_item_estimation: annualEstimation,
                                selected_item_remaining_estimation: annualEstimation - issuedQty,
                                selectedItemMonthlyEstimation: annualEstimation / 12,
                                remaining_result: remaining_result,
                                estimationLoaded: true
                            })
                        } else {
                            let annualEstimation = 0

                            this.setState({
                                selected_estimation_id: null,
                                selected_item_estimation: "Not Estimated",
                                selected_item_remaining_estimation: annualEstimation,
                                selectedItemMonthlyEstimation: "Not Estimated",
                                remaining_result: 0,
                                estimationLoaded: true
                            })
                        }
                    }


                } else {
                    if (items.length > 0) {
                        console.log("estimation new data 3", isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation))
                        let annualEstimation = isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation)
                        let issuedQty = Number(items[0]?.issued_quantity ? items[0]?.issued_quantity : 0)
                        let remaining_result = 100 - (Math.floor(annualEstimation - Number(issuedQty))) / Math.floor(annualEstimation) * 100;

                        if (isNaN(remaining_result)) {
                            remaining_result = 0
                        }

                        this.setState({
                            selected_estimation_id: items[0].id,
                            selected_item_estimation: annualEstimation,
                            selected_item_remaining_estimation: annualEstimation - issuedQty,
                            selectedItemMonthlyEstimation: annualEstimation / 12,
                            remaining_result: remaining_result,
                            estimationLoaded: true
                        })
                    } else {
                        let annualEstimation = 0
                        this.setState({
                            selected_estimation_id: null,
                            selected_item_estimation: "Not Estimated",
                            selected_item_remaining_estimation: annualEstimation,
                            selectedItemMonthlyEstimation: "Not Estimated",
                            remaining_result: 0,
                            estimationLoaded: true
                        })
                    }
                }

            }
        }




        /*  if (items.length > 0) {
            return isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation)
        } else {
            return (
                <div>Not Estimated</div>
            )
        } */
    }

    calculateRemainingEstimation(row) {
        let items = this.state.estimationData.filter(((ele) => ele.item_id == row.item_id))
        if (items.length > 0) {
            // return Math.floor(items[0].estimation - (Number(items[0].allocated_quantity ? items[0].allocated_quantity : 0) + Number(items[0].issued_quantity ? items[0].issued_quantity : 0)))
            let qt = Math.floor(items[0].estimation - Number(items[0].issued_quantity ? items[0].issued_quantity : 0))
            return isNaN(qt) ? 0 : qt

        } else {
            return (
                <div>Not Estimated</div>
            )
        }
    }

    calculateEstimationProgress(row) {
        let result = 0;
        let items = this.state.estimationData.filter(((ele) => ele.item_id == row.item_id))
        if (items.length > 0) {
            // result = 100 - (Math.floor(items[0].estimation - (Number(items[0].allocated_quantity ? items[0].allocated_quantity : 0) + Number(items[0].issued_quantity ? items[0].issued_quantity : 0)))) / Math.floor(items[0].estimation) * 100;

            result = 100 - (Math.floor(items[0].estimation - Number(items[0].issued_quantity ? items[0].issued_quantity : 0))) / Math.floor(items[0].estimation) * 100;

            if (isNaN(result)) {
                result = 0
            }
        } else {

        }
        return result;

    }

    calculateStockDays(row) {
        let data = parseFloat(row?.total_remaining_days)
        if (isNaN(data) || data == '') {
            return 0
        } else {
            return data?.total_remaining_days
        }

    }

    calculateTotal(data) {
        try {
            const prices = data.map((item) => item.to_be_issue_quantity * item?.ItemSnap.standard_cost);
            const total = prices.reduce((acc, curr) => acc + curr, 0);
            return roundDecimal(total, 2)
        } catch (err) {
            console.error("Error", err);
            return 0;
        }
    }

    calculateActualTotal(data) {
        try {
            const prices = data.map((item, i) => this.state.batchAllocationItemvalues[i] ? this.state.batchAllocationItemvalues[i] * Number(item?.ItemSnapBatch.unit_price) : 0);
            const total = prices.reduce((acc, curr) => acc + curr, 0);
            return roundDecimal(total, 2)
        } catch (err) {
            console.error("Error", err);
            return 0;
        }
    }


    handlePopper = event => {
        this.setState({
            popoveropen: true,
            anchorEl: event.currentTarget
        });
    };

    handleCloseSnackbar = () => {
        this.setState({
            popoveropen: false,
            anchorEl: null,
            allocationMessage: null,
            warning_alert_for_lastAllocate: false,
        });
    };

    async getPackSizes(packdata) {
        let batch_nos = packdata.map((ele) => ele.ItemSnapBatch.batch_no)
        let params = {
            search_type: 'packingonly',
            batch_no: batch_nos,
            item_id: packdata[0]?.ItemSnapBatch.item_id,
            'order[0]': ['level', 'DESC'],
        }

        console.log("batch data params", params)
        let res = await ConsignmentService.getConsignmentItems(params);
        if (200 == res.status) {
            console.log("consingment data", res.data.view)
            this.setState({

                ConsignmentItemDetails: res.data.view.data,

            })

        }
    }
    async resetAllocation() {
        let data = { "status": "reset" }
        let res = await DistributionCenterServices.exchangeChangeById(data, this.state.selected_order_item_id);
        console.log("ress", res)
        if (res.status == 200) {
            this.setState(
                {
                    message: 'Order Allocation Reset Completed',
                    severity: 'Success',
                    alert: true,
                },
                () => {
                    window.location.reload();


                }
            )
        } else {
            this.setState(
                {
                    message: 'Cannot Reset Order Allocation',
                    severity: 'error',
                    alert: true,
                }
            )
        }
    }

    async checkAllocatingQty(tableMeta) {
        if (!this.state.submitting_form) {
            this.setState({ warning_alert_without_estimation: false, submitting_form: true })
            let data = this.state.data[tableMeta.rowIndex]
            let quantity = this.state.stockData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id)
            console.log("quantity array", quantity)
            console.log("quantity data", data)
            let packsize = quantity[0]?.pack_size


            //let val = data % packsize  //uncomment for consider to packsize
            let val = 0;

            /* console.log("PlanQty", quantity, packsize, val, data)
    
            let reserved_quantity = parseFloat(this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id)[0]?.reserved_quantity)
    
            let reservable_quantity = parseFloat(this.state.stockData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id)[0]?.quantity) - isNaN(reserved_quantity) ? 0 : reserved_quantity
            // TODO (empty) - this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.reserved_quantity
    
            if (reservable_quantity === '' || reservable_quantity === null || isNaN(reservable_quantity)) {
                reservable_quantity = Math.floor(parseFloat(this.state.stockData.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id)[0]?.quantity))
                // return 0
            }
            else {
                reservable_quantity = Math.floor(reservable_quantity)
    
            } */

            let reservable_quantity = this.ParentReservedQty(this.state.data[tableMeta.rowIndex])
            console.log("quantity reservable_quantity", reservable_quantity)

            if (val == 0) {
                

                if(data?.ItemSnap?.converted_order_uom === 'EUV2') {
                    // reservable_quantity = reservable_quantity * data?.ItemSnap?.item_unit_size
                    if (reservable_quantity < Number(this.state.data[tableMeta.rowIndex].to_be_issue_quantity / data?.ItemSnap?.item_unit_size)) {
                        this.setState(
                            { message: "Quantity Should be Lower Than Available Quantity", submitting_form: false, alert: true, severity: "Error" }
                        )
                    } else if (Number(this.state.data[tableMeta.rowIndex].to_be_issue_quantity / data?.ItemSnap?.item_unit_size) < 0) {
                        this.setState({ message: "Quantity Should Be Greater than 0", alert: true, severity: "Error", submitting_form: false })

                    } else {
                        this.submitIssueQty(tableMeta.rowIndex, this.state.data[tableMeta.rowIndex].id)
                    }

                } else {
                    if (reservable_quantity < Number(this.state.data[tableMeta.rowIndex].to_be_issue_quantity)) {
                        this.setState(
                            { message: "Quantity Should be Lower Than Available Quantity", submitting_form: false, alert: true, severity: "Error" }
                        )
                    } else if (Number(this.state.data[tableMeta.rowIndex].to_be_issue_quantity) < 0) {
                        this.setState({ message: "Quantity Should Be Greater than 0", alert: true, severity: "Error", submitting_form: false })

                    } else {
                        this.submitIssueQty(tableMeta.rowIndex, this.state.data[tableMeta.rowIndex].id)
                    }
                }

            } else {
                this.setState(
                    { message: "Add the quntity only in multiples of pack size", alert: true, severity: "Error", submitting_form: false }
                )
            }

            console.log("valuessss", this.state.data[tableMeta.rowIndex].id)
        }
    }


    async submitRemark(rowMeta) {
        let formdata = {
            remarks: this.state.data[rowMeta.rowIndex].remarks
        }
        if (this.state.data[rowMeta.rowIndex].remarks) {
            let res = await WarehouseServices.orderItemEdit(formdata, this.state.data[rowMeta.rowIndex].id);
            if (res.status == 200) {
                this.setState({
                    alert: true,
                    severity: 'success',
                    message: 'Remark Successfull',
                }, () => {
                    //window.history.back()
                    // this.LoadOrderItemDetails()
                })
            } else {
                this.setState({
                    alert: true,
                    severity: 'error',
                    message: 'Unsuccessfull',
                })
            }
        }
    }


    async loadLastRecievedData(row) {
        console.log("clicked row", row)
        let owner_id = await localStorageService.getItem('owner_id')
        let params = {
            item_id: row.item_id,
            status: 'Active',
            //order_status:['Active', 'Pending',  'APPROVED', 'ALLOCATED', 'ISSUE SUBMITTED','ISSUED', 'ORDERED','COMPLETED'],
            allocation_sum: true,
            group_by_warehouse_only: true,
            from: row.OrderExchange?.from,
            from_date: moment(new Date()).subtract(14, "days").format('YYYY-MM-DD'),
            to_date: moment(new Date()).add(1, "days").format('YYYY-MM-DD'),
            to_owner_id: owner_id
        }

        let batch_res = await PharmacyOrderService.getOrderBatchItems(params)
        if (batch_res.status == 200) {
            console.log("last allocation history", batch_res.data.view.data)

            if (batch_res.data.view.data.length > 0) {
                const sum = batch_res?.data?.view?.data?.reduce((accumulator, object) => {
                    return Number(accumulator) + Number(object.reserved_quantity);
                }, 0);
                this.setState({
                    allocationMessage: "This Item was Ordered Within Last Two Weeks.Quantity : " + sum + '.',
                    warning_alert_for_lastAllocate: true,
                })
            }
        }
    }

    async getUserInfo() {
        let userRole = await localStorageService.getItem('userInfo').roles[0]

        if (includesArrayElements([userRole], ['MSD AD', 'MSD MSA Dispatch'])) {
            this.setState({ isEditable: false })
        }

        this.setState({
            userRole: userRole
        })
    }

    // split order
    // async getSplitOrder(){

    //     let params = {
    //         splited_from:this.props.id.match.params.id,
    //         page:0,
    //         limit:10,
    //     }

    //     let res = ChiefPharmacistServices.getAllOrders(params)

    //     if (res.status == 200) {
    //         console.log('split data', res)
    //     }
    // }

    render() {
        return (
            <> < FilterComponent onSubmitFunc={
                this
                    .updateFilters
                    .bind(this)
            } />

                <Grid
                    container="container"
                    style={{
                        justifyContent: 'flex-end'
                    }}>
                    {(this.props.id.match.params.status == 'Pending' || this.props.id.match.params.status == 'APPROVED') && this.state.isEditable ?
                        <Grid
                            className="w-full flex justify-end" item lg={2} md={4} sm={4} xs={4}>
                            <Button
                                variant="outlined"
                                className="mt-2 w-full"
                                progress={false}
                                color="primary"
                                // type="submit"
                                scrollToTop={true}
                                onClick={() => {
                                    this.setState({
                                        addItemDialog: true
                                    })
                                }}
                            >
                                <span className="capitalize">Add Item</span>
                            </Button>
                        </Grid>
                        : null}
                </Grid>
                <ValidatorForm className='w-full' /* onSubmit={() => this.issueOrder()} */ onError={() => null}>

                    {
                        this.state.loaded
                            ? <LoonsTable
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.totalItems,
                                    rowsPerPage: this.state.filterData.limit,
                                    page: this.state.filterData.page,
                                    print: true,
                                    viewColumns: true,
                                    download: true,
                                    onTableChange: (action, tableState) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                this.setPage(tableState.page)
                                                break
                                            case 'sort':
                                                // this.sort(tableState.page, tableState.sortOrder);
                                                break
                                            default:
                                                console.log('action not handled.')
                                        }
                                    }
                                }}
                                data={this.state.data}
                                columns={this.state.columns} />
                            : (
                                //loading effect
                                <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>
                            )
                    }
                    <br />
                    <Grid container="container" className="flex" spacing={2}  >
                        <Grid container spacing={2} direction="row">
                            {this.state.isEditable &&
                                <Grid item  >
                                    {this.props.id.match.params.status == 'Pending' || this.props.id.match.params.status == 'APPROVED' || this.props.id.match.params.status == 'vehicle_in' || this.props.id.match.params.status == 'Arrived' || this.props.id.match.params.status == 'ISSUE SUBMITTED' || this.props.id.match.params.status == 'ALLOCATED' ?
                                        <LoonsButton
                                            // disabled={this.state.order?.approval_status == "PENDING" || this.state.order?.approval_status == "REJECTED"}
                                            className="mt-1 mb-2 mr-2" progress={this.state.issuing} /* type="submit" */ startIcon="save"
                                            onClick={() => { this.checkAllocation() }}
                                        //onClick={this.handleChange}
                                        >
                                            {this.props.id.match.params.status == 'ISSUE SUBMITTED' ?
                                                <span className="capitalize">Issue Again</span>
                                                :
                                                <span className="capitalize">Issue Order</span>
                                            }
                                        </LoonsButton> : null}
                                </Grid>
                            }

                            {this.state.isEditable &&
                                <Grid item  >
                                    {this.state.userRole === 'MSD Distribution Officer' && this.props.id.match.params.status == 'Pending' || this.props.id.match.params.status == 'APPROVED' ?
                                        <LoonsButton
                                            // disabled={this.state.order?.approval_status == "PENDING" || this.state.order?.approval_status == "REJECTED"}
                                            className="mt-1 mb-2 mr-2" /* type="submit" */
                                            onClick={() => { this.rejectOrder() }}
                                            style={{ backgroundColor: 'red' }}
                                        //onClick={this.handleChange}
                                        >

                                            <span className="capitalize">Reject Order</span>

                                        </LoonsButton> : null}
                                </Grid>
                            }
                        </Grid>


                        {/* {this.state.order?.Delivery?.delivery_mode == 'Delivery' ?  */}
                        <Grid
                            container justifyContent="flex-end">
                            <Grid>
                                <LoonsButton
                                    className="mt-6"
                                    progress={false}
                                    scrollToTop={true}
                                    startIcon="add"

                                    onClick={() => this.setState({ vehicleDialogView: true })}
                                >
                                    <span className="capitalize">Add Vehicles</span>
                                </LoonsButton>
                            </Grid>
                        </Grid>

                        {/* : null} */}

                    </Grid>

                    <Dialog fullWidth maxWidth="xl" open={this.state.vehicleDialogView}
                        onClose={() => {
                            this.setState({ vehicleDialogView: false }
                                , () => this.preLoadData()
                            )
                        }}  >
                        <MuiDialogTitle disableTypography
                        //  className={classes.Dialogroot}
                        >
                            <CardTitle title="Select New Vehicle" />
                            <IconButton aria-label="close"
                                //  className={classes.closeButton}
                                onClick={() => {
                                    this.setState({ vehicleDialogView: false }
                                        , () => this.preLoadData()
                                    )
                                }}>
                                <CloseIcon />
                            </IconButton>
                        </MuiDialogTitle>
                        <div className="w-full h-full px-5 py-5">
                            <MDS_AddVehicleNew delivery_id={this.state.vehicle_filterData.order_delivery_id} />
                        </div>
                    </Dialog>


                    <Grid className='mt-5' item lg={12} md={12} sm={12} xs={12}>

                        {
                            this.state.vehicleLoaded ?
                                <>
                                    <LoonsTable
                                        title={"Vehicle"}

                                        id={'all_vehicle'}
                                        data={
                                            this.state.vehicle_data
                                        }
                                        columns={
                                            this.state.vehicle_columns
                                        }
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            //count: this.state.totalItems,
                                            //rowsPerPage: this.state.filterData.limit,
                                            //page: this.state.filterData.page,

                                            print: false,
                                            viewColumns: false,
                                            download: false,
                                            onTableChange: (action, tableState) => {
                                                console.log(action, tableState)
                                                switch (
                                                action
                                                ) {
                                                    case 'changePage':
                                                        this.setPage(
                                                            tableState.page
                                                        )
                                                        break
                                                    case 'sort':
                                                        // this.sort(tableState.page, tableState.sortOrder);
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </> :
                                (
                                    //loading effect
                                    <Grid className="justify-center text-center w-full pt-12">
                                        <CircularProgress size={30} />
                                    </Grid>
                                )

                        }

                    </Grid>


                </ValidatorForm>

                <Dialog
                    maxWidth="lg"
                    open={this.state.allocate_item}
                    onClose={() => {
                        // this.setState({allocate_item: false})
                    }}>
                    <div className="w-full h-full px-5 py-5">
                        <Grid container="container">
                            <Grid item="item" lg={7} md={6}>
                                <Typography variant='h6'>Individual Item - Batch Allocation</Typography>
                            </Grid>
                            <Grid item="item" lg={5} md={6}>
                                <Grid
                                    container="container"
                                    style={{
                                        alignItems: 'flex-end'
                                    }}>
                                    <Grid item="item" lg={9} md={9} xs={9}>
                                        <Grid container="container" lg={12} md={12} xs={12}>
                                            {/* <Grid item="item" lg={6} md={6} xs={6}>Counter Pharmacist ID</Grid>
                                        <Grid item="item" lg={6} md={6} xs={6}>00002</Grid> */}
                                            <Grid item="item" lg={6} md={6} xs={6}>Counter Pharmacist</Grid>
                                            <Grid item="item" lg={6} md={6} xs={6}>{this.props.id.match.params.empname}</Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item="item" lg={2} md={2} xs={2}><AccountCircleIcon fontSize="large" /></Grid>
                                    <Grid item="item" lg={1} md={1} xs={1}><IconButton aria-label="close" onClick={() => { this.setState({ allocate_item: false, batchAllocationItemvalues: [] }) }}><CloseIcon /></IconButton></Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                        <div className='mt-6'></div>
                        <CardTitle title={this.state.data[this.state.selected_item]?.ItemSnap?.medium_description} />
                        <LoonsTable
                            options={{
                                pagination: false,
                                serverSide: true,
                                // count: this.state.totalItems,
                                //rowsPerPage: this.state.filterData.limit,
                                // page: this.state.filterData.page,
                                print: false,
                                viewColumns: true,
                                download: false,
                                onTableChange: (action, tableState) => {
                                    console.log(action, tableState)
                                    switch (action) {
                                        case 'changePage':
                                            this.setPage(tableState.page)
                                            break
                                        case 'sort':
                                            // this.sort(tableState.page, tableState.sortOrder);
                                            break
                                        default:
                                            console.log('action not handled.')
                                    }
                                }
                            }}
                            columns={this.state.allocate_dialog_table}
                            data={[this.state.data[this.state.selected_item]]} />

                        {/* <div className='mt-6'></div> */}
                        <LoonsCard
                            style={{
                                // marginTop: '8px'
                            }}>

                            <Tabs
                                value={this.state.activeTab}
                                onChange={(e, val) => { this.setState({ activeTab: val }) }}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="fullWidth"
                                aria-label="full width tabs example">
                                <Tab label="Batch Details" />
                                <Tab label="Allocated History (Institute)" />
                                <Tab label="Allocated History" />
                            </Tabs>


                            {this.state.activeTab == 0 &&
                                <div>
                                    <Typography variant='h6'>
                                        Batch Details</Typography>

                                    <Grid container="container">
                                        <Grid item="item" lg={9}>
                                            <Grid
                                                container="container"
                                                lg={12}
                                                md={12}
                                                xs={12}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                {/*   <Grid item="item" lg={1} md={1} xs={2}>Sort By</Grid>
                                        <Grid item="item" lg={3} md={3} xs={3} className='mr-2'>
                                            <ValidatorForm>
                                                <Autocomplete
                                        disableClearable className="w-full" options={['2022', '2023']} onChange={(e, value) => {
                                                    if (value != null) {
                                                        // let formData = this.state.formData formData.ven_id = value     .id     this
                                                        // .setState({formData})
                                                    }
                                                }}
                                                      defaultValue={this.state.all_district.find(
                                                    (v) => v.id == this.state.formData.district_id
                                                    )} 

                                                    // value={this

                                                    //     .state

                                                    //     .all_ven

                                                    //     .find((v) => v.id == this.state.formData.ven_id)} getOptionLabel={(

                                                    //     option) => option.name

                                                    //     ? option.name

                                                    //     : ''} 
                                                    renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Exp Date"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small" />
                                                    )} />
                                            </ValidatorForm>
                                        </Grid>
                                        <Grid item="item" lg={4} md={4} xs={4}>
                                            <ValidatorForm>
                                                <Autocomplete
                                        disableClearable className="w-full" options={['Ascending', 'Descending']} onChange={(e, value) => {
                                                    if (value != null) {
                                                        // let formData = this.state.formData formData.ven_id = value     .id     this
                                                        // .setState({formData})
                                                    }
                                                }}
                                                      defaultValue={this.state.all_district.find(
                                                    (v) => v.id == this.state.formData.district_id
                                                    )} 

                                                    // value={this

                                                    //     .state

                                                    //     .all_ven

                                                    //     .find((v) => v.id == this.state.formData.ven_id)} getOptionLabel={(

                                                    //     option) => option.name

                                                    //     ? option.name

                                                    //     : ''} 
                                                    renderInput={(params) => (
                                                        <TextValidator {...params} placeholder="Descending"
                                                            //variant="outlined"
                                                            fullWidth="fullWidth" variant="outlined" size="small" />
                                                    )} />
                                            </ValidatorForm>
                                        </Grid> */}
                                            </Grid>
                                        </Grid>
                                        <Grid item="item" lg={3}>
                                            {/* <ValidatorForm>
                                        <div className='flex items-center'>
                                            <TextValidator className='w-full' placeholder="Search"
                                                //variant="outlined"
                                                fullWidth="fullWidth" variant="outlined" size="small"
                                                //value={this.state.formData.search} 
                                                onChange={(e, value) => {
                                                    let filterData = this.state.filterData
                                                    filterData.search = e.target.value;
                                                    this.setState({ filterData })
                                                    console.log("form dat", this.state.filterData)
                                                }} onKeyPress={(e) => {
                                                    if (e.key == "Enter") {
                                                        this
                                                            .props
                                                            .onSubmitFunc(
                                                                this.state.filterData.ven_id,
                                                                this.state.filterData.category_id,
                                                                this.state.filterData.class_id,
                                                                this.state.filterData.group_id,
                                                                this.state.filterData.search
                                                            )

                                                    }

                                                }}
                                               
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <SearchIcon></SearchIcon>
                                                        </InputAdornment>
                                                    )
                                                }} />
                                        </div>
                                        
                                    </ValidatorForm> */}
                                        </Grid>
                                        {/* <Grid item lg={3} md={3} sm={3} xs={3} className='hide-on-fullScreen  mt-3' > */}

                                        {/* </Grid> */}
                                    </Grid>
                                    <Grid container item sm={12} xs={12}>
                                        <Grid item xs={6} sm={4} md={3} lg={2}>
                                            <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'green', marginRight: '5px' }}></span>
                                                More than 1 year </p>
                                        </Grid>
                                        <Grid item xs={6} sm={4} md={3} lg={2}>
                                            <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'gray', marginRight: '5px' }}></span>
                                                More than 6 months </p>
                                        </Grid>
                                        <Grid item xs={6} sm={4} md={3} lg={2}>
                                            <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'blue', marginRight: '5px' }}></span>
                                                More than 3 months</p>
                                        </Grid>
                                        <Grid item xs={6} sm={4} md={3} lg={2}>
                                            <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'orange', marginRight: '5px' }}></span>
                                                More than 1 months</p>
                                        </Grid>
                                        <Grid item xs={6} sm={4} md={3} lg={2}>
                                            <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: '#eb6434', marginRight: '5px' }}></span>
                                                Less than 1 months</p>
                                        </Grid>

                                        <Grid item xs={6} sm={4} md={3} lg={2}>
                                            <p className='mt-0 pt-0 mb-0 pb-0'>  <span style={{ display: 'inline-block', height: '15px', width: '15px', background: 'red', marginRight: '5px' }}></span>
                                                Less than 2 weeks</p>
                                        </Grid>



                                    </Grid>


                                    <ValidatorForm onSubmit={() => {
                                        let user = localStorageService.getItem('userInfo')
                                        if (this.state.allocate.quantity == 0 || this.state.allocate.quantity == "" || this.state.allocate.quantity == null) {
                                            this.setState(
                                                { message: "Please enter a value", alert: true, severity: "Error" }
                                            )
                                        } else {
                                            console.log("aaa", this.state.allocate.quantity)
                                            console.log("aaa2", this.state.data[this.state.selected_item].to_be_issue_quantity)
                                            if (parseInt(this.state.allocate.quantity) > parseInt(this.state.data[this.state.selected_item].to_be_issue_quantity)) {
                                                this.setState(
                                                    { message: "Cannot allocate more than plan to allocate quantity", alert: true, severity: "Error" }
                                                )
                                            }
                                            else {
                                                this.setState({ allocating: true })
                                                this.allocate(
                                                    this.state.data[this.state.selected_item].id,
                                                    "ALLOCATED",
                                                    user.id,
                                                    new Date().toJSON(),
                                                    this.state.data[this.state.selected_item]
                                                )
                                            }

                                        }

                                    }}>
                                        <LoonsTable
                                            columns={this.state.batch_details}
                                            data={this.state.batch_details_data}
                                        // options={{
                                        //     pagination: true,
                                        //     serverSide: true,
                                        //     count: this.state.totalItems,
                                        //     rowsPerPage: this.state.filterData.limit,
                                        //     page: this.state.filterData.page,
                                        //     print: true,
                                        //     viewColumns: true,
                                        //     download: true,
                                        //     onTableChange: (action, tableState) => {
                                        //         console.log(action, tableState)
                                        //         switch (action) {
                                        //             case 'changePage':
                                        //                 this.setPage(tableState.page)
                                        //                 break
                                        //             case 'sort':
                                        //                 // this.sort(tableState.page, tableState.sortOrder);
                                        //                 break
                                        //             default:
                                        //                 console.log('action not handled.')
                                        //         }
                                        //     }
                                        // }}
                                        ></LoonsTable>
                                        <br />
                                        <Typography variant='body2'>Total: {this.calculateActualTotal(this.state.batch_details_data)}</Typography>
                                        <br />
                                        <Grid
                                            container="container"
                                            style={{
                                                justifyContent: 'flex-end',
                                                marginTop: '8px'
                                            }}>
                                            <Grid item="item" className='mr-1'>
                                                {/*  <Button
                                            style={{
                                                backgroundColor: 'red',
                                                color: 'white'
                                            }} onClick={() => { this.resetButton() }}>Reset <DeleteSweepIcon /></Button> */}
                                            </Grid>
                                            <Grid item="item" className='mr-1'>
                                                <Button
                                                    style={{
                                                        backgroundColor: '#ff9800',
                                                        color: 'white'
                                                    }}
                                                    onClick={(
                                                    ) => this.state.unable_to_fill == 'hidden'
                                                            ? this.setState({ unable_to_fill: 'visible' })
                                                            : this.setState({ unable_to_fill: 'hidden' })}>Unable to fulfill <ErrorOutlineIcon /></Button>
                                            </Grid>
                                            <Grid item="item">
                                                <LoonsButton
                                                    style={{
                                                        backgroundColor: '#1a73e8',
                                                        color: 'white'
                                                    }}

                                                    progress={this.state.submitting}
                                                    type={"submit"}
                                                /*    onClick={() => {
                                                       let user = localStorageService.getItem('userInfo')
                                                       if (this.state.allocate.quantity == 0 || this.state.allocate.quantity == "" || this.state.allocate.quantity == null) {
                                                           this.setState(
                                                               { message: "Please enter a value", alert: true, severity: "Error" }
                                                           )
                                                       } else {
                                                           if (this.state.allocate.quantity > this.state.batch_details_data[0].quantity) {
                                                               this.setState(
                                                                   { message: "Cannot allocate more than reservable quantity", alert: true, severity: "Error" }
                                                               )
                                                           } else {
                                                               console.log("aaa", this.state.allocate.quantity)
                                                               console.log("aaa2", this.state.data[this.state.selected_item].to_be_issue_quantity)
                                                               if (parseInt(this.state.allocate.quantity) > parseInt(this.state.data[this.state.selected_item].to_be_issue_quantity)) {
                                                                   this.setState(
                                                                       { message: "Cannot allocate more than plan to allocate quantity", alert: true, severity: "Error" }
                                                                   )
                                                               } else {
                                                                   this.allocate(
                                                                       this.state.data[this.state.selected_item].id,
                                                                       "ALLOCATED",
                                                                       user.id,
                                                                       new Date().toJSON(),
                                                                   )
                                                               }
                                                           }
                                                       }
            
            
                                                   }} */
                                                >Allocate <CheckCircleOutlineIcon /></LoonsButton>
                                            </Grid>
                                        </Grid>
                                    </ValidatorForm>
                                    <div
                                        className='mt-5'
                                        style={{
                                            contentVisibility: this.state.unable_to_fill,
                                            visibility: this.state.unable_to_fill
                                        }}>
                                        <Grid
                                            container="container"
                                            lg={12}
                                            md={12}
                                            xs={12}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                            <Grid item="item" lg={4} md={4} xs={4}>Your order is unable to fulfill due to</Grid>
                                            <Grid item="item" lg={8} md={8} xs={8}>
                                                <ValidatorForm>
                                                    <Autocomplete
                                                        disableClearable
                                                        className="w-full"
                                                        options={this.state.remarks}
                                                        onChange={(e, value) => {
                                                            console.log(value);
                                                            if (value != null) {
                                                                if (value.remark == 'Other') {
                                                                    this.setState({ remarks_other: 'visible' })
                                                                    this.state.allocate.remark_id = null
                                                                } else {
                                                                    this.setState({ remarks_other: 'hidden' })
                                                                    this.state.allocate.remark_id = value.id
                                                                }

                                                            } else {
                                                                this.setState({ remarks_other: 'hidden' })
                                                                this.state.allocate.remark_id = null
                                                            }
                                                        }}
                                                        value={this
                                                            .state
                                                            .remarks
                                                            .find((v) => v.id == this.state.remarks_id)}
                                                        getOptionLabel={(
                                                            option) => option.remark
                                                                ? option.remark
                                                                : ''}
                                                        renderInput={(params) => (
                                                            <TextValidator {...params} placeholder="Select Remarks"
                                                                //variant="outlined"
                                                                fullWidth="fullWidth" variant="outlined" size="small" />
                                                        )} /></ValidatorForm>
                                            </Grid>
                                            <Grid item="item" lg={4} md={4} xs={4}></Grid>
                                            <Grid
                                                item="item"
                                                lg={8}
                                                md={8}
                                                xs={8}
                                                style={{
                                                    contentVisibility: this.state.remarks_other,
                                                    visibility: this.state.remarks_other
                                                }}>
                                                <Grid container="container" lg={12} md={12} xs={12}>
                                                    <Grid item="item" lg={1} md={1} xs={1}>Other</Grid>
                                                    <Grid item="item" lg={12} md={12} xs={12}>
                                                        <textarea
                                                            onChange={(e) => {
                                                                this.state.allocate.other_remarks = e.target.value
                                                            }}
                                                            style={{
                                                                width: '100%'
                                                            }}
                                                            cols="2"
                                                            rows="5"></textarea>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                item="item"
                                                lg={12}
                                                md={12}
                                                xs={12}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    marginTop: '8px'
                                                }}>
                                                <LoonsButton onClick={() => {
                                                    let user = localStorageService.getItem('userInfo')
                                                    this.allocate(
                                                        this.state.data[this.state.selected_item]?.id,
                                                        "DROPPED",
                                                        user.id,
                                                        null,
                                                        dateParse(new Date()),
                                                        this.state.batch_details_data[0]?.id,
                                                        null,
                                                        null
                                                    )
                                                }}>Submit</LoonsButton>
                                            </Grid>
                                        </Grid>
                                    </div>

                                </div>
                            }

                            {this.state.activeTab == 1 &&
                                <div>
                                    <HistoryAllocatedInstitute from={this.state.data[this.state.selected_item]?.OrderExchange?.from} itemId={this.state.data[this.state.selected_item]?.item_id}></HistoryAllocatedInstitute>
                                </div>
                            }

                            {this.state.activeTab == 2 &&
                                <div>
                                    <HistoryAllocated from={this.state.selected_item?.OrderExchange?.from} itemId={this.state.data[this.state.selected_item]?.item_id}></HistoryAllocated>
                                </div>
                            }



                        </LoonsCard>
                        {/* <Grid
                        container="container"
                        style={{
                            marginTop: '8px'
                        }}
                        lg={12}
                        md={12}
                        xs={12}>
                        <Grid item="item" className='p-1' lg={4} md={4} xs={4}>
                            <Button
                                style={{
                                    backgroundColor: '#1a73e8',
                                    color: 'white'
                                }}
                                fullWidth={true}>Show other orders for this item</Button>
                        </Grid>
                        <Grid item="item" className='p-1' lg={4} md={4} xs={4}>
                            <Button
                                style={{
                                    backgroundColor: '#1a73e8',
                                    color: 'white'
                                }}
                                fullWidth={true}>Show returns of this item</Button>
                        </Grid>
                        <Grid item="item" className='p-1' lg={4} md={4} xs={4}>
                            <Button
                                style={{
                                    backgroundColor: '#1a73e8',
                                    color: 'white'
                                }}
                                fullWidth={true}>Show Short Exp available drug stores</Button>
                        </Grid>
                    </Grid> */}
                    </div>
                </Dialog>
                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="sm"
                    open={this.state.addItemDialog}
                    onClose={() => { this.setState({ addItemDialog: false }) }}
                >
                    <MuiDialogTitle disableTypography="disableTypography">
                        <CardTitle title="Select Drug" />
                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm onSubmit={() => this.addSingleItem()} onError={() => null} className="w-full">
                            <Grid className=" w-full" container spacing={2}>
                                <Grid className=" w-full" item
                                    lg={5}
                                    md={3}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Choose a Drug" />
                                    <Autocomplete
                                        disableClearable
                                        className="w-full"
                                        options={this.state.all_drugs}
                                        onChange={(e, value) => {
                                            if (value != null) {
                                                let itemAddDialog = this.state.itemAddDialog
                                                itemAddDialog.item_id = value.item_id
                                                // this.state.all_ven.find((v) => v.id == this.state.formData.ven_id)
                                                // this.state.data.find(element => element.item_id == value.item_id
                                                console.log('itemid', value.item_id)
                                                console.log('arrayid', this.state.data[0].item_id)
                                                let sameitem = this.state.data.filter((ele) => value.item_id === ele.item_id)
                                                if (sameitem.length > 0) {
                                                    console.log("issue qua", this.state.data[0].to_be_issue_quantity)
                                                    console.log("req qua", this.state.data[0].request_quantity)
                                                    // let dummy = 92
                                                    if (sameitem[0].to_be_issue_quantity === sameitem[0].request_quantity || sameitem[0].to_be_issue_quantity < sameitem[0].request_quantity) {
                                                        console.log("Not sasme ")
                                                        this.setState({ itemAddDialog, itemQuantity: value.quantity }
                                                        )
                                                    }
                                                    else {
                                                        this.setState({
                                                            alert: true,
                                                            severity: 'error',
                                                            message: 'Please Fill the Full Order Quantity First',
                                                        })
                                                        console.log('not include')
                                                    }

                                                    // this.setState( {itemAddDialog,itemQuantity : value.quantity}
                                                    //     )
                                                    console.log("includes")
                                                }
                                                else {
                                                    this.setState({ itemAddDialog, itemQuantity: value.quantity }
                                                    )
                                                    return console.log("nop")
                                                }


                                            }
                                        }}

                                        getOptionLabel={(option) => option.ItemSnap.sr_no + '-' + option.ItemSnap.short_description}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Choose Drug"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                value={this.state.itemAddDialog.item_id}
                                                onChange={(e) => {
                                                    console.log("as", e.target.value)
                                                    if (e.target.value.length > 3) {
                                                        this.loadItems(e.target.value)
                                                    }

                                                }}

                                                validators={[
                                                    'required'
                                                ]}
                                                errorMessages={[
                                                    'Required'
                                                ]}
                                            />
                                        )} />
                                </Grid>
                                {this.state.itemAddDialog.item_id != null &&
                                    <Grid className=" w-full " item
                                        lg={5}
                                        md={3}
                                        sm={12}
                                        xs={12}
                                    >
                                        <SubTitle title="Quantity" />

                                        <TextValidator
                                            className='w-full'
                                            placeholder="Enter Quantity"
                                            fullWidth
                                            disabled={this.state.itemAddDialog.item_id == null ? true : false}
                                            type="number"
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state.itemAddDialog.request_quantity
                                            }
                                            onChange={(e, value) => {
                                                let itemAddDialog = this.state.itemAddDialog;
                                                itemAddDialog.request_quantity = e.target.value
                                                this.setState({ itemAddDialog })

                                            }}
                                            validators={[
                                                'required', 'maxNumber:' + this.state.itemQuantity
                                            ]}
                                            errorMessages={[
                                                'Required', 'Cannot Order over the Order Quantity'
                                            ]}
                                        />
                                    </Grid>
                                }
                                <Grid className=" w-full" item lg={1} md={1} sm={1} xs={1}>
                                    <Button
                                        variant="contained"
                                        className="mt-7"
                                        color="primary"
                                        progress={false}
                                        type="submit"
                                        scrollToTop={true}
                                        onClick={() => {
                                            this.setState({
                                                // addItemDialog:true
                                            })
                                        }}
                                    >
                                        <span className="capitalize">Add</span>
                                    </Button>
                                </Grid>
                            </Grid>
                        </ValidatorForm>
                    </div>
                </Dialog>


                <Dialog
                    fullWidth="fullWidth"
                    maxWidth="md"
                    open={this.state.editItemDialogView}
                // onClose={() => { this.setState({ editItemDialogView: false }) }}
                >
                    <Grid
                        container="container"
                        style={{
                            alignItems: 'flex-end'
                        }}>
                        <Grid item="item" lg={11} md={9} xs={9}>
                            <Grid container="container" lg={12} md={12} xs={12} className='ml-4'>
                                <CardTitle title="Edit" />
                            </Grid>
                        </Grid>
                        <Grid item="item" lg={1} md={1} xs={1}><IconButton aria-label="close" onClick={() => { this.setState({ editItemDialogView: false }) }}><CloseIcon /></IconButton></Grid>

                    </Grid>
                    <div>
                        {this.state.editItemLoaded ?
                            <LoonsTable
                                options={{
                                    pagination: false,
                                    serverSide: true,
                                    // count: this.state.totalItems,
                                    //rowsPerPage: this.state.filterData.limit,
                                    //page: this.state.filterData.page,
                                    print: false,
                                    viewColumns: false,
                                    download: false,

                                }}
                                data={this.state.edit_item}
                                columns={this.state.edit_item_columns}
                            />
                            : null}
                    </div>

                    <div className='px-5 py-5'>


                        <Button
                            variant="contained"
                            className="mt-2 w-100"
                            color="primary"
                            progress={false}

                            scrollToTop={true}
                            onClick={() => {
                                this.resetAllocation()
                            }}
                        >
                            <span className="capitalize">Reset</span>
                        </Button>
                    </div>
                </Dialog>


                <Popper
                    open={this.state.popoveropen}
                    style={{ position: 'fixed', bottom: 70, right: 'unset', top: 'unset', left: 'unset', zIndex: 101 }}
                    //anchorEl={this.state.anchorEl}
                    anchorEl={null}
                    onClose={this.handleCloseSnackbar}
                    placement="bottom"
                    disablePortal={true}
                    modifiers={{
                        flip: {
                            enabled: false,
                        },
                        preventOverflow: {
                            enabled: true,
                            boundariesElement: "window",
                        },
                    }}
                >
                    <Paper style={{ padding: "16px", backgroundColor: '#84f229' }}>
                        {this.state.warning_alert_for_lastAllocate &&
                            <Grid className='w-full px-2 py-2' style={{ backgroundColor: 'red' }}>
                                <Typography className="font-semibold" variant="h6" style={{ fontSize: 16, color: "white" }}>{this.state.allocationMessage}</Typography>

                            </Grid>
                        }
                        {this.state.expandedData?.ItemSnap?.converted_order_uom === 'EUV2' ?
                        <Grid container spacing={4}>

                            <Grid item="item" >
                                <SubTitle title="MSD Details"></SubTitle>
                                <Divider></Divider>
                                
                                MSD Available Stock: {this.state.expandedData ? convertTocommaSeparated(this.ParentReservedQty(this.state.expandedData), 0) + ' ( ' + convertTocommaSeparated(this.ParentReservedQty(this.state.expandedData) * this.state.expandedData?.ItemSnap?.item_unit_size, 0) + ' ' + this.state.expandedData?.ItemSnap?.DisplayUnit?.name + ' )' : ""}
                                <br />
                                Allocated Stock: {this.state.expandedData ? convertTocommaSeparated(this.myReservedQty(this.state.expandedData), 0) + ' ( ' + convertTocommaSeparated(this.myReservedQty(this.state.expandedData) * this.state.expandedData?.ItemSnap?.item_unit_size, 0) + ' ' + this.state.expandedData?.ItemSnap?.DisplayUnit?.name + ' )' : ""}
                                <br />
                                MSD Stock (Month): {this.state.expandedData ? convertTocommaSeparated(this.calculateMyStockMonth(this.state.expandedData), 2) + ' ( ' + convertTocommaSeparated(this.calculateMyStockMonth(this.state.expandedData) * this.state.expandedData?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.expandedData?.ItemSnap?.DisplayUnit?.name + ' )' : ""}
                                <br />
                                {/* MSD Consumption: {this.state.expandedData ? convertTocommaSeparated(isNaN(this.msdConsumption(this.state.expandedData) ? 0 : this.msdConsumption(this.state.expandedData)), 2) + ' ( ' + convertTocommaSeparated(this.msdConsumption(this.state.expandedData) * this.state.expandedData?.ItemSnap?.item_unit_size, 0) + ' ' + this.state.expandedData?.ItemSnap?.DisplayUnit?.name + ' )' : ""} */}
                                MSD Consumption: {this.state.expandedData ? convertTocommaSeparated(isNaN(this.msdConsumption(this.state.expandedData) ? 0 : this.msdConsumption(this.state.expandedData)), 2) : ""}
                                <br />

                            </Grid>


                            <Grid item="item"  >
                                <SubTitle title="Institute Details"></SubTitle>
                                <Divider></Divider>
                                Institution Stock: {this.state.expandedData ? convertTocommaSeparated(this.instituteQty(this.state.expandedData), 2) + ' ( ' + convertTocommaSeparated(this.instituteQty(this.state.expandedData) * this.state.expandedData?.ItemSnap?.item_unit_size, 0) + ' ' + this.state.expandedData?.ItemSnap?.DisplayUnit?.name + ' )' : ""}
                                <br />
                                Institution Stock Monthly: {this.state.expandedData ? convertTocommaSeparated(this.instituteStokeMonthly(this.state.expandedData), 2) + ' ( ' + convertTocommaSeparated(this.instituteStokeMonthly(this.state.expandedData) * this.state.expandedData?.ItemSnap?.item_unit_size, 0) + ' ' + this.state.expandedData?.ItemSnap?.DisplayUnit?.name + ' )' : ""}
                                <br />
                                Institute Consumption: {this.state.expandedData ? convertTocommaSeparated(this.instituteConsumption(this.state.expandedData), 2) : ""}
                                <br />
                            </Grid>


                            <Grid item="item"  >

                            <SubTitle title="Forecast Details"></SubTitle>
                                <Divider></Divider>
                                Yearly: {this.state.expandedData ? (isNaN(this.state.selected_item_estimation) ? "Loading" : convertTocommaSeparated(this.state.selected_item_estimation, 2)) : ""}
                                <br />
                                Monthly: {this.state.expandedData ? (isNaN(this.state.selectedItemMonthlyEstimation) ? "Loading" : convertTocommaSeparated(this.state.selectedItemMonthlyEstimation, 2)) : ""}
                                <br />
                                Remaining Estimation (Yearly): {this.state.expandedData ? (isNaN(this.state.selected_item_remaining_estimation) ? "Loading" : convertTocommaSeparated(this.state.selected_item_remaining_estimation, 2)) : ""}
                                <br />
                                <ProgressBar value={this.state.expandedData ? this.state.remaining_result : 0}></ProgressBar>

                            </Grid>


                        </Grid>
                        :
                        <Grid container spacing={4}>

                            <Grid item="item" >
                                <SubTitle title="MSD Details"></SubTitle>
                                <Divider></Divider>
                                
                                MSD Available Stock: {this.state.expandedData ? convertTocommaSeparated(this.ParentReservedQty(this.state.expandedData), 0) : ""}
                                <br />
                                Allocated Stock: {this.state.expandedData ? convertTocommaSeparated(this.myReservedQty(this.state.expandedData), 0) : ""}
                                <br />
                                MSD Stock (Month): {this.state.expandedData ? convertTocommaSeparated(this.calculateMyStockMonth(this.state.expandedData), 2) : ""}
                                <br />
                                MSD Consumption: {this.state.expandedData ? convertTocommaSeparated(isNaN(this.msdConsumption(this.state.expandedData) ? 0 : this.msdConsumption(this.state.expandedData)), 2) : ""}
                                <br />

                            </Grid>


                            <Grid item="item"  >
                                <SubTitle title="Institute Details"></SubTitle>
                                <Divider></Divider>
                                Institution Stock: {this.state.expandedData ? convertTocommaSeparated(this.instituteQty(this.state.expandedData), 2) : ""}
                                <br />
                                Institution Stock Monthly: {this.state.expandedData ? convertTocommaSeparated(this.instituteStokeMonthly(this.state.expandedData), 2) : ""}
                                <br />
                                Institute Consumption: {this.state.expandedData ? convertTocommaSeparated(this.instituteConsumption(this.state.expandedData), 2) : ""}
                                <br />
                            </Grid>


                            <Grid item="item"  >

                                <SubTitle title="Forecast Details"></SubTitle>
                                <Divider></Divider>
                                Yearly: {this.state.expandedData ? (isNaN(this.state.selected_item_estimation) ? "Loading" : convertTocommaSeparated(this.state.selected_item_estimation, 2)) : ""}
                                <br />
                                Monthly: {this.state.expandedData ? (isNaN(this.state.selectedItemMonthlyEstimation) ? "Loading" : convertTocommaSeparated(this.state.selectedItemMonthlyEstimation, 2)) : ""}
                                <br />
                                Remaining Estimation (Yearly): {this.state.expandedData ? (isNaN(this.state.selected_item_remaining_estimation) ? "Loading" : convertTocommaSeparated(this.state.selected_item_remaining_estimation, 2)) : ""}
                                <br />
                                <ProgressBar value={this.state.expandedData ? this.state.remaining_result : 0}></ProgressBar>

                            </Grid>


                        </Grid>
                        }


                    </Paper>
                </Popper>

                <LoonsDialogBox
                    title="Are You Sure"
                    show_alert={true}
                    alert_severity="info"
                    alert_message={"This is not an estimated item. Do you still want to allocate?"}
                    //message="testing 2"
                    open={this.state.warning_alert_without_estimation}
                    show_button={true}
                    show_second_button={true}
                    btn_label="Yes"
                    onClose={() => {

                        this.checkAllocatingQty(this.state.selectedRowMetaData)

                    }}
                    second_btn_label="No"
                    secondButtonAction={() => {
                        this.setState({ warning_alert_without_estimation: false })
                    }}
                >

                </LoonsDialogBox>




                <LoonsDialogBox
                    title="Are You Sure"
                    show_alert={true}
                    alert_severity="info"
                    alert_message={this.state.pendingAllocateErrorMessage}
                    //message="testing 2"
                    open={this.state.pendingAllocateError}
                    show_button={true}
                    show_second_button={true}
                    btn_label="Yes"
                    onClose={() => {
                        if (!this.state.issuing) {
                            this.setState({
                                pendingAllocateError: false,

                            }, () => { this.issueOrder() })
                        }
                    }}
                    second_btn_label="No"
                    secondButtonAction={() => {
                        this.setState({
                            pendingAllocateError: false,
                        })
                    }}
                >

                </LoonsDialogBox >

                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={1200}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"></LoonsSnackbar>
            </>
        )
    }
}

export default AllItemsDistribution