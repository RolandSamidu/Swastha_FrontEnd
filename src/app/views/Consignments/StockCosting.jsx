import React, { Component, Fragment } from "react";
import MainContainer from "app/components/LoonsLabComponents/MainContainer";
import CardTitle from "app/components/LoonsLabComponents/CardTitle";
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
import { LoonsCard, DatePicker, SubTitle, Button, LoonsSnackbar } from "app/components/LoonsLabComponents";
import LoonsTable from "app/components/LoonsLabComponents/Table/LoonsTable";
import Tooltip from "@material-ui/core/Tooltip";
import Buttons from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';

import EditIcon from '@material-ui/icons/Edit';
import ConsignmentService from "app/services/ConsignmentService";
import { convertTocommaSeparated, dateParse, dateTimeParse } from "utils";
import CloseIcon from '@material-ui/icons/Close';
import SPCServices from "app/services/SPCServices";


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


class StockCosting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: false,
            message: '',
            severity: 'success',

            editWindow: false,
            editFormData: {
                id: null,
                invoice_price: null,
                supplier_charges: null,
                quantity: null
            },

            totalItems: 0,
            historyDataFilters: { limit: 20, page: 0, 'order[0]': ['createdAt', 'DESC'] },
            historyTotalItems: 0,
            loaded: false,
            historyLoaded: false,
            batchView: false,
            selectedConsignmentItem: null,
            status: null,

            consignmentId: '',
            shipment_no: '',
            filterData: {
                page: 0,
                limit: 20,
            },
            statusManagementColumns: [
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
                    label: 'Purchase Order/ indent Price',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {this.state.data.ConsignmentItems[tableMeta.rowIndex].purchase_price}
                                </p>
                            )
                        },
                    },

                },
                {
                    name: 'Qty',
                    label: 'Qty',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p> {convertTocommaSeparated(this.state.data.ConsignmentItems[tableMeta.rowIndex].quantity, 0)} </p>
                            )
                        },
                    },
                },
                {
                    name: 'Supplier Charges',
                    label: 'Supplier Charges',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {convertTocommaSeparated(this.state.data.ConsignmentItems[tableMeta.rowIndex].supplier_charges, 2)}
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'Invoice Price',
                    label: 'Invoice Price',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>
                                    {convertTocommaSeparated(this.state.data.ConsignmentItems[tableMeta.rowIndex].invoice_price, 2)}
                                </p>
                            )
                        },
                    },
                },
                {
                    name: 'Total Cost',
                    label: 'Total Invoice Price',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let invoice_price = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].invoice_price)
                            let quantity = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].quantity)
                            let supplier_charges = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].supplier_charges)

                            invoice_price = isNaN(invoice_price) ? 0 : invoice_price;
                            quantity = isNaN(quantity) ? 0 : quantity
                            supplier_charges = isNaN(supplier_charges) ? 0 : supplier_charges


                            return (
                                <div>
                                    {convertTocommaSeparated((invoice_price * quantity) + supplier_charges, 2)}
                                </div>
                            )
                        },

                    },
                },
                {
                    name: 'Total Cost',
                    label: 'Total Expected Cost',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let purchase_price = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].purchase_price)
                            let quantity = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].quantity)
                            //let supplier_charges = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].supplier_charges)

                            purchase_price = isNaN(purchase_price) ? 0 : purchase_price
                            quantity = isNaN(quantity) ? 0 : quantity

                            return (
                                <div>
                                    {convertTocommaSeparated(parseFloat((purchase_price * quantity)), 2)}
                                </div>
                            )
                        },

                    },
                },

                {
                    name: 'Item Cost',
                    label: 'Item Cost',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {

                            let invoice_price = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].invoice_price)
                            let quantity = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].quantity)
                            let supplier_charges = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].supplier_charges)

                            invoice_price = isNaN(invoice_price) ? 0 : invoice_price;
                            quantity = isNaN(quantity) ? 0 : quantity
                            supplier_charges = isNaN(supplier_charges) ? 0 : supplier_charges

                            return (
                                <div>
                                    {convertTocommaSeparated(((invoice_price * quantity) + supplier_charges) / quantity, 2)}
                                </div>
                            )
                        },

                    },
                },

                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            let invoice_price = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].invoice_price)
                            let quantity = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].quantity)
                            let supplier_charges = parseFloat(this.state.data.ConsignmentItems[tableMeta.rowIndex].supplier_charges)


                            return (
                                <Grid className="flex items-center">
                                    <Tooltip title="Edit">
                                        {/* <IconButton>
                                        <Button color="primary">Edit</Button>
                                    </IconButton>
                                 */}
                                        <IconButton
                                            onClick={() => {
                                                let editFormData = this.state.editFormData
                                                console.log("consinement item", this.state.data.ConsignmentItems[tableMeta.rowIndex])
                                                editFormData.id = this.state.data.ConsignmentItems[tableMeta.rowIndex].id
                                                editFormData.invoice_price = !isNaN(invoice_price) ? invoice_price : 0;
                                                editFormData.supplier_charges = !isNaN(supplier_charges) ? supplier_charges : 0;
                                                editFormData.quantity = !isNaN(quantity) ? quantity : 0;


                                                this.setState({
                                                    editFormData, editWindow: true

                                                })
                                            }}
                                            className="px-2"
                                            size="small"
                                            aria-label="Edit Item"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            )
                        }
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


            batches_loaded: false,
            batches_column: [
                {
                    name: 'batch',
                    label: 'Batch',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex].batch_no;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },
                },

                {
                    name: 'reg',
                    label: 'MFD',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex].mfd;
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
                            let data = this.state.formData.batches[dataIndex].exd;
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
                            let data = this.state.formData.batches[dataIndex].no_of_pack;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },

                },
                {
                    name: 'volume',
                    label: 'Volume',
                    options: {
                        filter: true,

                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex].no_of_pack;
                            return (
                                <p>{data}</p>
                            )
                        }
                    },

                },
                {
                    name: 'weight',
                    label: 'Weight',
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
                    name: 'price',
                    label: 'Price',
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
                    name: 'order qty',
                    label: 'Order Qty',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.formData.batches[dataIndex].unit_price;
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
                            let data = this.state.consignmentDetailData[dataIndex].Vehicle.reg_no;
                            return (
                                <div style={{ width: 100 }}>
                                    <TextValidator
                                        //className=" w-full"
                                        placeholder="Received Qty"
                                        name="phn"
                                        InputLabelProps={{ shrink: false }}
                                        //value={this.state.formData.phn}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {

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
                    name: 'damage',
                    label: 'Damage',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.consignmentDetailData[dataIndex].Vehicle.reg_no;
                            return (
                                <div style={{ width: 100 }}>
                                    <TextValidator
                                        //className=" w-full"
                                        placeholder="Damage"
                                        name="damage"
                                        InputLabelProps={{ shrink: false }}
                                        //value={this.state.formData.phn}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {

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
                            let data = this.state.consignmentDetailData[dataIndex].Vehicle.reg_no;
                            return (
                                <div style={{ width: 100 }}>
                                    <TextValidator
                                        //className=" w-full"
                                        placeholder="Shortage"
                                        name="shortage"
                                        InputLabelProps={{ shrink: false }}
                                        //value={this.state.formData.phn}
                                        type="text"
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {

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
                    name: 'Excess',
                    label: 'Excess',
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
            console.log("consignment", consignment.data.view);
            this.setState({
                status: consignment.data.view.status,
                data: consignment.data.view,
                noOfContainer: consignment.data.view.ConsignmentContainers.length,
                noOfItem: consignment.data.view.ConsignmentItems.length,
                msdOderListNo: consignment.data.view.ConsignmentItems[0].item_schedule.Order_item.purchase_order.order,
                consignmentDetailData: consignment.data.view.ConsignmentContainers,
                loaded: true,
            },
                () => {
                    this.loadConsignmentItemStatus(consignment.data.view.ConsignmentItems)
                    this.render()
                }
            )
        }
        console.log(this.state.data);
    }

    // get debitnote by ID
    async getDebitNoteId() {
        let params = {
            consignment_id: this.state.consignmentId,
            is_active: true
        }

        let res = await SPCServices.getAllDebitNotes(params)

        if (res.status === 200) {
            console.log('dfsfdsffsfsf', res.data.view.data?.[0]?.id)
            console.log('shipment no', res.data.view.data?.[0]?.Consignment?.shipment_no)
            console.log('Debit Note Data', res.data.view.data?.[0])
            this.setState({
                debitnote_id: res.data.view.data?.[0]?.id,
                shipment_no: res.data.view.data?.[0]?.Consignment?.shipment_no
            }, () => {
                this.render()
            })

        }

    }


    async loadConsignmentItemStatus(data) {
        let itemIds = data.map(x => x.id)
        console.log("consinment item data", itemIds)

        let params = {
            consignment_id: this.props.match.params.id,
            //status:'AD Recommended'
            //item_id:itemIds
        }
        let consignment_sample_res = await ConsignmentService.getConsignmentSampleById(params);

        console.log("consingment samples items", consignment_sample_res)

        if (consignment_sample_res.status == 200) {
            this.setState({
                consignmentDetails: consignment_sample_res.data.view.data,
            })
        }


    }


    async editStatusConsignmentById(status) {
        let id = this.props.match.params.id;

        let newstatus = {
            "status": status
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

    async getConsignmentHistory() {
        let consignmentId = this.state.consignmentId
        let consignment = await ConsignmentService.getConsignmentHistory(consignmentId, this.state.historyDataFilters)

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
            }

            this.setState({
                // data: res.data.view,
                formData,
                batches_loaded: true
            })
        }

    }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            consignmentId: id
        }, () => {
            //this.getConsignmentHistory()
            this.getConsignmentById()
            this.getDebitNoteId()
        })

    }


    async editSubmit() {
        let editFormData = this.state.editFormData
        console.log("edit formdata", editFormData)
        let formData = {
            invoice_price: editFormData.invoice_price,
            supplier_charges: editFormData.supplier_charges
        }

        this.setState({ submitting: true })
        let editRes = await ConsignmentService.patchConsignmentItem(editFormData.id, formData)
        if (editRes.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
                editWindow: false,
            },
                () => {
                    this.componentDidMount()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
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
                                    variant="subtitle1">{`Wharf ref no: ${this.state.shipment_no}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`WDN No / LDCN ref no: ${this.state.data.wdn_no}/${this.state.data.ldcn_ref_no}`}</Typography>
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
                                <Typography color={this.state.status == "Price Mismatch" ? 'error' : this.state.status == "Price Verified" ? "success" : "secondary"} className="mt-5 " variant="subtitle1">{` ${this.state.status}`}</Typography>
                            </Grid>
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
                            {this.state.loaded &&
                                <div className="mt-0">
                                    <LoonsTable
                                        id={"itemDetails"}
                                        data={this.state.data.ConsignmentItems}
                                        columns={this.state.itemDetailColumns}
                                        options={{
                                            pagination: false,
                                            serverSide: true,
                                            // count: this.state.totalItems,
                                            // rowsPerPage: 5,
                                            //page: this.state.filterData.page,


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
                                    >{ }</LoonsTable>
                                </div>
                            }


                            <ValidatorForm
                                className="pt-2"
                                //onSubmit={() => this.handleDataSubmit()}
                                onError={() => null}
                            >
                                <Grid
                                    className=" w-full"
                                    item
                                    lg={6}
                                    md={6}
                                    sm={12}
                                    xs={12}
                                >
                                    <SubTitle title="Remark" />
                                    <TextValidator
                                        className="w-full"
                                        placeholder="Remark"
                                        name="remark"
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        //value={this.state.formData.remark }
                                        type="text"
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        size="small"
                                        onChange={(e) => {
                                            /*   this.setState({
                                                  formData: {
                                                      ...this
                                                          .state
                                                          .formData,
                                                          remark:
                                                          e.target
                                                              .value,
                                                  },
                                              }) */
                                        }}
                                    /*  validators={[
                                         'required',
                                     ]}
                                     errorMessages={[
                                         'this field is required',
                                     ]} */
                                    />
                                </Grid>
                            </ValidatorForm>
                            <Grid container="container" spacing={2}>
                                <Grid item="item" >
                                    <Button className={this.state.status != "Price Mismatch" && this.state.status != "Price Verified" ? "mt-2 bg-error hover-bg-error" : "mt-2"} progress={false}
                                        onClick={() => {
                                            this.editStatusConsignmentById("Price Mismatch")
                                        }}
                                        disabled={this.state.status == "Price Mismatch" ||
                                            this.state.status == "Price Verified" ||
                                            this.state.status == "SYSTEM REJECTED" ||
                                            this.state.status == "REJECTED" ||
                                            this.state.status == "Canceled" ||
                                            this.state.status == "COMPLETED"
                                        }
                                    >
                                        <span className="capitalize">Price Mismatch</span>
                                    </Button>
                                </Grid>
                                <Grid item="item" >
                                    <Button className="mt-2" progress={false}
                                        onClick={() => {
                                            this.editStatusConsignmentById("Price Verified")
                                        }}
                                        disabled={this.state.status == "Price Mismatch" ||
                                            this.state.status == "Price Verified" ||
                                            this.state.status == "SYSTEM REJECTED" ||
                                            this.state.status == "REJECTED" ||
                                            this.state.status == "Canceled" ||
                                            this.state.status == "COMPLETED"
                                        }

                                    >

                                        <span className="capitalize">Verify Price</span>
                                    </Button>
                                </Grid>
                            </Grid>



                        </LoonsCard>
                    </Grid>


                </MainContainer>




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

                <Dialog fullWidth maxWidth="sm" open={this.state.editWindow} onClose={() => {
                    this.setState({ editWindow: false });
                }}>

                    <MuiDialogTitle disableTypography>
                        <CardTitle title="Edit" />

                    </MuiDialogTitle>

                    <div className="w-full h-full px-5 py-5">
                        <ValidatorForm
                            onError={() => null}
                            onSubmit={() => this.editSubmit()}
                            className="w-full">

                            <Grid className=" w-full" item="item">
                                <SubTitle title="Invoice Price" />
                                <TextValidator className='' required={true} placeholder="Invoice Price"
                                    //variant="outlined"
                                    fullWidth="fullWidth" variant="outlined" size="small" value={this.state.editFormData.invoice_price} onChange={(e, value) => {
                                        let editFormData = this.state.editFormData
                                        editFormData.invoice_price = e.target.value;

                                        this.setState({ editFormData })
                                    }}
                                /* validators={[
                                'required',
                                ]}
                                errorMessages={[
                                'this field is required',
                                ]} */
                                />
                            </Grid>
                            <Grid className=" w-full" item="item">
                                <SubTitle title="Supplier Charges" />
                                <TextValidator className='' required={true} placeholder="Invoice Price"
                                    //variant="outlined"
                                    fullWidth="fullWidth" variant="outlined" size="small" value={this.state.editFormData.supplier_charges} onChange={(e, value) => {
                                        let editFormData = this.state.editFormData
                                        editFormData.supplier_charges = e.target.value;

                                        this.setState({ editFormData })
                                    }}
                                /* validators={[
                                'required',
                                ]}
                                errorMessages={[
                                'this field is required',
                                ]} */
                                />
                            </Grid>
                            <Grid item="item">
                                {/* Submit Button */}
                                <Button className="mt-5 mr-2" progress={false} type='submit'>
                                    <span className="capitalize">Save</span>
                                </Button>
                            </Grid>
                        </ValidatorForm>
                    </div>
                </Dialog>


            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(StockCosting)