import {
    CircularProgress,
    Dialog,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';import {LoonsTable, MainContainer} from 'app/components/LoonsLabComponents';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import RemarkServices from 'app/services/RemarkServices';
import 'date-fns'
import React, {Component, Fragment} from 'react'
import FilterComponent from '../filterComponent';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { roundDecimal } from 'utils';

class DroppedItems extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [{
                sr_no: '0001',
                item_name: 'Augmentine',
                dosage: 54,
                order_qty: 5,
                alloc_qty: '100',
                parent_qty: null,
                action:null
            }],
            columns: [
                {
                    name: 'sr_no',
                    label: 'SR No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state
                                .data[tableMeta.rowIndex]
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
                                .ItemSnap
                                .medium_description
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
                                .ItemSnap
                                .strength
                        }
                    }
                }, {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('cheking row data', this.state.data[tableMeta.rowIndex])
                            if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2'){ 
                                return roundDecimal(this.state.data[tableMeta.rowIndex]?.request_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                            } else {
                                return this.state.data[tableMeta.rowIndex]?.request_quantity
                            }
                            
                        }
                        // filter: true,
                    }
                }, {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            // console.log('cheking row data', this.state.data[tableMeta.rowIndex])
                            // if (this.state.data[tableMeta.rowIndex]?.ItemSnap?.converted_order_uom === 'EUV2'){
                            //     return roundDecimal(this.state.data[tableMeta.rowIndex]?.allocated_quantity * this.state.data[tableMeta.rowIndex]?.ItemSnap?.item_unit_size, 2) + ' ' + this.state.data[tableMeta.rowIndex]?.ItemSnap?.DisplayUnit?.name
                            // } else {
                                return this.state.data[tableMeta.rowIndex]?.allocated_quantity
                            // }
                            
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
                //  {
                //     name: 'action',
                //     label: 'Action',
                //     options: {
                //         // filter: true,
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             let data = this.state.data[tableMeta.rowIndex].id
                //             return (
                //                 <LoonsButton style={{ backgroundColor: 'red', marginLeft: '4px' }} onClick={() => {
                                   
                //                 }}><Tooltip title="Delete"><AddCircleIcon /></Tooltip></LoonsButton>
                //             )
                //         }
                //     }
                // }
            ],
            filterData:{
                ven_id:null,
                group_id:null,
                category_id:null,
                class_id:null,
                order_exchange_id:null,
                status:"DROPPED",
                search:null
            },
        }
    }

    componentDidMount() {
        this.state.filterData.order_exchange_id = this.props.id.match.params.id       
        this.LoadOrderItemDetails()
    }

    async LoadOrderItemDetails() {
        this.setState({loaded:false})
        console.log("State 1:", this.state.data)
        let res = await PharmacyOrderService.getOrderItems(this.state.filterData)
        if (res.status) {
            console.log("Order Item Data", res.data.view.data)
            this.setState({
                data: res.data.view.data,
                loaded: true
            }, () => {
                this.render()
                console.log("State 2:", this.state.data)
            })
        }
        
    }

    updateFilters(ven,category,class_id,group,search){
        let filterData = this.state.filterData
        filterData.ven_id = ven
        filterData.category_id = category
        filterData.class_id = class_id
        filterData.group_id = group
        filterData.search = search

        this.setState({filterData})
        console.log("Order Filter Data", this.state.filterData)
        this.LoadOrderItemDetails()
    }

    render() {
        return (
        <> 
            <FilterComponent onSubmitFunc={this.updateFilters.bind(this)}/> 
            {this.state.loaded ?
                <LoonsTable
                    options={{
                        viewColumns: false
                    }}
                    data={this.state.data}
                    columns={this.state.columns}/>
                    :
                    (
                        //loading effect
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress size={30}/>
                        </Grid>
                    )
                }
                
        </>
        )
    }

}

export default DroppedItems