import React, { Component, Fragment } from "react";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import CardTitle from "app/components/LoonsLabComponents/CardTitle";
import { Grid, Typography, IconButton, Icon, Dialog, CircularProgress } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles'
import { LoonsCard, Button, SubTitle, PrintHandleBar, LoonsSnackbar, LoonsDialogBox } from "app/components/LoonsLabComponents";
import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import LoonsTable from "app/components/LoonsLabComponents/Table/LoonsTable";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConsignmentService from "app/services/ConsignmentService";
import FinanceDocumentServices from "app/services/FinanceDocumentServices"
import { dateParse, dateTimeParse } from "utils";
import { JSONTree } from 'react-json-tree';
import localStorageService from "app/services/localStorageService";
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { Autocomplete, Alert } from "@material-ui/lab";
import AddIcon from '@material-ui/icons/Add';

import WarehouseServices from "app/services/WarehouseServices";

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

class ViewConsignment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creatingGrn: false,
            totalItems: 0,
            loaded: false,
            warning_msg: false,
            historyLoaded: false,
            historyAllView: false,
            selectedHistory: null,
            consignmentId: '',
            dabitNote: null,
            debitNoteView: false,
            is_item_batch_available: [],
            filterData: {
                page: 0,
                limit: 20,
            },

            statusManagementColumns: [
                {
                    name: 'more_data',
                    label: 'More Details',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            //let id = this.state.data.ConsignmentItems[dataIndex].item_schedule.id;
                            let selectedHistory = this.state.consignmentHistoryData[dataIndex];
                            return (
                                <Grid className="px-2">
                                    <Tooltip title="View History">
                                        <IconButton
                                            onClick={() => {
                                                this.setState({
                                                    historyAllView: true,
                                                    selectedHistory: selectedHistory,
                                                })
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },
                {
                    name: 'person_name', // field name in the row object
                    label: 'Person Name',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.consignmentHistoryData[dataIndex].Employee.name;
                            return <p>{data}</p>

                        },
                    },
                },
                {
                    name: 'designation',
                    label: 'Designation',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.consignmentHistoryData[dataIndex].Employee.designation;
                            return <p>{data}</p>

                        },
                    },

                },

                {
                    name: 'date',
                    label: 'Date and Time',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.consignmentHistoryData[dataIndex].createdAt;
                            return <p>{dateTimeParse(data)}</p>

                        },
                    },
                },
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.consignmentHistoryData[dataIndex].action;
                            return <p>{data}</p>

                        },
                    },
                },
            ],
            itemDetailColumns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {

                            let id = this.state.data.ConsignmentItems[dataIndex].item_schedule.id;
                            //  console.log("aaa", this.state.data.ConsignmentItems[dataIndex])
                            return (
                                <Grid className="px-2">
                                    <Tooltip title="Add GRN Item Details">
                                        <IconButton
                                            onClick={() => {
                                                // window.location.href = `/spc/consignment/addDetails/${id}`
                                                if (this.state.is_item_batch_available.length > 0 && this.state.is_item_batch_available[dataIndex]) {
                                                    if (this.state.isGRNCreated) {
                                                        this.setState({
                                                            batchView: true,
                                                            selected_item_status: this.state.data.ConsignmentItems[dataIndex].validate,
                                                            selectedConsignmentItem: id
                                                        }, () => {
                                                            this.loadConsignmentItemsById(this.state.data.ConsignmentItems[dataIndex].id)
                                                        })
                                                    } else {
                                                        this.setState({
                                                            alert: true,
                                                            severity: 'warning',
                                                            message: 'Please create a GRN',
                                                        })
                                                    }
                                                }
                                                else {
                                                    this.setState({
                                                        alert: true,
                                                        severity: 'warning',
                                                        message: 'Please add some Item Batches to view it from here',
                                                    })
                                                }
                                            }}>
                                            <AddIcon color={this.state.is_item_batch_available.length > 0 && this.state.is_item_batch_available[dataIndex] ? this.state.isGRNCreated ? 'primary' : 'secondary' : 'error'} />
                                        </IconButton>
                                    </Tooltip>
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
                                <p>{this.state.data.ConsignmentItems[tableMeta.rowIndex].item_schedule.Order_item.item.sr_no}</p>
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
                                <p> {this.state.data.ConsignmentItems[tableMeta.rowIndex].item_schedule.Order_item.item.name} </p>
                            )
                        },
                    },
                },
                {
                    name: 'specification',
                    label: 'Specification',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p> {this.state.data.ConsignmentItems[tableMeta.rowIndex].item_schedule.Order_item.item.specification} </p>
                            )
                        },
                    },
                },
                {
                    name: 'priority',
                    label: 'Priority',
                    options: {
                        filter: true,
                        display: false,
                    },
                },
                {
                    name: 'packing',
                    label: 'Packing',
                    options: {
                        filter: true,
                        display: false,
                    },
                },
                {
                    name: 'unit_price',
                    label: 'Unit Price',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <div>
                                    {this.state.data.ConsignmentItems[tableMeta.rowIndex].Batch.map(value1 => (
                                        value1.unit_price + " "
                                    ))}
                                </div>
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
                                <p>
                                    {dateParse(this.state.data.ConsignmentItems[tableMeta.rowIndex].item_schedule.schedule_date)}
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'delivery_date',
                    label: 'Delivery Date',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p> {dateParse(this.state.data.delivery_date)} </p>
                            )
                        },
                    },
                },
                {
                    name: 'quantity',
                    label: 'Order Quantity',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p> {this.state.data.ConsignmentItems[tableMeta.rowIndex].item_schedule.Order_item.quantity} </p>
                            )
                        },
                    },
                },
                {
                    name: 'quantity',
                    label: 'Schedule Quantity',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p> {this.state.data.ConsignmentItems[tableMeta.rowIndex].item_schedule.quantity} </p>
                            )
                        },
                    },
                },
                {
                    name: 'quantity',
                    label: 'Recieving Quantity',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'order_value',
                    label: 'Order Value',
                    options: {
                        filter: true,
                        display: false,
                    },
                },
                {
                    name: 'date_of_arrival',
                    label: 'Date of arrival',
                    options: {
                        filter: true,
                        display: false,
                    },
                },
                {
                    name: 'delivery_value',
                    label: 'Delivery Value',
                    options: {
                        filter: true,
                        display: false,
                    },
                },
                {
                    name: 'no_of_container',
                    label: 'No.of Containers/Cartoons/quantity',
                    options: {
                        filter: true,
                        display: false,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p> {this.state.data.ConsignmentContainers.length} </p>
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
                                <p> {this.state.data.ConsignmentItems[tableMeta.rowIndex].status} </p>
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
                            //let id = this.state.data.ConsignmentItems[dataIndex].item_schedule.id;
                            let id = this.state.data.ConsignmentItems[dataIndex].id;

                            return (
                                <Grid className="px-2">
                                    <Tooltip title="Add Item Batches">
                                        <IconButton
                                            onClick={() => {
                                                window.location.href = `/spc/consignment/addDetails/${id}`
                                            }}>
                                            <VisibilityIcon color={this.state.is_item_batch_available.length > 0 && this.state.is_item_batch_available[dataIndex] ? 'secondary' : 'primary'} />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )

                        },
                    },

                }
            ],
            consignmentDataColumns: [
                {
                    name: 'id',
                    label: 'id',
                    options: {
                        //filter: true,
                        display: false,
                    },
                },

                {
                    name: 'reg',
                    label: 'Registration No',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.consignmentDetailData[dataIndex].Vehicle.reg_no;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },

                },
                {
                    name: 'reg',
                    label: 'Description',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.consignmentDetailData[dataIndex].Vehicle.description;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },

                },
            ],
            consignmentDetailData: [],

            grnloaded: false,
            grnData: [],
            grnColumns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let id = this.state.grnData[dataIndex]?.id;

                            return (
                                <Grid container>
                                    {dataIndex == 0 && (this.state.grnData[dataIndex].status == "Pending" || this.state.grnData[dataIndex].status == "Active") && this.state.userRole !== 'Drug Store Keeper' &&
                                        <Grid item style={{ display: "flex", alignItems: 'center' }}>
                                            <Button
                                                className="mx-2 p-2"
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                //type="submit"
                                                onClick={() => {
                                                    this.editGRNStatus(id, "PARTIALLY COMPLETED")
                                                }}
                                            >
                                                Partial Complete
                                            </Button>
                                        </Grid>
                                    }
                                    {dataIndex == 0 && (this.state.grnData[dataIndex].status == "Pending" || this.state.grnData[dataIndex].status == "Active") &&
                                        <Grid item style={{ display: 'flex', alignItems: "center" }}>
                                            <Button
                                                className="mx-2 p-2"
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                //type="submit"
                                                onClick={() => {
                                                    this.editGRNStatus(id, "COMPLETED")
                                                }}
                                            >
                                                Complete
                                            </Button>
                                        </Grid>
                                    }
                                    {(this.state.grnData[dataIndex].status == "PARTIALLY COMPLETED" || this.state.grnData[dataIndex].status == "COMPLETED") &&

                                        <Grid item style={{ display: "flex", alignItems: "center" }}>
                                            <Button
                                                className="mx-2 p-2 button-danger"
                                                variant="contained"
                                                color="primary"
                                                size="small"
                                                //type="submit"
                                                onClick={() => {
                                                    this.editGRNStatus(id, "CANCELLED")
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                    }
                                    <Grid item style={{ display: "flex", alignItems: "center" }}>
                                        <IconButton
                                            onClick={() => {
                                                // window.location.href = `/spc/consignment/addDetails/${id}`
                                                console.log("selected GRN", this.state.grnData[dataIndex])
                                                //this.loadGRNItemsWithGrnID(this.state.grnData[dataIndex].id)
                                                this.setState({
                                                }, () => {
                                                    window.location.href = `/localpurchase/grn-items/${this.state.grnData[dataIndex].id}`
                                                })
                                            }}>
                                            <VisibilityIcon color='primary' />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            )
                        },
                    },
                },
                {
                    name: 'grn_no',
                    label: 'GRN No',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.grnData[dataIndex]?.grn_no;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'status',
                    label: 'Status',

                },
            ],

            data: [],
            noOfContainer: 0,
            noOfItem: 0,
            msdOderListNo: null,
            consignmentHistoryData: [],

            formData: {
                batches: [{
                    batch_no: null,
                    exd: null,
                    mfd: null,
                    quantity: null,
                    unit_price: null

                }]
            },
            userRole:null,
            grn_id: null,
            grn_items: [],

            batches_loaded: false,
            batches_column: [
                {
                    name: 'batch',
                    label: 'Batch',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex]?.batch_no;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'mfd',
                    label: 'MFD',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex]?.mfd;
                            return (
                                <p>{dateParse(data)}</p>
                            )
                        }
                    },

                },
                {
                    name: 'exd',
                    label: 'EXD',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex]?.exd;
                            return (
                                <p>{dateParse(data)}</p>
                            )
                        }
                    },
                },
                {
                    name: 'packsize',
                    label: 'Pack Size',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex]?.no_of_pack;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },

                },
                /* {
                    name: 'volume',
                    label: 'Volume',
                    options: {
                        filter: true,

                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex]?.no_of_pack;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },

                }, */
                /* {
                    name: 'weight',
                    label: 'Weight',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.consignmentDetailData[dataIndex]?.Vehicle?.reg_no;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },

                }, */
                {
                    name: 'price',
                    label: 'Unit Price',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex]?.unit_price;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },

                },
                {
                    name: 'order qty',
                    label: 'Order Qty',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex]?.quantity;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'order qty',
                    label: 'Alrady GRN Qty',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex]?.grn_details?.ConsignmentItemBatch?.grn_quantity;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },
                {
                    name: 'received qty',
                    label: 'Received Qty',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {

                            return (
                                <div style={{ width: 100 }}>
                                    <TextValidator
                                        //className=" w-full"
                                        placeholder="Received Qty"
                                        name="qty"
                                        InputLabelProps={{ shrink: false }}
                                        value={String(parseInt(this.state.formData.batches[dataIndex].grn_details.quantity, 10))}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.batches[dataIndex].grn_details.quantity = parseInt(e.target.value, 10)
                                            if (Number(this.state.formData.batches[dataIndex]?.quantity) > Number(e.target.value)) {
                                                formData.batches[dataIndex].grn_details.excess = 0
                                                formData.batches[dataIndex].grn_details.shortage = Number(this.state.formData.batches[dataIndex]?.quantity) - Number(e.target.value)
                                            } else {
                                                formData.batches[dataIndex].grn_details.shortage = 0
                                                formData.batches[dataIndex].grn_details.excess = Number(e.target.value) - Number(this.state.formData.batches[dataIndex]?.quantity)
                                            }
                                            this.setState({ formData })
                                        }}
                                        validators={['minNumber:0', `maxNumber: ${this.state.formData.batches[dataIndex]?.quantity}`]}
                                        errorMessages={[
                                            'Minimum value >= 0',
                                            'Maximum value should be <= Order Quantity',
                                        ]}
                                    />
                                </div>
                            )
                        }
                    },
                },
                {
                    name: 'damage',
                    label: 'Damage',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <div style={{ width: 100 }}>
                                    <TextValidator
                                        //className=" w-full"
                                        placeholder="Damage"
                                        name="damage"
                                        InputLabelProps={{ shrink: false }}
                                        value={String(parseInt(this.state.formData.batches[dataIndex].grn_details.damage, 10))}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.batches[dataIndex].grn_details.damage = e.target.value
                                            this.setState({ formData })
                                        }}
                                        validators={['minNumber: 0', `maxNumber: ${this.state.formData.batches[dataIndex]?.grn_details.quantity}`]}
                                        errorMessages={[
                                            'Minimum Value >= 0',
                                            'Cannot exceed more than recieved Quantity'
                                        ]}
                                    />
                                </div>
                            )
                        }
                    },
                },
                {
                    name: 'Shortage',
                    label: 'Shortage',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <div style={{ width: 100 }}>
                                    {this.state.formData.batches[dataIndex].grn_details.shortage}

                                    {/* <TextValidator
                                        //className=" w-full"
                                        placeholder="Shortage"
                                        name="shortage"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.batches[dataIndex].grn_details.shortage}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.batches[dataIndex].grn_details.shortage = e.target.value
                                            this.setState({ formData })
                                        }}
                                  
                                    /> */}
                                </div>
                            )
                        }
                    },
                },
                {
                    name: 'Excess',
                    label: 'Excess',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <div style={{ width: 100 }}>
                                    {this.state.formData.batches[dataIndex].grn_details.excess ? this.state.formData.batches[dataIndex].grn_details.excess : "Not Available"}
                                    {/*  <TextValidator
                                       
                                        placeholder="Excess"
                                        name="excess"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.batches[dataIndex].grn_details.excess}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.batches[dataIndex].grn_details.excess = e.target.value
                                            this.setState({ formData })
                                        }}
                                    
                                    /> */}
                                </div>
                            )
                        }
                    },
                },
                {
                    name: '',
                    label: '',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <div style={{ width: 100 }}>
                                    {this.state.formData.batches[dataIndex].status != "COMPLETED" ?
                                        <Tooltip title="Save">
                                            <IconButton aria-label="close" disabled={this.state.formData.batches[dataIndex].status == "COMPLETED" ? true : false} onClick={() => {
                                                this.submitGRN(dataIndex)
                                            }}>
                                                <SaveOutlinedIcon className="cursor-pointer mx-1" color='primary' />
                                            </IconButton>
                                        </Tooltip>
                                        : null}
                                </div>
                            )
                        }
                    },
                },
            ]
        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        console.log(page)
        this.setState(
            {
                filterData,
            },
            () => {
                this.loadData()
            }
        )
    }

    // get consignment by ID
    async getConsignmentById() {
        this.setState({
            loaded: false
        })
        let consignmentId = this.state.consignmentId
        let consignment = await ConsignmentService.getConsignmentById(consignmentId)
        if (consignment.status === 200) {
            this.setState({
                data: consignment.data.view,
                noOfContainer: consignment.data.view.ConsignmentContainers.length,
                noOfItem: consignment.data.view.ConsignmentItems.length,
                msdOderListNo: consignment.data.view.ConsignmentItems[0].item_schedule.Order_item.purchase_order.order,
                consignmentDetailData: consignment.data.view.ConsignmentContainers,
            },
                async () => {
                    const is_item_batch_available = await this.validateConsignmentItems(consignment.data.view?.ConsignmentItems);
                    this.setState({ is_item_batch_available: is_item_batch_available }, () => {
                        this.render()
                        console.log("Validity :", this.state.is_item_batch_available)
                    })

                }
            )
        }

        this.setState({ loaded: true, })
        console.log(this.state.data);
    }

    async validateGRN(id) {
        let isValid = false;
        let res = await ConsignmentService.getConsignmentItemsById(id)

        if (res.status === 200) {
            if (res.data.view.Batch.length != 0) {
                isValid = true
            }
            return isValid
        }
    }

    async validateConsignmentItems(consignmentItems) {
        const promises = consignmentItems.map((value) => this.validateGRN(value.id));
        const results = await Promise.all(promises);
        return results;
    }

    async getConsignmentHistory() {
        let consignmentId = this.state.consignmentId
        let params = { limit: 20, page: 0, 'order[0]': ['createdAt', 'DESC'] }
        let consignment = await ConsignmentService.getConsignmentHistory(consignmentId, params)
        console.log("history", consignment)
        if (consignment.status === 200) {
            this.setState({
                consignmentHistoryData: consignment.data.view.data,
                historyLoaded: true
            })
        }
    }

    async loadConsignmentData(id) {
        this.setState({
            batches_loaded: false
        })
        let res = await ConsignmentService.getAditionalDetails(id)
        let formData = this.state.formData;

        if (res.status) {
            console.log("res", res.data.view)
            /* formData.height = res.data.view.height;
            formData.width = res.data.view.width;
            formData.depth = res.data.view.depth;
            formData.net_weight = res.data.view.net_weight;
            formData.gross_weight = res.data.view.gross_weight;
 */

            if (res.data.view.batch.length != 0) {
                formData.batches = res.data.view.batch

                this.loadGRNItems(res.data.view.batch)
            }

            this.setState({
                // data: res.data.view,
                formData,
                batches_loaded: true
            })
        }
    }

    async loadConsignmentItemsById(item_id) {
        this.setState({
            batches_loaded: false
        })
        let loaded = false;
        let res = await ConsignmentService.getConsignmentItemsById(item_id)
        let formData = this.state.formData;

        if (res.status) {
            console.log("res batches", res.data.view.Batch)
            /* formData.height = res.data.view.height;
            formData.width = res.data.view.width;
            formData.depth = res.data.view.depth;
            formData.net_weight = res.data.view.net_weight;
            formData.gross_weight = res.data.view.gross_weight;
 */
            if (res.data.view.Batch.length != 0) {
                formData.batches = res.data.view.Batch
                this.loadGRNItems(res.data.view.Batch)
            }

            this.setState({
                // data: res.data.view,

                formData,
            })
        }

    }

    async getDebitNote() {
        let params = {
            refference_id: this.props.match.params.id,
            reference_type: ['IM Debit Note', 'LC Debit Note'],
            is_active: true,

        }
        let res_data = await FinanceDocumentServices.getFinacneDocuments(params)
        if (res_data.status === 200) {
            console.log("dabit note", res_data.data.view.data[0].template)
            this.setState({
                dabitNote: res_data.data.view.data[0].template
            })
        }
    }

    async completeConsingment() {
        this.setState({
            warning_msg: false
        })

        let id = this.props.match.params.id;

        let newstatus = {
            "status": "Waiting For AD Approval"
        }
        let res = await ConsignmentService.editStatusConsignmentById(id, newstatus)
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
            },
                () => {
                    window.location.reload()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
            })
        }
    }

    async loadWarehouses() {
        var user = await localStorageService.getItem('userInfo');
        var id = user.id;
        var all_pharmacy_dummy = [];

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
            this.setState({ all_warehouse_loaded: all_pharmacy_dummy })
        }
    }


    async startConsingment() {
        let id = this.props.match.params.id;

        let newstatus = {
            "status": "Started"
        }
        let res = await ConsignmentService.editStatusConsignmentById(id, newstatus)
        if (res.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
            },
                () => {
                    window.location.reload()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
            })
        }
    }

    async crateGRN() {
        this.setState({ creatingGrn: true })
        let panding_count = this.state.data.ConsignmentItems.filter(x => x.validate == "Pending").length;
        let total_items = this.state.data.ConsignmentItems.length;
        // if (panding_count == total_items) {
        //     this.setState({
        //         alert: true,
        //         severity: 'error',
        //         message: 'All Consignment Items are Under Pending Stage',
        //     })
        // } else if (panding_count != 0 && (panding_count < total_items)) {
        //     this.setState({
        //         warning_alert: true,
        //         warning_alert_text: "There are " + panding_count + " of " + total_items + " Consignment item(s) in Pending Stage. Do you want to Continue?",
        //     })
        // } else if (panding_count == 0 && total_items > 0) {
        // }
        // if (panding_count != 0 && (panding_count < total_items)) {
        //     this.setState({
        //         warning_alert: true,
        //         warning_alert_text: "There are " + panding_count + " of " + total_items + " Consignment item(s) in Pending Stage. Do you want to Continue?",
        //     })
        // }
        if (this.state.is_item_batch_available.includes(false)) {
            this.setState({
                creatingGrn: false,
                alert: true,
                severity: 'error',
                message: 'Some Item Batch are not available, Please review it before proceeding',
            })
        } else {
            // alert("Hello")
            this.createGRNWithVerified()
        }
    }

    async createGRNWithVerified() {
        let consignment_id = this.props.match.params.id;

        if (this.state.all_warehouse_loaded.length > 1) {
            this.setState({ dialog_for_select_warehouse: true })
        } else {
            this.createGRNWithWarehose(this.state.all_warehouse_loaded[0]?.id)
        }
        // need to add warehouse select 
    }

    async createGRNWithWarehose(warehouse_id) {
        this.setState({ creatingGrn: true })

        console.log("slelected werehouse", warehouse_id)
        let consignment_id = this.props.match.params.id;
        let formData = {
            //"grn_no": null,
            "creation_type": "Temppary",
            "type": "Consignment GRN",
            "consignment_id": consignment_id,
            "warehouse_id": warehouse_id
        }
        let res = await ConsignmentService.createGRN(formData);
        if (res.status == 201) {
            this.setState({
                creatingGrn: false,
                alert: true,
                severity: 'success',
                message: 'GRN Create Successfull',
            }, () => {
                // window.location.reload()
                // this.render()
                this.componentDidMount()
            })

        } else {
            this.setState({
                creatingGrn: false,
                alert: true,
                severity: 'error',
                message: 'GRN Create Unsuccessfull',
            })
        }
    }

    async loadGRN() {
        this.setState({
            grnloaded: false
        })
        let consignment_id = this.props.match.params.id;
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let params = {
            "consignment_id": consignment_id,
            // "warehouse_id": login_user_pharmacy_drugs_stores[0]?.pharmacy_drugs_stores_id,
            grn_pending: true,
            'order[0]': ['createdAt', 'DESC']
            // "status":["COMPLETED","COMPLETED APPROVED"]//not equal checking
        }

        let grn = await ConsignmentService.getGRN(params)
        console.log("grn Data", grn.data?.view?.data)
        if (grn.status === 200) {
            if (grn.data?.view?.data?.length > 0) {

                if (grn.data?.view?.data[0].status == "PARTIALLY COMPLETED") {
                    this.setState({ isGRNCreated: false, isPartiallyCopleted: true, grn_id: grn.data?.view?.data[0].id, grnData: grn.data?.view?.data, grnloaded: true })
                } else {
                    this.setState({ isGRNCreated: true, grn_id: grn.data?.view?.data[0].id, grnData: grn.data?.view?.data, grnloaded: true })
                }
            }
        }
    }

    async loadGRNItems(batches) {
        let batch_ids = batches.map(a => a.id);

        console.log("Batch ids", batch_ids)
        let consignment_id = this.props.match.params.id;

        let params = {
            "consignment_id": consignment_id,
            "consignment_item_batch_id": batch_ids,
            "grn_id": this.state.grn_id,
            "grn_status": ["Pending", "Active"]
        }

        let grn = await ConsignmentService.getGRNItems(params)
        console.log("grn items", grn.data?.view?.data)
        if (grn.status === 200) {
            if (grn.data?.view?.data?.length > 0) {
                this.setState({ grn_items: grn.data?.view?.data }, () => {
                    this.mergeGRNToBatch()
                })
            }
        }
    }

    async loadGRNItemsWithGrnID(grn_id) {

        let params = {
            "grn_id": grn_id
        }

        let grn = await ConsignmentService.getGRNItems(params)
        console.log("grn items", grn.data?.view?.data)
        if (grn.status === 200) {
            if (grn.data?.view?.data?.length > 0) {
                this.setState({ all_grn_items: grn.data?.view?.data }, () => {

                })
            }
        }
    }


    filterGRNItem(item_id) {
        let item = this.state.grn_items.find((obj) => obj.consignment_item_batch_id == item_id)

        let data = {
            item: item,
            index: this.state.grn_items.findIndex(item)
        }
        return data;
    }

    mergeGRNToBatch() {
        let formData = this.state.formData;
        formData.batches.forEach((element, index) => {
            formData.batches[index].grn_details = this.state.grn_items.find((obj) => obj.consignment_item_batch_id == element.id)
        });

        this.setState({ formData, batches_loaded: true })
        console.log("merged batches", formData.batches)
    }

    async submitGRN(dataIndex) {
        let data = this.state.formData.batches[dataIndex].grn_details;

        let formData = {
            "quantity": data.quantity,
            "damage": data.damage,
            "excess": data.excess,
            "shortage": data.shortage,
        }
        console.log("formData", formData)

        let res = await ConsignmentService.editGRNItem(data.id, formData);
        if (res.status == 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: 'GRN Save Successfull',
            }, () => {
                //window.location.reload()
            })

        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: 'GRN Save Unsuccessfull',
            })
        }
    }

    async editGRNStatus(id, status) {
        let formData = {
            "status": status,
        }
        console.log("formData", formData)

        let res = await ConsignmentService.editGRNStatus(id, formData);
        if (res.status == 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: 'GRN Save Successfull',
            }, () => {
                this.componentDidMount()
            })

        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: 'GRN Save Unsuccessfull',
            })
        }
    }

    async loadUerRole(){
        var user = await localStorageService.getItem('userInfo').roles[0];
        console.log('user',user)
        this.setState({
            userRole:user
        })
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            consignmentId: id
        }, () => {
            this.getConsignmentHistory()
            this.getConsignmentById()
            this.loadGRN()
            this.loadWarehouses()
            this.loadUerRole()
        })

    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Recieving Details"} />
                        <Grid container spacing={1} className="flex ">
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Wharf ref no: ${this.state.data.wharf_ref_no ? this.state.data.wharf_ref_no : "Not Available"}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`WDN No / LDCN ref no: ${this.state.data.wdn_no ? this.state.data.wdn_no : "Not Available"}/${this.state.data.ldcn_ref_no ? this.state.data.ldcn_ref_no : "Not Available"}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`No of containers: ${this.state.noOfContainer}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`LP Request ID: ${this.state.msdOderListNo}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Indent No: ${this.state.data.indent_no}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Delivery type: ${this.state.data.delivery_type ? this.state.data.delivery_type : "Not Available"}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Status: ${this.state.data.status}`}</Typography>
                            </Grid>
                            {/* {(this.state.data.status == "Active") ?
                                <Grid item >
                                    <Button className="mt-2" progress={false}
                                        onClick={() => {
                                            this.setState({ warning_msg: true })
                                        }}
                                    >
                                        <span className="capitalize">Send Consingment for Approval</span>
                                    </Button>
                                </Grid>
                                : null}
                            {(this.state.data.status == "Confirmed By AD") ?
                                <Grid item >
                                    <Button className="mt-2" progress={false}
                                        onClick={() => {
                                            this.startConsingment()
                                        }}
                                    >
                                        <span className="capitalize">Send Consingment</span>
                                    </Button>
                                </Grid>
                                : null} */}
                            {!this.state.isGRNCreated && this.state.is_item_batch_available.length > 0 || this.state.grnData[0]?.status == 'CANCELLED' ?
                                <Grid item lg={12} md={12} sm={12} xs={12} style={{ margin: "12px 0" }}>
                                    <Button
                                        className="mt-2 p-1"
                                        progress={this.state.creatingGrn}
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        //type="submit"
                                        onClick={() => {
                                            this.crateGRN()
                                        }}
                                    >
                                        <span className="capitalize">Create GRN</span>
                                    </Button>
                                    {/* <Button className="mt-2" progress={false}
                                    onClick={() => {
                                        // this.setState({ debitNoteView: true })
                                    }}
                                >
                                    <span className="capitalize">Create GRN</span>
                                </Button> */}
                                </Grid> : null}
                            {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                                <div className="mt-10">
                                    {this.state.loaded ?
                                        < LoonsTable
                                            id={"consignmentDetails"}
                                            data={this.state.consignmentDetailData}
                                            columns={this.state.consignmentDataColumns}
                                            options={{
                                                // pagination: true,
                                                serverSide: true,
                                                count: this.state.totalItems,
                                                rowsPerPage: 5,
                                                page: this.state.filterData.page,
                                                download: false,
                                                print: false,
                                                viewColumns: false,
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
                                        : null}
                                </div>
                            </Grid> */}
                        </Grid>
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
                                    variant="subtitle1">{`Total Items: ${this.state.noOfItem}`}</Typography>
                            </Grid>
                            {this.state.loaded && this.state.historyLoaded &&
                                <div className="mt-0">
                                    <LoonsTable
                                        id={"itemDetails"}
                                        data={this.state.data.ConsignmentItems}
                                        columns={this.state.itemDetailColumns}
                                        options={{
                                            pagination: true,
                                            serverSide: true,
                                            count: this.state.totalItems,
                                            responsive: "stacked",
                                            rowsPerPage: 5,
                                            page: this.state.filterData.page,
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
                            }
                        </LoonsCard>
                    </Grid>
                    {this.state.isGRNCreated || this.state.isPartiallyCopleted ?
                        <Grid style={{ marginTop: 20 }}>
                            < LoonsCard>
                                <CardTitle title={"GRN Details"} />
                                {this.state.grnloaded ?
                                    <div className="mt-0">
                                        <LoonsTable
                                            id={"grnDetails"}
                                            data={this.state.grnData}
                                            columns={this.state.grnColumns}
                                            options={{
                                                pagination: true,
                                                serverSide: true,
                                                responsive: "stacked",
                                                count: this.state.grnData.length,
                                                // rowsPerPage: 10,
                                                // page: this.state.grnfilterData.page,

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
                                    </div> : null
                                }
                            </LoonsCard>
                        </Grid>
                        : null}
                    <Grid style={{ marginTop: 20 }}>
                        < LoonsCard>
                            <CardTitle title={"Status History"} />
                            {this.state.historyLoaded &&
                                <div className="mt-0">
                                    <LoonsTable
                                        id={"statusManagement"}
                                        data={this.state.consignmentHistoryData}
                                        columns={this.state.statusManagementColumns}
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
                            }
                        </LoonsCard>
                    </Grid>
                </MainContainer>
                <LoonsDiaLogBox
                    title="Are you sure?"
                    show_alert={true}
                    alert_severity="info"
                    alert_message="Make Sure the All Batches and UOMs are Added to the Consignment"
                    //message="testing 2"
                    open={this.state.warning_msg}
                    show_button={true}
                    show_second_button={true}
                    btn_label="No"
                    onClose={() => {
                        this.setState({ warning_msg: false })
                    }}
                    second_btn_label="Yes"
                    secondButtonAction={() => {
                        // this.setState({ warning_msg: false })
                        this.completeConsingment()
                    }}
                >
                </LoonsDiaLogBox>
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
                            <Grid item lg={6}>
                                <SubTitle title="Old Data"></SubTitle>
                                <JSONTree data={this.state.selectedHistory?.old_data} />
                            </Grid>
                            <Grid item lg={6}>
                                <SubTitle title="New Data"></SubTitle>
                                <JSONTree data={this.state.selectedHistory?.new_data} />
                            </Grid>
                        </Grid>
                    </MainContainer>
                </Dialog>
                <Dialog fullScreen maxWidth="lg " open={this.state.debitNoteView} onClose={() => { this.setState({ debitNoteView: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="History Details" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    debitNoteView: false
                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>
                        <Grid container>
                            <PrintHandleBar buttonTitle={"Print"} content={this.state.dabitNote} title="Debit Note">
                            </PrintHandleBar>
                        </Grid>
                    </MainContainer>
                </Dialog>
                <Dialog maxWidth="lg" open={this.state.batchView}>
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <div style={{ display: "flex" }}>
                            <div style={{ flex: 1, minWidth: "400px" }}>
                                <CardTitle title="Batch Details" />
                            </div>
                            <div>
                                <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ batchView: false }) }}>
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
                    </MuiDialogTitle>
                    <ValidatorForm
                        className="mt-10 px-12 pb-10"
                    // onSubmit={() => this.submitData()}
                    // onError={() => null}
                    >
                        {this.state
                            .batches_loaded ? (
                            <LoonsTable
                                //title={"All Aptitute Tests"}
                                id={'batches'}
                                data={this.state.formData.batches}
                                columns={this.state.batches_column}
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
                        ) : (
                            //load loading effect
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30} />
                            </Grid>
                        )}
                    </ValidatorForm>
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
                <LoonsDialogBox
                    title="Are You Sure"
                    show_alert={true}
                    alert_severity="info"
                    alert_message={this.state.warning_alert_text}
                    //message="testing 2"
                    open={this.state.warning_alert}
                    show_button={true}
                    show_second_button={true}
                    btn_label="Yes"
                    onClose={() => {
                        this.createGRNWithVerified()
                    }}
                    second_btn_label="No"
                    secondButtonAction={() => {
                        this.setState({ warning_alert: false })
                    }}
                >

                </LoonsDialogBox>

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
                            <Grid item lg={6}>
                                <SubTitle title="Old Data"></SubTitle>
                                <JSONTree data={this.state.selectedHistory?.old_data} />
                            </Grid>

                            <Grid item lg={6}>
                                <SubTitle title="New Data"></SubTitle>
                                <JSONTree data={this.state.selectedHistory?.new_data} />
                            </Grid>
                        </Grid>
                    </MainContainer>
                </Dialog>
                <Dialog fullWidth maxWidth="sm" open={this.state.dialog_for_select_warehouse} >
                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Select Your Warehouse" />
                    </MuiDialogTitle>
                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            onSubmit={() => {
                                this.createGRNWithWarehose(this.state.selected_warehouse)
                                this.setState({ dialog_for_select_warehouse: false })
                            }}
                            className="w-full">
                            <Alert severity='info' className='mt-1'>
                                <Typography className='mt-2'>
                                    Please Select Warehouse Need to Create GRN.
                                </Typography>
                            </Alert>
                            <Autocomplete
                                disableClearable
                                className="w-full"
                                options={this.state.all_warehouse_loaded}
                                onChange={(e, value) => {
                                    if (value != null) {
                                        this.setState({ selected_warehouse: value.id })
                                    }
                                }}
                                value={{
                                    name: this.state.selected_warehouse ? (this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse)[0].name) : null,
                                    id: this.state.selected_warehouse
                                }}
                                getOptionLabel={(option) => option.name != null ? option.name : null}
                                renderInput={(params) => (
                                    <TextValidator
                                        {...params}
                                        placeholder="Select Your Warehouse"
                                        value={this.state.selected_warehouse ? this.state.all_warehouse_loaded.filter((obj) => obj.id == this.state.selected_warehouse)[0].name : null}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        validators={[
                                            'required',
                                        ]}
                                        errorMessages={[
                                            'this field is required',
                                        ]}
                                    />
                                )}
                            />
                            <Button
                                //progress={this.state.creatingGrn}
                                className="p-2 min-w-32 mt-5"
                                variant="contained"
                                color="primary"
                                size="small"
                                type="submit"

                            >
                                Create GRN
                            </Button>
                        </ValidatorForm>
                    </div>
                </Dialog>
            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(ViewConsignment)