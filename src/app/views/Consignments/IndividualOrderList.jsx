import React, { Component, Fragment } from "react";
import MainContainer from "../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../components/LoonsLabComponents/CardTitle";
import { Grid, Typography, IconButton, Icon, Dialog, DialogContent, DialogActions, DialogContentText, Divider } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles'
import { LoonsCard, Button, SubTitle, LoonsSnackbar, SwasthaFilePicker } from "../../components/LoonsLabComponents";
import LoonsTable from "../../components/LoonsLabComponents/Table/LoonsTable";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConsignmentService from "../../services/ConsignmentService";
import { convertTocommaSeparated, dateParse, dateTimeParse, roundDecimal } from "utils";
import { JSONTree } from 'react-json-tree';
import ScheduleServices from "../../services/SchedulesServices"
import { CircularProgress } from "@material-ui/core";
import localStorageService from "app/services/localStorageService";
import { compose } from "redux";
import { withRouter } from 'react-router-dom';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { TextField, Tooltip } from "@material-ui/core";
import FeedIcon from '@mui/icons-material/Feed';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import OrderTableRow from './OrderTableRow'
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import PrescriptionService from "app/services/PrescriptionService";


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
});
class IndividualOrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toApprove: false,
            selected: null,
            tableId: '',
            sequence: 1,
            remark: '',
            rejectRemark: null,
            quantity: 0,
            namePatientTableLoad:false,
            namePatientDingleDet:{},
            rejectActivate:false,
            rejectActivateforApproved:false,
            remarkAddViewReject:false,
            remarkAddViewRejectApproved:false,
            user_role: null,

            message: "",
            severity: "success",
            alert: false,
            namePatientDet:[],

            namePatientForm:{
                page:0,
                limit:10,
            },
        
            namePatientCount:null,

            is_name_patient:false,

            statusColumns: [

                {
                    name: 'more_data',
                    label: 'More Details',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            //let id = this.state.data.ConsignmentItems[dataIndex].item_schedule.id;
                            let selectedHistory = this.state.historyData[dataIndex];

                            return (
                                <Grid className="px-2">
                                    <IconButton
                                        onClick={() => {
                                            this.setState({
                                                historyAllView: true,
                                                selectedHistory: selectedHistory,
                                            })
                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
                                </Grid>
                            )

                        },
                    },

                },
          
                {
                    name: 'change_by', // field name in the row object
                    label: 'Edited by',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.historyData[dataIndex]?.change_by ? this.state.historyData[dataIndex]?.change_by : "Not Available";
                            return <p>{data}</p>
                        },
                    },
                },
                {
                    name: 'edited_model',
                    label: 'Edited Model',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.historyData[dataIndex]?.edited_model ? this.state.historyData[dataIndex]?.edited_model : 'Not Available';
                            return <p>{data}</p>
                        },
                    },
                },
            ],

            itemColumns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // let id = this.state.data.ConsignmentItems[dataIndex].id;
                            return (
                                <Grid className="px-2">
                                    <Tooltip title="Filter Schedule">
                                        <IconButton
                                            onClick={() => {
                                                if (this.state.itemData.length > 1) {
                                                    if (this.state.selectedId === this.state.itemData[dataIndex]?.id) {
                                                        this.setState({ selectedId: '' })
                                                        this.filterScheduleData('')
                                                        this.setState({
                                                            alert: true,
                                                            message: "Removing Filters, Showing All Data",
                                                            severity: 'info'
                                                        })
                                                    } else {
                                                        this.setState({ selectedId: this.state.itemData[dataIndex]?.id })
                                                        this.filterScheduleData(this.state.itemData[dataIndex]?.id)
                                                    }
                                                } else {
                                                    this.setState({
                                                        alert: true,
                                                        message: "Cannot use Filter, since there is only one value",
                                                        severity: 'info'
                                                    })
                                                }
                                                // window.location.href = `/spc/consignment/addDetails/${id}`
                                            }}>
                                            <FilterListIcon color={this.state.selectedId === this.state.itemData[dataIndex]?.id ? 'secondary' : 'primary'} />
                                        </IconButton>
                                    </Tooltip>
                                    {/* <Tooltip title="Edit Schedule">
                                        <IconButton
                                            onClick={() => {
                                                this.setState({ selectedId: this.state.itemData[dataIndex]?.id })
                                                this.filterScheduleData(this.state.itemData[dataIndex]?.id)


                                                this.setState({ changeQuantityView: true })
                                                // window.location.href = `/spc/consignment/addDetails/${id}`
                                            }}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </Tooltip> */}

                                   {/* { console.log('cheking table data',this.state.itemData[dataIndex].type)} */}
                                    <Tooltip title="Item Description">
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/item-mst/view-item-mst/${this.state.itemData[dataIndex]?.item_id}`
                                            }}
                                            // className="px-2"
                                            size="small"
                                            aria-label="View Item"
                                            color="primary"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>

                                   

                                    {/* {this.state.itemData[dataIndex].type === 'Name Patient Order' && (
                                            <Tooltip title="View Name Patient">
                                                <IconButton
                                                    onClick={() => {
                                                        // window.location.href = `/item-mst/view-item-mst/${this.state.itemData[dataIndex]?.item_id}`;
                                                            this.loadPatientData()
                                                    }}
                                                    // className="px-2"
                                                    size="small"
                                                    aria-label="View Item"
                                                    color="primary"
                                                >
                                                    <PersonIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )} */}
                                    
                                </Grid>
                            )

                        },
                    },

                },
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR Number',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.ItemSnap.sr_no ? this.state.itemData[tableMeta.rowIndex]?.ItemSnap.sr_no : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'virtual_item_id', // field name in the row object
                    label: 'Virtual Id',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.ItemSnap.virtual_item_id ? this.state.itemData[tableMeta.rowIndex]?.ItemSnap.virtual_item_id : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'name',
                    label: 'SR Description',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.ItemSnap.medium_description ? this.state.itemData[tableMeta.rowIndex]?.ItemSnap.medium_description : "Not Available"}</p>
                            )
                        },
                    },

                },
                {
                    name: 'strength',
                    label: 'Strength',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.ItemSnap.strength ? this.state.itemData[tableMeta.rowIndex]?.ItemSnap.strength : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'unit_price',
                    label: 'Unit Price',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.standard_cost ? convertTocommaSeparated(this.state.itemData[tableMeta.rowIndex]?.standard_cost, 2) : "Not Available"}</p>
                            )
                        },

                    },
                },
                {
                    name: 'requirement_from',
                    label: 'Date From',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.requirement_from ? dateParse(this.state.itemData[tableMeta.rowIndex]?.requirement_from) : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'requirement_to',
                    label: 'Date to',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.requirement_to ? dateParse(this.state.itemData[tableMeta.rowIndex]?.requirement_to) : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'due_order_quantity',
                    label: 'Quantity',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.quantity ? convertTocommaSeparated(this.state.itemData[tableMeta.rowIndex]?.quantity, 0) : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'type',
                    label: 'Type',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.type ? this.state.itemData[tableMeta.rowIndex]?.type : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'quantity',
                    label: 'Quantity',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.quantity ? this.state.itemData[tableMeta.rowIndex]?.quantity : "Not Available"}</p>
                            )
                        },

                    },
                },
                {
                    name: 'no_of_schedules',
                    label: 'No of Schedules',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.OrderListItemSchedules ? this.state.itemData[tableMeta.rowIndex]?.OrderListItemSchedules.length : "Not Available"}</p>
                            )
                        },
                    },
                },
                /*  {
                     name: 'formulatory_approved',
                     label: 'Approved',
                     options: {
                         filter: true,
                         customBodyRender: (value, tableMeta, updateValue) => {
                             return (
                                 <p>{this.state.itemData[tableMeta.rowIndex]?.ItemSnap.formulatory_approved ? this.state.itemData[tableMeta.rowIndex]?.ItemSnap.formulatory_approved : "Not Available"}</p>
                             )
                         },
                     },
                 }, */
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.status ? this.state.itemData[tableMeta.rowIndex]?.status : "Not Available"}</p>
                            )
                        },
                    },
                },

            ],

            availableHistorycolumns: [
                // {
                //     name: 'order_no', // field name in the row object
                //     label: 'Order No', // column title that will be shown in table
                //     options: {
                //         display: true,
                //         filter: false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             console.log('a',this.state.availableHistoryData)
                //             return (
                //                 <span>{this.state.availableHistoryData[tableMeta.rowIndex]?.OrderList?.order_no ? this.state.availableHistoryData[tableMeta.rowIndex]?.OrderList?.order_no : "Not Available"}</span>
                //             )
                //         },
                //     },
                // },
                // {
                //     name: 'type', // field name in the row object
                //     label: 'Type', // column title that will be shown in table
                //     options: {
                //         display: true,
                //         filter: false,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <span>{this.state.availableHistoryData[tableMeta.rowIndex]?.OrderList?.type ? this.state.availableHistoryData[tableMeta.rowIndex]?.OrderList?.type : "Not Available"}</span>
                //             )
                //         },
                //     },
                // },
                {
                    name: 'name', // field name in the row object
                    label: 'Approved User', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.availableHistoryData[tableMeta.rowIndex]?.Employee?.name ? this.state.availableHistoryData[tableMeta.rowIndex]?.Employee?.name : "Not Available"}</span>
                            )
                        },
                    },
                },
                {
                    name: 'designation', // field name in the row object
                    label: 'Approved User Designation', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.availableHistoryData[tableMeta.rowIndex]?.Employee?.designation ? this.state.availableHistoryData[tableMeta.rowIndex]?.Employee?.designation :this.state.availableHistoryData[tableMeta.rowIndex]?.approval_user_type }</span>
                            )
                        },
                    },
                },
                {
                    name: 'approval_type', // field name in the row object
                    label: 'Change or Edited', // column title that will be shown in table
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.availableHistoryData[tableMeta.rowIndex].approval_type ? this.state.availableHistoryData[tableMeta.rowIndex]?.approval_type : "Not Available"}</span>
                            )
                        },
                    },
                },
                // {
                //     name: 'no_of_items', // field name in the row object
                //     label: 'No of Items', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <span>{this.state.availableHistoryData[tableMeta.rowIndex]?.OrderList?.no_of_items ? this.state.availableHistoryData[tableMeta.rowIndex]?.OrderList?.no_of_items : "Not Available"}</span>
                //             )
                //         },
                //     },
                // },
                {
                    name: 'updatedAt', // field name in the row object
                    label: 'Updated Date', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('checking status', this.state.availableHistoryData[tableMeta.rowIndex]?.Employee?.status)

                                return (
                                    <span>{this.state.availableHistoryData[tableMeta.rowIndex]?.Employee?.status ? dateTimeParse(this.state.availableHistoryData[tableMeta.rowIndex]?.updatedAt) : "-"}</span>
                                    // <span>{this.state.availableHistoryData[tableMeta.rowIndex]?.updatedAt ? dateTimeParse(this.state.availableHistoryData[tableMeta.rowIndex]?.updatedAt) : "Not Available"}</span>
                                )

                        },
                    },
                },
                // {
                //     name: 'estimated_value', // field name in the row object
                //     label: 'Estimated Value', // column title that will be shown in table
                //     options: {
                //         filter: false,
                //         display: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return (
                //                 <span>Rs. {this.state.availableHistoryData[tableMeta.rowIndex]?.OrderList?.estimated_value ? roundDecimal(this.state.availableHistoryData[tableMeta.rowIndex]?.OrderList?.estimated_value, 2) : "Not Available"}</span>
                //             )
                //         },
                //     },
                // },
                {
                    name: 'status', // field name in the row object
                    label: 'Approval Status', // column title that will be shown in table
                    options: {
                        filter: false,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <span>{this.state.availableHistoryData[tableMeta.rowIndex]?.Employee?.status ? this.state.availableHistoryData[tableMeta.rowIndex]?.Employee?.status : "Pending"}</span>
                            )
                        },
                    },
                },
                // {
                //     name: 'action',
                //     label: 'Action',
                //     options: {
                //         filter: false,
                //         display: true,
                //         // sort: false,
                //         // empty: true,
                //         // print: false,
                //         // download: false,
                //         customBodyRenderLite: (dataIndex) => {
                //             let order_list_id = this.state.availableHistoryData[dataIndex]?.order_list_id
                //             let sequence = this.state.availableHistoryData[dataIndex]?.sequence ? this.state.data[dataIndex]?.sequence : 1
                //             let id = this.state.availableHistoryData[dataIndex]?.id
                //             // let status = this.state.data[dataIndex].status;
                //             return (
                //                 <Grid className="flex items-center">

                //                     <Grid className="px-2">
                //                         <Tooltip title="View">
                //                             <IconButton
                //                                 onClick={() => {
                //                                     window.location.href = `/order/order-list/${order_list_id}?approve=true&table_id=${id}&sequence=${sequence}`
                //                                 }}
                //                             >
                //                                 <VisibilityIcon color="primary" />
                //                             </IconButton>
                //                         </Tooltip>
                //                     </Grid>
                //                 </Grid>
                //             )
                //         },
                //     },
                // },
            ],

            namePatientDetColumns: [

                {
                    name: 'request_no', 
                    label: 'Request No',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                <p>
                                    { this.state.namePatientDet[tableMeta.rowIndex]?.request_id}
                                </p>
                            )
                        },
                    },
                },

                {
                    name: 'hospital_name', 
                    label: 'Hospital Name',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                <p>
                                    { this.state.namePatientDet[tableMeta.rowIndex]?.Institute?.name}
                                </p>
                            )
                        },
                    },
                },

                {
                    name: 'phn', 
                    label: 'PHN',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                <p>
                                    { this.state.namePatientDet[tableMeta.rowIndex]?.Patient?.phn}
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'patient_name', 
                    label: 'Patient Name',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                <p>
                                    { this.state.namePatientDet[tableMeta.rowIndex]?.Patient?.name}
                                </p>
                            )
                        },
                    },
                },
              

                {
                    name: 'order_qty', 
                    label: 'Order Qty',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                <p>
                                    { this.state.namePatientDet[tableMeta.rowIndex]?.suggested_quantity}
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'approved_qty', 
                    label: 'Approved Qty',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                <p>
                                    { this.state.namePatientDet[tableMeta.rowIndex]?.approved_quantity}
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            // let id = this.state.data.ConsignmentItems[dataIndex].id;
                            return (
                                <Grid className="px-2">
                                    <Tooltip title="View Name Patient">
                                        <IconButton
                                            onClick={() => {
                                                // window.location.href = `/item-mst/view-item-mst/${this.state.itemData[dataIndex]?.item_id}`;
                                                    this.loadPatientSingle(this.state.namePatientDet[dataIndex]?.id)
                                            }}
                                            // className="px-2"
                                            size="small"
                                            aria-label="View Item"
                                            color="primary"
                                        >
                                            <PersonIcon />
                                        </IconButton>
                                    </Tooltip>

                                </Grid>
                            )

                        },
                    },

                },
            ],

            scheduleColumns: [

                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR Number',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('id', this.state.scheduleData[tableMeta.rowIndex]?.id)
                            return (

                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.sr_no ? this.state.scheduleData[tableMeta.rowIndex]?.sr_no : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'name',
                    label: 'SR Description',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.name ? this.state.scheduleData[tableMeta.rowIndex]?.name : "Not Available"}</p>
                            )
                        },
                    },

                },
                {
                    name: 'strength',
                    label: 'Strength',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.strength ? this.state.scheduleData[tableMeta.rowIndex]?.strength : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'unit_price',
                    label: 'Unit Price',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.schedules.standard_cost ? this.state.scheduleData[tableMeta.rowIndex]?.schedules.standard_cost : "Not Available"}</p>
                            )
                        },

                    },
                },
                {
                    name: 'quantity',
                    label: 'Quantity',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.schedules.quantity ? convertTocommaSeparated(this.state.scheduleData[tableMeta.rowIndex]?.schedules.quantity, 0) : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Quantity',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.schedules.allocated_quantity ? this.state.scheduleData[tableMeta.rowIndex]?.schedules.allocated_quantity : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'schedule_date',
                    label: 'Schedule Date',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.schedules.schedule_date ? dateParse(this.state.scheduleData[tableMeta.rowIndex]?.schedules.schedule_date) : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'status',
                    label: 'Status',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.schedules.status ? this.state.scheduleData[tableMeta.rowIndex]?.schedules.status : "Not Available"}</p>
                            )
                        },
                    },
                },
                // {
                //     name: 'action',
                //     label: 'Action',
                //     options: {
                //         display: true,
                //         customBodyRenderLite: (dataIndex) => {
                //             // let id = this.state.data.ConsignmentItems[dataIndex].id;
                //             return (
                //                 <Grid className="px-2">
                //                     <IconButton
                //                         onClick={() => {
                //                             // window.location.href = `/spc/consignment/addDetails/${id}`
                //                         }}>
                //                         <VisibilityIcon color='primary' />
                //                     </IconButton>
                //                 </Grid>
                //             )

                //         },
                //     },

                // }
            ],



            orderData: [],
            itemData: [],
            scheduleData: [],
            totalScheduleData: [],
            filterScheduleData: [],
            orderId: '',
            selectedId: '',
            orderLoaded: false,
            scheduleLoaded: false,

            historyData: [],
            totalHistoryData: [],
            historyLoaded: false,
            historyAllView: false,
            selectedHistory: null,
            availableHistoryData: [],
            isPendingApproval:null,

            isReject:false,
            isRevert:false,

            remarkAddView: false,
            changeQuantityView: false,

            formData: {
                limit: 20,
                page: 0,
                'order[0]': [
                    'updatedAt', 'DESC'
                ]
            },
        }
    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.formData
        formData.page = page
        console.log(page)
        this.setState(
            {
                formData,
            },
            () => {
                this.loadData()
            }
        )
    }

    async setNamePatientPage(page) {
        //Change paginations
        let formData = this.state.namePatientForm
        formData.page = page
        console.log(page)
        this.setState(
            {
                formData,
            },
            () => {
                this.loadPatientData()
            }
        )
    }

    async setApprovePage(page) {
        //Change paginations
        let user_type = await localStorageService.getItem('userInfo').type
        let formData = { order_list_id: this.props.match.params.id, approval_user_type: user_type, 'order[0]': ['updatedAt', 'DESC'] }
        formData.page = page
        console.log(page)
        this.setState(
            {
                formData,
            },
            () => {
                this.loadData()
            }
        )
    }


    // load name patient data

    async loadPatientData(){

        console.log('Ckeckign id',this.props.match.params.id)
        let params = this.state.namePatientForm
        params.order_id = this.props.match.params.id

        let res = await PrescriptionService.fetchNPRrequests(params)

        if(res.status === 200){
            console.log('Ckeckign data',res)
            this.setState({
                namePatientDet:res.data.view.data,
                namePatientTableLoad:true,
                namePatientCount:res.data.view.totalItems
            })
        }
    }

    async loadPatientSingle(id){

        console.log('Ckeckign id',this.props.match.params.id)
        // let params = this.state.namePatientForm
        // params.order_id = this.props.match.params.id

        let res = await PrescriptionService.fetchNPRequestById(id)

        if(res.status === 200){
            console.log('Ckeckign dingle data',res)
            this.setState({
                namePatientDingleDet:res.data.view,
                is_name_patient:true
            })
        }
    }


    // for avaiale history
    async getData() {

        this.setState({ loaded: false })
        let user_type = await localStorageService.getItem('userInfo').type
        let formData = { order_list_id: this.props.match.params.id, limit: 10,page:0, 'order[0]': ['sequence', 'ASC'], }

        let res = await ScheduleServices.getOrderListApprovals(formData)
        if (res.status == 200) {
            console.log('load data', res.data.view.data)
            this.setState(
                {
                    loaded: true,
                    availableHistoryData: res.data.view.data,
                    // totalPages: res.data.view.totalPages,
                    // totalItems: res.data.view.totalItems,
                },
                () => {
                    this.render()
                }
            )
        }
        console.log('ddatatatatata', this.state.availableHistoryData)
        // this.setState({
        //     totalOrder: this.state.data.length,
        // })
    }

    async loadData() {
        // console.log('ID: ', this.props.match.params.id)
        // let orderId = '56aadf1f-9287-460d-9f8d-812406c4ddc0';
        let formData = this.state.formData;
        let res = await ScheduleServices.getOrderListByID(formData, this.state.orderId)
        if (res.status === 200) {
            console.log('status', res)
            this.setState({
                orderData: res.data.view,
                itemData: res.data.view ? res.data.view.OrderListItems : [],
            }, ()=>{
                this.makeRejectedForApproved()
                if (res.data.view.type === 'Name Patient Order') {
                    this.loadPatientData()
                } else {
                    this.setState({
                        namePatientTableLoad:false
                    })
                }
            })
        }
        console.log("Data: ", res.data.view)
        this.setState({ orderLoaded: true })
        this.loadScheduleData()
    }

    loadScheduleData() {
        let updatedScheduleData = [];
        this.state.itemData && this.state.itemData.forEach(val => {
            val.OrderListItemSchedules.forEach(data => {
                const updatedData = {
                    id: val.id,
                    sr_no: val?.ItemSnap.sr_no,
                    name: val?.ItemSnap.short_description,
                    strength: val?.ItemSnap.strength,
                    schedules: data
                };
                updatedScheduleData.push(updatedData);
            });
        });

        this.setState({ filterScheduleData: updatedScheduleData.slice(0, this.state.formData.limit), totalScheduleData: updatedScheduleData, scheduleData: updatedScheduleData, scheduleLoaded: true });
        console.log("Order: ", updatedScheduleData)
        if (this.state.itemData.length === 1) {
            this.setState({ selectedId: this.state.itemData[0].id })
        }
    }

    filterScheduleData(id) {
        const filteredData = this.state.totalScheduleData.filter(item => item.id === id);
        const startIndex = this.state.formData.page * this.state.formData.limit;
        const endIndex = startIndex + this.state.formData.limit;


        if (id !== '') {
            console.log('abc', filteredData)
            this.setState({ filterScheduleData: filteredData, scheduleData: filteredData })
        } else {
            console.log('abc', filteredData)
            this.setState({ filterScheduleData: this.state.totalScheduleData, scheduleData: this.state.totalScheduleData })
        }

        const newData = this.state.filterScheduleData.slice(startIndex, endIndex);

        this.setState({ filterScheduleData: newData })
    }

    async loadHistory() {
        // "2551e9fc-3818-45b1-ae08-fee2302011f9"
        let formData = { ...this.state.formData, order_list_id: this.props.match.params.id }
        let res = await ScheduleServices.getOrderListHistory(formData)
        if (res.status === 200) {
            console.log("res", res)
            this.setState({ historyData: res.data.view.data })
            // console.log("History Data: ", res.data.view.data)
        }
        console.log("his", this.state.historyData)
        this.setState({ historyLoaded: true })
    }

    async rejectOrder() {
        this.setState({ remarkAddViewReject: false })
        let user_id = await localStorageService.getItem('userInfo').id
        let formData = {
            order_list_id: this.state.orderId,
            //approval_type: "Approved",
            status: "REJECTED",

            approved_by: user_id,
            remark: this.state.rejectRemark,
            owner_id: "000",
            sequence: this.state.sequence,
        }

        console.log('cheking dormdata', formData)

        // console.log("FormData: ", formData)
        let res = await ScheduleServices.changeOrderListApprovals(formData, this.state.tableId)
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: "Order has been Rejected",
                severity: 'success',
                toApprove: false,
            })
            setTimeout(() => {
                // this.props.history.goBack()
                window.location = '/order/order-list'
            }, 2000);
        } else {
            this.setState({
                alert: true,
                message: "Order was failed to get Rejected",
                severity: 'error'
            })
        }
        console.log(user_id, this.state.toApprove, this.state.orderId)
    }


    async rejectApprovedOrder() {
        this.setState({ remarkAddViewRejectApproved: false })
        let user_id = await localStorageService.getItem('userInfo').id

        let formData = this.state.orderData
        formData.status = "REJECTED"

        console.log('cheking dormdata foofdooof', formData)

        console.log("FormData: ", formData)
        let res = await ScheduleServices.putOrderListByID(this.state.orderData?.id, formData)
        if (res.status === 200) {
            this.setState({
                alert: true,
                message: "Order has been Rejected",
                severity: 'success',
                toApprove: false,
            })
            setTimeout(() => {
                window.location = '/order/order-list'
            }, 2000);
        } else {
            this.setState({
                alert: true,
                message: "Order was failed to get Rejected",
                severity: 'error'
            })
        }
        console.log(user_id, this.state.toApprove, this.state.orderId)
    }

    async approveOrder() {
        this.setState({ remarkAddView: false })
        let user_id = await localStorageService.getItem('userInfo').id

        let formData 
        if (this.state.isReject) {
            formData = {
                order_list_id: this.state.orderId,
                //approval_type: "Approved",
                status: "REJECTED",
    
                approved_by: user_id,
                remark: this.state.remark,
                owner_id: "000",
                sequence: this.state.sequence,
            }
        } else if (this.state.isRevert) {
            formData = {
                order_list_id: this.state.orderId,
                //approval_type: "Approved",
                status: "REVERT",
    
                approved_by: user_id,
                remark: this.state.remark,
                owner_id: "000",
                sequence: this.state.sequence,
            }
        } else {
            formData = {
                order_list_id: this.state.orderId,
                //approval_type: "Approved",
                status: "APPROVED",
    
                approved_by: user_id,
                remark: this.state.remark,
                owner_id: "000",
                sequence: this.state.sequence,
            }
        }


        console.log("FormData: ", formData)
        let res = await ScheduleServices.changeOrderListApprovals(formData, this.state.tableId)
        if (res.status === 200) {
            if (this.state.isReject){
                this.setState({
                    alert: true,
                    message: "Order has been Rejected",
                    severity: 'success',
                    toApprove: false,
                })
            } else if (this.state.isRevert) {
                this.setState({
                    alert: true,
                    message: "Order has been Reverted",
                    severity: 'success',
                    toApprove: false,
                })
            } else {
                this.setState({
                    alert: true,
                    message: "Order has been Approved",
                    severity: 'success',
                    toApprove: false,
                })
            }
            
            setTimeout(() => {
                // this.props.history.goBack()
                window.location = '/order/order-list'
            }, 2000);
        } else {

            if (this.state.isReject){
                this.setState({
                    alert: true,
                    message: "Order was failed to get Rejected",
                    severity: 'error'
                })
            } else if (this.state.isRevert) {
                this.setState({
                    alert: true,
                    message: "Order was failed to get Reverted",
                    severity: 'error'
                })
            } else {
                this.setState({
                    alert: true,
                    message: "Order was failed to get Approved",
                    severity: 'error'
                })
            }

            
        }
        // console.log(user_id, this.state.toApprove, this.state.orderId)
    }

    async makeRejectedForApproved(){
        let user_role = await localStorageService.getItem('userInfo').roles[0]

        console.log('checking this.state.isPendingApproval', this.state.isPendingApproval)

        if (user_role === "MSD Director" && this.state.orderData.status === "APPROVED" && this.state.isPendingApproval == null ) {
            this.setState({
                rejectActivateforApproved: true
            })
        } 

        if (user_role === "MSD Director" && this.state.isPendingApproval === 'true'){
            this.setState({
                rejectActivate: true
            })
        }
    }

    async componentDidMount() {
        // Access the Params that have been passed
        const params = new URLSearchParams(this.props.location.search);

        let pendingApproval = new URLSearchParams(this.props.location.search).get('approve')

        let user = await localStorageService.getItem('userInfo')

        let id = this.props.match.params.id;
        this.setState({
            orderId: id,
            toApprove: params.get('approve') ? params.get('approve') : false,
            tableId: params.get('table_id') ? params.get('table_id') : '',
            sequence: params.get('sequence') ? params.get('sequence') : 1,
            isPendingApproval:pendingApproval,
            user_role : user.roles[0]
        }, () => {
            this.loadData()
            this.loadHistory()
            this.getData()
            
        })
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={this.state.toApprove ? "Order Details" : "Order Details"} />
                        {this.state.orderLoaded ?
                            <Grid container spacing={1} className="flex ">
                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                    <Typography className="mt-5"
                                        variant="subtitle1">{`Order List No: ${this.state.orderData?.order_no ? this.state.orderData?.order_no : "Not Available"}`}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                    <Typography className="mt-5"
                                        variant="subtitle1">{`Order Date: ${this.state.orderData?.order_date ? dateParse(this.state.orderData?.order_date) : "Not Available"}`}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                    <Typography className="mt-5"
                                        variant="subtitle1">{`No of Items: ${this.state.orderData?.no_of_items ? this.state.orderData?.no_of_items : "Not Available"}`}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                    <Typography className="mt-5"
                                        variant="subtitle1">{`Status: ${this.state.orderData?.status ? this.state.orderData?.status : "Not Available"}`}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                    <Typography className="mt-5"
                                        variant="subtitle1">{`Type: ${this.state.orderData?.type ? this.state.orderData?.type : "Not Available"}`}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={6}>
                                    <Typography className="mt-5"
                                        variant="subtitle1">{`Created By: ${this.state.orderData?.Employee ? this.state.orderData?.Employee?.name + '(' + this.state.orderData?.Employee?.designation + ')' : "Not Available"}`}</Typography>
                                </Grid>
                                <Grid item lg={4} md={4} sm={6} xs={6} className="mb-10">
                                    <Typography className="mt-5"
                                        variant="subtitle1">{`Estimated Value: Rs. ${this.state.orderData?.estimated_value ? convertTocommaSeparated(this.state.orderData?.estimated_value, 2) : "Not Available"}`}</Typography>
                                </Grid>
                              
                              <Grid spacing={2} className="justify-end" container style={{display: 'flex' ,
                                    flexDirection: 'row'}} >
                                 {this.state.toApprove &&
                                    (
                                        <Grid item  >
                                            <Button
                                                onClick={() => { this.setState({ remarkAddView: true, isReject:false, isRevert:false }) }}
                                            >
                                                Approve
                                            </Button>
                                        </Grid>
                                    )
                                }
                                {this.state.user_role === 'HSCO' || this.state.user_role === 'MSD AD' || this.state.orderData?.status !== "REJECTED" ?
                                    (
                                        <Grid item  >
                                            <Button
                                                onClick={() => { this.setState({ remarkAddView: true, isReject:true, isRevert:false }) }}
                                                style={{background:'red'}}
                                            >
                                                Reject
                                            </Button>
                                        </Grid>
                                    ) : null
                                }
                                {this.state.orderData?.type === "Name Patient Order" && this.state.user_role === 'HSCO' &&
                                    (
                                        <Grid item  >
                                            <Button
                                            style={{background:'orange'}}
                                                onClick={() => { this.setState({ remarkAddView: true, isRevert : true, isReject:false }) }}
                                            >
                                                Revert
                                            </Button>
                                        </Grid>
                                    )
                                }
                                { this.state.rejectActivate && 
                                  (
                                    <Grid item  >
                                        <Button
                                            style={{background:'red'}}
                                            onClick={() => { this.setState({
                                                remarkAddViewReject:true
                                            }) }}
                                        >
                                            Reject
                                        </Button>
                                    </Grid>
                                    )
                                }

                                { this.state.rejectActivateforApproved && 
                                  (
                                    <Grid item >
                                        <Button
                                            style={{background:'red'}}
                                            onClick={() => { this.setState({
                                                remarkAddViewRejectApproved:true
                                            }) }}
                                        >
                                            Reject
                                        </Button>
                                    </Grid>
                                    )
                                }
                                
                              </Grid>
                               
                               
                               
                            </Grid>
                            : (
                                <Grid className='justify-center text-center w-full pt-12'>
                                    <CircularProgress size={30} />
                                </Grid>
                            )}
                    </LoonsCard>
                    <Grid style={{ marginTop: 20 }}>
                        < LoonsCard>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <CardTitle title={"Item Details"} />
                            </Grid>
                            <Grid style={{
                                borderStyle: 'solid 0.9',
                                borderColor: 'rgba(52, 152, 219,1.0)',
                                backgroundColor: 'rgba(52, 152, 219,0.5)'
                            }} className="mt-5" item lg={12} md={12} sm={12} xs={12}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Total Items: ${this.state.orderData ? this.state.orderData.no_of_items : "Not Available"}`}</Typography>
                            </Grid>
                            {this.state.orderLoaded ?
                                <div className="mt-0">
                                    <LoonsTable
                                        id={"itemDetails"}
                                        data={this.state.itemData}
                                        columns={this.state.itemColumns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.itemData.length,
                                            rowsPerPage: this.state.formData.limit,
                                            page: this.state.formData.page,

                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPage(tableState.page)
                                                        break
                                                    case 'sort':
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </div>
                                : (
                                    <Grid className='justify-center text-center w-full pt-12'>
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                        </LoonsCard>
                    </Grid>

                    {this.state.namePatientTableLoad && (
                    <Grid style={{ marginTop: 20 }}>
                        < LoonsCard>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <CardTitle title={"Name Patient Details"} />
                            </Grid>
                     
                            {this.state.namePatientTableLoad ?
                                <div className="mt-0">
                                    <LoonsTable
                                        id={"itemDetails"}
                                        data={this.state.namePatientDet}
                                        columns={this.state.namePatientDetColumns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.namePatientCount,
                                            rowsPerPage: this.state.namePatientForm.limit,
                                            page: this.state.namePatientForm.page,

                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setNamePatientPage(tableState.page)
                                                        break
                                                    case 'sort':
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </div>
                                : (
                                    <Grid className='justify-center text-center w-full pt-12'>
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                        </LoonsCard>
                    </Grid>
                    )}

                    <Grid style={{ marginTop: 20 }}>
                        < LoonsCard>
                            <CardTitle title={"Schedule Details"} />
                            {this.state.scheduleLoaded ?
                                <div className="mt-0">
                                    <LoonsTable
                                        id={"scheduleDetails"}
                                        data={this.state.filterScheduleData}
                                        columns={this.state.scheduleColumns}
                                        options={{
                                            pagination: true,
                                            serverSide: false,
                                            count: this.state.scheduleData.length,
                                            rowsPerPage: this.state.formData.limit,
                                            page: this.state.formData.page,
                                            rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        const page = tableState.page;
                                                        const rowsPerPage = tableState.rowsPerPage;
                                                        const startIndex = page * rowsPerPage;
                                                        const endIndex = startIndex + rowsPerPage;
                                                        this.setState({
                                                            formData: {
                                                                ...this.state.formData,
                                                                page: page
                                                            },
                                                            filterScheduleData: this.state.scheduleData.slice(startIndex, endIndex)
                                                        });

                                                        break
                                                    case 'changeRowsPerPage':
                                                        this.setState({
                                                            formData: {
                                                                ...this.state.formData,
                                                                page: 0,
                                                                limit: tableState.rowsPerPage
                                                            },
                                                            filterScheduleData: this.state.scheduleData.slice(0, tableState.rowsPerPage)
                                                        });
                                                        break;
                                                    case 'sort':
                                                        break
                                                    default:
                                                        console.log(
                                                            'action not handled.'
                                                        )
                                                }
                                            },
                                        }}
                                    ></LoonsTable>
                                </div>
                                : (
                                    <Grid className='justify-center text-center w-full pt-12'>
                                        <CircularProgress size={30} />
                                    </Grid>
                                )}
                        </LoonsCard>
                    </Grid>

                    <Grid style={{ marginTop: 20 }}>
                        <LoonsCard>
                            <SwasthaFilePicker
                                uploadingSectionVisibility={true}
                                id="file_public"
                                singleFileEnable={true}
                                multipleFileEnable={false}
                                dragAndDropEnable={true}
                                tableEnable={true}

                                documentName={true}//document name enable
                                documentNameValidation={['required']}
                                documenterrorMessages={['this field is required']}
                                documentNameDefaultValue={null}//document name default value. if not value set null
                                label="uploads"
                                type={false}  //req
                                types={null}
                                typeValidation={null}
                                typeErrorMessages={null}
                                defaultType={null}// null

                                description={true}
                                descriptionValidation={null}
                                descriptionErrorMessages={null}
                                defaultDescription={null}//null

                                onlyMeEnable={false}
                                defaultOnlyMe={false}

                                source="OrderList"
                                source_id={this.props.match.params.id}

                                //accept="image/png"
                                // maxFileSize={1048576}
                                // maxTotalFileSize={1048576}
                                maxFilesCount={1}
                                validators={[
                                    'required',
                                    // 'maxSize',
                                    // 'maxTotalFileSize',
                                    // 'maxFileCount',
                                ]}
                                errorMessages={[
                                    'this field is required',
                                    // 'file size too lage',
                                    // 'Total file size is too lage',
                                    // 'Too many files added',
                                ]}
                                /* selectedFileList={
                                    this.state.data.fileList
                                } */
                                // label="Select Attachment"
                                singleFileButtonText="Upload Data"
                            // multipleFileButtonText="Select Files"



                            ></SwasthaFilePicker>
                        </LoonsCard>
                    </Grid>

                    <Grid container flex style={{ marginTop: 20 }} spacing={2} direction="row">
                        <Grid item sm={6}>
                            < LoonsCard>
                                <CardTitle title={"Order Edit History"} />
                                {this.state.historyLoaded ?
                                    <div className="mt-0">
                                        <LoonsTable
                                            id={"statusHistory"}
                                            data={this.state.historyData}
                                            columns={this.state.statusColumns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                count: this.state.historyData.length,
                                                rowsPerPage: this.state.formData.limit,
                                                page: this.state.formData.page,

                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setPage(tableState.page)
                                                            break
                                                        case 'sort':
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        ></LoonsTable>
                                    </div>
                                    : (
                                        <Grid className='justify-center text-center w-full pt-12'>
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )}
                            </LoonsCard>
                        </Grid>
                        {/* Aproval history table */}
                        <Grid item sm={6}>
                            < LoonsCard>
                                <CardTitle title={"Approval History"} />
                                {this.state.historyLoaded ?

                                    <div className="mt-0">
                                        <LoonsTable
                                            id={"approvalHistory"}
                                            data={this.state.availableHistoryData}
                                            columns={this.state.availableHistorycolumns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                // count: this.state.historyData.length,
                                                // rowsPerPage: this.state.formData.limit,
                                                // page: this.state.formData.page,

                                                onTableChange: (action, tableState) => {
                                                    switch (action) {
                                                        case 'changePage':
                                                            this.setApprovePage(tableState.page)
                                                            break
                                                        case 'sort':
                                                            break
                                                        default:
                                                            console.log(
                                                                'action not handled.'
                                                            )
                                                    }
                                                },
                                            }}
                                        ></LoonsTable>
                                    </div>
                                    : (
                                        <Grid className='justify-center text-center w-full pt-12'>
                                            <CircularProgress size={30} />
                                        </Grid>
                                    )}
                            </LoonsCard>

                        </Grid>

                    </Grid>
                </MainContainer>
                <Dialog fullScreen maxWidth="lg " open={this.state.historyAllView} onClose={() => { this.setState({ historyAllView: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="History Details" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    historyAllView: false
                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                        <Grid container>
                            <Grid item lg={12} xs={12} sm={12} md={12}>
                                <SubTitle title="Details: "></SubTitle>
                                <JSONTree data={this.state.selectedHistory?.data} />
                            </Grid>

                            {/* <Grid item lg={6}>
                                <SubTitle title="New Data"></SubTitle>
                                <JSONTree data={this.state.selectedHistory?.new_data} />
                            </Grid> */}
                        </Grid>
                    </MainContainer>
                </Dialog>
                <Dialog open={this.state.remarkAddView} onClose={() => { this.setState({ remarkAddView: false }) }} fullWidth
                    maxWidth='sm'>
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Add Remark" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    remarkAddView: false
                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To approve the order, please enter a remark here.
                        </DialogContentText>
                        <TextField
                            id="outlined-multiline-static"
                            placeholder="Remark"
                            multiline
                            maxRows={4}
                            fullWidth
                            value={this.state.remark}
                            onChange={(e) => this.setState({ remark: e.target.value })}
                        // onKeyUp={sendMessageOnEnter}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => this.setState({ remarkAddView: false })}>Cancel</Button>
                        {this.state.remark !== '' &&
                            <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => this.approveOrder()}>{this.state.isReject ? 'Reject' : (this.state.isRevert ? 'Revert' : 'Approve') }</Button>
                        }
                    </DialogActions>
                </Dialog>
                {/* for reject */}
                <Dialog open={this.state.remarkAddViewReject} onClose={() => { this.setState({ remarkAddViewReject: false }) }} fullWidth
                    maxWidth='sm'>
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Add Remark" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    remarkAddViewReject: false
                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To reject the order, please enter a remark here.
                        </DialogContentText>
                        <TextField
                            id="outlined-multiline-static"
                            placeholder="Remark"
                            multiline
                            maxRows={4}
                            fullWidth
                            value={this.state.rejectRemark}
                            onChange={(e) => this.setState({ rejectRemark: e.target.value })}
                        // onKeyUp={sendMessageOnEnter}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => this.setState({ remarkAddViewReject: false })}>Cancel</Button>
                        {this.state.rejectRemark !== null &&
                            <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => this.rejectOrder()}>Reject</Button>
                        }
                    </DialogActions>
                </Dialog>
                
                <Dialog open={this.state.remarkAddViewRejectApproved} onClose={() => { this.setState({ remarkAddViewRejectApproved: false }) }} fullWidth
                    maxWidth='sm'>
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Add Remark" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    remarkAddViewRejectApproved: false
                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To reject the order, please enter a remark here.
                        </DialogContentText>
                        <TextField
                            id="outlined-multiline-static"
                            placeholder="Remark"
                            multiline
                            maxRows={4}
                            fullWidth
                            value={this.state.rejectRemark}
                            onChange={(e) => this.setState({ rejectRemark: e.target.value })}
                        // onKeyUp={sendMessageOnEnter}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => this.setState({ remarkAddViewRejectApproved: false })}>Cancel</Button>
                        {this.state.rejectRemark !== null &&
                            <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => this.rejectApprovedOrder()}>Reject</Button>
                        }
                    </DialogActions>
                </Dialog>
                <Dialog open={this.state.changeQuantityView} onClose={() => { this.setState({ changeQuantityView: false }) }} fullWidth
                    maxWidth='md'>
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Change Quantity" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    changeQuantityView: false
                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <DialogContent>
                        {/* <DialogContentText>
                            To change the order quantiy, please change the quantity here.
                        </DialogContentText> */}
                        {this.state.selected ? (
                            <ValidatorForm>
                                <Typography variant="body2">Quantity</Typography>
                                <TextValidator
                                    // key={this.state.key}
                                    className=" w-full"
                                    placeholder="Quantity"
                                    name="quantity"
                                    InputLabelProps={{
                                        shrink: false,
                                    }}
                                    value={String(this.state.quantity)}
                                    type="number"
                                    variant="outlined"
                                    size="small"
                                    min={0}
                                    onChange={(event) => {
                                        let quantity = this.state.quantity
                                        if (event.target.value) {
                                            quantity = parseInt(event.target.value, 10)
                                        } else {
                                            quantity = 0
                                        }

                                        this.setState({ quantity })
                                    }}
                                    validators={
                                        ['minNumber:' + 0, 'required:' + true]}
                                    errorMessages={[
                                        'Quantity Should be > 0',
                                        'this field is required'
                                    ]}
                                />
                                <br />
                            </ValidatorForm>
                        ) :
                            (
                                <>
                                    <Typography variant="h5">Quantity : {this.state.quantity}</Typography>
                                    <br />
                                </>
                            )}
                        {this.state.selected ? (
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                <Button variant="contained" color="primary" size="small" onClick={() => { this.setState({ selected: false }) }}>
                                    <SaveIcon />
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: "flex", justifyContent: "flex-end" }}>

                                <Button className={classes.btn} variant="contained" color="primary" size="small" onClick={() => {
                                    this.setState({ selected: true })
                                }}>
                                    <EditIcon fontSize="small" />
                                </Button>
                            </div>
                        )}
                        <OrderTableRow data={this.state.scheduleData} />
                    </DialogContent>
                    <DialogActions>
                        <Button size="small" variant="contained" style={{ background: '#ff005d', color: 'white' }} onClick={() => this.setState({ changeQuantityView: false })}>Cancel</Button>
                        {this.state.remark !== '' &&
                            <Button size="small" variant="contained" style={{ background: '#00cbff', color: 'white' }} onClick={() => this.approveOrder()}>Approve</Button>
                        }
                    </DialogActions>
                </Dialog>


                <Dialog fullWidth maxWidth="lg" open={this.state.is_name_patient} spacing={2}  className="p-5">

                    <div className='ml-5 mr-5 mt-5' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CardTitle title="Name Patient View"/> 
                        <IconButton aria-label="close" onClick={() => { this.setState({ is_name_patient: false }) }}><CloseIcon /></IconButton>
                    </div>
                    <Divider></Divider>
                    <div className="w-full h-full px-5">

                            <h6 className="mt-3">Request No : {this.state.namePatientDingleDet?.request_id}</h6>
                            <br></br>
                            <h6 className="mt-3">Patient Details</h6>
                            <Grid container spacing={2} className="mb-5">
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Name</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Patient?.title}{' '+this.state.namePatientDingleDet?.Patient?.name}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Address</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Patient?.address}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Gender</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Patient?.gender}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>PHN</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Patient?.phn}</td>
                                        </tr>
                                    </table>
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>NIC</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Patient?.nic}</td>
                                        </tr>
                                    </table>
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Contact</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Patient?.contact_no}</td>
                                        </tr>
                                    </table>
                                </Grid>

                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Citizenship</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Patient?.citizenship}</td>
                                        </tr>
                                    </table>
                                </Grid>

                            </Grid>

                            <Divider></Divider>

                            <h6 className="mt-3">Common Details</h6>
                            <Grid container spacing={2} className="mb-5">
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Clinic/Ward</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Pharmacy_drugs_store?.name}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>BHT No</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.bht_no}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Consultant</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.Employee?.name}</td>
                                        </tr>
                                    </table>
                                </Grid>
                            </Grid>

                            <Divider></Divider>

                            <h6 className="mt-3">Drug Details</h6>
                            <Grid container spacing={2} className="mb-5">
                                <Grid item md={12} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'25%'}}>Drug Name</td>
                                            <td style={{width:'75%'}}>: {this.state.namePatientDingleDet?.item_name}</td>
                                        </tr>
                                    </table>
                                </Grid>
                              
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Dose</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.dose + ' mg'}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Freq</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.DefaultFrequency?.name}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Duration</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.duration + ' Days'}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Expected Treatment Date</td>
                                            <td style={{width:'50%'}}>: {dateParse(this.state.namePatientDingleDet?.expected_treatment_date)}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Quantity</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.suggested_quantity}</td>
                                        </tr>
                                    </table>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <table style={{width:'100%'}}>
                                        <tr>
                                            <td style={{width:'50%'}}>Approved Quantity</td>
                                            <td style={{width:'50%'}}>: {this.state.namePatientDingleDet?.approved_quantity}</td>
                                        </tr>
                                    </table>
                                </Grid>
                            </Grid>

                    
                    </div>

                    </Dialog>                               
                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={2000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"
                ></LoonsSnackbar>
            </Fragment >
        )
    }
}

export default compose(
    withStyles(styleSheet),
    withRouter
)(IndividualOrderList);