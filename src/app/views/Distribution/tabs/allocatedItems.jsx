import { LoonsTable} from 'app/components/LoonsLabComponents';
import { CircularProgress, Grid } from '@material-ui/core';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import RemarkServices from 'app/services/RemarkServices';
import 'date-fns'
import React, { Component, Fragment } from 'react'
import FilterComponent from '../filterComponent';
import InventoryService from 'app/services/InventoryService';
import moment from 'moment';
import { convertTocommaSeparated, dateParse, roundDecimal } from 'utils';
import { Typography } from '@material-ui/core';
import CashSale from './CashSales/index';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import localStorageService from 'app/services/localStorageService';
import { caseSaleCharges } from 'appconst';

class AllocatedItems extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .data[tableMeta.rowIndex]
                                .OrderItem
                                .ItemSnap
                                .sr_no
                        }
                    }
                }, {
                    name: 'item_name',
                    label: 'Item Name',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .data[tableMeta.rowIndex]
                                .OrderItem
                                .ItemSnap
                                .medium_description
                        }
                    }
                },
                {
                    name: 'batch_no',
                    label: 'Batch No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnapBatchBin?.ItemSnapBatch?.batch_no
                        }
                    }
                }, {
                    name: 'dosage',
                    label: 'Strength',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .data[tableMeta.rowIndex]
                                .OrderItem
                                .ItemSnap
                                .strength
                        }
                    }
                },
                {
                    name: 'expiry_date',
                    label: 'Expiry Date',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (

                                dateParse(this.state.data[tableMeta.rowIndex].ItemSnapBatchBin.ItemSnapBatch.exd)

                            )
                        }

                    },
                },
                {
                    name: 'remaining_dates',
                    label: 'Remaining Dates',
                    options: {
                        display: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            const today = moment();
                            const expire_date = this.state.data[tableMeta.rowIndex].ItemSnapBatchBin.ItemSnapBatch.exd;
                            let remaining = today.diff(expire_date, "days");
                            let exact_value = Math.abs(remaining);
                            let weeks = Math.floor(exact_value / 7);
                            let days = exact_value % 7;
                            return (

                                <p>{weeks}{" W "}{days}{" D "}</p>

                            )
                        }

                    },
                },

                {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('cheking data', this.state?.data[tableMeta.rowIndex])
                            
                            if (this.state?.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom ===  'EUV2') { 
                                return roundDecimal(this.state?.data[tableMeta.rowIndex]?.OrderItem?.request_quantity * this.state?.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' + this.state?.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return this.state?.data[tableMeta.rowIndex]?.OrderItem?.request_quantity
                            }
                        }
                    }
                },
                {
                    name: 'unit_price',
                    label: 'Unit Price',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnapBatchBin.ItemSnapBatch.unit_price ? convertTocommaSeparated(Number(this.state.data[tableMeta.rowIndex]?.ItemSnapBatchBin.ItemSnapBatch.unit_price,2)) : 0
                        }
                    }
                },
                {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('cheking data', this.state?.data[tableMeta.rowIndex])
                            
                            // if (this.state?.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom ===  'EUV2') {
                            //     return roundDecimal(this.state?.data[tableMeta.rowIndex]?.OrderItem?.allocated_quantity * this.state?.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2) + ' ' + this.state?.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name
                            // } else {
                                return this.state?.data[tableMeta.rowIndex]?.OrderItem?.allocated_quantity
                            // }
                        }
                    }
                },
                {
                    name: 'total',
                    label: 'Total',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this.state.data[tableMeta.rowIndex]?.ItemSnapBatchBin.ItemSnapBatch.unit_price ? convertTocommaSeparated(Number(this.state.data[tableMeta.rowIndex]?.ItemSnapBatchBin.ItemSnapBatch.unit_price) * this.state.data[tableMeta.rowIndex]?.allocated_quantity, 2) : 0
                        }
                    }
                },
                // {
                //     name: 'batch_details',
                //     label: 'Batch Details',
                //     options: {
                //         // filter: true,
                //     }
                // }, 
                // {
                //     name: 'action',
                //     label: 'Action',
                //     options: {
                //         // filter: true,
                //     }
                // }
            ],
            filterData: {
                ven_id: null,
                group_id: null,
                category_id: null,
                class_id: null,
                order_exchange_id: null,
                status: ["ALLOCATED", "Active", "RECIEVED"],
                search: null
            },
        }
    }

    componentDidMount() {
        this.state.filterData.order_exchange_id = this.props.id.match.params.id
        this.LoadOrderItemDetails()
        console.log('fafaffsgsdhdjdjdjdj', this.props.id.match.params.id)
        this.getUserInfo()
        this.getStatus()
    }

    async getStatus(){

        let params ={
            order_exchange_id: this.props.id.match.params.id,
            order_type: ['CASH SALES', 'Sales Order'],   
        }

        let res = await PharmacyOrderService.getOrderItems(params)

        if (res.status == 200){
            console.log('status', res.data?.view?.data?.[0].status)

            this.setState({
                printStatus:res.data?.view?.data?.[0].status
            })
        }

        
    }

    async LoadOrderItemDetails() {    ///need to change
        this.setState({ loaded: false })
        console.log("State 1:", this.state.data)
        // let res = await PharmacyOrderService.getOrderItems(this.state.filterData)
        let res = await InventoryService.getOrderItemAllocation(this.state.filterData)
        if (res.status) {
            console.log("Order Item Data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                // totalItems:res.data.view.totalItems,
                loaded: true
            }, () => {
                this.render()
                console.log("State 2:", this.state.data)
            })
        }
        console.log("Order Item Data", this.props.id.match.params.id)
    }

    updateFilters(ven, category, class_id, group, search) {
        let filterData = this.state.filterData
        filterData.ven_id = ven
        filterData.category_id = category
        filterData.class_id = class_id
        filterData.group_id = group
        filterData.search = search

        this.setState({ filterData })
        this.LoadOrderItemDetails()
    }
    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState(
            {
                filterData,
            },
            () => {
                console.log('New filterData', this.state.filterData)
                this.LoadOrderItemDetails()
            }
        )
    }

    calculateActualTotal(data) {
        try {
            const prices = data.map((item, i) => item?.ItemSnapBatchBin.ItemSnapBatch.unit_price ? this.state.data[i].allocated_quantity * Number(item?.ItemSnapBatchBin.ItemSnapBatch.unit_price) : 0);
            const total = prices.reduce((acc, curr) => acc + curr, 0);

            if(this.props.id.match.params.type=='CASH SALES' ||this.props.id.match.params.type=='Sales Order'){
                return <div>
                     <Typography variant='body2'>Total : {convertTocommaSeparated(total, 2)} </Typography>
                     <Typography variant='body2'>Service Charges(10%) : {convertTocommaSeparated(total*caseSaleCharges/100, 2)} </Typography>
                     <Typography variant='body2'>Sub Total : {convertTocommaSeparated((total + total*caseSaleCharges/100), 2)} </Typography>
                </div>
            }else{
              return  <Typography variant='body2'>Total : {convertTocommaSeparated(total, 2)} </Typography>
               
            }
            
        } catch (err) {
            console.error("Error", err);
            return 0;
        }
    }

    
    // cash sale print
    async printLoad() {

        console.log('clicked')
        let params ={
            ven_id: this.state.filterData.ven_id,
            group_id: this.state.filterData.group_id,
            category_id: this.state.filterData.category_id,
            class_id: this.state.filterData.class_id,
            order_exchange_id: this.state.filterData.order_exchange_id,
            search: this.state.filterData.search,
            order_type: ['CASH SALES', 'Sales Order'],
            status: this.state.filterData.status
        }
        
        this.setState({
            pload: false
        })

        let res = await InventoryService.getOrderItemAllocation(params)

        if (res.status == 200) {
            
            console.log('testdata', res.data.view.data)

            this.setState(
                {
                    pload: true,
                    printData:res.data.view.data
                },
                () => {
                    this.render()
                    document.getElementById('print_presc_00415').click()
                }
            )
        }

        console.log('mydata',this.state.printData )

        setTimeout(() => {
            this.setState({
                pload: false
            })
        }, 5000);
    }

    async getUserInfo(){
        let user_info = await localStorageService.getItem("userInfo")
        // console.log('user', user_info.name)

        this.setState({
            userName:user_info.name
        })
    }


    render() {
        return (
            <> < FilterComponent onSubmitFunc={this.updateFilters.bind(this)} />
                    <Grid container className='mt-5 text-right' >
                        <Grid item xs={12}>
                            {this.state.printStatus === 'ISSUE SUBMITTED' || this.state.printStatus === 'ISSUED' ?
                            <LoonsButton
                                    // disabled={this.state.order?.approval_status == "PENDING" || this.state.order?.approval_status == "REJECTED"}
                                    className="mt-1 mb-2 mr-2" 
                                    // progress={this.state.issuing} /* type="submit" */ startIcon="save"
                                    onClick={() => { this.printLoad() }}
                                //onClick={this.handleChange}
                                >
                                   <span className="capitalize">Cash Receipt</span>
                                     
                                </LoonsButton>
                            :null} 
                            </Grid>
                        </Grid>

                {this.state.loaded ?
                    <>
                        <LoonsTable
                            options={{
                                viewColumns: false,
                                /*  pagination: true,
                                serverSide: true,
                                count: this.state.totalItems,
                                rowsPerPage: this.state.filterData.limit,
                                page: this.state.filterData.page,
                                onTableChange: (action, tableState) => {
                                    console.log(action, tableState)
                                    switch (action) {
                                        case 'changePage':
                                            this.setPage(tableState.page)
                                            break
                                        case 'sort':
                                            break
                                        default:
                                            console.log('action not handled.')
                                    }
                                } */
                            }}
                            data={this.state.data}
                            columns={this.state.columns} />
                        <br />
                        {this.calculateActualTotal(this.state.data)}
                        <br />
                    </>
                    :
                    (
                        //loading effect
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    )
                }

                    {this.state.pload ?
                        <Grid>
                            <CashSale orderId={this.props.id?.match?.params?.order} printData={this.state.printData}  Total={this.calculateActualTotal(this.state.data)} userName={this.state.data?.from_owner_id}></CashSale>
                        </Grid>
                    :null}

            </>
        )
    }
}

export default AllocatedItems