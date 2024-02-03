import React, { Component, Fragment } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import {
    Grid,
    IconButton,
    Icon,
    Tooltip,
    CircularProgress,
    Divider,
    Typography
} from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility'
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import moment from 'moment';

import { Autocomplete, Alert } from '@material-ui/lab'
import 'date-fns'
import { yearMonthParse, dateParse, yearParse, roundDecimal, convertTocommaSeparated, padLeadingZeros } from 'utils'
import SearchIcon from '@material-ui/icons/Search'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Pagination from '@material-ui/lab/Pagination';
import LoonsDatePicker from "app/components/LoonsLabComponents/DatePicker";

import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    LoonsTable,
    CardTitle,
    SubTitle,
    FilePicker,
    ImageView,
} from 'app/components/LoonsLabComponents'
import * as appConst from '../../../../appconst'
import EstimationService from 'app/services/EstimationService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import Filters from './Filters'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import InventoryService from 'app/services/InventoryService'
import { batch } from 'react-redux'
import { isEmpty, values } from 'lodash'
// import SingalView from '../Reports/SingalView'
// import PrintEstimationForm from './PrintEstimationForm'

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
    rootCell: {
        padding: '0px !important'
    }
})

class DefaultItemsPharmacist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            totArr:[],
            printloaded: false,
            printData: [],
            itemBatch:[],
            estimationData:[],
            finalValue: [],
            loadTempTable:false,
            loadingBatchInfo : false,
            requiredIncominQrt: null,
            submitData:{},
            backspacePressed: [],

            finalData:{},

            bookNoReq: true,

            submitting: false,
            loaded: false,
            alert: false,
            message: '',
            severity: 'success',
            totalItems: 0,
            totalPages: 0,
            openRows: {},
            openRowsDup :{},
            isEditable: true,
            warehouse_id:null,
            load_batch:false,

            all_ven: [],
            all_item_class: [],
            all_item_category: [],
            all_item_group: [],
            batch_details:[],
            totalBatchQty:null,
            itemStock : [],
            itemAllocation:[],
            batchAllocation:[],

            estimationDataAll: [],

            filterData: {
                warehouse_id: null,
                page: 0,
                limit: 10,
                orderby_sr: true,
                //'order[0]': ['createdAt', 'DESC']
            },
            edit: false,
            editEstimationId: null,
            enteredData: [
                { qty: null }
            ],
                
             
            estimationData: null,
            formData: {

            },

            batchData : {
                page : 0,
                limit : 10,
                exp_date_order: true,
                exp_date_grater_than_zero_search: true,
                quantity_grater_than_zero_search: true,
                // orderby_drug: true,
                // orderby_sr: true,
                item_status: ['Active', 'Pending', 'DC', 'Discontinued'],
            },
            data: [],

            isNewPage : false,

        }
    }


    handleRowToggle = (rowId) => {
        // this.getHospitalEstimation(rowId)
        this.setState((prevState) => ({
            openRows: {
                //...prevState.openRows,
                [rowId]: !prevState.openRows[rowId]
            }
        }));
    };

    handleRowToggleDup = (rowId) => {
        // this.getHospitalEstimation(rowId)
        console.log('cheking rowid', rowId)
        this.setState((prevState) => ({
            openRowsDup: {
                //...prevState.openRows,
                [rowId]: !prevState.openRowsDup[rowId]
            }
        }));
    };


    async loadData() {
        this.setState({ loaded: false })
        let filterData = this.state.filterData
        filterData.warehouse_id = this.state.warehouse_id
        // filterData.warehouse_id = '6f12e5ad-56e8-44b6-a31d-792c5ef2a922'
        let finalArr = [...this.state.finalValue]
        let res = await WarehouseServices.getDefaultItems(filterData)

        if (res.status == 200) {
            console.log("data----------------->>>", res.data.view.data);
            res.data.view.data.map((e)=> {
                let obj ={
                    request_quantity: null,
                    item_id :null,
                    sr_no : null,
                    item_name : null,
                    value : null,
                    estimation_id : null,
                    batch_list : []
                }
                finalArr.push(obj)
            })
            console.log('jdjddjjdjdjdjdj', finalArr )
            this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems, totalPages: res.data?.view?.totalPages, finalValue: finalArr}, ()=>{
                this.getItemwiseStock(res.data.view.data)
                this.loadItemEstimations(res.data.view.data)
            })
        }
    }

    async getBatchDet(id, row) {

        console.log("data item id>>>", id);
        let batch_details = this.state.batch_details

        let params =  this.state.batchData
        params.warehouse_id = this.state.warehouse_id
        params.item_id = id
        // params.warehouse_id = '6f12e5ad-56e8-44b6-a31d-792c5ef2a922'

        if (id) {

        let res = await WarehouseServices.getSingleItemWarehouse(params)

            if (res.status == 200) {
                console.log("data batch-->>>", res);
                batch_details[row] = res.data.view.data
                this.setState({
                    batch_details,
                    load_batch : true,
                    totalBatchQty : res.data.view.totalItems
                }, console.log('hfhfhfhfhfhfhfhfh', this.state.batch_details ))
                // this.setState({ data: res.data.view.data, totalItems: res.data.view.totalItems, totalPages: res.data?.view?.totalPages, loaded: true })
            }
        }
    }

    async saveDistribution() {
        console.log('cheking save data', this.state.totArr)
        console.log('cheking save submitData', this.state.submitData)

        var user_info = await localStorageService.getItem('userInfo')
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse')

        let submitData =  this.state.submitData
        submitData.created_by = user_info.id
        submitData.orderby_sr = true
        submitData.number_of_items = this.state.totArr.length
        submitData.type = "DIRECTDISTRIBUTION"
        submitData.from = this.state.warehouse_id
        submitData.to = selected_warehouse_cache.id
        submitData.item_list = this.state.totArr

        let res = await WarehouseServices.requestDrugExchange(submitData)
        if (res.status == 201) {
            console.log("Order Data res", res)
            this.setState({
                order: res.data.view,
                alert: true,
                message: 'Order Created Successful',
                severity: 'success',

            }, () => {

                let response_data = res.data.posted.res;
                window.location = `/msa_all_order/all-orders/order/${response_data.id
                    }/${response_data?.number_of_items
                    }/${response_data?.order_id
                    }/${user_info.name
                    }/${null
                    }/${response_data?.status
                    }/${response_data?.type
                    }`
                // this.render(),
                // this.updateStatus()
                // window.location.reload()
                // console.log("State ", this.state.order)
            })
        } else {
            this.setState({
                alert: true,
                message: 'Order Create Unsuccesful',
                severity: 'error',
                processing: false
            })
        }
    }

    async setPage(page) {
        let filterData = this.state.filterData
        filterData.page = page
        this.setState({ filterData, isNewPage: true, finalValue:[] }, () => { this.loadData()})
    }

    async setPageforBatches(page) {
        let batchData = this.state.batchData
        batchData.page = page
        this.setState({ batchData }, () => { this.getBatchDet() })
    }


    // async submit(data) {
    //     console.log("clicked data", data)
    //     var owner_id = await localStorageService.getItem('owner_id');
    //     this.setState({ submitting: true })

    //     let res = await EstimationService.createSubHospitalEstimationItems(data)
    //     console.log("Estimation Data added", res)
    //     if (res.status === 201) {

    //         let enteredData = this.state.enteredData
    //         let newEnteredData = enteredData.filter((x) => x.item_id != data.item_id)

    //         this.setState({
    //             enteredData: newEnteredData,
    //             alert: true,
    //             message: 'Estimation Submit successfully!',
    //             severity: 'success',
    //             submitting: false
    //         }
    //             , () => {
    //                 //this.setPage(0)
    //                 this.loadData()
    //             }
    //         )
    //     } else {
    //         this.setState({
    //             alert: true,
    //             message: 'Estimation Submit was Unsuccessful!',
    //             severity: 'error',
    //             submitting: false
    //         })
    //     }


    // }

    removeNullFromBatchList = (item) => {
        item.batch_list = item.batch_list.filter((batch) => batch !== null);
        return item;
      };


    tempSave() {
        this.setState({
            loadingBatchInfo : true
        })
        console.log('checking final value', this.state.finalValue);
    
        let finalValueList = this.state.finalValue;
        let totArr =this.state.totArr
    
        // Assuming each batch in finalValue has a structure similar to the provided JSON object
        const filteredItems = finalValueList.filter((batch) => batch.request_quantity !== null);
        console.log('checking dfdfdfdf', filteredItems);
        
        // const filteredBatches = filteredItems?.map(item => item?.batch_list).filter((batch) => batch !== null || batch.allocated_quantity !== null)
        const filteredBatches = filteredItems.map(this.removeNullFromBatchList);
        console.log('checking filteredBatches', filteredBatches);

       
        if (this.state.isNewPage) {
            console.log('checking this.state.isNewPage0', totArr,filteredBatches);
            // totArr.concat(filteredBatches)
            totArr.push(...filteredBatches);
            console.log('checking this.state.isNewPage1', totArr);
        } else {
            totArr = filteredBatches
            console.log('checking this.state.isNewPage2', totArr);
        }

        this.setState({
            totArr:totArr,
            loadTempTable:true
        })

        console.log('checking this.state.isNewPage3', totArr);
    

    }
    

    async componentDidMount() {
        var owner_id = await localStorageService.getItem('owner_id');
        var user_info = await localStorageService.getItem('userInfo')
        var selected_warehouse_cache = await localStorageService.getItem('Selected_Warehouse')
        console.log('EstimationData', this.props.match.params.id) 

        if (user_info.roles.includes('RMSD OIC') || user_info.roles.includes('RMSD MSA') || user_info.roles.includes('RMSD Pharmacist')) {
            this.setState({
                bookNoReq: false
            })
        }

        this.setState({ warehouse_id: selected_warehouse_cache.id}, ()=>{
            this.loadData()
        })
    }


    async loadItemEstimations(data) {

        let owner_id = this.state.selectedWarehouseData?.owner_id
        let itemIds = data.map((e)=>e?.item_id)

        let params = {
            warehouse_id: this.state.warehouse_id,
            // warehouse_id: '6f12e5ad-56e8-44b6-a31d-792c5ef2a922',
            owner_id: owner_id,
            item_id: itemIds,
            estimation_status: 'Active',
            available_estimation: 'Active',
            status: 'Active',
            hospital_estimation_status: 'Active',
            'order[0]': ['createdAt', 'DESC'],
        }

        let res = await EstimationService.getAllEstimationITEMS(params)
        if (res.status == 200) {
            console.log("loaded data estimation", res)
            this.setState({
                estimationData: res.data?.view?.data
            })
        }


    }

    async orderItemAllocation(data) {
        let owner_id = await localStorageService.getItem('owner_id')
        let itemIds = data.map((e)=>e?.item_id)
        let itemFilter = {
            item_id: itemIds,
            warehouse_id: this.state.warehouse_id,
            owner_id: owner_id,
            status: 'Active',
            allocation_sum: true,
            group_by_warehouse_only: true  
        }

        console.log("itemBtach", itemFilter)
        let posted = await InventoryService.getOrderItemAllocation(itemFilter)
        if (posted.status == 200) {
            console.log('Orders', posted.data)
            this.setState(
                {
                    itemAllocation: posted?.data.view.data,
                    loaded: true,
                }
            )
        } else {
            this.setState({
                loaded: true
            })
        }
    }

    async orderBatchAllocation(data) {
        let owner_id = await localStorageService.getItem('owner_id')
        let itemFilter = {
            item_id: data,
            warehouse_id: this.state.warehouse_id,
            owner_id: owner_id,
            status: 'Active',
            allocation_sum: true,
        }

        console.log("itemBtach", itemFilter)

        if (data) {
            let posted = await InventoryService.getOrderItemAllocation(itemFilter)
            if (posted.status == 200) {
                console.log('Orders', posted.data)
                this.setState(
                    {
                        batchAllocation: posted?.data.view.data,
                    }
                )
            } else {
                this.setState({
                    loaded: true
                })
            }
        }
    }

    async getItemwiseStock(data) {

        let itemIds = data.map((e)=>e?.item_id)

        let params  = {
            warehouse_id : this.state.warehouse_id,
            // warehouse_id: '6f12e5ad-56e8-44b6-a31d-792c5ef2a922',
            search_type: true,
            item_id : itemIds,
            not_item_wise: false
        }

        let res = await DistributionCenterServices.getBatchData(params) 

        if (res.status) {
            console.log("loaded itemwise stock", res)

            this.setState({
                itemStock :  res.data.view.data,
                // loaded: true
            },()=>{
                this.orderItemAllocation(data)
            })
        }
    }

    handleTextChangePage = (value, error) => {
        const { submitData } = this.state;
        submitData.page_no = value;

        this.setState({
            submitData,
            isFilledPageNo: !error,
        });
    };

    handleTextChangeBook = (value, error) => {
        const { submitData } = this.state;
        submitData.page_no = value;

        this.setState({
            submitData,
            isFilledBookNo: !error,
        });
    };



    render() {
        const { classes } = this.props
        const { data, openRows } = this.state;
        return (
            < Fragment >
                <MainContainer>
                    <LoonsCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                    <Typography variant="h6" className="font-semibold">View Item Details</Typography>
                </div>
                <Divider className='mt-4 mb-4' />


                <Filters onSubmit={(data) => {
                    let filterData = this.state.filterData
                    //filterData == { ...filterData, ...data }
                    Object.assign(filterData, data)
                    this.setState({ filterData }, () => {
                        this.setPage(0)
                    })
                }}></Filters>

                <div className='mt-5'>
                    {this.state.loaded ?
                        <ValidatorForm className="w-full mt-5">
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell />
                                            <TableCell>SR No</TableCell>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell>Standard Cost</TableCell>
                                            <TableCell>Annual Estimation</TableCell>
                                            <TableCell>Monthly Estimation</TableCell>
                                            <TableCell>Remaining Estimation</TableCell>
                                            <TableCell>Itemwise Stock</TableCell>
                                            {/* <TableCell>Item Allocation</TableCell> */}
                                            <TableCell>Available Qty</TableCell>
                                            <TableCell>Quantity</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.map((row, i) => {

                                            let finalValue = this.state.finalValue
                                            let index = finalValue.findIndex((x) => x.item_id == row?.item_id)
                                            console.log('ckeking updated index', index)
                                            return (
                                                <React.Fragment key={row?.ItemSnap?.id}>
                                                    <TableRow>
                                                        <TableCell>
                                                            <IconButton
                                                                aria-label="expand row"
                                                                size="small"
                                                                onClick={() => this.handleRowToggle(row?.ItemSnap?.id)}
                                                            >
                                                                {openRows[row?.ItemSnap?.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                            </IconButton>
                                                        </TableCell>
                                                        <TableCell>{row.ItemSnap?.sr_no}</TableCell>
                                                        <TableCell>{row.ItemSnap?.medium_description}</TableCell>
                                                        <TableCell>{convertTocommaSeparated(row.ItemSnap?.standard_cost, 2)}</TableCell> {/* Standard Cost */} 
                                                        <TableCell>{this.state.estimationData?.filter((x) => x.item_id == row.item_id)[0]?.estimation  || 0}</TableCell> {/* Annual Estimation */} 
                                                        <TableCell>{(this.state.estimationData?.filter((x) => x.item_id == row.item_id)[0]?.estimation) / 12  || 0}</TableCell> {/* Monthly Estimation */} 
                                                        <TableCell>{(this.state.estimationData?.filter((x) => x.item_id == row.item_id)[0]?.estimation) - (this.state.estimationData?.filter((x) => x.item_id == row.item_id)[0]?.issued_quantity) || 0}</TableCell> {/* remaining Estimation */} 
                                                        <TableCell>{(this.state.itemStock?.filter((x) => x?.ItemSnapBatch?.item_id == row?.item_id)[0]?.quantity || 0)}</TableCell> {/* Itemwise Stock */} 
                                                        {/* <TableCell>{(this.state.itemAllocation?.filter((x) => x?.item_id == row?.item_id)[0]?.reserved_quantity || 0)}</TableCell> Itemwise Stock  */}
                                                        <TableCell>{(this.state.itemAllocation?.filter((x) => x?.item_id == row?.item_id)[0]?.reserved_quantity)  ? (Number(this.state.itemStock?.filter((x) => x?.ItemSnapBatch?.item_id == row?.item_id)[0]?.quantity) - Number(this.state.itemAllocation?.filter((x) => x?.item_id == row?.item_id)[0]?.reserved_quantity)) :  this.state.itemStock?.filter((x) => x?.ItemSnapBatch?.item_id == row?.item_id)[0]?.quantity || 0}</TableCell> {/* Itemwise Stock */} 
                                                        {/* {console.log('hhjjkkjjhhb hhjj', this.state.itemStock?.filter((x) => x?.ItemSnapBatch?.item_id == row?.item_id))} */}
                                                        <TableCell>
                                                            <Grid container direction='row'>
                                                                <Grid item>
                                                                <Tooltip title="Quantity" arrow>
                                                                    <TextValidator
                                                                        //className=" w-full"
                                                                        placeholder="Enter Qty"
                                                                        name="estimation"
                                                                        InputLabelProps={{ shrink: false }}
                                                                        value={this.state.totArr?.filter((e)=>e?.item_id == row?.item_id)[0]?.request_quantity}
                                                                        type="number"
                                                                        variant="outlined"
                                                                        size="small"
                                                                        onFocus={() => openRows[row?.ItemSnap?.id] ? null : this.handleRowToggle(row?.ItemSnap?.id)}
                                                                        onChange={(e) => {
                                                                            console.log('hhfhhff fhhfhf hfhfhf', Number(this.state.itemStock?.filter((x) => x?.ItemSnapBatch?.item_id == row?.item_id)[0]?.quantity) , Number(this.state.itemAllocation?.filter((x) => x?.item_id == row?.item_id)[0]?.reserved_quantity))
                                                                            if (e.target.value > ((this.state.itemAllocation?.filter((x) => x?.item_id == row?.item_id)[0]?.reserved_quantity)  ? (Number(this.state.itemStock?.filter((x) => x?.ItemSnapBatch?.item_id == row?.item_id)[0]?.quantity) - Number(this.state.itemAllocation?.filter((x) => x?.item_id == row?.item_id)[0]?.reserved_quantity)) :  this.state.itemStock?.filter((x) => x?.ItemSnapBatch?.item_id == row?.item_id)[0]?.quantity)) {
                                                                                this.setState({
                                                                                    alert: true,
                                                                                    message: 'Cannot enter more than Available Qty',
                                                                                    severity: 'error',
                                                                                })
                                                                            } else {

                                                                            let estimationId = this.state.estimationData?.filter((x) => x.item_id == row.item_id)[0]?.id
                                                                            console.log('ckeking updated sdsdsdsds', index)
                                                                            let finalValue =  this.state.finalValue
                                                                            finalValue[i].request_quantity = e.target.value
                                                                            finalValue[i].value = e.target.value
                                                                            finalValue[i].item_id = row.item_id
                                                                            finalValue[i].sr_no = row.ItemSnap?.sr_no
                                                                            finalValue[i].item_name = row.ItemSnap?.medium_description
                                                                            // finalValue[i].isValueChange = true
                                                                            finalValue[i].estimation_id = estimationId
                                                                            finalValue[i].batch_list = []
                                                                            this.setState({
                                                                                finalValue,
                                                                            }, ()=>{
                                                                                console.log('ckeking updated list-1', finalValue)
                                                                            })


                                                                            if (e.target.value.length > 0) {
                                                                                this.getBatchDet(row?.item_id, i)
                                                                                
                                                                                this.orderBatchAllocation(row?.item_id)
                                                                                // openRows[row?.ItemSnap?.id]
                                                                            } else (
                                                                                this.handleRowToggle(row?.ItemSnap?.id)
                                                                            )
                                                                            }
                                                                           

                                                                        }}

                                                                        onKeyDown={(e) => {
                                                                            let backKey = this.state.backspacePressed
                                                                            if (e.key === 'Backspace' && !backKey[i]) {
                                                                                this.handleRowToggle(row?.ItemSnap?.id)
                                                                                backKey[i] = true
                                                                                this.setState({ backKey});
                                                                            }
                                                                        }}

                                                                        // validators={[
                                                                        //     "maxNumber:" + 100,
                                                                        // ]}
                                                                        // errorMessages={[
                                                                        //     "Cannot Allocate More than Available Qty",
                                                                        // ]}
                                                                        
                                                                    
                                                                    />
                                                                </Tooltip>
                                                                </Grid>
                                                                {/* <Grid item className='mt-1'>
                                                                    <Tooltip title="Add" arrow>
                                                                        <Button onClick={()=>this.tempSave()}>+</Button>
                                                                    </Tooltip>
                                                                </Grid> */}
                                                            </Grid>
                                                            
                                                            
                                                        </TableCell>
                                                        <TableCell> {data[i].status}</TableCell>

                                                        
                                                    </TableRow>
                                                    {this.state.load_batch &&
                                                    <TableRow>
                                                        <TableCell className={classes.rootCell} colSpan={12}>
                                                            <Collapse style={{ backgroundColor: '#d7dffa' }} in={openRows[row.item_id]} timeout="auto" unmountOnExit>
                                                                <div className='w-full px-10 py-5'>
                                                            
                                                                 <Table>
                                                                         <TableHead>
                                                                             <TableRow>
                                                                                 <TableCell />
                                                                                 <TableCell>Batch No</TableCell>
                                                                                 <TableCell>EXD</TableCell>
                                                                                 <TableCell>Minimum Pack Size</TableCell>
                                                                                 {/* <TableCell>Batch Allocation</TableCell> */}
                                                                                 <TableCell>Quantity</TableCell>
                                                                                 <TableCell>Available Quantity</TableCell>
                                                                                 <TableCell>Action</TableCell>
                                                                                 {/* <TableCell>Action</TableCell> */}
                                                                             </TableRow>
                                                                         </TableHead>
                                                                         <TableBody>
                                                                            {console.log('imhhfhfhhfhf', this.state.batch_details)}
                                                                            {this.state.batch_details[i]?.map((ele, j)=>
                                                                            (
                                                                            <TableRow key={j}> 
                                                                                <TableCell>{j+1}</TableCell>
                                                                                <TableCell>{ele?.ItemSnapBatch?.batch_no}</TableCell>
                                                                                <TableCell>{dateParse(ele?.ItemSnapBatch?.exd)}</TableCell>
                                                                                <TableCell>{ele?.ItemSnapBatch?.pack_size}</TableCell>
                                                                                <TableCell>{ele?.quantity}</TableCell> 
                                                                                {/* <TableCell>{(this.state.batchAllocation?.filter((x) => ele?.item_batch_bin_id == ele?.id)[0]?.reserved_quantity || 0)}</TableCell>  */}
                                                                                <TableCell>{this.state.batchAllocation?.filter((x) => x?.item_batch_bin_id == ele?.id)[0]?.reserved_quantity ? (Number(ele?.quantity) - Number(this.state.batchAllocation?.filter((x) => x?.item_batch_bin_id == ele?.id)[0]?.reserved_quantity)) : ele?.quantity}</TableCell> 
                                                                                
                                                                                {/* {console.log("djdjjdjdjdjdjjdjdjdj", this.state.totArr.filter((e)=>e?.item_id == row?.item_id)[0]?.batch[j]?.quantity)} */}
                                                                                <TableCell>
                                                                                    <Tooltip title="Quantity" arrow>
                                                                                        
                                                                                        <TextValidator
                                                                                            //className=" w-full"
                                                                                            placeholder="Enter Qty"
                                                                                            name="estimation"
                                                                                            InputLabelProps={{ shrink: false }}
                                                                                            value={this.state.finalValue[i]?.batch_list[j]?.allocated_quantity ? this.state.finalValue[i]?.batch_list[j]?.allocated_quantity : this.state.totArr?.filter((e)=>e?.item_id == row?.item_id)[0]?.batch_list[j]?.allocated_quantity}
                                                                                            // value={this.state.finalValue[i]?.batch[j]?.quantity}
                                                                                            type="number"
                                                                                            variant="outlined"
                                                                                            size="small"
                                                                              
                                                                                            onChange={(e) => {

                                                                                                let backKey = this.state.backspacePressed
                                                                                                backKey[i] = false
                                                                                                this.setState({ backKey});

                                                                                                let batchBinId =  this.state.batchAllocation?.filter((x) => ele?.item_batch_bin_id == ele?.id)[0]?.item_batch_bin_id 

                                                                                                const { finalValue } = this.state;
                                                                                                const updatedFinalValue = [...finalValue];
                                                                                            
                                                                                                const inputValue = e.target.value;
                                                                                                const rowIdx = i;
                                                                                                const colIdx = j;

                                                                                                console.log('Checking updated val', e.target.value, this.state.finalValue[i]?.batch_list[j]?.allocated_quantity);
                                                                                                
                                                                                                let remaining

                                                                                                if (inputValue >= 0) {
                                                                                                    remaining = Number(this.state.finalValue[i]?.value) + Number(this.state.finalValue[i]?.batch_list[j]?.allocated_quantity) - Number(inputValue)
                                                                                                }

                                                                                
                                                                                                finalValue[rowIdx].value = remaining

                                                                                                if (!updatedFinalValue[rowIdx]?.batch_list) {
                                                                                                    updatedFinalValue[rowIdx].batch_list = [];
                                                                                                }
                                                                                                if (!updatedFinalValue[rowIdx]?.batch_list[colIdx]) {
                                                                                                    updatedFinalValue[rowIdx].batch_list[colIdx] = {};
                                                                                                }

                                                                                                updatedFinalValue[rowIdx].batch_list[colIdx] = {
                                                                                                    allocated_quantity:inputValue,
                                                                                                    item_batch_id : ele?.item_batch_id,
                                                                                                    batch_no : ele?.ItemSnapBatch?.batch_no,
                                                                                                    bin_id : ele?.bin_id,
                                                                                                    item_batch_bin_id : ele.id,
                                                                                                    item_name : ele?.ItemSnapBatch?.ItemSnap?.medium_description,
                                                                                                    sr_no : ele?.ItemSnapBatch?.ItemSnap?.sr_no,
                                                                                                    allocated_volume: Number(ele?.quantity) / Number(ele?.volume) * Number(inputValue)
                                                                                                }
                                                                                                console.log('Checking updated list-2', updatedFinalValue);

                                                                                                this.setState({
                                                                                                    updatedFinalValue,
                                                                                                    finalValue
                                                                                                }, () => {
                                                                                                    console.log('Checking updated li5050', this.state.finalValue);
                                                                                                });

                                                                                            }}

                                                                                            onClick={() => {

                                                                                                let backKey = this.state.backspacePressed
                                                                                                backKey[i] = false
                                                                                                this.setState({ backKey});

                                                                                                let batchBinId =  this.state.batchAllocation?.filter((x) => ele?.item_batch_bin_id == ele?.id)[0]?.item_batch_bin_id 

                                                                                                const { finalValue } = this.state;
                                                                                                const updatedFinalValue = [...finalValue];
                                                                                                let batchAvailableQty = ele?.quantity
        
                                                                                                let remainingQty = this.state.finalValue[i]?.value

                                                                                                const rowIdx = i;
                                                                                                const colIdx = j;
                                                                                            
                                                                                                // Make sure the nested structures exist before updating
                                                                                                if (!updatedFinalValue[rowIdx]?.batch_list) {
                                                                                                    updatedFinalValue[rowIdx].batch_list = [];
                                                                                                }
                                                                                                if (!updatedFinalValue[rowIdx]?.batch_list[colIdx]) {
                                                                                                    updatedFinalValue[rowIdx].batch_list[colIdx] = {};
                                                                                                }

                                                                                                console.log('Checking remainingQty', remainingQty, batchAvailableQty)

                                                                                                if (remainingQty > 0) {

                                                                                                    if (Number(batchAvailableQty) <= Number(remainingQty)) {
                                                                                                        let finalRemainingQty = Number(remainingQty) - Number(batchAvailableQty)
                                                                                                        finalValue[rowIdx].value = finalRemainingQty
    
                                                                                                        console.log('Checking finalRemainingQty', finalRemainingQty)
    
                                                                                                        updatedFinalValue[rowIdx].batch_list[colIdx] = {
                                                                                                            allocated_quantity:batchAvailableQty,
                                                                                                            item_batch_id : ele?.item_batch_id,
                                                                                                            batch_no : ele?.ItemSnapBatch?.batch_no,
                                                                                                            bin_id : ele?.bin_id,
                                                                                                            item_batch_bin_id : ele.id,
                                                                                                            item_name : ele?.ItemSnapBatch?.ItemSnap?.medium_description,
                                                                                                            sr_no : ele?.ItemSnapBatch?.ItemSnap?.sr_no,
                                                                                                            allocated_volume: Number(ele?.quantity) / Number(ele?.volume) * Number(batchAvailableQty)
                                                                                                            
                                                                                                        }
                                                                                                        this.setState({
                                                                                                            updatedFinalValue,
                                                                                                            finalValue
                                                                                                        })
                                                                                                        
                                                                                                    } else {
                                                                                                        updatedFinalValue[rowIdx].batch_list[colIdx] = {
                                                                                                            allocated_quantity:remainingQty,
                                                                                                            item_batch_id : ele?.item_batch_id,
                                                                                                            batch_no : ele?.ItemSnapBatch?.batch_no,
                                                                                                            bin_id : ele?.bin_id,
                                                                                                            item_batch_bin_id : ele.id,
                                                                                                            item_name : ele?.ItemSnapBatch?.ItemSnap?.medium_description,
                                                                                                            sr_no : ele?.ItemSnapBatch?.ItemSnap?.sr_no,
                                                                                                            allocated_volume: Number(ele?.quantity) / Number(ele?.volume) * Number(remainingQty)
                                                                                                        }
                                                                                                        finalValue[rowIdx].value = 0
                                                                                                        
                                                                                                        // let arrayFromObject = Object.values(updatedFinalValue);
                                                                                                        this.setState({
                                                                                                            updatedFinalValue,
                                                                                                            finalValue
                                                                                                        })
                                                                                                    }

                                                                                                }

                                                                                            }}

                                                                                            validators={[
                                                                                                "maxNumber:" + this.state.finalValue[i]?.request_quantity,
                                                                                                "maxNumber:" + ele?.quantity,
                                                                                            ]}
                                                                                            errorMessages={[
                                                                                                "Cannot Allocate More than Available Qty",
                                                                                                "Cannot exceed More than batch Available Qty",
                                                                                            ]}


                                                                                        />
                                                                                    </Tooltip>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table> 
                                                                

                                                                </div>
                                                            </Collapse>
                                                        </TableCell>
                                                    </TableRow>
                                                    
                                                    }
                                                </React.Fragment>)
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <div className='mt-5 flex justify-end' >
                                <Tooltip title="Add" arrow>
                                    <Button onClick={()=>this.tempSave()}>Add</Button>
                                </Tooltip>
                            </div>
                            
                            <div className="flex justify-end">
                                <Pagination count={this.state.totalPages} page={this.state.filterData.page + 1} onChange={(e, value) => { this.setPage(value - 1) }} />
                            </div>

                        </ValidatorForm>
                        :
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress
                                size={30}
                            />
                        </Grid>
                    }

                </div>
                {this.state.loadingBatchInfo &&
                <>
                    <div className='mt-5'>
                    {this.state.loadTempTable ? 
                    
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>SR No</TableCell>
                                    <TableCell>Item Name</TableCell>
                                    <TableCell>Allocated Quantity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.totArr.map((row, i) => {
                                    return (
                                        <React.Fragment key={i}>
                                            <TableRow>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => this.handleRowToggleDup(row?.item_id)}
                                                    >
                                                        {this.state.openRowsDup[row?.item_id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>{row?.sr_no}</TableCell>
                                                <TableCell>{row?.item_name}</TableCell>
                                                <TableCell>{row?.request_quantity}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={classes.rootCell} colSpan={10}>
                                                    <Collapse style={{ backgroundColor: '#d7dffa' }} in={this.state.openRowsDup[row.item_id]} timeout="auto" unmountOnExit>
                                                        <div className='w-full px-10 py-5'>
                                                    
                                                            <Table>
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell />
                                                                        <TableCell>Batch No</TableCell>
                                                                        <TableCell>Allocated Quantity</TableCell>
                                                                        <TableCell>Allocated Volume</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {row.batch_list.map((ele, x)=>(
                                                                    <TableRow key={x}>
                                                                        <TableCell>{x+1}</TableCell>
                                                                        <TableCell>{ele?.batch_no}</TableCell>
                                                                        <TableCell>{ele?.allocated_quantity}</TableCell>
                                                                        <TableCell>{roundDecimal(ele?.allocated_volume, 2)}</TableCell>
                                                                    </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                            </Table> 
                                                        </div>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>

                                        </React.Fragment>)
                                })}
                            </TableBody>
                        </Table>
                        </TableContainer>
                    
                
                    :
                        <Grid className="justify-center text-center w-full pt-12">
                            <CircularProgress
                                size={30}
                            />
                        </Grid>
                    }
                    </div>

                    <ValidatorForm onSubmit={() => { this.saveDistribution()() }}>
                                        <Grid container spacing={2} className='mt-5'>
                                            <Grid item>
                                                <SubTitle title="Allocated Date" />
                                                <LoonsDatePicker className="w-full"
                                                    selected={this.state.submitData.required_date}
                                                    value={this.state.submitData.required_date}
                                                    placeholder="Allocated Date"
                                                    // minDate={new Date()} 
                                                    // minDate={null}
                                                    //maxDate={new Date()}
                                                    required={true}
                                                    // disabled={this.state.date_selection}
                                                    // errorMessages="this field is required"
                                                    onChange={(date) => {
                                                        let submitData = this.state.submitData
                                                        submitData.required_date = dateParse(date)
                                                        submitData.issued_date = dateParse(date)
                                                        submitData.allocated_date = dateParse(date)
                                                        this.setState({ submitData })
                                                    }}
                                                    format='dd/MM/yyyy'
                                                />
                                            </Grid>

                                            <Grid item>
                                                <SubTitle title="Book No" />
                                                <TextValidator

                                                    className="w-full"
                                                    placeholder="Book No"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth"
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.submitData.book_no
                                                    }
                                                    onChange={(e, value) => {

                                                        this.handleTextChangePage()
                                                        let submitData = this.state.submitData
                                                        submitData.book_no = e.target.value
                                                        this.setState({
                                                            submitData,
                                                        })


                                                    }}
                                                    // validators={['required']},
                                                    // errorMessages={['This field is required']}
                                                    // validators={['required']}
                                                    // errorMessages={[
                                                    //     this.state.formData.page_no ? null : 'This field is required'
                                                    // ]}
                                                    validators={this.state.bookNoReq ? ['required'] : null}
                                                    errorMessages={[
                                                        this.state.bookNoReq ? 'This field is required' : null
                                                    ]}

                                                />

                                            </Grid>


                                            <Grid item>
                                                <SubTitle title="Page No" />
                                                <TextValidator

                                                    className="w-full"
                                                    placeholder="Page No"
                                                    //variant="outlined"
                                                    fullWidth="fullWidth"
                                                    variant="outlined"
                                                    size="small"
                                                    value={
                                                        this.state.submitData.page_no
                                                    }
                                                    onChange={(e, value) => {
                                                        this.handleTextChangeBook()
                                                        let submitData = this.state.submitData
                                                        submitData.page_no = e.target.value
                                                        this.setState({
                                                            submitData,
                                                        })


                                                    }}
                                                    validators={this.state.bookNoReq ? ['required'] : null}
                                                    errorMessages={[
                                                        this.state.bookNoReq ? 'This field is required' : null
                                                    ]}
                                                /* validators={[
                                                    'required',
                                                ]}
                                                errorMessages={['this field is required',]}
                                                */

                                                />
                                            </Grid>


                                        </Grid>
                                        <Grid item>

                                            <Button
                                                className="mt-5 "
                                                progress={this.state.processing}
                                                type="submit"
                                                scrollToTop={true}
                                                startIcon="save"
                                                disabled={this.state.bookNoReq ? (!this.state.isFilledPageNo || !this.state.isFilledBookNo) : false}
                                            >
                                                <span className="capitalize">
                                                    Save
                                                </span>
                                            </Button>
                                        </Grid>

                                    </ValidatorForm>

                    {/* {this.state.loadTempTable && 
                        <div className='mt-3'>
                            <Button onClick={()=>this.saveDistribution() }>Save</Button>
                        </div>
                    } */}
                    </>
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
                    variant="filled"
                ></LoonsSnackbar>

                    </LoonsCard>
                </MainContainer>
            </Fragment>
        )
    }
}

export default withStyles(styleSheet)(DefaultItemsPharmacist)