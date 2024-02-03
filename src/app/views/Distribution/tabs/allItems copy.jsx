import {
    CircularProgress,
    Dialog,
    Grid,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import {Button} from '@material-ui/core'
import {
    CardTitle,
    DatePicker,
    LoonsCard,
    LoonsSnackbar,
    LoonsTable,
    SubTitle
} from 'app/components/LoonsLabComponents';
import LoonsButton from 'app/components/LoonsLabComponents/Button';
import 'date-fns'
import React, {Component, Fragment} from 'react'
import {TextValidator, ValidatorForm} from 'react-material-ui-form-validator';
import FilterComponent from '../filterComponent';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import {Autocomplete} from '@material-ui/lab';
import RemarkServices from 'app/services/RemarkServices';
import PharmacyOrderService from 'app/services/PharmacyOrderService';
import localStorageService from 'app/services/localStorageService';
import DistributionCenterServices from 'app/services/DistributionCenterServices';
import {dateTimeParse} from "utils";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import InventoryService from 'app/services/InventoryService';

class AllItemsDistribution extends Component {

    constructor(props) {
        super(props)
        this.state = {
            totalUpdate:true,
            batchAllocationItemvalues:[],
            batchAllocationItemVolumes:[],
            totalAllocated:0,
            unable_to_fill: 'hidden',
            remarks_other: 'hidden',
            selected_item: [],
            data: [],

            itemsnap:[],
            itemBatch:[],
            msd_reserved_qty:null,

            batch_details_data: [],
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
                    name: 'ven',
                    label: 'Ven',
                    options: {
                        // filter: true,
                    }
                },
                // , {     name: 'parend_drugstore_qty',     label: 'Parend Drugstore Qty',
                // options: {          filter: true,     } }
                {
                    name: 'my_stock_days',
                    label: 'My Stock Days',
                    options: {
                        // filter: true,
                    }
                },
                {
                    name: 'stored_quantity',
                    label: 'MSD Qty',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('stockdata',this.state.stockData)
                                let quantity = this.state.stockData.filter((data) => data.real_warehouse_id == this.state.data[tableMeta.rowIndex].OrderExchange.to && data.item_id == this.state.data[tableMeta.rowIndex].item_id )
                                return (
                                    // <h1>2</h1>
                                   quantity[0]?.quantity
                                )

                        }
                }
            },
            {
                name: 'msd_reserved_qty',
                label: 'MSD Available Qty',
                options: {
                    // filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        console.log('stockdata',this.state.stockData)
                        console.log("quantity",this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.reserved_quantity )
                            let quantity = parseFloat(this.state.stockData.filter((data) => data.real_warehouse_id == this.state.data[tableMeta.rowIndex].OrderExchange.to && data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.quantity) - parseFloat(this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.reserved_quantity)
                            return (
                                <p>{quantity}</p>
                            //    quantity[0]?.quantity
                            )

                    }
                  
                }
            },
            {
                name: 'institute_qty',
                label: 'Insititute Qty',
                options: {
                    // filter: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        console.log('stockdata',this.state.stockData)
                            let quantity = this.state.stockData.filter((data) => data.real_warehouse_id == this.state.data[tableMeta.rowIndex].OrderExchange.from && data.item_id == this.state.data[tableMeta.rowIndex].item_id )
                            return (
                                // <h1>2</h1>
                               quantity[0]?.quantity
                            )

                    }
                }
            },
                 {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        // filter: true,
                    }
                },
                // , {     name: 'batch_details',     label: 'Batch Details',     options: {
                // filter: true,     } }
                {
                    name: 'action',
                    label: 'Action',
                    options: {
                        // filter: true,
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <div>
                                < Button style = {(this.state.data[tableMeta.rowIndex].status == "ALLOCATED" || this.state.data[tableMeta.rowIndex].status == "DROPPED" )?
                                    {backgroundColor:'#9b9b9b', color:'white'} : {backgroundColor:'#1a73e8', color:'white'}}onClick = {
                                    () => {
                                        this
                                            .state
                                            .selected_item = tableMeta.rowIndex
                                            
                                        console.log(this.state.selected_item)
                                        this.setState({allocate_item: true},
                                            () => {this.orderBatchAllocation( this.state.data[tableMeta.rowIndex].item_id )
                                            }

                                            )
                                        this.state.batchAllocationItemvalues = []
                                        this.state.batchAllocationItemVolumes =[]
                                        this.props.id.match.params.type == "Return" ? this.getRetBatchData() : this.getBatchData(false)
                                        
                                    }
                                } 
                                disabled={(this.state.data[tableMeta.rowIndex].status == "ALLOCATED" || this.state.data[tableMeta.rowIndex].status == "DROPPED" ) ? true: false }> {this.state.data[tableMeta.rowIndex].status == "DROPPED" ? 'Rejected': this.state.data[tableMeta.rowIndex].status == "ALLOCATED" ? 'Allocated' : <AddCircleIcon />}</Button>

                                < Button style = {{backgroundColor:'#1a73e8', color:'white', marginLeft:'2px', visibility:(this.state.data[tableMeta.rowIndex].status == "ALLOCATED" )? 'show': 'hidden'}} onClick = {
                                    () => {
                                        this
                                            .state
                                            .selected_item = tableMeta.rowIndex
                                            
                                        console.log(this.state.selected_item)
                                        this.setState({allocate_item: true})
                                        this.state.batchAllocationItemvalues = []
                                        this.state.batchAllocationItemVolumes =[]
                                        this.props.id.match.params.type == "Return" ? this.getRetBatchData() : this.getBatchData(false)
                                        
                                    }
                                } 
                               > <EditIcon /></Button>
                            </div>
                            )
                        }
                    }
                }
            ],
            batch_details: [
                // {     name: 'invoice',     label: 'Invoice No',     options: {} },
                
                {
                    name: 'warehousebin',
                    label: 'Warehouse Bin',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if(this.state.batch_details_data[tableMeta.rowIndex]){
                            return this
                                .state
                                .batch_details_data[tableMeta.rowIndex]
                                .WarehousesBin
                                .bin_id
                            }else{
                                return "N/A"
                            }
                        }
                    }
                },{
                    name: 'batch',
                    label: 'Batch No',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if(this.state.batch_details_data[tableMeta.rowIndex]){
                            return this
                                .state
                                .batch_details_data[tableMeta.rowIndex]
                                .ItemSnapBatch
                                .batch_no
                            }else{
                                return "N/A"
                            }
                        }
                    }
                }, {
                    name: 'exp',
                    label: 'Exp Date',
                    options: {
                        customBodyRenderLite: (dataIndex) => {
                            if(this.state.batch_details_data[dataIndex]){
                            let data = this
                                .state
                                .batch_details_data[dataIndex]
                                .ItemSnapBatch
                                .exd;
                            return <p>{dateTimeParse(data)}</p>
                        }else{
                            return "N/A"
                        }

                        }
                    }
                },
                // {     name: 'uom',     label: 'UOM',     options: {} },
                {
                    name: 'minPack',
                    label: 'Min Pack Size',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if(this.state.batch_details_data[tableMeta.rowIndex]){
                            return this
                                .state
                                .batch_details_data[tableMeta.rowIndex]
                                .ItemSnapBatch
                                .pack_size
                            }else{
                                return "N/A"
                            }
                        }
                    }
                }, {
                    name: 'quantity',
                    label: 'Stock Qty',
                    options: {}
                },
                {
                    name: 'quantity2',
                    label: 'Available Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                                let quantity =parseFloat(this.state.batch_details_data[tableMeta.rowIndex]?.quantity)- parseFloat(this.state.itemsnap.filter((data) => data.item_batch_bin_id == this.state.data[tableMeta.rowIndex].item_batch_bin_id )[0]?.reserved_quantity)
                                return (
                                    <p>{quantity}</p>
                                //    quantity[0]?.quantity
                                )

                        }
                    }
                },
                 {
                    name: 'allocatedQty',
                    label: 'Allocated Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            if (this.state.batchAllocationItemvalues[tableMeta.rowIndex] == undefined ) this.state.batchAllocationItemvalues.push(0) 
                            if (this.state.batchAllocationItemVolumes[tableMeta.rowIndex] == undefined ) this.state.batchAllocationItemVolumes.push(0)                           

                            return (
                                < TextField id={'Hello'+tableMeta.rowIndex} variant = "outlined" size = "small" className = " w-full" placeholder = "Order Qty" type='number' onChange = {
                                    (e) => {
                                        if (e.target.value == ''){
                                            this.state.batchAllocationItemvalues[tableMeta.rowIndex] = 0
                                            this.state.batchAllocationItemVolumes[tableMeta.rowIndex] = 0
                                    }else{
                                        if (this.state.batch_details_data[tableMeta.rowIndex].quantity < parseInt(e.target.value)){
                                            this.setState(
                                                {message: "Cannot allocate more than Available quantity", alert: true, severity: "Error"}
                                            )
                                            document.getElementById('Hello'+tableMeta.rowIndex).value = 0
                                            this.state.batchAllocationItemvalues[tableMeta.rowIndex] = 0
                                            this.state.batchAllocationItemVolumes[tableMeta.rowIndex] = 0

                                        }else{
                                            this.state.batchAllocationItemvalues[tableMeta.rowIndex] = parseInt(e.target.value)
                                            this.state.batchAllocationItemVolumes[tableMeta.rowIndex] = (parseInt(e.target.value)/parseInt(this.state.batch_details_data[tableMeta.rowIndex].quantity)) * parseInt(this.state.batch_details_data[tableMeta.rowIndex].volume)
                                        }
                                       
                                    }                                        
                                    }
                                } defaultValue={this.state.batchAllocationItemvalues[tableMeta.rowIndex]}> </TextField>
                            )
                        }
                    }
                },
                {
                    name: 'updateButton',
                    label: 'Actions',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return (
                                <>
                                <LoonsButton onClick={()=>{
                                    this.state.allocate.warehouse_id = this.state.batch_details_data[tableMeta.rowIndex].warehouse_id
                                    this.setState({totalUpdate:false})
                                    if (this.state.batchAllocationItemvalues[tableMeta.rowIndex] == 0 || this.state.batchAllocationItemvalues[tableMeta.rowIndex] == null){
                                        this.setState(
                                            {message: "Please Enter a value", alert: true, severity: "Error"}
                                        )
                                    }else{
                                        if (this.state.batchAllocationItemvalues[tableMeta.rowIndex] > this.state.batch_details_data[tableMeta.rowIndex].quantity) {
                                        this.setState(
                                            {message: "Cannot Allocate more than Available Quantity", alert: true, severity: "Error"}
                                        )
                                        } else {
                                            if (this.state.allocate.item_batch_allocation_data.length != 0){
                                                this.state.allocate.item_batch_allocation_data.find((item,index,self) => {
                                                    if (item.item_batch_bin_id == this.state.batch_details_data[tableMeta.rowIndex].id){
                                                        console.log(index);
                                                        this.state.allocate.item_batch_allocation_data[index].bin_id = this.state.batch_details_data[tableMeta.rowIndex].bin_id                                                        
                                                        this.state.allocate.item_batch_allocation_data[index].item_batch_bin_id=this.state.batch_details_data[tableMeta.rowIndex].id
                                                        this.state.allocate.item_batch_allocation_data[index].warehouse_id=this.state.batch_details_data[tableMeta.rowIndex].warehouse_id
                                                        this.state.allocate.item_batch_allocation_data[index].quantity=this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                                        this.state.allocate.item_batch_allocation_data[index].volume=this.state.batchAllocationItemVolumes[tableMeta.rowIndex]  
                                                    }else{
                                                        console.log("not finding");
                                                        this.state.allocate.item_batch_allocation_data.push({
                                                            bin_id:this.state.batch_details_data[tableMeta.rowIndex].bin_id, 
                                                            item_batch_bin_id:this.state.batch_details_data[tableMeta.rowIndex].id,
                                                            warehouse_id:this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                                                            quantity:this.state.batchAllocationItemvalues[tableMeta.rowIndex],
                                                            volume:this.state.batchAllocationItemVolumes[tableMeta.rowIndex]                                       
                                                        })
                                                    }
                                                })
                                            }else{
                                                this.state.allocate.item_batch_allocation_data.push({
                                                bin_id:this.state.batch_details_data[tableMeta.rowIndex].bin_id,
                                                item_batch_bin_id:this.state.batch_details_data[tableMeta.rowIndex].id,
                                                warehouse_id:this.state.batch_details_data[tableMeta.rowIndex].warehouse_id,
                                                quantity:this.state.batchAllocationItemvalues[tableMeta.rowIndex],
                                                volume:this.state.batchAllocationItemVolumes[tableMeta.rowIndex]
                                            })    
                                            }
                                                                               
                                        
                                        console.log('quantity',this.state.batchAllocationItemvalues,'tablemeta',tableMeta.rowIndex);
                                        console.log('volumes',this.state.batchAllocationItemVolumes, 'tablemeta',tableMeta.rowIndex);

                                        this.state.allocate.quantity = this.state.batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);
                                        this.state.allocate.volume = this.state.batchAllocationItemVolumes.reduce((partialSum, a) => partialSum + a, 0);

                                    
                                        //this.state.batch_details_data[tableMeta.rowIndex].allocated_quantity += this.state.allocate.quantity
                                        
                                    }                                      
                                    
                                    }
                                    this.setState({totalUpdate:true})

                                    console.log(this.state.allocate);
                                    
                                }}><Tooltip title="Add to list"><AddCircleIcon/></Tooltip></LoonsButton>

                                <LoonsButton style={{backgroundColor:'red',marginLeft:'4px'}} onClick={()=>{
                                    this.setState({totalUpdate:false})
                                    this.state.allocate.item_batch_allocation_data.find((item,index)=>{
                                        if (item && item.item_batch_bin_id == this.state.batch_details_data[tableMeta.rowIndex].id){
                                            this.state.allocate.item_batch_allocation_data.splice(index,1)                                            
                                            
                                            this.state.allocate.quantity -= this.state.batchAllocationItemvalues[tableMeta.rowIndex]
                                            this.state.allocate.volume -= this.state.batchAllocationItemVolumes[tableMeta.rowIndex]
                                            this.state.batchAllocationItemvalues[tableMeta.rowIndex] = 0
                                            this.state.batchAllocationItemVolumes[tableMeta.rowIndex] = 0
                                            this.setState(
                                                {message: "Delete succesfull", alert: true, severity: "Success"}
                                            )                                       
                                        }
                                    })                                    
                                    this.setState({totalUpdate:true})
                                    document.getElementById('Hello'+tableMeta.rowIndex).value = 0
                                    console.log(this.state.allocate);
                                }}><Tooltip title="Delete"><DeleteIcon/></Tooltip></LoonsButton>
                                </>
                            )
                        }
                    }
                }
            ],
            allocate_dialog_table: [
                // {     name: 'parend_drugstore_qty',     label: 'Parent Drug Store Qty',
                // optionss: {} },
                {
                    name: 'my_stock_days',
                    label: 'My Stock Days',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state.batch_details_data[tableMeta.rowIndex]?.quantity
                        }
                    }
                }, 
                // {
                //     name: 'stored_quantity',
                //     label: 'MSD Qty',
                //     options: {
                //         customBodyRender: (value, tableMeta, updateValue) => {
                //             return <p>10</p>
                //     }
                // }
                // },
                 {
                    name: 'warehouse',
                    label: 'Warehouse',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            return this
                                .state.batch_details_data[tableMeta.rowIndex]?.Warehouse?.name
                        }
                    }
                }, 
                // {
                //     name: 'uom',
                //     label: 'UOM',
                //     options: {}
                // }, 
                {
                    name: 'consumption',
                    label: 'Consumption',
                    options: {}
                }, {
                    name: 'my_stock_res_qty',
                    label: 'My Stock Available Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => {
                            console.log('stockdata',this.state.stockData)
                            console.log("quantity",parseFloat(this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.reserved_quantity) )
                                let quantity = parseFloat(this.state.stockData.filter((data) => data.real_warehouse_id == this.state.data[tableMeta.rowIndex].OrderExchange.to && data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.quantity) - parseFloat(this.state.itemsnap.filter((data) => data.item_id == this.state.data[tableMeta.rowIndex].item_id )[0]?.reserved_quantity)
                                return (
                                    <p>{quantity}</p>
                                //    quantity[0]?.quantity
                                )

                        }

                    }
                }, {
                    name: 'request_quantity',
                    label: 'Order Qty',
                    options: {}
                },
                {
                    name: 'to_be_issue_quantity',
                    label: 'Plan to Allocate Qty',
                    options: {}
                }
                , {
                    name: 'allocated_quantity',
                    label: 'Allocated Qty',
                    options: {
                        customBodyRender: (value, tableMeta, updateValue) => (
                            this.state.totalUpdate ? parseInt(this.state.data[this.state.selected_item].allocated_quantity) + parseInt(this.state.allocate.quantity) : null
                        )
                    }
                }
            ],
            remarks: [],
            all_status: [
                {
                    id: 1,
                    name: 'ALLOCATED'
                }, {
                    id: 2,
                    name: 'APPROVED'
                }, {
                    id: 3,
                    name: 'COMPLETED'
                }, {
                    id: 4,
                    name: 'ISSUED'
                }, {
                    id: 5,
                    name: 'ORDERED'
                }, {
                    id: 6,
                    name: 'RECIEVED'
                }, {
                    id: 7,
                    name: 'REJECTED'
                }
            ],
            loaded: false,
            filterData: {
                ven_id: null,
                group_id: null,
                category_id: null,
                class_id: null,
                order_exchange_id: null,
                search: null,
                
            },
            allocate: {
                order_item_id: null,
                activity: "ITEM RECEIVED",
                date: null,
                status: "ITEM RECEIVED",
                remark_id: null,
                remark_by: null,
                type: "ITEM RECEIVED",
                volume:0,
                quantity:0,
                item_batch_allocation_data:[],
                warehouse_id:null,
               
            },
            alert: false,
            message: null,
            severity: "success",
            issue:{
                order_exchange_id: this.props.id.match.params.id,
                activity: "ISSUED",
                date: null,
                status: "ISSUED",
                remark_id: null,
                remark_by: null,
                type: "ISSUED",
                quantity: 0,
                time_from: null,
                time_to: null,
                warehouse_id:null
            },
            retbatchdata:[],
            totalItems: null,
            stockData:[],

        }
    }
    async itemLoad(warehouse_id,items){
        let data = {
            warehouse_id: warehouse_id,
            items:items,
            group_by_warehouses:true
           
        }
        console.log("params",data)
            this.setState({loaded: false})
            let posted = await InventoryService.getInventoryFromSR(data)
            if (posted.status == 201) {
                console.log('Orders', posted.data)
                this.setState(
                    {
                    stockData: posted?.data?.posted?.data,
                    loaded: true, 
                    }
                )
            }
            this.setState({
                loaded: true
            }  ,()=>{
                this.orderItemAllocation(this.state.uniquitemslistfull)
            })
            this.render()
    
    }

    async orderItemAllocation(items){
        // let data = {
        //     warehouse_id: warehouse_id,
        //     items:items,
        //     group_by_warehouses:true
           
        // }
        let itemFilter = {
                    item_id : items,
                    warehouse_id : this.state.allocate.warehouse_id,
                    group_by_warehouse_only : true,
                    status : 'Active',
                    from_date:null,
                    to_date:null,
                    allocation_sum:true
                }
        
        console.log("paramsss",itemFilter)
            this.setState({loaded: false})
            let posted = await InventoryService.getOrderItemAllocation(itemFilter)
            if (posted.status == 200) {
                console.log('Orders', posted.data)
                this.setState(
                    {
                    itemsnap: posted?.data.view.data,
                    loaded: true, 
                    }
                )
            }
            this.setState({
                loaded: true
            })
            console.log('itemsnap', this.state.itemsnap)
            this.render()
    
    }
    async orderBatchAllocation(items){
        // let data = {
        //     warehouse_id: warehouse_id,
        //     items:items,
        //     group_by_warehouses:true
           
        // }
        let itemFilter = {
                    item_id : items,
                    warehouse_id : this.state.allocate.warehouse_id,
                    status : 'Active',
                    from_date:null,
                    to_date:null,
                    allocation_sum:true
                }
        
        console.log("itemBtach",itemFilter)
            this.setState({loaded: false})
            let posted = await InventoryService.getOrderItemAllocation(itemFilter)
            if (posted.status == 200) {
                console.log('Orders', posted.data)
                this.setState(
                    {
                    itemBatch: posted?.data.view.data,
                    loaded: true, 
                    }
                )
            }
            this.setState({
                loaded: true
            })
            console.log('itemsnap', this.state.itemsnap)
            this.render()
    
    }


    componentDidMount() {
        this.state.filterData.order_exchange_id = this
            .props
            .id
            .match
            .params
            .id
            this
            .loadData()
        this.LoadOrderItemDetails()
    }

    async loadData() {
        let rem_res = await RemarkServices.getRemarks(
            {"type": "Order Remark", "remark": "Order Remark"}
        )
        if (rem_res.status == 200) {
            console.log('Ven', rem_res.data.view.data)
            this.setState({remarks: rem_res.data.view.data})
        }

        //Add other to Remarks
        this
            .state
            .remarks
            .push({
                createdAt: "2022-07-07T12:23:03.091Z",
                createdBy: null,
                id: "4dbd7efd-fe69-400d-988b-d87307267c76",
                remark: "Other",
                status: "Deactive",
                type: "Order Remark",
                updatedAt: "2022-07-07T12:25:38.341Z"
            })
    }

    async LoadOrderItemDetails() {
        this.setState({loaded: false})
        console.log("State 1:", this.state.data)
        let res = await PharmacyOrderService.getOrderItems (this.state.filterData)
        if (res.status == 200 ) {           
            console.log("Order Item Data", res.data.view.data)
            if (res.data.view.data[0]){
                this.state.allocate.warehouse_id = res.data.view.data[0].OrderExchange.to
                this.state.issue.warehouse_id = res.data.view.data[0].OrderExchange.to
            }else{
                this.setState({
                    data: res.data.view.data,
                    loaded: true
                })
            }
            this.setState({
                data: res.data.view.data,
                //loaded: true
            }, () => {                
                res.data.view.data.map((data,index) => {
                    this.getItemData({
                        item_id:data.ItemSnap.id,
                        warehouse_id: res.data.view.data[0].OrderExchange.to
                    },index)                    
                })
                console.log("NEW DATA",this.state.data);
            })

        }
        console.log("Order Items Data", this.props.id.match.params.id)
    }

    updateFilters(ven, category, class_id, group, search) {
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

    allocate(item_id, activity, user,date) {
        let allocate = this.state.allocate
        allocate.order_item_id = item_id
        allocate.activity = activity
        allocate.status = activity
        allocate.type = activity
        allocate.date = date

        this.state.issue.remark_by = user
        this.setState({allocate})
        console.log('New Allocate Req', this.state.allocate);
        this.allocateItem()

    }

    async allocateItem() {
        let allocate = await DistributionCenterServices.allocate(this.state.allocate)
        if (allocate.status == 201) {
            console.log('Allocation response', allocate.data)
            if (allocate.data.posted == "data has been added successfully.") {
                this.setState(
                    {severity: "success", message: "Item quantity status added", alert: true, allocate_item: false}
                )

            }
            this.LoadOrderItemDetails()

        }
    }

    async setPage(page) {
        //Change paginations
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({
            filterData
        }, () => {
            console.log("New filterData", this.state.filterData)
            this.LoadOrderItemDetails()
        })
    }

    async getRetBatchData() {
        console.log('warehouse_id',this.state.data[0].OrderExchange.from);
        let batch_res = await DistributionCenterServices.getRetBatchData({
            return_request_id: this.state.data[0].OrderExchange.return_request_id
        })
        if (batch_res.status == 200) {
            console.log('Return req', batch_res.data.view.data)
            let batchlist = batch_res.data.view.data.map(data => data.item_batch_id);

            this.setState({retbatchdata: batchlist})
            this.getBatchData(batchlist)
        }
    }

    async getBatchData(param) {
        console.log("getBatch" , this.state.allocate.warehouse_id);
        let params = {
            warehouse_id: this.state.allocate.warehouse_id,
            item_id: this.state.data[this.state.selected_item].item_id,
            exp_date_grater_than_zero:true,
            quantity_grater_than_zero: true,
            'order[0]': [
                'createdAt', 'DESC'
            ],
}
        if (param) {
            params = {
                warehouse_id: this.state.allocate.warehouse_id, 
                item_batch_id: param,
                exp_date_grater_than_zero:true,
                quantity_grater_than_zero: true,
                'order[0]': [
                    'createdAt', 'DESC'
                ],
    }
        }
        let batch_res = await DistributionCenterServices.getBatchData(params)
        if (batch_res.status == 200) {
            console.log('Batch Data', batch_res.data.view.data)
            this.setState({batch_details_data: batch_res.data.view.data})
        }

    }

    async getItemData(params,index){
        let itemData = await DistributionCenterServices.getItemData(params)
        if (itemData.status == 200) {
            console.log('Item Data', itemData.data.view)
            let data = this.state.data
            data[index].my_stock_days = itemData.data.view.data[0]?.total_remaining_days
            data[index].stored_quantity = itemData.data.view.data[0]?.mystock_quantity
            this.setState({data})
        }
        if ((this.state.data.length-1) == index){            
            this.setState({
                loaded:true
            })
            this.render()           
        }
    }

    async issueOrder(){
        if (this.state.issue.time_from == null ||this.state.issue.time_to == null || this.state.issue.date == null){
            this.setState({
                message:"Please set From and To time",
                severity:"Error",
                alert:true
            })
        }else{
            let issue = await DistributionCenterServices.issueOrder(this.state.issue)
        if (issue.status == 201) {
            if (issue.data.posted == "data has been added successfully."){
                console.log('Order Issued', issue.data)
                this.setState({
                    message:"Order Issue Successfully Completed",
                    severity:"Success",
                    alert:true
                },()=>{window.history.back()})
            }
        }
        }
        
    }

    resetButton(){
        this.setState({totalUpdate:false})
        this.state.allocate.item_batch_allocation_data.forEach((element,index) => {
            this.state.allocate.item_batch_allocation_data.splice(index,1)
            document.getElementById('Hello'+index).value = 0                                        
            this.state.allocate.quantity -= this.state.batchAllocationItemvalues[index]
            this.state.allocate.volume -= this.state.batchAllocationItemVolumes[index]
            this.state.batchAllocationItemvalues[index] = 0
            this.state.batchAllocationItemVolumes[index] = 0
        });

        this.state.allocate.quantity = this.state.batchAllocationItemvalues.reduce((partialSum, a) => partialSum + a, 0);
        this.state.allocate.volume = this.state.batchAllocationItemVolumes.reduce((partialSum, a) => partialSum + a, 0);

        this.setState({totalUpdate:true})

        console.log("RESET BUTTON",this.state.allocate);

    }

    render() {
        return (
            <> < FilterComponent onSubmitFunc = {
                this
                    .updateFilters
                    .bind(this)
            } /> <ValidatorForm onSubmit={() => this.issueOrder()} onError={() => null}>
                {
                    this.state.loaded
                        ? <LoonsTable
                        options={{
                            pagination: true,
                            serverSide: true,
                            count: this.state.totalItems,
                            rowsPerPage: this.state.filterData.limit,
                            page: this.state.filterData.page,
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
                                columns={this.state.columns}/>
                        : (
                            //loading effect
                            <Grid className="justify-center text-center w-full pt-12">
                                <CircularProgress size={30}/>
                            </Grid>
                        )
                }
                {console.log(this.props)}

                {this.props.id.match.params.status == 'Pending'? <Grid container="container" spacing={2} className='mt-5'>
                    <Grid
                        item="item"
                        lg={1}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                        <SubTitle title={'Issued Date :'}/>
                    </Grid>
                    <Grid item="item" lg={2} xs={12}>
                        <DatePicker className="w-full" value={this.state.issue.date} placeholder="Issued Date"
                            // minDate={new Date()}
                            //maxDate={new Date()}
                            // required={true}
                            
                            // errorMessages="this field is required"
                            onChange={(date) => {
                               
                                let issue = this.state.issue;
                                issue.date = date
                                //this.state.issue.date = date
                                this.setState({ issue })
                            }}/>
                    </Grid>
                    <Grid
                        item="item"
                        lg={1}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                        <SubTitle title={'Time Slot :'}/>

                    </Grid>
                    <Grid item="item" lg={2} xs={12}>
                        <TextField
                            id="time from"
                            label="Time Slot (from)"
                            type="time"
                            fullWidth="fullWidth"
                            placeholder="07:30"
                            //defaultValue="07:30"
                            onChange={(e)=>{
                                this.state.issue.time_from = e.target.value
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                step: 60, // 1 min
                            }}/>
                    </Grid>
                    <Grid
                        item="item"
                        lg={1}
                        xs={12}
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-end'
                        }}>
                        <SubTitle title={' to :'}/>

                    </Grid>
                    <Grid item="item" lg={2} xs={12}>
                        <TextField
                            id="time to"
                            label="Time Slot (to)"
                            type="time"
                            fullWidth="fullWidth"
                            placeholder="07:30"
                            onChange={(e)=>{
                                this.state.issue.time_to = e.target.value
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                step: 60, // 1 min
                            }}/>
                    </Grid>
                    <Grid
                        item="item"
                        lg={3}
                        xs={12}
                        style={{
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                        <LoonsButton className="mt-2" progress={false} type="submit" startIcon="save"
                            //onClick={this.handleChange}
                        >
                            <span className="capitalize">Issue Order</span>
                        </LoonsButton>
                    </Grid>
                </Grid> : null}

                
            </ValidatorForm>

            <Dialog
                maxWidth="lg"
                open={this.state.allocate_item}
                onClose={() => {
                    // this.setState({allocate_item: false})
                }}>
                <div className="w-full h-full px-5 py-5"> 
                <Grid container="container">
                        <Grid item="item" lg={7} md={6}>
                            <Typography variant='h6'>Individual Item - Batch Allocation</Typography>
                        </Grid>
                        <Grid item="item" lg={5} md={6}>
                            <Grid
                                container="container"
                                style={{
                                    alignItems: 'flex-end'
                                }}>
                                <Grid item="item" lg={9} md={9} xs={9}>
                                    <Grid container="container" lg={12} md={12} xs={12}>
                                        {/* <Grid item="item" lg={6} md={6} xs={6}>Counter Pharmacist ID</Grid>
                                        <Grid item="item" lg={6} md={6} xs={6}>00002</Grid> */}
                                        <Grid item="item" lg={6} md={6} xs={6}>Counter Pharmacist</Grid>
                                        <Grid item="item" lg={6} md={6} xs={6}>{this.props.id.match.params.empname}</Grid>
                                    </Grid>
                                </Grid>
                                <Grid item="item" lg={2} md={2} xs={2}><AccountCircleIcon fontSize="large"/></Grid>
                                <Grid item="item" lg={1} md={1} xs={1}><IconButton aria-label="close" onClick={() => {this.setState({allocate_item: false})}}><CloseIcon /></IconButton></Grid>
                            
                            </Grid>
                        </Grid>
                    </Grid>
                    <div className='mt-6'></div>
                    <CardTitle title="Losartan 100mg"/>
                    <LoonsTable
                        // options={{
                        //     pagination: true,
                        //     serverSide: true,
                        //     count: this.state.totalItems,
                        //     rowsPerPage: this.state.filterData.limit,
                        //     page: this.state.filterData.page,
                        //     print: true,
                        //     viewColumns: true,
                        //     download: true,
                        //     onTableChange: (action, tableState) => {
                        //         console.log(action, tableState)
                        //         switch (action) {
                        //             case 'changePage':
                        //                 this.setPage(tableState.page)
                        //                 break
                        //             case 'sort':
                        //                 // this.sort(tableState.page, tableState.sortOrder);
                        //                 break
                        //             default:
                        //                 console.log('action not handled.')
                        //         }
                        //     }
                        // }}
                        columns={this.state.allocate_dialog_table}
                        data={[this.state.data[this.state.selected_item]]}/>

                    <div className='mt-6'></div>
                    <LoonsCard
                        style={{
                            marginTop: '8px'
                        }}>
                        <Typography variant='h6'>
                            Batch Details</Typography>

                        <Grid container="container" className='mt-8'>
                            <Grid item="item" lg={9}>
                                <Grid
                                    container="container"
                                    lg={12}
                                    md={12}
                                    xs={12}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                    <Grid item="item" lg={1} md={1} xs={2}>Sort By</Grid>
                                    <Grid item="item" lg={3} md={3} xs={3} className='mr-2'>
                                        <ValidatorForm>
                                            <Autocomplete
                                        disableClearable className="w-full" options={['2022', '2023']} onChange={(e, value) => {
                                                    if (value != null) {
                                                        // let formData = this.state.formData formData.ven_id = value     .id     this
                                                        // .setState({formData})
                                                    }
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */

                                                // value={this
                                                
                                                //     .state
                                                
                                                //     .all_ven
                                                
                                                //     .find((v) => v.id == this.state.formData.ven_id)} getOptionLabel={(
                                                
                                                //     option) => option.name
                                                
                                                //     ? option.name
                                                
                                                //     : ''} 
                                                renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Exp Date"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small"/>
                                                )}/>
                                        </ValidatorForm>
                                    </Grid>
                                    <Grid item="item" lg={4} md={4} xs={4}>
                                        <ValidatorForm>
                                            <Autocomplete
                                        disableClearable className="w-full" options={['Ascending', 'Descending']} onChange={(e, value) => {
                                                    if (value != null) {
                                                        // let formData = this.state.formData formData.ven_id = value     .id     this
                                                        // .setState({formData})
                                                    }
                                                }}
                                                /*  defaultValue={this.state.all_district.find(
                                                (v) => v.id == this.state.formData.district_id
                                                )} */

                                                // value={this
                                                
                                                //     .state
                                                
                                                //     .all_ven
                                                
                                                //     .find((v) => v.id == this.state.formData.ven_id)} getOptionLabel={(
                                                
                                                //     option) => option.name
                                                
                                                //     ? option.name
                                                
                                                //     : ''} 
                                                renderInput={(params) => (
                                                    <TextValidator {...params} placeholder="Descending"
                                                        //variant="outlined"
                                                        fullWidth="fullWidth" variant="outlined" size="small"/>
                                                )}/>
                                        </ValidatorForm>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item="item" lg={3}>
                                <ValidatorForm>
                                    <div className='flex items-center'>
                                        <TextValidator className='w-full' placeholder="Search"
                                            //variant="outlined"
                                            fullWidth="fullWidth" variant="outlined" size="small"
                                            //value={this.state.formData.search} 
                                            onChange={(e, value) => {
                                                let filterData = this.state.filterData
                                                filterData.search = e.target.value;
                                                this.setState({filterData})
                                                console.log("form dat", this.state.filterData)
                                            }} onKeyPress={(e) => {
                                                if (e.key == "Enter") {
                                                    this
                                                        .props
                                                        .onSubmitFunc(
                                                            this.state.filterData.ven_id,
                                                            this.state.filterData.category_id,
                                                            this.state.filterData.class_id,
                                                            this.state.filterData.group_id,
                                                            this.state.filterData.search
                                                        )

                                                }

                                            }}
                                            /* validators={[
                                            'required',
                                            ]}
                                            errorMessages={[
                                            'this field is required',
                                            ]} */
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <SearchIcon></SearchIcon>
                                                    </InputAdornment>
                                                )
                                            }}/>
                                    </div>
                                </ValidatorForm>
                            </Grid>
                        </Grid>

                        <LoonsTable
                            columns={this.state.batch_details}
                            data={this.state.batch_details_data}
                            // options={{
                            //     pagination: true,
                            //     serverSide: true,
                            //     count: this.state.totalItems,
                            //     rowsPerPage: this.state.filterData.limit,
                            //     page: this.state.filterData.page,
                            //     print: true,
                            //     viewColumns: true,
                            //     download: true,
                            //     onTableChange: (action, tableState) => {
                            //         console.log(action, tableState)
                            //         switch (action) {
                            //             case 'changePage':
                            //                 this.setPage(tableState.page)
                            //                 break
                            //             case 'sort':
                            //                 // this.sort(tableState.page, tableState.sortOrder);
                            //                 break
                            //             default:
                            //                 console.log('action not handled.')
                            //         }
                            //     }
                            // }}
                            ></LoonsTable>

                        <Grid
                            container="container"
                            style={{
                                justifyContent: 'flex-end',
                                marginTop: '8px'
                            }}>
                            <Grid item="item" className='mr-1'>
                                <Button
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white'
                                    }} onClick={() => {this.resetButton()}}>Reset <DeleteSweepIcon /></Button>
                            </Grid>
                            <Grid item="item" className='mr-1'>
                                <Button
                                    style={{
                                        backgroundColor: '#ff9800',
                                        color: 'white'
                                    }}
                                    onClick={(
                                        ) => this.state.unable_to_fill == 'hidden'
                                        ? this.setState({unable_to_fill: 'visible'})
                                        : this.setState({unable_to_fill: 'hidden'})}>Unable to fulfill <ErrorOutlineIcon /></Button>
                            </Grid>
                            <Grid item="item">
                                <Button
                                    style={{
                                        backgroundColor: '#1a73e8',
                                        color: 'white'
                                    }}
                                    onClick={() => {
                                        let user = localStorageService.getItem('userInfo')
                                        if (this.state.allocate.quantity == 0 || this.state.allocate.quantity == "" || this.state.allocate.quantity == null){
                                            this.setState(
                                                {message: "Please enter a value", alert: true, severity: "Error"}
                                            )
                                        }else{
                                            if (this.state.allocate.quantity > this.state.batch_details_data[0].quantity) {
                                            this.setState(
                                                {message: "Cannot allocate more than available quantity", alert: true, severity: "Error"}
                                            )
                                        } else {
                                            
                                            this.allocate(
                                                this.state.data[this.state.selected_item].id,
                                                "ALLOCATED",
                                                user.id,
                                                new Date().toJSON(),                                               
                                            )
                                        }
                                        }
                                        

                                    }}>Allocate <CheckCircleOutlineIcon /></Button>
                            </Grid>
                        </Grid>

                        <div
                            className='mt-5'
                            style={{
                                contentVisibility: this.state.unable_to_fill,
                                visibility: this.state.unable_to_fill
                            }}>
                            <Grid
                                container="container"
                                lg={12}
                                md={12}
                                xs={12}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                <Grid item="item" lg={4} md={4} xs={4}>Your order is unable to fulfill due to</Grid>
                                <Grid item="item" lg={8} md={8} xs={8}>
                                    <ValidatorForm>
                                        <Autocomplete
                                        disableClearable
                                            className="w-full"
                                            options={this.state.remarks}
                                            onChange={(e, value) => {
                                                console.log(value);
                                                if (value != null) {
                                                    if (value.remark == 'Other'){
                                                        this.setState({remarks_other: 'visible'})  
                                                        this.state.allocate.remark_id = null
                                                    }else{
                                                        this.setState({remarks_other: 'hidden'})
                                                        this.state.allocate.remark_id = value.id
                                                    }
                                                                                                
                                                } else {
                                                    this.setState({remarks_other: 'hidden'})
                                                    this.state.allocate.remark_id = null
                                                }
                                            }}
                                            value={this
                                                .state
                                                .remarks
                                                .find((v) => v.id == this.state.remarks_id)}
                                            getOptionLabel={(
                                                option) => option.remark
                                                ? option.remark
                                                : ''}
                                            renderInput={(params) => (
                                                <TextValidator {...params} placeholder="Select Remarks"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth" variant="outlined" size="small"/>
                                            )}/></ValidatorForm>
                                </Grid>
                                <Grid item="item" lg={4} md={4} xs={4}></Grid>
                                <Grid
                                    item="item"
                                    lg={8}
                                    md={8}
                                    xs={8}
                                    style={{
                                        contentVisibility: this.state.remarks_other,
                                        visibility: this.state.remarks_other
                                    }}>
                                    <Grid container="container" lg={12} md={12} xs={12}>
                                        <Grid item="item" lg={1} md={1} xs={1}>Other</Grid>
                                        <Grid item="item" lg={12} md={12} xs={12}>
                                            <textarea
                                            onChange={(e)=>{
                                                this.state.allocate.other_remarks = e.target.value
                                            }}
                                                style={{
                                                    width: '100%'
                                                }}
                                                cols="2"
                                                rows="5"></textarea>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item="item"
                                    lg={12}
                                    md={12}
                                    xs={12}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        marginTop: '8px'
                                    }}>
                                    <LoonsButton onClick={()=>{
                                        let user = localStorageService.getItem('userInfo')
                                        this.allocate(
                                            this.state.data[this.state.selected_item].id,
                                            "DROPPED",
                                            user.id,
                                            null,
                                            "2022-11-29T00:00:00.000Z",
                                            this.state.batch_details_data[0].id,
                                            null,
                                            null
                                        )
                                    }}>Submit</LoonsButton>
                                </Grid>
                            </Grid>
                        </div>
                    </LoonsCard>
                    {/* <Grid
                        container="container"
                        style={{
                            marginTop: '8px'
                        }}
                        lg={12}
                        md={12}
                        xs={12}>
                        <Grid item="item" className='p-1' lg={4} md={4} xs={4}>
                            <Button
                                style={{
                                    backgroundColor: '#1a73e8',
                                    color: 'white'
                                }}
                                fullWidth={true}>Show other orders for this item</Button>
                        </Grid>
                        <Grid item="item" className='p-1' lg={4} md={4} xs={4}>
                            <Button
                                style={{
                                    backgroundColor: '#1a73e8',
                                    color: 'white'
                                }}
                                fullWidth={true}>Show returns of this item</Button>
                        </Grid>
                        <Grid item="item" className='p-1' lg={4} md={4} xs={4}>
                            <Button
                                style={{
                                    backgroundColor: '#1a73e8',
                                    color: 'white'
                                }}
                                fullWidth={true}>Show Short Exp available drug stores</Button>
                        </Grid>
                    </Grid> */}
                </div>
            </Dialog>

            <LoonsSnackbar
                open={this.state.alert}
                onClose={() => {
                    this.setState({alert: false})
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

export default AllItemsDistribution