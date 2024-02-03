import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import {
    Grid, Typography, IconButton,
    Dialog,
    MuiDialogContent,
    MuiDialogActions,


} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles'
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import { LoonsCard, DatePicker, SubTitle, Button, LoonsSnackbar, LoonsDialogBox } from "../../../components/LoonsLabComponents";
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import { Autocomplete, Alert } from "@material-ui/lab";
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConsignmentService from "../../../services/ConsignmentService";
import WarehouseServices from "app/services/WarehouseServices";
import { convertTocommaSeparated, dateParse, dateTimeParse } from "utils";
import CloseIcon from '@material-ui/icons/Close';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import AddIcon from '@material-ui/icons/Add';
import localStorageService from "app/services/localStorageService";
import { JSONTree } from 'react-json-tree';

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
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        backgroundColor: "#bad4ec"
        // backgroundColor: themeColors['whiteBlueTopBar'].palette.primary.main
    },

    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },

    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },


    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: -80,
    },
})


class ViewConsignmentMSA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            creatingGrn: false,
            alert: false,
            message: "",
            severity: 'success',
            selected_item_status: null,

            warning_alert: false,
            warning_alert_text: "",

            isGRNCreated: false,
            isPartiallyCopleted: false,

            totalItems: 0,
            loaded: false,
            historyLoaded: false,
            historyAllView: false,
            historyDataFilters: { limit: 20, page: 0, 'order[0]': ['createdAt', 'DESC'] },
            historyTotalItems: 0,

            selectedHistory: null,
            batchView: false,
            selectedConsignmentItem: null,

            all_warehouse_loaded: null,
            dialog_for_select_warehouse: false,
            selected_warehouse: null,

            consignmentId: '',
            filterData: {
                page: 0,
                limit: 20,
            },
            minPackSize:1,

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


                                <Grid container spacing={2} className="mt-5">

                                    {dataIndex == 0 && (this.state.grnData[dataIndex].status == "Pending" || this.state.grnData[dataIndex].status == "Active") &&
                                        <Grid item >
                                            <Button
                                                className="p-2 min-w-32"
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

                                        <Grid item >
                                            <Button
                                                className="p-2 min-w-32"
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

                                        <Grid item >
                                            <Button
                                                className="p-2 min-w-32 button-danger"
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


                                    <Grid item>
                                        <IconButton
                                            onClick={() => {
                                                // window.location.href = `/spc/consignment/addDetails/${id}`
                                                console.log("selected GRN", this.state.grnData[dataIndex])
                                                //this.loadGRNItemsWithGrnID(this.state.grnData[dataIndex].id)
                                                this.setState({
                                                }, () => {
                                                    window.location.href = `/consignments/grn-items/${this.state.grnData[dataIndex].id}`
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
                            let data = this.state.grnData[dataIndex]?.grn_no
                                ;
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

                                                this.setState({
                                                    batchView: true,
                                                    selected_item_status: this.state.data.ConsignmentItems[dataIndex].validate,
                                                    selectedConsignmentItem: id
                                                }, () => {
                                                    this.loadConsignmentItemsById(this.state.data.ConsignmentItems[dataIndex].id)
                                                })
                                            }}>
                                            <AddIcon color='primary' />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )

                        },
                    },

                },
                {
                    name: 'validate',
                    label: 'Verification Status',
                    options: {
                        //filter: true,
                        display: true,
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
                    name: 'sr_no', // field name in the row object
                    label: 'SR Number...',
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
                        display: false,
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
                    label: 'Consignment Quantity',
                    options: {
                        filter: true,
                    },
                },
                /* {
                    name: 'date_of_arrival',
                    label: 'Date of arrival',
                    options: {
                        filter: true,
                    },
                }, */
                /*   {
                      name: 'delivery_value',
                      label: 'Delivery Value',
                      options: {
                          filter: true,
                      },
                  }, */
                /* {
                    name: 'no_of_container',
                    label: 'No.of Containers/Cartoons/quantity',
                    options: {
                        filter: true,
                        
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p> {this.state.data.ConsignmentContainers.length} </p>
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
                                <p> {this.state.data.ConsignmentItems[tableMeta.rowIndex].status} </p>
                            )
                        },
                    },
                },

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
            consignmentDetailData: [

            ],
            data: [],
            ConsignmentData: [],
            noOfContainer: 0,
            noOfItem: 0,
            msdOderListNo: null,
            consignmentHistoryData: [],
            canCreateGRN: true,


            formData: {
                batches: [{
                    batch_no: null,
                    exd: null,
                    mfd: null,
                    quantity: null,
                    unit_price: null

                }]
            },


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
                            //let data = this.state.formData.batches[dataIndex]?.no_of_pack;
                            let data=this.state.minPackSize
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
                                        name="phn"
                                        InputLabelProps={{ shrink: false }}
                                        value={this.state.formData.batches[dataIndex].grn_details.quantity}
                                        type="number"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.batches[dataIndex].grn_details.quantity = e.target.value
                                            if (Number(this.state.formData.batches[dataIndex]?.quantity) > Number(e.target.value)) {
                                                formData.batches[dataIndex].grn_details.excess = 0
                                                formData.batches[dataIndex].grn_details.shortage = Number(this.state.formData.batches[dataIndex]?.quantity) -
                                                    Number(e.target.value) -
                                                    Number(this.state.formData.batches[dataIndex]?.grn_details?.ConsignmentItemBatch?.grn_quantity)
                                            } else {
                                                formData.batches[dataIndex].grn_details.shortage = 0
                                                formData.batches[dataIndex].grn_details.excess = Number(e.target.value) - Number(this.state.formData.batches[dataIndex]?.quantity)
                                            }
                                            this.setState({ formData })
                                        }}
                                        validators={'minNumber:0'}
                                        errorMessages={[
                                            'Invalid Inputs',
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
                                        value={this.state.formData.batches[dataIndex].grn_details.damage}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            let formData = this.state.formData;
                                            formData.batches[dataIndex].grn_details.damage = e.target.value
                                            this.setState({ formData })
                                        }}
                                    /* validators={['matchRegexp:^\s*([0-9a-zA-Z]*)\s*$']}
                                    errorMessages={[
                                        'Invalid Inputs',
                                    ]} */
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
                                    {this.state.formData.batches[dataIndex].grn_details.excess}
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
                    name: 'Final Qty',
                    label: 'Final Qty',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            return (
                                <div style={{ width: 100 }}>
                                    {Number(this.state.formData.batches[dataIndex].grn_details.quantity) -
                                        Number(this.state.formData.batches[dataIndex].grn_details.damage)
                                    }

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

                                                if (Number(this.state.formData.batches[dataIndex].grn_details.quantity) < 0) {
                                                    this.setState({
                                                        alert: true,
                                                        severity: 'error',
                                                        message: 'Invalid Received Quantitiy',
                                                    })
                                                } else if (Number(this.state.formData.batches[dataIndex].grn_details.damage) < 0) {
                                                    this.setState({
                                                        alert: true,
                                                        severity: 'error',
                                                        message: 'Invalid Damage Quantitiy',
                                                    })
                                                } else {
                                                    this.submitGRN(dataIndex)
                                                }


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
    async setPageHistory(page) {
        //Change paginations
        let historyDataFilters = this.state.historyDataFilters
        historyDataFilters.page = page
        console.log(page)
        this.setState(
            {
                historyDataFilters,
            },
            () => {
                this.getConsignmentHistory()
            }
        )
    }

    // get consignment by ID
    async getConsignmentById() {
        this.setState({
            loaded: false
        })
        let consignmentId = this.state.consignmentId
        console.log('consignmentId', consignmentId)
        let consignment = await ConsignmentService.getConsignmentById(consignmentId)
        if (consignment.status === 200) {
            this.setState({
                data: consignment.data.view,
                noOfContainer: consignment.data.view.ConsignmentContainers.length,
                noOfItem: consignment.data.view.ConsignmentItems.length,
                msdOderListNo: consignment.data.view.ConsignmentItems[0].item_schedule.Order_item.purchase_order.order,
                consignmentDetailData: consignment.data.view.ConsignmentContainers,
                loaded: true,
            },
                () => {
                    this.render()
                }
            )
        }
        console.log("getConsignmentID", this.state.data);
    }

    // get procument consignment by ID
    async getSPCConsignmentById() {
        this.setState({
            loaded: false
        })
        let consignmentId = this.state.consignmentId
        console.log('consignmentId', consignmentId)
        let consignmentData = await ConsignmentService.getSPCConsignmentById(consignmentId)
        console.log("SPCconsignmentData", consignmentData?.data?.view)
        if (consignmentData.status === 200) {
            this.setState({
                ConsignmentData: consignmentData?.data?.view,
                ConsignmentNoOfContainer: consignmentData?.data?.view?.ConsignmentContainers?.length,
                ConsignmentNoOfItem: consignmentData?.data?.view?.SPCConsignmentItems?.length,
                ConsignmentMsdOderListNo: consignmentData?.data?.view?.SPCConsignmentItems[0]?.Order_item?.MSDPurchaseOrder?.order_no,
                ConsignmentConsignmentDetailData: consignmentData?.data?.view?.ConsignmentContainers,
                loaded: true,
            },
                () => {
                    this.render()
                }
            )
        }
        console.log("getSPCConsignment data",this.state.data);
    }

    async getConsignmentHistory() {
        let consignmentId = this.state.consignmentId
        let consignment = await ConsignmentService.getConsignmentHistory(consignmentId, this.state.historyDataFilters)
        console.log("history", consignment)
        if (consignment.status === 200) {
            this.setState({
                consignmentHistoryData: consignment.data.view.data,
                historyLoaded: true,
                historyTotalItems: consignment.data.view.totalItems

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
        let res = await ConsignmentService.getConsignmentItemsById(item_id)
        let formData = this.state.formData;

        if (res.status) {
            console.log("res batches", res.data.view)
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
                minPackSize:res?.data?.view?.pack_size,
                formData,

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

    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            consignmentId: id
        }, () => {
            this.getConsignmentHistory()
            this.getConsignmentById()
            this.getSPCConsignmentById()
            this.loadGRN()
            this.loadWarehouses()
        })

    }

    async crateGRN() {
        // this.setState({creatingGrn:true})

        let panding_count = this.state.data.ConsignmentItems.filter(x => x.validate == "Pending").length;
        let total_items = this.state.data.ConsignmentItems.length;
        if (panding_count == total_items) {
            this.setState({
                creatingGrn: false,
                alert: true,
                severity: 'error',
                message: 'All Consignment Items are Under Panding Stage',
            })
        } else if (panding_count != 0 && (panding_count < total_items)) {
            this.setState({
                creatingGrn: false,
                warning_alert: true,
                warning_alert_text: "There are " + panding_count + " of " + total_items + " Consignment item(s) in Pending Stage. Do you want to Continue?",
            })
        } else if (panding_count == 0 && total_items > 0) {
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
                alert: true,
                severity: 'success',
                message: 'GRN Create Successfull',
                creatingGrn: false
            }, () => {
                //window.location.reload()
                this.componentDidMount()
            })

        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: 'GRN Create Unsuccessfull',
                creatingGrn: false
            })
        }
    }

    async loadGRN() {
        this.setState({
            grnloaded: false
        })
        let consignment_id = this.props.match.params.id;
        let login_user_pharmacy_drugs_stores = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        let Selected_Warehouse = await localStorageService.getItem("Selected_Warehouse")?.warehouse?.id


        let params = {
            "consignment_id": consignment_id,
            "warehouse_id": Selected_Warehouse,
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

                let completedCount = grn.data?.view?.data.filter((x) => x.status == "COMPLETED").length
                let appovedCompletedCount = grn.data?.view?.data.filter((x) => x.status == "APPROVED COMPLETED").length

                if ((completedCount + appovedCompletedCount) == 0) {
                    this.setState({ canCreateGRN: true })
                } else {
                    this.setState({ canCreateGRN: false })
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
            // "consignment_item_batch_id": batch_ids,
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
            "quantity": Number(data.quantity) - Number(data.damage),
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

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Consignment Details"} />
                        <Grid container spacing={1} className="flex ">
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Wharf ref no: ${this.state.ConsignmentData?.shipment_no}`}</Typography>  {/* this.state.data.wharf_ref_no */}  
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`WDN No / LDCN ref no: ${this.state.data.wdn_no}/${this.state.data.ldcn_ref_no}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`No of containers: ${this.state.noOfContainer}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`MSD order list no: ${this.state.msdOderListNo}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Indent no: ${this.state.data.indent_no}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Delivery type: ${this.state.data.delivery_type}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Delivery Date: ${dateParse(this.state.data.delivery_date)}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`HS Code: ${this.state.data.hs_code ? this.state.data.hs_code : ""}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Invoice no: ${this.state.data.invoice_no ? this.state.data.invoice_no : ''}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Invoice Date: ${this.state.data.invoice_date ? dateParse(this.state.data.invoice_date) : ''}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`LDCN Ref No: ${this.state.data.ldcn_ref_no ? this.state.data.ldcn_ref_no : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`PA No: ${this.state.data.pa_no ? this.state.data.pa_no : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`PO No: ${this.state.data.po ? this.state.data.po : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Exchange Rate: ${convertTocommaSeparated(this.state.data.exchange_rate, 2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Value(${this.state.data.currency}): ${convertTocommaSeparated(this.state.data.values_in_currency, 2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Value(LKR): ${convertTocommaSeparated(this.state.data.values_in_lkr, 2)}`}</Typography>
                            </Grid>


                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`No.of Containers/Cartoons/quantity: ${this.state.data.ConsignmentContainers?.length}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Date of arrival: ${dateParse(this.state.data.ConsignmentItems?.[0].item_schedule.schedule_date)}`}</Typography>
                            </Grid>

                            <Grid item lg={12} md={12} sm={12} xs={12}>
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
                            </Grid>

                            {this.state.canCreateGRN ?
                                <Grid item lg={4} md={4} sm={6} xs={6}>

                                    <Button
                                        className="p-2 min-w-32"
                                        variant="contained"
                                        progress={this.state.creatingGrn}
                                        color="primary"
                                        size="small"
                                        //type="submit"
                                        onClick={() => {
                                            this.crateGRN()
                                        }}
                                    >
                                        Create GRN
                                    </Button>
                                </Grid>
                                : null}
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
                                            serverSide: false,
                                            count: this.state.totalItems,
                                            rowsPerPage: 10,
                                            page: this.state.filterData.page,

                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        // this.setPage(tableState.page)
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
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                    <CardTitle title={"GRN Details"} />
                                </Grid>

                                {this.state.grnloaded ?
                                    <div className="mt-0">
                                        <LoonsTable
                                            id={"grnDetails"}
                                            data={this.state.grnData}
                                            columns={this.state.grnColumns}
                                            options={{
                                                pagination: false,
                                                serverSide: true,
                                                // count: this.state.grntotalItems,
                                                //rowsPerPage: 20,
                                                //page: this.state.grnfilterData.page,

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
                                            count: this.state.historyTotalItems,
                                            rowsPerPage: 20,
                                            page: this.state.historyDataFilters.page,

                                            onTableChange: (action, tableState) => {
                                                switch (action) {
                                                    case 'changePage':
                                                        this.setPageHistory(tableState.page)
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
                                    >{ }</LoonsTable>
                                </div>
                            }
                        </LoonsCard>

                    </Grid>

                </MainContainer>





                <Dialog maxWidth="lg " open={this.state.batchView} >

                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Batch Details" />

                        <IconButton aria-label="close" className={classes.closeButton} onClick={() => { this.setState({ batchView: false }) }}>
                            <CloseIcon />
                        </IconButton>

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
                                {/*  <CircularProgress
                            size={30}
                        /> */}
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
                    autoHideDuration={3000}
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
                                this.setState({ creatingGrn: true, dialog_for_select_warehouse: false })
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
                                className="p-2 min-w-32 mt-5"
                                variant="contained"
                                color="primary"
                                size="small"
                                type="submit"
                                progress={this.state.creatingGrn}

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

export default withStyles(styleSheet)(ViewConsignmentMSA)