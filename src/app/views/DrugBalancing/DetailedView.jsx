import React, { Component, Fragment } from 'react'
import { TextValidator } from 'react-material-ui-form-validator'
import { ValidatorForm } from 'app/components/LoonsLabComponents'
import SearchIcon from '@material-ui/icons/Search'
import { Autocomplete, createFilterOptions } from '@material-ui/lab'
import {
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Badge,
    CircularProgress,
    InputAdornment,
    IconButton,
    Icon,
    Tooltip,
    Typography,
    Box,
} from '@material-ui/core'
import {
    DatePicker,
    Button,
    LoonsSnackbar,
    MainContainer,
    LoonsCard,
    CardTitle,
    SubTitle,
    ImageView,
    LoonsTable,
    PrintDataTable,
} from 'app/components/LoonsLabComponents'
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import AppsIcon from '@mui/icons-material/Apps';
import { withStyles } from '@material-ui/core/styles'
import ApartmentIcon from '@material-ui/icons/Apartment'
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import DistributionCenterServices from 'app/services/DistributionCenterServices'
import PharmacyOrderService from 'app/services/PharmacyOrderService'
import localStorageService from 'app/services/localStorageService'
import WarehouseServices from 'app/services/WarehouseServices'
import { element } from 'prop-types'
import { dateParse,timeParse } from 'utils'
import LoonsButton from 'app/components/LoonsLabComponents/Button'
import { date } from 'yup/lib/locale'
import moment from 'moment'
import PrescriptionService from 'app/services/PrescriptionService'
import InventoryService from 'app/services/InventoryService'
import { dateTimeParse} from "utils";

