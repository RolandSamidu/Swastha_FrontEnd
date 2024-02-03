import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
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
    Button,
    LoonsSnackbar,
    LoonsTable,
} from 'app/components/LoonsLabComponents'
import { convertTocommaSeparated } from 'utils'

import SPCServices from 'app/services/SPCServices'


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

            itemList: [],
            itemData: [],
            totalItems: 0,

            orderQty: 0,
            orderLKRTotal: 0,
            orderExchageTotal: 0,
            transitQty: 0,
            transitLKRTotal: 0,
            transitExchageTotal: 0,
            allocatedQty: 0,
            allocatedLKRTotal: 0,
            allocatedExchangeTotal: 0,

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
                            return (
                                <>
                                    {this.state.itemList[tableMeta.rowIndex].selected ?
                                        <Tooltip title="Item Selected">
                                            <IconButton
                                                className="text-black mr-2"
                                                onClick={() => null}
                                            >
                                                <Icon color='secondary'>check_circle</Icon>
                                            </IconButton>
                                        </Tooltip> :
                                        <Tooltip title="Item Unselected">
                                            <IconButton
                                                className="text-black mr-2"
                                                onClick={() => null}
                                            >
                                                <Icon color='error'>highlight_off</Icon>
                                            </IconButton>
                                        </Tooltip>
                                    }
                                </>
                            )
                        },
                    },
                },
                {
                    name: 'sequence',
                    label: 'Sequence',
                    options: {
                        filter: true,
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p style={{ textAlign: "center" }}>{tableMeta.rowIndex + 1}</p>
                            );
                        }
                    },
                },
                {
                    name: 'sr_no',
                    label: 'Sr No',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap ? this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap?.sr_no : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'item_name',
                    label: 'Description',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap ? this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.ItemSnap?.medium_description : "Not Available"}</p>
                        }
                    },
                },
                {
                    name: 'unit_type',
                    label: 'UOM',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.unit_type ? this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.unit_type : "N/A"}</p>
                        }
                    },
                },
                {
                    name: 'per',
                    label: 'Per',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.unit ? this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.unit : "N/A"}</p>
                        }
                    },
                },
                {
                    name: 'unit',
                    label: 'Item Price',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.price ? convertTocommaSeparated(this.state.itemList[tableMeta.rowIndex]?.SPCPOItem?.price, 0) : "N/A"}</p>)
                        }
                    },
                },
                {
                    name: 'order_quantity',
                    label: 'Ordered Quantity',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.quantity ? this.state.itemList[tableMeta.rowIndex]?.quantity : "N/A"}</p>
                        }
                    },
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Quantity',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return <p>{this.state.itemList[tableMeta.rowIndex]?.allocated_quantity ? this.state.itemList[tableMeta.rowIndex]?.allocated_quantity : "N/A"}</p>
                        }
                    },
                },
                {
                    name: 'transit_qty',
                    label: 'Transit Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (<p>{this.state.itemList[tableMeta.rowIndex]?.transit_quantity ? convertTocommaSeparated(this.state.itemList[tableMeta.rowIndex]?.transit_quantity, 0) : "0"}</p>)
                        }
                    }
                },
                {
                    name: 'remaining_qty',
                    label: 'Remaining Qty',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <p>{
                                    (() => {
                                        const quantity = parseInt(this.state.itemList[tableMeta.rowIndex]?.quantity, 10) || 0;
                                        // const transitQuantity = parseInt(this.state.itemList[tableMeta.rowIndex]?.transit_quantity, 10) || 0;
                                        const allocatedQuantity = parseInt(this.state.itemList[tableMeta.rowIndex]?.allocated_quantity || 0);
                                        const remainingQuantity = Math.max(quantity - allocatedQuantity, 0);

                                        return isNaN(remainingQuantity) ? 'N/A' : remainingQuantity;
                                    })()
                                }</p>
                            )
                        }
                    },
                },
            ],

            filterData: {},

            formData: {
                limit: 20,
                page: 0,
                'order[0]': ['updatedAt', 'DESC'],
            },
        }
    }

    loadItemData = async () => {
        const { data } = this.props
        try {
            const spcConsignmentItems = data?.consignmentItems;
            const consignmentItemIds = spcConsignmentItems.map(item => item.item_id);

            if (Array.isArray(spcConsignmentItems) && spcConsignmentItems.length > 0) {
                let itemResponse = await SPCServices.getAllSPCPODeliverySchedules({ spc_po_id: spcConsignmentItems[0].spc_po_id });
                const initialArray = itemResponse.data.view.data;
                const newArray = initialArray.map(item => {
                    const matchingIndex = consignmentItemIds.indexOf(item.id);

                    if (matchingIndex !== -1) {
                        return {
                            ...item,
                            selected: true,
                            transit_quantity: spcConsignmentItems[matchingIndex]?.transit_quantity ? spcConsignmentItems[matchingIndex]?.transit_quantity : '0'
                        };
                    } else {
                        return {
                            ...item,
                            selected: false,
                            transit_quantity: '0'
                        };
                    }
                });
                this.setState({ itemList: newArray, totalItems: itemResponse.data.view.totalItems, itemData: initialArray });
            } else {
                this.setState({ alert: true, severity: "info", message: "Info: Seems that you haven't add Item Details" })
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.setState({ alert: true, severity: "error", message: `Error: ${error}` })
        }
    };

    // async setPage(page) {
    //     //Change paginations
    //     let formData = this.state.filterData
    //     formData.page = page
    //     this.setState({
    //         formData
    //     }, () => {
    //         console.log("New Form Data: ", this.state.formData)
    //         this.loadData()
    //     })
    // }

    selectRow = (index) => {
        this.setState(prevState => {
            const newData = [...prevState.itemList]; // Create a new array
            newData[index] = { ...newData[index], edit_selected: !newData[index].edit_selected };
            return { itemList: newData };
        }, () => {
            console.log("Selected Data :", this.state.itemList);
        });
    }

    handleDeselectAll = () => {
        this.setState(prevState => ({
            itemList: prevState.itemList.map(item => ({ ...item, edit_selected: false }))
        }));
    }

    onSubmit = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleNext()
    };

    onBack = () => {
        const data = this.state.filterData
        this.props.updateData(data);
        this.props.handleBack();
    };

    async componentDidMount() {
        const { data } = this.props;
        this.setState({ filterData: data, loading: false }, async () => {
            await this.loadItemData()
            const transit_qty = this.handleTransitQuantity();
            const order_qty = this.handleOrderQuantity();
            const order_lkr = this.handleOrderLKRTotal();
            const order_exchange = this.handleOrderExchangeTotal();
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
                allocatedExchangeTotal: allocated_exchange,
                loading: true
            });
        })
    }

    handleTransitQuantity = () => {
        const quantity = this.state.itemList.reduce((accumulator, item) => {
            return accumulator + this.calculateTransitItemTotal(item);
        }, 0);
        return quantity;
    };

    calculateTransitItemTotal = (item) => {
        return (parseInt(item?.transit_quantity ?? 0));
    };

    handleTransitLKRTotal = () => {
        const orderAmount = this.handleOrderLKRTotal()
        const quantity = this.handleOrderQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)

        const total = this.state.itemList.reduce((accumulator, item) => {
            const itemTotal = this.calculateTransitItemTotal(item);
            return accumulator + (itemTotal * itemPerPrice);
        }, 0);

        return total;
    };

    handleTransitExchangeTotal = () => {
        const orderAmount = this.handleOrderExchangeTotal()
        const quantity = this.handleOrderQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)

        const total = this.state.itemList.reduce((accumulator, item) => {
            const itemTotal = this.calculateTransitItemTotal(item);
            return accumulator + (itemTotal * itemPerPrice);
        }, 0);

        return total;
    };

    handleOrderExchangeTotal = () => {
        const { data } = this.props
        return parseFloat(data?.total ?? 0);
    };

    handleOrderLKRTotal = () => {
        const { data } = this.props
        return parseFloat(parseFloat(data?.total ?? 0) * parseFloat(data?.currency_rate ?? 1) ?? 0);
    };

    handleOrderQuantity = () => {
        const quantity = this.state.itemData.reduce((accumulator, item) => {
            return accumulator + parseInt(item?.quantity ?? 0, 10);
        }, 0);
        return quantity;
    };

    handleAllocatedQuantity = () => {
        const quantity = this.state.itemList.reduce((accumulator, item) => {
            return accumulator + parseInt(item?.allocated_quantity ?? 0, 10);
        }, 0);
        return quantity;
    };

    handleAllocatedExchangeTotal = () => {
        const orderAmount = this.handleOrderExchangeTotal()
        const quantity = this.handleOrderQuantity()
        const allocatedQuantity = this.handleAllocatedQuantity()
        const itemPerPrice = parseFloat(orderAmount / quantity)
        const total = parseFloat(allocatedQuantity * itemPerPrice)

        return total;
    };

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
            const order_exchange = this.handleOrderExchangeTotal();
            const transit_lkr = this.handleTransitLKRTotal();
            const transit_exchange = this.handleTransitExchangeTotal();
            this.setState({
                transitQty: transit_qty,
                transitExchageTotal: transit_exchange,
                transitLKRTotal: transit_lkr,
                orderQty: order_qty,
                orderLKRTotal: order_lkr,
                orderExchageTotal: order_exchange,
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
                                                            {renderDetailCard('Order Total', `${this.state.filterData?.currency ? this.state.filterData?.currency : ''} ${convertTocommaSeparated(this.state.orderExchageTotal, 4)}`)}
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
                                                            {renderDetailCard('Transit Total', `${this.state.filterData?.currency ? this.state.filterData?.currency : ''} ${convertTocommaSeparated(this.state.transitExchageTotal, 4)}`)}
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
                                                            {renderDetailCard('Allocated Total', `${this.state.filterData?.currency ? this.state.filterData?.currency : ''} ${convertTocommaSeparated(this.state.allocatedExchangeTotal, 4)}`)}
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
                                                            {renderDetailCard('Remaining Total', `${this.state.filterData?.currency ? this.state.filterData?.currency : ''} ${convertTocommaSeparated(this.state.orderExchageTotal - this.state.allocatedExchangeTotal, 4)}`)}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            {renderDetailCard('Remaining Quantity', `${convertTocommaSeparated(this.state.orderQty - this.state.allocatedQty - this.state.transitQty, 0)}`)}
                                                        </div>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <Grid item lg={12} md={12} sm={12} xs={12} className='px-4 py-4'>
                                                <LoonsTable
                                                    //title={"All Aptitute Tests"}
                                                    id={'allItemDetails'}
                                                    data={this.state.itemList}
                                                    columns={this.state.columns}
                                                    options={{
                                                        pagination: true,
                                                        rowsPerPage: 10,
                                                        page: 0,
                                                        serverSide: true,
                                                        rowsPerPageOptions: [5, 10, 15, 20, 30, 50, 100],
                                                        print: true,
                                                        count: this.state.totalItems,
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
                                                        >
                                                            <span className="capitalize">
                                                                Next
                                                            </span>
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
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
