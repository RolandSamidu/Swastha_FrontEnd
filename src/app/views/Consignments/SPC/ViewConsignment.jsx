import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import { Grid, Typography, IconButton, Icon, Dialog, } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import { LoonsCard, Button, SubTitle, PrintHandleBar, ValidatorForm, DatePicker } from "../../../components/LoonsLabComponents";
import LoonsDiaLogBox from 'app/components/LoonsLabComponents/Dialogbox'
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from "@material-ui/core/Tooltip";
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConsignmentService from "../../../services/ConsignmentService";
import FinanceDocumentServices from "../../../services/FinanceDocumentServices"
import SPCServices from "app/services/SPCServices"
import { convertTocommaSeparated, dateParse, dateTimeParse, roundDecimal } from "utils";
import { JSONTree } from 'react-json-tree';
import * as appconst from '../../../../appconst'
import localStorageService from "app/services/localStorageService";
import EmployeeServices from "app/services/EmployeeServices";
import VehicleService from "app/services/VehicleService";
import Ldcn from "../Print/ldcn";
import Wdn from "../Print/wdn";
import {
    CircularProgress,
} from '@material-ui/core'
import { includesArrayElements } from "../../../../utils";

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

            isGRNCreated: false,
            isPartiallyCopleted: true,
            grn_id: null,
            grnData: [],
            grnloaded: true,

            totalItems: 0,
            loaded: false,
            warning_msg: false,
            editDetails: false,
            loginUserRoles: [],
            historyDataFilters: { limit: 20, page: 0, 'order[0]': ['createdAt', 'DESC'] },
            historyTotalItems: 0,
            historyLoaded: false,
            historyAllView: false,
            selectedHistory: null,
            consignmentId: '',
            dabitNote: null,
            debitNoteView: false,
            ldcnPrint: false,
            wdnPrint: false,
            loginUser: null,
            editable: false,
            debitnote_id: null,
            shipment_no: null,
            filterData: {
                page: 0,
                limit: 20,
            },

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
                /*   {
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
                  }, */
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
                    label: 'Consignment Quantity',
                    options: {
                        filter: true,
                    },
                },
                /* {
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
                }, */
                /* {
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
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/spc/consignment/addDetails/${id}?status=${this.state.data?.status}`
                                        }}>
                                        <VisibilityIcon color='primary' />
                                    </IconButton>
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
                            // console.log("data",data);
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
                            console.log("data", data);
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

            allVehicleTypes: [],
            all_containers: [],
            all_employee: [],
            debit_note_types: [],
            debit_note_sub_types: [],
            all_Suppliers: [],
            submitting: false,

            formData: {
                order_no: null,
                wharf_ref_no: null,
                wdn_no: null,
                ldcn_ref_no: null,
                indent_no: null,
                hs_code: null,
                invoice_no: null,
                invoice_date: null,
                pa_no: null,
                delivery_type: null,
                delivery_person_id: null,
                delivery_date: null,
                shipment_no: null,

                wdn_date: null,
                debit_note_sub_type_id: null,
                vessel_no: null,
                supplier_id: null,
                currency: null,
                exchange_rate: null,
                values_in_currency: null,
                values_in_lkr: null,

                debit_note_type: null,
                debit_note_sub_type: null,
                supplier_name: null,
                supplier_address: null

            },
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

    printLDCN() {
        this.setState({
            ldcnPrint: true
        }, () => {
            this.render()
            document.getElementById('print_presc_104').click()
        })
    }

    printWDN() {
        this.setState({
            wdnPrint: true
        }, () => {
            this.render()
            document.getElementById('print_presc_105').click()
        })
    }

    async loadGRN() {
        this.setState({
            grnloaded: false
        })
        let consignment_id = this.state.consignmentId;
        //let login_user_pharmacy_drugs_stores = await localStorageService.getItem("login_user_pharmacy_drugs_stores")
        //let Selected_Warehouse = await localStorageService.getItem("Selected_Warehouse")?.warehouse?.id


        let params = {
            "consignment_id": consignment_id,
            //"warehouse_id": Selected_Warehouse,
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

    // get consignment by ID
    async getConsignmentById() {
        this.setState({
            loaded: false
        })
        let consignmentId = this.state.consignmentId
        let consignment = await ConsignmentService.getConsignmentById(consignmentId)

        if (consignment.status === 200) {
            console.log("consinement data", consignment?.data?.view)
            let formData = this.state.formData;

            formData.order_no = consignment?.data?.view?.order_no
            formData.wharf_ref_no = consignment?.data?.view?.wharf_ref_no
            formData.shipment_no = consignment?.data?.view?.shipment_no
            formData.wdn_no = consignment?.data?.view?.wdn_no
            formData.ldcn_ref_no = consignment?.data?.view?.ldcn_ref_no
            formData.indent_no = consignment?.data?.view?.indent_no
            formData.hs_code = consignment?.data?.view?.hs_code
            formData.invoice_no = consignment?.data?.view?.invoice_no
            formData.invoice_date = consignment?.data?.view?.invoice_date
            formData.pa_no = consignment?.data?.view?.pa_no
            formData.delivery_type = consignment?.data?.view?.delivery_type
            formData.delivery_person_id = consignment?.data?.view?.delivery_person_id
            formData.delivery_date = consignment?.data?.view?.delivery_date
            formData.debit_note_type_id = consignment?.data?.view?.debit_note_type_id
            formData.debit_note_sub_type_id = consignment?.data?.view?.debit_note_sub_type_id



            formData.wdn_date = consignment?.data?.view?.wdn_date
            formData.vessel_no = consignment?.data?.view?.vessel_no
            formData.supplier_id = consignment?.data?.view?.supplier_id
            formData.currency = consignment?.data?.view?.currency
            formData.exchange_rate = consignment?.data?.view?.exchange_rate
            formData.values_in_currency = consignment?.data?.view?.values_in_currency
            formData.values_in_lkr = consignment?.data?.view?.values_in_lkr

            if (consignment?.data?.view?.debit_note_type_id) {
                this.dabitNoteSubTypes(consignment?.data?.view?.debit_note_type_id)
            }


            let order_no = consignment?.data?.view?.order_no
            let user_role = await localStorageService.getItem('userInfo').roles
            if (order_no && order_no.split("/")[1] === 'SPC' && includesArrayElements(user_role, ['Development Officer', 'Chief Accountant', 'Accountant payment', 'Accountant Clark', 'Development Officer', 'MSD SDA'])) {
                this.setState({ editable: false });
            } else {
                this.setState({ editable: true });
            }



            this.setState({

                formData: formData,
                data: consignment.data.view,
                noOfContainer: consignment.data.view?.ConsignmentContainers?.length,
                noOfItem: consignment.data.view?.ConsignmentItems?.length,
                msdOderListNo: consignment.data.view?.ConsignmentItems[0]?.item_schedule?.Order_item?.purchase_order?.order,
                consignmentDetailData: consignment.data.view?.ConsignmentContainers,
                loaded: true,
            },
                () => {
                    this.render()
                }
            )
        }
        console.log("consinment Data", this.state.data);
    }

    async getConsignmentHistory() {
        let user_info = await localStorageService.getItem('userInfo')
        this.setState({ loginUserRoles: user_info.roles, loginUser: user_info.name })
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
                this.getDebitNote()
            })

        }

    }

    async getDebitNote() {

        let params

        if (this.state.debitnote_id != null || this.state.debitnote_id != undefined) {
            params = {
                refference_id: [this.props.match.params.id, this.state.debitnote_id],
                reference_type: ['IM Debit Note', 'LC Debit Note', 'SPC IM Debit Note', 'SPC LC Debit Note'],
                is_active: true,

            }
        } else {
            params = {
                refference_id: [this.props.match.params.id],
                reference_type: ['IM Debit Note', 'LC Debit Note', 'SPC IM Debit Note', 'SPC LC Debit Note'],
                is_active: true,

            }
        }


        let res_data = await FinanceDocumentServices.getFinacneDocuments(params)
        // console.log("dabit note", res_data.data.view.data[0]?.template)
        if (res_data.status === 200) {
            this.setState({
                dabitNote: res_data.data.view.data[0]?.template
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

    async editConsignment() {
        let id = this.props.match.params.id;
        this.setState({ submitting: true })
        let editRes = await ConsignmentService.editConsignmentById(id, this.state.formData)
        if (editRes.status === 200) {
            this.setState({
                alert: true,
                severity: 'success',
                message: "Successfully Saved ",
                submitting: false,
                editDetails: false,
            },
                () => {
                    this.componentDidMount()
                })
        } else {
            this.setState({
                alert: true,
                severity: 'error',
                message: "Cannot Save ",
                submitting: false,
            })
        }
    }

    async loadEmployees() {
        let res1 = await EmployeeServices.getEmployees({ type: ["Helper", "Driver"], owner_id: '000' })
        if (res1.status) {
            console.log("emp", res1.data.view.data)
            this.setState({
                all_employee: res1.data.view.data,
            })
            console.log("employees", res1.data.view.data)
        }
    }

    async loadContainers(type_id) {
        let params = { vehicle_type_id: type_id };
        let owner_id = '000';
        let res1 = await VehicleService.fetchAllVehicles(params, owner_id)
        if (res1.status) {
            console.log("res", res1.data.view.data)
            this.setState({
                all_containers: res1.data.view.data,

            })
        }
    }


    async dabitNoteTypes() {

        let params = {};
        let res1 = await ConsignmentService.getDabitNoteTypes(params)
        if (res1.status) {
            console.log("res", res1.data.view.data)
            this.setState({
                debit_note_types: res1.data.view.data,
            })
        }
    }

    async dabitNoteSubTypes(type_id) {
        if (type_id) {
            let params = { type_id: type_id };
            let res1 = await ConsignmentService.getDabitNoteSubTypes(params)
            if (res1.status) {
                console.log("resdebitnote", res1.data.view.data)
                this.setState({
                    debit_note_sub_types: res1.data.view.data,
                })
            }
        } else {
            let formData = this.state.formData
            formData.debit_note_sub_type_id = null;
            formData.debit_note_sub_type = null;
            this.setState({
                debit_note_sub_types: [],
                formData
            })
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({
            consignmentId: id
        }, () => {
            this.loadEmployees()
            this.loadContainers()
            this.getConsignmentHistory()
            this.getConsignmentById()
            this.loadGRN()
            this.dabitNoteTypes()
            this.getDebitNoteId()
        })

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
                                    variant="subtitle1">{`Wharf ref no: ${this.state?.shipment_no}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`WDN No / LDCN no: ${this.state.data?.wdn_no}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`HS Code: ${this.state.data?.hs_code ? this.state.data?.hs_code : ""}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Invoice no: ${this.state.data?.invoice_no ? this.state.data?.invoice_no : ''}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Invoice Date: ${this.state.data?.invoice_date ? dateParse(this.state.data?.invoice_date) : ''}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`LDCN Ref No: ${this.state.data?.ldcn_ref_no ? this.state.data?.ldcn_ref_no : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`PA No: ${this.state.data?.pa_no ? this.state.data?.pa_no : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`PO No: ${this.state.data?.po ? this.state.data?.po : ''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Exchange Rate: ${convertTocommaSeparated(this.state.data?.exchange_rate, 2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Value(${this.state.data?.currency}): ${convertTocommaSeparated(this.state.data?.values_in_currency, 2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Value(LKR): ${convertTocommaSeparated(this.state.data?.values_in_lkr, 2)}`}</Typography>
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
                                    variant="subtitle1">{`Indent no: ${this.state.data?.indent_no}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Delivery type: ${this.state.data?.delivery_type}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Status: ${this.state.data?.status}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>

                            </Grid>



                            {(this.state.data?.status == "Active") ?

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

                            {(this.state.data?.status == "Confirmed By AD") ?

                                <Grid item >
                                    <Button className="mt-2" progress={false}
                                        onClick={() => {
                                            this.startConsingment()
                                        }}
                                    >
                                        <span className="capitalize">Send Consingment</span>
                                    </Button>
                                </Grid>


                                : null}


                            <Grid item >

                                <Button className="mt-2" progress={false}
                                    onClick={() => {
                                        this.setState({ debitNoteView: true })
                                    }}
                                >
                                    <span className="capitalize">Print Debit Note</span>
                                </Button>
                            </Grid>

                            {this.state.data?.ldcn_ref_no !== null && (
                                <Grid item>
                                    <Button className="mt-2" progress={false}
                                        // onClick={this.printLDCN()}
                                        onClick={() => {
                                            this.printLDCN()
                                        }}
                                    >
                                        <span className="capitalize">Print LDCN</span>
                                    </Button>
                                </Grid>
                            )}

                            {this.state.data?.wharf_ref_no !== null && (
                                <Grid item>
                                    <Button className="mt-2" progress={false}
                                        // onClick={this.printWDN()}
                                        onClick={() => {
                                            this.printWDN()
                                        }}
                                    >
                                        <span className="capitalize">Print WDN</span>
                                    </Button>
                                </Grid>
                            )}

                            {(this.state.data?.status == "Active") ?
                                <Grid item >
                                    <Button className="mt-2 button-warning"
                                        progress={this.state.submitting}
                                        disabled={!this.state.editable}
                                        onClick={() => {
                                            this.setState({ editDetails: true })
                                        }}
                                    >
                                        <span className="capitalize">Edit Details</span>
                                    </Button>
                                </Grid>
                                :
                                ((this.state.data?.status != "COMPLETED" || this.state.data?.status != "Price Verified") && this.state.loginUserRoles.includes('MSD CIU')) ?
                                    <Grid item >
                                        <Button className="mt-2 button-warning"
                                            progress={this.state.submitting}
                                            onClick={() => {
                                                this.setState({ editDetails: true })
                                            }}
                                        >
                                            <span className="capitalize">Edit Details</span>
                                        </Button>
                                    </Grid>
                                    :
                                    null}





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
                        </Grid>
                    </LoonsCard>




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
                                        data={this.state.data?.ConsignmentItems}
                                        columns={this.state.itemDetailColumns}
                                        options={{
                                            pagination: true,
                                            //serverSide: true,
                                            count: this.state.totalItems,
                                            responsive: "stacked",
                                            rowsPerPage: 10,
                                            page: this.state.filterData.page,

                                            /*  onTableChange: (action, tableState) => {
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
                                             }, */
                                        }}
                                    >{ }</LoonsTable>
                                </div>
                            }
                        </LoonsCard>
                    </Grid>
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
                                            }
                                        }}
                                    >{ }</LoonsTable>
                                </div>
                            }
                        </LoonsCard>

                    </Grid>

                    {this.state.ldcnPrint ?
                        <Grid>
                            <Ldcn data={this.state.data} user={this.state.loginUser}></Ldcn>
                        </Grid>
                        :
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    }

                    {this.state.wdnPrint ?
                        <Grid>
                            <Wdn data={this.state.data} user={this.state.loginUser}></Wdn>
                        </Grid>
                        : null
                        // <Grid className="justify-center text-center w-full pt-12">
                        //     <CircularProgress size={30} />
                        // </Grid>
                    }

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


                <Dialog fullScreen maxWidth="lg " open={this.state.editDetails} onClose={() => { this.setState({ editDetails: false }) }}  >
                    <MuiDialogTitle disableTypography className={classes.Dialogroot}>
                        <CardTitle title="Edit Details" />
                        <IconButton aria-label="close" className={classes.closeButton}
                            onClick={() => {
                                this.setState({
                                    editDetails: false

                                })
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </MuiDialogTitle>
                    <MainContainer>

                        <Grid container>
                            <ValidatorForm
                                ref="form"
                                onSubmit={() => this.editConsignment()}
                                onError={() => null}
                            >
                                <Grid container spacing={2}>


                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Wharf Ref No"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Wharf Ref No"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .wharf_ref_no
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.wharf_ref_no = e.target.value
                                                this.setState({ formData })

                                            }}
                                        // validators={[
                                        //     'required',
                                        // ]}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
                                        />
                                    </Grid>


                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"WDN/LDCN No"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="WDN/LDCN No"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .wdn_no
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.wdn_no = e.target.value
                                                this.setState({ formData })
                                            }}
                                        // validators={[
                                        //     'required',
                                        // ]}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"WDN/LDCN Date"}></SubTitle>
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.wdn_date}
                                            //label="Date From"
                                            placeholder="WDN/LDCN Date"
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.wdn_date = date;
                                                this.setState({ formData })
                                            }}
                                        />
                                    </Grid>

                                    <>
                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"LDCN ref No"}></SubTitle>
                                            <TextValidator
                                                className='w-full'
                                                placeholder="LDCN ref No"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state
                                                        .formData
                                                        .ldcn_ref_no
                                                }
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.ldcn_ref_no = e.target.value
                                                    this.setState({ formData })
                                                }}
                                            // validators={[
                                            //     'required',
                                            // ]}
                                            // errorMessages={[
                                            //     'this field is required',
                                            // ]}
                                            />
                                        </Grid>
                                        <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Indent No"}></SubTitle>
                                            <TextValidator
                                                className='w-full'
                                                placeholder="Indent No"
                                                //variant="outlined"
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                value={
                                                    this.state
                                                        .formData
                                                        .indent_no
                                                }
                                                onChange={(e, value) => {
                                                    let formData = this.state.formData;
                                                    formData.indent_no = e.target.value
                                                    this.setState({ formData })
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

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Invoice No"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Invoice No"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .invoice_no
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.invoice_no = e.target.value
                                                this.setState({ formData })
                                            }}
                                        /*  validators={[
                                             'required',
                                         ]}
                                         errorMessages={[
                                             'this field is required',
                                         ]} */
                                        />
                                    </Grid>



                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Invoice Date"}></SubTitle>
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.invoice_date}
                                            //label="Date From"
                                            placeholder="Invoice Date"
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            /*  required={true}
                                             errorMessages="this field is required" */
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.invoice_date = date;
                                                this.setState({ formData })
                                            }}
                                        />
                                    </Grid>


                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"PA No"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="PA No"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .pa_no
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.pa_no = e.target.value
                                                this.setState({ formData })
                                            }}
                                        // validators={[
                                        //     'required',
                                        // ]}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"HS Code"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="HS Code"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .hs_code
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.hs_code = e.target.value
                                                this.setState({ formData })
                                            }}
                                        // validators={[
                                        //     'required',
                                        // ]}
                                        // errorMessages={[
                                        //     'this field is required',
                                        // ]}
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Delivery Type"}></SubTitle>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={[{ value: "FCL" }, { value: "LCL" }, { value: "Airfreight" }]}
                                            defaultValue={[{ value: "FCL" }, { value: "LCL" }, { value: "Airfreight" }].find(
                                                (v) => v.value == this.state.formData.delivery_type
                                            )}
                                            value={[{ value: "FCL" }, { value: "LCL" }, { value: "Airfreight" }].find(
                                                (v) => v.value == this.state.formData.delivery_type
                                            )}
                                            getOptionLabel={(option) => option.value}

                                            onChange={(event, value) => {
                                                let formData = this.state.formData;
                                                formData.delivery_type = value.value
                                                this.setState({ formData })
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Delivery Type"
                                                    //variant="outlined"
                                                    //value={}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}

                                                    variant="outlined"
                                                    size="small"
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            )}
                                        />
                                    </Grid>


                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Delivery Person"}></SubTitle>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.all_employee}
                                            defaultValue={this.state.all_employee.find(
                                                (v) => v.id == this.state.formData.delivery_person_id
                                            )}
                                            value={this.state.all_employee.find(
                                                (v) => v.id == this.state.formData.delivery_person_id
                                            )}
                                            getOptionLabel={(option) => option.name ? option.name : ""}
                                            getOptionSelected={(option, value) =>
                                                console.log("ok")
                                            }
                                            onChange={(event, value) => {
                                                let formData = this.state.formData;
                                                formData.delivery_person_id = value.id
                                                this.setState({ formData })
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Delivery Person"
                                                    //variant="outlined"
                                                    value={this.state.formData.delivery_person_id}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            )}
                                        />
                                    </Grid>


                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Delivery Date"}></SubTitle>
                                        <DatePicker
                                            className="w-full"
                                            value={this.state.formData.delivery_date}
                                            //label="Date From"
                                            placeholder="Delivery Date"
                                            // minDate={new Date()}
                                            //maxDate={new Date("2020-10-20")}
                                            // required={true}
                                            // errorMessages="this field is required"
                                            onChange={date => {
                                                let formData = this.state.formData;
                                                formData.delivery_date = date;
                                                this.setState({ formData })

                                            }}
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Debit Note Type"}></SubTitle>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.debit_note_types}
                                            defaultValue={this.state.debit_note_types.find(
                                                (v) => v.name === this.state.formData.debit_note_type
                                            )}
                                            value={this.state.debit_note_types.find(
                                                (v) => v.name === this.state.formData.debit_note_type
                                            )}
                                            getOptionLabel={(option) => option.name ? option.name : ""}
                                            getOptionSelected={(option, value) =>
                                                console.log("ok")
                                            }
                                            onChange={(event, value) => {
                                                let formData = this.state.formData;
                                                formData.debit_note_type_id = value.id
                                                formData.debit_note_type = value.code + " - " + value.name
                                                this.dabitNoteSubTypes(value.id)
                                                this.setState({ formData })
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Debit Note Type"
                                                    //variant="outlined"
                                                    value={this.state.formData.debit_note_type}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                // validators={[
                                                //     'required',
                                                // ]}
                                                // errorMessages={[
                                                //     'this field is required',
                                                // ]}
                                                />
                                            )}
                                        />
                                    </Grid>


                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Debit Note Sub Type"}></SubTitle>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={this.state.debit_note_sub_types}
                                            defaultValue={this.state.debit_note_sub_types.find(
                                                (v) => v.id == this.state.formData.debit_note_sub_type_id
                                            )}
                                            value={this.state.debit_note_sub_types.find(
                                                (v) => v.id == this.state.formData.debit_note_sub_type_id
                                            )}
                                            getOptionLabel={(option) => option.name ? option.name : ""}
                                            getOptionSelected={(option, value) =>
                                                console.log("ok")
                                            }
                                            onChange={(event, value) => {
                                                let formData = this.state.formData;
                                                formData.debit_note_sub_type_id = value.id
                                                formData.debit_note_sub_type = value.code + " - " + value.name
                                                this.setState({ formData })
                                            }
                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Debit Note Sub Type"
                                                    //variant="outlined"
                                                    value={this.state.formData.debit_note_sub_type_id}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                /* validators={[
                                                    'required',
                                                ]}
                                                errorMessages={[
                                                    'this field is required',
                                                ]} */
                                                />
                                            )}
                                        />
                                    </Grid>




                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Vessel No"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Vessel No"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .vessel_no
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.vessel_no = e.target.value
                                                this.setState({ formData })
                                            }}
                                        //     validators={[
                                        //         'required',
                                        //     ]}
                                        //     errorMessages={[
                                        //         'this field is required',
                                        //     ]}
                                        />
                                    </Grid>

                                    {/* <Grid item lg={4} md={4} sm={12} xs={12}>
                                            <SubTitle title={"Supplier"}></SubTitle>
                                            <Autocomplete
                                                disableClearable
                                                className="w-full"
                                                options={this.state.all_Suppliers}
                                                getOptionLabel={(option) => option.name}
                                                value={this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id)}
                                                onChange={(event, value) => {
                                                    let formData = this.state.formData
                                                    formData.supplier_id = value.id

                                                    formData.supplier_name = value.name
                                                    formData.supplier_address = value.address
                                                    this.setState({ formData })
                                                }
                                                }
                                                renderInput={(params) => (
                                                    <TextValidator
                                                        {...params}
                                                        placeholder="Supplier"
                                                        //variant="outlined"
                                                        //value={}
                                                        value={this.state.all_Suppliers.find((v) => v.id == this.state.formData.supplier_id)}
                                                        fullWidth
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                     validators={['required']}
                                                     errorMessages={['this field is required']}
                                                    />
                                                )}
                                            />
                                        </Grid> */}

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Currency"}></SubTitle>
                                        <Autocomplete
                                            disableClearable
                                            className="w-full"
                                            options={appconst.all_currencies}
                                            getOptionLabel={(option) => option.cc}
                                            value={appconst.all_currencies.find((value) => value.cc == this.state.formData.currency)}
                                            onChange={(event, value) => {
                                                let formData = this.state.formData
                                                formData.currency = value.cc
                                                if (value.cc == "LKR") {
                                                    formData.exchange_rate = 1
                                                } else {
                                                    formData.exchange_rate = null
                                                }
                                                this.setState({ formData })
                                            }

                                            }
                                            renderInput={(params) => (
                                                <TextValidator
                                                    {...params}
                                                    placeholder="Currency"
                                                    //variant="outlined"
                                                    value={this.state.formData.currency}
                                                    fullWidth
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    variant="outlined"
                                                    size="small"
                                                /*  validators={['required']}
                                                 errorMessages={['this field is required']} */
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Exchange Rate"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Exchange Rate"
                                            disabled={this.state.formData.currency == "LKR" ? true : false}
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            type='number'
                                            value={
                                                this.state
                                                    .formData
                                                    .exchange_rate
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.exchange_rate = e.target.value

                                                if (formData.values_in_currency && formData.exchange_rate) {
                                                    formData.values_in_lkr = Number(formData.values_in_currency) * Number(formData.exchange_rate)
                                                }

                                                this.setState({ formData })

                                            }}
                                        /* validators={[
                                            'required'
                                        ]}
                                        errorMessages={[
                                            'this field is required'
                                        ]} */
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Price in Currency"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Price in Currency"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                this.state
                                                    .formData
                                                    .values_in_currency
                                            }
                                            onChange={(e, value) => {
                                                let formData = this.state.formData;
                                                formData.values_in_currency = e.target.value
                                                if (formData.values_in_currency && formData.exchange_rate) {
                                                    formData.values_in_lkr = Number(formData.values_in_currency) * Number(formData.exchange_rate)
                                                }
                                                this.setState({ formData })
                                            }}
                                            type='number'
                                        /*  validators={[
                                             'required',
                                         ]}
                                         errorMessages={[
                                             'this field is required',
                                         ]} */
                                        />
                                    </Grid>

                                    <Grid item lg={4} md={4} sm={12} xs={12}>
                                        <SubTitle title={"Total Price (LKR)"}></SubTitle>
                                        <TextValidator
                                            className='w-full'
                                            placeholder="Price in LKR"
                                            //variant="outlined"
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            value={
                                                String(roundDecimal(this.state
                                                    .formData
                                                    .values_in_lkr, 2).toLocaleString('en-US'))
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    className="mt-2 mr-2"
                                    progress={this.state.submitting}
                                    type="submit"
                                    scrollToTop={true}
                                >
                                    <span className="capitalize">Submit</span>
                                </Button>
                            </ValidatorForm>

                        </Grid>


                    </MainContainer>
                </Dialog>

            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(ViewConsignment)