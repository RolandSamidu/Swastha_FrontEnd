import React, { Component, Fragment } from "react";
import {
    LoonsTable,
    LoonsCard,
    MainContainer,
    SubTitle,
    Button
} from "app/components/LoonsLabComponents";
import { Grid, InputAdornment, CircularProgress, Tooltip, IconButton } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility';
import ListIcon from '@material-ui/icons/List';
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import WarehouseServices from "app/services/WarehouseServices";
import { convertTocommaSeparated, dateParse, yearParse } from "utils";
import InventoryService from "app/services/InventoryService";
import EstimationService from "app/services/EstimationService";
import SearchIcon from '@material-ui/icons/Search';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import { withStyles } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';

const styles = {
    /*  root: {
         '& > * + *': {
             marginTop: theme.spacing(2),
         },
     }, */
    tableHeadCell: {
        width: '8.3%', textAlign: 'center', backgroundColor: '#05e383', fontWeight: 600
    },
    tabledataCell: {
        textAlign: 'center'
    }
};

class StockInquiryOrderList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            alert: false,
            message: "",
            severity: 'success',
            monthlyReq: null,
            data: [],
            tabledata: [],


            formData: {
                item_id: null,
                search_type: 'TOTALLIST2',
                // status:['APPROVED', 'PO_CREATED'],
                owner_id:'000',
                page: 0,
                limit: 10,
                search: null,
                with_pagination: true,
                // orderby_order_date: true,
                'order[0]': ['order_date', 'ASC'],
                order: ['order_date']
            },
            totalItems: 0,
            totalPages: 1,

            columns: [











                {
                    name: 'mts',
                    label: 'Mts',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                            let data =
                                this.state.monthlyReq ? convertTocommaSeparated((((Number(this.state.tabledata[dataIndex]?.quantity) - Number(this.state.tabledata[dataIndex]?.consignment_data?.grn_quantity)) ? (Number(this.state.tabledata[dataIndex]?.quantity) - Number(this.state.tabledata[dataIndex]?.consignment_data?.grn_quantity)) : 0) / this.state.monthlyReq) || 0, 2) : 0
                            return <p>{data}</p>
                        },
                    },
                },

            ]
        }
    }

    async getData() {

        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);

        let id = this.props.item_id
        console.log('checking dtaattatata id', id)
        let params = this.state.formData
        params.item_id = id
        params.to = dateParse(lastDateOfYear)
        //params.from = dateParse(firstDateOfYearFiveYearsAgo)

        if (yearFiveYearsAgo < 2021) {
            params.from = dateParse('2021-01-01')
        } else {
            params.from = dateParse(firstDateOfYearFiveYearsAgo)
        }

        let res = await WarehouseServices.getOrderPosition(params)

        if (res.status === 200) {
            console.log('checking dtaattatata all list order', res)
            this.setState({
                tabledata: res.data.view.data,
                totalPages: res.data.view.totalPages
            }, () => {
                this.getMonthlyReq()
                setTimeout(() => {
                    this.setState({
                        loaded: true
                    })
                }, 300);
            })
        }

        console.log('checking state', this.state.tabledata)
    }

    async getMonthlyReq() {
        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);
        let id = this.props.item_id

        let params1 = {
            item_id: id,
            estimation_from: dateParse(firstDateOfYearFiveYearsAgo),
            estimation_to: dateParse(lastDateOfYear),
            estimation_type: 'Annual',
            search_type: 'EstimationGroup'

        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        console.log("Current month:", currentMonth);

        const monthList = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'june', 'july', 'aug', 'sep', 'oct', 'nov', 'dec']
        console.log('monthList', monthList[currentMonth])

        let params = {
            item_id: id,
            year: yearParse(new Date())
        }

        let res = await InventoryService.monthlyRequiremnt(params)
        console.log('data monthly req', res)
        if (res.status === 200) {
            let value = res.data.view.data.map((index) => {
                const currentMonthName = monthList[currentMonth - 1];
                return index[currentMonthName];
            })

            if (value[0]) {
                this.setState({
                    monthlyReq: value[0],
                })
            } else {
                let res2 = await EstimationService.getAllEstimationITEMS(params1)

                if (res2.status === 200) {
                    let estimation = res2.data.view[0]?.estimation / 12

                    this.setState({
                        monthlyReq: estimation,
                    })
                }
            }
        }
        console.log('monthly mts', this.state.monthlyReq)
    }

    componentDidMount() {
        this.setPage(0)
        // this.getMonthlyReq()
    }

    setPage = (value) => {
        let formData = this.state.formData
        formData.page = value
        this.setState({ formData }, () => {
            this.getData()
        })
    };

    render() {
        const { classes } = this.props
        return (
            <Fragment>
                <Grid container className="px-main-4 m-1">



                    {this.state.loaded ?

                        <div className="w-full">
                            <table className="w-full" border="1" cellpadding="1" cellspacing="1" style={{ borderColor: 'white' }} >
                                <thead>
                                    <tr style={{ width: '100%' }}>
                                        <td className={classes.tableHeadCell}>Order List Number</td>
                                        <td className={classes.tableHeadCell}>Supplier</td>
                                        <td className={classes.tableHeadCell}>Order Req date</td>
                                        <td className={classes.tableHeadCell}>Order Placed date</td>
                                        <td className={classes.tableHeadCell}>Order List Qty</td>
                                        {/* <td className={classes.tableHeadCell}>Mts</td> */}
                                        <td className={classes.tableHeadCell}>Qty Ordered</td>
                                        {/* <td className={classes.tableHeadCell}>Mts</td> */}
                                        <td className={classes.tableHeadCell}>Qty Received</td>
                                        {/* <td className={classes.tableHeadCell}>Mts</td> */}
                                        <td className={classes.tableHeadCell}>GRN Qty (Swastha)</td>
                                        {/* <td className={classes.tableHeadCell}>Mts</td> */}
                                        <td className={classes.tableHeadCell}>Balance</td>
                                        <td className={classes.tableHeadCell}>Status</td>
                                        <td className={classes.tableHeadCell}>Actions</td>
                                    </tr>
                                </thead>
                                <tbody>

                                    {this.state.tabledata.map((item) => {
                                        return (
                                            <tr style={{ width: '100%' }}>
                                                <td className={classes.tabledataCell}>{item?.OrderList?.order_no}</td>
                                                <td className={classes.tabledataCell}>{item?.po_details?.supplier}</td>
                                                <td className={classes.tabledataCell}>{dateParse(item?.OrderList?.order_date)}</td>
                                                <td className={classes.tabledataCell}>{(dateParse(item?.OrderList?.createdAt) == "2023-05-07" || dateParse(item?.OrderList?.createdAt) == "2023-07-09") ? dateParse(item?.OrderList?.order_date) : dateParse(item?.OrderList?.createdAt)}</td>

                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(item?.quantity || 0, 2)}</td>
                                                {/* <td className={classes.tabledataCell}>{this.state.monthlyReq ? convertTocommaSeparated(((item?.quantity ? item?.quantity : 0) / this.state.monthlyReq) || 0, 2) : 0}</td> */}
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(item?.po_details?.pending_quantity || 0, 2)}</td>
                                                {/* <td className={classes.tabledataCell}>{this.state.monthlyReq ? convertTocommaSeparated(((item?.po_details?.pending_quantity ? item?.po_details?.pending_quantity : 0) / this.state.monthlyReq) || 0, 2) : 0}</td> */}
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(item?.po_details?.recieved_quantity || 0, 2)}</td>
                                                {/* <td className={classes.tabledataCell}>{this.state.monthlyReq ? convertTocommaSeparated(((item?.po_details?.recieved_quantity ? item?.po_details?.recieved_quantity : 0) / this.state.monthlyReq) || 0, 2) : 0}</td> */}
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(item?.consignment_data?.grn_quantity || 0, 2)}</td>
                                                {/* <td className={classes.tabledataCell}>{this.state.monthlyReq ? convertTocommaSeparated(((item?.consignment_data?.grn_quantity ? item?.consignment_data?.grn_quantity : 0) / this.state.monthlyReq) || 0, 2) : 0}</td> */}
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(((Number(item?.quantity) - Number(item?.po_details?.recieved_quantity ? item?.po_details?.recieved_quantity : 0)) || 0), 2)}</td>
                                                <td className={classes.tabledataCell}>{item?.OrderList?.status}</td>
                                                <td className={classes.tabledataCell}>
                                                    <div className="flex justify-center">
                                                        {/* <Tooltip title="View PO">
                                                            <IconButton size="small" aria-label="review" onClick={() => window.open(`/purchase/purchase-details/${item?.purchase_order?.id}`, '_blank')}>
                                                                <VisibilityIcon className="text-primary" />
                                                            </IconButton>
                                                        </Tooltip> */}

                                                        <Tooltip title="View Order List">
                                                            <IconButton size="small" aria-label="review" onClick={() => window.open(`/order/order-list/${item?.order_list_id}`, '_blank')}>
                                                                <ListIcon className="text-primary" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>

                                                </td>

                                            </tr>
                                        )
                                    })}



                                </tbody>
                            </table>

                            <div className={classes.root}>
                                <Pagination count={this.state.totalPages} page={this.state.formData.page + 1} onChange={(e, value) => { this.setPage(value - 1) }} />
                            </div>
                        </div>





                        :
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    }


                </Grid>
            </Fragment>
        );
    }
}


export default withStyles(styles)(StockInquiryOrderList)