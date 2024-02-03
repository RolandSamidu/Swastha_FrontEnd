import React, { Component, Fragment, useState } from 'react'
import { withStyles, styled } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    IconButton,
    Icon,
    Tooltip,
    Typography,

} from '@material-ui/core'
import 'date-fns'

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    LoonsTable,
} from 'app/components/LoonsLabComponents'

import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils'


// import Item from '../item'


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
})

const renderDetailCard = (label, value) => {
    return (
        <Grid container spacing={2}>
            <Grid item lg={4} md={4} sm={4} xs={4}>
                <Grid container spacing={2}>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                        <Typography variant="subtitle1">
                            {label}
                        </Typography>
                    </Grid>
                    <Grid item lg={2} md={2} sm={2} xs={2}>
                        <Typography variant="subtitle1">:</Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item lg={8} md={8} sm={8} xs={8}>
                <Typography variant="subtitle1">
                    {value}
                </Typography>
            </Grid>
        </Grid>
    )
}


class ShipmentValues extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeStep: 1,
            role: null,

            itemList: [],
            // single_data:{},
            orderQty: 0,
            orderLKRTotal: 0,
            orderExchageTotal: 0,
            transitQty: 0,
            transitLKRTotal: 0,
            transitExchageTotal: 0,
            allocatedQty: 0,
            allocatedLKRTotal: 0,
            allocatedExchangeTotal: 0,

            collapseButton: 0,
            userRoles: [],

            alert: false,
            message: '',
            severity: 'success',

            data: [],
            columns: [
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // let id = this.state.data[tableMeta.rowIndex].id
                            return (
                                <>
                                    {this.state.data[tableMeta.rowIndex]?.edit_selected ?
                                        <Tooltip title="Save PO">
                                            <IconButton
                                                className="text-black mr-2"
                                                onClick={() => {
                                                    this.selectRow(tableMeta.rowIndex)
                                                    // window.location = `/spc/wdn_consignment_list/123`
                                                    // this.setState({ approveOpen: true })
                                                }}
                                            >
                                                <Icon color='primary'>save</Icon>
                                            </IconButton>
                                        </Tooltip>
                                        :
                                        <Tooltip title="Edit PO">
                                            <IconButton
                                                className="text-black mr-2"
                                                onClick={() => {
                                                    this.selectRow(tableMeta.rowIndex)
                                                    // window.location = `/spc/wdn_consignment_list/123`
                                                    // this.setState({ approveOpen: true })
                                                }}
                                            >
                                                <Icon color='primary'>edit</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'sr_no',
                    label: 'Sr No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.data[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap ? this.state.data[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap?.sr_no : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'item_name',
                    label: 'Description',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.data[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap ? this.state.data[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap?.medium_description : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'order_quantity',
                    label: 'Ordered Quantity',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.data[tableMeta.rowIndex]?.quantity ? convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.quantity, 0) : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'unit_type',
                    label: 'UOM',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.data[tableMeta.rowIndex]?.SPCPOItem?.unit_type ? this.state.data[tableMeta.rowIndex]?.SPCPOItem?.unit_type : "N/A"}</p>
                        }
                    },
                },
                {
                    name: 'per',
                    label: 'Per',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.data[tableMeta.rowIndex]?.SPCPOItem?.unit ? this.state.data[tableMeta.rowIndex]?.SPCPOItem?.unit : "N/A"}</p>
                        }
                    },
                },
                {
                    name: 'unit',
                    label: 'Item Price',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.data[tableMeta.rowIndex]?.SPCPOItem?.price ? convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.SPCPOItem?.price, 0) : "N/A"}</p>)
                        }
                    },
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Quantity',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.data[tableMeta.rowIndex]?.allocated_quantity ? convertTocommaSeparated(this.state.data[tableMeta.rowIndex]?.allocated_quantity, 0) : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'transit_qty',
                    label: 'Transit Quantity',
                    options: {
                        display: true,
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <TextValidator
                                    className='w-full'
                                    placeholder="Transit Quantity"
                                    //variant="outlined"
                                    disabled={!this.state.data[tableMeta.rowIndex]?.edit_selected}
                                    // disabled={isadded.length == 1 ? false : true}
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    type='number'
                                    min={0}
                                    value={
                                        // this.state.selectedData[this.state.selectedData.indexOf(isadded[0])]?.qty
                                        String(this.state.data[tableMeta.rowIndex]?.transit_qty ?? 0)
                                    }
                                    onChange={(e, value) => {
                                        const { data } = this.state;
                                        const newData = [...data];
                                        newData[tableMeta.rowIndex].transit_qty = e.target.value !== "" ? parseInt(e.target.value, 10) : 0;
                                        this.setState({ data: newData });
                                    }}

                                    validators={[
                                        'required', 'minNumber: 0', "maxNumber: " + parseInt(parseInt(this.state.data[tableMeta.rowIndex]?.quantity ?? 0, 10) - parseInt(this.state.data[tableMeta.rowIndex]?.allocated_quantity ?? 0, 10), 10)

                                    ]}
                                    errorMessages={[
                                        'this field is required', 'Quantity Should Greater-than: 0 ', "Over Quantity"
                                    ]}
                                />
                            )
                        }
                    },
                },
                {
                    name: 'remaining_qty',
                    label: 'Remaining Quantity',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            const rowData = this.state.data[tableMeta.rowIndex];

                            if (!rowData) {
                                return <p>N/A</p>; // Handle missing data gracefully
                            }

                            let renderedValue = 'N/A'; // Default value

                            const quantity = parseInt(rowData.quantity, 10);
                            const transitQty = parseInt(rowData.transit_qty, 10);
                            const allocatedQty = parseInt(rowData.allocated_quantity ?? 0, 10);

                            // Calculate the value based on different scenarios
                            if (!isNaN(quantity)) {
                                if (!isNaN(transitQty)) {
                                    renderedValue = quantity - transitQty - allocatedQty;
                                } else {
                                    renderedValue = quantity - allocatedQty;
                                }
                            }

                            return <p>{isNaN(renderedValue) ? 'N/A' : renderedValue}</p>;
                        }
                    },
                },
            ],

            // loading: false,
            // single_loading: false,
            filterData: {},

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
                // item_id: this.props.match.params.item_id
            },
        }

    }

    async setPage(page) {
        //Change paginations
        let formData = this.state.filterData
        formData.page = page
        this.setState({
            formData
        }, () => {
            console.log("New Form Data: ", this.state.formData)
            this.loadData()
        })
    }

    selectRow = (index) => {
        this.setState(prevState => {
            const newData = [...prevState.data]; // Create a new array
            newData[index] = { ...newData[index], edit_selected: !newData[index].edit_selected };
            return { data: newData };
        }, () => {
            console.log("Selected Data :", this.state.data);
        });
    }

    handleDeselectAll = () => {
        this.setState(prevState => ({
            data: prevState.data.map(item => ({ ...item, edit_selected: false }))
        }));
    }

    onSubmit = () => {
        const data = { ...this.state.filterData, order_amount: this.state.transitLKRTotal, total: this.state.orderLKRTotal, values_in_currency: this.state.transitLKRTotal, values_in_lkr: this.state.transitLKRTotal }
        this.props.updateData(data);
        this.handleDeselectAll();
        this.props.handleNext()
    };



    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.handleDeselectAll();
        this.props.handleBack()
    };


    componentDidMount() {
        const { data, itemData, allChargers } = this.props
        this.setState({ allChargers: allChargers, filterData: data, data: itemData.filter(item => item.selected === true) }, () => {
            const transit_qty = this.handleTransitQuantity();
            const order_qty = this.handleOrderQuantity();
            const order_lkr = this.handleOrderLKRTotal();
            const order_exchange = this.handleOrderExchageTotal();
            console.log('cheking data', order_exchange)
            const transit_lkr = this.handleTransitLKRTotal();
            const transit_exchange = this.handleTransitExchangeTotal();
            const allocated_qty = this.handleAllocatedQuantity();
            const allocated_exchange = this.handleAllocatedExchangeTotal();
            const allocated_lkr = this.handleAllocatedLKRTotal();
            this.setState({
                transitQty: transit_qty,
                transitExchageTotal: transit_exchange,
                transitLKRTotal: transit_lkr,
                orderQty: order_qty,
                orderLKRTotal: order_lkr,
                orderExchageTotal: order_exchange,
                allocatedQty: allocated_qty,
                allocatedLKRTotal: allocated_lkr,
                allocatedExchangeTotal: allocated_exchange
            });
        })
    }

    handleTransitQuantity = () => {
        const quantity = this.state.data.reduce((accumulator, item) => {
            return accumulator + (item?.transit_qty ?? 0);
        }, 0);
        return quantity;
    };

    calculateTransitItemTotal = (item) => {
        return (
            parseInt(parseFloat(item?.transit_qty ?? 0))
        );
    };

    handleTransitLKRTotal = () => {

        const quantity = this.handleOrderQuantity()

        // let freight_charges = isNaN(parseFloat(this.state.allChargers?.freight_chargers)) ? 0 : parseFloat(this.state.allChargers?.freight_chargers);
        // let other_charges = isNaN(parseFloat(this.state.allChargers?.other_charge)) ? 0 : parseFloat(this.state.allChargers?.other_charge)
        // let total_tax = parseFloat(this.state.allChargers?.total_tax)

        // let charges = isNaN(parseFloat(freight_charges + other_charges)) ? 0 : parseFloat(freight_charges + other_charges)

        // let total_charges  = isNaN(parseFloat((charges)/quantity)) ? 0 : parseFloat((charges)/quantity)

        // console.log('this.state.data', this.state.data)

        let getUnitPrice = this.state.data.map((e) => {
            // let set_unit = 1
            // let price = isNaN(parseFloat(e?.SPCPOItem?.price)) ? 0 : parseFloat(e?.SPCPOItem?.price)
            // let transit_qty = isNaN(parseFloat(e?.transit_qty)) ? 0 : parseFloat(e?.transit_qty)

            // if (e?.SPCPOItem?.unit == 0 || e?.SPCPOItem?.unit == null) {
            //     set_unit = 1
            // } else {
            //     set_unit = isNaN(parseFloat(e?.SPCPOItem?.unit)) ? 0 : parseFloat(e?.SPCPOItem?.unit)
            // }

            // /* Transit Qty Calculation
            // Cal = ((grandTotal-tax-discount)/ orderQty))* consignmentQty
            // grandTotal = SPCPOItem?.MSDPurchaseOrder?.sub_total
            // tax = SPCPOItem?.MSDPurchaseOrder?.total_tax
            // discount = SPCPOItem?.MSDPurchaseOrder?.total_discount
            // quantity = quantity
            // Consignment = transit_qty */
            // // let total_payable = isNaN(parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_payable))? 0: parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_payable);
            // // console.log('total_payable', total_payable)
            // let total_tax = isNaN(parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_tax))? 0: parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_tax);
            // // console.log('total_tax', total_tax)
            // let sub_total = isNaN(parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.sub_total))? 0: parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.sub_total);
            // // console.log('sub_total', sub_total)
            // let total_discount = isNaN(parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_discount))? 0: parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_discount);
            // // console.log('total_discount', total_discount)
            // // 
            // let all_charges = isNaN(sub_total - total_tax - total_discount)? 0 : (sub_total - total_tax - total_discount)
            // // console.log('all_charges', all_charges)

            // // let unit_price = isNaN(parseFloat(e?.SPCPOItem?.price)) ? 0 : parseFloat(e?.SPCPOItem?.price)
            // // console.log('unit_price', unit_price)
            // // let unit_per = isNaN(parseFloat(e?.SPCPOItem?.unit))? 0 : parseFloat(e?.SPCPOItem?.unit)
            // // console.log('unit_per', unit_per)
            // let transit_qty = isNaN(parseFloat(e?.transit_qty)) ? 0 : parseFloat(e?.transit_qty)
            // // console.log('transit qty', transit_qty)
            // // let unit_per_price = unit_price / unit;
            // let unit_price_with_charges = (all_charges / quantity);
            // // console.log('unit_per_price', unit_price/unit_per)
            // // console.log('unit_price_with_charge', unit_price_with_charges)

            // let transit_amount = unit_price_with_charges * transit_qty;
            // // console.log('transit_amount', transit_amount)


            // ---------new change

            /* Transit Qty Calculation
            Cal = ((grandTotal-tax-discount)/ orderQty))* consignmentQty
            grandTotal = SPCPOItem?.MSDPurchaseOrder?.sub_total
            tax = SPCPOItem?.MSDPurchaseOrder?.total_tax
            discount = SPCPOItem?.MSDPurchaseOrder?.total_discount
            quantity = quantity
            Consignment = transit_qty */
            // let total_payable = isNaN(parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_payable))? 0: parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_payable);
            // console.log('total_payable', total_payable)
            // let total_tax = isNaN(parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_tax))? 0: parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_tax);
            // console.log('total_tax', total_tax)
            // let sub_total = isNaN(parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.sub_total))? 0: parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.sub_total);
            // console.log('sub_total', sub_total)
            let total_discount = isNaN(parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_discount)) ? 0 : parseFloat(e?.SPCPOItem?.MSDPurchaseOrder?.total_discount);
            // console.log('total_discount', total_discount)
            // 
            // let all_charges = isNaN(sub_total - total_tax - total_discount)? 0 : (sub_total - total_tax - total_discount)
            // console.log('all_charges', all_charges)

            let unit_price = isNaN(parseFloat(e?.SPCPOItem?.price)) ? 0 : parseFloat(e?.SPCPOItem?.price)
            // console.log('unit_price', unit_price)
            let unit_per = isNaN(parseFloat(e?.SPCPOItem?.unit)) ? 0 : parseFloat(e?.SPCPOItem?.unit)
            // console.log('unit_per', unit_per)
            let transit_qty = isNaN(parseFloat(e?.transit_qty)) ? 0 : parseFloat(e?.transit_qty)
            // console.log('transit qty', transit_qty)
            let order_qty = isNaN(parseFloat(e?.SPCPOItem?.order_quantity)) ? 0 : parseFloat(e?.SPCPOItem?.order_quantity)
            // console.log('order_qty', order_qty);
            let unit_per_price = (unit_price / unit_per);
            // console.log('unit_per_price', unit_per_price)
            let item_dis_qty_per_price = (total_discount / quantity) * order_qty
            // console.log('item_dis_qty_per_price', item_dis_qty_per_price)
            let unit_price_with_charges = (unit_per_price - item_dis_qty_per_price);
            // console.log('unit_per_price', unit_price/unit_per)
            // console.log('unit_price_with_charge', unit_price_with_charges)

            let transit_amount = unit_price_with_charges * transit_qty;
            // console.log('transit_amount', transit_amount)

            return (transit_amount)
        })

        const sum = parseFloat(getUnitPrice.reduce((accumulator, currentValue) => accumulator + currentValue, 0));


        console.log('cheking final value', sum)

        return sum;
    };

    handleTransitExchangeTotal = () => {
        const orderAmount = this.handleOrderExchageTotal()
        const quantity = this.handleOrderQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)

        const total = this.state.data.reduce((accumulator, item) => {
            const itemTotal = this.calculateTransitItemTotal(item);
            return accumulator + (itemTotal * itemPerPrice);
        }, 0);

        return total;
    };

    handleOrderLKRTotal = () => {
        const { exchangeRate, totalPayable, total_tax } = this.props
        return parseFloat(exchangeRate ?? 1) * parseFloat((totalPayable - total_tax) ?? 0);
    };

    handleOrderExchageTotal = () => {
        const { totalPayable } = this.props
        return parseFloat(totalPayable ?? 0);
    };

    handleOrderQuantity = () => {
        const { itemData } = this.props

        // console.log("ceking itemdata", quantity)
        const quantity = itemData.reduce((accumulator, item) => {
            return accumulator + parseInt(item?.quantity ?? 0, 10);
        }, 0);
        return quantity;
    };

    handleAllocatedQuantity = () => {
        const { itemData } = this.props
        const quantity = itemData.reduce((accumulator, item) => {
            return accumulator + parseInt(item?.allocated_quantity ?? 0, 10);
        }, 0);
        return quantity;
    };

    handleAllocatedExchangeTotal = () => {
        const orderAmount = this.handleOrderExchageTotal()
        const quantity = this.handleOrderQuantity()
        const allocatedQuantity = this.handleAllocatedQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)
        const total = parseFloat(allocatedQuantity * itemPerPrice)

        return total;
    };

    // calculateTransitTotal = () => {


    //     let charges = freight charges + other charges - tax - discount
    // }


    handleAllocatedLKRTotal = () => {
        const orderAmount = this.handleOrderLKRTotal()
        const quantity = this.handleOrderQuantity()
        const allocatedQuantity = this.handleAllocatedQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)
        const total = parseFloat(allocatedQuantity * itemPerPrice)

        return total;
    };

    componentDidUpdate(prevProps, prevState) {
        if (this.state.data !== prevState.data) {
            const transit_qty = this.handleTransitQuantity();

            const order_qty = this.handleOrderQuantity();
            const order_lkr = this.handleOrderLKRTotal();
            const order_exchange = this.handleOrderExchageTotal();
            const transit_lkr = this.handleTransitLKRTotal();
            const transit_exchange = this.handleTransitExchangeTotal();
            const allocated_qty = this.handleAllocatedQuantity();
            const allocated_exchange = this.handleAllocatedExchangeTotal();
            const allocated_lkr = this.handleAllocatedLKRTotal();
            this.setState({
                transitQty: transit_qty,
                transitExchageTotal: transit_exchange,
                transitLKRTotal: transit_lkr,
                orderQty: order_qty,
                orderLKRTotal: order_lkr,
                orderExchageTotal: order_exchange,
                allocatedQty: allocated_qty,
                allocatedLKRTotal: allocated_lkr,
                allocatedExchangeTotal: allocated_exchange
            });
        }
    }

    render() {
        let { theme } = this.props
        const { classes } = this.props

        return (
            <Fragment>
                <div className="pb-8 pt-2">
                    {/* Filtr Section */}
                    <ValidatorForm
                        className="pt-2"
                        onSubmit={this.onSubmit}
                        onError={() => null}
                    >
                        {/* Main Grid */}
                        <Grid container spacing={2} direction="row">
                            {/* Filter Section */}
                            <Grid item xs={12} className='mb-5' sm={12} md={12} lg={12}>
                                {/* Item Series Definition */}
                                <Grid container spacing={2}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={12}
                                        lg={12}
                                    >
                                        <Grid container spacing={2}>
                                            <Grid item lg={12} md={12} sm={12} xs={12} className='px-4 py-4' style={{ borderRadius: "10px", backgroundColor: "#3B71CA", margin: "0 8px" }}>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Order Total', `LKR ${convertTocommaSeparated(this.state.orderLKRTotal, 4)}`)}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Order Quantity', convertTocommaSeparated(this.state.orderQty, 0))}
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>



                                                            {renderDetailCard('Transit Total', `LKR ${convertTocommaSeparated(this.state.transitLKRTotal, 4)}`)}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Transit Quantity', `${convertTocommaSeparated(this.state.transitQty, 0)}`)}
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Allocated Total', `LKR ${convertTocommaSeparated(this.state.allocatedLKRTotal, 4)}`)}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Allocated Quantity', `${convertTocommaSeparated(this.state.allocatedQty, 0)}`)}
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid
                                                    className=" w-full"
                                                    item
                                                    lg={12}
                                                    md={12}
                                                    sm={12}
                                                    xs={12}
                                                >
                                                    <div style={{ display: "flex", flexDirection: "row" }}>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Remaining Total', `LKR ${convertTocommaSeparated(this.state.orderLKRTotal - this.state.transitLKRTotal - this.state.allocatedLKRTotal, 4)}`)}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Remaining Quantity', `${convertTocommaSeparated(this.state.orderQty - this.state.transitQty - this.state.allocatedQty, 0)}`)}
                                                        </div>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12} className='px-4 py-4 mb-5'>
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allApprovedPO'}
                                                    data={this.state.data}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        rowsPerPage: 10,
                                                        page: 0,
                                                        serverSide: true,
                                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                        print: true,
                                                        count: this.state.data.length,
                                                        viewColumns: true,
                                                        download: true,
                                                        onTableChange: (
                                                            action,
                                                            tableState
                                                        ) => {
                                                            console.log(
                                                                action,
                                                                tableState
                                                            )
                                                            switch (action) {
                                                                case 'changePage':
                                                                    // this.setPage(
                                                                    //     tableState.page
                                                                    // )
                                                                    break
                                                                case 'changeRowsPerPage':
                                                                    // this.setState({
                                                                    //     filterData: {
                                                                    //         limit: tableState.rowsPerPage,
                                                                    //         page: 0,
                                                                    //     },
                                                                    // }, () => {
                                                                    //     // this.loadData()
                                                                    // })
                                                                    break;
                                                                case 'sort':
                                                                    //this.sort(tableState.page, tableState.sortOrder);
                                                                    break
                                                                default:
                                                                    console.log(
                                                                        'action not handled.'
                                                                    )
                                                            }
                                                        },
                                                    }}
                                                ></LoonsTable>
                                            </Grid>
                                            {/* <Grid item lg={12} md={12} sm={12} xs={12} className='w-full my-4 mx-4 px-4 py-4' style={{ backgroundColor: "#FFB6C1", borderRadius: "12px" }}>
                                                <table style={{ width: "100%", border: "1px solid black", backgroundColor: "white" }}>
                                                    <thead>
                                                        <tr style={{ backgroundColor: "#626566", border: "1px solid black", borderCollapse: "collapse", height: "40px" }}>
                                                            <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Order Qty</th>
                                                            <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Received Qty</th>
                                                            <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>Pending Qty</th>
                                                            <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>FOC Qty</th>
                                                            <th style={{ color: "white", fontWeight: "bold", width: "20%" }}>FOC Items</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr style={{ height: "40px" }}>
                                                            <td style={{ width: "20%", textAlign: "center" }}>{convertTocommaSeparated('130000')}</td>
                                                            <td style={{ width: "20%", textAlign: "end" }}>{convertTocommaSeparated('129000')}</td>
                                                            <td style={{ width: "20%", textAlign: "end" }}>{convertTocommaSeparated('1000')}</td>
                                                            <td style={{ width: "20%", textAlign: "end" }}>{convertTocommaSeparated('300')}</td>
                                                            <td style={{ width: "20%", textAlign: "center" }}>
                                                                <p>SR 0001 : 100</p>
                                                                <p>SR 0002 : 200</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Grid> */}
                                            <Grid
                                                className='mt-5'
                                                style={{ display: "flex", height: 'fit-content', alignSelf: "flex-end" }}
                                                item
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                xs={12}
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid
                                                        item
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                        xs={12}
                                                        className=" w-full flex justify-end"
                                                    >
                                                        {/* Submit Button */}
                                                        <Button
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="chevron_left"
                                                            style={{ borderRadius: "10px" }}
                                                            onClick={this.onBack}
                                                        >
                                                            <span className="capitalize">
                                                                Previous
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            className="mr-2 py-2 px-4"
                                                            progress={false}
                                                            // type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            startIcon="close"
                                                            style={{ backgroundColor: "white", color: "black", border: "1px solid #3B71CA", borderRadius: "10px" }}
                                                            onClick={this.props.handleClose}
                                                        >
                                                            <span className="capitalize">
                                                                Cancel
                                                            </span>
                                                        </Button>
                                                        <Button
                                                            style={{ borderRadius: "10px" }}
                                                            className="py-2 px-4"
                                                            progress={false}
                                                            type="submit"
                                                            scrollToTop={
                                                                true
                                                            }
                                                            endIcon="chevron_right"
                                                        // onClick={this.props.handleNext}
                                                        >
                                                            <span className="capitalize">
                                                                Next
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            {/* Submit and Cancel Button */}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </div>
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
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(ShipmentValues)