class DetailedView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page:null,
            prescriptiondata:[],
            exchangeissuancedata:[],
            orderdata:[],
            manualdata:[],
            itembatchdata:{},
            loaded:false,
            filterData2:{
                page:0,
                limit:20,
                
            },
            filterData:{
                limit:20,
                page:0,
                'order[0][0]':'createdAt',
                'order[0][1]':'DESC',
                // from:null,
                // to:null,
                // batch_id:null,

            },
            data:[],
            data2:[],
            columns:[
                {
                    name: 'datentime',
                    label: 'Date & Time',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                        
                            let date = this.state.data[dataIndex]?.createdAt
                            let data = "" + dateParse(date)+" "+timeParse(date);
                                return <p>{data}</p>
                            }
                        },
                        
                    },
                
                { 
                    name: 'type',
                    label: 'Type',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                        
                            let data = this.state.data[dataIndex]?.type
                           
                                return <p>{data}</p>
                            }
                        
                    },
                },
                {
                    name: 'qty',
                    label: 'Quantity',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                        
                            let data = this.state.data[dataIndex]?.quantity
                           
                                return <p>{data}</p>
                            }
                        
                    },
                },
                {
                    name: 'start_qty',
                    label: 'Starting Quantity',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                        
                            let data = this.state.data[dataIndex]?.starting_quantity
                           
                                return <p>{data}</p>
                            }
                        
                    },
                },
                {
                    name: 'end_qty',
                    label: 'Ending Quantity',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                        
                            let data = this.state.data[dataIndex]?.ending_quantity

                           
                                return <p>{data}</p>
                            }
                        
                    },
                },
                {
                    name: 'issued_by',
                    label: 'Issued By',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                        
                            let data = this.state.data[dataIndex]?.Issuing?.Employee?.name

                           
                                return <p>{data}</p>
                            }
                        
                    },
                },
                {
                    name: 'details',
                    label: 'Details',
                    options: {
                        display: true,
                        customBodyRenderLite: (dataIndex) => {
                           console.log("data",data)

                            let data = this.state.data[dataIndex]
                            let viewdata = ""
                            if(data.type == 'Issuing'){
                                    let prescriptiondata = this.state.prescriptiondata.filter((presdata) => presdata.id == data.source_id )
                                    viewdata = "Prescription of : " + prescriptiondata[0]?.Patient?.name + ' - PHN ' + prescriptiondata[0]?.Patient?.phn    
                            }

                            if(data.type == 'Exchange_Issuance'){
                                let exchangeissuancedata = this.state.exchangeissuancedata.filter((presdata) => presdata.order_item_id == data.source_id )
                                viewdata =  exchangeissuancedata[0]?.OrderItem?.OrderExchange?.type + ' from ' + exchangeissuancedata[0]?.OrderItem?.OrderExchange?.fromStore?.name + 
                                            ' to ' +   exchangeissuancedata[0]?.OrderItem?.OrderExchange?.toStore?.name    
                        
                                        }

                            if( data.type == 'Order Issue' || data.type =='Order Recieve'  || data.type == 'Exchange_Recieve' ){
                                let orderdata = this.state.orderdata.filter((presdata) => presdata.id == data.source_id )
                                viewdata =  orderdata[0]?.OrderItem?.OrderExchange?.type + ' from ' + orderdata[0]?.OrderItem?.OrderExchange?.fromStore?.name + 
                                            ' to ' +   orderdata[0]?.OrderItem?.OrderExchange?.toStore?.name  
                        }
                        if(data.type == 'Clinic_manual' || data.type =='Drug Balancing'
                        || data.type =='Excess_manual'  ||  data.type == 'OPD_manual'
                        || data.type =='Ward_manual' || data.type == 'Waste'){
                            let manualdata = this.state.manualdata.filter((presdata) => presdata.id == data.source_id )
                            viewdata = "Remark : " + manualdata[0]?.remark     
                    }
                           
                                return <p>{viewdata}</p>
                            }
                    },
                },
            ]
        }
    }
    
    async loadDrugBalancingData(rowData) {
        this.setState({ loading2: false })
        console.log("rowdata",rowData)
        var sw = await localStorageService.getItem('Selected_Warehouse')
       
        let params = {
            warehouse_id:sw.id,
            page:this.state.filterData2.page,
            limit:this.state.filterData2.limit,
           // item_batch_id:rowData.batch_id,

        }
        
        let batch_res = await WarehouseServices.getDrugBalancing(params)
        if (batch_res.status == 200) {
            let data2 = batch_res.data.view.data
       
            this.setState({
                data2: batch_res.data.view.data,
                totalItems2: batch_res.data.view.totalItems,
            })
            console.log('Batch Data3', this.state.data2)
            this.setState({loading2: true })
        }
    } 

    async loadAdditionalData() {
        this.setState({ loaded: false })
        var sw = await localStorageService.getItem('Selected_Warehouse')
        let params = this.state.filterData
        params.warehouse_id = sw.id
        
        // let params = {

        //     warehouse_id:sw.id,
        //     page:this.state.filterData.page,
        //     limit:this.state.filterData.limit,
        //     item_batch_id:this.state.fibatch_id,
        //     from:this.state.from,
        //     to:this.state.to,

        // }
        let batch_res = await WarehouseServices.getAdditionalData(params)
        if (batch_res.status == 200) {
            let prescriptionlist = batch_res.data.view.data.filter((data) => data.type == 'Issuing' );
            let orderissuelist = batch_res.data.view.data.filter((data) => data.type == 'Order Issue' || data.type =='Order Recieve'
                                      || data.type == 'Exchange_Recieve' );
            let manuallist = batch_res.data.view.data.filter((data) => data.type == 'Clinic_manual' || data.type =='Drug Balancing'
                                     || data.type =='Excess_manual' || data.type == 'Issuing' ||  data.type == 'OPD_manual'
                                     || data.type =='Ward_manual' || data.type == 'Waste' );
             let exchangeissuancelist =  batch_res.data.view.data.filter((data) => data.type == 'Exchange_Issuance' );      
            
             if(prescriptionlist.length > 0){
                   this.loadPrescriptionAdditionalData(prescriptionlist)
            }
            if(orderissuelist.length > 0){
                this.loadOrderData(orderissuelist)
         }
         if(manuallist.length > 0){
            this.loadManualData(manuallist)
     }
     if(exchangeissuancelist.length > 0){
        this.loadExchangeIssuanceData(exchangeissuancelist)
 }

            this.setState({
                data: batch_res.data.view.data,
                totalItems:batch_res.data.view.totalItems,
                loaded: true,
            })
            console.log('data add', this.state.data)
        }
    }

    async loadPrescriptionAdditionalData(prescriptionlist) {
        // this.setState({ loaded: false })
        let prescriptionlistId = prescriptionlist.map(data => data.source_id);
        var sw = await localStorageService.getItem('Selected_Warehouse')
        // let params = this.state.filterData
        // params.warehouse_id = sw.id
        
        let params = {

            id:prescriptionlistId,
            page:0,
            limit:20,
            no_druglist:true
           

        }
        let batch_res = await PrescriptionService.fetchPrescriptions(params)
        if (batch_res.status == 200) {
            this.setState({
                prescriptiondata: batch_res.data.view.data,
                //loaded: true,
            })
            console.log('data3', this.state.prescriptiondata)
        }
    }

    async loadExchangeIssuanceData(exchangeissuancelist) {
        // this.setState({ loaded: false })
        let exchangeissuanclistId = exchangeissuancelist.map(data => data.source_id);
        var sw = await localStorageService.getItem('Selected_Warehouse')
        // let params = this.state.filterData
        // params.warehouse_id = sw.id
        
        let params = {

            order_item_id:exchangeissuanclistId,
            page:0,
            limit:20,
            
           

        }
        let batch_res = await PharmacyOrderService.getOrderBatchItems(params)
        if (batch_res.status == 200) {
            this.setState({
              exchangeissuancedata: batch_res.data.view.data,
                //loaded: true,
            })
            console.log('exchange', this.state.exchangeissuancedata)
        }
    }

    async loadOrderData(orderlist) {
        // this.setState({ loaded: false })
        let orderlistId = orderlist.map(data => data.source_id);
        var sw = await localStorageService.getItem('Selected_Warehouse')
        // let params = this.state.filterData
        // params.warehouse_id = sw.id
        
        let params = {

            id:orderlistId,
            page:0,
            limit:20,
            
           

        }
        let batch_res = await PharmacyOrderService.getOrderBatchItems(params)
        if (batch_res.status == 200) {
            this.setState({

                orderdata: batch_res.data.view.data,
                //loaded: true,
            })
            console.log('orderdata', this.state.orderdata)
        }
    }

    async loadManualData(manuallist) {
        // this.setState({ loaded: false })
        let manuallistId = manuallist.map(data => data.source_id);
        var sw = await localStorageService.getItem('Selected_Warehouse')
        // let params = this.state.filterData
        // params.warehouse_id = sw.id
        
        let params = {

            id:manuallistId,
            page:0,
            limit:20,
            
           

        }
        let batch_res = await WarehouseServices.getDrugBalancing(params)
        if (batch_res.status == 200) {
            this.setState({

                manualdata: batch_res.data.view.data,
                //loaded: true,
            })
            console.log('manualdata', this.state.manualdata)
        }
    }

    async loadItemData(item_batch_id) {
        
       
        let batch_res = await InventoryService.fetchItemBatchById(item_batch_id)
        console.log("batchres",batch_res)
        if (batch_res.status == 200) {
            this.setState({

                itembatchdata: batch_res.data.view,
                //loaded: true,
            })

            console.log('itembatchdata', this.state.itembatchdata)
            
        }
    }


    componentDidMount(){
        const query = new URLSearchParams(this.props.location.search);
        const from = query.get('from')
        const to = query.get('to')
        const batch_id = query.get('batch_id')
        let filterData = this.state.filterData
        filterData.from = (dateParse(from))
        filterData.to = (dateParse(to))
        filterData.item_batch_id = batch_id 
        this.setState({ from: from , to:to , batch_id: batch_id})
        this.loadAdditionalData()
        this.loadItemData(batch_id)
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
                this.loadAdditionalData()
            }
        )
    }
    
    render() {
        return (
            <Fragment>
            <MainContainer>
                <LoonsCard>
                <CardTitle title="Detailed View" />
                <ValidatorForm>
              
                <div> 
                                                 <div className="w-full" >
                                           
                                               
                                                  <div className="p-2 m-2" style={{ border: '1px solid', borderColor: "#a5a4a4", width: '90%', borderRadius: '5px' }} >
                                                 
                                                 
                                                    <div className="flex" >
                                                      <h5 className="text-12 my-0">Item Name :</h5>
                                                         <p className="text-12 my-0 ml-2 ">{this.state.itembatchdata.ItemSnap?.medium_description}{"  "}</p>
                                            </div>
                                            
                                                
                                           
                                            <div className="flex" >
                                                <h5 className="text-12 my-0">Sr No :</h5>
                                                <p className="text-12 my-0 ml-2 ">{this.state.itembatchdata.ItemSnap?.sr_no}{"  "}</p>
                                            </div>
                                            
                                            
                                            
                                            <div className="flex" >
                                                <h5 className="text-12 my-0">Batch No. :</h5>
                                                <p className="text-12 my-0 ml-2 ">{this.state.itembatchdata.batch_no}{"  "}</p>
                                                   
                                            </div>
                                           
                                            
                                            

                                            
                                           
                                            <div className="flex" >
                                                <h5 className="text-12 my-0">Expiry Date :</h5>
                                                <p className="text-12 my-0 ml-2 ">{dateParse(this.state.itembatchdata.exd)}{"  "}</p>
                                                   
                                            </div>
                                           
                                            <td>
                                            <div className="flex" >
                                                <h5 className="text-12 my-0">From :</h5>
                                                <p className="text-12 my-0 ml-2 ">{dateParse(this.state.from)}{"  "}</p>
                                                   
                                            </div></td>
                                           
                                            <div className="flex" >
                                                <h5 className="text-12 my-0">To :</h5>
                                                <p className="text-12 my-0 ml-2 ">{dateParse(this.state.to)}</p>
                                                   
                                            </div>
                                           
                                        
                                        </div>
                                    </div></div>
                {this.state.loaded ? (
                    <Grid container>
                        <Grid className="" item xs={12}>
                            <LoonsTable
                                //title={"All Aptitute Tests"}

                                id={'patientsAdmission'}
                                // title={'Active Prescription'}
                                data={this.state.data}
                                columns={this.state.columns}
                                options={{
                                    pagination: true,
                                    serverSide: true,
                                    count: this.state.totalItems,
                                    // count: 10,
                                    // rowsPerPage: 5,
                                    rowsPerPage: 20,
                                    page: this.state.filterData.page,
                                    print: false,
                                    viewColumns: true,
                                    download: false,
                                    onRowClick: this.onRowClick,
                                    onTableChange: (action, tableState) => {
                                        console.log(action, tableState)
                                        switch (action) {
                                            case 'changePage':
                                                this.setPage(tableState.page)
                                                break
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
                    </Grid>
                ) : (
                    //load loading effect
                    <Grid className="justify-center text-center w-full pt-12">
                        <CircularProgress size={30} />
                    </Grid>
                )}
                    </ValidatorForm>
                    </LoonsCard>
                    </MainContainer>
                    </Fragment>
            
        )
    }
    
}

export default  DetailedView