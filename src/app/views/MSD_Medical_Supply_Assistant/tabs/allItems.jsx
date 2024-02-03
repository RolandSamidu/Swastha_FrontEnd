import {
    CircularProgress,
    Dialog,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography,
    // RemoveIcon
} from '@material-ui/core'
import RemoveIcon from '@material-ui/icons/Remove';
import { withStyles } from '@material-ui/styles';
import {
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    SubTitle,
    Button,
    ProgressBar
} from 'app/components/LoonsLabComponents'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import 'date-fns'
import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import FilterComponent from './filterComponent'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete } from '@material-ui/lab'
import RemarkServices from 'app/services/RemarkServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import PharmacyService from 'app/services/PharmacyService';
import InventoryService from 'app/services/InventoryService'
import localStorageService from 'app/services/localStorageService'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import { dateTimeParse, dateParse } from 'utils'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import CloseIcon from '@material-ui/icons/Close'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SaveIcon from '@material-ui/icons/Save';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import moment from 'moment';
import PrintIssueNote from '../PrintIssueNote';
import RMSD_Print from '../MSMIS_Print/RMSD_Print';
import MSD_Print from '../MSMIS_Print/MSD_Print';
import CashOrderMSD_Print from '../MSMIS_Print/CashOrderMSD_Print';
import EstimationService from 'app/services/EstimationService';
import EmployeeServices from 'app/services/EmployeeServices';
import MDS_AddVehicleNew from "../MDS_AddVehicleNew";
import MDSService from 'app/services/MDSService'
import VisibilityIcon from '@material-ui/icons/Visibility'
import FeedIcon from '@mui/icons-material/Feed';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ListIcon from '@material-ui/icons/List';


import { roundDecimal } from 'utils';
import ChiefPharmacistServices from 'app/services/ChiefPharmacistServices';

const styleSheet = (theme) => ({

    statusOfOrder: null,
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
    btnContainer: {
        display: 'flex',
        justifyContent: 'end',
        marginTop: 10,
        marginBottom: 10
    },
    roundButton: {
        borderRadius: 20,
        padding: '5px 10px',
        background: '#06b6d4',
        color: 'white',
        margin: '1px',
        minWidth: '10em'
    },
    roundButtonOutline: {
        borderRadius: 20,
        padding: '5px 10px',
        background: 'white',
        border: '1px solid #06b6d4',
        color: '#06b6d4',
        margin: '1px',
        minWidth: '10em'
    }
}
);

