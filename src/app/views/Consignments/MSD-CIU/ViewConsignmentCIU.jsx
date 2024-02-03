import React, { Component, Fragment } from "react";
import MainContainer from "../../../components/LoonsLabComponents/MainContainer";
import CardTitle from "../../../components/LoonsLabComponents/CardTitle";
import { Grid, Typography, IconButton, Icon, Dialog, } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles'
import { LoonsCard, Button, SubTitle } from "../../../components/LoonsLabComponents";
import LoonsTable from "../../../components/LoonsLabComponents/Table/LoonsTable";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import Tooltip from "@material-ui/core/Tooltip";
import Buttons from '@material-ui/core/Button';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ConsignmentService from "../../../services/ConsignmentService";
import { convertTocommaSeparated, dateParse, dateTimeParse } from "utils";
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
});
class ViewConsignmentCIU extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalItems: 0,
            loaded: false,
            historyLoaded: false,
            historyAllView: false,
            historyDataFilters:{ limit: 20, page:0, 'order[0]': ['createdAt', 'DESC'] },
            historyTotalItems:0,
            selectedHistory: null,
            consignmentId: '',
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
                    label: 'Consignment Quantity',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'order_value',
                    label: 'Order Value',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'date_of_arrival',
                    label: 'Date of arrival',
                    options: {
                        filter: true,
                    },
                },
                {
                    name: 'delivery_value',
                    label: 'Delivery Value',
                    options: {
                        filter: true,
                    },
                },
                {
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
                    name: 'validate',
                    label: 'Validation',
                    options: {
                        filter: true,
                        customBodyRenderLite: (dataIndex) => {
                            let validate = this.state.data.ConsignmentItems[dataIndex].validate;
                            return (
                                <p> {validate} </p>
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
                            let id = this.state.data.ConsignmentItems[dataIndex].item_schedule.id;
                            let ConsignmentItems_id = this.state.data.ConsignmentItems[dataIndex].id;
                            let validate = this.state.data.ConsignmentItems[dataIndex].validate;
                            return (
                                <Grid className="px-2">
                                    <IconButton
                                        onClick={() => {
                                            window.location.href = `/consignments/msdCIU/verify_package/${id}?ConsignmentItems_id=` + ConsignmentItems_id + `&validate=` + validate;
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
            consignmentHistoryData: []
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
        console.log(this.state.data);
    }

    async getConsignmentHistory() {
        let consignmentId = this.state.consignmentId
        let params = { limit: 20, page: 0, 'order[0]': ['createdAt', 'DESC'] }
        let consignment = await ConsignmentService.getConsignmentHistory(consignmentId, this.state.historyDataFilters)

        console.log("history", consignment)
        if (consignment.status === 200) {
            this.setState({
                consignmentHistoryData: consignment.data.view.data,
                historyTotalItems:consignment.data.view.totalItems,
                historyLoaded: true
            })
        }
    }

    componentDidMount() {
        window.addEventListener("pageshow", function (event) {
            var historyTraversal = event.persisted ||
                (typeof window.performance != "undefined" &&
                    window.performance.navigation.type === 2);
            if (historyTraversal) {
                // Handle page restore.
                window.location.reload();
            }
        });
        let id = this.props.match.params.id;
        this.setState({
            consignmentId: id
        }, () => {
            this.getConsignmentHistory()
            this.getConsignmentById()
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
                                    variant="subtitle1">{`Wharf ref no: ${this.state.data.wharf_ref_no}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`WDN No / LDCN ref no: ${this.state.data.wdn_no}/${this.state.data.ldcn_ref_no}`}</Typography>
                            </Grid>

                            
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`HS Code: ${this.state.data.hs_code?this.state.data.hs_code:""}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Invoice no: ${this.state.data.invoice_no?this.state.data.invoice_no:''}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Invoice Date: ${this.state.data.invoice_date?dateParse(this.state.data.invoice_date):''}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`LDCN Ref No: ${this.state.data.ldcn_ref_no?this.state.data.ldcn_ref_no:''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`PA No: ${this.state.data.pa_no?this.state.data.pa_no:''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`PO No: ${this.state.data.po?this.state.data.po:''}`}</Typography>
                            </Grid>

                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Exchange Rate: ${convertTocommaSeparated(this.state.data.exchange_rate,2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Value(${this.state.data.currency}): ${convertTocommaSeparated(this.state.data.values_in_currency,2)}`}</Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={6} xs={6}>
                                <Typography className="mt-5"
                                    variant="subtitle1">{`Value(LKR): ${convertTocommaSeparated(this.state.data.values_in_lkr,2)}`}</Typography>
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
                                    variant="subtitle1">{`Status: ${this.state.data.status}`}</Typography>
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
                        </LoonsCard>

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
            </Fragment >
        )
    }
}

export default withStyles(styleSheet)(ViewConsignmentCIU)