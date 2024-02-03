import React, { Component, Fragment } from "react";
import { Grid, Typography, IconButton, Icon, Dialog, Divider, DialogActions, DialogContent, DialogContentText, TextField } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles'
import { LoonsCard, Button, SubTitle, LoonsSnackbar, LoonsTable, MainContainer, CardTitle } from "../../components/LoonsLabComponents";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { dateParse, roundDecimal } from "utils";
import { JSONTree } from 'react-json-tree';
import ScheduleServices from "../../services/SchedulesServices"
import PrescriptionSevice from '../../services/PrescriptionService'
import { CircularProgress } from "@material-ui/core";
import { compose } from "redux";
import { withRouter } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import localStorageService from "../../services/localStorageService";
import LocalPurchaseServices from "app/services/LocalPurchaseServices";
import FilterListIcon from '@material-ui/icons/FilterList';
import PrescriptionService from "../../services/PrescriptionService";
import { Tooltip } from "@material-ui/core";
import PersonIcon from '@mui/icons-material/Person';

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
class IndividualPurchaseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            approve: null,
            remarkAddView: false,
            remark: '',

            namePatientForm: {
                page: 0,
                limit: 10,
            },

            namePatientDingleDet: {},
            is_name_patient: false,

            namePatientDet: [],
            namePatientDetColumns: [

                {
                    name: 'request_no',
                    label: 'Request No',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                <p>
                                    {this.state.namePatientDet[tableMeta.rowIndex]?.request_id}
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
                                    {this.state.namePatientDet[tableMeta.rowIndex]?.Institute?.name}
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
                                    {this.state.namePatientDet[tableMeta.rowIndex]?.Patient?.phn}
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
                                    {this.state.namePatientDet[tableMeta.rowIndex]?.Patient?.name}
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
                                    {this.state.namePatientDet[tableMeta.rowIndex]?.suggested_quantity}
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
                                    {this.state.namePatientDet[tableMeta.rowIndex]?.approved_quantity}
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
            namePatientTableLoad: false,
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
                    name: 'order_no',
                    label: 'Order No',
                    options: {
                        //filter: true,
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.historyData[dataIndex]?.data.order_no;
                            return <p>{data ? data : 'Not Available'}</p>
                        },
                    },
                },
                {
                    name: 'type', // field name in the row object
                    label: 'Type',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data = this.state.historyData[dataIndex]?.data.type;
                            return <p>{data ? data : "Not Available"}</p>

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
                    name: 'sr_no', // field name in the row object
                    label: 'SR Number',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.item.sr_no ? this.state.itemData[tableMeta.rowIndex]?.item.sr_no : "Not Available"}</p>
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
                                <p>{this.state.itemData[tableMeta.rowIndex]?.item.medium_description ? this.state.itemData[tableMeta.rowIndex]?.item.medium_description : "Not Available"}</p>
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
                                <p>{this.state.itemData[tableMeta.rowIndex]?.standard_cost ? this.state.itemData[tableMeta.rowIndex]?.standard_cost : "Not Available"}</p>
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
                                <p>{this.state.itemData[tableMeta.rowIndex]?.quantity ? this.state.itemData[tableMeta.rowIndex]?.quantity : "Not Available"}</p>
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
                                <p>{this.state.itemData[tableMeta.rowIndex]?.allocated_quantity ? this.state.itemData[tableMeta.rowIndex]?.allocated_quantity : "Not Available"}</p>
                            )
                        },
                    },
                },
                {
                    name: 'priority',
                    label: 'Priority',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.itemData[tableMeta.rowIndex]?.priority ? this.state.itemData[tableMeta.rowIndex]?.priority : "Not Available"}</p>
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
                                <p>{this.state.itemData[tableMeta.rowIndex]?.status ? this.state.itemData[tableMeta.rowIndex]?.status : "Not Available"}</p>
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
                                </Grid>
                            )

                        },
                    },

                }
            ],

            scheduleColumns: [
                {
                    name: 'sr_no', // field name in the row object
                    label: 'SR Number',
                    options: {
                        filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
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
                    name: 'unit_price',
                    label: 'Unit Price',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.unit_price ? this.state.scheduleData[tableMeta.rowIndex]?.unit_price : "Not Available"}</p>
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
                                <p>{this.state.scheduleData[tableMeta.rowIndex]?.schedules.quantity ? this.state.scheduleData[tableMeta.rowIndex]?.schedules.quantity : "Not Available"}</p>
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

            consignmentDetailData: [],
            data: [],
            noOfContainer: 0,
            noOfItem: 0,
            msdOderListNo: null,
            consignmentHistoryData: [],


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

            formData: {
                limit: 20,
                page: 0,
                'order[0]': [
                    'updatedAt', 'DESC'
                ]
            },

            orderId: null,
            tableId: null,
            sequence: null,


            alert: false,
            message: '',
            severity: 'success',
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

    async approveOrder(action) {
        this.setState({ remarkAddView: false })
        let userInfo = await localStorageService.getItem('userInfo')

        let formData = {
            order_list_id: this.state.orderId,
            //approval_type: "Approved",
            status: action,
            approved_by: userInfo.id,
            role: userInfo.roles[0],
            remark: this.state.remark,
            purchase_order_id: this.state.orderId,
            owner_id: "000",
            sequence: this.state.sequence,
        }

        console.log("FormData: ", formData);
        let res = await LocalPurchaseServices.changeLPPOApprovals(formData, this.state.tableId)
        if (res.status === 200) {
            if (action === "APPROVED") {
                this.setState({
                    alert: true,
                    message: "LP Purchase Order has been Approved",
                    severity: 'success',
                    toApprove: false,
                })
            } else {
                this.setState({
                    alert: true,
                    message: "LP Purchase Order has been Rejected",
                    severity: 'success',
                    toApprove: false,
                })
            }
            setTimeout(() => {
                // this.props.history.goBack()
                window.location = '/localpurchase/order_detail_approval'
            }, 2000);
        } else {
            this.setState({
                alert: true,
                message: "LP Purchase Order was failed to get Approved or Reject",
                severity: 'error'
            })
        }
        // console.log(user_id, this.state.toApprove, this.state.orderId)
    }

    async loadData() {
        // console.log('ID: ', this.props.match.params.id)
        // let orderId = '56aadf1f-9287-460d-9f8d-812406c4ddc0';
        let formData = this.state.formData;
        let res = await PrescriptionSevice.NP_Orders_By_Id(formData, this.state.orderId)

        if (res.status === 200) {

            console.log('checking res', res)
            this.setState({
                orderData: res.data.view,
                itemData: res.data.view ? res.data.view.POItem : [],
            }, () => {
                if (res.data.view.type === 'Name Patient Order') {
                    this.loadPatientData()
                } else {
                    this.setState({
                        namePatientTableLoad: false
                    })
                }
            })
        }
        this.setState({ orderLoaded: true })
        this.loadScheduleData()
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

    // load name patient data

    async loadPatientData() {

        console.log('Ckeckign id', this.state.orderData)

        let params = this.state.namePatientForm
        params.order_id = this.state.orderData?.order_list_id

        let res = await PrescriptionService.fetchNPRrequests(params)

        if (res.status === 200) {
            console.log('Ckeckign data', res)
            this.setState({
                namePatientDet: res.data.view.data,
                namePatientTableLoad: true,
                namePatientCount: res.data.view.totalItems
            })
        }
    }

    async loadPatientSingle(id) {

        let res = await PrescriptionService.fetchNPRequestById(id)

        if (res.status === 200) {
            console.log('Ckeckign dingle data', res)
            this.setState({
                namePatientDingleDet: res.data.view,
                is_name_patient: true
            })
        }
    }

    loadScheduleData() {
        let updatedScheduleData = [];
        this.state.itemData && this.state.itemData.forEach(val => {
            val.schedule.forEach(data => {
                const updatedData = {
                    id: val.id,
                    unit_price: val?.standard_cost,
                    sr_no: val?.item.sr_no,
                    name: val?.item.medium_description,
                    schedules: data
                };
                updatedScheduleData.push(updatedData);
            });
        });

        this.setState({ filterScheduleData: updatedScheduleData.slice(0, this.state.formData.limit), totalScheduleData: updatedScheduleData, scheduleData: updatedScheduleData, scheduleLoaded: true });

        if (this.state.itemData.length === 1) {
            this.setState({ selectedId: this.state.itemData[0].id })
        }
        // console.log("Order: ", updatedScheduleData)
    }

    filterScheduleData(id) {
        const filteredData = this.state.totalScheduleData.filter(item => item.id === id);
        const startIndex = this.state.formData.page * this.state.formData.limit;
        const endIndex = startIndex + this.state.formData.limit;

        if (id !== '') {
            this.setState({ filterScheduleData: filteredData, scheduleData: filteredData })
        } else {
            this.setState({ filterScheduleData: this.state.totalScheduleData, scheduleData: this.state.totalScheduleData })
        }

        const newData = this.state.filterScheduleData.slice(startIndex, endIndex);

        this.setState({ filterScheduleData: newData })
    }

    async loadHistory() {
        let formData = { ...this.state.formData, order_list_id: "2551e9fc-3818-45b1-ae08-fee2302011f9" }
        let res = await ScheduleServices.getOrderListHistory(formData)
        if (res.status === 200) {
            this.setState({ historyData: res.data.view.data })
            // console.log("History Data: ", res.data.view.data)
        }
        this.setState({ historyLoaded: true })
    }

    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        let id = this.props.match.params.id;


        this.setState({
            orderId: id,
            approve: params.get('approve') ? params.get('approve') : null,
            tableId: params.get('table_id') ? params.get('table_id') : '',
            sequence: params.get('sequence') ? params.get('sequence') : 1
        }, () => {
            this.loadData()
            this.loadHistory()
        })
    }

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <MainContainer>
                    <LoonsCard>
                        <CardTitle title={"Order Details"} />
                        {this.state.orderLoaded ?
                            (<>
                                <Grid container spacing={1} className="flex mb-5">
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`PO No: ${this.state.orderData?.po_no ? this.state.orderData?.po_no : "Not Available"}`}</Typography>
                                    </Grid>
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
                                            variant="subtitle1">{`Type: ${this.state.orderData?.type ? this.state.orderData?.type : "Not Available"}`}</Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Estimated Value: ${this.state.orderData?.estimated_value ? roundDecimal(this.state.orderData?.estimated_value + ' (' + this.state.orderData?.currency + ')', 2) : "Not Available"}`}</Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Status: ${this.state.orderData?.status ? this.state.orderData?.status : "Not Available"}`}</Typography>
                                    </Grid>
                                </Grid>
                                <CardTitle title={'Supplier Details'} />
                                <Divider />
                                <Grid container spacing={1} className="flex mb-5">
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Name: ${this.state.orderData?.Supplier?.name ? this.state.orderData?.Supplier?.name : "Not Available"}`}</Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Contact No: ${this.state.orderData?.Supplier?.contact_no ? this.state.orderData?.Supplier?.contact_no : "Not Available"}`}</Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Company: ${this.state.orderData?.Supplier?.company ? this.state.orderData?.Supplier?.company : "Not Available"}`}</Typography>
                                    </Grid>
                                </Grid>
                                <CardTitle title={'Category Details'} />
                                <Divider />
                                <Grid container spacing={1} className="flex mb-5">
                                    <Grid item lg={4} md={4} sm={6} xs={6} >
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Code: ${this.state.orderData?.Category?.code ? this.state.orderData?.Category?.code : "Not Available"}`}</Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Name: ${this.state.orderData?.a?.name ? this.state.orderData?.a?.name : "Not Available"}`}</Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6}>
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Type: ${this.state.orderData?.a?.type ? this.state.orderData?.a?.type : "Not Available"}`}</Typography>
                                    </Grid>
                                    <Grid item lg={4} md={4} sm={6} xs={6} >
                                        <Typography className="mt-5"
                                            variant="subtitle1">{`Description: ${this.state.orderData?.Category?.description ? this.state.orderData?.Category?.description : "Not Available"}`}</Typography>
                                    </Grid>
                                </Grid>
                                {this.state.approve &&
                                    (
                                        <Grid item lg={12} md={12} sm={12} xs={12} className="flex justify-end">
                                            <Button
                                                className='px-2'
                                                onClick={() => { this.setState({ remarkAddView: true }) }}
                                                startIcon='send'
                                            >
                                                Acceptance Status
                                            </Button>
                                        </Grid>
                                    )
                                }
                            </>)
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
                        < LoonsCard>
                            <CardTitle title={"Status History"} />
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
                </MainContainer>
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
                            To approve or reject the order, please enter a remark here.
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
                        <Button size="small" variant="contained" disabled={this.state.remark === ''} style={this.state.remark !== '' ? { background: '#ff005d', color: 'white' } : { background: '#ffc7d3', color: 'white' }} onClick={() => this.approveOrder("REJECTED")}>Reject</Button>
                        <Button size="small" disabled={this.state.remark === ''} variant="contained" style={this.state.remark !== '' ? { background: '#00cbff', color: 'white' } : { background: '#a3e1ff', color: 'white' }} onClick={() => this.approveOrder("APPROVED")}>Approve</Button>
                    </DialogActions>
                </Dialog>
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

                <Dialog fullWidth maxWidth="lg" open={this.state.is_name_patient} spacing={2} className="p-5">

                    <div className='ml-5 mr-5 mt-5' style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <CardTitle title="Name Patient View" />
                        <IconButton aria-label="close" onClick={() => { this.setState({ is_name_patient: false }) }}><CloseIcon /></IconButton>
                    </div>
                    <Divider></Divider>
                    <div className="w-full h-full px-5">

                        <h6 className="mt-3">Request No : {this.state.namePatientDingleDet?.request_id}</h6>
                        <br></br>
                        <h6 className="mt-3">Patient Details</h6>
                        <Grid container spacing={2} className="mb-5">
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Name</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Patient?.title}{' ' + this.state.namePatientDingleDet?.Patient?.name}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Address</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Patient?.address}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Gender</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Patient?.gender}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>PHN</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Patient?.phn}</td>
                                    </tr>
                                </table>
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>NIC</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Patient?.nic}</td>
                                    </tr>
                                </table>
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Contact</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Patient?.contact_no}</td>
                                    </tr>
                                </table>
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Citizenship</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Patient?.citizenship}</td>
                                    </tr>
                                </table>
                            </Grid>

                        </Grid>

                        <Divider></Divider>

                        <h6 className="mt-3">Common Details</h6>
                        <Grid container spacing={2} className="mb-5">
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Clinic/Ward</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Pharmacy_drugs_store?.name}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>BHT No</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.bht_no}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Consultant</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.Employee?.name}</td>
                                    </tr>
                                </table>
                            </Grid>
                        </Grid>

                        <Divider></Divider>

                        <h6 className="mt-3">Drug Details</h6>
                        <Grid container spacing={2} className="mb-5">
                            <Grid item md={12} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '25%' }}>Drug Name</td>
                                        <td style={{ width: '75%' }}>: {this.state.namePatientDingleDet?.item_name}</td>
                                    </tr>
                                </table>
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Dose</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.dose + ' mg'}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Freq</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.DefaultFrequency?.name}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Duration</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.duration + ' Days'}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Expected Treatment Date</td>
                                        <td style={{ width: '50%' }}>: {dateParse(this.state.namePatientDingleDet?.expected_treatment_date)}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Quantity</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.suggested_quantity}</td>
                                    </tr>
                                </table>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td style={{ width: '50%' }}>Approved Quantity</td>
                                        <td style={{ width: '50%' }}>: {this.state.namePatientDingleDet?.approved_quantity}</td>
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
)(IndividualPurchaseList);