class AllItemsDistribution extends Component {
    constructor(props) {
        super(props)
        this.state = {

            epidContain : false,
            //
            orderReversing: false,
            selectWarehouseView: false,
            selectWarehouseViewName: null,
            loadingSuggestedWarehoues: false,
            suggestedWareHouses: {
                item_id: null,
                warehouse_id: null,
                limit: 20,
                page: 0
            },
            // batchAllocationItemvalues: [0, 0, 0],

            vehicleDialogView: false,
            allocating: false,
            issue_processing: false,
            selected_order_item_id: null,
            logined_user_roles: [],
            printIssueNoteView: true,
            totalUpdate: true,
            submitting_form: false,
            batchAllocationItemvalues: [],
            batchAllocationItemUpdated: [],
            batchAllocationPreValue: [],
            batchAllocationItemVolumes: [],
            totalAllocated: 0,
            unable_to_fill: 'hidden',
            remarks_other: 'hidden',
            order_exchange_status: null,
            selected_item: null,
            data: [],
            batch_details_data: [],
            remainingAllocation: 0,
            batchDataLoaded: false,
            itemsnap: [],
            allocatedqty: false,
            addItemDialog: false,
            allEmpData: [],
            employeeFilterData: {
                type: null,
            },
            vehicle_filterData: {
                page: 0,
                limit: 10,
                //order_delivery_id: null,
                order_delivery_id: null,
                order_exchange_id: this.props.id.match.params.id,
                "order[0][0]": 'updatedAt',
                "order[0][1]": 'Desc'
            },
            order: [],

            estimationData: [],
            editItemLoaded: false,
            editItemDialogView: false,
            edit_item: [],
            selected_estimation_id: null,
            selected_item_estimation: "Not Estimated",
            selected_item_remaining_estimation: "Not Estimated",
            remaining_result: 0,
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
                            console.log('cheking edit item table det', this.state.edit_item[tableMeta.rowIndex])
                            if (this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain){
                                return roundDecimal(Math.floor(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity) * this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return Math.floor(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity)
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

                            if (this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain){
                                if (quantity === '' || quantity === null || isNaN(quantity)) {

                                    return <p>{roundDecimal(parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity) * this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name}</p>
                                }
                                else {
                                    return (
                                        <p>{roundDecimal(quantity  * this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name}</p>
                                        //    quantity[0]?.quantity
                                    )
                                }
                            } else {
                                if (quantity === '' || quantity === null || isNaN(quantity)) {

                                    return <p>{parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity)}</p>
                                }
                                else {
                                    return (
                                        <p>{quantity}</p>
                                        //    quantity[0]?.quantity
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
                                    {(this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain && this.state.edit_item[tableMeta.rowIndex]?.allocated_quantity > 0) &&
                                        <p className='pt-1 pb-1 pl-5 pr-5' style={{border:'1px solid #ffd600', backgroundColor:'#fff59d', borderRadius:'3px', textAlign:'center'}}>{roundDecimal(this.state.edit_item[tableMeta.rowIndex]?.allocated_quantity / this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.MeasuringUnit?.name}</p>
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

                                            console.log("checkquantity reservable_qty", reservable_qty)
                                            console.log("checkquantity reservable_qty enter", e.target.value)

                                            // if (Number(reservable_qty) + Number(this.state.edit_item[tableMeta.rowIndex].allocated_qty_temp) >= Number(e.target.value)) {
                                            let edit_item = this.state.edit_item;
                                            edit_item[tableMeta.rowIndex].allocated_quantity = e.target.value;
                                            this.setState({ edit_item })
                                            /* } else {
                                                let edit_item = this.state.edit_item;
                                                edit_item[tableMeta.rowIndex].allocated_quantity = 0;
                                                this.setState({ edit_item })
                                                this.setState(
                                                    { message: "Cannot allocate more than available quantity", alert: true, severity: "Error" }
                                                )
                                            } */
                                        




                                        }}


                                            InputProps={{
                                                endAdornment: (
                                                    this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain ? (
                                                        <InputAdornment position="end" className='mr-1'>
                                                            {this.state.edit_item[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name}
                                                        </InputAdornment>
                                                    ) : null // Render nothing when the condition is not met
                                                )
                                            }}


                                        validators={[`maxNumber:${Math.floor(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity)}`]}
                                        errorMessages={[
                                            'Cannot Over My Qty'
                                        ]}
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
                                        <Tooltip title="Save">
                                            <IconButton
                                                disabled={
                                                    this.state.user_type.includes('MSD MSA')
                                                        ? true
                                                        : false
                                                }
                                                onClick={() => {
                                                    let edit_item = this.state.edit_item;
                                                    let allocated_qty = edit_item[tableMeta.rowIndex].allocated_quantity
                                                    let my_stock_qty = Math.floor(this.state.edit_item[tableMeta.rowIndex]?.ItemSnapBatchBin?.quantity)

                                                    if (my_stock_qty >= allocated_qty) {

                                                        if (this.state.logined_user_roles.includes('RMSD OIC') ||
                                                            this.state.logined_user_roles.includes('RMSD MSA') ||
                                                            this.state.logined_user_roles.includes('RMSD Pharmacist') ||
                                                            this.state.logined_user_roles.includes('MSD Distribution Officer') ||
                                                            this.state.logined_user_roles.includes('MSD MSA')) {
                                                            if (Number(this.state.selected_item_remaining_estimation) < Number(this.state.edit_item[tableMeta.rowIndex]?.allocated_quantity)) {
                                                                this.setState(
                                                                    { message: "Cannot Allocate More than Remaining Estimation Quantity", alert: true, severity: "Error" }
                                                                )
                                                            } else {
                                                                this.editItemBatch(this.state.edit_item[tableMeta.rowIndex])
                                                            }
                                                        } else {
                                                            this.editItemBatch(this.state.edit_item[tableMeta.rowIndex])
                                                        }

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
                    name: 'action',
                    label: 'Item Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.data[dataIndex]?.ItemSnap?.id
                            return (
                                <Grid container={2}>
                                    <Grid item>
                                        {this.state.user_role == "Counter Pharmacist" ||this.state.user_role == "Dispenser" || this.state.user_role == 'Drug Store Keeper' || this.state.user_role == 'Medical Laboratory Technologist' || this.state.user_role == 'Radiographer' || this.state.user_role == 'Chief MLT' || this.state.user_role == 'Chief Radiographer' ||
                                            this.state.user_role == 'Admin Pharmacist' || this.state.user_role == 'RMSD MSA' ||
                                            this.state.user_role == 'RMSD OIC' || this.state.user_role == 'MSD MSA' || this.state.user_role == 'RMSD Pharmacist'
                                            ?
                                            <Tooltip title="Check Stock">
                                                <IconButton
                                                    onClick={() => {
                                                        let suggestedWareHouses = this.state.suggestedWareHouses
                                                        suggestedWareHouses.item_id = id
                                                        this.setState({ suggestedWareHouses, individualView: true }, () => {
                                                            this.suggestedWareHouse()
                                                        })
                                                    }}
                                                    className="px-2"
                                                    size="small"
                                                    aria-label="View Item Stocks"
                                                >
                                                    <WarehouseIcon />
                                                </IconButton>
                                            </Tooltip>

                                            : null}
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title="Stock Movement">
                                            <IconButton
                                                onClick={() => {
                                                    window.location = `/drugbalancing/checkStock/detailedview/${id}`

                                                    // /${this.state.data[tableMeta.rowIndex].item_batch_id}
                                                    // ?from=${this.state.filterData.from}
                                                    // &to=${this.state.filterData.to}
                                                    // &batch_id=${this.state.data[tableMeta.rowIndex].batch_id}
                                                }}
                                                className="px-2"
                                                size="small"
                                                aria-label="View Item Stocks"
                                            >
                                                <FeedIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>

                                        <Tooltip title="Item Description">
                                            <IconButton
                                                onClick={() => {
                                                    window.location.href = `/item-mst/view-item-mst/${id}`
                                                }}
                                                className="px-2"
                                                size="small"
                                                aria-label="View Item"
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>

                                    </Grid>
                                </Grid>
                            )
                        },
                    },
                },

                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnap?.sr_no
                        },
                    },
                },
                {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnap?.medium_description
                        },
                    },
                },
                /* {
                    name: 'ven',
                    label: 'Ven',
                    options: {
                        // filter: true,
                    },
                }, */
                // , {     name: 'parend_drugstore_qty',     label: 'Parend Drugstore Qty',
                // options: {          filter: true,     } }
                {
                    name: 'my_stock_days',
                    label: 'My Stock Days',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (value == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(value)
                            }
                        }
                    },
                },
                {
                    name: 'stored_quantity',
                    label: 'My Stock Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EU' && this.state.data[tableMeta.rowIndex]?.to_owner_id !== '000') {
                                if (value == null) {
                                    return 'N/A'
                                } else {
                                    return roundDecimal(Math.floor(value) * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                                }
                            } else {
                                return Math.floor(value)
                            }
                        }
                    },
                },
                /* {
                    name: 'my_stock_res_qty',
                    label: 'My Stock Reservable Qty',
                    options: {
                        // filter: true,
                    },
                }, */
                {
                    name: 'request_quantity',
                    label: 'Requested Qty',    // changed
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EU'  && this.state.data[tableMeta.rowIndex]?.to_owner_id !== '000') {
                                if (value == null) {
                                    return 'N/A'
                                } else {
                                    return roundDecimal(Math.floor(value) * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                                }
                            } else {
                                return Math.floor(value)
                            }
                        }
                    },
                },
                /* {
                    name: 'estimation_quantity',
                    label: 'Estimation Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let items = this.state.estimationData.filter(((ele) => ele.item_id == this.state.data[tableMeta.rowIndex].item_id))
                            if (items.length > 0) {
                                return items[0].estimation
                            } else {
                                return (
                                    <div>Not Estimated</div>
                                )
                            }
                        }
                    }
                }, */
                /* {
                    name: 'remaining estimation',
                    label: 'Remaining Estimation',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let items = this.state.estimationData.filter(((ele) => ele.item_id == this.state.data[tableMeta.rowIndex].item_id))
                            if (items.length > 0) {
                                return items[0].estimation - (Number(items[0].allocated_quantity ? items[0].allocated_quantity : 0) + Number(items[0].issued_quantity ? items[0].issued_quantity : 0))
                            } else {
                                return (
                                    <div>Not Estimated</div>
                                )
                            }
                        }
                    }
                }, */
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('jdfksdkkfks', this.state.data[tableMeta.rowIndex]?.to_owner_id)
                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EU'  && this.state.data[tableMeta.rowIndex]?.to_owner_id !== '000') {
                                if (value == null) {
                                    return 'N/A'
                                } else {
                                    return roundDecimal(Math.floor(value) * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                                }
                            } else {
                                return Math.floor(value)
                            }
                        }
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (this.state.data[tableMeta.rowIndex].status)
                        }
                    },
                },
                // , {     name: 'batch_details',     label: 'Batch Details',     options: {
                // filter: true,     } }
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {this.state.order_exchange_status == 'Pending' || this.state.order_exchange_status == 'ISSUE SUBMITTED' || this.state.order_exchange_status == 'APPROVED' || this.state.order_exchange_status == 'ALLOCATED' ?

                                        <div>
                                            {!this.state.user_type.includes('MSD MSA') ?
                                                <div>
                                                    <Button
                                                        style={
                                                            this.state.data[tableMeta.rowIndex].status == 'ALLOCATED' ||
                                                                this.state.data[tableMeta.rowIndex].status == 'DROPPED' ||
                                                                this.state.data[tableMeta.rowIndex].status == 'ALL ISSUED' ||
                                                                this.state.data[tableMeta.rowIndex].status == 'ISSUED' ||
                                                                this.state.data[tableMeta.rowIndex].status == 'COMPLETED' ||
                                                                this.state.data[tableMeta.rowIndex].status == 'ALL RECEIVED' ||
                                                                this.state.data[tableMeta.rowIndex].status == 'RECEIVED'
                                                                ? { backgroundColor: '#9b9b9b', color: 'white', }
                                                                : {
                                                                    backgroundColor: '#1a73e8', color: 'white',
                                                                }
                                                        }
                                                        onClick={() => {
                                                            let allocate = this.state.allocate;
                                                            allocate.quantity = 0;
                                                            allocate.item_batch_allocation_data = []

                                                            this.state.selected_item = tableMeta.rowIndex
                                                            // let items = this.state.estimationData.filter(((ele) => ele.item_id == this.state.data[tableMeta.rowIndex].item_id))
                                                            this.calculateEstimationQty(this.state.data[tableMeta.rowIndex])

                                                            // if (items.length > 0) {
                                                            this.setState({
                                                                allocate: allocate,
                                                                selected_item: tableMeta.rowIndex,
                                                                allocate_item: true,
                                                                //selected_estimation_id: items[0].id,
                                                                //selected_item_estimation: items[0].estimation,
                                                                remainingAllocation: roundDecimal(this.state.data[tableMeta.rowIndex].request_quantity, 0),
                                                                batchAllocationPreValue: [],
                                                                batchAllocationItemUpdated: [],
                                                                // selected_item_remaining_estimation: items[0].estimation - (Number(items[0].allocated_quantity ? items[0].allocated_quantity : 0) + Number(items[0].issued_quantity ? items[0].issued_quantity : 0))

                                                            }, () => {
                                                                this.state.batchAllocationItemvalues = []
                                                                this.state.batchAllocationItemVolumes = []
                                                                this.state.batchAllocationPreValue = []
                                                                this.state.batchAllocationItemUpdated = []
                                                                this.props.id.match.params.type == 'Return' ? this.getRetBatchData()
                                                                    : this.getBatchData(
                                                                        false
                                                                    )
                                                            })
                                                            /* } else {
                                                                this.setState({
                                                                    allocate: allocate,
                                                                    selected_item: tableMeta.rowIndex,
                                                                    allocate_item: true,
                                                                   // selected_estimation_id: null,
                                                                    //selected_item_estimation: "Not Estimated",
                                                                    //selected_item_remaining_estimation: "Not Estimated"

                                                                }, () => {
                                                                    this.state.batchAllocationItemvalues = []
                                                                    this.state.batchAllocationItemVolumes = []
                                                                    this.props.id.match.params.type == 'Return' ? this.getRetBatchData()
                                                                        : this.getBatchData(
                                                                            false
                                                                        )
                                                                })
                                                            } */

                                                        }}
                                                        disabled={this.state.data[tableMeta.rowIndex].status == 'ALLOCATED' ||
                                                            this.state.data[tableMeta.rowIndex].status == 'DROPPED' ||
                                                            this.state.data[tableMeta.rowIndex].status == 'COMPLETED' ||
                                                            this.state.data[tableMeta.rowIndex].status == 'ALL ISSUED' ||
                                                            this.state.data[tableMeta.rowIndex].status == 'ISSUED' ||
                                                            this.state.data[tableMeta.rowIndex].status == 'ALL RECEIVED' ||
                                                            this.state.data[tableMeta.rowIndex].status == 'RECEIVED'
                                                            ? true : false}

                                                    >
                                                        {this.state.data[
                                                            tableMeta.rowIndex
                                                        ].status == 'DROPPED' ? (
                                                            'Rejected'
                                                        ) : this.state.data[
                                                            tableMeta.rowIndex
                                                        ].status == 'ALLOCATED' ? (
                                                            'Allocated'
                                                        ) : (
                                                            <AddCircleIcon />
                                                        )}
                                                    </Button>

                                                    <Button
                                                        style={{
                                                            backgroundColor: '#1a73e8',
                                                            color: 'white',
                                                            marginLeft: '2px',
                                                            visibility:
                                                                this.state.data[
                                                                    tableMeta.rowIndex
                                                                ].status == 'ALLOCATED'
                                                                    ? 'show'
                                                                    : 'hidden',
                                                        }}
                                                        onClick={() => {
                                                            let selected_item_edit = this.state.data[tableMeta.rowIndex]
                                                            console.log(selected_item_edit)
                                                            this.loadBatchData(selected_item_edit.id, selected_item_edit.item_id)


                                                            let allocate = this.state.allocate;
                                                            allocate.quantity = 0;
                                                            allocate.item_batch_allocation_data = []

                                                            this.state.selected_item = tableMeta.rowIndex

                                                            this.calculateEstimationQty(this.state.data[tableMeta.rowIndex])
                                                            /* let items = this.state.estimationData.filter(((ele) => ele.item_id == this.state.data[tableMeta.rowIndex].item_id))
                                                            if (items.length > 0) {
                                                                this.setState({
                                                                    selected_estimation_id: items[0].id,
                                                                    selected_item_estimation: items[0].estimation,
                                                                    selected_item_remaining_estimation: items[0].estimation - (Number(items[0].allocated_quantity ? items[0].allocated_quantity : 0) + Number(items[0].issued_quantity ? items[0].issued_quantity : 0))
                                                                })
                                                            } else {
                                                                this.setState({

                                                                    selected_estimation_id: null,
                                                                    selected_item_estimation: "Not Estimated",
                                                                    selected_item_remaining_estimation: "Not Estimated"

                                                                })
                                                            } */





                                                        }}
                                                    >
                                                        {' '}
                                                        <EditIcon />
                                                    </Button>



                                                    {/* <Button
                                                style={{
                                                    backgroundColor: '#1a73e8',
                                                    color: 'white',
                                                    marginLeft: '2px',
                                                    visibility:
                                                        this.state.data[
                                                            tableMeta.rowIndex
                                                        ].status == 'ALLOCATED'
                                                            ? 'show'
                                                            : 'hidden',
                                                }}
                                                onClick={() => {
                                                    this.state.selected_item =
                                                        tableMeta.rowIndex

                                                    console.log(
                                                        this.state.selected_item
                                                    )
                                                    this.setState({
                                                        allocate_item: true,
                                                    })
                                                    this.state.batchAllocationItemvalues =
                                                        []
                                                    this.state.batchAllocationItemVolumes =
                                                        []
                                                    this.props.id.match.params
                                                        .type == 'Return'
                                                        ? this.getRetBatchData()
                                                        : this.getBatchData(
                                                            false
                                                        )
                                                }}
                                            >
                                                {' '}
                                                <EditIcon />
                                            </Button> */}
                                                </div>
                                                :
                                                null
                                                /*   <Button
                                                      style={{
                                                          backgroundColor: '#1a73e8',
                                                          color: 'white',
                                                          marginLeft: '2px',
                                                          visibility:
                                                              this.state.data[
                                                                  tableMeta.rowIndex
                                                              ].status == 'ISSUE SUBMITTED'
                                                                  ? 'show'
                                                                  : 'hidden',
                                                      }}
                                                      onClick={() => {
                                                          let selected_item_edit = this.state.data[tableMeta.rowIndex]
                                                          console.log(selected_item_edit)
                                                          this.loadBatchData(selected_item_edit.id, selected_item_edit.item_id)
                                                      }}
                                                  >
                                                      {' '}
                                                      <EditIcon />
                                                  </Button>  */

                                            }
                                        </div>
                                        : null
                                    }
                                </>
                            )
                        },
                    },
                },
            ],
            suggestedWareHouseColumn: [
                {
                    name: 'Action',
                    label: 'Action',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            return <IconButton onClick={() => {
                                this.setState({
                                    item_warehouse_id: this.state.rows2[dataIndex].warehouse_id,
                                    showItemBatch: true
                                })

                            }}>
                                <ListIcon />
                            </IconButton>
                        }
                    }
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: '	Drug Store',
                    label: 'Drug Store',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rows2[dataIndex].warehouse_name
                            return data
                        }
                    }
                },
                {
                    name: 'Type',
                    label: 'Type',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rows2[dataIndex].warehouse_main_or_personal
                            return data
                        }
                    }
                },
                {
                    name: 'Stock Qty',
                    label: 'Stock Qty',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.rows2[dataIndex].total_quantity
                            return data
                        }
                    }
                },



            ],

            batch_details: [
                // {     name: 'invoice',     label: 'Invoice No',     options: {} },
                {
                    name: 'warehousebin',
                    label: 'Warehouse Bin',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (
                                this.state.batch_details_data[
                                tableMeta.rowIndex
                                ]
                            ) {
                                return this.state.batch_details_data[
                                    tableMeta.rowIndex
                                ].WarehousesBin.bin_id
                            } else {
                                return 'N/A'
                            }
                        },
                    },
                },
                {
                    name: 'batch',
                    label: 'Batch No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (
                                this.state.batch_details_data[
                                tableMeta.rowIndex
                                ]
                            ) {
                                return this.state.batch_details_data[
                                    tableMeta.rowIndex
                                ].ItemSnapBatch.batch_no
                            } else {
                                return 'N/A'
                            }
                        },
                    },
                },
                {
                    name: 'exp',
                    label: 'Exp Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if (this.state.batch_details_data[dataIndex]) {
                                let data =
                                    this.state.batch_details_data[dataIndex]
                                        .ItemSnapBatch.exd
                                return <p>{dateParse(data)}</p>
                            } else {
                                return 'N/A'
                            }
                        },
                    },
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: 'minPack',
                    label: 'Min Pack Size',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batch_details_data[tableMeta.rowIndex]) {
                                return Math.floor(this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size)
                            } else {
                                return 'N/A'
                            }
                        },
                    },
                },
                {
                    name: 'quantity',
                    label: 'Stock Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {

                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain){
                                return roundDecimal(Math.floor(value) * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return roundDecimal(Math.floor(value))
                            }
                        }
                    },
                },
                {
                    name: 'quantity2',
                    label: 'Available Qty',
                    options: {

                        customBodyRender: (value, tableMeta, updateValue) => {
                            let reserved_quantity = parseFloat(this.state.itemsnap.filter((data) => data.bin_id == this.state.batch_details_data[tableMeta.rowIndex].bin_id)[tableMeta.rowIndex]?.reserved_quantity);
                            let quantity = (this.state.batch_details_data[tableMeta.rowIndex]?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))

                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain){
                                if (quantity === '' || quantity === null || isNaN(quantity)) {

                                    return <p>{parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name}</p>
                                }
                                else {
                                    return (
                                        <p>{roundDecimal(quantity * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.DisplayUnit?.name}</p>
                                        //    quantity[0]?.quantity
                                    )
                                }
                            } else {
                                if (quantity === '' || quantity === null || isNaN(quantity)) {

                                    return <p>{parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity)}</p>
                                }
                                else {
                                    return (
                                        <p>{quantity}</p>
                                        //    quantity[0]?.quantity
                                    )
                                }

                                // return <p>{parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity)}</p>
                            }
                            // else {
                            //     return (
                            //         <p>{quantity}</p>
                            //         //    quantity[0]?.quantity
                            //     )
                            // }


                        }
                    },
                },
                {
                    name: 'allocatedQty',
                    label: 'Allocated Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {


                            // if (this.state.batchAllocationItemvalues[tableMeta.rowIndex] == undefined) this.state.batchAllocationItemvalues.push(0)
                            //if (this.state.batchAllocationItemVolumes[tableMeta.rowIndex] == undefined) this.state.batchAllocationItemVolumes.push(0)
                            // let val = this.setAllocationQty(tableMeta)

                            // let orderQty = this.state.data[this.state.selected_item].request_quantity
                            // let orderQty = 20000
                            // console.log("allocatedVal",orderQty)

                            // let reserved_quantity = parseFloat(this.state.itemsnap.filter((data) => data.bin_id == this.state.batch_details_data[tableMeta.rowIndex].bin_id)[tableMeta.rowIndex]?.reserved_quantity);
                            // let quantity = (this.state.batch_details_data[tableMeta.rowIndex]?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))
                            // console.log("checkquantity",quantity)
                            // let sum = 0
                            // for(let i= 0; i<= tableMeta.rowIndex; i++){
                            //     sum = sum + parseInt(this.state.itemsnap[i]?.reserved_quantity)
                            //     // return sum
                            // }
                            // console.log("sum",sum)



                            // if(tableMeta.rowIndex != 0){
                            //     // if(orderQty < quantity){
                            //     //     this.state.batchAllocationItemvalues[tableMeta.rowIndex] = 1
                            //     //     this.setState({tempQty: 0})
                            //     // }else {
                            //     //     this.state.batchAllocationItemvalues[tableMeta.rowIndex] = quantity
                            //     //     orderQty = orderQty - quantity
                            //     // }
                            // }else{
                            //     let orderQty1 = this.state.data[this.state.selected_item].request_quantity
                            //     // this.setState({orderQty : this.state.data[this.state.selected_item].request_quantity})
                            //     // console.log("allocated val",orderQty1)

                            //     let reserved_quantity = parseInt(this.state.itemsnap.filter((data) => data.bin_id == this.state.batch_details_data[tableMeta.rowIndex].bin_id)[tableMeta.rowIndex]?.reserved_quantity);
                            //     let quantity = (this.state.batch_details_data[tableMeta.rowIndex]?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))
                            //     // this.setState({quantity : (this.state.batch_details_data[tableMeta.rowIndex]?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))})
                            //     console.log("checkquantity",quantity)

                            //     if(orderQty1 < quantity){
                            //         // (()=>{this.setState({orderQty: 0})})
                            //         this.state.batchAllocationItemvalues[tableMeta.rowIndex] = orderQty1
                            //     }else {
                            //         this.state.batchAllocationItemvalues[tableMeta.rowIndex] = quantity
                            //         // this.setState({orderQty : (this.state.orderQty - this.state.quantity)})
                            //     }
                            // }

                            // while(orderQty == 0){
                            // }
                            // console.log("allocated val2",value)
                            return (
                                <ValidatorForm onSubmit={() => { this.submitRow(tableMeta) }}>
                                    
                                    {(this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain && this.state.batchAllocationItemvalues[tableMeta.rowIndex] > 0) &&
                                        <p className='pt-1 pb-1 pl-5 pr-5' style={{border:'1px solid #ffd600', backgroundColor:'#fff59d', borderRadius:'3px', textAlign:'center'}}>{roundDecimal(this.state.batchAllocationItemvalues[tableMeta.rowIndex] / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.MeasuringUnit?.name}</p>
                                    }
                                    < TextValidator
                                        id={'Hello' + tableMeta.rowIndex}
                                        variant="outlined" size="small"
                                        className=" w-full"
                                        placeholder="Order Qty"
                                        type='number'
                                        value={
                                            this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                        }

                                        onClick={() => {
                                            let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
                                            let batchAllocationItemUpdated = this.state.batchAllocationItemUpdated;
                                            let batchAllocationPreValue = this.state.batchAllocationPreValue;
                                            // let quantity = parseFloat(this.state.batch_details_data[tableMeta.rowIndex].quantity)

                                            let reserved_quantity = parseFloat(this.state.itemsnap.filter((data) => data.bin_id == this.state.batch_details_data[tableMeta.rowIndex].bin_id)[tableMeta.rowIndex]?.reserved_quantity);
                                            console.log('cheking all datas',this.state.batch_details_data[tableMeta.rowIndex]?.quantity, reserved_quantity )
                                            let quantity = (Number(this.state.batch_details_data[tableMeta.rowIndex]?.quantity) - Number(isNaN(reserved_quantity) ? 0 : Number(reserved_quantity)))
                                            console.log("checkquantity",quantity)
                                            let reservable_qty = quantity
                                            if (quantity === '' || quantity === null || isNaN(quantity)) {

                                                reservable_qty = parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity)
                                            }

                                            
                                            let remainingAllocation =  this.state.remainingAllocation
                                            console.log('remainingAllocation', remainingAllocation)

                                            if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain) {
                                                reservable_qty = reservable_qty * Number(this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size)
                                                remainingAllocation = Number(remainingAllocation) * Number(this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size)
                                                this.setState({
                                                    remainingAllocation
                                                })
                                            } 

                                            console.log('reservable_qty', reservable_qty)

                                            if (!batchAllocationItemUpdated[tableMeta.rowIndex]) {

                                                if (reservable_qty <= remainingAllocation) {
                                                    batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(reservable_qty / this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size) * this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size;

                                                } else {
                                                    batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(remainingAllocation / this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size) * this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size;
                                                }
                                                
                                                batchAllocationPreValue[tableMeta.rowIndex] = batchAllocationItemvalues[tableMeta.rowIndex]
                                            } else {
                                                let batchQuantity = remainingAllocation + batchAllocationPreValue[tableMeta.rowIndex];

                                                if (remainingAllocation > 0) {
                                                    if (reservable_qty <= batchQuantity) {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(reservable_qty / this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size) * this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size;

                                                    } else {
                                                        batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(batchQuantity / this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size) * this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size;
                                                    }
                                                }
                                                
                                            }

                                            console.log('batchAllocationItemvalues', batchAllocationItemvalues)

                                            this.setState({
                                                batchAllocationItemvalues,
                                            })

                                        }}
                                        /*   validators={['required', {}]}
                                        errorMessages={[
                                            'this field is required', 'Invalid BP'
                                        ]} */
                                        onBlur={(e) => {
                                            console.log("Remaining: ", this.state.remainingAllocation)

                                            let qty = this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                            let min_pacSize = Math.floor(this.state.batch_details_data[tableMeta.rowIndex].ItemSnapBatch.pack_size)
                                            // if ((Number(qty) % Number(min_pacSize)) == 0) {
                                            this.submitRow(tableMeta)
                                            /* } else {

                                                this.setState(
                                                    { message: "Mismatched Minimum Pack Size", alert: true, severity: "Error" }
                                                )

                                                let batchAllocationItemvalues = this.state.batchAllocationItemvalues
                                                let batchAllocationItemVolumes = this.state.batchAllocationItemVolumes
                                                batchAllocationItemvalues[tableMeta.rowIndex] = 0
                                                batchAllocationItemVolumes[tableMeta.rowIndex] = 0

                                                this.setState({
                                                    batchAllocationItemvalues: batchAllocationItemvalues,
                                                    batchAllocationItemVolumes: batchAllocationItemVolumes
                                                })
                                            } */

                                            // if(e.target.value == '' ){
                                            //     console.log('error occur')
                                            // }
                                        }}
                                        onChange={
                                            (e) => {
                                                let reserved_quantity = parseFloat(this.state.itemsnap.filter((data) => data.bin_id == this.state.batch_details_data[tableMeta.rowIndex].bin_id)[tableMeta.rowIndex]?.reserved_quantity);

                                                let quantity = (this.state.batch_details_data[tableMeta.rowIndex]?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))
                                                // console.log("checkquantity",quantity)
                                                let reservable_qty = quantity
                                                if (quantity === '' || quantity === null || isNaN(quantity)) {

                                                    reservable_qty = parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity)
                                                }

                                                if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain) {
                                                    reservable_qty = reservable_qty * this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size
                                                }


                                                if (Number(reservable_qty) < parseInt(e.target.value)) {
                                                    this.setState(
                                                        { message: "Cannot allocate more than available quantity", alert: true, severity: "Error" }
                                                    )
                                                    //document.getElementById('Hello' + tableMeta.rowIndex).value = 0
                                                    let batchAllocationItemvalues = this.state.batchAllocationItemvalues
                                                    let batchAllocationItemVolumes = this.state.batchAllocationItemVolumes
                                                    batchAllocationItemvalues[tableMeta.rowIndex] = 0
                                                    batchAllocationItemVolumes[tableMeta.rowIndex] = 0

                                                    this.setState({
                                                        batchAllocationItemvalues: batchAllocationItemvalues,
                                                        batchAllocationItemVolumes: batchAllocationItemVolumes
                                                    },
                                                        // console.log("log vals",this.state.batchAllocationItemvalues, this.state.batchAllocationItemVolumes)
                                                    )

                                                } else {
                                                    let batchAllocationItemvalues = this.state.batchAllocationItemvalues
                                                    let batchAllocationItemVolumes = this.state.batchAllocationItemVolumes

                                                    batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(e.target.value)
                                                    batchAllocationItemVolumes[tableMeta.rowIndex] = (parseInt(e.target.value) / parseInt(this.state.batch_details_data[tableMeta.rowIndex].quantity)) * parseInt(this.state.batch_details_data[tableMeta.rowIndex].volume)
                                                    this.setState({
                                                        batchAllocationItemvalues: batchAllocationItemvalues,
                                                        batchAllocationItemVolumes: batchAllocationItemVolumes
                                                    })

                                                }
                                            }
                                        }
                                    >
                                    </TextValidator>
                                </ValidatorForm>
                            )
                        }
                    },
                },

                {
                    name: 'updateButton',
                    label: 'Actions',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                    {/*  {(this.state.batchAllocationItemvalues[tableMeta.rowIndex] % this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch.pack_size === 0) ?
                                       */}  <div >
                                        {/* <LoonsButton onClick={() => {
                                            this.submitRow(tableMeta)
                                        }}>
                                            <Tooltip title="Add to list">
                                                <AddCircleIcon />
                                            </Tooltip>


                                        </LoonsButton> */}

                                        <LoonsButton style={{ backgroundColor: 'red', marginLeft: '4px' }} onClick={() => {
                                            this.setState({ totalUpdate: false })
                                            this.state.allocate.item_batch_allocation_data.find((item, index) => {
                                                if (item && item.item_batch_bin_id == this.state.batch_details_data[tableMeta.rowIndex].id) {
                                                    this.state.allocate.item_batch_allocation_data.splice(index, 1)

                                                    this.state.allocate.quantity -= this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                                    this.state.allocate.volume -= this.state.batchAllocationItemVolumes[tableMeta.rowIndex]
                                                    this.state.batchAllocationItemvalues[tableMeta.rowIndex] = 0
                                                    this.state.batchAllocationItemVolumes[tableMeta.rowIndex] = 0
                                                    this.setState(
                                                        { message: "Delete succesfull", alert: true, severity: "Success" }
                                                    )
                                                }
                                            })
                                            this.setState({ totalUpdate: true })
                                            document.getElementById('Hello' + tableMeta.rowIndex).value = 0
                                            console.log(this.state.allocate);
                                        }}><Tooltip title="Delete"><DeleteIcon /></Tooltip></LoonsButton>
                                    </div>
                                    {/*  : null}    */}
                                </>
                            )
                        },
                    },
                },
            ],
            allocate_dialog_table: [
                // {     name: 'parend_drugstore_qty',     label: 'Parent Drug Store Qty',
                // optionss: {} },
                {
                    name: 'item_usage_type',
                    label: 'Item Usage Type',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[this.state.selected_item]?.ItemSnap?.item_usage_type_id
                            )

                        }
                    },
                },
                {
                    name: 'item_type',
                    label: 'Item Type',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                this.state.data[this.state.selected_item]?.ItemSnap?.item_type_id
                            )

                        }
                    },
                },
                {
                    name: 'my_stock_days',
                    label: 'My Stock Days',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (value == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(value)
                            }
                        }
                    },
                },
                {
                    name: 'stored_quantity',
                    label: 'My Stock Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('cheking data in table', this.state.data[this.state.selected_item])

                            if (this.state.data[this.state?.selected_item]?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain) {
                                if (value == null) {
                                    return 'N/A'
                                } else {
                                    return roundDecimal(Math.floor(value) * this.state.data[this.state?.selected_item]?.ItemSnap?.item_unit_size , 2) + ' '  + this.state.data[this.state?.selected_item]?.ItemSnap?.DisplayUnit?.name
                                }
                            } else {
                                return Math.floor(value)
                            }
                        }
                    },
                },
                // {
                //     name: 'uom',
                //     label: 'UOM',
                //     options: {}
                // },
                {
                    name: 'consumption',
                    label: 'Consumption',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (value == null) {
                                return 'N/A'
                            } else {
                                return Math.floor(value)
                            }
                        }
                    },
                },
                /*  {
                     name: 'my_stock_res_qty',
                     label: 'My Stock Reservable Qty',
                     options: {
 
                         
                     },
                 }, */
                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[this.state?.selected_item]?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain) {
                                if (value == null) {
                                    return 'N/A'
                                } else {
                                    return roundDecimal(Math.floor(value) * this.state.data[this.state?.selected_item]?.ItemSnap?.item_unit_size, 2) + ' '  + this.state.data[this.state?.selected_item]?.ItemSnap?.DisplayUnit?.name
                                }
                            } else {
                                return Math.floor(value)
                            }
                        }

                    },
                },
                {
                    name: 'Estimation Qty',
                    label: 'Estimation Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.selected_item_estimation
                            // if (this.state.data[this.state?.selected_item]?.ItemSnap?.converted_order_uom === 'EU') {
                            //     return roundDecimal(this.state.selected_item_estimation * this.state.data[this.state?.selected_item]?.ItemSnap?.item_unit_size, 2) + ' '  + this.state.data[this.state?.selected_item]?.ItemSnap?.DisplayUnit?.name
                            // } else {
                            //     return this.state.selected_item_estimation
                            // }

                        }

                    }
                },
                {
                    name: 'Estimation Qty',
                    label: 'Remaining Estimation',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => (
                            this.state.selected_item_remaining_estimation
                        )

                    }
                }, {
                    name: 'Estimation Qty',
                    label: 'Remaining Estimation',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => (
                            <ProgressBar value={this.state.remaining_result}></ProgressBar>
                        )

                    }
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[this.state?.selected_item]?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain) {
                                return this.state.totalUpdate ? roundDecimal((parseInt(this.state.data[this.state.selected_item].allocated_quantity)+ parseInt(this.state.allocate.quantity)), 2) + ' ' + this.state.data[this.state?.selected_item]?.ItemSnap?.DisplayUnit?.name : null
                            } else {
                                return this.state.totalUpdate ? (parseInt(this.state.data[this.state.selected_item].allocated_quantity)+ parseInt(this.state.allocate.quantity)) : null
                            }
                        }
                    }
                            
                },
            ],
            remarks: [],
            all_status: [
                {
                    id: 1,
                    name: 'ALLOCATED',
                },
                {
                    id: 2,
                    name: 'APPROVED',
                },
                {
                    id: 3,
                    name: 'COMPLETED',
                },
                {
                    id: 4,
                    name: 'ISSUED',
                },
                {
                    id: 5,
                    name: 'ORDERED',
                },
                {
                    id: 6,
                    name: 'RECIEVED',
                },
                {
                    id: 7,
                    name: 'REJECTED',
                },
            ],
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
            vehicle_data: [],
            loaded: false,
            total: 0,
            filterData: {
                ven_id: null,
                group_id: null,
                category_id: null,
                class_id: null,
                order_exchange_id: null,
                search: null,
                limit: 20,
                page: 0,
                orderby_sr: true
            },
            allocate: {
                order_item_id: null,
                activity: 'ITEM RECEIVED',
                date: null,
                status: 'ITEM RECEIVED',
                remark_id: null,
                remark_by: null,
                type: 'ITEM RECEIVED',
                volume: 0,
                quantity: 0,
                item_batch_allocation_data: [],
                warehouse_id: null,
            },
            alert: false,
            message: null,
            severity: 'success',
            issue: {
                order_exchange_id: this.props.id.match.params.id,
                activity: 'ISSUED',
                date: dateTimeParse(new Date()),
                status: 'ISSUED',
                remark_id: null,
                remark_by: null,
                type: 'ISSUED',
                quantity: 0,
                time_from: null,
                time_to: null,
                warehouse_id: null,
            },
            retbatchdata: [],
            totalItems: null,
            user_type: null,

            all_drugs: [],

            itemAddDialog: {
                order_exchange_id: this.props.id.match.params.id,
                item_id: null,
                request_quantity: null,
                reason: null,
                special_normal_type: "Added By MSD"
            },
            itemQuantity: null,
            selectedID: null,

            orderQty: 0,
            quantity: 0,
            canAllReject: false,

            page_no: null,
            book_no: null,
            issuringOffiser: null,
            orderingOfficer: null,
            order_id: null,
            order_date_time: null,
            PharmacyCode: null
        }


    }



    // setAllocationQty = (tableMeta) => {
    //     let orderQty = 20000
    //     // let orderQty = this.state.data[this.state.selected_item].request_quantity
    //     console.log("allocated val",orderQty)

    //     let reserved_quantity = parseFloat(this.state.itemsnap.filter((data) => data.bin_id == this.state.batch_details_data[tableMeta.rowIndex].bin_id)[tableMeta.rowIndex]?.reserved_quantity);
    //     let quantity = (this.state.batch_details_data[tableMeta.rowIndex]?.quantity - (isNaN(reserved_quantity) ? 0 : reserved_quantity))
    //     console.log("checkquantity",quantity)

    //     if (orderQty > quantity){

    //     }
    // }
    async suggestedWareHouse() {
        this.setState({ loadingSuggestedWarehoues: false })
        let res = await PharmacyOrderService.getSuggestedWareHouse(
            this.state.suggestedWareHouses
        )
        if (res.status) {
            console.log('suggested', res.data)
            this.setState({
                rows2: res.data.view.data,
                suggestedtotalItems: res.data.view.totalItems,
                loadingSuggestedWarehoues: true
            }, () => {
                this.render()
            })
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

    async preLoadData() {
        this.setState({
            loaded: false
        })
        // if(this.state.order.Delivery == null){
        //     this.setState({ 
        //         message: "Please Request to Add Pickup person",
        //         alert: true,
        //         severity: "Error" 
        //     })
        // }
        let vehicle_filterData = this.state.vehicle_filterData
        vehicle_filterData.order_delivery_id = this.state.order.Delivery?.id
        console.log("order2", vehicle_filterData)
        let res = await MDSService.getAllOrderVehicles(vehicle_filterData)
        if (res.status && res.status == 200) {
            this.setState({
                vehicle_filterData,
                order: res.data.view.data,
                vehicle_totalItems: res.data.view.totalItems,
                loaded: true
            }, () => console.log('resdata', this.state.order))
        }
    }
    async LoadOrderDetails() {


        let res = await PharmacyOrderService.getOrdersByID(this.props.id.match.params.id)
        if (res.status) {
            console.log("OrderData", res.data.view)
            // console.log("oderNo", res.data.view.order_id)
            // console.log("page", res.data.view.page_no)
            // console.log("book", res.data.view.book_no)

            this.setState({
                PharmacyCode: res.data.view.fromStore.name,
                order: res.data.view,
                page_no: res.data.view.page_no,
                book_no: res.data.view.book_no,
                order_id: res.data.view.order_id
            }, () => {
                console.log("Order Data2", this.state.order?.fromStore?.owner_id, this.state.order?.toStore?.owner_id, "mode", this.state.order.Delivery?.delivery_mode)

                this.render()
                this.preLoadData()
                // console.log("State ", this.state.order)
            })

        }

    }



    async loadAllEmployees() {
        //let hospital = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let employeeFilterData = this.state.employeeFilterData
        employeeFilterData.type = "MSD MSA";


        this.setState({ loaded: false })
        let res = await EmployeeServices.getEmployees(employeeFilterData)
        // console.log('all pharmacist', res.data.view.data)
        if (200 == res.status) {
            this.setState({
                allEmpData: res?.data?.view?.data,
                loaded: true,
            })
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
            //group_by_warehouse_only: true,
            status: 'Active',
            from_date: moment().subtract(29, 'days').format('YYYY-MM-DD'),
            to_date: moment().add(1, 'days').format('YYYY-MM-DD'),
            allocation_sum: true
        }

        console.log("paramsss", itemFilter)
        this.setState({ loaded: false })
        let posted = await InventoryService.getOrderItemAllocation(itemFilter)
        if (posted.status == 200) {
            console.log('Orders', posted.data)
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


    async submitRow(tableMeta) {
        console.log("row data", tableMeta)
        this.state.allocate.warehouse_id = this.state.batch_details_data[tableMeta.rowIndex].warehouse_id
        this.setState({ totalUpdate: false })
        //check wether input is empty or not
        if (this.state.batchAllocationItemvalues[tableMeta.rowIndex] == null) {
            this.setState(
                { message: "Please Enter a value", alert: true, severity: "Error" }
            )
        } else {//Not empty the input quantity
            
            let allocate = this.state.allocate;
            
            let index_of_data = allocate.item_batch_allocation_data.findIndex(x => x.item_batch_bin_id == this.state.batch_details_data[tableMeta.rowIndex].id);
            console.log('cheking validatopn data', allocate.item_batch_allocation_data[index_of_data])
            if (index_of_data == -1) {
                
                if (this.state.batchAllocationItemvalues[tableMeta.rowIndex] == '' || this.state.batchAllocationItemvalues[tableMeta.rowIndex] == 0) {
                    allocate.item_batch_allocation_data.push({
                        bin_id: this.state.batch_details_data[tableMeta.rowIndex].bin_id,
                        item_batch_bin_id: this.state.batch_details_data[tableMeta.rowIndex].id,
                        warehouse_id: this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                        quantity: 0,
                        volume: this.state.batchAllocationItemVolumes[tableMeta.rowIndex]
                    })
                } else {
                    console.log('cheking dfdfsdfs data', this.state.batch_details_data[tableMeta.rowIndex])
              
                    if (this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.converted_order_uom === "EU" && this.state.epidContain) {
                        allocate.item_batch_allocation_data.push({
                            bin_id: this.state.batch_details_data[tableMeta.rowIndex].bin_id,
                            item_batch_bin_id: this.state.batch_details_data[tableMeta.rowIndex].id,
                            warehouse_id: this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                            quantity: this.state.batchAllocationItemvalues[tableMeta.rowIndex] / this.state.batch_details_data[tableMeta.rowIndex]?.ItemSnapBatch?.ItemSnap?.item_unit_size,
                            volume: this.state.batchAllocationItemVolumes[tableMeta.rowIndex]
                        })
                    } else {
                        allocate.item_batch_allocation_data.push({
                            bin_id: this.state.batch_details_data[tableMeta.rowIndex].bin_id,
                            item_batch_bin_id: this.state.batch_details_data[tableMeta.rowIndex].id,
                            warehouse_id: this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                            quantity: this.state.batchAllocationItemvalues[tableMeta.rowIndex],
                            volume: this.state.batchAllocationItemVolumes[tableMeta.rowIndex]
                        })
                    }
                  
                }

                console.log("indexofdata",this.state.allocate )
                this.setState({ allocate })

            } else {
                
                allocate.item_batch_allocation_data[index_of_data].bin_id = this.state.batch_details_data[tableMeta.rowIndex].bin_id
                allocate.item_batch_allocation_data[index_of_data].item_batch_bin_id = this.state.batch_details_data[tableMeta.rowIndex].id
                allocate.item_batch_allocation_data[index_of_data].warehouse_id = this.state.batch_details_data[tableMeta.rowIndex].warehouse_id
                allocate.item_batch_allocation_data[index_of_data].quantity = this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                allocate.item_batch_allocation_data[index_of_data].volume = this.state.batchAllocationItemVolumes[tableMeta.rowIndex]
                this.setState({ allocate })
            }


            console.log('quantity', this.state.batchAllocationItemvalues, 'tablemeta', tableMeta.rowIndex);
            console.log('volumes', this.state.batchAllocationItemVolumes, 'tablemeta', tableMeta.rowIndex);

            let batchAllocationItemvalues = this.state.batchAllocationItemvalues;
            let batchAllocationItemUpdated = this.state.batchAllocationItemUpdated;
            let batchAllocationPreValue = this.state.batchAllocationPreValue;
            let allocate_quantity = batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);

            console.log('chekmking allicated qty', allocate_quantity)

            // if (allocate_quantity <= this.state.data[this.state.selected_item].request_quantity) {
            this.state.allocate.quantity = allocate_quantity
            if (batchAllocationItemvalues[tableMeta.rowIndex] >= 0 && !batchAllocationItemUpdated[tableMeta.rowIndex]) {
                this.state.remainingAllocation -= batchAllocationItemvalues[tableMeta.rowIndex];
                batchAllocationItemUpdated[tableMeta.rowIndex] = true;
            } else {
                if (batchAllocationPreValue[tableMeta.rowIndex] !== batchAllocationItemvalues[tableMeta.rowIndex]) {
                    this.state.remainingAllocation += batchAllocationPreValue[tableMeta.rowIndex];
                    this.state.remainingAllocation -= batchAllocationItemvalues[tableMeta.rowIndex];

                    batchAllocationPreValue[tableMeta.rowIndex] = batchAllocationItemvalues[tableMeta.rowIndex]
                }
            }

            this.setState({
                batchAllocationItemUpdated,
                batchAllocationPreValue,
                batchAllocationItemUpdated,
            })
            /*  } else {
                  this.state.batchAllocationItemVolumes[tableMeta.rowIndex] = 0;
                 batchAllocationItemvalues[tableMeta.rowIndex] = 0
 
                 // Modify code to update remaining (Bug Fix)
                 this.state.remainingAllocation += batchAllocationPreValue[tableMeta.rowIndex];
                 batchAllocationPreValue[tableMeta.rowIndex] = 0;
 
                 this.setState({
                     batchAllocationItemvalues
                 }) 
             } */

            let total_qty = this.state.batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);
            //let total_volume=this.state.batchAllocationItemVolumes.reduce((partialSum, a) => partialSum + a, 0);

            if (this.state.logined_user_roles.includes('RMSD OIC') ||
                this.state.logined_user_roles.includes('RMSD MSA') ||
                this.state.logined_user_roles.includes('RMSD Pharmacist') ||
                this.state.logined_user_roles.includes('MSD Distribution Officer') ||
                this.state.logined_user_roles.includes('MSD MSA')

            ) {
                console.log("total qty", total_qty)
                console.log("total qty estimation", this.state.selected_item_remaining_estimation)
                if ((Number(total_qty) <= Number(this.state.selected_item_remaining_estimation == "Not Estimated" ? 0 : this.state.selected_item_remaining_estimation))) {

                    allocate.quantity = this.state.batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);
                    allocate.volume = this.state.batchAllocationItemVolumes.reduce((partialSum, a) => partialSum + a, 0);
                    console.log("allocation1", this.state.allocate);
                    this.setState({ allocate })

                } else {
                    this.setState({

                        alert: true,
                        severity: 'error',
                        message: 'Cannot Allocate More than Remaining Estimation',
                    })
                }
            } else {
                allocate.quantity = this.state.batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);
                allocate.volume = this.state.batchAllocationItemVolumes.reduce((partialSum, a) => partialSum + a, 0);
                console.log("allocation1", this.state.allocate);
                this.setState({ allocate })

            }

            /*  }
                else {
                    this.setState({
    
                        alert: true,
                        severity: 'error',
                        message: 'Please Check the Allocated Amount',
                    })
             } */



            //this.state.batch_details_data[tableMeta.rowIndex].allocated_quantity += this.state.allocate.quantity

            // }

        }
        this.setState({ totalUpdate: true })

        // console.log("allocation", this.state.allocate);

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

    async loadMyData() {
        let res = await PharmacyOrderService.getOrderSummuries(this.state.filterData)
        if (res.status == 200) {
            console.log("mydata", res.data.view.data)
            this.setState({
                issuringOffiser: res.data.view.data[1]?.Employee?.name,
                orderingOfficer: res.data.view.data[0]?.Employee?.name,
                order_date_time: res.data.view.data[0]?.date_time
            })
        }
    }

    async loadItemEstimation(data) {
        let item_ids = data.map(x => x.item_id)
        console.log("loaded data", data)
        let owner_id = data[0]?.OrderExchange?.from_owner_id

        let params = {
            //warehouse_id: data[0].OrderExchange.from,

            warehouse_id: owner_id == "NA0000" ? data[0]?.OrderExchange.from : null,
            owner_id: owner_id == "NA0000" ? null : owner_id,
            item_id: item_ids,
            estimation_status: 'Active',
            available_estimation: 'Active',
            status: 'Active',
            hospital_estimation_status: 'Active',
            //'order[0]': ['createdAt', 'DESC'],
            from: dateParse(moment().startOf('year')),
            to: dateParse(moment().endOf('year')),
            'order[0]': ['estimation', 'DESC'],

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
    }

    async componentDidMount() {

        let owner_id= await localStorageService.getItem("owner_id")
        console.log('jdfksdkkfksd', owner_id)

        if (owner_id === '000') {
            this.setState({
                epidContain : false
            })
        } else {
            this.setState({
                epidContain : true
            })
        }

        console.log('orderid', this.state.order)
        this.loadMyData()
        this.getUserRole()
        let filterData = this.state.filterData
        filterData.order_exchange_id = this.props.id.match.params.id
        this.setState({ filterData })
        this.loadData()
        this.LoadOrderItemDetails()
        this.loadAllEmployees()
        this.LoadVehicleData()
        this.LoadOrderDetails()
        // this.getSplitOrder()

        console.log('this page')

        // console.log('book',this.state.order.book_no)
        // this.state.statusOfOrder = this.props.id.match.params.status

    }
    async getUserRole() {
        var user = await localStorageService.getItem('userInfo')
        console.log('user', user)

        var userType = user.roles
        console.log('User Type', userType)

        // let doctor_id = null;
        this.setState({
            user_type: userType,
            logined_user_roles: user.roles
        })
    }

    async loadData() {
        let rem_res = await RemarkServices.getRemarks({
            // type: 'Order Remark',
            //remark: 'Order Remark',
        })
        if (rem_res.status == 200) {
            console.log('Ven', rem_res.data.view.data)
            this.setState({ remarks: rem_res.data.view.data })
        }


        //Add other to Remarks
        this.state.remarks.push({
            createdAt: '2022-07-07T12:23:03.091Z',
            createdBy: null,
            id: '4dbd7efd-fe69-400d-988b-d87307267c76',
            remark: 'Other',
            status: 'Deactive',
            type: 'Order Remark',
            updatedAt: '2022-07-07T12:25:38.341Z',
        }
        )
    }

    async LoadOrderItemDetails() {
        this.setState({ loaded: false, batchAllocationItemvalues: [] })
        console.log('State 1:', this.state.data)

        let warehouseList = []
        let itemList = []
        let uniquitemslist = []
        let res = await PharmacyOrderService.getOrderItems(
            this.state.filterData
        )
        if (res.status == 200) {
            console.log("all res res", res)


            let filterdData = res.data.view.data.filter(function (x) {
                return x.status != "Pending" && x.status != "APPROVED";
            });
            console.log("all status approved", filterdData.length)
            if (filterdData.length > 0) {
                this.setState({ canAllReject: false })
            } else {
                this.setState({ canAllReject: true })
            }

            if (res.data.view.data[0]) {
                this.state.allocate.warehouse_id = res.data.view.data[0].OrderExchange.to
                this.state.issue.warehouse_id = res.data.view.data[0].OrderExchange.to

                warehouseList = [res.data.view.data[0].OrderExchange.to, res.data.view.data[0].OrderExchange.from]
                itemList = res.data.view.data.map(data => data.item_id);
                uniquitemslist = [...new Set(itemList)];
            } else {
                let issue = this.state.issue
                issue.date = res.data.view.data[0]?.OrderExchange.issued_date
                this.loadItemEstimation(res.data.view.data)


                this.setState({
                    total: res.data.view.totalItems,
                    data: res.data.view.data,
                    order_exchange_status: res.data.view.data[0]?.OrderExchange?.status,
                    issue: issue,
                    // loaded: true,
                })
            }
            this.loadItemEstimation(res.data.view.data)
            this.setState(
                {
                    total: res.data.view.totalItems,
                    warehouseListfull: warehouseList,
                    uniquitemslistfull: uniquitemslist,
                    data: res.data.view.data,
                    order_exchange_status: res.data.view.data[0]?.OrderExchange?.status
                    //loaded: true
                },
                () => {

                    let item_ids = res.data.view.data.map(x => x.ItemSnap.id)
                    console.log("item ids", item_ids)

                    this.getItemData(
                        {
                            item_id: item_ids,
                            warehouse_id: res.data.view.data[0]?.OrderExchange.to,
                        }
                    )


                    /*    res.data.view.data.map((data, index) => {
                           this.getItemData(
                               {
                                   //item_id: data.ItemSnap.id,
                                   item_id:item_ids,
                                   warehouse_id:
                                       res.data.view.data[0].OrderExchange.to,
                               },
                               index
                           )
                       }) */
                    console.log('NEW DATA', this.state.data)
                }
            )
        }
        console.log('Order Items Data', this.props.id.match.params.id)
    }

    updateFilters(ven, category, class_id, group, search) {
        let filterData = this.state.filterData
        filterData.ven_id = ven
        filterData.category_id = category
        filterData.class_id = class_id
        filterData.group_id = group
        filterData.search = search

        this.setState({ filterData })
        console.log('Order Filter Data', this.state.filterData)
        this.LoadOrderItemDetails()
    }

    allocate(item_id, activity, user, date, item_data) {

        console.log('cheking item details',item_data )
        let allocate = this.state.allocate
        allocate.order_item_id = item_id
        allocate.estimation_id = this.state.selected_estimation_id
        allocate.activity = activity
        allocate.status = activity
        allocate.type = activity
        allocate.date = date

        this.state.issue.remark_by = user

        if (item_data?.ItemSnap?.converted_order_uom === "EU" && item_data.to_owner_id !== '000') {
            allocate.quantity = allocate.quantity / item_data?.ItemSnap?.item_unit_size
        }
        this.setState({ allocate })
        console.log('New Allocate Req', this.state.allocate)
        this.allocateItem()
    }

    async allocateItem() {

       

        let allocate = await DistributionCenterServices.allocate(
            this.state.allocate
        )
        if (allocate.status == 201) {
            console.log('Allocation response', allocate.data)
            if (allocate.data.posted == 'data has been added successfully.') {
                let allocate = this.state.allocate;
                allocate.item_batch_allocation_data = [];
                allocate.volume = 0;
                allocate.quantity = 0;
                this.setState({
                    severity: 'success',
                    message: 'Item quantity status added',
                    batchAllocationItemvalues: [],
                    alert: true,
                    allocate_item: false,
                    allocate: allocate,
                    allocating: false,
                    remarks_other: 'hidden',
                    unable_to_fill: 'hidden'


                })
            }
            this.LoadOrderItemDetails()
        } else {
            this.setState({ allocating: false })
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                console.log('New filterData', this.state.filterData)
                this.LoadOrderItemDetails()
            }
        )
    }

    async getRetBatchData() {
        console.log('warehouse_id', this.state.data[0].OrderExchange.from)
        let batch_res = await DistributionCenterServices.getRetBatchData({
            return_request_id:
                this.state.data[0].OrderExchange.return_request_id,
        })
        if (batch_res.status == 200) {
            console.log('Return req', batch_res.data.view.data)
            let batchlist = batch_res.data.view.data.map(
                (data) => data.item_batch_id
            )

            this.setState({ retbatchdata: batchlist })
            this.getBatchData(batchlist)
        }
    }

    async getBatchData(param) {
        console.log('getBatch', this.state.selected_item)
        this.setState({ batchDataLoaded: false })
        this.orderItemAllocation(this.state.data[this.state.selected_item].item_id)
        let params = {
            warehouse_id: this.state.allocate.warehouse_id,
            item_id: this.state.data[this.state.selected_item].item_id,
            exp_date_grater_than_zero: true,
            quantity_grater_than_zero: true,
            'order[0]': ['createdAt', 'DESC'],
        }
        if (param) {
            params = {
                warehouse_id: this.state.allocate.warehouse_id,
                item_batch_id: param,
                exp_date_grater_than_zero: true,
                quantity_grater_than_zero: true,
                item_status: ['Active', 'Pending', 'pending'],
                'order[0]': ['createdAt', 'DESC'],
            }
        }
        let batch_res = await DistributionCenterServices.getBatchData(params)
        if (batch_res.status == 200) {
            console.log('Batch Data', batch_res.data.view.data)
            this.setState({ batch_details_data: batch_res.data.view.data, batchDataLoaded: true })
        }
    }

    async getItemData(params) {
        let itemData = await DistributionCenterServices.getItemData(params)
        if (itemData.status == 200) {
            console.log('Item Data 123', itemData.data.view)

            this.state.data.forEach((element, index) => {
                let data = this.state.data;
                let item_data = itemData.data.view.data.find((t) => (t.item_id === element.ItemSnap.id))

                console.log("let data 123", item_data)
                //data[index].my_stock_days = item_data.total_remaining_days
                //data[index].stored_quantity = item_data.mystock_quantity
                data[index].consumption = item_data ? item_data.consumption : 1


                this.setState({ data })

            });

            this.getItemDrugStocks(params)
            this.setState({ loaded: true })
        }

    }


    async getItemDrugStocks(params) {

        let new_params = { items: params.item_id, warehouse_id: params.warehouse_id, zero_needed: true }
        let itemData = await PharmacyService.getDrugStocks(new_params)
        if (itemData.status == 201) {
            console.log('Item stokes Data', itemData.data.posted.data)

            this.state.data.forEach((element, index) => {
                let data = this.state.data;
                let item_data = itemData.data.posted.data.find((t) => (t.item_id === element.ItemSnap.id))

                console.log("let data", item_data)
                let consumption = 1;
                if (data[index].consumption == null || data[index].consumption == undefined) {
                    consumption = 1
                } else {
                    consumption = data[index].consumption
                }
                data[index].my_stock_days = item_data ? (item_data.quantity / consumption) : null;
                data[index].stored_quantity = item_data?.quantity
                //data[index].consumption = item_data.consumption
                console.log("let data", data)


                this.setState({ data })

            });

            this.setState({ loaded: true })
        }

    }


    async getItemDataOld(params, index) {
        let itemData = await DistributionCenterServices.getItemData(params)
        if (itemData.status == 200) {
            console.log('Item Data', itemData.data.view)
            let data = this.state.data
            data[index].my_stock_days =
                itemData.data.view.data[0]?.total_remaining_days
            data[index].stored_quantity =
                itemData.data.view.data[0]?.mystock_quantity
            this.setState({ data })
        }
        if (this.state.data.length - 1 == index) {
            this.setState({
                loaded: true,
            })
            this.render()
        }
    }

    handleConfirmation = () => {
        this.setState({ orderReversing: true })
        const confirmed = window.confirm('Are you sure?');
        if (confirmed) {
            // Perform your action here
            console.log('Confirmed!');
            this.reverseOrder()
            window.close()

        } else {
            // Handle cancellation
            console.log('Cancelled!');
            this.setState({ orderReversing: false })
            window.close()
        }
    }


    async issueOrder() {
        /*  if (this.state.issue.time_from == null ||this.state.issue.time_to == null || this.state.issue.date == null){
            this.setState({
                message:"Please set From and To time",
                severity:"Error",
                alert:true
            })
        }else{ */
        this.setState({
            issue_processing: true
        })

        let issue = this.state.issue
        // issue.date = dateParse(new Date())

        console.log("issued order", issue)

        let issue_res = await DistributionCenterServices.issueOrder(
            issue
        )
        if (issue_res.status == 201) {
            if (issue_res.data.posted == 'data has been added successfully.') {
                console.log('Order Issued', issue_res.data)
                this.setState(
                    {
                        message: 'Order Issue Completed',
                        severity: 'Success',
                        alert: true,
                        issue_processing: false
                    },
                    () => {
                        window.location.reload();


                    }
                )
            }
        } else {
            console.log("ress", issue_res.response.data.error)
            this.setState({
                alert: true,
                message: issue_res.response.data.error ? issue_res.response.data.error : 'Order Issue Unsuccessful',
                severity: 'error',
                issue_processing: false
            })
        }
    }



    async reverseOrder() {
        this.setState({ orderReversing: true })

        let user_info = await localStorageService.getItem('userInfo')
        let reverseData = {
            order_exchange_id: this.props.id.match.params.id,
            activity: 'REVERSED',
            //date: null,
            status: 'REVERSED',
            //remark_id: null,
            remark_by: user_info.id,
            type: 'REVERSED',
            // time_from: null,
            //time_to: null,
            warehouse_id: this.state.issue.warehouse_id,
        }


        let issue = await DistributionCenterServices.issueOrder(
            reverseData
        )
        if (issue.status == 201) {
            this.setState(
                {
                    message: 'Order Reversed successfully',
                    severity: 'Success',
                    alert: true,
                    issue_processing: false,
                    orderReversing: false
                },
                () => {
                    window.location.reload();
                }
            )

        } else {
            this.setState({
                alert: true,
                message: issue.response.data.error ? issue.response.data.error : 'Order Issue Unsuccessful',
                severity: 'error',
                issue_processing: false,
                orderReversing: false
            })
        }
    }

    async reject() {
        this.setState({
            issue_processing: true
        })

        console.log("issued order", this.state.issue)
        let rejectData = this.state.issue
        rejectData.activity = 'ALL REJECT'
        rejectData.status = 'ALL REJECT'
        rejectData.type = 'ALL REJECT'


        let issue = await DistributionCenterServices.issueOrder(rejectData)
        if (issue.status == 201) {

            console.log('Order Issued', issue.data)
            this.setState(
                {
                    message: 'Order Reject Completed',
                    severity: 'Success',
                    alert: true,
                    issue_processing: false
                },
                () => {
                    window.location.reload();


                }
            )

        } else {
            this.setState({
                alert: true,
                message: issue.response.data.error ? issue.response.data.error : 'Order Issue Unsuccessful',
                severity: 'error',
                issue_processing: false
            })
        }
    }

    resetButton() {
        this.setState({ totalUpdate: false })
        this.state.allocate.item_batch_allocation_data.forEach(
            (element, index) => {
                this.state.allocate.item_batch_allocation_data.splice(index, 1)
                document.getElementById('Hello' + index).value = 0
                this.state.allocate.quantity -=
                    this.state.batchAllocationItemvalues[index]
                this.state.allocate.volume -=
                    this.state.batchAllocationItemVolumes[index]
                this.state.batchAllocationItemvalues[index] = 0
                this.state.batchAllocationItemVolumes[index] = 0
            }
        )

        this.state.allocate.quantity =
            this.state.batchAllocationItemvalues.reduce(
                (partialSum, a) => partialSum + a,
                0
            )
        this.state.allocate.volume =
            this.state.batchAllocationItemVolumes.reduce(
                (partialSum, a) => partialSum + a,
                0
            )

        this.setState({ totalUpdate: true })

        console.log('RESET BUTTON', this.state.allocate)
    }



    async loadItems(search) {
        // let params = { "search": search }
        let data = {
            warehouse_id: this.state.allocate.warehouse_id,
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
    }
    async addSingleItem() {
        let userInfo = await localStorageService.getItem("userInfo")

        let data = this.state.itemAddDialog

        data.new_added_by = userInfo.id;
        data.newly_added = true;

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
                    addItemDialog: false,
                    itemAddDialog: {
                        order_exchange_id: this.props.id.match.params.id,
                        item_id: null,
                        request_quantity: null,
                        reason: null,
                        special_normal_type: "Added By MSD"
                    }
                })
            }
            this.LoadOrderItemDetails(this.state.filterData)
        }
    }




    async loadBatchData(order_item_id, item_id) {
        this.setState({ editItemLoaded: false, editItemDialogView: true, selected_order_item_id: order_item_id })
        let filters = { order_item_id: order_item_id }

        let res = await PharmacyOrderService.getOrderBatchItems(filters)
        if (res.status) {
            console.log("Order Item Batch Data", res.data.view.data)
            for (let index = 0; index < res.data.view.data.length; index++) {
                res.data.view.data[index].allocated_qty_temp = res.data.view.data[index].allocated_quantity

            }

            let temp = res.data.view.data.map((itemObject) => {
                if (itemObject?.OrderItem?.ItemSnap?.converted_order_uom === "EU" && itemObject?.to_owner_id !== '000') {
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
            this.setState({ edit_item: temp })

        }
        this.orderItemAllocation(item_id)

    }

    async editItemBatch(item) {
        console.log('jkdkdkfk', item)
        let data

        if (item?.OrderItem?.ItemSnap?.converted_order_uom === 'EU' && this.state.epidContain) {
            data = {
                allocated_quantity: (item.allocated_quantity) /  item?.OrderItem?.ItemSnap?.item_unit_size,
                allocated_volume: Number(item.ItemSnapBatchBin?.volume) / (Number(item.ItemSnapBatchBin?.quantity) == 0 ? 1 : Number(item.ItemSnapBatchBin?.quantity)) * Number(item.allocated_quantity)
            }
        } else {
            data = {
                allocated_quantity: item.allocated_quantity,
                allocated_volume: Number(item.ItemSnapBatchBin?.volume) / (Number(item.ItemSnapBatchBin?.quantity) == 0 ? 1 : Number(item.ItemSnapBatchBin?.quantity)) * Number(item.allocated_quantity)
            }
        }
        

        let res = await PharmacyOrderService.editOrderBatchItems(item.id, data)
        if (res.status == 200) {
            this.setState({
                // Loaded: true,
                editItemDialogView: false,
                alert: true,
                message: 'Item Edit Succesfully Succesfully',
                severity: 'success',

            }, () => {
                this.loadData()
                this.LoadOrderItemDetails()
            })
        } else {
            this.setState({
                // Loaded: true,
                editItemDialogView: false,
                alert: true,
                message: 'Item Edit Unsuccesful',
                severity: 'error',

            })
        }
    }

    handleDecrement = () => {
        if (this.state.value > 0) {
            this.setState({
                value: this.state.value - 1
            });
        }
    };


    async sendPrinted() {
        let status = this.state.data[0]?.OrderExchange?.stv_printed
        let formData = {
            stv_printed:true
        }
        if (status == null) {
            let res = await ChiefPharmacistServices.addDistributionRemark(formData, this.props.id.match.params.id)
          console.log("print status update",res)
        }

    }


    async calculateEstimationQty(row) {

        this.setState({
            selected_estimation_id: null,
            selected_item_estimation: "Loading",
            selected_item_remaining_estimation: "Loading",
            selectedItemMonthlyEstimation: "Loading",
            remaining_result: 0
        })

        let items = this.state.estimationData.filter(((ele) => ele.item_id == row.item_id))
        // let issuedQty = Number(items[0]?.issued_quantity ? items[0]?.issued_quantity : 0)

        let filteredMyWarehouse = items.filter((ele) => ele.HosptialEstimation?.warehouse_id == row?.OrderExchange?.from)
        console.log("filtered estimation data", filteredMyWarehouse)

        if (filteredMyWarehouse.length > 0) {
            let annualEstimation = isNaN(Math.floor(filteredMyWarehouse[0].estimation)) ? 0 : Math.floor(filteredMyWarehouse[0].estimation)
            console.log("estimation new data 0", annualEstimation)
            let issuedQty = Number(filteredMyWarehouse[0]?.issued_quantity ? filteredMyWarehouse[0]?.issued_quantity : 0)
            let remaining_result = (Math.floor(annualEstimation - Number(issuedQty))) / Math.floor(annualEstimation) * 100;

            if (isNaN(remaining_result)) {
                remaining_result = 0
            }
            this.setState({
                selected_estimation_id: filteredMyWarehouse[0].id,
                selected_item_estimation: annualEstimation,
                selected_item_remaining_estimation: annualEstimation - issuedQty,
                selectedItemMonthlyEstimation: annualEstimation / 12,
                remaining_result: remaining_result

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
                        let remaining_result = (Math.floor(annualEstimation - Number(issuedQty))) / Math.floor(annualEstimation) * 100;

                        if (isNaN(remaining_result)) {
                            remaining_result = 0
                        }

                        this.setState({
                            selected_estimation_id: filteredEstimationArray[0].id,
                            selected_item_estimation: annualEstimation,
                            selected_item_remaining_estimation: annualEstimation - issuedQty,
                            selectedItemMonthlyEstimation: annualEstimation / 12,
                            remaining_result: remaining_result
                        })

                    } else {
                        if (items.length > 0) {
                            console.log("estimation new data 2", isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation))
                            let annualEstimation = isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation)
                            let issuedQty = Number(items[0]?.issued_quantity ? items[0]?.issued_quantity : 0)
                            let remaining_result = (Math.floor(annualEstimation - Number(issuedQty))) / Math.floor(annualEstimation) * 100;

                            if (isNaN(remaining_result)) {
                                remaining_result = 0
                            }

                            this.setState({
                                selected_estimation_id: items[0].id,
                                selected_item_estimation: annualEstimation,
                                selected_item_remaining_estimation: annualEstimation - issuedQty,
                                selectedItemMonthlyEstimation: annualEstimation / 12,
                                remaining_result: remaining_result
                            })
                        } else {
                            let annualEstimation = 0

                            this.setState({
                                selected_estimation_id: null,
                                selected_item_estimation: "Not Estimated",
                                selected_item_remaining_estimation: annualEstimation,
                                selectedItemMonthlyEstimation: "Not Estimated",
                                remaining_result: 0
                            })
                        }
                    }


                } else {
                    if (items.length > 0) {
                        console.log("estimation new data 3", isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation))
                        let annualEstimation = isNaN(Math.floor(items[0].estimation)) ? 0 : Math.floor(items[0].estimation)
                        let issuedQty = Number(items[0]?.issued_quantity ? items[0]?.issued_quantity : 0)
                        let remaining_result = (Math.floor(annualEstimation - Number(issuedQty))) / Math.floor(annualEstimation) * 100;

                        if (isNaN(remaining_result)) {
                            remaining_result = 0
                        }

                        this.setState({
                            selected_estimation_id: items[0].id,
                            selected_item_estimation: annualEstimation,
                            selected_item_remaining_estimation: annualEstimation - issuedQty,
                            selectedItemMonthlyEstimation: annualEstimation / 12,
                            remaining_result: remaining_result
                        })
                    } else {
                        let annualEstimation = 0
                        this.setState({
                            selected_estimation_id: null,
                            selected_item_estimation: "Not Estimated",
                            selected_item_remaining_estimation: annualEstimation,
                            selectedItemMonthlyEstimation: "Not Estimated",
                            remaining_result: 0
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
    render() {
        const { classes } = this.props
        return (
            <>
                {' '}
                {!this.props.hideTables &&
                    <FilterComponent onSubmitFunc={this.updateFilters.bind(this)} />
                }
                {!this.props.hideTables &&
                    <Grid
                        container="container"
                        style={{
                            justifyContent: 'flex-end'
                        }}>

                        {this.state.logined_user_roles.includes('MSD MSA') ? null :
                            <Grid
                                className="w-full flex justify-end" item lg={2} md={4} sm={4} xs={4}>

                                {this.props.id.match.params.status == 'Pending' ||
                                    this.props.id.match.params.status == 'ALLOCATED' ||
                                    this.props.id.match.params.status ==
                                    'ISSUE SUBMITTED' ||
                                    this.props.id.match.params.status ==
                                    'APPROVED' ?

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
                                    : null}




                            </Grid>
                        }

                    </Grid>
                }

                {this.state.loaded ? (
                    <ValidatorForm
                        //onSubmit={() => this.issueOrder()}
                        onError={() => null}
                    >
                        {!this.props.hideTables &&
                            <LoonsTable
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.total,
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
                                    },
                                }}
                                data={this.state.data}
                                columns={this.state.columns}
                            />
                        }

                        {console.log(this.props)}

                        {/* this.props.id.match.params.status == 'Pending' || this.props.id.match.params.status == 'ISSUE SUBMITTED' || this.props.id.match.params.status == 'APPROVED' ? ( */
                            this.state.order_exchange_status == 'Pending' || this.state.order_exchange_status == 'ISSUE SUBMITTED' || this.state.order_exchange_status == 'APPROVED' || this.state.order_exchange_status == 'ALLOCATED' ? (


                                <Grid
                                    container="container"
                                    spacing={2}
                                    className="mt-5"
                                >
                                    <Grid
                                        item="item"
                                        lg={1}
                                        xs={12}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <SubTitle title={'Issued Date :'} />
                                    </Grid>
                                    <Grid item="item" lg={2} xs={12}>
                                        <DatePicker
                                            className="w-full"
                                            value={Date(this.state.issue.date)}
                                            placeholder="Issued Date"
                                            // minDate={new Date()}
                                            //maxDate={new Date()}
                                            // required={true}

                                            // errorMessages="this field is required"
                                            onChange={(date) => {
                                                let issue = this.state.issue
                                                issue.date = dateParse(date)
                                                //this.state.issue.date = date
                                                this.setState({ issue })
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item="item"
                                        lg={1}
                                        xs={12}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <SubTitle title={'Time Slot :'} />
                                    </Grid>
                                    <Grid item="item" lg={2} xs={12}>
                                        <TextField
                                            id="time from"
                                            label="Time Slot (from)"
                                            type="time"
                                            fullWidth="fullWidth"
                                            placeholder="07:30"
                                            //defaultValue="07:30"
                                            onChange={(e) => {
                                                console.log('time', e)
                                                let issue = this.state.issue
                                                issue.time_from = e.target.value
                                                this.setState({ issue })
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                step: 60, // 1 min
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item="item"
                                        lg={1}
                                        xs={12}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <SubTitle title={' to :'} />
                                    </Grid>
                                    <Grid item="item" lg={2} xs={12}>
                                        <TextField
                                            id="time to"
                                            label="Time Slot (to)"
                                            type="time"
                                            fullWidth="fullWidth"
                                            placeholder="07:30"
                                            onChange={(e) => {
                                                let issue = this.state.issue
                                                issue.time_to = e.target.value
                                                this.setState({ issue })
                                            }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                step: 60, // 1 min
                                            }}
                                        />
                                    </Grid>

                                    {this.state.logined_user_roles.includes("MSA") || this.state.logined_user_roles.includes("MSD MSA") ?
                                        <>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Picking Slip By" />


                                                <Autocomplete
                                                    disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.allEmpData
                                                    }
                                                    onChange={(e, value, r) => {
                                                        console.log(
                                                            'value',
                                                            value
                                                        )
                                                        if (null != value) {
                                                            let issue = this.state.issue
                                                            issue.picking_slip_by =
                                                                value.id
                                                            this.setState({
                                                                issue,
                                                            })
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Employee"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid
                                                className=" w-full"
                                                item
                                                lg={6}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <SubTitle title="Assembled By" />
                                                <Autocomplete
                                                    disableClearable
                                                    className="w-full"
                                                    options={
                                                        this.state.allEmpData
                                                    }
                                                    onChange={(e, value, r) => {
                                                        console.log(
                                                            'value',
                                                            value
                                                        )
                                                        if (null != value) {
                                                            let issue = this.state.issue
                                                            issue.assembled_by =
                                                                value.id
                                                            this.setState({
                                                                issue,
                                                            })
                                                        }
                                                    }}
                                                    getOptionLabel={(option) =>
                                                        option.name
                                                    }
                                                    renderInput={(params) => (
                                                        <TextValidator
                                                            {...params}
                                                            placeholder="Employee"
                                                            fullWidth
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </>
                                        : null}


                                    <Grid
                                        item="item"
                                        lg={4}
                                        xs={12}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            width: '2px',
                                        }}
                                    >
                                        {/*  {(this.props.id.match.params.status == 'ISSUE SUBMITTED' && (this.state.user_type == 'MSD MSA' ||this.state.user_type=="Drug Store Keeper"))
                                        ?
                                            <LoonsButton
                                                className="mt-2"
                                                progress={this.state.issue_processing}
                                                type="submit"
                                                startIcon="save"
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Issue Order
                                                </span>
                                            </LoonsButton>
                                        :
                                            null
                                        } */}

                                        {this.state.logined_user_roles.includes("MSD MSA") && this.state.order_exchange_status == 'ISSUE SUBMITTED' ?

                                            <LoonsButton
                                                className="mt-2"
                                                progress={this.state.issue_processing}
                                                type="submit"
                                                startIcon="save"
                                                onClick={() => { this.issueOrder() }}
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Issue Order
                                                </span>
                                            </LoonsButton>
                                            : null}

                                        {!this.state.logined_user_roles.includes("MSD MSA") ?

                                            <LoonsButton
                                                className="mt-2"
                                                progress={this.state.issue_processing}
                                                type="submit"
                                                startIcon="save"
                                                onClick={() => { this.issueOrder() }}
                                            //onClick={this.handleChange}
                                            >
                                                <span className="capitalize">
                                                    Issue Order
                                                </span>
                                            </LoonsButton>
                                            : null}

                                        {this.state.canAllReject && !this.state.user_type.includes('MSD MSA') ?
                                            <LoonsButton
                                                className="mt-2 ml-2"
                                                progress={this.state.issue_processing}
                                                //type="submit"
                                                startIcon="save"
                                                onClick={() => { this.reject() }}
                                            >
                                                <span className="capitalize">
                                                    Reject
                                                </span>
                                            </LoonsButton>
                                            : null}
                                    </Grid>
                                </Grid>
                            ) :

                                (this.state.logined_user_roles.includes("Drug Store Keeper") ||
                                    this.state.logined_user_roles.includes("Medical Laboratory Technologist") ||
                                    this.state.logined_user_roles.includes("Chief Pharmacist") ||
                                    this.state.logined_user_roles.includes("Radiographer") ||
                                    this.state.logined_user_roles.includes("Chief MLT") ||
                                    this.state.logined_user_roles.includes("Chief Radiographer") ||
                                    this.state.logined_user_roles.includes("RMSD MSA") ||
                                    this.state.logined_user_roles.includes("RMSD Pharmacist") ||
                                    this.state.logined_user_roles.includes("RMSD OIC") ||
                                    this.state.logined_user_roles.includes("RMSD Distribution Officer") ||
                                    this.state.logined_user_roles.includes("MSA") ||
                                    this.state.logined_user_roles.includes("Drugstore Pharmacist(S)") ||
                                    this.state.logined_user_roles.includes("Blood Bank MLT") ||
                                    this.state.logined_user_roles.includes("MSD MSA")) &&

                                <Grid container spacing={2} style={{ display: 'flex', justifyContent: 'space-between', }}>
                                    <Grid item>
                                        {(this.state.order_exchange_status == "ISSUED" ||this.state.order_exchange_status == 'ALL ISSUED' || this.state.order_exchange_status == 'COMPLETED'|| this.state.order_exchange_status == 'DISPATCHED' )&&
                                        <LoonsButton
                                            className="mt-2"
                                            progress={false}
                                            //type="submit"
                                            //startIcon="save"
                                            onClick={() => {
                                                if (this.state.logined_user_roles.includes("RMSD MSA") ||
                                                    this.state.logined_user_roles.includes("RMSD Pharmacist") ||
                                                    this.state.logined_user_roles.includes("RMSD OIC") ||
                                                    this.state.logined_user_roles.includes('Blood Bank MLT') ||
                                                    this.state.logined_user_roles.includes("RMSD Distribution Officer")
                                                ) {
                                                    document.getElementById('print_Rmsd_004').click()
                                                } else if (this.state.logined_user_roles.includes("MSD MSA")) {
                                                    
                                                     document.getElementById('print_msd_004').click()
                                                } else {

                                                    document.getElementById('print_presc_004').click()
                                                }
                                            }}
                                        >
                                            <span className="capitalize">
                                                Print Issue Note
                                            </span>
                                        </LoonsButton>
    }
                                    </Grid>

                                    {
                                        this.state.logined_user_roles.includes("RMSD MSA") ||
                                            this.state.logined_user_roles.includes("RMSD Pharmacist") ||
                                            this.state.logined_user_roles.includes("RMSD OIC") ||
                                            this.state.logined_user_roles.includes("Drug Store Keeper") ||
                                            this.state.logined_user_roles.includes("RMSD Distribution Officer") ||
                                            this.state.logined_user_roles.includes("Blood Bank MLT (NOIC)") ||
                                            this.state.logined_user_roles.includes("Blood Bank MLT")

                                            ?

                                            <Grid item style={{ display: 'flex', justifyContent: 'flex-end' }}>

                                                {(this.state.order_exchange_status == 'issued' || this.state.order_exchange_status == 'Issued' || this.state.order_exchange_status == 'ISSUED' || this.state.order_exchange_status == 'ALL ISSUED') &&
                                                    <Button
                                                        className="mt-2"
                                                        style={{
                                                            backgroundColor: 'red',
                                                            color: 'white'
                                                        }}
                                                        progress={this.state.orderReversing}
                                                        //type="submit"

                                                        onClick={() => { this.handleConfirmation() }}
                                                    //onClick={this.handleChange}
                                                    >
                                                        <span className="capitalize">
                                                            Reverse
                                                        </span>
                                                    </Button>
                                                }

                                            </Grid>
                                            :
                                            null
                                    }

                                </Grid>

                        }
                        {/* {this.state.order?.Delivery?.delivery_mode == 'Delivery' ?  */}
                        {/* && this.state.order.Delivery?.delivery_mode === "Delivery" */}
                        {this.state.order?.fromStore?.owner_id === this.state.order?.toStore?.owner_id && this.state.order.Delivery?.delivery_mode === "Delivery" ?
                            <>
                                {this.state.order?.Delivery?.delivery_mode === 'Delivery' ?
                                    <Grid
                                        container justifyContent="flex-end">
                                        <Grid>
                                            <LoonsButton
                                                className="mt-2"
                                                progress={false}
                                                scrollToTop={true}
                                                startIcon="add"

                                                onClick={() => this.setState({ vehicleDialogView: true })}
                                            >
                                                <span className="capitalize">Add Vehicles</span>
                                            </LoonsButton>
                                        </Grid>

                                    </Grid>


                                    : null}
                                <Grid className='mt-5' item lg={12} md={12} sm={12} xs={12}>
                                    {
                                        this.state.vehicleLoaded ?
                                            <>
                                                <LoonsTable
                                                    title={"Assigned Vehicles"}

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


                            </>
                            : null
                        }


                    </ValidatorForm>
                ) : //loading effect
                    !this.props.hideTables &&
                    (
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    )

                }
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
                                    <Grid item="item" lg={1} md={1} xs={1}><IconButton aria-label="close" onClick={() => { this.setState({ allocate_item: false }) }}><CloseIcon /></IconButton></Grid>

                                </Grid>
                            </Grid>
                        </Grid>
                        <div className='mt-6'></div>
                        <CardTitle title={this.state.data[this.state.selected_item]?.ItemSnap?.medium_description} />
                        <LoonsTable
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
                            columns={this.state.allocate_dialog_table}
                            data={[this.state.data[this.state.selected_item]]} />

                        {/* <div className='mt-6'></div> */}
                        <LoonsCard
                            style={{
                                // marginTop: '8px'
                            }}>
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
                                                        // .setState({formData})allocate_dialog_table
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

                            {this.state.batchDataLoaded ?
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
                                : <Grid className="justify-center text-center w-full pt-12">
                                    <CircularProgress size={30} />
                                </Grid>}
                            <Grid
                                container="container"
                                style={{
                                    justifyContent: 'flex-end',
                                    marginTop: '8px'
                                }}>
                                <Grid item="item" className='mr-1'>
                                    <Button
                                        style={{
                                            backgroundColor: 'red',
                                            color: 'white'
                                        }} onClick={() => { this.resetButton() }}>Reset <DeleteSweepIcon /></Button>
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
                                    <Button
                                        style={{
                                            backgroundColor: '#1a73e8',
                                            color: 'white'
                                        }}
                                        progress={this.state.allocating}
                                        onClick={() => {
                                            let user = localStorageService.getItem('userInfo')
                                            if (this.state.allocate.quantity == 0 || this.state.allocate.quantity == "" || this.state.allocate.quantity == null) {
                                                this.setState(
                                                    { message: "Please enter a value", alert: true, severity: "Error" }
                                                )
                                            } else {
                                                /*   if (this.state.allocate.quantity > this.state.batch_details_data[0].quantity) {
                                                      this.setState(
                                                          { message: "Cannot allocate more than reservable quantity", alert: true, severity: "Error" }
                                                      )
                                                  } else { */
                                                console.log("aaa", this.state.allocate.quantity)
                                                console.log("aaa2", this.state.data[this.state.selected_item].to_be_issue_quantity)
                                                if (parseInt(this.state.allocate.quantity) > parseInt(this.state.data[this.state.selected_item].to_be_issue_quantity)) {
                                                    this.setState(
                                                        { message: "Cannot allocate more than plan to allocate quantity", alert: true, severity: "Error" }
                                                    )
                                                } else {
                                                    this.setState({ allocating: true })
                                                    this.allocate(
                                                        this.state.data[this.state.selected_item].id,
                                                        "ALLOCATED",
                                                        user.id,
                                                        new Date().toJSON(),
                                                        this.state.data[this.state.selected_item]
                                                    )
                                                }
                                                //}
                                            }


                                        }}>Allocate <CheckCircleOutlineIcon /></Button>
                                </Grid>
                            </Grid>

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
                                                    console.log('value', value.remark);
                                                    if (value != null) {
                                                        if (value.remark == 'Other') {
                                                            this.setState({ remarks_other: 'visible' })
                                                            this.state.allocate.remark_id = null
                                                        } else {
                                                            this.setState({ remarks_other: 'hidden' })
                                                            this.state.allocate.remark_id = value.id
                                                            // this.state.allocate.remark_id = null
                                                            // if (value.remark == 'Out of Stock') {
                                                            //     this.state.allocate.other_remarks = 'Out of Stock'
                                                            // } else{
                                                            //     this.state.allocate.other_remarks = 'Low Stock'
                                                            // }   
                                                        }

                                                    } else {
                                                        this.setState({ remarks_other: 'hidden' })
                                                        this.state.allocate.remark_id = null
                                                    }
                                                }}
                                                value={this.state.remarks.find((v) => v.id == this.state.remarks_id)}

                                                getOptionLabel={(option) => option.remark ? option.remark : ''}
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

                                            // console.log("droped",this.state.batch_details_data[0])
                                            this.allocate(
                                                this.state.data[this.state.selected_item].id,
                                                "DROPPED",
                                                user.id,
                                                new Date(),
                                                this.state.data[this.state.selected_item]
                                            )
                                        }}>Submit</LoonsButton>
                                    </Grid>
                                </Grid>
                            </div>
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
                    //maxWidth="sm"
                    open={this.state.addItemDialog}
                    onClose={() => { this.setState({ addItemDialog: false }) }}
                >
                    {/* <MuiDialogTitle disableTypography="disableTypography">
                        <CardTitle title="Select Drug" />
                    </MuiDialogTitle> */}
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Select Drug" />

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ addItemDialog: false }) }}>
                            <CloseIcon />
                        </IconButton>

                    </MuiDialogTitle>




                    <div className="w-full h-full  py-5">
                        <ValidatorForm onSubmit={() => this.addSingleItem()} onError={() => null} className="w-full">
                            <Grid className=" w-full px-2" container spacing={2}>
                                <Grid className="w-full" item
                                    lg={6}
                                    md={6}
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

                                                this.setState({ itemAddDialog, itemQuantity: value.quantity }
                                                )

                                            }
                                        }}

                                        getOptionLabel={(option) => option.ItemSnap.sr_no + '-' + option.ItemSnap.medium_description}
                                        renderInput={(params) => (
                                            <TextValidator
                                                {...params}
                                                placeholder="Choose Drug (SR No)"
                                                fullWidth="fullWidth"
                                                variant="outlined"
                                                size="small"
                                                onChange={(e) => {
                                                    console.log("as", e.target.value)
                                                    if (e.target.value.length > 3) {
                                                        this.loadItems(e.target.value)
                                                    }

                                                }}
                                                value={this.state.itemAddDialog.item_id}
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
                                        lg={6} md={6} sm={6} xs={6}
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
                                                this.state
                                                    .itemAddDialog
                                                    .request_quantity
                                            }
                                            onChange={(e, value) => {
                                                let itemAddDialog = this.state.itemAddDialog;
                                                itemAddDialog.request_quantity = e.target.value
                                                this.setState({ itemAddDialog })

                                            }}
                                        /*    validators={[
                                               'maxNumber:' + this.state.itemQuantity
                                           ]}
                                           errorMessages={[
                                               'Cannot Over the Order Qty'
                                           ]} */
                                        />
                                    </Grid>
                                }
                                <Grid className=" w-full " item
                                    lg={12} md={12} sm={12} xs={12}
                                >
                                    <SubTitle title="Reason" />

                                    <TextValidator
                                        className='w-full'
                                        placeholder="Enter reason"
                                        fullWidth
                                        disabled={this.state.itemAddDialog.item_id == null ? true : false}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        value={
                                            this.state
                                                .itemAddDialog
                                                .reason
                                        }
                                        onChange={(e, value) => {
                                            let itemAddDialog = this.state.itemAddDialog;
                                            itemAddDialog.reason = e.target.value
                                            this.setState({ itemAddDialog })

                                        }}
                                    // validators={[
                                    //     'maxNumber:' + this.state.itemQuantity
                                    // ]}
                                    // errorMessages={[
                                    //     'Cannot Over the Order Qty'
                                    // ]}
                                    />
                                </Grid>
                                <Grid className=" w-full" item lg={4} md={4} sm={4} xs={4}>
                                    <Button
                                        variant="contained"
                                        className="mt-2"
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
                                this.setState({
                                    editItemDialogView: false
                                }, ()=>{
                                    this.resetAllocation()
                                })
                                
                            }}
                        >
                            <span className="capitalize">Reset</span>
                        </Button>
                    </div>

                </Dialog>
                <Dialog
                    style={{
                        padding: '10px'
                    }}
                    maxWidth="lg"
                    open={this.state.individualView}
                    onClose={() => {
                        // this.setState({individualView: false})
                    }}>
                    <div className="w-full h-full px-5 py-5">
                        <Grid container="container">
                            <Grid item="item" lg={12} md={12} xs={12} className="mb-4">
                                <LoonsCard>
                                    <Grid container="container">
                                        <Grid item="item" lg={12} md={12} xs={12}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <CardTitle title="Check Stock"></CardTitle>
                                                <IconButton aria-label="close" onClick={() => { this.setState({ individualView: false }) }}><CloseIcon /></IconButton>
                                            </div>
                                        </Grid>

                                        <Grid item="item" lg={12} md={12} xs={12} className="mt-10">
                                            {this.state.loadingSuggestedWarehoues ?
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'suggested'} data={this.state.rows2}
                                                    columns={this.state.suggestedWareHouseColumn}
                                                    options={{
                                                        pagination: true,
                                                        serverSide: true,
                                                        count: this.state.suggestedtotalItems,
                                                        rowsPerPage: 20,
                                                        page: this.state.suggestedWareHouses.page,
                                                        onTableChange: (action, tableState) => {
                                                            console.log(action, tableState)
                                                            switch (action) {
                                                                case 'changePage':
                                                                    this.setSuggestedPage(tableState.page)
                                                                    break
                                                                case 'sort':
                                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                                    break
                                                                default:
                                                                    console.log('action not handled.')
                                                            }
                                                        }
                                                    }}></LoonsTable>
                                                : null}
                                        </Grid>

                                    </Grid>
                                </LoonsCard>
                            </Grid>



                        </Grid>
                    </div>

                </Dialog>


                <PrintIssueNote
                    letterTitle="Issue Note"
                    refferenceSection={false}
                    order_exchange_id={this.props.id.match.params.id}
                    order_exchange_name={this.props.id.match.params.order}
                    //patientInfo={patientInfo}
                    //clinic={clinic}
                    //drugList={checkAvailability(drugList)}
                    date={moment(new Date()).format('yyyy/MM/DD')}
                    address={""}
                    title={"Issue Note"}
                    //letterBody={this.state.letterBody}
                    signature={""}
                    book_no={this.state.book_no}
                    page_no={this.state.page_no}
                    issuringOffiser={this.state.issuringOffiser}
                    orderingOfficer={this.state.orderingOfficer}
                    order_id={this.state.order_id}
                    order_date_time={dateParse(this.state.order_date_time)}
                    PharmacyCode={this.state.PharmacyCode}
                />

                {this.state.logined_user_roles.includes("RMSD MSA") ||
                    this.state.logined_user_roles.includes("RMSD Pharmacist") ||
                    this.state.logined_user_roles.includes("RMSD OIC") ||
                    this.state.logined_user_roles.includes("Super Admin") ||
                    this.state.logined_user_roles.includes('Blood Bank MLT') ||
                    this.state.logined_user_roles.includes("RMSD Distribution Officer") ?
                    // <>
                    // {console.log('checking print data', this.props.id.match.params)}
                    <RMSD_Print
                        letterTitle="Issue Note12"
                        refferenceSection={false}
                        order_exchange_id={this.props.id.match.params.id}
                        order_exchange_name={this.props.id?.match?.params?.order}
                        //patientInfo={patientInfo}
                        //clinic={clinic}
                        //drugList={checkAvailability(drugList)}
                        date={moment(new Date()).format('yyyy/MM/DD')}
                        address={""}
                        title={"Issue Note"}
                        //letterBody={this.state.letterBody}
                        signature={""}
                    />
                    // </>
                    : null}
                {this.state.logined_user_roles.includes("MSD MSA")

                    ?
                    <div>
                        {this.props.id.match.params.type == 'CASH SALES' ?

                            <CashOrderMSD_Print
                                letterTitle="Issue Note"
                                refferenceSection={false}
                                order_exchange_id={this.props.id.match.params.id}
                                order_exchange_name={this.props.id?.match?.params?.order}
                                //patientInfo={patientInfo}
                                //clinic={clinic}
                                //drugList={checkAvailability(drugList)}
                                date={moment(new Date()).format('yyyy/MM/DD')}
                                address={""}
                                title={"Issue Note"}
                                //letterBody={this.state.letterBody}
                                signature={""}
                            />
                            :
                            <MSD_Print
                                letterTitle="Issue Note"
                                refferenceSection={false}
                                order_exchange_id={this.props.id.match.params.id}
                                order_exchange_name={this.props.id?.match?.params?.order}
                                //patientInfo={patientInfo}
                                //clinic={clinic}
                                //drugList={checkAvailability(drugList)}
                                date={moment(new Date()).format('yyyy/MM/DD')}
                                address={""}
                                title={"Issue Note"}
                                //letterBody={this.state.letterBody}
                                signature={""}
                            />
                        }


                    </div>
                    : null
                }




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
            </>
        )
    }
}

export default withStyles(styleSheet)(AllItemsDistribution)
