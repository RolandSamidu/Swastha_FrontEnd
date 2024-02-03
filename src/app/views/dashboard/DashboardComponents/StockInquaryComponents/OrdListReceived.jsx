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
import ConsignmentService from "app/services/ConsignmentService";

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

class OrdListReceived extends Component {

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
            deleveryData: [],
            grnDetails: [],
            formData: {
                item_id: null,
                search_type: 'TOTALLIST2',
                owner_id: '000',
                // status:['APPROVED', 'PO_CREATED'],
                page: 0,
                limit: 10,
                search: null,
                with_pagination: true,
                // orderby_order_date: true,
                'order[0]': ['updatedAt', 'DESC'],
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
        let params = this.state.formData
        params.item_id = id
        params.available_po = true
        params.min_item_details = true
        params.allocated = true




        params.to = dateParse(lastDateOfYear)
        if (yearFiveYearsAgo < 2021) {
            params.from = dateParse('2021-01-01')
        } else {
            params.from = dateParse(firstDateOfYearFiveYearsAgo)
        }

        let res = await WarehouseServices.getAllPurchaseOrderItems(params)

        if (res.status === 200) {
            console.log('checking dtaattatata all list Diliverd TABLE', res)
            this.setState({
                tabledata: res.data.view.data,
                totalPages: res.data.view.totalPages
            }, () => {

                let po_item_ids = res.data?.view?.data?.map(x => x.id)
                this.getGrnDetails()
                this.getDeliveryDate(po_item_ids)

                setTimeout(() => {
                    this.setState({
                        loaded: true
                    })
                }, 300);
            })
        }

        console.log('checking state', this.state.tabledata)
    }

    async getGrnDetails() {


        const currentYear = new Date().getFullYear();
        const nextYear = new Date(currentYear + 1, 0, 1);
        const lastDateOfYear = new Date(nextYear - 86400000);
        const yearFiveYearsAgo = currentYear - 5;
        const firstDateOfYearFiveYearsAgo = new Date(yearFiveYearsAgo, 0, 1);

        let id = this.props.item_id

        let params = this.state.formData
        params.item_id = id
        // params.to = dateParse(lastDateOfYear)
        //params.from = dateParse(firstDateOfYearFiveYearsAgo)

        if (yearFiveYearsAgo < 2021) {
            params.from = dateParse('2021-01-01')
        } else {
            params.from = dateParse(firstDateOfYearFiveYearsAgo)
        }
        let res = await WarehouseServices.getOrderPosition(params)
        console.log('checking dtaattatata all list Diliverd Placed', res)
        if (res.status === 200) {
            let tabledata = this.state.tabledata
            const mergedArray = tabledata.map(obj1 => {
                console.log("Obj ", obj1.id)
                const matchingObj2 = res.data.view.data.find(obj2 => {
                    if (obj2.consignment_data) {
                        return obj2.consignment_data.po_item_id === obj1.id;
                    } else if (obj2.po_details) {
                        return obj2.po_details.id === obj1.id;
                    } else {
                        return false; // No matching condition
                    }
                });
                if (matchingObj2) {

                    return {
                        ...obj1,
                        consignment_data: matchingObj2.consignment_data,
                        standard_cost: matchingObj2.consignment_data ? matchingObj2.consignment_data.unit_price : obj1.standard_cost
                    };

                }


                return obj1;
            });

            this.setState({
                grnDetails: res.data.view.data,
                tabledata: mergedArray
            })




        }

    }
    async getDeliveryDate(po_item_ids) {
        let params = {
            search_type: "ConsignmentGRNSum",
            po_item_id: po_item_ids,
            po_item_wise: true,
            grn_ok: true,
            consignment_status: true
        }

        let res = await ConsignmentService.getConsignmentItems(params)
        if (res.status === 200) {


            this.setState({
                deleveryData: res.data.view
            })
        }
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
                                        <td className={classes.tableHeadCell}>Manufacturer</td>
                                        <td className={classes.tableHeadCell}>Supplier</td>
                                        <td className={classes.tableHeadCell}>Order Qty</td>
                                        <td className={classes.tableHeadCell}>PO Qty</td>

                                        <td className={classes.tableHeadCell}>Received Quantity</td>
                                        <td className={classes.tableHeadCell}>GRN Qty (Swastha)</td>
                                        <td className={classes.tableHeadCell}>Balance Quantity</td>
                                        <td className={classes.tableHeadCell}> Balance Quantity of PO</td>
                                        <td className={classes.tableHeadCell}>Delivery date</td>
                                        <td className={classes.tableHeadCell}>Currency</td>
                                        <td className={classes.tableHeadCell}>Unit Price</td>
                                        <td className={classes.tableHeadCell}>Total Price</td>
                                        <td className={classes.tableHeadCell}>Actions</td>

                                    </tr>
                                </thead>
                                <tbody>

                                    {this.state.tabledata.map((item) => {

                                        let deleverydate = this.state.deleveryData?.filter((x) => x.po_item_id == item.id)[0]
                                        console.log("last delevered row", deleverydate)
                                        console.log("item row data", item)
                                        return (
                                            <tr style={{ width: '100%' }}>
                                                <td className={classes.tabledataCell}>{item?.purchase_order?.order_no}</td>
                                                <td className={classes.tabledataCell}>{item?.purchase_order?.Manufacturer?.name}</td>
                                                <td className={classes.tabledataCell}>{item?.purchase_order?.Supplier?.name}</td>
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(item?.OrderListItem?.quantity || 0, 2)}</td>
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(item?.quantity || 0, 2)}</td>

                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(item?.allocated_quantity || 0, 2)}</td>

                                                {/*  <td className={classes.tabledataCell}>{convertTocommaSeparated(item?.consignment_data ? item?.consignment_data.grn_quantity : 0, 2)}</td> */}
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(deleverydate?.grn_quantity || 0, 2)}</td>

                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(Number(item?.OrderListItem?.quantity) - Number(item?.quantity ? item?.quantity : 0) || 0, 2)}</td>
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(Number(item?.quantity) - Number(item?.allocated_quantity ? item?.allocated_quantity : 0) || 0, 2)}</td>

                                                <td className={classes.tabledataCell}>{dateParse(deleverydate?.delivery_date ? deleverydate?.delivery_date : item?.updatedAt)}</td>

                                                <td className={classes.tabledataCell}>{deleverydate?.unit_price ? "LKR" : (item.purchase_order ? item.purchase_order.currency : "-")}</td>
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated(deleverydate?.unit_price ? deleverydate?.unit_price : item?.standard_cost || 0, 2)}</td>
                                                <td className={classes.tabledataCell}>{convertTocommaSeparated((deleverydate?.unit_price ? deleverydate?.unit_price : item?.standard_cost) * item.quantity || 0, 2)}</td>
                                                <td className={classes.tabledataCell}>
                                                    <div className="flex justify-center">
                                                        <Tooltip title="View PO">
                                                            <IconButton size="small" aria-label="review" onClick={() => window.open(`/purchase/purchase-details/${item?.purchase_order?.id}`, '_blank')}>
                                                                <VisibilityIcon className="text-primary" />
                                                            </IconButton>
                                                        </Tooltip>

                                                        <Tooltip title="View Order List">
                                                            <IconButton size="small" aria-label="review" onClick={() => window.open(`/order/order-list/${item?.purchase_order?.order_list_id}`, '_blank')}>
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


export default withStyles(styles)(OrdListReceived)