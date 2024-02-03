import {
    CircularProgress,
    Grid,
} from '@material-ui/core';
import { Button } from '@material-ui/core'
import {

    LoonsSnackbar,
    LoonsTable,

} from 'app/components/LoonsLabComponents';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import 'date-fns'
import React, { Component, Fragment } from 'react'

// import InventoryService from 'app/services/PharmacyOrderService';
import {dateParse, roundDecimal } from "utils";


class HistoryAllocated extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: [],

            columns: [
                // {
                //     name: 'Issue',
                //     label: 'From',
                //     options: {
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return this.state.data[tableMeta.rowIndex]?.OrderExchange?.fromStore?.name
                            
                //         }
                //     }
                // },
                {
                    name: 'issued_quantity',
                    label: 'Issued Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('cheking item info', this.state.data[tableMeta.rowIndex])
                            if (this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EUV2') {
                                return roundDecimal(this.state.data[tableMeta.rowIndex]?.OrderItem?.issued_quantity * this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size , 2) + ' ' + this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return this.state.data[tableMeta.rowIndex]?.OrderItem?.issued_quantity
                            }
                            
                            
                        }
                    }
                    
                }, {
                    name: 'request_quantity',
                    label: 'Request Quantity',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.converted_order_uom === 'EUV2') {
                                return roundDecimal(this.state.data[tableMeta.rowIndex]?.OrderItem?.request_quantity * this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.item_unit_size, 2)+ ' ' + this.state.data[tableMeta.rowIndex]?.OrderItem?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return this.state.data[tableMeta.rowIndex]?.OrderItem?.request_quantity
                            }
                           
                            
                        }
                    }
                   
                }, {
                    name: 'Issue',
                    label: 'Issued Date',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return dateParse(this.state.data[tableMeta.rowIndex].updatedAt)
                            
                        }
                    }
                },{
                    name: 'status',
                    label: 'Status',
                    options: {
                        // filter: true,
                    }
                }
            ],
            filterData: {
                page: 0,
                limit: 10,
                from:this.props.from,
                item_id:this.props.itemId,
                // status:['ALL RECEIVED','ISSUE SUBMITTED',"ALL ISSUED","PARTIAL RECEIVED"],
                to_owner_id:'000',
                from_date: dateParse(new Date().setDate(new Date().getDate() - 14)),
                to_date: dateParse(new Date())
                
            }

        }
    }

    async loadData() {
        let res = await PharmacyOrderService.getOrderBatchItems(this.state.filterData)
        if (res.status == 200) {
            console.log("Order Item Data checking", res)
            this.setState({
                data: res.data.view.data,
                totalItems:res.data.view.totalItems,
                loaded:true
            })
        }
    }

    componentDidMount() {
        this.loadData()
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {

            this.loadData()
        })
    }

    render() {
        return (
            <> {
                this.state.loaded
                    ? <LoonsTable
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: this.state.totalItems,
                            rowsPerPage: this.state.filterData.limit,
                            page: this.state.filterData.page,
                            totalItems:this.setState.totalItems,
                            print: true,
                            viewColumns: true,
                            download: true,
                            onTableChange: (action, tableState) => {
                                console.log(action, tableState)
                                switch (action) {
                                    case 'changePage':
                                        this.setPage(tableState.page)
                                        break
                                    case 'sort':
                                        // this.sort(tableState.page, tableState.sortOrder);
                                        break
                                    default:
                                        console.log('action not handled.')
                                }
                            }
                        }}
                        data={this.state.data}
                        columns={this.state.columns} />
                    : (
                        //loading effect
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30} />
                        </Grid>
                    )
            }


                <LoonsSnackbar
                    open={this.state.alert}
                    onClose={() => {
                        this.setState({ alert: false })
                    }}
                    message={this.state.message}
                    autoHideDuration={3000}
                    severity={this.state.severity}
                    elevation={2}
                    variant="filled"></LoonsSnackbar>
            </>
        )
    }
}

export default HistoryAllocated